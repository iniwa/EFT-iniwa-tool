import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { createRenderer, nextTick } from 'vue'
import { parse, compileScript } from '@vue/compiler-sfc'
import { BOREAS_REFERENCE } from '../src/data/boreasReference.js'
import { groupBoreasObjectives, HISTORICAL_BOREAS_IDS, RECORDABLE_BOREAS_IDS, validateBoreasRecords, boreasStorageKey } from '../src/logic/boreasReferenceLogic.js'
import { getBulkCompletableStepIds } from '../src/logic/storyLogic.js'
const unknown = 'ffffffffffffffffffffffff'
const ids = [...RECORDABLE_BOREAS_IDS]
const storage = new Map([['eft_pvp_regular_migrated','true'],['eft_story_selected_chapter','boreas-reference']])
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem:(k,v)=>storage.set(k,String(v)), removeItem:k=>storage.delete(k) }
globalThis.BroadcastChannel = undefined
globalThis.alert = () => {}
globalThis.FileReader = class { readAsText(file) { this.onload({target:{result:file.text}}) } }
const { useBoreasReference } = await import('../src/composables/useBoreasReference.js')
const { useAppState } = await import('../src/composables/useAppState.js')
const { useUserProgress } = await import('../src/composables/useUserProgress.js')
const { validateBackup, useImportExport, BACKUP_SCHEMA_VERSION } = await import('../src/composables/useImportExport.js')
const { gameMode } = useAppState()
const reference = useBoreasReference()
const progress = useUserProgress()
const backups = useImportExport()
const compiled = new Map()
async function component(name) {
  if(compiled.has(name)) return compiled.get(name)
  const source = await readFile(new URL('../src/components/'+name,import.meta.url),'utf8')
  let code = compileScript(parse(source).descriptor,{id:'boreas-test-'+name, inlineTemplate:true, templateOptions:{compilerOptions:{hoistStatic:false}}}).content
  for(const match of [...code.matchAll(/from (['"])([^'"]+\.vue)\1/g)]) {
    const url = await component(match[2].replace('./',''))
    code = code.replace(match[0], `from '${url}'`)
  }
  code = code.replace(/from (['"])([^'"]+)\1/g,(_,quote,p)=>`from '${p.startsWith('data:') ? p : p.startsWith('.') ? new URL('../src/components/'+p,import.meta.url).href : import.meta.resolve(p)}'`)
  const url = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  compiled.set(name,url); return url
}
const { default: Story } = await import(await component('StoryView.vue'))
const { default: Settings } = await import(await component('SettingsView.vue'))
const node = (tag='')=>({tag,props:{},children:[],parent:null,addEventListener(){},removeEventListener(){}})
const renderer = createRenderer({createElement:node,createText:text=>({...node(),text}),createComment:node,
  setText:(el,text)=>el.text=text,setElementText:(el,text)=>el.text=text,parentNode:el=>el.parent,
  nextSibling:el=>el.parent?.children[el.parent.children.indexOf(el)+1]||null,
  patchProp:(el,key,_,value)=>el.props[key]=value,
  insert(el,parent,anchor){if(el.parent)el.parent.children.splice(el.parent.children.indexOf(el),1);el.parent=parent;const i=anchor?parent.children.indexOf(anchor):-1;parent.children.splice(i<0?parent.children.length:i,0,el)},
  remove(el){if(el.parent)el.parent.children.splice(el.parent.children.indexOf(el),1);el.parent=null}})
const all = el=>el.children.flatMap(child=>[child,...all(child)])
const text = el=>[el.text||'',...el.children.map(text)].join(' ')
const mount = Component=>{const root=node('root');const app=renderer.createApp(Component);app.mount(root);return {root,app}}
const importBackup = payload=>backups.importData({size:100,text:JSON.stringify(payload)})

test('pinned partial reference has 83 unique real objectives in 19 matching parent groups and exactly 3 historical IDs',()=>{
  assert.equal(BOREAS_REFERENCE.chapterQuestId,'69d38381cea4b428690ea1d9')
  assert.equal(BOREAS_REFERENCE.objectives.length,83)
  assert.equal(new Set(BOREAS_REFERENCE.objectives.map(o=>o.id)).size,83)
  assert.equal(groupBoreasObjectives().length,19)
  for(const group of groupBoreasObjectives())for(const o of group.objectives){assert.equal(o.sourceQuestId,group.sourceQuestId);assert.match(o.id,/^[a-f0-9]{24}$/);assert.ok(o.description)}
  assert.equal(BOREAS_REFERENCE.objectives.filter(o=>HISTORICAL_BOREAS_IDS.has(o.id)).length,3)
  assert.equal(RECORDABLE_BOREAS_IDS.size,80)
  assert.equal(BOREAS_REFERENCE.phases,undefined)
  assert.deepEqual(getBulkCompletableStepIds(BOREAS_REFERENCE),[])
  assert.deepEqual(validateBoreasRecords([unknown,unknown]),[unknown])
})

test('actual story renderer restores reference selection, never shows chapter completion or bulk action, and historical rows cannot be marked',async()=>{
  gameMode.value='pve'; await nextTick()
  reference.replaceRecords([unknown])
  const original = {story:JSON.stringify(progress.storyProgress.value),tasks:JSON.stringify(progress.completedTasks.value),statuses:JSON.stringify(progress.taskStatuses.value)}
  let {root,app}=mount(Story);await nextTick()
  assert.ok(all(root).some(n=>n.props.id==='boreas-reference-title'))
  assert.equal(all(root).filter(n=>n.tag==='details').length,20)
  const boxes=all(root).filter(n=>n.tag==='input' && n.props.type==='checkbox')
  assert.equal(boxes.length,80)
  for(const id of HISTORICAL_BOREAS_IDS){assert.ok(!boxes.some(n=>n.props.id==='boreas-'+id));reference.setRecorded(id,true)}
  assert.deepEqual(reference.recordedObjectiveIds.value,[unknown])
  for(const box of boxes)box.props.onChange({target:{checked:true}})
  await nextTick()
  assert.equal(reference.recordedObjectiveIds.value.length,81)
  assert.equal(reference.unappliedCount.value,1)
  assert.ok(!text(root).includes('このチャプターの全必須手順が完了しました'))
  assert.ok(!all(root).some(n=>n.tag==='button'&&text(n).includes('一括完了')))
  assert.deepEqual({story:JSON.stringify(progress.storyProgress.value),tasks:JSON.stringify(progress.completedTasks.value),statuses:JSON.stringify(progress.taskStatuses.value)},original)
  const entry=all(root).find(n=>String(n.props.class).includes('alert-info'))
  assert.match(text(entry),/Shoreline \/ Lighthouse/);assert.match(text(entry),/Sudak-tudak marine repair kit/);assert.match(text(entry),/Pay the Fare!/)
  assert.doesNotMatch(text(entry),/400.?000|2400|2500|EUR|RUB/)
  app.unmount();({root,app}=mount(Story));await nextTick()
  assert.ok(all(root).some(n=>n.props.id==='boreas-reference-title'))
  assert.equal(storage.get('eft_story_selected_chapter'),'boreas-reference')
  assert.equal(all(root).filter(n=>n.tag==='input'&&n.props.checked).length,80)
  app.unmount()
})

test('modes are independent and unknown/historical saved IDs are retained but never applied',async()=>{
  gameMode.value='pve';await nextTick();reference.replaceRecords([ids[0],unknown,...HISTORICAL_BOREAS_IDS])
  gameMode.value='regular';await nextTick();reference.replaceRecords([ids[1]])
  gameMode.value='pvp-season';await nextTick();reference.replaceRecords([ids[2]])
  gameMode.value='pve';await nextTick()
  assert.deepEqual(reference.recordedObjectiveIds.value,[ids[0],unknown,...HISTORICAL_BOREAS_IDS])
  assert.equal(reference.unappliedCount.value,4)
  reference.setRecorded(ids[0],false)
  assert.deepEqual(reference.recordedObjectiveIds.value,[unknown,...HISTORICAL_BOREAS_IDS])
  assert.deepEqual(JSON.parse(storage.get(boreasStorageKey('regular'))),[ids[1]])
  assert.deepEqual(JSON.parse(storage.get(boreasStorageKey('pvp-season'))),[ids[2]])
})

test('fresh module session loads saved real and unknown IDs without backfilling legacy story data',()=>{
  const result=spawnSync(process.execPath,['--input-type=module','-e',`
    const entries=${JSON.stringify([['eft_gamemode','"regular"'],['eft_pvp_regular_migrated','true'],['eft_regular_boreas_reference_v1',JSON.stringify([ids[0],unknown])],['eft_regular_story_progress','{"boreas":{"old":true}}']])};
    const storage=new Map(entries);globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))};
    const {useBoreasReference}=await import(${JSON.stringify(new URL('../src/composables/useBoreasReference.js',import.meta.url).href)});
    const reference=useBoreasReference();console.log(JSON.stringify({ids:reference.recordedObjectiveIds.value,unapplied:reference.unappliedCount.value,story:storage.get('eft_regular_story_progress')}));
  `],{encoding:'utf8'})
  assert.equal(result.status,0,result.stderr)
  assert.deepEqual(JSON.parse(result.stdout),{ids:[ids[0],unknown],unapplied:1,story:'{"boreas":{"old":true}}'})
})

test('empty phases and note-only chapters cannot satisfy chapter completion by an empty every',async()=>{
  const {MAIN_CHAPTERS}=await import('../src/data/storyChaptersMain.js')
  for(const phases of [[],[{id:'note-phase',steps:[{id:'note',type:'note',text:'Reference only'}]}]]){
    const fixture={id:'empty-test',title:'Empty fixture',category:'main',phases}
    MAIN_CHAPTERS.push(fixture);storage.set('eft_story_selected_chapter',fixture.id)
    let app
    try {
      const mounted=mount(Story);app=mounted.app;await nextTick()
      assert.ok(text(mounted.root).includes('Empty fixture'))
      assert.ok(!text(mounted.root).includes('このチャプターの全必須手順が完了しました'))
    } finally {app?.unmount();MAIN_CHAPTERS.pop();storage.set('eft_story_selected_chapter','boreas-reference')}
  }
})

test('new backup roundtrip preserves unknown IDs; old absent field preserves destination records; present empty clears only destination',async()=>{
  gameMode.value='regular';await nextTick();reference.replaceRecords([ids[1],unknown])
  let blob
  const originalCreate=URL.createObjectURL, originalRevoke=URL.revokeObjectURL
  URL.createObjectURL=value=>{blob=value;return 'blob:test'};URL.revokeObjectURL=()=>{}
  globalThis.document={createElement:()=>({click(){}})}
  try{backups.exportData()}finally{URL.createObjectURL=originalCreate;URL.revokeObjectURL=originalRevoke}
  const exported=JSON.parse(await blob.text())
  assert.equal(exported.schemaVersion,BACKUP_SCHEMA_VERSION);assert.equal(BACKUP_SCHEMA_VERSION,'3.2.2')
  assert.deepEqual(exported.boreasReferenceRecords,[ids[1],unknown])
  reference.resetRecords();gameMode.value='pve';await nextTick();reference.replaceRecords([ids[0]])
  await importBackup(exported)
  assert.equal(gameMode.value,'regular');assert.deepEqual(reference.recordedObjectiveIds.value,[ids[1],unknown])
  assert.deepEqual(JSON.parse(storage.get(boreasStorageKey('pve'))),[ids[0]])
  for(const schemaVersion of ['3.2.0','3.2.1']){
    gameMode.value='pve';await nextTick()
    await importBackup({schemaVersion,gameMode:'regular'})
    assert.deepEqual(reference.recordedObjectiveIds.value,[ids[1],unknown])
  }
  gameMode.value='pve';await nextTick()
  await importBackup({schemaVersion:BACKUP_SCHEMA_VERSION,gameMode:'regular',boreasReferenceRecords:[]})
  assert.deepEqual(reference.recordedObjectiveIds.value,[])
  assert.deepEqual(JSON.parse(storage.get(boreasStorageKey('pve'))),[ids[0]])
})

test('malformed reference backups are rejected before mode or progress changes',async()=>{
  gameMode.value='pve';await nextTick();reference.replaceRecords([unknown])
  const before=JSON.stringify([...storage])
  for(const bad of [null,{},'bad',[1],['__proto__'],['abc'],[null]]){
    assert.throws(()=>validateBackup({schemaVersion:'3.2.2',boreasReferenceRecords:bad}))
    await assert.rejects(importBackup({schemaVersion:'3.2.2',gameMode:'regular',boreasReferenceRecords:bad}))
    assert.equal(gameMode.value,'pve');assert.deepEqual(reference.recordedObjectiveIds.value,[unknown])
  }
  assert.equal(JSON.stringify([...storage]),before)
})

test('dedicated and settings reset require confirmation; ordinary story reset does not erase reference',async()=>{
  gameMode.value='pve';await nextTick();reference.replaceRecords([ids[0],unknown])
  let messages=[];globalThis.confirm=message=>{messages.push(message);return false}
  let {root,app}=mount(Story);await nextTick()
  all(root).find(n=>n.tag==='button'&&text(n).includes('この手動記録をリセット')).props.onClick()
  assert.deepEqual(reference.recordedObjectiveIds.value,[ids[0],unknown]);assert.match(messages[0],/pve.*Boreas.*未適用ID/)
  globalThis.confirm=message=>{messages.push(message);return true}
  all(root).find(n=>n.tag==='button'&&text(n).includes('この手動記録をリセット')).props.onClick()
  assert.deepEqual(reference.recordedObjectiveIds.value,[]);app.unmount()
  reference.replaceRecords([unknown]);progress.storyProgress.value={chapter:{choice:'keep',check:true}};await nextTick()
  ;({root,app}=mount(Settings));await nextTick()
  const reset=()=>all(root).find(n=>n.tag==='button'&&text(n).includes('選択したデータをリセット')).props.onClick()
  all(root).find(n=>n.props.id==='reset-story').props['onUpdate:modelValue'](true);reset();await nextTick()
  assert.deepEqual(reference.recordedObjectiveIds.value,[unknown])
  const checkbox=all(root).find(n=>n.props.id==='reset-boreasReference');assert.ok(checkbox)
  checkbox.props['onUpdate:modelValue'](true)
  globalThis.confirm=message=>{messages.push(message);return false};reset();assert.deepEqual(reference.recordedObjectiveIds.value,[unknown])
  assert.match(messages.at(-1),/Boreas部分データ.*未適用ID/)
  globalThis.confirm=()=>true;reset();assert.deepEqual(reference.recordedObjectiveIds.value,[]);app.unmount()
})
