<script setup>
import { computed, ref } from 'vue'
import { BATTLE_PASS_DOCUMENTS, BATTLE_PASS_META, BATTLE_PASS_REWARD_CATEGORIES, BATTLE_PASS_REWARDS } from '../data/battlePass.js'

const documentSearch = ref('')
const documentMap = ref('')
const rewardSearch = ref('')
const rewardPage = ref('')
const rewardCategory = ref('')

const maps = computed(() => [...new Set(BATTLE_PASS_DOCUMENTS.flatMap((document) => document.maps))].sort())
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase()
const filteredDocuments = computed(() => {
  const query = normalize(documentSearch.value)
  return BATTLE_PASS_DOCUMENTS.filter((document) =>
    (!query || normalize([document.name, document.jaName, document.special].filter(Boolean).join(' ')).includes(query)) &&
    (!documentMap.value || document.maps.includes(documentMap.value)),
  )
})
const filteredRewards = computed(() => {
  const query = normalize(rewardSearch.value)
  return BATTLE_PASS_REWARDS.filter((reward) =>
    (!query || normalize([reward.name, reward.description].filter(Boolean).join(' ')).includes(query)) &&
    (!rewardPage.value || reward.page === Number(rewardPage.value)) &&
    (!rewardCategory.value || reward.category === rewardCategory.value),
  )
})
const resetDocuments = () => { documentSearch.value = ''; documentMap.value = '' }
const resetRewards = () => { rewardSearch.value = ''; rewardPage.value = ''; rewardCategory.value = '' }
const categoryLabel = (value) => BATTLE_PASS_REWARD_CATEGORIES.find((category) => category.value === value)?.label || value
</script>

