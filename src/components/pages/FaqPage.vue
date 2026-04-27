<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="static-page">
        <div class="card">
            <div class="card-body">
                <h2 class="mb-3" style="color: var(--color-accent);">よくある質問 (FAQ)</h2>
                <p class="text-muted">
                    利用者の方からよく寄せられる質問と回答をまとめています。
                </p>

                <!-- ============== 基本 ============== -->
                <h3 class="section-title">📌 基本について</h3>

                <details class="qa">
                    <summary>Q. このサイトは公式ツールですか？</summary>
                    <p>
                        いいえ、<strong>非公式の個人運営ツール</strong>です。
                        ゲーム本体および各種商標は Battlestate Games に帰属します。本サイトは公式とは無関係です。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. 利用料はかかりますか？</summary>
                    <p>
                        無料でご利用いただけます。会員登録やログインは不要です。
                        将来的に運営費用補填のため広告を掲載する可能性がありますが、機能制限のための課金プランを設ける予定はありません。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. どんなブラウザに対応していますか？</summary>
                    <p>
                        Chrome / Edge / Firefox / Safari の最新版で動作確認しています。
                        Internet Explorer は非対応です。スマートフォンのブラウザでも動作しますが、画面が広いほうが使いやすい設計になっています。
                    </p>
                </details>

                <!-- ============== 用語 ============== -->
                <h3 class="section-title">📚 用語の解説</h3>

                <details class="qa">
                    <summary>Q. 「FIR」とは？</summary>
                    <p>
                        <strong>Found In Raid</strong> の略で「レイド内で入手したアイテム」のフラグを指します。
                        タスクやハイドアウトの納品で「FIR必須」と書かれているアイテムは、
                        フリマやトレーダーで購入したものは納品できず、自分でレイド中に拾って生還したアイテムだけが有効です。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. 「Kappa（カッパ）」とは？</summary>
                    <p>
                        Fence のクエスト「Collector」を完了するともらえる
                        <strong>Kappa Secure Container（最大サイズの安全ポーチ）</strong>のことです。
                        多くの上級者プレイヤーが目指すゴールで、本ツールでも Collector 用納品アイテムを別カテゴリで集計しています。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. 「ライトキーパー (Lightkeeper / LK)」とは？</summary>
                    <p>
                        ゲーム後半に登場する <strong>10人目のトレーダー</strong>です。
                        Lightkeeper のタスクを進めるには複数の前提条件と特殊な鍵が必要になります。
                        鍵管理タブのプリセットに「Lightkeeper 用」セットがあります。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. 鍵レーティングの SS / S / A ... って何？</summary>
                    <p>
                        運営者の主観による<strong>鍵の有用度ランク</strong>です。SSが最も価値が高く、Fは事実上不要を意味します。
                        プレイスタイル（PvE中心 / 純粋なルート狙い / カッパ目指す等）で評価は変わるので、
                        鍵管理タブから自分用に書き換えできます。
                    </p>
                </details>

                <!-- ============== トラブルシューティング ============== -->
                <h3 class="section-title">🛠️ トラブルシューティング</h3>

                <details class="qa">
                    <summary>Q. 進捗データが消えてしまいました。復元できますか？</summary>
                    <p>
                        申し訳ありませんが、データは利用者のブラウザ内（localStorage）にのみ保存されており、
                        サーバーにはバックアップが残っていません。<strong>復元はできません。</strong>
                    </p>
                    <p>
                        今後の対策として、ヘッダー右上の <kbd>Export</kbd> ボタンで
                        定期的に JSON ファイルをダウンロードしてバックアップすることを強く推奨します。
                        端末を変える際や、ブラウザのデータ削除をする前にも Export しておくと安全です。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. データ更新ボタンを押しても更新されません</summary>
                    <p>
                        tarkov.dev API には <strong>5分間のレート制限</strong>を設けています。
                        前回の更新から5分以内は再取得できません。少し待ってから再度お試しください。
                    </p>
                    <p>
                        5分以上経っても更新されない場合は、ブラウザのコンソール（F12 キーで開く）にエラーが出ていないか確認してください。
                        tarkov.dev 側のメンテナンス時にも一時的に更新できないことがあります。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. 一部のアイテム名が英語のままです</summary>
                    <p>
                        tarkov.dev の翻訳データに依存しているため、新しいアイテムや一部の固有名詞は
                        日本語化されていない場合があります。これはツール側の問題ではなく、データソースの状態によるものです。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. PvE と PvP でタスクの解放条件が違いますが対応していますか？</summary>
                    <p>
                        対応しています。ヘッダーで PvE / PvP を切り替えると、それぞれのモードに応じたデータを取得します。
                        進捗は <strong>モードごとに別々に保存</strong> されるため、両方プレイしている方も問題なく管理できます。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. プレイヤーレベルを設定するとどうなりますか？</summary>
                    <p>
                        自分のレベル以上を要求するタスクが薄く表示されます。
                        0 にすると全タスクをそのまま表示します。レベル制限を意識せず先のタスクも見たい場合は 0 推奨です。
                    </p>
                </details>

                <!-- ============== 配信・SNS ============== -->
                <h3 class="section-title">📺 配信・その他</h3>

                <details class="qa">
                    <summary>Q. 配信で使ってもいいですか？</summary>
                    <p>
                        もちろん大歓迎です！ぜひ <a href="https://twitter.com/iniwach" target="_blank" rel="noopener">@iniwach</a>
                        を付けてシェアいただけると嬉しいです。
                        OBS のブラウザソースで使える透過オーバーレイ機能もあります（📺 配信オーバーレイタブ）。
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. 不具合や要望はどこに報告すればいいですか？</summary>
                    <p>
                        フッターの <strong>📮 意見箱（Google フォーム）</strong> から送信してください。
                        匿名で送信できます。X (Twitter) の DM でも受け付けています：
                        <a href="https://twitter.com/iniwach" target="_blank" rel="noopener">@iniwach</a>
                    </p>
                </details>

                <details class="qa">
                    <summary>Q. 自分でも似たツールを作りたいです。ソースは公開されていますか？</summary>
                    <p>
                        本サービスのコードは個人開発のため、現時点でリポジトリの公開は予定していません。
                        ただし、tarkov.dev API は誰でも使える公開 API なので、独自に実装することは可能です。
                        実装の参考にしたい点があればお気軽にご連絡ください。
                    </p>
                </details>

                <p class="text-center mt-5">
                    <RouterLink to="/guide" class="btn btn-sm btn-outline-info me-2">← 使い方ガイドに戻る</RouterLink>
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
.section-title {
    color: var(--color-accent);
    border-bottom: 2px solid var(--border-light);
    padding-bottom: 6px;
    margin-top: 2em;
    margin-bottom: 1em;
    font-size: 1.3em;
}
.qa {
    background: var(--bg-card-header);
    border: 1px solid var(--border-light);
    border-radius: 4px;
    padding: 12px 18px;
    margin-bottom: 10px;
    transition: background-color 0.2s;
}
.qa[open] {
    background: var(--bg-input);
    border-color: var(--color-accent);
}
.qa summary {
    cursor: pointer;
    font-weight: bold;
    color: var(--color-text);
    list-style: none;
    position: relative;
    padding-left: 1.5em;
}
.qa summary::before {
    content: '▶';
    position: absolute;
    left: 0;
    color: var(--color-accent);
    transition: transform 0.2s;
    display: inline-block;
}
.qa[open] summary::before {
    transform: rotate(90deg);
}
.qa summary::-webkit-details-marker {
    display: none;
}
.qa p {
    margin-top: 10px;
    margin-bottom: 0;
    color: var(--color-text-secondary);
}
.qa a {
    color: var(--color-info);
}
.qa kbd {
    background: var(--bg-input);
    color: var(--color-accent);
    padding: 2px 8px;
    border-radius: 3px;
    border: 1px solid var(--border-light);
    font-size: 0.9em;
}
</style>
