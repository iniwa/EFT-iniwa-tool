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

/** Build non-task unlock gates without inferring task-to-task causality. */
export function buildFlowchartGateGraph(tasks) {
  const gateMap = new Map()
  const edges = []
  const add = (key, label, kind = 'gate', automatic = false) => {
    if (!key) return
    if (!gateMap.has(key)) gateMap.set(key, { key, label, kind, automatic })
    return key
  }
  const link = (key, taskId, label = '') => {
    if (!key || !taskId) return
    edges.push({ gateKey: key, taskId, label })
  }
  for (const task of Array.isArray(tasks) ? tasks : []) {
    if (!task?.id) continue
    const level = finite(task.minPlayerLevel)
    if (level > 0) {
      const key = add(`level:${level}`, `PMCレベル >= ${level}`, 'level', true)
      link(key, task.id)
    }
    for (const req of Array.isArray(task.traderLevelRequirements) ? task.traderLevelRequirements : []) {
      const trader = req?.trader?.name || req?.trader?.id || 'Unknown'
      const type = ['reputation', 'standing'].includes(req?.requirementType) ? '評判' : 'LL'
      const value = req?.value ?? req?.level
      if (value == null) continue
      const key = add(`trader:${req?.trader?.id || trader}:${type}:${compare(req.compareMethod)}:${value}`, `${trader} ${type} ${compare(req.compareMethod)} ${value}`, 'trader', true)
      link(key, task.id)
    }
    for (const [index, req] of (Array.isArray(task.otherRequirements) ? task.otherRequirements : []).entries()) {
      if (!req || typeof req !== 'object') continue
      if (req.type === 'globalVariable' && req.variableId) {
        const op = compare(req.compareMethod)
        const value = req.value ?? ''
        const key = add(`global:${req.variableId}`, `ゲーム内変数 (ID: ${req.variableId})`, 'globalVariable', false)
        link(key, task.id, `${op} ${value}`.trim())
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
  edges.sort((a, b) => `${a.taskId}:${a.gateKey}`.localeCompare(`${b.taskId}:${b.gateKey}`))
  return { nodes, edges }
}
