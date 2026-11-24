import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildKeyCatalog, summarizeCatalog, evaluateKey, effectiveTier,
} from '../src/logic/keyEvaluation.js'
import { ROLE_LABELS } from '../src/data/keyCuration.js'
import { KEY_LOOT } from '../src/data/keyLoot.js'
import { KEY_REVIEW, KEY_OPENINGS, keyReviewSource } from '../src/data/keyReview.js'

const key = (id, name, normalizedName, extra = {}) => ({ id, name, normalizedName, types: ['keys'], ...extra })
const lock = (id) => ({ key: { id } })

const items = [
  key('a', 'Alpha key', 'alpha-key'),
  key('b', 'Folding car key', 'folding-car-key'),
  key('c', 'Folding car key', 'folding-car-key-1'),
  key('d', 'ZB-014 key', 'zb-014-key'),
  key('e', 'Blank RFID keycard', 'blank-rfid-keycard'),
  key('f', 'Orphan key', 'orphan-key'),
  { id: 'x', name: 'Not a key', types: ['gun'] },
]
const maps = [
  { name: 'Customs', locks: [lock('a'), lock('a'), lock('a'), lock('b')] },
  { name: 'Woods', locks: [lock('d'), lock('missing')] },
]
const tasks = [
  { id: 't1', name: 'Task One', kappaRequired: true, neededKeys: [{ map: { name: 'Customs' }, keys: [{ id: 'a' }] }] },
]

test('catalog merges items, locks and tasks, and flags duplicates / unknown IDs', () => {
  const cat = buildKeyCatalog({ items, maps }, tasks)
  const by = Object.fromEntries(cat.map((k) => [k.id, k]))
  assert.equal(cat.length, 7) // 6 key items + 1 lock-only ID, gun excluded
  assert.equal(by.a.locks, 3)
  assert.equal(by.a.tasks.length, 1)
  assert.equal(by.a.confidence, 'unverified')
  assert.equal(by.b.duplicateName, true)
  assert.equal(by.c.duplicateName, true)
  assert.equal(by.missing.notInItemDb, true)
  assert.equal(by.missing.name, 'Unknown Key')
})

test('live IDs without review evidence get no tier', () => {
  const cat = buildKeyCatalog({ items, maps }, tasks)
  const by = Object.fromEntries(cat.map((k) => [k.id, k]))
  assert.equal(by.f.tier, null)
  assert.equal(by.f.confidence, 'unverified')
  assert.equal(by.e.tier, null)
  const s = summarizeCatalog(cat)
  assert.equal(s.total, 7)
  assert.equal(s.provisional + s.usage + s.unverified, 7)
})

test('lock and task counts never confer a tier, and usage is a separate status', () => {
  const tasks = [{ kappa: true }, { lightkeeper: true }]
  assert.equal(evaluateKey({ locks: 9, tasks }).tier, null)
  const travel = evaluateKey({ locks: 1, tasks: [], review: { status: 'use', roles: ['extract'] } })
  assert.equal(travel.tier, null)
  assert.equal(travel.confidence, 'usage')
  assert.ok(travel.reasons.includes('脱出口'))
})

test('F requires explicit evidence and yields to a current lock or task', () => {
  const review = { status: 'no-lock', tier: 'F' }
  assert.equal(evaluateKey({ locks: 0, tasks: [], review, loot: review }).tier, 'F')
  const conflict = evaluateKey({ locks: 1, tasks: [], review, loot: review })
  assert.equal(conflict.tier, null)
  assert.equal(conflict.confidence, 'unverified')
  assert.equal(evaluateKey({ locks: 0, tasks: [{ id: 'test' }], review, loot: review }).tier, null)
})

