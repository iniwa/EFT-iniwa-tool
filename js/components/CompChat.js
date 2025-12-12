const CompChat = {
    props: ['taskData', 'hideoutData', 'itemsData', 'completedTasks', 'userHideout', 'playerLevel'],
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
                    userProfile: {
                        level: this.playerLevel,
                        hideoutLevels: this.userHideout
                    },
                    tasks: this.taskData.map(t => ({
                        name: t.name,
                        trader: t.trader.name,
                        map: t.map ? t.map.name : "Any",
                        status: this.completedTasks.includes(t.name) ? "Completed" : "Not Completed",
                        reqLevel: t.minPlayerLevel,
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
ユーザーの現在のレベルは ${this.playerLevel} です。
タスクの完了状況(status: "Completed")もデータに含まれています。

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
                    例: 「まだ終わっていないPraporのタスクを教えて」「今のレベルで受けられるタスクは？」
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