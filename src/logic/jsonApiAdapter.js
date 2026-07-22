// src/logic/jsonApiAdapter.js
// tarkov.dev JSON API (https://json.tarkov.dev) からのデータ取得と、
// 既存の GraphQL 形状 (useApiData.js の processTasks/processItems/processAmmo や
// ItemSearch.vue が期待する形) への変換を行う。
//
// 参照: docs/decisions/2026-07-22-tarkov-json-api.md
//       docs/handoffs/2026-07-22-json-api-migration.md

import { JSON_API_URL } from '../data/constants.js';

// ---------------------------------------------------------------------------
// 低レベル fetch
// ---------------------------------------------------------------------------

async function fetchJsonPath(path) {
  const response = await fetch(`${JSON_API_URL}${path}`, {
    cache: 'no-cache',
    headers: { Accept: 'application/json' },
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`JSON API HTTP ${response.status}: ${path}`);
  }

  let parsed;
  try {
    parsed = text.trim() ? JSON.parse(text) : null;
  } catch {
    throw new Error(`JSON APIから不正な応答を受信しました: ${path}`);
  }

  if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) {
    throw new Error(`JSON API応答の形式が不正です: ${path}`);
  }

  return parsed.data;
}

/** 翻訳辞書 (lang + en フォールバック) を取得する。lang==='en' の場合は en のみ。 */
async function fetchDicts(mode, resource, lang) {
  const [langDict, enDict] = await Promise.all([
    fetchJsonPath(`/${mode}/${resource}_${lang}`),
    lang === 'en' ? Promise.resolve(null) : fetchJsonPath(`/${mode}/${resource}_en`),
  ]);
  return { langDict: langDict || {}, enDict: enDict || {} };
}

/** トークン文字列を lang 辞書 → en 辞書 → トークン自身の順で解決する。 */
function tr(token, langDict, enDict) {
  if (token === undefined || token === null) return token;
  if (langDict && Object.prototype.hasOwnProperty.call(langDict, token)) {
    return langDict[token];
  }
  if (enDict && Object.prototype.hasOwnProperty.call(enDict, token)) {
    return enDict[token];
  }
  return token;
}

// ---------------------------------------------------------------------------
// バンドル取得: 1回の更新で必要な生データを丸ごと取得する
// ---------------------------------------------------------------------------

/**
 * メインデータとアイテムDBの両方を構築するのに必要な生データを一括取得する。
 * @param {string} mode - 'regular' | 'pve'
 * @param {string} lang - 'ja' | 'en'
 * @returns {Promise<object>} bundle
 */
export async function fetchJsonBundle(mode, lang) {
  const [
    tasksData,
    hideoutData,
    itemsData,
    mapsData,
    tradersData,
    craftsData,
    bartersData,
    tasksDicts,
    hideoutDicts,
    itemsDicts,
    mapsDicts,
    tradersDicts,
  ] = await Promise.all([
    fetchJsonPath(`/${mode}/tasks`),
    fetchJsonPath(`/${mode}/hideout`),
    fetchJsonPath(`/${mode}/items`),
    fetchJsonPath(`/${mode}/maps`),
    fetchJsonPath(`/${mode}/traders`),
    fetchJsonPath(`/${mode}/crafts`),
    fetchJsonPath(`/${mode}/barters`),
    fetchDicts(mode, 'tasks', lang),
    fetchDicts(mode, 'hideout', lang),
    fetchDicts(mode, 'items', lang),
    fetchDicts(mode, 'maps', lang),
    fetchDicts(mode, 'traders', lang),
  ]);

  return {
    mode,
    lang,
    tasksRaw: tasksData.tasks || {},
    questItemsRaw: tasksData.questItems || {},
    tasksDict: tasksDicts.langDict,
    tasksEnDict: tasksDicts.enDict,
    hideoutRaw: hideoutData || {},
    hideoutDict: hideoutDicts.langDict,
    hideoutEnDict: hideoutDicts.enDict,
    itemsRaw: itemsData.items || {},
    itemsDict: itemsDicts.langDict,
    itemsEnDict: itemsDicts.enDict,
    mapsRaw: (mapsData && mapsData.maps) || {},
    mapsDict: mapsDicts.langDict,
    mapsEnDict: mapsDicts.enDict,
    tradersRaw: tradersData || {},
    tradersDict: tradersDicts.langDict,
    tradersEnDict: tradersDicts.enDict,
    craftsRaw: craftsData || {},
    bartersRaw: bartersData || {},
  };
}

// ---------------------------------------------------------------------------
// 共有ルックアップ構築 (純粋関数: bundle -> lookup maps)
// ---------------------------------------------------------------------------

