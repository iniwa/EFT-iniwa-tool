const CompDebug = {
    // ★追加: prioritizedTasks を受け取る
    props: ['taskData', 'hideoutData', 'itemsData', 'userHideout', 'completedTasks', 'ownedKeys', 'keyUserData', 'prioritizedTasks'],
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
                    ownedKeys: this.ownedKeys,
                    keyUserData: this.keyUserData,
                    // ★追加: デバッグ画面に表示
                    prioritizedTasks: this.prioritizedTasks 
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