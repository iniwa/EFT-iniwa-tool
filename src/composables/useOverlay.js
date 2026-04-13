// src/composables/useOverlay.js
// 配信者用オーバーレイ機能の状態管理（singleton）
// - focusedTaskIds: ピン留め中のタスクID配列（モード別）
// - overlayItemCounts: 各objectiveの現在カウント（モード別、キー: `${taskId}__${objectiveIndex}`）
// - overlayEnabled: 機能ON/OFFのグローバルフラグ
// - overlayConfig: 表示カスタマイズ（フォントサイズなど）
//
// BroadcastChannelで別ウィンドウ間（メイン⇔オーバーレイ）にリアルタイム同期。

import { ref, watch } from 'vue';
import { loadLS, saveLS } from './useStorage.js';
import { useAppState } from './useAppState.js';

const { gameMode } = useAppState();

function modeKey(base) {
  return `eft_${gameMode.value}_${base}`;
}

// ---------------------------------------------------------------------------
// Persisted state
// ---------------------------------------------------------------------------

/** ピン留め中のタスクID配列（モード別） */
const focusedTaskIds = ref(loadLS(modeKey('focused_tasks'), []));

/** objectiveごとの現在数 (key: `${taskId}__${objIdx}`) — モード別 */
const overlayItemCounts = ref(loadLS(modeKey('overlay_item_counts'), {}));

/** 機能の有効化フラグ（モード横断） */
const overlayEnabled = ref(loadLS('eft_overlay_enabled', false));

/** 表示カスタマイズ（モード横断） */
const overlayConfig = ref(loadLS('eft_overlay_config', {
  fontSize: 16,
  showTraderIcon: true,
  showObjectives: true,
  showItems: true,
  maxTasks: 5,
  textColor: '#ffffff',
  accentColor: '#ffc107',
  chainMode: false,
}));

// 既存ユーザーの設定にchainModeが無い場合は補完
if (typeof overlayConfig.value.chainMode !== 'boolean') {
  overlayConfig.value = { ...overlayConfig.value, chainMode: false };
}

// ---------------------------------------------------------------------------
// BroadcastChannel for cross-window sync
// ---------------------------------------------------------------------------

const CHANNEL_NAME = 'eft_overlay_sync';
let channel = null;
let isApplyingRemote = false;

function getChannel() {
  if (channel) return channel;
  if (typeof BroadcastChannel === 'undefined') return null;
  channel = new BroadcastChannel(CHANNEL_NAME);
  channel.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg || typeof msg !== 'object') return;
    isApplyingRemote = true;
    try {
      if (msg.type === 'focusedTaskIds') focusedTaskIds.value = msg.payload;
      else if (msg.type === 'overlayItemCounts') overlayItemCounts.value = msg.payload;
      else if (msg.type === 'overlayEnabled') overlayEnabled.value = msg.payload;
      else if (msg.type === 'overlayConfig') overlayConfig.value = msg.payload;
      else if (msg.type === 'gameMode') {
        // 別タブでモード切替が起きた → このタブのデータを再読込
        focusedTaskIds.value = loadLS(`eft_${msg.payload}_focused_tasks`, []);
        overlayItemCounts.value = loadLS(`eft_${msg.payload}_overlay_item_counts`, {});
      }
    } finally {
      isApplyingRemote = false;
    }
  });
  return channel;
}

function broadcast(type, payload) {
  if (isApplyingRemote) return;
  const ch = getChannel();
  if (ch) ch.postMessage({ type, payload });
}

// ---------------------------------------------------------------------------
// Watchers — persistence + broadcast
// ---------------------------------------------------------------------------

// flush: 'sync' で同期発火させ、isApplyingRemote ガードが効くようにする
// (デフォルトの 'pre' だと watch コールバックはマイクロタスク後に動き、
//  リモート適用中フラグが既に false に戻ってしまいフィードバックループが起きる)
watch(focusedTaskIds, (val) => {
  saveLS(modeKey('focused_tasks'), val);
  broadcast('focusedTaskIds', JSON.parse(JSON.stringify(val)));
}, { deep: true, flush: 'sync' });

watch(overlayItemCounts, (val) => {
  saveLS(modeKey('overlay_item_counts'), val);
  broadcast('overlayItemCounts', JSON.parse(JSON.stringify(val)));
}, { deep: true, flush: 'sync' });

watch(overlayEnabled, (val) => {
  saveLS('eft_overlay_enabled', val);
  broadcast('overlayEnabled', val);
}, { flush: 'sync' });

watch(overlayConfig, (val) => {
  saveLS('eft_overlay_config', val);
  broadcast('overlayConfig', JSON.parse(JSON.stringify(val)));
}, { deep: true, flush: 'sync' });

// ゲームモード変更時にスワップ
watch(gameMode, (newMode, oldMode) => {
  saveLS(`eft_${oldMode}_focused_tasks`, focusedTaskIds.value);
  saveLS(`eft_${oldMode}_overlay_item_counts`, overlayItemCounts.value);
  focusedTaskIds.value = loadLS(`eft_${newMode}_focused_tasks`, []);
  overlayItemCounts.value = loadLS(`eft_${newMode}_overlay_item_counts`, {});
  broadcast('gameMode', newMode);
});

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------

function toggleFocusedTask(id) {
  const idx = focusedTaskIds.value.indexOf(id);
  if (idx > -1) {
    focusedTaskIds.value.splice(idx, 1);
  } else {
    focusedTaskIds.value.push(id);
  }
}

function removeFocusedTask(id) {
  const idx = focusedTaskIds.value.indexOf(id);
  if (idx > -1) focusedTaskIds.value.splice(idx, 1);
}

function moveFocusedTask(id, direction) {
  const idx = focusedTaskIds.value.indexOf(id);
  if (idx < 0) return;
  const target = direction === 'up' ? idx - 1 : idx + 1;
  if (target < 0 || target >= focusedTaskIds.value.length) return;
  const arr = [...focusedTaskIds.value];
  [arr[idx], arr[target]] = [arr[target], arr[idx]];
  focusedTaskIds.value = arr;
}

function getObjectiveCount(taskId, objIdx) {
  return overlayItemCounts.value[`${taskId}__${objIdx}`] ?? 0;
}

function setObjectiveCount(taskId, objIdx, count) {
  const key = `${taskId}__${objIdx}`;
  const next = { ...overlayItemCounts.value };
  if (count <= 0) {
    delete next[key];
  } else {
    next[key] = count;
  }
  overlayItemCounts.value = next;
}

function clearAllFocused() {
  focusedTaskIds.value = [];
  overlayItemCounts.value = {};
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useOverlay() {
  // 初回呼び出し時にチャンネルを開く
  getChannel();

  return {
    focusedTaskIds,
    overlayItemCounts,
    overlayEnabled,
    overlayConfig,
    toggleFocusedTask,
    removeFocusedTask,
    moveFocusedTask,
    getObjectiveCount,
    setObjectiveCount,
    clearAllFocused,
  };
}
