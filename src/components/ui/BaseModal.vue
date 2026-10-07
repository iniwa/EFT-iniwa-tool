<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    resumeFocus: { type: Function, default: null },
    maxWidth: { type: String, default: '600px' },
    ariaLabel: { type: String, default: 'Dialog' },
})

const emit = defineEmits(['close'])

const dialog = ref(null)
let previousFocus = null
function focusable() {
  return [...(dialog.value?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])]
}
function onKeydown(e) {
    if (e.key === 'Escape' && props.show && !props.suspended) {
        emit('close')
    }
    if (e.key === 'Tab' && props.show && !props.suspended) {
      const items = focusable(); if (!items.length) { e.preventDefault(); dialog.value?.focus(); return }
      const first = items[0], last = items.at(-1)
      // The active element can be outside the teleported dialog (for example
      // after a browser UI shortcut). Always recover focus into the modal.
      if (!dialog.value?.contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? last : first).focus() }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
}
async function focusDialog(resuming = false) {
  await nextTick()
  if (!props.show || props.suspended) return
  const target = resuming ? props.resumeFocus?.() : null
  if (target && dialog.value?.contains(target)) target.focus()
  else { const first = focusable()[0]; if (first) first.focus(); else dialog.value?.focus() }
}
watch(() => props.suspended, (suspended, previous) => {
  if (previous && !suspended && props.show) focusDialog(true)
})
watch(() => props.show, async (shown) => {
  if (shown) { previousFocus = document.activeElement; await focusDialog() }
  else previousFocus?.focus?.()
})
onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  // Support consumers that are already open on their first render.
  if (props.show) {
    previousFocus = document.activeElement
    await focusDialog()
  }
})
onUnmounted(() => { document.removeEventListener('keydown', onKeydown); if (props.show) previousFocus?.focus?.() })
</script>

<template>
    <Teleport to="body">
        <div v-if="show" v-show="!suspended" class="modal-overlay" @click.self="emit('close')">
            <div ref="dialog" class="modal-content-custom" :style="{ maxWidth }" role="dialog" aria-modal="true" :aria-label="ariaLabel" tabindex="-1">
                <slot />
            </div>
        </div>
    </Teleport>
</template>