function buildItemNameLookup(bundle) {
  const { itemsRaw, itemsDict, itemsEnDict, questItemsRaw, tasksDict, tasksEnDict } = bundle;
  const nameById = {};

  Object.values(itemsRaw).forEach((raw) => {
    nameById[raw.id] = {
      id: raw.id,
      name: tr(raw.name, itemsDict, itemsEnDict),
      shortName: tr(raw.shortName, itemsDict, itemsEnDict),
      normalizedName: raw.normalizedName,
      wikiLink: raw.wikiLink,
      image512pxLink: raw.image512pxLink,
      iconLink: raw.iconLink,
    };
  });

  // クエストアイテムも同じID空間で参照されるため合成する
  Object.values(questItemsRaw).forEach((raw) => {
    if (nameById[raw.id]) return;
    nameById[raw.id] = {
      id: raw.id,
      name: tr(raw.name, tasksDict, tasksEnDict),
      shortName: tr(raw.shortName, tasksDict, tasksEnDict),
      normalizedName: raw.normalizedName,
      wikiLink: null,
      image512pxLink: raw.image512pxLink,
      iconLink: raw.iconLink,
    };
  });

  return nameById;
}

function buildTraderLookup(bundle) {
  const { tradersRaw, tradersDict, tradersEnDict } = bundle;
  const byId = {};
  Object.values(tradersRaw).forEach((raw) => {
    byId[raw.id] = {
      id: raw.id,
      name: tr(raw.name, tradersDict, tradersEnDict),
      normalizedName: raw.normalizedName,
      imageLink: raw.imageLink,
    };
  });
  return byId;
}

function buildStationLookup(bundle) {
  const { hideoutRaw, hideoutDict, hideoutEnDict } = bundle;
  const byId = {};
  Object.values(hideoutRaw).forEach((raw) => {
    byId[raw.id] = {
      id: raw.id,
      name: tr(raw.name, hideoutDict, hideoutEnDict),
      normalizedName: raw.normalizedName,
    };
  });
  return byId;
}

function buildMapLookup(bundle) {
  const { mapsRaw, mapsDict, mapsEnDict } = bundle;
  const byId = {};
  Object.values(mapsRaw).forEach((raw) => {
    byId[raw.id] = { id: raw.id, name: tr(raw.name, mapsDict, mapsEnDict) };
  });
  return byId;
}

function itemRef(id, itemsById, fallbackName = 'Unknown Item') {
  const found = itemsById[id];
  return { id, name: found ? found.name : fallbackName };
}

function itemDetailRef(id, itemsById, fallbackName = 'Unknown Item') {
  const found = itemsById[id];
  return {
    id,
    name: found ? found.name : fallbackName,
    shortName: found ? found.shortName : null,
    normalizedName: found ? found.normalizedName : null,
    wikiLink: found ? found.wikiLink : null,
    iconLink: found ? found.iconLink : null,
    image512pxLink: found ? found.image512pxLink : null,
  };
}

function convertAttributes(attributes) {
  return Object.entries(attributes || {}).map(([name, value]) => ({
    name,
    type: name,
    value,
  }));
}

function craftRewardEntries(craft) {
  if (Array.isArray(craft.rewardItems) && craft.rewardItems.length > 0) {
    return craft.rewardItems;
  }
  return craft.productItem ? [craft.productItem] : [];
}

// ---------------------------------------------------------------------------
// メインデータ変換 (tasks / hideoutStations / items+maps / ammo)
// 出力は useApiData.js の processTasks / processItems / processAmmo が
// そのまま消費できる、既存 GraphQL クエリ相当の形状にする。
// ---------------------------------------------------------------------------

function convertObjective(obj, itemsById, mapsById, tasksDict, tasksEnDict) {
  const base = {
    id: obj.id,
    description: tr(obj.description, tasksDict, tasksEnDict),
    type: obj.type,
    maps: (obj.maps || [])
      .map((mapId) => mapsById[mapId])
      .filter(Boolean)
      .map((map) => ({ id: map.id, name: map.name })),
  };

  // `item` is currently used by buildWeapon objectives. The legacy GraphQL
  // query intentionally did not expose it as an `items` objective because the
  // configured weapon requirements must remain visible in the description.
  const itemIds = obj.items || null;
  if (itemIds) {
    base.count = obj.count;
    base.foundInRaid = !!obj.foundInRaid;
    base.items = itemIds.map((id) => itemRef(id, itemsById));
  }

  if (obj.type === 'shoot') {
    base.count = obj.count;
    base.target = (obj.targetNames || [])
      .map((target) => tr(target, tasksDict, tasksEnDict))
      .join(', ');
    base.bodyParts = (obj.bodyParts || []).map((part) =>
      tr(part, tasksDict, tasksEnDict),
    );
  }

  if (obj.type === 'mark' && obj.markerItem) {
    base.markerItem = itemRef(obj.markerItem, itemsById);
  }

  if (obj.count !== undefined && base.count === undefined) {
    base.count = obj.count;
  }

  return base;
}

