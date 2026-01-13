// js/components/CompDebug.js

const CompDebug = {
    props: [
        'taskData', 'hideoutData', 'itemsData', 'ammoData', 'itemDb', 
        'userHideout', 'completedTasks', 'ownedKeys', 'keyUserData', 'prioritizedTasks',
        'collectedItems', 'wishlist', 'playerLevel', 'gameMode', 'apiLang',
        'showChatTab',
        'showStoryTab' // ★追加: ストーリータブ設定を受け取る
    ],
    emits: ['update:showChatTab', 'update:showStoryTab'], // ★追加
    
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
                case 'ammoData': return this.ammoData;
                case 'itemDb': return this.itemDb; 
                case 'userProgress': return {
                    _settings: {
                        level: this.playerLevel,
                        gameMode: this.gameMode,
                        language: this.apiLang,
                        showChatTab: this.showChatTab,
                        showStoryTab: this.showStoryTab
                    },
                    userHideout: this.userHideout,
                    completedTasks: this.completedTasks,
                    prioritizedTasks: this.prioritizedTasks,
                    ownedKeys: this.ownedKeys,
                    keyUserData: this.keyUserData,
                    collectedItems: this.collectedItems,
                    wishlist: this.wishlist,
                    storyProgress: JSON.parse(localStorage.getItem('eft_story_progress') || '{}')
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
                <div class="col-md-2 border-end border-secondary bg-dark d-flex flex-column">
                    
                    <div class="list-group list-group-flush flex-grow-1 overflow-auto">
                        <div class="list-group-item bg-black text-secondary small fw-bold py-1">API Data</div>
                        
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='tasks'}" 
                                @click="currentView='tasks'">Tasks</button>
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='hideout'}" 
                                @click="currentView='hideout'">Hideout</button>
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='items'}" 
                                @click="currentView='items'">Items (Base)</button>
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='ammoData'}" 
                                @click="currentView='ammoData'">Ammo</button>
                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='itemDb'}" 
                                @click="currentView='itemDb'">Item Search DB</button>

                        <div class="list-group-item bg-black text-secondary small fw-bold py-1">User Data</div>

                        <button class="list-group-item list-group-item-action bg-dark text-white border-secondary" 
                                :class="{active: currentView==='userProgress'}" 
                                @click="currentView='userProgress'">All Save Data</button>
                    </div>

                    <div class="p-3 border-top border-secondary text-white">
                        <div class="small fw-bold text-secondary mb-2">Options</div>
                        
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="storySwitch"
                                :checked="showStoryTab"
                                @change="$emit('update:showStoryTab', $event.target.checked)">
                            <label class="form-check-label small" for="storySwitch">ストーリータブを表示</label>
                        </div>

                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="chatSwitch"
                                :checked="showChatTab"
                                @change="$emit('update:showChatTab', $event.target.checked)">
                            <label class="form-check-label small" for="chatSwitch">チャット機能を表示</label>
                        </div>
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