// js/app.js

const { createApp, ref, shallowRef, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        // --- 1. 状態変数の定義 ---
        const currentTab = ref('input');
        const taskViewMode = ref('list'); 
        const showCompleted = ref(false);
        const showFuture = ref(false);
        
        const isLoading = ref(false);
        const loadError = ref(null);
        const lastUpdated = ref(null);

        // キャッシュキー (IndexedDB用)
        const APP_CACHE_KEY = 'eft_api_cache_v29_idb'; 

        const hideoutData = shallowRef([]);
        const taskData = shallowRef([]);
        const itemsData = shallowRef({ items: [], maps: [] });
        const ammoData = shallowRef([]);
        
        const userHideout = ref({});
        const completedTasks = ref([]);
        const collectedItems = ref([]);
        const ownedKeys = ref([]);
        const prioritizedTasks = ref([]);
        const keyUserData = ref({}); 
        const playerLevel = ref(0);
        const searchTask = ref("");
        
        const expandedItems = ref({});
        const selectedTask = ref(null);
        const fileInput = ref(null);

        // 設定値 (LocalStorage)
        const safeGetLS = (key, def) => {
            try { return localStorage.getItem(key) || def; } catch (e) { return def; }
        };
        const showMaxedHideout = ref(safeGetLS('eft_show_maxed_hideout', 'false') === 'true');
        const keysViewMode = ref(safeGetLS('eft_keys_view_mode', 'all'));
        const keysSortMode = ref(safeGetLS('eft_keys_sort_mode', 'map')); 
        const flowchartTrader = ref(safeGetLS('eft_flowchart_trader', 'Prapor'));

        const loadLS = (key, def) => {
            try {
                const val = localStorage.getItem(key);
                return val ? JSON.parse(val) : def;
            } catch (e) { return def; }
        };
        
        const saveLS = (key, val) => {
            try {
                localStorage.setItem(key, JSON.stringify(val));
            } catch (e) { console.warn("LS Save Error:", e); }
        };

        // --- 2. IndexedDB ヘルパー関数 ---
        const DB_NAME = 'EFT_APP_DB';
        const STORE_NAME = 'api_cache';

        const initDB = () => {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, 1);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME);
                    }
                };
                request.onsuccess = (event) => resolve(event.target.result);
                request.onerror = (event) => reject(event.target.error);
            });
        };

        const saveDB = async (key, val) => {
            try {
                const db = await initDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.put(val, key);
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(req.error);
                });
            } catch (e) {
                console.error("IDB Save Error:", e);
            }
        };

        const loadDB = async (key) => {
            try {
                const db = await initDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(STORE_NAME, 'readonly');
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.get(key);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => resolve(null); // エラー時はnull
                });
            } catch (e) {
                console.warn("IDB Load Error:", e);
                return null;
            }
        };

        // --- 3. ロジック関数 ---
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

        const togglePriority = (taskName) => {
            const idx = prioritizedTasks.value.indexOf(taskName);
            if (idx > -1) prioritizedTasks.value.splice(idx, 1);
            else prioritizedTasks.value.push(taskName);
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

        // --- データ加工・整形 ---
        const processTasks = (tasks) => {
            if (!tasks) return [];
            const uniqueTasks = [];
            const seenNames = new Set();
            tasks.forEach(t => {
                if (!seenNames.has(t.name)) {
                    seenNames.add(t.name);
                    uniqueTasks.push(t);
                }
            });
            return uniqueTasks.map(t => {
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
                if (r.craftUnlock) {
                    r.craftUnlock.forEach(entry => {
                        const stationName = entry.station ? entry.station.name : "Unknown";
                        const craftedItemName = (entry.rewardItems && entry.rewardItems.length > 0) ? entry.rewardItems[0].item.name : "Unknown Item";
                        rewards.push({ type: 'craftUnlock', station: stationName, level: entry.level, itemName: craftedItemName });
                    });
                }
                const maps = TaskLogic.getTaskMaps(t);
                const mapLabel = maps.length > 0 ? maps.join(', ') : (t.map ? t.map.name : 'Any');
                const finalWikiLink = t.wikiLink || `https://tarkov.dev/task/${t.id}`;
                return { ...t, finishRewardsList: rewards, wikiLink: finalWikiLink, derivedMaps: maps, mapLabel: mapLabel };
            });
        };

        const processItems = (rawItems, rawMaps) => {
            const mapLookup = {};
            if (rawMaps) {
                rawMaps.forEach(map => {
                    if (map.locks) {
                        map.locks.forEach(lock => {
                            if (lock.key) {
                                if (!mapLookup[lock.key.id]) mapLookup[lock.key.id] = [];
                                if (!mapLookup[lock.key.id].includes(map.name)) {
                                    mapLookup[lock.key.id].push(map.name);
                                }
                            }
                        });
                    }
                });
            }
            return {
                items: (rawItems || []).map(i => {
                    const associatedMaps = mapLookup[i.id] || [];
                    return {
                        ...i,
                        image512pxLink: i.image512pxLink,
                        maps: associatedMaps,
                        mapName: associatedMaps.length > 0 ? associatedMaps[0] : 'Unknown / Other',
                        types: i.types || []
                    };
                }),
                maps: rawMaps || []
            };
        };

        const processAmmo = (rawAmmo, taskList) => {
            const taskMap = new Map((taskList || []).map(t => [t.id, t.name]));
            return (rawAmmo || []).map(a => {
                let traders = [];
                if (a.item && a.item.buyFor) {
                    traders = a.item.buyFor.filter(b => b.vendor.name !== 'Flea Market');
                    traders.forEach(t => {
                        const llReq = t.requirements ? t.requirements.find(r => r.type === 'loyaltyLevel') : null;
                        t.minTraderLevel = llReq ? llReq.value : 1;
                        const taskReq = t.requirements ? t.requirements.find(r => r.type === 'questCompleted') : null;
                        if (taskReq && taskReq.stringValue) {
                            t.taskUnlockName = taskMap.get(taskReq.stringValue) || 'Unknown Task';
                        }
                    });
                    traders.sort((a, b) => a.minTraderLevel - b.minTraderLevel);
                }
                let crafts = [];
                if (a.item && a.item.craftsFor) {
                    crafts = a.item.craftsFor;
                    crafts.sort((a, b) => a.level - b.level);
                }
                return {
                    ...a,
                    id: a.item ? a.item.id : Math.random(),
                    name: a.item ? a.item.name : 'Unknown Ammo',
                    shortName: a.item ? a.item.shortName : null,
                    description: a.item ? a.item.description : '',
                    wikiLink: a.item ? a.item.wikiLink : null,
                    image512pxLink: a.item ? a.item.image512pxLink : null,
                    accuracyModifier: a.accuracyModifier,
                    recoilModifier: a.recoilModifier,
                    lightBleedModifier: a.lightBleedModifier,
                    heavyBleedModifier: a.heavyBleedModifier,
                    ricochetChance: a.ricochetChance,
                    soldBy: traders,
                    crafts: crafts
                };
            });
        };

        const fetchData = async () => {
            const MIN_INTERVAL = 5 * 60 * 1000; 
            
            // IndexedDBからキャッシュ読み込み
            const cache = await loadDB(APP_CACHE_KEY);
            
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
                        ammoData.value = cache.ammo || []; 
                        lastUpdated.value = cache.timestamp;
                        return; 
                    }
                } catch (e) { console.error("Cache check error", e); }
            }

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
                itemsData.value = processItems(result.data.items, result.data.maps);
                ammoData.value = processAmmo(result.data.ammo, taskData.value);

                applyKeyPresets(result.data.items);
                
                const now = new Date().toLocaleString('ja-JP');
                lastUpdated.value = now;
                
                // IndexedDBへ保存
                await saveDB(APP_CACHE_KEY, {
                    timestamp: now,
                    lastFetchTime: Date.now(),
                    hideoutStations: hideoutData.value, 
                    tasks: taskData.value, 
                    items: itemsData.value,
                    ammo: ammoData.value
                });
                
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
                prioritizedTasks: prioritizedTasks.value 
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `iniwas_intel_center_backup.json`;
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
                    if(parsed.prioritizedTasks) prioritizedTasks.value = parsed.prioritizedTasks;
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
        onMounted(async () => {
            // IndexedDBからロード
            const cache = await loadDB(APP_CACHE_KEY);
            const AUTO_UPDATE_THRESHOLD = 20 * 60 * 60 * 1000; 
            
            let shouldFetch = true;

            if (cache && cache.tasks) {
                console.log("Loaded data from IndexedDB.");
                hideoutData.value = cache.hideoutStations;
                taskData.value = cache.tasks;
                itemsData.value = cache.items || { items: [], maps: [] };
                ammoData.value = cache.ammo || [];
                lastUpdated.value = cache.timestamp;

                const lastTime = cache.lastFetchTime || 0;
                const now = Date.now();
                
                if ((now - lastTime) < AUTO_UPDATE_THRESHOLD) {
                    shouldFetch = false;
                    console.log(`Cache is valid. (${((now - lastTime)/1000/60/60).toFixed(1)} hours passed)`);
                } else {
                    console.log("Cache is too old. Auto-fetching...");
                }

            } else if (typeof TARKOV_DATA !== 'undefined' && TARKOV_DATA.data) {
                // バックアップ変数からのロード
                console.log("Loading from TARKOV_DATA...");
                hideoutData.value = TARKOV_DATA.data.hideoutStations || [];
                taskData.value = processTasks(TARKOV_DATA.data.tasks || []);
                itemsData.value = processItems(TARKOV_DATA.data.items, TARKOV_DATA.data.maps);
                ammoData.value = processAmmo(TARKOV_DATA.data.ammo, taskData.value);
                lastUpdated.value = 'Backup File';
                shouldFetch = false;
            }

            // ユーザー設定は LocalStorage からロード
            userHideout.value = loadLS('eft_hideout', {});
            completedTasks.value = loadLS('eft_tasks', []);
            collectedItems.value = loadLS('eft_collected', []);
            ownedKeys.value = loadLS('eft_keys', []);
            keyUserData.value = loadLS('eft_key_user_data', {}); 
            prioritizedTasks.value = loadLS('eft_prioritized', []);
            
            // ★修正: safeGetLSではなくloadLSを使用し、安全に読み込む
            playerLevel.value = parseInt(loadLS('eft_level', 0), 10);
            
            if (itemsData.value.items.length > 0) {
                applyKeyPresets(itemsData.value.items);
            }
            if (hideoutData.value.length > 0) {
                hideoutData.value.forEach(s => {
                    if (userHideout.value[s.name] === undefined) userHideout.value[s.name] = 0;
                });
            }
            
            window.addEventListener('mermaid-task-click', (e) => {
                openTaskFromName(e.detail);
            });

            if (shouldFetch) {
                fetchData();
            }
        });

        // ★修正: .toString() を削除し、数値のまま保存する
        watch(playerLevel, (newVal) => {
            saveLS('eft_level', newVal);
        });

        // その他の設定データの保存
        watch([userHideout, completedTasks, collectedItems, ownedKeys, keyUserData, prioritizedTasks], () => {
            saveLS('eft_hideout', userHideout.value);
            saveLS('eft_tasks', completedTasks.value);
            saveLS('eft_collected', collectedItems.value);
            saveLS('eft_keys', ownedKeys.value);
            saveLS('eft_key_user_data', keyUserData.value);
            saveLS('eft_prioritized', prioritizedTasks.value);
        }, { deep: true });

        watch(showMaxedHideout, (val) => saveLS('eft_show_maxed_hideout', val));
        watch(keysViewMode, (val) => saveLS('eft_keys_view_mode', val));
        watch(keysSortMode, (val) => saveLS('eft_keys_sort_mode', val));
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
        
        const tasksByTrader = computed(() => {
            const rawGrouped = TaskLogic.groupTasksByTrader(visibleTasks.value);
            const traderOrder = ['Prapor', 'Therapist', 'Fence', 'Skier', 'Peacekeeper', 'Mechanic', 'Ragman', 'Jaeger', 'Ref', 'Lightkeeper'];
            const sortedGrouped = {};
            traderOrder.forEach(name => { if (rawGrouped[name]) { sortedGrouped[name] = rawGrouped[name]; delete rawGrouped[name]; } });
            Object.keys(rawGrouped).forEach(key => { sortedGrouped[key] = rawGrouped[key]; });
            return sortedGrouped;
        });

        const tasksByMap = computed(() => {
            const rawGrouped = TaskLogic.groupTasksByMap(visibleTasks.value);
            const mapOrder = [
                "Any / Multiple",
                "Customs",
                "Woods",
                "Interchange",
                "Factory",
                "Shoreline",
                "Lighthouse",
                "Reserve",
                "Streets of Tarkov",
                "Ground Zero",
                "The Lab",
                "The Labyrinth"
            ];
            const sortedGrouped = {};
            mapOrder.forEach(name => { if (rawGrouped[name]) { sortedGrouped[name] = rawGrouped[name]; delete rawGrouped[name]; } });
            Object.keys(rawGrouped).sort().forEach(key => { sortedGrouped[key] = rawGrouped[key]; });
            return sortedGrouped;
        });
        
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

            let keysArray = Object.values(res.keys);
            if (keysViewMode.value === 'owned') {
                keysArray = keysArray.filter(k => ownedKeys.value.includes(k.id));
            }

            const getRateVal = (id) => {
                const r = keyUserData.value[id]?.rating || '-';
                const map = {'S':10, 'A':8, 'B':6, 'C':4, 'D':2, 'F':0, '?':1, '-': -1};
                return map[r] !== undefined ? map[r] : -1;
            };

            keysArray.sort((a, b) => {
                const isOwnedA = ownedKeys.value.includes(a.id);
                const isOwnedB = ownedKeys.value.includes(b.id);
                if (keysSortMode.value === 'owned_first') {
                    if (isOwnedA !== isOwnedB) return isOwnedA ? -1 : 1;
                } else if (keysSortMode.value === 'rating') {
                    const rateA = getRateVal(a.id);
                    const rateB = getRateVal(b.id);
                    if (rateA !== rateB) return rateB - rateA;
                }
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
                keys: keysArray 
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
            showMaxedHideout, keysViewMode, keysSortMode, flowchartTrader,
            currentTab, taskViewMode, showCompleted, showFuture, 
            isLoading, loadError, lastUpdated, fetchData,
            taskData, hideoutData, userHideout, completedTasks, collectedItems, ownedKeys, keyUserData, prioritizedTasks, 
            playerLevel, searchTask,ammoData,
            filteredTasksList, tasksByTrader, tasksByMap, shoppingList, totalItemsNeeded, totalKeysNeeded,
            expandedItems, toggleItemDetails, selectedTask, openTaskDetails: (t) => selectedTask.value = t,
            toggleCollected, toggleOwnedKey, togglePriority, updateKeyUserData, displayLists,
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
.component('comp-footer', CompFooter)
.component('comp-ammo', CompAmmo)
.component('comp-memo', CompMemo)
.mount('#app');