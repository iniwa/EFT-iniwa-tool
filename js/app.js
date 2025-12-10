// js/app.js

const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        const currentTab = ref('input');
        const taskViewMode = ref('list'); 
        const showCompleted = ref(false);
        const showFuture = ref(false);
        const forceHideoutFir = ref(false);
        const isLoading = ref(false);
        const loadError = ref(null);
        const lastUpdated = ref(null);

        const hideoutData = ref([]);
        const taskData = ref([]);
        const itemsData = ref({ items: [], maps: [] }); 
        
        const userHideout = ref({});
        const completedTasks = ref([]);
        const collectedItems = ref([]);
        const ownedKeys = ref([]);
        const keyUserData = ref({}); 
        
        const playerLevel = ref(1);
        const searchTask = ref("");
        const expandedItems = ref({});
        const selectedTask = ref(null);
        const fileInput = ref(null);

        const CURRENCY_IDS = ["5449016a4bdc2d6f028b456f", "5696686a4bdc2da3298b456a", "569668774bdc2da2298b4568"];

        const loadLS = (key, def) => {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : def;
        };

        const openTaskFromName = (taskName) => {
            if (!taskData.value) return;
            const task = taskData.value.find(t => t.name === taskName);
            if (task) {
                selectedTask.value = task;
            } else {
                alert("タスク詳細が見つかりませんでした");
            }
        };

        const updateKeyUserData = (id, field, value) => {
            if (!keyUserData.value[id]) {
                keyUserData.value[id] = { rating: '-', memo: '' };
            }
            keyUserData.value[id][field] = value;
        };

        const applyKeyPresets = (allItems) => {
            if (!allItems) return;
            if (typeof KEY_PRESETS === 'undefined') return;

            const currentData = keyUserData.value;
            allItems.forEach(item => {
                // ★修正: IDを使ってプリセットを検索
                const preset = KEY_PRESETS[item.id]; 
                
                if (preset) {
                    if (!currentData[item.id]) currentData[item.id] = { rating: '-', memo: '' };
                    
                    // 既存のデータがない場合のみプリセットを適用 (ユーザー入力を優先)
                    if (!currentData[item.id].rating || currentData[item.id].rating === '-') {
                        currentData[item.id].rating = preset.rating || '-';
                    }
                    if (!currentData[item.id].memo) {
                        currentData[item.id].memo = preset.memo || '';
                    }
                }
            });
            keyUserData.value = { ...currentData };
        };

        const processTasks = (tasks) => {
            if (!tasks) return [];
            return tasks.map(t => {
                const rewards = [];
                const r = t.finishRewards || {};
                if (r.items) {
                    r.items.forEach(entry => {
                        if(entry.item) rewards.push({ type: 'item', name: entry.item.name, count: entry.count || 1, id: entry.item.id });
                    });
                }
                if (r.offerUnlock) {
                    r.offerUnlock.forEach(entry => {
                        if(entry.item && entry.trader) {
                            rewards.push({ type: 'offerUnlock', trader: entry.trader.name, level: entry.level, itemName: entry.item.name });
                        }
                    });
                }
                const finalWikiLink = t.wikiLink || `https://tarkov.dev/task/${t.id}`;
                return { ...t, finishRewardsList: rewards, wikiLink: finalWikiLink };
            });
        };

        const fetchData = async () => {
            isLoading.value = true;
            loadError.value = null;
            const query = GRAPHQL_QUERY;

            try {
                const response = await fetch('https://api.tarkov.dev/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const result = await response.json();

                if (result.errors) throw new Error(`GraphQL Error: ${result.errors[0].message}`);
                if (!result.data) throw new Error(`No Data`);
                
                hideoutData.value = result.data.hideoutStations || [];
                taskData.value = processTasks(result.data.tasks || []);
                itemsData.value = {
                    items: result.data.items || [],
                    maps: result.data.maps || []
                };
                
                applyKeyPresets(result.data.items);
                
                const now = new Date().toLocaleString('ja-JP');
                lastUpdated.value = now;
                // ★キャッシュv13
                localStorage.setItem('eft_api_cache_v13', JSON.stringify({
                    timestamp: now, 
                    hideoutStations: hideoutData.value, 
                    tasks: taskData.value, 
                    items: itemsData.value
                }));
                
                hideoutData.value.forEach(s => {
                    if (userHideout.value[s.name] === undefined) userHideout.value[s.name] = 0;
                });

            } catch (err) {
                console.error(err);
                loadError.value = `更新失敗: ${err.message}`;
            } finally {
                isLoading.value = false;
            }
        };

        const exportData = () => {
            const data = {
                userHideout: userHideout.value,
                completedTasks: completedTasks.value,
                collectedItems: collectedItems.value,
                ownedKeys: ownedKeys.value,
                keyUserData: keyUserData.value,
                playerLevel: playerLevel.value,
                forceHideoutFir: forceHideoutFir.value
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `eft_planner_backup.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        const triggerImport = () => { if (fileInput.value) fileInput.value.click(); };

        const importData = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    if(parsed.userHideout) userHideout.value = parsed.userHideout;
                    if(parsed.completedTasks) completedTasks.value = parsed.completedTasks;
                    if(parsed.collectedItems) collectedItems.value = parsed.collectedItems;
                    if(parsed.ownedKeys) ownedKeys.value = parsed.ownedKeys;
                    if(parsed.keyUserData) keyUserData.value = parsed.keyUserData;
                    if(parsed.playerLevel) playerLevel.value = parsed.playerLevel;
                    if(parsed.forceHideoutFir !== undefined) forceHideoutFir.value = parsed.forceHideoutFir;
                    alert("インポート完了");
                } catch (err) { alert("読み込み失敗"); }
            };
            reader.readAsText(file);
            event.target.value = '';
        };

        const toggleTask = (taskName) => {
            const idx = completedTasks.value.indexOf(taskName);
            if (idx > -1) completedTasks.value.splice(idx, 1);
            else completedTasks.value.push(taskName);
        };

        onMounted(() => {
            const cache = loadLS('eft_api_cache_v13', null); // ★v13
            if (cache && cache.tasks) {
                hideoutData.value = cache.hideoutStations;
                taskData.value = cache.tasks;
                itemsData.value = cache.items || { items: [], maps: [] };
                lastUpdated.value = cache.timestamp;
            } else if (typeof TARKOV_DATA !== 'undefined' && TARKOV_DATA.data) {
                hideoutData.value = TARKOV_DATA.data.hideoutStations || [];
                taskData.value = processTasks(TARKOV_DATA.data.tasks || []);
                itemsData.value = {
                    items: TARKOV_DATA.data.items || [],
                    maps: TARKOV_DATA.data.maps || []
                };
                lastUpdated.value = 'Backup File';
            }

            userHideout.value = loadLS('eft_hideout', {});
            completedTasks.value = loadLS('eft_tasks', []);
            collectedItems.value = loadLS('eft_collected', []);
            ownedKeys.value = loadLS('eft_keys', []);
            keyUserData.value = loadLS('eft_key_user_data', {}); 
            playerLevel.value = parseInt(localStorage.getItem('eft_level') || 1, 10);
            forceHideoutFir.value = loadLS('eft_force_fir', false);
            
            if (itemsData.value.items.length > 0) {
                applyKeyPresets(itemsData.value.items);
            }
            // Mermaidクリック連携
            window.addEventListener('mermaid-task-click', (e) => {
                const taskName = e.detail;
                openTaskFromName(taskName);
            });
        });

        watch([userHideout, completedTasks, collectedItems, ownedKeys, keyUserData, playerLevel, forceHideoutFir], () => {
            localStorage.setItem('eft_hideout', JSON.stringify(userHideout.value));
            localStorage.setItem('eft_tasks', JSON.stringify(completedTasks.value));
            localStorage.setItem('eft_collected', JSON.stringify(collectedItems.value));
            localStorage.setItem('eft_keys', JSON.stringify(ownedKeys.value));
            localStorage.setItem('eft_key_user_data', JSON.stringify(keyUserData.value));
            localStorage.setItem('eft_level', playerLevel.value.toString());
            localStorage.setItem('eft_force_fir', JSON.stringify(forceHideoutFir.value));
        }, { deep: true });

        const visibleTasks = computed(() => TaskLogic.filterActiveTasks(taskData.value, completedTasks.value, playerLevel.value, searchTask.value, showCompleted.value, showFuture.value));
        const filteredTasksList = computed(() => visibleTasks.value.slice(0, 100));
        const tasksByTrader = computed(() => TaskLogic.groupTasksByTrader(visibleTasks.value));
        const tasksByMap = computed(() => TaskLogic.groupTasksByMap(visibleTasks.value));
        
        const shoppingList = computed(() => {
            const res = { hideoutFir:{}, hideoutBuy:{}, taskFir:{}, taskNormal:{}, collector:{}, keys:{} };
            
            const addItem = (cat, id, name, count, sourceName, sourceType, mapName = null, wiki = null, shortName = null, normalizedName = null) => {
            const uid = cat === 'keys' ? `key_${mapName}_${id}` : `${cat}_${id}`;
                if (!res[cat][uid]) {
                    res[cat][uid] = { 
                        id, uid, name, count: 0, sources: [], 
                        mapName, wikiLink: wiki, 
                        shortName, normalizedName 
                    };
                }
                
                if (cat === 'keys') {
                    if (sourceName && !res[cat][uid].sources.some(s => s.name === sourceName)) {
                        res[cat][uid].sources.push({ name: sourceName, type: sourceType });
                    }
                } else {
                    res[cat][uid].count += count;
                    const existing = res[cat][uid].sources.find(s => s.name === sourceName);
                    if (existing) existing.count += count;
                    else res[cat][uid].sources.push({ name: sourceName, type: sourceType, count });
                }
            };

            HideoutLogic.calculate(hideoutData.value, userHideout.value, forceHideoutFir.value, addItem);
            TaskLogic.calculate(taskData.value, completedTasks.value, addItem);
            
            const rawItems = itemsData.value.items || [];
            const rawMaps = itemsData.value.maps || [];
            KeyLogic.calculate(rawItems, rawMaps, taskData.value, addItem);
            
            const toArr = (o) => Object.values(o).sort((a,b) => b.count - a.count);
            const toArrKeys = (o) => Object.values(o).sort((a,b) => {
                const mapCmp = (a.mapName||'').localeCompare(b.mapName||'');
                return mapCmp !== 0 ? mapCmp : a.name.localeCompare(b.name);
            });

            return { hideoutFir: toArr(res.hideoutFir), hideoutBuy: toArr(res.hideoutBuy), taskFir: toArr(res.taskFir), taskNormal: toArr(res.taskNormal), collector: toArr(res.collector), keys: toArrKeys(res.keys) };
        });

        const totalItemsNeeded = computed(() => shoppingList.value.hideoutFir.length + shoppingList.value.hideoutBuy.length + shoppingList.value.taskFir.length + shoppingList.value.taskNormal.length + shoppingList.value.collector.length);
        const totalKeysNeeded = computed(() => shoppingList.value.keys.length);
        const toggleItemDetails = (uid) => { if(expandedItems.value[uid]) delete expandedItems.value[uid]; else expandedItems.value[uid]=true; };
        const toggleCollected = (uid) => { const idx = collectedItems.value.indexOf(uid); if (idx > -1) collectedItems.value.splice(idx, 1); else collectedItems.value.push(uid); };
        const toggleOwnedKey = (id) => { const idx = ownedKeys.value.indexOf(id); if (idx > -1) ownedKeys.value.splice(idx, 1); else ownedKeys.value.push(id); };
        
        const displayLists = computed(() => ({
            hideoutFir: { title: '🏠 Hideout (FIR必須)', items: shoppingList.value.hideoutFir, borderClass: 'border-warning', headerClass: 'bg-dark text-warning border-warning', badgeClass: 'bg-warning text-dark' },
            hideoutBuy: { title: '🏠 Hideout (購入で可)', items: shoppingList.value.hideoutBuy, borderClass: '', headerClass: 'bg-dark text-info border-info', badgeClass: 'bg-primary' },
            taskFir: { title: '✅ Task (FIR必須)', items: shoppingList.value.taskFir, borderClass: 'border-warning', headerClass: 'bg-dark text-warning border-warning', badgeClass: 'bg-warning text-dark' },
            collector: { title: '👑 Collector (FIR)', items: shoppingList.value.collector, borderClass: 'border-danger', headerClass: 'bg-dark text-danger border-danger', badgeClass: 'bg-danger' },
            taskNormal: { title: '📦 Task (購入で可)', items: shoppingList.value.taskNormal, borderClass: '', headerClass: 'bg-dark text-secondary border-secondary', badgeClass: 'bg-secondary' }
        }));

        return {
            currentTab, taskViewMode, showCompleted, showFuture, forceHideoutFir,
            isLoading, loadError, lastUpdated, fetchData,
            taskData, hideoutData, userHideout, completedTasks, collectedItems, ownedKeys, keyUserData, playerLevel, searchTask,
            filteredTasksList, tasksByTrader, tasksByMap, shoppingList, totalItemsNeeded, totalKeysNeeded,
            expandedItems, toggleItemDetails, selectedTask, openTaskDetails: (t) => selectedTask.value = t,
            toggleCollected, toggleOwnedKey, updateKeyUserData, displayLists,
            exportData, importData, fileInput, triggerImport, toggleTask, openTaskFromName, itemsData
        };
    }
})
.component('comp-header', CompHeader)
.component('comp-input', CompInput)
.component('comp-result', CompResult)
.component('comp-keys', CompKeys)
.component('comp-modal', CompModal)
.component('comp-debug', CompDebug)
.component('comp-flowchart', CompFlowchart)
.mount('#app');