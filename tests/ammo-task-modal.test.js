import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRenderer, h, ref, nextTick, markRaw } from 'vue'
import { parse, compileScript } from '@vue/compiler-sfc'
import { useAmmoTaskDetails } from '../src/composables/useAmmoTaskDetails.js'

// A Vue host renderer tests real dialog lifecycle/focus without a browser or user storage.
const source = await readFile(new URL('../src/components/ui/BaseModal.vue', import.meta.url), 'utf8')
const script = compileScript(parse(source).descriptor, { id: 'modal-test', inlineTemplate: true }).content
  .replace(/from (['"])vue\1/g, `from '${import.meta.resolve('vue')}'`)
const { default: BaseModal } = await import(`data:text/javascript;base64,${Buffer.from(script).toString('base64')}`)
function harness() {
  const listeners = new Set()
  globalThis.document = { activeElement: null, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) }
  function node(tag = '') {
    return markRaw({ tag, props: {}, children: [], parent: null, style: {}, scrollTop: 0,
      focus() { document.activeElement = this },
      contains(target) { return this === target || this.children.some(child => child.contains(target)) },
      querySelectorAll() { return all(this).filter(el => ['button', 'input', 'select', 'textarea', 'a'].includes(el.tag) && !el.props.disabled) },
    })
  }
  function all(root) { return root.children.flatMap(child => [child, ...all(child)]) }
  const body = node('body'), root = node('root'), row = node('button')
  row.focus()
  const renderer = createRenderer({
    createElement: node, createText: text => Object.assign(node(), { text }), createComment: node,
    setText: (el, text) => { el.text = text }, setElementText: (el, text) => { el.text = text },
    parentNode: el => el.parent, nextSibling: el => el.parent?.children[el.parent.children.indexOf(el) + 1] || null,
    querySelector: selector => selector === 'body' ? body : null,
    patchProp: (el, key, _, value) => { el.props[key] = value },
    insert(el, parent, anchor) { if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1); el.parent = parent; const i = anchor ? parent.children.indexOf(anchor) : -1; parent.children.splice(i < 0 ? parent.children.length : i, 0, el) },
    remove(el) { if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1); el.parent = null },
  })
  return { body, root, row, renderer, all, key(key, shiftKey = false) { const e = { key, shiftKey, preventDefault() { this.prevented = true } }; for (const fn of [...listeners]) fn(e); return e } }
}
const flush = async () => { await nextTick(); await nextTick() }
const tasks = [{ id: 'purchase', name: 'Purchase unlock' }, { id: 'craft', name: 'Craft unlock' }]

test('ammo dialog keeps context and returns focus after Back, close, Escape and repeated unlock clicks', async () => {
  const host = harness(), ammoShown = ref(true), selectedAmmo = { id: 'ammo' }
  const flow = useAmmoTaskDetails({ taskData: ref(tasks), isLoading: ref(false), loadError: ref(null) })
  const app = host.renderer.createApp({ render() { return [
    h(BaseModal, { show: ammoShown.value, suspended: flow.suspended.value, resumeFocus: flow.resumeFocus, onClose: () => { ammoShown.value = false } }, { default: () => tasks.map(task => h('button', { id: task.id, onClick: e => flow.open(task, e.currentTarget) }, task.name)) }),
    h(BaseModal, { show: flow.task.value !== null, onClose: flow.close }, { default: () => [h('button', { id: 'back', onClick: flow.close }, 'Back to ammo'), h('button', { id: 'close', onClick: flow.close }, 'Close')] }),
  ] } })
  app.mount(host.root); await flush()
  const find = id => host.all(host.body).find(el => el.props.id === id)
  const ammoOverlay = host.body.children.find(el => el.props.class === 'modal-overlay')
  const ammoDialog = host.all(ammoOverlay).find(el => el.props.role === 'dialog')
  ammoDialog.scrollTop = 180
  for (const [taskId, exit] of [['purchase', 'back'], ['craft', 'close'], ['purchase', 'Escape'], ['craft', 'backdrop']]) {
    const trigger = find(taskId); trigger.focus(); trigger.props.onClick({ currentTarget: trigger })
    flow.open(tasks[1], find('craft')) // repeated clicks cannot replace the active transition
    await flush()
    assert.equal(flow.task.value.id, taskId)
    assert.equal(ammoOverlay.style.display, 'none')
    assert.equal(document.activeElement, find('back'))
    assert.equal(host.all(host.body).filter(el => el.props.class === 'modal-overlay' && el.style.display !== 'none').length, 1)
    if (exit === 'Escape') host.key('Escape')
    else if (exit === 'backdrop') { const overlay = host.body.children.filter(el => el.props.class === 'modal-overlay').at(-1); overlay.props.onClick({ target: overlay, currentTarget: overlay }) }
    else find(exit).props.onClick()
    await flush()
    assert.equal(flow.suspended.value, false)
    assert.equal(ammoShown.value, true)
    assert.equal(selectedAmmo.id, 'ammo')
    assert.equal(ammoDialog.scrollTop, 180)
    assert.equal(document.activeElement, trigger)
  }
  host.key('Escape'); await flush()
  assert.equal(ammoShown.value, false)
  assert.equal(document.activeElement, host.row)
  app.unmount()
})

