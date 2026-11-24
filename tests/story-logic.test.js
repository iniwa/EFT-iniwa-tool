import test from 'node:test'
import assert from 'node:assert/strict'
import { MAIN_CHAPTERS } from '../src/data/storyChaptersMain.js'
import { SIDE_CHAPTERS } from '../src/data/storyChaptersSide.js'
import { STORY_META } from '../src/data/storyMeta.js'
import { isStepDone, getChapterStats, findNextStep, findUnmappedRecords } from '../src/logic/storyLogic.js'

const chapters = [...MAIN_CHAPTERS, ...SIDE_CHAPTERS]
const chapter = { id: 'c', phases: [{ id: 'p', title: 'P', steps: [
  { id: 'a', type: 'check' }, { id: 'n', type: 'note' }, { id: 'o', type: 'check', optional: true },
  { id: 'ch', type: 'choice', options: [{ value: 'x' }, { value: 'y' }] },
  { id: 'h', type: 'check', showIf: { stepId: 'ch', value: 'x' } },
] }] }

test('every current chapter has evidence metadata and unique step IDs; Boreas is reference only', () => {
  for (const c of chapters) {
    assert.ok(STORY_META[c.id], c.id)
    assert.ok(STORY_META[c.id].sources.length && STORY_META[c.id].unlock.text)
    const ids = c.phases.flatMap(p => p.steps.map(s => s.id))
    assert.equal(new Set(ids).size, ids.length, c.id)
  }
  assert.equal(chapters.length, 9)
  assert.equal(STORY_META['boreas-reference'].confidence, 'reference')
})

test('legacy chapter and step IDs persist so old saves map to the current data', () => {
  const legacy = { tour: { t_gz_extract: true }, falling_skies: { fs_case_choice: 'keep' }, the_ticket: { tt_route_choice: 'mechanic' }, blue_fire: { bf_fragment_choice: 'give' } }
  assert.deepEqual(findUnmappedRecords(chapters, legacy), [])
  assert.equal(getChapterStats(chapters.find(c => c.id === 'tour'), legacy).done, 1)
})

test('unknown chapters, steps and stale choice values are kept out of clear counts', () => {
  const progress = { c: { a: true, ch: 'old', gone: true }, removed: { z: true } }
  assert.deepEqual(findUnmappedRecords([chapter], progress).map(r => r.reason).sort(), ['chapter', 'step', 'value'])
  assert.equal(isStepDone(chapter.phases[0].steps[3], 'old'), false)
  assert.deepEqual(getChapterStats(chapter, progress), { done: 1, total: 2, complete: false })
})

test('branch-gated steps count only for the chosen route; next step skips notes and optional', () => {
  assert.equal(getChapterStats(chapter, { c: { a: true, ch: 'y' } }).complete, true)
  const withX = { c: { a: true, ch: 'x' } }
  assert.equal(getChapterStats(chapter, withX).total, 3)
  assert.equal(findNextStep(chapter, withX).step.id, 'h')
  assert.equal(findNextStep(chapter, { c: { a: true, ch: 'y' } }), null)
})
