# ストーリータブ設計仕様書

> 作成日: 2026-04-08

## 概要

Fandom Wikiデータをベースに、全9チャプターのストーリー進捗管理UIを構築する。
現在の `StoryPlaceholder.vue` を `StoryView.vue` に置き換える。

## ユーザー要件

1. 全チャプター表示（ロック中は解放条件を表示、ステップは非表示）
2. Falling Skies → The Ticket のクロスチャプター分岐参照
3. 各チャプターをPhase/セクションで分割表示
4. Optionalステップは折りたたみで隠す（展開で表示）
5. JP/EN切り替え対応（apiLang連動）
6. 各チャプターにWiki URL表示（英語Wikiのみ）

---

## ファイル構成

| ファイル | 操作 | 説明 |
|---|---|---|
| `src/data/storyData.js` | 新規 | 全チャプターデータ（JP/EN対応） |
| `src/components/StoryView.vue` | 新規 | ストーリータブ本体コンポーネント |
| `src/composables/useStoryProgress.js` | 新規 | 進捗管理（localStorage永続化） |
| `src/App.vue` | 修正 | StoryPlaceholder → StoryView に差し替え |
| `src/composables/useImportExport.js` | 修正 | storyProgress のexport/import追加 |
| `src/composables/useUserProgress.js` | 修正 | resetUserData に story 対応追加 |

---

## データ構造

### チャプター定義 (`storyData.js`)

```js
export const STORY_CHAPTERS = [
  {
    id: 'tour',                    // 一意なID
    title: 'Tour',                 // 表示名（言語によらず固定）
    wikiUrl: 'https://...',        // Fandom Wiki URL
    category: 'main',             // 'main' | 'side'
    description: {
      ja: '...',
      en: '...'
    },
    unlock: null,                  // 解放条件（後述）
    phases: [ ... ]                // セクション配列（後述）
  },
  // ...
];
```

### 解放条件 (`unlock`)

```js
// 最初から解放
unlock: null

// 特定チャプター完了で解放
unlock: {
  type: 'chapter',
  chapterId: 'falling_skies',
  text: { ja: 'Falling Skiesを完了する', en: 'Complete Falling Skies' }
}

// 自由テキスト（発見トリガー等）
unlock: {
  type: 'discover',
  text: {
    ja: 'Customs/Woods/Reserve/LighthouseでBEAR部隊の痕跡を発見',
    en: 'Discover traces of the BEAR special squad on Customs/Woods/Reserve/Lighthouse'
  }
}
```

チャプター完了の解放条件は `useStoryProgress` で自動判定。
`discover` タイプはユーザーの自己申告（チェックボックス等）で解除。

### フェーズ定義 (`phases`)

```js
{
  id: 'tour_p1',
  title: { ja: 'Ground Zero脱出', en: 'Escape Ground Zero' },
  showIf: null,                    // 条件付き表示（後述）
  steps: [
    {
      id: 't_gz_esc',
      type: 'check',              // 'check' | 'choice' | 'note' | 'wait'
      text: { ja: '...', en: '...' }
    },
    // ...
  ],
  optionalSteps: [                 // 折りたたみ表示
    {
      id: 't_collect_250k',
      type: 'check',
      text: { ja: '...', en: '...' }
    }
  ]
}
```

### ステップタイプ

| type | 説明 | UI |
|---|---|---|
| `check` | チェックボックス | ☐/☑ |
| `choice` | 選択肢（ラジオボタン） | ○ options |
| `note` | 情報テキスト（操作不要） | ℹ テキスト表示 |
| `wait` | 待機ステップ | ⏳ テキスト + チェック |

### 選択肢ステップ (`choice`)

```js
{
  id: 'fs_choice',
  type: 'choice',
  text: { ja: 'Armored Caseの処遇を選択', en: 'Decide what to do with the Armored Case' },
  options: [
    { value: 'keep', label: { ja: '自分の手元に残す', en: 'Keep the armored case' } },
    { value: 'give', label: { ja: 'Praporに渡す', en: 'Hand over to Prapor' } },
    { value: 'pretend', label: { ja: '見つけなかったフリをしてPraporに渡す', en: 'Pretend you didn\'t find it, hand over to Prapor' } }
  ]
}
```

### 条件付きフェーズ表示 (`showIf`)

```js
// フェーズレベルで条件分岐（ステップレベルのshowIfは使わない）
{
  id: 'tt_p2_prapor',
  title: { ja: 'Praporルート', en: 'Prapor Route' },
  showIf: {
    ref: 'falling_skies.fs_choice',   // chapterId.stepId（ドット記法）
    value: ['give', 'pretend']         // 配列=いずれかに一致でtrue
  },
  steps: [ ... ]
}
```

