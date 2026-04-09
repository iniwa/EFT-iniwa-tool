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
        <div class="p-3 rounded border border-success bg-success bg-opacity-10">
          <h5 class="text-success fw-bold mb-2">
            🛠️ v3.0.2 - タスク必要アイテム表示の修正
          </h5>
          <p class="small text-light mb-2">
            複数アイテムから合計個数を納品するタスク（Drip-Out等）の必要数表示を修正しました。
          </p>
          <ul class="small text-light mb-0">
            <li><strong>修正内容:</strong> 各アイテムにcount全量が付与されていた不具合を修正し、合計数として正しく1エントリに集約するようにしました。</li>
            <li><strong>対象アイテム表示:</strong> ショッピングリスト・タスク詳細の両方で、対象となるアイテム候補の一覧を確認できます。</li>
          </ul>
        </div>

        <div class="p-3 rounded border border-secondary bg-secondary bg-opacity-10">
          <h5 class="text-secondary fw-bold mb-2">
            🎮 v3.0.1 - PvP/PvEセーブデータ分離
          </h5>
          <p class="small text-light mb-2">
            ゲームモード（PvP / PvE）ごとにセーブデータが独立するようになりました。
          </p>
          <ul class="small text-light mb-0">
            <li><strong>モード別進捗:</strong> タスク完了、ハイドアウト、鍵、収集アイテム、ウィッシュリスト、ストーリー進捗、プレイヤーレベルがモードごとに保存されます。</li>
            <li><strong>自動マイグレーション:</strong> 既存のデータは現在選択中のモードに自動的に引き継がれます。</li>
            <li><strong>即時切り替え:</strong> ヘッダーのモード切り替えで、各モードのデータが即座にスワップされます。</li>
          </ul>
        </div>

        <div class="p-3 rounded border border-secondary bg-secondary bg-opacity-10">
          <h5 class="text-secondary fw-bold mb-2">
            🔄 v3.0.0 - アプリケーション全面リビルド
          </h5>
          <p class="small text-light mb-2">
            本バージョンでは、アプリケーション全体をゼロからリビルドしました。<br>
            見た目や機能は従来とほぼ同じですが、内部構造が大きく変わっています。
          </p>
          <ul class="small text-light mb-0">
            <li><strong>高速化:</strong> Viteビルドシステムの導入により、ページの読み込み速度が大幅に改善されました。</li>
            <li><strong>内部構造の刷新:</strong> Vue SFC (Single File Component) への全面移行で、今後の機能追加・修正がしやすくなりました。</li>
            <li><strong>データの互換性:</strong> これまでの進捗データ（タスク完了状況、鍵管理など）はそのまま引き継がれます。</li>
          </ul>
        </div>

        <!-- 不具合報告のお願い -->
        <div class="p-3 rounded border border-warning bg-warning bg-opacity-10">
          <h6 class="text-warning fw-bold mb-2">
            ⚠️ 不具合報告のお願い
          </h6>
          <p class="small text-light mb-0">
            もし不具合や気になる点を見つけた場合は、ページ最下部の「<strong>意見箱</strong>」からお気軽にご報告ください。
          </p>
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
