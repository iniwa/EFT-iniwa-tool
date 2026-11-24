// src/data/keyCuration.js
// 鍵の棚卸しメタ情報と、API だけでは分からない用途の手動確認データ。
// 確認日: 2026-11-24 / ゲーム版: 1.3.0.0 (鍵に関する変更は 1.2.0.0)
// 文章・画像は転載せず、用途の有無だけを独自の語で記録する。

export const KEY_REVIEW_META = {
  checkedAt: '2026-11-24',
  gameVersion: '1.3.0.0',
  gameVersionNote: '公式告知の最新パッチは 1.3.0.0 (2026-10-29)。鍵に関する変更は 1.2.0.0 が最後です。',
  sources: [
    {
      id: 'api',
      label: 'tarkov.dev',
      detail: '鍵アイテム、施錠箇所、タスクの必要鍵 (通常PvP・PvE・Seasonal PvP をモードごとに照合)',
      url: 'https://json.tarkov.dev/endpoints',
    },
    {
      id: 'official',
      label: '公式告知',
      detail: 'Patch 1.2.0.0: ZB-1013 key と Guard Post Key の追加、ULTRA 売店のレジ鍵の廃止',
      url: 'https://steamcommunity.com/app/3932890/announcements/',
    },
    {
      id: 'wiki',
      label: 'EFT 日本語 Wiki (鍵)',
      detail: '2026-11-23 更新 / 掲載版 1.2.0.0。脱出・収益・施錠なしの記述を確認',
      url: 'https://wikiwiki.jp/eft/%E9%8D%B5',
    },
  ],
  tiers: [
    { tier: 'SS', text: '希少品の出現例と複数の出現枠、または開錠記録で上位の部屋' },
    { tier: 'S', text: '希少品を狙える根拠がある部屋' },
    { tier: 'A', text: '価値の高い物資や豊富な収益源が確認できる部屋' },
    { tier: 'B', text: '用途が絞られる物資や収益源が確認できる部屋' },
    { tier: 'C', text: '日用品中心の部屋' },
    { tier: 'D', text: '少量の戦利品が確認できる部屋' },
    { tier: 'F', text: '施錠や戦利品がないとされる場所' },
  ],
  confidence: [
    { id: 'provisional', label: '暫定', text: '公開資料や開錠記録をもとにした評価' },
    { id: 'unverified', label: '未確認', text: '戦利品の根拠が不足しているか、探索評価の対象外' },
  ],
}

