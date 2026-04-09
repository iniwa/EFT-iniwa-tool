<script setup>
const props = defineProps({
    appVersion: { type: String, default: '' },
})

const emit = defineEmits(['show-notice'])
</script>

<template>
    <footer class="text-center mt-4 py-3" style="font-size: 0.85em; color: var(--color-text-muted);">
        <div class="mb-2">
            <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScFPBXovafedEgQY10uTH1vAbyOA9r1l6kurIfkTuwN64eyqA/viewform?usp=dialog"
                target="_blank"
                class="btn btn-sm btn-outline-info me-2"
            >📮 意見箱</a>
        </div>
        <div>
            &copy; 2025 <a href="https://twitter.com/iniwach" target="_blank" style="color: var(--color-info);">@iniwach</a>
            | Data by <a href="https://tarkov.dev" target="_blank" style="color: var(--color-info);">tarkov.dev</a>
        </div>
        <div class="mt-1">
            <a href="#" @click.prevent="emit('show-notice')" style="color: var(--color-text-muted);">
                v{{ appVersion }}
            </a>
        </div>
    </footer>
</template>
