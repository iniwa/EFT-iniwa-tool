<script setup>
// アップデート通知モーダル
// バージョン変更時に自動表示、永久非表示オプション付き

import { ref, onMounted } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import BaseModal from './ui/BaseModal.vue'

const { APP_VERSION } = useAppState()

const isVisible = ref(false)

const LS_KEY_VERSION = 'eft_notice_last_seen_version'
const LS_KEY_HIDDEN = 'eft_notice_permanently_hidden'

// major.minor が一致するか判定
function isSameMajorMinor(v1, v2) {
  if (!v1 || !v2) return false
  const p1 = v1.split('.')
  const p2 = v2.split('.')
  if (p1.length >= 2 && p2.length >= 2) {
    return p1[0] === p2[0] && p1[1] === p2[1]
  }
  return v1 === v2
}

// 表示判定
function checkVisibility() {
  const permHidden = localStorage.getItem(LS_KEY_HIDDEN)
  if (permHidden === 'true') {
    isVisible.value = false
    return
  }

  const lastSeenVersion = localStorage.getItem(LS_KEY_VERSION)
  if (isSameMajorMinor(lastSeenVersion, APP_VERSION)) {
    isVisible.value = false
    return
  }

  isVisible.value = true
}

// 閉じる: 今回だけ (再訪時にも表示)
function closeOnce() {
  isVisible.value = false
}

// 閉じる: 次回アップデートまで非表示
function closeUntilNextUpdate() {
  localStorage.setItem(LS_KEY_VERSION, APP_VERSION)
  isVisible.value = false
}

// 閉じる: 永久非表示
function closePermanently() {
  if (
    confirm(
      '今後、アップデートのお知らせを含め、この画面を一切表示しなくなります。よろしいですか？\n(設定をリセットするにはブラウザのデータをクリアする必要があります)',
    )
  ) {
    localStorage.setItem(LS_KEY_HIDDEN, 'true')
    isVisible.value = false
  }
}

// 親から再表示できるようにする
function show() {
  isVisible.value = true
}

onMounted(() => {
  checkVisibility()
})

defineExpose({ show })
</script>

<template>
  <BaseModal :show="isVisible" max-width="800px" @close="closeOnce">
    <div class="bg-dark text-white">
      <!-- ヘッダー -->
      <div class="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
        <h5 class="mb-0 text-info">🎉 アップデートのお知らせ (v{{ APP_VERSION }})</h5>
        <button type="button" class="btn-close btn-close-white" @click="closeOnce"></button>
      </div>

      <!-- コンテンツ -->
      <div class="vstack gap-4">
        <div class="p-3 rounded border border-primary bg-primary bg-opacity-10">
          <h5 class="text-primary fw-bold mb-2">
            🔄 v3.0.0 - Vite SFC リビルド
          </h5>
          <p class="small text-light mb-2">
            アプリケーション全体をVite + Vue SFCベースにリビルドしました。<br>
            パフォーマンスの向上と今後の開発効率改善を目的としたリファクタリングです。
          </p>
          <ul class="small text-light mb-0">
            <li><strong>高速化:</strong> Viteによるビルドシステム導入で、読み込み速度が大幅に改善されました。</li>
            <li><strong>コンポーネント構成:</strong> Vue SFC (Single File Component) への移行により、保守性が向上しました。</li>
            <li><strong>状態管理:</strong> Composableパターンによるシングルトン状態管理を導入しました。</li>
          </ul>
        </div>

        <details class="border border-secondary rounded p-2 bg-black bg-opacity-25">
          <summary class="text-secondary small fw-bold" style="cursor: pointer;">📜 過去のアップデート履歴</summary>
          <div class="mt-3 vstack gap-3 ps-2">
            <div class="bg-info bg-opacity-10 p-2 rounded border border-info">
              <h6 class="text-info small mb-1">📖 v2.1.0 - ストーリータスク対応</h6>
              <ul class="list-unstyled small text-light mb-0 ps-1">
                <li>・ストーリータスク (Story Chapters) の進捗管理タブを追加</li>
                <li>・分岐対応、Wiki連携など</li>
              </ul>
            </div>

            <div class="bg-info bg-opacity-10 p-2 rounded border border-info">
              <h6 class="text-info small mb-1">⚔️ v2.0.0 - PvP/PvE & 多言語対応</h6>
              <ul class="list-unstyled small text-light mb-0 ps-1">
                <li>・ゲームモード切り替え (PvP/PvE)</li>
                <li>・言語切り替え (日本語/英語)</li>
                <li>・アイテム図鑑 & 逆引き検索機能を追加</li>
              </ul>
            </div>
          </div>
        </details>

        <div class="bg-secondary bg-opacity-10 p-3 rounded border border-secondary">
          <h6 class="text-white mb-3">📢 開発者からのお願い</h6>
          <p class="small">
            <strong>📮 ご意見・不具合報告</strong><br>
            ページ最下部（フッター）の「ご意見箱」より、Googleフォーム経由で匿名にて送信いただけます。<br>
            不具合やご要望がありましたらお気軽にお知らせください。
          </p>
          <hr class="border-secondary">
          <p class="small mb-0">
            <strong>☕ 将来的な広告設置について</strong><br>
            今後の運営維持のため、Google AdSenseによる広告設置を目標としています。<br>
            操作の邪魔にならないよう細心の注意を払って配置する予定ですので、何卒ご理解いただけますと幸いです。
          </p>
        </div>
      </div>

      <!-- フッター: 閉じるオプション -->
      <div class="border-top border-secondary mt-4 pt-3 d-flex flex-column gap-2">
        <button
          type="button"
          class="btn btn-primary w-100"
          @click="closeUntilNextUpdate"
        >
          OK（次回アップデートまで非表示）
        </button>
        <div class="d-flex justify-content-between w-100">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="closeOnce"
          >
            閉じる（再訪時も表示）
          </button>
          <button
            type="button"
            class="btn btn-sm btn-link text-muted text-decoration-none"
            @click="closePermanently"
          >
            今後一切表示しない
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
