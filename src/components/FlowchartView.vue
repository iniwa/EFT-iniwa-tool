<script setup>
// タスク依存関係フローチャート表示
// Mermaidでタスクの前提関係を視覚化する

import { ref, computed, watch, onMounted, nextTick } from 'vue'
import mermaid from 'mermaid'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useApiData } from '../composables/useApiData.js'
import { TRADER_ORDER } from '../data/constants.js'
import * as TaskLogic from '../logic/taskLogic.js'

const {
  completedTasks,
  prioritizedTasks,
  flowchartTrader,
  toggleTask,
} = useUserProgress()

const { taskData } = useApiData()

const emit = defineEmits(['open-task-details'])

// --- ローカル状態 ---
const isInitialSetupMode = ref(false)
const zoomLevel = ref(1.0)
const mermaidContainer = ref(null)

// ノードIDからタスクへのマッピング (クリック処理用)
let nodeMap = {}

// レンダリングカウンター (ユニークなMermaid ID生成用)
let renderCount = 0

// --- トレーダーリスト: taskDataから動的に生成 ---
const traderList = computed(() => {
  if (!taskData.value || taskData.value.length === 0) return []
  const traderNames = new Set()
  taskData.value.forEach((t) => {
    if (t.trader && t.trader.name) {
      traderNames.add(t.trader.name)
    }
  })
  // TRADER_ORDER順にソートし、存在するトレーダーのみ
  const sorted = TRADER_ORDER.filter((name) => traderNames.has(name))
  // TRADER_ORDERに含まれないトレーダーを追加
  traderNames.forEach((name) => {
    if (!sorted.includes(name)) sorted.push(name)
  })
  // 末尾に「全体表示」オプション
  sorted.push('All')
  return sorted
})

// --- ズーム操作 ---
function zoomIn() {
  zoomLevel.value = Math.round((zoomLevel.value + 0.1) * 10) / 10
}

function zoomOut() {
  if (zoomLevel.value > 0.1) {
    zoomLevel.value = Math.round((zoomLevel.value - 0.1) * 10) / 10
  }
}

function zoomReset() {
  zoomLevel.value = 1.0
}

