<script setup>
// ルート由来のナビ (作業 / 道具 / ガイド・設定)。レール・ドロワー共用。
import { useRoute } from 'vue-router'

defineProps({
    groups: { type: Array, required: true },
    collapsed: { type: Boolean, default: false },
})
const emit = defineEmits(['navigate'])
const route = useRoute()

function navTarget(item) {
    if (item.href) return { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
    if (item.action) return { type: 'button' }
    return { to: { name: item.name } }
}

function navigate(item) {
    emit('navigate')
    item.action?.()
}
</script>

<template>
    <nav class="app-nav" aria-label="メインナビゲーション">
        <section v-for="group in groups" :key="group.key" class="nav-group" :class="{ 'nav-group-secondary': group.secondary }">
            <h2 class="nav-group-title">{{ group.label }}</h2>
            <ul class="nav-list">
                <li v-for="item in group.items" :key="item.name">
                    <component
                        :is="item.href ? 'a' : item.action ? 'button' : 'router-link'"
                        v-bind="navTarget(item)"
                        class="nav-item-link"
                        :class="[{ active: route.name === item.name }, item.cssClass]"
                        :aria-current="route.name === item.name ? 'page' : undefined"
                        :aria-label="collapsed ? item.text : undefined"
                        :title="collapsed ? item.text : undefined"
                        @click="navigate(item)"
                    >
                        <span class="nav-ico" aria-hidden="true">{{ item.icon }}</span>
                        <span class="nav-text">{{ item.text }}</span>
                        <span v-if="item.conditional" class="nav-cond" :title="item.conditional">条件付</span>
                    </component>
                </li>
            </ul>
        </section>
    </nav>
</template>
