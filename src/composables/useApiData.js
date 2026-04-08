// src/composables/useApiData.js
// API data fetching, caching, and processing (singleton)

import { ref, shallowRef } from 'vue';
import { useIndexedDB } from './useStorage.js';
import { API_URL, RATE_LIMIT_MS, AUTO_UPDATE_MS } from '../data/constants.js';

// Queries will be provided by src/logic/queries.js (created in another phase).
// We import them lazily so the module can load even if queries.js is not yet present.
import { getMainQuery, getItemDbQuery, getSingleItemQuery } from '../logic/queries.js';

// ---------------------------------------------------------------------------
// IndexedDB instance (shared)
// ---------------------------------------------------------------------------
const { saveDB, loadDB } = useIndexedDB();

// ---------------------------------------------------------------------------
// Cache keys
// ---------------------------------------------------------------------------
const APP_CACHE_KEY = 'eft_api_cache_v31_idb';
const ITEM_DB_CACHE_KEY = 'eft_item_db_cache';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Task list (processed) */
const taskData = shallowRef([]);

/** Hideout station data (raw from API) */
const hideoutData = shallowRef([]);

/** Items + maps combined data */
const itemsData = shallowRef({ items: [], maps: [] });

/** Ammo data (processed) */
const ammoData = shallowRef([]);

/** Full item database (for item search feature) */
const itemDb = shallowRef([]);

/** Whether the item DB is currently being fetched */
const itemDbLoading = ref(false);

/** Formatted timestamp of last item DB update */
const itemDbLastUpdated = ref(null);

/** Item IDs currently being individually refreshed */
const updatingItemIds = ref([]);

/** Formatted timestamp of last main data update */
const lastUpdated = ref(null);

// ---------------------------------------------------------------------------
// Processing functions (ported from app.js)
// ---------------------------------------------------------------------------

/**
 * De-duplicate tasks by name and normalise finishRewards into a flat list.
 * @param {Array} tasks - Raw task array from API
 * @returns {Array} Processed task array
 */
function processTasks(tasks) {
  if (!tasks) return [];

  // De-duplicate by name
  const uniqueTasks = [];
  const seenNames = new Set();
  tasks.forEach((t) => {
    if (!seenNames.has(t.name)) {
      seenNames.add(t.name);
      uniqueTasks.push(t);
    }
  });

  return uniqueTasks.map((t) => {
    // Normalise finishRewards into a flat array
    const rewards = [];
    const r = t.finishRewards || {};

    if (r.items) {
      r.items.forEach((entry) => {
        if (entry.item) {
          rewards.push({
            type: 'item',
            name: entry.item.name,
            count: entry.count || 1,
            id: entry.item.id,
          });
        }
      });
    }

    if (r.offerUnlock) {
      r.offerUnlock.forEach((entry) => {
        if (entry.item && entry.trader) {
          rewards.push({
            type: 'offerUnlock',
            trader: entry.trader.name,
            level: entry.level,
            itemName: entry.item.name,
          });
        }
      });
    }

    if (r.craftUnlock) {
      r.craftUnlock.forEach((entry) => {
        const stationName = entry.station ? entry.station.name : 'Unknown';
        const craftedItemName =
          entry.rewardItems && entry.rewardItems.length > 0
            ? entry.rewardItems[0].item.name
            : 'Unknown Item';
        rewards.push({
          type: 'craftUnlock',
          station: stationName,
          level: entry.level,
          itemName: craftedItemName,
        });
      });
    }

    // Derive map labels (inline version — full logic lives in logic/tasks.js)
    const maps = _getTaskMaps(t);
    const mapLabel =
      maps.length > 0 ? maps.join(', ') : t.map ? t.map.name : 'Any';
    const finalWikiLink = t.wikiLink || `https://tarkov.dev/task/${t.id}`;

    return {
      ...t,
      finishRewardsList: rewards,
      wikiLink: finalWikiLink,
      derivedMaps: maps,
      mapLabel,
    };
  });
}

