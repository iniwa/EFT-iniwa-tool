<script setup>
import { ref, computed, watch } from 'vue'
import { useUserProgress } from '../composables/useUserProgress.js'
import { MAIN_CHAPTERS } from '../data/storyChaptersMain.js'
import { SIDE_CHAPTERS } from '../data/storyChaptersSide.js'

const STORY_CHAPTERS = [...MAIN_CHAPTERS, ...SIDE_CHAPTERS]

const { storyProgress, updateStoryProgress } = useUserProgress()

// --- State ---
const selectedChapterId = ref(localStorage.getItem('eft_story_selected_chapter') || 'tour')
watch(selectedChapterId, (val) => localStorage.setItem('eft_story_selected_chapter', val))

// 各PhaseのOptional展開状態: { phaseId: boolean }
const expandedOptionals = ref({})

// --- クロスチャプター自動連動 ---
// Falling Skies の Armored Case 選択 → The Ticket のルートを自動反映
watch(() => storyProgress.value?.falling_skies?.fs_case_choice, (val) => {
  if (!val) return
  const route = val === 'keep' ? 'mechanic' : 'prapor'
  // 既に同じ値なら更新しない（無限ループ防止）
  if (storyProgress.value?.the_ticket?.tt_route_choice !== route) {
    updateStoryProgress('the_ticket', 'tt_route_choice', route)
  }
}, { immediate: true })

// --- Computed ---
const activeChapter = computed(() =>
  STORY_CHAPTERS.find(c => c.id === selectedChapterId.value)
)

// --- Methods ---

/** ステップの値を取得 (クロスチャプター対応) */
function getStepValue(stepId, chapterId) {
  const cId = chapterId || selectedChapterId.value
  return storyProgress.value[cId]?.[stepId] || false
}

/** ステップの表示条件を評価 (クロスチャプター showIf 対応) */
function isStepVisible(step, defaultChapterId) {
  if (!step.showIf) return true
  const cId = step.showIf.chapterId || defaultChapterId || selectedChapterId.value
  const val = storyProgress.value[cId]?.[step.showIf.stepId]
  return val === step.showIf.value
}

/** Phase内のステップを必須/任意に分割 */
function getPhaseSteps(phase) {
  const chapterId = selectedChapterId.value
  const visible = phase.steps.filter(s => isStepVisible(s, chapterId))
  return {
    required: visible.filter(s => !s.optional),
    optional: visible.filter(s => s.optional),
  }
}

/** Phase完了判定 (必須ステップのみ) */
function isPhaseCompleted(phase) {
  const { required } = getPhaseSteps(phase)
  if (required.length === 0) return false
  return required.every(s => {
    if (s.type === 'note') return true
    if (s.type === 'wait') return !!getStepValue(s.id)
    if (s.type === 'check') return !!getStepValue(s.id)
    if (s.type === 'choice') return !!getStepValue(s.id)
    return true
  })
}

/** チャプター全体の進捗率 */
function chapterProgress(chapterId) {
  const chapter = STORY_CHAPTERS.find(c => c.id === chapterId)
  if (!chapter) return { done: 0, total: 0 }
  let done = 0, total = 0
  chapter.phases.forEach(phase => {
    const visible = phase.steps.filter(s => isStepVisible(s, chapterId))
    const required = visible.filter(s => !s.optional && s.type !== 'note')
    required.forEach(s => {
      total++
      if (storyProgress.value[chapterId]?.[s.id]) done++
    })
  })
  return { done, total }
}

/** チャプター完了判定 */
const isChapterCompleted = computed(() => {
  if (!activeChapter.value) return false
  return activeChapter.value.phases.every(p => {
    const { required } = getPhaseSteps(p)
    const actionable = required.filter(s => s.type !== 'note')
    if (actionable.length === 0) return true
    return actionable.every(s => !!getStepValue(s.id))
  })
})

/** ステップの値を更新 */
function onUpdateStep(stepId, value) {
  updateStoryProgress(selectedChapterId.value, stepId, value)
}

