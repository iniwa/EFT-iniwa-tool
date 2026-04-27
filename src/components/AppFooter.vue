<script setup>
import { RouterLink } from 'vue-router'

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

        <div class="footer-links mb-2">
            <RouterLink to="/about">About</RouterLink>
            <span class="sep">|</span>
            <RouterLink to="/guide">使い方</RouterLink>
            <span class="sep">|</span>
            <RouterLink to="/faq">FAQ</RouterLink>
            <span class="sep">|</span>
            <RouterLink to="/privacy">プライバシーポリシー</RouterLink>
            <span class="sep">|</span>
            <RouterLink to="/terms">利用規約</RouterLink>
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

<style scoped>
.footer-links a {
    color: var(--color-text-muted);
    text-decoration: none;
}
.footer-links a:hover {
    color: var(--color-info);
    text-decoration: underline;
}
.footer-links .sep {
    margin: 0 8px;
    color: var(--border-light);
}
</style>
