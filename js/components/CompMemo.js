const CompMemo = {
    // タスク名クリックイベントを親に通知
    emits: ['open-task-from-name'],
    // 子コンポーネントを登録
    components: {
        'comp-memo-health': CompMemoHealth,
        'comp-memo-weapon': CompMemoWeapon,
        'comp-memo-armor': CompMemoArmor,
        'comp-memo-stims': CompMemoStims,
        'comp-memo-grenade': CompMemoGrenade,
        'comp-memo-traders': CompMemoTraders,
        'comp-memo-items': CompMemoItems
    },
    data() {
        const savedState = localStorage.getItem('memo_accordion_state');
        const defaultState = {
            health: false,
            weapon: false,
            armor: false,
            stims: false,
            grenade: false,
            items: false,
            traders: false
        };
        return {
            isOpen: savedState ? { ...defaultState, ...JSON.parse(savedState) } : defaultState
        };
    },
    methods: {
        toggleSection(sectionKey) {
            this.isOpen[sectionKey] = !this.isOpen[sectionKey];
            localStorage.setItem('memo_accordion_state', JSON.stringify(this.isOpen));
        }
    },
    template: `
    <component :is="'style'">
        /* --- デザイン設定 (Memo専用) --- */
        :root {
            --memo-primary: #0dcaf0;
            --memo-bg-header: #0f172a;
            --memo-bg-body: #000000;
            --memo-border: #1e293b;
            --memo-text-main: #e2e8f0;
        }
        .memo-wrapper { max-width: 1200px; margin: 0 auto; }

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
        .memo-accordion-button:hover { filter: brightness(1.2); }
        .memo-accordion-button::after {
            content: ''; width: 1.25rem; height: 1.25rem; margin-left: auto;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230dcaf0'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
            background-repeat: no-repeat; background-size: 1.25rem; transition: transform 0.2s ease-in-out;
        }
        .memo-accordion-button.collapsed::after { transform: rotate(-90deg); }

        /* 子コンポーネント用共通スタイル */
        .memo-static-header {
            background-color: #111827; color: var(--memo-primary); font-weight: bold;
            padding: 8px 20px; border-top: 1px solid var(--memo-border); border-bottom: 1px solid var(--memo-border);
            font-size: 0.95rem; display: flex; align-items: center; cursor: default;
        }
        .memo-static-header::before { content: '■'; font-size: 0.6em; margin-right: 8px; opacity: 0.7; }

        .memo-table { width: 100%; border-collapse: collapse; font-size: 0.9em; table-layout: fixed; }
        .memo-table th {
            background-color: #0b1120 !important; color: #94a3b8 !important; padding: 8px 10px;
            border-bottom: 1px solid var(--memo-border) !important; text-align: center; white-space: nowrap; font-weight: normal;
        }
        .memo-table td {
            background-color: var(--memo-bg-body) !important; color: var(--memo-text-main) !important;
            padding: 10px 15px; border-bottom: 1px solid #222 !important; vertical-align: middle; word-wrap: break-word;
        }
        .memo-table tr:last-child td { border-bottom: none !important; }

        .text-blue { color: #0dcaf0 !important; }
        .text-green { color: #2ecc71 !important; }
        .text-red { color: #ef4444 !important; }
        .text-orange { color: #f59e0b !important; }
        .text-muted-dark { color: #94a3b8 !important; }

        .weapon-col-caliber { width: 100px; text-align: center; font-weight: bold; color: var(--memo-primary); }
        .weapon-col-name { width: 160px; font-weight: bold; }
        .weapon-col-desc { text-align: left; }
        .memo-caliber-row td { border-top: 3px solid #64748b !important; }

        .task-link {
            color: #0dcaf0; cursor: pointer; text-decoration: underline; text-underline-offset: 4px;
            text-decoration-color: rgba(13, 202, 240, 0.3); transition: all 0.2s;
        }
        .task-link:hover { color: #fff; text-decoration-color: #fff; background-color: rgba(13, 202, 240, 0.1); }
    </component>

    <div class="card border-0 bg-black mb-4 memo-wrapper">
        <div class="card-header bg-black text-info border-bottom border-secondary py-3">
            <div class="fw-bold fs-5">📝 メモ書き (データ一覧)</div>
        </div>
        
        <div class="card-body bg-black p-0">
            <div class="px-3 py-2 text-secondary small border-bottom border-secondary" style="font-size: 0.85rem;">
                ※ 情報はパッチ1.0.0.5、正式版直後の情報を元に作成しています。
            </div>

            <div class="accordion accordion-flush" id="memoAccordion">
                
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div class="memo-accordion-button" :class="{ collapsed: !isOpen.health }" @click="toggleSection('health')">
                            <span class="me-2">🚑</span> 回復・手術キット性能
                        </div>
                    </h2>
                    <div v-show="isOpen.health">
                        <div class="accordion-body p-0 bg-black">
                            <comp-memo-health></comp-memo-health>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div class="memo-accordion-button" :class="{ collapsed: !isOpen.weapon }" @click="toggleSection('weapon')">
                            <span class="me-2">🔫</span> 口径別の武器詳細
                        </div>
                    </h2>
                    <div v-show="isOpen.weapon">
                        <div class="accordion-body p-0 bg-black">
                            <comp-memo-weapon></comp-memo-weapon>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div class="memo-accordion-button" :class="{ collapsed: !isOpen.armor }" @click="toggleSection('armor')">
                            <span class="me-2">🛡️</span> アーマー材質の特徴
                        </div>
                    </h2>
                    <div v-show="isOpen.armor">
                        <div class="accordion-body p-0 bg-black">
                            <comp-memo-armor></comp-memo-armor>
                        </div>
                    </div>
                </div>
                
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div class="memo-accordion-button" :class="{ collapsed: !isOpen.stims }" @click="toggleSection('stims')">
                            <span class="me-2">💉</span> 注射器 (Stims)
                        </div>
                    </h2>
                    <div v-show="isOpen.stims">
                        <div class="accordion-body p-0 bg-black">
                            <comp-memo-stims></comp-memo-stims>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div class="memo-accordion-button" :class="{ collapsed: !isOpen.grenade }" @click="toggleSection('grenade')">
                            <span class="me-2">💣</span> グレネード性能 (Fuse Time)
                        </div>
                    </h2>
                    <div v-show="isOpen.grenade">
                        <div class="accordion-body p-0 bg-black">
                            <comp-memo-grenade></comp-memo-grenade>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div class="memo-accordion-button" :class="{ collapsed: !isOpen.traders }" @click="toggleSection('traders')">
                            <span class="me-2">🤝</span> トレーダー解放条件 (Loyalty Levels)
                        </div>
                    </h2>
                    <div v-show="isOpen.traders">
                        <div class="accordion-body p-0 bg-black">
                            <comp-memo-traders></comp-memo-traders>
                        </div>
                    </div>
                </div>

                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <div class="memo-accordion-button" :class="{ collapsed: !isOpen.items }" @click="toggleSection('items')">
                            <span class="me-2">🏆</span> 解放・収集・タスク攻略
                        </div>
                    </h2>
                    <div v-show="isOpen.items">
                        <div class="accordion-body p-0 bg-black">
                            <comp-memo-items @open-task-from-name="$emit('open-task-from-name', $event)"></comp-memo-items>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `
};