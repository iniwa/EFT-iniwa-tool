// src/composables/useUserProgress.js
// User progress state — all persisted to localStorage (singleton)

import { ref, watch } from 'vue';
import { loadLS, saveLS } from './useStorage.js';
import { useAppState } from './useAppState.js';
import { normalizeHideoutAliases, resolveTaskReferences } from '../logic/progressMigration.js';

// ---------------------------------------------------------------------------
// モード別ストレージ
// ---------------------------------------------------------------------------

const { gameMode } = useAppState();

// User-facing preferences only. API cooldown and migration markers intentionally
// remain so reset cannot cause immediate re-fetch loops or rerun migrations.
export const RESET_SETTING_KEYS = Object.freeze([
  'eft_pve_level', 'eft_regular_level', 'eft_pvp-season_level', 'eft_level',
  'eft_pvp_level',
  'eft_gamemode', 'eft_apilang',
  'eft_show_completed', 'eft_show_future', 'eft_show_maxed_hideout', 'eft_show_kappa', 'eft_show_lk', 'eft_show_story_tab',
  'eft_keys_view_mode', 'eft_keys_sort_mode', 'eft_keys_collapsed_state',
  'eft_flowchart_trader', 'eft_ammo_filters', 'eft_story_selected_chapter', 'memo_accordion_state',
  'eft_overlay_enabled', 'eft_overlay_config',
  'eft_notice_last_seen_version', 'eft_notice_permanently_hidden',
]);

export function clearResetSettings(storage = localStorage) {
  RESET_SETTING_KEYS.forEach((key) => storage.removeItem(key));
}

/** 現在のゲームモードに対応するストレージキーを返す */
function modeKey(base) {
  return `eft_${gameMode.value}_${base}`;
}

export function sanitizeTaskStatuses(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([id, status]) =>
        typeof id === 'string' &&
        id.length > 0 &&
        (status === 'active' || status === 'failed'),
    ),
  );
}

export function sanitizeTraderProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const sanitized = Object.create(null);
  Object.entries(value).forEach(([id, progress]) => {
    if (!safeStorageKey(id) || !progress || typeof progress !== 'object' || Array.isArray(progress)) return;
    const next = Object.create(null);
    const level = Number(progress.level);
    const hasReputation = progress.reputation !== '' && progress.reputation != null;
    const reputation = Number(progress.reputation);
    if (Number.isInteger(level) && level >= 1 && level <= 4) next.level = level;
    if (hasReputation && Number.isFinite(reputation)) next.reputation = reputation;
    if (Object.keys(next).length > 0) sanitized[id] = next;
  });
  return sanitized;
}

function safeStorageKey(value) {
  return typeof value === 'string' && value.length > 0 &&
    value !== '__proto__' && value !== 'prototype' && value !== 'constructor';
}

// マイグレーション: 旧キー → モード別キー（初回のみ）
;(function migrateToModeKeys() {
  if (loadLS('eft_mode_data_migrated', false)) return;
  const mode = gameMode.value;
  const bases = ['tasks', 'hideout', 'collected', 'keys', 'key_user_data', 'prioritized', 'wishlist', 'story_progress', 'task_statuses', 'trader_progress', 'trader_requirements_enabled'];
  bases.forEach((base) => {
    const oldKey = `eft_${base}`;
    const newKey = `eft_${mode}_${base}`;
    const raw = localStorage.getItem(oldKey);
    if (raw !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, raw);
    }
  });
  saveLS('eft_mode_data_migrated', true);
})();

// ---------------------------------------------------------------------------
// Persisted progress refs (per game mode)
// ---------------------------------------------------------------------------

/** Completed task IDs (migrated from task names to IDs) */
const completedTasks = ref(loadLS(modeKey('tasks'), []));
const taskStatuses = ref(sanitizeTaskStatuses(loadLS(modeKey('task_statuses'), {})));
const traderProgress = ref(sanitizeTraderProgress(loadLS(modeKey('trader_progress'), {})));
const traderRequirementsEnabled = ref(
  loadLS(modeKey('trader_requirements_enabled'), false) === true,
);

/** Hideout station levels — { stationName: level } */
const userHideout = ref(loadLS(modeKey('hideout'), {}));

/** Collected item UIDs (category_mapName_itemId pattern) */
const collectedItems = ref(loadLS(modeKey('collected'), []));

/** Owned key IDs */
const ownedKeys = ref(loadLS(modeKey('keys'), []));

