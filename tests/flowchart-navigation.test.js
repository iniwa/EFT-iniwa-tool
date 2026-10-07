import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { ref, nextTick, createRenderer, markRaw, reactive } from 'vue'
import { parse, compileScript } from '@vue/compiler-sfc'
import { createRouter, createMemoryHistory } from 'vue-router'
import { getTaskFlowchartScope, readFlowchartTaskId } from '../src/logic/flowchartNavigation.js'
import { useFlowchartViewport, clampFlowchartZoom } from '../src/composables/useFlowchartViewport.js'

const tasks = [
  { id: 'prereq', name: 'Prerequisite', trader: { name: 'Therapist' } },
  { id: 'target', name: 'Duplicate', trader: { name: 'Prapor' }, taskRequirements: [{ task: { id: 'prereq' } }] },
  { id: 'branch-a', name: 'Branch A', trader: { name: 'Prapor' }, taskRequirements: [{ task: { id: 'target' } }] },
  { id: 'branch-b', name: 'Branch B', trader: { name: 'Therapist' }, taskRequirements: [{ task: { id: 'target' } }] },
  { id: 'merge-prereq', name: 'Required by branch', trader: { name: 'Therapist' } },
  { id: 'merge', name: 'Merge', trader: { name: 'Prapor' }, taskRequirements: [{ task: { id: 'branch-a' } }, { task: { id: 'merge-prereq' } }] },
  { id: 'unrelated', name: 'Duplicate', trader: { name: 'Prapor' } },
]
test('target scope includes prerequisites, downstream branches and merge requirements, excludes unrelated names', () => {
  assert.deepEqual(getTaskFlowchartScope('target', tasks).map(t => t.id), tasks.slice(0, -1).map(t => t.id))
  assert.deepEqual(getTaskFlowchartScope('Duplicate', tasks), [])
  assert.deepEqual(getTaskFlowchartScope('missing', tasks), [])
  assert.deepEqual(getTaskFlowchartScope('a', [{ id: 'a', taskRequirements: [{ task: { id: 'b' } }] }, { id: 'b', taskRequirements: [{ task: { id: 'a' } }] }]).map(t => t.id), ['a', 'b'])
})
test('route query preserves exact task identity and rejects multi-value/name guesses', async () => {
  assert.equal(readFlowchartTaskId(undefined), null)
  assert.equal(readFlowchartTaskId(['target', 'other']), '')
  assert.equal(readFlowchartTaskId(''), '')
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/flowchart', name: 'flowchart', component: {} }] })
  const id = 'stable/id?&task=other'
  const route = router.resolve({ name: 'flowchart', query: { task: id } })
  assert.equal(router.resolve(route.href).query.task, id)
})
function viewportHarness() {
  const captures = new Set()
  const el = markRaw({ clientWidth: 800, clientHeight: 500, scrollLeft: 400, scrollTop: 200,
    getBoundingClientRect: () => ({ left: 20, top: 30 }), focus() { this.focused = true },
    setPointerCapture: id => captures.add(id), hasPointerCapture: id => captures.has(id), releasePointerCapture: id => captures.delete(id),
  })
  const zoom = ref(1), viewport = ref(el), size = ref({ width: 1600, height: 1000 })
  const controls = useFlowchartViewport({ viewport, zoom, size })
  const event = overrides => ({ pointerId: 1, pointerType: 'mouse', button: 0, buttons: 1, clientX: 220, clientY: 130, detail: 1,
    target: { closest: () => null }, preventDefault() { this.prevented = true }, stopPropagation() { this.stopped = true }, ...overrides })
  return { el, zoom, viewport, controls, event, captures }
}
test('wheel zoom anchors near cursor, handles units, clamps bounds and coalesces rapid events', async () => {
  const { el, zoom, controls, event } = viewportHarness()
  const e = event({ deltaY: -100, deltaMode: 0 })
  await controls.onWheel(e)
  assert.ok(e.prevented)
  assert.ok(Math.abs((el.scrollLeft + 200) / zoom.value - 600) < 0.0001)
  assert.ok(Math.abs((el.scrollTop + 100) / zoom.value - 300) < 0.0001)
  controls.onWheel(event({ deltaY: -50, deltaMode: 1 })); controls.onWheel(event({ deltaY: -50, deltaMode: 2 })); await nextTick()
  assert.equal(zoom.value, 3)
  assert.ok(Math.abs((el.scrollLeft + 200) / zoom.value - 600) < 0.0001)
  for (let i = 0; i < 10; i++) await controls.onWheel(event({ deltaY: 400 }))
  assert.equal(zoom.value, 0.1)
  assert.equal(clampFlowchartZoom(NaN), 1)
  const horizontal = event({ deltaY: 0, deltaX: 100 }); controls.onWheel(horizontal); assert.equal(horizontal.prevented, undefined)
})
test('fit/reset bounds and pending zoom disposal are deterministic', async () => {
  const { el, zoom, controls } = viewportHarness()
  await controls.fitView(); assert.equal(zoom.value, 0.5); assert.equal(el.scrollLeft, 0); assert.equal(el.scrollTop, 0)
  await controls.zoomReset(); assert.equal(zoom.value, 1)
  const pending = controls.zoomIn(); controls.dispose(); await pending; assert.equal(el.scrollLeft, 0)
})
test('left mouse background drag pans, threshold avoids jitter and drag-end click cannot activate nodes', () => {
  const { el, controls, event, captures } = viewportHarness()
  controls.onPointerDown(event()); assert.equal(captures.size, 1); assert.ok(el.focused)
  controls.onPointerMove(event({ clientX: 222 })); assert.equal(controls.panning.value, false)
  controls.onPointerMove(event({ clientX: 120, clientY: 80 })); assert.equal(el.scrollLeft, 500); assert.equal(el.scrollTop, 250)
  assert.equal(controls.panning.value, true)
  controls.onPointerEnd(event()); assert.equal(captures.size, 0); assert.equal(controls.panning.value, false)
  const click = event(); controls.onClickCapture(click); assert.ok(click.prevented && click.stopped)
  const nextClick = event(); controls.onClickCapture(nextClick); assert.equal(nextClick.stopped, undefined)
})
test('touch, right mouse and node gestures remain native; cancel/lost capture/blur cleanup releases pointers', () => {
  const { controls, event, captures } = viewportHarness()
  for (const overrides of [{ pointerType: 'touch' }, { pointerType: 'pen' }, { button: 2 }, { target: { closest: () => ({}) } }]) {
    const e = event(overrides); controls.onPointerDown(e); assert.equal(e.prevented, undefined); assert.equal(captures.size, 0)
  }
  controls.onPointerDown(event()); controls.onPointerMove(event({ clientX: 120 })); controls.cancelPan(); assert.equal(captures.size, 0)
  const keyboard = event({ detail: 0 }); controls.onClickCapture(keyboard); assert.equal(keyboard.stopped, undefined)
  // A new physical gesture clears any unused drag click suppression.
  controls.onPointerDown(event({ target: { closest: () => ({}) } })); const click = event(); controls.onClickCapture(click); assert.equal(click.stopped, undefined)
  controls.onPointerDown(event()); controls.onPointerMove(event({ buttons: 0 })); assert.equal(captures.size, 0)
})

