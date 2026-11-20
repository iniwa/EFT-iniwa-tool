<script setup>
// ショッピングリスト表示コンポーネント
// カテゴリ別にアイテムをカード形式で表示し、収集済みトグルとソース詳細を提供

import { reactive, computed, ref } from 'vue'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useShoppingList } from '../composables/useShoppingList.js'
import { useApiData } from '../composables/useApiData.js'

const { collectedItems, toggleCollected, shoppingListMode: listMode } = useUserProgress()
const { displayLists, priorityTaskPlan, priorityDisplayLists } = useShoppingList()
const { taskData } = useApiData()
const visibleLists = computed(() => listMode.value === 'priority' ? priorityDisplayLists.value : displayLists.value)
const taskNames = computed(() => new Map((taskData.value || []).map(task => [task.id, task.name])))
const taskLabel = id => taskNames.value.get(id) || id || '\u4e0d\u660e'
const statusLabels = { complete: '\u5b8c\u4e86', active: '\u9032\u884c\u4e2d', failed: '\u5931\u6557' }
const issueLabels = {
  alternative: '\u72b6\u614b\u306e\u9078\u629e\u304c\u5fc5\u8981\uff08\u5408\u8a08\u5bfe\u8c61\u5916\uff09',
  conflict: '\u5fc5\u8981\u72b6\u614b\u304c\u885d\u7a81\uff08\u5408\u8a08\u5bfe\u8c61\u5916\uff09',
  missing: '\u30bf\u30b9\u30afID\u304c\u30c7\u30fc\u30bf\u306b\u3042\u308a\u307e\u305b\u3093',
  cycle: '\u524d\u63d0\u304c\u5faa\u74b0\uff08\u524d\u63d0\u306e\u6570\u91cf\u306f\u9664\u5916\uff09',
  unsupported: '\u524d\u63d0\u306e\u5f62\u5f0f\u3092\u5224\u5b9a\u3067\u304d\u307e\u305b\u3093',
  failed: '\u5931\u6557\u6e08\u307f\u3067\u5b8c\u4e86\u6761\u4ef6\u3092\u6e80\u305f\u305b\u307e\u305b\u3093',
  'completed-conflict': '\u5b8c\u4e86\u6e08\u307f\u3067\u6307\u5b9a\u306e\u72b6\u614b\u6761\u4ef6\u3092\u6e80\u305f\u305b\u307e\u305b\u3093',
}

const emit = defineEmits(['open-task-from-name'])

// Intel Console: FIR / 買い物の2面 (PC: 並列, スマホ: 切替)
const resPane = ref('fir')
const PANES = [
  { id: 'fir', title: 'FIR（レイドで入手）', keys: ['hideoutFir', 'taskFir', 'collector'] },
  { id: 'buy', title: '買い物（購入で可）', keys: ['hideoutBuy', 'taskNormal'] },
]
const panes = computed(() => PANES.map(pane => ({
  ...pane,
  lists: pane.keys.filter(key => visibleLists.value[key]).map(key => ({ key, list: visibleLists.value[key] })),
})))
const paneCount = pane => pane.lists.reduce((sum, { list }) => sum + list.items.length, 0)

// 展開中のアイテム管理 (uid -> boolean)
const expandedItems = reactive({})

function toggleItemDetails(uid) {
  expandedItems[uid] = !expandedItems[uid]
}
</script>

