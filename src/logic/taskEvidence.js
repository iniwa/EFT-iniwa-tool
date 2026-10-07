// Separate curated requirement; never reinterpret the global-variable predicate.
export const CRISIS_REQUIREMENT_SOURCE = "https://github.com/tarkovtracker-org/tarkov-data-overlay/blob/4f0090d8814d6eaf3b6a53adab1d6750e2a4f2e6/src/overrides/tasks.json5#L466-L480"
export function applyTaskEvidence(task) {
  if (task?.id !== '60e71c48c1bfa3050473b8e5') return task
  const requirements = Array.isArray(task.traderLevelRequirements) ? task.traderLevelRequirements : []
  // Upstream loyalty definitions take precedence. Never overwrite a live gate.
  if (requirements.some(r => r.trader?.id === '54cb57776803fa99248b456e' && !['reputation', 'standing'].includes(r.requirementType))) return task
  return { ...task, traderLevelRequirements: [...requirements, {
    id: 'local-evidence.crisis.therapist.ll4', requirementType: 'level', compareMethod: '>=', value: 4,
    trader: { id: '54cb57776803fa99248b456e', name: 'Therapist' },
    sourceLabel: 'コミュニティ補足・2026-10-07', sourceUrl: CRISIS_REQUIREMENT_SOURCE,
  }] }
}
