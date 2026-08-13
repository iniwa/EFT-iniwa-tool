import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveTaskReference, toHttpsUrl } from '../src/logic/taskReference.js'
import { getPrerequisiteClosure, formatTaskRequirementStatuses, getInitialSetupPlan } from '../src/logic/taskLogic.js'
import { getBulkCompletableStepIds } from '../src/logic/storyLogic.js'
import { getZoomedStageBounds, buildFlowchartGateGraph, formatMermaidDottedEdge } from '../src/logic/flowchartLogic.js'
import { calculateShoppingList } from '../src/logic/keyLogic.js'
import { isSameSource } from '../src/logic/shoppingLogic.js'

const tasks = [{ id: 'a', name: 'Duplicate' }, { id: 'b', name: 'Duplicate' }, { id: 'c', name: 'Unique' }]
test('task references prefer IDs and surface duplicate names', () => {
  assert.equal(resolveTaskReference({ id: 'b', name: 'Duplicate' }, tasks).task.id, 'b')
  assert.equal(resolveTaskReference('Duplicate', tasks).status, 'ambiguous')
  assert.equal(resolveTaskReference('Missing', tasks).status, 'not-found')
  assert.equal(resolveTaskReference('Unique', tasks).status, 'resolved')
  assert.equal(resolveTaskReference('Legacy alias', [{ id: 'd', name: '現行名', nameAliases: ['Legacy alias'] }]).task.id, 'd')
})
test('story bulk completion never selects choices', () => {
  const chapter = { phases: [{ steps: [{ id: 'check', type: 'check' }, { id: 'wait', type: 'wait' }, { id: 'choice', type: 'choice' }, { id: 'optional', type: 'check', optional: true }] }] }
  assert.deepEqual(getBulkCompletableStepIds(chapter), ['check', 'wait'])
})
test('dynamic outbound URLs permit HTTPS only', () => {
  assert.equal(toHttpsUrl('https://example.test/a'), 'https://example.test/a')
  assert.equal(toHttpsUrl('http://example.test'), null)
  assert.equal(toHttpsUrl('javascript:alert(1)'), null)
})
test('flowchart closure is cycle-safe and preserves requirement status labels', () => {
  const graph = [{ id: 'a', taskRequirements: [{ task: { id: 'b' } }] }, { id: 'b', taskRequirements: [{ task: { id: 'a' } }] }]
  assert.deepEqual(getPrerequisiteClosure('a', graph).sort(), ['a', 'b'])
  assert.equal(formatTaskRequirementStatuses(['active', 'failed']), '進行中/失敗')
})

test('initial flowchart setup distinguishes normal roots from cyclic status conflicts', () => {
  const acyclic = [
    { id: 'a', taskRequirements: [{ task: { id: 'b' }, status: ['complete'] }] },
    { id: 'b', taskRequirements: [] },
  ]
  assert.deepEqual(getInitialSetupPlan('a', acyclic), [
    { id: 'b', status: 'complete', conflict: false },
    { id: 'a', status: 'complete', conflict: false },
  ])

  const cyclic = [
    { id: 'a', taskRequirements: [{ task: { id: 'b' }, status: ['active'] }] },
    { id: 'b', taskRequirements: [{ task: { id: 'a' }, status: ['active'] }] },
  ]
  assert.deepEqual(getInitialSetupPlan('a', cyclic).find((entry) => entry.id === 'a'), {
    id: 'a',
    status: 'complete',
    conflict: true,
  })
})

test('flowchart stage bounds use measured SVG dimensions and zoom', () => {
  assert.deepEqual(getZoomedStageBounds(240.2, 99.1, 1.5), { width: 361, height: 149 })
  assert.deepEqual(getZoomedStageBounds(0, 0, 0), { width: 1, height: 1 })
})

test('flowchart dotted gate edges use Mermaid label syntax', () => {
  assert.equal(formatMermaidDottedEdge('g0', 't0', '＞= 1'), '  g0 -. ＞= 1 .-> t0\n')
  assert.equal(formatMermaidDottedEdge('g0', 't0'), '  g0 -.-> t0\n')
  assert.equal(formatMermaidDottedEdge('', 't0', '条件'), '')
})

test('flowchart gate graph includes explicit gates without inferring task links', () => {
  const tasks = [
    { id: 'a', minPlayerLevel: 10, factionName: 'USEC', requiredPrestige: 'p1', availableDelaySecondsMin: 3600, availableDelaySecondsMax: 7200,
      traderLevelRequirements: [{ trader: { id: 'prapor', name: 'Prapor' }, requirementType: 'level', value: 2, compareMethod: '>=' }],
      otherRequirements: [
        { type: 'globalVariable', variableId: 'var-1', compareMethod: '>=', value: 1 },
        { type: 'dialogue', traders: [{ id: 'therapist', name: 'Therapist' }] },
        { type: 'dialogue', traders: [{ id: 'duplicate-name-a', name: '同名' }] },
        { type: 'dialogue', traders: [{ id: 'duplicate-name-b', name: '同名' }] },
        { type: 'futureType' },
      ] },
    { id: 'b', minPlayerLevel: 10, otherRequirements: [{ type: 'globalVariable', variableId: 'var-1', compareMethod: '>=', value: 3 }] },
  ]
  const graph = buildFlowchartGateGraph(tasks)
  assert.equal(graph.nodes.some((node) => node.label.includes('ゲーム内変数 (ID: var-1)')), true)
  assert.equal(graph.nodes.filter((node) => node.key === 'global:var-1').length, 1)
  assert.equal(graph.nodes.some((node) => node.label.includes('出現待機: 1時間〜2時間')), true)
  assert.equal(graph.nodes.some((node) => node.label.includes('陣営: USEC')), true)
  assert.equal(graph.nodes.some((node) => node.label.includes('Prestige条件: p1')), true)
  assert.equal(graph.nodes.find((node) => node.key === 'level:10')?.automatic, true)
  assert.equal(graph.nodes.find((node) => node.key.startsWith('trader:'))?.automatic, true)
  assert.equal(graph.nodes.find((node) => node.key === 'faction:USEC')?.automatic, false)
  assert.equal(graph.nodes.find((node) => node.key === 'global:var-1')?.automatic, false)
  assert.equal(graph.nodes.filter((node) => node.kind === 'dialogue').length, 3)
  assert.equal(graph.edges.every((edge) => edge.gateKey && edge.taskId), true)
  assert.deepEqual(graph.edges.filter((edge) => edge.gateKey === 'global:var-1').map((edge) => edge.taskId), ['a', 'b'])
})

test('key task sources retain stable IDs and do not merge duplicate names', () => {
  const sources = []
  calculateShoppingList(
    [{ id: 'key', name: 'Key', types: ['keys'] }],
    [],
    [{ id: 'first', name: 'Duplicate', neededKeys: [{ keys: [{ id: 'key' }] }] }, { id: 'second', name: 'Duplicate', neededKeys: [{ keys: [{ id: 'key' }] }] }],
    (entry) => sources.push(entry),
  )
  assert.deepEqual(sources.map((entry) => entry.taskId).sort(), ['first', 'second'])
  assert.equal(isSameSource({ name: 'Task: Duplicate', taskId: 'first', type: 'task' }, { name: 'Task: Duplicate', taskId: 'second', type: 'task' }), false)
})
