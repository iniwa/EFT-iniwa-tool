<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

// Composables
import { useAppState } from './composables/useAppState.js'
import { useUserProgress } from './composables/useUserProgress.js'
import { useApiData } from './composables/useApiData.js'
import { useShoppingList } from './composables/useShoppingList.js'
import { useImportExport } from './composables/useImportExport.js'

// Components
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import AppNotice from './components/AppNotice.vue'
import ToastNotify from './components/ui/ToastNotify.vue'
import TaskInput from './components/TaskInput.vue'
import TaskModal from './components/TaskModal.vue'
import ResultList from './components/ResultList.vue'
import KeyManager from './components/KeyManager.vue'
import AmmoChart from './components/AmmoChart.vue'
import ItemSearch from './components/ItemSearch.vue'
import FlowchartView from './components/FlowchartView.vue'
import MemoView from './components/MemoView.vue'
import StoryPlaceholder from './components/StoryPlaceholder.vue'
import DebugView from './components/DebugView.vue'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const {
    currentTab, isLoading, loadError,
    gameMode, apiLang, playerLevel, APP_VERSION,
} = useAppState()

const {
    completedTasks, showStoryTab, flowchartTrader,
    migrateFromV2, normalizeHideoutKeys,
} = useUserProgress()

const {
    taskData, hideoutData, itemsData, ammoData,
    lastUpdated, fetchData, initFromCache,
} = useApiData()

const { shoppingList } = useShoppingList()
const { exportData, importData } = useImportExport()

// タスク詳細モーダル
const selectedTask = ref(null)
const showTaskModal = ref(false)

// ファイルインポート用 hidden input
const fileInput = ref(null)

// Toast / Notice refs
const toastRef = ref(null)
const noticeRef = ref(null)

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const tabs = [
    { id: 'input', label: '📝 進捗入力' },
    { id: 'result', label: '📦 必要なアイテム' },
    { id: 'keys', label: '🔑 鍵管理' },
    { id: 'flowchart', label: '🗺️ フローチャート' },
    { id: 'story', label: '📖 ストーリー', requiresFlag: 'showStoryTab' },
    { id: 'ammo', label: '🔫 弾薬' },
    { id: 'search', label: '🔍 アイテム検索' },
    { id: 'memo', label: '📋 メモ' },
    { id: 'debug', label: 'デバッグ', cssClass: 'text-secondary' },
]

function isTabVisible(tab) {
    if (tab.requiresFlag === 'showStoryTab') return showStoryTab.value
    return true
}

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
                v-for="tab in tabs"
                v-show="isTabVisible(tab)"
                :key="tab.id"
                class="nav-item"
                role="presentation"
            >
                <a
                    class="nav-link"
                    :class="[{ active: currentTab === tab.id }, tab.cssClass]"
                    href="#"
                    role="tab"
                    :aria-selected="currentTab === tab.id"
                    @click.prevent="currentTab = tab.id"
                >{{ tab.label }}</a>
            </li>
        </ul>

        <!-- タブコンテンツ -->
        <div v-if="currentTab === 'input'">
            <TaskInput @open-task-details="openTaskDetails" />
        </div>

        <div v-if="currentTab === 'result'">
            <ResultList @open-task-from-name="openTaskFromName" />
        </div>

        <div v-if="currentTab === 'keys'">
            <KeyManager @open-task-from-name="openTaskFromName" />
        </div>

        <div v-if="currentTab === 'flowchart'">
            <FlowchartView @open-task-details="openTaskDetails" />
        </div>

        <div v-if="currentTab === 'story'">
            <StoryPlaceholder />
        </div>

        <div v-if="currentTab === 'ammo'">
            <AmmoChart @open-task-from-name="openTaskFromName" />
        </div>

        <div v-if="currentTab === 'search'">
            <ItemSearch @open-task-from-name="openTaskFromName" />
        </div>

        <div v-if="currentTab === 'memo'">
            <MemoView @open-task-from-name="openTaskFromName" />
        </div>

        <div v-if="currentTab === 'debug'">
            <DebugView />
        </div>

        <!-- タスク詳細モーダル -->
        <TaskModal
            :task="selectedTask"
            :show="showTaskModal"
            @close="closeTaskModal"
        />

        <!-- 更新通知 -->
        <AppNotice ref="noticeRef" :app-version="APP_VERSION" />

        <!-- Toast通知 -->
        <ToastNotify ref="toastRef" />

        <AppFooter
            :app-version="APP_VERSION"
            @show-notice="noticeRef?.show()"
        />
    </div>
</template>
