# CLAUDE_ja.md - EFT-iniwa-tool 開発環境（詳細版）

> AI が実際に読む指示書は `CLAUDE.md`（英語・簡潔版）です。このファイルは人間向けの詳細リファレンスです。

---

## プロジェクト概要

**Iniwa's Intel Center** — Escape from Tarkov (EFT/タルコフ) 用のブラウザベース進捗管理ツール。
公開URL: https://efttool.iniwach.com/

### 主な機能

- タスク管理・フィルタリング (Kappa/Lightkeeper対応)
- ハイドアウト進捗管理
- 必要 FIR アイテム (インレイド品) の自動リストアップ
- 鍵管理
- 弾薬チャート (ペネ値・ダメージ)
- アイテム検索
- データのインポート/エクスポート (JSON)
- ストーリー / フローチャート表示
- メモ機能 (武器・アーマー・グレネード・ヘルス・スティム・トレーダー・アイテム)
- 配信オーバーレイモード (`?overlay=tasks`)
- AdSense 審査向けの静的ページ群 (About / Privacy / Terms / Guide / FAQ)

### データソース

- tarkov.dev API (GraphQL) を使用
- API 呼び出しは 5 分間隔のレート制限あり
- ゲームモード: PvE / Regular（PvP）切替
- 言語: 日本語 / 英語切替

---

## コミュニケーション規約

- コードは軽量・効率的なものを基本とする
- 後方互換シム・`_var` リネーム・`// removed` コメント等のハックは作らない

---

## 作業環境の判定

- 作業ディレクトリが `D:/Git/` → **自宅のサブPC**（メイン PC / サブ PC を使用可能）
- 作業ディレクトリが `C:/Git/` → **自宅のメイン PC**（メイン PC / サブ PC を使用可能）
- 作業ディレクトリが `C:/Users/**/Documents/git/` → **リモート PC**
  - リモート PC には必要な環境（例: ollama）がない。コード修正のみに集中すること。

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Vue 3.5 (Composition API, `<script setup>` SFC) |
| ルーター | Vue Router 4 (`createWebHistory`) |
| ビルド | Vite 8 + `@vitejs/plugin-vue` |
| UI | Bootstrap 5.3 + カスタムCSS (ダークテーマ) |
| 図 | Mermaid 11 |
| Markdown | marked 15 + DOMPurify |
| 状態管理 | composables 内 `ref` / `computed` のシングルトン (Vuex/Pinia なし) |
| データソース | tarkov.dev GraphQL API |
| データ永続化 | localStorage |
| アクセス解析 | Umami (self-hosted, Cookie 不使用) |

---

## ビルド・実行

