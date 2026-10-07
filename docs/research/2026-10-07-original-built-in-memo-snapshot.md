# Built-in memo snapshot before 95deaf8

Snapshot commit: 86f135ea26db24c4e76879070058e018070d9477 (3.4.0, immediately before 95deaf8c50b166ca5c1b0ad0576530cfd1201960).

This is an exact copy of the built-in memo Vue source at that commit. The user describes the memo as a concise practical cheat sheet, not an authoritative database; its useful conclusions and tips are intended as quick lookups, with uncertain items briefly treated as estimates or needing confirmation. This snapshot preserves every original row and statement without judging whether each one is currently correct. No personal browser notes or localStorage data are included.

## Entries changed by 95deaf8

95deaf8 replaced the contents of all seven memo subsections with procedural usage guidance: MemoHealth, MemoWeapon, MemoArmor, MemoStims, MemoGrenade, MemoTraders, and MemoItems. It also changed their accordion labels and the MemoView introduction from a static-data notice mentioning patch 1.0.0.5 to a 2026-10-07 app-data disclaimer. The original seven exact files are reproduced below. The application is being restored to this snapshot while verification is pending.

## src/components/MemoView.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: e07df166a2023d7935dd91c8a263ca97ba8429eb96d404dd55660fdb6f17c72f.

```vue
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
                ※ 静的メモの一部はパッチ1.0.0.5時点の情報です。Patch 1.1以降の価格・トレーダーLL・報酬変更はゲーム内表示を優先してください。
            </div>

            <div class="accordion accordion-flush">
                <div v-for="section in sections" :key="section.key" class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            type="button"
                            class="memo-accordion-button"
                            :class="{ collapsed: !isOpen[section.key] }"
                            @click="toggleSection(section.key)"
                        >
                            <span class="me-2">{{ section.icon }}</span> {{ section.label }}
                        </button>
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
    width: 100%; text-align: left;
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
```

## src/components/memo/MemoHealth.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: c2f4c5176331480fd2d8df22d1408b38813aa17c0bdf718b94d1d8213c596ab6.

```vue
<script setup>
// 回復・手術キット性能データ
</script>

<template>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4" style="width: 15%;">名前</th>
                <th style="width: 10%;">容量</th>
                <th style="width: 10%;">総時間</th>
                <th style="width: 15%;" class="text-blue">発動ラグ</th>
                <th style="width: 15%;">1回回復量</th>
                <th style="width: 10%;">軽出血</th>
                <th style="width: 10%;">重出血</th>
                <th style="width: 8%;">骨折</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 fw-bold text-red">Salewa</td>
                <td class="text-center">400</td>
                <td class="text-center">3.0s</td>
                <td class="text-center fw-bold text-blue">~2.2s</td>
                <td class="text-center">85</td>
                <td class="text-center">-45</td>
                <td class="text-center fw-bold">-175</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">AFAK</td>
                <td class="text-center">400</td>
                <td class="text-center">3.0s</td>
                <td class="text-center text-muted">~2.5s</td>
                <td class="text-center">60</td>
                <td class="text-center">-30</td>
                <td class="text-center">-170</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-green">IFAK</td>
                <td class="text-center">300</td>
                <td class="text-center">3.0s</td>
                <td class="text-center text-muted">~2.5s</td>
                <td class="text-center">50</td>
                <td class="text-center">-30</td>
                <td class="text-center text-red fw-bold">-210</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-orange">AI-2</td>
                <td class="text-center">100</td>
                <td class="text-center">2.0s</td>
                <td class="text-center text-blue">~1.0s</td>
                <td class="text-center">50</td>
                <td class="text-center text-muted">×</td>
                <td class="text-center text-muted">×</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-blue">Grizzly</td>
                <td class="text-center">1800</td>
                <td class="text-center">5.0s</td>
                <td class="text-center text-red">~4.5s</td>
                <td class="text-center">175</td>
                <td class="text-center">-40</td>
                <td class="text-center">-130</td>
                <td class="text-center">-50</td>
            </tr>
        </tbody>
    </table>
    <div class="p-2 small text-muted border-top border-secondary ms-2 me-2 mt-2">
        <ul class="mb-0 ps-3">
            <li><strong>1回回復量:</strong> 1回のアニメーションで回復できるHPの上限値。</li>
            <li><strong>発動ラグ:</strong> 使用開始からHPが実際に回復するまでの時間。この直後にクリックでキャンセル可能。</li>
        </ul>
    </div>

    <div class="memo-static-header">
        手術キット (Surgery Kits)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4" style="width: 25%;">名前</th>
                <th style="width: 15%;">サイズ</th>
                <th style="width: 15%;">回数</th>
                <th style="width: 15%;">時間</th>
                <th>手術後HP減少</th>
                <th style="width: 10%;">骨折</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4">CMS Kit</td>
                <td class="text-center">2マス</td>
                <td class="text-center">5</td>
                <td class="text-center">16s</td>
                <td class="text-center text-red">大 (45-60%減)</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-blue">Surv12</td>
                <td class="text-center">3マス</td>
                <td class="text-center">15</td>
                <td class="text-center">20s</td>
                <td class="text-center text-green">小 (10-20%減)</td>
                <td class="text-center">〇 (-1)</td>
            </tr>
        </tbody>
    </table>
</template>
```

