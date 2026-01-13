// js/components/CompDebug.js

const CompDebug = {
    props: [
        'taskData', 'hideoutData', 'itemsData', 'ammoData', 'itemDb', 
        'userHideout', 'completedTasks', 'ownedKeys', 'keyUserData', 'prioritizedTasks',
        'collectedItems', 'wishlist', 'playerLevel', 'gameMode', 'apiLang',
        'showChatTab',
        'showStoryTab'
    ],
    // ★追加: 'reset-data' イベントを定義
    emits: ['update:showChatTab', 'update:showStoryTab', 'reset-data'], 
    
    data() {
        return {
            currentView: 'tasks',
            copyButtonText: 'クリップボードにコピー',
            // ★追加: リセット対象の選択状態
            resetTargets: {
                tasks: false,
                hideout: false,
                keys: false,
                items: false,
                story: false,
                wishlist: false,
                settings: false
            }
        }
    },
    computed: {
        displayData() {
            // ... (既存のコードと同じため省略) ...
            switch (this.currentView) {
                case 'tasks': return this.taskData;
                case 'hideout': return this.hideoutData;
                case 'items': return this.itemsData;
                case 'ammoData': return this.ammoData;
                case 'itemDb': return this.itemDb; 
                case 'userProgress': return {
                    // ... (既存のコード) ...
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
        },
        // ★追加: 何か一つでも選択されているか
        hasSelection() {
            return Object.values(this.resetTargets).some(v => v);
        }
    },
    methods: {
        copyToClipboard() {
            navigator.clipboard.writeText(this.formattedJson).then(() => {
                this.copyButtonText = 'コピーしました！';
                setTimeout(() => this.copyButtonText = 'クリップボードにコピー', 2000);
            });
        },
        // ★追加: リセット実行処理
        performReset() {
            if (!this.hasSelection) return;
            
            const confirmed = confirm("⚠️ 警告 ⚠️\n選択したデータを完全に削除します。\nこの操作は取り消せません。\n\n実行してよろしいですか？");
            if (confirmed) {
                this.$emit('reset-data', { ...this.resetTargets });
                alert("データをリセットしました。");
                // 選択をクリア
                Object.keys(this.resetTargets).forEach(k => this.resetTargets[k] = false);
            }
        }
    },
    template: `
    <div class="card h-100 border-secondary">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span>🐞 デバッグ / データ確認</span>
            <button v-if="currentView !== 'reset'" class="btn btn-sm btn-outline-light" @click="copyToClipboard">{{ copyButtonText }}</button>
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

                        <div class="list-group-item bg-black text-danger small fw-bold py-1 mt-2">DANGER ZONE</div>
                        <button class="list-group-item list-group-item-action bg-dark text-danger border-secondary" 
                                :class="{active: currentView==='reset'}" 
                                @click="currentView='reset'">
                                🗑️ Data Reset
                        </button>
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
                    <textarea v-if="currentView !== 'reset'" class="form-control bg-dark text-white font-monospace border-0" 
                            style="height: 75vh; font-size: 12px; resize: none;" 
                            readonly :value="formattedJson"></textarea>
                    
                    <div v-else class="p-4 text-white">
                        <h4 class="text-danger mb-3"><i class="bi bi-exclamation-triangle-fill"></i> データリセット (Data Reset)</h4>
                        <p class="text-secondary">削除したい項目にチェックを入れ、リセットボタンを押してください。<br>この操作は元に戻せません。</p>
                        
                        <div class="card bg-secondary bg-opacity-10 border-danger mb-4">
                            <div class="card-body">
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="reset_tasks" v-model="resetTargets.tasks">
                                    <label class="form-check-label" for="reset_tasks">
                                        ✅ タスク進捗 (完了・優先設定を含む)
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="reset_hideout" v-model="resetTargets.hideout">
                                    <label class="form-check-label" for="reset_hideout">
                                        🏠 ハイドアウト構築状況
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="reset_keys" v-model="resetTargets.keys">
                                    <label class="form-check-label" for="reset_keys">
                                        🔑 鍵の所持状況・メモ
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="reset_story" v-model="resetTargets.story">
                                    <label class="form-check-label" for="reset_story">
                                        📖 ストーリー進捗
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="reset_items" v-model="resetTargets.items">
                                    <label class="form-check-label" for="reset_items">
                                        📦 収集済みアイテム (納品チェック)
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="reset_wishlist" v-model="resetTargets.wishlist">
                                    <label class="form-check-label" for="reset_wishlist">
                                        ⭐ アイテム検索のウィッシュリスト
                                    </label>
                                </div>
                                <hr class="border-secondary">
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="reset_settings" v-model="resetTargets.settings">
                                    <label class="form-check-label text-warning" for="reset_settings">
                                        ⚙️ 設定 (レベル、表示設定など) ※リロードが必要です
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-danger" :disabled="!hasSelection" @click="performReset">
                            <span v-if="!hasSelection">削除項目を選択してください</span>
                            <span v-else>選択したデータをリセットする</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};