<script setup>
// タスク依存関係フローチャート表示
// Mermaidでタスクの前提関係を視覚化する

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import mermaid from 'mermaid'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useApiData } from '../composables/useApiData.js'
import { TRADER_ORDER } from '../data/constants.js'
import * as TaskLogic from '../logic/taskLogic.js'
import { getZoomedStageBounds, buildFlowchartGateGraph, formatMermaidDottedEdge } from '../logic/flowchartLogic.js'

const {
  completedTasks,
  prioritizedTasks,
  taskStatuses,
  setTaskStatus,
  flowchartTrader,
  toggleTask,
} = useUserProgress()

const { taskData } = useApiData()

const emit = defineEmits(['open-task-details'])

// --- ローカル状態 ---
const isInitialSetupMode = ref(false)
const showGateNodes = ref(true)
const zoomLevel = ref(1.0)
const mermaidContainer = ref(null)
const chartStats = ref({ selected: 0, nodes: 0, edges: 0, gateNodes: 0, gateEdges: 0, external: 0, isolated: 0 })
const chartNaturalSize = ref({ width: 1, height: 1 })
const chartStageBounds = computed(() => getZoomedStageBounds(chartNaturalSize.value.width, chartNaturalSize.value.height, zoomLevel.value))

// ノードIDからタスクへのマッピング (クリック処理用)
let nodeMap = {}

// レンダリングカウンター (ユニークなMermaid ID生成用)
let renderCount = 0
let renderTimer = null
function scheduleRender() {
  clearTimeout(renderTimer)
  renderTimer = setTimeout(renderChart, 100)
}

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
  return String(text || '')
    .replace(/\\/g, '＼')
    .replace(/[\r\n]+/g, ' ')
    .replace(/"/g, "'")
    .replace(/[\[\]]/g, (char) => char === '[' ? '［' : '］')
    .replace(/[{}]/g, (char) => char === '{' ? '｛' : '｝')
    .replace(/</g, '＜')
    .replace(/>/g, '＞')
    .replace(/&/g, '＆')
    .replace(/\|/g, '｜')
    .replace(/\(/g, '（')
    .replace(/\)/g, '）')
}

