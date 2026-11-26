import { describeGlobalVariable, UNVERIFIED_GLOBAL_CONDITION_LABEL } from './globalConditionLabels.js'
/** Return scrollable stage bounds from the measured SVG, without arbitrary margins. */
export function getZoomedStageBounds(width, height, zoom = 1) {
  const factor = Number.isFinite(zoom) && zoom > 0 ? zoom : 1
  return {
    width: Math.max(1, Math.ceil((Number(width) || 0) * factor)),
    height: Math.max(1, Math.ceil((Number(height) || 0) * factor)),
  }
}

const finite = (value) => Number.isFinite(Number(value)) ? Number(value) : null
const compare = (value) => value || '>='

export function formatDelaySeconds(value) {
  const seconds = finite(value)
  if (seconds == null || seconds <= 0) return ''
  if (seconds % 86400 === 0) return `${seconds / 86400}日`
  if (seconds % 3600 === 0) return `${seconds / 3600}時間`
  if (seconds % 60 === 0) return `${seconds / 60}分`
  return `${seconds}秒`
}

/** Format a Mermaid dotted edge. Labels belong between `-.` and `.->`. */
export function formatMermaidDottedEdge(fromId, toId, label = '') {
  if (!fromId || !toId) return ''
  const text = String(label || '').trim()
  return text
    ? `  ${fromId} -. ${text} .-> ${toId}\n`
    : `  ${fromId} -.-> ${toId}\n`
}

function getTraderRequirements(task) {
  const requirements = task.traderLevelRequirements ?? task.traderRequirements
  return Array.isArray(requirements) ? requirements : []
}

const loyaltyComparisons = { '>=': '以上', '>': '超', '<=': '以下', '<': '未満', '=': '', '==': '' }

function isLoyaltyRequirement(requirement) {
  return !!requirement && (!requirement.requirementType || requirement.requirementType === 'level')
}

/** Unlock stages are layout hints. Unmapped counters and upper limits carry no rank. */
function getFlowchartUnlockGroups(tasks) {
  const groups = new Map()
  for (const task of tasks) {
    let ll = 0
    let clears = 0
    for (const requirement of getTraderRequirements(task)) {
      if (!isLoyaltyRequirement(requirement)) continue
      const level = Number(requirement.value ?? requirement.level)
      const op = compare(requirement.compareMethod)
      const minimum = op === '>' ? level + 1 : level
      if (['>=', '>', '=', '=='].includes(op) && Number.isInteger(level) && level >= 1 && minimum <= 4) {
        ll = Math.max(ll, minimum)
      }
    }
    for (const requirement of Array.isArray(task.otherRequirements) ? task.otherRequirements : []) {
      if (requirement?.type !== 'globalVariable') continue
      const condition = describeGlobalVariable(requirement)
      if (!condition.tier) continue
      ll = Math.max(ll, condition.tier)
      clears = Math.max(clears, condition.value)
    }

    if (!ll) continue
    const key = ll + ':' + clears
    if (!groups.has(key)) groups.set(key, { ll, clears, taskIds: [] })
    groups.get(key).taskIds.push(task.id)
  }
  return [...groups.values()].sort((a, b) => a.ll - b.ll || a.clears - b.clears).map(group => group.taskIds)
}

/**
 * Match layout stages to prerequisite depth. A task can only be ranked
 * after all its visible predecessors, so cycles keep Mermaid's native layout.
 */
export function getFlowchartUnlockRanks(tasks) {
  const stages = new Map(getFlowchartUnlockGroups(tasks).flatMap((ids, index) => ids.map(id => [id, index + 1])))
  if (!stages.size) return new Map()
  const pending = new Map(tasks.map(task => [task.id, 0]))
  const successors = new Map(tasks.map(task => [task.id, []]))
  const minimum = new Map(tasks.map(task => [task.id, stages.get(task.id) || 1]))
  for (const task of tasks) {
    for (const requirement of Array.isArray(task.taskRequirements) ? task.taskRequirements : []) {
      const next = successors.get(requirement?.task?.id)
      if (!next) continue
      next.push(task.id)
      pending.set(task.id, pending.get(task.id) + 1)
    }
  }

  const ready = tasks.filter(task => pending.get(task.id) === 0).map(task => task.id)
  for (const id of ready) {
    for (const child of successors.get(id)) {
      minimum.set(child, Math.max(minimum.get(child), minimum.get(id) + 1))
      const remaining = pending.get(child) - 1
      pending.set(child, remaining)
      if (remaining === 0) ready.push(child)
    }
  }
  return new Map(ready.filter(id => stages.has(id)).map(id => [id, minimum.get(id)]))
}

