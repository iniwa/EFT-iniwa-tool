// メインストーリーチャプターデータ (Tour, Falling Skies, The Ticket)
// NIWA-226: 日本語Wiki「ストーリータスク」(2026-11-21〜23更新) と照合して再構成。
// step.reference=true は確証が薄く進捗の必須条件にしない。step.hint は根拠・不一致の注記。showIf は配列でAND条件。
export const MAIN_CHAPTERS = [
  {
    "id": "tour",
    "title": "Tour",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/Tour",
    "description": "Escape from Tarkovの主要ストーリーライン。各マップへのアクセス権を確保しながら、Tarkovからの脱出方法を探る旅。",
    "category": "main",
    "unlockCondition": "ゲーム開始時に自動追加",
    "phases": [
      {
        "id": "tour_p1",
        "title": "Phase 1: Ground Zero脱出",
        "steps": [
          {
            "id": "t_gz_extract",
            "type": "check",
            "text": "Ground Zero（短縮チュートリアル）を完了して脱出する"
          },
          {
            "id": "t_gz_note",
            "type": "note",
            "text": "時間切れでチュートリアルをやり直せなかった場合は、通常のGround Zero脱出が目標に追加されます。"
          }
        ]
      },
      {
        "id": "tour_p2",
        "title": "Phase 2: Therapist — Streets of Tarkov",
        "steps": [
          {
            "id": "t_therapist_talk",
            "type": "check",
            "text": "Therapistと話す"
          },
          {
            "id": "t_therapist_pay",
            "type": "check",
            "text": "Therapistに代金を渡してStreets of Tarkovを解放する",
            "hint": "金額はWikiに記載なし（旧資料: 250,000ルーブル）"
          },
          {
            "id": "t_therapist_money",
            "type": "check",
            "text": "必要な代金を集める（旧資料: 250,000ルーブル）",
            "optional": true
          }
        ]
      },
      {
        "id": "tour_p3",
        "title": "Phase 3: Ragman — Interchange",
        "steps": [
          {
            "id": "t_ragman_talk",
            "type": "check",
            "text": "Ragmanと話す（Therapistへの支払い後）"
          },
          {
            "id": "t_interchange_extract_confirmed",
            "type": "check",
            "text": "Interchangeから脱出する",
            "hint": "通り抜け（run-through）脱出でも数えられるとWikiに記載。旧資料の「3回訪問」はWikiに無いため削除"
          },
          {
            "id": "t_ragman_report",
            "type": "check",
            "text": "偵察で見つけたものをRagmanに報告する"
          }
        ]
      },
      {
        "id": "tour_p4",
        "title": "Phase 4: Skier — Customs",
        "steps": [
          {
            "id": "t_skier_talk1",
            "type": "check",
            "text": "Skierと話す（Interchange報告後）"
          },
          {
            "id": "t_customs_extract_confirmed",
            "type": "check",
            "text": "Customsから脱出する",
            "hint": "通り抜け（run-through）脱出でも数えられるとWikiに記載。旧資料の「3回訪問」はWikiに無いため削除"
          },
          {
            "id": "t_skier_materials",
            "type": "check",
            "text": "Skierに建築資材カテゴリのアイテムを5つ渡す",
            "hint": "建築資材5つ（Wikiに「FIR」の記載なし）"
          },
          {
            "id": "t_find_materials",
            "type": "check",
            "text": "建築資材カテゴリのアイテムを5つ見つける",
            "optional": true
          }
        ]
      },
      {
        "id": "tour_p5",
        "title": "Phase 5: Mechanic — Factory",
        "steps": [
          {
            "id": "t_mechanic_talk1",
            "type": "check",
            "text": "Mechanicと話す（Customs後）"
          },
          {
            "id": "t_factory_extract_confirmed",
            "type": "check",
            "text": "Factoryから脱出する",
            "hint": "通り抜け（run-through）脱出でも数えられるとWikiに記載。旧資料の「3回訪問」はWikiに無いため削除"
          },
          {
            "id": "t_mechanic_weapons",
            "type": "check",
            "text": "Mechanicにレイドで見つけた武器を2つ渡す",
            "hint": "NPCから得た使用済み武器も受け取ってもらえる（Wiki）"
          },
          {
            "id": "t_find_weapons",
            "type": "check",
            "text": "レイドで武器を2つ見つける",
            "optional": true
          }
        ]
      },
      {
        "id": "tour_p6",
        "title": "Phase 6: Skier — Woods",
        "steps": [
          {
            "id": "t_skier_talk2",
            "type": "check",
            "text": "Skierと話す（Factory後）"
          },
          {
            "id": "t_prapor_talk1",
            "type": "check",
            "text": "Praporと話す（Factory後）",
            "hint": "Wikiでは「SkierとPraporと話す」がFactory後の目標"
          },
          {
            "id": "t_woods_kills",
            "type": "check",
            "text": "Woodsで何でもよいターゲットを3体排除する",
            "hint": "プレイヤー・Scav・PMC・Rogue USEC・ボスのどれでも数えられる（Wiki）"
          },
          {
            "id": "t_woods_extract_confirmed",
            "type": "check",
            "text": "Woodsから脱出する",
            "hint": "通り抜け（run-through）脱出でも数えられるとWikiに記載。旧資料の「3回訪問」はWikiに無いため削除。生還脱出が必要かはWikiで未明記"
          }
        ]
      },
      {
        "id": "tour_p7",
        "title": "Phase 7: Terminal (Shoreline)",
        "steps": [
          {
            "id": "t_terminal_entrance",
            "type": "check",
            "text": "Terminalへの入口を探す",
            "hint": "Road to Customs側の監視塔の先から接近。地雷原の警告看板の先は死亡、Terminalの狙撃手を撃つと砲塔に撃たれる（Wiki）。生還脱出が必要かは未明記"
          },
          {
            "id": "t_terminal_contact",
            "type": "check",
            "text": "内側の兵士と連絡を取る"
          },
          {
            "id": "t_terminal_intercom",
            "type": "check",
            "text": "インターコムで港の守備隊に連絡する"
          },
          {
            "id": "t_terminal_info",
            "type": "check",
            "text": "Tarkovから出る方法について話を聞く"
          }
        ]
      },
      {
        "id": "tour_p8",
        "title": "Phase 8: マップアクセス確保",
        "steps": [
          {
            "id": "t_shoreline_extract_confirmed",
            "type": "check",
            "text": "Shorelineから脱出する",
            "hint": "通り抜け（run-through）脱出でも数えられるとWikiに記載。旧資料の「3回訪問」はWikiに無いため削除"
          },
          {
            "id": "t_prapor_dogtags",
            "type": "check",
            "text": "PraporにPMCドッグタグを5つ渡す（Reserve解放）",
            "hint": "FIR要否はWikiに記載なし"
          },
          {
            "id": "t_find_dogtags",
            "type": "check",
            "text": "PMCドッグタグ(FIR)を5つ見つける",
            "optional": true
          },
          {
            "id": "t_mechanic_dollars",
            "type": "check",
            "text": "MechanicにUSDを渡す（Lighthouse解放）",
            "hint": "金額はWikiに記載なし（旧資料: 20,000ドル）"
          },
          {
            "id": "t_find_dollars",
            "type": "check",
            "text": "必要なUSDを集める（旧資料: 20,000ドル）",
            "optional": true
          }
        ]
      },
      {
        "id": "tour_p9",
        "title": "Phase 9: The Lab",
        "steps": [
          {
            "id": "t_lab_infiltrate",
            "type": "check",
            "text": "Transit経由でThe Labに入る（FactoryまたはStreets of Tarkovから）"
          },
          {
            "id": "t_lab_keycard",
            "type": "check",
            "text": "施設に入るためのキーカードまたはアクセスコードを入手する",
            "optional": true,
            "hint": "キーカードやアクセスコードを拾うと、経路探索の目標が追加される（Wiki）"
          },
          {
            "id": "t_lab_factory_entrance",
            "type": "check",
            "text": "Factoryでの入り口を特定する",
            "optional": true
          },
          {
            "id": "t_lab_streets_entrance",
            "type": "check",
            "text": "Streets of Tarkovでの入り口を特定する",
            "optional": true
          },
          {
            "id": "t_lab_offices",
            "type": "check",
            "text": "The Lab: 最上部の管理区画を調べる",
            "parallel": true,
            "hint": "Wikiの「Lab探索」節は空欄。位置は旧資料ベース（参考）"
          },
          {
            "id": "t_lab_server",
            "type": "check",
            "text": "The Lab: サーバールームを調べる",
            "parallel": true
          },
          {
            "id": "t_lab_drainage",
            "type": "check",
            "text": "The Lab: 排水路の脱出ルートを特定する",
            "parallel": true
          },
          {
            "id": "t_lab_end",
            "type": "note",
            "text": "Tourはここまで。Wikiには後続チャプターへの分岐・実績の記載はありません。"
          }
        ]
      }
    ]
  },
  {
    "id": "falling_skies",
    "title": "Falling Skies",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/Falling_Skies",
    "description": "墜落した謎の飛行機と、それに関わる陰謀を追うチャプター。",
    "category": "main",
    "unlockCondition": "Tour進行中にMechanicと墜落機について話すと解放",
    "phases": [
      {
        "id": "fs_p1",
        "title": "Phase 1: 墜落機の発見",
        "steps": [
          {
            "id": "fs_find_crash",
            "type": "check",
            "text": "Woodsで墜落した飛行機を発見する",
            "hint": "開始条件はWikiで未確認（Mechanicとの会話でも始まるかは不明）"
          }
        ]
      },
      {
        "id": "fs_p2",
        "title": "Phase 2: Praporへの報告",
        "steps": [
          {
            "id": "fs_prapor_talk1",
            "type": "check",
            "text": "Praporと話す",
            "reference": true,
            "hint": "Wikiでは独立目標ではなく、聞き込みの一部"
          }
        ]
      },
      {
        "id": "fs_p3",
        "title": "Phase 3: ロイヤリティ要件",
        "steps": [
          {
            "id": "fs_prapor_ll2",
            "type": "check",
            "text": "Prapor LL2以上に到達する",
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）。ロイヤリティ条件は確認できていない"
          },
          {
            "id": "fs_ll2_note",
            "type": "note",
            "text": "Wikiには、Standard / Left Behind版では推奨しないという注記があります（理由は未記載）。"
          }
        ]
      },
      {
        "id": "fs_p4",
        "title": "Phase 4: トレーダー聞き込み",
        "steps": [
          {
            "id": "fs_ask_traders",
            "type": "check",
            "text": "トレーダーたちに墜落機について尋ねる (Prapor, Therapist, Skier, Mechanic, Jaeger)"
          }
        ]
      },
      {
        "id": "fs_p5",
        "title": "Phase 5: SUVフラッシュドライブ",
        "steps": [
          {
            "id": "fs_therapist_suv",
            "type": "check",
            "text": "Therapistにお金を渡してSUV情報を得る",
            "optional": true,
            "hint": "通貨（$/₽）と、支払いが必須かはWikiで未確定"
          },
          {
            "id": "fs_suv_flash",
            "type": "check",
            "text": "ShorelineのG-Wagon SUV(トンネル脱出付近)からフラッシュドライブを回収する",
            "hint": "正しいG-Wagonを探す。フラッシュドライブの出現位置は複数でランダム（Wiki）"
          },
          {
            "id": "fs_flash_prapor",
            "type": "check",
            "text": "Praporにフラッシュドライブを渡す"
          }
        ]
      },
      {
        "id": "fs_p6",
        "title": "Phase 6: Prapor待ち (1)",
        "steps": [
          {
            "id": "fs_wait1",
            "type": "wait",
            "text": "Praporからの連絡を待つ",
            "duration": "約1時間"
          }
        ]
      },
      {
        "id": "fs_p7",
        "title": "Phase 7: フライトレコーダー",
        "steps": [
          {
            "id": "fs_flight_recorder",
            "type": "check",
            "text": "Woodsの墜落機からフライトレコーダーを回収する"
          },
          {
            "id": "fs_hide_recorder",
            "type": "check",
            "text": "Shoreline南西の小島の家に、フライトレコーダーを設置する（約5秒）"
          }
        ]
      },
      {
        "id": "fs_p8",
        "title": "Phase 8: 物資納品",
        "steps": [
          {
            "id": "fs_prapor_visit",
            "type": "check",
            "text": "Praporを訪ねる"
          },
          {
            "id": "fs_batteries",
            "type": "check",
            "text": "Rechargeable battery (FIR) x3を渡す",
            "parallel": true,
            "hint": "暗号解読用アイテム3種の名称はWikiに無い。旧資料に基づく（各1つ揃うと渡せる）"
          },
          {
            "id": "fs_pcb",
            "type": "check",
            "text": "Printed circuit board (FIR) x5を渡す",
            "parallel": true,
            "hint": "旧資料に基づく数量"
          },
          {
            "id": "fs_toolset",
            "type": "check",
            "text": "Toolset (FIR) x2を渡す",
            "parallel": true,
            "hint": "旧資料に基づく数量"
          }
        ]
      },
      {
        "id": "fs_p9",
        "title": "Phase 9: Prapor待ち (2)",
        "steps": [
          {
            "id": "fs_wait2",
            "type": "wait",
            "text": "Praporからの連絡を待つ",
            "duration": "3〜5時間"
          }
        ]
      },
      {
        "id": "fs_p10",
        "title": "Phase 10: 証拠品の回収",
        "steps": [
          {
            "id": "fs_transcript",
            "type": "check",
            "text": "パイロットの記録（乗員の記録）を渡す",
            "parallel": true,
            "hint": "場所: ShorelineのカビたWikiの家（旧資料: Chairman's House）"
          },
          {
            "id": "fs_secure_flash",
            "type": "check",
            "text": "Elektronikの暗号化フラッシュドライブを渡す",
            "parallel": true
          }
        ]
      },
      {
        "id": "fs_p11",
        "title": "Phase 11: Prapor待ち (3) + 質問",
        "steps": [
          {
            "id": "fs_wait3",
            "type": "wait",
            "text": "Praporからの連絡を待つ",
            "duration": "1〜3時間"
          },
          {
            "id": "fs_transcript_read",
            "type": "choice",
            "text": "Praporの質問: トランスクリプトを読んだか？",
            "options": [
              {
                "value": "yes",
                "label": "はい (報酬: 300,000ルーブル)"
              },
              {
                "value": "no",
                "label": "いいえ (報酬なし)"
              }
            ],
            "reference": true,
            "hint": "Wikiに記載なし（旧資料の質問）"
          }
        ]
      },
      {
        "id": "fs_p12",
        "title": "Phase 12: Armored Case回収",
        "steps": [
          {
            "id": "fs_armored_case",
            "type": "check",
            "text": "Woodsの墜落機(コックピット後方)からArmored Caseを回収する"
          },
          {
            "id": "fs_extra_clue",
            "type": "check",
            "text": "追加の手がかりを探す (Mr. Kermanのメモ、パイロット席上)",
            "optional": true
          }
        ]
      },
      {
        "id": "fs_p13",
        "title": "Phase 13: 最終選択 (重要な分岐点)",
        "steps": [
          {
            "id": "fs_case_warning",
            "type": "note",
            "text": "⚠️ これは取り返しのつかない重要な選択です。The Ticketチャプターのルートに影響します。"
          },
          {
            "id": "fs_case_choice",
            "type": "choice",
            "text": "Armored Caseの扱いを選ぶ（取り消し不可・The Ticketの序盤ルートに連動）",
            "options": [
              {
                "value": "give",
                "label": "Praporに渡す（Wiki: 報酬1,000,000₽。旧資料は1,500,000₽で不一致）"
              },
              {
                "value": "keep",
                "label": "自分で持つ（Praporの信頼度 -0.3。4x4のケースをスタッシュに保持。The TicketはMechanicルート）"
              },
              {
                "value": "pretend",
                "label": "見つけなかったと偽って渡す（旧資料のみ・Wikiに記載なし。The TicketではPraporルート扱い）"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "the_ticket",
    "title": "The Ticket",
    "wikiLink": "https://escapefromtarkov.fandom.com/wiki/The_Ticket",
    "description": "Armored Caseの謎を解き明かし、Tarkovからの脱出を目指す最終章。4つのエンディングに分岐する。",
    "category": "main",
    "unlockCondition": "Falling Skies完了後",
    "phases": [
      {
        "id": "tt_p1",
        "title": "Phase 1: 共通開始",
        "steps": [
          {
            "id": "tt_route_choice",
            "type": "choice",
            "text": "Falling Skiesでの選択に基づくルート (自動連動 / 手動変更可)",
            "options": [
              {
                "value": "prapor",
                "label": "Praporルート — ケースをPraporに渡した (give/pretend)"
              },
              {
                "value": "mechanic",
                "label": "Mechanicルート — ケースを保持した (keep)"
              }
            ],
            "hint": "Falling Skiesの正規の3選択肢から自動連動。保存値が未知の場合は上書きしません（手動で選べます）"
          },
          {
            "id": "tt_intel_center",
            "type": "check",
            "text": "HideoutにIntelligence Center Lv1を設置する"
          },
          {
            "id": "tt_kerman_talk1",
            "type": "check",
            "text": "Mr. Kermanと話す"
          },
          {
            "id": "tt_kerman_wait1",
            "type": "wait",
            "text": "Mr. Kermanからの連絡を待つ",
            "duration": "4〜12時間（旧資料）",
            "reference": true,
            "hint": "待ち時間はWikiに記載なし（旧資料）"
          },
          {
            "id": "tt_prapor_talk1",
            "type": "check",
            "text": "Praporと話す",
            "reference": true,
            "hint": "Wikiの共通開始には記載なし"
          },
          {
            "id": "tt_kerman_talk2",
            "type": "check",
            "text": "Mr. Kermanと話す"
          }
        ]
      },
      {
        "id": "tt_p2",
        "title": "Phase 2: Praporルート (ケースをPraporに渡した場合のみ)",
        "steps": [
          {
            "id": "tt_prapor_camp",
            "type": "check",
            "text": "LighthouseにあるPraporの部下のキャンプを捜索する",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            }
          },
          {
            "id": "tt_prapor_clue",
            "type": "check",
            "text": "Praporの部下の意図に関する手がかりを見つける (Note from Prapor's men, FIR)",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            }
          },
          {
            "id": "tt_kerman_talk3",
            "type": "check",
            "text": "Mr. Kermanと話す",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            },
            "hint": "この段階で「To the Light - Trust but Verify」が解放される（Wiki）"
          },
          {
            "id": "tt_lightkeeper_access",
            "type": "check",
            "text": "Lightkeeperへのアクセス権を得る (Network Providerクエストラインが必要)",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            },
            "hint": "前提クエストはWikiに記載なし"
          },
          {
            "id": "tt_lightkeeper_talk1",
            "type": "check",
            "text": "Lightkeeperと話す",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            }
          },
          {
            "id": "tt_lightkeeper_rep",
            "type": "check",
            "text": "Lightkeeperとの良好な関係を維持する",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            },
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          },
          {
            "id": "tt_blue_folders",
            "type": "check",
            "text": "TerraGroup「Blue Folders」materials x3を入手する",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            },
            "hint": "先にLightkeeperと話す。渡せるのは別レイドで、3つまとめて渡す（Wiki）"
          },
          {
            "id": "tt_blue_folders_give",
            "type": "check",
            "text": "LightkeeperにBlue Foldersを渡す",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            }
          },
          {
            "id": "tt_ultra_flare",
            "type": "check",
            "text": "InterchangeのULTRA正面入口で黄色フレアを使う",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            }
          },
          {
            "id": "tt_interchange_kills_survived",
            "type": "check",
            "text": "死なずに1レイドでInterchangeの敵を15体排除する",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            }
          },
          {
            "id": "tt_lightkeeper_case",
            "type": "check",
            "text": "Lightkeeperからケースを受け取る",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "prapor"
            },
            "hint": "特殊スロット3つが全て埋まっていると受け取れない（Wiki）"
          }
        ]
      },
      {
        "id": "tt_p3",
        "title": "Phase 3: ケース開封",
        "steps": [
          {
            "id": "tt_mechanic_consult",
            "type": "check",
            "text": "Mechanicに相談する"
          },
          {
            "id": "tt_signal_jammer",
            "type": "check",
            "text": "The Labで「Experimental signal jammer」を見つける",
            "hint": "The Labのランダム出現（住居区画の机・円卓付近・会議室の机の3か所）。住居区画はゾンビイベント中のみ開放（Wiki）"
          },
          {
            "id": "tt_lab_access",
            "type": "check",
            "text": "The Labへのアクセスを確保する",
            "optional": true
          },
          {
            "id": "tt_lab_keycard",
            "type": "check",
            "text": "TerraGroup Labs access keycardを入手する",
            "optional": true
          },
          {
            "id": "tt_unlock_case",
            "type": "check",
            "text": "Experimental signal jammerでケースのロックを解除する"
          },
          {
            "id": "tt_case_workbench",
            "type": "wait",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "mechanic"
            },
            "text": "作業台Lv1でケースを解錠する（Mechanicルート）",
            "duration": "約55時間（燃料切れでリセット）"
          },
          {
            "id": "tt_open_case",
            "type": "check",
            "text": "Armored Caseを開封する"
          },
          {
            "id": "tt_get_ticket",
            "type": "check",
            "text": "「Ticket」(Kruglov's RFID keycard)を入手する"
          },
          {
            "id": "tt_read_instructions",
            "type": "check",
            "text": "ケース内の指示書を読む",
            "hint": "ケースの取扱説明（RFID）。クエストアイテム、またはハンドブックでRFIDを検索して確認できる（Wiki）"
          },
          {
            "id": "tt_kerman_contact",
            "type": "check",
            "text": "Mr. Kermanに連絡する"
          }
        ]
      },
      {
        "id": "tt_p4",
        "title": "Phase 4: Kermanの申し出 (重要な分岐)",
        "steps": [
          {
            "id": "tt_kerman_offer",
            "type": "choice",
            "text": "Kermanの申し出に協力を続けるか、断るか",
            "options": [
              {
                "value": "accept",
                "label": "協力を続ける（Survivor / Savior / Fallen / Debtor 系へ）"
              },
              {
                "value": "refuse",
                "label": "断る（Survivor 系へ。ポートの門へ向かう）"
              }
            ]
          }
        ]
      },
      {
        "id": "tt_p5a",
        "title": "Phase 5a: 協力を続ける — 暗号化デバイスとカード準備",
        "steps": [
          {
            "id": "tt_accept_offer",
            "type": "check",
            "text": "Mr. Kermanの申し出を受ける",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            }
          },
          {
            "id": "tt_rfid_route",
            "type": "choice",
            "text": "RFID暗号化装置の目標がどう進んだか",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            },
            "hint": "KermanはThe Labを案内しますが、現地での入手は未確認です。失敗の表示後にMechanic経由で入手する手順が報告されています。",
            "options": [
              {
                "value": "lab",
                "label": "The Labでの入手がゲーム内で記録された"
              },
              {
                "value": "elektronik",
                "label": "入手目標が失敗し、Mechanicの代替手順に進んだ"
              }
            ]
          },
          {
            "id": "tt_kerman_talk4",
            "type": "check",
            "text": "Mr. Kermanと話す",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ]
          },
          {
            "id": "tt_mechanic_talk2",
            "type": "check",
            "text": "Mechanicと話す",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ]
          },
          {
            "id": "tt_mechanic_wait",
            "type": "wait",
            "text": "Mechanicからの返答を待つ",
            "duration": "12〜24時間（旧資料）",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ],
            "reference": true,
            "hint": "Wikiに待ち時間の記載なし（旧資料）"
          },
          {
            "id": "tt_bitcoin_pay",
            "type": "check",
            "text": "Mechanicに Physical Bitcoin x40を渡す",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ],
            "hint": "Physical Bitcoin 40個でElektronikの鍵を受け取る（Wiki）"
          },
          {
            "id": "tt_bitcoin_farm",
            "type": "check",
            "text": "Bitcoin Farm Lv1を設置する",
            "optional": true,
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ]
          },
          {
            "id": "tt_bitcoin_collect",
            "type": "check",
            "text": "Physical Bitcoin x40を用意する",
            "optional": true,
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ]
          },
          {
            "id": "tt_streets_access",
            "type": "check",
            "text": "Streets of Tarkovへのアクセスを確保する",
            "optional": true,
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ]
          },
          {
            "id": "tt_kruglov_apt",
            "type": "check",
            "text": "StreetsのKruglovのアパートにアクセスする",
            "optional": true,
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            }
          },
          {
            "id": "tt_rfid_device",
            "type": "check",
            "text": "RFID card encryption deviceを入手する (Streets, Klimov 14A)",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ],
            "hint": "40 BTCの支払い後に受け取ったElektronikの鍵を使い、Klimova 14Aの2番目の部屋で探す（Wiki）。"
          },
          {
            "id": "tt_rfid_retrieve",
            "type": "check",
            "text": "RFID card encryption deviceを回収する",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_rfid_route",
                "value": "elektronik"
              }
            ],
            "reference": true,
            "hint": "RFID card encryption deviceの入手と重複（旧資料）"
          },
          {
            "id": "tt_lab_access2",
            "type": "check",
            "text": "The Labへのアクセスを確保する",
            "optional": true,
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            }
          },
          {
            "id": "tt_lab_master_pass",
            "type": "check",
            "text": "Laboratory master passを入手する",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            },
            "hint": "The LabのKruglovのオフィス、または中心部のTerraGroup職員棟の彼のアパートを探す（Wiki）"
          },
          {
            "id": "tt_blank_rfid",
            "type": "check",
            "text": "Blank RFID keycardを入手する",
            "optional": true,
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            }
          },
          {
            "id": "tt_solar_power",
            "type": "check",
            "text": "Solar Power Lv1を設置する",
            "optional": true,
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            }
          },
          {
            "id": "tt_activate_rfid",
            "type": "check",
            "text": "Intelligence Centerで空のRFIDキーカードを有効化する",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            },
            "hint": "Kermanとの会話でレシピが解放され、Lv1で作成できる（Wiki）"
          },
          {
            "id": "tt_activate_kruglov",
            "type": "check",
            "text": "Laboratory master passでKruglovのキーカードを有効化する",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            },
            "reference": true,
            "hint": "RFIDカードの有効化と対象が重複（資料により表現が異なる）"
          },
          {
            "id": "tt_terminal_go",
            "type": "check",
            "text": "ShorelineのTerminal入口へ行く",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            },
            "reference": true,
            "hint": "最終のTerminal段階と重複"
          },
          {
            "id": "tt_terminal_swipe",
            "type": "check",
            "text": "インターコムリーダーにキーカードをスワイプする",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            },
            "reference": true,
            "hint": "最終のTerminal段階と重複"
          }
        ]
      },
      {
        "id": "tt_p5a2",
        "title": "Phase 5a-2: 証拠収集の選択",
        "steps": [
          {
            "id": "tt_evidence_agree",
            "type": "choice",
            "text": "TerraGroupの証拠を集めるか",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "accept"
            },
            "options": [
              {
                "value": "agree",
                "label": "集める（Debtor / Survivor / Savior 系）"
              },
              {
                "value": "refuse",
                "label": "集めない（Fallen 系）"
              }
            ]
          }
        ]
      },
      {
        "id": "tt_p6a",
        "title": "Phase 6a: 証拠収集 — 主要証拠2つ",
        "steps": [
          {
            "id": "tt_kerman_talk5",
            "type": "check",
            "text": "Mr. Kermanと話す",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "agree"
            }
          },
          {
            "id": "tt_agree_evidence",
            "type": "check",
            "text": "TerraGroupの証拠収集に合意する",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "agree"
            }
          },
          {
            "id": "tt_major_evidence_2",
            "type": "check",
            "text": "主要証拠2つを集めてKermanに届ける",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "agree"
            },
            "hint": "分岐選択前の段階。協力継続ルートで必要になるのは8つ"
          },
          {
            "id": "tt_intel_center3",
            "type": "check",
            "text": "Intelligence Center Lv3を設置する",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "agree"
            },
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          },
          {
            "id": "tt_minor_evidence",
            "type": "check",
            "text": "副次的証拠（青い背景）36個を届ける。届けても実績のみ解放",
            "optional": true,
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "agree"
            },
            "hint": "Wikiの個数は36（旧資料は32）"
          },
          {
            "id": "tt_cooperation",
            "type": "choice",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "agree"
            },
            "text": "証拠収集のあと、Kermanに協力を続けるか",
            "hint": "結末ラベルのSurvivor/Debtorが複数分岐に出てくる点はWiki自体が未整理",
            "options": [
              {
                "value": "expose",
                "label": "協力を続けてTerraGroupを告発する（Survivor / Savior 系）"
              },
              {
                "value": "leave",
                "label": "協力をやめて、自力で脱出の道を探す（Debtor）"
              }
            ]
          }
        ]
      },
      {
        "id": "tt_p6a_expose",
        "title": "Phase 6a-A: 協力を続ける（Savior / Survivor 系）",
        "steps": [
          {
            "id": "tt_major_evidence",
            "type": "check",
            "text": "主要証拠8つを集めてKermanに届ける",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            },
            "hint": "他のストーリータスクを進めて集める。残り1つはCardinalアパートの寝室の絵の裏の金庫（Lab黒キーカード）（Wiki）"
          },
          {
            "id": "tt_alpha1_receive",
            "type": "check",
            "text": "Kermanからsecure container Alpha-1を受け取る",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            }
          },
          {
            "id": "tt_savior_confirm",
            "type": "check",
            "text": "Kermanに全証拠の提出を確認する",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            }
          },
          {
            "id": "tt_savior_wait",
            "type": "wait",
            "text": "Kermanの信頼できる連絡先からの連絡を待つ",
            "duration": "12〜24時間（Wiki: 8/31の変更注記）／旧40〜48時間 — 資料間で不一致",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            }
          },
          {
            "id": "tt_fence_talk1",
            "type": "check",
            "text": "Fenceと話す",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            }
          },
          {
            "id": "tt_fence_rep",
            "type": "check",
            "text": "Fenceとの信頼度を4.0にして追加タスクを開放する",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            }
          },
          {
            "id": "tt_woods_coop",
            "type": "check",
            "text": "Fenceの追加タスク（モードで内容が異なる）",
            "parallel": true,
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            },
            "reference": true,
            "hint": "PvP: Woods / Reserveで共同脱出。PvE: Shoreline・InterchangeでPMCを5人排除（Scav撃破でリセット）。Wiki上の記述で未検証"
          },
          {
            "id": "tt_reserve_coop",
            "type": "check",
            "text": "上記Fenceタスクの2か所目",
            "parallel": true,
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            },
            "reference": true,
            "hint": "前項と同じ追加タスクの一部"
          },
          {
            "id": "tt_btr_rep",
            "type": "check",
            "text": "BTR Driverとの信頼度を0.4にする",
            "parallel": true,
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            },
            "hint": "「Choose Your Friends Wisely」を完了済みだと、この分岐が拒否ルートに切り替わる（Wiki・未検証）"
          },
          {
            "id": "tt_fence_report",
            "type": "check",
            "text": "Fenceに完了を報告する",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            },
            "reference": true,
            "hint": "旧資料のみ"
          },
          {
            "id": "tt_fence_talk2",
            "type": "check",
            "text": "Fenceと話す",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            },
            "reference": true,
            "hint": "旧資料のみ"
          },
          {
            "id": "tt_solar_expose",
            "type": "check",
            "text": "Hideoutにソーラーパネルを設置する（キーカード作成に必要）",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "expose"
            }
          }
        ]
      },
      {
        "id": "tt_p6a_leave",
        "title": "Phase 6a-B: 協力をやめる（Debtor）",
        "steps": [
          {
            "id": "tt_debtor_ask_lightkeeper",
            "type": "check",
            "text": "Lightkeeperと話し、脱出方法を尋ねる",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_evidence_agree",
                "value": "agree"
              },
              {
                "stepId": "tt_cooperation",
                "value": "leave"
              }
            ]
          },
          {
            "id": "tt_debtor_maps",
            "type": "check",
            "text": "5つのマップの地形図を各1つ集める",
            "optional": false,
            "parallel": true,
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            },
            "hint": "一部の出現位置はWikiで未確認"
          },
          {
            "id": "tt_debtor_record",
            "type": "check",
            "text": "Intelligence Centerで特製フラッシュドライブを作る",
            "optional": false,
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            }
          },
          {
            "id": "tt_debtor_flash",
            "type": "check",
            "text": "Lightkeeperにフラッシュドライブを渡す",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            }
          },
          {
            "id": "tt_debtor_pmc_kills",
            "type": "check",
            "text": "Woodsで30人のPMCを排除する",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            }
          },
          {
            "id": "tt_debtor_dogtags",
            "type": "check",
            "text": "Lightkeeperに100個のPMCドッグタグを渡す",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            }
          },
          {
            "id": "tt_debtor_dogtags_collect",
            "type": "check",
            "text": "PMCドッグタグを100個入手する",
            "optional": true,
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            }
          },
          {
            "id": "tt_debtor_amulets",
            "type": "check",
            "text": "聖なるアミュレット6つを集め、Lighthouse付近のマークされた部屋に置く",
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            },
            "hint": "Customs 1 / Reserve 3 / Streets 2（Wiki）"
          },
          {
            "id": "tt_debtor_amulets_collect",
            "type": "check",
            "text": "各マップのmarked roomからアミュレットを入手する (Customs, Streets x2, Reserve x3)",
            "optional": true,
            "showIf": {
              "stepId": "tt_cooperation",
              "value": "leave"
            }
          },
          {
            "id": "tt_debtor_receive_card",
            "type": "check",
            "text": "LightkeeperからTerminalのキーカードを受け取る",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_evidence_agree",
                "value": "agree"
              },
              {
                "stepId": "tt_cooperation",
                "value": "leave"
              }
            ],
            "hint": "再受け取りにはTerraGroup Blue Folders 1つ（1レイド1回）（Wiki）"
          }
        ]
      },
      {
        "id": "tt_p6b",
        "title": "Phase 6b: 証拠を集めない（Fallen）",
        "steps": [
          {
            "id": "tt_fallen_kerman",
            "type": "check",
            "text": "Mr. Kermanと話す",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            }
          },
          {
            "id": "tt_fallen_ask_traders",
            "type": "check",
            "text": "トレーダーたちにTarkovからの脱出方法を尋ねる",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            },
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          },
          {
            "id": "tt_fallen_electronics",
            "type": "check",
            "text": "Praporに軍用/先進電子部品 x50を渡す",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "mechanic"
            },
            "hint": "ケースをPraporに渡していないため、Praporが追加する3つの依頼の1つ。FIR不要（Wiki）"
          },
          {
            "id": "tt_fallen_container",
            "type": "check",
            "text": "Praporにセキュアコンテナ(Theta/Epsilon/Kappa)を渡す",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "mechanic"
            }
          },
          {
            "id": "tt_fallen_repair_kits",
            "type": "check",
            "text": "Praporに武器・アーマーリペアキット x40を渡す",
            "showIf": {
              "stepId": "tt_route_choice",
              "value": "mechanic"
            },
            "hint": "耐久度・FIR不問（Wiki）"
          },
          {
            "id": "tt_fallen_cargo",
            "type": "check",
            "text": "RB-PKPTSのバイオケース（Case with dangerous cargo）をPraporに渡す",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            }
          },
          {
            "id": "tt_fallen_cargo_find",
            "type": "check",
            "text": "Case with dangerous cargoを見つけて入手する",
            "optional": true,
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            }
          },
          {
            "id": "tt_fallen_prapor_report",
            "type": "check",
            "text": "Praporに報告する",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            },
            "reference": true,
            "hint": "Wikiに記載なし（旧資料）"
          },
          {
            "id": "tt_fallen_pay_million",
            "type": "check",
            "text": "Praporに1,000,000ドルを渡す",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            }
          },
          {
            "id": "tt_fallen_collect_million",
            "type": "check",
            "text": "必要な1,000,000ドルを集める",
            "optional": true,
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            }
          },
          {
            "id": "tt_fallen_wait",
            "type": "wait",
            "text": "Praporからの情報を待つ",
            "duration": "36〜48時間（旧資料）",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            },
            "reference": true,
            "hint": "Wikiに待ち時間の記載なし（旧資料）"
          },
          {
            "id": "tt_fallen_hashcode",
            "type": "check",
            "text": "Praporからハッシュコード入りのフラッシュドライブを受け取る",
            "showIf": {
              "stepId": "tt_evidence_agree",
              "value": "refuse"
            }
          },
          {
            "id": "tt_fallen_solar",
            "type": "check",
            "text": "Hideoutにソーラーパネルを設置する",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_evidence_agree",
                "value": "refuse"
              }
            ]
          },
          {
            "id": "tt_fallen_keycard",
            "type": "check",
            "text": "Praporのハッシュで再プログラムした最終キーカードを作る",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "accept"
              },
              {
                "stepId": "tt_evidence_agree",
                "value": "refuse"
              }
            ]
          }
        ]
      },
      {
        "id": "tt_p5b",
        "title": "Phase 5b: 断る（Survivor）",
        "steps": [
          {
            "id": "tt_survivor_terminal",
            "type": "check",
            "text": "ポートへ向かい、Terminalの入口に到達する",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "refuse"
            },
            "hint": "海岸沿いからのみ到達できる（Wiki）"
          },
          {
            "id": "tt_survivor_swipe",
            "type": "check",
            "text": "ゲート手前の道路のインターコムにキーカードをスワイプする",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "refuse"
            }
          },
          {
            "id": "tt_survivor_prapor",
            "type": "check",
            "text": "Praporと話す",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "refuse"
            }
          },
          {
            "id": "tt_survivor_pay",
            "type": "check",
            "text": "Praporに大金を渡す（Praporルート: 3億ルーブル / Mechanicルート: 5億ルーブル）",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "refuse"
            },
            "hint": "Kermanへの協力を断った場合の支払い。Falling Skiesでケースを渡したかどうかで金額が変わる（Wiki）。"
          },
          {
            "id": "tt_survivor_collect_rub",
            "type": "check",
            "text": "必要なルーブルを集める",
            "optional": true,
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "refuse"
            }
          },
          {
            "id": "tt_survivor_timed",
            "type": "check",
            "text": "Praporの時限タスクを全て完了する (時間制限あり)",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "refuse"
            },
            "reference": true,
            "hint": "時間制限の扱いはWikiでは72時間（実績条件）程度のみ。厳密な条件は未確認"
          },
          {
            "id": "tt_survivor_deliver_drive",
            "type": "check",
            "text": "Lab内の4種のTerraGroup報告フォルダのデータをフラッシュドライブに入れてPraporに渡す（Mechanicルート）",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "refuse"
              },
              {
                "stepId": "tt_route_choice",
                "value": "mechanic"
              }
            ],
            "hint": "旧資料のSSD保存と同等（Wikiではフラッシュドライブ）"
          },
          {
            "id": "tt_survivor_folders",
            "type": "check",
            "text": "各証拠フォルダを入手する (Reports, Staff, Developments, Finances)",
            "optional": true,
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "refuse"
              },
              {
                "stepId": "tt_route_choice",
                "value": "mechanic"
              }
            ]
          },
          {
            "id": "tt_survivor_kills_50",
            "type": "check",
            "text": "Streets of Tarkovで50人のターゲットを排除する",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "refuse"
              },
              {
                "stepId": "tt_route_choice",
                "value": "mechanic"
              }
            ]
          },
          {
            "id": "tt_survivor_kills_4_survived",
            "type": "check",
            "text": "1レイドでPMCを4人排除して生還する（Mechanicルート）",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "refuse"
              },
              {
                "stepId": "tt_route_choice",
                "value": "mechanic"
              }
            ],
            "hint": "実績「I am Speed」の条件は72時間以内（PvPのみ）。超過した場合はKappaコンテナを渡す（Wiki）"
          },
          {
            "id": "tt_survivor_receive_letter",
            "type": "check",
            "text": "PraporからTerminal兵士への紹介状を受け取る",
            "showIf": {
              "stepId": "tt_kerman_offer",
              "value": "refuse"
            },
            "hint": "再発行は6,256,000ルーブル（Wiki）"
          },
          {
            "id": "tt_survivor_penalty",
            "type": "note",
            "text": "72時間を過ぎた場合: Secure container Kappaを渡す（Wiki）",
            "showIf": [
              {
                "stepId": "tt_kerman_offer",
                "value": "refuse"
              },
              {
                "stepId": "tt_route_choice",
                "value": "mechanic"
              }
            ]
          }
        ]
      },
      {
        "id": "tt_p7",
        "title": "Phase 7: Terminal脱出 (全エンディング共通)",
        "steps": [
          {
            "id": "tt_final_terminal",
            "type": "check",
            "text": "ShorelineのTerminal入口に到着する"
          },
          {
            "id": "tt_final_swipe",
            "type": "check",
            "text": "インターコムリーダーにキーカードをスワイプする"
          },
          {
            "id": "tt_final_enter",
            "type": "check",
            "text": "Terminal内に入る"
          },
          {
            "id": "tt_final_security",
            "type": "check",
            "text": "セキュリティチェックを通過する",
            "hint": "各ルートで再プログラム済みのRFIDカード（Kermanのハッシュ等）をIntelligence Centerで準備しておく（Wiki）"
          },
          {
            "id": "tt_final_escape",
            "type": "check",
            "text": "Escape from Tarkov"
          },
          {
            "id": "tt_final_armory",
            "type": "check",
            "text": "没収された装備がある武器庫を見つける",
            "optional": true
          },
          {
            "id": "tt_final_alpha1",
            "type": "check",
            "text": "Secure container Alpha-1を回収する",
            "optional": true
          },
          {
            "id": "tt_final_bd_keycard",
            "type": "check",
            "text": "サービス通路のキーカード(Black Division keycard)を入手する",
            "optional": true
          },
          {
            "id": "tt_final_cargo_exit",
            "type": "check",
            "text": "Terminal積載区域への出口を見つける",
            "optional": true
          },
          {
            "id": "tt_final_service_unlock",
            "type": "check",
            "text": "海港ビル内のサービス通路を解錠する",
            "optional": true
          },
          {
            "id": "tt_final_cargo_access",
            "type": "check",
            "text": "Terminal積載区域にアクセスする",
            "optional": true
          },
          {
            "id": "tt_final_fuel",
            "type": "check",
            "text": "燃料貯蔵所への入り方を見つける",
            "optional": true
          },
          {
            "id": "tt_final_power",
            "type": "check",
            "text": "ポンプステーションへの電力復旧方法を見つける",
            "optional": true
          },
          {
            "id": "tt_final_diagram",
            "type": "check",
            "text": "電気パネルの図面を入手する",
            "optional": true
          },
          {
            "id": "tt_final_drain",
            "type": "check",
            "text": "ポンプステーションの排水をする",
            "optional": true
          },
          {
            "id": "tt_final_pier_key",
            "type": "check",
            "text": "桟橋への道を塞ぐゲートの鍵(Pier door key)を入手する",
            "optional": true
          },
          {
            "id": "tt_final_pier_exit",
            "type": "check",
            "text": "桟橋への出口を見つける",
            "optional": true
          },
          {
            "id": "tt_final_pier_evac",
            "type": "check",
            "text": "桟橋の避難エリアに到達する",
            "optional": true
          }
        ]
      }
    ]
  }
]
