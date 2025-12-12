// js/app.js (完全修正版)

const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        // --- 1. 状態変数の定義 ---
        const currentTab = ref('input');
        const taskViewMode = ref('list'); 
        const showCompleted = ref(false);
        const showFuture = ref(false);
        // × forceHideoutFir は削除済み
        
        const isLoading = ref(false);
        const loadError = ref(null);
        const lastUpdated = ref(null);

        // データコンテナ
        const hideoutData = ref([]);
        const taskData = ref([]);
        const itemsData = ref({ items: [], maps: [] }); 
        
        // ユーザーデータ (LocalStorage保存対象)
        const userHideout = ref({});
        const completedTasks = ref([]);
        const collectedItems = ref([]);
        const ownedKeys = ref([]);
        const keyUserData = ref({}); 
        const playerLevel = ref(1);
        const searchTask = ref("");
        
        // UI状態
        const expandedItems = ref({});
        const selectedTask = ref(null);
        const fileInput = ref(null);

        // 設定値 (LocalStorage読み込み)
        // 安全に読み込むためのヘルパー
        const safeGetLS = (key, def) => {
            try { return localStorage.getItem(key) || def; } catch (e) { return def; }
        };
        const showMaxedHideout = ref(safeGetLS('eft_show_maxed_hideout', 'false') === 'true');
        const keysViewMode = ref(safeGetLS('eft_keys_view_mode', 'needed'));
        const keysSortMode = ref(safeGetLS('eft_keys_sort_mode', 'map'));
        const flowchartTrader = ref(safeGetLS('eft_flowchart_trader', 'Prapor'));

        // --- 2. ヘルパー関数 ---
        
        // LocalStorage 読み込み
        const loadLS = (key, def) => {
            try {
                const val = localStorage.getItem(key);
                return val ? JSON.parse(val) : def;
            } catch (e) {
                console.warn(`Load Error (${key}):`, e);
                return def;
            }
        };

        // LocalStorage 保存 (エラー対策付き)
        const saveLS = (key, val) => {
            try {
                const stringVal = typeof val === 'string' ? val : JSON.stringify(val);
                localStorage.setItem(key, stringVal);
            } catch (e) {
                console.warn(`Save Error (${key}): Storage might be blocked.`, e);
            }
        };

        const openTaskFromName = (taskName) => {
            if (!taskData.value) return;
            const task = taskData.value.find(t => t.name === taskName);
            if (task) selectedTask.value = task;
            else alert("タスク詳細が見つかりませんでした");
        };

        const updateKeyUserData = (id, field, value) => {
            if (!keyUserData.value[id]) keyUserData.value[id] = { rating: '-', memo: '' };
            keyUserData.value[id][field] = value;
        };

        const applyKeyPresets = (allItems) => {
            if (!allItems || typeof KEY_PRESETS === 'undefined') return;
            const currentData = { ...keyUserData.value };
            allItems.forEach(item => {
                const preset = KEY_PRESETS[item.id]; 
                if (preset) {
                    if (!currentData[item.id]) currentData[item.id] = { rating: '-', memo: '' };
                    if (!currentData[item.id].rating || currentData[item.id].rating === '-') {
                        currentData[item.id].rating = preset.rating || '-';
                    }
                    if (!currentData[item.id].memo) {
                        currentData[item.id].memo = preset.memo || '';
                    }
                }
            });
            keyUserData.value = currentData;
        };

        const processTasks = (tasks) => {
            if (!tasks) return [];
            return tasks.map(t => {
                const rewards = [];
                const r = t.finishRewards || {};
                
                // アイテム報酬
                if (r.items) {
                    r.items.forEach(entry => {
                        if(entry.item) rewards.push({ type: 'item', name: entry.item.name, count: entry.count || 1, id: entry.item.id });
                    });
                }
                
                // 販売アンロック
                if (r.offerUnlock) {
                    r.offerUnlock.forEach(entry => {
                        if(entry.item && entry.trader) {
                            rewards.push({ type: 'offerUnlock', trader: entry.trader.name, level: entry.level, itemName: entry.item.name });
                        }
                    });
                }

                // クラフトアンロック
                if (r.craftUnlock) {
                    r.craftUnlock.forEach(entry => {
                        const stationName = entry.station ? entry.station.name : "Unknown";
                        const craftedItemName = (entry.rewardItems && entry.rewardItems.length > 0) 
                                              ? entry.rewardItems[0].item.name 
                                              : "Unknown Item";
                        rewards.push({ 
                            type: 'craftUnlock', 
                            station: stationName, 
                            level: entry.level, 
                            itemName: craftedItemName 
                        });
                    });
                }

                const finalWikiLink = t.wikiLink || `https://tarkov.dev/task/${t.id}`;
                return { ...t, finishRewardsList: rewards, wikiLink: finalWikiLink };
            });
        };

        // --- 3. データ取得ロジック ---
        const fetchData = async () => {
            const CACHE_KEY = 'eft_api_cache_v20_final'; 
            const MIN_INTERVAL = 5 * 60 * 1000; 

            const cache = loadLS(CACHE_KEY, null);
            if (cache) {
                try {
                    const lastTime = cache.lastFetchTime || 0;
                    const nowTime = Date.now();

                    if ((nowTime - lastTime < MIN_INTERVAL) && cache.tasks && cache.tasks.length > 0) {
                        const remainSec = Math.ceil((MIN_INTERVAL - (nowTime - lastTime)) / 1000);
                        alert(`データは最新です (あと ${remainSec} 秒)。`);
                        
                        hideoutData.value = cache.hideoutStations;
                        taskData.value = cache.tasks;
                        itemsData.value = cache.items;
                        lastUpdated.value = cache.timestamp;
                        return; 
                    }
                } catch (e) { console.error("Cache check error", e); }
            }

            isLoading.value = true;
            loadError.value = null;
            
            // queries.js で定義されている GRAPHQL_QUERY を使用
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
                
                // キャッシュ保存
                saveLS(CACHE_KEY, {
                    timestamp: now,
                    lastFetchTime: Date.now(),
                    hideoutStations: hideoutData.value, 
                    tasks: taskData.value, 
                    items: itemsData.value
                });
                
                // ハイドアウトの初期化
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

        // --- 4. インポート/エクスポート ---
        const exportData = () => {
            const data = {
                userHideout: userHideout.value,
                completedTasks: completedTasks.value,
                collectedItems: collectedItems.value,
                ownedKeys: ownedKeys.value,
                keyUserData: keyUserData.value,
                playerLevel: playerLevel.value
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

        // --- 5. ライフサイクル & 監視 ---
        onMounted(() => {
            // キャッシュ読み込み
            const cache = loadLS('eft_api_cache_v20_final', null);
            if (cache && cache.tasks) {
                hideoutData.value = cache.hideoutStations;
                taskData.value = cache.tasks;
                itemsData.value = cache.items || { items: [], maps: [] };
                lastUpdated.value = cache.timestamp;
            } else if (typeof TARKOV_DATA !== 'undefined' && TARKOV_DATA.data) {
                // バックアップファイル(data.js)からの読み込み
                hideoutData.value = TARKOV_DATA.data.hideoutStations || [];
                taskData.value = processTasks(TARKOV_DATA.data.tasks || []);
                itemsData.value = {
                    items: TARKOV_DATA.data.items || [],
                    maps: TARKOV_DATA.data.maps || []
                };
                lastUpdated.value = 'Backup File';
            }

            // ユーザーデータ読み込み
            userHideout.value = loadLS('eft_hideout', {});
            completedTasks.value = loadLS('eft_tasks', []);
            collectedItems.value = loadLS('eft_collected', []);
            ownedKeys.value = loadLS('eft_keys', []);
            keyUserData.value = loadLS('eft_key_user_data', {}); 
            playerLevel.value = parseInt(safeGetLS('eft_level', '1'), 10);
            
            // プリセット適用
            if (itemsData.value.items.length > 0) {
                applyKeyPresets(itemsData.value.items);
            }
            
            // Mermaidからのクリックイベント連携
            window.addEventListener('mermaid-task-click', (e) => {
                openTaskFromName(e.detail);
            });
        });

        // ユーザーデータの自動保存 (forceHideoutFir は除去済み)
        watch([userHideout, completedTasks, collectedItems, ownedKeys, keyUserData, playerLevel], () => {
            saveLS('eft_hideout', userHideout.value);
            saveLS('eft_tasks', completedTasks.value);
            saveLS('eft_collected', collectedItems.value);
            saveLS('eft_keys', ownedKeys.value);
            saveLS('eft_key_user_data', keyUserData.value);
            saveLS('eft_level', playerLevel.value.toString());
        }, { deep: true });

        // 設定の保存
        watch(showMaxedHideout, (val) => saveLS('eft_show_maxed_hideout', val));
        watch(keysViewMode, (val) => saveLS('eft_keys_view_mode', val));
        watch(keysSortMode, (val) => saveLS('eft_keys_sort_mode', val)); 
        watch(flowchartTrader, (val) => saveLS('eft_flowchart_trader', val));
        watch(flowchartTrader, (val) => saveLS('eft_flowchart_trader', val));
        watch(currentTab, (newTab) => {
            if (typeof gtag === 'function') {
                gtag('event', 'page_view', {
                    page_title: newTab,
                    page_location: location.href.split('#')[0] + '#' + newTab
                });
            }
        });

        // --- 6. 計算ロジック ---
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

            HideoutLogic.calculate(hideoutData.value, userHideout.value, false, addItem);
            TaskLogic.calculate(taskData.value, completedTasks.value, addItem);
            
            const rawItems = itemsData.value.items || [];
            const rawMaps = itemsData.value.maps || [];
            KeyLogic.calculate(rawItems, rawMaps, taskData.value, addItem);
            
            const toArr = (o) => Object.values(o).sort((a,b) => b.count - a.count);

            // --- 鍵リストのフィルタリングとソート ---
            let keysArray = Object.values(res.keys);

            // 1. フィルタリング (View Mode)
            if (keysViewMode.value === 'owned') {
                // 「所持のみ」モード
                keysArray = keysArray.filter(k => ownedKeys.value.includes(k.id));
            } else if (keysViewMode.value === 'needed') {
                // 「必要なもののみ」モード（タスクで使用する予定があるもの）
                // ※ sourcesが存在する(=タスクで使う) かつ 未所持のもの を表示するのが一般的ですが、
                //   ここでは単純に「タスク割り当てがあるもの」を表示し、所持/未所持は問わない実装にします
                //   もし「未所持のみ」にしたい場合は !ownedKeys.value.includes(k.id) を追加してください
                keysArray = keysArray.filter(k => k.sources.length > 0);
            }
            // 'all' の場合はフィルタなし

            // 2. ソート (Sort Mode)
            const getRateVal = (id) => {
                const r = keyUserData.value[id]?.rating || '-';
                // Rateの強さ定義 (Sが最強)
                const map = {'S':10, 'A':8, 'B':6, 'C':4, 'D':2, 'F':0, '?':1, '-': -1};
                return map[r] !== undefined ? map[r] : -1;
            };

            keysArray.sort((a, b) => {
                const isOwnedA = ownedKeys.value.includes(a.id);
                const isOwnedB = ownedKeys.value.includes(b.id);

                // モード別の優先ソート
                if (keysSortMode.value === 'owned_first') {
                    // 所持しているものを上に
                    if (isOwnedA !== isOwnedB) return isOwnedA ? -1 : 1;
                } else if (keysSortMode.value === 'rating') {
                    // Rateが高い順
                    const rateA = getRateVal(a.id);
                    const rateB = getRateVal(b.id);
                    if (rateA !== rateB) return rateB - rateA;
                }

                // サブソート: マップ名 -> アイテム名
                const mapCmp = (a.mapName||'').localeCompare(b.mapName||'');
                if (mapCmp !== 0) return mapCmp;
                return a.name.localeCompare(b.name);
            });

            return { 
                hideoutFir: toArr(res.hideoutFir), 
                hideoutBuy: toArr(res.hideoutBuy), 
                taskFir: toArr(res.taskFir), 
                taskNormal: toArr(res.taskNormal), 
                collector: toArr(res.collector), 
                keys: keysArray // 加工済みの配列を返す
            };
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
            showMaxedHideout, keysViewMode,keysSortMode,flowchartTrader,
            currentTab, taskViewMode, showCompleted, showFuture, 
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
.component('comp-chat', CompChat)
.mount('#app');