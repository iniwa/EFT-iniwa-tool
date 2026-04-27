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
        <!-- マイナーアップデート: v3.1.0 -->
        <div class="p-4 rounded border border-info border-2 bg-info bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span class="badge bg-info text-dark">NEW</span>
            <h4 class="text-info fw-bold mb-0">
              📺 v3.1.0 - 配信者向けオーバーレイ機能の追加
            </h4>
          </div>
          <p class="text-light mb-3">
            配信（OBS / Streamlabs 等）で現在のタスクを表示できる透過オーバーレイ機能を追加しました。<br>
            デバッグタブの「<strong>配信者用オーバーレイ</strong>」をONにすると、新タブ「📺 配信オーバーレイ」が表示されます。
          </p>
          <ul class="text-light mb-3">
            <li><strong>📌 ピン留め:</strong> タスク一覧／詳細モーダルの 📌 ボタンで、オーバーレイに表示したいタスクを選べます。</li>
            <li><strong>🔗 オーバーレイウィンドウ:</strong> 設定タブの「オーバーレイURLをコピー」で取得したURLを、OBSの「ブラウザソース」に貼るだけで背景透過表示されます。</li>
            <li><strong>進捗の手動調整:</strong> アイテム収集数やオブジェクティブの完了／未完了を、オーバーレイ設定画面から個別に調整できます。完了済みの項目には取り消し線とチェックが入ります。</li>
            <li><strong>🔗 タスク連続モード:</strong> 完了ボタンを押すと、そのタスクを前提にしていた次のタスクを自動でピン留めする連鎖モードを搭載。</li>
            <li><strong>既存システムと連動:</strong> オーバーレイ側の「✓ 完了」ボタンは、既存のタスク完了チェックと同時に反映されます。</li>
            <li><strong>モード別保存:</strong> ピン留め／進捗はPvP/PvEごとに独立して保存されます。</li>
          </ul>
          <div class="small text-info-emphasis bg-info bg-opacity-10 border border-info rounded p-2 mb-0">
            💡 配信をしない方は、デバッグタブでOFFにしておけば新タブは表示されません。
          </div>
        </div>

        <!-- メジャーアップデート: v3.0.0（v3.0.x期間中は継続表示） -->
        <div class="p-4 rounded border border-info border-2 bg-info bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span class="badge bg-info text-dark">MAJOR</span>
            <h4 class="text-info fw-bold mb-0">
              🔄 v3.0.0 - アプリケーション全面リビルド
            </h4>
          </div>
          <p class="text-light mb-3">
            本バージョンでは、アプリケーション全体をゼロからリビルドしました。<br>
            見た目や機能は従来とほぼ同じですが、内部構造が大きく変わっています。
          </p>
          <ul class="text-light mb-0">
            <li><strong>高速化:</strong> Viteビルドシステムの導入により、ページの読み込み速度が大幅に改善されました。</li>
            <li><strong>内部構造の刷新:</strong> Vue SFC (Single File Component) への全面移行で、今後の機能追加・修正がしやすくなりました。</li>
            <li><strong>データの互換性:</strong> これまでの進捗データ（タスク完了状況、鍵管理など）はそのまま引き継がれます。</li>
          </ul>
        </div>

        <!-- パッチアップデート: v3.1.1 -->
        <div class="p-4 rounded border border-success border-2 bg-success bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span class="badge bg-success">FIX</span>
            <h4 class="text-success fw-bold mb-0">
              🛠️ v3.1.1 - データ更新エラーの修正
            </h4>
          </div>
          <p class="text-light mb-3">
            ページを開いた際に「<code>更新失敗: GraphQL Error: No item found with id undefined</code>」と表示され、データの更新ができない不具合を修正しました。
          </p>
          <ul class="text-light mb-0">
            <li><strong>原因:</strong> tarkov.dev API 側の一部タスクで武器データの ID が不整合になっており、GraphQL リゾルバーがエラーを返していました。</li>
            <li><strong>対応:</strong> アプリ内で未使用だったフィールド（<code>usingWeapon</code>）をクエリから除外することで回避しました。</li>
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
          <summary class="text-secondary small fw-bold" style="cursor: pointer;">📜 過去のアップデート</summary>
          <div class="mt-3 vstack gap-3 ps-2">
            <div class="bg-success bg-opacity-10 p-2 rounded border border-success">
              <h6 class="text-success small mb-1">🛠️ v3.0.2 - タスク必要アイテム表示の修正</h6>
              <ul class="list-unstyled small text-light mb-0 ps-1">
                <li>・複数アイテムから合計個数を納品するタスクの必要数表示を修正</li>
                <li>・対象アイテム候補をショッピングリスト・タスク詳細の両方で確認可能に</li>
              </ul>
            </div>

            <div class="bg-secondary bg-opacity-25 p-2 rounded border border-secondary">
              <h6 class="text-secondary small mb-1">🎮 v3.0.1 - PvP/PvEセーブデータ分離</h6>
              <ul class="list-unstyled small text-light mb-0 ps-1">
                <li>・ゲームモード（PvP / PvE）ごとにセーブデータを独立化</li>
                <li>・タスク・ハイドアウト・鍵・ウィッシュリスト・ストーリー等が対象</li>
                <li>・既存データは現在のモードに自動マイグレーション</li>
              </ul>
            </div>

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
