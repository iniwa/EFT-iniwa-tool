/** A task name is display text, not an identity: preserve its stable ID. */
export function isSameSource(left, right) {
  if (left?.taskId || right?.taskId) return left?.taskId === right?.taskId && left?.type === right?.type
  return left?.name === right?.name && left?.type === right?.type
}
