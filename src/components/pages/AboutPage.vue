<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="static-page">
        <div class="card">
            <div class="card-body">
                <h2 class="mb-3" style="color: var(--color-accent);">About — Iniwa's Intel Center について</h2>

                <section class="mb-4">
                    <h4>このサイトは何？</h4>
                    <p>
                        <strong>Iniwa's Intel Center</strong> は、
                        オンラインFPS『<a href="https://www.escapefromtarkov.com/" target="_blank" rel="noopener">Escape from Tarkov</a>』のプレイヤー向けに、
                        タスク・ハイドアウト・鍵・弾薬・トレーダー納品アイテムなどを一括で管理できる
                        <strong>非公式の進捗管理ツール</strong>です。
                    </p>
                    <p>
                        ブラウザ上で動作するスタティックなWebアプリで、
                        進捗データは利用者の端末の <code>localStorage</code> にのみ保存されます。
                        サーバー側に個人情報やプレイ履歴を保存する仕組みはありません。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>主な機能</h4>
                    <ul>
                        <li>タスク／ハイドアウトの進捗チェック</li>
                        <li>納品に必要な FIR (インレイド) アイテムの自動集計</li>
                        <li>鍵の必要数・所持状況の管理（レーティング登録対応）</li>
                        <li>弾薬の威力比較チャート</li>
                        <li>トレーダー別アイテム検索</li>
                        <li>タスク前提条件のフローチャート表示</li>
                        <li>OBS等での配信向けオーバーレイ表示</li>
                        <li>進捗データの Export / Import (JSON)</li>
                    </ul>
                </section>

                <section class="mb-4">
                    <h4>運営者</h4>
                    <p>
                        個人開発者 <strong>Iniwa</strong> が運営しています。
                    </p>
                    <ul>
                        <li>X (Twitter): <a href="https://twitter.com/iniwach" target="_blank" rel="noopener">@iniwach</a></li>
                        <li>意見・要望・不具合報告: <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScFPBXovafedEgQY10uTH1vAbyOA9r1l6kurIfkTuwN64eyqA/viewform?usp=dialog"
                            target="_blank" rel="noopener">📮 意見箱（Google フォーム）</a></li>
                    </ul>
                </section>

                <section class="mb-4">
                    <h4>データの出典</h4>
                    <ul>
                        <li>タスク・ハイドアウト・アイテム情報: <a href="https://tarkov.dev" target="_blank" rel="noopener">tarkov.dev</a> の GraphQL API</li>
                        <li>鍵レーティング: コミュニティの慣習的なランク付けを参考に、運営者の主観で初期値を設定</li>
                        <li>ストーリーデータ: 各種 Wiki／プレイヤー有志のまとめを参照</li>
                    </ul>
                    <p class="text-muted" style="font-size: 0.9em;">
                        ゲーム本体および各種商標は Battlestate Games に帰属します。本サイトは Battlestate Games とは無関係の非公式ツールです。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>関連ページ</h4>
                    <ul>
                        <li><RouterLink to="/guide">使い方ガイド</RouterLink></li>
                        <li><RouterLink to="/faq">よくある質問 (FAQ)</RouterLink></li>
                        <li><RouterLink to="/privacy">プライバシーポリシー</RouterLink></li>
                        <li><RouterLink to="/terms">利用規約</RouterLink></li>
                    </ul>
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
.static-page code {
    background: var(--bg-input);
    color: var(--color-accent);
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 0.9em;
}
</style>
