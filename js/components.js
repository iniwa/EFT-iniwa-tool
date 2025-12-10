// js/components.js

// Header
const CompHeader = {
    props: ['lastUpdated', 'isLoading', 'playerLevel'],
    emits: ['fetch-data', 'update:playerLevel', 'export-data', 'trigger-import'],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <h1 class="m-0">EFT Planner</h1>
        <div class="d-flex align-items-center gap-2">
            <div class="btn-group btn-group-sm me-2">
                <button class="btn btn-outline-light" @click="$emit('export-data')">Export</button>
                <button class="btn btn-outline-light" @click="$emit('trigger-import')">Import</button>
            </div>
            <div class="text-end small text-secondary d-none d-md-block me-2">
                <div v-if="lastUpdated">Data: {{ lastUpdated }}</div>
                <div v-else>Data: Backup</div>
            </div>
            <button class="btn btn-outline-info btn-sm" @click="$emit('fetch-data')" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                {{ isLoading ? '通信中...' : 'データ更新' }}
            </button>
            <div class="d-flex align-items-center gap-2 border-start ps-3 border-secondary">
                <label class="fw-bold">Level:</label>
                <input type="number" class="form-control form-control-sm text-center" style="width: 70px;" 
                       :value="playerLevel" @input="$emit('update:playerLevel', parseInt($event.target.value))" min="1" max="79">
            </div>
        </div>
    </div>
    `
};

// Input
const CompInput = {
    props: ['hideoutData', 'userHideout', 'forceHideoutFir', 'filteredTasksList', 'completedTasks', 'taskViewMode', 'showCompleted', 'showFuture', 'searchTask', 'tasksByTrader', 'tasksByMap'],
    emits: ['update:forceHideoutFir', 'update:taskViewMode', 'update:showCompleted', 'update:showFuture', 'update:searchTask', 'open-task-details', 'toggle-task'],
    template: `
    <div class="row">
        <div class="col-md-4 mb-3">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>🏠 ハイドアウト</span>
                    <div class="form-check form-switch m-0">
                        <input class="form-check-input" type="checkbox" :checked="forceHideoutFir" @change="$emit('update:forceHideoutFir', $event.target.checked)">
                        <label class="form-check-label small" style="color:#aaa;">全FIR強制</label>
                    </div>
                </div>
                <div class="card-body overflow-auto" style="max-height: 70vh;">
                    <div v-for="station in hideoutData" :key="station.name" class="mb-3">
                        <label class="form-label d-flex justify-content-between small mb-1">
                            <span>{{ station.name }}</span>
                            <span class="text-warning">Lv {{ userHideout[station.name] || 0 }}</span>
                        </label>
                        <input type="range" class="form-range" min="0" :max="station.levels.length" v-model.number="userHideout[station.name]">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-8 mb-3">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center py-2 flex-wrap gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <span>{{ showCompleted ? '✅ 完了済み' : '📜 受注可能なタスク' }}</span>
                        <button class="btn btn-sm" :class="showCompleted ? 'btn-warning' : 'btn-outline-secondary'" @click="$emit('update:showCompleted', !showCompleted)">
                            {{ showCompleted ? '戻る' : '完了済み履歴' }}
                        </button>
                        <div class="form-check form-switch ms-2" v-if="!showCompleted">
                            <input class="form-check-input" type="checkbox" :checked="showFuture" @change="$emit('update:showFuture', $event.target.checked)">
                            <label class="form-check-label small text-muted">ロック中も表示</label>
                        </div>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-warning" :class="{active: taskViewMode==='list'}" @click="$emit('update:taskViewMode', 'list')">List</button>
                        <button class="btn btn-outline-warning" :class="{active: taskViewMode==='trader'}" @click="$emit('update:taskViewMode', 'trader')">Trader</button>
                        <button class="btn btn-outline-warning" :class="{active: taskViewMode==='map'}" @click="$emit('update:taskViewMode', 'map')">Map</button>
                    </div>
                </div>
                <div class="card-body overflow-auto" style="max-height: 70vh;">
                    <input type="text" class="form-control mb-3" placeholder="タスク名で検索..." :value="searchTask" @input="$emit('update:searchTask', $event.target.value)">
                    
                    <div v-if="taskViewMode === 'list'" class="list-group">
                        <div v-for="task in filteredTasksList" :key="task.id" class="list-group-item d-flex align-items-center gap-3">
                            <input class="form-check-input flex-shrink-0 m-0" type="checkbox" :checked="completedTasks.includes(task.name)" @change="$emit('toggle-task', task.name)" style="cursor: pointer;">
                            <div class="w-100 d-flex justify-content-between align-items-center">
                                <span class="task-name-link" :class="{ 'text-decoration-line-through text-muted': showCompleted }" @click="$emit('open-task-details', task)">
                                    {{ task.name }}
                                    <span v-if="task.kappaRequired" class="badge badge-kappa ms-1">KAPPA</span>
                                    <span v-if="task.lightkeeperRequired" class="badge badge-lk ms-1">LK</span>
                                    <span v-if="task.map" class="badge bg-dark border border-secondary text-secondary ms-2 small">{{ task.map.name }}</span>
                                </span>
                                <span class="badge bg-secondary">{{ task.trader.name }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else>
                        <div v-for="(tasks, group) in (taskViewMode === 'trader' ? tasksByTrader : tasksByMap)" :key="group" class="mb-3">
                            <h6 class="text-warning border-bottom border-secondary pb-1">{{ group }}</h6>
                            <div class="list-group">
                                <div class="list-group-item d-flex align-items-center gap-3 py-1" v-for="task in tasks" :key="task.name">
                                    <input class="form-check-input flex-shrink-0 m-0" type="checkbox" :checked="completedTasks.includes(task.name)" @change="$emit('toggle-task', task.name)" style="cursor: pointer;">
                                    <div class="d-flex justify-content-between w-100">
                                        <span class="task-name-link" :class="{ 'text-decoration-line-through text-muted': showCompleted }" @click="$emit('open-task-details', task)">
                                            {{ task.name }}
                                            <span v-if="task.kappaRequired" class="badge badge-kappa ms-1">KAPPA</span>
                                            <span v-if="task.lightkeeperRequired" class="badge badge-lk ms-1">LK</span>
                                        </span>
                                        <small class="text-muted">{{ taskViewMode === 'trader' ? (task.map ? task.map.name : '') : task.trader.name }}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};

// Result
const CompResult = {
    props: ['shoppingList', 'collectedItems', 'expandedItems', 'displayLists'],
    emits: ['toggle-item-details', 'toggle-collected', 'open-task-from-name'],
    template: `
    <div class="row">
        <div v-for="(list, key) in displayLists" :key="key" class="col-xl-3 col-md-6 mb-3">
            <div class="card h-100" :class="list.borderClass">
                <div class="card-header" :class="list.headerClass">{{ list.title }}</div>
                <ul class="list-group list-group-flush overflow-auto" style="max-height: 70vh;">
                    <li v-for="item in list.items" :key="item.uid" class="list-group-item list-group-item-action">
                        <div class="d-flex align-items-center gap-2">
                            <input type="checkbox" class="form-check-input m-0" :checked="collectedItems.includes(item.uid)" @click.stop="$emit('toggle-collected', item.uid)">
                            <div class="d-flex justify-content-between align-items-center w-100" @click="$emit('toggle-item-details', item.uid)" style="cursor: pointer;">
                                <span :class="{'item-collected': collectedItems.includes(item.uid)}">{{ item.name }}</span>
                                <span class="badge" :class="[list.badgeClass, {'item-collected-badge': collectedItems.includes(item.uid)}]">{{ item.count }}</span>
                            </div>
                        </div>
                        <div v-if="expandedItems[item.uid]" class="mt-2 small text-muted border-top border-secondary pt-1">
                            <div v-for="source in item.sources" :key="source.name + source.type">
                                <span v-if="source.type === 'task' || source.type === 'collector'">
                                    ・<span class="source-task-link" @click="$emit('open-task-from-name', source.name)">{{ source.name }}</span> (x{{ source.count }})
                                </span>
                                <span v-else>
                                    ・{{ source.name }} (x{{ source.count }})
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `
};

// Keys Component (★7列表示・Devリンク追加)
const CompKeys = {
    props: ['shoppingList', 'ownedKeys', 'itemsData', 'keyUserData'], 
    emits: ['toggle-owned-key', 'open-task-from-name', 'update-key-user-data'],
    data() {
        return {
            viewMode: 'needed', 
            searchQuery: '',
            collapsedMaps: {},
            ratings: ['-', 'S', 'A', 'B', 'C', 'D', 'F', 'SS']
        }
    },
    computed: {
        filteredKeys() {
            let source = this.shoppingList.keys || [];
            
            if (this.viewMode === 'needed') {
                source = source.filter(k => 
                    k.sources && 
                    k.sources.length > 0 && 
                    k.sources.some(s => s.name && s.name !== '')
                );
            }

            const query = this.searchQuery.toLowerCase();
            return source.filter(k => {
                if (!query) return true;
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
            return Object.keys(groups).sort((a,b) => {
                if (a === 'Unknown / Other') return 1;
                if (b === 'Unknown / Other') return -1;
                return a.localeCompare(b);
            }).reduce((acc, key) => {
                acc[key] = groups[key].sort((a,b) => a.name.localeCompare(b.name));
                return acc;
            }, {});
        }
    },
    methods: {
        toggleMap(mapName) {
            this.collapsedMaps[mapName] = !this.collapsedMaps[mapName];
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
        }
    },
    template: `
    <div class="card border-info">
        <div class="card-header bg-dark text-info border-bottom border-info d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>🔑 鍵管理</div>
            
            <div class="d-flex gap-2 align-items-center">
                <div class="btn-group btn-group-sm">
                    <button class="btn" :class="viewMode==='needed' ? 'btn-info' : 'btn-outline-secondary'" @click="viewMode='needed'">タスクで使用</button>
                    <button class="btn" :class="viewMode==='all' ? 'btn-info' : 'btn-outline-secondary'" @click="viewMode='all'">全ての鍵</button>
                </div>
                <input type="text" class="form-control form-control-sm" style="width: 200px;" placeholder="鍵名で検索(逆引き)..." v-model="searchQuery">
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

                <div v-if="!collapsedMaps[mapName]">
                    <table class="table table-dark table-hover mb-0 key-table table-sm">
                        <thead>
                            <tr>
                                <th style="width: 40px;" class="text-center">所持</th>
                                <th style="width: 60px;" class="text-center">Rate</th>
                                <th style="width: 100px;">ShortName</th>
                                <th>Name / Memo</th>
                                <th style="width: 20%;">使用Task</th>
                                <th style="width: 50px;">Wiki</th>
                                <th style="width: 50px;">Dev</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in keys" :key="item.id" class="key-row" :class="{'key-owned': ownedKeys.includes(item.id)}">
                                <td class="text-center align-middle">
                                    <input type="checkbox" class="form-check-input" 
                                           :checked="ownedKeys.includes(item.id)" 
                                           @change="$emit('toggle-owned-key', item.id)">
                                </td>
                                
                                <td class="align-middle">
                                    <select class="form-select form-select-sm p-0 text-center" 
                                            style="height: 24px; background-color: #222; color: gold; border: 1px solid #555;"
                                            :value="getRating(item.id)"
                                            @change="onRatingChange(item.id, $event)">
                                        <option v-for="r in ratings" :key="r" :value="r">{{ r }}</option>
                                    </select>
                                </td>

                                <td class="align-middle text-info small">
                                    {{ item.shortName || '-' }}
                                </td>

                                <td class="align-middle">
                                    <div :class="{'item-collected': ownedKeys.includes(item.id)}" class="fw-bold small">{{ item.name }}</div>
                                    <input type="text" class="form-control form-control-sm mt-1 py-0" 
                                           style="background: transparent; border: none; border-bottom: 1px solid #444; color: #aaa; font-size: 0.8em;"
                                           placeholder="メモ..." 
                                           :value="getMemo(item.id)"
                                           @input="onMemoChange(item.id, $event)">
                                </td>

                                <td class="align-middle small">
                                    <div v-if="item.sources && item.sources.length > 0 && item.sources[0].name !== ''">
                                        <span v-for="(source, idx) in item.sources" :key="idx">
                                            <span v-if="source.type === 'task'" class="source-task-link text-info" @click="$emit('open-task-from-name', source.name)">
                                                {{ source.name }}
                                            </span>
                                            <span v-else>{{ source.name }}</span>
                                            <span v-if="idx < item.sources.length - 1">, </span>
                                        </span>
                                    </div>
                                    <span v-else class="text-muted">-</span>
                                </td>

                                <td class="align-middle text-center">
                                    <a v-if="item.wikiLink" :href="item.wikiLink" target="_blank" class="btn btn-sm btn-outline-warning py-0 px-1" title="Wiki">W</a>
                                    <span v-else class="text-muted">-</span>
                                </td>

                                <td class="align-middle text-center">
                                    <a v-if="item.normalizedName" :href="'https://tarkov.dev/item/' + item.normalizedName" target="_blank" class="btn btn-sm btn-outline-primary py-0 px-1" title="Tarkov.dev">D</a>
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

// js/components.js の CompModal

const CompModal = {
    // ★ props に 'completedTasks' を追加
    props: ['selectedTask', 'completedTasks'],
    // ★ emits に 'toggle-task' を追加
    emits: ['close', 'toggle-task'],
    template: `
    <div v-if="selectedTask" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content-custom">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center gap-3">
                    <div class="form-check m-0">
                        <input class="form-check-input fs-4" type="checkbox" 
                               :checked="completedTasks.includes(selectedTask.name)" 
                               @change="$emit('toggle-task', selectedTask.name)"
                               style="cursor: pointer;">
                    </div>
                    <div>
                        <h4 class="m-0 text-warning" :class="{'text-decoration-line-through text-muted': completedTasks.includes(selectedTask.name)}">
                            {{ selectedTask.name }}
                        </h4>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
            </div>
            
            <div class="mb-3 d-flex justify-content-between flex-wrap gap-2">
                <div><strong>Trader:</strong> {{ selectedTask.trader.name }}</div>
                <div><strong>Map:</strong> {{ selectedTask.map ? selectedTask.map.name : 'None' }}</div>
                <div v-if="selectedTask.kappaRequired"><span class="badge badge-kappa">KAPPA</span></div>
                <div v-if="selectedTask.lightkeeperRequired"><span class="badge badge-lk">LK</span></div>
            </div>
            <div class="d-grid gap-2 mb-4">
                <a v-if="selectedTask.wikiLink" :href="selectedTask.wikiLink" target="_blank" class="btn btn-outline-info btn-sm">📖 Wikiで詳細を見る</a>
            </div>

            <div v-if="selectedTask.objectives.length > 0" class="mb-4">
                <h6 class="border-bottom pb-1 mb-2 text-info">目標 (Objectives)</h6>
                <ul class="list-group">
                    <li v-for="(obj, idx) in selectedTask.objectives" :key="idx" class="list-group-item bg-dark text-light border-secondary py-2">
                        <div v-if="obj.item">
                            <span class="text-warning fw-bold">{{ obj.item.name }}</span> x {{ obj.count }}
                            <div class="mt-1">
                                <span v-if="obj.foundInRaid" class="badge bg-warning text-dark me-1">FIR</span>
                                <span v-if="obj.type === 'findItem' && !obj.foundInRaid" class="badge bg-secondary me-1">Find</span>
                                <span v-if="obj.type === 'giveItem'" class="badge bg-info text-dark me-1">Give</span>
                            </div>
                        </div>
                        <div v-else>
                            <span v-if="obj.description">{{ obj.description }}</span>
                            <span v-else class="text-muted small">(アクション目標)</span>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div v-if="selectedTask.finishRewardsList && selectedTask.finishRewardsList.length > 0">
                <h6 class="border-bottom pb-1 mb-2 text-success">報酬 (Rewards)</h6>
                <ul class="list-group">
                    <li v-for="(reward, idx) in selectedTask.finishRewardsList" :key="'r'+idx" class="list-group-item bg-dark text-light border-secondary py-1">
                        <div v-if="reward.type === 'item'">
                            📦 {{ reward.name }} <span class="text-warning">x{{ reward.count }}</span>
                        </div>
                        <div v-else-if="reward.type === 'offerUnlock'">
                            🔓 アンロック: {{ reward.itemName }} ({{ reward.trader }} Lv{{ reward.level }})
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `
};

// js/components.js の末尾 (CompDebug全体を書き換え)

const CompDebug = {
    props: ['taskData', 'hideoutData', 'itemsData', 'userHideout', 'completedTasks', 'ownedKeys'],
    data() {
        return {
            currentView: 'tasks',
            copyButtonText: 'クリップボードにコピー'
        }
    },
    computed: {
        displayData() {
            switch (this.currentView) {
                case 'tasks': return this.taskData;
                case 'hideout': return this.hideoutData;
                case 'items': return this.itemsData;
                case 'userProgress': return {
                    userHideout: this.userHideout,
                    completedTasks: this.completedTasks,
                    ownedKeys: this.ownedKeys
                };
                default: return {};
            }
        },
        formattedJson() {
            return JSON.stringify(this.displayData, null, 2);
        }
    },
    methods: {
        copyToClipboard() {
            navigator.clipboard.writeText(this.formattedJson).then(() => {
                this.copyButtonText = 'コピーしました！';
                setTimeout(() => this.copyButtonText = 'クリップボードにコピー', 2000);
            });
        }
    },
    template: `
    <div class="card h-100 border-secondary">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span>🐞 デバッグ / データ確認</span>
            <button class="btn btn-sm btn-outline-light" @click="copyToClipboard">{{ copyButtonText }}</button>
        </div>
        <div class="card-body p-0">
            <div class="row g-0 h-100">
                <div class="col-md-2 border-end border-secondary bg-dark">
                    <div class="list-group list-group-flush">
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='tasks'}" 
                                @click="currentView='tasks'">Tasks (API)</button>
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='hideout'}" 
                                @click="currentView='hideout'">Hideout (API)</button>
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='items'}" 
                                @click="currentView='items'">Items/Keys (API)</button>
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='userProgress'}" 
                                @click="currentView='userProgress'">User Save Data</button>
                    </div>
                </div>
                <div class="col-md-10 bg-dark">
                    <textarea class="form-control bg-dark text-white font-monospace border-0" 
                              style="height: 75vh; font-size: 12px; resize: none;" 
                              readonly :value="formattedJson"></textarea>
                </div>
            </div>
        </div>
    </div>
    `
};