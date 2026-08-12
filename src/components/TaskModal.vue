<script setup>
// タスク詳細モーダル
// タスク情報の閲覧、進捗/優先トグル、鍵の所持トグル

import { computed } from 'vue'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useOverlay } from '../composables/useOverlay.js'
import * as TaskLogic from '../logic/taskLogic.js'
import BaseModal from './ui/BaseModal.vue'

const {
  completedTasks,
  prioritizedTasks,
  ownedKeys,
  togglePriority,
  toggleOwnedKey,
  taskStatuses,
  traderProgress,
  traderRequirementsEnabled,
  setTaskStatus,
} = useUserProgress()

const { focusedTaskIds, toggleFocusedTask, overlayEnabled } = useOverlay()
const { playerLevel } = useAppState()

const props = defineProps({
  task: { type: Object, default: null },
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const taskStatus = computed(() => {
  if (!props.task) return 'unstarted'
  return TaskLogic.getTaskStatus(props.task.id, completedTasks.value, taskStatuses.value)
})

const availability = computed(() => {
  if (!props.task) return null
  return TaskLogic.evaluateTaskAvailability(props.task, completedTasks.value, {
    playerLevel: playerLevel.value,
    taskStatuses: taskStatuses.value,
    traderProgress: traderProgress.value,
    traderRequirementsEnabled: traderRequirementsEnabled.value,
  })
})

const statusLabels = {
  unstarted: '未受注',
  active: '進行中',
  complete: '完了',
  failed: '失敗',
}

function prerequisiteStatus(requirement) {
  return TaskLogic.getTaskStatus(
    requirement.task.id,
    completedTasks.value,
    taskStatuses.value,
  )
}

function prerequisiteMet(requirement) {
  const allowed = Array.isArray(requirement.status) && requirement.status.length > 0
    ? requirement.status
    : ['complete']
  return allowed.includes(prerequisiteStatus(requirement))
}

function traderRequirementResult(requirement) {
  return TaskLogic.evaluateTraderRequirement(requirement, traderProgress.value)
}

function traderRequirementLabel(requirement) {
  const isReputation = ['reputation', 'standing'].includes(requirement.requirementType)
  const field = isReputation ? '評判' : 'LL'
  return `${requirement.trader?.name || 'Unknown'} ${field} ${requirement.compareMethod || '>='} ${requirement.value ?? requirement.level}`
}

function otherRequirementLabel(requirement) {
  if (requirement.type === 'dialogue') {
    const traders = (requirement.traders || []).map((trader) => trader.name).join(' / ')
    return `会話条件${traders ? `: ${traders}` : ''}`
  }
  if (requirement.type === 'globalVariable') {
    return `ゲーム内進行条件 ${requirement.compareMethod || '>='} ${requirement.value ?? ''}`.trim()
  }
  return `${requirement.type || '追加条件'}（ゲーム内で確認）`
}
</script>

<template>
  <BaseModal :show="show" max-width="700px" @close="emit('close')">
    <template v-if="task">
      <!-- 進捗/優先トグル + 閉じるボタン -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="d-flex align-items-end gap-3 w-100 flex-wrap">
          <div>
            <label class="form-label small mb-1" for="task-status-select">ステータス</label>
            <select
              id="task-status-select"
              class="form-select form-select-sm bg-dark text-white border-secondary"
              :value="taskStatus"
              @change="setTaskStatus(task.id, $event.target.value)"
            >
              <option value="unstarted">未受注</option>
              <option value="active">進行中</option>
              <option value="complete">完了</option>
              <option value="failed">失敗</option>
            </select>
          </div>

          <button
            class="btn btn-sm"
            :class="prioritizedTasks.includes(task.id) ? 'btn-warning' : 'btn-outline-secondary'"
            @click="togglePriority(task.id)"
          >
            {{ prioritizedTasks.includes(task.id) ? '★ 優先 (Prioritized)' : '☆ 優先にする' }}
          </button>

          <button
            v-if="overlayEnabled"
            class="btn btn-sm"
            :class="focusedTaskIds.includes(task.id) ? 'btn-info' : 'btn-outline-secondary'"
            @click="toggleFocusedTask(task.id)"
          >
            {{ focusedTaskIds.includes(task.id) ? '📌 表示中' : '📌 配信オーバーレイに表示' }}
          </button>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white flex-shrink-0 ms-3"
          @click="emit('close')"
        ></button>
      </div>

      <!-- タスク名 -->
      <h4
        class="m-0 text-warning mb-3"
        :class="{ 'text-decoration-line-through text-muted': completedTasks.includes(task.id) }"
      >
        {{ task.name }}
      </h4>

      <!-- 基本情報 -->
      <div class="mb-3 d-flex justify-content-between flex-wrap gap-2 border-bottom border-secondary pb-2">
        <div><strong>Trader:</strong> {{ task.trader?.name || 'Unknown' }}</div>
        <div><strong>Map:</strong> {{ task.map ? task.map.name : 'None' }}</div>
        <div v-if="task.minPlayerLevel > 0">
          <span class="text-info fw-bold">Req Lv: {{ task.minPlayerLevel }}</span>
        </div>
        <div v-if="task.kappaRequired"><span class="badge badge-kappa">KAPPA</span></div>
        <div v-if="task.lightkeeperRequired"><span class="badge badge-lk">LK</span></div>
      </div>
      <div
        v-if="taskStatus !== 'complete' && availability?.locked"
        class="alert alert-secondary py-2 px-3 small"
      >
        🔒 現在の入力内容では未解放です。下の条件を確認してください。
      </div>

      <div
        v-if="task.taskRequirements?.length || task.traderLevelRequirements?.length || task.otherRequirements?.length"
        class="mb-4"
      >
        <h6 class="border-bottom pb-1 mb-2 text-warning">解放条件</h6>

        <ul v-if="task.taskRequirements?.length" class="list-group mb-2">
          <li
            v-for="requirement in task.taskRequirements"
            :key="requirement.task.id"
            class="list-group-item bg-dark text-light border-secondary py-2 d-flex justify-content-between gap-2"
          >
            <span>
              前提: {{ requirement.task.name }}
              <span class="text-muted small">
                （必要: {{ (requirement.status?.length ? requirement.status : ['complete']).map((status) => statusLabels[status] || status).join(' / ') }}）
              </span>
            </span>
            <span
              class="badge align-self-center"
              :class="prerequisiteMet(requirement) ? 'bg-success' : 'bg-danger'"
            >
              {{ statusLabels[prerequisiteStatus(requirement)] || prerequisiteStatus(requirement) }}
            </span>
          </li>
        </ul>

        <ul v-if="task.traderLevelRequirements?.length" class="list-group mb-2">
          <li
            v-for="requirement in task.traderLevelRequirements"
            :key="requirement.id"
            class="list-group-item bg-dark text-light border-secondary py-2 d-flex justify-content-between gap-2"
          >
            <span>{{ traderRequirementLabel(requirement) }}</span>
            <span
              class="badge align-self-center"
              :class="traderRequirementResult(requirement).met
                ? 'bg-success'
                : (traderRequirementResult(requirement).unknown ? 'bg-secondary' : 'bg-danger')"
            >
              <template v-if="traderRequirementResult(requirement).unknown">未設定</template>
              <template v-else>
                {{ traderRequirementResult(requirement).met ? '達成' : '未達' }}:
                現在 {{ traderRequirementResult(requirement).actual }}
              </template>
            </span>
          </li>
        </ul>
        <p v-if="task.traderLevelRequirements?.length" class="small text-muted mb-2">
          トレーダー条件のロック判定は現在
          <strong>{{ traderRequirementsEnabled ? '有効' : '無効' }}</strong>です。
        </p>

        <ul v-if="task.otherRequirements?.length" class="list-group">
          <li
            v-for="requirement in task.otherRequirements"
            :key="requirement.id"
            class="list-group-item bg-dark text-light border-secondary py-2"
          >
            {{ otherRequirementLabel(requirement) }}
            <span class="badge bg-secondary ms-1">自動判定なし</span>
          </li>
        </ul>
      </div>

      <!-- 必要な鍵 -->
      <div v-if="task.neededKeys && task.neededKeys.length > 0" class="mb-4">
        <h6 class="border-bottom pb-1 mb-2 text-warning">🔑 必要な鍵 (Needed Keys)</h6>
        <ul class="list-group">
          <li
            v-for="(group, gIdx) in task.neededKeys"
            :key="'g' + gIdx"
            class="list-group-item bg-dark text-light border-secondary py-2"
          >
            <div
              v-for="(keyItem, kIdx) in group.keys"
              :key="'k' + kIdx"
              class="d-flex align-items-center gap-2 flex-wrap mb-1"
            >
              <button
                class="btn btn-sm py-0 px-2 fw-bold"
                :class="ownedKeys.includes(keyItem.id) ? 'btn-success' : 'btn-outline-secondary'"
                @click="toggleOwnedKey(keyItem.id)"
                style="min-width: 60px; height: 24px; font-size: 0.8em;"
              >
                {{ ownedKeys.includes(keyItem.id) ? '所持' : '未所持' }}
              </button>
              <span
                class="fw-bold"
                :class="ownedKeys.includes(keyItem.id) ? 'text-success' : 'text-info'"
              >
                {{ keyItem.name }}
              </span>
              <span v-if="keyItem.shortName" class="text-muted small">({{ keyItem.shortName }})</span>
              <a
                v-if="keyItem.wikiLink"
                :href="keyItem.wikiLink"
                target="_blank"
                class="btn btn-sm btn-outline-secondary py-0 px-1"
                style="font-size: 0.7em;"
              >Wiki</a>
            </div>
          </li>
        </ul>
      </div>

      <!-- Wikiリンク -->
      <div class="d-grid gap-2 mb-4">
        <a
          v-if="task.wikiLink"
          :href="task.wikiLink"
          target="_blank"
          class="btn btn-outline-info btn-sm"
        >📖 Wikiで詳細を見る</a>
      </div>

      <!-- 目標 (Objectives) -->
      <div v-if="task.objectives && task.objectives.length > 0" class="mb-4">
        <h6 class="border-bottom pb-1 mb-2 text-info">目標 (Objectives)</h6>
        <ul class="list-group">
          <li
            v-for="(obj, idx) in task.objectives"
            :key="idx"
            class="list-group-item bg-dark text-light border-secondary py-2"
          >
            <!-- TaskObjectiveItem: items配列 or 単体item -->
            <div v-if="obj.items && obj.items.length > 0">
              <div v-if="obj.items.length === 1">
                <span class="text-warning fw-bold">{{ obj.items[0].name }}</span> x {{ obj.count }}
              </div>
              <div v-else>
                <span class="text-warning fw-bold">{{ obj.description }}</span> x {{ obj.count }}
                <div class="mt-1 small text-muted">
                  <div>対象アイテム (いずれか合計):</div>
                  <div v-for="alt in obj.items" :key="alt.id" class="ms-2">・{{ alt.name }}</div>
                </div>
              </div>
              <div class="mt-1">
                <span v-if="obj.foundInRaid" class="badge bg-warning text-dark me-1">FIR</span>
                <span v-if="obj.type === 'findItem' && !obj.foundInRaid" class="badge bg-secondary me-1">Find</span>
                <span v-if="obj.type === 'giveItem'" class="badge bg-info text-dark me-1">Give</span>
              </div>
            </div>
            <div v-else-if="obj.item">
              <span class="text-warning fw-bold">{{ obj.item.name }}</span> x {{ obj.count }}
              <div class="mt-1">
                <span v-if="obj.foundInRaid" class="badge bg-warning text-dark me-1">FIR</span>
                <span v-if="obj.type === 'findItem' && !obj.foundInRaid" class="badge bg-secondary me-1">Find</span>
                <span v-if="obj.type === 'giveItem'" class="badge bg-info text-dark me-1">Give</span>
              </div>
            </div>

            <!-- TaskObjectiveShoot -->
            <div v-else-if="obj.type === 'shoot'">
              <span>
                ⚔️ <span class="fw-bold text-danger">{{ obj.target }}</span>
                <span class="fw-bold text-warning ms-1">x{{ obj.count }}</span>
              </span>
              <span v-if="obj.description" class="small text-white ms-2">
                - {{ obj.description }}
              </span>
            </div>

            <!-- その他の目標 -->
            <div v-else>
              <span v-if="obj.description">{{ obj.description }}</span>
              <span v-else class="text-muted small">(アクション目標)</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- 報酬 (Rewards) -->
      <div v-if="task.finishRewardsList && task.finishRewardsList.length > 0">
        <h6 class="border-bottom pb-1 mb-2 text-success">報酬 (Rewards)</h6>
        <ul class="list-group">
          <li
            v-for="(reward, idx) in task.finishRewardsList"
            :key="'r' + idx"
            class="list-group-item bg-dark text-light border-secondary py-1"
          >
            <div v-if="reward.type === 'item'">
              📦 {{ reward.name }} <span class="text-warning">x{{ reward.count }}</span>
            </div>
            <div v-else-if="reward.type === 'offerUnlock'">
              🔓 販売: {{ reward.itemName }} ({{ reward.trader }} Lv{{ reward.level }})
            </div>
            <div v-else-if="reward.type === 'craftUnlock'" class="text-info">
              🔨 生成: {{ reward.itemName }} ({{ reward.station }} Lv{{ reward.level }})
            </div>
          </li>
        </ul>
      </div>
    </template>
  </BaseModal>
</template>
