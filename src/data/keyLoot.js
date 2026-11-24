const wiki = title => `https://wikiwiki.jp/eft/${encodeURIComponent(title)}`

export const KEY_LOOT = {
  'abandoned-factory-marked-key': {
    tier: 'SS', room: 'Streets・廃工場のマークド部屋', items: ['LEDX', 'Red Rebel', '色付きラボカード', 'Injector case'],
    containers: '武器箱 1〜2個', url: wiki('Abandoned factory marked key'),
  },
  'rb-vo-marked-key': {
    tier: 'SS', room: 'Reserve・兵舎のマークド部屋', items: ['色付きラボカード', 'ケース類', '武器'],
    url: wiki('RB-VO marked key'),
  },
  'dorm-room-314-marked-key': {
    tier: 'SS', room: 'Customs・3階建て寮314号室', items: ['色付きラボカード', 'Red Rebel', 'Taiga-1', 'ケース類'],
    url: wiki('Dorm room 314 marked key'),
  },
  'mysterious-room-marked-key': {
    tier: 'SS', room: 'Streets・Chek.13のマークド部屋', items: ['LEDX', 'Red Rebel', '色付きラボカード', 'ケース類'],
    url: wiki('Mysterious room marked key'),
  },
  'rb-pkpm-marked-key': {
    tier: 'SS', room: 'Reserve・地下指令室のマークド部屋', items: ['色付きラボカード', 'Red Rebel', 'ケース類', 'Bitcoin'],
    containers: '引き出し 3基（Wiki記載）', url: wiki('RB-PKPM marked key'),
  },
  'rb-bk-marked-key': {
    tier: 'SS', room: 'Reserve・東兵舎のマークド部屋', items: ['色付きラボカード', '武器', '貴重品'],
    url: wiki('RB-BK marked key'),
  },
  'rusted-bloody-key': {
    tier: 'SS', room: 'Streets・Klimova 16Aの血錆の部屋', items: ['マークドキーなどの希少な鍵'],
    url: wiki('Rusted bloody key'), note: '指定の標準ティア。開錠サンプルの平均額は未確認。',
  },
  'terragroup-labs-keycard-black': {
    tier: 'SS', room: 'The Lab・Black区画', items: ['刺激剤', 'LEDXなどの医療品'],
    containers: '実験区画に医療ケース1', url: wiki('THE LAB'),
  },
  'terragroup-labs-keycard-green': {
    tier: 'SS', room: 'The Lab・Green区画', items: ['LEDX', 'Blackキーカード', '電子機器', '刺激剤'],
    containers: '医療ケース 0〜3個、武器箱 0〜2個', url: wiki('TerraGroup Labs keycard (Green)'),
  },
  'terragroup-labs-keycard-violet': {
    tier: 'SS', room: 'The Lab・Violet区画', items: ['UHF RFID Reader', '機密文書', 'Blue Folders', '武器パーツ'],
    containers: '武器箱3', url: wiki('THE LAB'),
  },
  'terragroup-labs-keycard-red': {
    tier: 'SS', room: 'The Lab・Red区画', items: ['LEDX', 'VPX', 'MCC', '高価な武器パーツ'],
    url: wiki('TerraGroup Labs keycard (Red)'),
  },
  'substation-marked-key': {
    tier: 'S', room: 'Lighthouse・変電所のマークド部屋', items: ['Weapon case', 'Magazine case', '武器'],
    url: wiki('LIGHTHOUSE'),
  },
  'necruspharm-pharmacy-key': {
    tier: 'S', room: 'Interchange・NecrusPharm薬局', items: ['LEDX', '除細動器', '刺激剤'],
    containers: '医療バッグ 0〜1個、医療ケース 0〜2個', url: wiki('NecrusPharm pharmacy key'),
  },
}
