const ATTRIBUTE_META = {
  durability: { label: '耐久' },
  ergonomics: { label: 'エルゴノミクス' },
  recoil: { label: '反動' },
  weight: { label: '重量', unit: 'kg' },
  width: { label: '幅', unit: 'マス' },
  height: { label: '高さ', unit: 'マス' },
  magazineCapacity: { label: 'マガジン容量', unit: '発' },
  effectiveDistance: { label: '有効距離', unit: 'm' },
  accuracy: { label: '精度' },
  muzzleVelocity: { label: '初速', unit: 'm/s' },
}

export function meaningfulBuildAttributes(attributes = {}) {
  return Object.entries(attributes).map(([name, raw]) => {
    const value = raw && typeof raw === 'object' ? raw.value : raw
    const compareMethod = raw && typeof raw === 'object' ? (raw.compareMethod || '>=') : '>='
    const meta = ATTRIBUTE_META[name] || { label: name }
    return { name, label: meta.label, unit: meta.unit || '', value, compareMethod }
  }).filter((entry) => entry.value !== undefined && entry.value !== null && !(entry.compareMethod === '>=' && Number(entry.value) === 0))
}

export function formatBuildAttribute(entry) {
  return `${entry.label} ${entry.compareMethod} ${entry.value}${entry.unit || ''}`
}

function formatNestedValue(value, depth) {
  if (value == null) return ''
  if (depth >= 3) return '…'
  if (Array.isArray(value)) {
    const result = value.slice(0, 8).map((entry) => formatNestedValue(entry, depth + 1)).join(' / ')
    return value.length > 8 ? `${result} / …` : result
  }
  if (typeof value !== 'object') return String(value)
  const labels = {
    id: '識別子', value: '値', compareMethod: '比較', effect: '効果', effects: '効果',
    type: '種類', bodyPart: '部位', bodyParts: '部位', time: '時間', position: '座標',
  }
  const entries = Object.entries(value)
  const result = entries.slice(0, 8).map(([key, entry]) => `${labels[key] || key}: ${formatNestedValue(entry, depth + 1)}`).join(', ')
  return entries.length > 8 ? `${result}, …` : result
}

export function formatObjectiveValue(value) {
  return formatNestedValue(value, 0)
}

export function formatGlobalVariable(value) {
  if (!value || typeof value !== 'object') return formatObjectiveValue(value)
  return `ゲーム内変数 ${value.id || ''} ${value.compareMethod || '>='} ${value.value ?? ''}`.trim()
}

export function formatDistanceCondition(distance) {
  const value = distance && typeof distance === 'object' ? distance.value : distance
  if (value === undefined || value === null || !Number.isFinite(Number(value)) || Number(value) <= 0) return ''
  const compareMethod = distance && typeof distance === 'object' ? (distance.compareMethod || '>=') : '>='
  return `距離: ${compareMethod} ${value}m`
}

export function formatTimeCondition(fromHour, untilHour) {
  if (fromHour == null && untilHour == null) return ''
  if (Number(fromHour) === 0 && Number(untilHour) === 0) return ''
  return `時間帯: ${fromHour ?? '--'}:00〜${untilHour ?? '--'}:00`
}

export function formatExitCondition(exitName, exitStatus) {
  if (!exitName) return ''
  const statuses = (Array.isArray(exitStatus) ? exitStatus : exitStatus ? [exitStatus] : []).filter(Boolean)
  return `脱出地点: ${exitName}${statuses.length ? ` (必要状態: ${statuses.join(' / ')})` : ''}`
}

export function healthEffectEntries(objective = {}) {
  const entries = []
  const player = objective.playerHealthEffect ?? objective.playerHealthEffects
  const enemy = objective.enemyHealthEffect ?? objective.enemyHealthEffects
  if (player != null) entries.push({ key: 'player', label: 'プレイヤー体力', value: player })
  if (enemy != null) entries.push({ key: 'enemy', label: '敵体力', value: enemy })
  if (objective.healthEffects != null) entries.push({ key: 'general', label: '体力条件', value: objective.healthEffects })
  return entries
}

export function objectivePositionLines(objective = {}) {
  const lines = []
  ;(objective.zones || []).filter(Boolean).forEach((zone, index) => {
    if (zone.position != null) lines.push(`ゾーン ${zone.name || zone.id || index + 1}: ${formatObjectiveValue(zone.position)}`)
  })
  ;(objective.possibleLocations || []).filter(Boolean).forEach((location, index) => {
    const label = location.name || location.id || `候補 ${index + 1}`
    if (location.position != null) lines.push(`${label}: ${formatObjectiveValue(location.position)}`)
    if (Array.isArray(location.positions) && location.positions.length) {
      const shown = location.positions.slice(0, 3)
      const suffix = location.positions.length > shown.length ? ` / ほか${location.positions.length - shown.length}地点` : ''
      lines.push(`${label}: ${shown.map((position) => formatObjectiveValue(position)).join(' / ')}${suffix}`)
    }
  })
  return lines
}
