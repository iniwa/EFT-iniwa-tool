<script setup>
// デバッグ / データ確認タブ
// 内部データの閲覧とユーザーデータのリセット機能

import { ref, computed, watch, toRaw } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useApiData } from '../composables/useApiData.js'
import { useOverlay } from '../composables/useOverlay.js'

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

const { hideoutData } = useApiData()
const { overlayEnabled } = useOverlay()

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

// --- JSON整形テキスト（Web Worker + IndexedDB直接読み取り + 表示行数制限） ---
const formattedJson = ref('')
const isGenerating = ref(false)
const truncatedInfo = ref(null) // { totalLines, totalChars } or null

// WorkerがIndexedDBから直接データを読み、表示用に先頭行だけ返す
// 全文はコピー用に別途保持（fullフィールド）
const MAX_DISPLAY_LINES = 500
const workerCode = `
var DB='EFT_APP_DB',ST='api_cache',MC='eft_api_cache_v31_idb',IC='eft_item_db_cache';
var FM={tasks:'tasks',hideout:'hideoutStations',items:'items',ammoData:'ammo'};
var MAX=${MAX_DISPLAY_LINES};
function rd(k){return new Promise(function(ok,ng){var r=indexedDB.open(DB,1);r.onsuccess=function(){var d=r.result,t=d.transaction(ST,'readonly'),g=t.objectStore(ST).get(k);g.onsuccess=function(){d.close();ok(g.result)};g.onerror=function(){d.close();ng(g.error)}};r.onerror=function(){ng(r.error)}})}
function fmt(id,json){
  var lines=json.split('\\n');var tl=lines.length;var tc=json.length;
  if(tl<=MAX){self.postMessage({id:id,display:json,full:json,totalLines:tl,totalChars:tc,truncated:false})}
  else{self.postMessage({id:id,display:lines.slice(0,MAX).join('\\n'),full:json,totalLines:tl,totalChars:tc,truncated:true})}
}
self.onmessage=function(e){var m=e.data,id=m.id,v=m.view;
if(m.directData!==undefined){try{fmt(id,JSON.stringify(m.directData,null,2))}catch(er){self.postMessage({id:id,display:'(エラー: '+er.message+')',full:'',totalLines:0,totalChars:0,truncated:false})}return}
var p=FM[v]?rd(MC):v==='itemDb'?rd(IC):Promise.resolve(null);
p.then(function(c){var d=null;if(c){d=FM[v]?c[FM[v]]:v==='itemDb'?c.items:null}if(d!=null){fmt(id,JSON.stringify(d,null,2))}else{self.postMessage({id:id,display:'(データなし)',full:'',totalLines:0,totalChars:0,truncated:false})}}).catch(function(er){self.postMessage({id:id,display:'(読み取りエラー: '+er.message+')',full:'',totalLines:0,totalChars:0,truncated:false})})}`

const workerBlob = new Blob([workerCode], { type: 'application/javascript' })
const workerUrl = URL.createObjectURL(workerBlob)
const worker = new Worker(workerUrl)
let requestId = 0
let fullJsonForCopy = '' // コピー用全文（非リアクティブ、DOM描画なし）

worker.onmessage = (e) => {
  const msg = e.data
  if (msg.id !== requestId) return // 古いリクエストは無視
  formattedJson.value = msg.display
  fullJsonForCopy = msg.full
  truncatedInfo.value = msg.truncated
    ? { totalLines: msg.totalLines, totalChars: msg.totalChars }
    : null
  isGenerating.value = false
}

watch(currentView, (view) => {
  const id = ++requestId

  if (view === 'reset') {
    formattedJson.value = ''
    isGenerating.value = false
    return
  }

  isGenerating.value = true
  formattedJson.value = ''

  if (view === 'userProgress') {
    // ユーザー進捗は軽量データなので直接送信（IndexedDBに保存されていない）
    worker.postMessage({
      id,
      view,
      directData: {
        _settings: {
          level: playerLevel.value,
          gameMode: gameMode.value,
          language: apiLang.value,
          showStoryTab: showStoryTab.value,
        },
        userHideout: toRaw(userHideout.value),
        completedTasks: toRaw(completedTasks.value),
        prioritizedTasks: toRaw(prioritizedTasks.value),
        ownedKeys: toRaw(ownedKeys.value),
        keyUserData: toRaw(keyUserData.value),
        collectedItems: toRaw(collectedItems.value),
        wishlist: toRaw(wishlist.value),
      },
    })
  } else {
    // APIデータはWorkerがIndexedDBから直接読み取り（メインスレッド負荷ゼロ）
    worker.postMessage({ id, view })
  }
}, { immediate: true })

// --- クリップボードにコピー（切り詰め前の全文をコピー） ---
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(fullJsonForCopy || formattedJson.value)
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
            <div class="form-check form-switch mt-1">
              <input
                class="form-check-input"
                type="checkbox"
                id="debugOverlayEnabled"
                v-model="overlayEnabled"
              >
              <label class="form-check-label small" for="debugOverlayEnabled">
                配信者用オーバーレイ
              </label>
            </div>
          </div>
        </div>

        <!-- 右メインエリア -->
        <div class="col-md-10 bg-dark">
          <!-- データビューア (リセット以外) -->
          <div v-if="currentView !== 'reset'" class="h-100 p-2">
            <!-- 生成中スピナー -->
            <div v-if="isGenerating" class="d-flex justify-content-center align-items-center" style="min-height: 60vh;">
              <div class="text-center text-muted">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                データを読み込み中...
              </div>
            </div>
            <template v-else>
              <div v-if="truncatedInfo" class="alert alert-warning py-1 px-2 mb-1 small">
                全 {{ truncatedInfo.totalLines.toLocaleString() }} 行 /
                {{ (truncatedInfo.totalChars / 1024 / 1024).toFixed(1) }}MB —
                先頭 {{ MAX_DISPLAY_LINES }} 行を表示中（コピーは全文）
              </div>
              <textarea
                class="form-control bg-dark text-white border-secondary font-monospace"
                :style="{ minHeight: truncatedInfo ? '57vh' : '60vh', resize: 'none' }"
                readonly
                :value="formattedJson"
              ></textarea>
            </template>
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
