const TaskLogic = {
    filterActiveTasks(taskData, completedList, level, search, showCompleted, showFuture) {
        if (!taskData) return [];
        return taskData.filter(task => {
            const isCompleted = completedList.includes(task.name);
            const matchesSearch = !search || task.name.toLowerCase().includes(search.toLowerCase());

            if (showCompleted) {
                return isCompleted && matchesSearch;
            } else {
                const levelMet = task.minPlayerLevel <= level;
                let prereqMet = true;
                if (task.taskRequirements && task.taskRequirements.length > 0) {
                    prereqMet = task.taskRequirements.every(req => {
                        if (!req.task) return true;
                        return completedList.includes(req.task.name);
                    });
                }
                let traderMet = true;
                if (task.traderLevelRequirements && task.traderLevelRequirements.length > 0) {
                    traderMet = task.traderLevelRequirements.every(req => req.level <= level);
                }
                const isUnlocked = levelMet && prereqMet && traderMet;
                const condition = showFuture ? true : isUnlocked;
                return !isCompleted && condition && matchesSearch;
            }
        });
    },

    calculate(taskData, completedList, addItemFunc) {
        if (!taskData) return;
        taskData.forEach(task => {
            if (!completedList.includes(task.name)) {
                if (task.objectives) {
                    task.objectives.forEach(obj => {
                        if ((obj.type === 'giveItem' || obj.type === 'findItem') && obj.item) {
                            if (task.name === 'Collector') {
                                // ★修正: sourceType = 'collector'
                                addItemFunc('collector', obj.item.id, obj.item.name, obj.count, task.name, 'collector');
                            } else if (obj.foundInRaid) {
                                // ★修正: sourceType = 'task'
                                addItemFunc('taskFir', obj.item.id, obj.item.name, obj.count, task.name, 'task');
                            } else {
                                // ★修正: sourceType = 'task'
                                addItemFunc('taskNormal', obj.item.id, obj.item.name, obj.count, task.name, 'task');
                            }
                        }
                    });
                }
            }
        });
    },

    groupTasksByTrader(tasks) {
        const groups = {};
        tasks.forEach(task => {
            const trader = task.trader ? task.trader.name : 'Unknown';
            if (!groups[trader]) groups[trader] = [];
            groups[trader].push(task);
        });
        return groups;
    },
    
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