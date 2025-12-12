// js/logic_tasks.js (重複カウント修正 & 機能完全版)

const TaskLogic = {
    // タスクのフィルタリング（完了済み除外、レベル条件、ソートなど）
    filterActiveTasks(taskData, completedList, level, search, showCompleted, showFuture) {
        if (!taskData) return [];
        const lowerSearch = (search || '').toLowerCase();

        return taskData.filter(task => {
            // 1. 検索フィルター
            if (lowerSearch && !task.name.toLowerCase().includes(lowerSearch)) {
                return false;
            }

            const isCompleted = completedList.includes(task.name);

            // 2. 完了済みの表示切り替え
            if (showCompleted) {
                return isCompleted;
            } else {
                if (isCompleted) return false;
            }

            // 3. 未来のタスク（ロック中）の表示切り替え
            if (!showFuture) {
                // レベル不足は隠す
                if (task.minPlayerLevel > level) return false;

                // 前提タスクが終わっていない場合は隠す
                if (task.taskRequirements) {
                    const reqsMet = task.taskRequirements.every(req => 
                        completedList.includes(req.task.name)
                    );
                    if (!reqsMet) return false;
                }
            }

            return true;
        }).sort((a, b) => {
            // ソート順: レベル順 -> 名前順
            if (a.minPlayerLevel !== b.minPlayerLevel) {
                return a.minPlayerLevel - b.minPlayerLevel;
            }
            return a.name.localeCompare(b.name);
        });
    },

    // 必要なアイテムの計算
    calculate(taskData, completedList, addItemFunc) {
        if (!taskData) return;
        
        // 完了していないタスクのみを対象
        const activeTasks = taskData.filter(t => !completedList.includes(t.name));

        activeTasks.forEach(task => {
            if (task.objectives) {
                task.objectives.forEach(obj => {
                    // ★修正: 重複を防ぐため 'giveItem' (納品) のみを対象にする
                    if (obj.type === 'giveItem' && obj.item) {
                        
                        // マップ名やWikiリンクの取得（app.jsへ渡すため）
                        const mapName = task.map ? task.map.name : null;
                        const wikiLink = task.wikiLink || null;

                        // カテゴリ分け
                        let category = 'taskNormal'; // デフォルト
                        
                        if (task.name === 'Collector') {
                            category = 'collector';
                        } else if (obj.foundInRaid) {
                            category = 'taskFir';
                        }

                        // アイテム追加関数を実行 (引数は app.js の addItem に合わせる)
                        addItemFunc(
                            category,               // カテゴリ
                            obj.item.id,           // アイテムID
                            obj.item.name,         // アイテム名
                            obj.count,             // 必要数
                            task.name,             // ソース（タスク名）
                            'task',                // タイプ
                            mapName,               // マップ名
                            wikiLink,              // Wikiリンク
                            obj.item.shortName,    // 短縮名
                            obj.item.normalizedName // URL用名
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
            const mapName = (task.map && task.map.name) ? task.map.name : 'Any / Multiple';
            if (!groups[mapName]) groups[mapName] = [];
            groups[mapName].push(task);
        });
        return groups;
    }
};