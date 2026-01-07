// js/logic_tasks.js

const TaskLogic = {
    /**
     * タスクのフィルタリングを行う
     */
    filterActiveTasks(tasks, completed, level, query, showCompleted, showFuture, showKappaOnly, showLightkeeperOnly) {
        if (!tasks) return [];
        
        const q = (query || "").toLowerCase();
        const ignoreLevel = (level === 0); // Lv0なら制限解除

        return tasks.filter(task => {
            const isCompleted = completed.includes(task.name);

            // モードによる表示/非表示の切り分け
            if (showCompleted) {
                // 履歴モード: 完了済みだけを表示
                if (!isCompleted) return false;
            } else {
                // 通常モード: 未完了だけを表示
                if (isCompleted) return false;
            }

            // 検索フィルタ
            if (q) {
                const matchName = task.name.toLowerCase().includes(q);
                const matchMap = task.map && task.map.name.toLowerCase().includes(q);
                const matchTrader = task.trader && task.trader.name.toLowerCase().includes(q);
                if (!matchName && !matchMap && !matchTrader) return false;
            }

            // 未完了タスクの表示条件
            if (!isCompleted) {
                // 前提タスクチェック
                let reqMet = true;
                if (task.taskRequirements) {
                    task.taskRequirements.forEach(r => {
                        if (!completed.includes(r.task.name)) reqMet = false;
                    });
                }
                
                // レベルチェック
                let levelMet = true;
                if (!ignoreLevel && task.minPlayerLevel > level) levelMet = false;

                // showFuture=false (ロック中を表示しない) なら、条件未達は隠す
                if (!showFuture) {
                    if (!reqMet || !levelMet) return false;
                }
            }

            // Kappa判定
            if (showKappaOnly && !task.kappaRequired) return false;

            // LK判定
            if (showLightkeeperOnly && !task.lightkeeperRequired) return false;

            return true;
        });
    },

    /**
     * 日本語名も含めてマップを検索する
     */
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

        // 誤検知タスクを「特別に」除外するリスト
        // - "One Less Loose End": Factoryタスクだが "lab journal" でヒットしてしまう
        // - "A Healthy Alternative": Reserveタスクだが "laboratory" でヒットしてしまう
        if (task.name === "One Less Loose End" || task.name === "A Healthy Alternative") {
            maps.delete("The Lab");
        }

        if (maps.size === 0) return [];
        return Array.from(maps).sort();
    },

    /**
     * トレーダーごとのグループ化
     */
    groupTasksByTrader(tasks) {
        const groups = {};
        tasks.forEach(t => {
            const tr = t.trader ? t.trader.name : 'Unknown';
            if (!groups[tr]) groups[tr] = [];
            groups[tr].push(t);
        });
        return groups;
    },

    /**
     * マップごとのグループ化
     */
    groupTasksByMap(tasks) {
        const groups = {};
        tasks.forEach(t => {
            const maps = this.getTaskMaps(t);
            let key = maps.length > 0 ? maps[0] : (t.map ? t.map.name : 'Any / Multiple');
            if (maps.length > 1) key = "Any / Multiple";
            if (!groups[key]) groups[key] = [];
            groups[key].push(t);
        });
        return groups;
    },

    /**
     * ショッピングリスト計算
     */
    calculate(tasks, completed, addItemFunc) {
        if (!tasks) return;
        tasks.forEach(t => {
            // 完了済みはスキップ
            if (completed.includes(t.name)) return;

            // 必要なアイテム (Objectives)
            if (t.objectives) {
                t.objectives.forEach(obj => {
                    if (obj.type === 'giveItem' && obj.item) {
                        
                        // カテゴリ判定ロジック
                        // Collectorタスクは専用カテゴリへ、それ以外はFIR有無で振り分け
                        const isCollector = t.name === 'Collector';
                        let cat;
                        if (isCollector) {
                            cat = 'collector';
                        } else {
                            cat = obj.foundInRaid ? 'taskFir' : 'taskNormal';
                        }

                        // タスク名そのままを使用 ('Task: ' を付けない)
                        const srcName = t.name;
                        
                        // ソースタイプの設定
                        const srcType = isCollector ? 'collector' : 'task';
                        
                        addItemFunc(
                            cat, 
                            obj.item.id, 
                            obj.item.name, 
                            obj.count, 
                            srcName, 
                            srcType, 
                            t.map ? t.map.name : null,
                            t.wikiLink
                        );
                    }
                });
            }
        });
    },

    /**
     * 指定したタスクの「前提タスク」を再帰的に全て取得する
     */
    getAllPrerequisites(taskName, allTasks, visited = new Set()) {
        const results = [];
        const task = allTasks.find(t => t.name === taskName);
        if (!task || visited.has(taskName)) return results;

        visited.add(taskName);

        if (task.taskRequirements) {
            task.taskRequirements.forEach(req => {
                const reqName = req.task.name;
                if (!visited.has(reqName)) {
                    results.push(reqName);
                    // 再帰的に親の親を取得
                    const parents = this.getAllPrerequisites(reqName, allTasks, visited);
                    results.push(...parents);
                }
            });
        }
        
        return [...new Set(results)];
    }
};