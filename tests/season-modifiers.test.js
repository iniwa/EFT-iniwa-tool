import assert from 'node:assert/strict'
import test from 'node:test'
import { KORD_BREACH_SEASON } from '../src/data/seasonModifiers.js'
import { decodeSeasonModifierShare, encodeSeasonModifierShare, evaluateAchievementHints, evaluateSeasonModifierBuild, getInteractionWarnings, validateSeasonModifierManifest } from '../src/logic/seasonModifierLogic.js'
import { createSeasonModifierBuildStore, sanitizeSeasonModifierState, SEASON_MODIFIER_STORAGE_KEY } from '../src/composables/useSeasonModifierBuilds.js'

test('manifest contains the stable Season 1 inventory and signed values', () => {
  assert.equal(KORD_BREACH_SEASON.globals.length, 6)
  assert.equal(KORD_BREACH_SEASON.positive.length, 19)
  assert.equal(KORD_BREACH_SEASON.negative.length, 15)
  const all = [...KORD_BREACH_SEASON.globals, ...KORD_BREACH_SEASON.positive, ...KORD_BREACH_SEASON.negative]
  assert.equal(new Set(all.map((item) => item.id)).size, all.length)
  assert.ok(KORD_BREACH_SEASON.positive.every((item) => item.points < 0))
  assert.ok(KORD_BREACH_SEASON.negative.every((item) => item.points > 0))
  assert.deepEqual(validateSeasonModifierManifest(KORD_BREACH_SEASON), [])
})

test('manifest validator catches missing metadata and invalid counts/signs', () => {
  const invalid = { ...KORD_BREACH_SEASON, verifiedAt: '', positive: KORD_BREACH_SEASON.positive.map((item, index) => index === 0 ? { ...item, points: 1, id: KORD_BREACH_SEASON.positive[1].id } : item) }
  const errors = validateSeasonModifierManifest(invalid)
  assert.ok(errors.some((error) => error.includes('verifiedAt')))
  assert.ok(errors.some((error) => error.includes('unique')))
  assert.ok(errors.some((error) => error.includes('sign')))
})

test('build evaluation handles empty, valid, overspent, duplicates and unknown IDs', () => {
  assert.equal(evaluateSeasonModifierBuild([] , KORD_BREACH_SEASON).isValid, true)
  const valid = evaluateSeasonModifierBuild(['no-flea-market', 'street-tax'], KORD_BREACH_SEASON)
  assert.deepEqual({ earned: valid.earned, spent: valid.spent, balance: valid.balance }, { earned: 10, spent: 1, balance: 9 })
  assert.equal(evaluateSeasonModifierBuild(['street-tax', 'street-tax', 'unknown'], KORD_BREACH_SEASON).isValid, false)
  assert.deepEqual(evaluateSeasonModifierBuild(['street-tax', 'street-tax', 'unknown'], KORD_BREACH_SEASON).selectedIds, ['street-tax', 'unknown'])
  assert.equal(evaluateSeasonModifierBuild(['average', 'street-tax'], KORD_BREACH_SEASON).isPointValid, false)
})

test('interaction warnings are informative and do not invalidate selection', () => {
  const result = evaluateSeasonModifierBuild(['lucky', 'unlucky', 'hemophilia', 'thrombophilia'], KORD_BREACH_SEASON)
  assert.ok(getInteractionWarnings(result.selectedIds, KORD_BREACH_SEASON).length >= 2)
  assert.equal(result.isValid, true)
})

test('achievement hints expose all seven planning rules', () => {
  assert.equal(evaluateAchievementHints(['no-flea-market', 'broken-secure-container', 'street-tax', 'kappa-protocol'], KORD_BREACH_SEASON).length, 7)
  const hints = evaluateAchievementHints(['marathon-runner', 'youth', 'hercules', 'thrombophilia', 'hypodipsia'], KORD_BREACH_SEASON)
  assert.equal(hints.find((hint) => hint.id === 'you-call-that-a-challenge').met, true)
  const notMet = evaluateAchievementHints([], KORD_BREACH_SEASON)
  assert.ok(notMet.every((hint) => hint.met === (hint.id === 'dont-need-any-help')))
  const genetic = evaluateAchievementHints(['hemophilia', 'osteoporosis', 'polydipsia', 'allergic', 'third-leg'], KORD_BREACH_SEASON)
  assert.equal(genetic.find((hint) => hint.id === 'genetic-lottery').met, true)
  const hardcore = evaluateAchievementHints(['broken-secure-container', 'no-flea-market'], KORD_BREACH_SEASON)
  assert.equal(hardcore.find((hint) => hint.id === 'we-have-hardcore-at-home').met, true)
})

