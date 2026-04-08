<script setup>
import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

function show(message, type = 'info', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
}

defineExpose({ show })
</script>

<template>
    <div class="toast-container">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            class="toast-item"
            :class="toast.type"
        >
            {{ toast.message }}
        </div>
    </div>
</template>
