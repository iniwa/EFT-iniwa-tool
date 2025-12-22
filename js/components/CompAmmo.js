const CompAmmo = {
    props: ['ammoData'],
    emits: ['open-task-from-name'],
    data() {
        const savedFilters = localStorage.getItem('eft_ammo_filters');
        
        return {
            selectedCalibers: savedFilters ? JSON.parse(savedFilters) : [],
            sortKey: 'penetrationPower',
            sortDesc: true,
            selectedAmmo: null,
            
            // フィルター表示用の階層データ
            CALIBER_GROUPS: [
                {
                    category: "Assault Rifles (AR)",
                    icon: "⚔️",
                    sections: [
                        {
                            title: "🇺🇸 Western / NATO",
                            ids: ['Caliber556x45NATO', 'Caliber762x35', 'Caliber68x51']
                        },
                        {
                            title: "🇷🇺 Eastern / RUS",
                            ids: ['Caliber545x39', 'Caliber762x39', 'Caliber366TKM', 'Caliber9x39', 'Caliber127x55']
                        }
                    ]
                },
                {
                    category: "DMR / Sniper Rifles (SR)",
                    icon: "🎯",
                    sections: [
                        {
                            title: "🇺🇸 Western / NATO",
                            ids: ['Caliber762x51', 'Caliber86x70', 'Caliber127x99']
                        },
                        {
                            title: "🇷🇺 Eastern / RUS",
                            ids: ['Caliber762x54R', 'Caliber93x64']
                        },
                        // ★修正: .308 ME 用のカテゴリを追加
                        {
                            title: "🦌 Civilian / Hunting",
                            ids: ['Caliber308ME']
                        }
                    ]
                },
                {
                    category: "SMG / Pistols",
                    icon: "🔫",
                    sections: [
                        {
                            title: "🇺🇸 Western / NATO",
                            ids: ['Caliber9x19PARA', 'Caliber1143x23ACP', 'Caliber46x30', 'Caliber57x28', 'Caliber9x33R', 'Caliber127x33']
                        },
                        {
                            title: "🇷🇺 Eastern / RUS",
                            ids: ['Caliber9x18PM', 'Caliber762x25TT', 'Caliber9x21']
                        }
                    ]
                },
                {
                    category: "Shotguns (SG)",
                    icon: "💥",
                    sections: [
                        {
                            title: "All Origins",
                            ids: ['Caliber12g', 'Caliber20g', 'Caliber23x75']
                        }
                    ]
                },
                {
                    category: "Others / GL",
                    icon: "📦",
                    sections: [
                        {
                            title: "Grenades & Flares",
                            ids: ['Caliber40x46', 'Caliber40mmRU', 'Caliber26x75', 'Caliber20x1mm']
                        }
                    ]
                }
            ],
            // データ詳細辞書
            CALIBER_MAP: {
                'Caliber556x45NATO': { name: '5.56x45mm NATO', examples: 'M4A1, HK416, MDR' },
                'Caliber762x39': { name: '7.62x39mm', examples: 'AKM, Mk47, SKS' },
                'Caliber545x39': { name: '5.45x39mm', examples: 'AK-74, RPK-16' },
                'Caliber762x51': { name: '7.62x51mm NATO', examples: 'M80, SR-25, SCAR-H' },
                'Caliber762x35': { name: '.300 Blackout', examples: 'MCX, M4 (mod)' },
                'Caliber366TKM': { name: '.366 TKM', examples: 'VPO-209, VPO-215' },
                'Caliber127x55': { name: '12.7x55mm', examples: 'ASh-12, RSh-12' },
                'Caliber68x51': { name: '6.8x51mm', examples: 'SIG Spear' },
                'Caliber93x64': { name: '9.3x64mm Brenneke', examples: 'SVDK' },
                'Caliber9x39': { name: '9x39mm', examples: 'VSS, AS VAL' },
                'Caliber9x19PARA': { name: '9x19mm Parabellum', examples: 'MP5, Vector, Glock' },
                'Caliber1143x23ACP': { name: '.45 ACP', examples: 'UMP, M1911, Vector' },
                'Caliber46x30': { name: '4.6x30mm HK', examples: 'MP7' },
                'Caliber57x28': { name: '5.7x28mm FN', examples: 'P90, Five-seveN' },
                'Caliber9x21': { name: '9x21mm Gyurza', examples: 'SR-2M Veresk' },
                'Caliber9x18PM': { name: '9x18mm PM', examples: 'Kedr, Makarov' },
                'Caliber762x25TT': { name: '7.62x25mm TT', examples: 'PPSH, TT' },
                'Caliber9x33R': { name: '.357 Magnum', examples: 'Rhino' },
                'Caliber762x54R': { name: '7.62x54mm R', examples: 'Mosin, SVDS, PKM' },
                'Caliber86x70': { name: '.338 Lapua Magnum', examples: 'AXMC, Mk-18 Mjolnir' },
                'Caliber127x99': { name: '.50 BMG', examples: 'M82A1' },
                'Caliber12g': { name: '12/70 Gauge', examples: 'MP-153, Saiga-12' },
                'Caliber20g': { name: '20/70 Gauge', examples: 'TOZ-106' },
                'Caliber23x75': { name: '23x75mm', examples: 'KS-23M' },
                'Caliber40x46': { name: '40x46mm Grenade', examples: 'M203, M32A1' },
                'Caliber40mmRU': { name: '40mm VOG', examples: 'GP-25' },
                'Caliber26x75': { name: '26x75mm Flare', examples: 'Signal Pistol' },
                'Caliber20x1mm': { name: '20x1mm', examples: 'Toy Gun' },
                'Caliber127x33': { name: '.50 Action Express', examples: 'Desert Eagle' },
                // ★修正: .308 ME の表示名定義
                'Caliber308ME': { name: '.308 Marlin Express', examples: 'Marlin MXLR' },
            }
        };
    },
    watch: {
        selectedCalibers: {
            handler(newVal) {
                localStorage.setItem('eft_ammo_filters', JSON.stringify(newVal));
            },
            deep: true
        }
    },
    computed: {
        // ★修正: データの前処理 (308 MEを分離するロジック)
        processedAmmoData() {
            if (!this.ammoData) return [];
            return this.ammoData.map(item => {
                // Propsは直接変更できないためコピーを作成
                const newItem = { ...item };
                // 名前が .308 ME で始まる場合、口径IDを独自のものに書き換える
                if (newItem.name && newItem.name.includes('.308 ME')) {
                    newItem.caliber = 'Caliber308ME';
                }
                return newItem;
            });
        },
        // 以下、this.ammoData の代わりに this.processedAmmoData を使用
        allCalibersFlat() {
            if (!this.processedAmmoData) return [];
            return Array.from(new Set(this.processedAmmoData.map(a => a.caliber)));
        },
        knownCalibers() {
            const ids = new Set();
            this.CALIBER_GROUPS.forEach(group => {
                group.sections.forEach(section => {
                    section.ids.forEach(id => ids.add(id));
                });
            });
            return ids;
        },
        unknownCalibers() {
            if (!this.processedAmmoData) return [];
            return this.allCalibersFlat.filter(cal => !this.knownCalibers.has(cal)).sort();
        },
        extendedCaliberGroups() {
            const groups = JSON.parse(JSON.stringify(this.CALIBER_GROUPS));
            const unknown = this.unknownCalibers;
            if (unknown.length > 0) {
                groups.push({
                    category: "Unknown / New",
                    icon: "❓",
                    sections: [{ title: "Uncategorized", ids: unknown }]
                });
            }
            return groups;
        },
        filteredAmmo() {
            if (!this.processedAmmoData) return [];
            let data = this.processedAmmoData;
            if (this.selectedCalibers.length > 0) {
                data = data.filter(a => this.selectedCalibers.includes(a.caliber));
            }
            return data.sort((a, b) => {
                let valA = a[this.sortKey];
                let valB = b[this.sortKey];
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                if (valA < valB) return this.sortDesc ? 1 : -1;
                if (valA > valB) return this.sortDesc ? -1 : 1;
                return 0;
            });
        }
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
        getSortClass(key) {
            return this.sortKey === key ? 'text-warning' : 'text-white';
        },
        getBgColor(pen) {
            if (pen >= 60) return '#dc3545'; 
            if (pen >= 50) return '#fd7e14'; 
            if (pen >= 40) return '#ffc107'; 
            if (pen >= 30) return '#198754'; 
            return '#6c757d'; 
        },
        getCaliberInfo(calId) {
            return this.CALIBER_MAP[calId] || { name: calId.replace('Caliber', ''), examples: 'Unknown Weapon' };
        },
        hasData(calId) {
            return this.allCalibersFlat.includes(calId);
        },
        openDetail(ammo) {
            this.selectedAmmo = ammo;
        },
        closeDetail() {
            this.selectedAmmo = null;
        },
        formatSigned(val) {
            if (!val) return '0';
            const num = Math.round(val * 100); 
            return num > 0 ? `+${num}` : `${num}`;
        },
        hasTrader(ammo) {
            return ammo.soldBy && ammo.soldBy.length > 0;
        },
        hasCraft(ammo) {
            return ammo.crafts && ammo.crafts.length > 0;
        }
    },
    template: `
    <div class="row">
        <div class="col-md-3 mb-3">
            <div class="card h-100 border-secondary">
                <div class="card-header bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                    <span>🔫 口径フィルター</span>
                    <button class="btn btn-sm btn-outline-light" @click="selectedCalibers = []">クリア</button>
                </div>
                <div class="card-body bg-dark text-white overflow-auto p-2" style="max-height: 80vh;">
                    <div v-for="(group, gIdx) in extendedCaliberGroups" :key="gIdx" class="mb-3">
                        <div class="text-warning border-bottom border-secondary mb-2 pb-1 small fw-bold">
                            {{ group.icon }} {{ group.category }}
                        </div>
                        <div v-for="(section, sIdx) in group.sections" :key="sIdx" class="mb-2 ms-1">
                            <div class="text-muted small mb-1" style="font-size: 0.75rem;">{{ section.title }}</div>
                            <div v-for="cal in section.ids" :key="cal">
                                <div v-if="hasData(cal)" class="form-check mb-1 ms-2">
                                    <input class="form-check-input mt-1" type="checkbox" :value="cal" :id="'cal-'+cal" 
                                        :checked="selectedCalibers.includes(cal)" @change="toggleCaliber(cal)">
                                    <label class="form-check-label w-100" :for="'cal-'+cal" style="cursor: pointer; line-height: 1.2;">
                                        <div class="small fw-bold">{{ getCaliberInfo(cal).name }}</div>
                                        <div class="text-secondary" style="font-size: 0.7em;">
                                            {{ getCaliberInfo(cal).examples }}
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-9 mb-3">
            <div class="card h-100 border-secondary">
                <div class="card-header bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                    <span>📊 弾薬データ一覧 ({{ filteredAmmo.length }} 件)</span>
                </div>
                <div class="card-body bg-dark p-0 table-responsive" style="max-height: 80vh;">
                    <table class="table table-dark table-hover table-striped mb-0 small" style="white-space: nowrap;">
                        <thead class="sticky-top bg-dark" style="z-index: 10;">
                            <tr>
                                <th @click="sortBy('name')" style="cursor: pointer;" :class="getSortClass('name')">名前</th>
                                <th @click="sortBy('caliber')" style="cursor: pointer;" :class="getSortClass('caliber')">口径</th>
                                <th @click="sortBy('damage')" style="cursor: pointer;" class="text-end" :class="getSortClass('damage')">ダメージ</th>
                                <th @click="sortBy('penetrationPower')" style="cursor: pointer;" class="text-end" :class="getSortClass('penetrationPower')">貫通力</th>
                                <th @click="sortBy('armorDamage')" style="cursor: pointer;" class="text-end" :class="getSortClass('armorDamage')">アーマーDmg</th>
                                <th @click="sortBy('projectileSpeed')" style="cursor: pointer;" class="text-end" :class="getSortClass('projectileSpeed')">初速</th>
                                <th class="text-center text-white">販売</th>
                                <th class="text-center text-white">製造</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ammo in filteredAmmo" :key="ammo.id">
                                <td>
                                    <div @click="openDetail(ammo)" class="text-info fw-bold d-flex align-items-center gap-2" style="cursor: pointer;">
                                        <img :src="ammo.image512pxLink" alt="" style="width: 24px; height: 24px; object-fit: contain;">
                                        {{ ammo.shortName || ammo.name }}
                                    </div>
                                </td>
                                <td class="text-muted small">
                                    {{ getCaliberInfo(ammo.caliber).name }}
                                </td>
                                <td class="text-end fw-bold">{{ ammo.damage }}</td>
                                <td class="text-end fw-bold position-relative">
                                    <span class="badge" :style="{backgroundColor: getBgColor(ammo.penetrationPower)}">
                                        {{ ammo.penetrationPower }}
                                    </span>
                                </td>
                                <td class="text-end">{{ ammo.armorDamage }}%</td>
                                <td class="text-end">{{ ammo.projectileSpeed }} m/s</td>
                                <td class="text-center">
                                    <span v-if="hasTrader(ammo)" title="トレーダー販売あり">🛒</span>
                                    <span v-else class="text-muted text-opacity-25">-</span>
                                </td>
                                <td class="text-center">
                                    <span v-if="hasCraft(ammo)" title="ワークベンチ作成可能">🔧</span>
                                    <span v-else class="text-muted text-opacity-25">-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="filteredAmmo.length === 0" class="text-center text-secondary py-5">
                        データがありません。左のフィルターを選択してください。
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedAmmo" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.8); z-index: 1040;" @click.self="closeDetail">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content bg-dark text-white border-secondary shadow-lg">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title d-flex align-items-center gap-2">
                            <img :src="selectedAmmo.image512pxLink" width="32" height="32">
                            {{ selectedAmmo.name }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeDetail"></button>
                    </div>
                    <div class="modal-body">
                        
                        <h6 class="text-warning border-bottom border-secondary pb-1 mb-2">📊 基本性能 (Basic Stats)</h6>
                        <div class="row g-2 mb-3 text-center">
                            <div class="col-3"><div class="p-2 border border-secondary rounded bg-black"><div>ダメージ</div><div class="fs-4 fw-bold">{{ selectedAmmo.damage }}</div></div></div>
                            <div class="col-3"><div class="p-2 border border-secondary rounded bg-black"><div>貫通力</div><div class="fs-4 fw-bold">{{ selectedAmmo.penetrationPower }}</div></div></div>
                            <div class="col-3"><div class="p-2 border border-secondary rounded bg-black"><div>アーマーDmg</div><div class="fs-4">{{ selectedAmmo.armorDamage }}%</div></div></div>
                            <div class="col-3"><div class="p-2 border border-secondary rounded bg-black"><div>初速</div><div class="fs-4">{{ selectedAmmo.projectileSpeed }} m/s</div></div></div>
                        </div>

                        <h6 class="text-info border-bottom border-secondary pb-1 mb-2">🔧 武器・状態異常補正 (Modifiers)</h6>
                        <div class="row g-2 mb-3 small">
                            <div class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1">
                                <span>🎯 精度補正:</span> <span :class="selectedAmmo.accuracyModifier > 0 ? 'text-success' : 'text-danger'">{{ formatSigned(selectedAmmo.accuracyModifier) }}%</span>
                            </div>
                            <div class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1">
                                <span>👋 反動補正:</span> <span :class="selectedAmmo.recoilModifier < 0 ? 'text-success' : 'text-danger'">{{ formatSigned(selectedAmmo.recoilModifier) }}%</span>
                            </div>
                            <div class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1">
                                <span>↩️ 跳弾確率:</span> <span>{{ (selectedAmmo.ricochetChance * 100).toFixed(1) }}%</span>
                            </div>
                            <div class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1">
                                <span>🩸 軽出血率:</span> <span :class="selectedAmmo.lightBleedModifier > 0 ? 'text-success' : ''">{{ formatSigned(selectedAmmo.lightBleedModifier) }}%</span>
                            </div>
                            <div class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1">
                                <span>💉 重出血率:</span> <span :class="selectedAmmo.heavyBleedModifier > 0 ? 'text-success' : ''">{{ formatSigned(selectedAmmo.heavyBleedModifier) }}%</span>
                            </div>
                            <div class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1">
                                <span>💥 破砕確率:</span> <span>{{ (selectedAmmo.fragmentationChance * 100).toFixed(1) }}%</span>
                            </div>
                        </div>

                        <h6 class="text-success border-bottom border-secondary pb-1 mb-2">💰 入手方法 (Traders)</h6>
                        <div v-if="selectedAmmo.soldBy && selectedAmmo.soldBy.length > 0">
                            <ul class="list-group list-group-flush small">
                                <li v-for="(deal, idx) in selectedAmmo.soldBy" :key="idx" class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                                    <div>
                                        <span>{{ deal.vendor.name }} (Lv.{{ deal.minTraderLevel }})</span>
                                        <div v-if="deal.taskUnlockName" class="small text-warning">
                                            🔒 要: <span class="text-decoration-underline" style="cursor: pointer;" @click="$emit('open-task-from-name', deal.taskUnlockName)">{{ deal.taskUnlockName }}</span>
                                        </div>
                                    </div>
                                    <span class="fw-bold text-warning">{{ deal.priceRUB.toLocaleString() }} ₽</span>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="text-muted small mb-3">
                            トレーダー販売なし (またはデータなし)
                        </div>

                        <div v-if="hasCraft(selectedAmmo)">
                            <h6 class="text-primary border-bottom border-secondary pb-1 mb-2 mt-3">🔧 製造レシピ (Crafts)</h6>
                            <div v-for="(craft, cIdx) in selectedAmmo.crafts" :key="cIdx" class="bg-black border border-secondary rounded p-2 mb-2">
                                <div class="d-flex justify-content-between mb-1 align-items-center">
                                    <div>
                                        <span class="fw-bold text-primary">{{ craft.station.name }} (Lv.{{ craft.level }})</span>
                                        <div v-if="craft.taskUnlock" class="small text-warning">
                                            🔒 要: <span class="text-decoration-underline" style="cursor: pointer;" @click="$emit('open-task-from-name', craft.taskUnlock.name)">{{ craft.taskUnlock.name }}</span>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <span class="badge bg-success border border-light me-2" v-if="craft.rewardItems && craft.rewardItems.length > 0">
                                            x{{ craft.rewardItems[0].count }}
                                        </span>
                                        <span class="text-white small">{{ craft.duration }} s</span>
                                    </div>
                                </div>
                                <div class="small text-muted mb-1">素材:</div>
                                <div class="d-flex flex-wrap gap-2">
                                    <span v-for="(req, rIdx) in craft.requiredItems" :key="rIdx" class="badge bg-secondary border border-dark text-white">
                                        {{ req.item ? req.item.name : (req.attributes[0]?.name || 'Item') }} x{{ req.count }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-if="selectedAmmo.description" class="mt-3 p-2 bg-black border border-secondary rounded small text-muted">
                            {{ selectedAmmo.description }}
                        </div>

                        <div class="d-grid gap-2 mt-3">
                            <a :href="selectedAmmo.wikiLink" target="_blank" class="btn btn-outline-info btn-sm">📖 Wikiで詳細を見る</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
    `
};