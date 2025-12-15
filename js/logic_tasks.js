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

    // ★修正: 日本語名も含めてマップを検索
    getTaskMaps(task) {
        // 検索対象のマップ名定義 (英語名 -> 検索キーワード配列)
        const mapKeywords = {
            "Customs": ["customs", "カスタム"],
            "Factory": ["factory", "工場", "night factory"],
            "Interchange": ["interchange", "インターチェンジ"],
            "The Lab": ["the lab", "labs", "ラボ"],
            "Lighthouse": ["lighthouse", "ライトハウス"],
            "Reserve": ["reserve", "リザーブ", "軍事基地"],
            "Shoreline": ["shoreline", "ショアライン"],
            "Streets of Tarkov": ["streets of tarkov", "streets", "ストリート"],
            "Woods": ["woods", "ウッズ"],
            "Ground Zero": ["ground zero", "グラウンドゼロ"]
        };
        
        const maps = new Set();

        // 1. APIのマップ情報があれば追加 (最優先)
        if (task.map && task.map.name) {
            // APIのマップ名を正規化して登録
            let apiMapName = task.map.name;
            // 表記揺れの吸収
            if (apiMapName.includes("Night")) apiMapName = "Factory";
            if (apiMapName.includes("21+")) apiMapName = "Ground Zero";
            
            maps.add(apiMapName);
        }

        // 2. 目標の説明文からマップ名を検索して追加
        if (task.objectives) {
            task.objectives.forEach(obj => {
                const desc = (obj.description || "").toLowerCase();
                
                for (const [officialName, keywords] of Object.entries(mapKeywords)) {
                    // 既に登録済みならスキップ
                    if (maps.has(officialName)) continue;

                    // キーワードが含まれているかチェック
                    for (const key of keywords) {
                        if (desc.includes(key.toLowerCase())) {
                            maps.add(officialName);
                            break; // ヒットしたらこのマップの他のキーワードはチェック不要
                        }
                    }
                }
            });
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