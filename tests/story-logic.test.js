import test from 'node:test'
import assert from 'node:assert/strict'
import { MAIN_CHAPTERS } from '../src/data/storyChaptersMain.js'
import { SIDE_CHAPTERS } from '../src/data/storyChaptersSide.js'
import { STORY_META } from '../src/data/storyMeta.js'
import { isStepDone, getChapterStats, findNextStep, findUnmappedRecords, isRequiredStep, routeFromCaseChoice, isStepVisible, getBulkCompletableStepIds } from '../src/logic/storyLogic.js'

const chapters = [...MAIN_CHAPTERS, ...SIDE_CHAPTERS]
const chapter = { id: 'c', phases: [{ id: 'p', title: 'P', steps: [
  { id: 'a', type: 'check' }, { id: 'n', type: 'note' }, { id: 'o', type: 'check', optional: true },
  { id: 'ch', type: 'choice', options: [{ value: 'x' }, { value: 'y' }] },
  { id: 'h', type: 'check', showIf: { stepId: 'ch', value: 'x' } },
] }] }

test('every current chapter has evidence metadata and unique step IDs; legacy Boreas records remain separate', () => {
  for (const c of chapters) {
    assert.ok(STORY_META[c.id], c.id)
    assert.ok(STORY_META[c.id].sources.length && STORY_META[c.id].unlock.text)
    const ids = c.phases.flatMap(p => p.steps.map(s => s.id))
    assert.equal(new Set(ids).size, ids.length, c.id)
  }
  assert.equal(chapters.length, 10)
  assert.ok(!MAIN_CHAPTERS.some(c => c.id === 'boreas'))
  assert.equal(SIDE_CHAPTERS.find(c => c.id === 'boreas')?.category, 'side')
  assert.equal(STORY_META['boreas-reference'], undefined)
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

test('showIf references resolve, choices have options, and reference steps are never required', () => {
  for (const c of chapters) {
    const steps = new Map(c.phases.flatMap(p => p.steps).map(s => [s.id, s]))
    for (const s of steps.values()) {
      for (const cond of [].concat(s.showIf || [])) {
        const target = (cond.chapterId ? chapters.find(x => x.id === cond.chapterId) : c).phases.flatMap(p => p.steps).find(t => t.id === cond.stepId)
        assert.ok(target?.type === 'choice', c.id + ':' + s.id)
        assert.ok(target.options.some(o => o.value === cond.value), c.id + ':' + s.id)
        if (!cond.chapterId) {
          const order = [...steps.keys()]
          assert.ok(order.indexOf(target.id) < order.indexOf(s.id), c.id + ':' + s.id)
        }
      }
      if (s.type === 'choice') assert.ok(s.options?.length >= 2, s.id)
      if (s.reference) assert.equal(isRequiredStep(s), false)
    }
  }
})

test('Falling Skies case choice maps only the three known values to a Ticket route; unknown values never auto-select', () => {
  assert.equal(routeFromCaseChoice('give'), 'prapor')
  assert.equal(routeFromCaseChoice('pretend'), 'prapor')
  assert.equal(routeFromCaseChoice('keep'), 'mechanic')
  for (const v of ['old', '', null, undefined, true, 'Keep']) assert.equal(routeFromCaseChoice(v), null)
  const fs = chapters.find(c => c.id === 'falling_skies').phases.flatMap(p => p.steps).find(s => s.id === 'fs_case_choice')
  assert.deepEqual(fs.options.map(o => o.value).sort(), ['give', 'keep', 'pretend'])
})

test('The Ticket route steps follow the chosen branch; old ending record is kept but not applied', () => {
  const t = chapters.find(c => c.id === 'the_ticket')
  const step = id => t.phases.flatMap(p => p.steps).find(s => s.id === id)
  const p = (route, offer, extra = {}) => ({ the_ticket: { tt_route_choice: route, tt_kerman_offer: offer, ...extra } })
  assert.equal(isStepVisible(step('tt_survivor_kills_50'), t, p('mechanic', 'refuse')), true)
  assert.equal(isStepVisible(step('tt_survivor_kills_50'), t, p('prapor', 'refuse')), false)
  assert.equal(isStepVisible(step('tt_case_workbench'), t, p('prapor', 'accept')), false)
  assert.equal(isStepVisible(step('tt_prapor_camp'), t, p('mechanic', 'accept')), false)
  const old = { the_ticket: { tt_ending: 'savior', tt_major_evidence: true } }
  assert.equal(findUnmappedRecords(chapters, old).some(r => r.stepId === 'tt_ending'), true)
  assert.equal(isStepVisible(step('tt_fence_rep'), t, old), false)

  const evidence = { tt_evidence_agree: 'agree', tt_cooperation: 'expose' }
  assert.equal(isStepVisible(step('tt_fence_rep'), t, p('mechanic', 'accept', evidence)), true)
  assert.equal(isStepVisible(step('tt_fence_rep'), t, p('mechanic', 'refuse', evidence)), false)
  assert.equal(isStepVisible(step('tt_bitcoin_pay'), t, p('mechanic', 'accept', { tt_rfid_route: 'lab' })), false)
  assert.equal(isStepVisible(step('tt_bitcoin_pay'), t, p('mechanic', 'accept', { tt_rfid_route: 'elektronik' })), true)
})

test('reference steps stay out of counts, next step and bulk completion', () => {
  const ch = { id: 'r', phases: [{ id: 'p', steps: [{ id: 'a', type: 'check', reference: true }, { id: 'b', type: 'check' }] }] }
  assert.deepEqual(getChapterStats(ch, {}), { done: 0, total: 1, complete: false })
  assert.equal(findNextStep(ch, {}).step.id, 'b')
  assert.deepEqual(getBulkCompletableStepIds(ch), ['b'])
})

test('They Are Already Here: reset branch gates the specification step', () => {
  const t = chapters.find(c => c.id === 'they_are_already_here')
  const steps = t.phases.flatMap(p => p.steps)
  const spec = steps.find(s => s.id === 'th_read_spec')
  const completed = Object.fromEntries(steps.filter(s => s.type === 'check').map(s => [s.id, true]))
  const skipped = { [t.id]: { ...completed, th_reset_choice: 'skipped' } }
  const pressed = { [t.id]: { ...completed, th_reset_choice: 'pressed' } }
  assert.equal(isStepVisible(spec, t, skipped), false)
  assert.equal(isStepVisible(spec, t, pressed), true)
  assert.equal(getChapterStats(t, skipped).complete, false)
  assert.equal(getChapterStats(t, pressed).complete, true)
})

test('legacy checks with different objectives stay in storage without completing new steps', () => {
  const saved = { tour: { t_woods_extract: true }, the_ticket: { tt_survivor_ssd: true }, batya: { ba_cultist_photo: true } }
  for (const [chapterId, records] of Object.entries(saved)) {
    const chapter = chapters.find(c => c.id === chapterId)
    assert.equal(getChapterStats(chapter, saved).done, 0)
    assert.equal(findUnmappedRecords(chapters, saved).some(record => record.stepId === Object.keys(records)[0]), true)
  }
})

test('Boreas counts manual milestones and requires the in-game report for chapter completion', () => {
  const boreas = chapters.find(c => c.id === 'boreas')
  const milestones = boreas.phases.flatMap(phase => phase.steps).filter(isRequiredStep)
  const report = milestones.at(-1)
  assert.equal(report.id, 'boreas_report_received')
  assert.deepEqual(getBulkCompletableStepIds(boreas), [])
  const old = { 'boreas-reference': { '69a05f6893647652e0182471': true } }
  assert.equal(getChapterStats(boreas, old).done, 0)
  const progress = { boreas: Object.fromEntries(milestones.slice(0, -1).map(step => [step.id, true])) }
  assert.equal(getChapterStats(boreas, progress).complete, false)
  assert.equal(findNextStep(boreas, progress).step.id, report.id)
  progress.boreas[report.id] = true
  assert.equal(getChapterStats(boreas, progress).complete, true)
  assert.equal(progress.boreas.boreas_direct_access, undefined)
})
