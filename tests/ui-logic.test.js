import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveTaskReference, toHttpsUrl } from '../src/logic/taskReference.js'
import { getPrerequisiteClosure, formatTaskRequirementStatuses, getInitialSetupPlan } from '../src/logic/taskLogic.js'
import { getBulkCompletableStepIds } from '../src/logic/storyLogic.js'
import { getZoomedStageBounds } from '../src/logic/flowchartLogic.js'
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