// Compile the actual SFC to exercise route -> graph -> node focus and event wiring.
// Mermaid rendering is stubbed: this checks Vue integration, not browser SVG layout.
test('actual flowchart focuses the exact routed task, preserves trader state and wires local canvas events', async () => {
  globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} }
  globalThis.BroadcastChannel = undefined
  globalThis.document = { activeElement: null }
  const windowListeners = new Map()
  globalThis.window = { addEventListener: (key, fn) => windowListeners.set(key, fn), removeEventListener: key => windowListeners.delete(key) }
  const graphs = []
  let deferRender = false, finishDeferred
  globalThis.__flowRoute = reactive({ query: { task: 'target', retain: 'yes' } })
  globalThis.__flowRouter = { replace({ query }) { globalThis.__flowRoute.query = query } }
  globalThis.__flowMermaid = { initialize() {}, async render(id, graph) { graphs.push(graph); if (deferRender) return new Promise(resolve => { finishDeferred = () => resolve({ svg: graph }) }); return { svg: graph } } }
  function element(tag = '') {
    const el = markRaw({ tag, props: {}, children: [], parent: null, style: {}, dataset: {}, options: [], multiple: false, id: '', clientWidth: 800, clientHeight: 500, scrollLeft: 0, scrollTop: 0,
      focus() { document.activeElement = this }, classList: { contains: () => false }, setAttribute() {}, removeAttribute() {}, addEventListener() {},
      getBoundingClientRect: () => ({ left: 300, top: 200, width: 80, height: 30 }),
      closest(selector) { if (selector === '.flowchart-scroll') { let n = this; while (n && !String(n.props.class).includes('flowchart-scroll')) n = n.parent; return n } return null },
      querySelector(selector) { return selector === 'svg' ? { viewBox: { baseVal: { width: 1600, height: 1000 } }, getBoundingClientRect: this.getBoundingClientRect } : null },
      querySelectorAll(selector) { return selector === '.node' ? this.nodes || [] : [] },
    })
    Object.defineProperty(el, 'textContent', { set() { this.nodes = [] } })
    Object.defineProperty(el, 'innerHTML', { set(graph) { this.nodes = [...graph.matchAll(/  (t\d+)\["/g)].map(m => Object.assign(element('g'), { id: 'flowchart-' + m[1] + '-0' })) } })
    return el
  }
  const all = el => el.children.flatMap(child => [child, ...all(child)])
  const renderer = createRenderer({ insertStaticContent(content, parent, anchor) { const el = element('static'); el.parent = parent; parent.children.push(el); return [el, el] }, createElement: element, createText: text => Object.assign(element(), { text }), createComment: element,
    setText: (el, text) => el.text = text, setElementText: (el, text) => el.text = text,
    parentNode: el => el.parent, nextSibling: el => el.parent?.children[el.parent.children.indexOf(el) + 1] || null,
    patchProp: (el, key, _, value) => el.props[key] = value,
    insert(el, parent, anchor) { if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1); el.parent = parent; const i = anchor ? parent.children.indexOf(anchor) : -1; parent.children.splice(i < 0 ? parent.children.length : i, 0, el) },
    remove(el) { if(el.parent)el.parent.children.splice(el.parent.children.indexOf(el),1) },
  })
  const url = new URL('../src/components/FlowchartView.vue', import.meta.url)
  let content = compileScript(parse(await readFile(url, 'utf8')).descriptor, { id: 'flow-test', inlineTemplate: true }).content
  content = content.replace("import mermaid from 'mermaid'", 'const mermaid = globalThis.__flowMermaid')
    .replace("import { useRoute, useRouter } from 'vue-router'", 'const useRoute = () => globalThis.__flowRoute; const useRouter = () => globalThis.__flowRouter')
    .replace(/from (['"])([^'"]+)\1/g, (_, q, spec) => `from '${spec.startsWith('.') ? new URL(spec, url).href : import.meta.resolve(spec)}'`)
  const Component = (await import(`data:text/javascript;base64,${Buffer.from(content).toString('base64')}`)).default
  const { useApiData } = await import('../src/composables/useApiData.js')
  const { useUserProgress } = await import('../src/composables/useUserProgress.js')
  useApiData().taskData.value = tasks
  const progress = useUserProgress(); progress.flowchartTrader.value = 'Therapist'
  const root = element('root'), opened = []
  const app = renderer.createApp(Component, { onOpenTaskDetails: task => opened.push(task.id) }); app.mount(root)
  await nextTick(); await nextTick(); await nextTick()
  assert.ok(graphs[0].includes('Branch A') && graphs[0].includes('Branch B'))
  assert.equal((graphs[0].match(/Duplicate/g) || []).length, 1)
  assert.match(graphs[0], /class t1 [^\n]*,target/)
  assert.equal(document.activeElement.dataset.taskId, 'target')
  assert.equal(progress.flowchartTrader.value, 'Therapist')
  const canvas = all(root).find(el => String(el.props.class).includes('flowchart-scroll'))
  assert.ok(canvas.props.onWheel && canvas.props.onPointerdown && canvas.props.onClickCapture)
  const mermaid = all(root).find(el => el.props.class === 'mermaid')
  mermaid.props.onClick({ target: { closest: () => mermaid.nodes[1] } }); assert.deepEqual(opened, ['target'])
  deferRender = true
  globalThis.__flowRoute.query = { task: 'branch-a' }; await nextTick(); await new Promise(resolve => setTimeout(resolve, 120))
  assert.ok(finishDeferred)
  globalThis.__flowRoute.query = { task: 'missing' }; await nextTick()
  finishDeferred(); await nextTick(); await nextTick()
  assert.equal(mermaid.nodes.length, 0, 'in-flight SVG must not replace an invalid target after navigation')
  globalThis.__flowRoute.query = { task: 'missing' }; await nextTick(); await new Promise(resolve => setTimeout(resolve, 120)); await nextTick()
  assert.equal(graphs.length, 2, 'unknown ID must not silently display unrelated trader graph')
  app.unmount(); assert.equal(windowListeners.size, 0)
})
test('actual task list links use stable IDs in both list/grouped modes and input state is kept alive', async () => {
  const input = await readFile(new URL('../src/components/TaskInput.vue', import.meta.url), 'utf8')
  const app = await readFile(new URL('../src/App.vue', import.meta.url), 'utf8')
  assert.equal((input.match(/query: \{ task: task.id \}/g) || []).length, 2)
  assert.equal((input.match(/emit\('open-task-details', task\)/g) || []).length, 2)
  assert.match(app, /<KeepAlive include="TaskInput">/)
  assert.ok(compileScript(parse(input).descriptor, { id: 'input-test', inlineTemplate: true }).content)
})