function convertFinishRewards(raw, itemsById, tradersById, stationsById) {
  const items = (raw?.items || []).map((e) => ({
    count: e.count,
    item: itemRef(e.item, itemsById),
  }));

  const offerUnlock = (raw?.offerUnlock || [])
    .filter((e) => e.item && e.trader)
    .map((e) => ({
      level: e.level,
      trader: {
        id: e.trader,
        name: tradersById[e.trader]?.name || 'Unknown',
      },
      item: itemRef(e.item, itemsById),
    }));

  const craftUnlock = (raw?.craftUnlock || []).map((e) => ({
    level: e.level,
    station: {
      id: e.station,
      name: stationsById[e.station]?.name || 'Unknown',
    },
    rewardItems: e.item
      ? [{ item: itemRef(e.item, itemsById), count: e.count }]
      : [],
  }));

  return { items, offerUnlock, craftUnlock };
}

/**
 * メインデータ (tasks / hideoutStations / items&maps / ammo) を構築する。
 * @param {object} bundle - fetchJsonBundle() の戻り値
 * @returns {{ tasks: Array, hideoutStations: Array, items: Array, maps: Array, ammo: Array }}
 */
export function convertMainData(bundle) {
  const { tasksRaw, tasksDict, tasksEnDict, hideoutRaw, itemsRaw, mapsRaw, craftsRaw } = bundle;
  const itemsById = buildItemNameLookup(bundle);
  const tradersById = buildTraderLookup(bundle);
  const stationsById = buildStationLookup(bundle);
  const mapsById = buildMapLookup(bundle);
  const taskNamesById = Object.fromEntries(
    Object.values(tasksRaw).map((task) => [
      task.id,
      tr(task.name, tasksDict, tasksEnDict),
    ]),
  );

  // --- tasks ---
  const tasks = Object.values(tasksRaw).map((raw) => ({
    id: raw.id,
    name: tr(raw.name, tasksDict, tasksEnDict),
    minPlayerLevel: raw.minPlayerLevel || 0,
    wikiLink: raw.wikiLink,
    trader: raw.trader
      ? {
          id: raw.trader,
          name: tradersById[raw.trader]?.name || 'Unknown',
          normalizedName: tradersById[raw.trader]?.normalizedName || null,
          imageLink: tradersById[raw.trader]?.imageLink || null,
        }
      : null,
    map: raw.map
      ? { id: raw.map, name: mapsById[raw.map]?.name || null }
      : null,
    neededKeys: (raw.neededKeys || []).map((group) => ({
      map: group.map
        ? { id: group.map, name: mapsById[group.map]?.name || null }
        : null,
      keys: (group.keys || []).map((keyId) =>
        itemDetailRef(keyId, itemsById, 'Unknown Key'),
      ),
    })),
    taskRequirements: (raw.taskRequirements || []).map((r) => ({
      ...r,
      task: { id: r.task, name: taskNamesById[r.task] || 'Unknown Task' },
    })),
    traderLevelRequirements: (raw.traderRequirements || []).map((r) => ({
      ...r,
      // GraphQL exposed `level` as an alias of the JSON `value` field.
      level: r.level ?? r.value,
    })),
    kappaRequired: !!raw.kappaRequired,
    lightkeeperRequired: !!raw.lightkeeperRequired,
    objectives: (raw.objectives || []).map((o) =>
      convertObjective(o, itemsById, mapsById, tasksDict, tasksEnDict),
    ),
    finishRewards: convertFinishRewards(raw.finishRewards, itemsById, tradersById, stationsById),
  }));

  // --- hideoutStations ---
  const hideoutStations = Object.values(hideoutRaw).map((raw) => ({
    id: raw.id,
    name: stationsById[raw.id]?.name || raw.normalizedName,
    normalizedName: raw.normalizedName,
    levels: (raw.levels || []).map((lvl) => ({
      id: lvl.id,
      level: lvl.level,
      constructionTime: lvl.constructionTime,
      itemRequirements: (lvl.itemRequirements || []).map((req) => ({
        count: req.count,
        item: itemRef(req.item, itemsById),
        attributes: convertAttributes(req.attributes),
      })),
      traderRequirements: (lvl.traderRequirements || []).map((req) => ({
        trader: {
          id: req.trader,
          name: tradersById[req.trader]?.name || 'Unknown',
        },
        value: req.value,
        requirementType: req.requirementType,
        compareMethod: req.compareMethod,
      })),
      stationLevelRequirements: (lvl.stationLevelRequirements || []).map((req) => ({
        station: {
          id: req.station,
          name: stationsById[req.station]?.name || 'Unknown',
          normalizedName: stationsById[req.station]?.normalizedName || null,
        },
        level: req.level,
      })),
    })),
  }));

  // --- items + maps (for processItems: key -> map lookup, item.types) ---
  const rawItems = Object.values(itemsRaw).map((raw) => {
    const converted = itemsById[raw.id];
    return {
      id: raw.id,
      name: converted.name,
      shortName: converted.shortName,
      normalizedName: raw.normalizedName,
      wikiLink: raw.wikiLink,
      image512pxLink: raw.image512pxLink,
      sellFor: (raw.sellToTrader || []).map((s) => ({
        price: s.price,
        priceRUB: s.priceRUB,
        currency: s.currency,
        vendor: {
          id: s.trader,
          name: tradersById[s.trader]?.name || 'Unknown',
          normalizedName: tradersById[s.trader]?.normalizedName,
        },
      })),
      containsItems: (raw.containsItems || []).map((entry) => ({
        ...entry,
        item: { id: entry.item },
      })),
      types: raw.types || [],
    };
  });

  const rawMaps = Object.values(mapsRaw).map((raw) => ({
    name: mapsById[raw.id]?.name || raw.normalizedName,
    locks: (raw.locks || [])
      .filter((lock) => lock.key)
      .map((lock) => ({ key: { id: lock.key } })),
  }));

  // --- ammo (official BSG ammo category; omit BB/projectile-only entries
  //     without ballistic properties because the chart cannot represent them) ---
  const AMMO_CATEGORY_ID = '5485a8684bdc2da71d8b4567';
  const BB_ITEM_ID = '6241c316234b593b5676b637';
  const craftsByProductItem = {};
  Object.values(craftsRaw).forEach((c) => {
    craftRewardEntries(c).forEach((reward) => {
      const targetId = reward?.item;
      if (!targetId) return;
      if (!craftsByProductItem[targetId]) craftsByProductItem[targetId] = [];
      craftsByProductItem[targetId].push(c);
    });
  });

  const ammo = Object.values(itemsRaw)
    .filter(
      (raw) =>
        raw.id !== BB_ITEM_ID &&
        raw.categories?.includes(AMMO_CATEGORY_ID) &&
        raw.properties,
    )
    .map((raw) => {
      const p = raw.properties;
      const converted = itemsById[raw.id];

      const buyFor = (raw.buyFromTrader || []).map((b) => {
        const requirements = [{ type: 'loyaltyLevel', value: b.minTraderLevel }];
        if (b.taskUnlock) requirements.push({ type: 'questCompleted', stringValue: b.taskUnlock });
        return {
          priceRUB: b.priceRUB,
          vendor: {
            id: b.trader,
            name: tradersById[b.trader]?.name || 'Unknown',
          },
          requirements,
        };
      });

      const craftsFor = (craftsByProductItem[raw.id] || []).map((c) => ({
        station: {
          id: c.station,
          name: stationsById[c.station]?.name || 'Unknown',
        },
        level: c.level,
        duration: c.duration,
        requiredItems: (c.requiredItems || []).map((ri) => ({
          count: ri.count,
          item: itemRef(ri.item, itemsById),
          attributes: convertAttributes(ri.attributes),
        })),
        rewardItems: craftRewardEntries(c).map((reward) => ({
          count: reward.count,
          item: itemRef(reward.item, itemsById),
        })),
        taskUnlock: c.taskUnlock
          ? {
              id: c.taskUnlock,
              name: taskNamesById[c.taskUnlock] || 'Unknown Task',
            }
          : null,
      }));

      return {
        item: {
          id: raw.id,
          name: converted.name,
          shortName: converted.shortName,
          description: converted.name ? tr(raw.description, bundle.itemsDict, bundle.itemsEnDict) : '',
          wikiLink: raw.wikiLink,
          image512pxLink: raw.image512pxLink,
          buyFor,
          craftsFor,
        },
        caliber: p.caliber,
        damage: p.damage,
        penetrationPower: p.penetrationPower,
        armorDamage: p.armorDamage,
        fragmentationChance: p.fragmentationChance,
        projectileSpeed: p.initialSpeed,
        projectileCount: p.projectileCount,
        staminaBurnPerDamage: p.staminaBurnPerDamage,
        accuracyModifier: p.accuracyModifier,
        recoilModifier: p.recoilModifier,
        lightBleedModifier: p.lightBleedModifier,
        heavyBleedModifier: p.heavyBleedModifier,
        ricochetChance: p.ricochetChance,
        ammoType: p.ammoType,
        tracer: p.tracer,
      };
    });

  return { tasks, hideoutStations, items: rawItems, maps: rawMaps, ammo };
}

