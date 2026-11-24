// ストーリー章ごとの根拠・分岐・未確認事項（本ツール用の要約。公式/Wikiの本文は転載しない）。
// 手順本体は storyChaptersMain.js / storyChaptersSide.js。ここは「何を根拠にどこまで確かか」を持つ。
// 確認日: 2026-11-24。進行ID(章id・step id)は旧版から変更しないため、旧保存はそのまま対応する。

export const STORY_CHECKED_AT = '2026-11-24'
export const STORY_GAME_VERSION = {
  official: 'Patch 1.3.0.0 (2026-10-29, Steam告知で確認 / 章の内容変更の記載なし)',
  wiki: 'Wikiの表示は Ver 1.2.0.0.47888 (2026-10-07) のまま。ページ更新は 2026-11-21〜23',
}

const WIKI = (label, path) => ({ label, url: 'https://wikiwiki.jp/eft/' + encodeURI('ストーリータスク/' + path) })
export const STORY_SOURCE_INDEX = { label: 'ストーリータスク（日本語Wiki 一覧）', url: 'https://wikiwiki.jp/eft/' + encodeURI('ストーリータスク') }
export const STORY_OFFICIAL_SOURCE = { label: 'Steam公式告知（Patch 1.2.0.0 / 1.3.0.0）', url: 'https://steamcommunity.com/app/3932890/announcements/' }

