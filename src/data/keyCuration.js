export const KEY_REVIEW_META = {
  checkedAt: '2026-11-24',
  gameVersion: '1.3.0.0',
  gameVersionNote: '公式告知の最新パッチは 1.3.0.0 (2026-10-29)。戦利品の評価は公開資料からの暫定判定です。',
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
      detail: '鍵索引・個別の戦利品・マップ別資料',
      url: 'https://wikiwiki.jp/eft/%E9%8D%B5',
    },
    {
      id: 'raid',
      label: 'RaidSignal',
      detail: '個別ページに掲載された英語Wikiの部屋情報と、モード別の開錠サンプル',
      url: 'https://raidsignal.com/best-keys',
    },
    {
      id: 'kappa',
      label: 'KappaPath',
      detail: '追加照合に使った鍵別の部屋情報',
      url: 'https://kappapath.com/keys',
    },
  ],
  tiers: [
    { tier: 'SS', text: '希少品の出現例と複数の出現枠、または開錠記録で上位の部屋' },
    { tier: 'S', text: '希少品を狙える根拠がある部屋' },
    { tier: 'A', text: '高価な専門物資、または多くの容器や直湧きがある部屋' },
    { tier: 'B', text: '用途が絞られる物資や収益源が確認できる部屋' },
    { tier: 'C', text: '日用品中心の部屋' },
    { tier: 'D', text: '少量の戦利品が確認できる部屋' },
    { tier: 'F', text: '資料で開錠先なし・常時開放・戦利品なしを確認できた鍵' },
  ],
  confidence: [
    { id: 'provisional', label: '暫定', text: '公開資料や開錠記録をもとにした評価' },
    { id: 'usage', label: '用途のみ', text: 'タスク・ストーリー・通行などの用途を確認' },
    { id: 'unverified', label: '未確認', text: '戦利品の資料が不足、または資料間に不一致がある鍵' },
  ],
}

export const ROLE_LABELS = {
  extract: '脱出口',
  access: 'マップ進入',
  'access-core': 'マップ全体の入口',
  shortcut: '通行',
  task: 'タスク用',
  story: 'ストーリー用',
}
