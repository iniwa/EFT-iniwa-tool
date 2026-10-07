<template>
  <section class="p-3 text-light">
    <h3 class="h6 text-info mb-3">必要なアイテム・交換・タスク計画</h3>
    <p>「必要なアイテム」の「全未完了タスク」は未完了タスクのアイテムを集計します。「優先タスク＋必要な前提」は星で選んだ未完了目標と、完了が必須の未完了前提だけをタスク側の集計対象にします。表示モードはタブ移動・再読み込み後も保持されます。</p>
    <p>どちらのモードにも、入力済みのハイドアウトレベルより先の建設材料を含めます。優先タスクが0件でもハイドアウト材料は表示します。ハイドアウトの「最大レベル済みを表示」は進捗入力側の表示フィルターで、必要量を増減しません。</p>
    <p>同じアイテムは各区分内で合計します。タスク・ハイドアウト、FIR・購入可、Collectorは別区分です。行を開くとタスク名や施設レベルごとの必要量を確認できます。収集チェックは区分ごとの行単位で、部分的な所持数量の入力ではありません。</p>
    <p>分岐や前提条件に不明・衝突があるときは警告を表示し、確定した部分の数量だけを集計します。その数量を到達までの確定総数とみなさないでください。</p>
    <p>交換レシピや弾薬の解放タスクは固定表を使わず、「アイテム検索」「弾薬」の取得データで確認してください。進捗・APIデータは選択中のPvE／通常PvP／Seasonal PvPで分かれています。</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink :to="{ name: 'result' }" class="btn btn-sm btn-outline-info">必要なアイテムを開く</RouterLink>
      <RouterLink :to="{ name: 'input' }" class="btn btn-sm btn-outline-info">進捗入力を開く</RouterLink>
      <RouterLink :to="{ name: 'search' }" class="btn btn-sm btn-outline-info">アイテム検索を開く</RouterLink>
    </div>
  </section>
</template>
