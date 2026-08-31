# 本編バトルパスのデータと実装可能性

調査日: 2026-08-31（JST）。対象は Escape from Tarkov 本編の Season 1「KORD BREACH」。Arena の BattlePass、Seasonal Rewards、Personal Modifiers は別制度として扱う。今回は調査・設計案（`non-implementation`）であり、以下は承認済みの実装仕様ではない。アプリ、保存形式、依存、公開設定は変更していない。

文書の図鑑・入手マップ表・報酬カタログは追加できる。個人の要求数を入力する収集計画も、現在のブラウザーだけで動く構成に適合する。一方、公開 API だけでゲーム内の報酬要求・所持数・受取状態を自動同期する経路は確認できなかった。静的な共通データと、利用者が入力する情報を分けるのが現実的である。

公式に確認できる基本仕様は、無料のパスを文書の提出で進め、進捗と報酬解放を PvP Season・PvP Zone・PvE Zone で共有すること。入手経路はレイド、専用タスク、特定の Black Division である。通常の文書出現は個人別で、Black Division のドロップとは扱いが異なる。Seasonal Rewards はレベル・タスク等で取引を解放する別枠なので、文書で進めるパスと混ぜない。[公式 Patch 1.1.0.0（2026-08-03）](https://telegra.ph/Patch-1100-08-03)

公式サイトの本文は調査時に HTTP 403 となったため、公式 Telegram が案内する上記 Telegraph 版を確認した。開発元の告知への入口は [公式 Telegram のパッチ案内](https://t.me/s/escapefromtarkovEN?before=6724)。

開始後の更新も実装に影響する。

| 確認した事実 | データ・画面への反映 |
| --- | --- |
| 8/13 UTC（8/14 JST）の調整後、日次上限は Season 30、PvP 20、PvE 15 | 初期の 25 / 15 / 10 を現行値として固定しない。値に確認日を付ける |
| 同告知では文書数が Factory 10、その他のロケーション 14 に増加 | この数を「地図にある全候補地点数」や「必ず回収できる数」に読み替えない |
| 文書を少なくとも 1 個レイドから持ち出すと上限のカウントが始まる | UTC/JST の午前 0 時リセットを仮定しない |
| 8/24 の告知では Classified documents はキャラクターリセットで消えず、将来のシーズンにも使える | 通常のシーズン文書と同じ失効処理をしない |
| Classified documents は Black Division gear crate の交換には使えない | 万能代替の対象をすべての交換に広げない |

数値・カウント開始条件は [公式の調整告知](https://t.me/escapefromtarkovEN/6773)、Classified の例外は [公式の補足](https://t.me/escapefromtarkovEN/6795)。投稿 HTML の日時も確認した（それぞれ `2026-08-13T18:02:40+00:00`、`2026-08-24T10:01:00+00:00`）。調査時点で確認できた最新の明示値であり、ゲーム内表示との差があれば再確認する。

共有されるのは日次上限の進捗であり、モードごとに独立した 30 + 20 + 15 枚の枠ではない。文書の物理的な所持数は別で、日本語 Wiki は「モードをまたいで文書を合算できない」と説明している。この区別はパス画面の中心に置く。[上限進捗の公式説明](https://telegra.ph/Patch-1100-08-03)、[日本語 Wiki の所持数に関する注意](https://wikiwiki.jp/eft/%E3%83%90%E3%83%88%E3%83%AB%E3%83%91%E3%82%B9%20Kord%20Breach)

文書は通常 8 種と万能代替 1 種。以下の `itemId` と `normalizedName` は、調査日に公開 JSON の `pvp-season/items` で照合した。マップ対応は API が提供した関連ではなく、公開ガイドの対応表を別に照合したもの。括弧内の日本語は説明用で、公式の翻訳名ではない。[tarkov.dev のアイテムデータ](https://json.tarkov.dev/pvp-season/items)、[文書とマップの対応表](https://lootmap.gg/escape-from-tarkov/guides/kord-breach-documents-map-guide/)

| normalizedName（説明） | itemId | 入手マップ／性質 |
| --- | --- | --- |
| `financial-documents`（財務） | `6a31807f17005505b70d5827` | Customs / Streets / Interchange |
| `pmc-personnel-files`（PMC 人事） | `6a317b9692cfdcddcb02a58e` | Reserve / Lighthouse / Icebreaker |
| `project-documentation`（計画） | `6a3181f178450ec91c0ea1aa` | Factory / Reserve / Customs |
| `blueprints-and-technical-documentation`（図面・技術） | `6a31824878450ec91c0ea1ae` | Interchange / Factory / Labyrinth |
| `test-documentation`（試験） | `6a31828557705071410ca00e` | Shoreline / Woods / Icebreaker |
| `user-documentation`（利用者向け） | `6a3182b72fd891345e047eef` | Ground Zero / Streets / Labs |
| `medical-documents`（医療） | `6a3182dc6cd8de21cf0a3a7d` | Labs / Ground Zero / Labyrinth |
| `technical-documentation`（技術） | `6a31830dde69ceafd805afa0` | Shoreline / Woods / Lighthouse |
| `classified-documents`（機密・万能代替） | `6a3183258f113efdb7093622` | Expansion Hub。通常のマップ収集とは分ける |

9 件ともアイコン URL があり、取得時は `https://assets.tarkov.dev/{itemId}-icon.webp` の形だった。`wikiLink` は未設定。実装では URL を推測して組み立てるより、既存の取得済みアイテム情報を解決し、欠落時には文字だけでも使えるようにする。アイテム単位の更新日時は今回一覧として保存していない。後続のデータ投入時には再照合する。[アイテムデータ](https://json.tarkov.dev/pvp-season/items)

報酬は公開ガイドに 12 ページ分の一覧がある。掲載項目を数えると `5 + 5 + 5 + 5 + 5 + 3 + 4 + 5 + 5 + 4 + 4 + 3 = 53` 件になる。以下は共通カタログを作るための候補整理で、コストまで確定したマスターではない。衣服の上下や外見の別バージョンは別項目として数える。[BLAST のページ別一覧とゲーム画面（2026-08-07）](https://blast.tv/gaming/news/escape-from-tarkov-kordbreach-battlepass-explained)

| ページ | 掲載件数 | 内容の例・分類 |
| --- | ---: | --- |
| 1 | 5 | ドッグタグ、通貨、ポスター、装備箱、天井の外観 |
| 2 | 5 | 呼吸用マスクの取引解放、衣服、標的など |
| 3 | 5 | 運搬用フレームの取引解放、内装、マネキンのポーズなど |
| 4 | 5 | ナイフ、ポスター、装備箱など |
| 5 | 5 | プレートキャリアの取引解放、衣服、標的など |
| 6 | 3 | 外見 2 種と Howa Type 20 の取引解放 |
| 7 | 4 | ドッグタグ、通貨、衣服の上下 |
| 8 | 5 | 装備箱、壁の外観、ポーズ 2 種など |
| 9 | 5 | プレートキャリアとバックパックの取引解放、内装など |
| 10 | 4 | ボイス 2 種、通貨、装備箱 |
| 11 | 4 | ドッグタグ、通貨、戦闘後の外見 2 種 |
| 12 | 3 | QBZ-191 の取引解放と衣服の上下 |

「物品の受領」「取引の解放」「外観等の解放」は区別して保存・表示する。同名の装備箱や通貨報酬は複数ページにあるため、アイテム ID だけを報酬 ID にしてはいけない。シーズンと個別の報酬枠を識別できる ID が必要になる。

データをそのまま固定できない箇所も見つかった。

| 論点 | 得られた証拠と扱い |
| --- | --- |
| 個別報酬の必要文書 | [TarkovDocsMap](https://tarkovdocsmap.com/) は個人ごとに要求が異なるとして、ゲーム内の数値を入力させている。種類と枚数のどちらがどこまで変わるかを公式資料では確定できない。全員共通の固定コストにせず、確認した要求を個人データとして持つ |
| 全報酬の総必要数 | [日本語 Wiki](https://wikiwiki.jp/eft/%E3%83%90%E3%83%88%E3%83%AB%E3%83%91%E3%82%B9%20Kord%20Breach) には種別総数もあるが、個別要求の差や更新時点を解決できていない。全ユーザーの完走費用として表示しない |
| 次ページの条件 | [TarkovKit](https://tarkovkit.com/en/seasons/kord-breach) の「原則、前ページから 4 件」という記載は、前述のページ 6 が 3 件という一覧と整合しない。全ページ共通の条件にせず、ページごとのゲーム内条件を確認する |
| 文書交換 | [TarkovKit](https://tarkovkit.com/en/seasons/kord-breach) は通常文書 5 対 1 の交換を説明する。公式の事前告知でも種類間の交換は案内されているが、今回公式に確認できた本文には比率がない。比率を検証してから計算に組み込む |
| リセット時刻 | 公式は持ち出しからのカウント開始を説明するが、厳密な 24 時間境界・表示反映のタイミングまでは確認できない。入力時刻による目安とゲーム内確認を区別し、自動で所持数を消さない |
| 死亡時の扱い | [公式パッチ](https://telegra.ph/Patch-1100-08-03) の死体から取得できないという説明と、[日本語 Wiki](https://wikiwiki.jp/eft/%E3%83%90%E3%83%88%E3%83%AB%E3%83%91%E3%82%B9%20Kord%20Breach) の取得後は拾えるという説明が異なる。レイド結果から所持数を自動増減する根拠に使わない |
| 終了日 | 12/7 と記載するサイトはあるが、[SeasonDex 自身も推定扱い](https://seasondex.com/tarkov)。確定した締切・残日数として実装しない |
| ウィークリー報酬 | [8/14 の公式 Q&A](https://telegra.ph/We-present-the-first-part-of-Nikita-Buyanovs-answers-to-your-questions-collected-for-the-latest-TarkovTV-episode-but-not-include-08-14) では追加の意向。予定と実装済みの保証を区別し、毎週の確定収入として計算しない |

情報源は項目単位で評価する。BLAST の初期日次上限には PvP/PvE の逆転があり、TarkovKit の上限も調整前のままである。同じページの全項目を一律に「確認済み」とは扱わない。Arena の [Fandom「BattlePass」](https://escapefromtarkov.fandom.com/wiki/BattlePass) も本編の報酬マスターには使わない。

公開 API の確認範囲は次のとおり。tarkov.dev はコミュニティのデータ提供元であり、BSG のプレイヤーアカウント API ではない。

| 確認対象 | 2026-08-31 の結果 | 実装で使える範囲 |
| --- | --- | --- |
| [JSON manifest](https://json.tarkov.dev/endpoints) | `regular` / `pve` / `pvp-season` の通常リソースはある。パス専用 endpoint は見つからない | 既存データ取得を再利用 |
| [アイテム一覧](https://json.tarkov.dev/pvp-season/items) | 上記 9 文書の ID・アイコンを確認 | 名称・画像・安定した参照。出現座標や報酬枠の情報ではない |
| [タスク一覧](https://json.tarkov.dev/pvp-season/tasks) | 取得した 491 件に、下記 KORD タスク候補 16 件の名称は一致しなかった | 専用タスクの API 収録を前提にしない。通常の `Documents` 等で代用しない |
| [tarkov-api 公開 schema](https://raw.githubusercontent.com/the-hideout/tarkov-api/main/schema-static.mjs) | 通常タスクの objectives/rewards 等はあるが、専用パスのページ・コスト・個人進捗の定義は見つからない | GraphQL に切り替えても不足を埋められる根拠はない |
| BSG の個人進捗 | パッチにはゲーム内プロフィールへの表示がある。公開・認証不要で読める仕様は確認できない | 当面は手入力。ゲームへのログイン連携や非公開 endpoint を仮定しない |

これは上記の公開リソースを調べた結果であり、「どこにもデータが存在しない」と証明したものではない。今回は全モードの全 API、ゲームクライアント、アカウント情報を調査していない。CORS や新たな取得経路のブラウザー試験も行っていない。

関連タスクの収集先には [日本語 Wiki のシーズン一覧](https://wikiwiki.jp/eft/%E3%82%B7%E3%83%BC%E3%82%BA%E3%83%B3%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)、[Tarkov101](https://www.tarkov101.com/kordbreach)、[分岐を含む日本語の整理](https://game-ojisan.com/reviews/tarkov-s1-questline-guide) がある。API との照合候補は次の 16 件。名称の候補一覧であり、並び順をそのまま前提条件に変換しない。Tarkov101 は検索表示と取得本文の件数が一致しなかったため、単独の完全な正本にはしない。

```text
Uninvited Guests - Part 1
Unanswered Calls
Uninvited Guests - Part 2
Cast the Net
Know Your Enemy
Reverse Gear
Riding the Wave
Key to Understanding
What's in the Bag?
Forbidden Knowledge
Sheep in Wolf's Clothing
Final Stretch
Desperate Assault
Stay Clear of Blast Zone
Break the Chain
Digital Puzzle
```

専用タスクには分岐があり、文書による報酬取得とは別の進捗になる。初版はガイドへのリンクで足りる。タスク進捗まで追加する場合は、ゲームモード、前提条件、排他分岐、報酬を個別に照合する独立した受入条件が必要である。

地図の詳細については [TarkovDocsMap](https://tarkovdocsmap.com/) が文書の地点、画像、鍵の条件、報酬追跡を提供しており、表示上の更新日は 8/24。[TarkovHead の更新案内](https://www.tarkovhead.com/en/news/site-updates-for-patch-1100-updated-quests-and-the-new-icebreaker-map-19) にも文書地点とスクリーンショットの追加がある。初版は外部ガイドへのリンクを提供する。地図、スクリーンショット、全マーカーデータの再配布条件は今回確認できておらず、一括転載や非公開 API の利用を前提にしない。

このリポジトリで実装するなら、次の順が扱いやすい。優先度と実装規模は今回の構成調査からの見積もりであり、工数の保証ではない。

| 優先度 | 機能 | 実装可能性と残る条件 |
| --- | --- | --- |
| 最初 | 文書 9 種の図鑑、8 種の入手マップ表、種別・マップ絞り込み | 高い。静的データと既存アイテム辞書で実装でき、保存形式を変えずに始められる |
| 最初 | パス報酬のページ別カタログ、物品／取引／外観の区分 | 高い。53 件の候補をゲーム内表示と照合し、報酬枠ごとの ID を付ける |
| 次 | 目標報酬の選択、必要文書の手入力、所持数と不足数の表示 | 高い。保存単位とバックアップ方針を決める。未入力は 0 ではなく未確認として扱う |
| 次 | 解放済み報酬のチェック、共有の日次取得数、モード別残り枠 | 可能。物理所持数と日次カウンターを分離する。ゲーム内同期と誤認させない |
| 次 | 不足する文書を集められるマップの提示 | 可能。必要種の重なりから候補を示す。確率や生還率の裏付けがないため「最速ルート」とは呼ばない |
| 条件付き | 5 対 1 交換・Classified の使用計画 | 比率・対象・使用制約の再確認後。余剰文書や万能文書を複数報酬へ二重配分しない |
| 後回し | ページ解放条件を含む最小文書数の最適化、全シーズン完走予測 | 個別要求とページ条件が未確定。初版の正確性を下げるので分ける |
| 後回し | 全地点を内蔵した地図、KORD 専用タスクのフロー | 座標・画像の利用条件、分岐・タスク ID の確認が別途必要 |
| 現時点では採用しない | 自動アカウント同期、ゲーム内受取、購入操作 | 利用可能な公開仕様が未確認。今回のブラウザーだけで動く補助ツールの範囲を超える |

データは「共通カタログ」「個人の要求・進捗」「表示用 API 参照」の 3 層に分ける案が適する。共通カタログにはシーズン ID、報酬枠 ID、ページ、種別、任意の itemId、出典、確認日、確度を持たせる。個人データには報酬ごとの入力済み要求、受取チェック、モード別文書所持数、共有の取得カウンターを持たせる。Classified の持越し情報をシーズンの削除処理に巻き込まない設計も必要になる。

不足数の計算は、初版では「選択した報酬に利用者が入力した必要数 − 選択中モードの所持数」の範囲に限定できる。前ページの未解放条件を含む最短費用とは区別する。所持数の未入力、報酬の未確認、既に受け取った報酬、交換に予約した文書を別状態にし、ゲーム内での支出は確認操作なしに記録しない。

コード側の接続点と保護する境界は次のとおり。ファイル名は既存構成を示すもので、今回は変更していない。

| 既存の接続点 | 再利用と注意点 |
| --- | --- |
| `src/data/seasonModifiers.js` | `kord-breach-2026` というシーズン識別の先例はあるが、Modifier データへパス報酬を混在させない |
| `src/router/index.js`、`src/App.vue` | 専用ルートの `meta.tab` からタブを追加できる。`/season-builds` は既存 Modifier ビルダーのまま保つ |
| `src/composables/useApiData.js`、`src/logic/jsonApiAdapter.js` | 取得済みの itemId と mapId の解決に使う。バトルパスを通常の API bundle に偽装しない |
| `src/components/ItemSearch.vue` | 既存詳細は行の展開式で、itemId 専用ルートはない。報酬から詳細を開くには追加の導線が必要 |
| `src/composables/useShoppingList.js` | タスク・ハイドアウト・鍵の集計に文書の計画をそのまま追加しない。所持数、予約数、FIR、購入提案の意味が異なる |
| `src/composables/useUserProgress.js` | 既存の `eft_{mode}_...` はモード別。全モード共通の受取状態をこの切替処理に入れない |
| `src/composables/useSeasonModifierBuilds.js` | Modifier 専用の保存キーをパス用に流用しない |
| `src/composables/useImportExport.js`、`src/components/SettingsView.vue` | 保存を追加する前に export/import・リセット範囲を決める。既存 schema `3.2.1` に無検証でフィールドを足さない |

静的な資料表示だけなら、新しいデータファイルと Vue 画面・ルートが主な変更になる。進捗保存まで行う場合は専用 composable と計算ロジックを追加する案になるが、保存キーや移行方法は未決定。既存の localStorage／IndexedDB の分離、5 分の API クールダウン、20 時間の自動更新、失敗時の既知の正常データ、限定的な GraphQL fallback は維持する。[既存 API 方針](../decisions/2026-07-22-tarkov-json-api.md)、[Modifier の独立保存方針](../decisions/2026-08-24-season-modifier-builds.md)

実装へ進む前に確認する項目は、53 報酬の現在の表示と区分、ページごとの解放条件、個人要求の変更範囲、交換の比率と例外、保存・バックアップ・リセットの単位である。ゲーム内確認が必要なものはスクリーンショット等を根拠にし、推定値を確定仕様へ昇格させない。図鑑・マップ対応表の表示は、これらすべてが揃う前でも独立して実装できる。

後続実装では `npm run build` に加え、対話・モード切替・レスポンシブ・キーボード操作を `npm run dev` でブラウザー確認する。進捗を追加する場合は共有状態とモード別状態の非干渉、負数や不正入力、所持数・万能文書の二重計上、再読み込み、旧バックアップの読み込みを重点確認する。公開パスへの直接アクセスを変える場合は `npm run preview` でも確認する。リポジトリには `npm test` があるが、lint・format・typecheck・CI 専用コマンドはない。

今回の変更はこの調査資料だけ。ソース変更がないためビルド・テスト・ブラウザー操作は対象外とし、文書の差分と参照を確認する。開始時に存在した未追跡の `.codex-remote-attachments/` は閲覧・変更していない。コミット・公開・デプロイは行っていない。
