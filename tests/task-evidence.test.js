import test from 'node:test'
import assert from 'node:assert/strict'
import { applyTaskEvidence, CRISIS_REQUIREMENT_SOURCE } from '../src/logic/taskEvidence.js'
import { describeGlobalVariable, UNVERIFIED_GLOBAL_CONDITION_LABEL } from '../src/logic/globalConditionLabels.js'
import { PROGRESSION_CONDITION_LABELS } from '../src/data/progressionConditionLabels.js'
import { evaluateTaskAvailability } from '../src/logic/taskLogic.js'
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
