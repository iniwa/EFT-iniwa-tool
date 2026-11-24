<script setup>
import { reactive } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useOverlay } from '../composables/useOverlay.js'
import { useApiData } from '../composables/useApiData.js'

const { gameMode } = useAppState()
const { showStoryTab, resetUserData } = useUserProgress()
const { overlayEnabled } = useOverlay()
const { hideoutData } = useApiData()
const targets = reactive({ tasks: false, hideout: false, keys: false, story: false, items: false, wishlist: false, settings: false })
const modeLabel = { regular: '通常PvP', pve: 'PvE', 'pvp-season': 'Seasonal PvP' }
function reset() {
  const selected = Object.entries(targets).filter(([, value]) => value).map(([key]) => key)
  if (!selected.length) return
  if (!confirm(`現在の${modeLabel[gameMode.value] || gameMode.value}の選択データをリセットします。取り消せません。`)) return
  resetUserData(targets, hideoutData)
  Object.keys(targets).forEach((key) => { targets[key] = false })
}
</script>
<template>
  <section class="card border-secondary"><div class="card-header">設定</div><div class="card-body">
    <div class="form-check form-switch"><input id="settings-story" v-model="showStoryTab" class="form-check-input" type="checkbox"><label for="settings-story" class="form-check-label">ストーリータブを表示</label></div>
    <div class="form-check form-switch mt-2"><input id="settings-overlay" v-model="overlayEnabled" class="form-check-input" type="checkbox"><label for="settings-overlay" class="form-check-label">配信オーバーレイを表示</label></div>
    <hr><h2 class="h5 text-warning">現在のモードのデータをリセット</h2><p class="small text-muted">対象: {{ modeLabel[gameMode] || gameMode }}。設定リセットのみ全モードのレベル・UI設定・通知を消去します。APIキャッシュ、更新クールダウン、移行マーカーは保持されます。</p>
    <div v-for="label in [['tasks','タスク'],['hideout','ハイドアウト'],['keys','鍵'],['story','ストーリー'],['items','収集アイテム'],['wishlist','ウィッシュリスト'],['settings','設定（全モード）']]" :key="label[0]" class="form-check"><input :id="`reset-${label[0]}`" v-model="targets[label[0]]" class="form-check-input" type="checkbox"><label :for="`reset-${label[0]}`" class="form-check-label">{{ label[1] }}</label></div>
    <button class="btn btn-danger mt-3" @click="reset">選択したデータをリセット</button>
  </div></section>
</template>
