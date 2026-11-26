<script setup>
import { ref, computed, watch } from 'vue'
import { useUserProgress } from '../composables/useUserProgress.js'
import { MAIN_CHAPTERS } from '../data/storyChaptersMain.js'
import { SIDE_CHAPTERS } from '../data/storyChaptersSide.js'
import { toHttpsUrl } from '../logic/taskReference.js'
import { resolveStorySelection } from '../logic/boreasReferenceLogic.js'
import { getBulkCompletableStepIds, isStepDone, isRequiredStep, routeFromCaseChoice, isStepVisible as visibleByProgress, getChapterStats, findNextStep, findUnmappedRecords } from '../logic/storyLogic.js'
import { STORY_META, STORY_CHECKED_AT, STORY_GAME_VERSION, STORY_SOURCE_INDEX, STORY_OFFICIAL_SOURCE, STORY_STEP_NOTES, CONFIDENCE_LABEL } from '../data/storyMeta.js'

const STORY_CHAPTERS = [...MAIN_CHAPTERS, ...SIDE_CHAPTERS]
const safeUrl = toHttpsUrl

const { storyProgress, updateStoryProgress } = useUserProgress()

// --- State ---
const selectedChapterId = ref(localStorage.getItem('eft_story_selected_chapter') || 'tour')
watch(selectedChapterId, (val) => localStorage.setItem('eft_story_selected_chapter', val))
const expandedOptionals = ref({})
const showEvidence = ref(false)
const showLegacy = ref(false)
watch(selectedChapterId, () => { showEvidence.value = false })

// Falling Skies の装甲ケース選択 → The Ticket の序盤ルートへ自動反映
watch(() => storyProgress.value?.falling_skies?.fs_case_choice, (val) => {
  if (!val) return
  const route = routeFromCaseChoice(val)
  if (!route) return // 未知の旧選択値ではルートを上書き・自動選択しない
  if (storyProgress.value?.the_ticket?.tt_route_choice !== route) updateStoryProgress('the_ticket', 'tt_route_choice', route)
}, { immediate: true })

const activeChapter = computed(() => STORY_CHAPTERS.find(c => c.id === selectedChapterId.value))
watch(activeChapter, (chapter) => {
  if (!chapter) selectedChapterId.value = resolveStorySelection(selectedChapterId.value, STORY_CHAPTERS)
}, { immediate: true })
const meta = computed(() => STORY_META[selectedChapterId.value] || null)

// Wiki掲載順。
const sortedChapters = computed(() => [...STORY_CHAPTERS].sort((a, b) => (STORY_META[a.id]?.order ?? 99) - (STORY_META[b.id]?.order ?? 99)))
const mainChapters = computed(() => sortedChapters.value.filter(c => c.category === 'main'))
const sideChapters = computed(() => sortedChapters.value.filter(c => c.category === 'side'))

// --- 進捗 ---
const statsById = computed(() => Object.fromEntries(STORY_CHAPTERS.map(c => [c.id, getChapterStats(c, storyProgress.value)])))
const overall = computed(() => {
  const all = Object.values(statsById.value)
  return { done: all.reduce((n, s) => n + s.done, 0), total: all.reduce((n, s) => n + s.total, 0), chapters: all.filter(s => s.complete).length, count: all.length }
})
function pct(s) { return s && s.total ? Math.round((s.done / s.total) * 100) : 0 }
function statusOf(chapterId) {
  const s = statsById.value[chapterId]
  if (!s || !s.total) return 'none'
  return s.complete ? 'done' : s.done > 0 ? 'doing' : 'todo'
}
const STATUS_LABEL = { none: '', todo: '未着手', doing: '進行中', done: '完了' }

const stats = computed(() => statsById.value[selectedChapterId.value] || { done: 0, total: 0, complete: false })
const nextStep = computed(() => activeChapter.value ? findNextStep(activeChapter.value, storyProgress.value) : null)
const unmapped = computed(() => findUnmappedRecords(STORY_CHAPTERS, storyProgress.value))

