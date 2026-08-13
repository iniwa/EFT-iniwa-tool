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

- [x] **【低】StoryPlaceholder.vue（死にコード）を削除する**
  - 2026-08-13: リポジトリ全体の参照を確認した上で、未使用の
    `src/components/StoryPlaceholder.vue` を削除。

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

- [x] **【中】tarkov.dev への fetch にタイムアウト（AbortController）を追加する**
  - 2026-08-13: JSON API と GraphQL フォールバックの fetch に共通タイムアウトを適用し、タイムアウト時は既存のエラー経路で案内を表示。5 分クールダウンと IndexedDB キャッシュの形は維持。

- [x] **【中】マップ判定ロジックの重複を解消し taskLogic に一本化する**
  - 2026-08-12: `useApiData.js` の縮小コピーを削除し、`taskLogic.getTaskMaps` を
    `mapLabel` / `derivedMaps` とグループ表示の共通実装として使用。
  - Icebreaker、Ground Zero Tutorial、The Lab (Dark)、Terminal も同じ判定表へ追加し、
    既存キャッシュのフィールド名は維持。