## src/components/memo/MemoWeapon.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: 639cc65b19f47d1c72b4edf8031fb01472ef83f8e3465f99a16b6c6583b46f2e.

```vue
<script setup>
// 口径別武器詳細データ
</script>

<template>
    <div class="memo-static-header">
        AR / DMR / LMG (Assault Rifles, Marksman &amp; Machine Guns)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="weapon-col-caliber">口径</th>
                <th class="weapon-col-name text-start ps-3">武器名</th>
                <th class="weapon-col-mode">Mode</th>
                <th class="weapon-col-rpm">RPM</th>
                <th class="weapon-col-desc ps-3">特徴・運用メモ</th>
            </tr>
        </thead>
        <tbody>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    6.8x51mm<br><span class="small text-muted">Hybrid</span>
                </td>
                <td class="text-blue fw-bold ps-3">SIG Spear</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    <span class="text-blue">最強AR</span>。高レート・高貫通・高ダメージの全てが揃う。反動制御も優秀だが入手難易度が極めて高い。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="9" class="weapon-col-caliber border-end border-secondary">
                    7.62x51mm<br><span class="small text-muted">NATO</span>
                </td>
                <td class="fw-bold ps-3 text-secondary">RSASS</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    SR-25のほぼ上位互換。性能は最強クラスだが、本体価格が非常に高い。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">SR-25</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    メタ武器筆頭。リコイル復帰が早く、速射時の集弾性が非常に高い。迷ったらこれ。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">M60E6 / E4</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span></td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    <span class="text-blue">LMG</span>。100連発による制圧力が売り。低レートで制御しやすく、オープンボルトでジャムらない。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">MDR 7.62</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    ブルパップで取り回しが良い。反動は大きいが、エルゴが高くADSが速い。近距離も対応可。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SA-58</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    近距離火力お化け。反動が凄まじく、フルカスタム必須。中距離以遠はタップ撃ち推奨。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold">M1A</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    <span class="text-blue">50発ドラム</span>運用が可能。対多数戦に強いが、全長が長くエルゴが下がりやすい。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">AK-308</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    AK操作系のまま7.62x51mmを撃てる。SA-58等と同様に反動は強烈だが、近距離火力は圧倒的。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SCAR-H</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    低レートで反動がマイルド。制御しやすいがエルゴが低く、構えが遅いのが欠点。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold">RFB</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    高コスパ。<span class="text-green">レーザー装着が可能</span>になり弱点を克服。安価に7.62x51mmを撃てる強力な選択肢。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="4" class="weapon-col-caliber border-end border-secondary">
                    7.62x39mm
                </td>
                <td class="text-blue fw-bold ps-3">Mk47 Mutant</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    RD-704よりレートが高く、火力で押し切れる。やや重いが精度も優秀。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">RD-704</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    非常にコンパクトで高エルゴ。サプレッサー運用でも取り回しが良く、室内戦に強い。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">AKM / 103</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    基本形。カスタムパーツが豊富。103/104等の近代化モデルの方が性能が良い。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">RPD / RPDN</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span></td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    100連ドラム固定のLMG。オープンボルト(ジャム無)。RPDNはサイト装着可。弾幕でゴリ押す用。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="5" class="weapon-col-caliber border-end border-secondary">
                    5.56x45mm<br><span class="small text-muted">NATO</span>
                </td>
                <td class="fw-bold ps-3">M4A1 / HK416</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">800+</td>
                <td class="text-muted-dark">
                    高レートによるDPSが魅力だが、反動制御には高級パーツによるフルカスタムが必須。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">AUG A3</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">~700</td>
                <td class="text-muted-dark">
                    本体性能が高く、最低限のカスタムで実戦投入可能。<span class="text-blue">コスパ最強</span>枠。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">MDR 5.56</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    7.62版同様に取り回しが良い。5.56mmとしては低レートで、リコイル制御が非常に楽。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SCAR-L</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    低レート・低反動。近距離の撃ち合いは弱いが、中距離での当てやすさは抜群。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">ADAR / TX-15</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    M4パーツを流用できるセミオート機。安価に5.56mmを運用したい時に。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    5.45x39mm
                </td>
                <td class="text-blue fw-bold ps-3">NL-545</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/2/1</td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    <span class="text-blue">5.45mm最強格</span>。M4並みの高レートで、この口径の火力不足を補える。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">AK-74N / 74M</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    スタンダードな性能。弾が入手しやすく、カスタムパーツも安い。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SAG AK-545</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    非常に安価で高精度なセミオート。リコイルがほぼ無く、序盤のスカブ狩り等に最適。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    9x39mm
                </td>
                <td class="text-blue fw-bold ps-3">AS VAL / VSS</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">900</td>
                <td class="text-muted-dark">
                    消音器内蔵。超高レート×高貫通弾で近距離最強。弾速が遅く遠距離は苦手。耐久消耗が激しい。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">SR-3M</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">900</td>
                <td class="text-muted-dark">
                    サプレッサー着脱可能なAS VAL。取り回しが良く、屋内戦で圧倒的火力を発揮する。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">9A-91</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">~700</td>
                <td class="text-muted-dark">
                    廉価版9x39mm銃。カスタム幅は狭いが、安価に強力な弾薬を運用できる。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .300 Blackout
                </td>
                <td class="text-blue fw-bold ps-3">SIG MCX</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    M4互換の操作感。CBJ弾が強力で、サプレッサー運用時の静音性も高い。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    12.7x55mm
                </td>
                <td class="fw-bold ps-3">ASh-12</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    近距離特化のロマン砲。PS12B弾ならクラス4アーマーを胸一撃で葬る破壊力。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .308 ME
                </td>
                <td class="fw-bold ps-3">Marlin MXLR</td>
                <td class="weapon-col-mode"><span class="mode-lever">Lever</span></td>
                <td class="weapon-col-rpm">-</td>
                <td class="text-muted-dark">
                    レバーアクション式ライフル。連射は利かないが、独特の操作感と高い単発威力を持つ。
                </td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        SMG / PDW / Handgun
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="weapon-col-caliber">口径</th>
                <th class="weapon-col-name text-start ps-3">武器名</th>
                <th class="weapon-col-mode">Mode</th>
                <th class="weapon-col-rpm">RPM</th>
                <th class="weapon-col-desc ps-3">特徴・運用メモ</th>
            </tr>
        </thead>
        <tbody>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    4.6x30mm
                </td>
                <td class="text-blue fw-bold ps-3">MP7A1 / A2</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">950</td>
                <td class="text-muted-dark">
                    高レート・低反動・高貫通。FMJ SXで十分強く、AP SXなら重装兵も溶かせる。A2はフォアグリップ交換可。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    5.7x28mm
                </td>
                <td class="text-blue fw-bold ps-3">P90</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">900</td>
                <td class="text-muted-dark">
                    標準で50連マガジン搭載。リロードの手間が少なく連戦に強い。給弾動作が遅い点に注意。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .45 ACP
                </td>
                <td class="text-start ps-3 fw-bold">Vector .45</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">1100</td>
                <td class="text-muted-dark">
                    圧倒的レートで近距離最強クラス。弾消費が激しく、マガジン容量(最大30)がネック。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    9x19mm
                </td>
                <td class="text-start ps-3 fw-bold">Vector 9mm</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">950</td>
                <td class="text-muted-dark">
                    レートは.45より落ちるが、<span class="text-blue">50連ドラム</span>が使用可能で継戦能力が高い。AP 6.3以上推奨。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold text-blue">UZI PRO</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">1150</td>
                <td class="text-muted-dark">
                    Vectorを超える超高レートSMG。非常にコンパクトで低反動。クローズドボルトのためジャム有り。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold text-muted">UZI (無印)</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    旧式モデル。レートは遅いが<span class="text-green">オープンボルトでジャムらない</span>。50連マガジン使用可。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .50 AE
                </td>
                <td class="text-start ps-3 fw-bold text-warning">Desert Eagle</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">-</td>
                <td class="text-muted-dark">
                    <span class="text-warning">ハンドキャノン</span>。高威力の.50 AE弾を使用。ロマン溢れる一撃必殺のサイドアーム。
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
/* カラム幅設定 */
.weapon-col-caliber { width: 120px; text-align: center; font-weight: bold; color: var(--memo-primary); }
.weapon-col-mode    { width: 110px; text-align: center; font-size: 0.85em; }
.weapon-col-rpm     { width: 70px; text-align: center; font-weight: bold; color: var(--memo-text-main); }
.weapon-col-name    { width: 150px; font-weight: bold; }
.weapon-col-desc    { text-align: left; }

/* モード表示の色分け */
.mode-full { color: #ef4444; }
.mode-semi { color: #3b82f6; }
.mode-lever { color: #f59e0b; }
</style>
```