// --- Mermaidラベル用のエスケープ ---
function escapeLabel(text) {
  return text.replace(/"/g, "'").replace(/\(/g, '（').replace(/\)/g, '）')
}

// --- フローチャート描画 ---
async function renderChart() {
  if (!mermaidContainer.value) return
  if (!taskData.value || taskData.value.length === 0) return

  // スクロール位置を保存
  const scrollParent = mermaidContainer.value.parentElement
  const scrollTop = scrollParent ? scrollParent.scrollTop : 0
  const scrollLeft = scrollParent ? scrollParent.scrollLeft : 0

  // 選択中トレーダーのタスクを取得
  const isAll = flowchartTrader.value === 'All'
  const currentTraderTasks = isAll
    ? taskData.value
    : taskData.value.filter((t) => t.trader && t.trader.name === flowchartTrader.value)

  if (currentTraderTasks.length === 0) {
    mermaidContainer.value.innerHTML = '<span class="text-secondary">該当するタスクがありません。</span>'
    return
  }

  // ノードマッピング構築: 各タスクに短いID (t0, t1...) を割り当て
  nodeMap = {}
  const taskToNodeId = new Map()
  let nodeIndex = 0

  // 描画対象のタスクを集める (選択トレーダーのタスク + その前提タスク)
  const nodesToRender = new Map()

  currentTraderTasks.forEach((task) => {
    nodesToRender.set(task.id, task)
  })

  // 前提タスクも描画対象に追加 (他トレーダーのタスクも含む)
  currentTraderTasks.forEach((task) => {
    if (task.taskRequirements) {
      task.taskRequirements.forEach((req) => {
        if (!nodesToRender.has(req.task.id)) {
          const prereqTask = taskData.value.find((t) => t.id === req.task.id)
          if (prereqTask) {
            nodesToRender.set(prereqTask.id, prereqTask)
          }
        }
      })
    }
  })

  // ノードIDを割り当て
  nodesToRender.forEach((task, taskId) => {
    const nid = `t${nodeIndex++}`
    taskToNodeId.set(taskId, nid)
    nodeMap[nid] = task
  })

  // Mermaid定義文字列を構築
  let graph = 'graph LR\n'

  // クラス定義
  graph += '  classDef done fill:#198754,stroke:#198754,color:#fff\n'
  graph += '  classDef doneExternal fill:#198754,stroke:#198754,color:#fff,stroke-dasharray:5 5\n'
  graph += '  classDef todo fill:#212529,stroke:#6c757d,color:#fff\n'
  graph += '  classDef external fill:#6c757d,stroke:#6c757d,color:#fff,stroke-dasharray:5 5\n'
  graph += '  classDef priority stroke:#0dcaf0,stroke-width:4px\n'

  const isCurrentTraderTask = (task) => {
    if (isAll) return true
    return task.trader && task.trader.name === flowchartTrader.value
  }

  // ノード定義
  nodesToRender.forEach((task, taskId) => {
    const nid = taskToNodeId.get(taskId)
    const label = escapeLabel(task.name)
    const isDone = completedTasks.value.includes(task.id)
    const isExternal = !isCurrentTraderTask(task)
    const isPriority = prioritizedTasks.value.includes(task.id)

    // ノード形状の定義
    graph += `  ${nid}["${label}"]\n`

    // クラス割り当て (Mermaidは後のclass文で上書きするため1行にまとめる)
    let classes = ''
    if (isDone && isExternal) {
      classes = 'doneExternal'
    } else if (isDone) {
      classes = 'done'
    } else if (isExternal) {
      classes = 'external'
    } else {
      classes = 'todo'
    }
    if (isPriority && !isDone) {
      classes += ',priority'
    }
    graph += `  class ${nid} ${classes}\n`

    // クリックターゲット
    graph += `  click ${nid} call void(0) "${label}"\n`
  })

  // エッジ定義 (前提タスク → タスク)
  nodesToRender.forEach((task, taskId) => {
    if (task.taskRequirements) {
      task.taskRequirements.forEach((req) => {
        const fromId = taskToNodeId.get(req.task.id)
        const toId = taskToNodeId.get(taskId)
        if (fromId && toId) {
          graph += `  ${fromId} --> ${toId}\n`
        }
      })
    }
  })

  // Mermaidでレンダリング
  try {
    renderCount++
    const { svg } = await mermaid.render(`flowchart-${renderCount}`, graph)
    mermaidContainer.value.innerHTML = svg

    // エッジ要素をクリック不可にする
    await nextTick()
    const edges = mermaidContainer.value.querySelectorAll('.edgePath, .edgeLabel')
    edges.forEach((el) => {
      el.style.pointerEvents = 'none'
    })

    // ノード要素にポインターカーソルを設定
    const nodes = mermaidContainer.value.querySelectorAll('.node')
    nodes.forEach((el) => {
      el.style.cursor = 'pointer'
    })
  } catch (err) {
    console.error('Mermaid render error:', err)
    const errSpan = document.createElement('span')
    errSpan.className = 'text-danger'
    errSpan.textContent = `描画エラー: ${err.message}`
    mermaidContainer.value.replaceChildren(errSpan)
  }

  // スクロール位置を復元
  await nextTick()
  if (scrollParent) {
    scrollParent.scrollTop = scrollTop
    scrollParent.scrollLeft = scrollLeft
  }
}

// --- チャートクリック処理 ---
function handleChartClick(event) {
  // 最も近い .node 要素を探す
  const nodeEl = event.target.closest('.node')
  if (!nodeEl) return

  // ノードIDを抽出
  const nodeId = nodeEl.id || ''
  const match = nodeId.match(/t(\d+)/)
  if (!match) return

  const nid = `t${match[1]}`
  const task = nodeMap[nid]
  if (!task) return

  if (event.shiftKey) {
    // Shift+クリック: 単一タスクのトグル
    toggleTask(task.id)
  } else if (isInitialSetupMode.value) {
    // 初期設定モード: タスクと全前提タスクを一括完了
    const taskName = task.name
    const prereqs = TaskLogic.getAllPrerequisites(task.id, taskData.value)
    const totalCount = prereqs.length + 1
    const confirmed = confirm(
      `「${taskName}」と前提タスク ${prereqs.length} 件（計 ${totalCount} 件）を完了にしますか？`
    )
    if (confirmed) {
      // 対象タスクと前提タスクを全て完了に追加
      const allIds = [task.id, ...prereqs]
      allIds.forEach((id) => {
        if (!completedTasks.value.includes(id)) {
          completedTasks.value.push(id)
        }
      })
    }
  } else {
    // 通常モード: タスク詳細を開く
    emit('open-task-details', task)
  }
}

// --- ウォッチャー: データ変更時に再描画 ---
watch(flowchartTrader, () => renderChart())
watch(completedTasks, () => renderChart(), { deep: true })
watch(prioritizedTasks, () => renderChart(), { deep: true })
watch(taskData, () => renderChart())

// --- 初期化 ---
onMounted(() => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    maxEdges: 1500,
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
    },
  })
  renderChart()
})
</script>

<template>
  <div class="card h-100 border-secondary">
    <!-- ヘッダー: トレーダー選択・モード切替・ズーム -->
    <div class="card-header bg-dark d-flex justify-content-between align-items-center flex-wrap gap-2 py-2">
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <!-- トレーダー選択 -->
        <select
          class="form-select form-select-sm bg-dark text-white border-secondary"
          style="width: auto;"
          v-model="flowchartTrader"
        >
          <option
            v-for="trader in traderList"
            :key="trader"
            :value="trader"
          >
            {{ trader === 'All' ? 'All※実験的機能' : trader }}
          </option>
        </select>

        <!-- 初期設定モード切替 -->
        <div class="form-check form-switch mb-0">
          <input
            class="form-check-input"
            type="checkbox"
            id="initialSetupSwitch"
            v-model="isInitialSetupMode"
          >
          <label class="form-check-label small text-muted" for="initialSetupSwitch">
            初期設定モード
          </label>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2">
        <!-- ヘルプテキスト -->
        <small class="text-muted d-none d-md-inline">
          クリック: 詳細 / Shift+クリック: 完了切替
        </small>

        <!-- ズームボタン -->
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-secondary"
            @click="zoomOut"
            title="縮小"
          >-</button>
          <button
            class="btn btn-outline-secondary"
            @click="zoomReset"
            title="リセット"
          >{{ Math.round(zoomLevel * 100) }}%</button>
          <button
            class="btn btn-outline-secondary"
            @click="zoomIn"
            title="拡大"
          >+</button>
        </div>
      </div>
    </div>

    <!-- チャート本体 -->
    <div
      class="card-body bg-dark overflow-auto p-0"
      style="min-height: 60vh; position: relative;"
    >
      <div
        ref="mermaidContainer"
        class="p-4 mermaid"
        :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }"
        style="min-width: 100%; width: max-content;"
        @click="handleChartClick"
      >
        <span class="text-secondary">Loading...</span>
      </div>
    </div>
  </div>
</template>
