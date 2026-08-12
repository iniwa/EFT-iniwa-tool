<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Composables
import { useAppState } from './composables/useAppState.js'
import { useUserProgress } from './composables/useUserProgress.js'
import { useApiData } from './composables/useApiData.js'
import { useImportExport } from './composables/useImportExport.js'
import { useOverlay } from './composables/useOverlay.js'

// Components
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import AppNotice from './components/AppNotice.vue'
import ToastNotify from './components/ui/ToastNotify.vue'
import TaskModal from './components/TaskModal.vue'
import { resolveTaskReference } from './logic/taskReference.js'
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

function openTaskDetails(task) {
    selectedTask.value = task
    showTaskModal.value = true
}

function closeTaskModal() {
    showTaskModal.value = false
    selectedTask.value = null
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
    <div class="container-fluid py-4">
        <div v-if="loadError" class="alert alert-danger text-center">{{ loadError }}</div>
        <div v-if="dataWarning" class="alert alert-warning text-center">{{ dataWarning }}</div>

        <AppHeader
            :last-updated="lastUpdated"
            :is-loading="isLoading"
            :player-level="playerLevel"
            :game-mode="gameMode"
            :api-lang="apiLang"
            :app-version="APP_VERSION"
            @fetch-data="handleFetchData"
            @update:player-level="playerLevel = $event"
            @update:game-mode="gameMode = $event"
            @update:api-lang="apiLang = $event"
            @export-data="exportData"
            @trigger-import="triggerImport"
        />

        <!-- 非表示のファイル入力 -->
        <input
            ref="fileInput"
            type="file"
            accept=".json"
            style="display: none;"
            @change="handleFileImport"
        >

        <!-- タブナビゲーション -->
        <ul class="nav nav-tabs mb-3" role="tablist">
            <li
                v-for="tab in visibleTabs"
                :key="tab.name"
                class="nav-item"
                role="presentation"
            >
                <router-link
                    class="nav-link"
                    :class="[{ active: route.name === tab.name }, tab.meta.cssClass]"
                    :to="{ name: tab.name }"
                    role="tab"
                    :aria-selected="route.name === tab.name"
                >{{ tab.meta.label }}</router-link>
            </li>
        </ul>

        <!-- ルートビュー（既存コンポーネントの emit をここで吸収） -->
        <router-view v-slot="{ Component }">
            <component
                :is="Component"
                @open-task-details="openTaskDetails"
                @open-task-from-name="openTaskFromName"
            />
        </router-view>

        <!-- タスク詳細モーダル -->
        <TaskModal
            :task="selectedTask"
            :show="showTaskModal"
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
        <div v-if="taskReferenceMessage" class="alert alert-warning mt-3" role="status">
            {{ taskReferenceMessage }}
            <button class="btn btn-sm btn-outline-warning ms-2" @click="taskReferenceMessage = ''">閉じる</button>
        </div>

        <!-- 更新通知 -->
        <AppNotice ref="noticeRef" />

        <!-- Toast通知 -->
        <ToastNotify />

        <AppFooter
            :app-version="APP_VERSION"
            @show-notice="noticeRef?.show()"
        />
    </div>
</template>
