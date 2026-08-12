// src/composables/useApiData.js
// API data fetching, caching, and processing (singleton)
//
// データソース: tarkov.dev JSON API (https://json.tarkov.dev) が主データソース。
// レガシー GraphQL (メンテナンスモード) は JSON API 失敗時の最終フォールバックとしてのみ使用する。
// 参照: docs/decisions/2026-07-22-tarkov-json-api.md

import { ref, shallowRef } from 'vue';
import { useIndexedDB } from './useStorage.js';
import { API_URL, RATE_LIMIT_MS, AUTO_UPDATE_MS } from '../data/constants.js';
import { getMainQuery, getItemDbQuery } from '../logic/queries.js';
import {
  fetchJsonBundle,
  validateJsonBundle,
  convertMainData,
  convertItemDb,
  validateMainData,
  validateItemDb,
} from '../logic/jsonApiAdapter.js';
import { getTaskMaps } from '../logic/taskLogic.js';
import { normalizeApiLang } from './useAppState.js';

// ---------------------------------------------------------------------------
// IndexedDB instance (shared)
// ---------------------------------------------------------------------------
const { saveDB, updateDB, loadDB } = useIndexedDB();

// ---------------------------------------------------------------------------
// Cache keys
// ---------------------------------------------------------------------------
const APP_CACHE_KEY = 'eft_api_cache_v31_idb';
const ITEM_DB_CACHE_KEY = 'eft_item_db_cache';
const FETCH_COOLDOWN_KEY = 'eft_fetch_cooldowns_v313';

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

/** Formatted timestamp of last main data update */
const lastUpdated = ref(null);

/** Non-blocking warning: network refresh failed but a matching cache is being shown */
const dataWarning = ref(null);

// Share only in-flight downloads. A completed JSON bundle is intentionally not
// retained because it is large; both main data and Item DB are derived before
// the bundle is released.
const bundleRequests = new Map();
const itemDbFallbackRequests = new Map();
const inMemoryAttempts = new Map();

// Guards against an older in-flight mode/language response overwriting a newer one.
let currentMainRequestId = 0;
let currentItemDbRequestId = 0;
let currentInitRequestId = 0;
let activeContextKey = null;
let displayedMainContextKey = null;
let displayedMainFetchTime = 0;
let displayedItemDbContextKey = null;
let displayedItemDbFetchTime = 0;
let legacyMainContextKey = null;
let legacyItemDbContextKey = null;
let mainCacheWriteQueue = Promise.resolve();
let itemDbCacheWriteQueue = Promise.resolve();
let cooldownWriteQueue = Promise.resolve();

function contextKeyFor(mode, lang) {
  return `${mode === 'pvp' ? 'regular' : mode}:${lang}`;
}

function legacyRecordContextKey(record) {
  if (!record || !['pve', 'regular', 'pvp-season', 'pvp'].includes(record.gameMode)) return null;
  if (!['ja', 'en'].includes(record.lang)) return null;
  return contextKeyFor(record.gameMode, record.lang);
}

// ---------------------------------------------------------------------------
// Processing functions (ported from app.js) — unchanged, consume the
// GraphQL-shaped raw data produced either by the JSON adapter or the legacy
// GraphQL fallback.
// ---------------------------------------------------------------------------

/**
 * De-duplicate tasks by stable ID and normalise finishRewards into a flat list.
 * @param {Array} tasks - Raw task array from API
 * @returns {Array} Processed task array
 */
