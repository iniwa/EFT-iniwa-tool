<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KORD_BREACH_SEASON } from '../data/seasonModifiers.js'
import { decodeSeasonModifierShare, encodeSeasonModifierShare, evaluateAchievementHints, evaluateSeasonModifierBuild } from '../logic/seasonModifierLogic.js'
import { useSeasonModifierBuilds } from '../composables/useSeasonModifierBuilds.js'

const { draft, presets, setDraft, savePreset, removePreset, reset } = useSeasonModifierBuilds(KORD_BREACH_SEASON.seasonId)
const route = useRoute(); const router = useRouter()
const search = ref('')
const presetName = ref('')
const shareLink = ref('')
const sharePreview = ref(null)
const statusMessage = ref('')
const pendingDelete = ref(null)
const activeIds = computed(() => sharePreview.value ? sharePreview.value.modifierIds : draft.value)
const evaluation = computed(() => evaluateSeasonModifierBuild(activeIds.value, KORD_BREACH_SEASON))
const hints = computed(() => evaluateAchievementHints(activeIds.value, KORD_BREACH_SEASON))
const filtered = (items) => items.filter((item) => !search.value || `${item.name} ${item.description}`.toLowerCase().includes(search.value.toLowerCase()))

function updatePreviewQuery(ids) { try { const encoded = encodeSeasonModifierShare(KORD_BREACH_SEASON.seasonId, ids, KORD_BREACH_SEASON); const query = { ...route.query }; if (encoded) query.build = encoded; else delete query.build; router.replace({ query }) } catch { statusMessage.value = '共有プレビューURLを更新できませんでした。' } }
function endPreview() { try { const query = { ...route.query }; delete query.build; router.replace({ query }) } catch { /* URL更新失敗でも画面状態は維持 */ } sharePreview.value = null }
function toggle(id) { const ids = activeIds.value.includes(id) ? activeIds.value.filter((value) => value !== id) : [...activeIds.value, id]; if (sharePreview.value) { sharePreview.value = { ...sharePreview.value, modifierIds: ids }; updatePreviewQuery(ids) } else { const result = setDraft(ids); if (result?.ok === false) statusMessage.value = 'ブラウザへ保存できません（容量/設定を確認してください）。' } shareLink.value = '' }
function save() { const result = savePreset(presetName.value, activeIds.value); statusMessage.value = !result ? 'プリセット名を入力してください。' : result.ok === false ? 'ブラウザへ保存できません（容量/設定を確認してください）。' : `「${result.name}」を保存しました。`; if (result?.ok !== false && result) presetName.value = '' }
function load(preset) { const result = setDraft(preset.modifierIds); if (result?.ok === false) { statusMessage.value = 'ブラウザへ保存できません（容量/設定を確認してください）。'; return } endPreview(); shareLink.value = ''; statusMessage.value = `「${preset.name}」を読み込みました。` }
function createShare() { const encoded = encodeSeasonModifierShare(KORD_BREACH_SEASON.seasonId, activeIds.value, KORD_BREACH_SEASON); const target = router.resolve({ name: 'season-builds', query: encoded ? { build: encoded } : {} }); shareLink.value = encoded ? new URL(target.href, window.location.origin).href : ''; statusMessage.value = shareLink.value ? '共有リンクを作成しました。' : '共有リンクを作成できませんでした。' }
async function copyShare() { createShare(); if (!shareLink.value) { statusMessage.value = '共有リンクを作成できません。'; return } try { await navigator.clipboard.writeText(shareLink.value); statusMessage.value = '共有リンクをコピーしました。' } catch { statusMessage.value = 'コピーできません。下のリンクを選択してコピーしてください。' } }
function applyPreview() { if (sharePreview.value) { const result = setDraft(sharePreview.value.modifierIds); if (result?.ok === false) { statusMessage.value = 'ブラウザへ保存できません（容量/設定を確認してください）。'; return } endPreview(); shareLink.value = ''; statusMessage.value = '共有ビルドを下書きに反映しました。' } }
function discardPreview() { endPreview(); shareLink.value = ''; statusMessage.value = '共有プレビューを破棄しました。' }
function resetActive() { if (sharePreview.value) { sharePreview.value = { ...sharePreview.value, modifierIds: [] }; updatePreviewQuery([]) } else { const result = reset(); if (result?.ok === false) statusMessage.value = 'ブラウザへ保存できません（容量/設定を確認してください）。' } shareLink.value = '' }
function remove(id) { const ok = removePreset(id); if (ok === false) statusMessage.value = 'ブラウザへ保存できません（容量/設定を確認してください）。'; else { pendingDelete.value = null; statusMessage.value = 'プリセットを削除しました。' } }
function loadPreview() { const value = route.query.build; if (!value) { sharePreview.value = null; return } const decoded = decodeSeasonModifierShare(String(value), KORD_BREACH_SEASON.seasonId); sharePreview.value = decoded.ok ? decoded : null; statusMessage.value = decoded.ok ? '共有ビルドをプレビュー中です。' : '共有リンクを読み込めませんでした。' }
watch(() => route.query.build, loadPreview, { immediate: true })
</script>