test('ambiguous references require choice, and cancel returns without discarding the trigger', () => {
  const duplicate = [{ id: 'a', name: 'Duplicate' }, { id: 'b', name: 'Duplicate' }]
  const flow = useAmmoTaskDetails({ taskData: ref(duplicate), isLoading: ref(false), loadError: ref(null) })
  const trigger = { id: 'link' }
  flow.open('Duplicate', trigger)
  assert.equal(flow.suspended.value, true)
  assert.equal(flow.task.value, null)
  flow.choose({ id: 'unknown' })
  assert.equal(flow.task.value, null)
  flow.choose(flow.choices.value[1])
  assert.equal(flow.task.value.id, 'b')
  assert.deepEqual(flow.choices.value, [])
  flow.close()
  assert.equal(flow.suspended.value, false)
  assert.equal(flow.resumeFocus(), trigger)
  flow.open('Duplicate', trigger); flow.close()
  assert.deepEqual(flow.choices.value, [])
})

test('loading, missing data and stale task references keep the ammo dialog active with an error', () => {
  const loading = ref(true), data = ref(tasks), error = ref(null)
  const flow = useAmmoTaskDetails({ taskData: data, isLoading: loading, loadError: error })
  flow.open(tasks[0]); assert.equal(flow.suspended.value, false); assert.ok(flow.message.value)
  loading.value = false; data.value = []; error.value = 'Data unavailable'
  flow.open(tasks[0]); assert.ok(flow.message.value); assert.notEqual(flow.message.value, 'Data unavailable')
  data.value = tasks; flow.open({ id: 'stale' })
  assert.equal(flow.suspended.value, false); assert.ok(flow.message.value)
  flow.close(); assert.equal(flow.message.value, '')
})