## src/components/memo/MemoArmor.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: 9909114064a060275781fc352119fbbb72662bdbaf19c45fa84549482b01dc04.

```vue
<script setup>
// アーマー材質の特徴データ
</script>

<template>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4">材質</th>
                <th style="width: 12%;">種別 (Class)</th>
                <th style="width: 15%;">修理時の耐久減少</th>
                <th style="width: 15%;">被弾脆さ</th>
                <th style="width: 25%;">特徴・備考</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 text-blue fw-bold">
                    UHMWPE<br><span class="small text-muted">超高分子量ポリエチレン</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">極小</td>
                <td class="text-center text-green">小</td>
                <td class="text-muted-dark">
                    <span class="text-blue">最強素材</span>。軽く、壊れにくく、修理もしやすい。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Aramid<br><span class="small text-muted">アラミド (繊維)</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">小</td>
                <td class="text-center text-green">極小</td>
                <td class="text-muted-dark">
                    ソフトアーマーに多い。耐久が減りにくい。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Combined<br><span class="small text-muted">複合材</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">小～中</td>
                <td class="text-center">小</td>
                <td class="text-muted-dark">バランス型。多くのリグやヘルメットで使用。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Titanium<br><span class="small text-muted">チタン</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">小</td>
                <td class="text-center">小～中</td>
                <td class="text-muted-dark">修理効率が良く、硬さのバランスも良い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Aluminium<br><span class="small text-muted">アルミニウム</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">小</td>
                <td class="text-center text-orange">中</td>
                <td class="text-muted-dark">修理はしやすいが、撃たれると少し脆い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Armor Steel<br><span class="small text-muted">防弾鋼板</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">極小</td>
                <td class="text-center text-red">大</td>
                <td class="text-muted-dark">
                    <span class="text-red">非常に重い</span>。何度でも直せるが、脆い。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-red fw-bold">
                    Ceramic<br><span class="small text-muted">セラミック</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-red">大</td>
                <td class="text-center text-red">大</td>
                <td class="text-muted-dark">
                    重い・脆い・直らない。使い捨て前提。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-red">
                    Glass<br><span class="small text-muted">防弾ガラス</span>
                </td>
                <td class="text-center text-muted">-</td>
                <td class="text-center text-red">大</td>
                <td class="text-center text-red">大</td>
                <td class="text-muted-dark">バイザー等。修理すると視界が悪化しやすい。</td>
            </tr>
        </tbody>
    </table>
    <div class="p-2 small text-muted border-top border-secondary ms-2 me-2 mt-2">
        <ul class="mb-0 ps-3">
            <li><strong>修理時の耐久減少:</strong> 「小」や「極小」であるほど、修理しても最大耐久値が減りにくい（優秀）。</li>
            <li><strong>被弾脆さ:</strong> 「小/極小」＝耐久値が減りにくい（優秀）。「大」＝数発で耐久がゼロになりやすい（脆い）。</li>
            <li><strong>種別:</strong> Heavy Armorは移動速度や旋回速度へのデバフが大きい傾向がある。</li>
        </ul>
    </div>
</template>
```

