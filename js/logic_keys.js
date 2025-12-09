// js/logic_keys.js
const KeyLogic = {
    calculate(itemsData, mapsData, activeTaskList, addItemFunc) {
        if (!mapsData || !Array.isArray(mapsData)) return;

        const activeTaskNames = new Set(activeTaskList.map(t => t.name));
        
        // ★修正1: アイテムIDから詳細情報を引ける辞書を作る
        const itemLookup = {};
        if (itemsData && Array.isArray(itemsData)) {
            itemsData.forEach(item => {
                itemLookup[item.id] = item;
            });
        }

        // タスクで使用する鍵のマッピング
        const keyTaskMap = {};
        if (itemsData && Array.isArray(itemsData)) {
            itemsData.forEach(k => {
                if (k.usedInTasks) {
                    k.usedInTasks.forEach(t => {
                        if (activeTaskNames.has(t.name)) {
                            if (!keyTaskMap[k.id]) keyTaskMap[k.id] = [];
                            keyTaskMap[k.id].push(t.name);
                        }
                    });
                }
            });
        }

        mapsData.forEach(map => {
            if (map.locks) {
                map.locks.forEach(lock => {
                    if (lock.key) {
                        const rawKey = lock.key;
                        const keyId = rawKey.id || rawKey.normalizedName; // IDを取得

                        // ★修正2: itemsData側から名前などの詳細情報を取得する
                        // (mapsデータ側には id しかない場合があるため)
                        const fullKeyData = itemLookup[keyId] || rawKey;
                        
                        // 名前が取れない場合は "Unknown Key" とする（エラー回避）
                        const keyName = fullKeyData.name || rawKey.name || "Unknown Key";
                        const wiki = fullKeyData.wikiLink || "";
                        const short = fullKeyData.shortName || "";
                        const norm = fullKeyData.normalizedName || "";

                        const taskNames = keyTaskMap[keyId] || [];
                        
                        if (taskNames.length > 0) {
                            taskNames.forEach(tName => {
                                addItemFunc(
                                    'keys',
                                    keyId,
                                    keyName, // 取得した名前を使用
                                    1,
                                    tName,
                                    'task',
                                    map.name,
                                    wiki,
                                    short,
                                    norm
                                );
                            });
                        } else {
                            addItemFunc(
                                'keys',
                                keyId,
                                keyName, // 取得した名前を使用
                                1,
                                '', 
                                'none',
                                map.name,
                                wiki,
                                short,
                                norm
                            );
                        }
                    }
                });
            }
        });
    }
};