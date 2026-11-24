import test from 'node:test'
import assert from 'node:assert/strict'
import { PROGRESSION_TASK_POOLS } from '../src/data/progressionTaskPools.js'
import { getProgressionPoolCounts, getTaskProgressionChecks } from '../src/logic/globalConditionLabels.js'
import { convertMainData } from '../src/logic/jsonApiAdapter.js'
import { filterActiveTasks, getRequiredPlayerLevel } from '../src/logic/taskLogic.js'

test('explicit LL conditions use the trader API level floor for the active list', () => {
  const traderId = 'prapor'
  const { traderLoyalty } = convertMainData({
    tasksRaw: {}, questItemsRaw: {}, hideoutRaw: {}, itemsRaw: {}, mapsRaw: {}, craftsRaw: {},
    tradersRaw: {
      [traderId]: { id: traderId, name: 'Prapor', levels: [
        { level: 3, requiredPlayerLevel: 21 }, { level: 1, requiredPlayerLevel: 0 },
        { level: 2, requiredPlayerLevel: 6 }, { level: 4, requiredPlayerLevel: null }, null,
      ] },
    },
  })
  assert.deepEqual(traderLoyalty[0].levels, [
    { level: 1, requiredPlayerLevel: 0 }, { level: 2, requiredPlayerLevel: 6 },
    { level: 3, requiredPlayerLevel: 21 },
  ])
  const requirement = { trader: { id: traderId }, requirementType: 'level', value: 2 }
  const task = { id: 'explicit', name: 'Explicit', minPlayerLevel: 2, traderLevelRequirements: [requirement] }
  const traderLoyaltyById = { [traderId]: traderLoyalty[0] }
  const options = { traderLoyaltyById, playerLevel: 5 }
  assert.deepEqual(filterActiveTasks([task], [], options), [])
  assert.deepEqual(filterActiveTasks([task], [], { ...options, showFuture: true }), [task])
  assert.deepEqual(filterActiveTasks([task], [], { ...options, playerLevel: 6 }), [task])
  assert.deepEqual(filterActiveTasks([task], [], { ...options, playerLevel: 0 }), [task])
  assert.deepEqual(filterActiveTasks([task], [task.id], { ...options, showCompleted: true }), [task])
  assert.deepEqual(filterActiveTasks([task], [], { playerLevel: 5 }), [task])
  assert.equal(getRequiredPlayerLevel({ ...task, minPlayerLevel: 10 }, traderLoyaltyById), 10)
  assert.equal(getRequiredPlayerLevel({ ...task, traderLevelRequirements: [
    { ...requirement, requirementType: 'reputation' },
  ] }, traderLoyaltyById), 2)
  assert.deepEqual(filterActiveTasks([task], [], {
    ...options, playerLevel: 6, traderRequirementsEnabled: true, traderProgress: { prapor: { level: 1 } },
  }), [])
})

test('community counts are advisory and require the full pool in the active catalog', () => {
  const variableId = '6a20540cf1b67a977cc5a088'
  const pool = PROGRESSION_TASK_POOLS[variableId]
  const catalog = pool.map(id => ({ id }))
  const requirement = { type: 'globalVariable', variableId, compareMethod: '>=', value: 2 }
  const task = { id: 'gate', name: 'Gate', otherRequirements: [requirement] }
  const checks = counts => getTaskProgressionChecks(task, getProgressionPoolCounts(...counts))

  assert.equal(Object.keys(PROGRESSION_TASK_POOLS).length, 23)
  assert.ok(Object.values(PROGRESSION_TASK_POOLS).every(ids => ids.length > 0 && ids.length === new Set(ids).size))
  assert.deepEqual(checks([catalog, [pool[0], pool[0], 'unrelated']]), [
    { trader: 'Prapor', tier: 1, count: 1, required: 2 },
  ])
  assert.equal(checks([catalog.slice(1), [pool[0]]])[0].count, null)
  assert.deepEqual(filterActiveTasks([task], [], { playerLevel: 1 }), [task])
  assert.equal(getTaskProgressionChecks({ otherRequirements: [
    { ...requirement, variableId: '6a3cf95c6b35530c4a4f532e' },
  ] }, getProgressionPoolCounts(catalog, []))[0].count, null)
  assert.deepEqual(getTaskProgressionChecks({ otherRequirements: [
    { ...requirement, compareMethod: '==' },
  ] }, getProgressionPoolCounts(catalog, [])), [])
})
