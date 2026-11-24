// src/logic/keyEvaluation.js
// 鍵カタログの組み立てと標準ティアの算出 (純粋関数)。
// ティアは「標準評価」。利用者の個人評価 (keyUserData.rating) とは別に扱う。

import { KEY_CURATION, KEY_REVIEW_META, ROLE_LABELS } from '../data/keyCuration.js'

export const TIER_ORDER = ['SS', 'S', 'A', 'B', 'C', 'D', 'F']
const ROLE_POINTS = { extract: 6, access: 7, 'access-core': 9, 'income-high': 5, 'income-mid': 2, 'loot-high': 3, 'loot-mid': 1 }

export function tierFromScore(score) {
  for (const t of KEY_REVIEW_META.tiers) if (score >= t.min) return t.tier
  return 'F'
}

export function tierRank(tier) {
  const i = TIER_ORDER.indexOf(tier)
  return i === -1 ? TIER_ORDER.length : i
}

/** 1 本の鍵の評価。facts: { locks, tasks, curation } */
export function evaluateKey({ locks, tasks, curation }) {
  const cur = curation || {}
  const roles = cur.roles || []
  const reasons = []
  const hasKappa = tasks.some((t) => t.kappa)
  const hasLk = tasks.some((t) => t.lightkeeper)

  if (cur.special) {
    return { tier: null, score: null, confidence: 'unverified', reasons: ['ストーリー・イベント用など、探索向けの評価対象外'], basis: ['special'] }
  }
  if (cur.unlocked && tasks.length === 0 && locks === 0) {
    return { tier: 'F', score: 0, confidence: 'provisional', reasons: ['Wiki は施錠なしと記載、API にも施錠・タスクの記録なし (記載版が古い可能性)'], basis: ['unlocked'] }
  }

  let score = 0
  roles.forEach((r) => {
    score += ROLE_POINTS[r] || 0
    reasons.push(`${ROLE_LABELS[r]} (+${ROLE_POINTS[r]})`)
  })
  if (tasks.length) {
    const p = hasKappa ? 4 : hasLk ? 3 : 2
    score += p
    reasons.push(`${hasKappa ? 'Kappa 必須' : hasLk ? 'Lightkeeper 必須' : 'タスク'}で必要 ${tasks.length} 件 (+${p})`)
  }
  if (locks >= 3) { score += 2; reasons.push(`施錠 ${locks} か所 (+2)`) }
  else if (locks >= 1) { score += 1; reasons.push(`施錠 ${locks} か所 (+1)`) }

  if (!roles.length && !tasks.length && locks === 0) {
    return { tier: null, score: null, confidence: 'unverified', reasons: ['施錠箇所・タスク使用・出典のいずれも確認できず'], basis: [] }
  }

  const strong = tasks.length > 0 || roles.some((r) => r === 'access' || r === 'access-core' || r === 'extract')
  return {
    tier: tierFromScore(score),
    score,
    confidence: strong ? 'confirmed' : 'provisional',
    reasons,
    basis: [...roles, ...(tasks.length ? ['task'] : []), ...(locks ? ['lock'] : [])],
  }
}

/**
 * API データから鍵カタログを作る。
 * @param {{items:Array, maps:Array}} itemsData
 * @param {Array} taskData
 */
export function buildKeyCatalog(itemsData, taskData) {
  const items = itemsData?.items || []
  const maps = itemsData?.maps || []
  const keyItems = new Map()
  items.forEach((it) => { if (it.types?.includes('keys')) keyItems.set(it.id, it) })

  const lockMap = new Map() // keyId -> Map(mapName -> count)
  maps.forEach((m) => (m.locks || []).forEach((l) => {
    const id = l.key?.id
    if (!id) return
    if (!lockMap.has(id)) lockMap.set(id, new Map())
    lockMap.get(id).set(m.name, (lockMap.get(id).get(m.name) || 0) + 1)
  }))

  const taskMap = new Map() // keyId -> Map(taskId -> task)
  ;(taskData || []).forEach((t) => (t.neededKeys || []).forEach((g) => (g.keys || []).forEach((k) => {
    if (!k?.id) return
    if (!taskMap.has(k.id)) taskMap.set(k.id, new Map())
    taskMap.get(k.id).set(t.id, {
      id: t.id, name: t.name, kappa: !!t.kappaRequired, lightkeeper: !!t.lightkeeperRequired,
      map: g.map?.name || null,
    })
  })))

  const itemIds = items.length ? keyItems.keys() : []
  const ids = new Set([...itemIds, ...lockMap.keys(), ...taskMap.keys()])
  const nameCount = {}
  ids.forEach((id) => {
    const n = (keyItems.get(id)?.name || '').toLowerCase()
    if (n) nameCount[n] = (nameCount[n] || 0) + 1
  })

  const catalog = []
  ids.forEach((id) => {
    const item = keyItems.get(id) || {}
    const mapCounts = lockMap.get(id) || new Map()
    const mapList = [...mapCounts.entries()].map(([name, count]) => ({ name, count }))
    const locks = mapList.reduce((s, m) => s + m.count, 0)
    const tasks = taskMap.has(id) ? [...taskMap.get(id).values()] : []
    const curation = KEY_CURATION[item.normalizedName] || null
    const evaluation = evaluateKey({ locks, tasks, curation })
    const primaryMap = mapList[0]?.name || tasks.map((t) => t.map).find(Boolean) || null
    catalog.push({
      id,
      name: item.name || 'Unknown Key',
      shortName: item.shortName || null,
      normalizedName: item.normalizedName || null,
      wikiLink: item.wikiLink || null,
      image: item.image512pxLink || null,
      noFlea: !!item.types?.includes('noFlea'),
      maps: mapList,
      locks,
      primaryMap,
      tasks,
      curation,
      roles: curation?.roles || [],
      isNew: curation?.isNew || null,
      duplicateName: (nameCount[(item.name || '').toLowerCase()] || 0) > 1,
      notInItemDb: !keyItems.has(id),
      ...evaluation,
    })
  })
  return catalog
}

export function summarizeCatalog(catalog) {
  const s = { total: catalog.length, confirmed: 0, provisional: 0, unverified: 0, duplicates: 0, newKeys: 0, noMap: 0, byTier: {} }
  TIER_ORDER.forEach((t) => { s.byTier[t] = 0 })
  catalog.forEach((k) => {
    s[k.confidence]++
    if (k.duplicateName) s.duplicates++
    if (k.isNew) s.newKeys++
    if (!k.primaryMap) s.noMap++
    if (k.tier) s.byTier[k.tier]++
  })
  return s
}

/** 個人評価があればそれ、なければ標準ティア */
export function effectiveTier(key, userRating) {
  if (userRating && userRating !== '-') return userRating
  return key.tier
}