## src/components/memo/MemoStims.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: 93c3c7dffc0b46a6f71fe0b6a4bac2311e8d1db23be24e586866318fee460c4f.

```vue
<script setup>
// 注射器 (Stims) データ
</script>

<template>
    <div class="memo-static-header">
        身体強化・重量・戦闘 (Physical &amp; Combat)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="stim-col-name text-start ps-3">名前</th>
                <th class="stim-col-effect">効果 (メリット)</th>
                <th class="stim-col-side">副作用・注意点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-blue">M.U.L.E.</td>
                <td>重量制限 <span class="text-green">+50%</span> (900s)</td>
                <td>Health -0.1/s, 被ダメ +9%</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-blue">SJ6 (青)</td>
                <td>
                    スタミナ最大値 <span class="text-green">+30</span><br>
                    回復速度 <span class="text-green">+2.0/s</span> (240s)
                </td>
                <td>トンネル視界、手の震え<br><small>※長距離移動の定番</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-warning">Obdolbos 2</td>
                <td>
                    全スキル <span class="text-green">+20</span> (1800s)<br>
                    重量制限 <span class="text-green">+45%</span> <small class="text-muted">(筋力UP効果)</small>
                </td>
                <td class="text-warning">副作用ほぼ無し。<br><small>※入手難・高価・最強</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-red">PNB (16)</td>
                <td>
                    Strength <span class="text-green">+20</span>, HP回復 +3/s<br>
                    <span class="text-green">被ダメージ軽減</span> (40s)
                </td>
                <td>効果終了後に体力減少<br><small>※戦闘用として非常に強力</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Trimadol</td>
                <td>
                    スタミナ回復速度 <span class="text-green">+3.0/s</span><br>
                    Strength/Endurance +10
                </td>
                <td><span class="text-red">Energy/Hydration激減</span><br><small>※食事必須。SJ6と併用で無限ダッシュ</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Meldonin</td>
                <td>
                    Strength <span class="text-green">+10</span>, Endurance +20<br>
                    <span class="text-green">被ダメージ -10%</span> (900s)
                </td>
                <td>Energy/Hydration -0.1/s<br><small>※頭に打たれた時の即死率減</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">L1</td>
                <td>
                    Strength/Endurance <span class="text-green">+20</span> (120s)<br>
                    <small class="text-muted">「プチM.U.L.E.」として機能</small>
                </td>
                <td>Hydration/Energy -0.4/s<br><span class="text-orange">効果時間が短い (2分)</span></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">SJ1 (赤)</td>
                <td>
                    Strength/Endurance/Stress <span class="text-green">+20</span><br>
                    (180s)
                </td>
                <td>被ダメージ +10%<br><small>※開幕ダッシュ等に</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">2A2-(b-TG)</td>
                <td>
                    重量制限 <span class="text-green">+15%</span> (900s)<br>
                    Metabolism +20
                </td>
                <td>Hydration -0.1/s (副作用小)<br><small>※効果は控えめだが安価</small></td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        医療・回復・止血 (Health &amp; Regen)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="stim-col-name text-start ps-3">名前</th>
                <th class="stim-col-effect">効果 (メリット)</th>
                <th class="stim-col-side">副作用・注意点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-green">eTG-c (緑)</td>
                <td>
                    <span class="text-green">HP持続回復 +6.5/s</span> (60s)<br>
                    <small>瀕死から一瞬で全快する最強回復薬</small>
                </td>
                <td>Energy -0.5/s (20s)<br>副作用は軽微。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-warning">Propital (黄)</td>
                <td>
                    HP持続回復 <span class="text-green">+1.0/s</span> (300s)<br>
                    <span class="text-blue">鎮痛効果 (240s)</span>
                </td>
                <td>トンネル視界 (終了時)<br><small>※戦闘前の常用に最適</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">AHF1-M</td>
                <td>
                    <span class="text-green">即座に止血</span> (即効性)<br>
                    新たな出血防止 (60s)
                </td>
                <td>Hydration -0.2/s<br><small>※Zagustinより早いが効果短い</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold" style="color: #d8b4fe;">Zagustin (紫)</td>
                <td>
                    <span class="text-green">全ての出血を止める</span><br>
                    新たな出血もしない (180s)
                </td>
                <td>Hydration -0.8/s (50s)<br>水分減少が激しいので注意。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Perfotoran<br><small class="text-muted">(Blue Blood)</small></td>
                <td>
                    <span class="text-green">止血 + 解毒 + 鎮痛 (60s)</span><br>
                    HP回復 +350 (合計)
                </td>
                <td>副作用ほぼ無し。<br><small>※Propitalの上位互換的性能</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">Adrenaline</td>
                <td>
                    鎮痛 (60s) + HP小回復<br>
                    反動制御・リロード速度UP
                </td>
                <td>Energy/Hydration減少 (小)<br><small>※安価な戦闘用バフ</small></td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        特殊・生存・ユーティリティ (Survival &amp; Utility)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="stim-col-name text-start ps-3">名前</th>
                <th class="stim-col-effect">効果 (メリット)</th>
                <th class="stim-col-side">副作用・注意点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-orange">SJ12 (黒)</td>
                <td>
                    <span class="text-green">Energy/Hydration 回復</span> (10分)<br>
                    サーマル対策 (体温低下 -4℃)
                </td>
                <td>終了後に<span class="text-red">体温上昇 (+6℃)</span><br><small>※デバフで逆に熱くなるので注意</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">SJ9 (TGLabs)</td>
                <td>
                    <span class="text-green">体温を下げる</span> (-7℃)<br>
                    サーマルに映らなくなる (420s)
                </td>
                <td>被ダメージ +5%<br>Metabolism -20</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">3-(b-TG)</td>
                <td>
                    Attention/Perception <span class="text-green">+10</span><br>
                    Strength +10 (240s)
                </td>
                <td>Energy/Hydration -0.3/s (30s)<br><small>※漁り(ルート)速度と聴覚UP</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-muted">Obdolbos</td>
                <td>
                    <span class="text-warning">ランダムな効果</span> (ガチャ)<br>
                    <small>※スキルLvが爆増することもあれば、デメリットのみの場合も</small>
                </td>
                <td><span class="text-red">高リスク</span><br>突然死は無くなったが注意。</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
/* このコンポーネント専用の幅設定 */
.stim-col-name   { width: 140px; font-weight: bold; }
.stim-col-effect { width: 50%; }
.stim-col-side   { width: 30%; color: #94a3b8; font-size: 0.9em; }
</style>
```

