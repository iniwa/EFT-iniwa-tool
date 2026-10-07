// No opaque game-variable ID has a verified semantic mapping in this slice.
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
  return {
    label: UNVERIFIED_GLOBAL_CONDITION_LABEL,
    verified: false,
    variableId,
    compareMethod,
    value,
    technical: `変数ID: ${variableId == null ? '不明' : display(variableId)}; 比較: ${compareMethod}; 値: ${display(value)}`,
  }
}
