<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BaseModal from './ui/BaseModal.vue'
import { formatModifierPoints, PROVISIONAL_IMAGE_NOTE, renderSeasonModifierPng } from '../logic/seasonModifierImage.js'

const props = defineProps({
  season: { type: Object, required: true },
  evaluation: { type: Object, required: true },
})
const emit = defineEmits(['close'])
const imageUrl = ref('')
const failed = ref(false)
let closed = false

const fileName = computed(() => `modifier-${props.season.seasonId}.png`)
const imageDescription = computed(() => {
  const { earned, spent, balance, selectedCount, unknownIds, isPointValid } = props.evaluation
  const notes = [
    isPointValid ? '' : 'ポイント不足。',
    unknownIds.length ? `効果を確認できない項目 ${unknownIds.length}件。` : '',
    props.season.status === 'pre-release' ? PROVISIONAL_IMAGE_NOTE : '',
  ].join('')
  return `${props.season.displayName}。選択中 ${selectedCount}件。獲得 ${formatModifierPoints(earned)}、消費 ${formatModifierPoints(-spent)}、残高 ${formatModifierPoints(balance)}。${notes}`
})

onMounted(async () => {
  try {
    const blob = await renderSeasonModifierPng(props.season, props.evaluation)
    if (!closed) imageUrl.value = URL.createObjectURL(blob)
  } catch {
    if (!closed) failed.value = true
  }
})

onUnmounted(() => {
  closed = true
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})
</script>

<template>
  <BaseModal :show="true" max-width="760px" aria-label="モディファイアの画像プレビュー" @close="emit('close')">
    <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
      <h3 class="h5 mb-0">画像プレビュー</h3>
      <button type="button" class="btn-close btn-close-white" aria-label="閉じる" @click="emit('close')"></button>
    </div>
    <div v-if="imageUrl" class="d-flex flex-column gap-3">
      <div class="image-preview" tabindex="0" role="region" aria-label="画像">
        <img class="img-fluid w-100 d-block" :src="imageUrl" :alt="imageDescription">
        <ul class="visually-hidden">
          <li v-for="item in evaluation.selected" :key="item.id">
            {{ item.name }} {{ formatModifierPoints(item.points) }}。{{ item.description }}
          </li>
        </ul>
      </div>
      <div class="d-flex justify-content-end">
        <a class="btn btn-info" :href="imageUrl" :download="fileName">PNGを保存</a>
      </div>
    </div>
    <p v-else-if="failed" class="alert alert-warning mb-0" role="alert">画像を作成できませんでした。閉じてからもう一度お試しください。</p>
    <p v-else class="mb-0" role="status">画像を作成しています…</p>
  </BaseModal>
</template>

<style scoped>
.image-preview {
  max-height: min(62vh, 620px);
  overflow-y: auto;
}
</style>