/** Optional展開トグル */
function toggleOptional(phaseId) {
  expandedOptionals.value[phaseId] = !expandedOptionals.value[phaseId]
}

/** チャプター全体を完了状態にする（確認ダイアログ付き） */
function completeChapter() {
  if (!activeChapter.value) return
  if (!confirm(`「${activeChapter.value.title}」の全必須タスクを完了状態にしますか？`)) return
  activeChapter.value.phases.forEach(phase => {
    const { required } = getPhaseSteps(phase)
    required.forEach(s => {
      if (s.type === 'check' || s.type === 'wait') {
        onUpdateStep(s.id, true)
      }
    })
  })
}

/** チャプター全体をリセットする（確認ダイアログ付き） */
function resetChapter() {
  if (!activeChapter.value) return
  if (!confirm(`「${activeChapter.value.title}」の進捗を全てリセットしますか？`)) return
  activeChapter.value.phases.forEach(phase => {
    phase.steps.forEach(s => {
      if (s.type === 'check' || s.type === 'wait' || s.type === 'choice') {
        if (getStepValue(s.id)) {
          onUpdateStep(s.id, false)
        }
      }
    })
  })
}

/** カテゴリ別にチャプターを分類 */
const mainChapters = computed(() => STORY_CHAPTERS.filter(c => c.category === 'main'))
const sideChapters = computed(() => STORY_CHAPTERS.filter(c => c.category === 'side'))
</script>

