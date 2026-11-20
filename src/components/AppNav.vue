<script setup>
// ルート由来のナビ (作業 / 道具 / ガイド・設定)。レール・ドロワー共用。
import { useRoute } from 'vue-router'

defineProps({
    groups: { type: Array, required: true },
    collapsed: { type: Boolean, default: false },
})
const emit = defineEmits(['navigate'])
const route = useRoute()
</script>

<template>
    <nav class="app-nav" aria-label="メインナビゲーション">
        <section v-for="group in groups" :key="group.key" class="nav-group">
            <h2 class="nav-group-title">{{ group.label }}</h2>
            <ul class="nav-list">
                <li v-for="item in group.items" :key="item.name">
                    <router-link
                        :to="{ name: item.name }"
                        class="nav-item-link"
                        :class="[{ active: route.name === item.name }, item.cssClass]"
                        :aria-current="route.name === item.name ? 'page' : undefined"
                        :title="collapsed ? item.text : undefined"
                        @click="emit('navigate')"
                    >
                        <span class="nav-ico" aria-hidden="true">{{ item.icon }}</span>
                        <span class="nav-text">{{ item.text }}</span>
                        <span v-if="item.conditional" class="nav-cond" :title="item.conditional">条件付</span>
                    </router-link>
                </li>
            </ul>
        </section>
    </nav>
</template>
