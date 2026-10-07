import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRenderer, markRaw, nextTick } from 'vue'
import { parse, compileScript } from '@vue/compiler-sfc'
import { planPriorityTasks, aggregatePriorityTaskItems } from '../src/logic/priorityTasks.js'
import { calculateShoppingList } from '../src/logic/taskLogic.js'

const item = { id: 'item', name: 'Shared item' }
const task = (id, count = 1, requirements = [], extras = {}) => ({ id, name: id, taskRequirements: requirements, objectives: [{ type: 'giveItem', items: [item], count, foundInRaid: true, description: id + ' FIR handover' }], ...extras })
const req = (id, status = ['complete']) => ({ task: { id }, status })
const ids = plan => plan.tasks.map(t => t.id).sort()
test('shared AND prerequisites and duplicate priorities are deduplicated before consumable aggregation', () => {
  const tasks = [task('shared', 5), task('a', 2, [req('shared')]), task('b', 3, [req('shared')]), task('unrelated', 99)]
  const snapshot = JSON.stringify(tasks)
  const plan = planPriorityTasks(tasks, ['a', 'b', 'a'], [])
  assert.deepEqual(ids(plan), ['a', 'b', 'shared']); assert.equal(plan.issues.length, 0)
  const row = aggregatePriorityTaskItems(plan.tasks, []).taskFir[0]
  assert.equal(row.count, 10); assert.deepEqual(row.sources.map(s => s.taskId).sort(), ['a', 'b', 'shared'])
  assert.equal(JSON.stringify(tasks), snapshot)
})
test('completed prerequisites stop traversal and completed prioritized tasks require no items', () => {
  const tasks = [task('old', 100), task('done', 20, [req('old')]), task('goal', 2, [req('done')])]
  assert.deepEqual(ids(planPriorityTasks(tasks, ['goal'], ['done'])), ['goal'])
  assert.deepEqual(ids(planPriorityTasks(tasks, ['goal'], ['goal'])), [])
  assert.deepEqual(planPriorityTasks(tasks, [], []).goals, [])
})
test('allowed completion OR failure does not sum alternative completion-route items', () => {
  const tasks = [task('ancestor', 100), task('choice', 50, [req('ancestor')]), task('goal', 2, [req('choice', ['complete', 'failed'])])]
  const plan = planPriorityTasks(tasks, ['goal'], [])
  assert.deepEqual(ids(plan), ['goal']); assert.deepEqual(plan.issues[0].allowed, ['complete', 'failed'])
  assert.equal(aggregatePriorityTaskItems(plan.tasks, []).taskFir[0].count, 2)
  assert.equal(planPriorityTasks(tasks, ['goal'], [], { choice: 'failed' }).issues.length, 0)
})
test('separate mandatory completion constraint can resolve status alternatives without mutating selection', () => {
  const tasks = [task('choice', 5), task('a', 2, [req('choice', ['complete', 'failed'])]), task('b', 3, [req('choice')])]
  const priorities = ['a', 'b'], progress = { choice: 'active' }
  const plan = planPriorityTasks(tasks, priorities, [], progress)
  assert.deepEqual(ids(plan), ['a', 'b', 'choice']); assert.equal(plan.issues.length, 0)
  assert.deepEqual(priorities, ['a', 'b']); assert.deepEqual(progress, { choice: 'active' })
})
test('incompatible status paths, failed goals and irreversible completed mismatches are reported without false prerequisites', () => {
  const tasks = [task('shared', 20), task('a', 2, [req('shared')]), task('b', 3, [req('shared', ['failed'])])]
  const plan = planPriorityTasks(tasks, ['a', 'b'], [])
  assert.deepEqual(ids(plan), ['a', 'b']); assert.ok(plan.issues.some(i => i.kind === 'conflict'))
  assert.deepEqual(ids(planPriorityTasks(tasks, ['a'], [], { a: 'failed' })), [])
  assert.ok(planPriorityTasks(tasks, ['b'], ['shared']).issues.some(i => i.kind === 'completed-conflict'))
})
test('active-only prerequisite quantities are not treated as mandatory handover; already active is satisfied', () => {
  const tasks = [task('start', 100), task('goal', 2, [req('start', ['active'])])]
  assert.deepEqual(ids(planPriorityTasks(tasks, ['goal'], [])), ['goal'])
  assert.equal(planPriorityTasks(tasks, ['goal'], [], { start: 'active' }).issues.length, 0)
})
test('cycles and missing IDs are bounded, reported and never silently map by duplicate name', () => {
  const tasks = [task('a', 2, [req('b')]), task('b', 3, [req('a')]), task('c', 4, [req('missing')])]
  const plan = planPriorityTasks(tasks, ['a', 'c', 'missing-root'], [])
  assert.deepEqual(ids(plan), ['a', 'c'])
  assert.ok(plan.issues.some(i => i.kind === 'cycle' && i.path.includes('b')))
  assert.ok(plan.issues.some(i => i.kind === 'missing' && i.taskId === 'missing'))
  assert.ok(plan.issues.some(i => i.kind === 'missing' && i.taskId === 'missing-root'))
})
test('unsupported grouped OR or unknown states are shown as uncertainty, not flattened into AND totals', () => {
  const plan = planPriorityTasks([task('a'), task('b'), task('goal', 2, [{ anyOf: [req('a'), req('b')] }, req('a', ['unknown'])])], ['goal'], [])
  assert.deepEqual(ids(plan), ['goal']); assert.ok(plan.issues.some(i => i.kind === 'unsupported'))
})
test('quantity/FIR/Collector/alternative-item rules and distinct same-name sources match the original calculator', () => {
  const tasks = [task('one', 2, [], { name: 'Duplicate' }), task('two', 3, [], { name: 'Duplicate', objectives: [{ type: 'giveItem', item, count: 3, description: 'non-FIR', foundInRaid: false }] }),
    task('collector', 4, [], { name: 'Collector' }), task('alternatives', 5, [], { objectives: [{ type: 'giveItem', items: [item, { id: 'other', name: 'Other' }], count: 5, description: 'Any five', foundInRaid: true }] })]
  const entries = []; calculateShoppingList(tasks, [], e => entries.push(e))
  const lists = aggregatePriorityTaskItems([...tasks, tasks[0]], [])
  assert.equal(lists.taskFir.find(i => i.id === 'item').count, 2)
  assert.equal(lists.taskNormal[0].count, 3); assert.equal(lists.collector[0].count, 4)
  const alternative = lists.taskFir.find(i => i.altItems); assert.equal(alternative.count, 5); assert.equal(alternative.altItems.length, 2)
  assert.equal(lists.taskFir.flatMap(i => i.sources).reduce((n,s) => n+s.count,0), entries.filter(e => e.category === 'taskFir').reduce((n,e) => n+e.count,0))
  assert.equal(lists.taskNormal[0].sources[0].objectives[0].foundInRaid, false)
})

