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

// Keys
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
                <input type="text" class="form-control form-control-sm" style="width: 200px;" placeholder="鍵名で検索..." v-model="searchQuery">
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
                    <table class="table table-dark table-hover mb-0 key-table table-sm" style="table-layout: fixed;">
                        <thead>
                            <tr>
                                <th style="width: 50px;" class="text-center">所持</th>
                                <th style="width: 70px;" class="text-center">Rate</th>
                                <th style="width: 120px;">ShortName</th>
                                <th>Name / Memo</th>
                                <th style="width: 200px;">使用Task</th>
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
                                            @change="onRatingChange(item.id, $event)">
                                        <option v-for="r in ratings" :key="r" :value="r">{{ r }}</option>
                                    </select>
                                </td>

                                <td class="align-middle text-info small text-truncate" :title="item.shortName">
                                    {{ item.shortName || '-' }}
                                </td>

                                <td class="align-middle">
                                    <div :class="{'item-collected': ownedKeys.includes(item.id)}" class="fw-bold small text-truncate" :title="item.name">
                                        {{ item.name }}
                                    </div>
                                    <input type="text" class="form-control form-control-sm mt-1 py-0" 
                                        style="background: transparent; border: none; border-bottom: 1px solid #444; color: #aaa; font-size: 0.8em;"
                                        placeholder="メモ..." 
                                        :value="getMemo(item.id)"
                                        @input="onMemoChange(item.id, $event)">
                                </td>

                                <td class="align-middle small">
                                    <div v-if="item.sources && item.sources.length > 0 && item.sources[0].name !== ''">
                                        <div v-for="(source, idx) in item.sources" :key="idx" class="text-truncate">
                                            <span v-if="source.type === 'task'" class="source-task-link text-info" @click="$emit('open-task-from-name', source.name)">
                                                {{ source.name }}
                                            </span>
                                            <span v-else>{{ source.name }}</span>
                                        </div>
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

// js/components.js の CompFlowchart (クリック検知 完全修正版)

