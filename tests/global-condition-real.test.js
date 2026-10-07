import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describeGlobalVariable, UNVERIFIED_GLOBAL_CONDITION_LABEL } from '../src/logic/globalConditionLabels.js'
import { buildFlowchartGateGraph } from '../src/logic/flowchartLogic.js'
import { formatGlobalVariable } from '../src/logic/taskObjectiveLogic.js'

const fixture = JSON.parse(await readFile(new URL('./fixtures/global-conditions-real.json', import.meta.url), 'utf8'))

test('all current real unlock variables retain uncertain semantics and exact graph predicates', () => {
  assert.equal(fixture.unlocks.length, 27)
  assert.equal(fixture.provenance.mode, 'regular')
  const byTask = new Map()
  for (const group of fixture.unlocks) {
    for (const usage of group.usages) {
      const c = usage.condition
      assert.equal(c.variableId, group.variableId)
      const info = describeGlobalVariable(c)
      assert.equal(info.label, UNVERIFIED_GLOBAL_CONDITION_LABEL)
      assert.equal(info.verified, false)
      assert.equal(info.variableId, c.variableId)
      assert.equal(info.compareMethod, c.compareMethod)
      assert.equal(info.value, c.value)
      if (!byTask.has(usage.taskId)) byTask.set(usage.taskId, { id: usage.taskId, name: usage.name, otherRequirements: [] })
      byTask.get(usage.taskId).otherRequirements.push(c)
    }
  }
  const tasks = [...byTask.values()], before = JSON.stringify(tasks)
  const graph = buildFlowchartGateGraph(tasks)
  assert.equal(graph.nodes.length, 27)
  assert.equal(graph.edges.length, 168)
  assert.ok(graph.nodes.every(n => n.verified === false && n.automatic === false))
  for (const group of fixture.unlocks) {
    assert.ok(graph.nodes.some(n => n.key === `global:${group.variableId}`))
    for (const usage of group.usages) assert.ok(graph.edges.some(e => e.taskId === usage.taskId && e.gateKey === `global:${group.variableId}` && e.label === `${usage.condition.compareMethod} ${usage.condition.value}`))
  }
  assert.equal(JSON.stringify(tasks), before)
  const crisis = fixture.unlocks.find(g => g.variableId === '6a56925b1c30ba5a77c7c518').usages.find(u => u.taskId === '60e71c48c1bfa3050473b8e5')
  assert.equal(crisis.name, 'Crisis')
  assert.equal(crisis.condition.value, 1)
  assert.ok(!describeGlobalVariable(crisis.condition).label.includes('LL4'))
})

test('real English objective association alone does not define general variable semantics', () => {
  assert.equal(fixture.objectives.length, 4)
  assert.equal(new Set(fixture.objectives.map(o => o.globalVariable.id)).size, 2)
  for (const o of fixture.objectives) {
    assert.ok(o.description)
    assert.equal(describeGlobalVariable(o.globalVariable).verified, false)
    assert.equal(formatGlobalVariable(o.globalVariable), UNVERIFIED_GLOBAL_CONDITION_LABEL)
    for (const value of [0, 1, 2, 3]) assert.equal(describeGlobalVariable({ ...o.globalVariable, value }).verified, false)
  }
  assert.equal(fixture.objectives.find(o => o.name === 'A Bitter Victory').description, 'Talk to the BTR Driver')
  assert.ok(fixture.objectives.filter(o => o.name === 'Bullshit').every(o => o.description.includes('Rogues or The Goons on Lighthouse')))
})