## src/components/memo/MemoGrenade.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: 76824d34d23a86565658fb127ba6c939f33fabdb16da08889a59d970f2db75c6.

```vue
<template>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4">名前</th>
                <th style="width: 25%;">起爆時間 (Fuse)</th>
                <th style="width: 25%;">爆発範囲</th>
                <th style="width: 30%;">特徴</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 fw-bold text-red">VOG-25</td>
                <td class="text-center fw-bold text-red">2.0s</td>
                <td class="text-center">小</td>
                <td class="text-muted-dark">見えた瞬間死ぬ。自爆注意。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-red">VOG-17</td>
                <td class="text-center fw-bold text-red">3.0s</td>
                <td class="text-center">小</td>
                <td class="text-muted-dark">VOG-25より少し遅いが十分早い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">V40 Mini</td>
                <td class="text-center">3.0s</td>
                <td class="text-center">極小</td>
                <td class="text-muted-dark">非常に軽く遠投可能。威力は低い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">RGD-5</td>
                <td class="text-center">3.5s</td>
                <td class="text-center">中</td>
                <td class="text-muted-dark">標準的。安くて使いやすい。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">F-1</td>
                <td class="text-center">3.5s</td>
                <td class="text-center text-blue">大</td>
                <td class="text-muted-dark">破片がかなり遠くまで飛ぶ。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-blue">M67</td>
                <td class="text-center text-blue">5.0s</td>
                <td class="text-center text-blue">大</td>
                <td class="text-muted-dark">時間が長い＝遠投や追い出しに最適。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">RGN / RGO</td>
                <td class="text-center fw-bold text-info">接触 (Impact)</td>
                <td class="text-center">小 / 中</td>
                <td class="text-muted-dark">当たると即爆発。最強の殺傷兵器。</td>
            </tr>
        </tbody>
    </table>
</template>
```

