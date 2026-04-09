// src/logic/taskLogic.js
// タスク関連のビジネスロジック (純粋関数)

import { TRADER_ORDER, MAP_ORDER } from '../data/constants.js';

// マップ名キーワード辞書 (日本語含む)
const mapKeywords = {
  'Customs': ['customs', 'カスタム'],
  'Factory': ['factory', '工場', 'night factory'],
  'Interchange': ['interchange', 'インターチェンジ'],
  'The Lab': ['the lab'],
  'Lighthouse': ['lighthouse', 'ライトハウス'],
  'Reserve': ['reserve', 'リザーブ', '軍事基地', 'military base'],
  'Shoreline': ['shoreline', 'ショアライン'],
  'Streets of Tarkov': ['streets of tarkov', 'streets', 'ストリート'],
  'Woods': ['woods', 'ウッズ'],
  'Ground Zero': ['ground zero', 'グラウンドゼロ'],
  'The Labyrinth': ['labyrinth', 'ラビリンス'],
};

/**
 * タスクのフィルタリングを行う
 * @param {Array} tasks - 全タスクデータ
 * @param {Array} completedTaskIds - 完了済みタスクIDの配列
 * @param {object} options - フィルタオプション
 * @param {number} options.playerLevel - プレイヤーレベル (0 = 制限解除)
 * @param {string} options.searchQuery - 検索文字列
 * @param {boolean} options.showCompleted - 完了済み表示モード
 * @param {boolean} options.showFuture - ロック中タスク表示
 * @param {boolean} options.showKappaOnly - Kappaのみ表示
 * @param {boolean} options.showLightkeeperOnly - Lightkeeperのみ表示
 * @returns {Array}
 */
