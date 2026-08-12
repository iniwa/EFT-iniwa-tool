# プログラム改善チェックリスト

コードベースを調査して洗い出した改善候補の一覧。

**運用方法**: 着手する項目を選び、`AGENTS.md` の実行方針に従って現在の
Codex タスク内で実装・検証する。要件と検証条件が確定した複数ステップの変更は、
必要に応じて native Codex subagent に委譲する。`docs/handoffs/` は中断・別セッション・
運用上の承認境界など、再開状態を永続化する必要がある場合だけ使用する。
実装完了した項目は「完了アーカイブ」へ移動する。

- 機能追加・未検証項目はこのファイルの対象外（`docs/issues.md` 等で管理）。
- 優先度: **高** = 稼働中の安定性に直結 / **中** = 保守性・性能 / **低** = 任意。

---

## 1. データ取得・API 層

- [ ] **【中】tarkov.dev への fetch にタイムアウト（AbortController）を追加する**
  - 現状: `src/composables/useApiData.js:328` / `:395` / `:446` の 3 箇所の `fetch` が
    タイムアウトなし。API 応答がハングすると `isLoading` / `itemDbLoading` が
    立ちっぱなしになり、UI 上は更新ボタンが無期限に無効化される。
  - 対応案: 3 箇所に共通の `fetchWithTimeout` ヘルパー（AbortController + 30 秒程度）を
    導入し、タイムアウト時は既存の catch 経路でエラー表示する。挙動追加のみで
    成功パスは不変。
  - 制約: 5 分クールダウン（`RATE_LIMIT_MS`）と IndexedDB キャッシュの形は変えない。

- [ ] **【低】composables 内の `alert()` をトースト通知等の非ブロッキング UI に置き換える**
  - 現状: データ層の composable に `alert()` が 8 箇所
    （`useApiData.js:308,419,422,481` / `useImportExport.js:135,138,144` /
    `useUserProgress.js:270`）。UI 通知がデータ層に埋め込まれており、
    ブラウザをブロックする。`src/components/ui/ToastNotify.vue` は既存。
  - 対応案: composable はエラー/結果を ref か戻り値で返し、表示は呼び出し側
    コンポーネントで行う。必要なら composable 単位の独立して検証可能な変更へ分割する。
  - 制約: リロード前の確認（`useUserProgress.js:270` はリロードを伴う）など
    既存のユーザーフローは変えない。

## 2. 死にコード・整理

- [ ] **【低】StoryPlaceholder.vue（死にコード）を削除する**
  - 現状: `src/components/StoryPlaceholder.vue`（9 行）は src 内から参照 0 件
    （router / 他コンポーネントいずれからも import されない）。
  - 対応案: ファイル削除し、`CLAUDE.md` / `CLAUDE_ja.md` の構成リストから除去する。
  - 制約: なし（挙動不変の削除）。

- [x] **【低】package.json の version をアプリバージョンと同期する**
  - 対応: `package.json`、`package-lock.json` のルート版、表示用の
    `APP_VERSION`（`src/data/constants.js`）を同期（現在は v3.2.0）。
  - 運用: 今後もリリース時に3か所を同じバージョンへ更新する。

- [ ] **【低】本番でも出力される `console.log` を整理する**
  - 現状: `src/composables/useApiData.js:384,389,502,512` などデバッグ用の
    `console.log` が本番ビルドにも残る（vite.config.js に drop 設定なし）。
  - 対応案: 不要なものは削除。デバッグに有用なものだけ残すか `import.meta.env.DEV`
    ガードを付ける。挙動不変の機械的変更。
  - 制約: `console.warn` / `console.error`（エラー経路のログ）は残す。

---

## 完了アーカイブ

- [x] **【中】マップ判定ロジックの重複を解消し taskLogic に一本化する**
  - 2026-08-12: `useApiData.js` の縮小コピーを削除し、`taskLogic.getTaskMaps` を
    `mapLabel` / `derivedMaps` とグループ表示の共通実装として使用。
  - Icebreaker、Ground Zero Tutorial、The Lab (Dark)、Terminal も同じ判定表へ追加し、
    既存キャッシュのフィールド名は維持。
