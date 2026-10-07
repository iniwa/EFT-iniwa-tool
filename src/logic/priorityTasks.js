import { getTaskStatus, calculateShoppingList } from './taskLogic.js'
import { isSameSource } from './shoppingLogic.js'

const KNOWN = ['complete', 'active', 'failed']
const statesFor = req => {
  if (req?.operator || req?.group || req?.groupId || req?.tasks || req?.anyOf || req?.allOf) return null
  const values = req?.status == null || (Array.isArray(req.status) && !req.status.length) ? ['complete'] : req.status
  return Array.isArray(values) && values.every(value => KNOWN.includes(value)) ? [...new Set(values)] : null
}

/** Completion prerequisites only; ambiguous status routes never become mandatory item totals. */
export function planPriorityTasks(tasks = [], prioritized = [], completed = [], statuses = {}) {
  const byId = new Map(tasks.filter(task => task?.id).map(task => [task.id, task]))
  const issues = new Map()
  const report = (kind, ownerId, taskId, allowed = [], path = []) => {
    const key = JSON.stringify([kind, ownerId, taskId, allowed, path])
    issues.set(key, { key, kind, ownerId, taskId, allowed, path })
  }
  const roots = [...new Set(prioritized)].filter(id => {
    if (!byId.has(id)) { report('missing', null, id); return false }
    return getTaskStatus(id, completed, statuses) !== 'complete'
  })
  const discovered = new Set(roots)
  let intersections = new Map()
  // Monotone discovery is bounded by the number of actual tasks, including cycles.
  let changed = true
  while (changed) {
    changed = false
    const demands = new Map(roots.map(id => [id, [new Set(['complete'])]]))
    for (const id of discovered) {
      const task = byId.get(id)
      if (!Array.isArray(task.taskRequirements) && task.taskRequirements != null) { report('unsupported', id, null); continue }
      for (const req of task.taskRequirements || []) {
        const reqId = req?.task?.id, allowed = statesFor(req)
        if (!reqId || !allowed) { report('unsupported', id, reqId || null); continue }
        if (!byId.has(reqId)) { report('missing', id, reqId, allowed); continue }
        if (!demands.has(reqId)) demands.set(reqId, [])
        demands.get(reqId).push(new Set(allowed))
      }
    }
    intersections = new Map([...demands].map(([id, sets]) => [id, [...sets[0]].filter(state => sets.every(set => set.has(state)))]))
    for (const [id, allowed] of intersections) {
      const current = getTaskStatus(id, completed, statuses)
      // Active/complete routes share the same activation prerequisites. Traverse
      // them without treating the bridge task's own handovers as mandatory.
      if (allowed.length && allowed.every(state => ['active', 'complete'].includes(state)) && !allowed.includes(current) && current !== 'complete' && current !== 'failed' && !discovered.has(id)) {
        discovered.add(id); changed = true
      }
    }
  }
  const edges = new Map(), blocked = new Set()
  for (const [id, allowed] of intersections) {
    if (!allowed.length) { blocked.add(id); report('conflict', null, id) }
    if (getTaskStatus(id, completed, statuses) === 'failed' && allowed.length === 1 && allowed[0] === 'complete') {
      blocked.add(id); report('failed', null, id, allowed)
    }
  }
  for (const id of discovered) {
    const next = []
    for (const req of Array.isArray(byId.get(id).taskRequirements) ? byId.get(id).taskRequirements : []) {
      const reqId = req?.task?.id, allowed = statesFor(req)
      if (!allowed || !byId.has(reqId)) continue
      const current = getTaskStatus(reqId, completed, statuses)
      if (allowed.includes(current)) continue
      if (current === 'complete') { report('completed-conflict', id, reqId, allowed); continue }
      const forced = intersections.get(reqId)
      if (forced?.length && forced.every(state => ['active', 'complete'].includes(state)) && !blocked.has(reqId)) next.push(reqId)
      else if (!blocked.has(reqId)) report('alternative', id, reqId, allowed)
    }
    edges.set(id, next)
  }
  const visited = new Set(), visiting = [], cyclic = new Set()
  function findCycles(id) {
    const index = visiting.indexOf(id)
    if (index !== -1) {
      const path = [...visiting.slice(index), id]
      path.forEach(value => cyclic.add(value)); report('cycle', id, id, [], path); return
    }
    if (visited.has(id) || blocked.has(id)) return
    visiting.push(id)
    for (const next of edges.get(id) || []) findCycles(next)
    visiting.pop(); visited.add(id)
  }
  roots.forEach(findCycles)
  const included = new Set(), traversed = new Set()
  function include(id, root = false) {
    if (traversed.has(id) || blocked.has(id) || (!root && cyclic.has(id))) return
    if (getTaskStatus(id, completed, statuses) === 'complete') return
    traversed.add(id)
    const allowed = intersections.get(id)
    if (root || (allowed?.length === 1 && allowed[0] === 'complete')) included.add(id)
    else if (allowed?.length > 1) report('alternative', null, id, allowed)
    if (!cyclic.has(id)) (edges.get(id) || []).forEach(next => include(next))
  }
  roots.forEach(id => include(id, true))
  return {
    goals: roots.map(id => byId.get(id)),
    tasks: [...included].map(id => byId.get(id)),
    issues: [...issues.values()],
  }
}

/** Reuse the existing give-item quantity/FIR/alternative-group rules after task-ID deduplication. */
export function aggregatePriorityTaskItems(tasks, completed) {
  const result = { taskFir: {}, taskNormal: {}, collector: {} }
  const unique = [...new Map(tasks.map(task => [task.id, task])).values()]
  calculateShoppingList(unique, completed, entry => {
    const uid = `${entry.category}_${entry.itemId}`
    const category = result[entry.category]
    const item = category[uid] ||= { id: entry.itemId, uid, name: entry.itemName, count: 0, sources: [], altItems: entry.altItems, wikiLink: entry.wikiLink }
    item.count += entry.count
    let source = item.sources.find(source => isSameSource(source, { taskId: entry.taskId, name: entry.sourceName, type: entry.sourceType }))
    if (!source) { source = { taskId: entry.taskId, name: entry.sourceName, type: entry.sourceType, count: 0, objectives: [] }; item.sources.push(source) }
    source.count += entry.count
    if (entry.objective) source.objectives.push(entry.objective)
  })
  return Object.fromEntries(Object.entries(result).map(([category, items]) => [category, Object.values(items).sort((a, b) => b.count - a.count)]))
}
