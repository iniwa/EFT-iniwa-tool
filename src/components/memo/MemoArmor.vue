<template>
  <section class="p-3 text-light">
    <h3 class="h6 text-info mb-3">アーマー・プレートの確認</h3>
    <p>「アイテム検索」でアーマー、ヘルメット、プレートを検索し、取得データにある入手経路と用途を確認できます。装備の対応プレート、部位、現在の耐久値などはゲーム内説明と照合してください。</p>
    <p>旧メモの素材ごとの優劣表や「最強素材」という評価は、現行の修理・耐久・被弾条件を確認できなかったため掲載を終了しました。このアプリには装甲の被弾シミュレーターはありません。</p>
    <p>弾薬の貫通力・ダメージは弾薬タブの取得値を参照できますが、それだけで実際の防御結果を保証するものではありません。</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink :to="{ name: 'search' }" class="btn btn-sm btn-outline-info">アイテム検索を開く</RouterLink>
      <RouterLink :to="{ name: 'ammo' }" class="btn btn-sm btn-outline-info">弾薬を開く</RouterLink>
    </div>
  </section>
</template>
