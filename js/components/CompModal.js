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
            
            <div class="mb-3 d-flex justify-content-between flex-wrap gap-2 border-bottom border-secondary pb-2">
                <div><strong>Trader:</strong> {{ selectedTask.trader.name }}</div>
                <div><strong>Map:</strong> {{ selectedTask.map ? selectedTask.map.name : 'None' }}</div>
                <div v-if="selectedTask.minPlayerLevel > 0">
                    <span class="text-info fw-bold">Req Lv: {{ selectedTask.minPlayerLevel }}</span>
                </div>
                <div v-if="selectedTask.kappaRequired"><span class="badge badge-kappa">KAPPA</span></div>
                <div v-if="selectedTask.lightkeeperRequired"><span class="badge badge-lk">LK</span></div>
            </div>

            <div v-if="selectedTask.neededKeys && selectedTask.neededKeys.length > 0" class="mb-4">
                <h6 class="border-bottom pb-1 mb-2 text-warning">🔑 必要な鍵 (Needed Keys)</h6>
                <ul class="list-group">
                    <li v-for="(group, gIdx) in selectedTask.neededKeys" :key="'g'+gIdx" class="list-group-item bg-dark text-light border-secondary py-2">
                        <div v-for="(keyItem, kIdx) in group.keys" :key="'k'+kIdx" class="d-flex align-items-center gap-2 flex-wrap">
                            <span class="text-info fw-bold">{{ keyItem.name }}</span>
                            <span v-if="keyItem.shortName" class="text-muted small">({{ keyItem.shortName }})</span>
                            <a v-if="keyItem.wikiLink" :href="keyItem.wikiLink" target="_blank" class="btn btn-sm btn-outline-secondary py-0 px-1" style="font-size: 0.7em;">Wiki</a>
                        </div>
                    </li>
                </ul>
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