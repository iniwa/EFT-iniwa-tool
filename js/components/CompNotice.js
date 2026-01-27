// js/components/CompNotice.js

const CompNotice = {
    props: ['appVersion'],
    data() {
        return {
            isVisible: false
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
            
            // マイナーバージョンアップなので表示する (2.0.x -> 2.1.0)
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
                        
                        <div class="p-3 rounded border border-primary bg-primary bg-opacity-10">
                            <h5 class="text-primary fw-bold mb-2">
                                📖 ストーリータスク (Story Chapters) 実装！
                            </h5>
                            <p class="small text-light mb-2">
                                EFT v1.0.0.0より追加された「ストーリータスク」の進捗管理タブを追加しました。<br>
                                手順や分岐も、チェックリスト形式でスムーズに管理できます。
                            </p>
                            <ul class="small text-light mb-0">
                                <li><strong>分岐対応：</strong> 選択肢によって次のタスクが変化します（例：Falling Skiesの選択）。</li>
                                <li><strong>非表示設定：</strong> 「🐞 デバッグ」タブからストーリータブ自体を非表示に設定できます。</li>
                                <li><strong>Wiki連携：</strong> 各チャプターのタイトル横から、海外Wikiの詳細ページへ飛べます。</li>
                            </ul>
                        </div>

                        <div>
                            <h6 class="text-warning border-bottom border-secondary pb-2">
                                🐞 その他の機能改善・修正 (v2.1.1)
                            </h6>
                            <ul class="small text-light ps-3">
                                <li class="mb-2">
                                    <strong>アクセス解析の変更 (テスト運用)：</strong><br>
                                    Google Analyticsから、よりプライバシーに配慮した「Umami」へ変更しました。<br>
                                    <span class="text-muted">Cookieを使用せず、個人を特定しない形で計測を行います。</span>
                                </li>
                                <li>
                                    <strong>ストーリータブの表示設定：</strong><br>
                                    ネタバレを完全に避けたい方や、まだストーリーを進めていない方のために、
                                    <span class="text-info">「🐞 デバッグ」タブからストーリータブ自体を非表示</span>に設定できるようになりました。
                                </li>
                                <li>
                                    <strong>データリセット機能の追加：</strong><br>
                                    「🐞 デバッグ」タブにて、タスク進捗やハイドアウト情報など、項目ごとに選択してデータをリセット（初期化）できるようになりました。
                                </li>
                                <li>
                                    <strong>データ保存の改善：</strong><br>
                                    ストーリーの進捗状況もバックアップ（エクスポート）に含まれるようになりました。
                                </li>
                            </ul>
                        </div>

                        <details class="border border-secondary rounded p-2 bg-black bg-opacity-25">
                            <summary class="text-secondary small fw-bold cursor-pointer">📜 過去のアップデート履歴 (v2.0.x)</summary>
                            <div class="mt-3 vstack gap-3 ps-2">
                                
                                <div class="bg-info bg-opacity-10 p-2 rounded border border-info">
                                    <h6 class="text-info small mb-1">🔄 v2.0.2 Update (Minor Fix)</h6>
                                    <ul class="list-unstyled small text-light mb-0 ps-1">
                                        <li>・「鍵管理」画面にて、Wikiボタンが表示されない不具合を修正</li>
                                        <li>・アイテム検索機能にて、他タブから戻ってきた時も検索状況を保持するように改善 (v2.0.1)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h6 class="text-warning border-bottom border-secondary pb-1 small">
                                        ⚔️ PvP / PvE & 🌐 JP / EN 切り替え (v2.0.0)
                                    </h6>
                                    <p class="small text-muted mb-0">
                                        画面右上のヘッダーから、ゲームモード（PvP/PvE）と言語（日本語/英語）を切り替えられるようになりました。
                                    </p>
                                </div>

                                <div>
                                    <h6 class="text-success border-bottom border-secondary pb-1 small">
                                        🔍 アイテム図鑑 & 逆引き検索 (v2.0.0)
                                    </h6>
                                    <p class="small text-muted mb-0">
                                        新しいタブ「アイテム検索」を追加しました。トレーダー買取価格やフレア平均価格、使用用途（逆引き）を確認できます。
                                    </p>
                                </div>

                                <div>
                                    <h6 class="text-info border-bottom border-secondary pb-1 small">
                                        🗺️ フローチャート：初期設定モード (v2.0.0)
                                    </h6>
                                    <p class="small text-muted mb-0">
                                        フローチャート画面に「初期設定モード」を追加。前提タスクを含めて一括で完了状態にできます。
                                    </p>
                                </div>
                            </div>
                        </details>

                        <div class="bg-secondary bg-opacity-10 p-3 rounded border border-secondary">
                            <h6 class="text-white mb-3">📢 開発者からのお願い</h6>
                            <p class="small">
                                <strong>📮 ご意見・不具合報告</strong><br>
                                ページ最下部（フッター）の「ご意見箱」より、Googleフォーム経由で匿名にて送信いただけます。<br>
                                ストーリータスクのデータに誤りがあれば教えていただけると助かります！
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