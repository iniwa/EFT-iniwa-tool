import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { planPriorityTasks, aggregatePriorityTaskItems } from '../src/logic/priorityTasks.js'
import { buildFlowchartGateGraph } from '../src/logic/flowchartLogic.js'
import { evaluateTaskAvailability } from '../src/logic/taskLogic.js'
import { Graph } from 'dagre-d3-es/src/graphlib/index.js'
import { layout } from 'dagre-d3-es/src/dagre/index.js'

const fixture = JSON.parse(await readFile(new URL('./fixtures/priority-real-tasks.json', import.meta.url), 'utf8'))
const tasks = fixture.tasks
const id = name => { const task = tasks.find(t => t.name === name); assert.ok(task, name); return task.id }
const ids = plan => plan.tasks.map(t => t.id).sort()
const counts = plan => Object.fromEntries(Object.entries(aggregatePriorityTaskItems(plan.tasks, [])).flatMap(([category, items]) => items.map(item => [`${category}:${item.id}`, item.count])))

test('real simple chain counts handover once per task, excludes find objective and stops at completed prerequisite', () => {
  const goal = '596a204686f774576d4c95de', parent = '59689ee586f7740d1570bbd5'
  assert.equal(id('Sanitary Standards - Part 2'), goal)
  const plan = planPriorityTasks(tasks, [goal], [])
  assert.deepEqual(ids(plan), [parent, goal].sort())
  assert.deepEqual(counts(plan), { 'taskFir:590a3efd86f77437d351a25b': 4 })
  assert.equal(aggregatePriorityTaskItems(plan.tasks, []).taskFir[0].sources.length, 2)
  assert.deepEqual(counts(planPriorityTasks(tasks, [goal], [parent])), { 'taskFir:590a3efd86f77437d351a25b': 2 })
})

test('real shared prerequisite is counted once across two goals and duplicate priority IDs', () => {
  const goals = [id('The Blood of War - Part 2'), id('Sew it Good - Part 2')]
  const completed = [id('Fuel Crisis')], snapshot = JSON.stringify({tasks, goals, completed})
  const plan = planPriorityTasks(tasks, [...goals, goals[0]], completed)
  assert.deepEqual(ids(plan), [...goals, id('Sew it Good - Part 1')].sort())
  assert.deepEqual(counts(plan), {
    'taskFir:5b43575a86f77424f443fe62': 4,
    'taskFir:59e7643b86f7742cbf2c109a': 2,
    'taskFir:5648a69d4bdc2ded0b8b457b': 2,
    'taskFir:5ab8f20c86f7745cdb629fb2': 1,
    'taskFir:59e763f286f7742ee57895da': 1,
  })
  assert.equal(JSON.stringify({tasks, goals, completed}), snapshot)
})

test('real active bridge and active/complete branch include shared activation ancestors without requiring bridge handovers', () => {
  const goal = id('Out of Curiosity'), one = id('Chemical - Part 1'), two = id('Chemical - Part 2'), three = id('Chemical - Part 3'), four = id('Chemical - Part 4')
  const plan = planPriorityTasks(tasks, [goal], [])
  assert.deepEqual(ids(plan), [goal, one, three].sort())
  assert.deepEqual(counts(plan), { 'taskNormal:5780cfa52459777dfb276eb1': 1 })
  assert.ok(plan.issues.some(issue => issue.kind === 'alternative' && issue.taskId === two))
  assert.ok(!plan.tasks.some(t => [two, four].includes(t.id)))
  const alreadyActive = planPriorityTasks(tasks, [goal], [], { [four]: 'active' })
  assert.deepEqual(ids(alreadyActive), [goal])
  assert.deepEqual(counts(alreadyActive), {})
  const branchActive = planPriorityTasks(tasks, [goal], [], { [two]: 'active' })
  assert.deepEqual(ids(branchActive), [goal, three].sort())
  assert.deepEqual(counts(branchActive), {})
  assert.ok(planPriorityTasks(tasks, [goal], [four]).issues.some(issue => issue.kind === 'completed-conflict'))
})

