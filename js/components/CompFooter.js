// js/components/CompFooter.js

const CompFooter = {
    // ★修正: data() を削除し、props で appVersion を受け取るように変更
    props: ['appVersion'],
    emits: ['show-notice'],
    
    // data() { return { appVersion: '...' } } は不要なので削除

    template: `
    <footer class="mt-5 py-4 border-top border-secondary text-center small text-secondary" style="background-color: #121212;">
        <div class="container">
            
            <div class="mb-4">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScFPBXovafedEgQY10uTH1vAbyOA9r1l6kurIfkTuwN64eyqA/viewform?usp=publish-editor" target="_blank" class="btn btn-outline-warning btn-sm text-decoration-none px-4">
                    📮 ご意見箱 (不具合報告・機能要望・アンケート)
                </a>
                <div class="text-muted mt-1" style="font-size: 0.75rem;">
                    ※ Googleフォームへ移動します（匿名送信可）
                </div>
            </div>

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
                <span class="text-dark">|</span>
                
                <a href="#" class="btn btn-link btn-sm text-muted text-decoration-none mx-2" 
                    @click.prevent="$emit('show-notice')" 
                    style="cursor: pointer;" 
                    title="お知らせを再表示">
                    v{{ appVersion }}
                </a>
                
                <span class="text-dark">|</span>
                <a href="https://twitter.com/iniwach" target="_blank" class="btn btn-link btn-sm text-muted text-decoration-none mx-2">
                    Developer: @iniwach
                </a>
            </div>

            <div class="modal fade" id="legalModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content bg-dark text-white border-secondary text-start">
                        <div class="modal-header border-secondary">
                            <h5 class="modal-title fs-6">プライバシーポリシー & 免責事項</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body small text-secondary">
                            
                            <div class="mb-3">
                                <h6 class="text-white border-bottom border-secondary pb-1 mb-2">免責事項</h6>
                                <p>
                                    当ツール「Iniwa's Intel Center」は、Escape from Tarkovの非公式ファンメイドツールです。
                                    Battlestate Games社とは一切関係ありません。
                                </p>
                                <p>
                                    当ツールを利用したことによる、いかなるトラブルや損失・損害についても、開発者は一切の責任を負いません。
                                    提供されるデータ（タスク要件、アイテム価格等）の正確性は保証されません。最新情報はゲーム内をご確認ください。
                                </p>
                            </div>

                            <div class="mb-3">
                                <h6 class="text-white border-bottom border-secondary pb-1 mb-2">プライバシーポリシー</h6>
                                <p>
                                    <strong>1. アクセス解析について</strong><br>
                                    当サイトでは、利用状況の把握とサービス向上のため、Google Analyticsを使用しています。
                                    これに伴い、Cookieを使用して匿名のトラフィックデータを収集する場合があります。このデータに個人を特定する情報は含まれません。
                                </p>
                                <p>
                                    <strong>2. 入力データの扱い</strong><br>
                                    タスクの進捗状況や所持アイテムなどのデータは、ユーザーのブラウザ内（LocalStorage / IndexedDB）にのみ保存されます。
                                    開発者のサーバーへ送信・保存されることはありません。
                                </p>
                            </div>

                            <div>
                                <h6 class="text-white border-bottom border-secondary pb-1 mb-2">Credits</h6>
                                <ul class="list-unstyled ps-2 mb-0">
                                    <li class="mb-1">
                                        <strong>Developer:</strong> 
                                        <a href="https://twitter.com/iniwach" target="_blank" class="text-info">
                                            @iniwach
                                        </a>
                                    </li>
                                    <li class="mb-1">
                                        <strong>Source & Updates:</strong> 
                                        <a href="https://github.com/iniwa/EFT-iniwa-tool" target="_blank" class="text-info">
                                            GitHub Repository
                                        </a>
                                    </li>
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
        </div>
    </footer>
    `
};