## src/components/memo/MemoTraders.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: 9c06f9c41f080d9875210717afa88d3dc43b67954167aea14da63d587934a885.

```vue
<template>
    <div class="p-2 small text-secondary border-bottom border-secondary ms-2 me-2 mt-2">
        <strong>Level:</strong> プレイヤーレベル / <strong>Rep:</strong> 親密度 / <strong>Sales:</strong> 取引額 (売買合計)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4" style="width: 15%;">Name</th>
                <th style="width: 28%;" class="text-center text-info">LL 2</th>
                <th style="width: 28%;" class="text-center text-warning">LL 3</th>
                <th style="width: 28%;" class="text-center text-success">LL 4 (Max)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 fw-bold">Prapor</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.20<br><span class="text-blue">1.1 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 26 / <span class="text-muted">Rep</span> 0.35<br><span class="text-blue">2.7 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 36 / <span class="text-muted">Rep</span> 0.50<br><span class="text-blue">3.4 M &#8381;</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Therapist</td>
                <td class="text-center"><span class="text-muted">Lv</span> 14 / <span class="text-muted">Rep</span> 0.15<br><span class="text-blue">600 k &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 24 / <span class="text-muted">Rep</span> 0.30<br><span class="text-blue">1.0 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 37 / <span class="text-muted">Rep</span> 0.60<br><span class="text-blue">1.6 M &#8381;</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Skier</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.20<br><span class="text-blue">1.2 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 28 / <span class="text-muted">Rep</span> 0.40<br><span class="text-blue">2.4 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 38 / <span class="text-muted">Rep</span> 0.75<br><span class="text-blue">3.9 M &#8381;</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Peacekeeper</td>
                <td class="text-center"><span class="text-muted">Lv</span> 14 / <span class="text-muted">Rep</span> 0.00<br><span class="text-green">$ 11 k</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 23 / <span class="text-muted">Rep</span> 0.30<br><span class="text-green">$ 25 k</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 37 / <span class="text-muted">Rep</span> 0.60<br><span class="text-green">$ 32 k</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Mechanic</td>
                <td class="text-center"><span class="text-muted">Lv</span> 20 / <span class="text-muted">Rep</span> 0.15<br><span class="text-blue">1.1 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 30 / <span class="text-muted">Rep</span> 0.30<br><span class="text-blue">2.4 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 40 / <span class="text-muted">Rep</span> 0.60<br><span class="text-blue">3.7 M &#8381;</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Ragman</td>
                <td class="text-center"><span class="text-muted">Lv</span> 17 / <span class="text-muted">Rep</span> 0.00<br><span class="text-blue">1.1 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 32 / <span class="text-muted">Rep</span> 0.30<br><span class="text-blue">2.4 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 42 / <span class="text-muted">Rep</span> 0.60<br><span class="text-blue">3.7 M &#8381;</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Jaeger</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.20<br><span class="text-blue">840 k &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 22 / <span class="text-muted">Rep</span> 0.35<br><span class="text-blue">1.6 M &#8381;</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 33 / <span class="text-muted">Rep</span> 0.50<br><span class="text-blue">2.5 M &#8381;</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">Ref</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.25<br><span class="text-secondary">-</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 25 / <span class="text-muted">Rep</span> 0.50<br><span class="text-secondary">-</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 35 / <span class="text-muted">Rep</span> 1.20<br><span class="text-secondary">-</span></td>
            </tr>
        </tbody>
    </table>
</template>
```