test('actual ResultList defaults to full lists, persists only display mode across remount, and preserves task attribution', async () => {
  const storage = new Map()
  globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) }
  globalThis.BroadcastChannel = undefined
  globalThis.document = { activeElement: null }
  function el(tag='') { return markRaw({ tag, props: {}, children: [], parent: null, options: [], style: {}, addEventListener() {}, removeEventListener() {}, setAttribute() {}, focus() { document.activeElement = this } }) }
  const all = node => node.children.flatMap(child => [child,...all(child)])
  const renderer = createRenderer({ createElement: el, createText: text => Object.assign(el(),{text}),createComment: el,
    setText: (e,t) => e.text=t,setElementText: (e,t) => e.text=t,parentNode:e=>e.parent,nextSibling:e=>e.parent?.children[e.parent.children.indexOf(e)+1]||null,
    patchProp:(e,k,_,v)=>e.props[k]=v,
    insertStaticContent(content,parent) {const e=el('static');e.parent=parent;parent.children.push(e);return[e,e]},
    insert(e,parent,anchor) {if(e.parent)e.parent.children.splice(e.parent.children.indexOf(e),1);e.parent=parent;const i=anchor?parent.children.indexOf(anchor):-1;parent.children.splice(i<0?parent.children.length:i,0,e)},
    remove(e){if(e.parent)e.parent.children.splice(e.parent.children.indexOf(e),1)},
  })
  const url = new URL('../src/components/ResultList.vue', import.meta.url)
  const code = compileScript(parse(await readFile(url,'utf8')).descriptor,{id:'priority-test',inlineTemplate:true}).content
    .replace(/from (['"])([^'"]+)\1/g,(_,q,spec)=>`from '${spec.startsWith('.')?new URL(spec,url).href:import.meta.resolve(spec)}'`)
  const Component=(await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)).default
  const {useApiData}=await import('../src/composables/useApiData.js'),{useUserProgress}=await import('../src/composables/useUserProgress.js'),{useShoppingList}=await import('../src/composables/useShoppingList.js')
  const api=useApiData(),progress=useUserProgress()
  api.taskData.value=[task('shared',5),task('goal',2,[req('shared')]),task('unrelated',99)]
  api.hideoutData.value=[{name:'Workbench',normalizedName:'workbench',levels:[{level:1,itemRequirements:[{count:10,item,attributes:[]}]}]}]
  api.itemsData.value={items:[],maps:[]}; progress.userHideout.value={};progress.completedTasks.value=[];progress.taskStatuses.value={};progress.prioritizedTasks.value=['goal'];progress.collectedItems.value=['taskFir_item']
  await nextTick()
  const progressStorage = () => [...storage].filter(([key]) => key !== 'eft_shopping_list_mode')
  const original=JSON.stringify(useShoppingList().shoppingList.value),snapshot=JSON.stringify(progressStorage())
  const root=el('root'),opened=[];const app=renderer.createApp(Component,{onOpenTaskFromName:ref=>opened.push(ref)});app.mount(root);await nextTick()
  const select=all(root).find(e=>e.tag==='select')
  assert.equal(select._value, undefined) // Native selector uses the Vue model, not persistent settings.
  const checkbox=()=>all(root).filter(e=>e.tag==='input')
  assert.equal(checkbox().length,2,'default includes hideout and all tasks')
  select.props['onUpdate:modelValue']('priority');await nextTick()
  assert.equal(checkbox().length,2,'priority filters only task-derived items and retains hideout')
  assert.equal(useShoppingList().priorityShoppingList.value.taskFir[0].count,7)
  assert.equal(checkbox().filter(input => input.props.checked).length,1)
  const goalButton=all(root).find(e=>e.tag==='button'&&e.text==='goal');goalButton.props.onClick();assert.equal(opened[0].id,'goal')
  select.props['onUpdate:modelValue']('all');await nextTick();assert.equal(checkbox().length,2)
  assert.equal(JSON.stringify(useShoppingList().shoppingList.value),original)
  assert.equal(JSON.stringify(progressStorage()),snapshot,'only view preference changes; priorities/progress/collection storage is unchanged')
  select.props['onUpdate:modelValue']('priority');await nextTick()
  assert.equal(storage.get('eft_shopping_list_mode'), JSON.stringify('priority'))
  app.unmount()
  const returned=renderer.createApp(Component,{onOpenTaskFromName:ref=>opened.push(ref)})
  returned.mount(root);await nextTick()
  assert.equal(checkbox().length,2,'tab away/back remount retains priority mode with hideout')
  progress.prioritizedTasks.value=[];await nextTick();assert.equal(checkbox().length,1,'no priority goals still includes hideout')
  const lists=useShoppingList()
  assert.strictEqual(lists.priorityDisplayLists.value.hideoutBuy,lists.displayLists.value.hideoutBuy)
  assert.strictEqual(lists.priorityDisplayLists.value.hideoutFir,lists.displayLists.value.hideoutFir)
  assert.equal(lists.priorityDisplayLists.value.hideoutBuy.items[0].count,10)
  assert.deepEqual(lists.priorityDisplayLists.value.hideoutBuy.items[0].sources,[{name:'Workbench Lv1',taskId:undefined,type:'hideout',count:10}])
  api.hideoutData.value=[];await nextTick();assert.equal(checkbox().length,0,'hideout data absent with no goals is empty')
  progress.prioritizedTasks.value=['goal'];await nextTick();assert.equal(checkbox().length,1,'priority task items remain when hideout is absent')
  progress.shoppingListMode.value='all';await nextTick();assert.equal(checkbox().length,1)
  api.hideoutData.value=[{name:'Workbench',normalizedName:'workbench',levels:[
    {level:1,itemRequirements:[{count:10,item,attributes:[]},{count:2,item:{id:'fir',name:'FIR material'},attributes:[{type:'foundInRaid',value:true}]}]},
    {level:2,itemRequirements:[{count:4,item,attributes:[]}]}]}]
  await nextTick();assert.equal(checkbox().length,3)
  progress.shoppingListMode.value='priority';await nextTick();assert.equal(checkbox().length,3)
  assert.equal(lists.priorityDisplayLists.value.hideoutBuy.items[0].count,14)
  assert.equal(lists.priorityDisplayLists.value.taskFir.items[0].count,7,'shared task/hideout item stays separated by source category')
  assert.notEqual(lists.priorityDisplayLists.value.hideoutBuy.items[0].uid,lists.priorityDisplayLists.value.taskFir.items[0].uid)
  progress.collectedItems.value.push('hideoutBuy_item');await nextTick();assert.equal(checkbox().filter(input=>input.props.checked).length,2)
  progress.userHideout.value={workbench:1};await nextTick();assert.equal(checkbox().length,2);assert.equal(lists.priorityDisplayLists.value.hideoutBuy.items[0].count,4)
  progress.showMaxedHideout.value=!progress.showMaxedHideout.value;await nextTick();assert.equal(lists.priorityDisplayLists.value.hideoutBuy.items[0].count,4,'input-only filter does not change item quantities')
  progress.userHideout.value={workbench:2};await nextTick();assert.equal(checkbox().length,1,'completed hideout needs no items in priority mode')
  progress.shoppingListMode.value='all';await nextTick();assert.equal(checkbox().length,1,'completed hideout needs no items in all mode')
  progress.shoppingListMode.value='priority';progress.prioritizedTasks.value=[];await nextTick();assert.equal(checkbox().length,0)
  returned.unmount()
})