// --- フローチャート描画 ---
async function renderChart() {
  if (!mermaidContainer.value) return
  const requestId = ++renderCount
  if (!taskData.value || taskData.value.length === 0) {
    chartStats.value = { selected: 0, nodes: 0, edges: 0, gateNodes: 0, gateEdges: 0, external: 0, isolated: 0 }
    chartNaturalSize.value = { width: 1, height: 1 }
    mermaidContainer.value.innerHTML = '<span class="text-secondary">Loading...</span>'
    return
  }

  // スクロール位置を保存
  const scrollParent = mermaidContainer.value.closest('.flowchart-scroll')
  const scrollTop = scrollParent ? scrollParent.scrollTop : 0
  const scrollLeft = scrollParent ? scrollParent.scrollLeft : 0

  // 選択中トレーダーのタスクを取得
  const isAll = flowchartTrader.value === 'All'
  const currentTraderTasks = isAll
    ? taskData.value
    : taskData.value.filter((t) => t.trader && t.trader.name === flowchartTrader.value)

  if (currentTraderTasks.length === 0) {
    chartStats.value = { selected: 0, nodes: 0, edges: 0, gateNodes: 0, gateEdges: 0, external: 0, isolated: 0 }
    chartNaturalSize.value = { width: 1, height: 1 }
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
  const byId = new Map(taskData.value.map((task) => [task.id, task]))
  const closure = TaskLogic.getPrerequisiteClosure(currentTraderTasks.map((task) => task.id), taskData.value)
  closure.forEach((id) => {
    if (!nodesToRender.has(id) && byId.has(id)) nodesToRender.set(id, byId.get(id))
  })

  // ノードIDを割り当て
  nodesToRender.forEach((task, taskId) => {
    const nid = `t${nodeIndex++}`
    taskToNodeId.set(taskId, nid)
    nodeMap[nid] = task
  })

  let edgeCount = 0

  // Mermaid定義文字列を構築
  let graph = 'graph LR\n'

  // クラス定義
  graph += '  classDef done fill:#198754,stroke:#198754,color:#fff\n'
  graph += '  classDef doneExternal fill:#198754,stroke:#198754,color:#fff,stroke-dasharray:5 5\n'
  graph += '  classDef todo fill:#212529,stroke:#6c757d,color:#fff\n'
  graph += '  classDef active fill:#0dcaf0,stroke:#0dcaf0,color:#111\n'
  graph += '  classDef failed fill:#dc3545,stroke:#dc3545,color:#fff\n'
  graph += '  classDef activeExternal fill:#0dcaf0,stroke:#0dcaf0,color:#111,stroke-dasharray:5 5\n'
  graph += '  classDef failedExternal fill:#dc3545,stroke:#dc3545,color:#fff,stroke-dasharray:5 5\n'
  graph += '  classDef external fill:#6c757d,stroke:#6c757d,color:#fff,stroke-dasharray:5 5\n'
  graph += '  classDef priority stroke:#0dcaf0,stroke-width:4px\n'
  graph += '  classDef gate fill:#493b00,stroke:#ffc107,color:#fff,stroke-dasharray:3 3\n'
  graph += '  classDef gateUnknown fill:#303030,stroke:#ffc107,color:#fff,stroke-dasharray:3 3\n'

  const isCurrentTraderTask = (task) => {
    if (isAll) return true
    return task.trader && task.trader.name === flowchartTrader.value
  }

  // ノード定義
  nodesToRender.forEach((task, taskId) => {
    const nid = taskToNodeId.get(taskId)
    const isExternal = !isCurrentTraderTask(task)
    const label = escapeLabel(`${task.name}${isExternal && task.trader?.name ? ` (${task.trader.name})` : ''}`)
    const status = TaskLogic.getTaskStatus(task.id, completedTasks.value, taskStatuses.value)
    const isDone = status === 'complete'
    const isPriority = prioritizedTasks.value.includes(task.id)

    // ノード形状の定義
    graph += `  ${nid}["${label}"]\n`

    // クラス割り当て (Mermaidは後のclass文で上書きするため1行にまとめる)
    let classes = ''
    if (isDone && isExternal) {
      classes = 'doneExternal'
    } else if (isDone) {
      classes = 'done'
    } else if (status === 'active') {
      classes = isExternal ? 'activeExternal' : 'active'
    } else if (status === 'failed') {
      classes = isExternal ? 'failedExternal' : 'failed'
    } else if (isExternal) {
      classes = 'external'
    } else {
      classes = 'todo'
    }
    if (isPriority && !isDone) {
      classes += ',priority'
    }
    graph += `  class ${nid} ${classes}\n`

  })

  const gateGraph = showGateNodes.value ? buildFlowchartGateGraph([...nodesToRender.values()]) : { nodes: [], edges: [] }
  const gateNodeIds = new Map()
  gateGraph.nodes.forEach((gate, index) => {
    const gid = `g${index}`
    gateNodeIds.set(gate.key, gid)
    graph += `  ${gid}{{"${escapeLabel(gate.label)}"}}\n`
    graph += `  class ${gid} ${gate.automatic ? 'gate' : 'gateUnknown'}\n`
  })

  // エッジ定義 (前提タスク → タスク)
  nodesToRender.forEach((task, taskId) => {
    if (task.taskRequirements) {
      task.taskRequirements.forEach((req) => {
        const fromId = taskToNodeId.get(req.task.id)
        const toId = taskToNodeId.get(taskId)
        if (fromId && toId) {
          const statusLabel = TaskLogic.formatTaskRequirementStatuses(req.status)
          const renderedLabel = statusLabel ? `|${escapeLabel(statusLabel)}|` : ''
          graph += `  ${fromId} -->${renderedLabel} ${toId}\n`
          edgeCount++
        }
      })
    }
  })
  gateGraph.edges.forEach((edge) => {
    const fromId = gateNodeIds.get(edge.gateKey)
    const toId = taskToNodeId.get(edge.taskId)
    if (fromId && toId) {
      graph += formatMermaidDottedEdge(fromId, toId, edge.label ? escapeLabel(edge.label) : '')
      edgeCount++
    }
  })
  const connected = new Set()
  nodesToRender.forEach((task) => (task.taskRequirements || []).forEach((req) => { if (taskToNodeId.has(req?.task?.id)) { connected.add(task.id); connected.add(req.task.id) } }))
  chartStats.value = {
    selected: currentTraderTasks.length,
    nodes: nodesToRender.size + gateGraph.nodes.length,
    edges: edgeCount,
    gateNodes: gateGraph.nodes.length,
    gateEdges: gateGraph.edges.length,
    external: Array.from(nodesToRender.values()).filter((task) => !isCurrentTraderTask(task)).length,
    isolated: nodesToRender.size - connected.size,
  }

  // Mermaidでレンダリング
  try {
    const { svg } = await mermaid.render(`flowchart-${requestId}`, graph)
    if (requestId !== renderCount) return
    mermaidContainer.value.innerHTML = svg

    // エッジ要素をクリック不可にする
    await nextTick()
    if (requestId !== renderCount || !mermaidContainer.value) return
    const renderedSvg = mermaidContainer.value.querySelector('svg')
    if (renderedSvg) {
      const viewBox = renderedSvg.viewBox?.baseVal
      const rect = renderedSvg.getBoundingClientRect()
      const svgWidth = renderedSvg.width?.baseVal?.value
      const svgHeight = renderedSvg.height?.baseVal?.value
      chartNaturalSize.value = {
        width: viewBox?.width || svgWidth || (rect.width / zoomLevel.value) || 1,
        height: viewBox?.height || svgHeight || (rect.height / zoomLevel.value) || 1,
      }
    }
    const edges = mermaidContainer.value.querySelectorAll('.edgePath, .edgeLabel')
    edges.forEach((el) => {
      el.style.pointerEvents = 'none'
    })

    // ノード要素にポインターカーソルを設定
    const nodes = mermaidContainer.value.querySelectorAll('.node')
    nodes.forEach((el) => {
      if (/(?:^|-)g\d+(?:-|$)/.test(el.id || '')) {
        el.style.cursor = 'default'
        const state = el.classList.contains('gateUnknown') ? '自動判定なし' : '解放条件'
        el.setAttribute('aria-label', `${el.textContent?.trim() || '解放条件'}: ${state}`)
        el.removeAttribute('tabindex')
        el.removeAttribute('role')
        return
      }
      el.style.cursor = 'pointer'
      el.setAttribute('tabindex', '0')
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `${el.textContent?.trim() || 'タスク'}: 詳細を開く`)
      el.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        const match = (el.id || '').match(/t(\d+)/)
        const task = match ? nodeMap[`t${match[1]}`] : null
        if (!task) return
        if (event.shiftKey) toggleTask(task.id)
        else emit('open-task-details', task)
      })
    })
  } catch (err) {
    if (requestId !== renderCount) return
    console.error('Mermaid render error:', err)
    const errSpan = document.createElement('span')
    errSpan.className = 'text-danger'
    errSpan.textContent = `描画エラー: ${err.message}`
    mermaidContainer.value.replaceChildren(errSpan)
  }

  // スクロール位置を復元
  await nextTick()
  if (requestId !== renderCount) return
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
    // 初期設定モード: タスクと全前提タスクを要件ステータスに沿って適用
    const taskName = task.name
    const plan = TaskLogic.getInitialSetupPlan(task.id, taskData.value)
    const totalCount = plan.length
    const conflictCount = plan.filter((entry) => entry.conflict).length
    const conflictNotice = conflictCount > 0
      ? `\n※分岐条件が競合する前提タスク ${conflictCount} 件は、単一の状態では全経路を同時に満たせないため推奨値を設定します。`
      : ''
    const confirmed = confirm(
      `「${taskName}」と前提タスク ${Math.max(0, totalCount - 1)} 件を、要件に基づく推奨ステータス（完了/進行中/失敗）で設定しますか？${conflictNotice}`
    )
    if (confirmed) {
      // 対象タスクと全前提タスクへ推奨ステータスを適用
      plan.forEach(({ id, status }) => setTaskStatus(id, status))
    }
  } else {
    // 通常モード: タスク詳細を開く
    emit('open-task-details', task)
  }
}