クロスチャプター参照にも対応（`falling_skies.fs_choice` のように別チャプターのstepを参照）。

---

## Composable設計 (`useStoryProgress.js`)

```js
// シングルトン: 全コンポーネントで共有
const storyProgress = ref(loadLS('eft_story_progress', {}));

// データ形式: { [chapterId]: { [stepId]: value } }
// check → true/false
// choice → 選択値の文字列 ('keep', 'give', etc.)
// wait → true/false（ユーザーが完了をマーク）
```

### 主要メソッド

```js
// ステップ値の取得
function getStepValue(chapterId, stepId) {
  return storyProgress.value[chapterId]?.[stepId] ?? null;
}

// ステップ値の更新
function updateStep(chapterId, stepId, value) {
  if (!storyProgress.value[chapterId]) {
    storyProgress.value[chapterId] = {};
  }
  storyProgress.value[chapterId][stepId] = value;
}

// クロスチャプター参照の解決
function resolveRef(refStr) {
  const [chapterId, stepId] = refStr.split('.');
  return storyProgress.value[chapterId]?.[stepId] ?? null;
}

// showIf条件の評価
function evaluateShowIf(condition) {
  if (!condition) return true;
  const val = resolveRef(condition.ref);
  if (Array.isArray(condition.value)) return condition.value.includes(val);
  return val === condition.value;
}

// チャプター解放判定
function isChapterUnlocked(chapter) {
  if (!chapter.unlock) return true;
  if (chapter.unlock.type === 'chapter') {
    return isChapterCompleted(chapter.unlock.chapterId);
  }
  // discoverタイプ: ユーザーが手動で解放マーク
  return storyProgress.value._unlocked?.[chapter.id] ?? false;
}

// チャプター完了判定
function isChapterCompleted(chapterId) {
  const chapter = STORY_CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) return false;
  const progress = storyProgress.value[chapterId] || {};
  // 全フェーズの全必須ステップが完了しているか
  return chapter.phases
    .filter(p => evaluateShowIf(p.showIf))
    .every(phase => phase.steps.every(step => {
      if (step.type === 'note') return true;
      return !!progress[step.id];
    }));
}
```

---

## コンポーネント設計 (`StoryView.vue`)

### レイアウト

```
┌──────────────────────────────────────────────────────┐
│ 📖 ストーリータスク / Story Chapters                  │
├────────────┬─────────────────────────────────────────┤
│ 左パネル   │ 右パネル                                │
│ (col-md-3) │ (col-md-9)                              │
│            │                                         │
│ ─ Main ─   │ [チャプタータイトル]          [🌐 Wiki] │
│ ✅ Tour    │                                         │
│ ▶ Falling  │ [Description]                           │
│ 🔒 Ticket  │                                         │
│            │ ── Phase 1: xxx ──                      │
│ ─ Side ─   │ ☐ Step 1                               │
│ ○ Batya   │ ☐ Step 2                               │
│ ○ Unheard │ ▼ Optional (2件)                        │
│ ○ Blue..  │                                         │
│ ○ They..  │ ── Phase 2: xxx ──                      │
│ ○ Accid.. │ ☐ Step 3                               │
│ 🔒 Laby.. │ ...                                     │
└────────────┴─────────────────────────────────────────┘
```

### 状態アイコン

| アイコン | 状態 |
|---|---|
| 🔒 | 未解放（解放条件テキストのみ表示） |
| ○ | 解放済み・未着手 |
| ▶ | 進行中（1つ以上のステップ完了） |
| ✅ | 全必須ステップ完了 |

### 右パネル表示パターン

**ロック中 (🔒)**:
```
The Ticket
🔒 このチャプターはロックされています
解放条件: Falling Skiesを完了する
```

**通常表示**:
```
Falling Skies                              [🌐 Wiki]
墜落した謎の飛行機と、それに関わる陰謀を追うチャプター。

── Phase 1: 墜落機の発見 ──
☐ Woodsで墜落した飛行機を発見する
☐ PraporのLoyalty Level 2に到達する

── Phase 2: トレーダー聞き込み ──
☐ トレーダーたちに墜落機について尋ねる
  ▼ Optional (1件)        ← クリックで展開
  ┌─────────────────────────────────────────┐
  │ ☐ Therapistに$2,000を渡してSUVの情報を得る │
  └─────────────────────────────────────────┘
```

**The Ticket（クロスチャプター参照あり）**:
```
The Ticket                                 [🌐 Wiki]
ℹ Falling Skiesでの選択: Praporにケースを渡した → Praporルート

── Phase 1: 調査開始 ──
☐ Intelligence Center Level 1を設置する
☐ Mr. Kermanと話す

── Phase 2: Praporルート ──        ← showIfで自動表示
☐ Lighthouseのキャンプを捜索する
...
```

