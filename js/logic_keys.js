// js/logic_keys.js

const KeyLogic = {
    calculate(itemsData, mapsData, activeTaskList, addItemFunc) {
        if (!mapsData || !Array.isArray(mapsData)) return;

        const activeTaskNames = new Set(activeTaskList.map(t => t.name));
        
        const itemLookup = {};
        if (itemsData && Array.isArray(itemsData)) {
            itemsData.forEach(item => { itemLookup[item.id] = item; });
        }

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
                        const keyId = rawKey.id || rawKey.normalizedName;
                        const fullKeyData = itemLookup[keyId] || rawKey;
                        
                        const keyName = fullKeyData.name || rawKey.name || "Unknown Key";
                        const wiki = fullKeyData.wikiLink || "";
                        const short = fullKeyData.shortName || "";
                        const norm = fullKeyData.normalizedName || "";

                        const taskNames = keyTaskMap[keyId] || [];
                        if (taskNames.length > 0) {
                            taskNames.forEach(tName => addItemFunc('keys', keyId, keyName, 1, tName, 'task', map.name, wiki, short, norm));
                        } else {
                            addItemFunc('keys', keyId, keyName, 1, '', 'none', map.name, wiki, short, norm);
                        }
                    }
                });
            }
        });
    }
};