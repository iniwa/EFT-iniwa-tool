<script setup>
// 鍵管理 — 全鍵の所持管理・ティア・根拠を一画面で辿れるカタログ
import { ref, computed } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useApiData } from '../composables/useApiData.js'
import { loadLS, saveLS } from '../composables/useStorage.js'
import { MAP_ORDER } from '../data/constants.js'
import { toHttpsUrl } from '../logic/taskReference.js'
import { KEY_REVIEW_META, ROLE_LABELS } from '../data/keyCuration.js'
import {
  TIER_ORDER, buildKeyCatalog, summarizeCatalog, effectiveTier, tierRank,
} from '../logic/keyEvaluation.js'
import BaseModal from './ui/BaseModal.vue'

const emit = defineEmits(['open-task-from-name'])

const {
  ownedKeys, keyUserData, keysViewMode, keysSortMode, completedTasks,
  toggleOwnedKey, updateKeyUserData,
} = useUserProgress()
const { itemsData, taskData } = useApiData()
const { gameMode } = useAppState()

const UNKNOWN_MAP = '場所不明'
const COLLAPSED_LS_KEY = 'eft_keys_collapsed_state'
const RATINGS = ['-', 'SS', 'S', 'A', 'B', 'C', 'D', 'F']
const SORTS = [
  { id: 'map', label: 'マップ順' },
  { id: 'tier', label: 'ティアが高い順' },
  { id: 'owned_first', label: '所持を先頭に' },
  { id: 'rating', label: '自分の評価順' },
]

// ---------------------------------------------------------------------------
// カタログ
// ---------------------------------------------------------------------------
const catalog = computed(() => buildKeyCatalog(itemsData.value, taskData.value, gameMode.value))
const summary = computed(() => summarizeCatalog(catalog.value))
const completedSet = computed(() => new Set(completedTasks.value))
const ownedSet = computed(() => new Set(ownedKeys.value))

function userRating(id) { return keyUserData.value[id]?.rating || '-' }
function userMemo(id) { return keyUserData.value[id]?.memo || '' }
function tierOf(k) { return effectiveTier(k, userRating(k.id)) }
function pendingTasks(k) { return k.tasks.filter((t) => !completedSet.value.has(t.id)) }

const mapOptions = computed(() => {
  const set = new Set()
  catalog.value.forEach((k) => set.add(k.primaryMap || UNKNOWN_MAP))
  return [...set].sort(mapCompare)
})

function mapCompare(a, b) {
  if (a === UNKNOWN_MAP) return 1
  if (b === UNKNOWN_MAP) return -1
  const ia = MAP_ORDER.indexOf(a)
  const ib = MAP_ORDER.indexOf(b)
  if (ia !== -1 && ib !== -1) return ia - ib
  if (ia !== -1) return -1
  if (ib !== -1) return 1
  return a.localeCompare(b)
}

// ---------------------------------------------------------------------------
// 絞り込み
// ---------------------------------------------------------------------------
const searchQuery = ref('')
const mapFilter = ref('')            // '' = 全マップ
const tierFilter = ref([])           // ティアまたはティアのない鍵の分類
const needNow = ref(false)           // 未完了タスクで必要
const confidenceFilter = ref('')     // '' | provisional | unverified

function toggleTier(t) {
  const i = tierFilter.value.indexOf(t)
  if (i === -1) tierFilter.value = [...tierFilter.value, t]
  else tierFilter.value = tierFilter.value.filter((x) => x !== t)
}

const filtersActive = computed(() => !!(
  searchQuery.value || mapFilter.value || tierFilter.value.length || needNow.value
  || confidenceFilter.value || keysViewMode.value === 'owned'
))

function resetFilters() {
  searchQuery.value = ''
  mapFilter.value = ''
  tierFilter.value = []
  needNow.value = false
  confidenceFilter.value = ''
  keysViewMode.value = 'all'
}

