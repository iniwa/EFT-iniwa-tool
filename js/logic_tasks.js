// js/logic_tasks.js

const TaskLogic = {
    // タスクのフィルタリング
    filterActiveTasks(taskData, completedList, level, search, showCompleted, showFuture) {
        if (!taskData) return [];
        const lowerSearch = (search || '').toLowerCase();

        return taskData.filter(task => {
            if (lowerSearch && !task.name.toLowerCase().includes(lowerSearch)) return false;

            const isCompleted = completedList.includes(task.name);

            if (showCompleted) {
                return isCompleted;
            } else {
                if (isCompleted) return false;
            }

            // Lv0の場合は、未完了タスクならすべて表示 (レベル制限等を無視)
            if (level === 0) return true;

            if (!showFuture) {
                if (task.minPlayerLevel > level) return false;
                if (task.taskRequirements) {
                    const reqsMet = task.taskRequirements.every(req => 
                        completedList.includes(req.task.name)
                    );
                    if (!reqsMet) return false;
                }
            }
            return true;
        }).sort((a, b) => {
            if (a.minPlayerLevel !== b.minPlayerLevel) {
                return a.minPlayerLevel - b.minPlayerLevel;
            }
            return a.name.localeCompare(b.name);
        });
    },

    // 日本語名も含めてマップを検索
    getTaskMaps(task) {
        const mapKeywords = {
            "Customs": ["customs", "カスタム"],
            "Factory": ["factory", "工場", "night factory"],
            "Interchange": ["interchange", "インターチェンジ"],
            "The Lab": ["the lab"], 
            "Lighthouse": ["lighthouse", "ライトハウス"],
            "Reserve": ["reserve", "リザーブ", "軍事基地", "military base"],
            "Shoreline": ["shoreline", "ショアライン"],
            "Streets of Tarkov": ["streets of tarkov", "streets", "ストリート"],
            "Woods": ["woods", "ウッズ"],
            "Ground Zero": ["ground zero", "グラウンドゼロ"],
            "The Labyrinth": ["labyrinth", "ラビリンス"]
        };
        
        const maps = new Set();

        // 1. APIのマップ情報があれば追加 (最優先)
        if (task.map && task.map.name) {
            let apiMapName = task.map.name;
            if (apiMapName.includes("Night")) apiMapName = "Factory";
            if (apiMapName.includes("21+")) apiMapName = "Ground Zero";
            maps.add(apiMapName);
        }

        // 2. 目標の説明文からマップ名を検索して追加
        if (task.objectives) {
            task.objectives.forEach(obj => {
                const desc = (obj.description || "").toLowerCase();
                for (const [officialName, keywords] of Object.entries(mapKeywords)) {
                    if (maps.has(officialName)) continue;
                    
                    for (const key of keywords) {
                        if (desc.includes(key.toLowerCase())) {
                            maps.add(officialName);
                            break; 
                        }
                    }
                }
            });
        }

        // ★修正: 誤検知タスクを「特別に」除外するリスト
        // - "One Less Loose End": Factoryタスクだが "lab journal" でヒットしてしまう
        // - "A Healthy Alternative": Reserveタスクだが "laboratory" でヒットしてしまう
        if (task.name === "One Less Loose End" || task.name === "A Healthy Alternative") {
            maps.delete("The Lab");
        }

        if (maps.size === 0) return [];
        return Array.from(maps).sort();
    },

    // 必要なアイテムの計算
    calculate(taskData, completedList, addItemFunc) {
        if (!taskData) return;
        const activeTasks = taskData.filter(t => !completedList.includes(t.name));

        activeTasks.forEach(task => {
            if (task.objectives) {
                task.objectives.forEach(obj => {
                    if (obj.type === 'giveItem' && obj.item) {
                        const mapName = task.map ? task.map.name : null;
                        const wikiLink = task.wikiLink || null;
                        let category = 'taskNormal'; 
                        if (task.name === 'Collector') category = 'collector';
                        else if (obj.foundInRaid) category = 'taskFir';

                        addItemFunc(
                            category, obj.item.id, obj.item.name, obj.count,
                            task.name, 'task', mapName, wikiLink,
                            obj.item.shortName, obj.item.normalizedName
                        );
                    }
                });
            }
        });
    },

    // トレーダーごとのグルーピング
    groupTasksByTrader(tasks) {
        const groups = {};
        tasks.forEach(task => {
            const trader = task.trader ? task.trader.name : 'Unknown';
            if (!groups[trader]) groups[trader] = [];
            groups[trader].push(task);
        });
        return groups;
    },
    
    // マップごとのグルーピング
    groupTasksByMap(tasks) {
        const groups = {};
        tasks.forEach(task => {
            const mapNames = task.derivedMaps && task.derivedMaps.length > 0 
                            ? task.derivedMaps 
                            : ['Any / Multiple'];

            mapNames.forEach(mapName => {
                if (!groups[mapName]) groups[mapName] = [];
                groups[mapName].push(task);
            });
        });
        return groups;
    }
};