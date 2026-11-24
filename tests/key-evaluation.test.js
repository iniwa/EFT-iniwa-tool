import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildKeyCatalog, summarizeCatalog, evaluateKey, effectiveTier, tierFromScore,
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
  assert.equal(by.a.confidence, 'confirmed')
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
  assert.equal(s.confirmed + s.provisional + s.unverified, 7)
})

test('scoring: task + locks, curated roles, provisional vs confirmed', () => {
  const lockOnly = evaluateKey({ locks: 1, tasks: [], curation: null })
  assert.equal(lockOnly.tier, 'D')
  assert.equal(lockOnly.confidence, 'provisional')
  const kappa = evaluateKey({ locks: 3, tasks: [{ kappa: true }], curation: null })
  assert.equal(kappa.score, 6)
  assert.equal(kappa.tier, 'A')
  const extract = evaluateKey({ locks: 1, tasks: [], curation: KEY_CURATION['zb-014-key'] })
  assert.equal(extract.tier, 'S')
  assert.equal(extract.confidence, 'confirmed')
  assert.equal(tierFromScore(0), 'F')
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