function processTasks(tasks) {
  if (!tasks) return [];

  // Same-name tasks can be distinct branches; only duplicate stable IDs collapse.
  const uniqueTasks = [];
  const seenIds = new Set();
  tasks.forEach((t) => {
    if (!seenIds.has(t.id)) {
      seenIds.add(t.id);
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

    // Derive map labels through the shared task-logic implementation.
    const maps = getTaskMaps(t);
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
          t.taskUnlock = { id: taskReq.stringValue, name: t.taskUnlockName };
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
// GraphQL request / error handling (kept for the bounded fallback path)
// ---------------------------------------------------------------------------

function normalizeGraphQLErrors(errors) {
  const errorList = Array.isArray(errors) ? errors : errors ? [errors] : [];

  return errorList
    .map((error) => {
      if (typeof error === 'string') return error.trim();
      if (error && typeof error.message === 'string') {
        return error.message.trim();
      }
      return '';
    })
    .filter(Boolean)
    .join('; ');
}

function getApiResponseDetail(result) {
  const graphQLError = normalizeGraphQLErrors(result?.errors);
  if (graphQLError) return graphQLError;

  if (typeof result?.message === 'string' && result.message.trim()) {
    return result.message.trim();
  }
  if (typeof result?.error === 'string' && result.error.trim()) {
    return result.error.trim();
  }

  return '';
}

export async function requestGraphQL(query, variables) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let response;
  let responseText;
  try {
    response = await fetch(API_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }), signal: controller.signal,
    });
    // The request is not complete until the body has been read. Retaining the
    // timer here also bounds a response that stalls after sending headers.
    responseText = await response.text();
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('tarkov.dev APIの応答がタイムアウトしました。接続を確認して再試行してください。');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  let result;
  let invalidJson = false;

  if (responseText.trim()) {
    try {
      result = JSON.parse(responseText);
    } catch {
      invalidJson = true;
    }
  }

  const upstreamDetail = invalidJson ? '' : getApiResponseDetail(result);
  const httpDetail = upstreamDetail || response.statusText || '';
  const detailSuffix = httpDetail ? ` 詳細: ${httpDetail}` : '';

  if (!response.ok) {
    if (response.status === 503) {
      throw new Error(
        `tarkov.dev APIが一時的に利用できません (HTTP 503)。しばらく時間をおいて再試行してください。${detailSuffix}`,
      );
    }
    throw new Error(
      `tarkov.dev APIへの接続に失敗しました (HTTP ${response.status})。${detailSuffix}`,
    );
  }

  if (invalidJson) {
    throw new Error(
      'tarkov.dev APIから読み取れない応答を受信しました。しばらく時間をおいて再試行してください。',
    );
  }

  if (!responseText.trim()) {
    throw new Error(
      'tarkov.dev APIから空の応答を受信しました。しばらく時間をおいて再試行してください。',
    );
  }

  const hasGraphQLErrors = Array.isArray(result?.errors)
    ? result.errors.length > 0
    : Boolean(result?.errors);

  if (hasGraphQLErrors) {
    throw new Error(
      `GraphQL Error: ${upstreamDetail || '詳細不明のエラー'}`,
    );
  }

  return result;
}

// ---------------------------------------------------------------------------
// Cooldown tracking (per mode:lang context, persisted so a page reload does
// not reset an in-progress cooldown)
// ---------------------------------------------------------------------------

async function loadCooldowns() {
  try {
    return (await loadDB(FETCH_COOLDOWN_KEY)) || {};
  } catch (error) {
    console.warn('Could not read API cooldown cache', error);
    return {};
  }
}

/** Record an attempt timestamp *before* the network call, so a failed
 *  request still blocks immediate repeated requests. */
async function markAttempt(cooldownKey) {
  const attemptTime = Date.now();
  inMemoryAttempts.set(cooldownKey, attemptTime);
  const operation = cooldownWriteQueue.catch(() => {}).then(async () => {
    try {
      await updateDB(FETCH_COOLDOWN_KEY, (current) => ({
        ...(current || {}),
        [cooldownKey]: attemptTime,
      }));
    } catch (error) {
      // Network use must still work when browser storage is unavailable. The
      // in-memory timestamp continues to enforce the cooldown for this session.
      console.warn('Could not persist API cooldown', error);
    }
  });
  cooldownWriteQueue = operation;
  await operation;
}

async function lastAttemptFor(cooldownKey) {
  const cooldowns = await loadCooldowns();
  return Math.max(
    cooldowns[cooldownKey] || 0,
    inMemoryAttempts.get(cooldownKey) || 0,
  );
}

/** One network batch per mode/language at a time. Main and Item DB callers
 * join the same Promise instead of downloading the seven resources twice. */
function sharedJsonBundle(mode, lang) {
  const contextKey = contextKeyFor(mode, lang);
  const existing = bundleRequests.get(contextKey);
  if (existing) return existing;

  const request = (async () => {
    await markAttempt(contextKey);
    return fetchJsonBundle(mode, lang);
  })();
  bundleRequests.set(contextKey, request);
  const release = () => {
    if (bundleRequests.get(contextKey) === request) {
      bundleRequests.delete(contextKey);
    }
  };
  request.then(release, release);
  return request;
}

/** Share the legacy Item DB fallback within this document. Main-data and
 * item-search callers can reach this path together after the JSON batch fails. */
function sharedGraphqlItemDb(mode, lang) {
  const contextKey = contextKeyFor(mode, lang);
  const existing = itemDbFallbackRequests.get(contextKey);
  if (existing) return existing;

  const { query, variables } = getItemDbQuery(mode, lang);
  const request = requestGraphQL(query, variables);
  itemDbFallbackRequests.set(contextKey, request);
  const release = () => {
    if (itemDbFallbackRequests.get(contextKey) === request) {
      itemDbFallbackRequests.delete(contextKey);
    }
  };
  request.then(release, release);
  return request;
}

// ---------------------------------------------------------------------------
// Main-data cache helpers (per mode:lang context; legacy single-blob records
// remain loadable as a best-effort fallback for whichever context is active)
// ---------------------------------------------------------------------------

function isLegacyMainCache(cache) {
  return !!cache && !cache.contexts && Array.isArray(cache.tasks);
}

function getMainContextRecord(cache, contextKey) {
  if (!cache) return null;
  if (cache.contexts) return cache.contexts[contextKey] || null;
  if (isLegacyMainCache(cache)) {
    const recordedContext = legacyRecordContextKey(cache);
    if (recordedContext && recordedContext !== contextKey) return null;
    if (legacyMainContextKey === null) legacyMainContextKey = recordedContext || contextKey;
    if (legacyMainContextKey === contextKey) return cache;
  }
  return null;
}

function saveMainRecord(contextKey, record) {
  const operation = mainCacheWriteQueue.catch(() => {}).then(async () => {
    await updateDB(APP_CACHE_KEY, (cache) => {
      const contexts = cache?.contexts ? { ...cache.contexts } : {};
      if (isLegacyMainCache(cache) && legacyMainContextKey) {
        contexts[legacyMainContextKey] = cache;
      }
      contexts[contextKey] = record;
      // Keep the latest saved record at the top level for compatibility with
      // earlier readers, while retaining all mode/language contexts.
      return { ...record, contexts };
    });
  });
  mainCacheWriteQueue = operation;
  return operation;
}

function applyMainRecord(record, contextKey) {
  hideoutData.value = record.hideoutStations || [];
  taskData.value = record.tasks || [];
  itemsData.value = record.items || { items: [], maps: [] };
  ammoData.value = record.ammo || [];
  lastUpdated.value = record.timestamp || null;
  displayedMainContextKey = contextKey;
  displayedMainFetchTime = record.lastFetchTime || 0;
}

function clearMainRecord(contextKey) {
  hideoutData.value = [];
  taskData.value = [];
  itemsData.value = { items: [], maps: [] };
  ammoData.value = [];
  lastUpdated.value = null;
  displayedMainContextKey = contextKey;
  displayedMainFetchTime = 0;
}

// ---------------------------------------------------------------------------
// Item DB cache helpers (same per-context / legacy-compatible pattern)
// ---------------------------------------------------------------------------

function isLegacyItemDbCache(cache) {
  return !!cache && !cache.contexts && Array.isArray(cache.items);
}

function getItemDbContextRecord(cache, contextKey) {
  if (!cache) return null;
  if (cache.contexts) return cache.contexts[contextKey] || null;
  if (isLegacyItemDbCache(cache)) {
    const recordedContext = legacyRecordContextKey(cache);
    if (recordedContext && recordedContext !== contextKey) return null;
    if (legacyItemDbContextKey === null) legacyItemDbContextKey = recordedContext || contextKey;
    if (legacyItemDbContextKey === contextKey) return cache;
  }
  return null;
}

function saveItemDbRecord(contextKey, record) {
  const operation = itemDbCacheWriteQueue.catch(() => {}).then(async () => {
    await updateDB(ITEM_DB_CACHE_KEY, (cache) => {
      const contexts = cache?.contexts ? { ...cache.contexts } : {};
      if (isLegacyItemDbCache(cache) && legacyItemDbContextKey) {
        contexts[legacyItemDbContextKey] = cache;
      }
      contexts[contextKey] = record;
      return { ...record, contexts };
    });
  });
  itemDbCacheWriteQueue = operation;
  return operation;
}

function applyItemDbRecord(record, contextKey) {
  itemDb.value = record.items || [];
  itemDbLastUpdated.value = record.timestamp || null;
  displayedItemDbContextKey = contextKey;
  displayedItemDbFetchTime = record.lastFetchTime || 0;
}

function clearItemDbRecord(contextKey) {
  itemDb.value = [];
  itemDbLastUpdated.value = null;
  displayedItemDbContextKey = contextKey;
  displayedItemDbFetchTime = 0;
}

async function persistWithoutBreakingRefresh(label, operation) {
  try {
    await operation();
    return true;
  } catch (error) {
    console.warn(`${label} cache save failed`, error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Fetch: main data
// ---------------------------------------------------------------------------

/**
 * Fetch (or reload from cache) the main API data: tasks, hideout, items, ammo.
 * JSON API is the primary source; the legacy GraphQL query is attempted once
 * as a fallback only after a JSON batch fails. A malformed/incomplete batch
 * never replaces already-visible state or a good cache.
 *
 * @param {string} gameMode - 'pve' | 'regular' | 'pvp-season' (legacy 'pvp' accepted)
 * @param {string} lang     - 'ja' | 'en'
 * @param {boolean} [manual=false] - Whether this is an explicit user-triggered refresh
 * @param {import('vue').Ref<boolean>} isLoading  - shared loading ref
 * @param {import('vue').Ref<string|null>} loadError - shared error ref
 */
async function fetchData(gameMode, lang, manual = false, isLoading, loadError) {
  const mode = gameMode === 'pvp' ? 'regular' : gameMode;
  lang = normalizeApiLang(lang);
  const contextKey = contextKeyFor(mode, lang);
  const requestId = ++currentMainRequestId;
  activeContextKey = contextKey;

  let cache = null;
  try {
    cache = await loadDB(APP_CACHE_KEY);
  } catch (error) {
    console.warn('Could not read main API cache', error);
  }
  if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;

  const cachedRecord = getMainContextRecord(cache, contextKey);
  if (
    cachedRecord &&
    (displayedMainContextKey !== contextKey ||
      (cachedRecord.lastFetchTime || 0) > displayedMainFetchTime)
  ) {
    applyMainRecord(cachedRecord, contextKey);
    dataWarning.value = null;
    if (loadError) loadError.value = null;
  }
  const hasUsableMain =
    Boolean(cachedRecord) ||
    (displayedMainContextKey === contextKey && taskData.value.length > 0);

  const lastAttempt = await lastAttemptFor(contextKey);
  if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;
  const now = Date.now();
  const inFlight = bundleRequests.has(contextKey);

  if (!inFlight && now - lastAttempt < RATE_LIMIT_MS) {
    if (manual) {
      const remainSec = Math.ceil((RATE_LIMIT_MS - (now - lastAttempt)) / 1000);
      const lastSuccess = cachedRecord?.lastFetchTime || 0;
      alert(
        lastSuccess >= lastAttempt
          ? `データは最新です (あと ${remainSec} 秒)。`
          : `データ取得の再試行まであと ${remainSec} 秒です。`,
      );
    }
    if (!hasUsableMain) {
      if (loadError) {
        loadError.value =
          '現在データを取得できません。しばらく時間をおいて再試行してください。';
      }
    }
    return;
  }

  if (isLoading) isLoading.value = true;
  if (loadError) loadError.value = null;
  dataWarning.value = null;

  let jsonErrorMessage = '';

  try {
    const bundle = await sharedJsonBundle(mode, lang);
    validateJsonBundle(bundle);
    const mainData = convertMainData(bundle);
    const convertedItemDb = convertItemDb(bundle);
    validateMainData(mainData);
    validateItemDb(convertedItemDb);
    if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;

    const processedTasks = processTasks(mainData.tasks);
    const processedItems = processItems(mainData.items, mainData.maps);
    const processedAmmo = processAmmo(mainData.ammo, processedTasks);

    const timestamp = new Date().toLocaleString('ja-JP');
    const fetchTime = Date.now();
    const mainRecord = {
      timestamp,
      lastFetchTime: fetchTime,
      hideoutStations: mainData.hideoutStations,
      tasks: processedTasks,
      items: processedItems,
      ammo: processedAmmo,
      gameMode: mode,
      lang,
      source: 'json',
    };
    const itemDbRecord = {
      timestamp,
      lastFetchTime: fetchTime,
      items: convertedItemDb,
      gameMode: mode,
      lang,
      source: 'json',
    };

    applyMainRecord(mainRecord, contextKey);
    // The header refresh owns the newest complete Item DB as well. Invalidate
    // an older item-only request before exposing this result.
    ++currentItemDbRequestId;
    itemDbLoading.value = false;
    applyItemDbRecord(itemDbRecord, contextKey);

    const [mainSaved, itemDbSaved] = await Promise.all([
      persistWithoutBreakingRefresh('Main API', () =>
        saveMainRecord(contextKey, mainRecord),
      ),
      persistWithoutBreakingRefresh('Item DB', () =>
        saveItemDbRecord(contextKey, itemDbRecord),
      ),
    ]);
    if (
      requestId === currentMainRequestId &&
      activeContextKey === contextKey &&
      (!mainSaved || !itemDbSaved)
    ) {
      dataWarning.value =
        'データは更新できましたが、ブラウザへのキャッシュ保存に失敗しました。次回起動時に再取得します。';
    }
  } catch (jsonErr) {
    console.error('JSON API fetch failed, falling back to GraphQL once', jsonErr);
    jsonErrorMessage = jsonErr?.message || 'JSON APIの取得に失敗しました。';
    if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;

    try {
      const { query, variables } = getMainQuery(mode, lang);
      const result = await requestGraphQL(query, variables);
      if (!result.data) throw new Error('No Data');
      validateMainData({
        tasks: result.data.tasks || [],
        hideoutStations: result.data.hideoutStations || [],
        items: result.data.items || [],
        maps: result.data.maps || [],
        ammo: result.data.ammo || [],
      }, { allowLegacyTraderIds: true });
      if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;

      const processedTasks = processTasks(result.data.tasks || []);
      const processedItems = processItems(result.data.items, result.data.maps);
      const processedAmmo = processAmmo(result.data.ammo, processedTasks);

      const timestamp = new Date().toLocaleString('ja-JP');
      const fetchTime = Date.now();
      const mainRecord = {
        timestamp,
        lastFetchTime: fetchTime,
        hideoutStations: result.data.hideoutStations || [],
        tasks: processedTasks,
        items: processedItems,
        ammo: processedAmmo,
        gameMode: mode,
        lang,
        source: 'graphql',
      };
      applyMainRecord(mainRecord, contextKey);
      const mainSaved = await persistWithoutBreakingRefresh('Main API', () =>
        saveMainRecord(contextKey, mainRecord),
      );
      if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;

      let itemDbSaved = true;
      let itemDbFallbackError = null;
      let itemDbAvailable =
        displayedItemDbContextKey === contextKey && itemDb.value.length > 0;

      if (!itemDbAvailable) {
        try {
          const itemResult = await sharedGraphqlItemDb(mode, lang);
          const fallbackItems = itemResult.data?.items || [];
          validateItemDb(fallbackItems);
          if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;

          // A concurrent item-search caller may already have applied the shared
          // response while this continuation was queued.
          itemDbAvailable =
            displayedItemDbContextKey === contextKey && itemDb.value.length > 0;
          if (!itemDbAvailable) {
            const itemDbRecord = {
              timestamp,
              lastFetchTime: fetchTime,
              items: fallbackItems,
              gameMode: mode,
              lang,
              source: 'graphql',
            };
            ++currentItemDbRequestId;
            itemDbLoading.value = false;
            applyItemDbRecord(itemDbRecord, contextKey);
            itemDbSaved = await persistWithoutBreakingRefresh('Item DB', () =>
              saveItemDbRecord(contextKey, itemDbRecord),
            );
            itemDbAvailable = true;
          }
        } catch (error) {
          console.error('GraphQL Item DB fallback failed', error);
          itemDbFallbackError = error;
        }
      }

      if (requestId === currentMainRequestId && activeContextKey === contextKey) {
        if (!mainSaved || !itemDbSaved) {
          dataWarning.value =
            '予備APIからデータを取得できましたが、ブラウザへのキャッシュ保存に失敗しました。';
        } else if (itemDbFallbackError && !itemDbAvailable) {
          dataWarning.value =
            '予備APIから主要データを取得しましたが、アイテム検索データは取得できませんでした。';
        } else {
          dataWarning.value =
            'JSON APIの取得に失敗したため、予備APIから取得したデータを表示しています。';
        }
      }
    } catch (gqlErr) {
      console.error(gqlErr);
      if (requestId !== currentMainRequestId || activeContextKey !== contextKey) return;

      if (hasUsableMain) {
        if (
          cachedRecord &&
          (displayedMainContextKey !== contextKey ||
            (cachedRecord.lastFetchTime || 0) > displayedMainFetchTime)
        ) {
          applyMainRecord(cachedRecord, contextKey);
        }
        dataWarning.value = `最新データの取得に失敗したため、直前に取得済みのデータを表示しています。(${jsonErrorMessage})`;
      } else {
        const fallbackMessage = gqlErr?.message
          ? ` / 予備API: ${gqlErr.message}`
          : '';
        if (loadError) {
          loadError.value = `更新失敗: ${jsonErrorMessage}${fallbackMessage}`;
        }
      }
    }
  } finally {
    if (
      isLoading &&
      requestId === currentMainRequestId &&
      activeContextKey === contextKey
    ) {
      isLoading.value = false;
    }
  }
}

// ---------------------------------------------------------------------------
// Fetch: full item database
// ---------------------------------------------------------------------------

/**
 * Fetch the complete item database for the item-search feature. If a main-data
 * refresh for the same context is in flight, both callers join one JSON batch.
 *
 * @param {string} gameMode
 * @param {string} lang
 * @param {boolean} [forceUpdate=false]
 */
async function fetchItemDatabase(gameMode, lang, forceUpdate = false) {
  if (itemDbLoading.value) return;

  const mode = gameMode === 'pvp' ? 'regular' : gameMode;
  lang = normalizeApiLang(lang);
  const contextKey = contextKeyFor(mode, lang);
  if (
    !forceUpdate &&
    displayedItemDbContextKey === contextKey &&
    itemDb.value.length > 0
  ) {
    return;
  }

  const requestId = ++currentItemDbRequestId;

  let cachedCache = null;
  try {
    cachedCache = await loadDB(ITEM_DB_CACHE_KEY);
  } catch (error) {
    console.warn('Could not read Item DB cache', error);
  }
  if (requestId !== currentItemDbRequestId || activeContextKey !== contextKey) return;

  const cachedRecord = getItemDbContextRecord(cachedCache, contextKey);
  if (
    cachedRecord &&
    (displayedItemDbContextKey !== contextKey ||
      (cachedRecord.lastFetchTime || 0) > displayedItemDbFetchTime)
  ) {
    applyItemDbRecord(cachedRecord, contextKey);
  }
  const hasUsableItemDb =
    Boolean(cachedRecord) ||
    (displayedItemDbContextKey === contextKey && itemDb.value.length > 0);
  if (!forceUpdate && cachedRecord) return;

  const now = Date.now();
  const lastAttempt = await lastAttemptFor(contextKey);
  if (requestId !== currentItemDbRequestId || activeContextKey !== contextKey) return;
  const inFlight = bundleRequests.has(contextKey);

  if (!inFlight && now - lastAttempt < RATE_LIMIT_MS) {
    if (forceUpdate) {
      const remainSec = Math.ceil((RATE_LIMIT_MS - (now - lastAttempt)) / 1000);
      const lastSuccess = cachedRecord?.lastFetchTime || 0;
      alert(
        lastSuccess >= lastAttempt
          ? `アイテムデータは最新です (あと ${remainSec} 秒)。`
          : `アイテムデータ取得の再試行まであと ${remainSec} 秒です。`,
      );
    }
    if (!cachedRecord && itemDb.value.length === 0) {
      dataWarning.value =
        'アイテムデータは現在の更新間隔内です。しばらくしてから再試行してください。';
    }
    return;
  }

  itemDbLoading.value = true;

  try {
    const bundle = await sharedJsonBundle(mode, lang);
    validateJsonBundle(bundle);
    const items = convertItemDb(bundle);
    validateItemDb(items);
    if (requestId !== currentItemDbRequestId || activeContextKey !== contextKey) return;

    const timestamp = new Date().toLocaleString('ja-JP');
    const record = {
      timestamp,
      lastFetchTime: Date.now(),
      items,
      gameMode: mode,
      lang,
      source: 'json',
    };
    applyItemDbRecord(record, contextKey);
    dataWarning.value = null;
    const saved = await persistWithoutBreakingRefresh('Item DB', () =>
      saveItemDbRecord(contextKey, record),
    );
    if (
      !saved &&
      requestId === currentItemDbRequestId &&
      activeContextKey === contextKey
    ) {
      dataWarning.value =
        'アイテムデータは更新できましたが、ブラウザへのキャッシュ保存に失敗しました。';
    }

    if (
      forceUpdate &&
      requestId === currentItemDbRequestId &&
      activeContextKey === contextKey
    ) {
      alert(`アイテムデータを更新しました。\n(${items.length} items)`);
    }
  } catch (jsonErr) {
    console.error('JSON API item DB fetch failed, falling back to GraphQL once', jsonErr);
    if (requestId !== currentItemDbRequestId || activeContextKey !== contextKey) return;

    try {
      const result = await sharedGraphqlItemDb(mode, lang);
      const items = result.data?.items || [];
      validateItemDb(items);
      if (requestId !== currentItemDbRequestId || activeContextKey !== contextKey) return;

      const timestamp = new Date().toLocaleString('ja-JP');
      const record = {
        timestamp,
        lastFetchTime: Date.now(),
        items,
        gameMode: mode,
        lang,
        source: 'graphql',
      };
      applyItemDbRecord(record, contextKey);
      const saved = await persistWithoutBreakingRefresh('Item DB', () =>
        saveItemDbRecord(contextKey, record),
      );
      if (requestId === currentItemDbRequestId && activeContextKey === contextKey) {
        dataWarning.value = saved
          ? 'JSON APIの取得に失敗したため、予備APIから取得したアイテムデータを表示しています。'
          : '予備APIからアイテムデータを取得できましたが、ブラウザへのキャッシュ保存に失敗しました。';
      }

      if (
        forceUpdate &&
        requestId === currentItemDbRequestId &&
        activeContextKey === contextKey
      ) {
        alert(`アイテムデータを更新しました。\n(${items.length} items)`);
      }
    } catch (gqlErr) {
      console.error(gqlErr);
      if (requestId !== currentItemDbRequestId || activeContextKey !== contextKey) return;

      if (hasUsableItemDb) {
        if (
          cachedRecord &&
          (displayedItemDbContextKey !== contextKey ||
            (cachedRecord.lastFetchTime || 0) > displayedItemDbFetchTime)
        ) {
          applyItemDbRecord(cachedRecord, contextKey);
        }
        dataWarning.value = `アイテムデータの更新に失敗したため、直前に取得済みのデータを表示しています。(${jsonErr.message})`;
      } else {
        alert(
          `アイテムデータの取得に失敗しました: ${jsonErr.message}` +
            (gqlErr?.message ? ` / 予備API: ${gqlErr.message}` : ''),
        );
      }
    }
  } finally {
    if (
      requestId === currentItemDbRequestId &&
      activeContextKey === contextKey
    ) {
      itemDbLoading.value = false;
    }
  }
}

// ---------------------------------------------------------------------------
// Initialise from cache (called on mount)
// ---------------------------------------------------------------------------

/**
 * Load cached data from IndexedDB on application start, for the given
 * mode/lang context. Returns whether an automatic API fetch should follow.
 *
 * @param {string} gameMode
 * @param {string} lang
 * @returns {Promise<boolean>} `true` when data is stale/missing and should be fetched
 */
async function initFromCache(gameMode, lang) {
  const mode = gameMode === 'pvp' ? 'regular' : gameMode;
  lang = normalizeApiLang(lang);
  const contextKey = contextKeyFor(mode, lang);
  const initRequestId = ++currentInitRequestId;

  // Invalidate every older response before any asynchronous cache read. This
  // also protects a cache-only context switch where no new fetch follows.
  ++currentMainRequestId;
  ++currentItemDbRequestId;
  activeContextKey = contextKey;
  itemDbLoading.value = false;
  dataWarning.value = null;

  // Never expose records from the previous mode/language while the matching
  // cache is being read. This is especially important for the OBS overlay,
  // whose focused task IDs switch at the same time as the API context.
  clearItemDbRecord(contextKey);
  clearMainRecord(contextKey);

  let dbCache = null;
  let cache = null;
  const [dbCacheResult, mainCacheResult] = await Promise.allSettled([
    loadDB(ITEM_DB_CACHE_KEY),
    loadDB(APP_CACHE_KEY),
  ]);
  if (dbCacheResult.status === 'fulfilled') {
    dbCache = dbCacheResult.value;
  } else {
    console.warn('Could not read Item DB cache during initialization', dbCacheResult.reason);
  }
  if (mainCacheResult.status === 'fulfilled') {
    cache = mainCacheResult.value;
  } else {
    console.warn('Could not read main API cache during initialization', mainCacheResult.reason);
  }
  if (
    initRequestId !== currentInitRequestId ||
    activeContextKey !== contextKey
  ) {
    return false;
  }

  const dbRecord = getItemDbContextRecord(dbCache, contextKey);
  if (dbRecord && dbRecord.items) {
    applyItemDbRecord(dbRecord, contextKey);
  }

  const record = getMainContextRecord(cache, contextKey);
  let shouldFetch = true;

  if (record && record.tasks) {
    applyMainRecord(record, contextKey);
    const lastTime = record.lastFetchTime || 0;
    if (Date.now() - lastTime < AUTO_UPDATE_MS) {
      shouldFetch = false;
    }
  }

  if (
    initRequestId !== currentInitRequestId ||
    activeContextKey !== contextKey
  ) {
    return false;
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
    lastUpdated,
    dataWarning,

    // Fetch methods
    fetchData,
    fetchItemDatabase,
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
    updateDB,
    loadDB,
  };
}