<template>
  <main class="modifier-page container-fluid">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
      <div><h2 class="mb-1">🧬 Personal Modifier</h2><p class="text-muted mb-0">{{ KORD_BREACH_SEASON.displayName }} / Patch {{ KORD_BREACH_SEASON.patch }}</p></div>
      <span class="badge text-bg-secondary">確認日 {{ KORD_BREACH_SEASON.verifiedAt }}</span>
    </div>
    <div class="alert alert-warning small"><strong>注意:</strong> {{ KORD_BREACH_SEASON.sourceNote }} 外部データは<a :href="KORD_BREACH_SEASON.officialRulesSource" target="_blank" rel="noopener">公式ルール</a>とコミュニティ観測値をもとにしています。</div>
    <div v-if="sharePreview" class="alert alert-info d-flex flex-wrap justify-content-between align-items-center gap-2" role="status"><span>共有ビルドをプレビュー中（下書きは変更されていません）。</span><span><button class="btn btn-sm btn-info me-2" @click="applyPreview">下書きに反映</button><button class="btn btn-sm btn-outline-light" @click="discardPreview">破棄</button></span></div>
    <div v-if="statusMessage" class="alert alert-secondary py-2 small" aria-live="polite" role="status">{{ statusMessage }}</div>

    <section class="modifier-summary card mb-3" aria-label="ビルド概要"><div class="card-body row g-2 align-items-center text-center">
      <div class="col-6 col-md"><small>獲得</small><strong class="d-block text-success">{{ evaluation.earned }}</strong></div><div class="col-6 col-md"><small>消費</small><strong class="d-block text-danger">{{ evaluation.spent }}</strong></div><div class="col-6 col-md"><small>残高</small><strong class="d-block" :class="evaluation.isPointValid ? 'text-success' : 'text-danger'">{{ evaluation.balance }}</strong></div><div class="col-6 col-md"><small>選択中</small><strong class="d-block">{{ evaluation.selectedCount }}</strong></div><div class="col-12 col-md-3"><span class="fw-bold" :class="evaluation.isValid ? 'text-success' : 'text-warning'">{{ evaluation.isValid ? '成立可能' : '要確認' }}</span><small class="d-block">{{ evaluation.unknownIds.length ? '未知IDあり' : 'ポイントとデータを確認' }}</small></div>
    </div></section>

    <div class="row g-3"><div class="col-12 col-lg-8">
      <div class="card mb-3"><div class="card-body"><label for="modifier-search" class="form-label">Modifierを検索</label><input id="modifier-search" v-model="search" class="form-control" type="search" placeholder="名前・説明で検索"></div></div>
      <section class="card mb-3"><div class="card-header"><h3 class="h5 mb-0">Global Modifier <small class="text-muted">{{ KORD_BREACH_SEASON.globals.length }}</small></h3></div><div class="card-body modifier-grid"><div v-for="item in filtered(KORD_BREACH_SEASON.globals)" :key="item.id" class="modifier-card global"><strong>{{ item.name }}</strong><span>{{ item.description }}</span></div></div></section>
      <section class="card mb-3"><div class="card-header"><h3 class="h5 mb-0">Positive Modifier <small class="text-muted">{{ KORD_BREACH_SEASON.positive.length }} / 消費</small></h3></div><div class="card-body modifier-grid"><label v-for="item in filtered(KORD_BREACH_SEASON.positive)" :key="item.id" class="modifier-card" :class="{ selected: activeIds.includes(item.id) }"><input type="checkbox" :checked="activeIds.includes(item.id)" :aria-label="`${item.name}を選択`" @change="toggle(item.id)"><span><strong>{{ item.name }}</strong><small class="points">{{ item.points }}</small><span>{{ item.description }}</span></span></label></div></section>
      <section class="card mb-3"><div class="card-header"><h3 class="h5 mb-0">Negative Modifier <small class="text-muted">{{ KORD_BREACH_SEASON.negative.length }} / 獲得</small></h3></div><div class="card-body modifier-grid"><label v-for="item in filtered(KORD_BREACH_SEASON.negative)" :key="item.id" class="modifier-card" :class="{ selected: activeIds.includes(item.id) }"><input type="checkbox" :checked="activeIds.includes(item.id)" :aria-label="`${item.name}を選択`" @change="toggle(item.id)"><span><strong>{{ item.name }}</strong><small class="points">+{{ item.points }}</small><span>{{ item.description }}</span></span></label></div></section>
    </div><aside class="col-12 col-lg-4">
      <section class="card mb-3"><div class="card-header"><h3 class="h5 mb-0">選択中</h3></div><div class="card-body"><p v-if="!evaluation.selected.length" class="text-muted">まだ選択されていません。</p><ul v-else class="selected-list"><li v-for="item in evaluation.selected" :key="item.id">{{ item.name }} <button class="btn btn-sm btn-link" :aria-label="`${item.name}を解除`" @click="toggle(item.id)">解除</button></li></ul><div v-if="evaluation.unknownIds.length" class="alert alert-warning small">未知のIDを保持しています: {{ evaluation.unknownIds.join(', ') }}</div><div v-if="evaluation.interactionWarnings.length" class="mt-3"><h4 class="h6">Interaction warning</h4><ul class="small text-warning"><li v-for="warning in evaluation.interactionWarnings" :key="warning.id">{{ warning.message }}</li></ul></div><button class="btn btn-outline-secondary btn-sm" @click="resetActive">選択をリセット</button></div></section>
      <section class="card mb-3"><div class="card-header"><h3 class="h5 mb-0">実績の目安</h3></div><div class="card-body small"><p class="text-muted">他のゲーム内条件もあるため、達成を確定するものではありません。</p><ul class="achievement-list"><li v-for="hint in hints" :key="hint.id" :class="{ met: hint.met }"><span aria-hidden="true">{{ hint.met ? '✓' : '○' }}</span> {{ hint.name }}<small class="d-block">{{ hint.description }}</small></li></ul></div></section>
      <section class="card mb-3"><div class="card-header"><h3 class="h5 mb-0">プリセット</h3></div><div class="card-body"><div class="input-group mb-2"><input v-model="presetName" class="form-control" maxlength="80" placeholder="プリセット名" aria-label="プリセット名"><button class="btn btn-outline-info" @click="save">保存</button></div><ul class="list-group list-group-flush"><li v-for="preset in presets" :key="preset.id" class="list-group-item d-flex justify-content-between align-items-center"><span>{{ preset.name }}</span><span><button class="btn btn-sm btn-link" @click="load(preset)">読込</button><button v-if="pendingDelete === preset.id" class="btn btn-sm btn-danger" @click="remove(preset.id)">確定</button><button v-else class="btn btn-sm btn-link text-danger" @click="pendingDelete = preset.id">削除</button></span></li></ul></div></section>
      <section class="card"><div class="card-header"><h3 class="h5 mb-0">共有</h3></div><div class="card-body"><button class="btn btn-outline-info btn-sm me-2" @click="createShare">リンク作成</button><button class="btn btn-outline-secondary btn-sm" :disabled="!shareLink" @click="copyShare">コピー</button><input v-if="shareLink" class="form-control mt-2" :value="shareLink" readonly aria-label="共有リンク"></div></section>
    </aside></div>
  </main>