/** Build non-task unlock gates without inferring task-to-task causality. */
export function buildFlowchartGateGraph(tasks) {
  const gateMap = new Map()
  const edges = []
  const add = (key, label, kind = 'gate', automatic = false) => {
    if (!key) return
    if (!gateMap.has(key)) gateMap.set(key, { key, label, kind, automatic })
    return key
  }
  const link = (key, taskId, label = '', technical = null, displayLabel = label) => {
    if (!key || !taskId) return
    edges.push({ gateKey: key, taskId, label, displayLabel, ...(technical ? { technical } : {}) })
  }
  for (const task of Array.isArray(tasks) ? tasks : []) {
    if (!task?.id) continue
    for (const req of getTraderRequirements(task)) {
      const isReputation = ['reputation', 'standing'].includes(req?.requirementType)
      if (!isReputation && !isLoyaltyRequirement(req)) continue
      const traderId = req.trader?.id || (typeof req.trader === 'string' ? req.trader : null)
      const trader = req.trader?.name && req.trader.name !== 'Unknown' ? req.trader.name : traderId || 'トレーダー'
      const type = isReputation ? '評判' : 'LL'
      const value = req.value ?? req.level
      if (value == null || value === '') continue
      const op = compare(req.compareMethod)
      const comparisonText = !isReputation && Object.hasOwn(loyaltyComparisons, op)
        ? `${type}${value}${loyaltyComparisons[op]}`
        : `${type} ${op} ${value}`
      const key = add(`trader:${traderId || trader}:${type}:${op}:${value}`, `${trader} ${comparisonText}`, 'trader', true)
      link(key, task.id)
    }
    for (const [index, req] of (Array.isArray(task.otherRequirements) ? task.otherRequirements : []).entries()) {
      if (!req || typeof req !== 'object') continue
      if (req.type === 'globalVariable' && req.variableId) {
        const op = compare(req.compareMethod)
        const value = req.value ?? ''
        const description = describeGlobalVariable(req)
        const key = add(`global:${req.variableId}`, description.label, 'globalVariable', false)
        gateMap.get(key).variableId = req.variableId
        gateMap.get(key).verified = false
        if (description.sourceUrl && gateMap.get(key).label === description.label) gateMap.get(key).sourceUrl = description.sourceUrl
        else if (!description.sourceUrl) {
          // A shared variable with any unsupported predicate keeps an unknown
          // node label; do not let a supported sibling explain it by accident.
          gateMap.get(key).label = description.label
          delete gateMap.get(key).sourceUrl
        }
        link(key, task.id, `${op} ${value}`.trim(), description.technical, description.conditionText)
      } else if (req.type === 'dialogue') {
        const traders = (Array.isArray(req.traders) ? req.traders : [])
          .map((trader) => typeof trader === 'string'
            ? { id: trader, label: trader }
            : { id: trader?.id || null, label: trader?.name || trader?.id || null })
          .filter((trader) => trader.id || trader.label)
          .sort((a, b) => String(a.id || a.label).localeCompare(String(b.id || b.label)))
        const identities = traders.map((trader) => trader.id || trader.label)
        const labels = traders.map((trader) => trader.label)
        const key = add(`dialogue:${identities.join('|') || 'unknown'}`, `会話: ${labels.join(' / ') || '不明'}`, 'dialogue', false)
        link(key, task.id)
      } else if (req.type) {
        const key = add(`other:${req.type}:${req.id || `${task.id}:${index}`}`, `追加条件: ${req.type}`, 'other', false)
        link(key, task.id)
      }
    }
    const delayMin = finite(task.availableDelaySecondsMin)
    const delayMax = finite(task.availableDelaySecondsMax)
    if ((delayMin || 0) > 0 || (delayMax || 0) > 0) {
      const minLabel = formatDelaySeconds(delayMin)
      const maxLabel = formatDelaySeconds(delayMax)
      const label = minLabel && maxLabel && minLabel !== maxLabel ? `${minLabel}〜${maxLabel}` : (minLabel || maxLabel)
      const key = add(`delay:${delayMin || 0}:${delayMax || 0}`, `出現待機: ${label}`, 'delay', false)
      link(key, task.id)
    }
    if (task.factionName && task.factionName !== 'Any') {
      // The app does not store the player's faction, so this remains an
      // explicitly shown but non-evaluable in-game condition.
      const key = add(`faction:${task.factionName}`, `陣営: ${task.factionName}`, 'faction', false)
      link(key, task.id)
    }
    if (task.requiredPrestige != null && task.requiredPrestige !== '') {
      const key = add(`prestige:${task.requiredPrestige}`, `Prestige条件: ${task.requiredPrestige}`, 'prestige', false)
      link(key, task.id)
    }
  }
  const nodes = [...gateMap.values()].sort((a, b) => a.key.localeCompare(b.key))
  let unknownIndex = 0
  nodes.forEach((node) => {
    if (node.kind === 'globalVariable' && node.label === UNVERIFIED_GLOBAL_CONDITION_LABEL) {
      node.label += ` #${++unknownIndex}`
    }
  })
  edges.sort((a, b) => `${a.taskId}:${a.gateKey}`.localeCompare(`${b.taskId}:${b.gateKey}`))
  return { nodes, edges }
}
