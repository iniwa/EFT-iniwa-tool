const CompFooter = {
    data() {
        return {
            appVersion: 'v1.3.4'
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
                <span class="text-dark">|</span>
                <a href="#" class="btn btn-link btn-sm text-muted text-decoration-none mx-2" onclick="return false;" style="cursor: default;">
                    Iniwa's Intel Center
                </a>
            </div>

            <div class="text-muted" style="font-size: 0.8em;">
                &copy; 2025 Iniwa's Intel Center <span class="mx-1">&bull;</span> {{ appVersion }}
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
                                本ツールのデータは、外部のコミュニティAPI（tarkov.dev）を利用して取得しています。 APIの性質上、実際のゲーム内容との差異や更新の遅れが生じる場合があるため、情報の完全な正確性は保証されません。あくまで参考情報としてご利用ください。
                            </p>
                        </div>

                        <div class="mb-4">
                            <h6 class="text-info border-bottom border-secondary pb-1 mb-2">プライバシーポリシー (Privacy Policy)</h6>
                            
                            <p class="small text-light fw-bold mb-1">ユーザーデータの取り扱いについて</p>
                            <p class="small text-secondary">
                                本ツールで入力された進捗データ（タスク完了状況、ハイドアウトレベル、所持鍵など）およびAPIキーは、ご利用のブラウザのLocalStorage（端末内）にのみ保存されます。<br>
                                開発者のサーバーへ個人データが送信・保存されることは一切ありません。
                            </p>

                            <p class="small text-light fw-bold mb-1 mt-3">アクセス解析ツールについて</p>
                            <p class="small text-secondary">
                                本サイトでは、利用状況の把握とサービス向上のため、Google Analytics および Cloudflare Web Analytics を利用しています。<br>
                                これらはトラフィックデータの収集のためにクッキー（Cookie）を使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。<br>
                                この機能はクッキーを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
                            </p>

                            <p class="small text-light fw-bold mb-1 mt-3">広告の配信について</p>
                            <p class="small text-secondary">
                                本サイトは、第三者配信の広告サービス（Google AdSense等）を利用する予定、または利用しています。<br>
                                広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報「Cookie」(氏名、住所、メール アドレス、電話番号は含まれません) を使用することがあります。<br>
                                またGoogleアドセンスに関して、このプロセスの詳細やこのような情報が広告配信事業者に使用されないようにする方法については、<a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" class="text-info">Googleのポリシーと規約</a>をご確認ください。
                            </p>
                        </div>

                        <div>
                            <h6 class="text-info border-bottom border-secondary pb-1 mb-2">Credits & License</h6>
                            <ul class="small list-unstyled text-secondary">
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
    </footer>
    `
};