test('general dialogs retain focus trapping, Escape close and opener restoration', async () => {
  const host = harness(), show = ref(true)
  const app = host.renderer.createApp({ render: () => h(BaseModal, { show: show.value, onClose: () => { show.value = false } }, { default: () => [h('button', { id: 'first' }), h('button', { id: 'last' })] }) })
  app.mount(host.root); await flush()
  const [first, last] = host.all(host.body).filter(el => el.tag === 'button')
  assert.equal(document.activeElement, first)
  first.focus(); assert.equal(host.key('Tab', true).prevented, true); assert.equal(document.activeElement, last)
  last.focus(); host.key('Tab'); assert.equal(document.activeElement, first)
  host.row.focus(); host.key('Tab'); assert.equal(document.activeElement, first)
  host.key('Escape'); await flush(); assert.equal(show.value, false); assert.equal(document.activeElement, host.row)
  app.unmount()
})
async function loadComponent(file, componentImports = {}) {
  const url = new URL(file, import.meta.url)
  let content = compileScript(parse(await readFile(url, 'utf8')).descriptor, { id: file, inlineTemplate: true }).content
  content = content.replace(/from (['"])([^'"]+)\1/g, (_, quote, specifier) => {
    const target = componentImports[specifier] || (specifier.startsWith('.') ? new URL(specifier, url).href : import.meta.resolve(specifier))
    return `from '${target}'`
  })
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(content).toString('base64')}`
  return { url: moduleUrl, component: (await import(moduleUrl)).default }
}

test('actual ammo purchase and craft buttons show TaskModal and return to the same ammo link', async () => {
  const store = new Map()
  globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key) }
  globalThis.BroadcastChannel = undefined
  const host = harness()
  const baseUrl = `data:text/javascript;base64,${Buffer.from(script).toString('base64')}`
  const taskModal = await loadComponent('../src/components/TaskModal.vue', { './ui/BaseModal.vue': baseUrl })
  const ammoChart = await loadComponent('../src/components/AmmoChart.vue', { './ui/BaseModal.vue': baseUrl, './TaskModal.vue': taskModal.url })
  const { useApiData } = await import('../src/composables/useApiData.js')
  const { useAppState } = await import('../src/composables/useAppState.js')
  const { ammoData, taskData } = useApiData()
  const { isLoading } = useAppState(); isLoading.value = false
  taskData.value = tasks.map(task => ({ ...task, trader: { name: 'Prapor' }, objectives: [], taskRequirements: [], traderLevelRequirements: [], otherRequirements: [], neededKeys: [], startRewards: {}, finishRewards: {} }))
  ammoData.value = [{ id: 'ammo', name: 'Test ammo', caliber: 'Caliber9x19PARA', damage: 50, penetrationPower: 30, armorDamage: 20, projectileSpeed: 350,
    soldBy: [{ vendor: { name: 'Prapor' }, minTraderLevel: 2, taskUnlock: tasks[0], taskUnlockName: tasks[0].name, priceRUB: 100 }],
    crafts: [{ station: { name: 'Workbench' }, level: 2, taskUnlock: tasks[1], duration: 60, requiredItems: [], rewardItems: [] }],
  }]
  const app = host.renderer.createApp(ammoChart.component)
  app.mount(host.root); await flush()
  const textOf = el => ((el.text || '') + el.children.map(textOf).join('')).trim()
  const all = () => host.all(host.body)
  const rowLink = host.all(host.root).find(el => textOf(el) === 'Test ammo' && el.props.onClick)
  assert.ok(rowLink)
  rowLink.focus(); rowLink.props.onClick(); await flush()
  const ammoOverlay = host.body.children.find(el => el.props.class === 'modal-overlay')
  for (const task of tasks) {
    const unlock = all().find(el => el.tag === 'button' && textOf(el) === task.name)
    assert.ok(unlock); unlock.focus(); unlock.props.onClick({ currentTarget: unlock }); await flush()
    assert.equal(ammoOverlay.style.display, 'none')
    const back = all().find(el => el.tag === 'button' && textOf(el) === '\u5f3e\u85ac\u8a73\u7d30\u306b\u623b\u308b')
    assert.ok(back)
    assert.equal(document.activeElement, back)
    back.props.onClick(); await flush()
    assert.notEqual(ammoOverlay.style.display, 'none')
    assert.equal(document.activeElement, unlock)
  }
  host.key('Escape'); await flush(); assert.equal(document.activeElement, rowLink)
  app.unmount()
})

test('actual task detail chart button emits its stable task, preserves normal close and stays absent by default', async () => {
  const host = harness()
  const baseUrl = `data:text/javascript;base64,${Buffer.from(script).toString('base64')}`
  const modal = await loadComponent('../src/components/TaskModal.vue', { './ui/BaseModal.vue': baseUrl })
  const { useApiData } = await import('../src/composables/useApiData.js')
  const task = useApiData().taskData.value[0]
  const shown = ref(true), enabled = ref(true), calls = []
  const app = host.renderer.createApp({ render: () => h(modal.component, { task, show: shown.value, canShowFlowchart: enabled.value, onShowFlowchart: task => calls.push(task.id), onClose: () => { shown.value = false } }) })
  app.mount(host.root); await flush()
  const textOf = el => (el.text || '') + el.children.map(textOf).join('')
  const chartButton = () => host.all(host.body).find(el => el.tag === 'button' && textOf(el) === '\u30d5\u30ed\u30fc\u30c1\u30e3\u30fc\u30c8\u3067\u8868\u793a')
  assert.ok(chartButton()); assert.equal(chartButton().props.type, 'button')
  chartButton().props.onClick(); assert.deepEqual(calls, [task.id]); assert.equal(shown.value, true)
  enabled.value = false; await flush(); assert.equal(chartButton(), undefined)
  host.key('Escape'); await flush(); assert.equal(shown.value, false); assert.equal(document.activeElement, host.row)
  app.unmount()
})

test('actual detail shows unknown condition meaning with IDs/comparisons confined to optional technical details', async () => {
  const host = harness()
  const baseUrl = `data:text/javascript;base64,${Buffer.from(script).toString('base64')}`
  const modal = await loadComponent('../src/components/TaskModal.vue', { './ui/BaseModal.vue': baseUrl })
  const { useApiData } = await import('../src/composables/useApiData.js')
  const task = { ...useApiData().taskData.value[0], otherRequirements: [{ type: 'globalVariable', variableId: 'opaque-unlock-id', compareMethod: '>=', value: 3 }], objectives: [{ type: 'useItem', description: 'Known objective text', globalVariable: { id: 'opaque-objective-id', compareMethod: '==', value: 0 } }] }
  const app = host.renderer.createApp(modal.component, { task, show: true })
  app.mount(host.root); await flush()
  const textOf = el => (el.text || '') + el.children.map(textOf).join('')
  const details = host.all(host.body).filter(el => el.tag === 'details')
  assert.ok(details.some(el => textOf(el).includes('opaque-unlock-id') && textOf(el).includes('>=') && !el.props.open))
  assert.ok(details.some(el => textOf(el).includes('opaque-objective-id') && textOf(el).includes('==') && !el.props.open))
  const visibleText = el => el.tag === 'details' ? '' : (el.text || '') + el.children.map(visibleText).join('')
  assert.ok(visibleText(host.body).includes('\u610f\u5473\u672a\u691c\u8a3c'))
  assert.ok(!visibleText(host.body).includes('opaque-unlock-id') && !visibleText(host.body).includes('opaque-objective-id'))
  app.unmount()
})
