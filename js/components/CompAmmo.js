const CompAmmo = {
    props: ['ammoData'],
    data() {
        return {
            selectedCalibers: [],
            sortKey: 'penetrationPower',
            sortDesc: true,
            chartInstance: null
        };
    },
    computed: {
        // 全ての口径リストを取得
        allCalibers() {
            if (!this.ammoData) return [];
            const calibers = new Set(this.ammoData.map(a => a.caliber));
            return Array.from(calibers).sort();
        },
        // フィルタリングとソート適用後のデータ
        filteredAmmo() {
            if (!this.ammoData) return [];
            
            let data = this.ammoData;

            // 口径フィルタ
            if (this.selectedCalibers.length > 0) {
                data = data.filter(a => this.selectedCalibers.includes(a.caliber));
            }

            // ソート
            return data.sort((a, b) => {
                let valA = a[this.sortKey];
                let valB = b[this.sortKey];
                
                // 数値変換（念のため）
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return this.sortDesc ? 1 : -1;
                if (valA > valB) return this.sortDesc ? -1 : 1;
                return 0;
            });
        }
    },
    watch: {
        filteredAmmo() {
            this.renderChart();
        }
    },
    mounted() {
        // 初期表示でよく使う口径を選択しておく（例: 5.56x45mm, 7.62x39mm）
        // this.selectedCalibers = ['5.56x45mm NATO', '7.62x39mm']; 
        this.renderChart();
    },
    methods: {
        toggleCaliber(cal) {
            const idx = this.selectedCalibers.indexOf(cal);
            if (idx > -1) this.selectedCalibers.splice(idx, 1);
            else this.selectedCalibers.push(cal);
        },
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortDesc = !this.sortDesc;
            } else {
                this.sortKey = key;
                this.sortDesc = true;
            }
        },
        getBgColor(pen) {
            // 貫通力に応じた色分け
            if (pen >= 60) return '#dc3545'; // 赤 (クラス6貫通)
            if (pen >= 50) return '#fd7e14'; // オレンジ (クラス5)
            if (pen >= 40) return '#ffc107'; // 黄 (クラス4)
            if (pen >= 30) return '#198754'; // 緑 (クラス3)
            return '#6c757d'; // グレー
        },
        renderChart() {
            const ctx = document.getElementById('ammoChart');
            if (!ctx) return;

            // Chart.js が必要です。index.htmlで読み込んでいない場合は追加が必要です。
            // 今回は簡易的な散布図を描画するロジックを Chart.js なしで実装するか、
            // あるいはライブラリ依存を避けるため、今回は「テーブルメイン」とし、
            // 将来的にChart.jsを入れる想定でプレースホルダーにします。
            
            // ※もしChart.jsを導入済みならここで描画コードを記述します。
            // 今回はHTML/CSSだけで簡易的なバーを表示する形にします。
        }
    },
    template: `
    <div class="row">
        <div class="col-md-3 mb-3">
            <div class="card h-100 border-secondary">
                <div class="card-header bg-dark text-white border-secondary">
                    🔫 口径フィルター
                    <button class="btn btn-sm btn-outline-light float-end" @click="selectedCalibers = []">クリア</button>
                </div>
                <div class="card-body bg-dark text-white overflow-auto" style="max-height: 80vh;">
                    <div v-for="cal in allCalibers" :key="cal" class="form-check">
                        <input class="form-check-input" type="checkbox" :value="cal" :id="'cal-'+cal" 
                               :checked="selectedCalibers.includes(cal)" @change="toggleCaliber(cal)">
                        <label class="form-check-label small" :for="'cal-'+cal" style="cursor: pointer;">
                            {{ cal }}
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-9 mb-3">
            <div class="card h-100 border-secondary">
                <div class="card-header bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                    <span>📊 弾薬データ一覧 ({{ filteredAmmo.length }} 件)</span>
                    <small class="text-muted">※ヘッダー・画像クリックでソート/Wikiへ</small>
                </div>
                <div class="card-body bg-dark p-0 table-responsive" style="max-height: 80vh;">
                    <table class="table table-dark table-hover table-striped mb-0 small" style="white-space: nowrap;">
                        <thead class="sticky-top bg-dark" style="z-index: 10;">
                            <tr>
                                <th @click="sortBy('name')" style="cursor: pointer;">名前</th>
                                <th @click="sortBy('caliber')" style="cursor: pointer;">口径</th>
                                <th @click="sortBy('damage')" style="cursor: pointer;" class="text-end">ダメージ</th>
                                <th @click="sortBy('penetrationPower')" style="cursor: pointer;" class="text-end text-warning">貫通力</th>
                                <th @click="sortBy('armorDamage')" style="cursor: pointer;" class="text-end">アーマーDmg</th>
                                <th @click="sortBy('fragmentationChance')" style="cursor: pointer;" class="text-end">破砕率</th>
                                <th @click="sortBy('projectileSpeed')" style="cursor: pointer;" class="text-end">初速</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ammo in filteredAmmo" :key="ammo.id">
                                <td>
                                    <a :href="ammo.wikiLink" target="_blank" class="text-decoration-none text-info fw-bold d-flex align-items-center gap-2">
                                        <img :src="ammo.image512pxLink" alt="" style="width: 24px; height: 24px; object-fit: contain;">
                                        {{ ammo.shortName || ammo.name }}
                                    </a>
                                </td>
                                <td class="text-muted">{{ ammo.caliber.replace('Caliber', '') }}</td>
                                <td class="text-end fw-bold">{{ ammo.damage }}</td>
                                <td class="text-end fw-bold position-relative">
                                    <span class="badge" :style="{backgroundColor: getBgColor(ammo.penetrationPower)}">
                                        {{ ammo.penetrationPower }}
                                    </span>
                                </td>
                                <td class="text-end">{{ ammo.armorDamage }}%</td>
                                <td class="text-end">{{ (ammo.fragmentationChance * 100).toFixed(1) }}%</td>
                                <td class="text-end">{{ ammo.projectileSpeed }} m/s</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div v-if="filteredAmmo.length === 0" class="text-center text-secondary py-5">
                        データがありません。左のフィルターを選択してください。
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};