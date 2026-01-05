const CompMemoItems = {
    emits: ['open-task-from-name'],
    template: `
    <div class="memo-static-header">
        📦 集めておくべき重要アイテム (Barter & Collection)
    </div>
    <div class="container-fluid px-0">
        <div class="row g-0">
            <div class="col-md-6 border-end border-secondary border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">Documents Case (セラピスト Lv.2)</div>
                    <ul class="mb-0 text-secondary small">
                        <li>🐱 Cat Figurine x 1</li>
                        <li>🦁 Bronze Lion x 1</li>
                        <li>🐴 Horse Figurine x 4</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6 border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">冷蔵庫/Holodilnick (イェーガー Lv.2)</div>
                    <ul class="mb-0 text-secondary small">
                        <li>🥤 Can of Hot Rod x 10</li>
                        <li>🥤 TarCola x 5</li>
                        <li>🐟 Can of herring x 5</li>
                        <li>🥫 Squash spread x 5</li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6 border-end border-secondary border-bottom border-dark">
                <div class="p-3">
                    <div class="text-blue fw-bold mb-2">Red Rebel (RR) (イェーガー Lv.3)</div>
                    <div class="small text-muted mb-2">※特殊脱出 (Cliff Descent) 用の近接武器</div>
                    <ul class="mb-0 text-secondary small">
                        <li>🛢️ Propane tank (5L) x 15</li>
                        <li>⛽ Fuel Conditioner (FCond) x 10</li>
                        <li>🔥 Dry Fuel (DFuel) x 15</li>
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
                                <li>📟 LEDX x 15</li>
                                <li>⚡ Defibrillator x 15</li>
                                <li>💊 Ibuprofen x 15</li>
                            </ul>
                        </div>
                        <div class="col-12">
                            <span class="text-muted small d-block mb-1">【パターンB: お酒】</span>
                            <ul class="mb-0 text-secondary small">
                                <li>🍸 Moonshine x 50</li>
                                <li>🍶 Vodka x 30</li>
                                <li>🥃 Whiskey x 35</li>
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
                        <li>🪢 Paracord x 10</li>
                        <li>🩹 Duct tape (銀) x 15</li>
                        <li>🟦 Insulating tape (青) x 10</li>
                        <li>🧵 Aramid fiber cloth x 10</li>
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
                    <span class="task-link" @click="$emit('open-task-from-name', 'Ambulances Again')">Ambulances Again</span>
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Salewa (購入)</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Postman Pat - Part 2')">Postman Pat - Part 2</span>
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Alu Splint (アルミ副木)</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Seaside Vacation')">Seaside Vacation</span>
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Surv12 手術キット</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Ambulance')">Ambulance</span>
                </td>
                <td>Jaeger</td>
            </tr>

            <tr>
                <td rowspan="7" class="text-center align-middle border-end border-secondary text-blue fw-bold border-top border-secondary">
                    中盤以降<br>(重要目標)
                </td>
                <td class="fw-bold ps-4 border-top border-secondary">注射器ケース</td>
                <td class="border-top border-secondary">
                    <span class="task-link" @click="$emit('open-task-from-name', 'Chemical - Part 4')">Chemical - Part 4</span>
                    <br>/ 
                    <span class="task-link" @click="$emit('open-task-from-name', 'Out of Curiosity')">Out of Curiosity</span>
                </td>
                <td class="border-top border-secondary">Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">T.H.I.C.C. Item Case</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Private Clinic')">Private Clinic</span> (報酬)
                </td>
                <td>Therapist</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4">Epsilon コンテナ</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'The Punisher - Part 6')">The Punisher - Part 6</span>
                </td>
                <td>Prapor</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-red">M855A1 (Craft)</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Your Car Needs a Service')">Your Car Needs a Service</span>
                </td>
                <td>Peacekeeper</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-red">M80A1 (M62) (Craft)</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Wet Job - Part 6')">Wet Job - Part 6</span>
                </td>
                <td>Peacekeeper</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-red">BP (7.62x39mm)</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Intimidator')">Intimidator</span>
                </td>
                <td>Prapor</td>
            </tr>
            <tr>
                <td class="fw-bold ps-4 text-info">M.U.L.E. (Craft)</td>
                <td>
                    <span class="task-link" @click="$emit('open-task-from-name', 'Crisis')">Crisis</span>
                </td>
                <td>Therapist</td>
            </tr>
        </tbody>
    </table>
    `
};