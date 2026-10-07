<template>
  <section class="p-3 text-light">
    <h3 class="h6 text-info mb-3">グレネードの確認</h3>
    <p>VOG-25、VOG-17、RGD-5、F-1、M67などは「アイテム検索」で取得データにある入手経路・用途を確認できます。</p>
    <p>旧メモの起爆秒数や爆発範囲の大小は現行値を確認できなかったため掲載を終了しました。起爆方式、起爆時間、破片・爆発の挙動はゲーム内説明を確認してください。このアプリでは投擲や爆発の計算を行いません。</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink :to="{ name: 'search' }" class="btn btn-sm btn-outline-info">アイテム検索を開く</RouterLink>
    </div>
  </section>
</template>
