// js/CompItemSearch.js

const CompItemSearch = {
    props: [
        'itemDb',          // 逆引き用アイテム全データ
        'completedTasks',  // 完了済みタスクリスト
        'wishlist',        // ウィッシュリスト(ID配列)
        'isLoadingDb'      // DB取得中フラグ
    ],
    emits: ['fetch-db', 'update-single-price', 'toggle-wishlist'],
    data() {
        return {
            searchQuery: '',
            showWishlistOnly: false,
            // ページネーション用
            currentPage: 1,
            itemsPerPage: 50,
            expandedItems: {} // IDをキーにして詳細開閉
        };
    },
    computed: {
        filteredItems() {
            return ItemLogic.filterItems(
                this.itemDb, 
                this.searchQuery, 
                this.showWishlistOnly, 
                this.wishlist
            );
        },
        paginatedItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredItems.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage);
        }
    },
    watch: {
        searchQuery() { this.currentPage = 1; },
        showWishlistOnly() { this.currentPage = 1; }
    },
    methods: {
        formatPrice(num, currency) {
            if (num === null || num === undefined) return '-';
            const str = num.toLocaleString();
            if (currency === 'USD') return `$${str}`;
            if (currency === 'EUR') return `€${str}`;
            return `₽${str}`;
        },
        toggleDetails(id) {
            if (this.expandedItems[id]) delete this.expandedItems[id];
            else this.expandedItems[id] = true;
        },
        isTaskDone(taskName) {
            return this.completedTasks.includes(taskName);
        },
        getBestSell(item) {
            return ItemLogic.getBestSellPrice(item);
        },
        prevPage() { if (this.currentPage > 1) this.currentPage--; },
        nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
    },
    template: `
    <div class="card h-100 border-secondary">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span class="fs-5">🔍 Item Database</span>
            <div v-if="itemDb.length > 0" class="d-flex gap-2 align-items-center">
                <input type="text" class="form-control form-control-sm bg-dark text-white border-secondary" 
                    v-model="searchQuery" placeholder="名前検索 (JP/EN)..." style="width: 200px;">
                
                <button class="btn btn-sm" 
                    :class="showWishlistOnly ? 'btn-warning' : 'btn-outline-secondary'"
                    @click="showWishlistOnly = !showWishlistOnly">
                    ★ Wishlist
                </button>
            </div>
        </div>

        <div class="card-body bg-dark text-white overflow-auto p-0" style="position: relative; min-height: 400px;">
            
            <div v-if="itemDb.length === 0" class="d-flex flex-column justify-content-center align-items-center h-100 text-secondary p-5">
                <div class="mb-3 text-center">
                    <h4>データベースがロードされていません</h4>
                    <p>API通信量を節約するため、アイテム検索用データは別途取得します。<br>
                    (約 4,000アイテムの情報を取得するため、数秒かかります)</p>
                </div>
                <button class="btn btn-primary btn-lg" @click="$emit('fetch-db')" :disabled="isLoadingDb">
                    <span v-if="isLoadingDb" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoadingDb ? 'データを構築中...' : 'アイテムデータを取得開始' }}
                </button>
            </div>

            <div v-else>
                <table class="table table-dark table-hover mb-0 align-middle">
                    <thead class="sticky-top bg-dark border-bottom border-secondary">
                        <tr>
                            <th style="width: 50px;">IMG</th>
                            <th>Name</th>
                            <th class="text-end" style="width: 120px;">Flea (24h)</th>
                            <th class="text-end" style="width: 140px;">Trader Sell</th>
                            <th class="text-center" style="width: 80px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="item in paginatedItems" :key="item.id">
                            <tr @click="toggleDetails(item.id)" style="cursor: pointer;">
                                <td>
                                    <img :src="item.iconLink" alt="" style="width: 40px; height: 40px; object-fit: contain;">
                                </td>
                                <td>
                                    <div class="fw-bold">
                                        <span v-if="wishlist.includes(item.id)" class="text-warning me-1">★</span>
                                        {{ item.name }}
                                    </div>
                                    <div class="small text-muted">{{ item.shortName }}</div>
                                </td>
                                <td class="text-end font-monospace">
                                    {{ formatPrice(item.avg24hPrice) }}
                                </td>
                                <td class="text-end font-monospace">
                                    <div v-if="getBestSell(item)">
                                        <div class="text-success">{{ formatPrice(getBestSell(item).price, getBestSell(item).currency) }}</div>
                                        <div class="small text-muted" style="font-size: 0.75rem;">{{ getBestSell(item).vendor }}</div>
                                    </div>
                                    <span v-else class="text-muted">-</span>
                                </td>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-outline-secondary" @click.stop="$emit('toggle-wishlist', item.id)" title="ウィッシュリスト切替">
                                        <span v-if="wishlist.includes(item.id)">★</span>
                                        <span v-else>☆</span>
                                    </button>
                                </td>
                            </tr>

                            <tr v-if="expandedItems[item.id]" class="bg-secondary bg-opacity-10 border-bottom border-secondary">
                                <td colspan="5" class="p-3">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <h6 class="text-info border-bottom border-info pb-1">📦 使用タスク</h6>
                                            <div v-if="item.usedInTasks && item.usedInTasks.length > 0">
                                                <ul class="list-unstyled mb-0 ps-2">
                                                    <li v-for="t in item.usedInTasks" :key="t.name" class="small mb-1">
                                                        <span v-if="isTaskDone(t.name)" class="text-success">✅ {{ t.name }} (完了)</span>
                                                        <span v-else class="text-warning">⬜ {{ t.name }}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div v-else class="small text-muted">特になし</div>
                                        </div>

                                        <div class="col-md-4 mb-3">
                                            <h6 class="text-warning border-bottom border-warning pb-1">🔄 交換用途 (Barter)</h6>
                                            <div v-if="item.bartersUsing && item.bartersUsing.length > 0">
                                                <ul class="list-unstyled mb-0 ps-2">
                                                    <li v-for="(b, idx) in item.bartersUsing" :key="idx" class="small mb-1">
                                                        <span class="badge bg-dark border border-secondary">{{ b.trader.name }} LL{{ b.level }}</span>
                                                        ➡ 
                                                        <span v-for="reward in b.rewardItems" class="text-white">
                                                            {{ reward.item.name }} x{{ reward.count }}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div v-else class="small text-muted">特になし</div>
                                        </div>

                                        <div class="col-md-4 text-end">
                                            <div class="mb-2">
                                                <a :href="item.wikiLink" target="_blank" class="btn btn-sm btn-outline-info w-100 mb-2">Wikiを開く</a>
                                                <button class="btn btn-sm btn-success w-100" @click.stop="$emit('update-single-price', item.id)">
                                                    ♻️ 最新価格を取得 (個別)
                                                </button>
                                            </div>
                                            <small class="text-muted d-block text-start">
                                                ※フリーマーケット価格とトレーダー買取価格のみをAPIから再取得して更新します。
                                            </small>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div v-if="itemDb.length > 0" class="card-footer bg-dark border-top border-secondary py-2">
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Total: {{ filteredItems.length }} items</small>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary" @click="prevPage" :disabled="currentPage === 1">◀</button>
                    <button class="btn btn-outline-secondary disabled text-white">{{ currentPage }} / {{ totalPages }}</button>
                    <button class="btn btn-outline-secondary" @click="nextPage" :disabled="currentPage === totalPages">▶</button>
                </div>
            </div>
        </div>
    </div>
    `
};