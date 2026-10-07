import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRenderer, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { parse, compileScript } from '@vue/compiler-sfc'
import { useSeasonModifierBuilds } from '../src/composables/useSeasonModifierBuilds.js'

const source = await readFile(new URL('../src/components/SeasonModifierBuilder.vue', import.meta.url), 'utf8')
const compiled = compileScript(parse(source).descriptor, { id: 'underdog-test', inlineTemplate: true }).content
  .replace(/from (['"])([^'"]+)\1/g, (_, quote, path) => `from '${path.startsWith('.') ? new URL('../src/components/' + path, import.meta.url).href : import.meta.resolve(path)}'`)
const { default: Builder } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

test('actual builder explicitly toggles Underdog, restores totals and preserves selection when remounted', async () => {
  const store = useSeasonModifierBuilds()
  store.reset()
  const node = (tag = '') => ({ tag, props: {}, children: [], parent: null, addEventListener() {}, removeEventListener() {} })
  const renderer = createRenderer({
    createElement: node, createText: text => ({ ...node(), text }), createComment: node,
    setText: (el, text) => { el.text = text }, setElementText: (el, text) => { el.text = text },
    parentNode: el => el.parent, nextSibling: el => el.parent?.children[el.parent.children.indexOf(el) + 1] || null,
    patchProp: (el, key, _, value) => { el.props[key] = value },
    insert(el, parent, anchor) { if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1); el.parent = parent; const i = anchor ? parent.children.indexOf(anchor) : -1; parent.children.splice(i < 0 ? parent.children.length : i, 0, el) },
    remove(el) { if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1); el.parent = null },
  })
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', name: 'season-builds', component: {} }] })
  await router.push('/')
  const root = node('root')
  let app = renderer.createApp(Builder).use(router)
  const all = el => el.children.flatMap(child => [child, ...all(child)])
  const checkbox = () => all(root).find(el => el.props['aria-label'] === 'Underdogを選択')
  const totals = () => all(root).filter(el => el.tag === 'strong' && String(el.props.class).includes('d-block')).map(el => Number(el.text))
  app.mount(root); await nextTick()
  assert.equal(checkbox().props.checked, false)
  const sectionText = el => [el.text || '', ...el.children.map(sectionText)].join(' ')
  let section = checkbox().parent
  while (section && section.tag !== 'section') section = section.parent
  assert.ok(sectionText(section).includes('Negative Modifier'), 'Underdog appears in the Negative Modifier section')
  assert.deepEqual(totals(), [0, 0, 0, 0])
  checkbox().props.onChange(); await nextTick()
  assert.equal(checkbox().props.checked, true)
  assert.deepEqual(totals(), [4, 0, 4, 1])
  assert.deepEqual(store.draft.value, ['underdog'])
  app.unmount()
  app = renderer.createApp(Builder).use(router); app.mount(root); await nextTick()
  assert.equal(checkbox().props.checked, true)
  assert.deepEqual(totals(), [4, 0, 4, 1])
  checkbox().props.onChange(); await nextTick()
  assert.deepEqual(totals(), [0, 0, 0, 0])
  assert.deepEqual(store.draft.value, [])
  app.unmount()
})