test('share payload round-trips and rejects malformed, oversized, unknown schema and season', () => {
  const encoded = encodeSeasonModifierShare(KORD_BREACH_SEASON.seasonId, ['street-tax', 'no-flea-market'], KORD_BREACH_SEASON)
  assert.deepEqual(decodeSeasonModifierShare(encoded), { ok: true, seasonId: KORD_BREACH_SEASON.seasonId, modifierIds: ['street-tax', 'no-flea-market'], unknownIds: [] })
  const future = encodeSeasonModifierShare(KORD_BREACH_SEASON.seasonId, ['future-modifier'], KORD_BREACH_SEASON)
  assert.deepEqual(decodeSeasonModifierShare(future).unknownIds, ['future-modifier'])
  assert.equal(encodeSeasonModifierShare(KORD_BREACH_SEASON.seasonId, ['<invalid>'], KORD_BREACH_SEASON), null)
  assert.equal(encodeSeasonModifierShare(KORD_BREACH_SEASON.seasonId, Array(65).fill('future-modifier'), KORD_BREACH_SEASON), null)
  assert.equal(decodeSeasonModifierShare('not valid!').ok, false)
  assert.equal(decodeSeasonModifierShare('A'.repeat(1801)).ok, false)
  const unknownSchema = Buffer.from(JSON.stringify({ v: 99, s: KORD_BREACH_SEASON.seasonId, m: [] })).toString('base64url')
  assert.equal(decodeSeasonModifierShare(unknownSchema).reason, 'unknown-schema')
  const unknownSeason = Buffer.from(JSON.stringify({ v: 1, s: 'old', m: [] })).toString('base64url')
  assert.equal(decodeSeasonModifierShare(unknownSeason).reason, 'unknown-season')
})

test('storage factory sanitizes corruption, isolates seasons, retains unknown IDs and caps presets', () => {
  const values = new Map([[SEASON_MODIFIER_STORAGE_KEY, '{broken']])
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  const store = createSeasonModifierBuildStore(storage)
  store.setDraft('kord-breach-2026', ['old-id'])
  assert.deepEqual(store.getSeason('other').draft, [])
  assert.deepEqual(store.getSeason('kord-breach-2026').draft, ['old-id'])
  for (let index = 0; index < 25; index += 1) store.savePreset('kord-breach-2026', ` preset ${index} `, [])
  assert.equal(store.getSeason('kord-breach-2026').presets.length, 20)
  assert.equal(sanitizeSeasonModifierState(null).schemaVersion, 1)
  assert.doesNotThrow(() => JSON.parse(values.get(SEASON_MODIFIER_STORAGE_KEY)))
})

test('storage refs and presets are isolated for two seasons', async () => {
  const { useSeasonModifierBuilds } = await import('../src/composables/useSeasonModifierBuilds.js')
  const first = useSeasonModifierBuilds('season-a'); const second = useSeasonModifierBuilds('season-b')
  first.setDraft(['first']); second.setDraft(['second'])
  assert.deepEqual(first.draft.value, ['first']); assert.deepEqual(second.draft.value, ['second'])
  first.savePreset('First', ['first'])
  assert.equal(first.presets.value.length, 1); assert.equal(second.presets.value.length, 0)
})

test('storage sanitizer fail-closes old schema and makes duplicate preset IDs unique', () => {
  const state = sanitizeSeasonModifierState({ schemaVersion: 99, seasons: { current: { draft: [' x ', 'x'], presets: [] } } })
  assert.deepEqual(Object.keys(state.seasons), [])
  const valid = sanitizeSeasonModifierState({ schemaVersion: 1, seasons: { current: { draft: [' x ', 'x'], presets: [{ id: 'same', name: 'a', modifierIds: [] }, { id: 'same', name: 'b', modifierIds: [] }] } } })
  assert.deepEqual(valid.seasons.current.draft, ['x'])
  assert.equal(new Set(valid.seasons.current.presets.map((preset) => preset.id)).size, 2)
})

