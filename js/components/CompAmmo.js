const CompAmmo = {
    props: ['ammoData'],
    data() {
        return {
            selectedCalibers: [],
            sortKey: 'penetrationPower',
            sortDesc: true,
            // フィルター表示用の階層データ (固定設定)
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
                // AR
                'Caliber556x45NATO': { name: '5.56x45mm NATO', examples: 'M4A1, HK416, MDR' },
                'Caliber762x39': { name: '7.62x39mm', examples: 'AKM, Mk47, SKS' },
                'Caliber545x39': { name: '5.45x39mm', examples: 'AK-74, RPK-16' },
                'Caliber762x51': { name: '7.62x51mm NATO', examples: 'M80, SR-25, SCAR-H' },
                'Caliber762x35': { name: '.300 Blackout', examples: 'MCX, M4 (mod)' },
                'Caliber366TKM': { name: '.366 TKM', examples: 'VPO-209, VPO-215' },
                'Caliber127x55': { name: '12.7x55mm', examples: 'ASh-12, RSh-12' },
                'Caliber68x51': { name: '6.8x51mm', examples: 'SIG Spear' },
                'Caliber9x39': { name: '9x39mm', examples: 'VSS, AS VAL' },

                // DMR/SR
                'Caliber762x51': { name: '7.62x51mm NATO', examples: 'M80, SR-25, SCAR-H' },
                'Caliber762x54R': { name: '7.62x54mm R', examples: 'Mosin, SVDS, PKM' },
                'Caliber86x70': { name: '.338 Lapua Magnum', examples: 'AXMC, Mk-18 Mjolnir' },
                'Caliber127x99': { name: '.50 BMG', examples: 'M82A1' },
                'Caliber93x64': { name: '9.3x64mm Brenneke', examples: 'SVDK' },

                // SMG/HG
                'Caliber9x19PARA': { name: '9x19mm Parabellum', examples: 'MP5, Vector, Glock' },
                'Caliber1143x23ACP': { name: '.45 ACP', examples: 'UMP, M1911, Vector' },
                'Caliber46x30': { name: '4.6x30mm HK', examples: 'MP7' },
                'Caliber57x28': { name: '5.7x28mm FN', examples: 'P90, Five-seveN' },
                'Caliber9x21': { name: '9x21mm Gyurza', examples: 'SR-2M Veresk' },
                'Caliber9x18PM': { name: '9x18mm PM', examples: 'Kedr, Makarov' },
                'Caliber762x25TT': { name: '7.62x25mm TT', examples: 'PPSH, TT' },
                'Caliber9x33R': { name: '.357 Magnum', examples: 'Rhino' },
                'Caliber127x33': { name: '.50 Action Express', examples: 'Desert Eagle' },

                // SG
                'Caliber12g': { name: '12/70 Gauge', examples: 'MP-153, Saiga-12' },
                'Caliber20g': { name: '20/70 Gauge', examples: 'TOZ-106' },
                'Caliber23x75': { name: '23x75mm', examples: 'KS-23M' },

                // Other
                'Caliber40x46': { name: '40x46mm Grenade', examples: 'M203, M32A1' },
                'Caliber40mmRU': { name: '40mm VOG', examples: 'GP-25' },
                'Caliber26x75': { name: '26x75mm Flare', examples: 'Signal Pistol' },
                'Caliber20x1mm': { name: '20x1mm', examples: 'Toy Gun' },
            }
        };
    },
    computed: {
        // 全データの口径リスト
        allCalibersFlat() {
            if (!this.ammoData) return [];
            return Array.from(new Set(this.ammoData.map(a => a.caliber)));
        },
        // ★追加: 定義済みの口径リスト (重複排除用)
        knownCalibers() {
            const ids = new Set();
            this.CALIBER_GROUPS.forEach(group => {
                group.sections.forEach(section => {
                    section.ids.forEach(id => ids.add(id));
                });
            });
            return ids;
        },
        // ★追加: 未定義の口径リスト
        unknownCalibers() {
            if (!this.ammoData) return [];
            // 全データの中にあり、かつ定義リストに含まれていないものを抽出
            return this.allCalibersFlat.filter(cal => !this.knownCalibers.has(cal)).sort();
        },
        // ★追加: 表示用の統合グループリスト
        extendedCaliberGroups() {
            // 元のグループ設定をコピー
            const groups = JSON.parse(JSON.stringify(this.CALIBER_GROUPS));
            const unknown = this.unknownCalibers;

            // 未知の口径があれば、「Unknown / New」グループとして末尾に追加
            if (unknown.length > 0) {
                groups.push({
                    category: "Unknown / New",
                    icon: "❓",
                    sections: [
                        {
                            title: "Uncategorized",
                            ids: unknown
                        }
                    ]
                });
            }
            return groups;
        },
        filteredAmmo() {
            if (!this.ammoData) return [];
            
            let data = this.ammoData;

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
        getBgColor(pen) {
            if (pen >= 60) return '#dc3545'; 
            if (pen >= 50) return '#fd7e14'; 
            if (pen >= 40) return '#ffc107'; 
            if (pen >= 30) return '#198754'; 
            return '#6c757d'; 
        },
        getCaliberInfo(calId) {
            // マップにない場合も安全にデフォルト値を返す
            return this.CALIBER_MAP[calId] || { name: calId.replace('Caliber', ''), examples: 'Unknown Weapon' };
        },
        hasData(calId) {
            return this.allCalibersFlat.includes(calId);
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