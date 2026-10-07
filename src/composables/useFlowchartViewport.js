import { ref, nextTick } from 'vue'

export const MIN_FLOWCHART_ZOOM = 0.1
export const MAX_FLOWCHART_ZOOM = 3
export const clampFlowchartZoom = value => Number.isFinite(value) ? Math.min(MAX_FLOWCHART_ZOOM, Math.max(MIN_FLOWCHART_ZOOM, value)) : 1

// Scroll offsets pan the scaled stage; touch pointers keep native scrolling.
export function useFlowchartViewport({ viewport, zoom, size }) {
  const panning = ref(false)
  let drag = null, suppressClickUntil = 0, pendingScroll = null, zoomRequest = 0
  function cancelPan() {
    const previous = drag
    drag = null
    panning.value = false
    if (previous?.moved) suppressClickUntil = Date.now() + 300
    if (previous && viewport.value?.hasPointerCapture?.(previous.id)) viewport.value.releasePointerCapture(previous.id)
  }
  async function zoomTo(value, anchor, reset = false) {
    const el = viewport.value
    if (!el || !Number.isFinite(value)) return
    cancelPan()
    const next = clampFlowchartZoom(value), old = zoom.value
    const point = anchor || { x: el.clientWidth / 2, y: el.clientHeight / 2 }
    const base = pendingScroll || { left: el.scrollLeft, top: el.scrollTop }
    pendingScroll = reset ? { left: 0, top: 0 } : {
      left: Math.max(0, (base.left + point.x) * next / old - point.x),
      top: Math.max(0, (base.top + point.y) * next / old - point.y),
    }
    zoom.value = next
    const request = ++zoomRequest
    await nextTick()
    if (request !== zoomRequest || viewport.value !== el) return
    el.scrollLeft = pendingScroll.left
    el.scrollTop = pendingScroll.top
    pendingScroll = null
    return true
  }
  async function fitContext(bounds) {
    const el = viewport.value
    if (!el || !bounds || ![bounds.x, bounds.y, bounds.width, bounds.height].every(Number.isFinite) || bounds.width <= 0 || bounds.height <= 0) return false
    const factor = Math.min(Math.max(1, el.clientWidth - 48) / bounds.width, Math.max(1, el.clientHeight - 48) / bounds.height)
    if (!await zoomTo(factor, null, true)) return false
    el.scrollLeft = Math.max(0, (bounds.x + bounds.width / 2) * zoom.value - el.clientWidth / 2)
    el.scrollTop = Math.max(0, (bounds.y + bounds.height / 2) * zoom.value - el.clientHeight / 2)
    return true
  }
  function onWheel(event) {
    const el = viewport.value
    if (!el || !event.deltaY || !Number.isFinite(event.deltaY)) return
    event.preventDefault()
    const rect = el.getBoundingClientRect()
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientHeight : 1)
    return zoomTo(zoom.value * Math.exp(-Math.max(-400, Math.min(400, delta)) * 0.002), {
      x: event.clientX - rect.left - (el.clientLeft || 0),
      y: event.clientY - rect.top - (el.clientTop || 0),
    })
  }
  function onPointerDown(event) {
    suppressClickUntil = 0
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.isPrimary === false || event.target.closest('.node, button, a, input, select')) return
    const el = viewport.value
    cancelPan()
    suppressClickUntil = 0
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop, moved: false }
    el.setPointerCapture(event.pointerId)
    el.focus({ preventScroll: true })
    event.preventDefault()
  }
  function onPointerMove(event) {
    if (!drag || drag.id !== event.pointerId) return
    if ((event.buttons & 1) === 0) { cancelPan(); return }
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < 4) return
    drag.moved = true
    panning.value = true
    viewport.value.scrollLeft = drag.left - dx
    viewport.value.scrollTop = drag.top - dy
    event.preventDefault()
  }
  function onPointerEnd(event) { if (drag?.id === event.pointerId) cancelPan() }
  function onClickCapture(event) {
    if (event.detail !== 0 && Date.now() < suppressClickUntil) {
      event.preventDefault()
      event.stopPropagation()
      suppressClickUntil = 0
    }
  }
  function dispose() { cancelPan(); zoomRequest++; pendingScroll = null }
  return { fitContext, dispose, panning, onWheel, onPointerDown, onPointerMove, onPointerEnd, cancelPan, onClickCapture,
    zoomIn: () => zoomTo(zoom.value + 0.1), zoomOut: () => zoomTo(zoom.value - 0.1),
    zoomReset: () => zoomTo(1, null, true),
    fitView: () => viewport.value && zoomTo(Math.min(viewport.value.clientWidth / Math.max(1, size.value.width), viewport.value.clientHeight / Math.max(1, size.value.height)), null, true),
  }
}
