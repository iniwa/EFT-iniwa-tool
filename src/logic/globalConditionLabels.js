import { PROGRESSION_CONDITION_LABELS, PROGRESSION_CONDITION_SOURCE } from '../data/progressionConditionLabels.js'
// Qualified community labels are display-only; verified always remains false.
// Do not infer meanings from the task name, ID spelling, comparison or value.
export const UNVERIFIED_GLOBAL_CONDITION_LABEL = 'ゲーム内の追加条件（意味未検証）'

export function describeGlobalVariable(raw) {
  const condition = raw && typeof raw === 'object' ? raw : { id: raw }
  const variableId = condition.variableId ?? condition.id ?? null
  const compareMethod = condition.compareMethod || '>='
  const value = condition.value
  const display = value => {
    if (value === undefined) return '未指定'
    return typeof value === 'object' ? JSON.stringify(value) : String(value)
  }
  const entry = Object.hasOwn(PROGRESSION_CONDITION_LABELS, variableId) ? PROGRESSION_CONDITION_LABELS[variableId] : null
  // Only the observed >= 1..5 threshold family is covered. Scalars, alternate
  // operators, strings and out-of-scope values keep the unknown label.
  const supported = entry && condition.compareMethod === '>=' && Number.isInteger(value) && value >= 1 && value <= 5
  const qualifier = entry?.verification === 'verified' ? 'コミュニティ観測・参考' : '推定・未確定'
  return {
    label: supported ? `${entry.trader} Tier ${entry.tier} のタスク進行条件（${qualifier}・1.1）` : UNVERIFIED_GLOBAL_CONDITION_LABEL,
    ...(supported ? { communityVerification: entry.verification, sourceUrl: PROGRESSION_CONDITION_SOURCE, sourceRevision: entry.revision } : {}),
    verified: false,
    variableId,
    compareMethod,
    value,
    technical: `変数ID: ${variableId == null ? '不明' : display(variableId)}; 比較: ${compareMethod}; 値: ${display(value)}`,
  }
}
