<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Composables
import { useAppState } from './composables/useAppState.js'
import { useUserProgress } from './composables/useUserProgress.js'
import { useApiData } from './composables/useApiData.js'
import { useImportExport } from './composables/useImportExport.js'
import { useOverlay } from './composables/useOverlay.js'

// Components
import './assets/console.css'
import AppHeader from './components/AppHeader.vue'
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'
import AppNotice from './components/AppNotice.vue'
import ToastNotify from './components/ui/ToastNotify.vue'
import TaskModal from './components/TaskModal.vue'
import { resolveTaskReference } from './logic/taskReference.js'
import { useTaskFlowchartNavigation } from './composables/useTaskFlowchartNavigation.js'
import BaseModal from './components/ui/BaseModal.vue'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const route = useRoute()
const router = useRouter()

const {
    isLoading, loadError,
    gameMode, apiLang, playerLevel, APP_VERSION,
} = useAppState()

const {
    showStoryTab,
    migrateFromV2, normalizeHideoutKeys,
} = useUserProgress()

const {
    taskData, hideoutData,
    lastUpdated, dataWarning, fetchData, initFromCache,
} = useApiData()

const { exportData, importData } = useImportExport()
const { overlayEnabled } = useOverlay()

// タスク詳細モーダル
const selectedTask = ref(null)
const showTaskModal = ref(false)
const taskReferenceChoices = ref([])
const taskReferenceMessage = ref('')

// ファイルインポート用 hidden input
const fileInput = ref(null)

// Toast / Notice refs
const noticeRef = ref(null)

// ---------------------------------------------------------------------------
// Tabs (router 経由で表示)
// ---------------------------------------------------------------------------

const visibleTabs = computed(() => {
    return router.options.routes
        .filter((r) => r.meta?.tab)
        .filter((r) => {
            if (r.meta.requiresFlag === 'showStoryTab') return showStoryTab.value
            if (r.meta.requiresFlag === 'overlayEnabled') return overlayEnabled.value
            return true
        })
})

const GROUPS = [
    { key: 'work', label: '作業' },
    { key: 'tools', label: '道具' },
    { key: 'info', label: 'ガイド / 設定' },
]
const FALLBACK_ICON = { guide: '📘', faq: '❓', about: 'ℹ️', debug: '🛠️' }
const CONDITION_NOTE = {
    showStoryTab: '設定でストーリータブを有効にしている間だけ表示されます',
    overlayEnabled: '配信オーバーレイを有効にしている間だけ表示されます',
}

function toNavItem(r) {
    const label = r.meta.label || r.meta.title
    const m = /^(\S+)\s+(.+)$/u.exec(label)
    const hasIcon = m && /[^\x00-\x7f]/.test(m[1])
    return {
        name: r.name,
        icon: hasIcon ? m[1] : (FALLBACK_ICON[r.name] || '•'),
        text: hasIcon ? m[2] : label,
        cssClass: r.meta.cssClass,
        conditional: r.meta.requiresFlag ? CONDITION_NOTE[r.meta.requiresFlag] : '',
    }
}

const navGroups = computed(() => {
    const visible = new Set(visibleTabs.value.map(t => t.name))
    return GROUPS.map(g => ({
        ...g,
        items: router.options.routes
            .filter(r => r.meta?.group === g.key && (!r.meta.tab || visible.has(r.name)))
            .map(toNavItem),
    })).filter(g => g.items.length)
})

const MOBILE_TABS = ['input', 'result', 'keys', 'search']
const TAB_SHORT = { input: '入力', result: '必要品', keys: '鍵', search: '検索' }
const mobileTabs = computed(() => MOBILE_TABS
    .map(name => router.options.routes.find(r => r.name === name))
    .filter(Boolean).map(r => ({ ...toNavItem(r), short: TAB_SHORT[r.name] })))
const moreActive = computed(() => !MOBILE_TABS.includes(route.name))

const railCollapsed = ref(false)
const drawerOpen = ref(false)
const drawerEl = ref(null)
let drawerOpener = null
function openDrawer() {
    drawerOpener = document.activeElement
    drawerOpen.value = true
    nextTick(() => drawerEl.value?.querySelector('a, button')?.focus())
}
function closeDrawer() {
    if (!drawerOpen.value) return
    drawerOpen.value = false
    drawerOpener?.focus?.()
}
function onDrawerKey(e) {
    if (e.key === 'Escape') closeDrawer()
}

const currentGroupLabel = computed(() => GROUPS.find(g => g.key === route.meta?.group)?.label || '')
const currentTitle = computed(() => route.meta?.title || '')

// ルートが非表示タブを指していたらトップへ戻す
watch([visibleTabs, () => route.name], ([list, name]) => {
    const current = router.options.routes.find((r) => r.name === name)
    if (!current?.meta?.tab) return
    if (!list.some((t) => t.name === name)) {
        router.replace({ name: 'input' })
    }
})

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

function handleFetchData() {
    fetchData(gameMode.value, apiLang.value, true, isLoading, loadError)
}