test('marked rooms and Rusted bloody keep their sourced SS tiers', () => {
  const names = ['dorm-room-314-marked-key', 'abandoned-factory-marked-key', 'mysterious-room-marked-key',
    'rb-vo-marked-key', 'rb-bk-marked-key', 'rb-pkpm-marked-key', 'rusted-bloody-key']
  const items = Object.entries(KEY_REVIEW)
    .filter(([, review]) => names.includes(review.name))
    .map(([id, review]) => key(id, review.name, review.name))
  assert.equal(items.length, 7)
  for (const entry of buildKeyCatalog({ items }, [], 'pvp-season')) {
    assert.equal(entry.tier, 'SS', entry.id)
    assert.ok(entry.loot.url.startsWith('https://'))
    assert.ok(entry.loot.items.length)
    if (entry.normalizedName === 'rusted-bloody-key') assert.equal(entry.observations.length, 0)
    else assert.ok(entry.observations.some(s => s.mode === 'Season 1 PvP' && s.openings === 10))
  }
})

test('same-name Folding car keys keep distinct review states', () => {
  const first = key('590de4a286f77423d9312a32', 'Folding car key', 'folding-car-key')
  const second = key('59136f6f86f774447a1ed173', 'Folding car key', 'folding-car-key-1')
  const [unverified, rated] = buildKeyCatalog({ items: [first, second] }, [])
  assert.equal(unverified.tier, null)
  assert.equal(unverified.confidence, 'unverified')
  assert.ok(unverified.referenceUrl)
  assert.equal(rated.tier, 'D')
  assert.match(rated.loot.containers, /グレネード箱/)
  assert.ok(unverified.duplicateName && rated.duplicateName)
})

test('opening records appear only in the matching game mode', () => {
  const id = '5ad5d64486f774079b080af8'
  const items = [key(id, 'NecrusPharm', 'necruspharm-pharmacy-key')]
  for (const [mode, label, average] of [
    ['regular', 'PvP', 423053], ['pve', 'PvE', 1185115], ['pvp-season', 'Season 1 PvP', 749547],
  ]) {
    const [entry] = buildKeyCatalog({ items }, [], mode)
    assert.equal(entry.tier, 'S')
    assert.deepEqual(entry.observations.map(sample => [sample.mode, sample.averageRub]), [[label, average]])
  }
  assert.deepEqual(buildKeyCatalog({ items }, [])[0].observations, [])
})

test('personal rating overrides the standard tier only when set', () => {
  const k = { tier: 'B' }
  assert.equal(effectiveTier(k, '-'), 'B')
  assert.equal(effectiveTier(k, undefined), 'B')
  assert.equal(effectiveTier(k, 'SS'), 'SS')
})

test('the 259-ID ledger includes evidence for every outcome', () => {
  const reviews = Object.entries(KEY_REVIEW)
  assert.equal(reviews.length, 259)
  assert.equal(new Set(reviews.map(([, review]) => review.name)).size, 259)
  for (const [id, review] of reviews) {
    assert.match(id, /^[a-f0-9]{24}$/)
    assert.match(keyReviewSource(review), /^https:\/\//)
    if (review.status === 'detailed') assert.ok(KEY_LOOT[review.name])
    else if (review.status) assert.ok(review.note, review.name)
    else assert.ok(review.items?.length || review.containers, review.name)
    for (const role of review.roles || []) assert.ok(ROLE_LABELS[role], role)
  }
  for (const [id, samples] of Object.entries(KEY_OPENINGS)) {
    assert.ok(KEY_REVIEW[id], id)
    for (const sample of samples) {
      assert.ok(['PvP', 'PvE', 'Season 1 PvP'].includes(sample.mode))
      assert.ok(sample.openings > 0 && sample.averageRub > 0 && sample.slug)
    }
  }
  const catalog = buildKeyCatalog({ items: reviews.map(([id, r]) => key(id, r.name, r.name)) }, [])
  const { provisional, usage, unverified } = summarizeCatalog(catalog)
  assert.deepEqual([provisional, usage, unverified], [218, 30, 11])
})