// 用途の手動確認 (normalizedName → 内容)
// roles: extract / access / income-high / income-mid / loot-high / loot-mid
// special: ストーリー・イベント用など、通常の探索評価に向かない鍵 (ティア対象外)
// unlocked: Wiki が「施錠されていない」と記載し、API にも施錠データがない鍵
// src: 根拠の出典 id (KEY_REVIEW_META.sources)
export const KEY_CURATION = {
  // --- 脱出口 ---
  'zb-014-key': { roles: ['extract'], src: ['wiki'], note: 'Woods の脱出口に使う。出現条件に不確定要素ありと Wiki に記載。' },
  'zb-1013-key': { roles: ['extract'], src: ['official', 'wiki'], isNew: '1.2.0.0', note: 'Customs の脱出口用 (電源が必要)。フリマ出品不可。' },
  'security-post-key': { roles: [], src: ['official', 'wiki'], isNew: '1.2.0.0', note: '公式告知の「Guard Post Key」に相当するとみられる。Wiki ではショートカット用途のみ。名称の対応は未確認。' },

  // --- マップ進入 ---
  'terragroup-labs-access-keycard': { roles: ['access-core'], src: ['api', 'wiki'], note: 'The Lab / Infected Lab に入る鍵 (API のマップ進入条件で確認)。' },
  'labrys-access-keycard': { roles: ['access'], src: ['api'], note: 'The Labyrinth に入る鍵 (API のマップ進入条件で確認)。' },
  'rfid-keycard-with-unknown-name': { special: true, src: ['api'], note: 'Terminal の進入条件に含まれるが、ストーリー進行用の鍵。' },
  'reprogrammed-rfid-keycard-with-prapors-hash-codes': { special: true, src: ['api'], note: 'Terminal の進入条件に含まれるストーリー用の鍵。' },
  'reprogrammed-rfid-keycard-with-mr-kermans-hash-codes': { special: true, src: ['api'], note: 'Terminal の進入条件に含まれるストーリー用の鍵。' },

  // --- 収益 (レジ) ---
  'idea-cash-register-key': { roles: ['income-high'], src: ['official', 'wiki'], note: 'Interchange のレジを開ける。Wiki は 1 レイド数十万ルーブルと記載 (2026/5 時点)。公式がレジ鍵の必要を維持と明記。API には施錠データなし。' },
  'goshan-cash-register-key': { roles: ['income-high'], src: ['official', 'wiki'], note: 'Interchange のレジを開ける。公式がレジ鍵の必要を維持と明記。API には施錠データなし。' },
  'oli-cash-register-key': { roles: ['income-mid'], src: ['official', 'wiki'], note: 'Interchange のレジを開ける。公式がレジ鍵の必要を維持と明記。API には施錠データなし。' },

  // --- 価値の高い保管場所 (Wiki の出現物の記述より) ---
  'usec-cottage-first-safe-key': { roles: ['loot-high'], src: ['wiki'] },
  'usec-cottage-second-safe-key': { roles: ['loot-high'], src: ['wiki'] },
  'terragroup-labs-keycard-black': { roles: ['loot-high'], src: ['api', 'wiki'], note: 'Wiki は使用回数無制限と記載するが、API は 10 回。現行の API を採用。' },
  'tarcone-directors-office-key': { roles: ['loot-high'], src: ['wiki'] },
  'dorm-room-314-marked-key': { roles: ['loot-high'], src: ['wiki'] },
  'rb-ob-key': { roles: ['loot-high'], src: ['wiki'] },
  'rb-orb1-key': { roles: ['loot-high'], src: ['wiki'] },
  'vorons-hideout-key': { roles: ['loot-high'], src: ['wiki'] },
  'usec-stash-key': { roles: ['loot-mid'], src: ['wiki'] },
  'reshalas-bunkhouse-key': { roles: ['loot-mid'], src: ['wiki'] },
  'dorm-room-105-key': { roles: ['loot-mid'], src: ['wiki'] },
  'dorm-room-110-key': { roles: ['loot-mid'], src: ['wiki'] },
  'dorm-room-114-key': { roles: ['loot-mid'], src: ['wiki'] },
  'dorm-room-204-key': { roles: ['loot-mid'], src: ['wiki'] },
  'dorm-room-214-key': { roles: ['loot-mid'], src: ['wiki'] },
  'gas-station-office-key': { roles: ['loot-mid'], src: ['wiki'] },
  'health-resort-west-wing-room-301-key': { roles: ['loot-mid'], src: ['wiki'] },
  'health-resort-west-wing-office-room-104-key': { roles: ['loot-mid'], src: ['wiki'] },
  'health-resort-west-wing-office-room-112-key': { roles: ['loot-mid'], src: ['wiki'] },
  'health-resort-east-wing-office-room-107-key': { roles: ['loot-mid'], src: ['wiki'] },
  'health-resort-office-key-with-a-blue-tape': { roles: ['loot-mid'], src: ['wiki'] },
  'rb-orb2-key': { roles: ['loot-mid'], src: ['wiki'] },
  'rb-orb3-key': { roles: ['loot-mid'], src: ['wiki'] },
  'rb-tb-key': { roles: ['loot-mid'], src: ['wiki'] },
  'rb-bk-marked-key': { roles: ['loot-mid'], src: ['wiki'] },
  'rogue-usec-stash-key': { roles: ['loot-mid'], src: ['wiki'] },
  'rogue-usec-workshop-key': { roles: ['loot-mid'], src: ['wiki'] },

  // --- 施錠なし (Wiki 記述。掲載版が古い項目あり) ---
  'health-resort-east-wing-office-room-108-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-west-wing-room-207-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-east-wing-room-209-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-east-wing-room-213-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-east-wing-room-216-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-east-wing-room-322-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-west-wing-room-303-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-west-wing-room-309-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-west-wing-room-323-key': { unlocked: true, src: ['wiki', 'api'] },
  'health-resort-west-wing-room-325-key': { unlocked: true, src: ['wiki', 'api'] },
  'gas-station-safe-key': { unlocked: true, src: ['wiki', 'api'] },
  'weather-station-safe-key': { unlocked: true, src: ['wiki', 'api'] },

  // --- ストーリー・イベント用 ---
  'blank-rfid-keycard': { special: true, src: ['wiki'] },
  'kruglovs-rfid-keycard': { special: true, src: ['api'] },
  'activated-kruglovs-rfid-keycard': { special: true, src: ['api'] },
  'keycard-from-kruglovs-safe': { special: true, src: ['api'] },
  'bbq-s43-gas-torch': { special: true, src: ['api'] },
  'valve-handwheel': { special: true, src: ['api'] },
  'ariadne-symbol-key': { special: true, src: ['wiki'] },
  'key-01': { special: true, src: ['wiki'] },
  'key-02': { special: true, src: ['wiki'] },
  'key-03': { special: true, src: ['wiki'] },
  'key-04': { special: true, src: ['wiki'] },
  'reprogrammed-keycard-for-aps-apartment-lock-red': { special: true, src: ['api'] },
  'reprogrammed-keycard-for-aps-apartment-lock-blue': { special: true, src: ['api'] },
  'reprogrammed-keycard-for-aps-apartment-lock-green': { special: true, src: ['api'] },
}

export const ROLE_LABELS = {
  extract: '脱出口',
  access: 'マップ進入',
  'access-core': 'マップ全体の入口',
  'income-high': '高収益',
  'income-mid': '収益',
  'loot-high': '価値の高い部屋',
  'loot-mid': '探索向き',
}
