// src/logic/taskLogic.js
// タスク関連のビジネスロジック (純粋関数)

import { TRADER_ORDER, MAP_ORDER } from '../data/constants.js';

// マップ名キーワード辞書 (日本語含む)
const mapKeywords = {
  'Customs': ['customs', 'カスタム'],
  'Factory': ['factory', '工場', 'night factory'],
  'Interchange': ['interchange', 'インターチェンジ'],
  'The Lab (Dark)': ['the lab (dark)', 'lab dark'],
  'The Labyrinth': ['labyrinth', 'ラビリンス'],
  'The Lab': ['the lab'],
  'Lighthouse': ['lighthouse', 'ライトハウス'],
  'Reserve': ['reserve', 'リザーブ', '軍事基地', 'military base'],
  'Shoreline': ['shoreline', 'ショアライン'],
  'Streets of Tarkov': ['streets of tarkov', 'streets', 'ストリート'],
  'Woods': ['woods', 'ウッズ'],
  'Icebreaker': ['icebreaker', 'アイスブレーカー'],
  'Ground Zero Tutorial': ['ground zero tutorial', 'ground zero チュートリアル'],
  'Ground Zero': ['ground zero', 'グラウンドゼロ'],
  'Terminal': ['terminal', 'ターミナル'],
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
    taskStatuses = {},
    traderProgress = {},
    traderRequirementsEnabled = false,
  } = options;

  const q = searchQuery.toLowerCase();

  return tasks.filter((task) => {
    const status = getTaskStatus(task.id, completedTaskIds, taskStatuses);
    const isCompleted = status === 'complete';

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
      const availability = evaluateTaskAvailability(task, completedTaskIds, {
        playerLevel,
        taskStatuses,
        traderProgress,
        traderRequirementsEnabled,
      });

      // showFuture=false (ロック中を表示しない) なら、条件未達は隠す
      if (!showFuture && availability.locked) return false;
    }

    // Kappa判定
    if (showKappaOnly && !task.kappaRequired) return false;

    // LK判定
    if (showLightkeeperOnly && !task.lightkeeperRequired) return false;

    return true;
  });
}

export function getTaskStatus(id, completedTaskIds = [], taskStatuses = {}) {
  if (completedTaskIds.includes(id)) return 'complete';
  return ['active', 'failed'].includes(taskStatuses?.[id]) ? taskStatuses[id] : 'unstarted';
}

export function compareRequirement(actual, expected, method = '>=') {
  if (actual == null || expected == null) return null;
  const a = Number(actual);
  const e = Number(expected);
  if (!Number.isNaN(a) && !Number.isNaN(e)) {
    switch (method) {
      case '>=': return a >= e;
      case '>': return a > e;
      case '<=': return a <= e;
      case '<': return a < e;
      case '=':
      case '==': return a === e;
      default: return a === e;
    }
  }
  return String(actual) === String(expected);
}

export function evaluateTraderRequirement(requirement, traderProgress = {}) {
  const traderId = requirement?.trader?.id || requirement?.trader;
  const progress = traderProgress?.[traderId] || traderProgress?.[requirement?.trader?.name];
  const isReputation = ['reputation', 'standing'].includes(requirement?.requirementType);
  const field = isReputation ? 'reputation' : 'level';
  const expected = requirement?.value ?? requirement?.level;
  const actual = progress?.[field];
  const result = compareRequirement(actual, expected, requirement?.compareMethod);

  return {
    actual,
    expected,
    field,
    supported: typeof traderId === 'string' && traderId.length > 0,
    met: result === true,
    unknown: result === null,
  };
}

export function evaluateTraderRequirements(task, traderProgress = {}) {
  const requirements = task?.traderLevelRequirements || task?.traderRequirements || [];
  const results = requirements.map((requirement) => ({
    requirement,
    ...evaluateTraderRequirement(requirement, traderProgress),
  }));

  return {
    met: results.every((result) => !result.supported || result.met),
    unknown: results.some((result) => result.unknown),
    results,
  };
}

export function evaluateTaskAvailability(task, completedTaskIds = [], options = {}) {
  const {
    playerLevel = 0,
    taskStatuses = {},
    traderProgress = {},
    traderRequirementsEnabled = false,
  } = options;
  const reqMet = (task.taskRequirements || []).every((r) => {
    const allowed = Array.isArray(r.status) && r.status.length ? r.status : ['complete'];
    return allowed.includes(getTaskStatus(r.task.id, completedTaskIds, taskStatuses));
  });
  const levelMet = !playerLevel || !task.minPlayerLevel || task.minPlayerLevel <= playerLevel;
  const trader = evaluateTraderRequirements(task, traderProgress);
  return { locked: !(reqMet && levelMet && (!traderRequirementsEnabled || trader.met)), reqMet, levelMet, trader };
}

