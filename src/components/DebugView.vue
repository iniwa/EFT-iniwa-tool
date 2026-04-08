<script setup>
// デバッグ / データ確認タブ
// 内部データの閲覧とユーザーデータのリセット機能

import { ref, computed } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useApiData } from '../composables/useApiData.js'

const { playerLevel, gameMode, apiLang } = useAppState()

const {
  completedTasks,
  userHideout,
  collectedItems,
  ownedKeys,
  keyUserData,
  prioritizedTasks,
  wishlist,
  showStoryTab,
  resetUserData,
} = useUserProgress()

const { taskData, hideoutData, itemsData, ammoData, itemDb } = useApiData()

// --- ローカル状態 ---
const currentView = ref('tasks')
const copyButtonText = ref('コピー')

// リセット対象のチェック状態
const resetTargets = ref({
  tasks: false,
  hideout: false,
  keys: false,
  story: false,
  items: false,
  wishlist: false,
  settings: false,
})

// --- サイドバーの項目定義 ---
const viewButtons = [
  { key: 'tasks', label: 'タスク' },
  { key: 'hideout', label: 'ハイドアウト' },
  { key: 'items', label: 'アイテム' },
  { key: 'ammoData', label: '弾薬データ' },
  { key: 'itemDb', label: 'アイテムDB' },
  { key: 'userProgress', label: 'ユーザー進捗' },
  { key: 'reset', label: 'リセット' },
]

// --- 表示データの切り替え ---
const displayData = computed(() => {
  switch (currentView.value) {
    case 'tasks':
      return taskData.value
    case 'hideout':
      return hideoutData.value
    case 'items':
      return itemsData.value
    case 'ammoData':
      return ammoData.value
    case 'itemDb':
      return itemDb.value
    case 'userProgress':
      return {
        _settings: {
          level: playerLevel.value,
          gameMode: gameMode.value,
          language: apiLang.value,
          showStoryTab: showStoryTab.value,
        },
        userHideout: userHideout.value,
        completedTasks: completedTasks.value,
        prioritizedTasks: prioritizedTasks.value,
        ownedKeys: ownedKeys.value,
        keyUserData: keyUserData.value,
        collectedItems: collectedItems.value,
        wishlist: wishlist.value,
      }
    default:
      return null
  }
})

// --- JSON整形テキスト ---
const formattedJson = computed(() => {
  if (currentView.value === 'reset' || !displayData.value) return ''
  return JSON.stringify(displayData.value, null, 2)
})

// --- クリップボードにコピー ---
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    copyButtonText.value = 'コピーしました！'
    setTimeout(() => {
      copyButtonText.value = 'コピー'
    }, 2000)
  } catch (err) {
    console.error('コピー失敗:', err)
    copyButtonText.value = 'コピー失敗'
    setTimeout(() => {
      copyButtonText.value = 'コピー'
    }, 2000)
  }
}

// --- データリセット実行 ---
function executeReset() {
  const targets = resetTargets.value
  const selectedLabels = []
  if (targets.tasks) selectedLabels.push('タスク')
  if (targets.hideout) selectedLabels.push('ハイドアウト')
  if (targets.keys) selectedLabels.push('鍵')
  if (targets.story) selectedLabels.push('ストーリー')
  if (targets.items) selectedLabels.push('収集アイテム')
  if (targets.wishlist) selectedLabels.push('ウィッシュリスト')
  if (targets.settings) selectedLabels.push('設定')

  if (selectedLabels.length === 0) {
    alert('リセット対象を選択してください。')
    return
  }

  const confirmed = confirm(
    `以下のデータをリセットしますか？\n\n${selectedLabels.join('、')}\n\nこの操作は取り消せません。`
  )
  if (!confirmed) return

  // ストーリーデータは個別にlocalStorageから削除
  if (targets.story) {
    localStorage.removeItem('eft_story_progress')
  }

  // composableのresetUserDataを呼び出し
  resetUserData(targets, hideoutData)

  // チェックをリセット
  Object.keys(resetTargets.value).forEach((key) => {
    resetTargets.value[key] = false
  })
}
</script>

<template>
  <div class="card h-100 border-secondary">
    <!-- ヘッダー -->
    <div class="card-header bg-dark d-flex justify-content-between align-items-center py-2">
      <span>デバッグ / データ確認</span>
      <button
        v-if="currentView !== 'reset'"
        class="btn btn-sm btn-outline-secondary"
        @click="copyToClipboard"
      >
        {{ copyButtonText }}
      </button>
    </div>

    <!-- 本体 -->
    <div class="card-body p-0">
      <div class="row g-0 h-100">
        <!-- 左サイドバー -->
        <div class="col-md-2 border-end border-secondary bg-dark d-flex flex-column">
          <!-- ビュー切替ボタン -->
          <div class="p-2 d-flex flex-column gap-1">
            <button
              v-for="btn in viewButtons"
              :key="btn.key"
              class="btn btn-sm text-start"
              :class="currentView === btn.key ? 'btn-warning text-dark' : 'btn-outline-secondary'"
              @click="currentView = btn.key"
            >
              {{ btn.label }}
            </button>
          </div>

          <!-- スペーサー -->
          <div class="flex-grow-1"></div>

          <!-- オプション -->
          <div class="p-2 border-top border-secondary">
            <small class="text-muted d-block mb-1">オプション</small>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="debugShowStory"
                v-model="showStoryTab"
              >
              <label class="form-check-label small" for="debugShowStory">
                ストーリータブ
              </label>
            </div>
          </div>
        </div>

        <!-- 右メインエリア -->
        <div class="col-md-10 bg-dark">
          <!-- データビューア (リセット以外) -->
          <div v-if="currentView !== 'reset'" class="h-100 p-2">
            <textarea
              class="form-control bg-dark text-white border-secondary font-monospace h-100"
              style="min-height: 60vh; resize: none;"
              readonly
              :value="formattedJson"
            ></textarea>
          </div>

          <!-- リセットパネル -->
          <div v-else class="p-3">
            <h5 class="text-warning mb-3">データリセット</h5>
            <p class="text-muted small mb-3">
              リセットするデータカテゴリを選択してください。この操作は取り消せません。
            </p>

            <div class="d-flex flex-column gap-2 mb-4">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="resetTasks"
                  v-model="resetTargets.tasks"
                >
                <label class="form-check-label" for="resetTasks">
                  タスク（完了済み・優先タスク）
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="resetHideout"
                  v-model="resetTargets.hideout"
                >
                <label class="form-check-label" for="resetHideout">
                  ハイドアウト
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="resetKeys"
                  v-model="resetTargets.keys"
                >
                <label class="form-check-label" for="resetKeys">
                  鍵（所持・評価・メモ）
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="resetStory"
                  v-model="resetTargets.story"
                >
                <label class="form-check-label" for="resetStory">
                  ストーリー進捗
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="resetItems"
                  v-model="resetTargets.items"
                >
                <label class="form-check-label" for="resetItems">
                  収集アイテム
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="resetWishlist"
                  v-model="resetTargets.wishlist"
                >
                <label class="form-check-label" for="resetWishlist">
                  ウィッシュリスト
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="resetSettings"
                  v-model="resetTargets.settings"
                >
                <label class="form-check-label" for="resetSettings">
                  設定（レベル・モード・言語等）
                </label>
              </div>
            </div>

            <button
              class="btn btn-danger"
              @click="executeReset"
            >
              選択したデータをリセット
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
