# Personal Modifier ビルダー

## 決定

KORD BREACH Season 1のPersonal Modifierを、静的なversioned manifestとして保持し、`/season-builds`でポイント計画・保存・共有できるようにする。

## 理由と範囲

Modifierの完全な公式データAPIは現時点で利用できないため、公式ルールとコミュニティ観測値を確認日付きで収録する。値や効果がゲーム内表示と異なる場合はゲーム内表示を優先する。ポイント計算・相反カテゴリは計画補助であり、ゲーム内効果の完全simulationではない。

保存は既存進捗/APIキャッシュ/import-exportと分離した `eft_season_modifier_builds_v1` のみを使う。既存進捗のマイグレーションは行わない。共有URLはバックエンドを持たず、シーズンIDとModifier IDだけをbase64url化する。

## 更新手順

1. `src/data/seasonModifiers.js` のmanifestを更新する。
2. 公式ルールと観測元を確認し、`verifiedAt`とsourceを更新する。
3. 件数、ポイント符号、ID一意性、share/storageテストを実行する。
4. 公式に確認できない排他条件を、選択不可判定へ追加しない。

## 非目標

- ゲーム内の全Modifier効果の完全再現
- 既存進捗・IndexedDB・インポート形式の変更
- 外部画像や新規依存の追加
