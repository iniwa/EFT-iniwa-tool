// src/data/storyChaptersSide.js

export const SIDE_CHAPTERS = [
    {
        id: 'batya',
        title: 'Batya',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Batya',
        description: 'BEAR特殊部隊「Bogatyr」の行方を追う。',
        category: 'side',
        unlockCondition: 'Customs / Woods / Reserve / ShorelineのいずれかでBEAR部隊の痕跡(Bogatyr patch)を発見',
        phases: [
            {
                id: 'ba_p1',
                title: 'Phase 1: 痕跡の発見',
                steps: [
                    { id: 'ba_find_trace', type: 'check', text: 'BEAR特殊部隊の痕跡を見つける' },
                    { id: 'ba_get_patch', type: 'check', text: 'Bogatyr squad patchを入手する (Customs/Woods/Reserve/Lighthouse)', optional: true }
                ]
            },
            {
                id: 'ba_p2',
                title: 'Phase 2: トレーダー聞き込み',
                steps: [
                    { id: 'ba_ask_jaeger', type: 'check', text: 'Jaegerと話し、Bogatyr部隊について聞く' }
                ]
            },
            {
                id: 'ba_p3',
                title: 'Phase 3: Ryabina拠点 (Woods)',
                steps: [
                    { id: 'ba_ryabina_locate', type: 'check', text: 'Ryabina Outpostを特定する (Woods、スナイパーロック付近)' },
                    { id: 'ba_ryabina_info', type: 'check', text: 'Bogatyr部隊の情報を見つける (Hostage evacuation report from Voevoda)' },
                    { id: 'ba_ryabina_memento', type: 'check', text: 'Bogatyrの形見を入手する (Strelets\' amulet)', optional: true }
                ]
            },
            {
                id: 'ba_p4',
                title: 'Phase 4: Carousel拠点 (Interchange)',
                steps: [
                    { id: 'ba_carousel_locate', type: 'check', text: 'Carousel Outpostを特定する (ULTRA IDEA店舗向かい)' },
                    { id: 'ba_carousel_note', type: 'check', text: 'Bogatyr部隊の個人メモを見つける (Strelets\' note)' },
                    { id: 'ba_strelets_info', type: 'check', text: 'Streletsについて調べる' },
                    { id: 'ba_taran_info', type: 'check', text: 'Taranについて調べる (Taran\'s personal file)' },
                    { id: 'ba_taran_postcard', type: 'check', text: 'Bogatyrの個人的な持ち物を入手する (Taran\'s postcard)', optional: true },
                    { id: 'ba_voevoda_info', type: 'check', text: 'Voevodaについて調べる (Voevoda\'s personal file)' },
                    { id: 'ba_voevoda_tape', type: 'check', text: 'Voevodaの個人的な持ち物を見つける (Voevoda\'s thoughts audio tape)' },
                    { id: 'ba_voevoda_recorder', type: 'check', text: '部隊長のレコーダーを入手する (Voevoda\'s audio recorder)', optional: true }
                ]
            },
            {
                id: 'ba_p5',
                title: 'Phase 5: Gnezdo拠点',
                steps: [
                    { id: 'ba_gnezdo_locate', type: 'check', text: 'Gnezdo Outpostを特定する' },
                    { id: 'ba_gnezdo_search', type: 'check', text: 'Gnezdo Outpostを捜索する (First piece of code note)' },
                    { id: 'ba_gnezdo_fate', type: 'check', text: 'Bogatyr部隊に何が起きたか解明する (BEAR note from outpost behind Ultra)' },
                    { id: 'ba_gnezdo_ambush', type: 'check', text: 'Bogatyr部隊が待ち伏せを受けた場所を特定する (Map with triangulated signal)' },
                    { id: 'ba_gnezdo_ops', type: 'check', text: 'Bogatyr部隊の活動について調べる (Bogatyr squad operations report)' },
                    { id: 'ba_gnezdo_moreman', type: 'check', text: 'Bogatyr部隊のメンバーについて調べる (Moreman\'s personal file)' }
                ]
            },
            {
                id: 'ba_p6',
                title: 'Phase 6: 待ち伏せ地点',
                steps: [
                    { id: 'ba_ambush_locate', type: 'check', text: '待ち伏せ地点を特定する' },
                    { id: 'ba_ambush_info', type: 'check', text: 'Bogatyr部隊の追加情報を入手する' },
                    { id: 'ba_moreman_body', type: 'check', text: 'Moremanの遺体を調べる (Second piece of code note)' },
                    { id: 'ba_moreman_phone', type: 'check', text: 'Moremanの電話を入手する', optional: true },
                    { id: 'ba_moreman_dogtag', type: 'check', text: 'Bogatyrのドッグタグを入手する (Moreman\'s dogtag)', optional: true },
                    { id: 'ba_moreman_phone_info', type: 'check', text: 'Moremanの電話から待ち伏せの情報を得る' }
                ]
            },
            {
                id: 'ba_p7',
                title: 'Phase 7: Lightkeeper連絡',
                steps: [
                    { id: 'ba_intel_center', type: 'check', text: 'Intelligence Center Lv3を設置する' },
                    { id: 'ba_radio_contact', type: 'check', text: 'Bogatyr部隊に連絡する (Radio: 周波数35.70, コード27.893.2000)' },
                    { id: 'ba_lk_access', type: 'check', text: 'Lightkeeperへのアクセス権を得る' },
                    { id: 'ba_lk_rep', type: 'check', text: 'Lightkeeperとの良好な関係を維持する' },
                    { id: 'ba_lk_handover', type: 'check', text: 'Bogatyr部隊の遺留品5つをLightkeeperに渡す' },
                    { id: 'ba_wait_voevoda', type: 'wait', text: 'Voevodaからの連絡を待つ', duration: '12〜24時間' }
                ]
            },
            {
                id: 'ba_p8',
                title: 'Phase 8: Voevodaの試練',
                steps: [
                    { id: 'ba_skill_lmg', type: 'check', text: 'Light Machine Gunsスキル Lv5に到達する', parallel: true },
                    { id: 'ba_skill_ar', type: 'check', text: 'Assault Riflesスキル Lv10に到達する', parallel: true },
                    { id: 'ba_skill_stress', type: 'check', text: 'Stress Resistanceスキル Lv10に到達する', parallel: true },
                    { id: 'ba_skill_str', type: 'check', text: 'Strengthスキル Lv15に到達する', parallel: true },
                    { id: 'ba_kill_15', type: 'check', text: '死なずに15人のターゲットを排除する' },
                    { id: 'ba_kill_4pmc', type: 'check', text: '死なずに4人のPMCを排除する' },
                    { id: 'ba_radio_voevoda', type: 'check', text: 'Voevodaに連絡する (Radio再度)' }
                ]
            },
            {
                id: 'ba_p9',
                title: 'Phase 9: 裏切り者の追跡',
                steps: [
                    { id: 'ba_traitor_trace', type: 'check', text: '裏切り者の痕跡を見つける (Lighthouse BEARキャンプ、Note mentioning Prapor)' },
                    { id: 'ba_interrogate_prapor', type: 'check', text: 'Praporを尋問する' },
                    { id: 'ba_cultist_photo', type: 'check', text: 'Voevodaの写真 with cultist mark (Shoreline)', parallel: true },
                    { id: 'ba_general_note', type: 'check', text: 'Note mentioning General (Woods or Customs)', parallel: true },
                    { id: 'ba_talk_lk', type: 'check', text: 'Lightkeeperと話す' }
                ]
            },
            {
                id: 'ba_p10',
                title: 'Phase 10: 完了',
                steps: [
                    { id: 'ba_wait_docs', type: 'wait', text: 'LightkeeperがThe Unheardに関する書類を準備するのを待つ', duration: '12時間' },
                    { id: 'ba_receive_report', type: 'check', text: 'Agent network deployment reportをLightkeeperから受け取る' },
                    { id: 'ba_achievement', type: 'note', text: '実績「This Is All (Not) Coincidence」解除' }
                ]
            }
        ]
    },
    {
        id: 'the_unheard',
        title: 'The Unheard',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Unheard',
        description: 'TerraGroupとカルト集団「The Unheard」の関係を調査する。',
        category: 'side',
        unlockCondition: 'StreetsまたはGround Zeroで「Note with ramblings about the Purification」を発見して読む',
        phases: [
            {
                id: 'uh_p1',
                title: 'Phase 1: 初期調査 (The Lab)',
                steps: [
                    { id: 'uh_read_note', type: 'check', text: 'The Unheardについて調べる (unlock条件のノートを読む)' },
                    { id: 'uh_tg_doc', type: 'check', text: 'TerraGroupの活動について調べる (Document on changes in enterprise interactions, The Lab)' },
                    { id: 'uh_fuel_doc', type: 'check', text: 'ノートに記載された「燃料」について調べる (Cargo transport fax, The Lab)' }
                ]
            },
            {
                id: 'uh_p2',
                title: 'Phase 2: 触媒の追跡 (Factory + Streets)',
                steps: [
                    { id: 'uh_transport_log', type: 'check', text: '特殊触媒の出荷について調べる (Transport log with notes, Factory)' },
                    { id: 'uh_hdd', type: 'check', text: 'StreetsのLexOs付近でRzhevskyの業務車両を見つけ、HDDを回収する' },
                    { id: 'uh_print_hdd', type: 'check', text: 'Intel Center Lv1でHDDのデータをプリントアウトする' },
                    { id: 'uh_read_transcript', type: 'check', text: 'Rzhevskyの会話記録を読む' }
                ]
            },
            {
                id: 'uh_p3',
                title: 'Phase 3: Blue Ice研究 (Factory)',
                steps: [
                    { id: 'uh_blue_ice_doc', type: 'check', text: 'Blue Ice燃料触媒の研究文書を入手する (TerraGroup storage room, Factory、要キーカード)' },
                    { id: 'uh_burnt_doc', type: 'check', text: 'The Unheardの計画に関する情報を見つける (Burnt document, 同じ部屋)' }
                ]
            },
            {
                id: 'uh_p4',
                title: 'Phase 4: A.P.の追跡 (The Lab + Shoreline)',
                steps: [
                    { id: 'uh_ap_tape1', type: 'check', text: 'A.P.の活動について調べる (A.P. meeting audio tape Part 1, The Lab)', parallel: true },
                    { id: 'uh_ap_tape2', type: 'check', text: 'A.P.の役割について調べる (A.P. meeting audio tape Part 2, The Lab)', parallel: true },
                    { id: 'uh_ap_mention', type: 'check', text: 'The LabでA.P.に関する言及を探す' },
                    { id: 'uh_ap_room', type: 'check', text: 'Health ResortでA.P.の部屋を特定する' },
                    { id: 'uh_guard_note', type: 'check', text: 'A.P.が割り当てられた部屋を調べる (Guard post note)', optional: true },
                    { id: 'uh_ap_key', type: 'check', text: 'A.P.の個人的な持ち物を入手する (TerraGroup corporate apartment key)' },
                    { id: 'uh_ap_flash', type: 'check', text: 'A.P.のデータストレージデバイスを入手する (Sliderkey flash drive marked with A.P.)' }
                ]
            },
            {
                id: 'uh_p5',
                title: 'Phase 5: 復号化',
                steps: [
                    { id: 'uh_decrypt', type: 'check', text: 'A.P.の部屋から見つけたフラッシュドライブを復号化する' },
                    { id: 'uh_ask_mechanic', type: 'check', text: 'Mechanicに相談する' },
                    { id: 'uh_pay_mechanic', type: 'check', text: 'Mechanicに5,000,000ルーブルを支払う', parallel: true },
                    { id: 'uh_give_flash', type: 'check', text: 'MechanicにA.P.のフラッシュドライブを渡す', parallel: true },
                    { id: 'uh_wait_elektronik', type: 'wait', text: 'Elektronikからの連絡を待つ', duration: '12〜24時間 (Mr. Kermanと接触済みの場合は3時間)' }
                ]
            },
            {
                id: 'uh_p6',
                title: 'Phase 6: A.P.のアパート (Streets)',
                steps: [
                    { id: 'uh_reprogram_card', type: 'check', text: 'Intel CenterでA.P.のフラッシュドライブのデータをTerraGroupキーカードに統合する (Reprogrammed keycard Green)' },
                    { id: 'uh_ap_apt_access', type: 'check', text: 'A.P.の企業アパートにアクセスする (Streets, Cardinal Apts)' },
                    { id: 'uh_ap_apt_search', type: 'check', text: 'A.P.のアパートを調査する' },
                    { id: 'uh_ap_hidden', type: 'check', text: 'A.P.のアパートの隠し部屋に入る (リプログラムされたキーカードを使用)' },
                    { id: 'uh_tg_order', type: 'check', text: 'TerraGroupの文書を調べる (Order from TG Worldwide HQ)', parallel: true },
                    { id: 'uh_blue_ice_role', type: 'check', text: 'Blue Ice触媒のThe Unheardプロトコルでの役割を調べる (Copy of report for TG Worldwide)', parallel: true },
                    { id: 'uh_protocol', type: 'check', text: 'The Unheardのプロトコルについて調べる (Document mentioning a protocol)', parallel: true },
                    { id: 'uh_warden', type: 'check', text: 'The UnheardとTarkovの関係を解明する (Document mentioning the Warden)', parallel: true },
                    { id: 'uh_achievement', type: 'note', text: '実績「Trail of Breadcrumbs」解除' }
                ]
            }
        ]
    },
    {
        id: 'blue_fire',
        title: 'Blue Fire',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Blue_Fire',
        description: '謎のEMP兵器と青い閃光の正体を追う。',
        category: 'side',
        unlockCondition: 'WoodsまたはInterchangeで「EMERCOM leaflet」を読む、またはThe Labyrinthで「Note by Item #1156」を発見',
        phases: [
            {
                id: 'bf_p1',
                title: 'Phase 1: 初期調査',
                steps: [
                    { id: 'bf_talk_mechanic', type: 'check', text: 'MechanicとEMPについて話す' },
                    { id: 'bf_mechanic_access', type: 'check', text: 'Mechanicへのアクセスを確保する', optional: true }
                ]
            },
            {
                id: 'bf_p2',
                title: 'Phase 2: デバイス破片の回収',
                steps: [
                    { id: 'bf_find_fragment', type: 'check', text: 'デバイスの破片を見つけて入手する (Unknown device fragment, FIR。Streets: LexOs閉鎖エリア or Chekannaya 13 marked room)' },
                    { id: 'bf_give_fragment', type: 'check', text: 'Mechanicにデバイスの破片を渡す' }
                ]
            },
            {
                id: 'bf_p3',
                title: 'Phase 3: Labハッキング',
                steps: [
                    { id: 'bf_hack_lab', type: 'check', text: 'The Labのサーバールームにハッキングデバイスを設置する (Mechanicからメールで受け取る)' },
                    { id: 'bf_talk_mechanic_2', type: 'check', text: 'Mechanicと話す' }
                ]
            },
            {
                id: 'bf_p4',
                title: 'Phase 4: 破片の選択',
                steps: [
                    {
                        id: 'bf_fragment_choice',
                        type: 'choice',
                        text: 'Item 1156の破片をどうする？',
                        options: [
                            { value: 'keep', label: '自分の手元に残す (実績「Better Served」)' },
                            { value: 'give', label: 'Mechanicに渡す (報酬: 1,500,000ルーブル)' }
                        ]
                    }
                ]
            },
            {
                id: 'bf_p5',
                title: 'Phase 5: Item 1156のリード',
                steps: [
                    { id: 'bf_item1156_clue', type: 'check', text: 'Item 1156に関する手がかりを見つける (Note mentioning Item #1156, FIR。Ground Zero Lv21+ / Lighthouse / The Lab)' }
                ]
            },
            {
                id: 'bf_p6',
                title: 'Phase 6: Rus Post調査',
                steps: [
                    { id: 'bf_rus_post', type: 'check', text: 'StreetsのRus Post郵便局を調査する (Audio recorder必要。テープ3本を入手して聴く)' },
                    { id: 'bf_rus_car', type: 'check', text: 'Rus Post Carを見つける (Rus Post car key必要、毎レイド車の右後輪横にスポーン)' },
                    { id: 'bf_spec', type: 'check', text: 'Item 1156の設計図を入手する (Item #1156 specification, FIR)' },
                    { id: 'bf_achievement', type: 'note', text: '実績「Inferno」解除' }
                ]
            }
        ]
    },
    {
        id: 'they_are_already_here',
        title: 'They Are Already Here',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/They_Are_Already_Here',
        description: 'カルトの儀式「Eye of the World」と、彼らの予言について調査する。',
        category: 'side',
        unlockCondition: 'マークされた部屋(Customs寮314 / Reserve RB-BK,RB-VO,RB-PKPM / Woods北の村 / Shorelineの島)で「Note about the Eye of the World」を発見',
        phases: [
            {
                id: 'th_p1',
                title: 'Phase 1: カルトの調査',
                steps: [
                    { id: 'th_investigate', type: 'check', text: 'フードを被った者たちについて調べる' },
                    { id: 'th_locate_eow', type: 'check', text: 'Eye of the Worldに関連する場所を特定する' },
                    { id: 'th_torture_tape', type: 'check', text: '拷問部屋でカルトの被害者について調べる (Cult victim audio tape #2, FIR。Lighthouse: Cultist\'s torture house)' }
                ]
            },
            {
                id: 'th_p2',
                title: 'Phase 2: 被害者のアパート (Streets)',
                steps: [
                    { id: 'th_victim_apt', type: 'check', text: 'カルトの被害者のアパートを特定する (Cult victim\'s apartment key必要、Streets: Klimovショッピングモール裏)' },
                    { id: 'th_apt_key', type: 'check', text: 'アパートの鍵を入手する', optional: true },
                    { id: 'th_apt_breach', type: 'check', text: 'アパートを調査する (ドアをブリーチ)' },
                    { id: 'th_victim_tape1', type: 'check', text: '被害者の最初のオーディオテープを入手する (Cult victim audio tape #1, FIR。Book of the ArrivalとNote on preparations for the Arrivalも回収)' }
                ]
            },
            {
                id: 'th_p3',
                title: 'Phase 3: Mechanic相談',
                steps: [
                    { id: 'th_ask_mechanic', type: 'check', text: 'MechanicにEye of the Worldについて相談する' },
                    { id: 'th_mechanic_access', type: 'check', text: 'Mechanicへのアクセスを確保する', optional: true }
                ]
            },
            {
                id: 'th_p4',
                title: 'Phase 4: Cultist Priest排除',
                steps: [
                    { id: 'th_kill_priest', type: 'check', text: 'Cultist Priestを見つけて排除する' }
                ]
            },
            {
                id: 'th_p5',
                title: 'Phase 5: 情報収集',
                steps: [
                    { id: 'th_priest_note', type: 'check', text: 'Eye of the Worldに関する追加情報を入手する (Cultist priest\'s note, FIR。Customs/Streets/Reserveのmarked rooms)' },
                    { id: 'th_spawn_note', type: 'note', text: 'このアイテムは前のステップ完了後にスポーンする' }
                ]
            },
            {
                id: 'th_p6',
                title: 'Phase 6: Eye of the World各地調査',
                steps: [
                    { id: 'th_lh_eow', type: 'check', text: 'LighthouseのEye of the World地点を特定する', parallel: true },
                    { id: 'th_chalet_room', type: 'check', text: 'Chaletのカルト部屋を調査する (Victim\'s note入手)', parallel: true },
                    { id: 'th_victim_items', type: 'check', text: '被害者の持ち物を見つける', optional: true },
                    { id: 'th_station_key', type: 'check', text: '被害者のメモに記載された鍵を入手する (Station 14-4 KORD Arshavin K. pass (Damaged)、Chalet前のATV上)' },
                    { id: 'th_woods_eow', type: 'check', text: 'WoodsのEye of the World地点を特定する', parallel: true },
                    { id: 'th_woods_cult', type: 'check', text: 'Woodsのカルトの家を調査する (Newspaper clipping, FIR)', parallel: true },
                    { id: 'th_shore_eow', type: 'check', text: 'ShorelineのEye of the World地点を特定する', parallel: true },
                    { id: 'th_sordi_tower', type: 'check', text: 'Sordi通信塔周辺を調査する (Programmer\'s note, FIR)', parallel: true },
                    { id: 'th_repair_tower', type: 'check', text: 'Sordi塔を修理する (Toolset消費)' }
                ]
            },
            {
                id: 'th_p7',
                title: 'Phase 7: Station準備',
                steps: [
                    { id: 'th_ask_mechanic_station', type: 'check', text: 'MechanicにStation 14-4 KORDについて相談する' },
                    { id: 'th_repair_keycard', type: 'check', text: 'ArshavinのキーカードをIntel Center Lv1で修復する (Craft、電力継続必要)' }
                ]
            },
            {
                id: 'th_p8',
                title: 'Phase 8: ARRS Station 初回訪問 (Interchange)',
                steps: [
                    { id: 'th_arrs_access', type: 'check', text: 'NGO Cobaltの秘密施設にアクセスする (Interchange パワーステーション地下、修復キーカード使用)' },
                    { id: 'th_arrs_power', type: 'check', text: 'ステーションの電力を復旧する (入口横のパネルにキーカードをスワイプ)' },
                    { id: 'th_arrs_cooling', type: 'check', text: 'サーバールームの冷却システムを起動する (格子ドア奥のレバー)' },
                    { id: 'th_arrs_flash', type: 'check', text: 'フラッシュドライブを設置してデータをダウンロードする (冷却レバー横にSecure Flash driveを配置)' },
                    { id: 'th_arrs_search', type: 'check', text: 'ARRS Station 14-4 KORDを徹底調査する (Mysterious audio tape, FIR。冷却起動後に開く入口横の金庫)' },
                    { id: 'th_arrs_extract', type: 'check', text: 'Interchangeから生存脱出する' }
                ]
            },
            {
                id: 'th_p9',
                title: 'Phase 9: ARRS Station 再訪問 (Interchange)',
                steps: [
                    { id: 'th_arrs_disconnect', type: 'check', text: 'ステーションを外部エージェントから切断する方法を見つける (ARRS station mechanic\'s notes, FIR)' },
                    { id: 'th_arrs_restore', type: 'check', text: 'ARRSステーションをバックアップ設定に復元する (電力を入れ直し、サーバールームのテーブル下のボタンを押す。1レイドで1プレイヤーのみ)' },
                    { id: 'th_arrs_power_check', type: 'check', text: 'ステーションの電源が入っていることを確認する', optional: true },
                    { id: 'th_arrs_recover_flash', type: 'check', text: 'ARRSステーションからフラッシュドライブを回収する (Flash drive for ARRS station, FIR)' },
                    { id: 'th_arrs_warning', type: 'note', text: '⚠️ 「バックアップ設定に復元」を先に完了してからフラッシュドライブを回収すること(Saviorエンドルートに必要)' },
                    { id: 'th_arrs_extract_2', type: 'check', text: 'Interchangeから生存脱出する' }
                ]
            },
            {
                id: 'th_p10',
                title: 'Phase 10: 結末',
                steps: [
                    { id: 'th_give_flash', type: 'check', text: 'Mechanicにデータ入りフラッシュドライブを渡す' },
                    { id: 'th_read_spec', type: 'check', text: 'ARRSステーションの仕様書を読む (ARRS system specifications)' },
                    { id: 'th_achievement', type: 'note', text: '実績「Through Another\'s Eyes」「When the Light Fades」解除' }
                ]
            }
        ]
    },
    {
        id: 'accidental_witness',
        title: 'Accidental Witness',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Accidental_Witness',
        description: 'ある債務者の失踪から始まる、汚職と裏切りの物語。',
        category: 'side',
        unlockCondition: 'Customs寮の中庭にある車に書かれたメッセージを発見',
        phases: [
            {
                id: 'aw_p1',
                title: 'Phase 1: Kozlovの調査 (Customs)',
                steps: [
                    { id: 'aw_kozlov_locate', type: 'check', text: 'Kozlovの住居を特定する' },
                    { id: 'aw_kozlov_note', type: 'check', text: 'Kozlovのドアのメモを読む (Note for Kozlov)' },
                    { id: 'aw_kozlov_involved', type: 'check', text: 'Kozlovが何に関わっていたか調べる' },
                    { id: 'aw_kozlov_room', type: 'check', text: 'Kozlovの部屋にアクセスする (Dorm room 110 key)', optional: true },
                    { id: 'aw_kozlov_key_info', type: 'check', text: 'Kozlovの鍵の入手方法を調べる (Note from the repair shop)', optional: true },
                    { id: 'aw_kozlov_room_search', type: 'check', text: 'Kozlovの部屋を調査する (Letter from Kozlov\'s room)', optional: true }
                ]
            },
            {
                id: 'aw_p2',
                title: 'Phase 2: Anastasiaの手がかり',
                steps: [
                    { id: 'aw_ask_anastasia', type: 'check', text: 'トレーダーにAnastasiaについて尋ねる (Skier)' }
                ]
            },
            {
                id: 'aw_p3',
                title: 'Phase 3: Skierの協力者のアパート (Streets)',
                steps: [
                    { id: 'aw_skier_apt', type: 'check', text: 'Skierの協力者のアパートにアクセスする (Zmeisky 3 apartment key、Streets)' },
                    { id: 'aw_apt_key', type: 'check', text: 'アパートの鍵を見つける', optional: true },
                    { id: 'aw_apt_investigate', type: 'check', text: 'Skierの協力者について調べる' },
                    { id: 'aw_apt_search', type: 'check', text: 'アパートを調査する', optional: true },
                    { id: 'aw_apt_docs', type: 'check', text: 'アパート内の文書を読む (The Ninth Circle Issue #19, Tarkov Herald summary, FSB report, The Ninth Circle Issue #14)' },
                    { id: 'aw_streets_extract', type: 'check', text: 'Streets of Tarkovから生存脱出する' }
                ]
            },
            {
                id: 'aw_p4',
                title: 'Phase 4: トレーダーへの報告',
                steps: [
                    { id: 'aw_report_skier', type: 'check', text: 'Skierに報告する' },
                    { id: 'aw_talk_ragman', type: 'check', text: 'Ragmanと話す' }
                ]
            },
            {
                id: 'aw_p5',
                title: 'Phase 5: Anastasiaのアパート (Streets)',
                steps: [
                    { id: 'aw_anastasia_apt', type: 'check', text: 'Anastasiaのアパートを特定する (Chekannaya 13、Streets 2階)' },
                    { id: 'aw_anastasia_info', type: 'check', text: 'Anastasiaについて調べる' },
                    { id: 'aw_anastasia_entrance', type: 'check', text: 'Anastasiaの建物の入口を調査する (Letter from the mailbox, Tarkov Herald newspaper回収)' }
                ]
            },
            {
                id: 'aw_p6',
                title: 'Phase 6: 配達員Pasha (Customs)',
                steps: [
                    { id: 'aw_find_pasha', type: 'check', text: '配達員Pashaを見つける' },
                    { id: 'aw_ambush_search', type: 'check', text: '待ち伏せ地点を捜索する (Unsealed envelope, FIR。Customs寮裏の自転車付近)' }
                ]
            },
            {
                id: 'aw_p7',
                title: 'Phase 7: 報告とReshala',
                steps: [
                    { id: 'aw_report_skier_2', type: 'check', text: 'Skierに報告する' },
                    { id: 'aw_reshala_hideout', type: 'check', text: 'Reshalaの隠れ家を見つける (Customs、Reshala\'s bunkhouse key必要)' },
                    { id: 'aw_kill_reshala', type: 'check', text: 'Reshalaを見つけて排除する', optional: true },
                    { id: 'aw_reshala_key', type: 'check', text: 'Reshalaの隠れ家の鍵を入手する', optional: true },
                    { id: 'aw_reshala_search', type: 'check', text: 'Reshalaの隠れ家を調査する (Note with an address, FIR)' },
                    { id: 'aw_reshala_work_note', type: 'check', text: 'Reshalaの仕事メモを入手する (Note with a warning)', optional: true },
                    { id: 'aw_pasha_items', type: 'check', text: '配達員Pashaの持ち物を入手する (Letter from Reshala\'s bunkhouse)', optional: true }
                ]
            },
            {
                id: 'aw_p8',
                title: 'Phase 8: Kozlovの証拠 (Shoreline)',
                steps: [
                    { id: 'aw_kozlov_hideout', type: 'check', text: 'Kozlovの隠れ家を特定する (Shoreline西の村、house no. 3)' },
                    { id: 'aw_kozlov_evidence', type: 'check', text: 'Kozlovの証拠を入手する (Audio tape with incriminating evidence, FIR。入口横の花壇)' },
                    { id: 'aw_anastasia_photo', type: 'check', text: 'Anastasiaの写真付き新聞記事を入手する', optional: true }
                ]
            }
        ]
    },
    {
        id: 'the_labyrinth',
        title: 'The Labyrinth',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Labyrinth_(story_chapter)',
        description: 'TerraGroupの地下施設「The Labyrinth」への侵入と探索。',
        category: 'side',
        unlockCondition: 'ShorelineでThe Labyrinthへのトランジットを発見 (Health Resort西館地下、Knossos LLC facility key必要)',
        phases: [
            {
                id: 'tl_p1',
                title: 'Phase 1: 初期連絡',
                steps: [
                    { id: 'tl_ask_jaeger', type: 'check', text: 'トレーダーに地下施設について尋ねる (Jaegerと話す)' },
                    { id: 'tl_ask_therapist', type: 'check', text: 'Therapistに地下施設へのアクセス方法を聞く', optional: true }
                ]
            },
            {
                id: 'tl_p2',
                title: 'Phase 2: キーカード待ち',
                steps: [
                    { id: 'tl_wait_keycard', type: 'wait', text: 'Jaegerがキーカードを集めるのを待つ (待機後、JaegerにLabyrinthについて聞く。Labrys access keycardがメールで届く)', duration: '24〜48時間' }
                ]
            },
            {
                id: 'tl_p3',
                title: 'Phase 3: 施設調査 — BEAR部隊',
                steps: [
                    { id: 'tl_bear_fate', type: 'check', text: 'BEAR部隊に何が起きたか解明する' },
                    { id: 'tl_find_entrance', type: 'check', text: 'Health Resort地下の施設入口を見つける (Shoreline西館地下)', optional: true },
                    { id: 'tl_access_facility', type: 'check', text: '施設にアクセスする (Labrys keycard使用)', optional: true },
                    { id: 'tl_bear_traces', type: 'check', text: 'The Labyrinth内でBEAR部隊の痕跡を見つける (Leshy\'s orders, FIR。チャンバー2前)', optional: true },
                    { id: 'tl_item1156_area', type: 'check', text: 'Item 1156でBEAR部隊の再集結地点を調査する (プロトタイプ武器エリア)', optional: true },
                    { id: 'tl_find_commander', type: 'check', text: '部隊長を見つける (拷問部屋)', optional: true },
                    { id: 'tl_bear_diary', type: 'check', text: '部隊に関する追加情報を集める (Leshy\'s diary, FIR。部隊長横)', optional: true },
                    { id: 'tl_5_bodies', type: 'check', text: '5人の研究員の遺体を調査する (各遺体のノート5つ。ノート#4にはObservation room key必要)', optional: true },
                    { id: 'tl_locked_office', type: 'check', text: 'ロックされたオフィスにアクセスする (Observation room key必要)', optional: true }
                ]
            },
            {
                id: 'tl_p4',
                title: 'Phase 4: オーディオテープ',
                steps: [
                    { id: 'tl_listen_tape', type: 'check', text: 'オフィスのオーディオテープを聴く (Deceased scientist\'s audio tape, FIR。Observation room内)' },
                    { id: 'tl_give_tape', type: 'check', text: 'Jaegerにオーディオテープを渡す' }
                ]
            },
            {
                id: 'tl_p5',
                title: 'Phase 5: 研究レポート',
                steps: [
                    { id: 'tl_read_report', type: 'check', text: 'Labyrinth施設の研究レポートを入手して読む' },
                    { id: 'tl_find_report', type: 'check', text: 'Labyrinth施設の研究レポートを見つけて入手する (Labyrinth facility research report, FIR。Shorelineの桟橋横の排水管)', optional: true },
                    { id: 'tl_achievement', type: 'note', text: '実績「Theseus」解除' }
                ]
            }
        ]
    }
];
