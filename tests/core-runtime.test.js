import assert from 'node:assert/strict';
import test from 'node:test';

const store = new Map();
globalThis.localStorage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
globalThis.BroadcastChannel = undefined;

const { validateBackup, useImportExport } = await import('../src/composables/useImportExport.js');
const { sanitizeTraderProgress, RESET_SETTING_KEYS, clearResetSettings, useUserProgress } = await import('../src/composables/useUserProgress.js');
const { normalizeApiLang } = await import('../src/composables/useAppState.js');
const { useAppState } = await import('../src/composables/useAppState.js');
const { isValidOverlayMessage } = await import('../src/composables/useOverlay.js');
const { resolveTaskReferences, normalizeHideoutAliases } = await import('../src/logic/progressMigration.js');
const { validateMainData } = await import('../src/logic/jsonApiAdapter.js');

const id = '0123456789abcdef01234567';
const valid = () => ({
  schemaVersion: '3.2.1', gameMode: 'pve', userHideout: { Workbench: 2 },
  completedTasks: [id], collectedItems: [], ownedKeys: [], keyUserData: {}, playerLevel: 20,
  prioritizedTasks: [], wishlist: [], taskStatuses: {}, traderProgress: {}, traderRequirementsEnabled: false,
  storyProgress: { chapter: { step: true } }, focusedTaskIds: [id], overlayItemCounts: { [`${id}__0`]: 3 },
});

test('backup validation rejects malformed input before an apply step', () => {
  const data = valid(); data.collectedItems = 'not an array';
  assert.throws(() => validateBackup(data));
  const future = valid(); future.schemaVersion = '99.0.0';
  assert.throws(() => validateBackup(future), /未対応/);
});

test('legacy pvp backup routes to regular and v2 task names migrate', () => {
  const data = valid(); delete data.schemaVersion; data.gameMode = 'pvp'; data.completedTasks = ['Legacy task'];
  const parsed = validateBackup(data, { tasks: [{ id, name: 'Legacy task' }] });
  assert.equal(parsed.gameMode, 'regular');
  assert.deepEqual(parsed.completedTasks, [id]);
});

test('missing legacy mode stays selected; aliases resolve while removed and ambiguous names are retained with warnings', () => {
  const data = valid(); delete data.gameMode; data.completedTasks = [id, 'Legacy task'];
  const parsed = validateBackup(data, { currentMode: 'pvp-season', tasks: [{ id, name: 'Known' }, { id: 'fedcba9876543210fedcba98', name: 'Legacy task' }] });
  assert.equal(parsed.gameMode, 'pvp-season');
  assert.deepEqual(parsed.completedTasks, [id, 'fedcba9876543210fedcba98']);
  data.completedTasks = ['Duplicate', 'Test Drive - Part 1'];
  const retained = validateBackup(data, { tasks: [{ id, name: 'Duplicate' }, { id: 'fedcba9876543210fedcba98', name: 'Duplicate' }] });
  assert.deepEqual(retained.completedTasks, ['Duplicate', 'Test Drive - Part 1']); assert.equal(retained.warnings.length, 2);
});

test('English aliases migrate in Japanese context and hideout aliases normalize without changing display names', () => {
  const result = resolveTaskReferences(['English task'], [{ id, name: '日本語タスク', nameAliases: ['日本語タスク', 'English task'] }]);
  assert.deepEqual(result.values, [id]);
  assert.deepEqual({ ...normalizeHideoutAliases({ Workbench: 2 }, [{ name: 'ワークベンチ', nameAliases: ['ワークベンチ', 'Workbench'], normalizedName: 'Workbench' }]) }, { Workbench: 2 });
  assert.deepEqual({ ...normalizeHideoutAliases({ Workbench: 2, ワークベンチ: 3 }, [{ name: 'ワークベンチ', nameAliases: ['ワークベンチ', 'Workbench'], normalizedName: 'Workbench' }]) }, { Workbench: 3 });
});

test('story and overlay state survive a validated round trip', () => {
  const backup = valid(); backup.schemaVersion = '3.2.0';
  const parsed = validateBackup(backup);
  assert.equal(parsed.storyProgress.chapter.step, true);
  assert.equal(parsed.overlayItemCounts[`${id}__0`], 3);
});

test('language normalization and trader sanitizer reject prototype keys', () => {
  assert.equal(normalizeApiLang('en'), 'en');
  assert.equal(normalizeApiLang('anything'), 'ja');
  const result = sanitizeTraderProgress(JSON.parse('{"__proto__":{"level":4},"safe":{"level":2}}'));
  assert.equal(Object.prototype.hasOwnProperty.call(result, '__proto__'), false);
  assert.equal(result.safe.level, 2);
});

