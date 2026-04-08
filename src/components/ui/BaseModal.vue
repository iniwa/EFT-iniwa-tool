<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    maxWidth: { type: String, default: '600px' },
})

const emit = defineEmits(['close'])

function onKeydown(e) {
    if (e.key === 'Escape' && props.show) {
        emit('close')
    }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click.self="emit('close')" role="dialog" aria-modal="true">
            <div class="modal-content-custom" :style="{ maxWidth }">
                <slot />
            </div>
        </div>
    </Teleport>
</template>