const CompFlowchart = {
    props: ['taskData', 'completedTasks'],
    emits: ['toggle-task', 'open-task-details'],
    data() {
        return {
            selectedTrader: 'Prapor',
            // マッピングデータをコンポーネント内で保持
            nodeMap: {} 
        };
    },
    computed: {
        traderList() {
            if (!this.taskData) return [];
            const traders = new Set(this.taskData.map(t => t.trader ? t.trader.name : 'Unknown'));
            return Array.from(traders).sort();
        }
    },
    watch: {
        selectedTrader() { this.renderChart(); },
        completedTasks: { deep: true, handler() { this.renderChart(); } },
        taskData() { this.renderChart(); }
    },
    mounted() {
        mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'dark',
            securityLevel: 'loose',
            flowchart: { 
                useMaxWidth: false, 
                htmlLabels: true 
            }
        });
        this.renderChart();
    },
    methods: {
        async renderChart() {
            if (!this.taskData || this.taskData.length === 0) return;
            await Vue.nextTick();

            const container = this.$refs.mermaidContainer;
            if (!container) return;

            // ■ 1. 単純な連番IDでマッピングを作成 (記号トラブルを回避)
            this.nodeMap = {}; 
            const nameToSimpleId = {};
            let counter = 0;

            this.taskData.forEach(t => {
                const simpleId = `task${counter++}`;
                nameToSimpleId[t.name] = simpleId;
                this.nodeMap[simpleId] = t; // ID -> タスク情報の辞書
            });

            // ■ 2. 表示対象の抽出
            const currentTraderTasks = this.taskData.filter(t => t.trader.name === this.selectedTrader);
            const nodesToRender = new Set();
            const edges = [];

            currentTraderTasks.forEach(task => {
                const myId = nameToSimpleId[task.name];
                if (!myId) return;

                nodesToRender.add(task.name);

                if (task.taskRequirements) {
                    task.taskRequirements.forEach(req => {
                        const reqName = req.task.name;
                        const reqId = nameToSimpleId[reqName];
                        if (reqId) {
                            nodesToRender.add(reqName);
                            edges.push({ from: reqId, to: myId });
                        }
                    });
                }
            });

            // ■ 3. Mermaid構文の生成
            let graph = 'graph LR\n';
            
            // スタイル定義 (カーソルを指にする)
            graph += 'classDef default cursor:pointer;\n';
            graph += 'classDef done fill:#198754,stroke:#fff,stroke-width:2px,color:white;\n'; 
            graph += 'classDef todo fill:#212529,stroke:#666,stroke-width:2px,color:white;\n'; 
            graph += 'classDef external fill:#343a40,stroke:#6c757d,stroke-width:1px,color:#adb5bd,stroke-dasharray: 5 5;\n';

            nodesToRender.forEach(taskName => {
                const nodeId = nameToSimpleId[taskName];
                const isCompleted = this.completedTasks.includes(taskName);
                const task = this.taskData.find(t => t.name === taskName);
                
                let className = isCompleted ? 'done' : 'todo';
                if (task && task.trader.name !== this.selectedTrader) className = 'external';

                // ラベルのエスケープ処理
                const safeLabel = taskName.replace(/"/g, "'").replace(/\(/g, "（").replace(/\)/g, "）");
                
                // ノード定義 (clickコマンドは書かない)
                graph += `${nodeId}["${safeLabel}"]:::${className}\n`;
            });

            edges.forEach(edge => {
                graph += `${edge.from} --> ${edge.to}\n`;
            });

            // ■ 4. レンダリング
            try {
                container.innerHTML = '';
                const id = `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, graph);
                container.innerHTML = svg;
                
                // 線のクリック判定を無効化 (ノードをクリックしやすくする)
                const paths = container.querySelectorAll('path, .edgeLabel');
                paths.forEach(p => p.style.pointerEvents = 'none');

            } catch (e) {
                console.error('Mermaid Render Error:', e);
                container.innerHTML = '<div class="alert alert-warning">描画エラー</div>';
            }
        },

        // ■ 5. Vue標準のクリックハンドラ (一番確実な方法)
        onChartClick(event) {
            // クリックされた要素から親をたどり、IDを持つグループ要素(g.node)を探す
            // MermaidのノードIDは "flowchart-task123-..." のような形式になるため "task..." を探す
            const targetNode = event.target.closest('.node');
            
            if (!targetNode) return; // ノード以外をクリックした場合は無視

            // IDから "task123" の部分を抽出
            // 例: id="mermaid-173...-task10" -> "task10" を探す
            const match = targetNode.id.match(/(task\d+)/);
            if (!match) return;

            const simpleId = match[1];
            const task = this.nodeMap[simpleId];

            if (task) {
                if (event.shiftKey) {
                    // Shift + Click
                    this.$emit('toggle-task', task.name);
                } else {
                    // Click
                    this.$emit('open-task-details', task);
                }
            }
        }
    },
    template: `
    <div class="card h-100 border-secondary">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
                <span>🗺️ タスクフローチャート</span>
                <select class="form-select form-select-sm bg-dark text-white border-secondary" 
                        style="width: 200px;" 
                        v-model="selectedTrader">
                    <option v-for="t in traderList" :key="t" :value="t">{{ t }}</option>
                </select>
            </div>
            <small class="text-muted">※左クリック: 詳細 / <span class="text-warning fw-bold">Shift+クリック: 完了切替</span></small>
        </div>
        <div class="card-body bg-dark overflow-auto p-0" style="min-height: 60vh;">
             <div ref="mermaidContainer" class="p-4" 
                  style="min-width: 100%; width: max-content; cursor: default;"
                  @click="onChartClick">
                <span class="text-secondary">Loading...</span>
             </div>
        </div>
    </div>
    `
};

// Modal (Craft info added)
const CompModal = {
    props: ['selectedTask', 'completedTasks'],
    emits: ['close', 'toggle-task'],
    template: `
    <div v-if="selectedTask" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content-custom">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="d-flex align-items-center gap-3 w-100">
                    <label class="custom-check-container" :class="{'is-checked': completedTasks.includes(selectedTask.name)}">
                        <input type="checkbox" class="custom-check-input"
                            :checked="completedTasks.includes(selectedTask.name)" 
                            @change="$emit('toggle-task', selectedTask.name)">
                        <span class="custom-check-box"></span>
                        <span class="custom-check-label">
                            {{ completedTasks.includes(selectedTask.name) ? '完了済み (Completed)' : '完了にする' }}
                        </span>
                    </label>
                </div>
                <button type="button" class="btn-close btn-close-white flex-shrink-0 ms-3" @click="$emit('close')"></button>
            </div>
            
            <h4 class="m-0 text-warning mb-3" :class="{'text-decoration-line-through text-muted': completedTasks.includes(selectedTask.name)}">
                {{ selectedTask.name }}
            </h4>
            
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
                            🔓 販売: {{ reward.itemName }} ({{ reward.trader }} Lv{{ reward.level }})
                        </div>

                        <div v-else-if="reward.type === 'craftUnlock'" class="text-info">
                            🔨 生成: {{ reward.itemName }} ({{ reward.station }} Lv{{ reward.level }})
                        </div>

                    </li>
                </ul>
            </div>
        </div>
    </div>
    `
};

// Debug
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

// Chat
const CompChat = {
    props: ['taskData', 'hideoutData', 'itemsData'],
    data() {
        return {
            apiKey: localStorage.getItem('gemini_api_key') || '',
            userMessage: '',
            chatHistory: [], 
            isSending: false
        };
    },
    watch: {
        apiKey(newVal) {
            localStorage.setItem('gemini_api_key', newVal);
        }
    },
    methods: {
        renderMarkdown(text) {
            if (!text) return '';
            return marked.parse(text, { breaks: true });
        },

        async sendMessage() {
            if (!this.userMessage.trim()) return;
            if (!this.apiKey) {
                alert("APIキーを入力してください");
                return;
            }

            const question = this.userMessage;
            this.chatHistory.push({ role: 'user', text: question });
            this.userMessage = '';
            this.isSending = true;

            try {
                const contextData = {
                    tasks: this.taskData.map(t => ({
                        name: t.name,
                        trader: t.trader.name,
                        map: t.map ? t.map.name : "Any",
                        rewards: {
                            items: t.finishRewardsList.filter(r => r.type === 'item').map(r => r.name),
                            unlocks: t.finishRewardsList.filter(r => r.type === 'offerUnlock').map(r => `Buy ${r.itemName} from ${r.trader} LL${r.level}`),
                            crafts: t.finishRewardsList.filter(r => r.type === 'craftUnlock').map(r => `Craft ${r.itemName} at ${r.station} Lv${r.level}`)
                        }
                    }))
                };

                const systemPrompt = `
あなたはEscape from Tarkovのデータ分析アシスタントです。
以下のJSONデータを参照して、ユーザーの質問に日本語で答えてください。
回答にはMarkdown記法（太字、リスト、表など）を積極的に使用して見やすく整形してください。

【データ】
${JSON.stringify(contextData)}
`;

                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: systemPrompt + "\n\n【質問】" + question }]
                            }
                        ]
                    })
                });

                const data = await response.json();
                
                if (data.error) throw new Error(data.error.message);

                const answer = data.candidates[0].content.parts[0].text;
                this.chatHistory.push({ role: 'model', text: answer });

            } catch (err) {
                console.error(err);
                this.chatHistory.push({ role: 'model', text: `**エラーが発生しました:** \n${err.message}` });
            } finally {
                this.isSending = false;
            }
        },
        
        clearHistory() {
            this.chatHistory = [];
        }
    },
    template: `
    <div class="card h-100 border-secondary">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span>🤖 AI Assistant (Gemini)</span>
            <input type="password" class="form-control form-control-sm" style="width: 200px;" 
                   placeholder="Gemini API Key" v-model="apiKey">
        </div>
        <div class="card-body bg-dark d-flex flex-column p-0" style="height: 70vh;">
            <div class="flex-grow-1 overflow-auto p-3" style="background-color: #1e1e1e;">
                <div v-if="chatHistory.length === 0" class="text-muted text-center mt-5">
                    データについて何でも聞いてください。<br>
                    例: 「クラフトが解禁されるタスクを教えて」「PraporのタスクでKappa必須のものは？」
                </div>
                
                <div v-for="(msg, idx) in chatHistory" :key="idx" class="mb-3">
                    <div v-if="msg.role === 'user'" class="text-end">
                        <span class="d-inline-block bg-primary text-white rounded p-2 text-start" style="max-width: 80%;">
                            {{ msg.text }}
                        </span>
                    </div>
                    <div v-else class="text-start">
                        <div class="d-inline-block bg-secondary text-white rounded p-3 markdown-body" 
                             style="max-width: 90%; overflow-x: auto;" 
                             v-html="renderMarkdown(msg.text)">
                        </div>
                    </div>
                </div>

                <div v-if="isSending" class="mb-3 text-start">
                    <div class="d-inline-block bg-secondary text-white rounded p-2" style="opacity: 0.8;">
                        <span class="spinner-grow spinner-grow-sm me-2" role="status" aria-hidden="true" style="vertical-align: middle;"></span>
                        <span style="font-size: 0.9em;">AIが考え中...</span>
                    </div>
                </div>

            </div>
            
            <div class="p-3 border-top border-secondary bg-dark">
                <div class="input-group">
                    <input type="text" class="form-control bg-dark text-white border-secondary" 
                           placeholder="質問を入力..." v-model="userMessage" @keyup.enter="sendMessage" :disabled="isSending">
                    <button class="btn btn-info" @click="sendMessage" :disabled="isSending">
                        <span v-if="isSending">送信中...</span>
                        <span v-else>送信</span>
                    </button>
                    <button class="btn btn-outline-secondary" @click="clearHistory" :disabled="isSending">クリア</button>
                </div>
                <small class="text-muted mt-1 d-block">※APIキーはブラウザにのみ保存されます。</small>
            </div>
        </div>
    </div>
    `
};