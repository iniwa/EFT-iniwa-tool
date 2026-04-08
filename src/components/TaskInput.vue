<script setup>
// タスク進捗入力タブ
// ハイドアウトのレベル設定 + タスクリストの表示・管理

import { ref, computed } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useApiData } from '../composables/useApiData.js'
import * as TaskLogic from '../logic/taskLogic.js'

const { playerLevel } = useAppState()

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
} = useUserProgress()

const { taskData, hideoutData } = useApiData()

const emit = defineEmits(['open-task-details'])

// --- ローカル状態 ---
const taskSortMode = ref('default')
const taskViewMode = ref('list')
const searchTask = ref('')

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
  })
})

// --- タスク: トレーダー/マップグループ ---
const tasksByTrader = computed(() => TaskLogic.groupTasksByTrader(filteredTasksList.value))
const tasksByMap = computed(() => TaskLogic.groupTasksByMap(filteredTasksList.value))

// --- タスク: ロック判定 (前提タスク未完了 or レベル不足) ---
function isLocked(task) {
  if (completedTasks.value.includes(task.id)) return false
  if (playerLevel.value !== 0 && task.minPlayerLevel > playerLevel.value) return true
  if (task.taskRequirements) {
    const reqsMet = task.taskRequirements.every((r) =>
      completedTasks.value.includes(r.task.id),
    )
    if (!reqsMet) return true
  }
  return false
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
          <input
            type="text"
            class="form-control mb-3"
            placeholder="タスク名で検索..."
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
              <div
                class="w-100 d-flex justify-content-between align-items-center"
                :class="{ 'opacity-50': isLocked(task) }"
              >
                <span
                  class="task-name-link"
                  :class="{
                    'text-decoration-line-through text-muted': showCompleted,
                    'text-info fw-bold': !showCompleted && prioritizedTasks.includes(task.id),
                  }"
                  @click="emit('open-task-details', task)"
                >
                  <span v-if="isLocked(task)" class="me-1">🔒</span>
                  {{ task.name }}
                  <span v-if="task.kappaRequired" class="badge badge-kappa ms-1">KAPPA</span>
                  <span v-if="task.lightkeeperRequired" class="badge badge-lk ms-1">LK</span>
                  <span v-if="task.mapLabel" class="badge bg-dark border border-secondary text-secondary ms-2 small">{{ task.mapLabel }}</span>
                </span>
                <span class="badge bg-secondary">{{ task.trader.name }}</span>
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
                  <div
                    class="d-flex justify-content-between w-100"
                    :class="{ 'opacity-50': isLocked(task) }"
                  >
                    <span
                      class="task-name-link"
                      :class="{
                        'text-decoration-line-through text-muted': showCompleted,
                        'text-info fw-bold': !showCompleted && prioritizedTasks.includes(task.id),
                      }"
                      @click="emit('open-task-details', task)"
                    >
                      <span v-if="isLocked(task)" class="me-1">🔒</span>
                      {{ task.name }}
                      <span v-if="task.kappaRequired" class="badge badge-kappa ms-1">KAPPA</span>
                      <span v-if="task.lightkeeperRequired" class="badge badge-lk ms-1">LK</span>
                    </span>
                    <small class="text-muted">
                      {{ taskViewMode === 'trader' ? task.mapLabel : task.trader.name }}
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
