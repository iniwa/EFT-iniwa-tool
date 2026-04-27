<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="static-page">
        <div class="card">
            <div class="card-body">
                <h2 class="mb-3" style="color: var(--color-accent);">利用規約</h2>
                <p class="text-muted" style="font-size: 0.9em;">最終更新: 2026年4月27日</p>

                <section class="mb-4">
                    <h4>第1条（本規約の適用）</h4>
                    <p>
                        本利用規約（以下「本規約」）は、Iniwa が提供する Webサービス
                        「Iniwa's Intel Center」（以下「本サービス」）の利用条件を定めるものです。
                        利用者は本サービスを利用することにより、本規約に同意したものとみなされます。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>第2条（本サービスの内容）</h4>
                    <p>
                        本サービスは、ゲーム『Escape from Tarkov』のプレイヤーが
                        タスク・ハイドアウト・鍵・弾薬等の進捗を管理することを目的とした
                        <strong>非公式の管理ツール</strong>です。
                        Battlestate Games および Escape from Tarkov の公式とは一切関係ありません。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>第3条（無償提供と保証の否認）</h4>
                    <p>
                        本サービスは無償で提供されます。
                        運営者は、本サービスの内容について正確性・完全性・有用性を保証するものではなく、
                        本サービスの利用または利用不能から生じるいかなる損害についても責任を負いません。
                    </p>
                    <p>
                        ゲーム内アイテムや鍵の必要数、レーティング、ストーリー情報等は
                        外部API（tarkov.dev）およびコミュニティ情報を元にした<strong>参考値</strong>であり、
                        ゲーム本体のアップデート等により実際と異なる場合があります。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>第4条（データの取り扱い）</h4>
                    <p>
                        利用者の進捗データはブラウザの localStorage にのみ保存されます。
                        ブラウザのキャッシュ／データ削除、シークレットモードの利用、別端末・別ブラウザでの利用などにより
                        データが失われる可能性があります。
                        重要なデータは Export 機能で定期的にバックアップすることを強く推奨します。
                        運営者はデータの消失について一切責任を負いません。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>第5条（禁止事項）</h4>
                    <p>利用者は、本サービスの利用にあたり以下の行為をしてはなりません。</p>
                    <ul>
                        <li>本サービスのサーバー・APIに対する過度な負荷をかける行為（短時間の大量アクセス、自動化スクリプトでの連続データ取得など）</li>
                        <li>本サービスのソースコード・データ・UIを無断で複製・再配布・販売する行為</li>
                        <li>法令または公序良俗に違反する行為</li>
                        <li>第三者または運営者の権利・財産を侵害する行為</li>
                        <li>本サービスの運営を妨害する行為</li>
                    </ul>
                </section>

                <section class="mb-4">
                    <h4>第6条（外部サービスの利用）</h4>
                    <p>
                        本サービスは tarkov.dev API、Umami（自前ホスト）、Google フォーム等の外部サービスを利用しています。
                        将来的に Google AdSense 等の広告サービスを導入する可能性があります。
                        各サービスの利用条件・プライバシーポリシーは各提供元に従います。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>第7条（サービスの変更・停止）</h4>
                    <p>
                        運営者は、利用者への事前通知なく本サービスの内容を変更したり、提供を停止することができます。
                        これに伴って利用者または第三者に生じた損害について、運営者は責任を負いません。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>第8条（規約の変更）</h4>
                    <p>
                        本規約は、運営者の判断により予告なく変更されることがあります。
                        変更後の本規約は、本サービス上に掲示された時点で効力を生じます。
                    </p>
                </section>

                <section class="mb-4">
                    <h4>第9条（準拠法・管轄）</h4>
                    <p>
                        本規約の解釈および本サービスに関する紛争については、日本法を準拠法とし、
                        運営者の住所地を管轄する裁判所を専属的合意管轄裁判所とします。
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