test('storage writes rollback atomically when setItem throws', () => {
  let serialized = JSON.stringify({ schemaVersion: 1, seasons: {} })
  let fail = false
  const storage = { getItem: () => serialized, setItem: (_key, value) => { if (fail) throw new Error('quota'); serialized = value } }
  const store = createSeasonModifierBuildStore(storage)
  assert.equal(store.setDraft('season', ['x']).ok, true)
  const saved = store.savePreset('season', 'kept', ['x'])
  assert.equal(saved.ok, true)
  fail = true
  assert.equal(store.setDraft('season', ['y']).ok, false)
  assert.deepEqual(store.getSeason('season').draft, ['x'])
  assert.equal(store.savePreset('season', 'new', ['x']).ok, false)
  assert.equal(store.getSeason('season').presets.length, 1)
  assert.equal(store.removePreset('season', saved.id), false)
  assert.equal(store.getSeason('season').presets.length, 1)
  assert.equal(store.replace({ schemaVersion: 1, seasons: { season: { draft: ['replaced'], presets: [] } } }), false)
  assert.deepEqual(store.getSeason('season').draft, ['x'])
  assert.equal(store.getSeason('season').presets.length, 1)
  fail = false
  const roundTrip = createSeasonModifierBuildStore(storage)
  assert.deepEqual(roundTrip.getSeason('season').draft, ['x'])
  assert.equal(roundTrip.getSeason('season').presets.length, 1)
})

test('each achievement hint transitions from unmet to met using its modifier condition', () => {
  const cases = [
    ['dont-need-any-help', []],
    ['i-had-a-plan', ['no-flea-market', 'incompetent', 'broken-secure-container', 'exhaustion', 'osteoporosis', 'allergic', 'personality-vacuum', 'polydipsia', 'chronic-fatigue-syndrome', 'dr-jekyll']],
    ['one-is-good-two-is-better', ['kappa-protocol']],
    ['genetic-lottery', ['hemophilia', 'osteoporosis', 'polydipsia', 'allergic', 'third-leg']],
    ['we-have-hardcore-at-home', ['broken-secure-container', 'no-flea-market']],
    ['you-call-that-a-challenge', ['marathon-runner', 'youth', 'hercules', 'thrombophilia', 'hypodipsia']],
    ['entrepreneur-born-in-heaven', ['street-tax']],
  ]
  for (const [id, selected] of cases) {
    const beforeSelection = id === 'dont-need-any-help' ? ['street-tax'] : []
    const before = evaluateAchievementHints(beforeSelection, KORD_BREACH_SEASON).find((hint) => hint.id === id)
    const after = evaluateAchievementHints(selected, KORD_BREACH_SEASON).find((hint) => hint.id === id)
    assert.equal(before.met, false, id)
    assert.equal(after.met, true, id)
  }
})

test('Underdog is a Negative Modifier: +4 counted once, removed on deselection, and included in negative counts', () => {
  const baseline = evaluateSeasonModifierBuild(['street-tax'], KORD_BREACH_SEASON)
  assert.equal(evaluateSeasonModifierBuild([]).earned, 0)
  const enabled = evaluateSeasonModifierBuild(['street-tax', 'underdog', ' underdog '], KORD_BREACH_SEASON)
  assert.equal(enabled.negativeCount, baseline.negativeCount + 1)
  assert.equal(enabled.selected.filter(item => item.id === 'underdog').length, 1)
  assert.equal(enabled.selected.find(item => item.id === 'underdog').kind, 'negative')
  assert.equal(enabled.selected.find(item => item.id === 'underdog').points, 4)
  assert.equal(enabled.earned, baseline.earned + 4)
  assert.equal(enabled.spent, baseline.spent)
  assert.equal(enabled.balance, baseline.balance + 4)
  const removed = evaluateSeasonModifierBuild(enabled.selectedIds.filter(id => id !== 'underdog'))
  assert.equal(removed.earned, baseline.earned)
  assert.equal(removed.negativeCount, baseline.negativeCount)
  assert.equal(evaluateSeasonModifierBuild(['street-tax', 'underdog']).isPointValid, true)
})

