# CLAUDE_ja.md - EFT-iniwa-tool 開発環境（詳細版）

> AI が実際に読む指示書は `CLAUDE.md`（英語・簡潔版）です。このファイルは人間向けの詳細リファレンスです。

---

## プロジェクト概要

**Iniwa's Intel Center** — Escape from Tarkov (EFT/タルコフ) 用のブラウザベース進捗管理ツール。
公開URL: https://efttool.iniwach.com/

### 主な機能

- タスク管理・フィルタリング (Kappa/Lightkeeper対応)
- ハイドアウト進捗管理
- 必要FIRアイテム(インレイド品)の自動リストアップ
- 鍵管理
- 弾薬チャート (ペネ値・ダメージ)
- アイテム検索
- データのインポート/エクスポート (JSON)
- ストーリー/フローチャート表示
- メモ機能 (武器・アーマー・グレネード・ヘルス・スティム・トレーダー・アイテム)

### データソース

- tarkov.dev API (GraphQL) を使用
- API呼び出しは5分間隔の制限あり
- ゲームモード: PvE / Regular 切替可能
- 言語: 日本語 / 英語 切替可能

---

## コミュニケーション規約

- コードは軽量・効率的なものを基本とする

---

## 作業環境の判定

- 作業ディレクトリが `D:/Git/` → **自宅のサブPC**（メイン PC / サブ PC を使用可能）
- 作業ディレクトリが `C:/Git/` → **自宅のメインPC**（メイン PC / サブ PC を使用可能）
- 作業ディレクトリが `C:/Users/**/Documents/git/` → **リモート PC**
  - リモート PC には必要な環境（例: ollama）がない。コード修正のみに集中すること。
- ラズパイには `ssh iniwapi` で接続できるため、ラズパイからコードやログを読み取っても良い

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Vue.js 3 (CDN版、Composition API) |
| UI | Bootstrap 5 + カスタムCSS (ダークテーマ) |
| データソース | tarkov.dev GraphQL API |
| チャート | Mermaid.js (フローチャート) |
| Markdown | marked.js |
| ビルドツール | **なし** (静的HTML/JS/CSS) |
| 状態管理 | setup()内のref/computed (Vuex/Piniaなし) |
| データ永続化 | localStorage |
| アクセス解析 | Umami (self-hosted) |

---

## ビルドシステムについて

- npm, webpack, vite 等のビルドツールは**使用していない**
- 全てのJSファイルを `index.html` の `<script>` タグで直接読み込み
- `index.html` をブラウザで直接開いても動作する
- ローカルサーバーで確認する場合: `npx serve .` または `python -m http.server 8000`

---

## コードスタイル

### JavaScript

- ES6+ 構文 (const/let, arrow functions, template literals, destructuring)
- Vue 3 Composition API (setup関数) 使用
- コンポーネントはオブジェクトリテラル形式 (`const CompXxx = { ... }`)
- テンプレートは template リテラル文字列
- ロジックは別ファイルに分離 (TaskLogic, ItemLogic, HideoutLogic)
- キャメルケース (変数・関数)
- コメントは日本語

### 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase + `Comp` プレフィックス | `CompHeader`, `CompInput` |
| ロジックモジュール | snake_case + `logic_` プレフィックス | `logic_tasks.js` |
| 変数・関数 | camelCase | `fetchData`, `playerLevel` |

### CSS

- ダークテーマ基調 (#121212 背景、白文字)
- Bootstrap 5 ユーティリティクラス多用
- カスタムスタイルは `style.css` に集約

---

## コードベース構成

```
EFT-iniwa-tool/
├── index.html              # エントリーポイント (Vue appマウント)
├── style.css               # グローバルCSS (ダークテーマ)
├── data.js                 # TARKOV_DATA 定数 (ハイドアウトのローカルデータ)
├── js/
│   ├── app.js              # Vue アプリ本体 (setup関数、状態管理)
│   ├── queries.js          # GraphQL クエリ生成
│   ├── logic_tasks.js      # タスク関連ロジック
│   ├── logic_items.js      # アイテム関連ロジック
│   ├── logic_hideout.js    # ハイドアウト関連ロジック
│   ├── logic_keys.js       # 鍵関連ロジック
│   ├── key_presets.js      # 鍵プリセットデータ
│   ├── story_data.js       # ストーリーデータ
│   └── components/
│       ├── Comp*.js        # 15個のVueコンポーネント
│       └── memo/
│           └── CompMemo*.js # メモ系サブコンポーネント
├── example/
│   └── sample.json         # サンプルデータ
└── (静的ファイル: favicon, ogp_image, sitemap, robots.txt 等)
```

### アーキテクチャ

- SPA (Single Page Application) — タブ切替で画面遷移（ルーティングなし）
- 状態管理は `app.js` の `setup()` 内で `ref` / `computed` を使用
- コンポーネントはグローバル登録
- データ永続化は localStorage

---

## テスト・動作確認

リンター・フォーマッター・テストフレームワークは導入されていない。
変更後は以下を手動確認すること:

1. ブラウザで `index.html` を開いて該当機能をテスト
2. コンソールエラーがないことを確認
3. 変更が他のタブ/機能に影響していないことを確認

---

## ツール活用

- コードの読み取り・編集には **Serena MCP** ツールを積極的に使う（シンボル検索・概要取得・置換・挿入など）
- Web 上の情報収集には **Tavily MCP** ツールを使う:
  - `tavily_search` — ドキュメント、エラーメッセージ、ライブラリの使い方などの一般的な Web 検索
  - `tavily_crawl` — 特定の Web サイトを巡回して詳細な情報を取得
  - `tavily_extract` — URL から構造化されたコンテンツを抽出
  - `tavily_research` — トピックについての詳細なリサーチ（複雑・多面的な調査に使用）

---

## 知見の永続化

- 設計判断・アーキテクチャの選定理由・利用フレームワークの知見など、流用できる情報は `docs/*.md` に積極的に残す
- 作業開始時には `docs/` に既存の文脈がないか確認する
- `/clear` で会話をリセットしても、`CLAUDE.md` と `docs/` に残した情報が次の会話で引き継がれる