// ---------------------------------------------------------------------------
// アイテムDB変換 (ItemSearch.vue が消費する最終形)
// ---------------------------------------------------------------------------

/**
 * アイテム検索用のフルデータベースを構築する。
 * @param {object} bundle - fetchJsonBundle() の戻り値
 * @returns {Array} ItemSearch.vue が期待する item 配列
 */
export function convertItemDb(bundle) {
  const { itemsRaw, tasksRaw, craftsRaw, bartersRaw } = bundle;
  const itemsById = buildItemNameLookup(bundle);
  const tradersById = buildTraderLookup(bundle);
  const stationsById = buildStationLookup(bundle);
  const taskNamesById = Object.fromEntries(
    Object.values(tasksRaw).map((task) => [
      task.id,
      tr(task.name, bundle.tasksDict, bundle.tasksEnDict),
    ]),
  );

  const usedInTasksByItem = {};

  function collectKnownItemIds(value, target) {
    if (typeof value === 'string') {
      if (itemsRaw[value]) target.add(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => collectKnownItemIds(entry, target));
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (typeof value.id === 'string' && itemsRaw[value.id]) {
      target.add(value.id);
    }
    if (typeof value.item === 'string' && itemsRaw[value.item]) {
      target.add(value.item);
    }
  }

  Object.values(tasksRaw).forEach((task) => {
    const taskName = tr(task.name, bundle.tasksDict, bundle.tasksEnDict);
    const seenItems = new Set();
    (task.objectives || []).forEach((obj) => {
      // Include positive item requirements/restrictions. `notWearing` and
      // category-only fields are deliberately excluded.
      [
        obj.items,
        obj.item,
        obj.markerItem,
        obj.containsOne,
        obj.containsAll,
        obj.useAny,
        obj.wearing,
        obj.usingWeapon,
        obj.usingWeaponMods,
        obj.requiredKeys,
      ].forEach((value) => collectKnownItemIds(value, seenItems));
    });
    (task.neededKeys || []).forEach((group) =>
      collectKnownItemIds(group.keys, seenItems),
    );
    seenItems.forEach((id) => {
      if (!usedInTasksByItem[id]) usedInTasksByItem[id] = [];
      usedInTasksByItem[id].push({ name: taskName });
    });
  });

  function itemNameIcon(id) {
    const found = itemsById[id];
    return {
      id,
      name: found ? found.name : 'Unknown Item',
      iconLink: found ? found.iconLink : null,
    };
  }

  function relationItem(entry) {
    return {
      count: entry.count,
      item: itemNameIcon(entry.item),
    };
  }

  function barterRelation(barter) {
    const trader = tradersById[barter.trader];
    return {
      trader: {
        id: barter.trader,
        name: trader?.name || 'Unknown',
        normalizedName: trader?.normalizedName || null,
      },
      level: barter.minTraderLevel,
      taskUnlock: barter.taskUnlock
        ? {
            id: barter.taskUnlock,
            name: taskNamesById[barter.taskUnlock] || 'Unknown Task',
          }
        : null,
      rewardItems: barter.offeredItem
        ? [relationItem(barter.offeredItem)]
        : [],
      requiredItems: (barter.requiredItems || []).map(relationItem),
    };
  }

  function craftRelation(craft) {
    const station = stationsById[craft.station];
    return {
      station: {
        id: craft.station,
        name: station?.name || 'Unknown',
        normalizedName: station?.normalizedName || null,
      },
      level: craft.level,
      duration: craft.duration,
      taskUnlock: craft.taskUnlock
        ? {
            id: craft.taskUnlock,
            name: taskNamesById[craft.taskUnlock] || 'Unknown Task',
          }
        : null,
      rewardItems: craftRewardEntries(craft).map(relationItem),
      requiredItems: (craft.requiredItems || []).map(relationItem),
    };
  }

  const bartersForByItem = {};
  const bartersUsingByItem = {};
  Object.values(bartersRaw).forEach((barter) => {
    if (!barter.offeredItem) return;

    const targetId = barter.offeredItem.item;
    if (!bartersForByItem[targetId]) bartersForByItem[targetId] = [];
    bartersForByItem[targetId].push(barterRelation(barter));

    (barter.requiredItems || []).forEach((ri) => {
      if (!bartersUsingByItem[ri.item]) bartersUsingByItem[ri.item] = [];
      // Build a fresh DTO for every item relation so nested arrays/objects are
      // never shared between search-result rows.
      bartersUsingByItem[ri.item].push(barterRelation(barter));
    });
  });

  const craftsForByItem = {};
  const craftsUsingByItem = {};
  Object.values(craftsRaw).forEach((craft) => {
    const rewards = craftRewardEntries(craft);
    if (rewards.length === 0) return;

    rewards.forEach((reward) => {
      if (!craftsForByItem[reward.item]) craftsForByItem[reward.item] = [];
      craftsForByItem[reward.item].push(craftRelation(craft));
    });

    (craft.requiredItems || []).forEach((ri) => {
      if (!craftsUsingByItem[ri.item]) craftsUsingByItem[ri.item] = [];
      craftsUsingByItem[ri.item].push(craftRelation(craft));
    });
  });

  return Object.values(itemsRaw).map((raw) => {
    const converted = itemsById[raw.id];
    return {
      id: raw.id,
      name: converted.name,
      shortName: converted.shortName,
      normalizedName: raw.normalizedName,
      iconLink: raw.iconLink,
      wikiLink: raw.wikiLink,
      avg24hPrice: raw.avg24hPrice,
      sellFor: (raw.sellToTrader || []).map((s) => ({
        price: s.price,
        currency: s.currency,
        priceRUB: s.priceRUB,
        vendor: {
          id: s.trader,
          name: tradersById[s.trader]?.name || 'Unknown',
          normalizedName: tradersById[s.trader]?.normalizedName || null,
        },
      })),
      buyFor: (raw.buyFromTrader || []).map((b) => {
        const requirements = [
          { type: 'loyaltyLevel', value: b.minTraderLevel },
        ];
        if (b.taskUnlock) {
          requirements.push({
            type: 'questCompleted',
            stringValue: b.taskUnlock,
          });
        }
        return {
          vendor: {
            id: b.trader,
            name: tradersById[b.trader]?.name || 'Unknown',
            normalizedName: tradersById[b.trader]?.normalizedName || null,
          },
          price: b.price,
          priceRUB: b.priceRUB,
          currency: b.currency,
          requirements,
        };
      }),
      bartersFor: bartersForByItem[raw.id] || [],
      craftsFor: craftsForByItem[raw.id] || [],
      usedInTasks: usedInTasksByItem[raw.id] || [],
      bartersUsing: bartersUsingByItem[raw.id] || [],
      craftsUsing: craftsUsingByItem[raw.id] || [],
    };
  });
}

// ---------------------------------------------------------------------------
// バリデーション: 不完全なバッチが表示状態/キャッシュを壊さないようにする
// ---------------------------------------------------------------------------

function nonEmptyRecord(value) {
  return value && typeof value === 'object' && Object.keys(value).length > 0;
}

function unresolvedName(value) {
  return (
    !value ||
    value === 'Unknown' ||
    value === 'Unknown Item' ||
    value === 'Unknown Key' ||
    value === 'Unknown Task'
  );
}

function assertNamedItem(entry, label) {
  if (!entry?.item?.id || unresolvedName(entry.item.name)) {
    throw new Error(`${label}に未解決のアイテム参照があります。`);
  }
}

/**
 * 取得したJSONバッチ自体を検証する。リソースの一部だけが空、または主要な
 * 外部キーが解決できない応答は変換・保存しない。
 */
export function validateJsonBundle(bundle) {
  if (!bundle || typeof bundle !== 'object') {
    throw new Error('JSON APIバッチが空です。');
  }

  const requiredRecords = [
    ['タスク', bundle.tasksRaw],
    ['ハイドアウト', bundle.hideoutRaw],
    ['アイテム', bundle.itemsRaw],
    ['マップ', bundle.mapsRaw],
    ['トレーダー', bundle.tradersRaw],
    ['クラフト', bundle.craftsRaw],
    ['バーター', bundle.bartersRaw],
  ];
  requiredRecords.forEach(([label, value]) => {
    if (!nonEmptyRecord(value)) {
      throw new Error(`${label}のJSONリソースが空です。`);
    }
  });

  const requiredDictionaries = [
    ['タスク', bundle.tasksDict, bundle.tasksEnDict],
    ['ハイドアウト', bundle.hideoutDict, bundle.hideoutEnDict],
    ['アイテム', bundle.itemsDict, bundle.itemsEnDict],
    ['マップ', bundle.mapsDict, bundle.mapsEnDict],
    ['トレーダー', bundle.tradersDict, bundle.tradersEnDict],
  ];
  requiredDictionaries.forEach(([label, primary, fallback]) => {
    if (!nonEmptyRecord(primary) && !nonEmptyRecord(fallback)) {
      throw new Error(`${label}の翻訳リソースが空です。`);
    }
  });

  const tasks = bundle.tasksRaw;
  const items = { ...bundle.itemsRaw, ...(bundle.questItemsRaw || {}) };
  const maps = bundle.mapsRaw;
  const traders = bundle.tradersRaw;
  const stations = bundle.hideoutRaw;

  const requireRef = (collection, id, label) => {
    if (id && !collection[id]) {
      throw new Error(`${label}に未解決の参照 (${id}) があります。`);
    }
  };
  const visitItemRefs = (value, label) => {
    if (typeof value === 'string') {
      requireRef(items, value, label);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => visitItemRefs(entry, label));
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (typeof value.id === 'string') requireRef(items, value.id, label);
    if (typeof value.item === 'string') requireRef(items, value.item, label);
  };

  Object.values(tasks).forEach((task) => {
    requireRef(traders, task.trader, `タスク ${task.id}`);
    requireRef(maps, task.map, `タスク ${task.id}`);
    (task.taskRequirements || []).forEach((requirement) =>
      requireRef(tasks, requirement.task, `タスク ${task.id}`),
    );
    (task.neededKeys || []).forEach((group) => {
      requireRef(maps, group.map, `タスク ${task.id} の必要鍵`);
      visitItemRefs(group.keys, `タスク ${task.id} の必要鍵`);
    });
    (task.objectives || []).forEach((objective) => {
      (objective.maps || []).forEach((mapId) =>
        requireRef(maps, mapId, `タスク ${task.id} の目標`),
      );
      [
        objective.items,
        objective.item,
        objective.markerItem,
        objective.containsOne,
        objective.containsAll,
        objective.useAny,
        objective.wearing,
        objective.notWearing,
        objective.usingWeapon,
        objective.usingWeaponMods,
        objective.requiredKeys,
      ].forEach((value) => visitItemRefs(value, `タスク ${task.id} の目標`));
    });
    (task.finishRewards?.items || []).forEach((reward) =>
      requireRef(items, reward.item, `タスク ${task.id} の報酬`),
    );
    (task.finishRewards?.offerUnlock || []).forEach((unlock) => {
      requireRef(items, unlock.item, `タスク ${task.id} の販売解除`);
      requireRef(traders, unlock.trader, `タスク ${task.id} の販売解除`);
    });
    (task.finishRewards?.craftUnlock || []).forEach((unlock) => {
      requireRef(items, unlock.item, `タスク ${task.id} のクラフト解除`);
      requireRef(stations, unlock.station, `タスク ${task.id} のクラフト解除`);
    });
  });

  Object.values(stations).forEach((station) => {
    (station.levels || []).forEach((level) => {
      (level.itemRequirements || []).forEach((requirement) =>
        requireRef(items, requirement.item, `ハイドアウト ${station.id}`),
      );
      (level.traderRequirements || []).forEach((requirement) =>
        requireRef(traders, requirement.trader, `ハイドアウト ${station.id}`),
      );
      (level.stationLevelRequirements || []).forEach((requirement) =>
        requireRef(stations, requirement.station, `ハイドアウト ${station.id}`),
      );
    });
  });

  Object.values(bundle.craftsRaw).forEach((craft) => {
    requireRef(stations, craft.station, `クラフト ${craft.id}`);
    requireRef(tasks, craft.taskUnlock, `クラフト ${craft.id}`);
    (craft.requiredItems || []).forEach((entry) =>
      requireRef(items, entry.item, `クラフト ${craft.id}`),
    );
    const rewards = craftRewardEntries(craft);
    if (rewards.length === 0) {
      throw new Error(`クラフト ${craft.id} に成果物がありません。`);
    }
    rewards.forEach((entry) =>
      requireRef(items, entry.item, `クラフト ${craft.id}`),
    );
  });

  Object.values(bundle.bartersRaw).forEach((barter) => {
    requireRef(traders, barter.trader, `バーター ${barter.id}`);
    requireRef(tasks, barter.taskUnlock, `バーター ${barter.id}`);
    if (!barter.offeredItem) {
      throw new Error(`バーター ${barter.id} に交換対象がありません。`);
    }
    requireRef(items, barter.offeredItem.item, `バーター ${barter.id}`);
    (barter.requiredItems || []).forEach((entry) =>
      requireRef(items, entry.item, `バーター ${barter.id}`),
    );
  });

  Object.values(bundle.itemsRaw).forEach((item) => {
    (item.containsItems || []).forEach((entry) =>
      requireRef(items, entry.item, `アイテム ${item.id} の内容物`),
    );
    (item.buyFromTrader || []).forEach((offer) => {
      requireRef(traders, offer.trader, `アイテム ${item.id} の購入元`);
      requireRef(tasks, offer.taskUnlock, `アイテム ${item.id} の購入条件`);
    });
    (item.sellToTrader || []).forEach((offer) =>
      requireRef(traders, offer.trader, `アイテム ${item.id} の売却先`),
    );
  });

  Object.values(maps).forEach((map) => {
    (map.locks || []).forEach((lock) =>
      requireRef(items, lock.key, `マップ ${map.id} の鍵`),
    );
  });

  return true;
}

export function validateMainData(mainData) {
  if (!mainData) throw new Error('メインデータの変換結果が空です。');
  const { tasks, hideoutStations, items, maps, ammo } = mainData;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error('タスクデータが空です。');
  }
  if (!Array.isArray(hideoutStations) || hideoutStations.length === 0) {
    throw new Error('ハイドアウトデータが空です。');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('アイテムデータが空です。');
  }
  if (!Array.isArray(maps) || maps.length === 0) {
    throw new Error('マップデータが空です。');
  }
  if (!Array.isArray(ammo) || ammo.length === 0) {
    throw new Error('弾薬データが空です。');
  }

  const brokenTask = tasks.find(
    (task) =>
      !task.id ||
      !task.name ||
      (task.trader && unresolvedName(task.trader.name)) ||
      (task.taskRequirements || []).some(
        (requirement) =>
          !requirement.task?.id || unresolvedName(requirement.task.name),
      ) ||
      (task.neededKeys || []).some((group) =>
        (group.keys || []).some(
          (key) => !key.id || unresolvedName(key.name),
        ),
      ) ||
      (task.objectives || []).some((objective) =>
        (objective.items || []).some(
          (item) => !item.id || unresolvedName(item.name),
        ),
      ),
  );
  if (brokenTask) throw new Error('タスクデータに不正なレコードが含まれています。');

  const brokenStation = hideoutStations.find(
    (station) =>
      !station.id ||
      !station.name ||
      (station.levels || []).some(
        (level) =>
          (level.itemRequirements || []).some(
            (requirement) =>
              !requirement.item?.id || unresolvedName(requirement.item.name),
          ) ||
          (level.traderRequirements || []).some((requirement) =>
            unresolvedName(requirement.trader?.name),
          ) ||
          (level.stationLevelRequirements || []).some((requirement) =>
            unresolvedName(requirement.station?.name),
          ),
      ),
  );
  if (brokenStation) {
    throw new Error('ハイドアウトデータに不正なレコードが含まれています。');
  }

  const brokenItem = items.find(
    (item) =>
      !item.id ||
      !item.name ||
      (item.sellFor || []).some((offer) =>
        unresolvedName(offer.vendor?.name),
      ),
  );
  if (brokenItem) throw new Error('アイテムデータに不正なレコードが含まれています。');

  const brokenMap = maps.find(
    (map) =>
      !map.name ||
      (map.locks || []).some((lock) => !lock.key?.id),
  );
  if (brokenMap) throw new Error('マップデータに不正なレコードが含まれています。');

  const brokenAmmo = ammo.find(
    (entry) =>
      !entry.item?.id ||
      unresolvedName(entry.item.name) ||
      (entry.item.buyFor || []).some((offer) =>
        unresolvedName(offer.vendor?.name),
      ) ||
      (entry.item.craftsFor || []).some(
        (craft) =>
          unresolvedName(craft.station?.name) ||
          (craft.requiredItems || []).some((item) => {
            try {
              assertNamedItem(item, '弾薬クラフト');
              return false;
            } catch {
              return true;
            }
          }),
      ),
  );
  if (brokenAmmo) throw new Error('弾薬データに不正なレコードが含まれています。');

  return true;
}