export function filterActiveTasks(tasks, completedTaskIds, options = {}) {
  if (!tasks) return [];

  const {
    playerLevel = 0,
    searchQuery = '',
    showCompleted = false,
    showFuture = false,
    showKappaOnly = false,
    showLightkeeperOnly = false,
  } = options;

  const q = searchQuery.toLowerCase();
  const ignoreLevel = playerLevel === 0; // Lv0なら制限解除

  return tasks.filter((task) => {
    const isCompleted = completedTaskIds.includes(task.id);

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
      // 前提タスクチェック (IDベース)
      let reqMet = true;
      if (task.taskRequirements) {
        task.taskRequirements.forEach((r) => {
          if (!completedTaskIds.includes(r.task.id)) reqMet = false;
        });
      }

      // レベルチェック
      let levelMet = true;
      if (!ignoreLevel && task.minPlayerLevel > playerLevel) levelMet = false;

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
}

/**
 * タスクに関連するマップ名の配列を取得する
 * APIの objectives.maps を優先し、フォールバックとしてキーワードマッチングを使用
 * @param {object} task
 * @returns {string[]}
 */
export function getTaskMaps(task) {
  const maps = new Set();

  // 1. APIのマップ情報があれば追加 (最優先)
  if (task.map && task.map.name) {
    let apiMapName = task.map.name;
    if (apiMapName.includes('Night')) apiMapName = 'Factory';
    if (apiMapName.includes('21+')) apiMapName = 'Ground Zero';
    maps.add(apiMapName);
  }

  // 2. objectives の maps フィールドから取得 (API v2)
  if (task.objectives) {
    task.objectives.forEach((obj) => {
      if (obj.maps && Array.isArray(obj.maps)) {
        obj.maps.forEach((m) => {
          if (m.name) {
            let name = m.name;
            if (name.includes('Night')) name = 'Factory';
            if (name.includes('21+')) name = 'Ground Zero';
            maps.add(name);
          }
        });
      }
    });
  }

  // 3. 目標の説明文からマップ名をキーワード検索して追加 (フォールバック)
  if (task.objectives) {
    task.objectives.forEach((obj) => {
      const desc = (obj.description || '').toLowerCase();
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

  // 誤検知タスクを除外
  if (task.name === 'One Less Loose End' || task.name === 'A Healthy Alternative') {
    maps.delete('The Lab');
  }

  if (maps.size === 0) return [];
  return Array.from(maps).sort();
}

/**
 * トレーダーごとにタスクをグループ化
 * @param {Array} tasks
 * @returns {Object<string, Array>}
 */
export function groupTasksByTrader(tasks) {
  const groups = {};
  tasks.forEach((t) => {
    const tr = t.trader ? t.trader.name : 'Unknown';
    if (!groups[tr]) groups[tr] = [];
    groups[tr].push(t);
  });

  // TRADER_ORDER で並べ替え
  const sorted = {};
  TRADER_ORDER.forEach((name) => {
    if (groups[name]) {
      sorted[name] = groups[name];
      delete groups[name];
    }
  });
  // 残りのトレーダーを追加
  Object.keys(groups).forEach((key) => {
    sorted[key] = groups[key];
  });
  return sorted;
}

/**
 * マップごとにタスクをグループ化
 * @param {Array} tasks
 * @returns {Object<string, Array>}
 */
export function groupTasksByMap(tasks) {
  const groups = {};
  tasks.forEach((t) => {
    const taskMaps = getTaskMaps(t);
    let key =
      taskMaps.length > 0
        ? taskMaps[0]
        : t.map
          ? t.map.name
          : 'Any / Multiple';
    if (taskMaps.length > 1) key = 'Any / Multiple';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  // MAP_ORDER で並べ替え
  const sorted = {};
  MAP_ORDER.forEach((name) => {
    if (groups[name]) {
      sorted[name] = groups[name];
      delete groups[name];
    }
  });
  // 残りのマップをアルファベット順で追加
  Object.keys(groups)
    .sort()
    .forEach((key) => {
      sorted[key] = groups[key];
    });
  return sorted;
}

/**
 * ショッピングリスト計算 (タスク必要アイテム)
 * @param {Array} tasks - 全タスクデータ
 * @param {Array} completedTaskIds - 完了済みタスクIDの配列
 * @param {Function} addItemFn - アイテム追加コールバック ({ category, itemId, itemName, count, sourceName, sourceType, mapName, wikiLink })
 */
export function calculateShoppingList(tasks, completedTaskIds, addItemFn) {
  if (!tasks) return;

  tasks.forEach((t) => {
    // 完了済みはスキップ (IDベース)
    if (completedTaskIds.includes(t.id)) return;

    if (t.objectives) {
      t.objectives.forEach((obj) => {
        // items (複数形) を優先、item (単数) にフォールバック
        const objItems = obj.items || (obj.item ? [obj.item] : []);

        if (obj.type === 'giveItem' && objItems.length > 0) {
          // カテゴリ判定: Collectorは専用カテゴリ、それ以外はFIR有無で振り分け
          const isCollector = t.name === 'Collector';
          let category;
          if (isCollector) {
            category = 'collector';
          } else {
            category = obj.foundInRaid ? 'taskFir' : 'taskNormal';
          }

          const sourceType = isCollector ? 'collector' : 'task';

          if (objItems.length === 1) {
            // 単一アイテム: 従来通り
            addItemFn({
              category,
              itemId: objItems[0].id,
              itemName: objItems[0].name,
              count: obj.count || 1,
              sourceName: t.name,
              sourceType,
              mapName: t.map ? t.map.name : null,
              wikiLink: t.wikiLink,
            });
          } else {
            // 複数アイテム: いずれかで合計count個を納品
            // グループIDを生成 (同一アイテム群は統合される)
            const groupId = 'multi_' + objItems.map((i) => i.id).sort().join('_');
            addItemFn({
              category,
              itemId: groupId,
              itemName: obj.description,
              count: obj.count || 1,
              sourceName: t.name,
              sourceType,
              mapName: t.map ? t.map.name : null,
              wikiLink: t.wikiLink,
              altItems: objItems,
            });
          }
        }
      });
    }
  });
}

/**
 * 指定したタスクの前提タスクを再帰的に全て取得する (IDベース)
 * @param {string} taskId - 対象タスクのID
 * @param {Array} allTasks - 全タスクデータ
 * @param {Set} visited - 訪問済みセット (再帰用)
 * @returns {string[]} 前提タスクIDの配列
 */
export function getAllPrerequisites(taskId, allTasks, visited = new Set()) {
  const results = [];
  const task = allTasks.find((t) => t.id === taskId);
  if (!task || visited.has(taskId)) return results;

  visited.add(taskId);

  if (task.taskRequirements) {
    task.taskRequirements.forEach((req) => {
      const reqId = req.task.id;
      if (!visited.has(reqId)) {
        results.push(reqId);
        // 再帰的に親の親を取得
        const parents = getAllPrerequisites(reqId, allTasks, visited);
        results.push(...parents);
      }
    });
  }

  return [...new Set(results)];
}
