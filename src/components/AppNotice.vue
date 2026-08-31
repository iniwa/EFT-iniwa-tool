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

// 表示判定
function checkVisibility() {
  const permHidden = localStorage.getItem(LS_KEY_HIDDEN)
  if (permHidden === 'true') {
    isVisible.value = false
    return
  }

  const lastSeenVersion = localStorage.getItem(LS_KEY_VERSION)
  if (lastSeenVersion === APP_VERSION) {
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
      '今後、アップデートのお知らせを含め、この画面を一切表示しなくなります。よろしいですか？\n(表示設定・レベル・通知状態をリセットする場合も、5分クールダウンと互換性維持用の移行マーカーは保持されます)',
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
  <BaseModal :show="isVisible" max-width="800px" aria-label="アップデートのお知らせ" @close="closeOnce">
    <div class="bg-dark text-white">
      <!-- ヘッダー -->
      <div class="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3 mb-3">
        <h5 class="mb-0 text-info">🎉 アップデートのお知らせ (v{{ APP_VERSION }})</h5>
        <button type="button" class="btn-close btn-close-white" aria-label="閉じる" @click="closeOnce"></button>
      </div>

      <!-- コンテンツ -->
      <div class="vstack gap-4">
        <!-- 新機能: v3.3.1 -->
        <div class="p-4 rounded border border-info border-2 bg-info bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span class="badge bg-info text-dark">NEW</span>
            <h4 class="text-info fw-bold mb-0">🎟️ v3.3.1 - バトルパス</h4>
          </div>
          <p class="text-light mb-2">本編 KORD BREACH の文書・報酬を確認できる、バトルパスタブを追加しました。</p>
          <ul class="text-light mb-2">
            <li><strong>文書図鑑:</strong> 9種類の文書を日本語・英語の名前や入手マップで絞り込めます。</li>
            <li><strong>入手場所へのリンク:</strong> 各文書から日本語Wikiと英語の地図ガイドを開けます。機密文書は公式説明を案内します。</li>
            <li><strong>報酬一覧:</strong> 全12ページ・53件の報酬を、名前・ページ・分類で検索できます。</li>
          </ul>
          <p class="small text-info mb-0">参考カタログのため、必要文書数や解放条件はゲーム内表示を優先してください。進捗の保存・自動同期は行いません。</p>
        </div>
        <!-- 新機能: v3.3.0 -->
        <div class="p-4 rounded border border-info border-2 bg-info bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span class="badge bg-info text-dark">NEW</span>
            <h4 class="text-info fw-bold mb-0">🧬 v3.3.0 - Personal Modifier ビルダー</h4>
          </div>
          <p class="text-light mb-2">
            KORD BREACH Season 1 の Personal Modifier を、ポイント収支を確認しながら組み立てられるようになりました。
          </p>
          <ul class="text-light mb-2">
            <li><strong>ビルド作成:</strong> Positive / Negative Modifier の選択、ポイント収支、相互作用の注意を一画面で確認できます。</li>
            <li><strong>実績の目安:</strong> Modifier 条件に関係する実績を表示します。ゲーム内の他条件を満たすかはゲーム内表示で確認してください。</li>
            <li><strong>プリセット・共有:</strong> ビルドはブラウザ内へ保存でき、共有リンクは下書きを変えずにプレビューしてから反映できます。</li>
          </ul>
          <p class="small text-info mb-0">
            Modifier一覧と値は公式ルールとコミュニティ観測値をもとにしています。ゲーム内表示が異なる場合は、ゲーム内の内容を優先してください。
          </p>
        </div>
        <div class="p-4 rounded border border-warning border-2 bg-warning bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span class="badge bg-warning text-dark">NEW</span>
            <h4 class="text-warning fw-bold mb-0">🌟 v3.2.0 - Seasonal PvP / Patch 1.1.0.0</h4>
          </div>
          <p class="text-light mb-2">
            EFT Patch 1.1.0.0 と、tarkov.dev の新しい <code>pvp-season</code> データに対応しました。
          </p>
          <ul class="text-light mb-2">
            <li><strong>Seasonal PvP:</strong> 通常PvP・PvEとは別のAPIキャッシュと進捗で管理します。</li>
            <li><strong>新しい解放条件:</strong> タスクの進行中／失敗ステータスと、任意のトレーダーLL・評判判定を追加しました。</li>
            <li><strong>タスク詳細:</strong> 任意目標、エリア・脱出地点、時間・距離・装備条件など、APIにある目標情報を表示します。</li>
            <li><strong>フローチャート:</strong> 前提タスクは実線、レベル・トレーダー・会話・待機などの解放条件は点線の条件ノードで表示します。名称未提供のゲーム内変数はIDと必要値をそのまま示し、推測でタスク間の関係を作りません。</li>
            <li><strong>データ追従:</strong> 同名の別タスクをID単位で保持し、Icebreaker、Terminal、5.8x42mm弾などを追加しました。</li>
          </ul>
          <p class="small text-warning mb-0">
            Seasonal Characterはシーズンごとにリセットされます。新シーズン開始時は本ツールのSeasonal PvP進捗もリセットしてください。
            Patch 1.1 Season 1 では Kappa Path の取得ができず、Collector 完了は Dawn of a New Era 実績として扱われます。通常 PvP / PvE の Kappa 条件とは別のため、ゲーム内表示を確認してください。
            Storyタブは静的な案内で、KORD BREACH / Boreasの完全な攻略手順ではありません。
          </p>
        </div>
        <!-- パッチアップデート: v3.1.3 -->
        <div class="p-4 rounded border border-success border-2 bg-success bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span class="badge bg-success">FIX</span>
            <h4 class="text-success fw-bold mb-0">
              🛠️ v3.1.3 - データ取得元を JSON API に切り替え
            </h4>
          </div>
          <p class="text-light mb-3">
            上流の tarkov.dev 側で GraphQL API がメンテナンスモードとなり HTTP 503 を返し続けていた問題に対応しました。
            この影響で、キャッシュデータを持たない新規ユーザーの方はデータを取得できず、本ツールを利用できない状態となっていました。ご不便をおかけし、申し訳ありませんでした。
            データ取得元を tarkov.dev の公式 JSON API (<code>json.tarkov.dev</code>) に切り替え、キャッシュデータを持たない新規ユーザーの方も再びデータを読み込めるようになりました。
          </p>
          <ul class="text-light mb-0">
            <li><strong>原因:</strong> tarkov.dev が公式サイトを JSON API に移行済みで、GraphQL API はレガシー/メンテナンスモード扱いとなっており、キャッシュミス時の応答が不安定でした。</li>
            <li><strong>対応:</strong> JSON API を主データソースとして採用し、レガシー GraphQL は JSON API 失敗時の最終フォールバックとしてのみ利用するようにしました。</li>
            <li><strong>影響なし:</strong> 進捗データ・設定・鍵レーティング・配信オーバーレイなどはそのまま引き継がれます。</li>
          </ul>
        </div>

        <!-- マイナーアップデート: v3.1.2 -->
        <div class="p-4 rounded border border-info border-2 bg-info bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <h4 class="text-info fw-bold mb-0">
              🔗 v3.1.2 - URLルーティング & お知らせページの追加
            </h4>
          </div>
          <p class="text-light mb-3">
            各タブに個別の URL を割り当て、ブラウザの戻る／進む・ブックマーク・URL 共有ができるようになりました。<br>
            合わせて、サイトの使い方や運営方針を案内する静的ページ群を追加しています。
          </p>
          <ul class="text-light mb-3">
            <li><strong>🌐 タブの URL 化:</strong> <code>/result</code>, <code>/keys</code>, <code>/flowchart</code> などタブごとに URL が変わるようになり、特定タブを直接ブックマークできます。</li>
            <li><strong>↩️ ブラウザバック対応:</strong> 戻る／進むボタンや、スマホのスワイプ操作でタブを行き来できます。</li>
            <li><strong>📖 お知らせページ追加:</strong> フッターから「<strong>About</strong>」「<strong>使い方</strong>」「<strong>FAQ</strong>」「<strong>プライバシーポリシー</strong>」「<strong>利用規約</strong>」へ移動できます。</li>
            <li><strong>🧹 内部整理:</strong> 旧コード（pre-Vite 時代の遺物）を整理し、ビルドサイズと将来のメンテナンス性を改善しました。</li>
          </ul>
          <div class="small text-info-emphasis bg-info bg-opacity-10 border border-info rounded p-2 mb-0">
            💡 進捗データ・設定・配信オーバーレイの動作はそのまま引き継がれます。
          </div>
        </div>

        <!-- マイナーアップデート: v3.1.0 -->
        <div class="p-4 rounded border border-info border-2 bg-info bg-opacity-10">
          <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
            <h4 class="text-info fw-bold mb-0">
              📺 v3.1.0 - 配信者向けオーバーレイ機能の追加
            </h4>
          </div>
          <p class="text-light mb-3">
            配信（OBS / Streamlabs 等）で現在のタスクを表示できる透過オーバーレイ機能を追加しました。<br>
            設定タブの「<strong>配信者用オーバーレイ</strong>」をONにすると、新タブ「📺 配信オーバーレイ」が表示されます。
          </p>
          <ul class="text-light mb-3">
            <li><strong>📌 ピン留め:</strong> タスク一覧／詳細モーダルの 📌 ボタンで、オーバーレイに表示したいタスクを選べます。</li>
            <li><strong>🔗 オーバーレイウィンドウ:</strong> 設定タブの「オーバーレイURLをコピー」で取得したURLを、OBSの「ブラウザソース」に貼るだけで背景透過表示されます。</li>
            <li><strong>進捗の手動調整:</strong> アイテム収集数やオブジェクティブの完了／未完了を、オーバーレイ設定画面から個別に調整できます。完了済みの項目には取り消し線とチェックが入ります。</li>
            <li><strong>🔗 タスク連続モード:</strong> 完了ボタンを押すと、そのタスクを前提にしていた次のタスクを自動でピン留めする連鎖モードを搭載。</li>
            <li><strong>既存システムと連動:</strong> オーバーレイ側の「✓ 完了」ボタンは、既存のタスク完了チェックと同時に反映されます。</li>
            <li><strong>モード別保存:</strong> ピン留め／進捗は通常PvP／PvE／Seasonal PvPごとに独立して保存されます。</li>
          </ul>
          <div class="small text-info-emphasis bg-info bg-opacity-10 border border-info rounded p-2 mb-0">
            💡 配信をしない方は、設定タブでOFFにしておけば新タブは表示されません。
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
