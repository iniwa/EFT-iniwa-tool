import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const progressUrl = new URL('../src/composables/useUserProgress.js', import.meta.url).href
const appUrl = new URL('../src/composables/useAppState.js', import.meta.url).href
function session(raw, change = false) {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    const store = new Map([['eft_pvp_regular_migrated','true'],['eft_gamemode','"regular"'],['unrelated_setting','keep'],['eft_regular_prioritized','["goal"]'],['eft_regular_tasks','["done"]']]);
    const raw = ${JSON.stringify(raw)};
    if(raw !== null) store.set('eft_shopping_list_mode',raw);
    globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
    globalThis.BroadcastChannel=undefined;
    const {useUserProgress,normalizeShoppingListMode,RESET_SETTING_KEYS,clearResetSettings}=await import(${JSON.stringify(progressUrl)});
    const {useAppState}=await import(${JSON.stringify(appUrl)});
    const {nextTick}=await import(${JSON.stringify(new URL('../node_modules/vue/index.mjs', import.meta.url).href)});
    const progress=useUserProgress(),initial=progress.shoppingListMode.value;
    if(${change}) {progress.shoppingListMode.value='priority';await nextTick();useAppState().gameMode.value='pve';await nextTick();}
    const beforeReset={initial,current:progress.shoppingListMode.value,stored:store.get('eft_shopping_list_mode')??null,unrelated:store.get('unrelated_setting'),prioritized:store.get('eft_regular_prioritized'),completed:store.get('eft_regular_tasks'),resetKey:RESET_SETTING_KEYS.includes('eft_shopping_list_mode'),normalized:[null,{},[],1,'bad','all','priority'].map(normalizeShoppingListMode)};
    clearResetSettings();console.log(JSON.stringify({...beforeReset,afterReset:store.has('eft_shopping_list_mode')}));
  `], {encoding:'utf8'})
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout.trim())
}

test('fresh browser-profile preference defaults to all; switching persists priority across modes and reload', () => {
  const fresh = session(null, true)
  assert.equal(fresh.initial, 'all'); assert.equal(fresh.current, 'priority')
  assert.equal(fresh.stored, '"priority"')
  const reloaded = session(fresh.stored)
  assert.equal(reloaded.initial, 'priority')
  assert.equal(reloaded.unrelated, 'keep'); assert.equal(reloaded.prioritized, '["goal"]'); assert.equal(reloaded.completed, '["done"]')
  assert.equal(reloaded.resetKey, true); assert.equal(reloaded.afterReset, false)
})

test('malformed and unsupported saved preferences fall back to all without editing other stored settings', () => {
  for (const raw of ['broken-json', '{}', '[]', 'null', '1', 'true', '"unexpected"']) {
    const result = session(raw)
    assert.equal(result.initial, 'all', raw)
    assert.equal(result.stored, raw)
    assert.equal(result.unrelated, 'keep'); assert.equal(result.prioritized, '["goal"]'); assert.equal(result.completed, '["done"]')
    assert.deepEqual(result.normalized, ['all','all','all','all','all','all','priority'])
  }
})
