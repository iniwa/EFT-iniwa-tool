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
                </section>

                <section class="mb-4">
                    <h4>3. アクセス解析ツール（Umami）</h4>
                    <p>
                        当サイトでは、利用状況の把握のためにオープンソースのアクセス解析ツール
                        <a href="https://umami.is/" target="_blank" rel="noopener">Umami</a>（運営者が自前のサーバーでホスト）を利用しています。
                        Umami は <strong>Cookie を使用せず、個人を特定する情報を収集しません</strong>。
                        収集される情報は以下の通りです：
                    </p>
                    <ul>
                        <li>ページ／タブの閲覧数</li>
                        <li>リファラ（参照元URL）</li>
                        <li>ブラウザ・OS・デバイスの種類（バージョン情報を含まない概要のみ）</li>
                        <li>大まかなアクセス国／地域（IPアドレスは保存せず即座に破棄）</li>
                    </ul>
                </section>

                <section class="mb-4">
                    <h4>4. 第三者サービスへの情報提供（広告について）</h4>
                    <p>
                        <strong>現時点では当サイトは広告を配信していません。</strong>
                        ただし、将来的に Google AdSense 等の第三者広告配信サービスを導入する可能性があります。
                        導入時には、本ポリシーを更新したうえで以下の対応を実施します：
                    </p>
                    <ul>
                        <li>広告クッキーの利用について Cookie 同意バナーで明示的に同意を取得</li>
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
                    <h4>5. 外部リンク・外部API</h4>
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
                    <h4>6. お問い合わせ</h4>
                    <p>
                        プライバシーに関するお問い合わせは、
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScFPBXovafedEgQY10uTH1vAbyOA9r1l6kurIfkTuwN64eyqA/viewform?usp=dialog"
                            target="_blank" rel="noopener">📮 意見箱（Google フォーム）</a>
                        または <a href="https://twitter.com/iniwach" target="_blank" rel="noopener">@iniwach</a> 宛てにご連絡ください。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>7. 改定について</h4>
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
.static-page a {
    color: var(--color-info);
}
</style>
