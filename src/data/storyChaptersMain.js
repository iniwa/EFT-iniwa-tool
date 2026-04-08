// メインストーリーチャプターデータ (Tour, Falling Skies, The Ticket)
export const MAIN_CHAPTERS = [
  // ============================================================
  // CHAPTER 1: TOUR
  // ============================================================
  {
    id: 'tour',
    title: 'Tour',
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Tour',
    description: 'Escape from Tarkovの主要ストーリーライン。各マップへのアクセス権を確保しながら、Tarkovからの脱出方法を探る旅。',
    category: 'main',
    unlockCondition: 'ゲーム開始時に自動追加',
    phases: [
      {
        id: 'tour_p1',
        title: 'Phase 1: Ground Zero脱出',
        steps: [
          {
            id: 't_gz_extract',
            type: 'check',
            text: 'Ground Zeroから脱出する (チュートリアル、Klimov Street extraction)',
          },
        ],
      },
      {
        id: 'tour_p2',
        title: 'Phase 2: Therapist — Streets of Tarkov',
        steps: [
          {
            id: 't_therapist_talk',
            type: 'check',
            text: 'Therapistと話す',
          },
          {
            id: 't_therapist_pay',
            type: 'check',
            text: 'Therapistに250,000ルーブルを渡す (SoTアクセス確保)',
          },
          {
            id: 't_therapist_money',
            type: 'check',
            text: '必要な250,000ルーブルを集める',
            optional: true,
          },
        ],
      },
      {
        id: 'tour_p3',
        title: 'Phase 3: Ragman — Interchange',
        steps: [
          {
            id: 't_ragman_talk',
            type: 'check',
            text: 'Ragmanと話す',
          },
          {
            id: 't_interchange_extract',
            type: 'check',
            text: 'Interchangeから生存脱出する (または3回訪問)',
          },
          {
            id: 't_ragman_report',
            type: 'check',
            text: '偵察で見つけたものをRagmanに報告する',
          },
        ],
      },
      {
        id: 'tour_p4',
        title: 'Phase 4: Skier — Customs',
        steps: [
          {
            id: 't_skier_talk1',
            type: 'check',
            text: 'Skierと話す',
          },
          {
            id: 't_customs_extract',
            type: 'check',
            text: 'Customsから生存脱出する (または3回訪問)',
          },
          {
            id: 't_skier_materials',
            type: 'check',
            text: 'Skierに「Building materials」カテゴリのアイテム(FIR)を5つ渡す',
          },
          {
            id: 't_find_materials',
            type: 'check',
            text: 'Building materialsカテゴリのアイテム(FIR)を5つ見つける',
            optional: true,
          },
        ],
      },
      {
        id: 'tour_p5',
        title: 'Phase 5: Mechanic — Factory',
        steps: [
          {
            id: 't_mechanic_talk1',
            type: 'check',
            text: 'Mechanicと話す',
          },
          {
            id: 't_factory_extract',
            type: 'check',
            text: 'Factoryから生存脱出する (または3回訪問)',
          },
          {
            id: 't_mechanic_weapons',
            type: 'check',
            text: 'Mechanicに武器(FIR)を2つ渡す',
          },
          {
            id: 't_find_weapons',
            type: 'check',
            text: '武器(FIR)を2つ見つける',
            optional: true,
          },
        ],
      },
      {
        id: 'tour_p6',
        title: 'Phase 6: Skier — Woods',
        steps: [
          {
            id: 't_skier_talk2',
            type: 'check',
            text: 'Skierと話す',
          },
          {
            id: 't_woods_kills',
            type: 'check',
            text: 'Woodsでターゲットを3人排除する',
          },
          {
            id: 't_woods_extract',
            type: 'check',
            text: 'Woodsから生存脱出する (または3回訪問)',
          },
        ],
      },
      {
        id: 'tour_p7',
        title: 'Phase 7: Terminal (Shoreline)',
        steps: [
          {
            id: 't_terminal_entrance',
            type: 'check',
            text: 'Port Terminalへの入り口を特定する (Shoreline南東)',
          },
          {
            id: 't_terminal_contact',
            type: 'check',
            text: 'Terminalの兵士と連絡を取る方法を見つける',
          },
          {
            id: 't_terminal_intercom',
            type: 'check',
            text: 'インターコムを使用して港の守備隊に連絡する',
          },
          {
            id: 't_terminal_info',
            type: 'check',
            text: 'Tarkovからの脱出方法について話を聞く',
          },
        ],
      },
      {
        id: 'tour_p8',
        title: 'Phase 8: マップアクセス確保',
        steps: [
          {
            id: 't_shoreline_extract',
            type: 'check',
            text: 'Shorelineから生存脱出する (または3回訪問)',
          },
          {
            id: 't_prapor_dogtags',
            type: 'check',
            text: 'PraporにPMCドッグタグを5つ渡す (Reserveアクセス確保、FIR不要)',
          },
          {
            id: 't_find_dogtags',
            type: 'check',
            text: 'PMCドッグタグ(FIR)を5つ見つける',
            optional: true,
          },
          {
            id: 't_mechanic_dollars',
            type: 'check',
            text: 'Mechanicに20,000ドルを渡す (Lighthouseアクセス確保)',
          },
          {
            id: 't_find_dollars',
            type: 'check',
            text: '必要な20,000ドルを集める',
            optional: true,
          },
        ],
      },
      {
        id: 'tour_p9',
        title: 'Phase 9: The Lab',
        steps: [
          {
            id: 't_lab_infiltrate',
            type: 'check',
            text: 'TerraGroupの秘密施設に侵入する (SoTまたはFactoryからTransit利用)',
          },
          {
            id: 't_lab_keycard',
            type: 'check',
            text: '施設に入るためのキーカードまたはアクセスコードを入手する',
            optional: true,
          },
          {
            id: 't_lab_factory_entrance',
            type: 'check',
            text: 'Factoryでの入り口を特定する',
            optional: true,
          },
          {
            id: 't_lab_streets_entrance',
            type: 'check',
            text: 'Streets of Tarkovでの入り口を特定する',
            optional: true,
          },
          {
            id: 't_lab_offices',
            type: 'check',
            text: 'The Lab: 管理オフィス(Top Management Offices)を探索する',
            parallel: true,
          },
          {
            id: 't_lab_server',
            type: 'check',
            text: 'The Lab: サーバールーム(Server Room)を探索する',
            parallel: true,
          },
          {
            id: 't_lab_drainage',
            type: 'check',
            text: 'The Lab: 排水システム(Drainage)を通る脱出ルートを特定する',
            parallel: true,
          },
          {
            id: 't_lab_pathfinder',
            type: 'note',
            text: 'Pathfinder実績解除。後続チャプターへの分岐発生。',
          },
        ],
      },
    ],
  },

  // ============================================================
  // CHAPTER 2: FALLING SKIES
  // ============================================================
  {
    id: 'falling_skies',
    title: 'Falling Skies',
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Falling_Skies',
    description: '墜落した謎の飛行機と、それに関わる陰謀を追うチャプター。',
    category: 'main',
    unlockCondition: 'Tour進行中にMechanicと墜落機について話すと解放',
    phases: [
      {
        id: 'fs_p1',
        title: 'Phase 1: 墜落機の発見',
        steps: [
          {
            id: 'fs_find_crash',
            type: 'check',
            text: 'Woodsで墜落した飛行機を発見する',
          },
        ],
      },
      {
        id: 'fs_p2',
        title: 'Phase 2: Praporへの報告',
        steps: [
          {
            id: 'fs_prapor_talk1',
            type: 'check',
            text: 'Praporと話す',
          },
        ],
      },
      {
        id: 'fs_p3',
        title: 'Phase 3: ロイヤリティ要件',
        steps: [
          {
            id: 'fs_prapor_ll2',
            type: 'check',
            text: 'Prapor LL2以上に到達する',
          },
          {
            id: 'fs_ll2_note',
            type: 'note',
            text: 'Prepare for Escape / The Unheard / Edge of Darkness版はスキップ',
          },
        ],
      },
      {
        id: 'fs_p4',
        title: 'Phase 4: トレーダー聞き込み',
        steps: [
          {
            id: 'fs_ask_traders',
            type: 'check',
            text: 'トレーダーたちに墜落機について尋ねる (Prapor, Therapist, Skier, Mechanic, Jaeger)',
          },
        ],
      },
      {
        id: 'fs_p5',
        title: 'Phase 5: SUVフラッシュドライブ',
        steps: [
          {
            id: 'fs_therapist_suv',
            type: 'check',
            text: 'Therapistに2,000ドルを渡してSUVの場所を教えてもらう',
            optional: true,
          },
          {
            id: 'fs_suv_flash',
            type: 'check',
            text: 'ShorelineのG-Wagon SUV(トンネル脱出付近)からフラッシュドライブを回収する',
          },
          {
            id: 'fs_flash_prapor',
            type: 'check',
            text: 'Praporにフラッシュドライブを渡す',
          },
        ],
      },
      {
        id: 'fs_p6',
        title: 'Phase 6: Prapor待ち (1)',
        steps: [
          {
            id: 'fs_wait1',
            type: 'wait',
            text: 'Praporからの連絡を待つ',
            duration: '約1時間',
          },
        ],
      },
      {
        id: 'fs_p7',
        title: 'Phase 7: フライトレコーダー',
        steps: [
          {
            id: 'fs_flight_recorder',
            type: 'check',
            text: 'Woodsの墜落機からフライトレコーダーを回収する',
          },
          {
            id: 'fs_hide_recorder',
            type: 'check',
            text: 'Shorelineの小島(Scav Island)の廃屋にフライトレコーダーを隠す',
          },
        ],
      },
      {
        id: 'fs_p8',
        title: 'Phase 8: 物資納品',
        steps: [
          {
            id: 'fs_prapor_visit',
            type: 'check',
            text: 'Praporを訪ねる',
          },
          {
            id: 'fs_batteries',
            type: 'check',
            text: 'Rechargeable battery (FIR) x3を渡す',
            parallel: true,
          },
          {
            id: 'fs_pcb',
            type: 'check',
            text: 'Printed circuit board (FIR) x5を渡す',
            parallel: true,
          },
          {
            id: 'fs_toolset',
            type: 'check',
            text: 'Toolset (FIR) x2を渡す',
            parallel: true,
          },
        ],
      },
      {
        id: 'fs_p9',
        title: 'Phase 9: Prapor待ち (2)',
        steps: [
          {
            id: 'fs_wait2',
            type: 'wait',
            text: 'Praporからの連絡を待つ',
            duration: '3〜5時間',
          },
        ],
      },
      {
        id: 'fs_p10',
        title: 'Phase 10: 証拠品の回収',
        steps: [
          {
            id: 'fs_transcript',
            type: 'check',
            text: 'Shoreline村のChairman\'s Houseで「Flight crew\'s transcript」を見つけて渡す',
            parallel: true,
          },
          {
            id: 'fs_secure_flash',
            type: 'check',
            text: '同所で「Elektronik\'s secure flash drive」を見つけて渡す',
            parallel: true,
          },
        ],
      },
      {
        id: 'fs_p11',
        title: 'Phase 11: Prapor待ち (3) + 質問',
        steps: [
          {
            id: 'fs_wait3',
            type: 'wait',
            text: 'Praporからの連絡を待つ',
            duration: '1〜3時間',
          },
          {
            id: 'fs_transcript_read',
            type: 'choice',
            text: 'Praporの質問: トランスクリプトを読んだか？',
            options: [
              { value: 'yes', label: 'はい (報酬: 300,000ルーブル)' },
              { value: 'no', label: 'いいえ (報酬なし)' },
            ],
          },
        ],
      },
      {
        id: 'fs_p12',
        title: 'Phase 12: Armored Case回収',
        steps: [
          {
            id: 'fs_armored_case',
            type: 'check',
            text: 'Woodsの墜落機(コックピット後方)からArmored Caseを回収する',
          },
          {
            id: 'fs_extra_clue',
            type: 'check',
            text: '追加の手がかりを探す (Mr. Kermanのメモ、パイロット席上)',
            optional: true,
          },
        ],
      },
      {
        id: 'fs_p13',
        title: 'Phase 13: 最終選択 (重要な分岐点)',
        steps: [
          {
            id: 'fs_case_warning',
            type: 'note',
            text: '⚠️ これは取り返しのつかない重要な選択です。The Ticketチャプターのルートに影響します。',
          },
          {
            id: 'fs_case_choice',
            type: 'choice',
            text: 'Armored Caseの処遇を選択',
            options: [
              { value: 'keep', label: '自分の手元に残す (Prapor評判-0.3 / ケース入手 / 実績「Just Business」/ The TicketでMechanicルート)' },
              { value: 'give', label: 'Praporに直接渡す (報酬: 1,500,000ルーブル / 実績「Man of His Word」)' },
              { value: 'pretend', label: '見つけなかったフリをして渡す (報酬: 1,000,000ルーブル / 実績「Man of His Word」)' },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CHAPTER 3: THE TICKET
  // ============================================================
  {
    id: 'the_ticket',
    title: 'The Ticket',
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Ticket',
    description: 'Armored Caseの謎を解き明かし、Tarkovからの脱出を目指す最終章。4つのエンディングに分岐する。',
    category: 'main',
    unlockCondition: 'Falling Skies完了後',
    phases: [
      // Phase 1: 共通開始
      {
        id: 'tt_p1',
        title: 'Phase 1: 共通開始',
        steps: [
          {
            id: 'tt_route_choice',
            type: 'choice',
            text: 'Falling Skiesでの選択に基づくルート (自動連動 / 手動変更可)',
            options: [
              { value: 'prapor', label: 'Praporルート — ケースをPraporに渡した (give/pretend)' },
              { value: 'mechanic', label: 'Mechanicルート — ケースを保持した (keep)' },
            ],
          },
          {
            id: 'tt_intel_center',
            type: 'check',
            text: 'HideoutにIntelligence Center Lv1を設置する',
          },
          {
            id: 'tt_kerman_talk1',
            type: 'check',
            text: 'Mr. Kermanと話す',
          },
          {
            id: 'tt_kerman_wait1',
            type: 'wait',
            text: 'Mr. Kermanからの連絡を待つ',
            duration: '4〜12時間',
          },
          {
            id: 'tt_prapor_talk1',
            type: 'check',
            text: 'Praporと話す',
          },
          {
            id: 'tt_kerman_talk2',
            type: 'check',
            text: 'Mr. Kermanと話す',
          },
        ],
      },

      // Phase 2: Praporルート (ケースをPraporに渡した場合のみ)
      {
        id: 'tt_p2',
        title: 'Phase 2: Praporルート (ケースをPraporに渡した場合のみ)',
        steps: [
          {
            id: 'tt_prapor_camp',
            type: 'check',
            text: 'LighthouseにあるPraporの部下のキャンプを捜索する',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_prapor_clue',
            type: 'check',
            text: 'Praporの部下の意図に関する手がかりを見つける (Note from Prapor\'s men, FIR)',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_kerman_talk3',
            type: 'check',
            text: 'Mr. Kermanと話す',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_lightkeeper_access',
            type: 'check',
            text: 'Lightkeeperへのアクセス権を得る (Network Providerクエストラインが必要)',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_lightkeeper_talk1',
            type: 'check',
            text: 'Lightkeeperと話す',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_lightkeeper_rep',
            type: 'check',
            text: 'Lightkeeperとの良好な関係を維持する',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_blue_folders',
            type: 'check',
            text: 'TerraGroup「Blue Folders」materials x3を入手する',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_blue_folders_give',
            type: 'check',
            text: 'LightkeeperにBlue Foldersを渡す',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_ultra_flare',
            type: 'check',
            text: 'InterchangeのULTRA正面入口で黄色フレアを打ち上げる',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_interchange_kills',
            type: 'check',
            text: 'Interchangeで1レイド中に敵を15人排除する',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
          {
            id: 'tt_lightkeeper_talk2',
            type: 'check',
            text: 'Lightkeeperと話す',
            showIf: { stepId: 'tt_route_choice', value: 'prapor' },
          },
        ],
      },

      // Phase 3: ケース開封 (共通)
      {
        id: 'tt_p3',
        title: 'Phase 3: ケース開封',
        steps: [
          {
            id: 'tt_mechanic_consult',
            type: 'check',
            text: 'Mechanicに相談する',
          },
          {
            id: 'tt_signal_jammer',
            type: 'check',
            text: 'The Labで「Experimental signal jammer」を見つける',
          },
          {
            id: 'tt_lab_access',
            type: 'check',
            text: 'The Labへのアクセスを確保する',
            optional: true,
          },
          {
            id: 'tt_lab_keycard',
            type: 'check',
            text: 'TerraGroup Labs access keycardを入手する',
            optional: true,
          },
          {
            id: 'tt_unlock_case',
            type: 'check',
            text: 'Experimental signal jammerでケースのロックを解除する',
          },
          {
            id: 'tt_open_case',
            type: 'check',
            text: 'Armored Caseを開封する',
          },
          {
            id: 'tt_get_ticket',
            type: 'check',
            text: '「Ticket」(Kruglov\'s RFID keycard)を入手する',
          },
          {
            id: 'tt_read_instructions',
            type: 'check',
            text: 'ケース内の指示書を読む',
          },
          {
            id: 'tt_kerman_contact',
            type: 'check',
            text: 'Mr. Kermanに連絡する',
          },
        ],
      },

      // Phase 4: Kermanの申し出 (重要な分岐)
      {
        id: 'tt_p4',
        title: 'Phase 4: Kermanの申し出 (重要な分岐)',
        steps: [
          {
            id: 'tt_kerman_offer',
            type: 'choice',
            text: 'Mr. Kermanの申し出を受けるか？',
            options: [
              { value: 'accept', label: '受ける (Savior/Debtor/Fallenルート)' },
              { value: 'refuse', label: '拒否する (Survivorルート)' },
            ],
          },
        ],
      },

      // Phase 5a: 受諾ルート — RFIDカード有効化
      {
        id: 'tt_p5a',
        title: 'Phase 5a: 受諾ルート — RFIDカード有効化',
        steps: [
          {
            id: 'tt_accept_offer',
            type: 'check',
            text: 'Mr. Kermanの申し出を受ける',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_activate_rfid',
            type: 'check',
            text: 'RFIDカードを有効化する',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_solar_power',
            type: 'check',
            text: 'Solar Power Lv1を設置する',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_blank_rfid',
            type: 'check',
            text: 'Blank RFID keycardを入手する',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_lab_master_pass',
            type: 'check',
            text: 'Laboratory master passを入手する',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_activate_kruglov',
            type: 'check',
            text: 'Laboratory master passでKruglovのキーカードを有効化する',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_lab_access2',
            type: 'check',
            text: 'The Labへのアクセスを確保する',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_rfid_device',
            type: 'check',
            text: 'RFID card encryption deviceを入手する (Streets, Klimov 14A)',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_kerman_talk4',
            type: 'check',
            text: 'Mr. Kermanと話す',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_mechanic_talk2',
            type: 'check',
            text: 'Mechanicと話す',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_mechanic_wait',
            type: 'wait',
            text: 'Mechanicからの返答を待つ',
            duration: '12〜24時間',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_bitcoin_pay',
            type: 'check',
            text: 'Mechanicに Physical Bitcoin x40を渡す',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_bitcoin_farm',
            type: 'check',
            text: 'Bitcoin Farm Lv1を設置する',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_bitcoin_collect',
            type: 'check',
            text: 'Physical Bitcoin x40を用意する',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_rfid_retrieve',
            type: 'check',
            text: 'RFID card encryption deviceを回収する',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_streets_access',
            type: 'check',
            text: 'Streets of Tarkovへのアクセスを確保する',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_kruglov_apt',
            type: 'check',
            text: 'StreetsのKruglovのアパートにアクセスする',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_terminal_go',
            type: 'check',
            text: 'ShorelineのTerminal入口へ行く',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
          {
            id: 'tt_terminal_swipe',
            type: 'check',
            text: 'インターコムリーダーにキーカードをスワイプする',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
          },
        ],
      },

      // Phase 5a-2: 証拠収集の選択
      {
        id: 'tt_p5a2',
        title: 'Phase 5a-2: 証拠収集の選択',
        steps: [
          {
            id: 'tt_evidence_agree',
            type: 'choice',
            text: 'TerraGroupの証拠を集めることに合意するか？',
            showIf: { stepId: 'tt_kerman_offer', value: 'accept' },
            options: [
              { value: 'agree', label: '合意する (Savior/Debtorルート)' },
              { value: 'refuse', label: '拒否する (Fallenルート)' },
            ],
          },
        ],
      },

      // Phase 6a: Savior/Debtorルート — 証拠収集
      {
        id: 'tt_p6a',
        title: 'Phase 6a: Savior/Debtorルート — 証拠収集',
        steps: [
          {
            id: 'tt_kerman_talk5',
            type: 'check',
            text: 'Mr. Kermanと話す',
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
          },
          {
            id: 'tt_agree_evidence',
            type: 'check',
            text: 'TerraGroupの証拠収集に合意する',
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
          },
          {
            id: 'tt_intel_center3',
            type: 'check',
            text: 'Intelligence Center Lv3を設置する',
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
          },
          {
            id: 'tt_major_evidence',
            type: 'check',
            text: '主要証拠(Major Evidence) 8つをMr. Kermanに届ける',
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
          },
          {
            id: 'tt_minor_evidence',
            type: 'check',
            text: '副次的証拠(Minor Evidence) 32個をMr. Kermanに届ける',
            optional: true,
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
          },
          {
            id: 'tt_evidence_note',
            type: 'note',
            text: '主要証拠8つ全て提出→Saviorエンド / 2つ以下→Debtorエンド',
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
          },
          {
            id: 'tt_negotiate',
            type: 'check',
            text: 'Mr. Kermanと交渉する',
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
          },
        ],
      },

      // Phase 6a-ending: エンディング分岐
      {
        id: 'tt_p6a_ending',
        title: 'Phase 6a-ending: エンディング分岐',
        steps: [
          {
            id: 'tt_ending',
            type: 'choice',
            text: 'エンディング分岐',
            showIf: { stepId: 'tt_evidence_agree', value: 'agree' },
            options: [
              { value: 'savior', label: 'Savior (主要証拠を全8つ提出)' },
              { value: 'debtor', label: 'Debtor (主要証拠が2つ以下)' },
            ],
          },
          // Savior steps
          {
            id: 'tt_savior_confirm',
            type: 'check',
            text: '全証拠の提出をMr. Kermanに確認する',
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_savior_wait',
            type: 'wait',
            text: 'Mr. Kermanの信頼できる連絡先からの連絡を待つ',
            duration: '24〜48時間',
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_fence_talk1',
            type: 'check',
            text: 'Fenceと話す',
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_fence_rep',
            type: 'check',
            text: 'Fenceとの信頼度を4.0以上に維持する',
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_woods_coop',
            type: 'check',
            text: 'WoodsのFriendship Bridge (Co-Op)から脱出する (Scav/Goonキル禁止)',
            parallel: true,
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_reserve_coop',
            type: 'check',
            text: 'ReserveのScav Lands (Co-Op)から脱出する',
            parallel: true,
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_btr_rep',
            type: 'check',
            text: 'BTR Driverとの信頼度を0.4以上にする',
            parallel: true,
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_fence_report',
            type: 'check',
            text: 'Fenceに完了を報告する',
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          {
            id: 'tt_fence_talk2',
            type: 'check',
            text: 'Fenceと話す',
            showIf: { stepId: 'tt_ending', value: 'savior' },
          },
          // Debtor steps
          {
            id: 'tt_debtor_ask',
            type: 'check',
            text: 'トレーダーたちにTarkovからの脱出方法を尋ねる',
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_flash',
            type: 'check',
            text: 'Lightkeeperに軍用フラッシュドライブ(編集データ)を渡す',
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_record',
            type: 'check',
            text: '編集データを軍用フラッシュドライブに記録する',
            optional: true,
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_maps',
            type: 'check',
            text: '各マップの地形情報文書を入手する (Lighthouse, Woods, Customs, Ground Zero, Factory)',
            optional: true,
            parallel: true,
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_pmc_kills',
            type: 'check',
            text: 'Woodsで30人のPMCを排除する',
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_dogtags',
            type: 'check',
            text: 'Lightkeeperに100個のPMCドッグタグを渡す',
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_dogtags_collect',
            type: 'check',
            text: 'PMCドッグタグを100個入手する',
            optional: true,
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_amulets',
            type: 'check',
            text: '聖なるアミュレットを6つ入手し、Lighthouseのmarked roomに配置する',
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_amulets_collect',
            type: 'check',
            text: '各マップのmarked roomからアミュレットを入手する (Customs, Streets x2, Reserve x3)',
            optional: true,
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
          {
            id: 'tt_debtor_report',
            type: 'check',
            text: 'Lightkeeperに報告する',
            showIf: { stepId: 'tt_ending', value: 'debtor' },
          },
        ],
      },

      // Phase 6b: Fallenルート
      {
        id: 'tt_p6b',
        title: 'Phase 6b: Fallenルート',
        steps: [
          {
            id: 'tt_fallen_kerman',
            type: 'check',
            text: 'Mr. Kermanと話す',
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          {
            id: 'tt_fallen_ask_traders',
            type: 'check',
            text: 'トレーダーたちにTarkovからの脱出方法を尋ねる',
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          // Extra steps for Mechanic route (kept case from Prapor)
          {
            id: 'tt_fallen_electronics',
            type: 'check',
            text: 'Praporに軍用/先進電子部品 x50を渡す',
            showIf: { stepId: 'tt_route_choice', value: 'mechanic' },
          },
          {
            id: 'tt_fallen_container',
            type: 'check',
            text: 'Praporにセキュアコンテナ(Theta/Epsilon/Kappa)を渡す',
            showIf: { stepId: 'tt_route_choice', value: 'mechanic' },
          },
          {
            id: 'tt_fallen_repair_kits',
            type: 'check',
            text: 'Praporに武器・アーマーリペアキット x40を渡す',
            showIf: { stepId: 'tt_route_choice', value: 'mechanic' },
          },
          // Common Fallen steps
          {
            id: 'tt_fallen_cargo',
            type: 'check',
            text: 'PraporにCase with dangerous cargoを渡す',
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          {
            id: 'tt_fallen_cargo_find',
            type: 'check',
            text: 'Case with dangerous cargoを見つけて入手する',
            optional: true,
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          {
            id: 'tt_fallen_prapor_report',
            type: 'check',
            text: 'Praporに報告する',
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          {
            id: 'tt_fallen_pay_million',
            type: 'check',
            text: 'Praporに1,000,000ドルを渡す',
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          {
            id: 'tt_fallen_collect_million',
            type: 'check',
            text: '必要な1,000,000ドルを集める',
            optional: true,
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          {
            id: 'tt_fallen_wait',
            type: 'wait',
            text: 'Praporからの情報を待つ',
            duration: '36〜48時間',
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
          {
            id: 'tt_fallen_hashcode',
            type: 'check',
            text: 'Praporから更新されたハッシュコードを受け取る',
            showIf: { stepId: 'tt_evidence_agree', value: 'refuse' },
          },
        ],
      },

      // Phase 5b: Survivorルート
      {
        id: 'tt_p5b',
        title: 'Phase 5b: Survivorルート',
        steps: [
          {
            id: 'tt_survivor_terminal',
            type: 'check',
            text: 'ShorelineのTerminal入口へ行く',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_swipe',
            type: 'check',
            text: 'インターコムリーダーにキーカードをスワイプする',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_prapor',
            type: 'check',
            text: 'Praporと話す',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_pay',
            type: 'check',
            text: 'Praporに大金を渡す (Praporルート: 300,000,000ルーブル / Mechanicルート: 500,000,000ルーブル)',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_pay_note',
            type: 'note',
            text: 'Falling SkiesでPraporにケースを渡した場合は3億ルーブル、保持した場合は5億ルーブル',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_collect_rub',
            type: 'check',
            text: '必要なルーブルを集める',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_timed',
            type: 'check',
            text: 'Praporの時限タスクを全て完了する (時間制限あり)',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_ssd',
            type: 'check',
            text: '証拠フォルダをデジタル化してSSDに保存する',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_folders',
            type: 'check',
            text: '各証拠フォルダを入手する (Reports, Staff, Developments, Finances)',
            optional: true,
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_kills_50',
            type: 'check',
            text: 'Streets of Tarkovで50人のターゲットを排除する',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_kills_4',
            type: 'check',
            text: '1レイドで4人のPMCを排除する',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_report',
            type: 'check',
            text: 'Praporに報告する',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
          {
            id: 'tt_survivor_penalty',
            type: 'note',
            text: '時限タスク失敗時: PraporにSecure container Kappaを渡す必要あり (ペナルティ)',
            showIf: { stepId: 'tt_kerman_offer', value: 'refuse' },
          },
        ],
      },

      // Phase 7: Terminal脱出 (全エンディング共通)
      {
        id: 'tt_p7',
        title: 'Phase 7: Terminal脱出 (全エンディング共通)',
        steps: [
          {
            id: 'tt_final_terminal',
            type: 'check',
            text: 'ShorelineのTerminal入口に到着する',
          },
          {
            id: 'tt_final_swipe',
            type: 'check',
            text: 'インターコムリーダーにキーカードをスワイプする',
          },
          {
            id: 'tt_final_enter',
            type: 'check',
            text: 'Terminal内に入る',
          },
          {
            id: 'tt_final_security',
            type: 'check',
            text: 'セキュリティチェックを通過する',
          },
          {
            id: 'tt_final_escape',
            type: 'check',
            text: 'Escape from Tarkov',
          },
          {
            id: 'tt_final_armory',
            type: 'check',
            text: '没収された装備がある武器庫を見つける',
            optional: true,
          },
          {
            id: 'tt_final_alpha1',
            type: 'check',
            text: 'Secure container Alpha-1を回収する',
            optional: true,
          },
          {
            id: 'tt_final_bd_keycard',
            type: 'check',
            text: 'サービス通路のキーカード(Black Division keycard)を入手する',
            optional: true,
          },
          {
            id: 'tt_final_cargo_exit',
            type: 'check',
            text: 'Terminal積載区域への出口を見つける',
            optional: true,
          },
          {
            id: 'tt_final_service_unlock',
            type: 'check',
            text: '海港ビル内のサービス通路を解錠する',
            optional: true,
          },
          {
            id: 'tt_final_cargo_access',
            type: 'check',
            text: 'Terminal積載区域にアクセスする',
            optional: true,
          },
          {
            id: 'tt_final_fuel',
            type: 'check',
            text: '燃料貯蔵所への入り方を見つける',
            optional: true,
          },
          {
            id: 'tt_final_power',
            type: 'check',
            text: 'ポンプステーションへの電力復旧方法を見つける',
            optional: true,
          },
          {
            id: 'tt_final_diagram',
            type: 'check',
            text: '電気パネルの図面を入手する',
            optional: true,
          },
          {
            id: 'tt_final_drain',
            type: 'check',
            text: 'ポンプステーションの排水をする',
            optional: true,
          },
          {
            id: 'tt_final_pier_key',
            type: 'check',
            text: '桟橋への道を塞ぐゲートの鍵(Pier door key)を入手する',
            optional: true,
          },
          {
            id: 'tt_final_pier_exit',
            type: 'check',
            text: '桟橋への出口を見つける',
            optional: true,
          },
          {
            id: 'tt_final_pier_evac',
            type: 'check',
            text: '桟橋の避難エリアに到達する',
            optional: true,
          },
        ],
      },
    ],
  },
];
