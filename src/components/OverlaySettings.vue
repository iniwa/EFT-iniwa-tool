<script setup>
// 配信オーバーレイ設定タブ
// ピン留めタスクの管理、各objectiveの進捗手動調整、表示カスタマイズを行う

import { ref, computed } from 'vue'
import { useApiData } from '../composables/useApiData.js'
import { useOverlay } from '../composables/useOverlay.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useAppState } from '../composables/useAppState.js'

const emit = defineEmits(['open-task-details'])

const { taskData } = useApiData()
const {
  focusedTaskIds,
  overlayConfig,
  toggleFocusedTask,
  removeFocusedTask,
  moveFocusedTask,
  getObjectiveCount,
  setObjectiveCount,
  clearAllFocused,
} = useOverlay()
const { completedTasks, toggleTask } = useUserProgress()
const { playerLevel } = useAppState()

// 連鎖モード: あるタスクを完了した際、そのタスクを前提とする
// 「次に着手可能になる」タスクを自動でピン留めする
function findUnlockedTasks(completedTaskId) {
  if (!taskData.value) return []
  const completedSet = new Set([...completedTasks.value, completedTaskId])
  const lv = playerLevel.value
  const result = []

  for (const t of taskData.value) {
    // 完了済み・既にピン留め済みはスキップ
    if (completedSet.has(t.id)) continue
    if (focusedTaskIds.value.includes(t.id)) continue

    // completedTaskId を前提に含むか？
    const reqs = t.taskRequirements || []
    const dependsOnCompleted = reqs.some((r) => r && r.task && r.task.id === completedTaskId)
    if (!dependsOnCompleted) continue

    // 他の前提条件もすべて完了しているか？
    const allReqsMet = reqs.every((r) => r && r.task && completedSet.has(r.task.id))
    if (!allReqsMet) continue

    // レベル条件 (playerLevel=0は制限なし)
    if (lv > 0 && t.minPlayerLevel && t.minPlayerLevel > lv) continue

    result.push(t.id)
  }
  return result
}

function completeTask(task) {
  if (!task) return
  const alreadyDone = completedTasks.value.includes(task.id)

  // 既存完了システムに反映
  if (!alreadyDone) toggleTask(task.id)

  // 次タスクを連鎖表示（ONの時のみ）
  if (overlayConfig.value.chainMode && !alreadyDone) {
    const nextIds = findUnlockedTasks(task.id)
    for (const id of nextIds) {
      if (!focusedTaskIds.value.includes(id)) {
        toggleFocusedTask(id)
      }
    }
  }

  // 完了タスクはピン留めから外す
  removeFocusedTask(task.id)
}

const copyButtonText = ref('オーバーレイURLをコピー')

const focusedTasks = computed(() => {
  if (!taskData.value) return []
  const map = new Map(taskData.value.map((t) => [t.id, t]))
  return focusedTaskIds.value.map((id) => map.get(id)).filter(Boolean)
})

async function copyOverlayUrl() {
  const url = `${window.location.origin}${window.location.pathname}?overlay=tasks`
  try {
    await navigator.clipboard.writeText(url)
    copyButtonText.value = 'コピーしました！'
  } catch (err) {
    console.error('コピー失敗:', err)
    copyButtonText.value = 'コピー失敗'
  }
  setTimeout(() => {
    copyButtonText.value = 'オーバーレイURLをコピー'
  }, 2000)
}

function handleClearAll() {
  if (focusedTaskIds.value.length === 0) return
  if (confirm('ピン留めされたタスクを全てクリアしますか？')) {
    clearAllFocused()
  }
}

function objectiveLabel(obj) {
  if (obj.items && obj.items.length > 0) {
    if (obj.items.length === 1) return obj.items[0].name
    return obj.description || '(複数アイテム)'
  }
  if (obj.item) return obj.item.name
  if (obj.type === 'shoot') return `${obj.target || ''} ${obj.description || ''}`.trim()
  return obj.description || '(アクション目標)'
}

function onCountInput(taskId, idx, event) {
  const v = parseInt(event.target.value, 10)
  setObjectiveCount(taskId, idx, isNaN(v) ? 0 : Math.max(0, v))
}
</script>