/**
 * タスクに関連するマップ名の配列を取得する
 * APIの objectives.maps を優先し、フォールバックとしてキーワードマッチングを使用
 * @param {object} task
 * @returns {string[]}
 */
export function getTaskMaps(task) {
  const maps = new Set();

  const normalizeMapName = (mapName) => {
    if (mapName.includes('Night')) return 'Factory';
    if (mapName.includes('Ground Zero') && /tutorial|チュートリアル/i.test(mapName)) {
      return 'Ground Zero Tutorial';
    }
    if (mapName.includes('21+')) return 'Ground Zero';
    return mapName;
  };

  // 1. APIのマップ情報があれば追加 (最優先)
  if (task.map && task.map.name) {
    maps.add(normalizeMapName(task.map.name));
  }

  // 2. objectives の maps フィールドから取得 (API v2)
  if (task.objectives) {
    task.objectives.forEach((obj) => {
      if (obj.maps && Array.isArray(obj.maps)) {
        obj.maps.forEach((m) => {
          if (m.name) {
            maps.add(normalizeMapName(m.name));
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
        if (
          officialName === 'The Lab' &&
          (maps.has('The Lab (Dark)') || maps.has('The Labyrinth'))
        ) continue;
        if (officialName === 'Ground Zero' && maps.has('Ground Zero Tutorial')) continue;

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
  return Array.from(maps).sort((a, b) => {
    const indexA = MAP_ORDER.indexOf(a);
    const indexB = MAP_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
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
      const reqId = req?.task?.id;
      if (!reqId) return;
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

/** Cycle-safe recursive prerequisite closure, including the supplied roots. */
export function getPrerequisiteClosure(taskIds, allTasks = []) {
  const roots = Array.isArray(taskIds) ? taskIds : [taskIds];
  const byId = new Map((allTasks || []).filter((task) => task?.id).map((task) => [task.id, task]));
  const seen = new Set();
  const result = [];
  const visit = (id, visiting = new Set()) => {
    if (!id || seen.has(id) || visiting.has(id)) return;
    const task = byId.get(id);
    if (!task) return;
    const next = new Set(visiting).add(id);
    (task.taskRequirements || []).forEach((req) => visit(req?.task?.id, next));
    seen.add(id);
    result.push(id);
  };
  roots.forEach((id) => visit(id));
  return result;
}

/** Format the OR-statuses on a task prerequisite for a flowchart edge. */
export function formatTaskRequirementStatuses(statuses) {
  const values = Array.isArray(statuses) && statuses.length ? statuses : ['complete'];
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length === 1 && uniqueValues[0] === 'complete') return '';
  const labels = { complete: '完了', active: '進行中', failed: '失敗' };
  return uniqueValues.map((status) => labels[status] || status).join('/');
}

/** Return a cycle-safe, best-effort post-order setup plan for prerequisite statuses. */
export function getInitialSetupPlan(taskId, allTasks = []) {
  const byId = new Map((allTasks || []).filter((task) => task?.id).map((task) => [task.id, task]));
  const constraints = new Map();
  const visiting = new Set();
  const expanded = new Set();
  const allowedFor = (req) => {
    const statuses = Array.isArray(req?.status) && req.status.length ? req.status : ['complete'];
    return statuses.filter((status) => ['complete', 'active', 'failed'].includes(status));
  };
  const visit = (id) => {
    if (!id || expanded.has(id)) return;
    const task = byId.get(id);
    if (!task) return;
    if (visiting.has(id)) return;
    visiting.add(id);
    const requirements = Array.isArray(task.taskRequirements) ? task.taskRequirements : [];
    requirements.slice().sort((a, b) => String(a?.task?.id || '').localeCompare(String(b?.task?.id || ''))).forEach((req) => {
      const reqId = req?.task?.id;
      if (!reqId) return;
      const allowed = new Set(allowedFor(req));
      const prior = constraints.get(reqId) || [];
      prior.push(allowed);
      constraints.set(reqId, prior);
      visit(reqId);
    });
    visiting.delete(id);
    expanded.add(id);
  };
  visit(taskId);
  const ids = getPrerequisiteClosure(taskId, allTasks);
  return ids.map((id) => {
    const sets = constraints.get(id) || [];
    if (id === taskId && sets.length === 0) {
      return { id, status: 'complete', conflict: false };
    }
    const intersection = sets.length
      ? [...sets[0]].filter((status) => sets.every((set) => set.has(status)))
      : [];
    const union = new Set(sets.flatMap((set) => [...set]));
    const candidates = intersection.length ? intersection : [...union];
    const status = ['complete', 'active', 'failed'].find((value) => candidates.includes(value)) || 'active';
    const conflict = sets.length > 0 && intersection.length === 0;
    if (id === taskId) {
      return { id, status: 'complete', conflict: conflict || !intersection.includes('complete') };
    }
    return { id, status, conflict };
  });
}
