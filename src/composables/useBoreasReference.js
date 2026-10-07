import { ref, computed, watch } from 'vue';
import { useAppState } from './useAppState.js';
import { loadLS, saveLS } from './useStorage.js';
import { boreasStorageKey, validateBoreasRecords, RECORDABLE_BOREAS_IDS } from '../logic/boreasReferenceLogic.js';
const { gameMode } = useAppState();
function load(mode) {
  try { return validateBoreasRecords(loadLS(boreasStorageKey(mode), [])); }
  catch { return []; }
}
const recordedObjectiveIds = ref(load(gameMode.value));
// Synchronous, explicit writes: mode switching cannot save the old mode into the new key.
watch(gameMode, mode => { recordedObjectiveIds.value = load(mode); }, { flush: 'sync' });
function replaceRecords(value) {
  recordedObjectiveIds.value = validateBoreasRecords(value);
  saveLS(boreasStorageKey(gameMode.value), recordedObjectiveIds.value);
}
function setRecorded(id, value) {
  if (!RECORDABLE_BOREAS_IDS.has(id) || typeof value !== 'boolean') return;
  const ids = new Set(recordedObjectiveIds.value);
  if (value) ids.add(id); else ids.delete(id);
  replaceRecords([...ids]);
}
const unappliedCount = computed(() => recordedObjectiveIds.value.filter(id => !RECORDABLE_BOREAS_IDS.has(id)).length);
export function useBoreasReference() {
  return { recordedObjectiveIds, unappliedCount, setRecorded, replaceRecords, resetRecords: () => replaceRecords([]) };
}
