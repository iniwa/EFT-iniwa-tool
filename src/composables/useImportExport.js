// Import / export user data as JSON (singleton)
import { sanitizeTaskStatuses, sanitizeTraderProgress, useUserProgress } from './useUserProgress.js';
import { useAppState } from './useAppState.js';
import { useApiData } from './useApiData.js';
import { useOverlay } from './useOverlay.js';
import { nextTick } from 'vue';
import { normalizeHideoutAliases, resolveTaskReferences } from '../logic/progressMigration.js';

export const BACKUP_SCHEMA_VERSION = '3.2.1';
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const MODES = new Set(['pve', 'regular', 'pvp-season', 'pvp']);
const SUPPORTED_BACKUP_SCHEMAS = new Set(['3.2.0', BACKUP_SCHEMA_VERSION]);
const forbiddenKey = (key) => key === '__proto__' || key === 'prototype' || key === 'constructor';
const validId = (value) => typeof value === 'string' && value.length > 0 && value.length <= 256 && !forbiddenKey(value);
const plainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
const cloneArray = (value, label) => {
  if (!Array.isArray(value) || !value.every(validId)) throw new Error(`${label}の形式が不正です。`);
  return [...new Set(value)];
};
const safeObject = (value, label) => {
  if (!plainObject(value)) throw new Error(`${label}の形式が不正です。`);
  return Object.entries(value).reduce((result, [key, entry]) => {
    if (!validId(key)) throw new Error(`${label}に不正なキーがあります。`);
    result[key] = entry;
    return result;
  }, Object.create(null));
};

function normalizeMode(value) {
  if (!MODES.has(value)) throw new Error('バックアップのゲームモードが不正です。');
  return value === 'pvp' ? 'regular' : value;
}

function sanitizeHideout(value) {
  const input = safeObject(value, 'ハイドアウト');
  const result = Object.create(null);
  Object.entries(input).forEach(([key, level]) => {
    if (!Number.isInteger(level) || level < 0 || level > 20) throw new Error('ハイドアウトのレベルが不正です。');
    result[key] = level;
  });
  return result;
}

function sanitizeKeyUserData(value) {
  const input = safeObject(value, '鍵メモ');
  const result = Object.create(null);
  Object.entries(input).forEach(([key, entry]) => {
    if (!plainObject(entry) || Object.keys(entry).some(forbiddenKey)) throw new Error('鍵メモの形式が不正です。');
    const next = Object.create(null);
    if ('rating' in entry) {
      if (typeof entry.rating !== 'string' || entry.rating.length > 8) throw new Error('鍵の評価が不正です。');
      next.rating = entry.rating;
    }
    if ('memo' in entry) {
      if (typeof entry.memo !== 'string' || entry.memo.length > 5000) throw new Error('鍵メモが不正です。');
      next.memo = entry.memo;
    }
    result[key] = next;
  });
  return result;
}

function sanitizeStory(value) {
  const chapters = safeObject(value, 'ストーリー進捗');
  const result = Object.create(null);
  Object.entries(chapters).forEach(([chapter, steps]) => {
    const safeSteps = safeObject(steps, 'ストーリー進捗');
    const next = Object.create(null);
    Object.entries(safeSteps).forEach(([step, progress]) => {
      if (!['string', 'number', 'boolean'].includes(typeof progress) || (typeof progress === 'string' && progress.length > 1000) || (typeof progress === 'number' && !Number.isFinite(progress))) throw new Error('ストーリー進捗の値が不正です。');
      next[step] = progress;
    });
    result[chapter] = next;
  });
  return result;
}

function sanitizeCounts(value) {
  const input = safeObject(value, 'オーバーレイ進捗');
  const result = Object.create(null);
  Object.entries(input).forEach(([key, count]) => {
    if (!Number.isInteger(count) || count < 0 || count > 100000) throw new Error('オーバーレイ進捗の値が不正です。');
    if (count > 0) result[key] = count;
  });
  return result;
}

