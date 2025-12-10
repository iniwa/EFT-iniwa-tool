// js/key_presets.js
// 全ての鍵を網羅したプリセットデータ
// (詳細情報がない鍵は "仮" として枠を作成しています)

const KEY_PRESETS = {
  // ==========================================
  // Factory (ファクトリー)
  // ==========================================
  "5448ba0b4bdc2d02308b456c": {
    "rating": "SS",
    "memo": "【脱出】Gate 0, Cellars 【部屋】鍵部屋(武器箱, ジャケット, ルーズルート) / ショートカット"
  }, // Factory emergency exit key
  "66acd6702b17692df20144c0": {
    "rating": "B",
    "memo": "【床】インテリジェンス, 高額技術品 【箱】金庫 (Polikhim)"
  }, // TerraGroup storage room keycard

  // ==========================================
  // Customs (カスタム)
  // ==========================================
  "5780cf7f2459777de4559322": {
    "rating": "SS",
    "memo": "【床】Marked: ドキュメントケース, キーマツ, 弾薬箱, 高ランク武器, 貴重品"
  }, // Dorm room 314 marked key
  "5780d0532459777a5108b9a2": {
    "rating": "A",
    "memo": "【床】インテリジェンス, 貴重品 【箱】金庫, PCx3, ジャケット, 医療バッグ (タスク: Delivery from the Past)"
  }, // Tarcone Director's Office key
  "59136e1e86f774432f15d133": {
    "rating": "A",
    "memo": "【床】貴重品(ベッド上), スマホ, フラッシュドライブ 【箱】金庫"
  }, // Dorm room 110 key
  "59387a4986f77401cc236e62": {
    "rating": "A",
    "memo": "【床】水, 食料 【箱】金庫, PC, 医療ケース (タスク: Pharmacist)"
  }, // Dorm room 114 key
  "59148c8a86f774197930e983": {
    "rating": "A",
    "memo": "【箱】金庫, 武器ロッカー"
  }, // Dorm room 204 key
  "5780cfa52459777dfb276eb1": {
    "rating": "A",
    "memo": "【床】貴重品, 本 【箱】金庫, 武器ボックス (タスク: Chemical - Part 1)"
  }, // Dorm room 220 key
  "5938504186f7740991483f30": {
    "rating": "B",
    "memo": "【床】貴重品, 弾薬 【箱】スポーツバッグ (214号室と連結) (タスク: Shaking up the Teller)"
  }, // Dorm room 203 key
  "5780cf942459777df90dcb72": {
    "rating": "B",
    "memo": "【箱】金庫 (203号室と連結)"
  }, // Dorm room 214 key
  "5780d0652459777df90dcb74": {
    "rating": "B",
    "memo": "【床】鍵, 医療品 【箱】金庫, 医療バッグ"
  }, // Gas station office key
  "5913877a86f774432f15d444": {
    "rating": "D",
    "memo": "【箱】金庫, 医療バッグ (※入るにはOfficeキーが必要) (タスク: Trust Regain)"
  }, // Gas station storage room key
  "5913915886f774123603c392": {
    "rating": "C",
    "memo": "【箱】武器ラック, グレネードボックス 【床】弾薬 (タスク: Trust Regain)"
  }, // Military checkpoint key
  "59136a4486f774447a1ed172": {
    "rating": "C",
    "memo": "【箱】武器箱x2, 弾薬箱"
  }, // Dorm guard desk key
  "591382d986f774465a6413a7": {
    "rating": "C",
    "memo": "【箱】金庫, ジャケット 【床】食料"
  }, // Dorm room 105 key
  "591383f186f7744a4c5edcf3": {
    "rating": "C",
    "memo": "【箱】道具箱, ジャケットx2"
  }, // Dorm room 104 key
  "5da743f586f7744014504f72": {
    "rating": "C",
    "memo": "【床】武器パーツ, 弾薬, 医療品 (リペアショップ地下)"
  }, // USEC stash key
  "5937ee6486f77408994ba448": {
    "rating": "C",
    "memo": "【タスク】Background Check (懐中時計) ※ルートなし"
  }, // Machinery key
  "5780d07a2459777de4559324": {
    "rating": "C",
    "memo": "【タスク】Golden Swag (ライターケース) 【床】武器パーツ"
  }, // Portable cabin key
  "5938144586f77473c2087145": {
    "rating": "C",
    "memo": "【タスク】Bad Rep Evidence (フォルダ)"
  }, // Portable bunkhouse key
  "593962ca86f774068014d9af": {
    "rating": "E",
    "memo": "【タスク】The Extortionist (書類) ※漁る価値なし"
  }, // Unknown key
  "593aa4be86f77457f56379f8": {
    "rating": "C",
    "memo": "【箱】武器箱, 木箱 (タスク: Trust Regain)"
  }, // Dorm room 303 key
  "5780cda02459777b272ede61": {
    "rating": "D",
    "memo": "【床】死体(ルート可), 弾薬箱, 武器パーツ (寮306)"
  }, // Dorm room 306 key
  "5780cf692459777de4559321": {
    "rating": "D",
    "memo": "【床】電子機器, 弾薬 (寮315)"
  }, // Dorm room 315 key
  "5780cf722459777a5108b9a1": {
    "rating": "D",
    "memo": "【床】医療品, 食料, お金 (寮308)"
  }, // Dorm room 308 key
  "5780cf9e2459777df90dcb73": {
    "rating": "D",
    "memo": "【箱】武器箱 (寮218)"
  }, // Dorm room 218 key
  "5913611c86f77479e0084092": {
    "rating": "E",
    "memo": "【タスク】Golden Swag (設置のみ) ※ルートなし"
  }, // Trailer park portable cabin key
  "5938603e86f77435642354f4": {
    "rating": "C",
    "memo": "【タスク】Operation Aquarius 1 (水部屋) ※ルートなし"
  }, // Dorm room 206 key
  "5938994586f774523a425196": {
    "rating": "E",
    "memo": "【床】食料, 椅子 (寮103 / ハズレ部屋)"
  }, // Dorm room 103 key
  "664d4b0103ef2c61246afb56": {
    "rating": "B",
    "memo": "【タスク】Against the Conscience 【箱】武器箱"
  }, // Dorm overseer key
  // --- Customs 追加 (仮) ---
  "5672c92d4bdc2d180f8b4567": { "rating": "-", "memo": "Dorm 118: " },
  "57a349b2245977762b199ec7": { "rating": "-", "memo": "Pump room front: ガスアナライザー等" },
  "593858c486f774253a24cb52": { "rating": "-", "memo": "Pump room back: " },
  "5914578086f774123569ffa4": { "rating": "-", "memo": "Dorm 108: PC, 弾薬" },

  // ==========================================
  // Shoreline (ショアライン)
  // ==========================================
  "5eff09cd30a7dc22fd1ddfed": {
    "rating": "SS",
    "memo": "【床】LEDX, 医療品(大量), インテリジェンス 【箱】PC, スーツケース"
  }, // Key with tape (East 110)
  "5a13f24186f77410e57c5626": {
    "rating": "SS",
    "memo": "【床】LEDX, グラボ, テトリス, 貴重品 (222/226は連結)"
  }, // East Wing Room 222
  "5a13f35286f77413ef1436b0": {
    "rating": "SS",
    "memo": "【床】LEDX, グラボ, テトリス, 貴重品 (222と同じ)"
  }, // East Wing Room 226
  "5a0eec9686f77402ac5c39f2": {
    "rating": "S",
    "memo": "【床】高額貴重品(ライオン, 金時計, 花瓶等) ※箱なし"
  }, // East Wing Room 310
  "5a13ef7e86f7741290491063": {
    "rating": "SS",
    "memo": "【床】LEDX, グラボ, 貴重品 【箱】PCx2 (304と連結)"
  }, // West Wing Room 301
  "5a0ee30786f774023b6ee08f": {
    "rating": "A",
    "memo": "【床】LEDX, グラボ, テトリス 【箱】武器箱x2, グレネード箱"
  }, // West Wing Room 216
  "5a13eebd86f7746fd639aa93": {
    "rating": "A",
    "memo": "【床】レッドキーカード, 弾薬, 食料 【箱】武器箱"
  }, // West Wing Room 218
  "5a0ec6d286f7742c0b518fb5": {
    "rating": "A",
    "memo": "【床】レッドキーカード, LEDX, 医療品 (203と連結)" 
  }, // West Wing Room 205
  "5a0eb6ac86f7743124037a28": {
    "rating": "S",
    "memo": "【床】高額武器パーツ, 貴重品 【箱】金庫, PC, 武器ロッカー"
  }, // Cottage back door key
  "5a0f068686f7745b0d4ea242": {
    "rating": "B",
    "memo": "【箱】金庫, PC ※コテージ裏口の鍵が必要"
  }, // Cottage safe key
  "5a0f08bc86f77478f33b84c2": {
    "rating": "SS",
    "memo": "【床】レッドキーカード, 貴重品 【箱】金庫"
  }, // Health Resort management office safe key
  "5a0f0f5886f7741c4e32a472": {
    "rating": "A",
    "memo": "【床】レアアイテム 【箱】金庫"
  }, // Health Resort management warehouse safe key
  "5a145d4786f7744cbb6f4a12": {
    "rating": "A",
    "memo": "【床】LEDX, 貴重品 【箱】PCx4 (308と連結)"
  }, // East Wing Room 306
  "5a145d7b86f7744cbb6f4a13": {
    "rating": "A",
    "memo": "【床】LEDX, 貴重品 【箱】PCx4 (306と連結)"
  }, // East Wing Room 308
  "5a0eed4386f77405112912aa": {
    "rating": "A",
    "memo": "【床】LEDX, 武器パーツ, 医療品 (313と連結)"
  }, // East Wing Room 314
  "5a0eecf686f7740350630097": {
    "rating": "A",
    "memo": "【床】LEDX, 武器パーツ (314と連結)"
  }, // East Wing Room 313
  "5a0eee1486f77402aa773226": {
    "rating": "A",
    "memo": "【床】テトリス, グラボ, 武器 【箱】PC"
  }, // East Wing Room 328
  "5a0ea64786f7741707720468": {
    "rating": "C",
    "memo": "【床】医療品, 書類, お金"
  }, // East Wing Room 107
  "5a0dc45586f7742f6b0b73e3": {
    "rating": "B",
    "memo": "【床】ブルーキーカード湧き, 医療品, 鎮痛剤"
  }, // West Wing Room 104
  "5a0dc95c86f77452440fc675": {
    "rating": "B",
    "memo": "【床】ブルーキーカード湧き, ビタミン (タスク: Vitamins)"
  }, // West Wing Room 112
  "5a0ea79b86f7741d4a35298e": {
    "rating": "C",
    "memo": "【床】電子機器, 道具"
  }, // Health Resort universal utility room key
  "5a0f006986f7741ffd2fe484": {
    "rating": "A",
    "memo": "【箱】金庫 (気象台)"
  }, // Weather station safe key
  "61aa5b7db225ac1ead7957c1": {
    "rating": "B",
    "memo": "【箱】金庫 (USECコテージ)"
  }, // USEC cottage first safe key
  "61aa5ba8018e9821b7368da9": {
    "rating": "B",
    "memo": "【箱】金庫 (USECコテージ)"
  }, // USEC cottage second safe key
  "66265d7be65f224b2e17c6aa": {
    "rating": "C",
    "memo": "【床】電子機器, 貴重品 (USECコテージ)"
  }, // USEC cottage room key
  "5a0eb38b86f774153b320eb0": {
    "rating": "D",
    "memo": "【床】武器, 弾薬 (コテージ前)"
  }, // SMW car key
  "5d8e15b686f774445103b190": {
    "rating": "C",
    "memo": "【箱】武器箱x4, 弾薬箱 (水力発電所)"
  }, // HEP station storage room key
  "5a0ea69f86f7741cd5406619": {
    "rating": "E",
    "memo": "【床】なし (E108 / ハズレ)"
  }, // E108
  "5a0ee37f86f774023657a86f": {
    "rating": "E",
    "memo": "【床】なし (W221 / ベランダからW218/222へ移動可)"
  }, // W221
  "5a0ee4b586f7743698200d22": {
    "rating": "C",
    "memo": "【床】レアアイテム 【箱】武器箱x3 (E205と連結)"
  }, // E206
  "5a0ee62286f774369454a7ac": {
    "rating": "E",
    "memo": "【床】弾薬, 医療品 (E209)"
  }, // E209
  "5a0ee72c86f77436955d3435": {
    "rating": "E",
    "memo": "【床】弾薬 (E213)"
  }, // E213
  "5a0ee76686f7743698200d5c": {
    "rating": "D",
    "memo": "【箱】武器箱, グレネード箱 (E216)"
  }, // E216
  "5a0eeb1a86f774688b70aa5c": {
    "rating": "E",
    "memo": "【床】ルーズルート (鍵不要で入れる) (W303)"
  }, // W303
  "5a0eeb8e86f77461257ed71a": {
    "rating": "E",
    "memo": "【床】お金, 食料 (W309)"
  }, // W309
  "5a0eebed86f77461230ddb3d": {
    "rating": "E",
    "memo": "【床】食料 (W325)"
  }, // W325
  "5a0eedb386f77403506300be": {
    "rating": "D",
    "memo": "【床】医療品, 食料 (E322)"
  }, // E322
  "5a0eff2986f7741fd654e684": {
    "rating": "C",
    "memo": "【箱】金庫, ロッカー (W321)"
  }, // W321 Safe
  "5a13ee1986f774794d4c14cd": {
    "rating": "E",
    "memo": "【床】武器 (ベランダから入れる) (W323)"
  }, // W323
  "5a13ef0686f7746e5a411744": {
    "rating": "C",
    "memo": "【床】医療品, 弾薬, 武器パーツ (W219)"
  }, // W219
  "5a144bdb86f7741d374bbde0": {
    "rating": "C",
    "memo": "【箱】武器箱, 医療バッグ (E206と連結)"
  }, // E205
  "5a144dfd86f77445cb5a0982": {
    "rating": "C",
    "memo": "【床】レッドカード湧き, 医療品 (W205と連結)"
  }, // W203
  "5a1452ee86f7746f33111763": {
    "rating": "C",
    "memo": "【箱】武器箱, 弾薬箱 (W221/218へ移動可)"
  }, // W222
  "5a145ebb86f77458f1796f05": {
    "rating": "B",
    "memo": "【箱】武器箱x2, アイテムケース"
  }, // E316
  "5a13f46386f7741dd7384b04": {
    "rating": "B",
    "memo": "【床】医療品, 死体(ルート可) (タスク: Cargo X - Part 2)"
  }, // W306
  // --- Shoreline 追加 (仮) ---
  "5a0ec70e86f7742c0b518fba": { "rating": "-", "memo": "W207: " },

  // ==========================================
  // Reserve (リザーブ)
  // ==========================================
  "5d80c60f86f77440373c4ece": {
    "rating": "SS",
    "memo": "【床】Marked: ドキュメントケース, キーマツ, 弾薬箱, 武器"
  }, // RB-BK marked key
  "5d80c62a86f7744036212b3f": {
    "rating": "SS",
    "memo": "【床】Marked: ドキュメントケース, キーマツ, 弾薬箱, 武器"
  }, // RB-VO marked key
  "5ede7a8229445733cb4c18e2": {
    "rating": "S",
    "memo": "【床】Marked: ドキュメントケース, キーマツ, 弾薬箱, 武器"
  }, // RB-PKPM marked key
  "5d9f1fa686f774726974a992": {
    "rating": "S",
    "memo": "【床】戦車バッテリー, OFZ砲弾, AESA, 高額パーツ 【箱】武器箱"
  }, // RB-ST
  "5d8e0e0e86f774321140eb56": {
    "rating": "A",
    "memo": "【床】インテリジェンス 【箱】金庫x2, 武器箱"
  }, // RB-KPRL
  "5d80c88d86f77440556dbf07": {
    "rating": "A",
    "memo": "【床】インテリジェンス, MP7等, 貴重品 【箱】武器箱x3, ジャケット"
  }, // RB-AM
  "5d80c8f586f77440373c4ed0": {
    "rating": "B",
    "memo": "【床】インテリジェンス, SSD, 貴重品 【箱】ドロワー"
  }, // RB-OP
  "5ede7b0c6d23e5473e6e8c66": {
    "rating": "B",
    "memo": "【床】インテリジェンス, 軍用技術品 【箱】PCx5 (RB-RSと連結)"
  }, // RB-RLSA
  "5d80cb3886f77440556dbf09": {
    "rating": "B",
    "memo": "【箱】技術サプライクレートx2, 医療サプライクレートx2 (地下ケージ)"
  }, // RB-PSP1
  "5d80cb5686f77440545d1286": {
    "rating": "B",
    "memo": "【箱】技術サプライクレートx2, 食料サプライクレートx2 (地下ケージ)"
  }, // RB-PSV1
  "5d95d6be86f77424444eb3a7": {
    "rating": "B",
    "memo": "【箱】技術サプライクレートx2, 医療サプライクレートx2 (地下ケージ)"
  }, // RB-PSV2
  "5d95d6fa86f77424484aa5e9": {
    "rating": "B",
    "memo": "【箱】技術サプライクレートx2, 食料サプライクレートx2 (地下ケージ)"
  }, // RB-PSP2
  "5da46e3886f774653b7a83fe": {
    "rating": "B",
    "memo": "【箱】ツールセット, 武器パーツ (RB-RLSAと連結)"
  }, // RB-RS
  "5d8e3ecc86f774414c78d05e": {
    "rating": "B",
    "memo": "【箱】武器箱, ツールセット (RB-STの奥)"
  }, // RB-GN
  "5d947d3886f774447b415893": {
    "rating": "C",
    "memo": "【床】医療品, 鎮痛剤, 検眼鏡"
  }, // RB-SMP
  "5d947d4e86f774447b415895": {
    "rating": "C",
    "memo": "【床】医療品 (SMPの向かい)"
  }, // RB-KSM
  "68e9654d72488961110dbf69": {
    "rating": "B",
    "memo": "【箱】技術クレートx2, 医療クレートx2 (地下バンカー)"
  }, // RB-PKPTS
  "5d80c66d86f774405611c7d6": {
    "rating": "C",
    "memo": "【箱】武器ラック, 武器箱x2"
  }, // RB-AO
  "5d80c6c586f77440351beef1": {
    "rating": "D",
    "memo": "【床】インテリジェンス(低確率)"
  }, // RB-OB
  "5d80c6fc86f774403a401e3c": {
    "rating": "B",
    "memo": "【箱】武器ラック, 武器箱 (RB-BKの隣)"
  }, // RB-TB
  "5d80c78786f774403a401e3e": {
    "rating": "C",
    "memo": "【箱】PC, 武器ラック"
  }, // RB-AK
  "5d80c93086f7744036212b41": {
    "rating": "D",
    "memo": "【箱】ドロワー, ジャケット"
  }, // RB-MP11
  "5d80c95986f77440351beef3": {
    "rating": "D",
    "memo": "【箱】ドロワー, 書類"
  }, // RB-MP12
  "5d80ca9086f774403a401e40": {
    "rating": "D",
    "memo": "【箱】ドロワー, インテリジェンス(低確率)"
  }, // RB-MP21
  "5d80cab086f77440535be201": {
    "rating": "C",
    "memo": "【箱】武器ラック, 弾薬, 戦車バッテリー(稀)"
  }, // RB-MP22
  "5d80cb8786f774405611c7d9": {
    "rating": "E",
    "memo": "【床】ルーズルート, 椅子"
  }, // RB-PP
  "5d80cbd886f77470855c26c2": {
    "rating": "D",
    "memo": "【床】インテリジェンス(低確率)"
  }, // RB-MP13
  "5d80ccac86f77470841ff452": {
    "rating": "C",
    "memo": "【箱】武器ラック, 弾薬"
  }, // RB-ORB1
  "5d80ccdd86f77474f7575e02": {
    "rating": "C",
    "memo": "【箱】武器ラック, 弾薬"
  }, // RB-ORB2
  "5d80cd1a86f77402aa362f42": {
    "rating": "C",
    "memo": "【箱】武器ラック, 弾薬, 武器箱"
  }, // RB-ORB3
  "5d8e0db586f7744450412a42": {
    "rating": "C",
    "memo": "【床】インテリジェンス"
  }, // RB-KORL
  "5da5cdcd86f774529238fb9b": {
    "rating": "C",
    "memo": "【箱】武器ラック, ドロワー"
  }, // RB-RH

  // ==========================================
  // Interchange (インターチェンジ)
  // ==========================================
  "5e42c71586f7747f245e1343": {
    "rating": "SS",
    "memo": "【床】LEDX, 除細動器, 検眼鏡, 携帯用組織マトリックス (要電源)"
  }, // Ultra medical storage key
  "5ad5d7d286f77450166e0a89": {
    "rating": "S",
    "memo": "【扉】KIBA店外側 (要電源)"
  }, // KIBA Arms outer door key
  "5addaffe86f77470b455f900": {
    "rating": "S",
    "memo": "【床】高額武器(壁掛け), アーマー, ヘルメット, パーツ 【箱】武器箱 (要電源)"
  }, // KIBA Arms inner door key
  "5e42c81886f7742a01529f57": {
    "rating": "SS",
    "memo": "【床】ビットコイン, GPコイン, 貴重品, 武器 【脱出】セーフルーム (要電源)"
  }, // Object #11SR keycard
  "5e42c83786f7742a021fdf3c": {
    "rating": "A",
    "memo": "【箱】武器箱x3, 装備品類 (コンテナの中)"
  }, // Object #21WS keycard
  "5ad5d64486f774079b080af8": {
    "rating": "C",
    "memo": "【床】食料, 輸液, 医療品"
  }, // Pharmacy key
  "5ad5db3786f7743568421cce": {
    "rating": "B",
    "memo": "【床】医療品 (稀にLEDX) 【箱】医療バッグ, ジャケット"
  }, // Emercom medical unit key
  "5ad5ccd186f774446d5706e9": {
    "rating": "D",
    "memo": "【箱】PC (OLI事務所)"
  }, // OLI administration office key
  "5ad5cfbd86f7742c825d6104": {
    "rating": "C",
    "memo": "【床】書類 (タスク: Database - Part 2) (OLI物流)"
  }, // OLI logistics department office key
  "5ad5d49886f77455f9731921": {
    "rating": "D",
    "memo": "【箱】武器箱, 道具箱"
  }, // Power substation utility cabin key
  "5ad5d20586f77449be26d877": {
    "rating": "D",
    "memo": "【床】医療品 (OLI備品室)"
  }, // OLI outlet utility room key
  "5ad7217186f7746744498875": {
    "rating": "D",
    "memo": "【箱】レジ (お金) (OLI)"
  }, // OLI cash register key
  "5ad7242b86f7740a6a3abd43": {
    "rating": "D",
    "memo": "【箱】レジ (お金) (IDEA)"
  }, // IDEA cash register key
  "5ad7247386f7747487619dc3": {
    "rating": "D",
    "memo": "【箱】レジ (お金) (Goshan)"
  }, // Goshan cash register key

  // ==========================================
  // Lighthouse (ライトハウス)
  // ==========================================
  "61a64492ba05ef10d62adcc1": {
    "rating": "SS",
    "memo": "【床】高額貴重品, 武器, 高クラスアーマー (浄水場・北館)"
  }, // Rogue USEC stash key
  "61a6444b8c141d68246e2d2f": {
    "rating": "S",
    "memo": "【床】VPX, RFID, ビットコイン, 武器, 弾薬 (丘の上の家)"
  }, // Hillside house key
  "61aa5b518f5e7a39b41416e2": {
    "rating": "A",
    "memo": "【床】ビットコイン, ユーロ, ドル, 貴重品 (トランク内)"
  }, // Merin car trunk key
  "62987dfc402c7f69bf010923": {
    "rating": "SS",
    "memo": "【床】Marked: 高ランク武器, 貴重品, ドキュメントケース"
  }, // Shared bedroom marked key
  "62987cb98081af308d7558c8": {
    "rating": "A",
    "memo": "【床】インテリジェンス, ビットコイン, VPX, RFID 【箱】金庫 (浄水場)"
  }, // Conference room key
  "62987c658081af308d7558c6": {
    "rating": "A",
    "memo": "【床】インテリジェンス, 貴重品, ドロワー (レーダー)"
  }, // Radar station commandant room key
  "62987da96188c076bc0d8c51": {
    "rating": "B",
    "memo": "【床】医療品, 貴重品, 刺激物 (浄水場)"
  }, // Operating room key
  "62a9cb937377a65d7b070cef": {
    "rating": "A",
    "memo": "【床】武器, 弾薬, 貴重品 【箱】武器箱 (浄水場)"
  }, // Rogue USEC barrack key
  "62987e26a77ec735f90a2995": {
    "rating": "B",
    "memo": "【床】貴重品, 武器パーツ 【箱】武器箱 (浄水場)"
  }, // Water treatment plant storage room key
  "61aa81fcb225ac1ead7957c3": {
    "rating": "C",
    "memo": "【箱】武器箱, 改造された武器 (浄水場)"
  }, // Rogue USEC workshop key

  // ==========================================
  // Streets of Tarkov (ストリート)
  // ==========================================
  "64d4b23dc1b37504b41ac2b6": {
    "rating": "SS",
    "memo": "【床】Marked Key(全種類からランダム), 貴重品"
  }, // Rusted bloody key
  "6582dbf0b8d7830efc45016f": {
    "rating": "SS",
    "memo": "【床】ムーンシャイン, ウイスキー, ビットコイン, 貴重品(大量)"
  }, // Relaxation room key
  "63a3a93f8a56922e82001f5d": {
    "rating": "SS",
    "memo": "【床】Marked: SICCケース, キーマツ, ドキュメントケース, 高額武器"
  }, // Abandoned factory marked key
  "63a39fc0af870e651d58e6ae": {
    "rating": "S",
    "memo": "【床】ビットコイン, ロレックス, 貴重品, 武器, 死体"
  }, // Chekannaya 15 apartment key
  "63a397d3af870e651d58e65b": {
    "rating": "S",
    "memo": "【床】RSH-12, 高額貴重品, 酒類 (※Rusted Keyが必要)"
  }, // Car dealership closed section key
  "63a71e922b25f7513905ca20": {
    "rating": "A",
    "memo": "【床】ビットコイン, GPコイン 【箱】金庫, PC"
  }, // Concordia apartment 64 key
  "63a39c7964283b5e9c56b280": {
    "rating": "B",
    "memo": "【箱】金庫, PC 【床】貴重品"
  }, // Concordia security room key
  "63a39667c9b3aa4b61683e98": {
    "rating": "B",
    "memo": "【床】貴重品 【箱】PC, ドロワー (Finance Office)"
  }, // Financial institution office key
  "64ccc25f95763a1ae376e447": {
    "rating": "S",
    "memo": "【床】Marked: 貴重品, 武器 (Chek 13)"
  }, // Mysterious room marked key
  "64ccc1fe088064307e14a6f7": {
    "rating": "A",
    "memo": "【床】貴重品, お酒 【箱】金庫 (Beluga)"
  }, // Beluga restaurant director key
  "64ccc246ff54fb38131acf29": {
    "rating": "B",
    "memo": "【床】LEDX, 医療品 (X-ray)"
  }, // X-ray room key
  "63a39e1d234195315d4020bd": {
    "rating": "B",
    "memo": "【脱出】Skybridge (タスク: Audiophile)"
  }, // Primorsky 46-48 skybridge key
  "63a39f6e64283b5e9c56b289": {
    "rating": "B",
    "memo": "【床】医療品 (Chek 15へのショートカット等)"
  }, // Iron gate key
  "63a39fd1c9b3aa4b61683efb": {
    "rating": "C",
    "memo": "【箱】スポーツバッグ (Chek 15の建物)"
  }, // Stair landing key
  "63a399193901f439517cafb6": {
    "rating": "B",
    "memo": "【箱】ドロワー, PC 【床】インテリジェンス (LexOs Director)"
  }, // Car dealership director's office room key
  "63a39c69af870e651d58e6aa": {
    "rating": "C",
    "memo": "【箱】金庫 (Store Manager)"
  }, // Store manager's key
  "63a39cb1c9b3aa4b61683ee2": {
    "rating": "C",
    "memo": "【箱】ダッフルバッグ, 道具箱 (Construction)"
  }, // Construction site bunkhouse key
  "63a39ce4cd6db0635c1975fa": {
    "rating": "D",
    "memo": "【箱】デッドスカブ (Supply Dept)"
  }, // Supply department director's office key
  "63a39ddda3a2b32b5f6e007a": {
    "rating": "B",
    "memo": "【箱】金庫 (Apt Safe)"
  }, // Apartment locked room safe key
  "63a39df18a56922e82001f25": {
    "rating": "C",
    "memo": "【床】貴重品 (Zmeisky 5)"
  }, // Zmeisky 5 apartment 20 key
  "63a39dfe3901f439517cafba": {
    "rating": "C",
    "memo": "【床】貴重品 (Zmeisky 3)"
  }, // Zmeisky 3 apartment 8 key
  "63a39e49cd6db0635c1975fc": {
    "rating": "C",
    "memo": "【箱】ドロワー (Archive)"
  }, // Archive room key
  "63a39e5b234195315d4020bf": {
    "rating": "B",
    "memo": "【箱】金庫 (Housing Office 2F)"
  }, // Housing office second floor safe key
  "63a39e6acd6db0635c1975fe": {
    "rating": "B",
    "memo": "【箱】金庫 (Housing Office 1F)"
  }, // Housing office first floor safe key
  "63a39f08cd6db0635c197600": {
    "rating": "C",
    "memo": "【箱】金庫 (Pinewood 215)"
  }, // Pinewood hotel room 215 key
  "63a39f18c2d53c2c6839c1d3": {
    "rating": "C",
    "memo": "【床】貴重品 (Pinewood 206)"
  }, // Pinewood hotel room 206 key
  "63a39fdf1e21260da44a0256": {
    "rating": "B",
    "memo": "【箱】武器箱, 武器パーツ (Container)"
  }, // Cargo container mesh door key
  "63a71e781031ac76fe773c7d": {
    "rating": "C",
    "memo": "【床】貴重品 (Conc 8)"
  }, // Concordia apartment 8 room key
  "63a71e86b7f4570d3a293169": {
    "rating": "B",
    "memo": "【箱】PC, 金庫 (Conc 64 Office)"
  }, // Concordia apartment 64 office room key
  "63a71eb5b7f4570d3a29316b": {
    "rating": "C",
    "memo": "【床】貴重品 (Primorsky 48)"
  }, // Primorsky 48 apartment key
  "63a71ed21031ac76fe773c7f": {
    "rating": "C",
    "memo": "【床】貴重品 (Finance Small)"
  }, // Financial institution small office key
  "64ccc1d4a0f13c24561edf27": {
    "rating": "C",
    "memo": "【箱】金庫 (Conc 34)"
  }, // Concordia apartment 34 room key
  "64ccc1ec1779ad6ba200a137": {
    "rating": "C",
    "memo": "【床】貴重品 (Conc Cinema)"
  }, // Concordia apartment 8 home cinema key
  "64ccc1f4ff54fb38131acf27": {
    "rating": "C",
    "memo": "【箱】金庫 (Conc 63)"
  }, // Concordia apartment 63 room key
  "64ccc206793ca11c8f450a38": {
    "rating": "C",
    "memo": "【床】貴重品 (TG Meeting)"
  }, // TerraGroup meeting room key
  "64ccc2111779ad6ba200a139": {
    "rating": "D",
    "memo": "【箱】レジ (お金) (Tarbank)"
  }, // Tarbank cash register department key
  "64ccc24de61ea448b507d34d": {
    "rating": "B",
    "memo": "【箱】武器箱, 武器ラック (TG Armory)"
  }, // TerraGroup security armory key
  "64ccc268c41e91416064ebc7": {
    "rating": "D",
    "memo": "【箱】スポーツバッグ (PE Teacher)"
  }, // PE teacher's office key
  "64ce572331dd890873175115": {
    "rating": "B",
    "memo": "【床】貴重品, 金庫 (Aspect)"
  }, // Aspect company office key
  "6581998038c79576a2569e11": {
    "rating": "D",
    "memo": "【箱】レジ (お金) (Unity Bank)"
  }, // Unity Credit Bank cash register key
  "658199a0490414548c0fa83b": {
    "rating": "E",
    "memo": "【床】なし (Horse Toilet)"
  }, // Horse restaurant toilet key
  "658199aa38c79576a2569e13": {
    "rating": "B",
    "memo": "【床】電子機器, 貴重品 (TG Science)"
  }, // TerraGroup science office key
  "6582dbe43a2e5248357dbe9a": {
    "rating": "C",
    "memo": "【床】貴重品 (Negotiation)"
  }, // "Negotiation" room key
  "6582dc4b6ba9e979af6b79f4": {
    "rating": "B",
    "memo": "【箱】武器箱x2 (MVD)"
  }, // MVD academy entrance hall guard room key
  "6582dc5740562727a654ebb1": {
    "rating": "B",
    "memo": "【床】インテリジェンス, 貴重品 (REA)"
  }, // Real estate agency office room key
  "6582dc63cafcd9485374dbc5": {
    "rating": "C",
    "memo": "【箱】ドロワー (UC Archive)"
  }, // Unity Credit Bank archive room key
  "6391fcf5744e45201147080f": {
    "rating": "C",
    "memo": "【床】貴重品 (Primorsky Ave)"
  }, // Primorsky Ave apartment key
  "6398fd8ad3de3849057f5128": {
    "rating": "E",
    "memo": "【タスク】Door (Backup Hideout)"
  }, // Backup hideout key
  "6761a6f90575f25e020816a4": {
    "rating": "C",
    "memo": "【箱】金庫 (Company Director)"
  }, // Company director's room key
  "68e63b56ad8cba49190ea529": {
    "rating": "E",
    "memo": "【床】なし (Rus Post)"
  }, // Rus Post car key
  "68e960db934bf7b02d005dab": {
    "rating": "C",
    "memo": "【床】貴重品 (Zmeisky 3)"
  }, // Zmeisky 3 apartment key
  "68e96180901b9b10270f1eed": {
    "rating": "C",
    "memo": "【床】貴重品 (Cult Victim)"
  }, // Cult victim's apartment key

  // ==========================================
  // The Lab (ラボ)
  // ==========================================
  "5c1d0efb86f7744baf2e7b7b": {
    "rating": "S",
    "memo": "【床】M4A1, MP5, 貴重品, 弾薬 【箱】武器庫 (Red)"
  }, // Red keycard
  "5c1e495a86f7743109743dfb": {
    "rating": "A",
    "memo": "【床】高額武器パーツ, COFDM, VPX, 貴重品 【箱】武器箱 (Violet)"
  }, // Violet keycard
  "5c1d0f4986f7744bb01837fa": {
    "rating": "SS",
    "memo": "【床】LEDX, スティム(大量), 医療品 (Black)"
  }, // Black keycard
  "5c1d0dc586f7744baf2e7b79": {
    "rating": "S",
    "memo": "【床】LEDX, インテリジェンス, ブラックカード 【箱】武器箱 (Green)"
  }, // Green keycard
  "5c1d0d6d86f7744bb2683e1f": {
    "rating": "B",
    "memo": "【床】LEDX, 貴重品, 武器 【操作】パーキングのアラーム解除 (Yellow)"
  }, // Yellow keycard
  "5c1d0c5f86f7744bb2683cf0": {
    "rating": "C",
    "memo": "【床】LEDX, 医療品 (高額品は少なめ) (Blue)"
  }, // Blue keycard
  "5c1e2a1e86f77431ea0ea84c": {
    "rating": "A",
    "memo": "【床】インテリジェンス, 貴重品 (ガラス張りで危険) (Manager)"
  }, // Lab. Manager office key
  "5c1e2d1f86f77431e9280bee": {
    "rating": "B",
    "memo": "【床】武器, 弾薬, マガジン (Weapon Testing)"
  }, // Weapon testing area key
  "5c1f79a086f7746ed066fb8f": {
    "rating": "B",
    "memo": "【床】レアアイテム (Red Keycard部屋の中) (Arsenal Storage)"
  }, // Arsenal storage room key
  "6711039f9e648049e50b3307": {
    "rating": "A",
    "memo": "【床】貴重品, 医療品, 電子機器 (Residential)"
  }, // Residential unit keycard
  "5c94bbff86f7747ee735c08f": {
    "rating": "-",
    "memo": "ラボ入場用カード"
  }, // TerraGroup Labs access keycard

  // ==========================================
  // Ground Zero (グラウンドゼロ)
  // ==========================================
  "658199972dc4e60f6d556a2f": {
    "rating": "A",
    "memo": "【箱】武器箱, 弾薬箱, 医療バッグ (Terragroup裏) (Utility)"
  }, // Underground parking utility room key
  "658199aa38c79576a2569e13": {
    "rating": "B",
    "memo": "【床】HDD, 貴重品 【箱】PC, ドロワー (Science)"
  }, // TerraGroup science office key
  "6581998038c79576a2569e11": {
    "rating": "C",
    "memo": "【箱】レジ (お金) (Unity Bank)"
  }, // Unity Credit Bank cash register key
  "6582dc4b6ba9e979af6b79f4": {
    "rating": "B",
    "memo": "【箱】武器箱x2, 弾薬 (MVD)"
  }, // MVD academy entrance hall guard room key
  "6866ad3853330f9b83064cf9": {
    "rating": "E",
    "memo": "【タスク】Burning Rubber (Black Division)"
  }, // Black Division keycard

  // ==========================================
  // Woods (ウッズ)
  // ==========================================
  "5d08d21286f774736e7c94c3": {
    "rating": "S",
    "memo": "【箱】レッドカード等のキーカード, 貴重品 (1回使い切り) (Shturman)"
  }, // Shturman's stash key
  "591afe0186f77431bd616a11": {
    "rating": "B",
    "memo": "【脱出】ZB-014 【床】60連マガジン, 弾薬"
  }, // ZB-014 key
  "664d3db6db5dea2bad286955": {
    "rating": "A",
    "memo": "【箱】武器箱, 貴重品 (Shatun)"
  }, // Shatun's hideout key
  "664d3dd590294949fe2d81b7": {
    "rating": "A",
    "memo": "【箱】武器箱, 貴重品 (Grumpy)"
  }, // Grumpy's hideout key
  "664d3ddfdda2e85aca370d75": {
    "rating": "A",
    "memo": "【箱】武器箱, 貴重品 (Voron)"
  }, // Voron's hideout key
  "664d3de85f2355673b09aed5": {
    "rating": "A",
    "memo": "【箱】武器箱, 貴重品 (Leon)"
  }, // Leon's hideout key
  "6761a6ccd9bbb27ad703c48a": {
    "rating": "C",
    "memo": "【床】食料, 弾薬 (Old House)"
  }, // Old house room key
  "591ae8f986f77406f854be45": {
    "rating": "D",
    "memo": "【床】ルーズルート (Yotota)"
  }, // Yotota car key

  // ==========================================
  // Others / Task / Event / Unsorted (その他・仮)
  // ==========================================
  "62a09ec84f842e1bd12da3f2": { "rating": "E", "memo": "【タスク】Collector用 (Missam)" },
  "5671446a4bdc2d97058b4569": { "rating": "-", "memo": "Pistol case key: " },
  "590de4a286f77423d9312a32": { "rating": "-", "memo": "Folding car key (Yellow): " },
  "5913611c86f77479e0084092": { "rating": "E", "memo": "【タスク】Golden Swag (Portable Cabin)" },
  "5913651986f774432f15d132": { "rating": "-", "memo": "VAZ car key: " },
  "59136f6f86f774447a1ed173": { "rating": "-", "memo": "Folding car key (Brown): " },
  "59148f8286f7741b951ea113": { "rating": "-", "memo": "Weapon safe key: " },
  "593858c486f774253a24cb52": { "rating": "-", "memo": "Pump room back: " },
  "5a0eb38b86f774153b320eb0": { "rating": "D", "memo": "SMW car key: 武器, 弾薬" },
  "5ad5d20586f77449be26d877": { "rating": "D", "memo": "OLI utility: 医療品" },
  "5efde6b4f5448336730dbd61": { "rating": "-", "memo": "Blue marking keycard: Sanitar部屋用 (単回)" },
  "61a6446f4b5f8b70f451b166": { "rating": "-", "memo": "Cold storage: " },
  "61aa5aed32a4743c3453d319": { "rating": "-", "memo": "Police truck: " },
  "678fa929819ddc4c350c0317": { "rating": "-", "memo": "Valve handwheel" },
  "679b9716597ba2ed120c3d3f": { "rating": "-", "memo": "Knossos (Task: Hidden Layer)" },
  "679b9819a2f2dd4da9023512": { "rating": "-", "memo": "Labrys (Task: Forced Alliance)" },
  "679baa2c61f588ae2b062a24": { "rating": "-", "memo": "Key 01 (Labyrinth)" },
  "679baa4f59b8961f370dd683": { "rating": "-", "memo": "Key 02 (Labyrinth)" },
  "679baa5a59b8961f370dd685": { "rating": "-", "memo": "Key 03 (Labyrinth)" },
  "679baa9091966fe40408f149": { "rating": "-", "memo": "Key 04 (Labyrinth)" },
  "679baace4e9ca6b3d80586b2": { "rating": "-", "memo": "Observation (Labyrinth)" },
  "679baae891966fe40408f14c": { "rating": "-", "memo": "Torture (Labyrinth)" },
  "679bab714e9ca6b3d80586b4": { "rating": "-", "memo": "Corpse (Labyrinth)" },
  "679bac1d61f588ae2b062a26": { "rating": "-", "memo": "Labyrinth key" },
  "67ab3d4b83869afd170fdd3f": { "rating": "-", "memo": "BBQ Gas torch" },
  "67bdea8667098e658f064695": { "rating": "-", "memo": "Kruglov RFID" },
  "67bdf04d66ca1d79a2024637": { "rating": "-", "memo": "Activated RFID" },
  "67bdf0e67c1ef7a648043531": { "rating": "-", "memo": "Safe Keycard" },
  "67c031b79320f644db06f456": { "rating": "-", "memo": "Blank RFID" },
  "67c033fd0610e91bea056998": { "rating": "-", "memo": "Mr.K RFID" },
  "67c04a6f9152fbdfa306cc66": { "rating": "-", "memo": "Prapor RFID" },
  "67c04dac9320f644db06f45c": { "rating": "-", "memo": "RFID L." },
  "67e183377c6c2011970f3149": { "rating": "-", "memo": "Ariadne" },
  "67ee7680562d5057e60ccc3a": { "rating": "C", "memo": "TG apartment: 武器箱" },
  "6866adbe09b973bf45094339": { "rating": "-", "memo": "Pier door" },
  "68c14b734a7e0bada00f8fd4": { "rating": "A", "memo": "A.P. Green (Task)" },
  "68c165f1903341d88b092b2a": { "rating": "C", "memo": "Cardinal: 貴重品" },
  "68cc09872bdcc15c010c2668": { "rating": "-", "memo": "14-4 Pass" },
  "68e7d904aded99fd1a0624f2": { "rating": "A", "memo": "A.P. Red (Task)" },
  "68e7d984308332889e0b5e71": { "rating": "A", "memo": "A.P. Blue (Task)" },
  "68e95d71a3d110355b03e529": { "rating": "B", "memo": "Elektronik: 電子機器" },
  "68e95f4fa4a577e907015787": { "rating": "C", "memo": "Reshala: 食料" }
};