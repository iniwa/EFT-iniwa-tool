import test from 'node:test'
import assert from 'node:assert/strict'
import { reactive, ref, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useTaskFlowchartNavigation } from '../src/composables/useTaskFlowchartNavigation.js'
import { useFlowchartViewport } from '../src/composables/useFlowchartViewport.js'

test('detail -> stable task chart -> Back restores the exact task detail and its connected list opener', async () => {
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/', name: 'input', component: {} }, { path: '/flowchart', name: 'flowchart', component: {} }, { path: '/other', component: {} },
  ] })
  await router.push('/')
  const route = reactive({ ...router.currentRoute.value })
  const remove = router.afterEach(to => Object.assign(route, to))
  const tasks = ref([{ id: 'a/b?exact', name: 'Duplicate' }, { id: 'other-id', name: 'Duplicate' }])
  const events = [], opener = { isConnected: true, focus() { events.push('focus-opener') } }
  const flow = useTaskFlowchartNavigation({ route, router, taskData: tasks, closeDetails: () => events.push('close'), openDetails: task => events.push(task.id), getOpener: () => opener })
  assert.equal(await flow.showFlowchart(tasks.value[0]), true)
  assert.equal(route.query.task, 'a/b?exact'); assert.deepEqual(events, ['close'])
  const returned = new Promise(resolve => { const off = router.afterEach(() => { off(); resolve() }) })
  router.back(); await returned; for(let i=0;i<3;i++)await nextTick()
  assert.deepEqual(events, ['close', 'focus-opener', 'a/b?exact'])
  assert.equal(route.name, 'input')
  flow.stop(); remove()
})
test('missing/stale task identity never navigates; failed navigation reopens the same detail', async () => {
  const route = reactive({ name:'input', fullPath:'/' }),tasks=ref([{id:'a'}]),events=[]
  const router={resolve:()=>({fullPath:'/flowchart?task=a'}),async push(){return {type:4}}}
  const flow=useTaskFlowchartNavigation({route,router,taskData:tasks,closeDetails:()=>events.push('close'),openDetails:t=>events.push(t.id)})
  assert.equal(await flow.showFlowchart({id:'missing'}),false);assert.deepEqual(events,[])
  assert.equal(await flow.showFlowchart(tasks.value[0]),false);assert.deepEqual(events,['close','a'])
  flow.stop()
})
test('same chart closes detail without duplicate navigation; unrelated departure clears the Back receipt', async () => {
  const route=reactive({name:'flowchart',fullPath:'/flowchart?task=a'}),tasks=ref([{id:'a'}]),events=[]
  const router={resolve:()=>({fullPath:'/flowchart?task=a'}),async push(){events.push('push');route.fullPath='/flowchart?task=a';route.name='flowchart'}}
  const flow=useTaskFlowchartNavigation({route,router,taskData:tasks,closeDetails:()=>events.push('close'),openDetails:t=>events.push(t.id)})
  assert.equal(await flow.showFlowchart(tasks.value[0]),true);assert.deepEqual(events,['close'])
  route.name='input';route.fullPath='/';await nextTick();await flow.showFlowchart(tasks.value[0]);await nextTick()
  route.fullPath='/other';await nextTick();route.fullPath='/';await nextTick();await nextTick()
  assert.deepEqual(events,['close','close','push'])
  flow.stop()
})
test('return uses current task data and skips deleted targets without guessing by name', async () => {
  const route=reactive({name:'input',fullPath:'/'}),tasks=ref([{id:'a',name:'Same'}]),opened=[]
  const router={resolve:()=>({fullPath:'/flowchart?task=a'}),async push(){route.name='flowchart';route.fullPath='/flowchart?task=a'}}
  const flow=useTaskFlowchartNavigation({route,router,taskData:tasks,closeDetails(){},openDetails:t=>opened.push(t.id)})
  await flow.showFlowchart(tasks.value[0]);await nextTick();tasks.value=[{id:'b',name:'Same'}];route.name='input';route.fullPath='/';await nextTick();await nextTick()
  assert.deepEqual(opened,[]);flow.stop()
})
test('context fit shows predecessor/target/successor bounds with padding, respects limits, and cancels safely', async () => {
  const el={clientWidth:800,clientHeight:500,scrollLeft:0,scrollTop:0},viewport=ref(el),zoom=ref(1),size=ref({width:4000,height:2000})
  const flow=useFlowchartViewport({viewport,zoom,size})
  assert.equal(await flow.fitContext({x:400,y:200,width:1200,height:700}),true)
  assert.ok(zoom.value<1); assert.ok(viewport.value.scrollLeft>0)
  assert.equal(await flow.fitContext({x:0,y:0,width:0,height:10}),false)
  const pending=flow.fitContext({x:0,y:0,width:100,height:50});flow.dispose();assert.equal(await pending,false)
})
