// src/logic/keyEvaluation.js
// 鍵カタログの組み立てと標準ティアの算出 (純粋関数)。
// ティアは「標準評価」。利用者の個人評価 (keyUserData.rating) とは別に扱う。

import { ROLE_LABELS } from '../data/keyCuration.js'
import { KEY_LOOT } from '../data/keyLoot.js'
import { KEY_REVIEW, KEY_OPENINGS, keyReviewSource } from '../data/keyReview.js'

export const TIER_ORDER = ['SS', 'S', 'A', 'B', 'C', 'D', 'F']
export function tierRank(tier) {
  const i = TIER_ORDER.indexOf(tier)
  return i === -1 ? TIER_ORDER.length : i
}

const SAMPLE_MODES = { regular: 'PvP', pve: 'PvE', 'pvp-season': 'Season 1 PvP' }
const KEY_INDEX_URL = 'https://wikiwiki.jp/eft/%E9%8D%B5'
const MAP_REVIEW_SOURCES = {
  Customs: 'https://wikiwiki.jp/eft/CUSTOMS',
  'Ground Zero': 'https://wikiwiki.jp/eft/GROUND%20ZERO',
  Interchange: 'https://wikiwiki.jp/eft/INTERCHANGE',
  Lighthouse: 'https://wikiwiki.jp/eft/LIGHTHOUSE',
  'The Labyrinth': 'https://tarkovwiki.com/maps/the-labyrinth',
}

/** A task or lock record can describe usage, but cannot establish a loot tier. */
export function evaluateKey({ locks, tasks, review, loot }) {
  const roles = review?.roles || []
  const reasons = roles.map(role => ROLE_LABELS[role])
  if (tasks.length) reasons.push(`タスクで使用 ${tasks.length} 件`)
  if (locks) reasons.push(`施錠 ${locks} か所`)

  // A later API lock record calls an old "always open" observation into question.
  if (review?.status === 'no-lock' && (locks || tasks.length)) {
    reasons.unshift('現在の施錠データと、開錠先なし／常時開放の資料が一致しません。')
    return { tier: null, confidence: 'unverified', reasons, roles }
  }

  if (loot) {
    reasons.unshift(review?.status === 'no-lock'
      ? '開錠が不要なため標準ティア F'
      : `戦利品に基づく標準ティア ${loot.tier}`)
    return { tier: loot.tier, confidence: 'provisional', reasons, roles }
  }
  if (review?.status === 'use') {
    return { tier: null, confidence: 'usage', reasons, roles }
  }

  if (!review) reasons.unshift('この鍵IDの戦利品は照合台帳にありません。')
  return { tier: null, confidence: 'unverified', reasons, roles }
}

/**
 * API データから鍵カタログを作る。
 * @param {{items:Array, maps:Array}} itemsData
 * @param {Array} taskData
 */
export function buildKeyCatalog(itemsData, taskData, mode) {
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
    const review = KEY_REVIEW[id] || null
    const sourcedLoot = review?.status === 'detailed' ? KEY_LOOT[review.name] : null
    const reviewUrl = sourcedLoot?.url || (review ? keyReviewSource(review) : null)
    const loot = sourcedLoot || (review?.tier ? {
      tier: review.tier, items: review.items, containers: review.containers, url: reviewUrl,
    } : null)
    const evaluation = evaluateKey({ locks, tasks, review, loot })
    const primaryMap = mapList.find(m => m.name === review?.map)?.name || mapList[0]?.name
      || tasks.find(t => t.map)?.map || review?.map || null
    const observations = (KEY_OPENINGS[id] || []).filter(sample => sample.mode === SAMPLE_MODES[mode])
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
      loot,
      review,
      reviewUrl,
      referenceUrl: evaluation.confidence === 'unverified'
        ? (MAP_REVIEW_SOURCES[review?.map] || KEY_INDEX_URL) : null,
      observations,
      fallbackUrl: !review ? 'https://json.tarkov.dev/endpoints' : null,
      isNew: review?.since || null,
      duplicateName: (nameCount[(item.name || '').toLowerCase()] || 0) > 1,
      notInItemDb: !keyItems.has(id),
      ...evaluation,
    })
  })
  return catalog
}

export function summarizeCatalog(catalog) {
  const s = { total: catalog.length, provisional: 0, usage: 0, unverified: 0, duplicates: 0, newKeys: 0, noMap: 0, byTier: {} }
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
