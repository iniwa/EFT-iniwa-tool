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
            const permHidden = localStorage.getItem('eft_notice_permanently_hidden');
            if (permHidden === 'true') {
                this.isVisible = false;
                return;
            }
            const lastSeenVersion = localStorage.getItem('eft_notice_last_seen_version');
            if (lastSeenVersion === this.appVersion) {
                this.isVisible = false;
                return;
            }
            this.isVisible = true;
        },
        
        // ★追加: 外部（フッター）から呼び出して再表示するためのメソッド
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
                    <h5 class="modal-title text-info">🎉 大型アップデートのお知らせ (v{{ appVersion }})</h5>
                    <button type="button" class="btn-close btn-close-white" @click="closeOnce"></button>
                </div>
                <div class="modal-body">
                    <div class="vstack gap-4">
                        
                        <div>
                            <h6 class="text-warning border-bottom border-secondary pb-2">
                                ⚔️ PvP / PvE & 🌐 JP / EN 切り替え
                            </h6>
                            <p class="small text-light">
                                画面右上のヘッダーから、ゲームモード（PvP/PvE）と言語（日本語/英語）を切り替えられるようになりました。<br>
                                選択したモードに応じて、タスクの要件やアイテム価格が自動的に切り替わります。
                            </p>
                        </div>

                        <div>
                            <h6 class="text-success border-bottom border-secondary pb-2">
                                🔍 アイテム検索 & 逆引き
                            </h6>
                            <p class="small text-light">
                                新しいタブ「アイテム検索」を追加しました。アイテム名で検索し、以下の情報を確認できます。
                            </p>
                            <ul class="small text-muted">
                                <li>使用するタスク / ハイドアウト / 交換レシピ（逆引き）</li>
                                <li><strong>トレーダー最高買取価格</strong> と <strong>24時間平均フレア価格</strong></li>
                                <li>アイテム自体の入手方法（交換/購入）</li>
                            </ul>
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
                                🗺️ フローチャート：初期設定モード
                            </h6>
                            <p class="small text-light">
                                フローチャート画面に「初期設定モード」を追加しました。<br>
                                これをONにしてタスクをクリックすると、その前提タスクを含めて一括で完了状態にできます。
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