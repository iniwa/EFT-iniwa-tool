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

/** Game mode: 'pve' | 'pvp' — persisted */
const gameMode = ref(loadLS('eft_gamemode', 'pve'));

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
  };
}
