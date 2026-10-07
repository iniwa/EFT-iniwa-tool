import { computed, ref, shallowRef } from 'vue'
import { resolveTaskReference } from '../logic/taskReference.js'

// Only the ammo dialog is suspended; its selection and scroll position remain mounted.
export function useAmmoTaskDetails({ taskData, isLoading, loadError }) {
  const task = shallowRef(null)
  const choices = shallowRef([])
  const message = ref('')
  const trigger = shallowRef(null)
  const suspended = computed(() => task.value !== null || choices.value.length > 0)
  function open(reference, source) {
    if (suspended.value) return
    message.value = ''
    if (isLoading.value || !taskData.value?.length) {
      message.value = isLoading.value
        ? '\u30bf\u30b9\u30af\u30c7\u30fc\u30bf\u3092\u8aad\u307f\u8fbc\u307f\u4e2d\u3067\u3059\u3002'
        : loadError.value ? '\u30bf\u30b9\u30af\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3067\u304d\u3066\u3044\u307e\u305b\u3093\u3002' : '\u30bf\u30b9\u30af\u30c7\u30fc\u30bf\u304c\u3042\u308a\u307e\u305b\u3093\u3002'
      return
    }
    const result = resolveTaskReference(reference, taskData.value)
    if (result.status === 'not-found') {
      message.value = '\u53c2\u7167\u3055\u308c\u305f\u30bf\u30b9\u30af\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3002'
      return
    }
    trigger.value = source
    if (result.status === 'resolved') task.value = result.task
    else choices.value = result.matches
  }
  function choose(selected) {
    if (!choices.value.includes(selected)) return
    task.value = selected
    choices.value = []
  }
  function close() { task.value = null; choices.value = []; message.value = '' }
  return { task, choices, message, suspended, open, choose, close, resumeFocus: () => trigger.value }
}
