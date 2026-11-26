// サイドチャプターデータ (NIWA-226: 日本語Wiki 2026-11-21更新と照合)
// step.reference=true は参考(進捗必須にしない)、step.hint は根拠・不一致の注記

import { BOREAS_CHAPTER } from './boreasChapter.js'

export const SIDE_CHAPTERS = [
  {
    "id": "batya",
    "title": "Batya",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/Batya",
    "description": "BEAR特殊部隊「Bogatyr」の行方を追う。",
    "category": "side",
    "unlockCondition": "Customs / Woods / Reserve / ShorelineのいずれかでBEAR部隊の痕跡(Bogatyr patch)を発見",
    "phases": [
      {
        "id": "ba_p1",
        "title": "Phase 1: 痕跡の発見",
        "steps": [
          {
            "id": "ba_find_trace",
            "type": "check",
            "text": "BEAR特殊部隊の痕跡を見つける",
            "hint": "各マップにテキスト付きのパッチがある。Customsのプレハブ、Woodsの車列跡、ReserveのKingの屋根（Wiki）。開始条件は報告ごとに異なる"
          },
          {
            "id": "ba_get_patch",
            "type": "check",
            "text": "Bogatyr squad patchを入手する (Customs/Woods/Reserve/Lighthouse)",
            "optional": true
          }
        ]
      },
      {
        "id": "ba_p2",
        "title": "Phase 2: トレーダー聞き込み",
        "steps": [
          {
            "id": "ba_ask_jaeger",
            "type": "check",
            "text": "Jaegerと話し、Bogatyr部隊について聞く",
            "hint": "Jaegerのみ確認済み。Peacekeeper・Fenceの反応は未確認（Wiki）"
          }
        ]
      },
      {
        "id": "ba_p3",
        "title": "Phase 3: Ryabina拠点（Woods）",
        "steps": [
          {
            "id": "ba_ryabina_locate",
            "type": "check",
            "text": "Ryabina Outpostを特定する (Woods、スナイパーロック付近)",
            "hint": "Woods。製材所北の丘の焼けたキャンプ跡"
          },
          {
            "id": "ba_ryabina_amulet",
            "type": "check",
            "text": "メモを読み、Streletsの護符を回収する"
          },
          {
            "id": "ba_ryabina_memento",
            "type": "check",
            "text": "Bogatyrの形見を入手する (Strelets' amulet)",
            "optional": true
          }
        ]
      },
      {
        "id": "ba_p6",
        "title": "Phase 4: Moremanの待ち伏せ地点（Woods）",
        "steps": [
          {
            "id": "ba_ambush_locate",
            "type": "check",
            "text": "待ち伏せ地点を特定する",
            "hint": "WoodsのMoremanの墓"
          },
          {
            "id": "ba_ambush_info",
            "type": "check",
            "text": "Bogatyr部隊の追加情報を入手する"
          },
          {
            "id": "ba_moreman_body",
            "type": "check",
            "text": "Moremanの遺体を調べる (Second piece of code note)"
          },
          {
            "id": "ba_moreman_phone",
            "type": "check",
            "text": "Moremanの電話を入手する",
            "optional": true
          },
          {
            "id": "ba_moreman_dogtag",
            "type": "check",
            "text": "Bogatyrのドッグタグを入手する (Moreman's dogtag)",
            "optional": true
          },
          {
            "id": "ba_moreman_phone_info",
            "type": "check",
            "text": "Moremanの電話から待ち伏せの情報を得る",
            "reference": true,
            "hint": "電話のレシピはIntelligence Center Lv3以降でのみ使える（Wiki）。必須かは未確認"
          }
        ]
      },
      {
        "id": "ba_p5",
        "title": "Phase 5: Gnezdo拠点（Interchange）",
        "steps": [
          {
            "id": "ba_gnezdo_locate",
            "type": "check",
            "text": "Gnezdo Outpostを特定する",
            "hint": "Interchange、Ultra裏。ゲーム内の文言は反対側を指すが、Wikiの観察では逆（方角は不一致）"
          },
          {
            "id": "ba_gnezdo_search",
            "type": "check",
            "text": "Gnezdo Outpostを捜索する (First piece of code note)"
          },
          {
            "id": "ba_gnezdo_fate",
            "type": "check",
            "text": "Bogatyr部隊に何が起きたか解明する (BEAR note from outpost behind Ultra)"
          },
          {
            "id": "ba_gnezdo_ambush",
            "type": "check",
            "text": "Bogatyr部隊が待ち伏せを受けた場所を特定する (Map with triangulated signal)"
          },
          {
            "id": "ba_gnezdo_ops",
            "type": "check",
            "text": "Bogatyr部隊の活動について調べる (Bogatyr squad operations report)"
          },
          {
            "id": "ba_gnezdo_moreman",
            "type": "check",
            "text": "Bogatyr部隊のメンバーについて調べる (Moreman's personal file)"
          }
        ]
      },
      {
        "id": "ba_p4",
        "title": "Phase 6: Carousel拠点（Interchange）",
        "steps": [
          {
            "id": "ba_carousel_locate",
            "type": "check",
            "text": "Carousel Outpostを特定する (ULTRA IDEA店舗向かい)",
            "hint": "InterchangeのIDEAフードコート。アイテムは消えるので、先にすべて読む（Wiki）"
          },
          {
            "id": "ba_carousel_note",
            "type": "check",
            "text": "Bogatyr部隊の個人メモを見つける (Strelets' note)"
          },
          {
            "id": "ba_strelets_info",
            "type": "check",
            "text": "Streletsについて調べる"
          },
          {
            "id": "ba_taran_info",
            "type": "check",
            "text": "Taranについて調べる (Taran's personal file)"
          },
          {
            "id": "ba_taran_postcard",
            "type": "check",
            "text": "Bogatyrの個人的な持ち物を入手する (Taran's postcard)",
            "optional": true
          },
          {
            "id": "ba_voevoda_info",
            "type": "check",
            "text": "Voevodaについて調べる (Voevoda's personal file)"
          },
          {
            "id": "ba_voevoda_tape",
            "type": "check",
            "text": "Voevodaの個人的な持ち物を見つける (Voevoda's thoughts audio tape)"
          },
          {
            "id": "ba_voevoda_recorder",
            "type": "check",
            "text": "部隊長のレコーダーを入手する (Voevoda's audio recorder)",
            "optional": true
          }
        ]
      },
      {
        "id": "ba_p7",
        "title": "Phase 7: Intelligence Center Lv3 と無線",
        "steps": [
          {
            "id": "ba_intel_center",
            "type": "check",
            "text": "Intelligence Center Lv3を設置する"
          },
          {
            "id": "ba_radio_contact",
            "type": "check",
            "text": "Bogatyr部隊に連絡する (Radio: 周波数35.70, コード27.893.2000)",
            "hint": "周波数はこれまで集めたメモに書かれている（Wiki）"
          }
        ]
      },
      {
        "id": "ba_p9",
        "title": "Phase 8: 裏切り者とカルトの手がかり",
        "steps": [
          {
            "id": "ba_traitor_trace",
            "type": "check",
            "text": "裏切り者の痕跡を見つける (Lighthouse BEARキャンプ、Note mentioning Prapor)",
            "hint": "LighthouseのBEARキャンプ（Wiki）"
          },
          {
            "id": "ba_cultist_investigation",
            "type": "check",
            "text": "4つのマップでカルトの活動を調べる（Customs寮の壁のメモから進む）",
            "parallel": true,
            "hint": "旧資料の「Shorelineの写真」と同等とみなして再利用"
          },
          {
            "id": "ba_general_note",
            "type": "check",
            "text": "Note mentioning General (Woods or Customs)",
            "parallel": true,
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          },
          {
            "id": "ba_interrogate_prapor",
            "type": "check",
            "text": "Praporを尋問する",
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          }
        ]
      },
      {
        "id": "ba_p7b",
        "title": "Phase 9: Lightkeeper（遺留品の引き渡しと最後の文書）",
        "steps": [
          {
            "id": "ba_lk_access",
            "type": "check",
            "text": "Lightkeeperへのアクセス権を得る"
          },
          {
            "id": "ba_lk_rep",
            "type": "check",
            "text": "Lightkeeperとの良好な関係を維持する",
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          },
          {
            "id": "ba_lk_handover",
            "type": "check",
            "text": "Bogatyr部隊の遺留品5つをLightkeeperに渡す",
            "hint": "死亡して失うと再収集が必要。文書を読む段階も失われうる（Wiki）"
          },
          {
            "id": "ba_wait_voevoda",
            "type": "wait",
            "text": "Voevodaからの連絡を待つ",
            "duration": "約24時間（目安・実タイマー未確認）"
          },
          {
            "id": "ba_talk_lk",
            "type": "check",
            "text": "Lightkeeperに詰め寄る（Voevodaの連絡後）"
          },
          {
            "id": "ba_wait_docs",
            "type": "wait",
            "text": "LightkeeperがThe Unheardに関する書類を準備するのを待つ",
            "duration": "約24時間（目安・実タイマー未確認。旧資料は12時間）"
          },
          {
            "id": "ba_pick_up_report",
            "type": "check",
            "text": "Lightkeeperの部屋の外にある最後の文書を回収する（Lighthouse）"
          },
          {
            "id": "ba_achievement",
            "type": "note",
            "text": "※旧資料の実績情報。Wikiには記載がありません。"
          }
        ]
      },
      {
        "id": "ba_p8",
        "title": "Phase 10: Voevodaの試練（任意・参考）",
        "steps": [
          {
            "id": "ba_skill_lmg",
            "type": "check",
            "text": "Light Machine Gunsスキル Lv5に到達する",
            "parallel": true,
            "reference": true,
            "hint": "Wikiでは任意のスキル・キル目標。生還した場合のみ保存。旧資料の必須扱いから変更"
          },
          {
            "id": "ba_skill_ar",
            "type": "check",
            "text": "Assault Riflesスキル Lv10に到達する",
            "parallel": true,
            "reference": true,
            "hint": "Wikiでは任意のスキル・キル目標。生還した場合のみ保存。旧資料の必須扱いから変更"
          },
          {
            "id": "ba_skill_stress",
            "type": "check",
            "text": "Stress Resistanceスキル Lv10に到達する",
            "parallel": true,
            "reference": true,
            "hint": "Wikiでは任意のスキル・キル目標。生還した場合のみ保存。旧資料の必須扱いから変更"
          },
          {
            "id": "ba_skill_str",
            "type": "check",
            "text": "Strengthスキル Lv15に到達する",
            "parallel": true,
            "reference": true,
            "hint": "Wikiでは任意のスキル・キル目標。生還した場合のみ保存。旧資料の必須扱いから変更"
          },
          {
            "id": "ba_kill_15",
            "type": "check",
            "text": "死なずに15人のターゲットを排除する",
            "reference": true,
            "hint": "Wikiでは任意のスキル・キル目標。生還した場合のみ保存。旧資料の必須扱いから変更"
          },
          {
            "id": "ba_kill_4pmc",
            "type": "check",
            "text": "死なずに4人のPMCを排除する",
            "reference": true,
            "hint": "Wikiでは任意のスキル・キル目標。生還した場合のみ保存。旧資料の必須扱いから変更"
          },
          {
            "id": "ba_radio_voevoda",
            "type": "check",
            "text": "Voevodaに連絡する (Radio再度)",
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          }
        ]
      }
    ]
  },
  {
    "id": "the_unheard",
    "title": "The Unheard",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/The_Unheard",
    "description": "TerraGroupとカルト集団「The Unheard」の関係を調査する。",
    "category": "side",
    "unlockCondition": "StreetsまたはGround Zeroで「Note with ramblings about the Purification」を発見して読む",
    "phases": [
      {
        "id": "uh_p1",
        "title": "Phase 1: 初期調査 (The Lab)",
        "steps": [
          {
            "id": "uh_read_note",
            "type": "check",
            "text": "The Unheardについて調べる (unlock条件のノートを読む)",
            "hint": "開始のメモは出現が確定ではない（Ground ZeroのTerraGroup科学オフィス、Streetsの事務所の机）（Wiki）"
          },
          {
            "id": "uh_tg_doc",
            "type": "check",
            "text": "TerraGroupの活動について調べる (Document on changes in enterprise interactions, The Lab)",
            "hint": "The Lab 2F事務所・ドーム付近のプレハブ（Wiki）"
          },
          {
            "id": "uh_fuel_doc",
            "type": "check",
            "text": "ノートに記載された「燃料」について調べる (Cargo transport fax, The Lab)",
            "hint": "Factory Gate 4付近の医療テントの文書も（Wiki）"
          }
        ]
      },
      {
        "id": "uh_p2",
        "title": "Phase 2: 触媒の追跡 (Factory + Streets)",
        "steps": [
          {
            "id": "uh_transport_log",
            "type": "check",
            "text": "特殊触媒の出荷について調べる (Transport log with notes, Factory)"
          },
          {
            "id": "uh_hdd",
            "type": "check",
            "text": "Streets LEXOS側の通りで作業車両を見つけ、HDDを回収する",
            "hint": "車両の持ち主の名前表記が資料で異なる（Rzhevsky / Lezhovsky）"
          },
          {
            "id": "uh_print_hdd",
            "type": "check",
            "text": "Intel Center Lv1でHDDのデータをプリントアウトする"
          },
          {
            "id": "uh_read_transcript",
            "type": "check",
            "text": "Rzhevskyの会話記録を読む"
          }
        ]
      },
      {
        "id": "uh_p3",
        "title": "Phase 3: Blue Ice研究 (Factory)",
        "steps": [
          {
            "id": "uh_blue_ice_doc",
            "type": "check",
            "text": "Blue Ice燃料触媒の研究文書を入手する (TerraGroup storage room, Factory、要キーカード)",
            "hint": "FactoryのTerraGroup保管室。専用キーが必要。触媒と焼けた文書は同じ部屋の別位置にも出る（Wiki）"
          },
          {
            "id": "uh_burnt_doc",
            "type": "check",
            "text": "The Unheardの計画に関する情報を見つける (Burnt document, 同じ部屋)"
          }
        ]
      },
      {
        "id": "uh_p4",
        "title": "Phase 4: A.P.の追跡 (The Lab + Shoreline)",
        "steps": [
          {
            "id": "uh_ap_tape1",
            "type": "check",
            "text": "A.P.の活動について調べる (A.P. meeting audio tape Part 1, The Lab)",
            "parallel": true
          },
          {
            "id": "uh_ap_tape2",
            "type": "check",
            "text": "A.P.の役割について調べる (A.P. meeting audio tape Part 2, The Lab)",
            "parallel": true
          },
          {
            "id": "uh_ap_mention",
            "type": "check",
            "text": "The LabでA.P.に関する言及を探す",
            "hint": "The Labのホワイトボードが2か所。両方必要かはWikiで未記載"
          },
          {
            "id": "uh_ap_room",
            "type": "check",
            "text": "Health ResortでA.P.の部屋を特定する",
            "hint": "Shorelineの保養施設。東棟305号室・西棟の机のモニター付近（Wiki）"
          },
          {
            "id": "uh_guard_note",
            "type": "check",
            "text": "A.P.が割り当てられた部屋を調べる (Guard post note)",
            "optional": true
          },
          {
            "id": "uh_ap_key",
            "type": "check",
            "text": "A.P.の個人的な持ち物を入手する (TerraGroup corporate apartment key)",
            "hint": "フリーマーケットで購入も可（Wiki）。他プレイヤー・Scavに取られることがある"
          },
          {
            "id": "uh_ap_flash",
            "type": "check",
            "text": "A.P.のデータストレージデバイスを入手する (Sliderkey flash drive marked with A.P.)"
          }
        ]
      },
      {
        "id": "uh_p5",
        "title": "Phase 5: 復号化",
        "steps": [
          {
            "id": "uh_decrypt",
            "type": "check",
            "text": "A.P.の部屋から見つけたフラッシュドライブを復号化する"
          },
          {
            "id": "uh_ask_mechanic",
            "type": "check",
            "text": "Mechanicに相談する"
          },
          {
            "id": "uh_pay_mechanic",
            "type": "check",
            "text": "Mechanicに5,000,000ルーブルを渡す",
            "parallel": true
          },
          {
            "id": "uh_give_flash",
            "type": "check",
            "text": "MechanicにA.P.のフラッシュドライブを渡す",
            "parallel": true
          },
          {
            "id": "uh_wait_elektronik",
            "type": "wait",
            "text": "Elektronikからの連絡を待つ",
            "duration": "時間はWikiに記載なし（旧資料: 12〜24時間）",
            "hint": "何が待ち時間を終わらせるかも不明（参考）"
          }
        ]
      },
      {
        "id": "uh_p6",
        "title": "Phase 6: A.P.のアパート (Streets)",
        "steps": [
          {
            "id": "uh_reprogram_card",
            "type": "check",
            "text": "Intel CenterでA.P.のフラッシュドライブのデータをTerraGroupキーカードに統合する (Reprogrammed keycard Green)"
          },
          {
            "id": "uh_ap_apt_access",
            "type": "check",
            "text": "A.P.の企業アパートにアクセスする (Streets, Cardinal Apts)",
            "hint": "EXPO検問所付近、旧Scav検問所のBTR停留所向かいの建物（Wiki）"
          },
          {
            "id": "uh_ap_apt_search",
            "type": "check",
            "text": "A.P.のアパートを調査する"
          },
          {
            "id": "uh_ap_hidden",
            "type": "check",
            "text": "A.P.のアパートの隠し部屋に入る (リプログラムされたキーカードを使用)",
            "hint": "緑のキーカードをA.P.のアパート用に再プログラムして使う（Wiki）"
          },
          {
            "id": "uh_tg_order",
            "type": "check",
            "text": "TerraGroupの文書を調べる (Order from TG Worldwide HQ)",
            "parallel": true
          },
          {
            "id": "uh_blue_ice_role",
            "type": "check",
            "text": "Blue Ice触媒のThe Unheardプロトコルでの役割を調べる (Copy of report for TG Worldwide)",
            "parallel": true,
            "hint": "Wikiにこの目標の場所ヒントがなく、未解決"
          },
          {
            "id": "uh_protocol",
            "type": "check",
            "text": "The Unheardのプロトコルについて調べる (Document mentioning a protocol)",
            "parallel": true,
            "hint": "Wikiにこの目標の場所ヒントがなく、未解決"
          },
          {
            "id": "uh_warden",
            "type": "check",
            "text": "The UnheardとTarkovの関係を解明する (Document mentioning the Warden)",
            "parallel": true,
            "hint": "Wikiにこの目標の場所ヒントがなく、未解決"
          }
        ]
      }
    ]
  },
  {
    "id": "blue_fire",
    "title": "Blue Fire",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/Blue_Fire",
    "description": "謎のEMP兵器と青い閃光の正体を追う。",
    "category": "side",
    "unlockCondition": "WoodsまたはInterchangeで「EMERCOM leaflet」を読む、またはThe Labyrinthで「Note by Item #1156」を発見",
    "phases": [
      {
        "id": "bf_p1",
        "title": "Phase 1: 初期調査",
        "steps": [
          {
            "id": "bf_talk_mechanic",
            "type": "check",
            "text": "MechanicとEMPについて話す"
          },
          {
            "id": "bf_mechanic_access",
            "type": "check",
            "text": "Mechanicへのアクセスを確保する",
            "optional": true
          }
        ]
      },
      {
        "id": "bf_p2",
        "title": "Phase 2: デバイス破片の回収",
        "steps": [
          {
            "id": "bf_find_fragment",
            "type": "check",
            "text": "デバイスの破片を見つけて入手する (Unknown device fragment, FIR。Streets: LexOs閉鎖エリア or Chekannaya 13 marked room)",
            "hint": "所在は推測（Scav・信者が持つ可能性）。Streets・Ground Zeroを確認（Wiki）"
          },
          {
            "id": "bf_give_fragment",
            "type": "check",
            "text": "Mechanicにデバイスの破片を渡す",
            "reference": true,
            "hint": "Wikiでは「渡すか残すか」の選択のみ。ここでの独立した引き渡しは旧資料"
          }
        ]
      },
      {
        "id": "bf_p3",
        "title": "Phase 3: Labハッキング",
        "steps": [
          {
            "id": "bf_hack_lab",
            "type": "check",
            "text": "The Labのサーバールームにハッキングデバイスを設置する (Mechanicからメールで受け取る)",
            "hint": "The Labのサーバールーム、黒キーカードの部屋付近。サーバーのごく近くで設置しないと反映されない（Wiki）"
          },
          {
            "id": "bf_talk_mechanic_2",
            "type": "check",
            "text": "Mechanicと話す"
          }
        ]
      },
      {
        "id": "bf_p4",
        "title": "Phase 4: 破片の選択",
        "steps": [
          {
            "id": "bf_fragment_choice",
            "type": "choice",
            "text": "Item 1156の破片をMechanicに渡すか、手元に残すか",
            "options": [
              {
                "value": "give",
                "label": "Mechanicに渡す（報酬: IC未設置 1,500,000₽ / Lv1 1,575,000₽ / Lv2〜3 1,725,000₽）"
              },
              {
                "value": "keep",
                "label": "手元に残す（実績の有無はWikiに記載なし）"
              }
            ],
            "hint": "渡すと「残す」目標は失敗扱い。報酬はIntelligence Centerの進行度で変わる"
          }
        ]
      },
      {
        "id": "bf_p5",
        "title": "Phase 5: Item 1156のリード",
        "steps": [
          {
            "id": "bf_item1156_clue",
            "type": "check",
            "text": "Item 1156に関する手がかりを見つける (Note mentioning Item #1156, FIR。Ground Zero Lv21+ / Lighthouse / The Lab)",
            "hint": "候補3か所: Lighthouseの青い屋根の建物の本棚 / Ground Zeroの机（TerraGroup科学オフィスの鍵）/ The Labの事務エリア（黄色キーカードの部屋付近）。どれが必須かは未確認"
          }
        ]
      },
      {
        "id": "bf_p6",
        "title": "Phase 6: Rus Post調査",
        "steps": [
          {
            "id": "bf_rus_post",
            "type": "check",
            "text": "StreetsのRus Post郵便局を調査する (Audio recorder必要。テープ3本を入手して聴く)",
            "hint": "テープ0511/001〜003を再生する必要がある。001の出現位置は未確認（Wiki）"
          },
          {
            "id": "bf_rus_car",
            "type": "check",
            "text": "Rus Post Carを見つける (Rus Post car key必要、毎レイド車の右後輪横にスポーン)",
            "hint": "青い郵便車。Rus Post car keyは右後輪付近に出現（Wiki）"
          },
          {
            "id": "bf_spec",
            "type": "check",
            "text": "Item 1156の設計図を入手する (Item #1156 specification, FIR)",
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          }
        ]
      }
    ]
  },
  {
    "id": "they_are_already_here",
    "title": "They Are Already Here",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/They_Are_Already_Here",
    "description": "カルトの儀式「Eye of the World」と、彼らの予言について調査する。",
    "category": "side",
    "unlockCondition": "マークされた部屋(Customs寮314 / Reserve RB-BK,RB-VO,RB-PKPM / Woods北の村 / Shorelineの島)で「Note about the Eye of the World」を発見",
    "phases": [
      {
        "id": "th_p1",
        "title": "Phase 1: カルトの調査",
        "steps": [
          {
            "id": "th_investigate",
            "type": "check",
            "text": "フードを被った者たちについて調べる",
            "hint": "開始条件は報告が3通り（魔法陣近くの手紙／マークされた部屋に入る／信者を倒す）で未確定"
          },
          {
            "id": "th_locate_eow",
            "type": "check",
            "text": "Eye of the Worldに関連する場所を特定する"
          },
          {
            "id": "th_torture_tape",
            "type": "check",
            "text": "拷問部屋でカルトの被害者について調べる (Cult victim audio tape #2, FIR。Lighthouse: Cultist's torture house)",
            "hint": "Lighthouse北の島の村・東の家。Audio tape #2は再生しないと進まない（生還脱出するか録音機を持ち込む）（Wiki）"
          },
          {
            "id": "th_play_tape2",
            "type": "check",
            "text": "Cult victim audio tape #2を再生する",
            "hint": "テープ再生が進行条件（Wiki）。脱出後でも可"
          }
        ]
      },
      {
        "id": "th_p2",
        "title": "Phase 2: 被害者のアパート (Streets)",
        "steps": [
          {
            "id": "th_victim_apt",
            "type": "check",
            "text": "カルトの被害者のアパートを特定する (Cult victim's apartment key必要、Streets: Klimovショッピングモール裏)",
            "hint": "Streets北側の建物3階。ドアはブリーチが必要（Wiki）"
          },
          {
            "id": "th_apt_key",
            "type": "check",
            "text": "アパートの鍵を入手する",
            "optional": true
          },
          {
            "id": "th_apt_breach",
            "type": "check",
            "text": "アパートを調査する (ドアをブリーチ)"
          },
          {
            "id": "th_victim_tape1",
            "type": "check",
            "text": "被害者の最初のオーディオテープを入手する (Cult victim audio tape #1, FIR。Book of the ArrivalとNote on preparations for the Arrivalも回収)"
          }
        ]
      },
      {
        "id": "th_p3",
        "title": "Phase 3: Mechanic相談",
        "steps": [
          {
            "id": "th_ask_mechanic",
            "type": "check",
            "text": "MechanicにEye of the Worldについて相談する"
          },
          {
            "id": "th_mechanic_access",
            "type": "check",
            "text": "Mechanicへのアクセスを確保する",
            "optional": true
          }
        ]
      },
      {
        "id": "th_p4",
        "title": "Phase 4: Cultist Priest排除",
        "steps": [
          {
            "id": "th_kill_priest",
            "type": "check",
            "text": "Cultist Priestを1体排除する",
            "hint": "討伐数は2→1に変更（2026-03-27の更新とWikiに注記）"
          }
        ]
      },
      {
        "id": "th_p5",
        "title": "Phase 5: 情報収集",
        "steps": [
          {
            "id": "th_priest_note",
            "type": "check",
            "text": "Cultist priestのメモを回収する",
            "hint": "出現: RB-VO / RB-BK / RB-PKPM / Customs寮のマークされた部屋（Wiki）"
          },
          {
            "id": "th_spawn_note",
            "type": "note",
            "text": "このアイテムは前のステップ完了後にスポーンする"
          }
        ]
      },
      {
        "id": "th_p6",
        "title": "Phase 6: Eye of the World各地調査",
        "steps": [
          {
            "id": "th_shore_eow",
            "type": "check",
            "text": "ShorelineのEye of the World地点を特定する",
            "parallel": true
          },
          {
            "id": "th_sordi_tower",
            "type": "check",
            "text": "Sordi通信塔周辺を調査する (Programmer's note, FIR)",
            "parallel": true
          },
          {
            "id": "th_repair_tower",
            "type": "check",
            "text": "Sordi塔を修理する (Toolset消費)"
          },
          {
            "id": "th_woods_eow",
            "type": "check",
            "text": "WoodsのEye of the World地点を特定する",
            "parallel": true
          },
          {
            "id": "th_woods_cult",
            "type": "check",
            "text": "Woodsのカルトの家を調査する (Newspaper clipping, FIR)",
            "parallel": true
          },
          {
            "id": "th_lh_eow",
            "type": "check",
            "text": "LighthouseのEye of the World地点を特定する",
            "parallel": true,
            "hint": "Eyeマークの場所は?付きで未確定（Wiki）"
          },
          {
            "id": "th_chalet_room",
            "type": "check",
            "text": "Chaletのカルト部屋を調査する (Victim's note入手)",
            "parallel": true
          },
          {
            "id": "th_station_key",
            "type": "check",
            "text": "被害者のメモにある、損傷した14-4 KORDパスを入手する",
            "hint": "Wikiではバイクのダッシュボード（ガレージ前）。旧資料のATV上は不一致。LighthouseのUSECコテージ（ガレージ・シャレーではない）の2階に被害者メモ"
          },
          {
            "id": "th_victim_items",
            "type": "check",
            "text": "被害者の持ち物を見つける",
            "optional": true
          }
        ]
      },
      {
        "id": "th_p7",
        "title": "Phase 7: Station準備",
        "steps": [
          {
            "id": "th_ask_mechanic_station",
            "type": "check",
            "text": "MechanicにStation 14-4 KORDについて相談する"
          },
          {
            "id": "th_repair_keycard",
            "type": "check",
            "text": "ArshavinのキーカードをIntel Center Lv1で修復する (Craft、電力継続必要)",
            "hint": "復元にはIntelligence Centerのデータが必要だが、入手方法はWikiに記載なし（参考）"
          }
        ]
      },
      {
        "id": "th_p8",
        "title": "Phase 8: ARRS Station 初回訪問 (Interchange)",
        "steps": [
          {
            "id": "th_arrs_access",
            "type": "check",
            "text": "NGO Cobaltの秘密施設にアクセスする (Interchange パワーステーション地下、修復キーカード使用)",
            "hint": "電源を先に入れないと進まない（Wiki）。サブステーション前のレバーの左のドアから地下へ"
          },
          {
            "id": "th_arrs_power",
            "type": "check",
            "text": "ステーションの電力を復旧する (入口横のパネルにキーカードをスワイプ)"
          },
          {
            "id": "th_arrs_cooling",
            "type": "check",
            "text": "サーバールームの冷却システムを起動する (格子ドア奥のレバー)"
          },
          {
            "id": "th_arrs_flash",
            "type": "check",
            "text": "フラッシュドライブを設置してデータをダウンロードする (冷却レバー横にSecure Flash driveを配置)"
          },
          {
            "id": "th_arrs_search",
            "type": "check",
            "text": "地下の金庫からMysterious audio tapeを回収する",
            "hint": "冷却スイッチを入れると金庫が開く（Wiki）"
          },
          {
            "id": "th_play_tape_arrs",
            "type": "check",
            "text": "Mysterious audio tapeを再生する",
            "hint": "再生しないと先に進まない（Wiki）"
          },
          {
            "id": "th_arrs_extract",
            "type": "check",
            "text": "Interchangeから生還する"
          }
        ]
      },
      {
        "id": "th_p9",
        "title": "Phase 9: 帰還して再訪（Interchange）",
        "steps": [
          {
            "id": "th_revisit",
            "type": "check",
            "text": "いったん拠点に戻ってから、Interchangeの発電所地下に再び入る",
            "hint": "Wikiの手順14"
          },
          {
            "id": "th_arrs_disconnect",
            "type": "check",
            "text": "ARRS station mechanic's memoを見つけ、リセットボタンの位置を知る",
            "hint": "フラッシュドライブを外したりMechanicに戻ったりするのは、切断方法が分かってから（Wiki）"
          },
          {
            "id": "th_reset_choice",
            "type": "choice",
            "text": "ARRSステーションのリセットボタンを押すか",
            "hint": "押すとMechanicから仕様書の連絡が来て完了でき、最良の結末と追加実績の条件になる（Wiki）。押さないと連絡は来ず、仕様書を読めない",
            "options": [
              {
                "value": "pressed",
                "label": "押した（ARRSをバックアップ設定に復元）"
              },
              {
                "value": "skipped",
                "label": "押さなかった（Mechanicからの連絡なし）"
              }
            ]
          },
          {
            "id": "th_arrs_restore",
            "type": "check",
            "text": "リセットボタンを押す（サーバールームのテーブル下。電源を入れ直してから）",
            "showIf": {
              "stepId": "th_reset_choice",
              "value": "pressed"
            }
          },
          {
            "id": "th_arrs_power_check",
            "type": "check",
            "text": "ステーションの電源が入っていることを確認する",
            "optional": true
          },
          {
            "id": "th_arrs_recover_flash",
            "type": "check",
            "text": "ARRSステーションからフラッシュドライブを回収する (Flash drive for ARRS station, FIR)",
            "hint": "USBフラッシュドライブを回収する"
          },
          {
            "id": "th_arrs_extract_2",
            "type": "check",
            "text": "Interchangeから生存脱出する"
          }
        ]
      },
      {
        "id": "th_p10",
        "title": "Phase 10: 結末",
        "steps": [
          {
            "id": "th_give_flash",
            "type": "check",
            "text": "MechanicにUSBフラッシュドライブを渡す"
          },
          {
            "id": "th_read_spec",
            "type": "check",
            "text": "MechanicのメッセージのARRSシステム仕様書を読む",
            "showIf": {
              "stepId": "th_reset_choice",
              "value": "pressed"
            },
            "hint": "リセットを押さなかった場合は連絡が来ず、この段階に進めない（Wiki）"
          },
          {
            "id": "th_achievement",
            "type": "note",
            "text": "実績「Through Another's Eyes」は完了時。隠し実績「When the Light Fades」はリセットを押してUSBを回収した場合のみで、PvEでは取得不可（Wiki）"
          }
        ]
      }
    ],
    "completionRequires": {
      "stepId": "th_reset_choice",
      "value": "pressed"
    },
    "incompleteMessage": "リセットを押さなかった分岐では、Mechanicから仕様書が届かないため章は未完了です。"
  },
  {
    "id": "accidental_witness",
    "title": "Accidental Witness",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/Accidental_Witness",
    "description": "ある債務者の失踪から始まる、汚職と裏切りの物語。",
    "category": "side",
    "unlockCondition": "Customs寮の中庭にある車に書かれたメッセージを発見",
    "phases": [
      {
        "id": "aw_p1",
        "title": "Phase 1: Kozlovの調査 (Customs)",
        "steps": [
          {
            "id": "aw_kozlov_locate",
            "type": "check",
            "text": "Kozlovの住居を特定する",
            "hint": "Customs 2階建て寮の110号室。ドア横のメモ（Wiki）"
          },
          {
            "id": "aw_kozlov_note",
            "type": "check",
            "text": "Kozlovのドアのメモを読む (Note for Kozlov)"
          },
          {
            "id": "aw_kozlov_involved",
            "type": "check",
            "text": "Kozlovが何に関わっていたか調べる"
          },
          {
            "id": "aw_kozlov_room",
            "type": "check",
            "text": "Kozlovの部屋にアクセスする (Dorm room 110 key)",
            "optional": true,
            "hint": "110号室の鍵は北の扉の先の更衣室に固定出現。タスク専用アイテムではなく他者に取られることがある（Wiki）"
          },
          {
            "id": "aw_kozlov_key_info",
            "type": "check",
            "text": "Kozlovの鍵の入手方法を調べる (Note from the repair shop)",
            "optional": true
          },
          {
            "id": "aw_kozlov_room_search",
            "type": "check",
            "text": "Kozlovの部屋を調査する (Letter from Kozlov's room)",
            "optional": true
          }
        ]
      },
      {
        "id": "aw_p2",
        "title": "Phase 2: Anastasiaの手がかり",
        "steps": [
          {
            "id": "aw_ask_anastasia",
            "type": "check",
            "text": "トレーダーにAnastasiaについて尋ねる (Skier)"
          }
        ]
      },
      {
        "id": "aw_p3",
        "title": "Phase 3: Skierの協力者のアパート (Streets)",
        "steps": [
          {
            "id": "aw_skier_apt",
            "type": "check",
            "text": "Skierの協力者のアパートにアクセスする (Zmeisky 3 apartment key、Streets)",
            "hint": "Zmeisky 3号 1階。アパートの鍵が必要（Wiki）"
          },
          {
            "id": "aw_apt_key",
            "type": "check",
            "text": "アパートの鍵を見つける",
            "optional": true
          },
          {
            "id": "aw_apt_investigate",
            "type": "check",
            "text": "Skierの協力者について調べる"
          },
          {
            "id": "aw_apt_search",
            "type": "check",
            "text": "アパートを調査する",
            "optional": true
          },
          {
            "id": "aw_apt_docs",
            "type": "check",
            "text": "アパート内の文書を読む (The Ninth Circle Issue #19, Tarkov Herald summary, FSB report, The Ninth Circle Issue #14)"
          },
          {
            "id": "aw_streets_extract",
            "type": "check",
            "text": "Streets of Tarkovから生存脱出する",
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          }
        ]
      },
      {
        "id": "aw_p4",
        "title": "Phase 4: トレーダーへの報告",
        "steps": [
          {
            "id": "aw_report_skier",
            "type": "check",
            "text": "Skierに報告する"
          },
          {
            "id": "aw_talk_ragman",
            "type": "check",
            "text": "Ragmanと話す"
          }
        ]
      },
      {
        "id": "aw_p5",
        "title": "Phase 5: Anastasiaのアパート (Streets)",
        "steps": [
          {
            "id": "aw_anastasia_apt",
            "type": "check",
            "text": "Anastasiaのアパートを特定する (Chekannaya 13、Streets 2階)",
            "hint": "Chekannaya 13番、2階。右側の入口かららせん階段。奥のドアでストーリーが進む（地名の表記ゆれあり）"
          },
          {
            "id": "aw_anastasia_info",
            "type": "check",
            "text": "Anastasiaについて調べる"
          },
          {
            "id": "aw_anastasia_entrance",
            "type": "check",
            "text": "Anastasiaの建物の入口を調査する (Letter from the mailbox, Tarkov Herald newspaper回収)"
          }
        ]
      },
      {
        "id": "aw_p6",
        "title": "Phase 6: 配達員Pasha (Customs)",
        "steps": [
          {
            "id": "aw_find_pasha",
            "type": "check",
            "text": "配達員Pashaを見つける",
            "hint": "Customs 2階寮の裏、壊れた自転車と散らばった鞄の場面（Wiki）"
          },
          {
            "id": "aw_ambush_search",
            "type": "check",
            "text": "待ち伏せ地点を捜索する (Unsealed envelope, FIR。Customs寮裏の自転車付近)"
          }
        ]
      },
      {
        "id": "aw_p7",
        "title": "Phase 7: 報告とReshala",
        "steps": [
          {
            "id": "aw_report_skier_2",
            "type": "check",
            "text": "Skierに報告する"
          },
          {
            "id": "aw_reshala_hideout",
            "type": "check",
            "text": "Reshalaから鍵を受け取り、Customsの寮の隠れ家を調べる",
            "hint": "メモ2点は画像が欠けておりWikiで未確認"
          },
          {
            "id": "aw_kill_reshala",
            "type": "check",
            "text": "Reshalaを見つけて排除する",
            "optional": true
          },
          {
            "id": "aw_reshala_key",
            "type": "check",
            "text": "Reshalaの隠れ家の鍵を入手する",
            "optional": true
          },
          {
            "id": "aw_reshala_search",
            "type": "check",
            "text": "Reshalaの隠れ家を調査する (Note with an address, FIR)"
          },
          {
            "id": "aw_reshala_work_note",
            "type": "check",
            "text": "Reshalaの仕事メモを入手する (Note with a warning)",
            "optional": true
          },
          {
            "id": "aw_pasha_items",
            "type": "check",
            "text": "配達員Pashaの持ち物を入手する (Letter from Reshala's bunkhouse)",
            "optional": true
          }
        ]
      },
      {
        "id": "aw_p8",
        "title": "Phase 8: Kozlovの証拠 (Shoreline)",
        "steps": [
          {
            "id": "aw_kozlov_hideout",
            "type": "check",
            "text": "Kozlovの隠れ家を特定する (Shoreline西の村、house no. 3)",
            "hint": "Shoreline西の村。ドアが吹き飛ばされ、シャベルが地面に刺さっている家（Wiki）"
          },
          {
            "id": "aw_kozlov_evidence",
            "type": "check",
            "text": "シャベルのそばの花壇からテープを回収する"
          },
          {
            "id": "aw_play_tape",
            "type": "check",
            "text": "テープを再生する（これでタスク完了）",
            "hint": "脱出後でも再生できる（Wiki）。実績「Pay Your Debt」"
          },
          {
            "id": "aw_anastasia_photo",
            "type": "check",
            "text": "Anastasiaの写真付き新聞記事を入手する",
            "optional": true
          }
        ]
      }
    ]
  },
  {
    "id": "the_labyrinth",
    "title": "The Labyrinth",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/The_Labyrinth_(story_chapter)",
    "description": "TerraGroupの地下施設「The Labyrinth」への侵入と探索。",
    "category": "side",
    "unlockCondition": "ShorelineでThe Labyrinthへのトランジットを発見 (Health Resort西館地下、Knossos LLC facility key必要)",
    "phases": [
      {
        "id": "tl_p1",
        "title": "Phase 1: 初期連絡",
        "steps": [
          {
            "id": "tl_ask_jaeger",
            "type": "check",
            "text": "トレーダーに地下施設について尋ねる (Jaegerと話す)",
            "hint": "開始条件: Knossos LLC施設キーのドアを開けて、Labyrinthのトランジット地点に到達する（入る必要はない）（Wiki）"
          },
          {
            "id": "tl_ask_therapist",
            "type": "check",
            "text": "Therapistに地下施設へのアクセス方法を聞く",
            "optional": true
          }
        ]
      },
      {
        "id": "tl_p2",
        "title": "Phase 2: キーカード待ち",
        "steps": [
          {
            "id": "tl_wait_keycard",
            "type": "wait",
            "text": "Jaegerがキーカードを集めるのを待つ",
            "duration": "数日（実時間かゲーム内かは未確認。終了条件も不明）",
            "hint": "待機後、JaegerからLabrysのアクセスキーカードが2枚届く。Jaeger LL1でも1枚取引できる（Wiki）"
          }
        ]
      },
      {
        "id": "tl_p3",
        "title": "Phase 3: 施設調査 — BEAR部隊",
        "steps": [
          {
            "id": "tl_bear_fate",
            "type": "check",
            "text": "BEAR部隊に何が起きたか解明する",
            "reference": true,
            "hint": "Wikiでは独立目標ではなく、以降の探索の総称"
          },
          {
            "id": "tl_find_entrance",
            "type": "check",
            "text": "リゾートの地下入口を見つけて施設に入る"
          },
          {
            "id": "tl_access_facility",
            "type": "check",
            "text": "施設に入る（Labrysキーカード）"
          },
          {
            "id": "tl_bear_traces",
            "type": "check",
            "text": "The LabyrinthでBEAR部隊の痕跡を探す",
            "hint": "蒸気室の先の飯盒にある命令書で進む。名称は資料で表記が異なる（Recy / Leshy）"
          },
          {
            "id": "tl_item1156_area",
            "type": "check",
            "text": "BEARの再集結地点を調べる（中央の集合室）"
          },
          {
            "id": "tl_find_commander",
            "type": "check",
            "text": "部隊長を探す（Ariadne's Path脱出付近の倒れたPMC）",
            "hint": "旧資料の「拷問部屋」とは場所が異なる（Wikiを優先）"
          },
          {
            "id": "tl_bear_diary",
            "type": "check",
            "text": "部隊の追加情報を集める",
            "hint": "倒れた研究員の文書3つ＋中央の集合室の机のコンピュータの1156メモ（トラクター付近の場所も挙がる）"
          },
          {
            "id": "tl_5_bodies",
            "type": "check",
            "text": "5人の研究員の遺体を調査する (各遺体のノート5つ。ノート#4にはObservation room key必要)",
            "optional": true,
            "hint": "Wikiでは任意目標（研究員の遺体）"
          },
          {
            "id": "tl_office_tape",
            "type": "check",
            "text": "施錠されたオフィスに入り、オーディオテープを聴く"
          }
        ]
      },
      {
        "id": "tl_p4",
        "title": "Phase 4: オーディオテープ",
        "steps": [
          {
            "id": "tl_listen_tape",
            "type": "check",
            "text": "オフィスのオーディオテープを聴く (Deceased scientist's audio tape, FIR。Observation room内)"
          },
          {
            "id": "tl_give_tape",
            "type": "check",
            "text": "Jaegerにオーディオテープを渡す"
          }
        ]
      },
      {
        "id": "tl_p5",
        "title": "Phase 5: 研究レポート",
        "steps": [
          {
            "id": "tl_read_report",
            "type": "check",
            "text": "The Labyrinthの研究レポートを読む",
            "hint": "入手が必須か任意かは資料内で矛盾"
          },
          {
            "id": "tl_find_report",
            "type": "check",
            "text": "Labyrinth施設の研究レポートを見つけて入手する (Labyrinth facility research report, FIR。Shorelineの桟橋横の排水管)",
            "optional": true,
            "hint": "Shoreline南の桟橋、下水管付近に出現（Wiki）。任意目標としては「入手」、必須目標としては「読む」"
          }
        ]
      }
    ]
  },
  BOREAS_CHAPTER,
]