## src/components/memo/MemoItems.vue

Exact source at 86f135ea26db24c4e76879070058e018070d9477; SHA-256 of UTF-8/LF normalized section: b4676c3eb9ccaa960aad98beb58e1e125413174b762e0a130df4bdd5ee4c1e3c.

```vue
<script setup>
const emit = defineEmits(['open-task-from-name'])
</script>

<template>
    <div class="memo-static-header">
        📦 集めておくべき重要アイテム (Barter & Collection)
    </div>
    <div class="container-fluid px-0">
        <div class="row g-0">
            <div class="col-md-6 border-end border-secondary border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">Documents Case (セラピスト Lv.2)</div>
                    <ul class="mb-0 text-secondary small">
                        <li>Cat Figurine x 1</li>
                        <li>Bronze Lion x 1</li>
                        <li>Horse Figurine x 4</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6 border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">冷蔵庫/Holodilnick (イェーガー Lv.2)</div>
                    <ul class="mb-0 text-secondary small">
                        <li>Can of Hot Rod x 10</li>
                        <li>TarCola x 5</li>
                        <li>Can of herring x 5</li>
                        <li>Squash spread x 5</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6 border-end border-secondary border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">Red Rebel (RR) (イェーガー Lv.3)</div>
                    <div class="small text-muted mb-2">※特殊脱出 (Cliff Descent) 用の近接武器</div>
                    <ul class="mb-0 text-secondary small">
                        <li>Propane tank (5L) x 15</li>
                        <li>Fuel Conditioner (FCond) x 10</li>
                        <li>Dry Fuel (DFuel) x 15</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6 border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">T.H.I.C.C. Item Case (セラピスト Lv.4)</div>
                    <div class="row">
                        <div class="col-12 mb-2">
                            <span class="text-muted small d-block mb-1">【パターンA: 医療品】</span>
                            <ul class="mb-0 text-secondary small">
                                <li>LEDX x 15</li>
                                <li>Defibrillator x 15</li>
                                <li>Ibuprofen x 15</li>
                            </ul>
                        </div>
                        <div class="col-12">
                            <span class="text-muted small d-block mb-1">【パターンB: お酒】</span>
                            <ul class="mb-0 text-secondary small">
                                <li>Moonshine x 50</li>
                                <li>Vodka x 30</li>
                                <li>Whiskey x 35</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 border-end border-secondary border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">SICC アイテムポーチ (イェーガー Lv.4)</div>
                    <div class="small text-muted mb-2">※ドッグタグや鍵が入る (5x5マス)。書類は不可。</div>
                    <ul class="mb-0 text-secondary small">
                        <li>Paracord x 10</li>
                        <li>Duct tape (銀) x 15</li>
                        <li>Insulating tape (青) x 10</li>
                        <li>Aramid fiber cloth x 10</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="memo-static-header">
        🔓 タスク進行順と重要アンロック (Priority Order)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4" style="width: 20%;">優先度</th>
                <th style="width: 30%;">解放・報酬アイテム</th>
                <th style="width: 30%;">条件・タスク</th>
                <th style="width: 20%;">トレーダー</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="4" class="text-center align-middle border-end border-secondary text-white fw-bold">
                    最序盤<br>(Lv.1-15)
                </td>
                <td class="fw-bold ps-4 text-green">Propital (購入)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Ambulances Again')">Ambulances Again</button>
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Salewa (購入)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Postman Pat - Part 2')">Postman Pat - Part 2</button>
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Alu Splint (アルミ副木)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Seaside Vacation')">Seaside Vacation</button>
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Surv12 手術キット</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Ambulance')">Ambulance</button>
                </td>
                <td>Jaeger</td>
            </tr>
            <tr>
                <td rowspan="7" class="text-center align-middle border-end border-secondary text-blue fw-bold border-top border-secondary">
                    中盤以降<br>(重要目標)
                </td>
                <td class="fw-bold ps-4 border-top border-secondary">注射器ケース</td>
                <td class="border-top border-secondary">
                    <button class="task-link" @click="emit('open-task-from-name', 'Chemical - Part 4')">Chemical - Part 4</button>
                    <br>/
                    <button class="task-link" @click="emit('open-task-from-name', 'Out of Curiosity')">Out of Curiosity</button>
                </td>
                <td class="border-top border-secondary">Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">T.H.I.C.C. Item Case</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Private Clinic')">Private Clinic</button> (報酬)
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Epsilon コンテナ</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'The Punisher - Part 6')">The Punisher - Part 6</button>
                </td>
                <td>Prapor</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-red">M855A1 (Craft)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Your Car Needs a Service')">Your Car Needs a Service</button>
                </td>
                <td>Peacekeeper</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-red">M80A1 (M62) (Craft)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Wet Job - Part 6')">Wet Job - Part 6</button>
                </td>
                <td>Peacekeeper</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-red">BP (7.62x39mm)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Intimidator')">Intimidator</button>
                </td>
                <td>Prapor</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-info">M.U.L.E. (Craft)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Crisis')">Crisis</button>
                </td>
                <td>Therapist</td>
            </tr>
        </tbody>
    </table>
</template>
```

