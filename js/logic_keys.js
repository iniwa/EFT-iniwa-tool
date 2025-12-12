// js/logic_keys.js

const KeyLogic = {
    calculate(itemsData, mapsData, allTaskData, addItemFunc) {
        if (!mapsData || !Array.isArray(mapsData)) return;

        // 1. アイテム参照用マップ作成
        const itemLookup = {};
        if (itemsData && Array.isArray(itemsData)) {
            itemsData.forEach(item => { 
                if (item.id) itemLookup[item.id] = item;
                if (item.normalizedName) itemLookup[item.normalizedName] = item;
            });
        }

        // 2. 鍵とタスクの紐付けマップ作成
        const keyTaskMap = {}; 

        const addRelation = (keyId, keyNormName, taskName) => {
            if (keyId) {
                if (!keyTaskMap[keyId]) keyTaskMap[keyId] = new Set();
                keyTaskMap[keyId].add(taskName);
            }
            if (keyNormName) {
                if (!keyTaskMap[keyNormName]) keyTaskMap[keyNormName] = new Set();
                keyTaskMap[keyNormName].add(taskName);
            }
        };

        if (allTaskData && Array.isArray(allTaskData)) {
            allTaskData.forEach(task => {
                // neededKeys からの登録
                if (task.neededKeys && Array.isArray(task.neededKeys)) {
                    task.neededKeys.forEach(group => {
                        if (group.keys && Array.isArray(group.keys)) {
                            group.keys.forEach(k => {
                                addRelation(k.id, k.normalizedName, task.name);
                                if (k.id && !itemLookup[k.id]) itemLookup[k.id] = k;
                            });
                        }
                    });
                }
                // Objectives からの登録 (納品系)
                if (task.objectives) {
                    task.objectives.forEach(obj => {
                        if (obj.item && (obj.type === 'giveItem' || obj.type === 'findItem')) {
                            if (itemLookup[obj.item.id]) {
                                const keyItem = itemLookup[obj.item.id];
                                addRelation(keyItem.id, keyItem.normalizedName, task.name);
                            }
                        }
                    });
                }
            });
        }

        // 3. マップデータに基づいてリスト生成
        mapsData.forEach(map => {
            if (map.locks) {
                // ★修正箇所: マップ名の正規化(統一)処理
                let mapName = map.name;

                // Ground Zero (21+) を Ground Zero に統合
                // 英語名と日本語名(グラウンドゼロ)の両方を考慮して部分一致で判定
                if (mapName.includes('Ground Zero') || mapName.includes('グラウンドゼロ')) {
                    mapName = 'Ground Zero';
                }

                // Factory (Night) を Factory に統合
                // 英語名、カタカナ、漢字(工場)のいずれも Factory に統一
                if (mapName.includes('Factory') || mapName.includes('ファクトリー') || mapName.includes('工場')) {
                    mapName = 'Factory';
                }

                map.locks.forEach(lock => {
                    if (lock.key) {
                        const rawKey = lock.key;
                        const keyId = rawKey.id;
                        const keyNorm = rawKey.normalizedName;
                        
                        const fullKeyData = itemLookup[keyId] || itemLookup[keyNorm] || rawKey;
                        
                        const keyName = fullKeyData.name || rawKey.name || "Unknown Key";
                        const wiki = fullKeyData.wikiLink || "";
                        const short = fullKeyData.shortName || "";
                        const norm = fullKeyData.normalizedName || keyNorm || "";
                        const finalId = fullKeyData.id || keyId;

                        let taskNames = [];
                        if (finalId && keyTaskMap[finalId]) {
                            taskNames = [...keyTaskMap[finalId]];
                        } else if (norm && keyTaskMap[norm]) {
                            taskNames = [...keyTaskMap[norm]];
                        }

                        // addItemFuncに渡す mapName を、正規化した変数に変更
                        if (taskNames.length > 0) {
                            taskNames.forEach(tName => {
                                addItemFunc('keys', finalId, keyName, 1, tName, 'task', mapName, wiki, short, norm);
                            });
                        } else {
                            addItemFunc('keys', finalId, keyName, 1, '', 'none', mapName, wiki, short, norm);
                        }
                    }
                });
            }
        });
    }
};