<template>
  <div class="card h-100 border-secondary bg-dark text-light">
    <!-- ヘッダー -->
    <div class="card-header bg-dark d-flex justify-content-between align-items-center py-2 flex-wrap gap-2">
      <span class="fw-bold">📺 配信オーバーレイ設定</span>
      <button class="btn btn-sm btn-outline-info" @click="copyOverlayUrl">
        🔗 {{ copyButtonText }}
      </button>
    </div>

    <div class="card-body p-2">
      <div class="row g-2">
        <!-- 左カラム: 表示カスタマイズ -->
        <div class="col-md-4">
          <div class="card bg-dark border-secondary h-100">
            <div class="card-header bg-dark border-secondary py-2">
              <small class="text-info fw-bold">表示カスタマイズ</small>
            </div>
            <div class="card-body p-3">
              <!-- フォントサイズ -->
              <div class="mb-3">
                <label class="form-label small mb-1">
                  フォントサイズ: <span class="text-warning">{{ overlayConfig.fontSize }}px</span>
                </label>
                <input
                  type="range"
                  class="form-range"
                  min="12"
                  max="32"
                  v-model.number="overlayConfig.fontSize"
                >
              </div>

              <!-- テキスト色 -->
              <div class="mb-3">
                <label class="form-label small mb-1">テキスト色</label>
                <input
                  type="color"
                  class="form-control form-control-color bg-dark border-secondary"
                  v-model="overlayConfig.textColor"
                >
              </div>

              <!-- アクセント色 -->
              <div class="mb-3">
                <label class="form-label small mb-1">アクセント色</label>
                <input
                  type="color"
                  class="form-control form-control-color bg-dark border-secondary"
                  v-model="overlayConfig.accentColor"
                >
              </div>

              <!-- 表示要素チェック -->
              <div class="mb-3 d-flex flex-column gap-1">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="ovShowTrader"
                    v-model="overlayConfig.showTraderIcon"
                  >
                  <label class="form-check-label small" for="ovShowTrader">
                    トレーダーアイコン表示
                  </label>
                </div>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="ovShowObj"
                    v-model="overlayConfig.showObjectives"
                  >
                  <label class="form-check-label small" for="ovShowObj">
                    オブジェクティブ表示
                  </label>
                </div>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="ovShowItems"
                    v-model="overlayConfig.showItems"
                  >
                  <label class="form-check-label small" for="ovShowItems">
                    必要アイテム表示
                  </label>
                </div>
              </div>

              <!-- 最大タスク数 -->
              <div class="mb-3">
                <label class="form-label small mb-1">最大タスク数</label>
                <input
                  type="number"
                  class="form-control form-control-sm bg-dark text-light border-secondary"
                  min="1"
                  max="10"
                  v-model.number="overlayConfig.maxTasks"
                >
              </div>

              <!-- タスク連続モード -->
              <div class="mb-3 p-2 border border-secondary rounded">
                <div class="form-check form-switch mb-1">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="ovChainMode"
                    v-model="overlayConfig.chainMode"
                  >
                  <label class="form-check-label small fw-bold" for="ovChainMode">
                    🔗 タスク連続モード
                  </label>
                </div>
                <div class="small text-muted" style="line-height: 1.3;">
                  完了ボタン押下時、このタスクを前提にしていた
                  次のタスクを自動でピン留めします。
                </div>
              </div>

              <!-- 全クリアボタン -->
              <button
                class="btn btn-sm btn-outline-danger w-100 mt-2"
                @click="handleClearAll"
                :disabled="focusedTaskIds.length === 0"
              >
                ピン留めを全てクリア
              </button>
            </div>
          </div>
        </div>

        <!-- 右カラム: ピン留めタスクリスト -->
        <div class="col-md-8">
          <div class="card bg-dark border-secondary h-100">
            <div class="card-header bg-dark border-secondary py-2 d-flex justify-content-between align-items-center">
              <small class="text-info fw-bold">ピン留め中のタスク</small>
              <span class="badge bg-secondary">{{ focusedTaskIds.length }} 件</span>
            </div>
            <div class="card-body p-2">
              <!-- 空状態 -->
              <div
                v-if="focusedTasks.length === 0"
                class="text-center text-muted py-5 small"
              >
                タスク一覧で 📌 ボタンを押してピン留めしてください
              </div>

              <!-- タスクカードリスト -->
              <div v-else class="d-flex flex-column gap-2">
                <div
                  v-for="(task, tIdx) in focusedTasks"
                  :key="task.id"
                  class="card bg-dark border-secondary"
                >
                  <!-- タスクヘッダー -->
                  <div class="card-header bg-dark border-secondary py-2 d-flex align-items-center gap-2">
                    <img
                      v-if="task.trader && task.trader.imageLink"
                      :src="task.trader.imageLink"
                      :alt="task.trader.name"
                      style="width: 28px; height: 28px; border-radius: 4px;"
                    >
                    <div class="flex-grow-1 min-width-0">
                      <a
                        href="#"
                        class="fw-bold text-warning text-truncate d-block text-decoration-none"
                        @click.prevent="emit('open-task-details', task)"
                        title="タスク詳細を開く（完了チェックなど）"
                      >{{ task.name }}</a>
                      <div class="small text-muted">
                        {{ task.trader && task.trader.name }}
                        <span v-if="task.map && task.map.name"> / {{ task.map.name }}</span>
                      </div>
                    </div>
                    <div class="btn-group btn-group-sm" role="group">
                      <button
                        class="btn btn-outline-secondary"
                        :disabled="tIdx === 0"
                        @click="moveFocusedTask(task.id, 'up')"
                        title="上へ"
                      >↑</button>
                      <button
                        class="btn btn-outline-secondary"
                        :disabled="tIdx === focusedTasks.length - 1"
                        @click="moveFocusedTask(task.id, 'down')"
                        title="下へ"
                      >↓</button>
                      <button
                        class="btn btn-success"
                        @click="completeTask(task)"
                        :title="overlayConfig.chainMode
                          ? '完了にして次タスクを自動ピン留め'
                          : '完了にしてピン留め解除'"
                      >✓ 完了</button>
                      <button
                        class="btn btn-outline-danger"
                        @click="removeFocusedTask(task.id)"
                        title="ピン留めのみ解除（完了にはしない）"
                      >✕</button>
                    </div>
                  </div>

                  <!-- objectives リスト -->
                  <ul
                    v-if="task.objectives && task.objectives.length > 0"
                    class="list-group list-group-flush"
                  >
                    <li
                      v-for="(obj, idx) in task.objectives"
                      :key="idx"
                      class="list-group-item bg-dark text-light border-secondary py-2"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <div class="flex-grow-1 small">
                          {{ objectiveLabel(obj) }}
                          <span v-if="obj.foundInRaid" class="badge bg-warning text-dark ms-1">FIR</span>
                        </div>
                        <!-- count > 1: 数値input -->
                        <div
                          v-if="obj.count && obj.count > 1"
                          class="d-flex align-items-center gap-1"
                          style="flex-shrink: 0;"
                        >
                          <input
                            type="number"
                            class="form-control form-control-sm bg-dark text-light border-secondary text-end"
                            style="width: 70px;"
                            min="0"
                            :max="obj.count"
                            :value="getObjectiveCount(task.id, idx)"
                            @input="onCountInput(task.id, idx, $event)"
                          >
                          <span class="text-muted small">/ {{ obj.count }}</span>
                        </div>
                        <!-- count==1 等: 完了/未完了トグル -->
                        <div
                          v-else
                          class="form-check form-switch m-0 d-flex align-items-center gap-2"
                          style="flex-shrink: 0;"
                        >
                          <label
                            class="form-check-label small mb-0"
                            :class="getObjectiveCount(task.id, idx) > 0 ? 'text-success' : 'text-muted'"
                            :for="`ov-done-${task.id}-${idx}`"
                            style="cursor: pointer;"
                          >
                            {{ getObjectiveCount(task.id, idx) > 0 ? '完了' : '未完了' }}
                          </label>
                          <input
                            :id="`ov-done-${task.id}-${idx}`"
                            class="form-check-input m-0"
                            type="checkbox"
                            :checked="getObjectiveCount(task.id, idx) > 0"
                            @change="setObjectiveCount(task.id, idx, $event.target.checked ? 1 : 0)"
                          >
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