// confidence: 'solid' 複数手順を確認済 / 'partial' 一部の分岐・条件が資料間で不一致 / 'reference' 進行を確定できない参考情報
export const STORY_META = {
  tour: {
    order: 1, confidence: 'partial', changed: false,
    summary: 'ゲーム開始から自動で始まる導入章。各トレーダーを訪ね、マップとトレーダーの解放を進めて Lab 脱出路の確認まで。',
    unlock: { text: 'ゲーム開始時から', confirmed: true },
    sources: [WIKI('Tour', 'Tour')],
    unconfirmed: [
      'Terminal・Woods・Lab の目標で「生還脱出が必要か」がWiki上で明記されていない',
      'Wikiの「任意目標」「Lab探索」節は空欄',
    ],
  },
  falling_skies: {
    order: 2, confidence: 'partial', changed: false,
    summary: 'Woods の墜落機を追う章。トレーダー聞き込み・フライトレコーダー・暗号解読を経て、最後の装甲ケースの扱いが The Ticket の分岐になる。',
    unlock: { text: 'Woods の墜落機の発見（Mechanic との会話でも始まるかはWiki上で未確認）', confirmed: false },
    sources: [WIKI('Falling Skies', 'Falling Skies')],
    branches: [
      { title: '装甲ケースの扱い（取り消し不可）', text: 'Praporに渡す → 報酬あり。手元に残す → Prapor の信頼度が下がる。選択は The Ticket の序盤ルートに自動で反映されます。' },
    ],
    unconfirmed: [
      '「Praporに渡す」報酬額が資料で不一致（Wiki: 1,000,000₽ / 旧データ: 1,500,000₽）。渡す2択のどちらも The Ticket では「Praporルート」として扱う',
      'Therapist への支払いの通貨（$/₽）と、SUV情報が支払い必須かが未確定',
      '暗号解読アイテム3種の名称がWikiに無い',
      'Standard / Left Behind 版への注意書きの理由が未記載',
    ],
  },
  the_ticket: {
    order: 3, confidence: 'partial', changed: true,
    summary: 'Falling Skies の結果で始まりが分かれ、Kerman に協力するか断るかで Terminal への道が変わる最大の分岐章。',
    unlock: { text: 'Falling Skies の完了後', confirmed: true },
    sources: [WIKI('The Ticket', 'The Ticket')],
    branches: [
      { title: '最初の分岐（Falling Skies の選択）', text: 'Praporルートと Mechanicルートで途中の依頼が異なり、どちらも Intelligence Center Lv1 と Kerman との会話から。' },
      { title: 'Kerman に協力するか', text: '協力 → 証拠収集へ進むか否かで Fallen / Debtor / Survivor / Savior 系に分岐。拒否 → ポート側の Survivor 系へ。' },
    ],
    unconfirmed: [
      '終わり方のラベル（Survivor / Debtor）が複数の分岐に重複しており、Wiki内で整理されていない',
      'Kerman からの連絡待ち時間が資料で不一致（旧40〜48時間 / 8月更新で12〜24時間と注記）',
      'Lab に30分以上いると失敗する可能性は推測のみ（報告なし）',
      'Lighthouse の証拠品1か所と一部実績は未確認',
      '「Choose Your Friends Wisely」完了で拒否ルートに切り替わるとの記述あり（ゲーム内未検証）',
    ],
  },
  batya: {
    order: 4, confidence: 'partial', changed: false,
    summary: 'BEAR部隊 Bogatyr の痕跡を追って各拠点を巡り、最後は Lightkeeper に行き着く捜索章。',
    unlock: { text: 'Customs / Woods / Reserve などで Bogatyr の痕跡を見つける（開始条件は報告ごとに異なる）', confirmed: false },
    sources: [WIKI('Batya', 'Batya')],
    unconfirmed: [
      '開始条件がWikiで1つに確定していない（5件の報告）',
      'Gnezdo拠点の位置が、ゲーム内の文言とWikiの観察で左右が食い違う',
      '24時間待ちは目安で、実際のタイマーは未確認',
      'Mechanic の関連タスクが無線後に解放されるかは要確認',
      'Peacekeeper・Fence の反応は未確認（Jaeger のみ確認済）',
    ],
  },
  the_unheard: {
    order: 5, confidence: 'partial', changed: false,
    summary: 'TerraGroup の研究と A.P. の足取りを追い、最後は A.P. の住居へ入る調査章。',
    unlock: { text: '「浄化についてのメモ」を拾う（出現は確定ではなく、拾えない場合がある）', confirmed: false },
    sources: [WIKI('The Unheard', 'The Unheard')],
    unconfirmed: [
      '開始メモが毎回出るとは限らない',
      'Elektronik待ちの発動条件と所要時間が不明',
      '一部目標（Unheardと Tarkov の関係など）は場所のヒントなし',
      'Lab の A.P. 手がかりが2か所あり、両方必要かは未記載',
    ],
  },
  blue_fire: {
    order: 6, confidence: 'partial', changed: false,
    summary: 'EMP と未知の装置の破片を追う章。破片を Mechanic に渡すか手元に残すかで報酬が変わる。',
    unlock: { text: 'Woods / Interchange のオレンジ色のポスターを拾う', confirmed: true },
    sources: [WIKI('Blue Fire', 'Blue Fire')],
    branches: [
      { title: '破片を渡すか残すか', text: '渡すと報酬（Intelligence Center の進行度で増える）。残す場合は渡す選択が失敗扱いになる。' },
    ],
    unconfirmed: [
      '破片の所在は推測（Scav・信者が持つ可能性）',
      'テープ0511/001の位置が未確認',
      'Item 1156 の手がかりが3か所挙がっているが、どれが必須かは未確認',
    ],
  },
  they_are_already_here: {
    order: 7, confidence: 'partial', changed: true,
    summary: '信者に関わる調査章。複数マップで手がかりを集め、Interchange の発電所で ARRS のリセットを押すかどうかが結末に影響する。',
    unlock: { text: 'マークされた部屋に入る／信者を倒す／魔法陣近くの手紙を読む（3通りの報告、アイテム名は未確定）', confirmed: false },
    sources: [WIKI('They Are Already Here', 'They Are Already Here')],
    branches: [
      { title: 'ARRS リセットを押すか', text: '押すと Mechanic からの仕様連絡で完了し、最良の結末と追加実績の条件になる。押さないと連絡は来ない。' },
    ],
    unconfirmed: [
      '開始条件の3通りは未確定',
      '司祭の討伐数が2→1に変更（2026-03-27の更新と注記）',
      'Wikiの目標一覧とヒント節の並び順が違う（本ツールはヒント節の順）',
      'Arlington キーカードの復元に必要なデータの入手方法が未記載',
    ],
  },
  accidental_witness: {
    order: 8, confidence: 'partial', changed: false,
    summary: 'Kozlov の行方を、Skier・Ragman・Reshala の手がかりを辿って追う章。最後に Shoreline の隠れ家で録音を再生して完了。',
    unlock: { text: 'Customs の寮近くの赤いスプレーの車に近づく、または関連メモを拾う', confirmed: true },
    sources: [WIKI('Accidental Witness', 'Accidental Witness')],
    unconfirmed: [
      '「メッセージ」節は確認中のまま',
      'Reshala の寝室メモ2点は画像が欠けている',
      'Room 110 の鍵はタスク専用アイテムではなく、他プレイヤーに取られることがある',
    ],
  },
  the_labyrinth: {
    order: 9, confidence: 'partial', changed: true,
    summary: '地下施設 The Labyrinth の探索章。Jaeger のキーカード待ちを挟み、BEAR部隊の痕跡と研究報告書を追う。',
    unlock: { text: 'Knossos LLC の施設キーのドアを開けて Labyrinth の入口に到達（実際に入る必要はない）', confirmed: true },
    sources: [WIKI('The Labyrinth', 'The Labyrinth')],
    unconfirmed: [
      'Jaeger の待ち時間（数日）が実時間かゲーム内か、何で終わるか不明',
      '研究報告書の入手が必須か任意かが資料内で矛盾',
      'Wikiの更新日が、表示中のゲーム版日付より新しく、位置情報が古い可能性',
    ],
  },
  'boreas-reference': {
    order: 10, confidence: 'reference', changed: true,
    summary: 'Boreas（Icebreaker 章）。進行を確定できる資料が揃っておらず、本ツールでは参考情報と手動記録のみ。完了判定・一括完了は行いません。',
    unlock: { text: 'Paradigm Shipping のポスター入手、または Intelligence Center Lv3 の無線', confirmed: false },
    sources: [WIKI('Boreas', 'Boreas')],
    outline: [
      'Mechanic に救難信号を相談 → Woods の基地局の機器を修理して報告',
      'Lighthouse で Paradigm Shipping の資料を見つけ、Mechanic に「Boreas」を尋ねる',
      'Prapor と BTR 運転手の手配（Falling Skies・BTR章の結果で内容が変わる）',
      'Shoreline / Lighthouse からボートで砕氷船へ。機関室→上層→船長',
      '屋上ハッチを解凍し、科学者の避難とデータ解析で完了',
    ],
    unconfirmed: [
      '各マップの出現位置の多くが「情報求む」のまま',
      'Prapor 分岐のキー位置・敵数・新ボス名が未確定',
      'Wikiの編集中表示あり。Patch 1.2.0.0 で PvE Zone の Icebreaker 章が解放条件に含まれる旨の告知あり',
    ],
  },
}

// 資料間の不一致などで「確認が必要」と表示するステップ
export const STORY_STEP_NOTES = {
  fs_therapist_suv: '通貨と支払い要否が資料で未確定',
}

export function getStoryMeta(id) { return STORY_META[id] || null }

export const CONFIDENCE_LABEL = {
  solid: { text: '根拠あり', cls: 'is-solid' },
  partial: { text: '一部未確認', cls: 'is-partial' },
  reference: { text: '参考のみ', cls: 'is-reference' },
}
