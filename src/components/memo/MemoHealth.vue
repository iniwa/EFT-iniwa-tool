<template>
  <section class="p-3 text-light">
    <h3 class="h6 text-info mb-3">回復・手術キットの確認</h3>
    <p>Salewa、IFAK、AFAK、CMS、Surv12などは「アイテム検索」で名前を検索できます。行を開くと、取得データにある購入・交換・クラフトとタスク用途を確認できます。</p>
    <p>回復量、使用時間、出血治療の消費量、手術後の最大HPは、このメモで固定値として管理していません。ゲーム内説明を確認してください。旧メモのキャンセル時間や手術HP減少率は現行値を確認できなかったため掲載を終了しました。</p>
    <p>入手条件のタスクを開いても、このツールがゲーム内で購入や治療を実行することはありません。進捗は自分で記録します。</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink :to="{ name: 'search' }" class="btn btn-sm btn-outline-info">アイテム検索を開く</RouterLink>
    </div>
  </section>
</template>
