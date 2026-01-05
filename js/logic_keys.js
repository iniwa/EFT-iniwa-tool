// js/logic_keys.js

const KeyLogic = {
    /**
     * マップとタスク情報、およびアイテム名から鍵を抽出する
     * @param {Array} itemsData 全アイテムデータ
     * @param {Array} mapsData マップとロック情報
     * @param {Array} allTaskData タスク情報
     * @param {Function} addItemFunc コールバック
     */
    calculate(itemsData, mapsData, allTaskData, addItemFunc) {
        if (!itemsData || !Array.isArray(itemsData)) return;

        // 1. アイテム参照用マップ作成
        const itemLookup = {};
        itemsData.forEach(item => { 
            if (item.id) itemLookup[item.id] = item;
            if (item.normalizedName) itemLookup[item.normalizedName] = item;
        });

        // 2. 鍵とタスクの紐付け
        const keyTaskMap = {}; 
        if (allTaskData && Array.isArray(allTaskData)) {
            allTaskData.forEach(task => {
                if (task.neededKeys) {
                    task.neededKeys.forEach(group => {
                        if (group.keys) {
                            group.keys.forEach(k => {
                                if (!keyTaskMap[k.id]) keyTaskMap[k.id] = new Set();
                                keyTaskMap[k.id].add(task.name);
                            });
                        }
                    });
                }
            });
        }

        // 3. 鍵とマップの紐付け
        const keyLocationMap = {};
        if (mapsData && Array.isArray(mapsData)) {
            mapsData.forEach(map => {
                if (map.locks) {
                    map.locks.forEach(lock => {
                        if (lock.key && lock.key.id) {
                            const kid = lock.key.id;
                            if (!keyLocationMap[kid]) keyLocationMap[kid] = [];
                            if (!keyLocationMap[kid].includes(map.name)) {
                                keyLocationMap[kid].push(map.name);
                            }
                        }
                    });
                }
            });
        }

        // 4. IDの統合 (タスクとマップから抽出)
        const allKeyIds = new Set([...Object.keys(keyLocationMap), ...Object.keys(keyTaskMap)]);

        // ★修正: 名前判定 ("key"を含むか) を廃止し、データ上の分類 (types) で判定する
        // これにより "KeyMOD" や "KeySlot" などの誤検知を排除します
        itemsData.forEach(item => {
            // ステップ1で queries.js に types を追加していないと、ここは無視されます
            if (item.types && item.types.includes('keys')) {
                 allKeyIds.add(item.id);
            }
        });

        // 5. 登録処理
        allKeyIds.forEach(keyId => {
            const fullKeyData = itemLookup[keyId] || { id: keyId, name: 'Unknown Key' };
            const keyName = fullKeyData.name || "Unknown Key";
            const wiki = fullKeyData.wikiLink || null;
            const short = fullKeyData.shortName || "";
            const norm = fullKeyData.normalizedName || "";
            const finalId = fullKeyData.id || keyId;

            let taskNames = [];
            if (keyTaskMap[finalId]) taskNames = Array.from(keyTaskMap[finalId]);

            let mapName = 'Unknown / Other';
            if (keyLocationMap[finalId] && keyLocationMap[finalId].length > 0) {
                mapName = keyLocationMap[finalId][0];
            }

            // Unknownフィルタリング:
            // 今回は「使用先不明の鍵」も表示したいので、mapNameがUnknownでも許可する。
            
            // 登録
            if (taskNames.length > 0) {
                taskNames.forEach(tName => {
                    addItemFunc('keys', finalId, keyName, 1, `Task: ${tName}`, 'task', mapName, wiki, short, norm);
                });
            } else {
                // タスクなし
                addItemFunc('keys', finalId, keyName, 1, '-', 'map', mapName, wiki, short, norm);
            }
        });
    }
};