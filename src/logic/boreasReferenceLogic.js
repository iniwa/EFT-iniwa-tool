import { BOREAS_REFERENCE } from '../data/boreasReference.js';
export const HISTORICAL_BOREAS_IDS = new Set(['69e7871c5088efad039bac2a','69e7888de4ffa7159fc3ec35','69e78b09e728378a9d0f4925']);
export const RECORDABLE_BOREAS_IDS = new Set(BOREAS_REFERENCE.objectives.filter(o => !HISTORICAL_BOREAS_IDS.has(o.id)).map(o => o.id));
export const boreasStorageKey = mode => 'eft_' + mode + '_boreas_reference_v1';
export function validateBoreasRecords(value) {
  if (!Array.isArray(value) || !value.every(id => typeof id === 'string' && /^[a-f0-9]{24}$/.test(id))) throw new Error('Boreas手動記録の形式が不正です。');
  return [...new Set(value)];
}
export function groupBoreasObjectives() {
  const groups = new Map();
  for (const objective of BOREAS_REFERENCE.objectives) {
    if (!groups.has(objective.sourceQuestId)) groups.set(objective.sourceQuestId, []);
    groups.get(objective.sourceQuestId).push(objective);
  }
  return [...groups].map(([sourceQuestId, objectives]) => ({sourceQuestId, objectives}));
}
export function resolveStorySelection(id, chapters) {
  return id === BOREAS_REFERENCE.selectionId || chapters.some(chapter => chapter.id === id) ? id : chapters[0]?.id;
}
