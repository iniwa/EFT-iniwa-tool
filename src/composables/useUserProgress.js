// src/composables/useUserProgress.js
// User progress state — all persisted to localStorage (singleton)

import { ref, watch } from 'vue';
import { loadLS, saveLS } from './useStorage.js';

// ---------------------------------------------------------------------------
// Persisted progress refs
// ---------------------------------------------------------------------------

/** Completed task IDs (migrated from task names to IDs) */
const completedTasks = ref(loadLS('eft_tasks', []));

/** Hideout station levels — { stationName: level } */
const userHideout = ref(loadLS('eft_hideout', {}));

/** Collected item UIDs (category_mapName_itemId pattern) */
const collectedItems = ref(loadLS('eft_collected', []));

/** Owned key IDs */
const ownedKeys = ref(loadLS('eft_keys', []));

/** Per-key user metadata — { keyId: { rating, memo } } */
const keyUserData = ref(loadLS('eft_key_user_data', {}));

/** Prioritized task IDs */
const prioritizedTasks = ref(loadLS('eft_prioritized', []));

/** Wishlist item IDs */
const wishlist = ref(loadLS('eft_wishlist', []));

// ---------------------------------------------------------------------------
// Filter / display preferences (also persisted)
// ---------------------------------------------------------------------------

const showCompleted = ref(loadLS('eft_show_completed', false));
const showFuture = ref(loadLS('eft_show_future', false));
const showMaxedHideout = ref(loadLS('eft_show_maxed_hideout', false));
const showKappaOnly = ref(loadLS('eft_show_kappa', false));
const showLightkeeperOnly = ref(loadLS('eft_show_lk', false));
const showStoryTab = ref(loadLS('eft_show_story_tab', true));
const keysViewMode = ref(loadLS('eft_keys_view_mode', 'all'));
const keysSortMode = ref(loadLS('eft_keys_sort_mode', 'map'));
const flowchartTrader = ref(loadLS('eft_flowchart_trader', 'Prapor'));

// ---------------------------------------------------------------------------
// Individual watchers for persistence (one per ref)
// ---------------------------------------------------------------------------

watch(completedTasks, (val) => saveLS('eft_tasks', val), { deep: true });
watch(userHideout, (val) => saveLS('eft_hideout', val), { deep: true });
watch(collectedItems, (val) => saveLS('eft_collected', val), { deep: true });
watch(ownedKeys, (val) => saveLS('eft_keys', val), { deep: true });
watch(keyUserData, (val) => saveLS('eft_key_user_data', val), { deep: true });
watch(prioritizedTasks, (val) => saveLS('eft_prioritized', val), { deep: true });
watch(wishlist, (val) => saveLS('eft_wishlist', val), { deep: true });

watch(showCompleted, (val) => saveLS('eft_show_completed', val));
watch(showFuture, (val) => saveLS('eft_show_future', val));
watch(showMaxedHideout, (val) => saveLS('eft_show_maxed_hideout', val));
watch(showKappaOnly, (val) => saveLS('eft_show_kappa', val));
watch(showLightkeeperOnly, (val) => saveLS('eft_show_lk', val));
watch(showStoryTab, (val) => saveLS('eft_show_story_tab', val));
watch(keysViewMode, (val) => saveLS('eft_keys_view_mode', val));
watch(keysSortMode, (val) => saveLS('eft_keys_sort_mode', val));
watch(flowchartTrader, (val) => saveLS('eft_flowchart_trader', val));

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------

/**
 * Toggle a task's completion status by ID.
 * @param {string} id - Task ID
 */
function toggleTask(id) {
  const idx = completedTasks.value.indexOf(id);
  if (idx > -1) {
    completedTasks.value.splice(idx, 1);
  } else {
    completedTasks.value.push(id);
  }
}

/**
 * Toggle whether a key is marked as owned.
 * @param {string} id - Key item ID
 */
function toggleOwnedKey(id) {
  const idx = ownedKeys.value.indexOf(id);
  if (idx > -1) {
    ownedKeys.value.splice(idx, 1);
  } else {
    ownedKeys.value.push(id);
  }
}

/**
 * Toggle an item's collected status by UID.
 * @param {string} uid - Unique item identifier (category_mapName_itemId)
 */
function toggleCollected(uid) {
  const idx = collectedItems.value.indexOf(uid);
  if (idx > -1) {
    collectedItems.value.splice(idx, 1);
  } else {
    collectedItems.value.push(uid);
  }
}

/**
 * Toggle a task's priority status by ID.
 * @param {string} id - Task ID
 */
function togglePriority(id) {
  const idx = prioritizedTasks.value.indexOf(id);
  if (idx > -1) {
    prioritizedTasks.value.splice(idx, 1);
  } else {
    prioritizedTasks.value.push(id);
  }
}

/**
 * Toggle an item on/off in the wishlist.
 * @param {string} id - Item ID
 */
function toggleWishlist(id) {
  const idx = wishlist.value.indexOf(id);
  if (idx > -1) {
    wishlist.value.splice(idx, 1);
  } else {
    wishlist.value.push(id);
  }
}

/**
 * Update a single field in a key's user data (rating or memo).
 * @param {string} id    - Key item ID
 * @param {string} field - 'rating' | 'memo'
 * @param {*}      value
 */
function updateKeyUserData(id, field, value) {
  if (!keyUserData.value[id]) {
    keyUserData.value[id] = { rating: '-', memo: '' };
  }
  keyUserData.value[id][field] = value;
}

/**
 * Reset selected categories of user data.
 *
 * @param {{ tasks?: boolean, hideout?: boolean, keys?: boolean, items?: boolean, wishlist?: boolean, settings?: boolean }} targets
 * @param {import('vue').ShallowRef<Array>} hideoutData - current hideout station data (needed when resetting hideout)
 */
