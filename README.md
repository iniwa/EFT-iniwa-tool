# Iniwa's Intel Center (EFT Tool)

Escape from Tarkov 用のブラウザベース進捗管理ツール。
タスク・ハイドアウト・鍵・弾薬・トレーダー納品アイテムなどを一括で管理できます。

🌐 **公開URL**: <https://efttool.iniwach.com/>

> ⚠️ 本ツールは **AI（Gemini / Claude 等）にコードを書かせて作成しています**。
> 著者本人はコードをほぼ読んでおらず、深い知識もありません。
> いかなる問題が起きても**全てにおいて自己責任**でお願いします。

> 🛰 データ取得元として [tarkov.dev](https://tarkov.dev/) の GraphQL API を利用しています。
> tarkov.dev サーバへの負荷を抑えるため、本ツール側で **5 分間隔のクールダウン** を自主的に設けています。
> 更新ボタンの連打はおやめください（API 側で課された制限ではなく、運営者の自主規制です）。

---

## 主な機能

- **タスク管理** — Kappa / Lightkeeper 別の進捗チェック、前提依存の解決
- **ハイドアウト管理** — モジュールごとのレベル進捗
- **必要 FIR (Found In Raid) アイテム集計** — 納品要件を自動算出してショッピングリスト化
- **鍵管理** — マップ別の所持／優先度（SS〜F のレーティング）
- **弾薬チャート** — ペネ値・ダメージで横断比較
- **アイテム検索 / 図鑑** — タスク用途や入手元から逆引き
- **フローチャート / ストーリー** — 主要タスクラインの可視化
- **メモ機能** — 武器・アーマー・グレネード・ヘルス・スティム・トレーダー・アイテムの個人メモ
- **配信オーバーレイ** — `?overlay=tasks` で OBS のブラウザソース向け透過オーバーレイ
- **データ Import / Export** — JSON でバックアップ・復元
- **PvE / PvP 別管理** — モードごとに別セーブ
- **静的ページ** — About / 使い方 / FAQ / プライバシーポリシー / 利用規約

---

## 技術スタック

| 項目 | 技術 |
|---|---|
| フレームワーク | Vue 3.5 (Composition API, `<script setup>` SFC) |
| ルーター | Vue Router 4 (`createWebHistory`) |
| ビルド | Vite 8 |
| UI | Bootstrap 5 + カスタム CSS（ダークテーマ） |
| 図 | Mermaid 11 |
| Markdown | marked + DOMPurify |
| 状態管理 | composable シングルトン (`ref` / `computed`) |
| データソース | [tarkov.dev GraphQL API](https://tarkov.dev/api/) |
| 永続化 | localStorage |
| アクセス解析 | [Umami](https://umami.is/) (self-hosted, Cookie 不使用) |
| ホスティング | [Cloudflare Pages](https://pages.cloudflare.com/) |

データはすべて利用者のブラウザ内 (`localStorage`) に保存されます。サーバ側にユーザーデータは保存しません。

---

## ローカルで動かす

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ にビルド成果物
npm run preview  # ビルド結果のプレビュー
```

`createWebHistory()` を使っているため、本番環境では SPA fallback の設定が必須です。
本リポジトリでは Cloudflare Pages 用に `public/_redirects` を同梱しています
（`/*  /index.html  200`）。

> 旧バージョン (v3.0.0 未満) は CDN 版 Vue を使った静的 HTML / JS でしたが、
> 現在は Vite + SFC 構成のため `index.html` をダブルクリックでは動きません。

---

## サンプルデータ

`example/sample.json` に開発者の進捗状況のスナップショットを置いてあります。
ヘッダの `Import` ボタンから読み込むと、自分でゼロから入力する手間を省けます。

---

## ライセンス

[MIT License](./LICENSE) — フォーク・改変・再配布いずれも自由です。
ただし、フォーク版を運用される場合も tarkov.dev API への過剰なリクエストが
飛ばないよう（クールダウン等の自主規制を）配慮してください。

---

## クレジット / 連絡先

- データ提供: [tarkov.dev](https://tarkov.dev/)
- ゲーム本体・各種商標: [Battlestate Games](https://www.battlestategames.com/) — 本ツールは公式とは無関係の非公式ファンメイドツールです
- 著者: [@iniwach](https://twitter.com/iniwach)
- 不具合・要望: フッターの「📮 意見箱（Google フォーム）」または X (Twitter) DM
