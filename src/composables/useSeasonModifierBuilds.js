import { ref } from 'vue'
import { KORD_BREACH_SEASON_ID } from '../data/seasonModifiers.js'
import { evaluateSeasonModifierBuild, normalizeModifierIds, MAX_MODIFIER_ID_LENGTH } from '../logic/seasonModifierLogic.js'

export const SEASON_MODIFIER_STORAGE_KEY = 'eft_season_modifier_builds_v1'
export const SEASON_MODIFIER_STORAGE_SCHEMA = 1
export const MAX_PRESETS = 20
const MAX_NAME_LENGTH = 80
const MAX_DRAFT_IDS = 64
const memoryStorage = new Map()
const defaultStorage = {
  getItem: (key) => (typeof localStorage === 'undefined' ? memoryStorage.get(key) ?? null : localStorage.getItem(key)),
  setItem: (key, value) => (typeof localStorage === 'undefined' ? memoryStorage.set(key, String(value)) : localStorage.setItem(key, value)),
}
function cleanId(value) { return typeof value === 'string' ? value.trim().slice(0, MAX_MODIFIER_ID_LENGTH) : '' }
function cleanName(value) { return typeof value === 'string' ? value.trim().slice(0, MAX_NAME_LENGTH) : '' }
function cleanIds(ids) { const seen = new Set(); const result = []; for (const value of Array.isArray(ids) ? ids.slice(0, MAX_DRAFT_IDS) : []) { const id = cleanId(value); if (id && !seen.has(id)) { seen.add(id); result.push(id) } } return result }
function safeSeasonId(value) { const id = cleanId(value); return id && id !== '__proto__' && id !== 'constructor' && id !== 'prototype' ? id : '' }
function newPresetId(used = new Set()) { let id; do { id = `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` } while (used.has(id)); return id }

export function sanitizeSeasonModifierState(value) {
  const seasons = Object.create(null)
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.schemaVersion !== SEASON_MODIFIER_STORAGE_SCHEMA) return { schemaVersion: 1, seasons }
  const rawSeasons = value.seasons && typeof value.seasons === 'object' && !Array.isArray(value.seasons) ? value.seasons : {}
  for (const [rawSeasonId, raw] of Object.entries(rawSeasons)) {
    const seasonId = safeSeasonId(rawSeasonId); if (!seasonId || !raw || typeof raw !== 'object' || Array.isArray(raw)) continue
    const used = new Set(); const presets = []
    for (const preset of Array.isArray(raw.presets) ? raw.presets.slice(0, MAX_PRESETS) : []) {
      if (!preset || typeof preset !== 'object') continue
      const name = cleanName(preset.name); if (!name) continue
      let id = cleanId(preset.id); if (!id || used.has(id)) id = newPresetId(used); used.add(id)
      presets.push({ id, name, modifierIds: cleanIds(preset.modifierIds), updatedAt: typeof preset.updatedAt === 'string' ? preset.updatedAt : new Date().toISOString() })
    }
    seasons[seasonId] = { draft: cleanIds(raw.draft), presets }
  }
  return { schemaVersion: 1, seasons }
}

export function createSeasonModifierBuildStore(storage = defaultStorage) {
  let state = sanitizeSeasonModifierState(read(storage))
  function persist() { try { storage.setItem(SEASON_MODIFIER_STORAGE_KEY, JSON.stringify(state)); return true } catch { return false } }
  function readCurrent(seasonId) { return state.seasons[safeSeasonId(seasonId)] || { draft: [], presets: [] } }
  function setDraft(seasonId, ids) { const id = safeSeasonId(seasonId); if (!id) return { ok: false, ids: readCurrent(seasonId).draft }; const previous = state; state = sanitizeSeasonModifierState(state); const next = { ...readCurrent(id), draft: cleanIds(ids) }; state.seasons[id] = next; const ok = persist(); if (!ok) state = previous; return { ok, ids: readCurrent(id).draft } }
  function savePreset(seasonId, name, ids) { const id = safeSeasonId(seasonId); const clean = cleanName(name); if (!id || !clean) return null; const previous = state; state = sanitizeSeasonModifierState(state); const current = readCurrent(id); const preset = { id: newPresetId(new Set(current.presets.map((item) => item.id))), name: clean, modifierIds: cleanIds(ids), updatedAt: new Date().toISOString() }; state.seasons[id] = { ...current, presets: [preset, ...current.presets].slice(0, MAX_PRESETS) }; const ok = persist(); if (!ok) state = previous; return { ...preset, ok } }
  function removePreset(seasonId, presetId) { const id = safeSeasonId(seasonId); const previous = state; state = sanitizeSeasonModifierState(state); const current = readCurrent(id); state.seasons[id] = { ...current, presets: current.presets.filter((preset) => preset.id !== cleanId(presetId)) }; const ok = persist(); if (!ok) state = previous; return ok }
  function replace(value) { const previous = state; state = sanitizeSeasonModifierState(value); const ok = persist(); if (!ok) state = previous; return ok }
  return { getState: () => state, getSeason: (id) => readCurrent(id), setDraft, savePreset, removePreset, replace }
}
function read(storage) { try { return JSON.parse(storage.getItem(SEASON_MODIFIER_STORAGE_KEY) || 'null') } catch { return null } }

const singletonStore = createSeasonModifierBuildStore()
const refs = new Map()
function getRefs(seasonId) { if (!refs.has(seasonId)) { const current = singletonStore.getSeason(seasonId); refs.set(seasonId, { draft: ref([...current.draft]), presets: ref([...current.presets]) }) } return refs.get(seasonId) }
export function useSeasonModifierBuilds(seasonId = KORD_BREACH_SEASON_ID) {
  const state = getRefs(seasonId)
  function setDraft(ids) { const result = singletonStore.setDraft(seasonId, ids); state.draft.value = [...result.ids]; return result }
  function savePreset(name, ids = state.draft.value) { const result = singletonStore.savePreset(seasonId, name, ids); state.presets.value = [...singletonStore.getSeason(seasonId).presets]; return result }
  function removePreset(id) { const result = singletonStore.removePreset(seasonId, id); state.presets.value = [...singletonStore.getSeason(seasonId).presets]; return result }
  return { draft: state.draft, presets: state.presets, setDraft, savePreset, removePreset, reset: () => setDraft([]), evaluate: (manifest) => evaluateSeasonModifierBuild(state.draft.value, manifest) }
}
export { normalizeModifierIds }