function resetUserData(targets, hideoutData) {
  if (targets.tasks) {
    completedTasks.value = [];
    prioritizedTasks.value = [];
  }

  if (targets.hideout) {
    const resetHideout = {};
    if (hideoutData?.value) {
      hideoutData.value.forEach((s) => {
        resetHideout[s.normalizedName] = 0;
      });
    }
    userHideout.value = resetHideout;
  }

  if (targets.keys) {
    ownedKeys.value = [];
    keyUserData.value = {};
  }

  if (targets.items) {
    collectedItems.value = [];
  }

  if (targets.wishlist) {
    wishlist.value = [];
  }

  if (targets.settings) {
    localStorage.removeItem('eft_level');
    localStorage.removeItem('eft_gamemode');
    localStorage.removeItem('eft_apilang');
    localStorage.removeItem('eft_show_completed');
    localStorage.removeItem('eft_show_future');
    localStorage.removeItem('eft_show_kappa');
    localStorage.removeItem('eft_show_lk');

    // Reset in-memory values to defaults
    // (import from useAppState is avoided to prevent circular dep —
    //  the caller should handle playerLevel reset via useAppState)
    alert('設定を削除しました。変更を完全に適用するためページをリロードします。');
    location.reload();
  }
}

// ---------------------------------------------------------------------------
// v2 → v3 マイグレーション: タスク名 → タスクID
// ---------------------------------------------------------------------------

const MIGRATION_KEY = 'eft_v3_migrated';

/**
 * v2のタスク名ベースのデータをv3のID ベースに変換する。
 * API取得完了後に一度だけ呼び出す。
 * @param {Array} tasks - taskData（APIから取得したタスク配列）
 */
function migrateFromV2(tasks) {
  if (!tasks || tasks.length === 0) return;
  if (loadLS(MIGRATION_KEY, false)) return; // 変換済み

  // 名前 → ID のマッピングを構築
  const nameToId = new Map();
  tasks.forEach((t) => {
    if (t.name && t.id) nameToId.set(t.name, t.id);
  });

  // タスク名かIDかを判定: tarkov.dev のIDは24文字の16進数
  const isTaskId = (val) => typeof val === 'string' && /^[0-9a-f]{24}$/.test(val);

  // completedTasks の変換
  const oldCompleted = completedTasks.value;
  if (oldCompleted.length > 0 && !isTaskId(oldCompleted[0])) {
    const migrated = [];
    let converted = 0;
    oldCompleted.forEach((name) => {
      const id = nameToId.get(name);
      if (id) {
        migrated.push(id);
        converted++;
      }
    });
    completedTasks.value = migrated;
    console.log(`[Migration] completedTasks: ${converted}/${oldCompleted.length} 件を名前→IDに変換`);
  }

  // prioritizedTasks の変換
  const oldPrioritized = prioritizedTasks.value;
  if (oldPrioritized.length > 0 && !isTaskId(oldPrioritized[0])) {
    const migrated = [];
    let converted = 0;
    oldPrioritized.forEach((name) => {
      const id = nameToId.get(name);
      if (id) {
        migrated.push(id);
        converted++;
      }
    });
    prioritizedTasks.value = migrated;
    console.log(`[Migration] prioritizedTasks: ${converted}/${oldPrioritized.length} 件を名前→IDに変換`);
  }

  // 変換済みフラグを保存
  saveLS(MIGRATION_KEY, true);
}

/**
 * userHideoutのキーをstation.nameからstation.normalizedNameに正規化する。
 * ローカライズ名キーが残っている場合に変換する。データロード時に毎回呼び出して良い（冪等）。
 * @param {Array} hideoutStations - hideoutData（ハイドアウトステーション配列）
 */
function normalizeHideoutKeys(hideoutStations) {
  if (!hideoutStations || hideoutStations.length === 0) return;

  // station.name → station.normalizedName マッピング
  const nameToNormalized = new Map();
  const validNormalized = new Set();
  hideoutStations.forEach((s) => {
    if (s.name && s.normalizedName) nameToNormalized.set(s.name, s.normalizedName);
    if (s.normalizedName) validNormalized.add(s.normalizedName);
  });

  const oldHideout = userHideout.value;
  const keys = Object.keys(oldHideout);
  if (keys.length === 0) return;

  // 全キーが既にnormalizedName形式なら何もしない
  const allNormalized = keys.every((k) => validNormalized.has(k));
  if (allNormalized) return;

  const migrated = {};
  let converted = 0;
  for (const [key, level] of Object.entries(oldHideout)) {
    if (validNormalized.has(key)) {
      // 既にnormalizedName形式
      migrated[key] = level;
    } else {
      const normalized = nameToNormalized.get(key);
      if (normalized) {
        migrated[normalized] = level;
        converted++;
      }
      // マッチしないキーは破棄（別言語の古いデータ）
    }
  }
  if (converted > 0) {
    userHideout.value = migrated;
    console.log(`[normalizeHideoutKeys] ${converted} 件のキーをnormalizedNameに変換`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useUserProgress() {
  return {
    // Progress data
    completedTasks,
    userHideout,
    collectedItems,
    ownedKeys,
    keyUserData,
    prioritizedTasks,
    wishlist,

    // Filter / display preferences
    showCompleted,
    showFuture,
    showMaxedHideout,
    showKappaOnly,
    showLightkeeperOnly,
    showStoryTab,
    keysViewMode,
    keysSortMode,
    flowchartTrader,

    // Methods
    toggleTask,
    toggleOwnedKey,
    toggleCollected,
    togglePriority,
    toggleWishlist,
    updateKeyUserData,
    resetUserData,
    migrateFromV2,
    normalizeHideoutKeys,
  };
}