<template>
  <main class="battle-pass-page container-fluid">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
      <div><h2 class="mb-1">🎟️ バトルパス</h2><p class="text-muted mb-0">本編 {{ BATTLE_PASS_META.name }} / 参考カタログ</p></div>
      <span class="badge text-bg-secondary">{{ BATTLE_PASS_META.note }}</span>
    </div>
    <div class="alert alert-info small" role="note">
      Arenaとは別の本編バトルパスです。BP進捗と日次取得数のカウンターはモード間で共有されますが、上限と文書の物理所持はモード別です。
      現行の目安: Season {{ BATTLE_PASS_META.dailyLimits.season }} / PvP {{ BATTLE_PASS_META.dailyLimits.pvp }} / PvE {{ BATTLE_PASS_META.dailyLimits.pve }} 枚。
      <a :href="BATTLE_PASS_META.officialPatchSource" target="_blank" rel="noreferrer">公式パッチ</a>・<a :href="BATTLE_PASS_META.dailyLimitSource" target="_blank" rel="noreferrer">8/13 UTC公式告知</a>。
      個別必要数・ページ条件・終了日は未確定のため表示していません。
    </div>

    <section class="card mb-4" aria-labelledby="documents-heading">
      <div class="card-header d-flex flex-wrap justify-content-between gap-2 align-items-center"><h3 id="documents-heading" class="h5 mb-0">文書図鑑 <small class="text-muted">{{ filteredDocuments.length }} / {{ BATTLE_PASS_DOCUMENTS.length }}</small></h3><button class="btn btn-sm btn-outline-secondary" type="button" @click="resetDocuments">リセット</button></div>
      <div class="card-body border-bottom"><div class="row g-2"><div class="col-md-7"><label class="form-label small" for="battle-document-search">文書を検索（日本語・英語）</label><input id="battle-document-search" v-model="documentSearch" class="form-control" type="search" placeholder="例: 医療 / medical"></div><div class="col-md-5"><label class="form-label small" for="battle-document-map">入手マップで絞り込み</label><select id="battle-document-map" v-model="documentMap" class="form-select"><option value="">すべてのマップ</option><option v-for="map in maps" :key="map" :value="map">{{ map }}</option></select></div></div></div>
      <p class="small text-muted px-3 mt-2 mb-0">日本語名は説明用の仮訳で、公式翻訳名ではありません。マップ対応は<a :href="BATTLE_PASS_META.documentMapSource" target="_blank" rel="noreferrer">文書マップガイド</a>を参照しています。</p>
      <p class="small text-muted px-3 mt-1 mb-0">入手場所は各カードのWiki・英語マップから確認できます。リンク先で文書名と対象マップを選んでください。掲載地点での出現を保証するものではありません。</p>
      <div v-if="filteredDocuments.length" class="card-body document-grid">
        <article v-for="document in filteredDocuments" :key="document.id" class="document-card">
          <div class="d-flex justify-content-between gap-2">
            <h4 class="h6 mb-1">{{ document.jaName }}</h4>
            <code class="small">{{ document.name }}</code>
          </div>
          <p class="small text-muted mb-2">{{ document.special || '通常文書。レイド・専用タスク等で入手。' }}</p>
          <div v-if="document.maps.length" class="d-flex flex-wrap gap-1">
            <span v-for="map in document.maps" :key="map" class="badge text-bg-dark">{{ map }}</span>
          </div>
          <div class="small text-muted mt-2">ID: {{ document.itemId }}</div>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <a
              :href="BATTLE_PASS_META.documentWikiSource"
              class="btn btn-sm btn-outline-info"
              target="_blank" rel="noopener noreferrer"
              :aria-label="`${document.jaName}を日本語Wikiで確認（新しいタブ）`"
            >Wiki（日本語） ↗</a>
            <a
              v-if="document.maps.length"
              :href="BATTLE_PASS_META.documentLocationMapSource"
              class="btn btn-sm btn-outline-info"
              target="_blank" rel="noopener noreferrer"
              :aria-label="`${document.jaName}の入手場所を英語マップで確認（新しいタブ）`"
            >入手場所マップ（英語） ↗</a>
            <a
              v-else
              :href="BATTLE_PASS_META.classifiedSource"
              class="btn btn-sm btn-outline-info"
              target="_blank" rel="noopener noreferrer"
              :aria-label="`${document.jaName}の公式説明を英語で確認（新しいタブ）`"
            >公式説明（英語） ↗</a>
          </div>
        </article>
      </div>
      <p v-else class="card-body text-muted mb-0" role="status">条件に一致する文書はありません。</p>
    </section>

    <section class="card" aria-labelledby="rewards-heading">
      <div class="card-header d-flex flex-wrap justify-content-between gap-2 align-items-center"><h3 id="rewards-heading" class="h5 mb-0">報酬カタログ <small class="text-muted">{{ filteredRewards.length }} / {{ BATTLE_PASS_REWARDS.length }}（12ページ）</small></h3><button class="btn btn-sm btn-outline-secondary" type="button" @click="resetRewards">リセット</button></div>
      <div class="card-body border-bottom"><div class="row g-2"><div class="col-lg-6"><label class="form-label small" for="battle-reward-search">報酬を検索</label><input id="battle-reward-search" v-model="rewardSearch" class="form-control" type="search" placeholder="名前・説明"></div><div class="col-sm-6 col-lg-3"><label class="form-label small" for="battle-reward-page">ページ</label><select id="battle-reward-page" v-model="rewardPage" class="form-select"><option value="">全ページ</option><option v-for="page in 12" :key="page" :value="page">Page {{ page }}</option></select></div><div class="col-sm-6 col-lg-3"><label class="form-label small" for="battle-reward-category">分類</label><select id="battle-reward-category" v-model="rewardCategory" class="form-select"><option value="">すべて</option><option v-for="category in BATTLE_PASS_REWARD_CATEGORIES" :key="category.value" :value="category.value">{{ category.label }}</option></select></div></div></div>
      <p class="small text-muted px-3 mb-0">報酬名・分類は候補一覧です。必要文書数とページ条件はゲーム内表示を優先してください。分類未確認の枠は断定していません。</p><div v-if="filteredRewards.length" class="card-body reward-grid"><article v-for="item in filteredRewards" :key="item.id" class="reward-card"><div class="d-flex justify-content-between align-items-start gap-2"><span class="badge text-bg-secondary">Page {{ item.page }}</span><span class="badge text-bg-info">{{ categoryLabel(item.category) }}</span></div><h4 class="h6 mt-2 mb-1">{{ item.name }}</h4><p class="small text-muted mb-0">{{ item.description }}</p></article></div><p v-else class="card-body text-muted mb-0" role="status">条件に一致する報酬はありません。</p>
    </section>
    <p class="small text-muted mt-3">報酬出典: <a :href="BATTLE_PASS_META.source" target="_blank" rel="noreferrer">BLASTの一覧</a>（確認日 {{ BATTLE_PASS_META.verifiedAt }}）。Classifiedの持越し・Black Division Gear Crate交換不可は<a :href="BATTLE_PASS_META.classifiedSource" target="_blank" rel="noreferrer">8/24公式告知</a>を参照。</p>
  </main>
</template>

<style scoped>
.battle-pass-page { max-width: 1500px; }
.document-grid, .reward-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: .75rem; }
.document-card, .reward-card { border: 1px solid var(--border-light); border-radius: .4rem; background: var(--bg-card-header); padding: .8rem; min-width: 0; }
.document-card code { color: var(--color-text-secondary); overflow-wrap: anywhere; text-align: right; }
.document-card h4, .reward-card h4 { color: var(--color-text); }
</style>
