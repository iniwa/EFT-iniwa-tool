<script setup>
const props = defineProps({
    lastUpdated: { type: String, default: null },
    isLoading: { type: Boolean, default: false },
    playerLevel: { type: Number, default: 0 },
    gameMode: { type: String, default: 'pve' },
    apiLang: { type: String, default: 'ja' },
    appVersion: { type: String, default: '' },
})

const emit = defineEmits([
    'fetch-data',
    'update:player-level',
    'export-data',
    'trigger-import',
    'update:game-mode',
    'update:api-lang',
])

function onLevelInput(e) {
    const val = parseInt(e.target.value, 10)
    emit('update:player-level', isNaN(val) ? 0 : val)
}
</script>

<template>
    <div class="mb-3">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <h4 class="mb-0 me-auto" style="color: var(--color-accent);">
                Iniwa's Intel Center
                <small class="text-muted" style="font-size: 0.5em;">v{{ appVersion }}</small>
            </h4>

            <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-info" @click="emit('export-data')">Export</button>
                <button class="btn btn-outline-info" @click="emit('trigger-import')">Import</button>
            </div>

            <span v-if="lastUpdated" class="text-muted d-none d-lg-inline" style="font-size: 0.8em;">
                最終更新: {{ lastUpdated }}
            </span>

            <button class="btn btn-sm btn-outline-warning" :disabled="isLoading" @click="emit('fetch-data')">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                {{ isLoading ? '更新中...' : '🔄 データ更新' }}
            </button>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-3" style="font-size: 0.85em;">
            <div class="d-flex align-items-center gap-1">
                <label class="form-check-label">
                    <input
                        type="radio" name="gmode" value="pve" class="form-check-input me-1"
                        :checked="gameMode === 'pve'"
                        @change="emit('update:game-mode', 'pve')"
                    > PvE
                </label>
                <label class="form-check-label ms-2">
                    <input
                        type="radio" name="gmode" value="regular" class="form-check-input me-1"
                        :checked="gameMode === 'regular'"
                        @change="emit('update:game-mode', 'regular')"
                    > PvP
                </label>
            </div>

            <div class="d-flex align-items-center gap-1">
                <label class="form-check-label">
                    <input
                        type="radio" name="alang" value="ja" class="form-check-input me-1"
                        :checked="apiLang === 'ja'"
                        @change="emit('update:api-lang', 'ja')"
                    > JP
                </label>
                <label class="form-check-label ms-2">
                    <input
                        type="radio" name="alang" value="en" class="form-check-input me-1"
                        :checked="apiLang === 'en'"
                        @change="emit('update:api-lang', 'en')"
                    > EN
                </label>
            </div>

            <div class="d-flex align-items-center gap-1">
                <label style="color: var(--color-text-secondary);">Lv.</label>
                <input
                    type="number" class="form-control form-control-sm"
                    style="width: 70px;"
                    min="0" max="79"
                    :value="playerLevel"
                    @input="onLevelInput"
                >
            </div>
        </div>
    </div>
</template>
