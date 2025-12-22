const CompMemo = {
    // タスク名クリックイベントを親に通知
    emits: ['open-task-from-name'],
    data() {
        return {
            isOpen: {
                health: false,
                weapon: false,
                armor: false,
                stims: false,
                grenade: false,
                items: false
            }
        };
    },
    methods: {
        toggleSection(sectionKey) {
            this.isOpen[sectionKey] = !this.isOpen[sectionKey];
        }
    },
    template: `
    <component :is="'style'">
        /* --- デザイン設定 (Memo専用) --- */
        
        :root {
            --memo-primary: #0dcaf0;       /* 強調色（シアン/青） */
            --memo-bg-header: #0f172a;     /* ヘッダー背景（濃い紺） */
            --memo-bg-body: #000000;       /* 本体背景（黒） */
            --memo-border: #1e293b;        /* 枠線（薄い紺） */
            --memo-text-main: #e2e8f0;     /* メイン文字色 */
        }

        .memo-wrapper {
            max-width: 1200px;
            margin: 0 auto;
        }

        /* アコーディオンボタン */
        .memo-accordion-button {
            background-color: var(--memo-bg-header) !important;
            color: var(--memo-primary) !important;
            border: none !important;
            border-bottom: 1px solid var(--memo-border) !important;
            border-radius: 0 !important;
            font-weight: bold;
            display: flex;
            align-items: center;
            padding: 15px 20px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .memo-accordion-button:hover {
            filter: brightness(1.2);
        }
        
        .memo-accordion-button::after {
            content: '';
            width: 1.25rem;
            height: 1.25rem;
            margin-left: auto;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230dcaf0'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-size: 1.25rem;
            transition: transform 0.2s ease-in-out;
        }
        .memo-accordion-button.collapsed::after {
            transform: rotate(-90deg);
        }

        /* 静的な内部見出し */
        .memo-static-header {
            background-color: #111827;
            color: var(--memo-primary);
            font-weight: bold;
            padding: 8px 20px;
            border-top: 1px solid var(--memo-border);
            border-bottom: 1px solid var(--memo-border);
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            cursor: default;
        }
        .memo-static-header::before {
            content: '■';
            font-size: 0.6em;
            margin-right: 8px;
            opacity: 0.7;
        }

        /* テーブルスタイル */
        .memo-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9em;
            table-layout: fixed;
        }
        .memo-table th {
            background-color: #0b1120 !important;
            color: #94a3b8 !important;
            padding: 8px 10px;
            border-bottom: 1px solid var(--memo-border) !important;
            text-align: center;
            white-space: nowrap;
            font-weight: normal;
        }
        .memo-table td {
            background-color: var(--memo-bg-body) !important;
            color: var(--memo-text-main) !important;
            padding: 10px 15px;
            border-bottom: 1px solid #222 !important;
            vertical-align: middle;
            word-wrap: break-word;
        }
        .memo-table tr:last-child td {
            border-bottom: none !important;
        }

        /* テキスト強調 */
        .text-blue { color: #0dcaf0 !important; }
        .text-green { color: #2ecc71 !important; }
        .text-red { color: #ef4444 !important; }
        .text-orange { color: #f59e0b !important; }
        .text-muted-dark { color: #94a3b8 !important; }

        /* 武器テーブル専用 */
        .weapon-col-caliber { width: 100px; text-align: center; font-weight: bold; color: var(--memo-primary); }
        .weapon-col-name { width: 160px; font-weight: bold; }
        .weapon-col-desc { text-align: left; }

        /* 口径の区切り線を太くする */
        .memo-caliber-row td {
            border-top: 3px solid #64748b !important;
        }

        /* クリック可能なタスクリンク */
        .task-link {
            color: #0dcaf0;
            cursor: pointer;
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-color: rgba(13, 202, 240, 0.3);
            transition: all 0.2s;
        }
        .task-link:hover {
            color: #fff;
            text-decoration-color: #fff;
            background-color: rgba(13, 202, 240, 0.1);
        }

    </component>

    <div class="card border-0 bg-black mb-4 memo-wrapper">
        <div class="card-header bg-black text-info border-bottom border-secondary py-3">
            <div class="fw-bold fs-5">📝 Tactical Memo (データ一覧)</div>
        </div>
        
        <div class="card-body bg-black p-0">
            <div class="accordion accordion-flush" id="memoAccordion">
                
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div 
                            class="memo-accordion-button" 
                            :class="{ collapsed: !isOpen.health }"
                            @click="toggleSection('health')"
                        >
                            <span class="me-2">🚑</span> 回復・手術キット性能
                        </div>
                    </h2>
                    <div v-show="isOpen.health">
                        <div class="accordion-body p-0 bg-black">
                            <table class="memo-table">
                                <thead>
                                    <tr>
                                        <th class="text-start ps-4" style="width: 15%;">名前</th>
                                        <th style="width: 10%;">容量</th>
                                        <th style="width: 10%;">総時間</th>
                                        <th style="width: 15%;" class="text-blue">発動ラグ</th>
                                        <th style="width: 10%;">HP/回</th>
                                        <th style="width: 12%;">軽出血</th>
                                        <th style="width: 12%;">重出血</th>
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
                                ※ <strong>発動ラグ:</strong> アニメーション開始から実際にHPが回復するまでの時間（目安）。この直後にアニメーションキャンセルが可能。
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
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div 
                            class="memo-accordion-button" 
                            :class="{ collapsed: !isOpen.weapon }"
                            @click="toggleSection('weapon')"
                        >
                            <span class="me-2">🔫</span> 口径別の武器詳細
                        </div>
                    </h2>
                    <div v-show="isOpen.weapon">
                        <div class="accordion-body p-0 bg-black">
                            <table class="memo-table">
                                <thead>
                                    <tr>
                                        <th class="weapon-col-caliber">口径</th>
                                        <th class="weapon-col-name text-start ps-3">武器名</th>
                                        <th class="weapon-col-desc ps-3">特徴・運用メモ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="memo-caliber-row">
                                        <td rowspan="5" class="weapon-col-caliber border-end border-secondary">
                                            7.62x51mm<br><span class="small text-muted">NATO</span>
                                        </td>
                                        <td class="text-blue fw-bold ps-3">SR-25</td>
                                        <td class="text-muted-dark">
                                            セミオートDMRの王道。リコイルの戻り（跳ねた照準が戻る速度）が非常に早く、連射しても当てやすい。
                                            <span class="text-blue">「迷ったらこれ」</span>と言えるほどコスパと性能のバランスが良い。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3 text-secondary">RSASS</td>
                                        <td class="text-muted-dark">
                                            SR-25の上位互換で理論値最強だが、本体価格が非常に高い。
                                            コスパ度外視のロマン・ガチ装備。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-blue fw-bold ps-3">MDR 7.62</td>
                                        <td class="text-muted-dark">
                                            この大口径を<span class="text-blue">フルオート</span>で撃てる強武器。
                                            ブルパップなので全長が短く、室内戦や曲がり角での取り回しが良い。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3">SA-58</td>
                                        <td class="text-muted-dark">
                                            通称「破壊神」。近距離の火力は凄まじいが、反動が強烈すぎて中距離以降の制御は困難。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3">SCAR-H</td>
                                        <td class="text-muted-dark">
                                            レートが遅めで反動制御はしやすいが、カスタム幅が狭くエルゴノミクス（構え）が低くなりがち。
                                        </td>
                                    </tr>

                                    <tr class="memo-caliber-row">
                                        <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                                            7.62x39mm
                                        </td>
                                        <td class="text-blue fw-bold ps-3">RD-704</td>
                                        <td class="text-muted-dark">
                                            非常にコンパクトで<span class="text-blue">エルゴノミクスが最強クラス</span>。
                                            サプレッサーを付けても取り回しが良く、遭遇戦で先手を取りやすい。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-blue fw-bold ps-3">Mk47 Mutant</td>
                                        <td class="text-muted-dark">
                                            RD-704より連射速度が速く、精度も良いが少し重い。
                                            「火力でねじ伏せる」ならこちら。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3">AKMN / 103</td>
                                        <td class="text-muted-dark">
                                            RDやMk47が高くて買えない時の主力。
                                            性能は劣るが、強力なBP/PP弾を撃てる発射台としては十分優秀。
                                        </td>
                                    </tr>

                                    <tr class="memo-caliber-row">
                                        <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                                            5.56x45mm<br><span class="small text-muted">NATO</span>
                                        </td>
                                        <td class="text-blue fw-bold ps-3">AUG A3</td>
                                        <td class="text-muted-dark">
                                            純正状態で性能が高く、カスタム費用が安い。
                                            <span class="text-blue">コスパ最強</span>の5.56mm枠。スコープを載せるだけで戦える。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3">MDR 5.56</td>
                                        <td class="text-muted-dark">
                                            7.62版と同じく取り回しが良い。5.56mm枠の中ではリコイルが素直で扱いやすい。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3">M4A1 / HK416</td>
                                        <td class="text-muted-dark">
                                            お金をかけてフルカスタムすれば最強だが、中途半端なカスタムだと弱い。上級者向け。
                                        </td>
                                    </tr>

                                    <tr class="memo-caliber-row">
                                        <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                                            5.45x39mm
                                        </td>
                                        <td class="text-blue fw-bold ps-3">NL-545</td>
                                        <td class="text-muted-dark">
                                            <span class="text-blue">今期のメタ武器</span>。M4と同じ高レート(800RPM)で撃て、反動も非常にマイルド。
                                            5.45mmを使うならまずこれ。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3">SAG AK-545</td>
                                        <td class="text-muted-dark">
                                            セミオート限定のAK。精度とエルゴノミクスが非常に高く、安価。
                                            頭を狙う練習用や、スカブ狩りタスクなどで非常に優秀。
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold ps-3">AK-74N / 74M</td>
                                        <td class="text-muted-dark">
                                            いわゆる普通のAK。弾（BP/BT/BS）が入手しやすいので、序盤〜中盤の主力になる。
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div 
                            class="memo-accordion-button" 
                            :class="{ collapsed: !isOpen.armor }"
                            @click="toggleSection('armor')"
                        >
                            <span class="me-2">🛡️</span> アーマー材質の特徴
                        </div>
                    </h2>
                    <div v-show="isOpen.armor">
                        <div class="accordion-body p-0 bg-black">
                            <table class="memo-table">
                                <thead>
                                    <tr>
                                        <th class="text-start ps-4">材質</th>
                                        <th>修理効率</th>
                                        <th>耐久減少</th>
                                        <th>重量</th>
                                        <th>代表例</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-start ps-4 text-blue fw-bold">UHMWPE (ポリエチレン)</td>
                                        <td class="text-center text-green">最高</td>
                                        <td class="text-center">小</td>
                                        <td class="text-center">軽い</td>
                                        <td>CPC Mod.2, Tactec</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 text-white">アラミド (Aramid)</td>
                                        <td class="text-center">良い</td>
                                        <td class="text-center">小</td>
                                        <td class="text-center">軽い</td>
                                        <td>PACA, ソフトアーマー</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 text-white">スチール (Steel)</td>
                                        <td class="text-center">良い</td>
                                        <td class="text-center">中</td>
                                        <td class="text-center text-red fw-bold">重い</td>
                                        <td>Korund-VM</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 text-white">チタン (Titanium)</td>
                                        <td class="text-center">普通</td>
                                        <td class="text-center">小</td>
                                        <td class="text-center">普通</td>
                                        <td>Zhuk-6</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 text-red fw-bold">セラミック (Ceramic)</td>
                                        <td class="text-center text-red">悪い</td>
                                        <td class="text-center text-red">大</td>
                                        <td class="text-center">普通</td>
                                        <td>Gzhel-K (使い捨て推奨)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div 
                            class="memo-accordion-button" 
                            :class="{ collapsed: !isOpen.stims }"
                            @click="toggleSection('stims')"
                        >
                            <span class="me-2">💉</span> M.U.L.E.代替・重量スタミナ注射
                        </div>
                    </h2>
                    <div v-show="isOpen.stims">
                        <div class="accordion-body p-0 bg-black">
                            <table class="memo-table">
                                <thead>
                                    <tr>
                                        <th class="text-start ps-4">名前</th>
                                        <th style="width: 40%;">効果 (メリット)</th>
                                        <th style="width: 40%;">副作用・注意点</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-start ps-4 fw-bold text-blue">M.U.L.E.</td>
                                        <td>重量制限 <span class="text-green">+50%</span> (900s)</td>
                                        <td class="text-muted-dark">Health -0.1/s, 被ダメ +9%</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 fw-bold text-warning">Obdolbos 2</td>
                                        <td>全スキル <span class="text-green">+20</span> (1800s)<br>重量制限 <span class="text-green">+45%</span></td>
                                        <td class="text-warning">副作用ほぼ無し。<br><small>※入手難・高価・最強</small></td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 fw-bold text-info">2A2-(b-TG)</td>
                                        <td>
                                            重量制限 <span class="text-green">+15%</span> (900s)<br>
                                            Perception/Attention <span class="text-green">+10</span>
                                        </td>
                                        <td class="text-muted-dark">Hydration -0.1/s (副作用小)</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 fw-bold text-info">L1 (Norepinephrine)</td>
                                        <td>
                                            Strength <span class="text-green">+20</span> (120s)<br>
                                            <small class="text-muted">「プチM.U.L.E.」として機能</small>
                                        </td>
                                        <td class="text-muted-dark">Hydration/Energy -0.4/s (30s)</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 fw-bold text-info">SJ6</td>
                                        <td>スタミナ最大値 <span class="text-green">+30</span><br>回復速度 <span class="text-green">+2.0/s</span></td>
                                        <td class="text-muted-dark">画面揺れ、トンネル視界 (終了時)</td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 fw-bold text-info">Trimadol</td>
                                        <td>
                                            スタミナ回復 <span class="text-green">+3.0/s</span><br>
                                            Strength/Endurance <span class="text-green">+10</span>
                                        </td>
                                        <td class="text-red">Energy/Hydration -1.0/s (180s)<br><small>※食事必須</small></td>
                                    </tr>
                                    <tr>
                                        <td class="text-start ps-4 fw-bold text-info">Meldonin</td>
                                        <td>Strength <span class="text-green">+10</span> (900s)<br>被ダメージ軽減 -10%</td>
                                        <td class="text-muted-dark">Energy/Hydration -0.1/s</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div 
                            class="memo-accordion-button" 
                            :class="{ collapsed: !isOpen.grenade }"
                            @click="toggleSection('grenade')"
                        >
                            <span class="me-2">💣</span> グレネード性能 (Fuse Time)
                        </div>
                    </h2>
                    <div v-show="isOpen.grenade">
                        <div class="accordion-body p-0 bg-black">
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
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div 
                            class="memo-accordion-button" 
                            :class="{ collapsed: !isOpen.items }"
                            @click="toggleSection('items')"
                        >
                            <span class="me-2">🏆</span> 解放・収集・タスク攻略
                        </div>
                    </h2>
                    <div v-show="isOpen.items">
                        <div class="accordion-body p-0 bg-black">
                            
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
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `
};