</template>

<style scoped>
.modifier-page { max-width: 1500px; }
.modifier-summary { position: sticky; top: .5rem; z-index: 2; background: var(--bg-card); }
.modifier-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; }
.modifier-card { display: flex; gap: .65rem; align-items: flex-start; padding: .7rem; border: 1px solid var(--border-light); border-radius: .35rem; background: var(--bg-card-header); cursor: pointer; min-height: 76px; }
.modifier-card:hover, .modifier-card:focus-within { border-color: var(--color-accent); }
.modifier-card.selected { background: var(--bg-checked); border-color: var(--color-success); }
.modifier-card input { margin-top: .25rem; accent-color: var(--color-accent); }
.modifier-card span { display: block; min-width: 0; }.modifier-card strong { display: inline-block; margin-right: .45rem; }.modifier-card span span { color: var(--color-text-secondary); font-size: .82rem; }.points { color: var(--color-accent); font-weight: bold; }
.selected-list { max-height: 280px; overflow: auto; padding-left: 1.2rem; }.selected-list li { margin-bottom: .25rem; }.achievement-list { padding-left: 0; list-style: none; }.achievement-list li { margin-bottom: .5rem; }.achievement-list li.met { color: var(--color-success); }.achievement-list small { color: var(--color-text-secondary); margin-left: 1.2rem; }
@media (max-width: 575.98px) { .modifier-grid { grid-template-columns: 1fr; }.modifier-summary { position: static; } }
</style>