export function validateItemDb(itemDb) {
  if (!Array.isArray(itemDb) || itemDb.length === 0) {
    throw new Error('アイテムデータベースが空です。');
  }
  const relationIsBroken = (relation, stationBased) => {
    if (
      stationBased
        ? unresolvedName(relation.station?.name)
        : unresolvedName(relation.trader?.name)
    ) {
      return true;
    }
    if (!Array.isArray(relation.rewardItems) || relation.rewardItems.length === 0) {
      return true;
    }
    return [...relation.rewardItems, ...(relation.requiredItems || [])].some(
      (entry) => !entry.item?.id || unresolvedName(entry.item.name),
    );
  };

  const broken = itemDb.find(
    (item) =>
      !item.id ||
      !item.name ||
      (item.sellFor || []).some((offer) =>
        unresolvedName(offer.vendor?.name),
      ) ||
      (item.buyFor || []).some((offer) =>
        unresolvedName(offer.vendor?.name),
      ) ||
      (item.bartersFor || []).some((relation) =>
        relationIsBroken(relation, false),
      ) ||
      (item.bartersUsing || []).some((relation) =>
        relationIsBroken(relation, false),
      ) ||
      (item.craftsFor || []).some((relation) =>
        relationIsBroken(relation, true),
      ) ||
      (item.craftsUsing || []).some((relation) =>
        relationIsBroken(relation, true),
      ) ||
      (item.usedInTasks || []).some((task) => !task.name),
  );
  if (broken) throw new Error('アイテムデータベースに不正なレコードが含まれています。');
  return true;
}