test('reset setting list preserves cooldown and migration markers', () => {
  RESET_SETTING_KEYS.forEach((key) => store.set(key, 'x'));
  store.set('eft_fetch_cooldowns_v313', 'keep'); store.set('eft_mode_data_migrated', 'keep'); store.set('eft_v3_migrated', 'keep');
  clearResetSettings();
  RESET_SETTING_KEYS.forEach((key) => assert.equal(store.has(key), false));
  assert.equal(store.get('eft_fetch_cooldowns_v313'), 'keep');
  assert.equal(store.get('eft_mode_data_migrated'), 'keep'); assert.equal(store.get('eft_v3_migrated'), 'keep');
});

test('automatic v2 migration keeps mixed unresolved references and leaves its marker retryable', () => {
  const progress = useUserProgress();
  store.delete('eft_v3_migrated');
  progress.completedTasks.value = [id, 'Missing task']; progress.prioritizedTasks.value = ['Known task'];
  progress.migrateFromV2([{ id: 'fedcba9876543210fedcba98', name: 'Known task' }]);
  assert.deepEqual(progress.completedTasks.value, [id, 'Missing task']);
  assert.deepEqual(progress.prioritizedTasks.value, ['fedcba9876543210fedcba98']);
  assert.equal(store.has('eft_v3_migrated'), false);
});

test('overlay messages validate mode and payload shape', () => {
  assert.equal(isValidOverlayMessage({ type: 'focusedTaskIds', mode: 'pve', payload: [id] }, 'pve'), true);
  assert.equal(isValidOverlayMessage({ type: 'focusedTaskIds', mode: 'regular', payload: [id] }, 'pve'), false);
  assert.equal(isValidOverlayMessage({ type: 'overlayEnabled', mode: 'regular', payload: true }, 'pve'), true);
  assert.equal(isValidOverlayMessage({ type: 'overlayConfig', mode: 'regular', payload: { maxTasks: 5 } }, 'pve'), true);
  assert.equal(isValidOverlayMessage({ type: 'context', payload: { mode: 'invalid', lang: 'ja' } }, 'pve'), false);
  assert.equal(isValidOverlayMessage({ type: 'overlayItemCounts', mode: 'pve', payload: [] }, 'pve'), false);
});

test('strict JSON validation rejects missing trader IDs while legacy GraphQL shape is accepted', () => {
  const main = { tasks: [{ id, name: 'Task', taskRequirements: [], traderLevelRequirements: [{ trader: { name: 'Trader' } }], otherRequirements: [], neededKeys: [], objectives: [] }], hideoutStations: [{ id: 'station', name: 'Station', levels: [] }], items: [{ id: 'item', name: 'Item', sellFor: [] }], maps: [{ name: 'Map', locks: [] }], ammo: [{ item: { id: 'ammo', name: 'Ammo', buyFor: [], craftsFor: [] } }] };
  assert.throws(() => validateMainData(main));
  assert.equal(validateMainData(main, { allowLegacyTraderIds: true }), true);
});

test('mocked FileReader reports errors atomically and reports retained-name warnings after mode routing', async () => {
  const alerts = []; globalThis.alert = (message) => alerts.push(message);
  class MockFileReader {
    readAsText(file) { this.onload({ target: { result: file.text } }); }
  }
  globalThis.FileReader = MockFileReader;
  const progress = useUserProgress(); const { gameMode } = useAppState(); const { importData } = useImportExport();
  gameMode.value = 'pve'; progress.completedTasks.value = ['before']; progress.wishlist.value = ['wish']; progress.storyProgress.value = { before: { step: true } };
  const before = { tasks: [...progress.completedTasks.value], wishlist: [...progress.wishlist.value], story: JSON.stringify(progress.storyProgress.value), mode: gameMode.value };
  await assert.rejects(importData({ size: 1, text: '{bad' }));
  assert.deepEqual(progress.completedTasks.value, before.tasks); assert.deepEqual(progress.wishlist.value, before.wishlist);
  assert.equal(JSON.stringify(progress.storyProgress.value), before.story); assert.equal(gameMode.value, before.mode);
  assert.match(alerts.at(-1), /^読み込み失敗:/);
  const backup = valid(); backup.gameMode = 'regular'; backup.completedTasks = ['Test Drive - Part 1'];
  await importData({ size: JSON.stringify(backup).length, text: JSON.stringify(backup) });
  assert.equal(gameMode.value, 'regular'); assert.deepEqual(progress.completedTasks.value, ['Test Drive - Part 1']);
  assert.match(alerts.at(-1), /元の値を保持しました/);
});
