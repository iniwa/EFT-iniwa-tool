<template>
  <section class="p-3 text-light">
    <h3 class="h6 text-info mb-3">注射器・Personal Modifierの確認</h3>
    <p>M.U.L.E.、SJ6、Obdolbos 2、Propitalなどの入手経路・交換材料・クラフトは「アイテム検索」で取得データを確認してください。</p>
    <p>効果量、効果時間、副作用、併用時の結果は現行のゲーム内説明を確認してください。旧メモの「副作用ほぼ無し」や固定効果表は現行仕様を確認できなかったため掲載を終了しました。</p>
    <p>Personal Modifierは注射器と別の計画機能です。Modifierタブで選択・ポイント収支・プリセット・共有を管理します。Underdogは取得済みの場合にNegative Modifierとして＋4を選択できます。実際の取得条件・実績への適用は未確認です。</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink :to="{ name: 'search' }" class="btn btn-sm btn-outline-info">アイテム検索を開く</RouterLink>
      <RouterLink :to="{ name: 'season-builds' }" class="btn btn-sm btn-outline-info">Modifierを開く</RouterLink>
    </div>
  </section>
</template>
