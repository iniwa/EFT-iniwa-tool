const CompFlowchart = {
    props: ['taskData', 'completedTasks', 'selectedTrader'],
    emits: ['toggle-task', 'open-task-details', 'update:selectedTrader'],
    data() {
        return {
            nodeMap: {} 
        };
    },
    computed: {
        traderList() {
            if (!this.taskData) return [];
            
            // ★修正: トレーダーの順序指定
            const order = [
                'Prapor', 'Therapist', 'Fence', 'Skier', 'Peacekeeper', 
                'Mechanic', 'Ragman', 'Jaeger', 'Ref', 'Lightkeeper'
            ];

            const traders = new Set(this.taskData.map(t => t.trader ? t.trader.name : 'Unknown'));
            const list = Array.from(traders);
            
            // 指定順にソート
            return list.sort((a, b) => {
                const idxA = order.indexOf(a);
                const idxB = order.indexOf(b);
                
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.localeCompare(b);
            });
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

            const scrollContainer = container.parentElement;
            const savedScrollTop = scrollContainer.scrollTop;
            const savedScrollLeft = scrollContainer.scrollLeft;

            this.nodeMap = {}; 
            const nameToId = {};
            let counter = 0;

            this.taskData.forEach(t => {
                const simpleId = `t${counter++}`;
                nameToId[t.name] = simpleId;
                this.nodeMap[simpleId] = t;
            });

            const currentTraderTasks = this.taskData.filter(t => t.trader.name === this.selectedTrader);
            const nodesToRender = new Set();
            const edges = [];

            currentTraderTasks.forEach(task => {
                const myId = nameToId[task.name];
                if (!myId) return;

                nodesToRender.add(task.name);

                if (task.taskRequirements) {
                    task.taskRequirements.forEach(req => {
                        const reqName = req.task.name;
                        const reqId = nameToId[reqName];
                        if (reqId) {
                            nodesToRender.add(reqName);
                            edges.push({ from: reqId, to: myId });
                        }
                    });
                }
            });

            let graph = 'graph LR\n';
            
            graph += 'classDef done fill:#198754,stroke:#fff,stroke-width:2px,color:white;\n'; 
            graph += 'classDef doneExternal fill:#198754,stroke:#fff,stroke-width:2px,color:white,stroke-dasharray: 5 5;\n';
            graph += 'classDef todo fill:#212529,stroke:#666,stroke-width:2px,color:white;\n'; 
            graph += 'classDef external fill:#343a40,stroke:#6c757d,stroke-width:1px,color:#adb5bd,stroke-dasharray: 5 5;\n';

            nodesToRender.forEach(taskName => {
                const nodeId = nameToId[taskName];
                const task = this.taskData.find(t => t.name === taskName);
                if (!task) return;

                let className = '';
                const isCompleted = this.completedTasks.includes(taskName);
                const isExternal = task.trader.name !== this.selectedTrader;

                if (isCompleted) {
                    className = isExternal ? 'doneExternal' : 'done';
                } else {
                    className = isExternal ? 'external' : 'todo';
                }

                const safeLabel = taskName.replace(/"/g, "'").replace(/\(/g, "（").replace(/\)/g, "）");
                
                graph += `${nodeId}["${safeLabel}"]:::${className}\n`;
                graph += `click ${nodeId} call void(0) "${safeLabel}"\n`;
            });

            edges.forEach(edge => {
                graph += `${edge.from} --> ${edge.to}\n`;
            });

            try {
                const id = `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, graph);
                
                container.innerHTML = svg;

                const edgesEl = container.querySelectorAll('.edgePath, .edgeLabel');
                edgesEl.forEach(el => el.style.pointerEvents = 'none');

                const nodesEl = container.querySelectorAll('.node');
                nodesEl.forEach(el => el.style.cursor = 'pointer');

                scrollContainer.scrollTop = savedScrollTop;
                scrollContainer.scrollLeft = savedScrollLeft;

            } catch (e) {
                console.error('Mermaid Render Error:', e);
            }
        },

        handleChartClick(event) {
            const nodeEl = event.target.closest('.node');
            if (!nodeEl) return;

            const rawId = nodeEl.id;
            const match = rawId.match(/(t\d+)/);
            if (!match) return;

            const simpleId = match[1];
            const task = this.nodeMap[simpleId];

            if (task) {
                if (event.shiftKey) {
                    this.$emit('toggle-task', task.name);
                } else {
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
                        :value="selectedTrader"
                        @change="$emit('update:selectedTrader', $event.target.value)">
                    <option v-for="t in traderList" :key="t" :value="t">{{ t }}</option>
                </select>
            </div>
            <small class="text-muted">※左クリック: 詳細 / <span class="text-warning fw-bold">Shift+クリック: 完了切替</span></small>
        </div>
        <div class="card-body bg-dark overflow-auto p-0" style="min-height: 60vh; position: relative;">
            <div ref="mermaidContainer" class="p-4 mermaid" 
                style="min-width: 100%; width: max-content;"
                @click="handleChartClick">
                <span class="text-secondary">Loading...</span>
            </div>
        </div>
    </div>
    `
};