const filtered = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return catalog.value.filter((k) => {
    if (keysViewMode.value === 'owned' && !ownedSet.value.has(k.id)) return false
    if (mapFilter.value && (k.primaryMap || UNKNOWN_MAP) !== mapFilter.value
      && !k.maps.some((m) => m.name === mapFilter.value)) return false
    if (needNow.value && pendingTasks(k).length === 0) return false
    if (confidenceFilter.value && k.confidence !== confidenceFilter.value) return false
    if (tierFilter.value.length) {
      const t = tierOf(k)
      const label = t || k.confidence
      if (!tierFilter.value.includes(label)) return false
    }
    if (q) {
      const hay = `${k.name} ${k.shortName || ''} ${k.primaryMap || ''} ${k.tasks.map((t) => t.name).join(' ')}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
})

function compareKeys(a, b) {
  const mode = keysSortMode.value
  if (mode === 'owned_first') {
    const d = Number(ownedSet.value.has(b.id)) - Number(ownedSet.value.has(a.id))
    if (d) return d
  }
  if (mode === 'rating') {
    const ra = RATINGS.indexOf(userRating(a.id)); const rb = RATINGS.indexOf(userRating(b.id))
    const sa = ra <= 0 ? 99 : ra; const sb = rb <= 0 ? 99 : rb
    if (sa !== sb) return sa - sb
  }
  if (mode === 'tier' || mode === 'map' || mode === 'owned_first' || mode === 'rating') {
    const d = tierRank(tierOf(a)) - tierRank(tierOf(b))
    if (d) return d
  }
  return a.name.localeCompare(b.name)
}

const sortMode = computed(() => (SORTS.some((s) => s.id === keysSortMode.value) ? keysSortMode.value : 'map'))

// 並び順が「ティア順」のときはマップをまたいで 1 本のリストにする
const groups = computed(() => {
  const list = [...filtered.value]
  if (sortMode.value === 'tier') {
    list.sort(compareKeys)
    return [{ name: null, keys: list }]
  }
  const byMap = new Map()
  list.forEach((k) => {
    const m = k.primaryMap || UNKNOWN_MAP
    if (!byMap.has(m)) byMap.set(m, [])
    byMap.get(m).push(k)
  })
  return [...byMap.entries()]
    .sort((a, b) => mapCompare(a[0], b[0]))
    .map(([name, keys]) => ({ name, keys: keys.sort(compareKeys) }))
})

// ---------------------------------------------------------------------------
// 展開・補助表示
// ---------------------------------------------------------------------------
const expanded = ref(new Set())
function toggleExpand(id) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}
const collapsedGroups = ref(loadLS(COLLAPSED_LS_KEY, null) || {})
function isGroupCollapsed(name) {
  const storageName = name === UNKNOWN_MAP ? 'Unknown / Other' : name
  return collapsedGroups.value[storageName] === true
}

function toggleGroup(name) {
  const storageName = name === UNKNOWN_MAP ? 'Unknown / Other' : name
  collapsedGroups.value = { ...collapsedGroups.value, [storageName]: !isGroupCollapsed(name) }
  saveLS(COLLAPSED_LS_KEY, collapsedGroups.value)
}

const CONF_LABEL = Object.fromEntries(KEY_REVIEW_META.confidence.map(({ id, label }) => [id, label]))
function tarkovUrl(k) {
  return k.normalizedName ? toHttpsUrl(`https://tarkov.dev/item/${encodeURIComponent(k.normalizedName)}`) : null
}
function onRating(id, e) { updateKeyUserData(id, 'rating', e.target.value) }
function onMemo(id, e) { updateKeyUserData(id, 'memo', e.target.value) }

const basisOpen = ref(false)
</script>

<template>
  <section class="km" aria-labelledby="km-title">
    <header class="km-head">
      <div class="km-title-row">
        <h2 id="km-title" class="km-title">鍵管理</h2>
        <button type="button" class="km-link-btn" @click="basisOpen = true">評価基準と出典</button>
      </div>
      <p class="km-sub">
        全 {{ summary.total }} 本 / 所持 {{ ownedKeys.length }} 本。
        評価済み {{ summary.provisional }}・用途のみ {{ summary.usage }}・未確認 {{ summary.unverified }}
        <span class="km-sub-note">(ゲーム版 {{ KEY_REVIEW_META.gameVersion }}、{{ KEY_REVIEW_META.checkedAt }} 確認)</span>
      </p>
    </header>

    <div class="km-filters" role="search">
      <div class="km-row">
        <input
          v-model="searchQuery" type="search" class="km-input km-search"
          placeholder="鍵名・略称・タスク名で検索" aria-label="鍵を検索"
        />
        <select v-model="mapFilter" class="km-input km-select" aria-label="マップで絞り込む">
          <option value="">全マップ</option>
          <option v-for="m in mapOptions" :key="m" :value="m">{{ m }}</option>
        </select>
        <select v-model="keysSortMode" class="km-input km-select" aria-label="並び順">
          <option v-for="s in SORTS" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </div>

      <div class="km-row km-chips" role="group" aria-label="ティアで絞り込む">
        <button
          v-for="t in TIER_ORDER" :key="t" type="button"
          class="km-chip tier" :class="['t-' + t, { on: tierFilter.includes(t) }]"
          :aria-pressed="tierFilter.includes(t)" @click="toggleTier(t)"
        >{{ t }}<small>{{ summary.byTier[t] }}</small></button>
        <button
          v-for="status in ['usage', 'unverified']" :key="status" type="button"
          class="km-chip tier t-none" :class="{ on: tierFilter.includes(status) }"
          :aria-pressed="tierFilter.includes(status)" @click="toggleTier(status)"
        >{{ CONF_LABEL[status] }}<small>{{ summary[status] }}</small></button>
      </div>

      <div class="km-row km-toggles">
        <button type="button" class="km-chip" :class="{ on: keysViewMode === 'owned' }"
          :aria-pressed="keysViewMode === 'owned'" @click="keysViewMode = keysViewMode === 'owned' ? 'all' : 'owned'">所持のみ</button>
        <button type="button" class="km-chip" :class="{ on: needNow }"
          :aria-pressed="needNow" @click="needNow = !needNow">未完了タスクで必要</button>
        <button type="button" class="km-chip" :class="{ on: confidenceFilter === 'provisional' }"
          :aria-pressed="confidenceFilter === 'provisional'"
          @click="confidenceFilter = confidenceFilter === 'provisional' ? '' : 'provisional'">暫定のみ</button>
        <button v-if="filtersActive" type="button" class="km-link-btn" @click="resetFilters">絞り込みを解除</button>
        <span class="km-count" aria-live="polite">{{ filtered.length }} 本を表示</span>
      </div>
    </div>

    <div v-for="g in groups" :key="g.name ?? 'all'" class="km-group">
      <button
        v-if="g.name" type="button" class="km-group-head"
        :aria-expanded="!isGroupCollapsed(g.name)" @click="toggleGroup(g.name)"
      >
        <span class="km-group-name">{{ g.name }}</span>
        <span class="km-group-n">{{ g.keys.length }} 本 / 所持 {{ g.keys.filter((k) => ownedSet.has(k.id)).length }}</span>
        <span class="km-group-caret" aria-hidden="true">{{ isGroupCollapsed(g.name) ? '＋' : '－' }}</span>
      </button>

      <ul v-show="!g.name || !isGroupCollapsed(g.name)" class="km-list">
        <li v-for="k in g.keys" :key="k.id" class="km-item" :class="{ owned: ownedSet.has(k.id) }">
          <div class="km-line">
            <button
              type="button" class="km-own" :class="{ on: ownedSet.has(k.id) }"
              :aria-pressed="ownedSet.has(k.id)" :aria-label="`${k.name} を所持`"
              @click="toggleOwnedKey(k.id)"
            >{{ ownedSet.has(k.id) ? '所持' : '未所持' }}</button>

            <span class="km-thumb" aria-hidden="true"><img v-if="k.image" :src="k.image" alt="" loading="lazy" /></span>

            <button type="button" class="km-main" :aria-expanded="expanded.has(k.id)" @click="toggleExpand(k.id)">
              <span class="km-name">{{ k.name }}</span>
              <span class="km-meta">
                <span v-if="k.shortName" class="km-short">{{ k.shortName }}</span>
                <span v-if="k.locks" class="km-tag">施錠 {{ k.locks }}</span>
                <span v-for="r in k.roles" :key="r" class="km-tag role">{{ ROLE_LABELS[r] }}</span>
                <span v-if="k.tasks.length" class="km-tag task" :class="{ done: !pendingTasks(k).length }">
                  タスク {{ pendingTasks(k).length }}/{{ k.tasks.length }}
                </span>
                <span v-if="k.isNew" class="km-tag new">新規 {{ k.isNew }}</span>
                <span v-if="k.duplicateName" class="km-tag warn">同名あり</span>
                <span v-if="k.noFlea" class="km-tag">フリマ不可</span>
              </span>
            </button>

            <span class="km-grade">
              <span v-if="userRating(k.id) !== '-'" class="km-mine" :class="'t-' + userRating(k.id)" title="自分の評価">{{ userRating(k.id) }}</span>
              <span
                class="km-tier" :class="[k.tier ? 't-' + k.tier : 't-none', 'c-' + k.confidence]"
                :title="`標準ティア (${CONF_LABEL[k.confidence]})`"
              >
                <b>{{ k.tier || '—' }}</b><i>{{ CONF_LABEL[k.confidence] }}</i>
              </span>
            </span>
          </div>

          <div v-if="expanded.has(k.id)" class="km-detail">
            <div class="km-col">
              <h3>評価の根拠</h3>
              <ul v-if="k.reasons.length" class="km-reasons">
                <li v-for="r in k.reasons" :key="r">{{ r }}</li>
              </ul>
              <template v-if="k.loot && k.tier && k.tier !== 'F'">
                <h3>開錠先の戦利品</h3>
                <p v-if="k.loot.room || k.primaryMap" class="km-note">{{ k.loot.room || k.primaryMap }}</p>
                <p v-if="k.loot.items?.length" class="km-note">直湧きの出現例 {{ k.loot.items.join('、') }}</p>
                <p v-if="k.loot.containers" class="km-note">探索できる容器 {{ k.loot.containers }}</p>
                <p v-if="k.loot.note" class="km-note">{{ k.loot.note }}</p>
              </template>
              <p v-if="k.review?.note" class="km-note">{{ k.review.note }}</p>
              <p v-for="sample in k.observations" :key="sample.slug" class="km-note">
                {{ sample.mode }}・{{ sample.openings }}回の平均
                {{ sample.averageRub.toLocaleString('ja-JP') }} ₽／開錠（鍵代控除前）
                <a :href="`https://raidsignal.com/keys/${sample.slug}`" target="_blank" rel="noopener noreferrer">開錠記録</a>
              </p>
              <div class="km-links km-src">
                <a v-if="k.loot?.url || k.reviewUrl" :href="k.loot?.url || k.reviewUrl" target="_blank" rel="noopener noreferrer">照合した資料</a>
                <a v-if="k.referenceUrl" :href="k.referenceUrl" target="_blank" rel="noopener noreferrer">マップ・鍵索引</a>
                <a v-if="k.fallbackUrl" :href="k.fallbackUrl" target="_blank" rel="noopener noreferrer">鍵データの出典</a>
              </div>
              <p v-if="k.notInItemDb" class="km-note warn">アイテム DB に見つからない鍵 ID です。</p>
            </div>

            <div class="km-col">
              <h3>使う場所</h3>
              <ul v-if="k.maps.length" class="km-plain">
                <li v-for="m in k.maps" :key="m.name">{{ m.name }}: {{ m.count }} か所</li>
              </ul>
              <p v-else class="km-dim">{{ k.primaryMap ? `${k.primaryMap}（資料）` : '場所の資料なし' }}。APIの施錠データなし。</p>

              <h3>必要なタスク</h3>
              <ul v-if="k.tasks.length" class="km-plain">
                <li v-for="t in k.tasks" :key="t.id">
                  <button type="button" class="km-task" @click="emit('open-task-from-name', { id: t.id, name: t.name })">{{ t.name }}</button>
                  <span v-if="completedSet.has(t.id)" class="km-dim">(完了)</span>
                  <span v-if="t.kappa" class="km-tag">Kappa</span>
                  <span v-else-if="t.lightkeeper" class="km-tag">Lightkeeper</span>
                </li>
              </ul>
              <p v-else class="km-dim">使うタスクはありません。</p>
            </div>

            <div class="km-col">
              <h3>自分の評価とメモ</h3>
              <label class="km-field">
                <span>自分の評価</span>
                <select class="km-input" :value="userRating(k.id)" @change="onRating(k.id, $event)">
                  <option v-for="r in RATINGS" :key="r" :value="r">{{ r === '-' ? '未設定 (標準ティアを使う)' : r }}</option>
                </select>
              </label>
              <label class="km-field">
                <span>メモ</span>
                <input class="km-input" type="text" :value="userMemo(k.id)" placeholder="メモ" @input="onMemo(k.id, $event)" />
              </label>
              <div class="km-links">
                <a v-if="toHttpsUrl(k.wikiLink)" :href="toHttpsUrl(k.wikiLink)" target="_blank" rel="noopener noreferrer">Wiki</a>
                <a v-if="tarkovUrl(k)" :href="tarkovUrl(k)" target="_blank" rel="noopener noreferrer">tarkov.dev</a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="!filtered.length" class="km-empty">
      <p>条件に合う鍵がありません。</p>
      <button v-if="filtersActive" type="button" class="km-link-btn" @click="resetFilters">絞り込みを解除</button>
    </div>

    <BaseModal :show="basisOpen" aria-label="鍵の評価基準と出典" max-width="720px" @close="basisOpen = false">
      <div class="km-basis">
        <div class="km-basis-head">
          <h3>鍵の評価基準と出典</h3>
          <button type="button" class="km-link-btn" @click="basisOpen = false">閉じる</button>
        </div>
        <p class="km-dim">
          ゲーム版 {{ KEY_REVIEW_META.gameVersion }}、{{ KEY_REVIEW_META.checkedAt }} 時点。{{ KEY_REVIEW_META.gameVersionNote }}
          標準ティアは部屋の資料をもとにした共通の暫定評価です。開錠記録は該当モードのサンプルのみ表示し、出現率や収益を保証するものではありません。
        </p>

        <h4>棚卸し</h4>
        <ul class="km-plain">
          <li>鍵 {{ summary.total }} 本 (評価済み {{ summary.provisional }} / 用途のみ {{ summary.usage }} / 未確認 {{ summary.unverified }})</li>
          <li>同名の別 ID: {{ summary.duplicates }} 本 (Folding car key)</li>
          <li>1.2.0.0 の新規鍵: {{ summary.newKeys }} 本 (ZB-1013 key、Security post key)</li>
          <li>資料から場所を特定できない鍵: {{ summary.noMap }} 本</li>
        </ul>

        <h4>戦利品ティア</h4>
        <table class="km-table">
          <tbody>
            <tr v-for="t in KEY_REVIEW_META.tiers" :key="t.tier">
              <th scope="row"><span class="km-tier" :class="'t-' + t.tier"><b>{{ t.tier }}</b></span></th>
              <td>{{ t.text }}</td>
            </tr>
          </tbody>
        </table>

        <h4>確度の見方</h4>
        <ul class="km-plain">
          <li v-for="c in KEY_REVIEW_META.confidence" :key="c.id"><b>{{ c.label }}</b>: {{ c.text }}</li>
        </ul>
        <p class="km-dim">標準ティアは固定の参考値です。「自分の評価」を付けると、一覧のティア表示と絞り込みでは自分の評価を優先します。所持と自分の評価は端末のこのモードの保存データに残ります。</p>

        <h4>出典</h4>
        <ul class="km-plain">
          <li v-for="s in KEY_REVIEW_META.sources" :key="s.id">
            <a :href="s.url" target="_blank" rel="noopener noreferrer">{{ s.label }}</a>: {{ s.detail }}
          </li>
        </ul>
      </div>
    </BaseModal>
  </section>
</template>

<style scoped>
.km { max-width: 1040px; margin: 0 auto; padding-bottom: 24px; }
.km-head { margin-bottom: 12px; }
.km-title-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.km-title { font-size: 20px; font-weight: 700; margin: 0; color: var(--gold); }
.km-sub { margin: 4px 0 0; color: var(--color-text-muted); font-size: 13px; }
.km-sub-note { margin-left: 4px; }
.km-link-btn { background: none; border: 0; padding: 4px 0; color: var(--info); text-decoration: underline; cursor: pointer; font-size: 13px; }

.km-filters { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 10px; display: grid; gap: 8px; margin-bottom: 12px; }
.km-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.km-input { background: var(--surface-input); border: 1px solid var(--line); color: var(--color-text); border-radius: var(--radius); padding: 7px 10px; min-height: 38px; font-size: 14px; }
.km-search { flex: 1 1 220px; min-width: 0; }
.km-select { flex: 0 1 170px; }
.km-chips { gap: 6px; }
.km-chip { background: var(--surface-input); border: 1px solid var(--line); color: var(--color-text); border-radius: 999px; padding: 4px 12px; min-height: 34px; font-size: 13px; cursor: pointer; display: inline-flex; gap: 6px; align-items: baseline; }
.km-chip small { color: var(--color-text-muted); font-size: 11px; }
.km-chip.on { background: var(--info); border-color: var(--info); color: #06161a; }
.km-chip.on small { color: #06161a; }
.km-count { margin-left: auto; color: var(--color-text-muted); font-size: 13px; }

.km-group { margin-bottom: 10px; }
.km-group-head { width: 100%; display: flex; align-items: center; gap: 12px; text-align: left; background: var(--surface-hi); border: 1px solid var(--line); border-left: 4px solid var(--mode-color); color: var(--color-text); padding: 8px 12px; border-radius: var(--radius); cursor: pointer; position: sticky; top: calc(var(--topbar-h) + 3px); z-index: 2; }
.km-group-name { font-weight: 700; }
.km-group-n { color: var(--color-text-muted); font-size: 13px; }
.km-group-caret { margin-left: auto; color: var(--color-text-muted); }

.km-list { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 4px; }
.km-item { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.km-item.owned { border-color: color-mix(in srgb, var(--mode-color) 55%, var(--line)); background: color-mix(in srgb, var(--mode-color) 8%, var(--surface)); }
.km-line { display: flex; align-items: center; gap: 10px; padding: 6px 10px; }
.km-own { flex: 0 0 auto; width: 62px; min-height: 40px; border-radius: var(--radius); border: 1px solid var(--line); background: var(--surface-input); color: var(--color-text-muted); font-size: 13px; cursor: pointer; }
.km-own.on { background: var(--mode-color); border-color: var(--mode-color); color: #04120a; font-weight: 700; }
.km-thumb { flex: 0 0 auto; width: 38px; height: 38px; background: #000; border: 1px solid var(--line); border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.km-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; }
.km-main { flex: 1 1 auto; min-width: 0; text-align: left; background: none; border: 0; padding: 4px 0; color: var(--color-text); cursor: pointer; display: grid; gap: 2px; }
.km-name { font-weight: 600; overflow-wrap: anywhere; }
.km-meta { display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; font-size: 12px; color: var(--color-text-muted); }
.km-short { color: var(--info); }
.km-tag { border: 1px solid var(--line); border-radius: 4px; padding: 0 6px; line-height: 18px; }
.km-tag.role { border-color: #8a7a2a; color: var(--gold); }
.km-tag.task { border-color: #2a6f80; color: var(--info); }
.km-tag.task.done { color: var(--color-text-muted); border-color: var(--line); }
.km-tag.new { border-color: #3a8f5a; color: #6fd196; }
.km-tag.warn { border-color: #a0522d; color: #f0a070; }

.km-grade { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; }
.km-mine { min-width: 30px; text-align: center; font-weight: 800; font-size: 13px; padding: 2px 6px; border-radius: 4px; border: 1px solid currentColor; }
.km-tier { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; min-width: 52px; padding: 2px 6px; border-radius: 6px; border: 2px solid currentColor; line-height: 1.1; }
.km-tier b { font-size: 18px; font-weight: 800; }
.km-tier i { font-style: normal; font-size: 10px; }
.km-tier.c-provisional { border-style: dashed; }
.km-tier.c-unverified { border-style: dotted; opacity: 0.75; }

.t-SS { color: #ffd24a; }
.t-S { color: #ff9f43; }
.t-A { color: #5ed28a; }
.t-B { color: #4fd1e8; }
.t-C { color: #8fa6ff; }
.t-D { color: #a8b0bd; }
.t-F { color: #7b828e; }
.t-none { color: #7b828e; }
.km-chip.tier { font-weight: 700; }
.km-chip.tier:not(.on) { color: inherit; }
.km-chip.tier.t-SS:not(.on) { color: #ffd24a; } .km-chip.tier.t-S:not(.on) { color: #ff9f43; }
.km-chip.tier.t-A:not(.on) { color: #5ed28a; } .km-chip.tier.t-B:not(.on) { color: #4fd1e8; }
.km-chip.tier.t-C:not(.on) { color: #8fa6ff; } .km-chip.tier.t-D:not(.on) { color: #a8b0bd; }
.km-chip.tier.t-F:not(.on), .km-chip.tier.t-none:not(.on) { color: #9aa1ad; }

.km-detail { border-top: 1px solid var(--line); padding: 10px 12px 12px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.km-col h3 { font-size: 13px; margin: 0 0 4px; color: var(--gold); }
.km-col h3:not(:first-child) { margin-top: 10px; }
.km-reasons, .km-plain { margin: 0; padding-left: 18px; font-size: 13px; }
.km-plain { list-style: none; padding-left: 0; }
.km-plain li { margin-bottom: 2px; }
.km-note, .km-src { margin: 6px 0 0; font-size: 12.5px; color: var(--color-text-muted); }
.km-note.warn { color: #f0a070; }
.km-dim { color: var(--color-text-muted); font-size: 13px; margin: 0; }
.km-task { background: none; border: 0; padding: 0; color: var(--info); text-decoration: underline; cursor: pointer; text-align: left; }
.km-field { display: grid; gap: 2px; font-size: 12.5px; color: var(--color-text-muted); margin-bottom: 8px; }
.km-field .km-input { width: 100%; }
.km-links { display: flex; gap: 12px; font-size: 13px; }
.km-links a { color: var(--info); }

.km-empty { text-align: center; padding: 28px 12px; color: var(--color-text-muted); }

.km-basis { padding: 16px; max-height: 80vh; overflow: auto; }
.km-basis-head { display: flex; justify-content: space-between; align-items: baseline; }
.km-basis h3 { margin: 0 0 6px; font-size: 18px; color: var(--gold); }
.km-basis h4 { font-size: 14px; margin: 16px 0 6px; color: var(--info); }
.km-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.km-table th, .km-table td { text-align: left; padding: 4px 8px 4px 0; border-bottom: 1px solid var(--line); font-weight: 400; vertical-align: middle; }
.km-table th { font-weight: 600; white-space: nowrap; }
.km-basis a { color: var(--info); }

@media (max-width: 767.98px) {
  .km-detail { grid-template-columns: 1fr; }
  .km-line { gap: 8px; padding: 6px 8px; }
  .km-own { width: 52px; }
  .km-select { flex: 1 1 140px; }
  .km-count { margin-left: 0; width: 100%; }
  .km-group-head { top: var(--topbar-h); }
}
@media (max-width: 479.98px) {
  .km-thumb { display: none; }
}
</style>
