// src/composables/useShoppingList.js
// Shopping list computation (singleton)

import { computed } from 'vue';
import { useApiData } from './useApiData.js';
import { useUserProgress } from './useUserProgress.js';
import { RATE_VALUES } from '../data/constants.js';

// Logic modules will be provided by src/logic/ (created in another phase).
// For now we import the expected named exports.
import * as TaskLogic from '../logic/taskLogic.js';
import * as HideoutLogic from '../logic/hideoutLogic.js';
import * as KeyLogic from '../logic/keyLogic.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert an object-map of items into a sorted array (descending by count). */
function toSortedArray(obj) {
  return Object.values(obj).sort((a, b) => b.count - a.count);
}

/**
 * Look up the numeric rating value for a key based on user data.
 * @param {string} id
 * @param {Object} keyUserDataValue - raw keyUserData.value
 * @returns {number}
 */
function getRateVal(id, keyUserDataValue) {
  const r = keyUserDataValue[id]?.rating || '-';
  return RATE_VALUES[r] !== undefined ? RATE_VALUES[r] : -1;
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export function useShoppingList() {
  const {
    taskData,
    hideoutData,
    itemsData,
  } = useApiData();

  const {
    completedTasks,
    userHideout,
    collectedItems,
    ownedKeys,
    keyUserData,
    keysViewMode,
    keysSortMode,
  } = useUserProgress();

  // -----------------------------------------------------------------------
  // Core shopping list computation
  // -----------------------------------------------------------------------

  const shoppingList = computed(() => {
    const res = {
      hideoutFir: {},
      hideoutBuy: {},
      taskFir: {},
      taskNormal: {},
      collector: {},
      keys: {},
    };

    /**
     * Callback used by all three logic modules to aggregate items.
     * Logic modules pass an object: { category, itemId, itemName, count, sourceName, sourceType, mapName, wikiLink }
     */
    const addItem = ({
      category: cat,
      itemId: id,
      itemName: name,
      count,
      sourceName,
      sourceType,
      mapName = null,
      wikiLink: wiki = null,
      shortName = null,
      normalizedName = null,
    }) => {
      const uid = cat === 'keys' ? `key_${mapName}_${id}` : `${cat}_${id}`;

      if (!res[cat][uid]) {
        res[cat][uid] = {
          id,
          uid,
          name,
          count: 0,
          sources: [],
          mapName,
          wikiLink: wiki,
          shortName,
          normalizedName,
        };
      }

      if (cat === 'keys') {
        // Keys: aggregate sources only (no count summing)
        if (
          sourceName &&
          !res[cat][uid].sources.some((s) => s.name === sourceName)
        ) {
          res[cat][uid].sources.push({ name: sourceName, type: sourceType });
        }
      } else {
        // Regular items: sum counts and track sources
        res[cat][uid].count += count;
        const existing = res[cat][uid].sources.find(
          (s) => s.name === sourceName,
        );
        if (existing) {
          existing.count += count;
        } else {
          res[cat][uid].sources.push({
            name: sourceName,
            type: sourceType,
            count,
          });
        }
      }
    };

    // Run each logic module
    HideoutLogic.calculateShoppingList(hideoutData.value, userHideout.value, addItem);
    TaskLogic.calculateShoppingList(taskData.value, completedTasks.value, addItem);

    const rawItems = itemsData.value.items || [];
    const rawMaps = itemsData.value.maps || [];
    KeyLogic.calculateShoppingList(rawItems, rawMaps, taskData.value, addItem);

    // --- Build keys array with sorting ---
    let keysArray = Object.values(res.keys);

    // Filter by view mode
    if (keysViewMode.value === 'owned') {
      keysArray = keysArray.filter((k) => ownedKeys.value.includes(k.id));
    }

    // Sort keys
    keysArray.sort((a, b) => {
      const isOwnedA = ownedKeys.value.includes(a.id);
      const isOwnedB = ownedKeys.value.includes(b.id);

      if (keysSortMode.value === 'owned_first') {
        if (isOwnedA !== isOwnedB) return isOwnedA ? -1 : 1;
      } else if (keysSortMode.value === 'rating') {
        const rateA = getRateVal(a.id, keyUserData.value);
        const rateB = getRateVal(b.id, keyUserData.value);
        if (rateA !== rateB) return rateB - rateA;
      }

      const mapCmp = (a.mapName || '').localeCompare(b.mapName || '');
      if (mapCmp !== 0) return mapCmp;
      return a.name.localeCompare(b.name);
    });

    return {
      hideoutFir: toSortedArray(res.hideoutFir),
      hideoutBuy: toSortedArray(res.hideoutBuy),
      taskFir: toSortedArray(res.taskFir),
      taskNormal: toSortedArray(res.taskNormal),
      collector: toSortedArray(res.collector),
      keys: keysArray,
    };
  });

  // -----------------------------------------------------------------------
  // Derived totals
  // -----------------------------------------------------------------------

  const totalItemsNeeded = computed(() => {
    const sl = shoppingList.value;
    return (
      sl.hideoutFir.length +
      sl.hideoutBuy.length +
      sl.taskFir.length +
      sl.taskNormal.length +
      sl.collector.length
    );
  });

  const totalKeysNeeded = computed(() => shoppingList.value.keys.length);

  // -----------------------------------------------------------------------
  // Display lists (title / CSS classes per category)
  // -----------------------------------------------------------------------

  const displayLists = computed(() => ({
    hideoutFir: {
      title: '🏠 ハイドアウト (FIR必須)',
      items: shoppingList.value.hideoutFir,
      borderClass: 'border-warning',
      headerClass: 'bg-dark text-warning border-warning',
      badgeClass: 'bg-warning text-dark',
    },
    hideoutBuy: {
      title: '🏠 ハイドアウト (購入で可)',
      items: shoppingList.value.hideoutBuy,
      borderClass: '',
      headerClass: 'bg-dark text-info border-info',
      badgeClass: 'bg-primary',
    },
    taskFir: {
      title: '✅ タスク (FIR必須)',
      items: shoppingList.value.taskFir,
      borderClass: 'border-warning',
      headerClass: 'bg-dark text-warning border-warning',
      badgeClass: 'bg-warning text-dark',
    },
    collector: {
      title: '👑 Collector (FIR)',
      items: shoppingList.value.collector,
      borderClass: 'border-danger',
      headerClass: 'bg-dark text-danger border-danger',
      badgeClass: 'bg-danger',
    },
    taskNormal: {
      title: '📦 タスク (購入で可)',
      items: shoppingList.value.taskNormal,
      borderClass: '',
      headerClass: 'bg-dark text-secondary border-secondary',
      badgeClass: 'bg-secondary',
    },
  }));

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  return {
    shoppingList,
    totalItemsNeeded,
    totalKeysNeeded,
    displayLists,
  };
}
