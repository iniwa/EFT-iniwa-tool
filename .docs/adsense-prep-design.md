# AdSense 導入準備 設計仕様書

> 作成日: 2026-04-27
> 当初ブランチ: `test/adsense-prep` (main へマージ済み)
> リリース: v3.1.2

## 背景と目的

将来的に Google AdSense による広告配信を行うにあたり、
**コードと運営体制の両面で「審査通過率を上げる土台」を整える**ことを目的とした作業の記録。

AdSense 審査では下記が落とし穴になりやすい:

1. **プライバシーポリシー / 利用規約 / 運営者情報の不在** — 必須要件
2. **コンテンツが薄い**判定 — ツール中心でテキストが少ないサイトは要注意
3. **ページビュー計測の機会損失** — SPA で URL が変わらないとページ単位の最適化が効かない

このリリースでは上記 3 点に対応するため、**ルーティング基盤の整備と静的ページの拡充** を行った。
広告タグ埋め込み・CMP（Cookie 同意管理）・ads.txt 配置は **次フェーズ**として保留。

---

## スコープ判断

| 完了 | 次フェーズ |
|---|---|
| Vue Router 導入とタブの URL 化 | AdSense タグの埋め込み |
| Privacy / Terms / About ページ追加 | Cookie 同意バナー（CMP）の実装 |
| 使い方ガイド / FAQ ページ追加 | ads.txt の再配置 |
| sitemap.xml の URL 拡充 | 広告枠コンポーネントの実装 |
| 既存コンポーネントを壊さないリファクタ | バックエンド機能・データ構造の変更 |

「広告を出す前にやっておくべき土台」と「広告そのものを出す作業」を明確に分離する方針。
仮に AdSense 申請を見送っても、ここまでの変更は SEO とブラウザバック対応で純粋な改善として残る。

---

## 設計の柱

### 1. 既存コンポーネントを変更しない原則

タブから配信オーバーレイまで全 15 コンポーネントが既に整備されており、
それぞれ `@open-task-details` / `@open-task-from-name` の 2 種類の emit でタスクモーダルを開いている。

**ルーティングを導入する際に、これら子コンポーネントを 1 つも修正しない**ことを設計目標とした。

実現手段: `<router-view v-slot="{ Component }">` でアクティブコンポーネントを取り出し、
親側で **両方の emit リスナーを共通でバインド**する。

```vue
<router-view v-slot="{ Component }">
    <component
        :is="Component"
        @open-task-details="openTaskDetails"
        @open-task-from-name="openTaskFromName"
    />
</router-view>
```

リスナーを定義していないコンポーネントに余分な listener が付いても Vue は黙って無視する（警告も出ない）。
これにより既存の親子契約をそのまま温存できた。

### 2. 「タブ」と「静的ページ」をルーター上で区別

ルートのメタ情報に `tab: true / false` を持たせ、タブナビゲーションは `meta.tab` でフィルタ。

| カテゴリ | meta.tab | ナビゲーション表示 | 例 |
|---|---|---|---|
| 機能タブ | `true` | `<ul.nav-tabs>` 内に出る | `/`, `/result`, `/keys`, … |
| 静的ページ | `false` (省略) | フッターからのみ到達 | `/about`, `/privacy`, `/terms`, `/guide`, `/faq` |

これにより:
- タブ UI は 1 か所のループでレンダリング (`router.options.routes.filter(r => r.meta?.tab)`)
- フラグ依存 (`requiresFlag: 'showStoryTab' | 'overlayEnabled'`) も meta に集約
- 新タブ／新ページの追加は `router/index.js` への一行追記で済む

### 3. 状態の単純化 — `currentTab` の廃止

ルーティング以前は `useAppState.js` に `const currentTab = ref('input')` があり、
タブ切替の Umami 計測もここの `watch(currentTab, ...)` で行っていた。

ルーター導入で **route 自体が真の状態**になったため:

- `currentTab` を完全削除（後方互換シムは作らない）
- Umami の `Tab Switch` 計測は `router.afterEach` 一箇所に移動
- `document.title` 更新もここに集約

> CLAUDE.md の方針に従い、不要な互換ラッパーや `_var` リネーム等は行わない。
> `currentTab` を見ていた箇所は `App.vue` と `useAppState.js` のみで、子は emit ベースだったため
> 削除は安全。

