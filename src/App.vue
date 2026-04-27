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
    lastUpdated, fetchData, initFromCache,
} = useApiData()

const { exportData, importData } = useImportExport()
const { overlayEnabled } = useOverlay()

// タスク詳細モーダル
const selectedTask = ref(null)
const showTaskModal = ref(false)

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
function openTaskFromName(taskName) {
    if (!taskData.value) return
    const task = taskData.value.find(t => t.name === taskName)
    if (task) {
        openTaskDetails(task)
    }
}

function triggerImport() {
    fileInput.value?.click()
}

async function handleFileImport(event) {
    const file = event.target.files?.[0]
    if (!file) return
    await importData(file)
    event.target.value = ''
}

// gameMode / apiLang 変更時にデータを再取得
watch([gameMode, apiLang], () => {
    fetchData(gameMode.value, apiLang.value, true, isLoading, loadError)
})

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

onMounted(async () => {
    const shouldFetch = await initFromCache()
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
</script>

<template>
    <div class="container-fluid py-4">
        <div v-if="loadError" class="alert alert-danger text-center">{{ loadError }}</div>

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

        <!-- 更新通知 -->
        <AppNotice ref="noticeRef" :app-version="APP_VERSION" />

        <!-- Toast通知 -->
        <ToastNotify />

        <AppFooter
            :app-version="APP_VERSION"
            @show-notice="noticeRef?.show()"
        />
    </div>
</template>