リンター・フォーマッター・テストフレームワークは未導入。

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/ に成果物
npm run preview
```

`createWebHistory()` を採用しているため、本番側で SPA fallback の設定が必須:

- 当サイトのホスト先（Cloudflare Pages）では `public/_redirects` に
  `/*  /index.html  200` を置いて対応 (本リポジトリ済み)
- 他環境への移植時の参考:
  - nginx: `try_files $uri $uri/ /index.html;`
  - Apache: `.htaccess` で RewriteRule
  - Caddy: `try_files {path} /index.html`

未対応のままデプロイすると `/keys` 等の直接アクセスが 404 になり SEO 上致命的。

---

## ホスティング・デプロイ

- 本番サイト (https://efttool.iniwach.com/) は **Cloudflare Pages** でホスト
- ソースは Gitea (`gitea:iniwa/EFT-iniwa-tool`) を GitHub にミラーリングし、
  Cloudflare Pages は GitHub 側を監視
- デプロイ対象ブランチは **`main`**。Cloudflare Pages 側で `npm run build` を実行し、
  `dist/` を公開
- `main` への push（ミラーリング反映後）で自動デプロイされる
- SPA fallback は `public/_redirects` で実現（ファイル削除厳禁）

---

## コードスタイル

### Vue / JavaScript

- ES Modules + `<script setup>` SFC
- ファイル名 PascalCase: `AppHeader.vue`, `KeyManager.vue` 等
- 旧 `Comp*` プレフィックスは廃止
- ロジック層は `src/logic/*Logic.js` (camelCase)、単一の `const ... = { ... }` を `export`
- 状態は composable シングルトン (`useXxx()`) で共有
- 永続化値は `useStorage.js` の `loadLS` / `saveLS` + `watch` で localStorage に同期
- コメントは日本語、書くのは「なぜ」が非自明な箇所のみ

### CSS

- ダークテーマ。`:root` の CSS 変数 (`--color-accent`, `--color-info` 等) を共通参照
- Bootstrap ユーティリティクラスを多用
- コンポーネント固有スタイルは `<style scoped>`

---

## コードベース構成

```
EFT-iniwa-tool/
├── index.html                # Vite エントリ HTML
├── vite.config.js
├── package.json
├── public/                   # ビルド時にそのまま dist/ ルートへコピーされる静的アセット
│   ├── favicon.png
│   ├── ogp_image.png
│   ├── robots.txt
│   └── sitemap.xml           # 12 URL (タブ + 静的ページ) に拡張済み
├── src/
│   ├── main.js               # ?overlay=tasks 判定 → OverlayWindow / App を分岐
│   ├── App.vue               # ヘッダ + タブ + <router-view> + モーダル + フッタ
│   ├── router/
│   │   └── index.js          # ルート定義 + afterEach (title/Umami)
│   ├── components/
│   │   ├── AppHeader.vue / AppFooter.vue / AppNotice.vue
│   │   ├── TaskInput.vue / ResultList.vue / KeyManager.vue
│   │   ├── FlowchartView.vue / StoryView.vue / StoryPlaceholder.vue
│   │   ├── AmmoChart.vue / ItemSearch.vue / MemoView.vue
│   │   ├── OverlaySettings.vue / DebugView.vue / TaskModal.vue
│   │   ├── OverlayWindow.vue (?overlay=tasks 専用ビュー)
│   │   ├── pages/            # AdSense 審査向け静的ページ
│   │   │   ├── AboutPage.vue / PrivacyPage.vue / TermsPage.vue
│   │   │   └── GuidePage.vue / FaqPage.vue
│   │   ├── memo/Memo*.vue    # メモ系サブコンポーネント
│   │   └── ui/{BaseModal,ToastNotify}.vue
│   ├── composables/          # useAppState, useUserProgress, useApiData,
│   │                         #  useImportExport, useOverlay, useShoppingList, useStorage
│   ├── logic/                # taskLogic / itemLogic / hideoutLogic / keyLogic / queries
│   ├── data/                 # constants / caliberData / keyPresets / storyChapters*
│   └── assets/style.css
├── example/sample.json
├── .docs/                    # 設計判断・知見
│   └── adsense-prep-design.md
├── CLAUDE.md / CLAUDE_ja.md / README.md / LICENSE
└── (node_modules, dist, etc.)
```

### 親子コンポーネント契約

子は `@open-task-details` / `@open-task-from-name` を emit してタスクモーダルを開く。
`App.vue` の `<router-view v-slot>` でこの 2 emit を共通バインドしているため、
ルーティング導入時に子コンポーネント側を一切変更していない。

### `?overlay=tasks` モード

`src/main.js` で Router 作成より前に分岐し、`OverlayWindow.vue` を独立マウントする。
ルーター非介在のため通常のタブ UI とは完全に切り離されている。

---

## テスト・動作確認

リンター・フォーマッター・テストフレームワーク未導入。変更後は以下を手動確認:

1. `npm run dev` でブラウザを開いて該当機能をテスト
2. コンソールエラーがないことを確認
3. 隣接タブも触って回帰がないことを確認
4. 必要に応じて Playwright MCP で URL 直叩き・タブ active 状態・タイトル更新を自動検証

---

## ツール活用

- コードの読み取り・編集には **Serena MCP** ツール (`find_symbol`, `replace_symbol_body`, `replace_content` 等)
- Web 上の情報収集には **Tavily MCP** ツール:
  - `tavily_search` — 一般的な Web 検索
  - `tavily_crawl` — 特定サイト巡回
  - `tavily_extract` — URL から構造化抽出
  - `tavily_research` — 詳細リサーチ
- UI 検証には **Playwright MCP** で dev サーバを駆動

---

## 知見の永続化

- 設計判断・アーキテクチャの選定理由など、流用できる情報は `.docs/*.md` に積極的に残す
- 作業開始時には `.docs/` に既存の文脈がないか確認する
- `/clear` で会話をリセットしても、`CLAUDE.md` と `.docs/` に残した情報が次の会話で引き継がれる
