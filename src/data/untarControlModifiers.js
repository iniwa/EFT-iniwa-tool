export const UNTAR_CONTROL_SEASON_ID = 'untar-control-2026'

const globals = [
  ['untar-control', 'UNTAR Control', '各ロケーションの一部をUN部隊が掌握。全Scavと、規則違反をしたPMCに敵対する。'],
  ['tough-times', 'Tough Times', '利用できる脱出地点が制限される。シーズン序盤はプレイヤーScavの再出撃待ちが大幅に延びる。'],
  ['peace-market', 'Peace Market', '新しい全体タスクの達成で、全プレイヤーにフリーマーケットが開放される。出品制限は最小限。'],
  ['no-insurance', 'No Insurance', '保険サービスを利用できない。'],
  ['supply-shortage', 'Supply Shortage', '食料・医薬品・大型バックパック・爆発物の供給が減る。'],
  ['smart-pmcs', 'Smart PMCs', 'スキル成長速度+25%。'],
]

const positive = [
  ['lockpicker', 'Lockpicker', -1, 'マルチツールを使ってドアやコンテナの南京錠を解錠できる。'],
  ['enhanced-secure-container', 'Enhanced Secure Container', -2, 'Epsilon Xを初期所持。死亡しても中身のFound in Raid状態が維持される。'],
  ['kleptomaniac', 'Kleptomaniac', -2, 'Searchの開始レベル40、成長速度+100%。'],
  ['cold-blooded', 'Cold-Blooded', -4, 'レイド中の体温が下がり、サーマル光学機器で発見されにくくなる。'],
  ['marathon-runner', 'Marathon Runner', -5, '腕・脚のスタミナ消費速度-25%。'],
  ['juice-time', 'Juice Time', -1, 'ジュースの摂取で240秒間Painkiller効果。'],
  ['street-tax', 'Street Tax', -2, '一部のScavから週1回、多額のみかじめ料を受け取る。'],
  ['hercules', 'Hercules', -6, 'StrengthとEnduranceの開始レベル20。'],
  ['prodigy', 'Prodigy', -4, 'スキル成長速度+20%。'],
  ['sturdy-bones', 'Sturdy Bones', -2, '骨折確率-50%、落下ダメージ-30%。'],
  ['lucky', 'Lucky', -1, '公式説明は「幸運は勇者に味方する」。'],
  ['introvert', 'Introvert', -1, 'ソロプレイ時のスキル成長速度+30%。'],
  ['fast-crafting', 'Fast Crafting', -2, 'Craftingの開始レベル40、成長速度+100%。'],
  ['friends-extract', "Friend's Extract", -2, 'Scav用脱出地点があるマップでは、PMCレイドでそのうち1か所を追加で利用できる。'],
  ['advanced-hideout', 'Advanced Hideout', -4, 'Bitcoin Farm、Gym、Scav Caseなどを建設済みの状態で開始。'],
  ['safecracker', 'Safecracker', -4, '鍵・キーカードの使用時、50%の確率で耐久を消費しない。'],
  ["sailor's-nostalgia", "Sailor's Nostalgia", -2, '魚の缶詰を食べると600秒間Health Regeneration (+1)効果。'],
  ['the-tarkov-shooter', 'The Tarkov Shooter', -2, 'Bolt-action Riflesの開始レベル51。'],
  ['sprinter', 'Sprinter', -4, '走行速度+15%。'],
  ['hypodipsia', 'Hypodipsia', -2, '水分消費速度-50%。'],
  ['average', 'Average', -8, '全スキルがレベル30で固定される。'],
  ['tap-rack-roll', 'Tap, Rack, Roll', -1, 'Troubleshootingの開始レベル40。故障解除前の点検が不要になる。'],
  ['refs-builders', "Ref's Builders", -2, 'GPコインとLegaメダルでハイドアウト設備を建設できる。'],
  ['heavyweight', 'Heavyweight', -2, '移動速度-5%、最大携行重量+30 kg、重量超過のしきい値+5 kg。'],
  ['peacekeepers-insurance', "Peacekeeper's Insurance", -4, '装備をユーロでPeacekeeperの保険に加入させられる。'],
  ['bushborne', 'Bushborne', -4, '茂みでの歩行音-75%。茂みによる減速がなくなる。'],
  ['youth', 'Youth', -6, 'Energy消費速度-20%、腕・脚のスタミナ+25ポイント。'],
  ['diet', 'Diet', -1, '飲食時に消費するアイテムのリソース量-50%。'],
  ['thrombophilia', 'Thrombophilia', -6, '出血確率-100%。'],
  ['polyphagia', 'Polyphagia', -2, 'Energy消費速度-45%。'],
  ['kappa-protocol', 'Kappa Protocol', -8, 'Secure Container Kappaを初期所持。'],
]

