<script setup>
// タスク進捗入力タブ
// ハイドアウトのレベル設定 + タスクリストの表示・管理

import { ref, computed } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useApiData } from '../composables/useApiData.js'
import { useOverlay } from '../composables/useOverlay.js'
import * as TaskLogic from '../logic/taskLogic.js'
import { TRADER_ORDER } from '../data/constants.js'

const { playerLevel, gameMode } = useAppState()

const { overlayEnabled } = useOverlay()

const {
  completedTasks,
  userHideout,
  prioritizedTasks,
  showCompleted,
  showFuture,
  showMaxedHideout,
  showKappaOnly,
  showLightkeeperOnly,
  toggleTask,
  togglePriority,
  taskStatuses,
  traderProgress,
  traderRequirementsEnabled,
} = useUserProgress()

const { taskData, hideoutData } = useApiData()

const emit = defineEmits(['open-task-details'])

// --- ローカル状態 ---
const taskSortMode = ref('default')
const taskViewMode = ref('list')
const searchTask = ref('')

const traderRequirementProfiles = computed(() => {
  const profiles = new Map()
  ;(taskData.value || []).forEach((task) => {
    ;(task.traderLevelRequirements || []).forEach((requirement) => {
      const trader = requirement.trader
      if (!trader?.id) return
      const current = profiles.get(trader.id) || {
        id: trader.id,
        name: trader.name || 'Unknown',
        needsReputation: false,
      }
      if (['reputation', 'standing'].includes(requirement.requirementType)) {
        current.needsReputation = true
      }
      profiles.set(trader.id, current)
    })
  })

  return Array.from(profiles.values()).sort((a, b) => {
    const indexA = TRADER_ORDER.indexOf(a.name)
    const indexB = TRADER_ORDER.indexOf(b.name)
    if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
})

function updateTraderProgress(traderId, field, rawValue) {
  const nextProgress = { ...traderProgress.value }
  const nextTrader = { ...(nextProgress[traderId] || {}) }
  const value = rawValue === '' ? null : Number(rawValue)

  if (value == null || !Number.isFinite(value)) delete nextTrader[field]
  else nextTrader[field] = value

  if (Object.keys(nextTrader).length === 0) delete nextProgress[traderId]
  else nextProgress[traderId] = nextTrader
  traderProgress.value = nextProgress
}

// --- ハイドアウト: 最大レベル済みステーションの表示制御 ---
const visibleHideoutStations = computed(() => {
  if (!hideoutData.value) return []
  if (showMaxedHideout.value) return hideoutData.value
  return hideoutData.value.filter((station) => {
    const currentLevel = userHideout.value[station.normalizedName] || 0
    const maxLevel = station.levels.length
    return currentLevel < maxLevel
  })
})

// --- タスク: フィルタリング ---
const filteredTasksList = computed(() => {
  return TaskLogic.filterActiveTasks(taskData.value, completedTasks.value, {
    playerLevel: playerLevel.value,
    searchQuery: searchTask.value,
    showCompleted: showCompleted.value,
    showFuture: showFuture.value,
    showKappaOnly: showKappaOnly.value,
    showLightkeeperOnly: showLightkeeperOnly.value,
    taskStatuses: taskStatuses.value,
    traderProgress: traderProgress.value,
    traderRequirementsEnabled: traderRequirementsEnabled.value,
  })
})

// --- タスク: トレーダー/マップグループ ---
const tasksByTrader = computed(() => TaskLogic.groupTasksByTrader(filteredTasksList.value))
const tasksByMap = computed(() => TaskLogic.groupTasksByMap(filteredTasksList.value))

// --- タスク: ロック判定 (前提タスク未完了 or レベル不足) ---
function isLocked(task) {
  return TaskLogic.evaluateTaskAvailability(task, completedTasks.value, {
    playerLevel: playerLevel.value, taskStatuses: taskStatuses.value,
    traderProgress: traderProgress.value, traderRequirementsEnabled: traderRequirementsEnabled.value,
  }).locked
}

// --- タスク: ソート ---
function getSortedTasks(tasks) {
  if (!tasks) return []
  const sorted = [...tasks]
  if (taskSortMode.value === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    // デフォルト: レベル順 → 名前順
    sorted.sort((a, b) => {
      if (a.minPlayerLevel !== b.minPlayerLevel) {
        return a.minPlayerLevel - b.minPlayerLevel
      }
      return a.name.localeCompare(b.name)
    })
  }
  if (taskSortMode.value === 'priority') {
    const priorities = new Set(prioritizedTasks.value)
    sorted.sort((a, b) => Number(priorities.has(b.id)) - Number(priorities.has(a.id)))
  }
  return sorted
}

// --- Intel Console: 表示対象・グループ・サマリ ---
const progressView = ref('tasks')

const taskGroups = computed(() => {
  const tasks = filteredTasksList.value
  if (taskViewMode.value === 'list') {
    return tasks.length ? [{ key: 'all', label: '', tasks: getSortedTasks(tasks) }] : []
  }
  const grouped = taskViewMode.value === 'trader' ? tasksByTrader.value : tasksByMap.value
  return Object.entries(grouped).map(([label, list]) => ({ key: label, label, tasks: getSortedTasks(list) }))
})

const totalCount = computed(() => (taskData.value || []).length)
const doneCount = computed(() => {
  const done = new Set(completedTasks.value)
  return (taskData.value || []).filter((task) => done.has(task.id)).length
})
const donePercent = computed(() => (totalCount.value ? Math.round((doneCount.value / totalCount.value) * 100) : 0))
const maxedStations = computed(() => (hideoutData.value || []).filter(
  (station) => (userHideout.value[station.normalizedName] || 0) >= station.levels.length,
).length)
const hideoutPercent = computed(() => {
  const total = (hideoutData.value || []).length
  return total ? Math.round((maxedStations.value / total) * 100) : 0
})
</script>

<template>
  <div class="progress-page">
    <div
      v-if="gameMode === 'pvp-season'"
      class="state-banner state-warn"
      role="status"
    >
      <span aria-hidden="true">⚠️</span>
      <div><strong>Seasonal PvP:</strong>
        通常PvPとは別の進捗として保存されます。新しいシーズン開始時は、このモードの進捗をリセットしてください。</div>
    </div>

    <!-- 上段: 表示切替 + 進捗サマリ + 必要品への入口 -->
    <div class="pg-toolbar">
      <div class="pg-switch" role="group" aria-label="表示対象">
        <button type="button" :aria-pressed="progressView === 'tasks'" @click="progressView = 'tasks'">タスク</button>
        <button type="button" :aria-pressed="progressView === 'hideout'" @click="progressView = 'hideout'">ハイドアウト</button>
      </div>
      <div class="pg-summary grow">
        <template v-if="progressView === 'tasks'">
          <span>完了 <b>{{ doneCount }}</b> / {{ totalCount }}</span>
          <span class="meter" role="img" :aria-label="`タスク完了率 ${donePercent}%`"><i :style="{ width: donePercent + '%' }"></i></span>
        </template>
        <template v-else>
          <span>レベルMAX <b>{{ maxedStations }}</b> / {{ (hideoutData || []).length }}</span>
          <span class="meter" role="img" :aria-label="`ハイドアウト完了率 ${hideoutPercent}%`"><i :style="{ width: hideoutPercent + '%' }"></i></span>
        </template>
      </div>
      <router-link class="btn btn-sm btn-outline-info to-result" :to="{ name: 'result' }">📦 必要品を見る</router-link>
    </div>

    <!-- ===== ハイドアウト ===== -->
    <template v-if="progressView === 'hideout'">
      <div class="pg-toolbar">
        <button
          type="button" class="chip" :aria-pressed="showMaxedHideout"
          @click="showMaxedHideout = !showMaxedHideout"
        >{{ showMaxedHideout ? '完了済みを隠す' : '完了済みを表示' }}</button>
      </div>
      <div class="hideout-grid">
        <div
          v-for="station in visibleHideoutStations" :key="station.normalizedName"
          class="hideout-card" :class="{ maxed: (userHideout[station.normalizedName] || 0) >= station.levels.length }"
        >
          <header>
            <b><label :for="`hideout-${station.normalizedName}`">{{ station.name }}</label></b>
            <span>Lv {{ userHideout[station.normalizedName] || 0 }}<small class="text-muted"> / {{ station.levels.length }}</small></span>
          </header>
          <input
            :id="`hideout-${station.normalizedName}`"
            type="range" class="form-range" min="0"
            :max="station.levels.length"
            :value="userHideout[station.normalizedName] ?? 0"
            @input="userHideout[station.normalizedName] = Number($event.target.value)"
          >
        </div>
      </div>
      <div v-if="visibleHideoutStations.length === 0" class="empty-state">
        <strong>全ての設備がレベルMAXです 🎉</strong>
        「完了済みを表示」で一覧を確認できます。
      </div>
    </template>

    <!-- ===== タスク ===== -->
    <template v-else>
      <div class="pg-toolbar">
        <input
          type="search" class="form-control grow" aria-label="タスクを検索"
          placeholder="タスク名・マップ・トレーダーで検索…"
          v-model="searchTask"
        >
        <div class="pg-switch" role="group" aria-label="グループ">
          <button type="button" :aria-pressed="taskViewMode === 'list'" @click="taskViewMode = 'list'">一覧</button>
          <button type="button" :aria-pressed="taskViewMode === 'trader'" @click="taskViewMode = 'trader'">トレーダー別</button>
          <button type="button" :aria-pressed="taskViewMode === 'map'" @click="taskViewMode = 'map'">マップ別</button>
        </div>
        <select class="form-select form-select-sm w-auto" aria-label="並び順" v-model="taskSortMode">
          <option value="default">レベル順</option>
          <option value="name">名前順</option>
          <option value="priority">優先を上位に</option>
        </select>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="chip" :aria-pressed="showCompleted" @click="showCompleted = !showCompleted">{{ showCompleted ? '履歴を閉じる' : '履歴' }}</button>
          <button type="button" class="chip" :aria-pressed="showKappaOnly" title="Kappa必須のみ" @click="showKappaOnly = !showKappaOnly">Kappa</button>
          <button type="button" class="chip" :aria-pressed="showLightkeeperOnly" title="Lightkeeper必須のみ" @click="showLightkeeperOnly = !showLightkeeperOnly">LK</button>
          <button v-if="!showCompleted" type="button" class="chip" :aria-pressed="showFuture" @click="showFuture = !showFuture">ロック中も表示</button>
        </div>
      </div>

      <details
        v-if="traderRequirementProfiles.length > 0"
        class="task-group"
      >
        <summary class="p-2 px-3 fw-bold" style="cursor: pointer; color: var(--gold);">
          トレーダー進捗条件
          <span
            class="badge ms-1"
            :class="traderRequirementsEnabled ? 'bg-success' : 'bg-secondary'"
          >{{ traderRequirementsEnabled ? '判定中' : '表示のみ' }}</span>
        </summary>

        <div class="p-3 border-top" style="border-color: var(--line) !important;">
          <div class="form-check form-switch mb-2">
            <input
              id="enable-trader-requirements"
              v-model="traderRequirementsEnabled"
              class="form-check-input"
              type="checkbox"
            >
            <label class="form-check-label small" for="enable-trader-requirements">
              入力したLL・評判をタスクのロック判定に使用する
            </label>
          </div>
          <p class="text-muted small mb-2">
            未入力の条件は未達として扱います。会話やゲーム内変数など、本ツールで判定できない条件はタスク詳細で確認してください。
          </p>

          <div class="row g-2">
            <div
              v-for="trader in traderRequirementProfiles"
              :key="trader.id"
              class="col-12 col-sm-6 col-xl-4"
            >
              <div class="hideout-card h-100">
                <div class="small fw-bold mb-1">{{ trader.name }}</div>
                <div class="d-flex align-items-center gap-2">
                  <label class="small text-muted" :for="`trader-level-${trader.id}`">LL</label>
                  <select
                    :id="`trader-level-${trader.id}`"
                    class="form-select form-select-sm"
                    :value="traderProgress[trader.id]?.level ?? ''"
                    @change="updateTraderProgress(trader.id, 'level', $event.target.value)"
                  >
                    <option value="">未設定</option>
                    <option v-for="level in 4" :key="level" :value="level">{{ level }}</option>
                  </select>
                </div>
                <div v-if="trader.needsReputation" class="d-flex align-items-center gap-2 mt-2">
                  <label class="small text-muted" :for="`trader-reputation-${trader.id}`">評判</label>
                  <input
                    :id="`trader-reputation-${trader.id}`"
                    class="form-control form-control-sm"
                    type="number"
                    step="0.01"
                    placeholder="未設定"
                    :value="traderProgress[trader.id]?.reputation ?? ''"
                    @input="updateTraderProgress(trader.id, 'reputation', $event.target.value)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>

      <div v-if="!taskData || taskData.length === 0" class="empty-state">
        <strong>タスクデータがありません</strong>
        上部の「更新」でデータを取得してください。
      </div>

      <template v-else>
        <section
          v-for="group in taskGroups" :key="group.key"
          class="task-group"
          :aria-label="group.label || 'タスク一覧'"
        >
          <h3 v-if="group.label">{{ group.label }} <small>{{ group.tasks.length }}</small></h3>
          <div
            v-for="task in group.tasks" :key="task.id"
            class="task-row" :class="{ locked: isLocked(task) }"
          >
            <label class="check-wrap">
              <input
                class="form-check-input check"
                type="checkbox"
                :aria-label="`${task.name} を完了にする`"
                :checked="completedTasks.includes(task.id)"
                @change="toggleTask(task.id)"
              >
            </label>
            <button
              type="button"
              class="chip px-2"
              :aria-pressed="prioritizedTasks.includes(task.id)"
              :aria-label="`${task.name} の優先設定`"
              :title="overlayEnabled ? '優先設定・配信オーバーレイ表示' : '優先設定'"
              @click="togglePriority(task.id)"
            >{{ prioritizedTasks.includes(task.id) ? '★' : '☆' }}</button>
            <div class="task-main">
              <button type="button"
                class="task-title task-name-link"
                :class="{
                  'is-done': showCompleted,
                  'is-priority': !showCompleted && prioritizedTasks.includes(task.id),
                }"
                @click="emit('open-task-details', task)"
              >
                <span v-if="isLocked(task)" aria-hidden="true">🔒 </span>{{ task.name }}
              </button>
              <div class="task-meta">
                <span v-if="taskStatuses[task.id] === 'active'" class="badge bg-info text-dark">進行中</span>
                <span v-if="taskStatuses[task.id] === 'failed'" class="badge bg-danger">失敗</span>
                <span v-if="task.kappaRequired" class="badge badge-kappa">KAPPA</span>
                <span v-if="task.lightkeeperRequired" class="badge badge-lk">LK</span>
                <span v-if="isLocked(task)" class="text-warning">ロック中</span>
                <span v-if="task.minPlayerLevel > 1">Lv.{{ task.minPlayerLevel }}</span>
                <span v-if="task.mapLabel && taskViewMode !== 'map'">{{ task.mapLabel }}</span>
                <span v-if="taskViewMode !== 'trader'" class="d-lg-none">{{ task.trader?.name || 'Unknown' }}</span>
              </div>
            </div>
            <span v-if="taskViewMode !== 'trader'" class="task-trader">{{ task.trader?.name || 'Unknown' }}</span>
            <button type="button" class="icon-btn" :aria-label="`${task.name} の詳細を開く`" @click="emit('open-task-details', task)">›</button>
          </div>
        </section>

        <div v-if="taskGroups.length === 0" class="empty-state">
          <strong>表示するタスクがありません</strong>
          検索語や絞込を解除するか、「ロック中も表示」を試してください。
        </div>
      </template>
    </template>
  </div>
</template>
