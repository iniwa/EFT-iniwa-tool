// KORD BREACH 本編バトルパスの参照データ。
// 個人ごとの要求数・進捗はゲーム内表示を優先し、この静的カタログには含めない。
export const BATTLE_PASS_META = {
  seasonId: 'kord-breach-2026',
  name: 'KORD BREACH',
  source: 'https://blast.tv/gaming/news/escape-from-tarkov-kordbreach-battlepass-explained',
  verifiedAt: '2026-08-31',
  note: '参考情報・ゲーム内表示優先',
  officialPatchSource: 'https://telegra.ph/Patch-1100-08-03',
  dailyLimitSource: 'https://t.me/escapefromtarkovEN/6773',
  classifiedSource: 'https://t.me/escapefromtarkovEN/6795',
  documentMapSource: 'https://lootmap.gg/escape-from-tarkov/guides/kord-breach-documents-map-guide/',
  documentWikiSource: 'https://wikiwiki.jp/eft/%E3%83%90%E3%83%88%E3%83%AB%E3%83%91%E3%82%B9%20Kord%20Breach',
  documentLocationMapSource: 'https://tarkovdocsmap.com/',
  dailyLimits: { season: 30, pvp: 20, pve: 15 },
}

export const BATTLE_PASS_DOCUMENTS = [
  { id: 'financial-documents', itemId: '6a31807f17005505b70d5827', name: 'Financial documents', jaName: '財務文書', maps: ['Customs', 'Streets', 'Interchange'] },
  { id: 'pmc-personnel-files', itemId: '6a317b9692cfdcddcb02a58e', name: 'PMC personnel files', jaName: 'PMC人事ファイル', maps: ['Reserve', 'Lighthouse', 'Icebreaker'] },
  { id: 'project-documentation', itemId: '6a3181f178450ec91c0ea1aa', name: 'Project documentation', jaName: '計画文書', maps: ['Factory', 'Reserve', 'Customs'] },
  { id: 'blueprints-and-technical-documentation', itemId: '6a31824878450ec91c0ea1ae', name: 'Blueprints and technical documentation', jaName: '図面・技術文書', maps: ['Interchange', 'Factory', 'Labyrinth'] },
  { id: 'test-documentation', itemId: '6a31828557705071410ca00e', name: 'Test documentation', jaName: '試験文書', maps: ['Shoreline', 'Woods', 'Icebreaker'] },
  { id: 'user-documentation', itemId: '6a3182b72fd891345e047eef', name: 'User documentation', jaName: '利用者向け文書', maps: ['Ground Zero', 'Streets', 'Labs'] },
  { id: 'medical-documents', itemId: '6a3182dc6cd8de21cf0a3a7d', name: 'Medical documents', jaName: '医療文書', maps: ['Labs', 'Ground Zero', 'Labyrinth'] },
  { id: 'technical-documentation', itemId: '6a31830dde69ceafd805afa0', name: 'Technical documentation', jaName: '技術文書', maps: ['Shoreline', 'Woods', 'Lighthouse'] },
  { id: 'classified-documents', itemId: '6a3183258f113efdb7093622', name: 'Classified documents', jaName: '機密文書', maps: [], special: '万能代替。Expansion Hubで入手。将来季へ持ち越し可能、Black Division Gear Crate交換には使用不可。' },
]

const reward = (page, id, name, category, description, itemId = null) => ({ id: `kord-breach-p${page}-${id}`, page, name, category, description, itemId })