export function validateBackup(payload, { tasks = [], stations = [], currentMode = 'pve' } = {}) {
  if (!plainObject(payload) || Object.keys(payload).some(forbiddenKey)) throw new Error('バックアップの形式が不正です。');
  if (Object.prototype.hasOwnProperty.call(payload, 'schemaVersion')) {
    if (typeof payload.schemaVersion !== 'string' || !SUPPORTED_BACKUP_SCHEMAS.has(payload.schemaVersion)) {
      throw new Error('未対応のバックアップバージョンです。');
    }
  }
  const sourceMode = Object.prototype.hasOwnProperty.call(payload, 'gameMode')
    ? normalizeMode(payload.gameMode)
    : normalizeMode(currentMode);
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);
  const migrateTasks = (values, label) => {
    const list = cloneArray(values, label);
    return resolveTaskReferences(list, tasks);
  };
  const hideout = sanitizeHideout(has('userHideout') ? payload.userHideout : {});
  const normalizedHideout = normalizeHideoutAliases(hideout, stations);
  const statuses = has('taskStatuses') ? sanitizeTaskStatuses(safeObject(payload.taskStatuses, 'タスク状態')) : {};
  if (has('taskStatuses') && Object.keys(statuses).length !== Object.keys(payload.taskStatuses).length) throw new Error('タスク状態の値が不正です。');
  const traders = has('traderProgress') ? sanitizeTraderProgress(safeObject(payload.traderProgress, 'トレーダー進捗')) : {};
  if (has('traderProgress') && Object.keys(traders).length !== Object.keys(payload.traderProgress).length) throw new Error('トレーダー進捗の値が不正です。');
  const completed = has('completedTasks') ? migrateTasks(payload.completedTasks, '完了タスク') : { values: [], warnings: [] };
  const prioritized = has('prioritizedTasks') ? migrateTasks(payload.prioritizedTasks, '優先タスク') : { values: [], warnings: [] };
  const completedTasks = completed.values;
  completedTasks.forEach((id) => delete statuses[id]);
  const result = {
    schemaVersion: payload.schemaVersion || 'legacy', gameMode: sourceMode, userHideout: normalizedHideout,
    completedTasks, collectedItems: has('collectedItems') ? cloneArray(payload.collectedItems, '収集アイテム') : [],
    ownedKeys: has('ownedKeys') ? cloneArray(payload.ownedKeys, '所有鍵') : [],
    keyUserData: has('keyUserData') ? sanitizeKeyUserData(payload.keyUserData) : {},
    playerLevel: has('playerLevel') ? payload.playerLevel : 0,
    prioritizedTasks: prioritized.values,
    wishlist: has('wishlist') ? cloneArray(payload.wishlist, 'ほしい物') : [], taskStatuses: statuses, traderProgress: traders,
    traderRequirementsEnabled: has('traderRequirementsEnabled') ? payload.traderRequirementsEnabled : false,
    storyProgress: has('storyProgress') ? sanitizeStory(payload.storyProgress) : {},
    focusedTaskIds: has('focusedTaskIds') ? cloneArray(payload.focusedTaskIds, 'オーバーレイ固定タスク') : [],
    overlayItemCounts: has('overlayItemCounts') ? sanitizeCounts(payload.overlayItemCounts) : {}, warnings: [...completed.warnings, ...prioritized.warnings],
  };
  if (!Number.isInteger(result.playerLevel) || result.playerLevel < 0 || result.playerLevel > 100) throw new Error('プレイヤーレベルが不正です。');
  if (typeof result.traderRequirementsEnabled !== 'boolean') throw new Error('トレーダー設定が不正です。');
  return result;
}

export function useImportExport() {
  const progress = useUserProgress();
  const { playerLevel, gameMode } = useAppState();
  const { taskData, hideoutData } = useApiData();
  const overlay = useOverlay();
  function exportData() {
    const data = { schemaVersion: BACKUP_SCHEMA_VERSION, gameMode: gameMode.value, userHideout: progress.userHideout.value, completedTasks: progress.completedTasks.value, collectedItems: progress.collectedItems.value, ownedKeys: progress.ownedKeys.value, keyUserData: progress.keyUserData.value, playerLevel: playerLevel.value, prioritizedTasks: progress.prioritizedTasks.value, wishlist: progress.wishlist.value, taskStatuses: progress.taskStatuses.value, traderProgress: progress.traderProgress.value, traderRequirementsEnabled: progress.traderRequirementsEnabled.value, storyProgress: progress.storyProgress.value, focusedTaskIds: overlay.focusedTaskIds.value, overlayItemCounts: overlay.overlayItemCounts.value };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'iniwas_intel_center_backup.json'; a.click(); URL.revokeObjectURL(url);
  }
  async function applyBackup(data) {
    // Switch first so existing mode-swap persistence cannot write this backup into the wrong mode.
    if (gameMode.value !== data.gameMode) {
      gameMode.value = data.gameMode;
      // Mode-scoped watchers must persist/swap the prior mode before this
      // transaction writes imported values into the destination refs.
      await nextTick();
    }
    progress.userHideout.value = data.userHideout; progress.completedTasks.value = data.completedTasks;
    progress.collectedItems.value = data.collectedItems; progress.ownedKeys.value = data.ownedKeys; progress.keyUserData.value = data.keyUserData;
    playerLevel.value = data.playerLevel; progress.prioritizedTasks.value = data.prioritizedTasks; progress.wishlist.value = data.wishlist;
    progress.taskStatuses.value = data.taskStatuses; progress.traderProgress.value = data.traderProgress; progress.traderRequirementsEnabled.value = data.traderRequirementsEnabled;
    progress.storyProgress.value = data.storyProgress; overlay.focusedTaskIds.value = data.focusedTaskIds; overlay.overlayItemCounts.value = data.overlayItemCounts;
  }
  function importData(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'));
      if (Number.isFinite(file.size) && file.size > MAX_BACKUP_BYTES) { const error = new Error('バックアップのサイズが上限を超えています。'); alert(error.message); return reject(error); }
      const reader = new FileReader();
      reader.onload = async (event) => { try { const text = String(event.target?.result || ''); if (text.length > MAX_BACKUP_BYTES) throw new Error('バックアップのサイズが上限を超えています。'); const data = validateBackup(JSON.parse(text), { tasks: taskData.value, stations: hideoutData.value, currentMode: gameMode.value }); await applyBackup(data); alert(data.warnings.length ? `インポート完了\n${data.warnings.join('\n')}` : 'インポート完了'); resolve(data); } catch (error) { alert(`読み込み失敗: ${error.message || '不明なエラー'}`); reject(error); } };
      reader.onerror = () => { alert('読み込み失敗'); reject(reader.error || new Error('読み込み失敗')); }; reader.readAsText(file);
    });
  }
  return { exportData, importData };
}
