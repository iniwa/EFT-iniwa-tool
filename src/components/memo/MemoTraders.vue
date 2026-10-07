<template>
  <section class="p-3 text-light">
    <h3 class="h6 text-info mb-3">トレーダー条件とタスクのロック表示</h3>
    <p>「進捗入力」のトレーダー進捗からLL・評判を記録できます。トレーダー条件の判定を有効にした場合、取得データにあるタスク条件へ反映します。PMCレベルを0にするとPMCレベルによる制限を無視します。</p>
    <p>フローチャートではPMCレベルとトレーダー忠誠レベルの条件ノードを表示しません。タスク詳細の条件表示と、進捗入力での資格判定は継続します。</p>
    <p>旧メモの固定LL2〜LL4表・取引額はモードや現行データとの一致を確認できなかったため掲載を終了しました。トレーダー自身の解放条件・LL昇格条件・取引額はゲーム内画面を確認してください。</p>
    <p>APIに名前のない内部条件変数は未確認のまま表示します。変数IDからBoreas、Icebreakerや特定の物語進行を推測しません。</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink :to="{ name: 'input' }" class="btn btn-sm btn-outline-info">進捗入力を開く</RouterLink>
      <RouterLink :to="{ name: 'flowchart' }" class="btn btn-sm btn-outline-info">フローチャートを開く</RouterLink>
    </div>
  </section>
</template>