const negative = [
  ['extrovert', 'Extrovert', 3, 'ソロプレイ時のスキル成長速度-30%。'],
  ['loose-tongue', 'Loose Tongue', 2, '行動に伴い、キャラクターがときどき声を出す。'],
  ['zero-to-hero', 'Zero To Hero', 2, '所持品が空の状態で始まり、ボーナス品も受け取れない。'],
  ['deadline', 'Deadline', 4, '30日以内にいずれかのエンディングに到達できなければ、シーズンキャラクターがリセットされる。'],
  ['osteoporosis', 'Osteoporosis', 2, '骨折確率+50%、落下ダメージ+50%。'],
  ['incompetent', 'Incompetent', 8, 'スキル成長速度-100%。'],
  ['personality-vacuum', 'Personality Vacuum', 6, 'Charismaが成長せず、全トレーダーの商品・サービス価格+50%。'],
  ['broken-secure-container', 'Broken Secure Container', 6, '安全コンテナの収納対象を現金、鍵、ドッグタグ、刺激剤、特殊装備、一部のコンテナ、バトルパス用文書に限定。'],
  ['unlucky', 'Unlucky', 1, '不運によって、ときに深刻な結果が起きる。'],
  ['schizo', 'Schizo', 2, '発生していない音がときどき聞こえる。'],
  ['three-fingered', 'Three-Fingered', 2, 'リロード時にマガジンを落とす確率15%。'],
  ['shaky-aim', 'Shaky Aim', 3, '照準を3秒より長く維持すると、手の震え・痛み・視野狭窄が発生する。'],
  ['coagulopathy', 'Coagulopathy', 3, '出血が起こると即座にHeavy Bleedingになる。'],
  ['exhaustion', 'Exhaustion', 5, '腕・脚のスタミナ-20ポイント。'],
  ['polydipsia', 'Polydipsia', 1, '水分消費速度+25%。'],
  ['dr-jekyll', 'Dr. Jekyll', 2, 'Fresh Woundが発生するとレイド終了まで解除できない。'],
  ['no-flea-market', 'No Flea Market', 8, 'フリーマーケットでのプレイヤー間取引が無効になる。'],
  ['no-repairs', 'No Repairs', 2, 'トレーダーの修理サービスを利用できない。'],
  ['no-love-from-fence', 'No Love From Fence', 2, 'Fenceの初期評判-7.0。'],
  ['no-scav-runs', 'No Scav Runs', 3, 'Scavでの出撃が無効になる。'],
  ['hemophilia', 'Hemophilia', 2, '出血確率+70%。'],
  ['well-that-hurt', 'Well That Hurt!', 1, 'メディキットのリソース消費量+33%。'],
  ['chronic-fatigue-syndrome', 'Chronic Fatigue Syndrome', 1, 'Energy消費速度+20%。'],
  ['allergic', 'Allergic', 2, '飲食物・医薬品からランダムに選ばれた4品目にアレルギーを持つ。'],
  ['third-leg', 'Third Leg', 1, '移動速度-2%、Therapistでの購入価格-5%。'],
]

function personalModifiers(entries, kind) {
  return Object.freeze(entries.map(([id, name, points, description]) =>
    Object.freeze({ id, name, points, description, kind }),
  ))
}

export const UNTAR_CONTROL_SEASON = Object.freeze({
  seasonId: UNTAR_CONTROL_SEASON_ID,
  displayName: 'UNTAR Control — Season 2',
  verifiedAt: '2026-11-20',
  status: 'pre-release',
  confidence: 'official-preview',
  officialRulesSource: 'https://t.me/escapefromtarkovEN/7003',
  observedSources: Object.freeze(['https://www.scavlog.com/threads/2026-11-19-untar-control-season2-modifiers']),
  sourceNote: '2026年11月19日の公式発表に基づく未確定情報です。効果やポイントはシーズン開始前に変更される可能性があります。ポイント収支はシーズン1と同じルールで試算します。',
  globals: Object.freeze(globals.map(([id, name, description]) => Object.freeze({ id, name, description, kind: 'global' }))),
  positive: personalModifiers(positive, 'positive'),
  negative: personalModifiers(negative, 'negative'),
})
