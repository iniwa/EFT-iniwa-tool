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

        // ★追加: 名前による鍵アイテムの救出 (使用先不明の鍵を拾うため)
        // types情報がないため、アイテム名で判定する
        itemsData.forEach(item => {
            const name = (item.name || "").toLowerCase();
            const shortName = (item.shortName || "").toLowerCase();
            
            // 判定キーワード: 鍵, key, card, カード
            // 除外キーワード: キーカードホルダー, keytool などコンテナ類が含まれないように注意が必要だが、
            // 一旦広く拾って、明らかに違うものは除外リストに入れるなどが安全。
            // ここではシンプルなキーワード判定を行う。
            
            const isKeyByName = 
                name.includes("key") || name.includes("鍵") || 
                name.includes("card") || name.includes("カード");

            // 既にリストにある場合はスキップ
            if (isKeyByName && !allKeyIds.has(item.id)) {
                // 明らかにゴミっぽいものを除外する簡易フィルタ (必要に応じて調整)
                if (name.includes("keytool") || name.includes("keycard holder") || name.includes("ケース")) {
                    return; 
                }
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

            // Unknownフィルタリングについて:
            // 今回は「使用先不明の鍵」も表示したいので、mapNameがUnknownでも許可する。
            // ただし、タスクもなく、マップもなく、名前も鍵っぽくない（IDだけリストにあった謎データ）は弾く。
            // (ステップ4で名前チェックを通しているので、ここに来るUnknownは「名前が鍵」か「リストにあった」もののどちらか)
            
            // 登録
            if (taskNames.length > 0) {
                taskNames.forEach(tName => {
                    addItemFunc('keys', finalId, keyName, 1, `Task: ${tName}`, 'task', mapName, wiki, short, norm);
                });
            } else {
                // タスクなし
                // マップ情報があればそれを表示、なければ Unknown / Other になる
                addItemFunc('keys', finalId, keyName, 1, '-', 'map', mapName, wiki, short, norm);
            }
        });
    }
};