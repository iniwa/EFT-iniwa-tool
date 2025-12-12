const CompFooter = {
    template: `
    <footer class="mt-4 py-4 border-top border-secondary text-center small text-secondary" style="background-color: #181818;">
        <div class="container">
            <div class="mb-2">
                Data provided by <a href="https://tarkov.dev/" target="_blank" class="text-info text-decoration-none fw-bold">tarkov.dev</a> API
            </div>
            
            <div class="mb-3">
                Game content and materials are trademarks and copyrights of Battlestate Games.
            </div>

            <div>
                <button class="btn btn-link btn-sm text-muted text-decoration-none" data-bs-toggle="modal" data-bs-target="#legalModal">
                    プライバシーポリシー & 免責事項 / About
                </button>
            </div>
            
            <div class="mt-3 text-muted" style="font-size: 0.8em;">
                EFT Planner &copy; 2025
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
                        
                        <h6 class="text-info border-bottom border-secondary pb-1 mb-2">免責事項 (Disclaimer)</h6>
                        <p class="small">
                            本ツール（EFT Planner）は、Escape from Tarkovの非公式ファンメイドツールです。<br>
                            Battlestate Gamesとは一切関係がありません。<br>
                            本ツールを使用して発生したいかなる損害・不利益についても、開発者は責任を負いかねます。<br>
                            ゲームのアップデートにより、データや仕様が実際のゲーム内と異なる場合があります。
                        </p>

                        <h6 class="text-info border-bottom border-secondary pb-1 mb-2 mt-4">プライバシーポリシー (Privacy Policy)</h6>
                        <p class="small">
                            <strong>データの保存について:</strong><br>
                            本ツールで入力された進捗データ（タスク完了状況、ハイドアウトレベル、所持鍵など）は、ご利用のブラウザの <code>LocalStorage</code>（端末内）にのみ保存されます。<br>
                            開発者のサーバーへ個人データが送信・保存されることはありません。<br>
                            Gemini APIキーを入力された場合も同様に、ブラウザ内にのみ保存され、AI対話機能以外に使用されることはありません。
                        </p>
                        <p class="small">
                            <strong>アクセス解析について:</strong><br>
                            本サイトでは、利用状況の把握とサービス向上のため、Google Analytics および Cloudflare Web Analytics を使用しています。<br>
                            これらはクッキー（Cookie）を使用し、個人を特定しない形でアクセスログを収集します。
                        </p>

                        <h6 class="text-info border-bottom border-secondary pb-1 mb-2 mt-4">Credits & License</h6>
                        <ul class="small list-unstyled">
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
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `
};