<template>
  <div class="result-page">
    <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
      <label for="item-list-mode">&#12450;&#12452;&#12486;&#12512;&#19968;&#35239;</label>
      <select id="item-list-mode" v-model="listMode" class="form-select form-select-sm bg-dark text-white border-secondary" style="width: auto;">
        <option value="all">&#20840;&#26410;&#23436;&#20102;&#12479;&#12473;&#12463;&#65288;&#24467;&#26469;&#12398;&#19968;&#35239;&#65289;</option>
        <option value="priority">&#20778;&#20808;&#12479;&#12473;&#12463;&#65291;&#24517;&#35201;&#12394;&#21069;&#25552;</option>
      </select>
    </div>
    <section v-if="listMode === 'priority'" class="mb-3" aria-label="Priority task scope">
      <p class="small text-muted mb-2">&#20778;&#20808;&#30446;&#27161;&#12392;&#23436;&#20102;&#12364;&#24517;&#38920;&#12398;&#26410;&#23436;&#20102;&#21069;&#25552;&#12434;&#38598;&#35336;&#12290;&#12495;&#12452;&#12489;&#12450;&#12454;&#12488;&#26448;&#26009;&#12399;&#36890;&#24120;&#19968;&#35239;&#12392;&#21516;&#12376;&#26465;&#20214;&#12391;&#21547;&#12415;&#12414;&#12377;&#12290;&#21454;&#38598;&#12481;&#12455;&#12483;&#12463;&#12399;&#36890;&#24120;&#19968;&#35239;&#12392;&#20849;&#36890;&#12391;&#12377;&#12290;</p>
      <p v-if="!priorityTaskPlan.goals.length" role="status">&#26410;&#23436;&#20102;&#12398;&#20778;&#20808;&#12479;&#12473;&#12463;&#12364;&#12354;&#12426;&#12414;&#12379;&#12435;&#12290;&#36914;&#25431;&#19968;&#35239;&#12398;&#26143;&#12391;&#20778;&#20808;&#30446;&#27161;&#12434;&#36984;&#12435;&#12391;&#12367;&#12384;&#12373;&#12356;&#12290;</p>
      <div class="d-flex flex-wrap gap-2 mb-2">
        <button v-for="task in priorityTaskPlan.goals" :key="task.id" type="button" class="btn btn-sm btn-outline-info" @click="emit('open-task-from-name', { id: task.id, name: task.name })">{{ task.name }}</button>
      </div>
      <div v-if="priorityTaskPlan.issues.length" class="alert alert-warning mb-2" role="status">
        <p>&#32076;&#36335;&#12395;&#30906;&#35469;&#20107;&#38917;&#12364;&#12354;&#12426;&#12414;&#12377;&#12290;&#19979;&#12398;&#25968;&#37327;&#12399;&#30906;&#23450;&#12375;&#12383;&#37096;&#20998;&#12398;&#12415;&#12391;&#12289;&#21040;&#36948;&#12414;&#12391;&#12398;&#32207;&#25968;&#12391;&#12399;&#12354;&#12426;&#12414;&#12379;&#12435;&#12290;</p>
        <ul class="mb-0">
          <li v-for="issue in priorityTaskPlan.issues" :key="issue.key">
            <span v-if="issue.ownerId">{{ taskLabel(issue.ownerId) }} &#8594; </span>
            <button v-if="taskNames.has(issue.taskId)" type="button" class="btn btn-link p-0 align-baseline" @click="emit('open-task-from-name', { id: issue.taskId, name: taskLabel(issue.taskId) })">{{ taskLabel(issue.taskId) }}</button>
            <span v-else>{{ taskLabel(issue.taskId) }}</span>: {{ issueLabels[issue.kind] }}
            <span v-if="issue.allowed.length"> ({{ issue.allowed.map(status => statusLabels[status] || status).join(' / ') }})</span>
            <span v-if="issue.path.length">: {{ issue.path.map(taskLabel).join(' \u2192 ') }}</span>
          </li>
        </ul>
      </div>
    </section>
    <div class="res-switch seg" role="group" aria-label="表示する面">
      <button v-for="pane in panes" :key="pane.id" type="button" class="btn btn-sm" :class="resPane === pane.id ? 'btn-warning' : 'btn-outline-secondary'" :aria-pressed="resPane === pane.id" @click="resPane = pane.id">{{ pane.title }} ({{ paneCount(pane) }})</button>
    </div>
    <div class="res-panes">
      <section v-for="pane in panes" :key="pane.id" class="res-pane" :class="[pane.id, { 'hidden-mobile': resPane !== pane.id }]" :aria-label="pane.title">
        <h2>{{ pane.title }} <small class="text-muted fw-normal">{{ paneCount(pane) }}件</small></h2>
        <div v-for="{ key, list } in pane.lists" :key="key" class="list-card">
          <h3 :class="list.headerClass">{{ list.title }}</h3>
          <ul class="list-unstyled mb-0">
            <li v-for="item in list.items" :key="item.uid" class="res-item">
              <div class="row-main">
                <input
                  type="checkbox"
                  class="form-check-input check"
                  :aria-label="item.name + ' を入手済みにする'"
                  :checked="collectedItems.includes(item.uid)"
                  @click.stop="toggleCollected(item.uid)"
                >
                <button type="button" class="row-btn" :aria-expanded="!!expandedItems[item.uid]" @click="toggleItemDetails(item.uid)">
                  <span :class="{ 'item-collected': collectedItems.includes(item.uid) }">{{ item.name }}</span>
                  <span class="badge" :class="[list.badgeClass, { 'item-collected-badge': collectedItems.includes(item.uid) }]">{{ item.count }}</span>
                </button>
              </div>
              <div v-if="expandedItems[item.uid]" class="origin">
                <div class="text-secondary">由来</div>
                <div v-for="source in item.sources" :key="source.type + ':' + (source.taskId || source.name)">
                  <span v-if="source.type === 'task' || source.type === 'collector'">
                    ・<button type="button" class="source-task-link" @click="emit('open-task-from-name', { id: source.taskId, name: source.name })">{{ source.name }}</button> (x{{ source.count }})
                  </span>
                  <span v-else>・{{ source.name }} (x{{ source.count }})</span>
                </div>
                <template v-if="listMode === 'priority' && ['taskFir', 'collector', 'taskNormal'].includes(key)">
                  <div v-for="source in item.sources" :key="'conditions:' + source.taskId" class="ms-2">
                    <div v-for="(objective, index) in source.objectives" :key="index">{{ source.name }}: {{ objective.description }} <span v-if="objective.optional">(&#20219;&#24847;)</span></div>
                  </div>
                </template>
                <div v-if="item.altItems" class="border-top pt-1" style="border-color: var(--line) !important;">
                  <div class="text-info mb-1">対象アイテム (いずれか合計):</div>
                  <div v-for="alt in item.altItems" :key="alt.id" class="ms-2">・{{ alt.name }}</div>
                </div>
              </div>
            </li>
            <li v-if="list.items.length === 0" class="res-empty">この区分の必要品はありません。</li>
          </ul>
        </div>
        <p v-if="pane.lists.length === 0" class="res-empty">表示できる必要品がありません。</p>
      </section>
    </div>
  </div>
</template>
