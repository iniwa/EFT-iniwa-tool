const CompInput = {
    props: ['hideoutData', 'userHideout', 'filteredTasksList', 'completedTasks', 'taskViewMode', 'showCompleted', 'showFuture', 'searchTask', 'tasksByTrader', 'tasksByMap', 'showMaxedHideout'],
    emits: ['update:taskViewMode', 'update:showCompleted', 'update:showFuture', 'update:searchTask', 'open-task-details', 'toggle-task', 'update:showMaxedHideout'],
    
    computed: {
        visibleHideoutStations() {
            if (!this.hideoutData) return [];
            if (this.showMaxedHideout) return this.hideoutData;
            return this.hideoutData.filter(station => {
                const currentLevel = this.userHideout[station.name] || 0;
                const maxLevel = station.levels.length;
                return currentLevel < maxLevel;
            });
        }
    },

    template: `
    <div class="row">
        <div class="col-md-4 mb-3">
            <div class="card h-100">
                <div class="card-header py-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span>🏠 ハイドアウト</span>
                        </div>
                    
                    <div class="d-grid">
                        <button class="btn btn-sm" :class="showMaxedHideout ? 'btn-warning' : 'btn-outline-secondary'" 
                                @click="$emit('update:showMaxedHideout', !showMaxedHideout)">
                            {{ showMaxedHideout ? '完了済みを隠す' : '完了済みを表示' }}
                        </button>
                    </div>
                </div>

                <div class="card-body overflow-auto" style="max-height: 70vh;">
                    <div v-for="station in visibleHideoutStations" :key="station.name" class="mb-3">
                        <label class="form-label d-flex justify-content-between small mb-1">
                            <span>{{ station.name }}</span>
                            <span class="text-warning">
                                Lv {{ userHideout[station.name] || 0 }} 
                                <span class="text-muted" style="font-size:0.8em;">/ {{ station.levels.length }}</span>
                            </span>
                        </label>
                        <input type="range" class="form-range" min="0" :max="station.levels.length" v-model.number="userHideout[station.name]">
                    </div>
                    
                    <div v-if="visibleHideoutStations.length === 0" class="text-center text-muted small py-4">
                        全ての設備がレベルMAXです 🎉
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
                                    <span v-if="task.mapLabel" class="badge bg-dark border border-secondary text-secondary ms-2 small">{{ task.mapLabel }}</span>
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
                                        <small class="text-muted">{{ taskViewMode === 'trader' ? task.mapLabel : task.trader.name }}</small>
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