export const BATTLE_PASS_REWARDS = [
  reward(1, 'dogtag', 'Marked Dogtag', 'unconfirmed', 'Marked Dogtagの報酬枠（用途・分類はゲーム内表示で確認）。'), reward(1, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'), reward(1, 'burn-poster', 'Burn Poster', 'cosmetic', '拠点に飾るBurnポスター。'), reward(1, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'), reward(1, 'black-wood-ceiling', 'Black Wood Ceiling', 'cosmetic', '拠点の天井を黒い木目に変更。'),
  reward(2, 'respirator', 'Gentex Ops-Core SOTR Respirator', 'trade-offer', 'Gentex Ops-Core SOTR Respiratorの取引が解放される。'), reward(2, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'), reward(2, 'red-hawaii', 'Red Hawaii Tactical Clothing', 'cosmetic', 'Red Hawaiiの戦術衣装。'), reward(2, 'scorpion-target', 'Scorpion Target', 'cosmetic', 'Scorpion標的を拠点に設置。'), reward(2, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'),
  reward(3, 'load-sling', 'Mystery Ranch NICE Frame Load Sling', 'trade-offer', 'Mystery Ranch NICE Frame Load Slingの取引が解放される。'), reward(3, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'), reward(3, 'black-herringbone', 'Black Herringbone', 'cosmetic', '拠点用のBlack Herringbone内装。'), reward(3, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'), reward(3, 'heart-pose', 'Heart Mannequin Pose', 'cosmetic', 'マネキンのHeartポーズ。'),
  reward(4, 'dogtag', 'Marked Dogtag 2', 'unconfirmed', 'Marked Dogtagの別報酬枠（用途・分類はゲーム内表示で確認）。'), reward(4, 'knife', 'Microtech Jagdkommando Knife', 'item', 'Microtech Jagdkommando Knife。'), reward(4, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'), reward(4, 'bear-poster', 'Beware The Bear Poster', 'cosmetic', '拠点に飾るBeware The Bearポスター。'), reward(4, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'),
  reward(5, 'orange-hawaii', 'Orange Hawaii Tactical Clothing', 'cosmetic', 'Orange Hawaiiの戦術衣装。'), reward(5, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'), reward(5, 'black-division-target', 'Black Division Target', 'cosmetic', 'Black Division標的を拠点に設置。'), reward(5, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'), reward(5, 'plate-carrier', 'Ferro Concepts FCPC V5 Plate Carrier Black Division', 'trade-offer', 'Ferro Concepts FCPC V5の取引が解放される。'),
  reward(6, 'knyazev-appearance', 'Knyazev Character Appearance', 'cosmetic', 'Knyazevのキャラクター外見。'), reward(6, 'oconnor-appearance', "O'Connor Character Appearance", 'cosmetic', "O'Connorのキャラクター外見。"), reward(6, 'howa', 'Howa Type 20 5.56x45 Assault Rifle', 'trade-offer', 'Howa Type 20の取引が解放される。'),
  reward(7, 'dogtag', 'Marked Dogtag 3', 'unconfirmed', 'Marked Dogtagの別報酬枠（用途・分類はゲーム内表示で確認）。'), reward(7, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'), reward(7, 'scorpion-upper', 'Scorpion Upper Tactical Clothing', 'cosmetic', 'Scorpionの上半身戦術衣装。'), reward(7, 'scorpion-lower', 'Scorpion Lower Tactical Clothing', 'cosmetic', 'Scorpionの下半身戦術衣装。'),
  reward(8, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'), reward(8, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'), reward(8, 'white-walls', 'White Accent Walls', 'cosmetic', '拠点の壁をWhite Accentに変更。'), reward(8, 'arch-pose', 'Arch Mannequin Pose', 'cosmetic', 'マネキンのArchポーズ。'), reward(8, 'dome-pose', 'Dome Mannequin Pose', 'cosmetic', 'マネキンのDomeポーズ。'),
  reward(9, 'plate-carrier-v2', 'Spiritus Systems LV-119 Plate Carrier Black Division V2', 'trade-offer', 'Spiritus Systems LV-119の取引が解放される。'), reward(9, 'tarcoins', '50 TarCoins', 'currency', 'TarCoins 50枚。'), reward(9, 'backpack', 'Tasmanian Tiger Modular Pack 45 Plus Multicam Black', 'trade-offer', 'Tasmanian Tiger Modular Packの取引が解放される。'), reward(9, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'), reward(9, 'server-room', 'Server Room', 'cosmetic', '拠点にServer Roomの内装を追加。'),
  reward(10, 'anton-voice', 'Anton Character Voice', 'cosmetic', 'Antonのキャラクターボイス。'), reward(10, 'garrett-voice', 'Garrett Character Voice', 'cosmetic', 'Garrettのキャラクターボイス。'), reward(10, 'tarcoins', '100 TarCoins', 'currency', 'TarCoins 100枚。'), reward(10, 'gear-crate', 'Black Division Gear Crate', 'item', 'Black Division装備箱。'),
  reward(11, 'dogtag', 'Marked Dogtag 4', 'unconfirmed', 'Marked Dogtagの別報酬枠（用途・分類はゲーム内表示で確認）。'), reward(11, 'tarcoins', '150 TarCoins', 'currency', 'TarCoins 150枚。'), reward(11, 'knyazev-after-battle', 'Knyazev (After Battle) Character Appearance', 'cosmetic', '戦闘後のKnyazev外見。'), reward(11, 'oconnor-after-battle', "O'Connor (After Battle) Character Appearance", 'cosmetic', "戦闘後のO'Connor外見。"),
  reward(12, 'qbz-191', 'Norinco QBZ-191 5.8x42 Assault Rifle', 'trade-offer', 'Norinco QBZ-191の取引が解放される。'), reward(12, 'nocturnal-upper', 'Nocturnal Upper Tactical Clothing', 'cosmetic', 'Nocturnalの上半身戦術衣装。'), reward(12, 'nocturnal-lower', 'Nocturnal Lower Tactical Clothing', 'cosmetic', 'Nocturnalの下半身戦術衣装。'),
]

export const BATTLE_PASS_REWARD_CATEGORIES = [
  { value: 'item', label: '物品' }, { value: 'trade-offer', label: '取引解放' },
  { value: 'cosmetic', label: '外観・内装' }, { value: 'currency', label: '通貨' },
  { value: 'unconfirmed', label: '分類未確認' },
]
