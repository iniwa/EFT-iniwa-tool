<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="static-page">
        <div class="card">
            <div class="card-body">
                <h2 class="mb-3" style="color: var(--color-accent);">プライバシーポリシー</h2>
                <p class="text-muted" style="font-size: 0.9em;">最終更新: 2026年4月27日</p>

                <section class="mb-4">
                    <h4>1. はじめに</h4>
                    <p>
                        Iniwa's Intel Center（以下「当サイト」）は、利用者のプライバシーを尊重し、適切に取り扱うことを最優先としています。
                        本ポリシーでは、当サイトが利用するブラウザ機能（localStorage、Cookie等）および第三者サービスについて説明します。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>2. localStorage（ローカルストレージ）の利用</h4>
                    <p>
                        当サイトは、利用者の進捗データ（タスクの完了状況、所持鍵、ハイドアウト進捗、各種設定など）を
                        <strong>利用者のブラウザの localStorage に保存します</strong>。これらのデータはサーバーへ送信されることはなく、
                        利用者の端末内にのみ保存されます。
                    </p>
                    <p>
                        localStorage に保存されたデータは、利用者自身がブラウザの設定からいつでも削除できます。
                        また、当サイトの「Export」機能で JSON ファイルとしてダウンロードしてバックアップしたり、
                        「Import」機能で復元したりすることができます。
                    </p>

                    <details class="ls-details">
                        <summary>📂 実際に保存されるキーの一覧（クリックで展開）</summary>
                        <p class="small text-muted mt-2 mb-2">
                            すべて <code>eft_</code> または <code>memo_</code> プレフィックスで始まる key として保存されます。
                            下記の <code>&#123;mode&#125;</code> はゲームモード（<code>pve</code> または <code>pvp</code>）に置き換わります。
                        </p>

                        <h6 class="mt-3">進捗データ（ゲームモードごとに別々に保存）</h6>
                        <ul class="small">
                            <li><code>eft_&#123;mode&#125;_tasks</code> — 完了したタスクの ID 配列</li>
                            <li><code>eft_&#123;mode&#125;_prioritized</code> — 優先タスクの ID 配列</li>
                            <li><code>eft_&#123;mode&#125;_hideout</code> — ハイドアウト各モジュールのレベル</li>
                            <li><code>eft_&#123;mode&#125;_collected</code> — 収集済みアイテムの識別子</li>
                            <li><code>eft_&#123;mode&#125;_keys</code> — 所持している鍵の ID</li>
                            <li><code>eft_&#123;mode&#125;_key_user_data</code> — 鍵ごとの個人レーティング・メモ</li>
                            <li><code>eft_&#123;mode&#125;_wishlist</code> — ウィッシュリストのアイテム</li>
                            <li><code>eft_&#123;mode&#125;_story_progress</code> — ストーリータブの進捗</li>
                            <li><code>eft_&#123;mode&#125;_level</code> — プレイヤーレベル</li>
                        </ul>

                        <h6 class="mt-3">UI 設定（モード横断）</h6>
                        <ul class="small">
                            <li><code>eft_gamemode</code> — 現在のゲームモード（pve / pvp）</li>
                            <li><code>eft_apilang</code> — API 言語（ja / en）</li>
                            <li><code>eft_show_completed</code> / <code>eft_show_future</code> / <code>eft_show_kappa</code> / <code>eft_show_lk</code> / <code>eft_show_maxed_hideout</code> — 表示フィルタの ON/OFF</li>
                            <li><code>eft_show_story_tab</code> — ストーリータブの表示有無</li>
                            <li><code>eft_keys_view_mode</code> / <code>eft_keys_sort_mode</code> — 鍵管理タブのビュー設定</li>
                            <li><code>eft_flowchart_trader</code> — フローチャートで選択中のトレーダー</li>
                            <li><code>eft_ammo_filters</code> — 弾薬チャートで選択中の口径</li>
                            <li><code>eft_story_selected_chapter</code> — ストーリータブで選択中の章</li>
                            <li><code>memo_accordion_state</code> — メモタブの折りたたみ状態</li>
                            <li><code>eft_overlay_enabled</code> / <code>eft_overlay_config</code> — 配信オーバーレイの設定</li>
                        </ul>

                        <h6 class="mt-3">マイグレーション・通知系（自動管理）</h6>
                        <ul class="small">
                            <li><code>eft_mode_data_migrated</code> — モード別ストレージへの移行完了フラグ</li>
                            <li><code>eft_v3_migrated</code> — v2 → v3 データ形式の移行完了フラグ</li>
                            <li><code>eft_notice_last_seen_version</code> — 通知モーダルで「次回アップデートまで非表示」を選択したバージョン</li>
                            <li><code>eft_notice_permanently_hidden</code> — 通知モーダル「今後一切表示しない」フラグ</li>
                        </ul>

                        <p class="small text-muted mt-2 mb-0">
                            これらは <strong>すべて利用者のブラウザ内に保存され</strong>、当サイトのサーバーや
                            その他の外部サービスへは送信されません。
                        </p>
                    </details>
                </section>

                <section class="mb-4">
                    <h4>3. Cookie の利用状況</h4>
                    <p>
                        <strong>当サイトは、現在 Cookie を一切使用していません。</strong>
                        進捗データは前述の localStorage に保存しており、ログイン機能なども無いため Cookie は不要です。
                    </p>

                    <details class="ls-details">
                        <summary>🍪 第三者ドメインを含む詳細（クリックで展開）</summary>
                        <ul class="small mt-2 mb-2">
                            <li><strong>当サイト本体（efttool.iniwach.com）</strong>: Cookie を発行・送信しません。</li>
                            <li><strong>アクセス解析（Umami）</strong>: Cookie を使用しません（次節参照）。</li>
                            <li>
                                <strong>外部リンク先（X / Google フォーム / tarkov.dev 等）</strong>:
                                リンクをクリックして遷移した先のドメインで、各社のポリシーに基づき Cookie が利用される可能性があります。
                                これらは当サイト経由で送信される情報ではなく、当サイトでは関知できません。
                            </li>
                            <li>
                                <strong>CDN（Cloudflare）</strong>: 当サイトは Cloudflare Pages 上でホストされています。
                                Cloudflare が DDoS 対策やボット判定のため、まれに <code>__cf_bm</code> 等の機能性 Cookie を一時的に発行する場合があります。
                                これらはトラッキング目的ではなく、利用者を識別するためのものではありません。
                            </li>
                        </ul>
                        <p class="small text-muted mt-2 mb-0">
                            将来 Google AdSense 等の広告サービスを導入する場合は、Cookie 同意バナー（CMP）を表示し、
                            利用者の同意を得てからのみ広告関連 Cookie を発行します（後述の第5節を参照）。
                        </p>
                    </details>
                </section>

                <section class="mb-4">
                    <h4>4. アクセス解析ツール（Umami）</h4>
                    <p>
                        当サイトでは、利用状況の把握のためにオープンソースのアクセス解析ツール
                        <a href="https://umami.is/" target="_blank" rel="noopener">Umami</a>（運営者が自前のサーバーでホスト）を利用しています。
                        Umami は <strong>Cookie を使用せず、個人を特定する情報を収集しません</strong>。
                    </p>

                    <details class="ls-details">
                        <summary>📊 Umami が収集する情報の詳細（クリックで展開）</summary>
                        <ul class="small mt-2 mb-0">
                            <li>ページ／タブの閲覧数</li>
                            <li>リファラ（参照元 URL）</li>
                            <li>ブラウザ・OS・デバイスの種類（バージョン情報を含まない概要のみ）</li>
                            <li>大まかなアクセス国／地域（IP アドレスは保存せず即座に破棄）</li>
                            <li>タブ切替イベント（イベント名: <code>Tab Switch</code>、プロパティ: 切替先のルート名）</li>
                        </ul>
                    </details>
                </section>

                <section class="mb-4">
                    <h4>5. 第三者サービスへの情報提供（広告について）</h4>
                    <p>
                        <strong>現時点では当サイトは広告を配信していません。</strong>
                        ただし、将来的に Google AdSense 等の第三者広告配信サービスを導入する可能性があります。
                        導入時には、本ポリシーを更新したうえで以下の対応を実施します：
                    </p>
                    <ul>
                        <li>広告クッキーの利用について Cookie 同意バナー（CMP）で明示的に同意を取得</li>
                        <li>EU/英国／日本の改正電気通信事業法（外部送信規律）への対応</li>
                        <li>利用者が広告のパーソナライズをオプトアウトできる手段の案内</li>
                    </ul>
                    <p>
                        Google による広告配信が開始された場合、Google および第三者ベンダーは Cookie を使用して、
                        利用者の本サイトおよび他のサイトへのアクセス情報に基づいて広告を配信することがあります。
                        Google の広告における Cookie 使用については、
                        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google の広告ポリシー</a>
                        をご参照ください。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>6. 外部リンク・外部API</h4>
                    <p>
                        当サイトは以下の外部サービスを利用しています：
                    </p>
                    <ul>
                        <li><a href="https://tarkov.dev" target="_blank" rel="noopener">tarkov.dev GraphQL API</a> — ゲームデータの取得（個人情報は送信しません）</li>
                        <li>X (Twitter)、Google フォーム等への外部リンク</li>
                    </ul>
                    <p>
                        外部リンク先のサイトでの個人情報の取り扱いについては、当サイトは責任を負いません。
                        各リンク先のプライバシーポリシーを確認してください。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>7. お問い合わせ</h4>
                    <p>
                        プライバシーに関するお問い合わせは、
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScFPBXovafedEgQY10uTH1vAbyOA9r1l6kurIfkTuwN64eyqA/viewform?usp=dialog"
                            target="_blank" rel="noopener">📮 意見箱（Google フォーム）</a>
                        または <a href="https://twitter.com/iniwach" target="_blank" rel="noopener">@iniwach</a> 宛てにご連絡ください。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>8. 改定について</h4>
                    <p>
                        本プライバシーポリシーは、サービスの改善や法令の変更に伴い予告なく改定されることがあります。
                        重要な変更がある場合は、サイト上で告知します。
                    </p>
                </section>

                <p class="text-end">
                    <RouterLink to="/" class="btn btn-sm btn-outline-info">← ツールに戻る</RouterLink>
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
.static-page h6 {
    color: var(--color-accent);
    margin-bottom: 0.4em;
}
.static-page a {
    color: var(--color-info);
}
.static-page code {
    background: var(--bg-input);
    color: var(--color-accent);
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 0.9em;
}
.ls-details {
    margin-top: 1em;
    background: var(--bg-card-header);
    border: 1px solid var(--border-light);
    border-radius: 4px;
    padding: 10px 16px;
}
.ls-details[open] {
    background: var(--bg-input);
    border-color: var(--color-accent);
}
.ls-details summary {
    cursor: pointer;
    font-weight: bold;
    color: var(--color-text);
    list-style: none;
    position: relative;
    padding-left: 1.5em;
}
.ls-details summary::before {
    content: '▶';
    position: absolute;
    left: 0;
    color: var(--color-accent);
    transition: transform 0.2s;
    display: inline-block;
}
.ls-details[open] summary::before {
    transform: rotate(90deg);
}
.ls-details summary::-webkit-details-marker {
    display: none;
}
.ls-details ul {
    margin-bottom: 0;
}
</style>