/** Per-key user metadata — { keyId: { rating, memo } } */
const keyUserData = ref(loadLS(modeKey('key_user_data'), {}));

/** Prioritized task IDs */
const prioritizedTasks = ref(loadLS(modeKey('prioritized'), []));

/** Wishlist item IDs */
const wishlist = ref(loadLS(modeKey('wishlist'), []));

/** Story chapter progress — { chapterId: { stepId: value } } */
const storyProgress = ref(loadLS(modeKey('story_progress'), {}));

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

watch(completedTasks, (val) => saveLS(modeKey('tasks'), val), { deep: true });
watch(taskStatuses, (val) => saveLS(modeKey('task_statuses'), val), { deep: true });
watch(traderProgress, (val) => saveLS(modeKey('trader_progress'), val), { deep: true });
watch(traderRequirementsEnabled, (val) => saveLS(modeKey('trader_requirements_enabled'), val));
watch(userHideout, (val) => saveLS(modeKey('hideout'), val), { deep: true });
watch(collectedItems, (val) => saveLS(modeKey('collected'), val), { deep: true });
watch(ownedKeys, (val) => saveLS(modeKey('keys'), val), { deep: true });
watch(keyUserData, (val) => saveLS(modeKey('key_user_data'), val), { deep: true });
watch(prioritizedTasks, (val) => saveLS(modeKey('prioritized'), val), { deep: true });
watch(wishlist, (val) => saveLS(modeKey('wishlist'), val), { deep: true });
watch(storyProgress, (val) => saveLS(modeKey('story_progress'), val), { deep: true });

// ゲームモード切り替え時にプログレスデータをスワップ
watch(gameMode, (newMode, oldMode) => {
  // 現在のデータを旧モードキーに保存
  saveLS(`eft_${oldMode}_tasks`, completedTasks.value);
  saveLS(`eft_${oldMode}_task_statuses`, taskStatuses.value);
  saveLS(`eft_${oldMode}_trader_progress`, traderProgress.value);
  saveLS(`eft_${oldMode}_trader_requirements_enabled`, traderRequirementsEnabled.value);
  saveLS(`eft_${oldMode}_hideout`, userHideout.value);
  saveLS(`eft_${oldMode}_collected`, collectedItems.value);
  saveLS(`eft_${oldMode}_keys`, ownedKeys.value);
  saveLS(`eft_${oldMode}_key_user_data`, keyUserData.value);
  saveLS(`eft_${oldMode}_prioritized`, prioritizedTasks.value);
  saveLS(`eft_${oldMode}_wishlist`, wishlist.value);
  saveLS(`eft_${oldMode}_story_progress`, storyProgress.value);

  // 新モードのデータを読み込み
  completedTasks.value = loadLS(`eft_${newMode}_tasks`, []);
  taskStatuses.value = sanitizeTaskStatuses(loadLS(`eft_${newMode}_task_statuses`, {}));
  traderProgress.value = sanitizeTraderProgress(loadLS(`eft_${newMode}_trader_progress`, {}));
  traderRequirementsEnabled.value =
    loadLS(`eft_${newMode}_trader_requirements_enabled`, false) === true;
  userHideout.value = loadLS(`eft_${newMode}_hideout`, {});
  collectedItems.value = loadLS(`eft_${newMode}_collected`, []);
  ownedKeys.value = loadLS(`eft_${newMode}_keys`, []);
  keyUserData.value = loadLS(`eft_${newMode}_key_user_data`, {});
  prioritizedTasks.value = loadLS(`eft_${newMode}_prioritized`, []);
  wishlist.value = loadLS(`eft_${newMode}_wishlist`, []);
  storyProgress.value = loadLS(`eft_${newMode}_story_progress`, {});
});

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
    delete taskStatuses.value[id];
  }
}

function getTaskStatus(id) {
  if (completedTasks.value.includes(id)) return 'complete';
  return taskStatuses.value[id] === 'active' || taskStatuses.value[id] === 'failed'
    ? taskStatuses.value[id]
    : 'unstarted';
}

