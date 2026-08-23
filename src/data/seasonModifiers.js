/**
 * KORD BREACH Season 1 Personal Modifier manifest.
 *
 * Values are community-observed planning data. The game client is always the
 * authority when a value or wording differs.
 */
export const KORD_BREACH_SEASON_ID = 'kord-breach-2026'

const officialRulesSource = 'https://store.steampowered.com/news/app/3932890/view/686386819418294180'
const observedSources = [
  'https://tarkov-market.com/season-1/perks',
  'https://tarkovkit.com/en/seasons/kord-breach',
]

const positive = [
  ['street-tax', "Street Tax", -1, '週1回、一部のScavからみかじめ料を受け取る。'],
  ['lucky', 'Lucky', -1, '幸運が味方する。'],
  ['juice-time', 'Juice Time', -2, 'ジュースを飲むと60秒間Painkiller効果を得る。'],
  ['the-tarkov-shooter', 'The Tarkov Shooter', -2, 'ボルトアクションライフルのスキル成長速度+100%、開始レベル25。'],
  ['diet', 'Diet', -2, 'すべての食料・飲料のリソース消費-50%。'],
  ['thrombophilia', 'Thrombophilia', -2, '出血確率-25%。'],
  ['hypodipsia', 'Hypodipsia', -2, '水分の消費速度-20%。'],
  ['polyphagia', 'Polyphagia', -2, 'Energyの消費速度-20%。'],
  ["sailor's-nostalgia", "Sailor's Nostalgia", -2, '缶詰を食べると30秒間Health Regeneration (+2)効果。'],
  ['marathon-runner', 'Marathon Runner', -3, '腕・脚のスタミナ消費速度-20%。'],
  ['sturdy-bones', 'Sturdy Bones', -3, '手足の骨折確率-25%、高所落下ダメージ-20%。'],
  ['sprinter', 'Sprinter', -3, '走行速度+5%。'],
  ['bushborne', 'Bushborne', -5, '植生上の歩行音と移動速度低下-75%。'],
  ['hercules', 'Hercules', -5, 'Strength・Enduranceスキルの開始レベル15。'],
  ['youth', 'Youth', -5, 'Energy消費速度-20%、腕・脚のスタミナ+10。'],
  ['safecracker', 'Safecracker', -5, 'メカニカルキー使用時、耐久を消費しない確率25%。'],
  ['prodigy', 'Prodigy', -5, 'スキル経験値獲得量+30%。'],
  ['average', 'Average', -12, 'Craftingを除く全スキルをレベル25にするが、それ以上成長不可。'],
  ['kappa-protocol', 'Kappa Protocol', -12, 'Secure container Kappaを即時獲得。'],
]

const negative = [
  ['dr-jekyll', 'Dr. Jekyll', 1, 'Fresh Wound状態を得るとレイド終了まで解除不可。'],
  ['third-leg', 'Third Leg', 1, '移動速度-1%、Therapistの購入価格-5%。'],
  ['unlucky', 'Unlucky', 1, '不運が時に深刻な結果をもたらす。'],
  ['hemophilia', 'Hemophilia', 2, '出血確率+25%。'],
  ['well-that-hurt', 'Well That Hurt!', 2, 'すべてのメディキットのリソース消費+25%。'],
  ['polydipsia', 'Polydipsia', 2, '水分の消費速度+15%。'],
  ['chronic-fatigue-syndrome', 'Chronic Fatigue Syndrome', 2, 'Energyの消費速度+20%。'],
  ['personality-vacuum', 'Personality Vacuum', 2, 'Charismaスキル成長不可、全トレーダー品+20%。'],
  ['osteoporosis', 'Osteoporosis', 3, '手足の骨折確率+25%、高所落下ダメージ+20%。'],
  ['allergic', 'Allergic', 3, '食料または医薬品カテゴリからランダム3品目にアレルギー。'],
  ['exhaustion', 'Exhaustion', 5, '腕・脚のスタミナ回復速度-20%、スタミナ-10。'],
  ['broken-secure-container', 'Broken Secure Container', 6, 'コンテナに入れられるのは現金・鍵・ドッグタグ・特殊装備等のみ。'],
  ['incompetent', 'Incompetent', 10, 'Bolt-action Riflesを除くスキル成長速度-25%、上限レベル30（Craftingを除く）。'],
  ['no-flea-market', 'No Flea Market', 10, 'フリーマーケットでプレイヤーとの取引不可。'],
]

