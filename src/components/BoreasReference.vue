<script setup>
import { computed } from 'vue'
import { BOREAS_REFERENCE } from '../data/boreasReference.js'
import { groupBoreasObjectives, HISTORICAL_BOREAS_IDS } from '../logic/boreasReferenceLogic.js'
import { useBoreasReference } from '../composables/useBoreasReference.js'
import { useAppState } from '../composables/useAppState.js'
const { recordedObjectiveIds, unappliedCount, setRecorded, resetRecords } = useBoreasReference()
const { gameMode } = useAppState()
const recorded = computed(() => new Set(recordedObjectiveIds.value))
const groups = groupBoreasObjectives()
const historical = BOREAS_REFERENCE.objectives.filter(o => HISTORICAL_BOREAS_IDS.has(o.id))
const translation = description => ({'Report back to Mechanic':'Mechanicに報告する','Return to Mechanic':'Mechanicのもとに戻る'})[description] || ''
function reset() {
  if (confirm('現在の ' + gameMode.value + ' のBoreas部分データの手動記録（未適用ID含む）をすべて消去します。取り消せません。')) resetRecords()
}
</script>
<template>
  <section aria-labelledby="boreas-reference-title">
    <div class="d-flex flex-wrap justify-content-between gap-2 mb-3">
      <h4 id="boreas-reference-title">Boreas（部分データ）</h4>
      <button class="btn btn-sm btn-outline-danger" @click="reset">この手動記録をリセット</button>
    </div>
    <p class="small">チェックは「ゲーム内で完了したことをユーザーが記録済み」を意味します。未チェックは未記録です。現在のモード: {{ gameMode }}。通常の章進行・タスク完了・解放条件には連動しません。</p>
    <p class="small text-warning">部分的な参考資料です。親クエストごとにまとめた表示順であり、攻略順・分岐条件・待ち時間は未検証です。すべてのグループを自由に参照できます。</p>
    <p class="small text-secondary">参照データ: 83目的 / 19親クエスト。参照対象38サブクエストのうち20件解決、目的文2件欠落。完全な章データではありません。</p>
    <div class="alert alert-info small">
      現行の入場案内（1.1.5公式パッチノート）: Shoreline / Lighthouseから移動し、Sudak-tudak marine repair kitを消費します。キットはRagmanの「Pay the Fare!」で入手します。
      <a href="https://telegra.ph/Patch-1150-09-07-2" target="_blank" rel="noopener noreferrer">公式パッチノート</a>。
      この案内と下の旧仕様の目的IDは別資料です。
    </div>
    <p v-if="unappliedCount" class="small text-secondary">現在の表示に適用していない保存IDが{{ unappliedCount }}件あります。保持してバックアップに含めます。</p>
    <details v-for="group in groups" :key="group.sourceQuestId" class="border border-secondary rounded p-2 mb-2">
      <summary class="small">{{ group.objectives[0].description }}<span class="d-block text-secondary">親クエスト {{ group.sourceQuestId }}</span></summary>
      <div v-for="objective in group.objectives.filter(o => !HISTORICAL_BOREAS_IDS.has(o.id))" :key="objective.id" class="form-check my-2">
        <input :id="'boreas-' + objective.id" class="form-check-input" type="checkbox" :checked="recorded.has(objective.id)" @change="setRecorded(objective.id, $event.target.checked)">
        <label class="form-check-label small" :for="'boreas-' + objective.id">
          {{ objective.description }} <span v-if="objective.type === 'optional'" class="badge bg-secondary">出典では任意</span>
          <span v-if="translation(objective.description)" class="d-block">{{ translation(objective.description) }}</span>
          <span class="d-block text-secondary">目的ID: {{ objective.id }}</span>
        </label>
      </div>
      <p v-if="group.objectives.some(o => HISTORICAL_BOREAS_IDS.has(o.id))" class="small text-secondary mb-0">旧仕様の目的は下の資料欄に掲載しています。</p>
    </details>
    <details class="border border-warning rounded p-2 my-3">
      <summary>旧仕様の入場料（資料のみ・記録対象外）</summary>
      <p class="small mt-2">以下は古い現金支払いの目的文です。現在の入場案内として使用しないでください。</p>
      <div v-for="objective in historical" :key="objective.id" class="small mb-2">{{ objective.description }}<span class="d-block text-secondary">目的ID: {{ objective.id }} / 親: {{ objective.sourceQuestId }}</span></div>
    </details>
    <p class="small text-secondary">出典: <a :href="BOREAS_REFERENCE.sourceUrl" target="_blank" rel="noopener noreferrer">TarkovTracker overlay・固定版</a> / <a href="/licenses/tarkov-data-overlay-MIT.txt" target="_blank" rel="noopener noreferrer">MITライセンス</a>。参照元ゲームデータ: PvE 1.0.5.0.45581（2026-06-30）。他モード・現行版での一致は未検証。</p>
  </section>
</template>
