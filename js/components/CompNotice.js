// js/components/CompNotice.js

const CompNotice = {
    props: ['appVersion'],
    data() {
        return {
            isVisible: false,
            step: 1
        };
    },
    mounted() {
        this.checkVisibility();
    },
    methods: {
        checkVisibility() {
            // 1. 永久非表示フラグの確認
            const permHidden = localStorage.getItem('eft_notice_permanently_hidden');
            if (permHidden === 'true') {
                this.isVisible = false;
                return;
            }

            // 2. バージョン確認
            const lastSeenVersion = localStorage.getItem('eft_notice_last_seen_version');
            
            // v2.0.0を見た人にはv2.0.1の自動表示はしない（パッチバージョンの違いは無視）
            const isSameMajorMinor = (v1, v2) => {
                if (!v1 || !v2) return false;
                const p1 = v1.split('.');
                const p2 = v2.split('.');
                if (p1.length >= 2 && p2.length >= 2) {
                    return p1[0] === p2[0] && p1[1] === p2[1];
                }
                return v1 === v2;
            };

            if (isSameMajorMinor(lastSeenVersion, this.appVersion)) {
                this.isVisible = false;
                return;
            }

            this.isVisible = true;
        },

        show() {
            this.isVisible = true;
        },

        closeOnce() {
            this.isVisible = false;
        },

        closeUntilNextUpdate() {
            localStorage.setItem('eft_notice_last_seen_version', this.appVersion);
            this.isVisible = false;
        },

        closePermanently() {
            if (confirm('今後、アップデートのお知らせを含め、この画面を一切表示しなくなります。よろしいですか？\n(設定をリセットするにはブラウザのデータをクリアする必要があります)')) {
                localStorage.setItem('eft_notice_permanently_hidden', 'true');
                this.isVisible = false;
            }
        }
    },
    template: `
    <div v-if="isVisible" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.85); z-index: 2000;">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content bg-dark text-white border-info shadow-lg">
                <div class="modal-header border-secondary bg-black bg-opacity-50">
                    <h5 class="modal-title text-info">🎉 アップデートのお知らせ (v{{ appVersion }})</h5>
                    <button type="button" class="btn-close btn-close-white" @click="closeOnce"></button>
                </div>
                <div class="modal-body">
                    <div class="vstack gap-4">
                        
                        <div class="bg-info bg-opacity-10 p-2 rounded border border-info">
                            <h6 class="text-info small mb-1">🔄 v2.0.2 Update (Minor Fix)</h6>
                            <ul class="list-unstyled small text-light mb-0 ps-1">
                                <li>・「鍵管理」画面にて、Wikiボタンが表示されない不具合を修正</li>
                                <li>・アイテム検索機能にて、他タブから戻ってきた時も検索状況を保持するように改善 (v2.0.1)</li>
                            </ul>
                        </div>

                        <div>
                            <h6 class="text-warning border-bottom border-secondary pb-2">
                                ⚔️ PvP / PvE & 🌐 JP / EN 切り替え (v2.0.0)
                            </h6>
                            <p class="small text-light">
                                画面右上のヘッダーから、ゲームモード（PvP/PvE）と言語（日本語/英語）を切り替えられるようになりました。<br>
                                選択したモードに応じて、タスクの要件やアイテム価格が自動的に切り替わります。
                            </p>
                        </div>

                        <div>
                            <h6 class="text-success border-bottom border-secondary pb-2">
                                🔍 アイテム図鑑 & 逆引き検索 (v2.0.0)
                            </h6>
                            <p class="small text-light">
                                新しいタブ「アイテム検索」を追加しました。アイテム名で検索し、以下の情報を確認できます。
                            </p>
                            <ul class="small text-muted">
                                <li>使用するタスク / 隠れ家 / 交換レシピ（逆引き）</li>
                                <li><strong>トレーダー最高買取価格</strong> と <strong>24時間平均フレア価格</strong></li>
                                <li>アイテム自体の入手方法（交換/購入）</li>
                            </ul>
                            <p class="small text-warning">
                                ※ フレア価格は「リアルタイム」ではなく「過去24時間の平均値」です。目安としてご利用ください。
                            </p>
                        </div>

                        <div>
                            <h6 class="text-secondary border-bottom border-secondary pb-2">
                                🤖 チャット機能について
                            </h6>
                            <p class="small text-light">
                                「チャット」タブはデフォルトで非表示になりました。<br>
                                利用される場合は、<strong>「🐞 デバッグ」タブの左下にあるスイッチをON</strong>にしてください。
                            </p>
                        </div>

                        <div>
                            <h6 class="text-info border-bottom border-secondary pb-2">
                                🗺️ フローチャート：初期設定モード (v2.0.0)
                            </h6>
                            <p class="small text-light">
                                フローチャート画面に「初期設定モード」を追加しました。<br>
                                これをONにしてタスクをクリックすると、<strong>その前提タスクを含めて一括で完了状態</strong>にできます。<br>
                                ツールの使い始めや、ワイプ後の進捗入力が劇的に楽になります。
                            </p>
                        </div>

                        <div class="bg-secondary bg-opacity-10 p-3 rounded border border-secondary">
                            <h6 class="text-white mb-3">📢 開発者からのお願い</h6>
                            
                            <p class="small">
                                <strong>📮 ご意見・不具合報告</strong><br>
                                ページ最下部（フッター）の「ご意見箱」より、Googleフォーム経由で匿名にて送信いただけます。<br>
                                どのような方が利用されているか把握するため、簡単なアンケートにもご協力いただけると励みになります！
                            </p>

                            <hr class="border-secondary">

                            <p class="small mb-0">
                                <strong>☕ 将来的な広告設置について</strong><br>
                                今後の運営維持のため、Google AdSenseによる広告設置を目標としています。<br>
                                操作の邪魔にならないよう細心の注意を払って配置する予定ですので、何卒ご理解いただけますと幸いです。
                            </p>
                        </div>

                    </div>
                </div>
                <div class="modal-footer border-secondary flex-column align-items-stretch">
                    <button type="button" class="btn btn-primary w-100 mb-2" @click="closeUntilNextUpdate">
                        OK（次回アップデートまで非表示）
                    </button>
                    <div class="d-flex justify-content-between w-100">
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="closeOnce">
                            閉じる（再訪時も表示）
                        </button>
                        <button type="button" class="btn btn-sm btn-link text-muted text-decoration-none" @click="closePermanently">
                            今後一切表示しない
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};