### 4. 静的ページのコンテンツ方針

| ページ | 想定読者 | 主目的 |
|---|---|---|
| `/about` | 初訪・運営者を確かめたい人 | 運営者の素性・データ出典・非公式表明 |
| `/privacy` | 審査担当・神経質なユーザー | localStorage / Umami / 将来の AdSense を予告 |
| `/terms` | 審査担当・コピー警戒のクリエイター | 無償提供と保証否認・禁止事項・準拠法 |
| `/guide` | 初心者ユーザー | 8 ステップの操作手順 + 用語の初出解説 |
| `/faq` | リピーター・トラブル発生時 | 「進捗が消えた」「FIR とは」などの典型 Q&A |

それぞれは `src/components/pages/*.vue` に **scoped style 込みで自己完結**させた。
共通レイアウトは作っていない（5 ページ程度なら抽象化は過剰、ベタ書きで十分）。

### 5. AdSense 審査の隠れリスクへの先回り

- **Privacy ページに「将来 AdSense を導入する可能性がある」と明記**
  → 後出し感を避ける。導入時にポリシー差し替えだけで対応可能。
- **About に「Battlestate Games とは無関係の非公式」を明記**
  → 商標トラブル懸念を低減。
- **FAQ で「データ消失時は復元不可、Export 推奨」を強く案内**
  → 利用者からの「データを返して」問い合わせを未然に防ぐ。
  実は AdSense 文脈ではなく、ユーザーサポート観点での予防策。

---

## 実装の細部

### ルーター履歴モード

`createWebHistory()`（HTML5 History API）を採用。

理由:
- URL がきれい（`/keys` であって `/#/keys` ではない）
- SEO クローラがリンクを認識しやすい
- ブラウザの戻る／進むがネイティブに動作

トレードオフ:
- 配信サーバーで SPA fallback の設定が必要
  → 本プロジェクトは Cloudflare Pages ホストなので `public/_redirects` に
  `/*  /index.html  200` を1行置くだけで対応 (ビルド時に `dist/_redirects` に展開される)
- nginx / Apache / Caddy へ移植する場合は `try_files` 系の rewrite 設定が必要

### Overlay モードとの干渉

`src/main.js` は URL クエリ `?overlay=tasks` を見て `OverlayWindow.vue` を別ルートでマウントする。
ルーター導入後もこの分岐は **App エントリよりも前**で動くため影響なし:

```js
const isOverlay = params.get('overlay') === 'tasks'
if (isOverlay) {
    createApp(OverlayWindow).mount('#app')   // ← router を使わない
} else {
    createApp(App).use(router).mount('#app') // ← router 注入はこちら側のみ
}
```

オーバーレイ表示は単機能で URL ナビゲーションを持たないため、router を介在させる必要がない。

### Umami 計測の移行

旧:
```js
watch(currentTab, (newTab) => {
    window.umami?.track('Tab Switch', { name: newTab })
})
```

新:
```js
router.afterEach((to) => {
    window.umami?.track('Tab Switch', { name: to.name })
})
```

イベント名 `Tab Switch` とプロパティ名 `name` を維持したため、
Umami 上の集計は途切れずに継続できる。

ただし `router.replace` などプログラム遷移でも発火するため集計上は微増する可能性があり、
**過去データとの厳密比較は避けたほうが安全**。

### sitemap.xml の更新

旧版はルート 1 つのみ（`/`）。
ルーター導入で `/result`, `/keys`, `/guide` などが実 URL として独立したため、
12 URL に拡張。タブ系を `priority 0.7-0.9`、ポリシー系を `priority 0.3` で重み付けした。

---

## 次フェーズ（このブランチでは扱わない）

CLAUDE 提案の着手順における **4 / 5** に相当:

4. **広告枠コンポーネントの雛形を作って `min-height` だけ確保**
   - CLS（Cumulative Layout Shift）対策として、広告ロード前にレイアウトを確定させる
   - 配置候補: フッター直上、`ResultList.vue` 末尾

5. **AdSense 申請 → 通過後に CMP 導入 → ads.txt 配置 → 広告タグ埋込**
   - Funding Choices などの Google 認定 CMP を採用予定
   - 同意取得まで広告タグをロードしない実装が必須（GDPR / 改正電通事業法）

これらは AdSense アカウントの取得状況や審査結果に応じて柔軟に進める。