const globals = [
  ['no-insurance', 'No Insurance', 'レイド前にアイテムへ保険をかけられない。'],
  ['black-division', 'Black Division', '特定のロケーションにBlack Division operativesが出現する。'],
  ['no-fir-for-hideout', 'No FiR for Hideout', 'ハイドアウトのゾーンでFound in Raid状態が不要。'],
  ['armor-shortage', 'Armor Shortage', 'Tarkov全域のトレーダーがアーマー不足になる。'],
  ['handyman', 'Handyman', 'クラフト時間-50%、Craftingスキル開始レベル51。'],
  ['seasoned-pmcs', 'Seasoned PMCs', 'キャラクターの経験値獲得量+25%。'],
]

const modifier = ([id, name, points, description], kind) => ({ id, name, points, description, kind })

export const KORD_BREACH_SEASON = Object.freeze({
  seasonId: KORD_BREACH_SEASON_ID,
  displayName: 'KORD BREACH — Season 1',
  patch: '1.1.0',
  verifiedAt: '2026-08-24',
  status: 'community-observed',
  confidence: 'community-observed',
  officialRulesSource,
  observedSources,
  sourceNote: '公式の完全一覧ではなくコミュニティ観測値。ゲーム内表示を優先してください。',
  globals: Object.freeze(globals.map(([id, name, description]) => Object.freeze({ id, name, description, kind: 'global' }))),
  positive: Object.freeze(positive.map((entry) => Object.freeze(modifier(entry, 'positive')))),
  negative: Object.freeze(negative.map((entry) => Object.freeze(modifier(entry, 'negative')))),
})

export const SEASON_MODIFIER_SEASONS = Object.freeze({ [KORD_BREACH_SEASON_ID]: KORD_BREACH_SEASON })

export const ACHIEVEMENT_HINTS = Object.freeze([
  { id: 'dont-need-any-help', name: "Don't Need Any Help", description: 'Positive Modifierを0個にする目安。', modifierIds: [], rule: 'positiveCount', value: 0 },
  { id: 'i-had-a-plan', name: 'I Had a Plan', description: 'Negative Modifierを10個以上選ぶ目安。', modifierIds: [], rule: 'negativeCount', value: 10 },
  { id: 'one-is-good-two-is-better', name: 'One Is Good Two Is Better', description: 'Kappa Protocolを選ぶ目安。', modifierIds: ['kappa-protocol'], rule: 'contains' },
  { id: 'genetic-lottery', name: 'Genetic Lottery', description: '指定された身体状態系Modifierをすべて選ぶ目安。', modifierIds: ['hemophilia', 'osteoporosis', 'polydipsia', 'allergic', 'third-leg'], rule: 'containsAll' },
  { id: 'we-have-hardcore-at-home', name: 'We Have Hardcore at Home', description: 'Broken Secure ContainerとNo Flea Marketを選ぶ目安。', modifierIds: ['broken-secure-container', 'no-flea-market'], rule: 'containsAll' },
  { id: 'you-call-that-a-challenge', name: 'You Call That a Challenge?', description: '指定された8個から5個以上を選ぶ目安。', modifierIds: ['marathon-runner', 'youth', 'hercules', 'thrombophilia', 'hypodipsia', 'polyphagia', 'sturdy-bones', 'prodigy'], rule: 'containsAtLeast', value: 5 },
  { id: 'entrepreneur-born-in-heaven', name: 'Entrepreneur Born in Heaven', description: 'Street Taxを選ぶ目安。', modifierIds: ['street-tax'], rule: 'contains' },
])

export function getSeasonModifierManifest(seasonId = KORD_BREACH_SEASON_ID) {
  return SEASON_MODIFIER_SEASONS[seasonId] || null
}
