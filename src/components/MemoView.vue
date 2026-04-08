<script setup>
// メモタブ — アコーディオン形式で各メモサブコンポーネントを表示
import { reactive } from 'vue'
import { loadLS, saveLS } from '../composables/useStorage.js'

import MemoHealth from './memo/MemoHealth.vue'
import MemoWeapon from './memo/MemoWeapon.vue'
import MemoArmor from './memo/MemoArmor.vue'
import MemoStims from './memo/MemoStims.vue'
import MemoGrenade from './memo/MemoGrenade.vue'
import MemoTraders from './memo/MemoTraders.vue'
import MemoItems from './memo/MemoItems.vue'

const emit = defineEmits(['open-task-from-name'])

const defaultState = {
    health: false,
    weapon: false,
    armor: false,
    stims: false,
    grenade: false,
    items: false,
    traders: false,
}

const isOpen = reactive({ ...defaultState, ...loadLS('memo_accordion_state', {}) })

function toggleSection(key) {
    isOpen[key] = !isOpen[key]
    saveLS('memo_accordion_state', { ...isOpen })
}

const sections = [
    { key: 'health', icon: '🚑', label: '回復・手術キット性能', component: MemoHealth },
    { key: 'weapon', icon: '🔫', label: '口径別の武器詳細', component: MemoWeapon },
    { key: 'armor', icon: '🛡️', label: 'アーマー材質の特徴', component: MemoArmor },
    { key: 'stims', icon: '💉', label: '注射器 (Stims)', component: MemoStims },
    { key: 'grenade', icon: '💣', label: 'グレネード性能 (Fuse Time)', component: MemoGrenade },
    { key: 'traders', icon: '🤝', label: 'トレーダー解放条件 (Loyalty Levels)', component: MemoTraders },
    { key: 'items', icon: '🏆', label: '解放・収集・タスク攻略', component: MemoItems, emitsTask: true },
]
</script>

<template>
    <div class="card border-0 bg-black mb-4 memo-wrapper">
        <div class="card-header bg-black text-info border-bottom border-secondary py-3">
            <div class="fw-bold fs-5">📝 メモ書き (データ一覧)</div>
        </div>

        <div class="card-body bg-black p-0">
            <div class="px-3 py-2 text-secondary small border-bottom border-secondary" style="font-size: 0.85rem;">
                ※ 情報はパッチ1.0.0.5、正式版直後の情報を元に作成しています。
            </div>

            <div class="accordion accordion-flush">
                <div v-for="section in sections" :key="section.key" class="accordion-item">
                    <h2 class="accordion-header">
                        <div
                            class="memo-accordion-button"
                            :class="{ collapsed: !isOpen[section.key] }"
                            @click="toggleSection(section.key)"
                        >
                            <span class="me-2">{{ section.icon }}</span> {{ section.label }}
                        </div>
                    </h2>
                    <div v-show="isOpen[section.key]">
                        <div class="accordion-body p-0 bg-black">
                            <component
                                :is="section.component"
                                v-if="section.emitsTask"
                                @open-task-from-name="emit('open-task-from-name', $event)"
                            />
                            <component :is="section.component" v-else />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.memo-wrapper { max-width: 1200px; margin: 0 auto; }

.memo-accordion-button {
    background-color: #0f172a;
    color: #0dcaf0;
    border: none;
    border-bottom: 1px solid #1e293b;
    border-radius: 0;
    font-weight: bold;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.memo-accordion-button:hover { filter: brightness(1.2); }
.memo-accordion-button::after {
    content: ''; width: 1.25rem; height: 1.25rem; margin-left: auto;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230dcaf0'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
    background-repeat: no-repeat; background-size: 1.25rem; transition: transform 0.2s ease-in-out;
}
.memo-accordion-button.collapsed::after { transform: rotate(-90deg); }
</style>

<style>
/* メモサブコンポーネント用の共通スタイル (非scoped) */
.memo-static-header {
    background-color: #111827; color: #0dcaf0; font-weight: bold;
    padding: 8px 20px; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b;
    font-size: 0.95rem; display: flex; align-items: center; cursor: default;
}
.memo-static-header::before { content: '■'; font-size: 0.6em; margin-right: 8px; opacity: 0.7; }

.memo-table { width: 100%; border-collapse: collapse; font-size: 0.9em; table-layout: fixed; }
.memo-table th {
    background-color: #0b1120; color: #94a3b8; padding: 8px 10px;
    border-bottom: 1px solid #1e293b; text-align: center; white-space: nowrap; font-weight: normal;
}
.memo-table td {
    background-color: #000; color: #e2e8f0;
    padding: 10px 15px; border-bottom: 1px solid #222; vertical-align: middle; word-wrap: break-word;
}
.memo-table tr:last-child td { border-bottom: none; }

.text-blue { color: #0dcaf0; }
.text-green { color: #2ecc71; }
.text-red { color: #ef4444; }
.text-orange { color: #f59e0b; }
.text-muted-dark { color: #94a3b8; }

.weapon-col-caliber { width: 100px; text-align: center; font-weight: bold; color: #0dcaf0; }
.weapon-col-name { width: 160px; font-weight: bold; }
.weapon-col-desc { text-align: left; }
.memo-caliber-row td { border-top: 3px solid #64748b; }

.task-link {
    color: #0dcaf0; cursor: pointer; text-decoration: underline; text-underline-offset: 4px;
    text-decoration-color: rgba(13, 202, 240, 0.3); transition: all 0.2s;
}
.task-link:hover { color: #fff; text-decoration-color: #fff; background-color: rgba(13, 202, 240, 0.1); }
</style>