test('Underdog is shown in the negative inventory and follows its existing achievement count rule', () => {
  assert.equal(KORD_BREACH_SEASON.negative.length, 15)
  const nine = KORD_BREACH_SEASON.negative.filter(item => item.id !== 'underdog').slice(0, 9).map(item => item.id)
  const before = evaluateAchievementHints(nine).find(hint => hint.id === 'i-had-a-plan')
  const after = evaluateAchievementHints([...nine, 'underdog']).find(hint => hint.id === 'i-had-a-plan')
  assert.equal(before.met, false)
  assert.equal(after.met, true)
  assert.equal(evaluateAchievementHints(['underdog']).find(hint => hint.id === 'dont-need-any-help').met, true)
})

test('prior preview-only Underdog IDs migrate through drafts, presets, imported state, and share links without duplication', () => {
  const values = new Map([[SEASON_MODIFIER_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, seasons: { [KORD_BREACH_SEASON.seasonId]: { draft: ['street-tax', 'underdog'], presets: [{ id: 'prior', name: 'old preview', modifierIds: ['underdog', 'underdog'] }] } } })]])
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  const id = KORD_BREACH_SEASON.seasonId
  const restored = createSeasonModifierBuildStore(storage)
  assert.deepEqual(restored.getSeason(id).draft, ['street-tax', 'underdog'])
  assert.deepEqual(restored.getSeason(id).presets[0].modifierIds, ['underdog'])
  assert.equal(evaluateSeasonModifierBuild(restored.getSeason(id).draft).earned, 4)
  assert.equal(evaluateSeasonModifierBuild(restored.getSeason(id).draft).negativeCount, 1)
  const imported = createSeasonModifierBuildStore({ getItem: () => null, setItem() {} })
  assert.equal(imported.replace(JSON.parse(JSON.stringify(restored.getState()))), true)
  assert.equal(evaluateSeasonModifierBuild(imported.getSeason(id).draft).earned, 4)
  const encoded = encodeSeasonModifierShare(id, restored.getSeason(id).draft)
  assert.deepEqual(decodeSeasonModifierShare(encoded).modifierIds, ['street-tax', 'underdog'])
  assert.equal(evaluateSeasonModifierBuild(decodeSeasonModifierShare(encoded).modifierIds).earned, 4)
})

test('invalid saved and shared Underdog inputs cannot grant points through flags or forged values', () => {
  const id = KORD_BREACH_SEASON.seasonId
  const saved = sanitizeSeasonModifierState({ schemaVersion: 1, seasons: { [id]: { draft: [true, { id: 'underdog', points: 400 }, '<underdog>'], bonus: true, underdog: true, presets: [] } } })
  assert.equal(evaluateSeasonModifierBuild(saved.seasons[id].draft).earned, 0)
  for (const m of [true, [true], [{ id: 'underdog', points: 400 }], ['<underdog>']]) {
    const encoded = Buffer.from(JSON.stringify({ v: 1, s: id, m })).toString('base64url')
    assert.equal(decodeSeasonModifierShare(encoded).ok, false)
  }
  assert.equal(evaluateSeasonModifierBuild({ underdog: true }).earned, 0)
})

test('invalid saved Underdog input and unrelated flags cannot grant points', () => {
  const id = KORD_BREACH_SEASON.seasonId
  const saved = sanitizeSeasonModifierState({ schemaVersion: 1, seasons: { [id]: { draft: [true, { id: 'underdog', points: 400 }, '<underdog>'], bonus: true, underdog: true, presets: [] } } })
  assert.equal(evaluateSeasonModifierBuild(saved.seasons[id].draft).earned, 0)
  for (const m of [true, [true], [{ id: 'underdog', points: 400 }], ['<underdog>']]) {
    const encoded = Buffer.from(JSON.stringify({ v: 1, s: id, m })).toString('base64url')
    assert.equal(decodeSeasonModifierShare(encoded).ok, false)
  }
  assert.equal(evaluateSeasonModifierBuild({ underdog: true }).earned, 0)
})
