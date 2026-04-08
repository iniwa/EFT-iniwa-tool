// src/logic/hideoutLogic.js
// ハイドアウト関連のビジネスロジック (純粋関数)

import { CURRENCY_IDS } from '../data/constants.js';

/**
 * ハイドアウトのショッピングリストを計算する
 * @param {Array} hideoutData - ハイドアウトステーションデータ
 * @param {Object} userLevels - ユーザーの各ステーションレベル { normalizedName: level }
 * @param {Function} addItemFn - アイテム追加コールバック
 *   ({ category, itemId, itemName, count, sourceName, sourceType })
 */
export function calculateShoppingList(hideoutData, userLevels, addItemFn) {
  if (!hideoutData) return;

  hideoutData.forEach((station) => {
    const currentLvl = userLevels[station.normalizedName] || 0;

    station.levels.forEach((lvl) => {
      if (lvl.level > currentLvl) {
        lvl.itemRequirements.forEach((req) => {
          const item = req.item;
          if (!item) return;

          // FIR判定: APIの attributes から foundInRaid を確認
          const apiSaysFir =
            req.attributes &&
            req.attributes.some(
              (attr) =>
                attr.type === 'foundInRaid' &&
                String(attr.value).toLowerCase() === 'true'
            );

          const isCurrency = CURRENCY_IDS.includes(item.id);

          // 通貨はFIR不要、それ以外はAPIのFIR判定に従う
          if (!isCurrency && apiSaysFir) {
            addItemFn({
              category: 'hideoutFir',
              itemId: item.id,
              itemName: item.name,
              count: req.count,
              sourceName: `${station.name} Lv${lvl.level}`,
              sourceType: 'hideout',
            });
          } else {
            addItemFn({
              category: 'hideoutBuy',
              itemId: item.id,
              itemName: item.name,
              count: req.count,
              sourceName: `${station.name} Lv${lvl.level}`,
              sourceType: 'hideout',
            });
          }
        });
      }
    });
  });
}
