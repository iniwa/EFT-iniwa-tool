// js/key_presets.js
// IDベースの鍵プリセットデータ

const KEY_PRESETS = {
  // --- Custom ---
  "5780cf7f2459777de4559322": { "rating": "SS", "memo": "マークドルーム (ドキュメントケース/武器/貴重品)" }, // Dorm room 314 marked key
  "593aa4be86f77457f56379f8": { "rating": "B", "memo": "武器箱 / 木箱" }, // Dorm room 303 key
  "5780cda02459777b272ede61": { "rating": "D", "memo": "死体 / 弾薬箱 / 武器パーツ" }, // Dorm room 306 key
  "5780cf722459777a5108b9a1": { "rating": "D", "memo": "医療品 / 食料 / お金" }, // Dorm room 308 key
  "5780cf692459777de4559321": { "rating": "D", "memo": "電子機器 / 弾薬 / 武器パーツ" }, // Dorm room 315 key
  "5780cfa52459777dfb276eb1": { "rating": "A", "memo": "金庫 / 貴重品" }, // Dorm room 220 key
  "5780cf942459777df90dcb72": { "rating": "A", "memo": "金庫 / 203号室と連結 (タスク部屋へ行ける)" }, // Dorm room 214 key
  "59148c8a86f774197930e983": { "rating": "A", "memo": "金庫 / 武器ロッカー" }, // Dorm room 204 key
  "5938504186f7740991483f30": { "rating": "A", "memo": "金庫 / 武器箱 / 214号室と連結" }, // Dorm room 203 key
  "59136e1e86f774432f15d133": { "rating": "A", "memo": "金庫 / ベッド上の貴重品" }, // Dorm room 110 key
  "59387a4986f77401cc236e62": { "rating": "A", "memo": "金庫 / PC / 医療ケース" }, // Dorm room 114 key
  "5914578086f774123569ffa4": { "rating": "E", "memo": "PC / 探索可能オブジェクトなし" }, // Dorm room 108 key
  "5672c92d4bdc2d180f8b4567": { "rating": "A", "memo": "金庫 / 衣服" }, // Dorm room 118 key
  "591382d986f774465a6413a7": { "rating": "A", "memo": "金庫 / 衣服" }, // Dorm room 105 key
  "591383f186f7744a4c5edcf3": { "rating": "C", "memo": "工具箱 / ジャケットx2 (鍵探し用)" }, // Dorm room 104 key
  "59136a4486f774447a1ed172": { "rating": "C", "memo": "武器箱 / 弾薬箱 (外から撃たれやすい)" }, // Dorm guard desk key
  "5780d0532459777a5108b9a2": { "rating": "A", "memo": "金庫 / PC x3 / インテリジェンス / タスクアイテム" }, // Tarcone Director's Office key
  "5448ba0b4bdc2d02308b456c": { "rating": "SS", "memo": "ショートカット開通 / 脱出地点(ZB-013)使用" }, // Factory emergency exit key
  "5780d0652459777df90dcb74": { "rating": "B", "memo": "金庫 / 医療バッグ / 弾薬" }, // Gas station office key
  "5913877a86f774432f15d444": { "rating": "D", "memo": "医療バッグ / 金庫(オフィス鍵が必要)" }, // Cabinet key (Gas station storage)
  "5780d07a2459777de4559324": { "rating": "C", "memo": "タスクアイテム (書類) / 武器パーツ" }, // Portable cabin key
  "5938144586f77473c2087145": { "rating": "C", "memo": "タスクアイテム (書類)" }, // Portable bunkhouse key
  "5913611c86f77479e0084092": { "rating": "C", "memo": "タスクアイテム (書類)" }, // Trailer park portable cabin key
  "593962ca86f774068014d9af": { "rating": "E", "memo": "タスクアイテム (書類) / 漁る価値なし" }, // Unknown key
  "5937ee6486f77408994ba448": { "rating": "C", "memo": "タスクアイテム (時計)" }, // Machinery key
  "5913915886f774123603c392": { "rating": "C", "memo": "武器ラック / グレネードボックス / 弾薬" }, // Military checkpoint key

  // --- Shoreline ---
  "5a0ea64786f7741707720468": { "rating": "D", "memo": "医療品 / 書類 / お金" }, // East Wing Room 107 Key
  "5eff09cd30a7dc22fd1ddfed": { "rating": "SS", "memo": "LEDX / サニターの手術室 / 医療品 / 金庫" }, // Key with tape
  "5a144bdb86f7741d374bbde0": { "rating": "C", "memo": "医療品 / 武器箱 / レアアイテム (206と連結)" }, // East Wing Room 205 Key
  "5a0ee4b586f7743698200d22": { "rating": "C", "memo": "医療品 / 武器箱 (205と連結)" }, // East Wing Room 206 Key
  "5a0eb38b86f774153b320eb0": { "rating": "D", "memo": "武器 / 弾薬 / 安い鍵" }, // SMW car key
  "5a13f24186f77410e57c5626": { "rating": "SS", "memo": "LEDX / グラボ / 貴重品 / 武器箱 (連結部屋)" }, // East Wing Room 222
  "5a13f35286f77413ef1436b0": { "rating": "SS", "memo": "LEDX / グラボ / 貴重品 / 武器箱 (連結部屋)" }, // East Wing Room 226
  "5a145d4786f7744cbb6f4a12": { "rating": "A", "memo": "LEDX / 貴重品 / PC x4 (連結部屋)" }, // East Wing Room 306
  "5a145d7b86f7744cbb6f4a13": { "rating": "A", "memo": "LEDX / 貴重品 / PC x4 (連結部屋)" }, // East Wing Room 308
  "5a0eec9686f77402ac5c39f2": { "rating": "S", "memo": "貴重品 (金時計・ライオン等) / 探索しやすい" }, // East Wing Room 310 Key
  "5a0eecf686f7740350630097": { "rating": "A", "memo": "LEDX / 武器パーツ / 医療品 (連結部屋)" }, // East Wing Room 313
  "5a0eed4386f77405112912aa": { "rating": "A", "memo": "LEDX / 武器パーツ / 医療品 (連結部屋)" }, // East Wing Room 314
  "5a145ebb86f77458f1796f05": { "rating": "B", "memo": "武器パーツ / 武器箱" }, // East Wing Room 316 Key
  "5a0eee1486f77402aa773226": { "rating": "A", "memo": "テトリス / グラボ / 武器 / PC" }, // East Wing Room 328 Key
  "5a0dc45586f7742f6b0b73e3": { "rating": "B", "memo": "ブルーキーカード湧き / 医療品 / 鎮痛剤" }, // West Wing Room 104 Key
  "5a0dc95c86f77452440fc675": { "rating": "B", "memo": "ブルーキーカード湧き / ビタミン(タスク)" }, // West Wing Room 112 Key
  "5a0ec6d286f7742c0b518fb5": { "rating": "A", "memo": "レッドキーカード湧き / LEDX / 医療品 (203と連結)" }, // West Wing Room 205 Key
  "5a0ee30786f774023b6ee08f": { "rating": "A", "memo": "LEDX / グラボ / 武器箱 / グレネード" }, // West Wing Room 216 Key
  "5a13eebd86f7746fd639aa93": { "rating": "A", "memo": "レッドキーカード湧き / 武器 / 弾薬 (3部屋連結)" }, // West Wing Room 218 Key
  "5a13ef0686f7746e5a411744": { "rating": "C", "memo": "発電機 / 弾薬 / 医療品 / タスク" }, // West Wing Room 219 Key
  "5a0ee34586f774023b6ee092": { "rating": "C", "memo": "武器箱 / 貴重品 / 弾薬" }, // West Wing Room 220 Key
  "5a13ef7e86f7741290491063": { "rating": "SS", "memo": "LEDX / グラボ / 貴重品 / 武器箱 (304と連結)" }, // West Wing Room 301 Key
  "5a13f46386f7741dd7384b04": { "rating": "B", "memo": "デッドスカブ / 医療品 / 武器パーツ" }, // West Wing Room 306 Key
  "5a0f08bc86f77478f33b84c2": { "rating": "SS", "memo": "レッドカード湧き / 金庫 / 貴重品" }, // Health Resort management office safe key
  "5a0f0f5886f7741c4e32a472": { "rating": "A", "memo": "医療品 / 技術アイテム / 隠れ家素材" }, // Health Resort management warehouse safe key
  "5a0eb6ac86f7743124037a28": { "rating": "S", "memo": "コテージ侵入用 / 金庫 / PC / 貴重品" }, // Cottage back door key
  "5a0f068686f7745b0d4ea242": { "rating": "B", "memo": "コテージ内金庫 / お金 / 貴重品" }, // Cottage safe key

  // --- Interchange ---
  "5e42c71586f7747f245e1343": { "rating": "SS", "memo": "LEDX / 除細動器 / 検眼鏡 (要電源)" }, // Ultra medical storage key
  "5ad5d7d286f77450166e0a89": { "rating": "S", "memo": "KIBA店外側の鍵 (要電源)" }, // KIBA Arms outer door key
  "5addaffe86f77470b455f900": { "rating": "S", "memo": "KIBA店内側の鍵 (要電源・アラーム作動)" }, // KIBA Arms inner door key
  "5ad5d64486f774079b080af8": { "rating": "C", "memo": "医療品 / 鎮痛剤 (IDEA側とOLI側の2箇所で使用可)" }, // Pharmacy key
  "5ad5db3786f7743568421cce": { "rating": "B", "memo": "医療品 / LEDX湧き報告あり" }, // Emercom medical unit key
  "5ad5ccd186f774446d5706e9": { "rating": "D", "memo": "PC / ルーズルート" }, // Key to OLI administrator office
  "5ad5cfbd86f7742c825d6104": { "rating": "E", "memo": "タスクアイテム (書類)" }, // Key to OLI logistics department office
  "5e42c81886f7742a01529f57": { "rating": "SS", "memo": "セーフルーム脱出 / 貴重品 / 武器 (要電源)" }, // Object #11SR keycard
  "5e42c83786f7742a021fdf3c": { "rating": "A", "memo": "武器 / 防具 / アタッチメント (コンテナ内)" }, // Object #21WS keycard
  "5ad5d49886f77455f9731921": { "rating": "D", "memo": "武器箱 / 道具箱" }, // Power substation utility cabin key

  // --- Lighthouse ---
  "61a64492ba05ef10d62adcc1": { "rating": "SS", "memo": "超高額貴重品 / 武器 / アーマー (浄水場・北館)" }, // Rogue USEC stash key
  "62a9cb937377a65d7b070cef": { "rating": "A", "memo": "武器 / 弾薬 / 貴重品 (浄水場・北館)" }, // Rogue USEC barrack key
  "62987da96188c076bc0d8c51": { "rating": "B", "memo": "タスク部屋 (隠し部屋)" }, // Operating room key
  "62987e26a77ec735f90a2995": { "rating": "B", "memo": "貴重品 / 武器パーツ (浄水場・第2倉庫)" }, // Water treatment plant storage room key
  "62987cb98081af308d7558c8": { "rating": "A", "memo": "貴重品 / インテリジェンス / ストーリー進行" }, // Conference room key
  "62987c658081af308d7558c6": { "rating": "A", "memo": "インテリジェンス / ストーリー進行" }, // Radar station commandant room key
  "61aa5b518f5e7a39b41416e2": { "rating": "A", "memo": "ビットコイン / 貴重品 (ナーフされたがまだ強い)" }, // Merin car trunk key
  "61a6444b8c141d68246e2d2f": { "rating": "S", "memo": "貴重品 / 武器 / 装備 (丘の上の家)" }, // Hillside house key
  "61aa5b7db225ac1ead7957c1": { "rating": "B", "memo": "金庫 / 貴重品" }, // USEC cottage first safe key
  "61aa5ba8018e9821b7368da9": { "rating": "B", "memo": "金庫 / 貴重品" }, // USEC cottage second safe key
  "61a64428a8c6aa1b795f0ba1": { "rating": "D", "memo": "食料 / 医療品" }, // Convenience store storage room key
  "62987dfc402c7f69bf010923": { "rating": "SS", "memo": "マークドルーム (武器/貴重品)" }, // Shared bedroom marked key

  // --- Streets of Tarkov ---
  "64d4b23dc1b37504b41ac2b6": { "rating": "SS", "memo": "マークドキー確定湧き / タスク部屋" }, // Rusted bloody key
  "6582dbf0b8d7830efc45016f": { "rating": "SS", "memo": "ムーンシャイン / 貴重品 / ビットコイン (非常に美味しい)" }, // Relaxation room key
  "63a3a93f8a56922e82001f5d": { "rating": "SS", "memo": "マークドルーム (SICC/武器/最高級品)" }, // Abandoned factory marked key
  "63a39fc0af870e651d58e6ae": { "rating": "S", "memo": "貴重品 / 死体 / 武器 (非常に美味しい)" }, // Chekannaya 15 apartment key
  "63a397d3af870e651d58e65b": { "rating": "S", "memo": "高額貴重品 / 装備品 (Kaban討伐後推奨)" }, // Car dealership closed section key
  "63a71e922b25f7513905ca20": { "rating": "A", "memo": "貴重品 / 金庫 / タスク部屋" }, // Concordia apartment 64 key
  "63a39c7964283b5e9c56b280": { "rating": "B", "memo": "金庫 / 貴重品 / 監視モニター" }, // Concordia security room key
  "63a39f18c2d53c2c6839c1d3": { "rating": "C", "memo": "タスクアイテム (書類)" }, // Hotel room 206 key (Pinewood)
  "63a71ed21031ac76fe773c7f": { "rating": "C", "memo": "タスクアイテム / 貴重品" }, // Finance institution small office key

  // --- Reserve ---
  "5d80c60f86f77440373c4ece": { "rating": "SS", "memo": "マークドルーム (ドキュメント/武器/貴重品)" }, // RB-BK
  "5d80c6fc86f774403a401e3c": { "rating": "B", "memo": "武器 / 弾薬 / 武器庫" }, // RB-TB
  "5d80c62a86f7744036212b3f": { "rating": "SS", "memo": "マークドルーム (ドキュメント/武器/貴重品)" }, // RB-VO
  "5d80c88d86f77440556dbf07": { "rating": "A", "memo": "インテリジェンス / 軍用物品 / 武器パーツ" }, // RB-AM
  "5d947d3886f774447b415893": { "rating": "B", "memo": "医療品 / 鎮痛剤 / 医療器具 (2階の医療部屋)" }, // RB-SMP
  "5d947d4e86f774447b415895": { "rating": "B", "memo": "医療品 / 鎮痛剤 / 医療器具 (2階の医療部屋)" }, // RB-KSM
  "5d9f1fa686f774726974a992": { "rating": "A", "memo": "戦車バッテリー / OFZ砲弾 / 武器パーツ" }, // RB-ST
  "5d8e3ecc86f774414c78d05e": { "rating": "B", "memo": "武器箱 / ツールセット (STの奥)" }, // RB-GN
  "5d80c8f586f77440373c4ed0": { "rating": "B", "memo": "インテリジェンス / 書類棚" }, // RB-OP
  "5d80cb3886f77440556dbf09": { "rating": "A", "memo": "食料・技術・医療サプライクレート (ケージ鍵)" }, // RB-PSP1
  "5d95d6fa86f77424484aa5e9": { "rating": "A", "memo": "食料・技術・医療サプライクレート (ケージ鍵)" }, // RB-PSP2
  "5d80cb5686f77440545d1286": { "rating": "A", "memo": "食料・技術・医療サプライクレート (ケージ鍵)" }, // RB-PSV1
  "5d95d6be86f77424444eb3a7": { "rating": "A", "memo": "食料・技術・医療サプライクレート (ケージ鍵)" }, // RB-PSV2
  "5ede7b0c6d23e5473e6e8c66": { "rating": "B", "memo": "インテリジェンス / 軍用物品" }, // RB-RLSA
  "5d8e0e0e86f774321140eb56": { "rating": "A", "memo": "金庫x2 / 武器箱 / インテリジェンス" }, // RB-KPRL
  "5da46e3886f774653b7a83fe": { "rating": "B", "memo": "ツールセット / 武器パーツ" }, // RB-RS

  // --- The Lab ---
  "5c1d0f4986f7744bb01837fa": { "rating": "SS", "memo": "LEDX / スティム大量 (回収効率No.1)" }, // Black
  "5c1d0efb86f7744baf2e7b7b": { "rating": "SS", "memo": "最高級貴重品 / 武器 / 弾薬 (Arsenal部屋)" }, // Red
  "5c1e495a86f7743109743dfb": { "rating": "A", "memo": "武器パーツ / 貴重品 / 電子機器" }, // Violet
  "5c1d0dc586f7744baf2e7b79": { "rating": "A", "memo": "LEDX / 医療品 / ブラックカード湧き" }, // Green
  "5c1d0d6d86f7744bb2683e1f": { "rating": "B", "memo": "高額機器 / 武器 / アラーム解除" }, // Yellow
  "5c1d0c5f86f7744bb2683cf0": { "rating": "C", "memo": "医療品 / LEDX (価格の割に中身が渋い)" }, // Blue
  "5c1e2a1e86f77431ea0ea84c": { "rating": "A", "memo": "インテリジェンス / 貴重品 (ハックされやすく危険)" }, // Manager
  "5c1e2d1f86f77431e9280bee": { "rating": "B", "memo": "武器 / 弾薬 / パーツ" }, // Weapon testing

  // --- Others ---
  "658199972dc4e60f6d556a2f": { "rating": "A", "memo": "武器箱 / 弾薬箱 / 貴重品" }, // Underground parking
  "57a349b2245977762b199ec7": { "rating": "D", "memo": "タスクアイテム (ガスアナライザー湧き)" }, // Pumping station
  "5d08d21286f774736e7c94c3": { "rating": "S", "memo": "ボス箱 (レッドカード等の超レア湧き・1回使い切り)" }, // Shturman
  "591afe0186f77431bd616a11": { "rating": "A", "memo": "脱出地点使用 / 60連マガジン" }, // ZB-014
  "591ae8f986f77406f854be45": { "rating": "D", "memo": "トランクの中身 (あまり美味しくない)" }, // Yotota
  "62a09ec84f842e1bd12da3f2": { "memo": "※Collectorで必要な鍵。他に用途無し" }, // Missam
  
  // --- Garbage / Low Value (IDマッチング) ---
  "5a0ee62286f774369454a7ac": { "rating": "E", "memo": "弾薬 / 医療品 / ルーズルート (ハズレ枠)" }, // E209
  "5a0ee72c86f77436955d3435": { "rating": "E", "memo": "弾薬 / 武器パーツ (ハズレ枠)" }, // E213
  "5a0eff2986f7741fd654e684": { "rating": "C", "memo": "金庫 / インテリジェンス (321は常時開放･鍵で開くのは金庫)" }, // W321 Safe
  "5a0ec70e86f7742c0b518fba": { "rating": "E", "memo": "弾薬 / 医療品 (ハズレ枠)" }, // W207
  "5a0eeb1a86f774688b70aa5c": { "rating": "E", "memo": "ルーズルート (常時開放のため鍵不要の場合あり)" }, // W303
  "5a0eeb8e86f77461257ed71a": { "rating": "E", "memo": "ルーズルート / 弾薬 (ハズレ枠)" }, // W309
  "5a13ee1986f774794d4c14cd": { "rating": "E", "memo": "武器湧き / 弾薬 (ベランダから入れるため鍵不要)" }, // W323
  "5a0eebed86f77461230ddb3d": { "rating": "E", "memo": "ルーズルート (ハズレ枠)" }, // W325

  // --- No Use ---
  "5d80ccdd86f77474f7575e02": { "rating": "E", "memo": "※現在は鍵がかかっていないことが多い" } // RB-ORB2
};