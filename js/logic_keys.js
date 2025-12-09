// js/logic_keys.js
const KeyLogic = {
    calculate(itemsData, mapsData, activeTaskList, addItemFunc) {
        if (!mapsData || !Array.isArray(mapsData)) return;

        const activeTaskNames = new Set(activeTaskList.map(t => t.name));
        
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
                        const key = lock.key;
                        const keyId = key.id || key.normalizedName || key.name;
                        const taskNames = keyTaskMap[keyId] || [];
                        
                        if (taskNames.length > 0) {
                            taskNames.forEach(tName => {
                                addItemFunc(
                                    'keys',
                                    keyId,
                                    key.name,
                                    1,
                                    tName,
                                    'task',
                                    map.name,
                                    key.wikiLink,
                                    key.shortName,     // ★追加
                                    key.normalizedName // ★追加
                                );
                            });
                        } else {
                            addItemFunc(
                                'keys',
                                keyId,
                                key.name,
                                1,
                                '', 
                                'none',
                                map.name,
                                key.wikiLink,
                                key.shortName,     // ★追加
                                key.normalizedName // ★追加
                            );
                        }
                    }
                });
            }
        });
    }
};