function setTaskStatus(id, status) {
  const allowed = ['unstarted', 'active', 'failed', 'complete'];
  if (!allowed.includes(status)) return;
  if (status === 'complete') {
    if (!completedTasks.value.includes(id)) completedTasks.value.push(id);
    delete taskStatuses.value[id];
  } else {
    completedTasks.value = completedTasks.value.filter((x) => x !== id);
    if (status === 'unstarted') delete taskStatuses.value[id];
    else taskStatuses.value[id] = status;
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
 * Update a story step's progress value.
 * @param {string} chapterId
 * @param {string} stepId
 * @param {*} value
 */
function updateStoryProgress(chapterId, stepId, value) {
  if (!storyProgress.value[chapterId]) {
    storyProgress.value[chapterId] = {};
  }
  storyProgress.value[chapterId][stepId] = value;
}

/**
 * Reset selected categories of user data.
 *
 * @param {{ tasks?: boolean, hideout?: boolean, keys?: boolean, items?: boolean, wishlist?: boolean, story?: boolean, settings?: boolean }} targets
 * @param {import('vue').ShallowRef<Array>} hideoutData - current hideout station data (needed when resetting hideout)
 */
function resetUserData(targets, hideoutData) {
  if (targets.tasks) {
    completedTasks.value = [];
    prioritizedTasks.value = [];
    taskStatuses.value = {};
    traderProgress.value = {};
    traderRequirementsEnabled.value = false;
    saveLS(modeKey('tasks'), []);
    saveLS(modeKey('prioritized'), []);
    saveLS(modeKey('task_statuses'), {});
    saveLS(modeKey('trader_progress'), {});
    saveLS(modeKey('trader_requirements_enabled'), false);
  }

  if (targets.hideout) {
    const resetHideout = {};
    if (hideoutData?.value) {
      hideoutData.value.forEach((s) => {
        resetHideout[s.normalizedName] = 0;
      });
    }
    userHideout.value = resetHideout;
    saveLS(modeKey('hideout'), resetHideout);
  }

  if (targets.keys) {
    ownedKeys.value = [];
    keyUserData.value = {};
    saveLS(modeKey('keys'), []);
    saveLS(modeKey('key_user_data'), {});
  }

  if (targets.items) {
    collectedItems.value = [];
    saveLS(modeKey('collected'), []);
  }

  if (targets.wishlist) {
    wishlist.value = [];
    saveLS(modeKey('wishlist'), []);
  }

  if (targets.story) {
    storyProgress.value = {};
    saveLS(modeKey('story_progress'), {});
  }

  if (targets.settings) {
    clearResetSettings();

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

  const completed = resolveTaskReferences(completedTasks.value, tasks);
  const prioritized = resolveTaskReferences(prioritizedTasks.value, tasks);
  if (JSON.stringify(completed.values) !== JSON.stringify(completedTasks.value)) completedTasks.value = completed.values;
  if (JSON.stringify(prioritized.values) !== JSON.stringify(prioritizedTasks.value)) prioritizedTasks.value = prioritized.values;
  if (completed.complete && prioritized.complete) saveLS(MIGRATION_KEY, true);
}

/**
 * userHideoutのキーをstation.nameからstation.normalizedNameに正規化する。
 * ローカライズ名キーが残っている場合に変換する。データロード時に毎回呼び出して良い（冪等）。
 * @param {Array} hideoutStations - hideoutData（ハイドアウトステーション配列）
 */
function normalizeHideoutKeys(hideoutStations) {
  if (!hideoutStations || hideoutStations.length === 0) return;

  const validNormalized = new Set();
  hideoutStations.forEach((s) => {
    if (s.normalizedName) validNormalized.add(s.normalizedName);
  });

  const oldHideout = userHideout.value;
  const keys = Object.keys(oldHideout);
  if (keys.length === 0) return;

  // 全キーが既にnormalizedName形式なら何もしない
  const allNormalized = keys.every((k) => validNormalized.has(k));
  if (allNormalized) return;

  const migrated = normalizeHideoutAliases(oldHideout, hideoutStations);
  if (JSON.stringify(migrated) !== JSON.stringify(oldHideout)) {
    userHideout.value = migrated;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useUserProgress() {
  return {
    // Progress data
    completedTasks,
    taskStatuses,
    traderProgress,
    traderRequirementsEnabled,
    userHideout,
    collectedItems,
    ownedKeys,
    keyUserData,
    prioritizedTasks,
    wishlist,
    storyProgress,

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
    getTaskStatus,
    setTaskStatus,
    toggleOwnedKey,
    toggleCollected,
    togglePriority,
    toggleWishlist,
    updateKeyUserData,
    updateStoryProgress,
    resetUserData,
    migrateFromV2,
    normalizeHideoutKeys,
  };
}
