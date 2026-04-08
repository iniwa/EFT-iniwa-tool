// src/logic/keyLogic.js
// 鍵関連のビジネスロジック (純粋関数)

/**
 * マップ・タスク情報およびアイテムデータから鍵を抽出し、ショッピングリストへ登録する
 * @param {Array} itemsData - 全アイテムデータ
 * @param {Array} mapsData - マップとロック情報
 * @param {Array} allTaskData - タスク情報
 * @param {Function} addItemFn - アイテム追加コールバック
 *   ({ category, itemId, itemName, count, sourceName, sourceType, mapName, wikiLink })
 */
export function calculateShoppingList(itemsData, mapsData, allTaskData, addItemFn) {
  if (!itemsData || !Array.isArray(itemsData)) return;

  // 1. アイテム参照用マップ作成 (ID と normalizedName の両方をキーに)
  const itemById = {};
  const itemByNorm = {};
  for (let i = 0; i < itemsData.length; i++) {
    const item = itemsData[i];
    if (item.id) itemById[item.id] = item;
    if (item.normalizedName) itemByNorm[item.normalizedName] = item;
  }

  // 2. 鍵とタスクの紐付け (keyId -> Set<taskName>)
  const keyTaskMap = {};
  if (allTaskData && Array.isArray(allTaskData)) {
    for (let i = 0; i < allTaskData.length; i++) {
      const task = allTaskData[i];
      if (!task.neededKeys) continue;
      for (let j = 0; j < task.neededKeys.length; j++) {
        const group = task.neededKeys[j];
        if (!group.keys) continue;
        for (let k = 0; k < group.keys.length; k++) {
          const key = group.keys[k];
          if (!keyTaskMap[key.id]) keyTaskMap[key.id] = new Set();
          keyTaskMap[key.id].add(task.name);
        }
      }
    }
  }

  // 3. 鍵とマップの紐付け (keyId -> string[]) - マップ名を配列で保持
  const keyLocationMap = {};
  if (mapsData && Array.isArray(mapsData)) {
    for (let i = 0; i < mapsData.length; i++) {
      const map = mapsData[i];
      if (!map.locks) continue;
      for (let j = 0; j < map.locks.length; j++) {
        const lock = map.locks[j];
        if (lock.key && lock.key.id) {
          const kid = lock.key.id;
          if (!keyLocationMap[kid]) keyLocationMap[kid] = [];
          if (!keyLocationMap[kid].includes(map.name)) {
            keyLocationMap[kid].push(map.name);
          }
        }
      }
    }
  }

  // 4. 全鍵IDを統合 (タスク, マップ, types判定から)
  const allKeyIds = new Set([
    ...Object.keys(keyLocationMap),
    ...Object.keys(keyTaskMap),
  ]);

  // types に 'keys' を含むアイテムも追加 (名前ベースの誤検知を防ぐ)
  for (let i = 0; i < itemsData.length; i++) {
    const item = itemsData[i];
    if (item.types && item.types.includes('keys')) {
      allKeyIds.add(item.id);
    }
  }

  // 5. 登録処理
  allKeyIds.forEach((keyId) => {
    const fullKeyData = itemById[keyId] || { id: keyId, name: 'Unknown Key' };
    const keyName = fullKeyData.name || 'Unknown Key';
    const wiki = fullKeyData.wikiLink || null;
    const finalId = fullKeyData.id || keyId;
    const shortName = fullKeyData.shortName || null;
    const normalizedName = fullKeyData.normalizedName || null;

    // タスク名一覧
    let taskNames = [];
    if (keyTaskMap[finalId]) taskNames = Array.from(keyTaskMap[finalId]);

    // マップ名: 配列で保持 (複数マップに対応)
    const mapNames = keyLocationMap[finalId] || [];
    const mapName = mapNames.length > 0 ? mapNames[0] : 'Unknown / Other';

    // 登録
    if (taskNames.length > 0) {
      taskNames.forEach((tName) => {
        addItemFn({
          category: 'keys',
          itemId: finalId,
          itemName: keyName,
          count: 1,
          sourceName: `Task: ${tName}`,
          sourceType: 'task',
          mapName,
          wikiLink: wiki,
          shortName,
          normalizedName,
        });
      });
    } else {
      // タ��クなし
      addItemFn({
        category: 'keys',
        itemId: finalId,
        itemName: keyName,
        count: 1,
        sourceName: '-',
        sourceType: 'map',
        mapName,
        wikiLink: wiki,
        shortName,
        normalizedName,
      });
    }
  });
}
