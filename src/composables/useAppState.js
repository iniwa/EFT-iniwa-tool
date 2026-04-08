// src/composables/useAppState.js
// App-wide reactive state (singleton)

import { ref, watch } from 'vue';
import { loadLS, saveLS } from './useStorage.js';
import { APP_VERSION } from '../data/constants.js';

// ---------------------------------------------------------------------------
// State — created once, shared across all consumers
// ---------------------------------------------------------------------------

/** Currently active tab */
const currentTab = ref('input');

/** Global loading flag for main data fetch */
const isLoading = ref(false);

/** Human-readable error message when a fetch fails */
const loadError = ref(null);

/** Game mode: 'pve' | 'pvp' — persisted */
const gameMode = ref(loadLS('eft_gamemode', 'pve'));

/** API language: 'ja' | 'en' — persisted */
const apiLang = ref(loadLS('eft_apilang', 'ja'));

/** Player level (0 = ignore level restrictions) — persisted */
const playerLevel = ref(parseInt(loadLS('eft_level', 0), 10));

// ---------------------------------------------------------------------------
// Watchers — individual for each persisted value
// ---------------------------------------------------------------------------

watch(currentTab, (newTab) => {
  if (window.umami?.track) {
    window.umami.track('Tab Switch', { name: newTab });
  }
});

watch(gameMode, (val) => saveLS('eft_gamemode', val));
watch(apiLang, (val) => saveLS('eft_apilang', val));
watch(playerLevel, (val) => saveLS('eft_level', val));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function useAppState() {
  return {
    currentTab,
    isLoading,
    loadError,
    gameMode,
    apiLang,
    playerLevel,
    APP_VERSION,
  };
}
