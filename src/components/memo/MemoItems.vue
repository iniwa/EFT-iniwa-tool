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
                                <li>Toothpaste x 15</li>
                            </ul>
                        </div>
                        <div class="col-12">
                            <span class="text-muted small d-block mb-1">【パターンB: お酒】</span>
                            <ul class="mb-0 text-secondary small">
                                <li>Moonshine x 50</li>
                                <li>Vodka x 50</li>
                                <li>Whiskey x 30</li>
                                <li>別ルート: Ref LL4 — Lega medal ×3 + GP coin ×500</li>
                                <li>Peacekeeper LL4 + Special Equipment — Blue folders ×20 + Secure magnetic tape ×30 + Secure flash drive ×30</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 border-end border-secondary border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">SICC アイテムポーチ (イェーガー Lv.4)</div>
                    <div class="small text-muted mb-2">※鍵・キーカード・ドッグタグ・一部貴重品が入る (5x5マス)。書類は不可。</div>
                    <ul class="mb-0 text-secondary small">
                        <li>Paracord x 12</li>
                        <li>Duct tape (銀) x 15</li>
                        <li>Insulating tape (青) x 15</li>
                        <li>Pack of nails x 15</li>
                        <li>別ルート: Peacekeeper LL1 + Wiring the Vessel — IBX processor ×2 + Ultralink ×1</li>
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
                    医療品<br>(優先度は目安)
                </td>
                <td class="fw-bold ps-4 text-green">Propital (購入)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Health Care Privacy - Part 2')">Health Care Privacy - Part 2</button>
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
                    <button class="task-link" @click="emit('open-task-from-name', 'Health Care Privacy - Part 4')">Health Care Privacy - Part 4</button>
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Surv12 手術キット</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Broadcast - Part 3')">Broadcast - Part 3</button><br><small>LL2: Antique vase ×2 の交換。旧Ambulance購入ルートは現在利用不可の記載・要確認。</small>
                </td>
                <td>Jaeger</td>
            </tr>
            <tr>
                <td rowspan="7" class="text-center align-middle border-end border-secondary text-blue fw-bold border-top border-secondary">
                    中盤以降<br>(重要目標)
                </td>
                <td class="fw-bold ps-4 border-top border-secondary">注射器ケース</td>
                <td class="border-top border-secondary">
                    <button class="task-link" @click="emit('open-task-from-name', 'Thirsty - Secrets')">Thirsty - Secrets</button>
                </td>
                <td class="border-top border-secondary">Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">T.H.I.C.C. Item Case</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'A Difficult Choice')">A Difficult Choice</button> (報酬)<br><small>旧Private Clinicは現在利用不可の記載。</small>
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
                    <button class="task-link" @click="emit('open-task-from-name', 'Special Equipment')">Special Equipment</button>
                </td>
                <td>Peacekeeper</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-red">M80A1 (Craft)</td>
                <td>
                    <button class="task-link" @click="emit('open-task-from-name', 'Wet Job - Part 4')">Wet Job - Part 4</button>
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
                    <button class="task-link" @click="emit('open-task-from-name', 'Decontamination Service')">Decontamination Service</button>
                </td>
                <td>Therapist</td>
            </tr>
        </tbody>
    </table>
    <p class="p-2 small text-muted mb-0">2026-10-07確認・コミュニティWiki: <a href="https://wikiwiki.jp/eft/%E3%82%B1%E3%83%BC%E3%82%B9" target="_blank" rel="noopener noreferrer">ケース</a> / <a href="https://wikiwiki.jp/eft/%E5%8C%BB%E8%96%AC%E5%93%81" target="_blank" rel="noopener noreferrer">医薬品</a> / <a href="https://wikiwiki.jp/eft/%E5%BC%BE%E8%96%AC" target="_blank" rel="noopener noreferrer">弾薬</a>。交換・購入・クラフト・報酬は別ルート。LL以外のタスク条件にも注意。優先度は実用目安でレベル保証ではありません。</p>
</template>
