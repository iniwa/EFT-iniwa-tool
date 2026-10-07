<template>
  <section class="p-3 text-light">
    <h3 class="h6 text-info mb-3">武器・弾薬の選び方とこのツールでの確認</h3>
    <p>「弾薬」では口径で絞り込み、取得データの貫通力・ダメージなどを比較できます。弾薬を開くと、取得データにあるトレーダー購入・クラフト・解放タスクを確認できます。</p>
    <p>解放タスクを開いた後は、戻る操作で元の弾薬詳細へ戻れます。武器や装備の購入・交換・用途は「アイテム検索」で確認してください。</p>
    <p>旧メモの固定RPM表、「最強」「上位互換」などの評価は現行の装備・改造・モード差を反映できないため掲載を終了しました。武器の射撃モード・連射速度・取り付け可能パーツはゲーム内で確認してください。</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink :to="{ name: 'ammo' }" class="btn btn-sm btn-outline-info">弾薬を開く</RouterLink>
      <RouterLink :to="{ name: 'search' }" class="btn btn-sm btn-outline-info">アイテム検索を開く</RouterLink>
    </div>
  </section>
</template>
