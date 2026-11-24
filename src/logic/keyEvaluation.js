// src/logic/keyEvaluation.js
// 鍵カタログの組み立てと標準ティアの算出 (純粋関数)。
// ティアは「標準評価」。利用者の個人評価 (keyUserData.rating) とは別に扱う。

import { KEY_CURATION, ROLE_LABELS } from '../data/keyCuration.js'
import { KEY_LOOT } from '../data/keyLoot.js'

export const TIER_ORDER = ['SS', 'S', 'A', 'B', 'C', 'D', 'F']
export function tierRank(tier) {
  const i = TIER_ORDER.indexOf(tier)
  return i === -1 ? TIER_ORDER.length : i
}

const LOOT_TIERS = { 'income-high': 'A', 'loot-high': 'A', 'income-mid': 'B', 'loot-mid': 'B' }

/** The standard tier measures loot. Task, travel and lock evidence only describes usage. */
export function evaluateKey({ locks, tasks, curation, loot }) {
  const { roles = [], special, unlocked } = curation || {}
  const reasons = roles.filter(role => !LOOT_TIERS[role]).map(role => ROLE_LABELS[role])
  if (tasks.length) reasons.push(`タスクで使用 ${tasks.length} 件`)
  if (locks) reasons.push(`施錠 ${locks} か所`)

  const curatedTier = roles.map(role => LOOT_TIERS[role]).filter(Boolean)
    .sort((a, b) => tierRank(a) - tierRank(b))[0]
  const noLock = unlocked && !tasks.length && locks === 0
  const tier = loot?.tier || (!special && (curatedTier || (noLock ? 'F' : null))) || null
  if (loot) reasons.unshift(`部屋の戦利品に基づく標準ティア ${tier}`)
  else if (curatedTier && tier) reasons.unshift('出典の物資情報に基づく暫定ティア')
  else if (noLock && tier) reasons.unshift('施錠なしとの資料あり')
  else reasons.unshift(special ? 'ストーリー・イベント用途' : '戦利品の情報を確認中')
  return { tier, confidence: tier ? 'provisional' : 'unverified', reasons }
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
    const loot = KEY_LOOT[item.normalizedName] || null
    const evaluation = evaluateKey({ locks, tasks, curation, loot })
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
      loot,
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
  const s = { total: catalog.length, provisional: 0, unverified: 0, duplicates: 0, newKeys: 0, noMap: 0, byTier: {} }
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
