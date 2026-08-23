import { getSeasonModifierManifest, ACHIEVEMENT_HINTS, KORD_BREACH_SEASON_ID } from '../data/seasonModifiers.js'

export const SEASON_MODIFIER_SCHEMA_VERSION = 1
export const MAX_SHARED_MODIFIERS = 64
export const MAX_SHARED_LENGTH = 1800
export const MAX_MODIFIER_ID_LENGTH = 96
export const MODIFIER_ID_PATTERN = /^[a-z0-9][a-z0-9_ '\-]*$/i

function allModifiers(season) {
  return [...(season?.positive || []), ...(season?.negative || [])]
}

export function normalizeModifierIds(ids, season) {
  const values = Array.isArray(ids) ? ids : []
  const known = new Set(allModifiers(season).map((item) => item.id))
  const result = []
  const seen = new Set()
  for (const value of values) {
    if (typeof value !== 'string') continue
    const id = value.trim()
    if (!id || id.length > MAX_MODIFIER_ID_LENGTH || !MODIFIER_ID_PATTERN.test(id) || seen.has(id)) continue
    seen.add(id)
    result.push(id)
  }
  return { ids: result, unknownIds: result.filter((id) => !known.has(id)) }
}

export function getInteractionWarnings(ids, season) {
  const set = new Set(ids)
  const has = (...values) => values.filter((id) => set.has(id))
  const warnings = []
  const add = (id, label, values, text) => {
    const selected = has(...values)
    if (selected.length > 1 || (selected.length === 1 && id === 'single')) {
      warnings.push({ id, label, modifierIds: selected, message: text })
    }
  }
  add('luck', '運', ['lucky', 'unlucky'], 'Lucky / Unlucky は同じ運カテゴリです。ゲーム内の最終効果を確認してください。')
  add('bleeding', '出血', ['thrombophilia', 'hemophilia'], '出血カテゴリの効果が重なっています。')
  add('hydration', '水分', ['hypodipsia', 'polydipsia'], '水分カテゴリの効果が重なっています。')
  add('energy', 'Energy', ['polyphagia', 'youth', 'chronic-fatigue-syndrome'], 'Energyカテゴリの効果が重なっています。')
  add('bones', '骨折', ['sturdy-bones', 'osteoporosis'], '骨カテゴリの効果が重なっています。')
  add('movement', '移動', ['marathon-runner', 'sprinter', 'bushborne', 'third-leg'], '移動カテゴリの効果が重なっています。')
  add('stamina', 'スタミナ', ['marathon-runner', 'youth', 'hercules', 'exhaustion', 'sprinter'], 'スタミナカテゴリの効果が重なっています。')
  add('skills', 'Skill', ['prodigy', 'average', 'incompetent', 'hercules', 'the-tarkov-shooter', 'personality-vacuum'], 'Skillカテゴリの効果が重なっています。')
  add('container', 'Container', ['kappa-protocol', 'broken-secure-container'], 'Kappa / Secure Containerカテゴリの効果が重なっています。')
  return warnings
}

export function evaluateSeasonModifierBuild(selectedIds = [], season) {
  const manifest = season || getSeasonModifierManifest()
  const normalized = normalizeModifierIds(selectedIds, manifest)
  const selected = normalized.ids.map((id) => allModifiers(manifest).find((item) => item.id === id)).filter(Boolean)
  const earned = selected.filter((item) => item.kind === 'negative').reduce((sum, item) => sum + item.points, 0)
  const spent = selected.filter((item) => item.kind === 'positive').reduce((sum, item) => sum + Math.abs(item.points), 0)
  const balance = earned - spent
  const isPointValid = balance >= 0
  return {
    selectedIds: normalized.ids,
    unknownIds: normalized.unknownIds,
    selected,
    selectedCount: selected.length,
    positiveCount: selected.filter((item) => item.kind === 'positive').length,
    negativeCount: selected.filter((item) => item.kind === 'negative').length,
    earned,
    spent,
    balance,
    isPointValid,
    isValid: isPointValid && normalized.unknownIds.length === 0,
    interactionWarnings: getInteractionWarnings(normalized.ids, manifest),
  }
}

export function evaluateAchievementHints(selectedIds = [], season) {
  const result = evaluateSeasonModifierBuild(selectedIds, season)
  const set = new Set(result.selectedIds)
  return ACHIEVEMENT_HINTS.map((hint) => {
    let met = false
    if (hint.rule === 'positiveCount') met = result.positiveCount === hint.value
    if (hint.rule === 'negativeCount') met = result.negativeCount >= hint.value
    if (hint.rule === 'contains') met = set.has(hint.modifierIds[0])
    if (hint.rule === 'containsAll') met = hint.modifierIds.every((id) => set.has(id))
    if (hint.rule === 'containsAtLeast') met = hint.modifierIds.filter((id) => set.has(id)).length >= hint.value
    return { ...hint, met }
  })
}

export function validateSeasonModifierManifest(manifest) {
  const errors = []
  if (!manifest || typeof manifest !== 'object') return ['manifest is required']
  for (const field of ['seasonId', 'displayName', 'patch', 'verifiedAt', 'status', 'confidence', 'officialRulesSource']) {
    if (typeof manifest[field] !== 'string' || !manifest[field].trim()) errors.push(`missing metadata: ${field}`)
  }
  if (!Array.isArray(manifest.observedSources) || manifest.observedSources.length === 0) errors.push('missing metadata: observedSources')
  if (manifest.globals?.length !== 6) errors.push('globals must contain 6 modifiers')
  if (manifest.positive?.length !== 19) errors.push('positive must contain 19 modifiers')
  if (manifest.negative?.length !== 14) errors.push('negative must contain 14 modifiers')
  const items = [...(manifest.globals || []), ...(manifest.positive || []), ...(manifest.negative || [])]
  const ids = items.map((item) => item?.id)
  if (ids.some((id) => typeof id !== 'string' || !id)) errors.push('modifier IDs must be non-empty strings')
  if (new Set(ids).size !== ids.length) errors.push('modifier IDs must be unique')
  for (const item of manifest.globals || []) if (item.kind !== 'global') errors.push(`global kind invalid: ${item.id}`)
  for (const item of manifest.positive || []) { if (item.kind !== 'positive') errors.push(`positive kind invalid: ${item.id}`); if (!(item.points < 0)) errors.push(`positive sign invalid: ${item.id}`) }
  for (const item of manifest.negative || []) { if (item.kind !== 'negative') errors.push(`negative kind invalid: ${item.id}`); if (!(item.points > 0)) errors.push(`negative sign invalid: ${item.id}`) }
  return errors
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function decodeBase64Url(value) {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4))
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

export function encodeSeasonModifierShare(seasonId, modifierIds, season) {
  const manifest = season || getSeasonModifierManifest(seasonId)
  if (!manifest || manifest.seasonId !== seasonId) return null
  if (!Array.isArray(modifierIds) || modifierIds.length > MAX_SHARED_MODIFIERS || modifierIds.some((id) => typeof id !== 'string' || id.trim().length > MAX_MODIFIER_ID_LENGTH || id.trim().length === 0 || !MODIFIER_ID_PATTERN.test(id.trim()))) return null
  const normalized = normalizeModifierIds(modifierIds, manifest)
  const payload = { v: SEASON_MODIFIER_SCHEMA_VERSION, s: seasonId, m: normalized.ids }
  const encoded = encodeBase64Url(JSON.stringify(payload))
  return encoded.length <= MAX_SHARED_LENGTH ? encoded : null
}

export function decodeSeasonModifierShare(encoded, expectedSeasonId = KORD_BREACH_SEASON_ID) {
  if (typeof encoded !== 'string' || !encoded || encoded.length > MAX_SHARED_LENGTH || !/^[A-Za-z0-9_-]+$/.test(encoded)) return { ok: false, reason: 'invalid-format' }
  try {
    const payload = JSON.parse(decodeBase64Url(encoded))
    if (!payload || payload.v !== SEASON_MODIFIER_SCHEMA_VERSION) return { ok: false, reason: 'unknown-schema' }
    if (payload.s !== expectedSeasonId || !getSeasonModifierManifest(payload.s)) return { ok: false, reason: 'unknown-season' }
    if (!Array.isArray(payload.m) || payload.m.length > MAX_SHARED_MODIFIERS || payload.m.some((id) => typeof id !== 'string' || id.trim().length > MAX_MODIFIER_ID_LENGTH || !MODIFIER_ID_PATTERN.test(id.trim()))) return { ok: false, reason: 'invalid-modifiers' }
    const normalized = normalizeModifierIds(payload.m, getSeasonModifierManifest(payload.s))
    return { ok: true, seasonId: payload.s, modifierIds: normalized.ids, unknownIds: normalized.unknownIds }
  } catch { return { ok: false, reason: 'invalid-payload' } }
}

export const encodeBuildShare = encodeSeasonModifierShare
export const decodeBuildShare = decodeSeasonModifierShare
