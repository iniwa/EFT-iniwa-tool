// js/logic_keys.js
const KeyLogic = {
    calculate(itemsData, mapsData, activeTaskList, addItemFunc) {
        if (!itemsData || !Array.isArray(itemsData)) return;

        // アクティブなタスク名のセット
        const activeTaskNames = new Set(activeTaskList.map(t => t.name));
        
        // マップごとの鍵IDリストを作成 (検索用)
        // mapKeySet = { "Factory": Set("keyId1", "keyId2"...), ... }
        const mapKeySet = {};
        if (mapsData && Array.isArray(mapsData)) {
            mapsData.forEach(m => {
                if (m.locks) {
                    mapKeySet[m.name] = new Set(m.locks.map(l => l.key ? l.key.id : null).filter(id => id));
                }
            });
        }

        // 全ての鍵をループ
        itemsData.forEach(keyItem => {
            // この鍵がどのマップに属するか判定
            let belongingMaps = [];
            for (const [mapName, keySet] of Object.entries(mapKeySet)) {
                if (keySet.has(keyItem.id)) {
                    belongingMaps.push(mapName);
                }
            }

            // どこにも属さない場合は "Unknown / Other"
            if (belongingMaps.length === 0) {
                belongingMaps.push("Unknown / Other");
            }

            // タスクで使用するかチェック
            const usedTasks = [];
            if (keyItem.usedInTasks) {
                keyItem.usedInTasks.forEach(t => {
                    // タスク名があれば追加 (アクティブかどうかは表示側でフィルタリングするために情報は全部持たせる)
                    if(t.name) usedTasks.push(t.name);
                });
            }

            // 各所属マップの行として追加
            belongingMaps.forEach(mapName => {
                // ショッピングリストの仕様に合わせてデータ追加
                // sourceName にはタスク名をカンマ区切りで入れたり、オブジェクトを渡したりする
                // ここでは addItemFunc の仕様に合わせて、タスクがある場合はタスクごとにエントリを作ると行が増えすぎるため
                // 1つの鍵エントリに対して複数のタスクを紐付ける形にする (components側で対応が必要だが、現状のaddItemFuncは行を分ける設計)
                
                // 今回は「1行1鍵」で見やすくするため、タスク情報は sources 配列にまとめる
                // そのため、addItemFunc を1回だけ呼び出し、sources は内部で push してもらう
                
                // ただし、addItemFunc はユニークID生成に行うため、ここであえてタスク名を空にして呼び出し、
                // sources 配列は後で直接設定するか、addItemFunc をハックする。
                // 既存の app.js の addItem ロジック:
                // if (cat === 'keys') { if (sourceName && !res...sources.some...) push }
                
                // 解決策: まず空で登録し、その後タスクがあればそれを追加する
                
                // 1. ベース登録
                addItemFunc(
                    'keys',
                    keyItem.id,
                    keyItem.name,
                    1,
                    '', // sourceName (空文字で登録)
                    'none',
                    mapName,
                    keyItem.wikiLink,
                    keyItem.shortName,     // 追加引数
                    keyItem.normalizedName // 追加引数
                );

                // 2. タスク情報の紐付け (既存のaddItemロジックを利用してsourcesに追加)
                if (usedTasks.length > 0) {
                    usedTasks.forEach(taskName => {
                        // アクティブタスクかどうかでタイプを変えるなど可能だが、一旦 'task' で統一
                        addItemFunc(
                            'keys',
                            keyItem.id,
                            keyItem.name,
                            1,
                            taskName,
                            'task',
                            mapName,
                            keyItem.wikiLink,
                            keyItem.shortName,
                            keyItem.normalizedName
                        );
                    });
                }
            });
        });
    }
};