<template>
  <div class="card h-100 border-secondary">
    <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
      <span>📖 ストーリータスク (Story Chapters)</span>
    </div>
    <div class="card-body p-0">
      <div class="row g-0 h-100">
        <!-- 左サイドバー: チャプター一覧 -->
        <div class="col-md-3 border-end border-secondary bg-dark d-flex flex-column">
          <div class="list-group list-group-flush flex-grow-1 overflow-auto">
            <!-- メインライン -->
            <div class="list-group-item bg-dark text-secondary border-secondary py-1 px-3" style="font-size: 0.7em; letter-spacing: 0.05em;">
              MAIN STORYLINE
            </div>
            <button
              v-for="chapter in mainChapters"
              :key="chapter.id"
              class="list-group-item list-group-item-action border-secondary"
              :class="selectedChapterId === chapter.id ? 'active bg-primary text-white' : 'bg-dark text-white'"
              @click="selectedChapterId = chapter.id"
            >
              <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="fw-bold" style="font-size: 0.85em;">{{ chapter.title }}</span>
                <span
                  v-if="chapterProgress(chapter.id).total > 0"
                  class="badge"
                  :class="chapterProgress(chapter.id).done === chapterProgress(chapter.id).total ? 'bg-success' : 'bg-secondary'"
                  style="font-size: 0.6em;"
                >
                  {{ chapterProgress(chapter.id).done }}/{{ chapterProgress(chapter.id).total }}
                </span>
              </div>
            </button>

            <!-- サイドチャプター -->
            <div class="list-group-item bg-dark text-secondary border-secondary py-1 px-3 mt-1" style="font-size: 0.7em; letter-spacing: 0.05em;">
              SIDE CHAPTERS
            </div>
            <button
              v-for="chapter in sideChapters"
              :key="chapter.id"
              class="list-group-item list-group-item-action border-secondary"
              :class="selectedChapterId === chapter.id ? 'active bg-primary text-white' : 'bg-dark text-white'"
              @click="selectedChapterId = chapter.id"
            >
              <div class="d-flex w-100 justify-content-between align-items-center">
                <span class="fw-bold" style="font-size: 0.85em;">{{ chapter.title }}</span>
                <span
                  v-if="chapterProgress(chapter.id).total > 0"
                  class="badge"
                  :class="chapterProgress(chapter.id).done === chapterProgress(chapter.id).total ? 'bg-success' : 'bg-secondary'"
                  style="font-size: 0.6em;"
                >
                  {{ chapterProgress(chapter.id).done }}/{{ chapterProgress(chapter.id).total }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- 右コンテンツ -->
        <div class="col-md-9 bg-dark text-white p-4 overflow-auto" style="height: 75vh;">

          <!-- 注意事項 -->
          <div class="card bg-dark border-danger mb-4">
            <div class="card-body py-3">
              <h6 class="card-title text-danger fw-bold mb-2">注意事項 (Spoiler Warning)</h6>
              <ul class="small mb-0 ps-3 text-light" style="line-height: 1.6;">
                <li>このタブは「DEBUG」タブにて非表示に設定可能です。</li>
                <li>EFT v1.0.x 時点の<a href="https://escapefromtarkov.fandom.com/wiki/Story_chapters" target="_blank" rel="noopener" class="text-info">英語wiki</a>情報を基に作成しています。今後のアップデートにより内容が変更される可能性があります。</li>
                <li>チャプター間の選択肢は自動連動します（例: Falling Skiesの選択 → The Ticketのルート分岐）。</li>
              </ul>
            </div>
          </div>

          <!-- チャプター詳細 -->
          <div v-if="activeChapter">
            <!-- ヘッダー -->
            <div class="d-flex justify-content-between align-items-start border-bottom border-secondary pb-2 mb-2">
              <div>
                <h4 class="mb-1">{{ activeChapter.title }}</h4>
                <span class="badge" :class="activeChapter.category === 'main' ? 'bg-warning text-dark' : 'bg-info text-dark'" style="font-size: 0.7em;">
                  {{ activeChapter.category === 'main' ? 'メインライン' : 'サイドチャプター' }}
                </span>
              </div>
              <div class="d-flex gap-2">
                <button
                  v-if="!isChapterCompleted"
                  class="btn btn-sm btn-outline-success"
                  @click="completeChapter"
                >&#10003; 全完了</button>
                <button
                  v-else
                  class="btn btn-sm btn-outline-secondary"
                  @click="resetChapter"
                >リセット</button>
                <a
                  v-if="activeChapter.wikiLink"
                  :href="activeChapter.wikiLink"
                  target="_blank"
                  rel="noopener"
                  class="btn btn-sm btn-outline-info"
                >Wiki</a>
              </div>
            </div>

            <p class="text-secondary small mb-2">{{ activeChapter.description }}</p>
            <p class="text-secondary small mb-3" style="font-size: 0.75em;">
              <strong>解放条件:</strong> {{ activeChapter.unlockCondition }}
            </p>

            <!-- 完了メッセージ -->
            <div v-if="isChapterCompleted" class="alert alert-success text-center mb-3">
              このチャプターの全必須手順を完了しました
            </div>

            <!-- Phase一覧 -->
            <div v-for="phase in activeChapter.phases" :key="phase.id" class="mb-4">
              <!-- Phaseが表示可能か判定 (全ステップがshowIfで非表示ならPhaseごと隠す) -->
              <template v-if="getPhaseSteps(phase).required.length > 0 || getPhaseSteps(phase).optional.length > 0">

                <!-- Phaseヘッダー -->
                <div class="d-flex align-items-center mb-2">
                  <h6 class="mb-0 fw-bold" :class="isPhaseCompleted(phase) ? 'text-success' : 'text-white'">
                    <span v-if="isPhaseCompleted(phase)" class="me-1">&#10003;</span>
                    {{ phase.title }}
                  </h6>
                </div>

                <!-- 必須ステップ -->
                <div class="vstack gap-2 ms-2">
                  <template v-for="step in getPhaseSteps(phase).required" :key="step.id">

                    <!-- check (チェックボックス) -->
                    <div v-if="step.type === 'check'" class="d-flex align-items-start gap-2 py-1">
                      <input
                        class="form-check-input mt-1 flex-shrink-0"
                        type="checkbox"
                        :id="step.id"
                        :checked="getStepValue(step.id)"
                        @change="onUpdateStep(step.id, $event.target.checked)"
                      >
                      <label
                        class="form-check-label small"
                        :for="step.id"
                        :class="{
                          'text-decoration-line-through text-secondary': getStepValue(step.id),
                          'text-white': !getStepValue(step.id)
                        }"
                      >{{ step.text }}</label>
                    </div>

                    <!-- wait (待ち時間) -->
                    <div v-else-if="step.type === 'wait'" class="d-flex align-items-start gap-2 py-1">
                      <input
                        class="form-check-input mt-1 flex-shrink-0"
                        type="checkbox"
                        :id="step.id"
                        :checked="getStepValue(step.id)"
                        @change="onUpdateStep(step.id, $event.target.checked)"
                      >
                      <label
                        class="form-check-label small d-flex align-items-center gap-2"
                        :for="step.id"
                        :class="{
                          'text-decoration-line-through text-secondary': getStepValue(step.id),
                          'text-warning': !getStepValue(step.id)
                        }"
                      >
                        <span class="badge bg-warning text-dark" style="font-size: 0.7em;">&#9202; {{ step.duration }}</span>
                        {{ step.text }}
                      </label>
                    </div>

                    <!-- choice (選択肢) -->
                    <div v-else-if="step.type === 'choice'" class="card bg-dark border-warning mb-1">
                      <div class="card-body py-2 px-3">
                        <p class="mb-2 small fw-bold text-warning">{{ step.text }}</p>
                        <div v-for="opt in step.options" :key="opt.value" class="form-check">
                          <input
                            class="form-check-input"
                            type="radio"
                            :name="step.id"
                            :id="step.id + '_' + opt.value"
                            :value="opt.value"
                            :checked="getStepValue(step.id) === opt.value"
                            @change="onUpdateStep(step.id, opt.value)"
                          >
                          <label class="form-check-label small" :for="step.id + '_' + opt.value">
                            {{ opt.label }}
                          </label>
                        </div>
                      </div>
                    </div>

                    <!-- note (注記) -->
                    <div v-else-if="step.type === 'note'" class="small text-info fst-italic ps-4 py-1">
                      {{ step.text }}
                    </div>

                  </template>
                </div>

                <!-- 任意ステップ (折りたたみ) -->
                <div v-if="getPhaseSteps(phase).optional.length > 0" class="ms-2 mt-2">
                  <button
                    class="btn btn-sm btn-outline-secondary py-0 px-2"
                    style="font-size: 0.75em;"
                    @click="toggleOptional(phase.id)"
                  >
                    {{ expandedOptionals[phase.id] ? '&#9660;' : '&#9654;' }}
                    任意タスク ({{ getPhaseSteps(phase).optional.length }}件)
                  </button>
                  <div v-show="expandedOptionals[phase.id]" class="vstack gap-1 mt-1 ps-2 border-start border-secondary">
                    <template v-for="step in getPhaseSteps(phase).optional" :key="step.id">

                      <div v-if="step.type === 'check'" class="d-flex align-items-start gap-2 py-1">
                        <input
                          class="form-check-input mt-1 flex-shrink-0"
                          type="checkbox"
                          :id="step.id"
                          :checked="getStepValue(step.id)"
                          @change="onUpdateStep(step.id, $event.target.checked)"
                        >
                        <label
                          class="form-check-label small"
                          :for="step.id"
                          :class="{
                            'text-decoration-line-through text-secondary': getStepValue(step.id),
                            'text-muted': !getStepValue(step.id)
                          }"
                        >
                          <span class="badge bg-secondary me-1" style="font-size: 0.65em;">任意</span>
                          {{ step.text }}
                        </label>
                      </div>

                      <div v-else-if="step.type === 'note'" class="small text-secondary fst-italic ps-4 py-1">
                        {{ step.text }}
                      </div>

                    </template>
                  </div>
                </div>

                <!-- Phase区切り線 -->
                <hr class="border-secondary my-2 opacity-25">

              </template>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
