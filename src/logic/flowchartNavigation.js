import { getPrerequisiteClosure } from './taskLogic.js'

// Preserve exact API identity: names and generated Mermaid t0 IDs are not route IDs.
export function readFlowchartTaskId(value) {
  if (value == null) return null
  return typeof value === 'string' && value.length > 0 ? value : ''
}

export function getTaskFlowchartScope(id, tasks = []) {
  if (!id || !tasks.some(task => task.id === id)) return []
  const descendants = new Set([id])
  let changed = true
  while (changed) {
    changed = false
    for (const task of tasks) {
      if (!descendants.has(task.id) && task.taskRequirements?.some(req => descendants.has(req?.task?.id))) {
        descendants.add(task.id)
        changed = true
      }
    }
  }
  const scope = new Set(getPrerequisiteClosure([...descendants], tasks))
  return tasks.filter(task => scope.has(task.id))
}