let taskDetailOpener = null
let detailPushed = false
const detailId = computed(() => (typeof route.query.detail === 'string' ? route.query.detail : ''))

function openTaskDetails(task) {
    taskDetailOpener = document.activeElement
    selectedTask.value = task
    showTaskModal.value = true
    if (task?.id && detailId.value !== task.id) {
        detailPushed = true
        router.push({ query: { ...route.query, detail: task.id } })
    }
}

// 直リンク / Back / Forward で詳細パネルを URL と同期する
watch([detailId, () => taskData.value], ([id]) => {
    if (!id) {
        if (showTaskModal.value) { showTaskModal.value = false; selectedTask.value = null }
        return
    }
    if (selectedTask.value?.id === id) { showTaskModal.value = true; return }
    const task = taskData.value?.find(t => t.id === id)
    if (task) { selectedTask.value = task; showTaskModal.value = true }
}, { immediate: true })

const { showFlowchart } = useTaskFlowchartNavigation({ route, router, taskData,
    openDetails: openTaskDetails, closeDetails: closeTaskPanelSilently, getOpener: () => taskDetailOpener,
})

// フローチャートへ移る時用: URL は触らず表示だけ閉じる (Back で復元される)
function closeTaskPanelSilently() {
    showTaskModal.value = false
    selectedTask.value = null
}

function closeTaskModal() {
    closeTaskPanelSilently()
    if (!detailId.value) return
    if (detailPushed && window.history.state?.back) {
        detailPushed = false
        router.back()
    } else {
        detailPushed = false
        const { detail, ...rest } = route.query
        router.replace({ query: rest })
    }
}

/** タスク名からタスクオブジェクトを探してモーダルを開く */
function openTaskFromName(reference) {
    if (isLoading.value) {
        taskReferenceMessage.value = 'タスクデータを読み込み中のため、参照を開けません。'
        return
    }
    if (!taskData.value?.length) {
        taskReferenceMessage.value = loadError.value
            ? 'タスクデータを取得できていないため、参照を開けません。'
            : 'タスクデータがまだありません。データ更新後に再試行してください。'
        return
    }
    const result = resolveTaskReference(reference, taskData.value)
    taskReferenceChoices.value = []
    taskReferenceMessage.value = ''
    if (result.status === 'resolved') openTaskDetails(result.task)
    else if (result.status === 'ambiguous') taskReferenceChoices.value = result.matches
    else taskReferenceMessage.value = '参照されたタスクは現在のデータに見つかりません。'
}

function triggerImport() {
    fileInput.value?.click()
}

async function handleFileImport(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try { await importData(file) } catch (error) { console.error('Import failed:', error) } finally { event.target.value = '' }
}

// gameMode / apiLang 変更時にデータを再取得
// (force=false: 切り替え先のコンテキストにキャッシュがあればそれを表示しつつ、
//  5分間のクールダウンはコンテキストごとに独立して適用される)
watch([gameMode, apiLang], async () => {
    // initFromCache invalidates the old request; release its visual loading/error
    // state immediately while the selected context is restored.
    isLoading.value = false
    loadError.value = null
    const shouldFetch = await initFromCache(gameMode.value, apiLang.value)
    if (shouldFetch) {
        await fetchData(gameMode.value, apiLang.value, false, isLoading, loadError)
    }
})

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

onMounted(async () => {
    const shouldFetch = await initFromCache(gameMode.value, apiLang.value)
    if (shouldFetch) {
        await fetchData(gameMode.value, apiLang.value, false, isLoading, loadError)
    }
    // v2 → v3 マイグレーション（タスク名→ID変換）
    if (taskData.value && taskData.value.length > 0) {
        migrateFromV2(taskData.value)
    }
    // ハイドアウトキーの正規化（ローカライズ名 → normalizedName）
    if (hideoutData.value && hideoutData.value.length > 0) {
        normalizeHideoutKeys(hideoutData.value)
    }
})

// hideoutDataが更新されるたびにキー正規化を再実行（言語切替・データ更新対応）
watch(hideoutData, (stations) => {
    if (stations && stations.length > 0) {
        normalizeHideoutKeys(stations)
    }
})

// A cache miss on first mount can leave v2 names unresolved. Retry whenever
// the current API context supplies tasks (including a language switch).
watch(taskData, (tasks) => {
    if (tasks && tasks.length > 0) migrateFromV2(tasks)
})
</script>