### 折りたたみ実装

CompKeysの既存パターンを踏襲:

```js
// リアクティブ状態
const collapsedOptionals = reactive({});

// トグル
function toggleOptional(phaseId) {
  collapsedOptionals[phaseId] = !collapsedOptionals[phaseId];
}
```

```html
<!-- トグルヘッダー -->
<div @click="toggleOptional(phase.id)" style="cursor: pointer;">
  <span>{{ collapsedOptionals[phase.id] ? '▼' : '▲' }}</span>
  Optional ({{ phase.optionalSteps.length }}件)
</div>

<!-- 折りたたみコンテンツ -->
<div v-show="!collapsedOptionals[phase.id]">
  <!-- optional steps -->
</div>
```

デフォルトは**折りたたみ状態**（`collapsedOptionals[phaseId]` 初期値なし → falsy → `v-show="!falsy"` = 表示）。

→ 修正: デフォルトを折りたたみにするには初期値を `true` にするか、ロジックを反転させる。

```js
// デフォルト折りたたみ: expandedOptionals (展開されたもののみtrue)
const expandedOptionals = reactive({});
// v-show="expandedOptionals[phase.id]"
```

### 言語切り替え

```js
import { useAppState } from '../composables/useAppState.js';

const { apiLang } = useAppState();

// テキスト取得ヘルパー
const t = (textObj) => {
  if (!textObj) return '';
  if (typeof textObj === 'string') return textObj;
  return textObj[apiLang.value] ?? textObj.en ?? '';
};
```

テンプレート内で `{{ t(step.text) }}` のように使用。

---

## The Ticket 分岐設計（詳細）

最も複雑なチャプター。フェーズレベルの `showIf` で制御。

```
Phase 1: 共通開始 (showIf: null)
  │
Phase 2a: Praporルート
  showIf: { ref: 'falling_skies.fs_choice', value: ['give', 'pretend'] }
  │
Phase 2b: Mechanicルート
  showIf: { ref: 'falling_skies.fs_choice', value: 'keep' }
  │
Phase 3: Terminal入口 (showIf: null) — 共通
  │
Phase 4: Kermanの選択 (showIf: null) — choice step
  │
Phase 5a: Savior/Debtorルート（証拠収集）
  showIf: { ref: 'the_ticket.tt_kerman_offer', value: 'accept' }
  │  └─ 証拠収集同意/拒否の分岐は内部のchoice stepで
  │
Phase 5b: Fallenルート（Praporタスク）
  showIf: { ref: 'the_ticket.tt_kerman_offer', value: 'refuse' }
  │
Phase 6: Terminal脱出 (showIf: null) — 全ルート共通
```

### Falling Skies未選択時の表示

The Ticket を開いたとき、Falling Skiesの選択がまだない場合:
→ Phase 2a/2b は両方非表示。Phase 1 のみ表示。
→ 右パネル上部にインフォメッション: 「Falling Skiesでの選択後にルートが表示されます」

---

## 既存ファイルへの修正

### `src/App.vue`

```diff
- import StoryPlaceholder from './components/StoryPlaceholder.vue'
+ import StoryView from './components/StoryView.vue'

  <div v-if="currentTab === 'story'">
-     <StoryPlaceholder />
+     <StoryView />
  </div>
```

### `src/composables/useImportExport.js`

```diff
+ import { useStoryProgress } from './useStoryProgress.js';

  export function useImportExport() {
+   const { storyProgress } = useStoryProgress();

    function exportData() {
      const data = {
        // ... existing fields
+       storyProgress: storyProgress.value,
      };
    }

    function importData(file) {
      // ... existing logic
+     if (parsed.storyProgress) storyProgress.value = parsed.storyProgress;
    }
  }
```

### `src/composables/useUserProgress.js`

`resetUserData` 内:

```diff
+ if (targets.story) {
+   // useStoryProgressからインポートして直接リセット
+   // ※循環依存回避のため、caller側でリセット関数を呼ぶ
+ }
```

→ 循環依存を避けるため、`useStoryProgress` に `resetProgress()` メソッドを追加し、
  `DebugView` 等のリセットUIから直接呼び出すパターンが望ましい。

---

## 検証方法

1. `npx vite dev` でローカルサーバー起動
2. ストーリータブを開き、全9チャプターが左パネルに表示されることを確認
3. JP/EN切り替えでテキストが切り替わることを確認
4. チェックボックス操作 → ページリロード後も保持されることを確認
5. Falling Skiesで選択 → The Ticketに正しいルートが表示されることを確認
6. Optional折りたたみの開閉動作を確認
7. 🔒チャプターの解放条件表示を確認
8. Wikiリンクが正しいURLで開くことを確認
9. エクスポート → インポートでstoryProgressが保持されることを確認
