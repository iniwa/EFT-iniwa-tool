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

const { focusedTaskIds, toggleFocusedTask, overlayEnabled } = useOverlay()

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
  return sorted
}
</script>

<template>
  <div class="row">
    <!-- 左カラム: ハイドアウト -->
    <div class="col-md-4 mb-3">
      <div class="card h-100">
        <div class="card-header py-2">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span>🏠 ハイドアウト</span>
          </div>
          <div class="d-grid">
            <button
              class="btn btn-sm"
              :class="showMaxedHideout ? 'btn-warning' : 'btn-outline-secondary'"
              @click="showMaxedHideout = !showMaxedHideout"
            >
              {{ showMaxedHideout ? '完了済みを隠す' : '完了済みを表示' }}
            </button>
          </div>
        </div>

        <div class="card-body overflow-auto" style="max-height: 70vh;">
          <div v-for="station in visibleHideoutStations" :key="station.normalizedName" class="mb-3">
            <label class="form-label d-flex justify-content-between small mb-1">
              <span>{{ station.name }}</span>
              <span class="text-warning">
                Lv {{ userHideout[station.normalizedName] || 0 }}
                <span class="text-muted" style="font-size: 0.8em;">/ {{ station.levels.length }}</span>
              </span>
            </label>
            <input
              type="range"
              class="form-range"
              min="0"
              :max="station.levels.length"
              :value="userHideout[station.normalizedName] ?? 0"
              @input="userHideout[station.normalizedName] = Number($event.target.value)"
            >
          </div>

          <div v-if="visibleHideoutStations.length === 0" class="text-center text-muted small py-4">
            全ての設備がレベルMAXです 🎉
          </div>
        </div>
      </div>
    </div>

    <!-- 右カラム: タスクリスト -->
    <div class="col-md-8 mb-3">
      <div class="card h-100">
        <!-- ヘッダー: フィルタ群 -->
        <div class="card-header d-flex justify-content-between align-items-center py-2 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="d-none d-sm-inline">{{ showCompleted ? '✅ 完了済み' : '📜 受注可能タスク' }}</span>

            <div class="btn-group btn-group-sm">
              <button
                class="btn"
                :class="showCompleted ? 'btn-warning' : 'btn-outline-secondary'"
                @click="showCompleted = !showCompleted"
              >
                {{ showCompleted ? '戻る' : '履歴' }}
              </button>
              <button
                class="btn"
                :class="showKappaOnly ? 'btn-warning text-dark' : 'btn-outline-secondary'"
                @click="showKappaOnly = !showKappaOnly"
                title="Kappa必須のみ"
              >
                Kappa
              </button>
              <button
                class="btn"
                :class="showLightkeeperOnly ? 'btn-info text-dark' : 'btn-outline-secondary'"
                @click="showLightkeeperOnly = !showLightkeeperOnly"
                title="Lightkeeper必須のみ"
              >
                LK
              </button>
            </div>

            <div v-if="!showCompleted" class="form-check form-switch ms-1">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="showFuture"
              >
              <label class="form-check-label small text-muted">ロック中も表示</label>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <select
              class="form-select form-select-sm bg-dark text-white border-secondary py-0"
              style="width: auto; height: 31px;"
              v-model="taskSortMode"
            >
              <option value="default">Default</option>
              <option value="name">Name</option>
            </select>

            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-outline-warning"
                :class="{ active: taskViewMode === 'list' }"
                @click="taskViewMode = 'list'"
              >List</button>
              <button
                class="btn btn-outline-warning"
                :class="{ active: taskViewMode === 'trader' }"
                @click="taskViewMode = 'trader'"
              >Trader</button>
              <button
                class="btn btn-outline-warning"
                :class="{ active: taskViewMode === 'map' }"
                @click="taskViewMode = 'map'"
              >Map</button>
            </div>
          </div>
        </div>

        <!-- タスクリスト本体 -->
        <div class="card-body overflow-auto" style="max-height: 70vh;">
          <div
            v-if="gameMode === 'pvp-season'"
            class="alert alert-warning py-2 px-3 small"
            role="status"
          >
            <strong>Seasonal PvP:</strong>
            通常PvPとは別の進捗として保存されます。新しいシーズン開始時は、このモードの進捗をリセットしてください。
          </div>

          <details
            v-if="traderRequirementProfiles.length > 0"
            class="border border-secondary rounded bg-dark bg-opacity-25 p-2 mb-3"
          >
            <summary class="text-warning small fw-bold" style="cursor: pointer;">
              トレーダー進捗条件
              <span
                class="badge ms-1"
                :class="traderRequirementsEnabled ? 'bg-success' : 'bg-secondary'"
              >{{ traderRequirementsEnabled ? '判定中' : '表示のみ' }}</span>
            </summary>

            <div class="pt-2">
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
                  <div class="border border-secondary rounded p-2 h-100">
                    <div class="small fw-bold mb-1">{{ trader.name }}</div>
                    <div class="d-flex align-items-center gap-2">
                      <label class="small text-muted" :for="`trader-level-${trader.id}`">LL</label>
                      <select
                        :id="`trader-level-${trader.id}`"
                        class="form-select form-select-sm bg-dark text-white border-secondary"
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
                        class="form-control form-control-sm bg-dark text-white border-secondary"
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

          <input
            type="text"
            class="form-control mb-3"
            placeholder="タスク名・マップ・トレーダーで検索..."
            v-model="searchTask"
          >

          <!-- リスト表示 -->
          <div v-if="taskViewMode === 'list'" class="list-group">
            <div
              v-for="task in getSortedTasks(filteredTasksList)"
              :key="task.id"
              class="list-group-item d-flex align-items-center gap-3"
              :class="{ 'bg-secondary bg-opacity-25': isLocked(task) }"
            >
              <input
                class="form-check-input flex-shrink-0 m-0"
                type="checkbox"
                :checked="completedTasks.includes(task.id)"
                @change="toggleTask(task.id)"
                style="cursor: pointer;"
              >
              <button
                v-if="overlayEnabled"
                class="btn btn-sm py-0 px-2 flex-shrink-0"
                :class="focusedTaskIds.includes(task.id) ? 'btn-info' : 'btn-outline-secondary'"
                @click.stop="toggleFocusedTask(task.id)"
                :title="focusedTaskIds.includes(task.id) ? '配信オーバーレイから外す' : '配信オーバーレイに表示'"
                style="font-size: 0.85em;"
              >📌</button>
              <div
                class="w-100 d-flex justify-content-between align-items-center"
                :class="{ 'opacity-50': isLocked(task) }"
              >
                <button type="button"
                  class="task-name-link text-start"
                  style="background: none; border: 0; padding: 0; font: inherit"
                  :class="{
                    'text-decoration-line-through text-muted': showCompleted,
                    'text-info fw-bold': !showCompleted && prioritizedTasks.includes(task.id),
                  }"
                  @click="emit('open-task-details', task)"
                >
                  <span v-if="isLocked(task)" class="me-1">🔒</span>
                   {{ task.name }}
                  <span v-if="taskStatuses[task.id] === 'active'" class="badge bg-info text-dark ms-1">進行中</span>
                  <span v-if="taskStatuses[task.id] === 'failed'" class="badge bg-danger ms-1">失敗</span>
                  <span v-if="task.kappaRequired" class="badge badge-kappa ms-1">KAPPA</span>
                  <span v-if="task.lightkeeperRequired" class="badge badge-lk ms-1">LK</span>
                  <span v-if="task.mapLabel" class="badge bg-dark border border-secondary text-secondary ms-2 small">{{ task.mapLabel }}</span>
                </button>
                <span class="badge bg-secondary">{{ task.trader?.name || 'Unknown' }}</span>
              </div>
            </div>

            <div v-if="filteredTasksList.length === 0" class="text-center text-muted py-4">
              表示するタスクがありません。
            </div>
          </div>

          <!-- トレーダー/マップ グループ表示 -->
          <div v-else>
            <div
              v-for="(tasks, group) in (taskViewMode === 'trader' ? tasksByTrader : tasksByMap)"
              :key="group"
              class="mb-3"
            >
              <h6 class="text-warning border-bottom border-secondary pb-1">{{ group }}</h6>
              <div class="list-group">
                <div
                  v-for="task in getSortedTasks(tasks)"
                  :key="task.id"
                  class="list-group-item d-flex align-items-center gap-3 py-1"
                  :class="{ 'bg-secondary bg-opacity-25': isLocked(task) }"
                >
                  <input
                    class="form-check-input flex-shrink-0 m-0"
                    type="checkbox"
                    :checked="completedTasks.includes(task.id)"
                    @change="toggleTask(task.id)"
                    style="cursor: pointer;"
                  >
                  <button
                    v-if="overlayEnabled"
                    class="btn btn-sm py-0 px-2 flex-shrink-0"
                    :class="focusedTaskIds.includes(task.id) ? 'btn-info' : 'btn-outline-secondary'"
                    @click.stop="toggleFocusedTask(task.id)"
                    :title="focusedTaskIds.includes(task.id) ? '配信オーバーレイから外す' : '配信オーバーレイに表示'"
                    style="font-size: 0.85em;"
                  >📌</button>
                  <div
                    class="d-flex justify-content-between w-100"
                    :class="{ 'opacity-50': isLocked(task) }"
                  >
                    <button type="button"
                      class="task-name-link text-start"
                      style="background: none; border: 0; padding: 0; font: inherit"
                      :class="{
                        'text-decoration-line-through text-muted': showCompleted,
                        'text-info fw-bold': !showCompleted && prioritizedTasks.includes(task.id),
                      }"
                      @click="emit('open-task-details', task)"
                    >
                      <span v-if="isLocked(task)" class="me-1">🔒</span>
                      {{ task.name }}
                      <span v-if="taskStatuses[task.id] === 'active'" class="badge bg-info text-dark ms-1">進行中</span>
                      <span v-if="taskStatuses[task.id] === 'failed'" class="badge bg-danger ms-1">失敗</span>
                      <span v-if="task.kappaRequired" class="badge badge-kappa ms-1">KAPPA</span>
                      <span v-if="task.lightkeeperRequired" class="badge badge-lk ms-1">LK</span>
                    </button>
                    <small class="text-muted">
                      {{ taskViewMode === 'trader' ? task.mapLabel : (task.trader?.name || 'Unknown') }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="Object.keys(taskViewMode === 'trader' ? tasksByTrader : tasksByMap).length === 0"
              class="text-center text-muted py-4"
            >
              表示するタスクがありません。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
