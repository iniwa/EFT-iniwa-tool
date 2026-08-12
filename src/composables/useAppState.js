// src/composables/useAppState.js
// App-wide reactive state (singleton)

import { ref, watch } from 'vue';
import { loadLS, saveLS } from './useStorage.js';
import { APP_VERSION } from '../data/constants.js';

// ---------------------------------------------------------------------------
// State — created once, shared across all consumers
// ---------------------------------------------------------------------------

/** Global loading flag for main data fetch */
const isLoading = ref(false);

/** Human-readable error message when a fetch fails */
const loadError = ref(null);

// Compatibility migration for releases that persisted normal PvP as `pvp`.
// Keep the source keys recoverable and only fill missing `regular` destinations.
;(function migrateLegacyPvpKeys() {
  if (loadLS('eft_pvp_regular_migrated', false)) return;
  const suffixes = [
    'level',
    'tasks',
    'task_statuses',
    'trader_progress',
    'trader_requirements_enabled',
    'hideout',
    'collected',
    'keys',
    'key_user_data',
    'prioritized',
    'wishlist',
    'story_progress',
    'focused_tasks',
    'overlay_item_counts',
  ];

  try {
    suffixes.forEach((suffix) => {
      const sourceKey = `eft_pvp_${suffix}`;
      const destinationKey = `eft_regular_${suffix}`;
      const sourceValue = localStorage.getItem(sourceKey);
      if (sourceValue !== null && localStorage.getItem(destinationKey) === null) {
        localStorage.setItem(destinationKey, sourceValue);
      }
    });
    saveLS('eft_pvp_regular_migrated', true);
  } catch (error) {
    console.warn('Legacy PvP storage migration failed', error);
  }
})();

/** Game mode: 'pve' | 'regular' | 'pvp-season' — persisted */
function normalizeGameMode(value) {
  if (value === 'pvp') return 'regular';
  return ['pve', 'regular', 'pvp-season'].includes(value) ? value : 'pve';
}
const storedGameMode = loadLS('eft_gamemode', 'pve');
const normalizedGameMode = normalizeGameMode(storedGameMode);
if (storedGameMode !== normalizedGameMode) saveLS('eft_gamemode', normalizedGameMode);
const gameMode = ref(normalizedGameMode);

/** API language: 'ja' | 'en' — persisted */
const apiLang = ref(loadLS('eft_apilang', 'ja'));

// マイグレーション: eft_level → モード別キー（初回のみ）
;(function migrateLevelKey() {
  const raw = localStorage.getItem('eft_level');
  if (raw !== null && localStorage.getItem(`eft_${gameMode.value}_level`) === null) {
    localStorage.setItem(`eft_${gameMode.value}_level`, raw);
  }
})();

/** Player level (0 = ignore level restrictions) — persisted per game mode */
const playerLevel = ref(parseInt(loadLS(`eft_${gameMode.value}_level`, 0), 10));

// ---------------------------------------------------------------------------
// Watchers — individual for each persisted value
// ---------------------------------------------------------------------------

watch(gameMode, (val) => saveLS('eft_gamemode', val));
watch(apiLang, (val) => saveLS('eft_apilang', val));
watch(playerLevel, (val) => saveLS(`eft_${gameMode.value}_level`, val));

// ゲームモード切り替え時にプレイヤーレベルをスワップ
watch(gameMode, (newMode, oldMode) => {
  saveLS(`eft_${oldMode}_level`, playerLevel.value);
  playerLevel.value = parseInt(loadLS(`eft_${newMode}_level`, 0), 10);
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useAppState() {
  return {
    isLoading,
    loadError,
    gameMode,
    apiLang,
    playerLevel,
    APP_VERSION,
    normalizeGameMode,
  };
}