test('active bridge never adds its own consumables but traverses its mandatory completion ancestors', () => {
  const req = (id, status = ['complete']) => ({task:{id},status})
  const task = (id, count, taskRequirements = []) => ({id,name:id,taskRequirements,objectives:[{type:'giveItem',items:[{id:'item',name:'Item'}],count,foundInRaid:true}]})
  const input = [task('parent', 3), task('bridge', 90, [req('parent')]), task('goal', 2, [req('bridge', ['active'])])]
  const plan = planPriorityTasks(input, ['goal'], [])
  assert.deepEqual(ids(plan), ['goal','parent'])
  assert.deepEqual(counts(plan), { 'taskFir:item': 5 })
  assert.deepEqual(ids(planPriorityTasks(input, ['goal'], [], {bridge:'active'})), ['goal'])
  const cyclic = [task('bridge', 90, [req('parent')]), task('parent', 3, [req('bridge', ['active'])]), input[2]]
  assert.deepEqual(ids(planPriorityTasks(cyclic, ['goal'], [])), ['goal'])
  assert.ok(planPriorityTasks(cyclic, ['goal'], []).issues.some(issue => issue.kind === 'cycle'))
})

test('chart-only PMC/LL removal retains reputation, raw task fields and eligibility checks', () => {
  const task = { ...tasks.find(t => t.name === 'Sanitary Standards - Part 2'), minPlayerLevel: 20,
    traderLevelRequirements: [
      {trader:{id:'therapist',name:'Therapist'},requirementType:'level',value:3},
      {trader:{id:'therapist',name:'Therapist'},requirementType:'reputation',value:0.4},
    ] }
  const snapshot = JSON.stringify(task), graph = buildFlowchartGateGraph([task])
  assert.ok(graph.nodes.every(n => n.kind !== 'level' && !n.key.includes(':LL:')))
  assert.ok(graph.nodes.some(n => n.key === 'trader:therapist:評判:>=:0.4'))
  const done = [id('Sanitary Standards')]
  const lowLevel = evaluateTaskAvailability(task, done, {playerLevel:19})
  assert.equal(lowLevel.levelMet, false); assert.equal(lowLevel.locked, true)
  const lowTrader = evaluateTaskAvailability(task, done, {playerLevel:20,traderRequirementsEnabled:true,traderProgress:{therapist:{level:2,reputation:0.5}}})
  assert.equal(lowTrader.locked, true)
  assert.equal(evaluateTaskAvailability(task, done, {playerLevel:20,traderRequirementsEnabled:true,traderProgress:{therapist:{level:3,reputation:0.5}}}).locked, false)
  assert.equal(JSON.stringify(task), snapshot)
})

test('actual Dagre LR ranks preserve real sequence and shared branching edges after gate removal', () => {
  const graph = new Graph().setGraph({rankdir:'LR',ranksep:50,nodesep:50}).setDefaultEdgeLabel(() => ({}))
  for (const task of tasks) graph.setNode(task.id, {width:200,height:40})
  for (const task of tasks) for (const req of task.taskRequirements) graph.setEdge(req.task.id, task.id, {minlen:1,weight:1})
  const gates = buildFlowchartGateGraph(tasks)
  for (const gate of gates.nodes) graph.setNode(gate.key, {width:200,height:40})
  for (const edge of gates.edges) graph.setEdge(edge.gateKey, edge.taskId, {minlen:1,weight:1})
  layout(graph)
  for (const task of tasks) for (const req of task.taskRequirements) {
    assert.ok(graph.node(req.task.id).x < graph.node(task.id).x, `${req.task.id} -> ${task.id}`)
    assert.ok(graph.edge(req.task.id, task.id).points.length >= 3)
  }
  assert.equal(graph.node(id('The Blood of War - Part 2')).x, graph.node(id('Sew it Good - Part 2')).x)
  assert.ok(graph.node(id('Chemical - Part 1')).x < graph.node(id('Out of Curiosity')).x)
})
