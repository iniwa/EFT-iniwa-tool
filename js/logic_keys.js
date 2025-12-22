// js/logic_keys.js

const KeyLogic = {
    calculate(itemsData, mapsData, allTaskData, addItemFunc) {
        // itemsDataが必須です
        if (!itemsData || !Array.isArray(itemsData)) return;

        // 1. アイテム参照用マップ作成 (ID -> Item)
        const itemLookup = {};
        itemsData.forEach(item => { 
            if (item.id) itemLookup[item.id] = item;
            if (item.normalizedName) itemLookup[item.normalizedName] = item;
        });

        // 2. 鍵とタスクの紐付けマップ作成 (KeyID -> Set of TaskNames)
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
                                // itemLookupにない場合の保険
                                if (k.id && !itemLookup[k.id]) itemLookup[k.id] = k;
                            });
                        }
                    });
                }
                // Objectives からの登録 (納品系)
                if (task.objectives) {
                    task.objectives.forEach(obj => {
                        if (obj.item && (obj.type === 'giveItem' || obj.type === 'findItem')) {
                            const keyId = obj.item.id;
                            // アイテムが「鍵」であるかを確認（itemLookupにあるか、または名前にkeyが含まれるか等簡易判定）
                            // ここでは itemLookup に登録されている(＝APIで鍵カテゴリとして取得された)もののみを対象とする
                            if (itemLookup[keyId]) {
                                const keyItem = itemLookup[keyId];
                                addRelation(keyItem.id, keyItem.normalizedName, task.name);
                            }
                        }
                    });
                }
            });
        }

        // 3. マップ情報の事前集計 (KeyID -> MapName)
        // ★修正: ここでマップ情報を先に辞書化しておきます
        const keyLocationMap = {};
        if (mapsData && Array.isArray(mapsData)) {
            mapsData.forEach(map => {
                if (map.locks) {
                    let mapName = map.name;
                    // マップ名の正規化
                    if (mapName.includes('Ground Zero') || mapName.includes('グラウンドゼロ')) {
                        mapName = 'Ground Zero';
                    }
                    if (mapName.includes('Factory') || mapName.includes('ファクトリー') || mapName.includes('工場')) {
                        mapName = 'Factory';
                    }

                    map.locks.forEach(lock => {
                        if (lock.key && lock.key.id) {
                            if (!keyLocationMap[lock.key.id]) {
                                keyLocationMap[lock.key.id] = [];
                            }
                            if (!keyLocationMap[lock.key.id].includes(mapName)) {
                                keyLocationMap[lock.key.id].push(mapName);
                            }
                        }
                    });
                }
            });
        }

        // 4. リスト生成 (全鍵データを走査)
        // ★修正: itemsData (全鍵データ) をループの主軸にします
        itemsData.forEach(rawKey => {
            const keyId = rawKey.id;
            const keyNorm = rawKey.normalizedName;
            
            const fullKeyData = itemLookup[keyId] || itemLookup[keyNorm] || rawKey;
            
            const keyName = fullKeyData.name || rawKey.name || "Unknown Key";
            const wiki = fullKeyData.wikiLink || "";
            const short = fullKeyData.shortName || "";
            const norm = fullKeyData.normalizedName || keyNorm || "";
            const finalId = fullKeyData.id || keyId;

            // タスク情報の取得
            let taskNames = [];
            if (finalId && keyTaskMap[finalId]) {
                taskNames = [...keyTaskMap[finalId]];
            } else if (norm && keyTaskMap[norm]) {
                taskNames = [...keyTaskMap[norm]];
            }

            // マップ情報の取得 (なければ Unknown / Other になる)
            // app.js側で mapLookup しているが、念のためここでも判定
            let mapName = 'Unknown / Other';
            if (keyLocationMap[finalId] && keyLocationMap[finalId].length > 0) {
                mapName = keyLocationMap[finalId][0]; // 最初のマップを採用
            }

            // データ登録
            // タスクがある鍵、またはマップ情報がある鍵のみを登録しても良いが、
            // itemsDataにあるならすべて登録しておくのが安全
            if (taskNames.length > 0) {
                taskNames.forEach(tName => {
                    addItemFunc('keys', finalId, keyName, 1, tName, 'task', mapName, wiki, short, norm);
                });
            } else if (mapName !== 'Unknown / Other') {
                // タスクはないがマップ場所はわかっている鍵
                addItemFunc('keys', finalId, keyName, 1, '', 'none', mapName, wiki, short, norm);
            } else {
                // タスクもマップも不明だがアイテムデータにはある鍵 (念のため追加)
                addItemFunc('keys', finalId, keyName, 1, '', 'none', mapName, wiki, short, norm);
            }
        });
    }
};