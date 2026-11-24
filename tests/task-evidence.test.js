import test from 'node:test'
import assert from 'node:assert/strict'
import { applyTaskCatalogEvidence, applyTaskEvidence, CRISIS_REQUIREMENT_SOURCE } from '../src/logic/taskEvidence.js'
import { describeGlobalVariable, UNVERIFIED_GLOBAL_CONDITION_LABEL } from '../src/logic/globalConditionLabels.js'
import { PROGRESSION_CONDITION_LABELS } from '../src/data/progressionConditionLabels.js'
import { evaluateTaskAvailability, filterActiveTasks, getPrerequisiteClosure } from '../src/logic/taskLogic.js'
import { buildFlowchartGateGraph } from '../src/logic/flowchartLogic.js'

test('23 observed and four unresolved groups have qualified labels, not calculated completion', () => {
  const entries = Object.entries(PROGRESSION_CONDITION_LABELS)
  assert.equal(entries.length, 27)
  assert.equal(entries.filter(([,e]) => e.verification === 'verified').length, 23)
  assert.deepEqual(entries.filter(([,e]) => e.verification === 'unresolved').map(([,e]) => e.trader + ':' + e.tier).sort(), ['Mechanic:3','Mechanic:4','Prapor:4','Ragman:1'])
  for (const [id, entry] of entries) {
    const info = describeGlobalVariable({variableId:id,compareMethod:'>=',value:1})
    assert.ok(info.label.includes(entry.trader + ' Tier ' + entry.tier))
    assert.ok(info.label.includes(entry.verification === 'verified' ? 'コミュニティ観測・参考' : '推定・未確定'))
    assert.equal(info.verified, false)
    assert.equal(info.sourceRevision, '1.1.0')
    assert.equal(Object.hasOwn(entry,'taskIds'), false)
    for (const value of [undefined,null,false,'1',0,6,Infinity,1.5]) assert.equal(describeGlobalVariable({id,compareMethod:'>=',value}).label, UNVERIFIED_GLOBAL_CONDITION_LABEL)
    for (const compareMethod of ['==','<=','>','!=',undefined]) assert.equal(describeGlobalVariable({id,compareMethod,value:1}).label, UNVERIFIED_GLOBAL_CONDITION_LABEL)
  }
})

test('Crisis receives separate sourced LL4 with unknown variable preserved, chart hiding and optional eligibility intact', () => {
  const variable={type:'globalVariable',variableId:'6a56925b1c30ba5a77c7c518',compareMethod:'>=',value:1}
  const raw={id:'60e71c48c1bfa3050473b8e5',name:'Crisis',minPlayerLevel:38,traderLevelRequirements:[],taskRequirements:[],otherRequirements:[variable]}
  const before=JSON.stringify(raw), task=applyTaskEvidence(raw)
  assert.equal(JSON.stringify(raw),before)
  assert.equal(task.otherRequirements,raw.otherRequirements)
  assert.equal(task.taskRequirements,raw.taskRequirements)
  assert.equal(task.traderLevelRequirements.length,1)
  assert.equal(task.traderLevelRequirements[0].value,4)
  assert.equal(task.traderLevelRequirements[0].sourceUrl,CRISIS_REQUIREMENT_SOURCE)
  assert.equal(applyTaskEvidence(task),task)
  const upstream={...raw,traderLevelRequirements:[{trader:{id:'54cb57776803fa99248b456e'},requirementType:'level',value:3}]}
  assert.equal(applyTaskEvidence(upstream),upstream)
  assert.equal(applyTaskEvidence({id:'unrelated'}).id,'unrelated')
  for(const [level,locked] of [[3,true],[4,false]]) assert.equal(evaluateTaskAvailability(task,[],{playerLevel:38,traderRequirementsEnabled:true,traderProgress:{'54cb57776803fa99248b456e':{level}}}).locked,locked)
  assert.equal(evaluateTaskAvailability(task,[],{playerLevel:37}).locked,true)
  assert.equal(evaluateTaskAvailability(task,[],{playerLevel:38,traderRequirementsEnabled:false}).locked,false)
  const graph=buildFlowchartGateGraph([task]);assert.equal(graph.nodes.length,1)
  assert.equal(graph.nodes[0].key,'global:'+variable.variableId)
  assert.equal(graph.nodes[0].automatic,false)
  assert.ok(!graph.nodes[0].label.includes('LL4'))
})


test('shared variable nodes stay unknown when any sibling uses an unsupported predicate', () => {
  const id='6a56925b1c30ba5a77c7c518'
  const known={type:'globalVariable',variableId:id,compareMethod:'>=',value:1}
  const unsupported={...known,compareMethod:'==',value:0}
  for(const requirements of [[known,unsupported],[unsupported,known]]) {
    const graph=buildFlowchartGateGraph([{id:'a',otherRequirements:requirements}])
    assert.equal(graph.nodes.length,1)
    assert.equal(graph.nodes[0].label,UNVERIFIED_GLOBAL_CONDITION_LABEL+' #1')
    assert.equal(graph.nodes[0].sourceUrl,undefined)
    assert.deepEqual(graph.edges.map(e=>e.label).sort(),['== 0','>= 1'].sort())
    assert.equal(graph.nodes[0].automatic,false)
  }
})

test('Lightkeeper evidence adds missing game IDs after retrieval, scoped to PvE and regular PvP', () => {
  const upstream = [{ id: '63966faeea19ac7ed845db2c', name: 'Information Source', taskRequirements: [] }]
  const start = '6a880acc9216d0f5aa078305'
  const next = '6a880f5d9438980c42076efe'
  const end = '625d700cc48e6c62a440fab5'
  const mode = 'pve'
  const tasks = applyTaskCatalogEvidence(upstream, mode)
  assert.equal(tasks.length, 12)
  assert.equal(new Set(tasks.map((task) => task.id)).size, 12)
  assert.equal(upstream.length, 1)
  assert.strictEqual(tasks[0], upstream[0])
  assert.strictEqual(applyTaskCatalogEvidence(upstream, 'pvp-season'), upstream)
  assert.equal(applyTaskCatalogEvidence([], mode).length, 0)
  assert.deepEqual(applyTaskCatalogEvidence(upstream, 'regular'), tasks)
  assert.strictEqual(applyTaskCatalogEvidence(tasks, mode), tasks)
  assert.deepEqual(filterActiveTasks(tasks, [], { showLightkeeperOnly: true }).map(t => t.id), [start])
  assert.deepEqual(filterActiveTasks(tasks, [start], { showLightkeeperOnly: true }).map(t => t.id), [next])
  assert.equal(getPrerequisiteClosure(end, tasks).length, 9)
  assert.equal(tasks.find(t => t.id === start).catalogEvidence.checkedAt, '2026-11-24')

  const newer = { id: start, name: '公式のタスク', lightkeeperRequired: false, taskRequirements: [{ status: ['active'] }] }
  const merged = applyTaskCatalogEvidence([...upstream, newer], mode)
  assert.strictEqual(merged.find(t => t.id === start), newer)
  assert.deepEqual(merged.find(t => t.id === next).taskRequirements, [{
    task: { id: start, name: newer.name }, status: ['complete'],
  }])
})
