<script setup>
// 上部バー: ブランド / モード色帯 / Lv. / JP・EN / 更新 / データ操作
import { ref } from 'vue'

const props = defineProps({
    lastUpdated: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
    playerLevel: { type: Number, default: 0 },
    gameMode: { type: String, default: 'pve' },
    apiLang: { type: String, default: 'ja' },
    appVersion: { type: String, default: '' },
    railCollapsed: { type: Boolean, default: false },
})

const emit = defineEmits([
    'fetch-data',
    'update:player-level',
    'export-data',
    'trigger-import',
    'update:game-mode',
    'update:api-lang',
    'toggle-rail',
    'open-drawer',
])

const MODES = [
    { value: 'pve', label: 'PvE' },
    { value: 'regular', label: 'PvP' },
    { value: 'pvp-season', label: 'Seasonal PvP', title: '通常PvPと独立した進捗。新シーズン開始時にSeasonal PvP側の進捗をリセットします。' },
]

const dataMenu = ref(null)

function onLevelInput(e) {
    const val = parseInt(e.target.value, 10)
    emit('update:player-level', isNaN(val) ? 0 : val)
}

function runData(kind) {
    if (dataMenu.value) dataMenu.value.open = false
    emit(kind)
}
</script>

<template>
    <header class="topbar" role="banner">
        <div class="topbar-main">
            <button
                type="button" class="icon-btn d-none d-lg-inline-flex"
                :aria-label="railCollapsed ? 'メニューを広げる' : 'メニューを畳む'"
                :aria-expanded="!railCollapsed"
                @click="emit('toggle-rail')"
            >☰</button>
            <button
                type="button" class="icon-btn d-lg-none"
                aria-label="メニューを開く" @click="emit('open-drawer')"
            >☰</button>

            <router-link to="/" class="brand" aria-label="Iniwa's Intel Center 進捗入力へ">
                <span class="brand-mark" aria-hidden="true"></span>
                <span class="brand-name">Iniwa's Intel Center</span>
                <small class="brand-ver">v{{ appVersion }}</small>
            </router-link>

            <div class="mode-switch d-none d-md-flex" role="radiogroup" aria-label="ゲームモード">
                <label v-for="m in MODES" :key="m.value" class="mode-opt" :class="`mode-${m.value}`" :title="m.title">
                    <input
                        type="radio" name="gmode" :value="m.value"
                        :checked="gameMode === m.value"
                        @change="emit('update:game-mode', m.value)"
                    >
                    <span>{{ m.label }}</span>
                </label>
            </div>

            <div class="topbar-tools">
                <div class="level-field">
                    <label for="player-level">Lv.</label>
                    <input
                        id="player-level"
                        type="number" class="form-control form-control-sm"
                        min="0" max="79" inputmode="numeric"
                        :value="playerLevel"
                        @input="onLevelInput"
                    >
                </div>

                <div class="seg seg-sm" role="radiogroup" aria-label="データ言語">
                    <label class="seg-opt">
                        <input type="radio" name="alang" value="ja" :checked="apiLang === 'ja'" @change="emit('update:api-lang', 'ja')">
                        <span>JP</span>
                    </label>
                    <label class="seg-opt">
                        <input type="radio" name="alang" value="en" :checked="apiLang === 'en'" @change="emit('update:api-lang', 'en')">
                        <span>EN</span>
                    </label>
                </div>

                <button
                    type="button" class="btn btn-sm btn-update"
                    :disabled="isLoading"
                    :title="lastUpdated ? `最終更新: ${lastUpdated}` : 'データ未取得'"
                    @click="emit('fetch-data')"
                >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span v-else aria-hidden="true">🔄</span>
                    <span class="d-none d-sm-inline">{{ isLoading ? '更新中…' : '更新' }}</span>
                    <span v-if="isLoading" class="visually-hidden">更新中</span>
                </button>

                <details ref="dataMenu" class="data-menu">
                    <summary class="btn btn-sm btn-outline-info" aria-label="データ操作"><span class="d-none d-sm-inline">データ操作</span><span class="d-sm-none" aria-hidden="true">⋯</span></summary>
                    <div class="data-menu-panel">
                        <button type="button" class="menu-item" @click="runData('export-data')">
                            <strong>Export</strong><small>進捗をJSONで保存</small>
                        </button>
                        <button type="button" class="menu-item" @click="runData('trigger-import')">
                            <strong>Import</strong><small>JSONから進捗を復元</small>
                        </button>
                        <p v-if="lastUpdated" class="menu-note">最終更新: {{ lastUpdated }}</p>
                    </div>
                </details>
            </div>
        </div>

        <!-- スマホ: モード切替を上部2段目に -->
        <div class="mode-switch mode-switch-mobile d-md-none" role="radiogroup" aria-label="ゲームモード">
            <label v-for="m in MODES" :key="m.value" class="mode-opt" :class="`mode-${m.value}`" :title="m.title">
                <input
                    type="radio" name="gmode-m" :value="m.value"
                    :checked="gameMode === m.value"
                    @change="emit('update:game-mode', m.value)"
                >
                <span>{{ m.label }}</span>
            </label>
        </div>
        <div class="mode-band" aria-hidden="true"></div>
    </header>
</template>
