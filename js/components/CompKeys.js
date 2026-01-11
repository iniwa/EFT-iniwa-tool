// js/components/CompKeys.js

const CompKeys = {
    props: ['ownedKeys', 'itemsData', 'keyUserData', 'viewMode', 'sortMode', 'shoppingList'], 
    emits: ['toggle-owned-key', 'open-task-from-name', 'update-key-user-data', 'update:viewMode', 'update:sortMode'],
    data() {
        return {
            searchQuery: '',
            collapsedMaps: {}, // マップごとの開閉状態 (true=閉じる)
            ratings: ['-', 'SS', 'S', 'A', 'B', 'C', 'D', 'F'],
            mapOrder: [
                "Customs",
                "Woods",
                "Interchange",
                "Factory",
                "Shoreline",
                "Lighthouse",
                "Reserve",
                "Streets of Tarkov",
                "Ground Zero",
                "The Lab",
                "The Labyrinth", 
                "Labyrinth"
            ]
        }
    },
    mounted() {
        const savedState = localStorage.getItem('eft_keys_collapsed_state');
        if (savedState) {
            try {
                this.collapsedMaps = JSON.parse(savedState);
                this.mapOrder.forEach(m => {
                    if (this.collapsedMaps[m] === undefined) {
                        this.collapsedMaps[m] = true;
                    }
                });
                if (this.collapsedMaps['Unknown / Other'] === undefined) {
                    this.collapsedMaps['Unknown / Other'] = true;
                }
            } catch (e) {
                console.warn("Failed to load collapsed state", e);
                this.collapseAll();
            }
        } else {
            this.collapseAll();
        }
    },
    watch: {
        collapsedMaps: {
            handler(newVal) {
                localStorage.setItem('eft_keys_collapsed_state', JSON.stringify(newVal));
            },
            deep: true
        }
    },
    computed: {
        filteredKeys() {
            let rawSource = (this.itemsData && this.itemsData.items) ? this.itemsData.items : [];
            const validKeyIds = new Set();
            const sourceLookup = {};

            if (this.shoppingList && this.shoppingList.keys) {
                this.shoppingList.keys.forEach(k => {
                    if (k.id) {
                        validKeyIds.add(k.id);
                        if (k.sources && k.sources.length > 0) {
                            if (!sourceLookup[k.id]) sourceLookup[k.id] = [];
                            k.sources.forEach(src => {
                                const exists = sourceLookup[k.id].some(existing => existing.name === src.name && existing.type === src.type);
                                if (!exists && src.name) sourceLookup[k.id].push(src);
                            });
                        }
                    }
                });
            }

            let source = rawSource
                .filter(item => validKeyIds.has(item.id))
                .map(item => {
                    return {
                        ...item,
                        sources: sourceLookup[item.id] || []
                    };
                });
            
            if (this.viewMode === 'owned') {
                source = source.filter(k => this.ownedKeys.includes(k.id));
            }

            const query = this.searchQuery.toLowerCase();
            if (!query) return source;
            
            return source.filter(k => {
                return (k.name && k.name.toLowerCase().includes(query)) || 
                    (k.shortName && k.shortName.toLowerCase().includes(query));
            });
        },
        groupedKeys() {
            const groups = {};
            this.filteredKeys.forEach(k => {
                const map = k.mapName || 'Unknown / Other';
                if (!groups[map]) groups[map] = [];
                groups[map].push(k);
            });

            const sortedMapNames = Object.keys(groups).sort((a,b) => {
                if (a === 'Unknown / Other') return 1;
                if (b === 'Unknown / Other') return -1;
                const idxA = this.mapOrder.indexOf(a);
                const idxB = this.mapOrder.indexOf(b);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.localeCompare(b);
            });

            return sortedMapNames.reduce((acc, mapName) => {
                const items = groups[mapName];
                items.sort((a, b) => {
                    if (this.sortMode === 'owned_first') {
                        const isOwnedA = this.ownedKeys.includes(a.id);
                        const isOwnedB = this.ownedKeys.includes(b.id);
                        if (isOwnedA !== isOwnedB) return isOwnedA ? -1 : 1;
                    } else if (this.sortMode === 'rating') {
                        const getScore = (id) => {
                            const r = (this.keyUserData && this.keyUserData[id] && this.keyUserData[id].rating) || '-';
                            const map = {'SS':12, 'S':10, 'A':8, 'B':6, 'C':4, 'D':2, 'F':0, '-': -1}; 
                            return map[r] !== undefined ? map[r] : -1;
                        };
                        const scoreA = getScore(a.id);
                        const scoreB = getScore(b.id);
                        if (scoreA !== scoreB) return scoreB - scoreA;
                    }
                    return a.name.localeCompare(b.name);
                });
                acc[mapName] = items;
                return acc;
            }, {});
        }
    },
    methods: {
        toggleMap(mapName) {
            this.collapsedMaps[mapName] = !this.collapsedMaps[mapName];
        },
        collapseAll() {
            Object.keys(this.groupedKeys).forEach(mapName => {
                this.collapsedMaps[mapName] = true;
            });
            this.collapsedMaps['Unknown / Other'] = true;
        },
        expandAll() {
            Object.keys(this.collapsedMaps).forEach(k => this.collapsedMaps[k] = false);
        },
        getRating(id) {
            if (!this.keyUserData) return '-';
            return (this.keyUserData[id] && this.keyUserData[id].rating) || '-';
        },
        getMemo(id) {
            if (!this.keyUserData) return '';
            return (this.keyUserData[id] && this.keyUserData[id].memo) || '';
        },
        onRatingChange(id, event) {
            this.$emit('update-key-user-data', id, 'rating', event.target.value);
        },
        onMemoChange(id, event) {
            this.$emit('update-key-user-data', id, 'memo', event.target.value);
        },
        formatSourceName(name) {
            if (!name) return '';
            return name.replace(/^Task:\s*/, '');
        },
        getKeyClass(keyId) {
             return this.ownedKeys.includes(keyId) ? 'table-success' : '';
        },
        getButtonClass(keyId) {
             return this.ownedKeys.includes(keyId) ? 'btn-success' : 'btn-outline-secondary';
        }
    },
    template: `
    <div class="card border-info">
        <div class="card-header bg-dark text-info border-bottom border-info">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-3">
                    <div class="fw-bold fs-5">🔑 鍵管理</div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary text-light" @click="collapseAll" title="全てのマップを閉じる">全て収納</button>
                        <button class="btn btn-outline-secondary text-light" @click="expandAll" title="全てのマップを開く">全て展開</button>
                    </div>
                </div>
                <input type="text" class="form-control form-control-sm" style="width: 200px;" 
                    placeholder="鍵名で検索..." v-model="searchQuery">
            </div>

            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div class="d-flex align-items-center gap-2">
                    <span class="small text-secondary">表示:</span>
                    <div class="btn-group btn-group-sm">
                        <button class="btn" :class="viewMode==='all' || viewMode==='needed' ? 'btn-info' : 'btn-outline-secondary'" 
                                @click="$emit('update:viewMode', 'all')">全ての鍵</button>
                        <button class="btn" :class="viewMode==='owned' ? 'btn-info' : 'btn-outline-secondary'" 
                                @click="$emit('update:viewMode', 'owned')">所持のみ</button>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="small text-secondary">並び順:</span>
                    <select class="form-select form-select-sm bg-dark text-white border-secondary" 
                            style="width: auto;"
                            :value="sortMode" 
                            @change="$emit('update:sortMode', $event.target.value)">
                        <option value="map">マップ順 (Default)</option>
                        <option value="owned_first">所持済みを先頭に</option>
                        <option value="rating">Rate順 (SS -> F)</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="card-body p-0 overflow-auto" style="max-height: 80vh;">
            <div v-for="(keys, mapName) in groupedKeys" :key="mapName" class="map-group">
                <div class="map-header px-3 py-2 d-flex justify-content-between align-items-center" 
                    @click="toggleMap(mapName)"
                    style="background-color: #2c3e50; cursor: pointer; border-bottom: 1px solid #444;">
                    <span class="fw-bold text-white">{{ mapName }} ({{ keys.length }})</span>
                    <span class="small text-muted">{{ collapsedMaps[mapName] ? '▼ 表示' : '▲ 非表示' }}</span>
                </div>

                <div v-show="!collapsedMaps[mapName]">
                    <table class="table table-dark table-hover mb-0 key-table table-sm" style="table-layout: fixed;">
                        <thead>
                            <tr>
                                <th style="width: 50px;" class="text-center">所持</th>
                                <th style="width: 70px;" class="text-center">Rate</th>
                                <th style="width: 100px;">ShortName</th>
                                <th>Name / Memo</th>
                                <th style="width: 180px;">使用Task</th>
                                <th style="width: 50px;" class="text-center">Wiki</th>
                                <th style="width: 50px;" class="text-center">Dev</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in keys" :key="item.id" class="key-row" :class="{'key-owned': ownedKeys.includes(item.id)}">
                                <td class="text-center align-middle">
                                    <input type="checkbox" class="form-check-input" 
                                        style="cursor: pointer;"
                                        :checked="ownedKeys.includes(item.id)" 
                                        @change="$emit('toggle-owned-key', item.id)">
                                </td>
                                
                                <td class="align-middle text-center">
                                    <select class="form-select form-select-sm p-0 text-center" 
                                            style="height: 24px; background-color: #222; color: gold; border: 1px solid #555;"
                                            :value="getRating(item.id)"
                                            @change="onRatingChange(item.id, $event)"
                                            @click.stop>
                                        <option v-for="r in ratings" :key="r" :value="r">{{ r }}</option>
                                    </select>
                                </td>

                                <td class="align-middle text-info small text-truncate" :title="item.shortName">
                                    {{ item.shortName || '-' }}
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="bg-black rounded d-flex align-items-center justify-content-center flex-shrink-0" style="width: 32px; height: 32px; border: 1px solid #444;">
                                            <img v-if="item.image512pxLink" :src="item.image512pxLink" alt="" 
                                                style="max-width: 100%; max-height: 100%; object-fit: contain;">
                                        </div>
                                        
                                        <div style="min-width: 0; flex-grow: 1;">
                                            <div :class="{'item-collected': ownedKeys.includes(item.id)}" class="fw-bold small text-truncate" :title="item.name">
                                                {{ item.name }}
                                            </div>
                                            <input type="text" class="form-control form-control-sm mt-1 py-0" 
                                                style="background: transparent; border: none; border-bottom: 1px solid #444; color: #aaa; font-size: 0.8em;"
                                                placeholder="メモ..." 
                                                :value="getMemo(item.id)"
                                                @input="onMemoChange(item.id, $event)">
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle small">
                                    <div v-if="item.sources && item.sources.length > 0">
                                        <div v-for="(source, idx) in item.sources" :key="idx" class="text-truncate">
                                            <span v-if="source.type === 'task'" class="source-task-link text-info" style="cursor: pointer; text-decoration: underline;" 
                                                @click="$emit('open-task-from-name', formatSourceName(source.name))">
                                                {{ formatSourceName(source.name) }}
                                            </span>
                                            <span v-else>{{ source.name }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="text-muted">-</span>
                                </td>

                                <td class="align-middle text-center">
                                    <a v-if="item.wikiLink" :href="item.wikiLink" target="_blank" class="btn btn-sm btn-outline-warning py-0 px-1" title="Wiki" @click.stop>W</a>
                                    <span v-else class="text-muted">-</span>
                                </td>

                                <td class="align-middle text-center">
                                    <a v-if="item.normalizedName" :href="'https://tarkov.dev/item/' + item.normalizedName" target="_blank" class="btn btn-sm btn-outline-primary py-0 px-1" title="Tarkov.dev" @click.stop>D</a>
                                    <span v-else class="text-muted">-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div v-if="Object.keys(groupedKeys).length === 0" class="text-center py-4 text-muted">
                鍵が見つかりません。
            </div>
        </div>
    </div>
    `
};