/** Minimal map-keyword extraction used during processing. */
const _MAP_KEYWORDS = {
  Customs: ['customs', 'カスタム'],
  Factory: ['factory', '工場', 'night factory'],
  Interchange: ['interchange', 'インターチェンジ'],
  'The Lab': ['the lab'],
  Lighthouse: ['lighthouse', 'ライトハウス'],
  Reserve: ['reserve', 'リザーブ', '軍事基地', 'military base'],
  Shoreline: ['shoreline', 'ショアライン'],
  'Streets of Tarkov': ['streets of tarkov', 'streets', 'ストリート'],
  Woods: ['woods', 'ウッズ'],
  'Ground Zero': ['ground zero', 'グラウンドゼロ'],
  'The Labyrinth': ['labyrinth', 'ラビリンス'],
};

function _getTaskMaps(task) {
  const maps = new Set();

  if (task.map && task.map.name) {
    let apiMapName = task.map.name;
    if (apiMapName.includes('Night')) apiMapName = 'Factory';
    if (apiMapName.includes('21+')) apiMapName = 'Ground Zero';
    maps.add(apiMapName);
  }

  if (task.objectives) {
    task.objectives.forEach((obj) => {
      const desc = (obj.description || '').toLowerCase();
      for (const [officialName, keywords] of Object.entries(_MAP_KEYWORDS)) {
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

  // Known false-positive exclusions
  if (
    task.name === 'One Less Loose End' ||
    task.name === 'A Healthy Alternative'
  ) {
    maps.delete('The Lab');
  }

  return maps.size === 0 ? [] : Array.from(maps).sort();
}

/**
 * Build key-to-map lookup from maps.locks and attach to items.
 * @param {Array} rawItems
 * @param {Array} rawMaps
 * @returns {{ items: Array, maps: Array }}
 */
function processItems(rawItems, rawMaps) {
  const mapLookup = {};
  if (rawMaps) {
    rawMaps.forEach((map) => {
      if (map.locks) {
        map.locks.forEach((lock) => {
          if (lock.key) {
            if (!mapLookup[lock.key.id]) mapLookup[lock.key.id] = [];
            if (!mapLookup[lock.key.id].includes(map.name)) {
              mapLookup[lock.key.id].push(map.name);
            }
          }
        });
      }
    });
  }

  return {
    items: (rawItems || []).map((i) => {
      const associatedMaps = mapLookup[i.id] || [];
      return {
        ...i,
        image512pxLink: i.image512pxLink,
        maps: associatedMaps,
        mapName:
          associatedMaps.length > 0 ? associatedMaps[0] : 'Unknown / Other',
        types: i.types || [],
      };
    }),
    maps: rawMaps || [],
  };
}

/**
 * Process raw ammo data — add trader/craft info and use stable fallback IDs.
 * @param {Array} rawAmmo
 * @param {Array} taskList - Processed task list (for task-name lookup)
 * @returns {Array}
 */
function processAmmo(rawAmmo, taskList) {
  const taskMap = new Map((taskList || []).map((t) => [t.id, t.name]));

  return (rawAmmo || []).map((a, index) => {
    let traders = [];
    if (a.item && a.item.buyFor) {
      traders = a.item.buyFor.filter((b) => b.vendor.name !== 'Flea Market');
      traders.forEach((t) => {
        const llReq = t.requirements
          ? t.requirements.find((r) => r.type === 'loyaltyLevel')
          : null;
        t.minTraderLevel = llReq ? llReq.value : 1;

        const taskReq = t.requirements
          ? t.requirements.find((r) => r.type === 'questCompleted')
          : null;
        if (taskReq && taskReq.stringValue) {
          t.taskUnlockName =
            taskMap.get(taskReq.stringValue) || 'Unknown Task';
        }
      });
      traders.sort((x, y) => x.minTraderLevel - y.minTraderLevel);
    }

    let crafts = [];
    if (a.item && a.item.craftsFor) {
      crafts = a.item.craftsFor;
      crafts.sort((x, y) => x.level - y.level);
    }

    return {
      ...a,
      caliber: a.caliber || 'Unknown',
      // Stable fallback ID instead of Math.random()
      id: a.item ? a.item.id : `ammo_unknown_${index}`,
      name: a.item ? a.item.name : 'Unknown Ammo',
      shortName: a.item ? a.item.shortName : null,
      description: a.item ? a.item.description : '',
      wikiLink: a.item ? a.item.wikiLink : null,
      image512pxLink: a.item ? a.item.image512pxLink : null,
      accuracyModifier: a.accuracyModifier,
      recoilModifier: a.recoilModifier,
      lightBleedModifier: a.lightBleedModifier,
      heavyBleedModifier: a.heavyBleedModifier,
      ricochetChance: a.ricochetChance,
      soldBy: traders,
      crafts,
    };
  });
}

// ---------------------------------------------------------------------------
// Fetch: main data
// ---------------------------------------------------------------------------

/**
 * Fetch (or reload from cache) the main API data: tasks, hideout, items, ammo.
 *
 * @param {string} gameMode - 'pve' | 'pvp'
 * @param {string} lang     - 'ja' | 'en'
 * @param {boolean} [force=false] - Skip rate-limit check
 * @param {import('vue').Ref<boolean>} isLoading  - shared loading ref
 * @param {import('vue').Ref<string|null>} loadError - shared error ref
 */
async function fetchData(gameMode, lang, force = false, isLoading, loadError) {
  const cache = await loadDB(APP_CACHE_KEY);

  if (!force && cache) {
    try {
      const lastTime = cache.lastFetchTime || 0;
      const nowTime = Date.now();
      if (nowTime - lastTime < RATE_LIMIT_MS && cache.tasks && cache.tasks.length > 0) {
        const remainSec = Math.ceil((RATE_LIMIT_MS - (nowTime - lastTime)) / 1000);
        alert(`データは最新です (あと ${remainSec} 秒)。`);
        hideoutData.value = cache.hideoutStations;
        taskData.value = cache.tasks;
        itemsData.value = cache.items;
        ammoData.value = cache.ammo || [];
        lastUpdated.value = cache.timestamp;
        return;
      }
    } catch (e) {
      console.error('Cache check error', e);
    }
  }

  isLoading.value = true;
  loadError.value = null;

  const mode = gameMode === 'pvp' ? 'regular' : gameMode;
  const { query, variables } = getMainQuery(mode, lang);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL Error: ${result.errors[0].message}`);
    }
    if (!result.data) {
      throw new Error('No Data');
    }

    hideoutData.value = result.data.hideoutStations || [];
    taskData.value = processTasks(result.data.tasks || []);
    itemsData.value = processItems(result.data.items, result.data.maps);
    ammoData.value = processAmmo(result.data.ammo, taskData.value);

    const now = new Date().toLocaleString('ja-JP');
    lastUpdated.value = now;

    await saveDB(APP_CACHE_KEY, {
      timestamp: now,
      lastFetchTime: Date.now(),
      hideoutStations: hideoutData.value,
      tasks: taskData.value,
      items: itemsData.value,
      ammo: ammoData.value,
    });
  } catch (err) {
    console.error(err);
    loadError.value = `更新失敗: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
}

// ---------------------------------------------------------------------------
// Fetch: full item database
// ---------------------------------------------------------------------------

/**
 * Fetch the complete item database for the item-search feature.
 *
 * @param {string} gameMode
 * @param {string} lang
 * @param {boolean} [forceUpdate=false]
 */
async function fetchItemDatabase(gameMode, lang, forceUpdate = false) {
  if (itemDbLoading.value) return;

  if (!forceUpdate && itemDb.value.length > 0) {
    console.log('Using cached Item DB.');
    return;
  }

  itemDbLoading.value = true;
  console.log('Fetching Item DB from API...');

  const mode = gameMode === 'pvp' ? 'regular' : gameMode;
  const { query, variables } = getItemDbQuery(mode, lang);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    itemDb.value = result.data.items || [];
    const now = new Date().toLocaleString('ja-JP');
    itemDbLastUpdated.value = now;

    await saveDB(ITEM_DB_CACHE_KEY, {
      timestamp: now,
      items: itemDb.value,
    });

    if (forceUpdate) {
      alert(`アイテムデータを更新しました。\n(${itemDb.value.length} items)`);
    }
  } catch (err) {
    alert(`DB取得失敗: ${err.message}`);
  } finally {
    itemDbLoading.value = false;
  }
}

// ---------------------------------------------------------------------------
// Fetch: single item price update
// ---------------------------------------------------------------------------

/**
 * Refresh a single item's price/trade data and update `itemDb` immutably.
 *
 * @param {string} itemId
 * @param {string} gameMode
 * @param {string} lang
 */
async function updateSingleItemPrice(itemId, gameMode, lang) {
  updatingItemIds.value.push(itemId);

  const mode = gameMode === 'pvp' ? 'regular' : gameMode;
  const { query, variables } = getSingleItemQuery(itemId, mode, lang);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();

    if (result.data && result.data.item) {
      const targetIndex = itemDb.value.findIndex((i) => i.id === itemId);
      if (targetIndex > -1) {
        const oldItem = itemDb.value[targetIndex];
        const newItem = {
          ...oldItem,
          ...result.data.item,
          // Preserve fields that the single-item query does not return
          bartersUsing: oldItem.bartersUsing,
          usedInTasks: oldItem.usedInTasks,
        };

        // Immutable update — replace the array
        const newDb = [...itemDb.value];
        newDb[targetIndex] = newItem;
        itemDb.value = newDb;

        await saveDB(ITEM_DB_CACHE_KEY, {
          timestamp: itemDbLastUpdated.value,
          items: itemDb.value,
        });
      }
    }
  } catch (err) {
    console.error(err);
    alert('価格更新に失敗しました');
  } finally {
    const idx = updatingItemIds.value.indexOf(itemId);
    if (idx > -1) updatingItemIds.value.splice(idx, 1);
  }
}

// ---------------------------------------------------------------------------
// Initialise from cache (called on mount)
// ---------------------------------------------------------------------------

/**
 * Load cached data from IndexedDB on application start.
 * Returns whether an automatic API fetch should follow.
 *
 * @returns {Promise<boolean>} `true` when data is stale and should be fetched
 */
async function initFromCache() {
  // Item DB cache
  const dbCache = await loadDB(ITEM_DB_CACHE_KEY);
  if (dbCache && dbCache.items) {
    console.log(`Loaded Item DB from Cache (${dbCache.items.length} items)`);
    itemDb.value = dbCache.items;
    itemDbLastUpdated.value = dbCache.timestamp || 'Unknown';
  }

  // Main data cache
  const cache = await loadDB(APP_CACHE_KEY);
  let shouldFetch = true;

  if (cache && cache.tasks) {
    console.log('Loaded data from IndexedDB.');
    hideoutData.value = cache.hideoutStations;
    taskData.value = cache.tasks;
    itemsData.value = cache.items || { items: [], maps: [] };
    ammoData.value = cache.ammo || [];
    lastUpdated.value = cache.timestamp;

    const lastTime = cache.lastFetchTime || 0;
    if (Date.now() - lastTime < AUTO_UPDATE_MS) {
      shouldFetch = false;
    }
  }

  return shouldFetch;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useApiData() {
  return {
    // Reactive state
    taskData,
    hideoutData,
    itemsData,
    ammoData,
    itemDb,
    itemDbLoading,
    itemDbLastUpdated,
    updatingItemIds,
    lastUpdated,

    // Fetch methods
    fetchData,
    fetchItemDatabase,
    updateSingleItemPrice,
    initFromCache,

    // Processing (exposed for testing / reuse)
    processTasks,
    processItems,
    processAmmo,

    // Cache keys (useful for watchers that need to clear cache)
    APP_CACHE_KEY,
    ITEM_DB_CACHE_KEY,

    // DB helpers (re-exported for convenience)
    saveDB,
    loadDB,
  };
}