## Change evidence

The parent-to-95deaf8 file list and diff are reproducible with:

```text
git diff --stat 86f135ea26db24c4e76879070058e018070d9477 95deaf8c50b166ca5c1b0ad0576530cfd1201960 -- src/components/MemoView.vue src/components/memo/
git diff --find-renames=0 --numstat 86f135ea26db24c4e76879070058e018070d9477 95deaf8c50b166ca5c1b0ad0576530cfd1201960 -- src/components/MemoView.vue src/components/memo/
```

Official BSG news retrieval returned HTTP 403 during the task. This snapshot preserves original claims for independent checking; it does not establish that they remain current or correct.

## Verified public source links

- [src/components/MemoView.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/MemoView.vue)
- [src/components/memo/MemoHealth.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/memo/MemoHealth.vue)
- [src/components/memo/MemoWeapon.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/memo/MemoWeapon.vue)
- [src/components/memo/MemoArmor.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/memo/MemoArmor.vue)
- [src/components/memo/MemoStims.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/memo/MemoStims.vue)
- [src/components/memo/MemoGrenade.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/memo/MemoGrenade.vue)
- [src/components/memo/MemoTraders.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/memo/MemoTraders.vue)
- [src/components/memo/MemoItems.vue](https://github.com/iniwa/EFT-iniwa-tool/blob/86f135ea26db24c4e76879070058e018070d9477/src/components/memo/MemoItems.vue)