<template>
    <div class="app-shell" :class="{ 'rail-collapsed': railCollapsed }" :data-mode="gameMode">
        <a class="skip-link" href="#main-content">メインコンテンツへ移動</a>

        <AppHeader
            :last-updated="lastUpdated"
            :is-loading="isLoading"
            :player-level="playerLevel"
            :game-mode="gameMode"
            :api-lang="apiLang"
            :app-version="APP_VERSION"
            :rail-collapsed="railCollapsed"
            @fetch-data="handleFetchData"
            @update:player-level="playerLevel = $event"
            @update:game-mode="gameMode = $event"
            @update:api-lang="apiLang = $event"
            @export-data="exportData"
            @trigger-import="triggerImport"
            @toggle-rail="railCollapsed = !railCollapsed"
            @open-drawer="openDrawer"
        />

        <!-- 非表示のファイル入力 -->
        <input
            ref="fileInput"
            type="file"
            accept=".json"
            style="display: none;"
            @change="handleFileImport"
        >

        <!-- PC: 左レール -->
        <aside class="rail d-none d-lg-block" aria-label="サイドメニュー">
            <AppNav :groups="navGroups" :collapsed="railCollapsed" />
        </aside>

        <!-- スマホ: ドロワー -->
        <div v-if="drawerOpen" class="drawer-scrim d-lg-none" @click="closeDrawer"></div>
        <aside
            v-if="drawerOpen" ref="drawerEl"
            class="drawer d-lg-none" role="dialog" aria-modal="true" aria-label="メニュー"
            @keydown="onDrawerKey"
        >
            <div class="drawer-head">
                <strong>メニュー</strong>
                <button type="button" class="icon-btn" aria-label="メニューを閉じる" @click="closeDrawer">✕</button>
            </div>
            <AppNav :groups="navGroups" @navigate="closeDrawer" />
        </aside>

        <main id="main-content" class="app-main" tabindex="-1">
            <div v-if="loadError" class="state-banner state-error" role="alert">
                <span aria-hidden="true">⛔</span>
                <div><strong>データを取得できませんでした</strong><p>{{ loadError }}</p></div>
                <button type="button" class="btn btn-sm btn-outline-warning" :disabled="isLoading" @click="handleFetchData">再取得</button>
            </div>
            <div v-if="dataWarning" class="state-banner state-warn" role="status">
                <span aria-hidden="true">⚠️</span>
                <div><p>{{ dataWarning }}</p></div>
            </div>
            <div v-if="isLoading && !taskData?.length" class="state-banner state-loading" role="status">
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <div><p>タスクデータを読み込み中です…</p></div>
            </div>

            <nav v-if="currentTitle && route.name !== 'input'" class="crumb" aria-label="現在地">
                <router-link to="/">進捗入力</router-link>
                <template v-if="currentGroupLabel"><span aria-hidden="true">/</span><span>{{ currentGroupLabel }}</span></template>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{{ currentTitle }}</span>
            </nav>

            <!-- ルートビュー（既存コンポーネントの emit をここで吸収） -->
            <router-view v-slot="{ Component }">
              <KeepAlive include="TaskInput">
                <component
                    :is="Component"
                    :class="`view-${String(route.name)}`"
                    @open-task-details="openTaskDetails"
                    @open-task-from-name="openTaskFromName"
                />
              </KeepAlive>
            </router-view>

            <AppFooter
                :app-version="APP_VERSION"
                @show-notice="noticeRef?.show()"
            />
        </main>

        <!-- スマホ: 下タブ -->
        <nav class="tabbar d-lg-none" aria-label="主要タブ">
            <router-link
                v-for="tab in mobileTabs" :key="tab.name"
                :to="{ name: tab.name }" class="tabbar-item"
                :class="{ active: route.name === tab.name }"
                :aria-current="route.name === tab.name ? 'page' : undefined"
            >
                <span class="tab-ico" aria-hidden="true">{{ tab.icon }}</span>
                <span class="tab-text">{{ tab.short }}</span>
            </router-link>
            <button
                type="button" class="tabbar-item" :class="{ active: moreActive }"
                aria-haspopup="dialog" :aria-expanded="drawerOpen" @click="openDrawer"
            >
                <span class="tab-ico" aria-hidden="true">☰</span>
                <span class="tab-text">その他</span>
            </button>
        </nav>

        <!-- タスク詳細: PC=右パネル / スマホ=ボトムシート -->
        <TaskModal
            :task="selectedTask"
            :show="showTaskModal"
            :can-show-flowchart="true"
            @show-flowchart="showFlowchart"
            @close="closeTaskModal"
        />
        <BaseModal :show="taskReferenceChoices.length > 0" aria-label="同名タスクを選択" @close="taskReferenceChoices = []">
            <template v-if="taskReferenceChoices.length">
                <h2 class="h5">同名のタスクを選択してください</h2>
                <p class="small text-muted">この参照だけでは一意に特定できません。</p>
                <div class="vstack gap-2">
                    <button v-for="task in taskReferenceChoices" :key="task.id" class="btn btn-outline-info text-start" @click="openTaskDetails(task); taskReferenceChoices = []">{{ task.name }} — {{ task.trader?.name || 'Unknown' }} ({{ task.id.slice(-8) }})</button>
                </div>
                <button class="btn btn-secondary btn-sm mt-3" @click="taskReferenceChoices = []">閉じる</button>
            </template>
        </BaseModal>
        <div v-if="taskReferenceMessage" class="state-banner state-warn ref-message" role="status">
            <div><p>{{ taskReferenceMessage }}</p></div>
            <button class="btn btn-sm btn-outline-warning" @click="taskReferenceMessage = ''">閉じる</button>
        </div>

        <!-- 更新通知 -->
        <AppNotice ref="noticeRef" />

        <!-- Toast通知 -->
        <ToastNotify />
    </div>
</template>
