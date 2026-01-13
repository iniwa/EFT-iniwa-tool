// js/story_data.js

const STORY_CHAPTERS = [
    {
        id: 'tour',
        title: 'Tour',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Tour',
        description: 'Escape from Tarkovの主要なストーリーライン。各マップへのアクセス権を確保しながら、Tarkovからの脱出方法を探る旅。',
        steps: [
            { id: 't_gz_esc', type: 'check', text: 'Ground Zeroから脱出する' },
            { id: 't_talk_therapist', type: 'check', text: 'Therapistと話す', parallel: true },
            { id: 't_pay_therapist', type: 'check', text: 'Therapistに250,000ルーブルを渡す (Streets of Tarkovへのアクセス確保)', parallel: true },
            { id: 't_talk_ragman', type: 'check', text: 'Ragmanと話す' },
            { id: 't_interchange_esc', type: 'check', text: 'Interchangeから生存して脱出する', parallel: true },
            { id: 't_report_ragman', type: 'check', text: '偵察で見つけたものをRagmanに報告する', parallel: true },
            
            { id: 't_talk_skier', type: 'check', text: 'Skierと話す' },
            { id: 't_customs_esc', type: 'check', text: 'Customsから生存して脱出する', parallel: true },
            { id: 't_handover_mat', type: 'check', text: 'Skierに「Building materials」カテゴリのアイテム(FIR)を5つ渡す', parallel: true },
            
            { id: 't_talk_mechanic', type: 'check', text: 'Mechanicと話す' },
            { id: 't_factory_esc', type: 'check', text: 'Factoryから生存して脱出する', parallel: true },
            { id: 't_handover_wep', type: 'check', text: 'Mechanicに武器(FIR)を2つ渡す', parallel: true },
            
            { id: 't_talk_skier_2', type: 'check', text: 'Skierと話す' },
            { id: 't_woods_kill', type: 'check', text: 'Woodsでターゲットを3人排除する', parallel: true },
            { id: 't_woods_esc', type: 'check', text: 'Woodsから生存して脱出する', parallel: true },
            
            { id: 't_find_terminal', type: 'check', text: 'Port Terminalへの入り口を特定する (Shoreline南東)' },
            { id: 't_contact_method', type: 'check', text: 'Terminalの兵士と連絡を取る方法を見つける', parallel: true },
            { id: 't_use_intercom', type: 'check', text: 'インターコムを使用して港の守備隊に連絡する', parallel: true },
            { id: 't_learn_escape', type: 'check', text: 'Tarkovからの脱出方法について話を聞く' },
            { id: 't_pay_mechanic', type: 'check', text: 'Mechanicに20,000ドルを渡す (Lighthouseへのアクセス確保)' },
            { id: 't_pay_prapor', type: 'check', text: 'PraporにPMCドッグタグ(Lv不問)を5つ渡す (Reserveへのアクセス確保)' },
            { id: 't_shoreline_esc', type: 'check', text: 'Shorelineから生存して脱出する' },
            { id: 't_enter_lab', type: 'check', text: 'TerraGroupの秘密施設に侵入する (StreetsまたはFactoryからTransitを利用)' },
            
            { id: 't_lab_drainage', type: 'check', text: 'The Lab: 排水システム(Drainage)を通る脱出ルートを特定する', parallel: true },
            { id: 't_lab_server', type: 'check', text: 'The Lab: サーバールーム(Server Room)を探索する', parallel: true },
            { id: 't_lab_office', type: 'check', text: 'The Lab: 管理オフィス(Top Management Offices)を探索する', parallel: true },
            
            { id: 't_end', type: 'note', text: 'このチャプターを完了すると、実績「Pathfinder」が解除され、次のストーリーへの分岐が発生します。' }
        ]
    },
    {
        id: 'falling_skies',
        title: 'Falling Skies',
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Falling_Skies',
        description: '墜落した謎の飛行機と、それに関わる陰謀を追うチャプター。',
        steps: [
            { id: 'fs_find_plane', type: 'check', text: 'Woodsで墜落した飛行機を発見する (Prapor LL2以上が必要)' },
            { id: 'fs_ask_traders', type: 'check', text: 'トレーダーたちに墜落機について尋ねる' },
            { id: 'fs_info_therapist', type: 'check', text: 'Therapistから情報を得る (2,000ドル支払うとG-Wagonの場所を教えてくれる)', parallel: true },
            { id: 'fs_gwagon_drive', type: 'check', text: 'ShorelineのG-Wagon SUV(トンネル脱出付近)からフラッシュドライブを回収する', parallel: true },
            { id: 'fs_handover_drive', type: 'check', text: 'Praporにフラッシュドライブを渡す' },
            { id: 'fs_wait_prapor', type: 'note', text: 'Praporからの連絡を待つ (約1時間)' },
            { id: 'fs_flight_recorder', type: 'check', text: 'Woodsの墜落機からフライトレコーダーを回収する' },
            { id: 'fs_stash_recorder', type: 'check', text: 'Shorelineの小島(Scav Island)にある廃屋にフライトレコーダーを隠す' },
            { id: 'fs_visit_prapor', type: 'check', text: 'Praporを訪ね、要求されたアイテムを渡す (Toolset x2, RecBat x3, PCB x5)' },
            { id: 'fs_transcript', type: 'check', text: 'Shorelineの村の家(Chairman\'s House)で「Flight crew\'s transcript」を見つけ、渡す', parallel: true },
            { id: 'fs_elektronik', type: 'check', text: '同所にて「Elektronik\'s secure flash drive」を見つけ、渡す', parallel: true },
            { id: 'fs_wait_prapor_2', type: 'check', text: 'Praporからの連絡を待ち、質問に答える (真実を伝えると報酬アップ)' },
            { id: 'fs_armored_case', type: 'check', text: 'Woodsの墜落機(パイロット席後ろ)から「Armored case」を回収する' },
            { 
                id: 'fs_choice', 
                type: 'choice', 
                text: 'Armored Caseの処遇を選択', 
                options: [
                    { value: 'give', label: 'Praporに渡す (報酬大、TicketはPraporルートへ)' },
                    { value: 'keep', label: '自分の手元に残す (実績解除、TicketはMechanicルートへ)' }
                ]
            },
            { id: 'fs_end_give', type: 'note', text: 'Praporにケースを渡しました。次のチャプター「The Ticket」へ進みます。', showIf: { stepId: 'fs_choice', value: 'give'} },
            { id: 'fs_end_keep', type: 'note', text: 'ケースを確保しました。次のチャプター「The Ticket」へ進みます。', showIf: { stepId: 'fs_choice', value: 'keep'} }
        ]
    },
    { 
        id: 'the_ticket', 
        title: 'The Ticket', 
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Ticket',
        description: 'Armored Caseの謎を解き明かし、LightkeeperやMechanicと協力して真実に迫る。', 
        steps: [
            { 
                id: 'tt_start_choice', 
                type: 'choice', 
                text: '前のチャプター(Falling Skies)での選択は？', 
                options: [
                    { value: 'gave', label: 'Praporにケースを渡した' },
                    { value: 'kept', label: 'ケースを確保した (Mechanicルート)' }
                ]
            },
            // --- Prapor Route ---
            { id: 'tt_p_intel', type: 'check', text: 'HideoutにIntelligence Center Level 1を設置する', showIf: { stepId: 'tt_start_choice', value: 'gave'} },
            { id: 'tt_p_talk_kerman', type: 'check', text: 'Mr. Kermanと話す', showIf: { stepId: 'tt_start_choice', value: 'gave'} },
            { id: 'tt_p_lh_camp', type: 'check', text: 'LighthouseにあるPraporの部下のキャンプ(灯台対岸)を捜索し、メモを見つける', showIf: { stepId: 'tt_start_choice', value: 'gave'} },
            { id: 'tt_p_talk_lk', type: 'check', text: 'Lightkeeperへのアクセス権を得て、彼と話す', showIf: { stepId: 'tt_start_choice', value: 'gave'} },
            { id: 'tt_p_blue_folder', type: 'check', text: '「Blue Folders」materials x3 をLightkeeperに渡す', showIf: { stepId: 'tt_start_choice', value: 'gave'} },
            { id: 'tt_p_flare', type: 'check', text: 'InterchangeのULTRA正面入口で黄色フレアを打ち上げる', showIf: { stepId: 'tt_start_choice', value: 'gave'} },
            { id: 'tt_p_kill', type: 'check', text: 'Interchangeで敵を15人排除する (1レイド内で達成する必要あり)', showIf: { stepId: 'tt_start_choice', value: 'gave'} },
            { id: 'tt_p_unlock', type: 'check', text: 'Lightkeeperと話し、Armored caseを受け取る', showIf: { stepId: 'tt_start_choice', value: 'gave'} },

            // --- Mechanic Route ---
            { id: 'tt_m_intel', type: 'check', text: 'HideoutにIntelligence Center Level 1を設置する', showIf: { stepId: 'tt_start_choice', value: 'kept'} },
            { id: 'tt_m_talk_kerman', type: 'check', text: 'Mr. Kermanと話す', showIf: { stepId: 'tt_start_choice', value: 'kept'} },
            { id: 'tt_m_talk_mech', type: 'check', text: 'Mechanicに相談する', showIf: { stepId: 'tt_start_choice', value: 'kept'} },
            { id: 'tt_m_lab_jammer', type: 'check', text: 'The Labで「Experimental signal jammer」を見つける', showIf: { stepId: 'tt_start_choice', value: 'kept'} },
            { id: 'tt_m_unlock', type: 'check', text: 'Workbench Lv1でケースを開封し、「Ticket」を入手する', showIf: { stepId: 'tt_start_choice', value: 'kept'} },
            { id: 'tt_m_rfid_enc', type: 'check', text: 'Streets of Tarkov (Klimov 14A) で「RFID card encryption device」を入手', showIf: { stepId: 'tt_start_choice', value: 'kept'} },
            { id: 'tt_m_lab_pass', type: 'check', text: 'The Lab (Kruglov\'s office) 等で「Master Keycard」を入手', showIf: { stepId: 'tt_start_choice', value: 'kept'} },
            { id: 'tt_m_activate', type: 'check', text: 'Intel CenterでRFIDカードを有効化(Craft)する', showIf: { stepId: 'tt_start_choice', value: 'kept'} },

            // --- Common Ending ---
            { id: 'tt_terminal', type: 'check', text: 'ShorelineのTerminal入口へ行き、インターコムでカードを使用する' },
            { 
                id: 'tt_end_choice', 
                type: 'choice', 
                text: 'Mr. Kermanとの協力関係は？', 
                options: [
                    { value: 'savior', label: '協力する (証拠集めルート)' },
                    { value: 'fallen', label: '拒否する (Praporに大金を払うルート)' }
                ]
            },
            { id: 'tt_savior_task', type: 'check', text: '各地の証拠品(Evidence)を8つ集めてKermanに送る', showIf: { stepId: 'tt_end_choice', value: 'savior'} }
        ]
    },
    { 
        id: 'batya', 
        title: 'Batya', 
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Batya',
        description: 'BEAR特殊部隊「Bogatyr」の行方を追う。', 
        steps: [
            { id: 'ba_find_trace', type: 'check', text: 'Customs, Reserve, Shoreline, WoodsのいずれかでBEAR部隊の痕跡(Bogatyr patch)を見つける' },
            { id: 'ba_talk_jaeger', type: 'check', text: 'Jaegerと話し、Bogatyr部隊について聞く' },
            { id: 'ba_loc_ryabina', type: 'check', text: 'WoodsのRyabina Outpost (スナイパーロック付近) を特定する', parallel: true },
            { id: 'ba_loc_carousel', type: 'check', text: 'InterchangeのCarousel Outpost (IDEA店舗内) を特定する', parallel: true },
            { id: 'ba_loc_gnezdo', type: 'check', text: 'InterchangeのGnezdo Outpost (西側の森) を特定する', parallel: true },
            { id: 'ba_items', type: 'check', text: '各拠点で部隊の遺留品(Personal files, Tapes等)を回収する', parallel: true },
            { id: 'ba_woods_ambush', type: 'check', text: 'Woodsの待ち伏せ地点(ZB-016近く)でMoremanの遺体と電話を見つける' },
            { id: 'ba_craft_tape', type: 'check', text: 'Workbenchで回収したテープを修復・解析する' },
            { id: 'ba_visit_lk', type: 'check', text: 'Lightkeeperを訪ね、回収した遺留品5つを渡す' },
            { id: 'ba_prove', type: 'check', text: 'Voevodaからの試練を達成する (死なずにPMC4キル、死なずに15キル等)' },
            { id: 'ba_contact', type: 'check', text: 'Voevodaと連絡を取る' },
            { id: 'ba_lh_camp', type: 'check', text: 'LighthouseのBEARキャンプで裏切り者の証拠(Praporへのメモ)を見つける' },
            { id: 'ba_interrogate', type: 'check', text: 'Praporを尋問する' },
            { id: 'ba_cultist', type: 'check', text: '各マップ(Customs/Reserve/Woods/Shoreline)のカルティストサークルを調査する' },
            { id: 'ba_talk_lk_end', type: 'check', text: 'Lightkeeperと話し、Unheardに関する書類を受け取る(24時間後)' }
        ]
    },
    { 
        id: 'the_unheard', 
        title: 'The Unheard', 
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Unheard',
        description: 'TerraGroupとカルト集団「The Unheard」の関係を調査する。', 
        steps: [
            { id: 'uh_read_note', type: 'check', text: 'StreetsまたはGround Zeroで「Note with ramblings about the Purification」を見つけて読む' },
            { id: 'uh_lab_docs', type: 'check', text: 'The Labで2つの文書(Changes in lab, Cargo fax)を見つける' },
            { id: 'uh_factory_log', type: 'check', text: 'Factoryの医療テント付近で「Transport log」を見つける' },
            { id: 'uh_streets_car', type: 'check', text: 'Streets of Tarkov (LexOS付近) のSUVからHDDを回収する' },
            { id: 'uh_craft_printout', type: 'check', text: 'Intel CenterでHDDのデータをプリントアウトする' },
            { id: 'uh_factory_blueice', type: 'check', text: 'Factoryの保管部屋(鍵が必要)でBlue Iceの研究データを見つける' },
            { id: 'uh_lab_role', type: 'check', text: 'The LabでA.P.の痕跡(ホワイトボードとテープ)を見つける' },
            { id: 'uh_shoreline_room', type: 'check', text: 'Shorelineリゾート東館305号室(A.P.の部屋)を捜索し、USBを回収する' },
            { id: 'uh_decrypt', type: 'check', text: 'Intel CenterでUSBを復号化する' },
            { id: 'uh_pay_mech', type: 'check', text: 'Mechanicに復号化したデータを渡し、5,000,000ルーブルを支払う' },
            { id: 'uh_craft_card', type: 'check', text: 'Intel Centerで「Reprogrammed keycard (Green)」を作成する' },
            { id: 'uh_streets_hidden', type: 'check', text: 'Streets (Cardinal Apts) の隠し部屋に入り、書類を回収する' }
        ]
    },
    { 
        id: 'blue_fire', 
        title: 'Blue Fire', 
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Blue_Fire',
        description: '謎のEMP兵器と青い閃光の正体を追う。', 
        steps: [
            { id: 'bf_leaflet', type: 'check', text: 'WoodsまたはInterchangeで「EMERCOM leaflet」を見つけて読む' },
            { id: 'bf_talk_mech', type: 'check', text: 'MechanicとEMPについて話す' },
            { id: 'bf_fragment', type: 'check', text: 'Streets (Chek 13 または LexOS) で謎のデバイスの破片を見つける' },
            { id: 'bf_plant', type: 'check', text: 'Mechanicからハッキングデバイスを受け取り、The Labのサーバールームに設置する' },
            { id: 'bf_choice_frag', type: 'choice', text: 'デバイスの破片をどうする？', options: [{value:'give', label:'Mechanicに渡す'}, {value:'keep', label:'手元に残す'}] },
            { id: 'bf_lead_1156', type: 'check', text: 'Ground ZeroまたはThe Labで「Item 1156」に関する手がかりを見つける' },
            { id: 'bf_rus_post', type: 'check', text: 'Streetsの郵便局(Rus Post)でテープ3本を見つける' },
            { id: 'bf_rus_car', type: 'check', text: '郵便局前のバン(鍵が必要)から設計図(Item 1156 spec)を回収する' }
        ]
    },
    { 
        id: 'they_are_already_here', 
        title: 'They Are Already Here', 
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/They_Are_Already_Here',
        description: 'カルトの儀式「Eye of the World」と、彼らの予言について調査する。', 
        steps: [
            { id: 'th_read_note', type: 'check', text: 'マークされた場所(Customs寮/Reserve/Woods/Shoreline)で「Note about the Eye of the World」を読む' },
            { id: 'th_lh_house', type: 'check', text: 'Lighthouseの廃村にあるカルトの家を捜索する (Tape #2, Key入手)' },
            { id: 'th_streets_apt', type: 'check', text: 'Streets of Tarkov (Igor\'s apt) でTape #1と本を入手する' },
            { id: 'th_neutralize', type: 'check', text: 'Cultist Priestを2人排除する' },
            { id: 'th_eye_lh', type: 'check', text: 'Lighthouse (Chalet) の「Eye of the World」地点を特定する', parallel: true },
            { id: 'th_eye_woods', type: 'check', text: 'Woods (Cult village) の「Eye of the World」地点を特定する', parallel: true },
            { id: 'th_eye_sl', type: 'check', text: 'Shoreline (Radio tower) の「Eye of the World」地点を特定し、修理する', parallel: true },
            { id: 'th_talk_mech', type: 'check', text: 'Mechanicに報告する' },
            { id: 'th_craft_pass', type: 'check', text: 'Intel Centerで「Station 14-4 KORD pass」を修理(Craft)する' },
            { id: 'th_visit_144', type: 'check', text: 'Interchangeのパワーステーション地下(Station 14-4)に行き、パスを使う' },
            { id: 'th_extract', type: 'check', text: '一度脱出する' },
            { id: 'th_visit_144_2', type: 'check', text: '再度Station 14-4に行き、サーバールームでボタンを押しUSBを回収する' },
            { id: 'th_finish', type: 'check', text: 'MechanicにUSBを渡す' }
        ]
    },
    { 
        id: 'accidental_witness', 
        title: 'Accidental Witness', 
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Accidental_Witness',
        description: 'ある債務者の失踪から始まる、汚職と裏切りの物語。', 
        steps: [
            { id: 'aw_car_note', type: 'check', text: 'Customs寮の中庭にある車に残されたメッセージを読む' },
            { id: 'aw_room_110', type: 'check', text: 'Customs寮110号室でメモを読む' },
            { id: 'aw_talk_skier', type: 'check', text: 'Skierと話す' },
            { id: 'aw_streets_zmeisky', type: 'check', text: 'Streets (Zmeisky 3) のアパートを捜索し、書類を見つける' },
            { id: 'aw_talk_ragman', type: 'check', text: 'Ragmanと話す' },
            { id: 'aw_anastasia', type: 'check', text: 'Streets (Anastasia\'s apt) の郵便受けを調べる' },
            { id: 'aw_courier', type: 'check', text: 'Customs寮裏で配達員Pashaの痕跡(バイクと手紙)を見つける' },
            { id: 'aw_reshala_stash', type: 'check', text: 'Customs (Crackhouse外) のReshalaの隠し場所(要鍵)を捜索する' },
            { id: 'aw_kozlov', type: 'check', text: 'Shorelineの村でKozlovの隠れ家を特定し、外の植木鉢から証拠テープを回収する' }
        ]
    },
    { 
        id: 'the_labyrinth', 
        title: 'The Labyrinth', 
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Labyrinth_(story_chapter)',
        description: 'TerraGroupの地下施設「The Labyrinth」への侵入と探索。', 
        steps: [
            { id: 'tl_transit', type: 'check', text: 'Shorelineリゾート西館地下から「The Labyrinth」へのTransitを見つける' },
            { id: 'tl_enter', type: 'check', text: 'Labrys keycardを使用してThe Labyrinthに進入する' },
            { id: 'tl_chamber_1', type: 'check', text: 'Chamber 1 (Toxic Pool): 鍵を見つけ、ボタンを押してトラップを解除する', parallel: true },
            { id: 'tl_chamber_2', type: 'check', text: 'Chamber 2 (Steam): バルブハンドルを見つけ、パイプにセットして回す', parallel: true },
            { id: 'tl_chamber_3', type: 'check', text: 'Chamber 3 (Fire): ガスバーナーを見つけ、キャビネットのボタンを押す', parallel: true },
            { id: 'tl_chamber_4', type: 'check', text: 'Chamber 4 (Shotgun): 通路を這って進み、レバーを引く', parallel: true },
            { id: 'tl_chamber_5', type: 'check', text: 'Chamber 5 (Toxic Puddle): ガスバーナーでドアを開け、レバーを引く', parallel: true },
            { id: 'tl_bear_squad', type: 'check', text: 'BEAR部隊の痕跡を見つける' },
            { id: 'tl_office', type: 'check', text: 'ロックされたオフィスに入り、オーディオテープと研究レポートを回収する' },
            { id: 'tl_report', type: 'check', text: 'Jaegerにテープを渡す' }
        ]
    }
];