// --- ウォッチャー: データ変更時に再描画 ---
watch(traderList, (list) => {
  if (list.length && !list.includes(flowchartTrader.value)) flowchartTrader.value = 'All'
}, { immediate: true })
watch(flowchartTrader, scheduleRender)
watch(showGateNodes, scheduleRender)
watch(completedTasks, scheduleRender, { deep: true })
watch(taskStatuses, scheduleRender, { deep: true })
watch(prioritizedTasks, scheduleRender, { deep: true })
watch(taskData, (tasks) => {
  // A context switch must not leave the previous graph interactive during the
  // normal render debounce.
  if (!tasks?.length) renderChart()
  else scheduleRender()
})

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
onUnmounted(() => { clearTimeout(renderTimer); renderTimer = null; renderCount++ })
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
        <div class="form-check form-switch mb-0">
          <input class="form-check-input" type="checkbox" id="gateNodesSwitch" v-model="showGateNodes">
          <label class="form-check-label small text-muted" for="gateNodesSwitch">解放条件を表示</label>
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
    <div class="px-3 py-2 small text-muted border-bottom border-secondary">
      実線=タスク前提 / 点線=解放条件（推測でタスク同士を接続しません）・実験的機能　
      対象 {{ chartStats.selected }} / 表示 {{ chartStats.nodes }} / エッジ {{ chartStats.edges }} / 条件ノード {{ chartStats.gateNodes }} / 外部 {{ chartStats.external }} / 孤立 {{ chartStats.isolated }}
      <span class="ms-2">
        <span class="badge bg-success">完了</span>
        <span class="badge bg-info text-dark">進行中</span>
        <span class="badge bg-danger">失敗</span>
        <span class="badge bg-secondary">破線=他トレーダー</span>
        <span class="badge bg-warning text-dark">点線=解放条件</span>
        <span class="badge bg-dark border border-warning text-warning">灰色条件=自動判定なし</span>
      </span>
    </div>
    <div
      class="card-body bg-dark overflow-auto p-0 flowchart-scroll"
      style="min-height: 60vh; position: relative;"
    >
      <div :style="{ width: `${Math.max(chartStageBounds.width, 1)}px`, height: `${Math.max(chartStageBounds.height, 1)}px`, minWidth: '100%' }">
        <div
          ref="mermaidContainer"
          class="mermaid"
          :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', width: `${chartNaturalSize.width}px`, height: `${chartNaturalSize.height}px` }"
          @click="handleChartClick"
          aria-live="polite"
          aria-label="タスク依存関係フローチャート。EnterまたはSpaceで詳細、Shiftを押しながらクリック・Enter・Spaceで完了状態を切り替えます。"
        >
          <span class="text-secondary">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>
