const CompFooter = {
    // バージョンを手動で管理するか、propで受け取る形にします
    data() {
        return {
            appVersion: 'v1.1' 
        };
    },
    template: `
    <footer class="mt-5 py-4 border-top border-secondary text-center small text-secondary" style="background-color: #121212;">
        <div class="container">
            
            <div class="row justify-content-center mb-3">
                <div class="col-md-8">
                    <p class="mb-1">
                        Game content and materials are trademarks and copyrights of 
                        <a href="https://www.escapefromtarkov.com/" target="_blank" class="text-secondary text-decoration-none">Battlestate Games</a>.
                    </p>
                    <p class="mb-2">
                        Data provided by the community API <a href="https://tarkov.dev/" target="_blank" class="text-info text-decoration-none fw-bold">tarkov.dev</a>.
                    </p>
                </div>
            </div>

            <div>
                <button class="btn btn-link btn-sm text-muted text-decoration-none mx-2" data-bs-toggle="modal" data-bs-target="#legalModal">
                    プライバシーポリシー & 免責事項
                </button>
            </div>

            <div>
                <a href="https://x.com/iniwach" target="_blank" class="btn btn-link btn-sm text-muted text-decoration-none mx-2" onclick="return false;" style="cursor: default;">
                    Contact / Developer
                </a>
            </div>

            <div class="text-muted" style="font-size: 0.8em;">
                Iniwa's Intel Center &copy; 2025 <span class="mx-1">&bull;</span> {{ appVersion }}
            </div>
        </div>

        <div class="modal fade" id="legalModal" tabindex="-1" aria-hidden="true" @click.self>
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content bg-dark border-secondary text-start text-light">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-warning">About & Legal Info</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        
                        <div class="mb-4">
                            <h6 class="text-info border-bottom border-secondary pb-1 mb-2">免責事項 (Disclaimer)</h6>
                            <p class="small text-secondary">
                                本ツール「Iniwa's Intel Center」は、Escape from Tarkovの非公式ファンメイドツールです。<br>
                                開発元である Battlestate Games とは一切関係がありません。<br>
                                本ツールを使用して発生したいかなる損害・不利益についても、開発者は責任を負いかねます。<br>
                                ゲームのアップデートにより、データや仕様が実際のゲーム内と異なる場合があります。
                            </p>
                        </div>

                        <div class="mb-4">
                            <h6 class="text-info border-bottom border-secondary pb-1 mb-2">プライバシーポリシー (Privacy Policy)</h6>
                            <p class="small text-secondary">
                                <strong>データの保存について:</strong><br>
                                本ツールで入力された進捗データ（タスク完了状況、ハイドアウトレベル、所持鍵など）は、ご利用のブラウザの <code>LocalStorage</code>（端末内）にのみ保存されます。<br>
                                開発者のサーバーへ個人データが送信・保存されることはありません。<br>
                                Gemini APIキーを入力された場合も同様に、ブラウザ内にのみ保存され、AI対話機能以外に使用されることはありません。
                            </p>
                            <p class="small text-secondary">
                                <strong>アクセス解析について:</strong><br>
                                本サイトでは、利用状況の把握とサービス向上のため、Google Analytics および Cloudflare Web Analytics を使用しています。<br>
                                これらはクッキー（Cookie）を使用し、個人を特定しない形でアクセスログを収集します。
                            </p>
                        </div>

                        <div>
                            <h6 class="text-info border-bottom border-secondary pb-1 mb-2">Credits & License</h6>
                            <ul class="small list-unstyled text-secondary">
                                <li class="mb-1">
                                    <strong>Game Data:</strong> <a href="https://tarkov.dev/" target="_blank" class="text-info">tarkov.dev</a> (Community API)
                                </li>
                                <li class="mb-1">
                                    <strong>Maps & Images:</strong> Property of Battlestate Games.
                                </li>
                                <li class="mb-1">
                                    <strong>Libraries:</strong> Vue.js 3, Bootstrap 5, Mermaid.js, Marked.js
                                </li>
                            </ul>
                        </div>

                    </div>
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `
};