// js/components/CompStory.js

const CompStory = {
    props: ['storyProgress'],
    emits: ['update-progress'],
    data() {
        return {
            chapters: STORY_CHAPTERS,
            selectedChapterId: localStorage.getItem('eft_story_selected_chapter') || 'tour',
            isSpoilerVisible: false // 伏せ字制御用
        };
    },
    watch: {
        selectedChapterId(newVal) {
            localStorage.setItem('eft_story_selected_chapter', newVal);
        }
    },
    computed: {
        activeChapter() {
            return this.chapters.find(c => c.id === this.selectedChapterId);
        },
        displaySteps() {
            if (!this.activeChapter) return [];
            
            const steps = this.activeChapter.steps;
            const progress = this.storyProgress[this.selectedChapterId] || {};
            
            const visibleSteps = steps.filter((step, index) => {
                if (step.type === 'note') return false; 

                if (step.showIf) {
                    const targetVal = progress[step.showIf.stepId];
                    if (targetVal !== step.showIf.value) return false;
                }
                
                let barrierIndex = index - 1;
                if (step.parallel) {
                    while (barrierIndex >= 0 && steps[barrierIndex].parallel) {
                        barrierIndex--;
                    }
                }

                for (let i = 0; i <= barrierIndex; i++) {
                    const s = steps[i];
                    if (s.showIf) {
                        const tVal = progress[s.showIf.stepId];
                        if (tVal !== s.showIf.value) continue; 
                    }
                    const val = progress[s.id];
                    if (s.type === 'check' && !val) return false; 
                    if (s.type === 'choice' && !val) return false; 
                }
                
                return true;
            });

            return visibleSteps.reverse();
        },
        isChapterCompleted() {
            if (!this.activeChapter) return false;
            const steps = this.activeChapter.steps.filter(s => s.type !== 'note');
            if (steps.length === 0) return false;
            const progress = this.storyProgress[this.selectedChapterId] || {};
            return steps.every(s => {
                if (s.showIf) {
                     if (progress[s.showIf.stepId] !== s.showIf.value) return true; 
                }
                return !!progress[s.id];
            });
        }
    },
    methods: {
        getStepValue(stepId) {
            if (!this.storyProgress[this.selectedChapterId]) return false;
            return this.storyProgress[this.selectedChapterId][stepId];
        },
        updateStep(stepId, value) {
            this.$emit('update-progress', {
                chapterId: this.selectedChapterId,
                stepId: stepId,
                value: value
            });
        }
    },
    template: `
    <div class="card h-100 border-secondary">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span>📖 ストーリータスク (Story Chapters)</span>
        </div>
        <div class="card-body p-0">
            <div class="row g-0 h-100">
                <div class="col-md-3 border-end border-secondary bg-dark d-flex flex-column">
                    <div class="list-group list-group-flush flex-grow-1 overflow-auto">
                        <button 
                            v-for="chapter in chapters" 
                            :key="chapter.id"
                            class="list-group-item list-group-item-action border-secondary"
                            :class="selectedChapterId === chapter.id ? 'active bg-primary text-white' : 'bg-dark text-white'"
                            @click="selectedChapterId = chapter.id"
                        >
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1 fw-bold">{{ chapter.title }}</h6>
                            </div>
                            <small :class="selectedChapterId === chapter.id ? 'text-light' : 'text-secondary'" style="font-size: 0.7em;">
                                {{ chapter.id }}
                            </small>
                        </button>
                    </div>
                </div>

                <div class="col-md-9 bg-dark text-white p-4 overflow-auto" style="height: 75vh;">
                    
                    <div class="card bg-dark border-danger mb-4">
                        <div class="card-body py-3">
                            <h6 class="card-title text-danger fw-bold mb-2">
                                <i class="bi bi-exclamation-triangle-fill"></i> 注意事項 (Spoiler Warning)
                            </h6>
                            <ul class="small mb-0 ps-3 text-light" style="line-height: 1.6;">
                                <li>「DEBUG」タブにて非表示に設定可能です。</li>
                                <li>v1.0.1.0時点の情報を参考に作成しています。今後のアップデートにより変更が入っている可能性があります。</li>
                                <li>大雑把にしか書いていません。また、詳細の対応は厳しいと思われます。</li>
                                <li>詳細内容は英語wikiを拝見することをおすすめします。</li>
                                <li>特に「<span @click="isSpoilerVisible = true" :style="isSpoilerVisible ? {color: '#dc3545', fontWeight: 'bold'} : {backgroundColor: 'black', color: 'black', cursor: 'pointer', userSelect: 'none', padding: '0 4px', borderRadius: '4px'}" title="クリックで表示">They Are Already Here</span>」（クリックで表示）は他サイト様を確認することを推奨します。</li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="activeChapter">
                        <div class="d-flex justify-content-between align-items-start border-bottom border-secondary pb-2 mb-3">
                            <h4 class="mb-0">{{ activeChapter.title }}</h4>
                            <a v-if="activeChapter.wikiLink" :href="activeChapter.wikiLink" target="_blank" class="btn btn-sm btn-outline-info">
                                🌐 Wiki
                            </a>
                        </div>
                        
                        <p class="text-secondary mb-4">{{ activeChapter.description }}</p>

                        <div class="mb-4">
                            <div v-if="isChapterCompleted" class="alert alert-success text-center">
                                🎉 このチャプターの全手順を完了しました
                            </div>
                            <div v-else-if="displaySteps.length > 0" class="text-info small mb-2">
                                👇 現在の目標 (最新が上に表示されます)
                            </div>
                        </div>

                        <div class="vstack gap-3">
                            <div v-for="step in displaySteps" :key="step.id" class="card bg-dark border-secondary">
                                <div class="card-body">
                                    <div v-if="step.type === 'check'" class="form-check">
                                        <input class="form-check-input" type="checkbox" 
                                            :id="step.id" 
                                            :checked="getStepValue(step.id)" 
                                            @change="updateStep(step.id, $event.target.checked)">
                                        <label class="form-check-label" :for="step.id" 
                                            :class="{'text-decoration-line-through text-secondary': getStepValue(step.id), 'fw-bold text-white': !getStepValue(step.id)}">
                                            {{ step.text }}
                                        </label>
                                    </div>

                                    <div v-else-if="step.type === 'choice'">
                                        <p class="mb-2 fw-bold text-warning">{{ step.text }}</p>
                                        <div v-for="opt in step.options" :key="opt.value" class="form-check">
                                            <input class="form-check-input" type="radio" 
                                                :name="step.id" 
                                                :id="step.id + '_' + opt.value"
                                                :value="opt.value"
                                                :checked="getStepValue(step.id) === opt.value"
                                                @change="updateStep(step.id, opt.value)">
                                            <label class="form-check-label" :for="step.id + '_' + opt.value">
                                                {{ opt.label }}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};