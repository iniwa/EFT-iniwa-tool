import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describeGlobalVariable, UNVERIFIED_GLOBAL_CONDITION_LABEL } from '../src/logic/globalConditionLabels.js'
import { formatGlobalVariable } from '../src/logic/taskObjectiveLogic.js'
import { buildFlowchartGateGraph } from '../src/logic/flowchartLogic.js'
import { getBulkCompletableStepIds } from '../src/logic/storyLogic.js'
import { MAIN_CHAPTERS } from '../src/data/storyChaptersMain.js'
import { SIDE_CHAPTERS } from '../src/data/storyChaptersSide.js'

test('opaque IDs and suggestive names never receive invented meanings or automatic verification', () => {
  for (const id of ['opaque-id', 'TourComplete', 'icebreaker_unlocked', '__proto__', '<script>fake</script>']) {
    const info = describeGlobalVariable({ variableId: id, compareMethod: '==', value: 0 })
    assert.equal(info.label, UNVERIFIED_GLOBAL_CONDITION_LABEL)
    assert.equal(info.verified, false); assert.equal(info.variableId, id)
    assert.ok(!info.label.includes(id)); assert.ok(info.technical.includes(id)); assert.ok(info.technical.includes('==')); assert.ok(info.technical.endsWith('0'))
  }
})
test('unlock and objective variable shapes share unverified labels while exact comparison/value remains inspectable', () => {
  const unlock = { variableId: 'same-id', compareMethod: '<=', value: 3 }, objective = { id: 'same-id', compareMethod: '<=', value: 3 }
  assert.deepEqual(describeGlobalVariable(unlock), describeGlobalVariable(objective))
  assert.equal(formatGlobalVariable(objective), UNVERIFIED_GLOBAL_CONDITION_LABEL)
  assert.equal(formatGlobalVariable('same-id'), UNVERIFIED_GLOBAL_CONDITION_LABEL)
  assert.equal(describeGlobalVariable(null).variableId, null)
  assert.ok(describeGlobalVariable({ id: 'a', value: false }).technical.endsWith('false'))
  assert.ok(describeGlobalVariable({ id: 'a', value: null }).technical.endsWith('null'))
})
test('unknown gates preserve distinct identities, shared threshold edges, exact task IDs and automatic:false', () => {
  const requirements = [{ type: 'globalVariable', variableId: 'v-a', compareMethod: '>=', value: 1 }, { type: 'globalVariable', variableId: 'v-b', compareMethod: '==', value: 0 }]
  const tasks = [{ id: 'first', name: 'Duplicate', otherRequirements: requirements }, { id: 'second', name: 'Duplicate', otherRequirements: [{ ...requirements[0], value: 3 }] }]
  const snapshot = JSON.stringify(tasks), graph = buildFlowchartGateGraph(tasks)
  assert.equal(graph.nodes.length, 2)
  assert.deepEqual(graph.nodes.map(n => n.key), ['global:v-a', 'global:v-b'])
  assert.deepEqual(graph.nodes.map(n => n.label), [UNVERIFIED_GLOBAL_CONDITION_LABEL + ' #1', UNVERIFIED_GLOBAL_CONDITION_LABEL + ' #2'])
  assert.ok(graph.nodes.every(n => n.automatic === false && n.verified === false))
  assert.deepEqual(graph.edges.map(e => [e.taskId, e.label]), [['first', '>= 1'], ['first', '== 0'], ['second', '>= 3']])
  assert.ok(graph.edges[2].technical.includes('v-a') && graph.edges[2].technical.endsWith('3'))
  assert.equal(JSON.stringify(tasks), snapshot)
})
test('story progress identities/choices remain unchanged; no unverified Icebreaker checklist is introduced', () => {
  const chapters = [...MAIN_CHAPTERS, ...SIDE_CHAPTERS]
  assert.equal(chapters.some(chapter => chapter.id === 'icebreaker'), false)
  assert.equal(new Set(chapters.map(c => c.id)).size, chapters.length)
  const ids = chapters.flatMap(c => c.phases.flatMap(p => p.steps.map(s => s.id)))
  assert.equal(new Set(ids).size, ids.length)
  const falling = chapters.find(c => c.id === 'falling_skies')
  assert.ok(falling.phases.flatMap(p => p.steps).some(s => s.id === 'fs_case_choice' && s.type === 'choice'))
  assert.ok(!getBulkCompletableStepIds(falling).includes('fs_case_choice'))
})
test('task and graph technical details are opt-in native details and unsupported semantics remain documented', async () => {
  const modal = await readFile(new URL('../src/components/TaskModal.vue', import.meta.url), 'utf8')
  const graph = await readFile(new URL('../src/components/FlowchartView.vue', import.meta.url), 'utf8')
  const evidence = await readFile(new URL('../docs/icebreaker-verification-2026-10-07.md', import.meta.url), 'utf8')
  assert.match(modal, /<details v-if="requirement.type === 'globalVariable'"/)
  assert.match(modal, /<details v-if="obj.globalVariable"/)
  assert.match(graph, /<details v-if="chartGateDetails.length"/)
  assert.ok(!/<details[^>]*\bopen\b/.test(modal) && !/<details[^>]*\bopen\b/.test(graph))
  assert.ok(evidence.includes('2026-10-07') && evidence.includes('blocked by robots.txt') && evidence.includes('No Icebreaker sequence'))
})