// --- ステップ ---
function getStepValue(stepId, chapterId) {
  return storyProgress.value[chapterId || selectedChapterId.value]?.[stepId] || false
}
function stepDone(step) { return isStepDone(step, getStepValue(step.id)) }
function isStepVisible(step) { return visibleByProgress(step, activeChapter.value, storyProgress.value) }
function phaseView(phase) {
  const visible = phase.steps.filter(isStepVisible)
  const required = visible.filter(s => !s.optional)
  const actionable = required.filter(isRequiredStep)
  return {
    required,
    optional: visible.filter(s => s.optional),
    done: actionable.filter(stepDone).length,
    total: actionable.length,
  }
}
const phases = computed(() => (activeChapter.value?.phases || []).map(p => ({ phase: p, ...phaseView(p) })).filter(v => v.required.length || v.optional.length))
const choiceSteps = computed(() => phases.value.flatMap(v => v.required.filter(s => s.type === 'choice')))

function onUpdateStep(stepId, value) { updateStoryProgress(selectedChapterId.value, stepId, value) }
function toggleOptional(id) { expandedOptionals.value[id] = !expandedOptionals.value[id] }
function optionLabel(step) { return step.options?.find(o => o.value === getStepValue(step.id))?.label }
function stepNote(step) { return STORY_STEP_NOTES[step.id] || '' }
function jumpTo(step) {
  const el = typeof document !== 'undefined' ? document.getElementById('story-step-' + step.id) : null
  if (el?.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/** 確定できるチェックのみ一括完了。選択肢は常に本人が決める */
function completeChapter() {
  if (!activeChapter.value) return
  if (!confirm(`「${activeChapter.value.title}」のチェック項目を完了にしますか？選択肢は変更されません。`)) return
  getBulkCompletableStepIds(activeChapter.value, isStepVisible).forEach((id) => onUpdateStep(id, true))
}
function resetChapter() {
  if (!activeChapter.value) return
  if (!confirm(`「${activeChapter.value.title}」の進捗を全てリセットしますか？`)) return
  activeChapter.value.phases.forEach(phase => {
    phase.steps.forEach(s => {
      if (['check', 'wait', 'choice'].includes(s.type) && getStepValue(s.id)) onUpdateStep(s.id, false)
    })
  })
}
function chapterTitle(id) { return STORY_CHAPTERS.find(c => c.id === id)?.title || id }
</script>

<template>
  <div class="story">
    <!-- 全体サマリ -->
    <header class="story-head">
      <div>
        <h1 class="story-title">ストーリー進行</h1>
        <p class="story-sub">{{ overall.chapters }} / {{ overall.count }} 章 完了 ・ チェック {{ overall.done }} / {{ overall.total }}</p>
      </div>
      <div class="story-bar story-bar-lg" role="progressbar" :aria-valuenow="pct(overall)" aria-valuemin="0" aria-valuemax="100" aria-label="全体の進捗">
        <span :style="{ width: pct(overall) + '%' }"></span>
      </div>
    </header>

    <!-- スマホ: 章セレクト -->
    <div class="story-picker d-md-none">
      <label for="story-chapter-select" class="story-picker-label">章を選ぶ</label>
      <select id="story-chapter-select" class="form-select form-select-sm" :value="selectedChapterId" @change="selectedChapterId = $event.target.value">
        <optgroup label="メインストーリー">
          <option v-for="c in mainChapters" :key="c.id" :value="c.id">{{ c.title }}{{ STATUS_LABEL[statusOf(c.id)] ? '（' + STATUS_LABEL[statusOf(c.id)] + '）' : '' }}</option>
        </optgroup>
        <optgroup label="サイドストーリー">
          <option v-for="c in sideChapters" :key="c.id" :value="c.id">{{ c.title }}{{ STATUS_LABEL[statusOf(c.id)] ? '（' + STATUS_LABEL[statusOf(c.id)] + '）' : '' }}</option>
        </optgroup>
      </select>
    </div>

    <div class="story-body">
      <!-- PC: 章レール -->
      <nav class="story-rail d-none d-md-flex" aria-label="章">
        <p class="rail-group">メインストーリー</p>
        <button v-for="c in mainChapters" :key="c.id" class="rail-item" :class="{ active: selectedChapterId === c.id }" :aria-current="selectedChapterId === c.id ? 'true' : null" @click="selectedChapterId = c.id">
          <span class="rail-no">{{ STORY_META[c.id]?.order ?? '·' }}</span>
          <span class="rail-main">
            <span class="rail-name">{{ c.title }}</span>
            <span class="story-bar"><span :style="{ width: pct(statsById[c.id]) + '%' }"></span></span>
          </span>
          <span class="rail-count" :class="'st-' + statusOf(c.id)">{{ statsById[c.id].total ? statsById[c.id].done + '/' + statsById[c.id].total : '—' }}</span>
        </button>
        <p class="rail-group">サイドストーリー</p>
        <button v-for="c in sideChapters" :key="c.id" class="rail-item" :class="{ active: selectedChapterId === c.id }" :aria-current="selectedChapterId === c.id ? 'true' : null" @click="selectedChapterId = c.id">
          <span class="rail-no">{{ STORY_META[c.id]?.order ?? '·' }}</span>
          <span class="rail-main">
            <span class="rail-name">{{ c.title }}</span>
            <span class="story-bar"><span :style="{ width: pct(statsById[c.id]) + '%' }"></span></span>
          </span>
          <span class="rail-count" :class="'st-' + statusOf(c.id)">{{ statsById[c.id].total ? statsById[c.id].done + '/' + statsById[c.id].total : '—' }}</span>
        </button>
      </nav>

      <main class="story-main">
        <!-- 注意 -->
        <p class="story-warn">ネタバレを含みます（設定でタブごと非表示にできます）。内容は外部資料からこのツール用に要約・再構成したもので、ゲーム内の表示とは異なる場合があります。</p>

        <!-- 章ヘッダ（共通） -->
        <section v-if="meta && activeChapter" class="chapter-head">
          <div class="chapter-head-top">
            <h2 class="chapter-name">{{ activeChapter.title }}</h2>
            <span class="pill" :class="CONFIDENCE_LABEL[meta.confidence]?.cls">{{ CONFIDENCE_LABEL[meta.confidence]?.text }}</span>
            <span v-if="meta.changed" class="pill is-changed">追加・変更あり</span>
            <span v-if="STATUS_LABEL[statusOf(selectedChapterId)]" class="pill" :class="'st-pill-' + statusOf(selectedChapterId)">{{ STATUS_LABEL[statusOf(selectedChapterId)] }}</span>
          </div>
          <p class="chapter-summary">{{ meta.summary }}</p>
          <p class="chapter-unlock"><strong>開始条件</strong>　{{ meta.unlock.text }}<span v-if="!meta.unlock.confirmed" class="unconfirmed">（未確定）</span></p>

          <div v-if="meta.branches?.length" class="branch-box">
            <p class="branch-label">分岐の見方</p>
            <ul>
              <li v-for="b in meta.branches" :key="b.title"><strong>{{ b.title }}</strong>：{{ b.text }}</li>
            </ul>
          </div>

          <button class="evidence-toggle" :aria-expanded="showEvidence" @click="showEvidence = !showEvidence">
            {{ showEvidence ? '▾' : '▸' }} 根拠と未確認事項（{{ meta.unconfirmed?.length || 0 }}件）
          </button>
          <div v-if="showEvidence" class="evidence">
            <p class="evidence-line">確認日 {{ STORY_CHECKED_AT }} ・ 公式: {{ STORY_GAME_VERSION.official }}</p>
            <p class="evidence-line">{{ STORY_GAME_VERSION.wiki }}</p>
            <p class="evidence-line">
              出典:
              <template v-for="s in meta.sources" :key="s.url"><a v-if="safeUrl(s.url)" :href="safeUrl(s.url)" target="_blank" rel="noopener noreferrer">{{ s.label }}</a> / </template>
              <a :href="STORY_SOURCE_INDEX.url" target="_blank" rel="noopener noreferrer">{{ STORY_SOURCE_INDEX.label }}</a> /
              <a :href="STORY_OFFICIAL_SOURCE.url" target="_blank" rel="noopener noreferrer">{{ STORY_OFFICIAL_SOURCE.label }}</a>
            </p>
            <p v-if="meta.unconfirmed?.length" class="evidence-head">未確認・資料間の不一致</p>
            <ul v-if="meta.unconfirmed?.length">
              <li v-for="u in meta.unconfirmed" :key="u">{{ u }}</li>
            </ul>
          </div>
        </section>

        <!-- 通常章 -->
        <template v-if="activeChapter">
          <!-- 次の一手 -->
          <section v-if="nextStep && stats.total" class="next-card">
            <div>
              <p class="next-label">次にやること</p>
              <p class="next-text">{{ nextStep.step.type === 'choice' ? '選択: ' : '' }}{{ nextStep.step.text }}</p>
              <p class="next-phase">{{ nextStep.phase.title }}</p>
            </div>
            <button class="btn btn-sm btn-outline-warning" @click="jumpTo(nextStep.step)">該当箇所へ</button>
          </section>

          <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
            <div class="story-bar story-bar-md flex-grow-1" role="progressbar" :aria-valuenow="pct(stats)" aria-valuemin="0" aria-valuemax="100" aria-label="この章の進捗"><span :style="{ width: pct(stats) + '%' }"></span></div>
            <span class="small text-secondary">{{ stats.done }} / {{ stats.total }}</span>
            <button v-if="!activeChapter.manualOnly && stats.done < stats.total" class="btn btn-sm btn-outline-success" @click="completeChapter">&#10003; チェック項目を一括完了</button>
            <button v-else-if="stats.done > 0" class="btn btn-sm btn-outline-secondary" @click="resetChapter">リセット</button>
            <a v-if="safeUrl(activeChapter.wikiLink)" :href="safeUrl(activeChapter.wikiLink)" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-info">{{ activeChapter.wikiLabel || '英語Wiki' }}</a>
          </div>

          <p v-if="stats.complete" class="done-banner">このチャプターの全必須手順が完了しました</p>
          <p v-else-if="stats.total && !nextStep && activeChapter.incompleteMessage" class="small text-warning">{{ activeChapter.incompleteMessage }}</p>

          <!-- 段階 -->
          <ol class="phases">
            <li v-for="v in phases" :key="v.phase.id" class="phase" :class="{ 'phase-done': v.total > 0 && v.done === v.total }">
              <div class="phase-head">
                <h3 class="phase-title">{{ v.phase.title }}</h3>
                <span v-if="v.total" class="phase-count">{{ v.done }}/{{ v.total }}</span>
              </div>

              <div class="steps">
                <template v-for="step in v.required" :key="step.id">
                  <div v-if="step.type === 'check' || step.type === 'wait'" :id="'story-step-' + step.id" class="step" :class="{ done: stepDone(step) }">
                    <input class="form-check-input" type="checkbox" :id="step.id" :checked="stepDone(step)" @change="onUpdateStep(step.id, $event.target.checked)">
                    <label :for="step.id">
                      <span v-if="step.type === 'wait'" class="wait-tag">&#9202; {{ step.duration }}</span>
                      <span v-if="step.reference" class="ref-tag">参考</span>
                      {{ step.text }}
                      <span v-if="stepNote(step)" class="unconfirmed">（{{ stepNote(step) }}）</span>
                      <span v-if="step.hint" class="step-hint">{{ step.hint }}</span>
                    </label>
                  </div>

                  <div v-else-if="step.type === 'choice'" :id="'story-step-' + step.id" class="choice">
                    <p class="choice-q"><span v-if="step.reference" class="ref-tag">参考</span>分岐 ・ {{ step.text }}</p>
                    <p v-if="step.hint" class="step-hint ms-0">{{ step.hint }}</p>
                    <label v-for="opt in step.options" :key="opt.value" class="choice-opt" :class="{ picked: getStepValue(step.id) === opt.value }">
                      <input class="form-check-input" type="radio" :name="step.id" :id="step.id + '_' + opt.value" :value="opt.value" :checked="getStepValue(step.id) === opt.value" @change="onUpdateStep(step.id, opt.value)">
                      <span>{{ opt.label }}</span>
                    </label>
                    <p v-if="getStepValue(step.id) && !optionLabel(step)" class="unconfirmed small mb-0">保存済みの選択値「{{ getStepValue(step.id) }}」は現在の選択肢にありません（保持していますが未選択として扱います）。</p>
                  </div>

                  <p v-else-if="step.type === 'note'" class="step-note">{{ step.text }}</p>
                </template>
              </div>

              <div v-if="v.optional.length" class="optional">
                <button class="btn btn-sm btn-outline-secondary py-0 px-2" :aria-expanded="!!expandedOptionals[v.phase.id]" @click="toggleOptional(v.phase.id)">
                  {{ expandedOptionals[v.phase.id] ? '▾' : '▸' }} 任意タスク（{{ v.optional.length }}件）
                </button>
                <div v-show="expandedOptionals[v.phase.id]" class="steps optional-steps">
                  <template v-for="step in v.optional" :key="step.id">
                    <div v-if="step.type === 'check'" :id="'story-step-' + step.id" class="step" :class="{ done: stepDone(step) }">
                      <input class="form-check-input" type="checkbox" :id="step.id" :checked="stepDone(step)" @change="onUpdateStep(step.id, $event.target.checked)">
                      <label :for="step.id"><span class="opt-tag">任意</span> {{ step.text }}<span v-if="step.hint" class="step-hint">{{ step.hint }}</span></label>
                    </div>
                    <p v-else-if="step.type === 'note'" class="step-note">{{ step.text }}</p>
                  </template>
                </div>
              </div>
            </li>
          </ol>
        </template>

        <!-- 旧保存で現行に対応できない記録 -->
        <section v-if="unmapped.length" class="legacy">
          <button class="evidence-toggle" :aria-expanded="showLegacy" @click="showLegacy = !showLegacy">
            {{ showLegacy ? '▾' : '▸' }} 現行の章・手順に対応しない保存記録 {{ unmapped.length }}件
          </button>
          <div v-if="showLegacy">
            <p class="small text-secondary">旧版などで保存された記録です。消さずに保持し、バックアップにも含めますが、現行のクリア数には数えません。</p>
            <ul class="small">
              <li v-for="r in unmapped" :key="r.chapterId + '/' + r.stepId">{{ chapterTitle(r.chapterId) }} ／ {{ r.stepId }}（{{ r.reason === 'chapter' ? '章が現行にありません' : r.reason === 'step' ? '手順が現行にありません' : '選択値が現行にありません' }}）</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.story { --accent: #e0a526; --line: rgba(255,255,255,.12); --muted: #9aa3ad; color: #e8eaed; }
.story-head { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; align-items: end; justify-content: space-between; padding: 0 0 .9rem; border-bottom: 1px solid var(--line); margin-bottom: 1rem; }
.story-title { font-size: 1.25rem; margin: 0; letter-spacing: .04em; }
.story-sub { margin: .15rem 0 0; color: var(--muted); font-size: .85rem; }
.story-bar { display: block; height: 5px; background: rgba(255,255,255,.1); border-radius: 3px; overflow: hidden; }
.story-bar > span { display: block; height: 100%; background: var(--accent); border-radius: 3px; transition: width .25s; }
.story-bar-lg { width: min(320px, 100%); height: 8px; }
.story-bar-md { height: 6px; }
.story-picker { margin-bottom: .9rem; }
.story-picker-label { font-size: .75rem; color: var(--muted); }
.story-body { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 768px) { .story-body { grid-template-columns: 250px minmax(0, 1fr); } }
.story-rail { flex-direction: column; gap: .25rem; align-self: start; position: sticky; top: .5rem; max-height: calc(100vh - 1rem); overflow-y: auto; }
.rail-group { margin: .8rem 0 .2rem; font-size: .7rem; letter-spacing: .08em; color: var(--muted); }
.rail-group:first-child { margin-top: 0; }
.rail-item { display: flex; align-items: center; gap: .6rem; width: 100%; padding: .5rem .6rem; background: transparent; border: 1px solid transparent; border-left: 3px solid transparent; border-radius: 6px; color: inherit; text-align: left; cursor: pointer; }
.rail-item:hover { background: rgba(255,255,255,.05); }
.rail-item.active { background: rgba(224,165,38,.1); border-color: var(--line); border-left-color: var(--accent); }
.rail-item:focus-visible, .evidence-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.rail-no { flex: none; width: 1.4rem; font-size: .75rem; color: var(--muted); text-align: center; font-variant-numeric: tabular-nums; }
.rail-main { flex: 1; min-width: 0; display: grid; gap: 4px; }
.rail-name { font-size: .88rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rail-count { flex: none; font-size: .72rem; color: var(--muted); font-variant-numeric: tabular-nums; }
.rail-count.st-done { color: #5fc27e; }
.rail-count.st-doing { color: var(--accent); }
.story-main { min-width: 0; }
.story-warn { font-size: .78rem; color: var(--muted); border-left: 3px solid #b5483f; padding-left: .6rem; margin-bottom: 1rem; }
.chapter-head { padding: 1rem; background: rgba(255,255,255,.03); border: 1px solid var(--line); border-radius: 10px; margin-bottom: 1rem; }
.chapter-head-top { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.chapter-name { font-size: 1.5rem; margin: 0 .25rem 0 0; font-weight: 700; }
.pill { font-size: .7rem; padding: .15rem .55rem; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); }
.pill.is-solid { color: #5fc27e; border-color: #5fc27e66; }
.pill.is-partial { color: var(--accent); border-color: #e0a52666; }
.pill.is-changed { color: #6fb7e8; border-color: #6fb7e866; }
.st-pill-done { color: #5fc27e; border-color: #5fc27e66; }
.st-pill-doing { color: var(--accent); border-color: #e0a52666; }
.chapter-summary { margin: .6rem 0 .3rem; font-size: .92rem; line-height: 1.6; }
.chapter-unlock { margin: 0; font-size: .8rem; color: var(--muted); }
.chapter-unlock strong { color: #cfd4da; margin-right: .4rem; }
.unconfirmed { color: #e0a526; font-size: .85em; margin-left: .25rem; }
.branch-box { margin-top: .8rem; padding: .6rem .8rem; border-radius: 8px; background: rgba(224,165,38,.07); border: 1px dashed #e0a52666; font-size: .82rem; line-height: 1.55; }
.branch-box ul { margin: 0; padding-left: 1.1rem; }
.branch-label { margin: 0 0 .3rem; font-size: .72rem; letter-spacing: .06em; color: var(--accent); }
.evidence-toggle { margin-top: .8rem; padding: .2rem 0; background: none; border: 0; color: #8ec5ee; font-size: .8rem; cursor: pointer; }
.evidence { margin-top: .4rem; font-size: .78rem; color: #b9c0c8; line-height: 1.6; }
.evidence-line { margin: 0 0 .25rem; }
.evidence-head { margin: .5rem 0 .2rem; color: var(--accent); }
.evidence ul { margin: 0; padding-left: 1.1rem; }
.next-card { display: flex; gap: 1rem; align-items: center; justify-content: space-between; padding: .8rem 1rem; margin-bottom: 1rem; border: 1px solid #e0a52688; border-left: 4px solid var(--accent); border-radius: 8px; background: rgba(224,165,38,.08); }
.next-label { margin: 0; font-size: .7rem; letter-spacing: .08em; color: var(--accent); }
.next-text { margin: .1rem 0; font-weight: 600; }
.next-phase { margin: 0; font-size: .75rem; color: var(--muted); }
.done-banner { text-align: center; padding: .6rem; border-radius: 8px; background: rgba(95,194,126,.12); color: #5fc27e; margin-bottom: 1rem; }
.phases { list-style: none; margin: 0; padding: 0; display: grid; gap: .9rem; }
.phase { position: relative; padding: .8rem .9rem .8rem 1.1rem; border: 1px solid var(--line); border-left: 3px solid var(--line); border-radius: 8px; }
.phase-done { border-left-color: #5fc27e; }
.phase-head { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem; margin-bottom: .4rem; }
.phase-title { font-size: .95rem; margin: 0; font-weight: 600; }
.phase-done .phase-title { color: #5fc27e; }
.phase-count { font-size: .72rem; color: var(--muted); font-variant-numeric: tabular-nums; }
.steps { display: grid; gap: .1rem; }
.step { display: flex; align-items: flex-start; gap: .6rem; padding: .45rem .3rem; border-radius: 6px; min-height: 40px; }
.step:hover { background: rgba(255,255,255,.04); }
.step input { flex: none; margin-top: .2rem; width: 1.15rem; height: 1.15rem; }
.step label { flex: 1; font-size: .88rem; line-height: 1.5; cursor: pointer; }
.step.done label { color: var(--muted); text-decoration: line-through; }
.wait-tag, .opt-tag { display: inline-block; margin-right: .4rem; font-size: .68rem; padding: 0 .4rem; border-radius: 4px; background: rgba(224,165,38,.18); color: var(--accent); }
.ref-tag { display: inline-block; margin-right: .4rem; font-size: .68rem; padding: 0 .4rem; border-radius: 4px; background: rgba(201,138,240,.18); color: #c98af0; }
.step-hint { display: block; margin-top: .1rem; font-size: .74rem; color: var(--muted); line-height: 1.45; }
.opt-tag { background: rgba(255,255,255,.1); color: var(--muted); }
.step-note { margin: .2rem 0 .2rem 1.9rem; font-size: .8rem; color: #8ec5ee; }
.choice { margin: .3rem 0; padding: .6rem .7rem; border: 1px solid #e0a52666; border-radius: 8px; background: rgba(224,165,38,.05); }
.choice-q { margin: 0 0 .4rem; font-size: .85rem; font-weight: 600; color: var(--accent); }
.choice-opt { display: flex; gap: .6rem; align-items: flex-start; padding: .45rem .5rem; border-radius: 6px; cursor: pointer; font-size: .85rem; line-height: 1.45; min-height: 40px; }
.choice-opt:hover { background: rgba(255,255,255,.05); }
.choice-opt.picked { background: rgba(224,165,38,.15); }
.choice-opt input { flex: none; margin-top: .2rem; width: 1.1rem; height: 1.1rem; }
.optional { margin-top: .5rem; }
.optional-steps { margin-top: .4rem; padding-left: .6rem; border-left: 2px solid var(--line); }
.legacy { margin-top: 1.5rem; padding-top: .5rem; border-top: 1px solid var(--line); }
@media (max-width: 767.98px) {
  .chapter-name { font-size: 1.25rem; }
  .next-card { flex-direction: column; align-items: stretch; }
  .phase { padding-left: .8rem; }
}
</style>
