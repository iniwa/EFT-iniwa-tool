import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildKeyCatalog, summarizeCatalog, evaluateKey, effectiveTier,
} from '../src/logic/keyEvaluation.js'
import { KEY_CURATION } from '../src/data/keyCuration.js'

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

test('evidence-free keys get no tier; special keys are excluded from tiers', () => {
  const cat = buildKeyCatalog({ items, maps }, tasks)
  const by = Object.fromEntries(cat.map((k) => [k.id, k]))
  assert.equal(by.f.tier, null)
  assert.equal(by.f.confidence, 'unverified')
  assert.equal(by.e.tier, null)
  const s = summarizeCatalog(cat)
  assert.equal(s.total, 7)
  assert.equal(s.provisional + s.unverified, 7)
})

test('loot tier is independent of task or lock count and travel utility', () => {
  const tasks = [{ kappa: true }, { lightkeeper: true }]
  assert.equal(evaluateKey({ locks: 9, tasks, curation: null }).tier, null)
  const travel = evaluateKey({ locks: 1, tasks: [], curation: KEY_CURATION['zb-014-key'] })
  assert.equal(travel.tier, null)
  assert.ok(travel.reasons.includes('脱出口'))
  const room = evaluateKey({ locks: 1, tasks, curation: { roles: ['loot-high'] } })
  assert.equal(room.tier, 'A')
  assert.equal(room.confidence, 'provisional')
})

test('marked rooms and Rusted bloody have SS with sourced loot, measured results stay mode-specific', () => {
  const names = ['dorm-room-314-marked-key', 'abandoned-factory-marked-key', 'mysterious-room-marked-key',
    'rb-vo-marked-key', 'rb-bk-marked-key', 'rb-pkpm-marked-key', 'rusted-bloody-key']
  const keys = buildKeyCatalog({ items: names.map(name => key(name, name, name)) }, [])
  for (const entry of keys) {
    assert.equal(entry.tier, 'SS', entry.id)
    assert.ok(entry.loot.url.startsWith('https://'))
    assert.ok(entry.loot.items.length)
  }
  for (const room of keys.slice(0, 6)) {
    assert.equal(room.loot.observation.mode, 'Season 1 PvP')
    assert.equal(room.loot.observation.openings, 10)
  }
  assert.equal(keys.at(-1).loot.observation, undefined)
})

test('personal rating overrides the standard tier only when set', () => {
  const k = { tier: 'B' }
  assert.equal(effectiveTier(k, '-'), 'B')
  assert.equal(effectiveTier(k, undefined), 'B')
  assert.equal(effectiveTier(k, 'SS'), 'SS')
})

test('every curated entry has a source and valid role names', () => {
  const roles = new Set(['extract', 'access', 'access-core', 'income-high', 'income-mid', 'loot-high', 'loot-mid'])
  for (const [name, c] of Object.entries(KEY_CURATION)) {
    assert.ok(c.src?.length, `${name} has no source`)
    for (const r of c.roles || []) assert.ok(roles.has(r), `${name}: unknown role ${r}`)
  }
})
