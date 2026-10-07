import { watch, nextTick } from 'vue'

// In-memory return receipt only: no priorities, progress or browser storage changes.
export function useTaskFlowchartNavigation({ route, router, taskData, openDetails, closeDetails, getOpener }) {
  let receipt = null
  const stop = watch(() => route.fullPath, async (path, previous) => {
    if (!receipt) return
    const saved = receipt
    if (previous !== saved.chart) return
    receipt = null
    if (path !== saved.from) return
    await nextTick()
    if (route.fullPath !== saved.from) return
    const task = taskData.value.find(task => task.id === saved.taskId)
    if (!task) return
    if (saved.opener?.isConnected) saved.opener.focus({ preventScroll: true })
    openDetails(task)
  }, { flush: 'post' })
  async function showFlowchart(task) {
    if (!task?.id || !taskData.value.some(current => current.id === task.id)) return false
    const destination = { name: 'flowchart', query: { task: task.id } }
    const chart = router.resolve(destination).fullPath
    // The list is kept alive, so Back can restore its detail and original opener.
    const saved = route.name === 'input' ? { from: route.fullPath, chart, taskId: task.id, opener: getOpener?.() } : null
    if (chart === route.fullPath) { closeDetails(); return true }
    closeDetails()
    await nextTick()
    receipt = saved
    try {
      const failure = await router.push(destination)
      if (failure) { receipt = null; openDetails(task); return false }
      return true
    } catch {
      receipt = null
      openDetails(task)
      return false
    }
  }
  return { showFlowchart, stop }
}
