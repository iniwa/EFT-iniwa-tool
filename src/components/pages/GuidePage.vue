<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="static-page">
        <div class="card">
            <div class="card-body">
                <h2 class="mb-3" style="color: var(--color-accent);">使い方ガイド</h2>
                <p class="text-muted">
                    Iniwa's Intel Center の基本的な使い方を、初めての方向けに順を追って説明します。
                </p>

                <nav class="toc mb-4">
                    <strong>目次</strong>
                    <ol>
                        <li><a href="#step1">最初の設定</a></li>
                        <li><a href="#step2">タスクの完了をチェックする</a></li>
                        <li><a href="#step3">必要なアイテムを確認する</a></li>
                        <li><a href="#step4">鍵を管理する</a></li>
                        <li><a href="#step5">フローチャートでタスク前提を見る</a></li>
                        <li><a href="#step6">弾薬チャート／アイテム検索</a></li>
                        <li><a href="#step7">データのバックアップ</a></li>
                        <li><a href="#step8">配信オーバーレイ</a></li>
                    </ol>
                </nav>

                <section id="step1" class="mb-4">
                    <h4>1. 最初の設定</h4>
                    <p>
                        画面上部のヘッダーで <strong>ゲームモード（PvE/PvP）</strong>、<strong>API言語（JP/EN）</strong>、
                        <strong>プレイヤーレベル（Lv）</strong> を設定します。
                    </p>
                    <ul>
                        <li><strong>ゲームモード:</strong> PvE と PvP（旧 regular）でタスクの解放条件が異なるため、自分のモードを選んでください。</li>
                        <li><strong>API言語:</strong> JP を選ぶと tarkov.dev の日本語データを取得します。一部の固有名詞は英語のまま表示されることがあります。</li>
                        <li><strong>プレイヤーレベル:</strong> 0 にするとレベル制限を無視して全タスクを表示します。自分のレベルを入れると、未解放タスクが薄く表示されます。</li>
                    </ul>
                    <p>
                        右上の <kbd>🔄 データ更新</kbd> ボタンで最新のゲームデータを取得します。
                        tarkov.dev API への負荷を抑えるため、本ツールでは <strong>5分間隔のクールダウン</strong>を自主的に設けています。
                        前回の更新から5分以内は再取得できません。
                    </p>
                </section>

                <section id="step2" class="mb-4">
                    <h4>2. タスクの完了をチェックする <small class="text-muted">📝 進捗入力タブ</small></h4>
                    <p>
                        トレーダーごとにタスクが一覧表示されます。完了したタスクの左端のチェックボックスをクリックしてください。
                    </p>
                    <ul>
                        <li>タスク名をクリックすると、必要アイテムや報酬の詳細モーダルが開きます。</li>
                        <li>前提タスクが未完了のものは薄く表示されます。</li>
                        <li>進捗は自動でブラウザに保存されます（保存ボタンは不要）。</li>
                    </ul>
                </section>

                <section id="step3" class="mb-4">
                    <h4>3. 必要なアイテムを確認する <small class="text-muted">📦 必要なアイテムタブ</small></h4>
                    <p>
                        未完了タスクと未建設ハイドアウトから必要なアイテムを自動集計します。
                    </p>
                    <ul>
                        <li><strong>FIR (Found In Raid)：</strong> レイド内で拾う必要があるアイテム（インレイドフラグ付き）。バッジが付いて区別できます。</li>
                        <li><strong>購入で可：</strong> トレーダーやフリマで買って納品できるアイテム。</li>
                        <li><strong>Collector：</strong> Fence のタスク「Collector」用の最終納品アイテム（FIR必須）。</li>
                        <li>各アイテムをクリックするとチェックが入り、「収集済み」として線が引かれます。</li>
                        <li>アイテム名の横のリンクからソースタスクへジャンプできます。</li>
                    </ul>
                </section>

                <section id="step4" class="mb-4">
                    <h4>4. 鍵を管理する <small class="text-muted">🔑 鍵管理タブ</small></h4>
                    <p>
                        タスク・ハイドアウト達成に有用な鍵をマップごとに整理しています。
                    </p>
                    <ul>
                        <li>鍵行をクリックすると「所持済み」になり、青っぽい色でハイライトされます。</li>
                        <li>レーティング（SS/S/A/B/C/D/E/F）は当ツールの主観評価です。プレイスタイルに応じてご自身で書き換えできます。</li>
                        <li>「所持のみ表示」「ソート: 所持優先 / レーティング順」など表示モードを切り替え可能。</li>
                        <li>プリセット読込で <strong>カッパ取得用最低限セット</strong> や <strong>ライトキーパー用</strong> など用途別に一括選択できます。</li>
                    </ul>
                </section>

                <section id="step5" class="mb-4">
                    <h4>5. フローチャートでタスク前提を見る <small class="text-muted">🗺️ フローチャートタブ</small></h4>
                    <p>
                        トレーダーを選ぶと、そのトレーダーのタスク間の依存関係をフローチャートで可視化します。
                        各ノードをクリックするとタスク詳細が開きます。完了済みタスクは緑色になります。
                    </p>
                </section>

                <section id="step6" class="mb-4">
                    <h4>6. 弾薬チャート／アイテム検索</h4>
                    <ul>
                        <li><strong>🔫 弾薬タブ:</strong> 口径ごとに弾薬の威力・貫通力・装弾数を比較できます。グラフでも一覧表でも確認可能。</li>
                        <li><strong>🔍 アイテム検索タブ:</strong> アイテム名で検索し、トレーダーやフリマでの最高買取価格・最安購入元を確認できます。</li>
                    </ul>
                </section>

                <section id="step7" class="mb-4">
                    <h4>7. データのバックアップ <small class="text-danger">重要</small></h4>
                    <p>
                        進捗はブラウザの localStorage に保存されますが、
                        以下のケースで <strong>データが失われる可能性があります</strong>：
                    </p>
                    <ul>
                        <li>ブラウザの「閲覧履歴・データの削除」を実行した場合</li>
                        <li>シークレット／プライベートモードでアクセスした場合</li>
                        <li>別の端末やブラウザに移行した場合</li>
                        <li>ストレージの容量制限に達した場合</li>
                    </ul>
                    <p>
                        ヘッダー右上の <kbd>Export</kbd> ボタンで定期的に JSON ファイルをダウンロードしてバックアップしてください。
                        新しい端末では <kbd>Import</kbd> でその JSON を読み込めば進捗を復元できます。
                    </p>
                </section>

                <section id="step8" class="mb-4">
                    <h4>8. 配信オーバーレイ</h4>
                    <p>
                        OBS 等の配信ソフトでブラウザソースとして使える <strong>透過オーバーレイ</strong> を表示できます。
                    </p>
                    <ol>
                        <li>📺 配信オーバーレイタブ（最初は非表示。設定から有効化）で表示する項目を選びます。</li>
                        <li>表示された URL を OBS のブラウザソースに登録します。</li>
                        <li>本体の進捗を更新すると、オーバーレイにも自動反映されます。</li>
                    </ol>
                </section>

                <p class="text-center mt-5">
                    <RouterLink to="/faq" class="btn btn-sm btn-outline-info me-2">よくある質問はこちら →</RouterLink>
                    <RouterLink to="/" class="btn btn-sm btn-outline-warning">ツールを使う</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.static-page {
    max-width: 900px;
    margin: 0 auto;
    line-height: 1.7;
}
.static-page h4 {
    color: var(--color-accent);
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 4px;
    margin-top: 1em;
}
.static-page a {
    color: var(--color-info);
}
.static-page kbd {
    background: var(--bg-input);
    color: var(--color-accent);
    padding: 2px 8px;
    border-radius: 3px;
    border: 1px solid var(--border-light);
    font-size: 0.9em;
}
.static-page .toc {
    background: var(--bg-card-header);
    padding: 12px 20px;
    border-radius: 4px;
    border-left: 3px solid var(--color-accent);
}
.static-page .toc ol {
    margin-bottom: 0;
}
.static-page .toc a {
    color: var(--color-text-secondary);
    text-decoration: none;
}
.static-page .toc a:hover {
    color: var(--color-info);
    text-decoration: underline;
}
</style>
