<template>
  <div
    class="overlay-root"
    :style="{ fontSize: overlayConfig.fontSize + 'px', color: overlayConfig.textColor }"
  >
    <div
      v-for="task in focusedTasks"
      :key="task.id"
      class="overlay-task"
    >
      <div class="overlay-task-header">
        <img
          v-if="overlayConfig.showTraderIcon && task.trader && task.trader.imageLink"
          :src="task.trader.imageLink"
          :alt="task.trader.name"
          class="overlay-trader-icon"
        />
        <span class="overlay-task-name" :style="{ color: overlayConfig.accentColor }">
          {{ task.name }}
        </span>
      </div>

      <div
        v-if="overlayConfig.showObjectives && task.objectives && task.objectives.length"
        class="overlay-objectives"
      >
        <div
          v-for="(obj, idx) in task.objectives"
          :key="idx"
          class="overlay-obj-line"
          :class="{ 'overlay-obj-done': isObjectiveDone(task.id, idx, obj) }"
        >
          <template v-if="obj.count && obj.count > 1">
            <span class="overlay-obj-count">
              {{ getObjectiveCount(task.id, idx) }}/{{ obj.count }}
            </span>
            <span>{{ objectiveLabel(obj) }}</span>
          </template>
          <template v-else>
            <span>・{{ objectiveLabel(obj) }}</span>
          </template>

          <span
            v-if="overlayConfig.showItems && isItemObjective(obj)"
            class="overlay-obj-items"
          >
            <template v-if="obj.items && obj.items.length === 1">
              — {{ obj.items[0].name }}
            </template>
            <template v-else-if="obj.item">
              — {{ obj.item.name }}
            </template>
          </span>

          <span
            v-if="isObjectiveDone(task.id, idx, obj)"
            class="overlay-obj-check"
          >✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useApiData } from '../composables/useApiData.js';
import { useOverlay } from '../composables/useOverlay.js';
import { useAppState } from '../composables/useAppState.js';

const { taskData, initFromCache, fetchData } = useApiData();
const { focusedTaskIds, overlayConfig, getObjectiveCount } = useOverlay();
const { gameMode, apiLang, isLoading, loadError } = useAppState();

onMounted(async () => {
  const shouldFetch = await initFromCache();
  if (shouldFetch) {
    await fetchData(gameMode.value, apiLang.value, false, isLoading, loadError);
  }
});

const focusedTasks = computed(() => {
  if (!taskData.value) return [];
  const map = new Map(taskData.value.map((t) => [t.id, t]));
  const list = focusedTaskIds.value.map((id) => map.get(id)).filter(Boolean);
  return list.slice(0, overlayConfig.value.maxTasks);
});

function isItemObjective(obj) {
  return (obj.items && obj.items.length > 0) || !!obj.item;
}

function isObjectiveDone(taskId, idx, obj) {
  const cur = getObjectiveCount(taskId, idx);
  if (obj.count && obj.count > 1) return cur >= obj.count;
  return cur > 0;
}

function objectiveLabel(obj) {
  if (obj.items && obj.items.length === 1) return obj.items[0].name;
  if (obj.item) return obj.item.name;
  if (obj.description) return obj.description;
  if (obj.type === 'shoot' && obj.target) return obj.target;
  return '';
}
</script>

<style>
html,
body,
#app {
  background: transparent !important;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.overlay-root {
  padding: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-shadow: 0 0 3px #000, 0 0 6px #000, 1px 1px 2px #000;
  background: transparent;
}
.overlay-task {
  margin-bottom: 16px;
}
.overlay-task-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.overlay-trader-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.overlay-task-name {
  font-weight: 700;
}
.overlay-objectives {
  margin-top: 4px;
  padding-left: 8px;
}
.overlay-obj-line {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
  flex-wrap: wrap;
}
.overlay-obj-count {
  background: rgba(0, 0, 0, 0.5);
  padding: 0 6px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}
.overlay-obj-items {
  opacity: 0.9;
}
.overlay-obj-done {
  text-decoration: line-through;
  text-decoration-thickness: 2px;
  opacity: 0.55;
}
.overlay-obj-done .overlay-obj-count {
  background: rgba(40, 167, 69, 0.6);
}
.overlay-obj-check {
  color: #4caf50;
  font-weight: 700;
  text-decoration: none;
  margin-left: 4px;
}
</style>
