const CompHeader = {
    props: ['lastUpdated', 'isLoading', 'playerLevel'],
    emits: ['fetch-data', 'update:playerLevel', 'export-data', 'trigger-import'],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <div>
            <h1 class="m-0">Iniwa's Intel Center</h1>
            <small class="text-muted" style="font-size: 0.6em;">EFT タスク・ハイドアウト管理ツール</small>
        </div>
        <div class="d-flex align-items-center gap-2">
            <div class="btn-group btn-group-sm me-2">
                <button class="btn btn-outline-light" @click="$emit('export-data')">Export</button>
                <button class="btn btn-outline-light" @click="$emit('trigger-import')">Import</button>
            </div>
            <div class="text-end small text-secondary d-none d-md-block me-2">
                <div v-if="lastUpdated">Data: {{ lastUpdated }}</div>
                <div v-else>Data: Backup</div>
            </div>
            <button class="btn btn-outline-info btn-sm" @click="$emit('fetch-data')" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                {{ isLoading ? '通信中...' : 'データ更新' }}
            </button>
            <div class="d-flex align-items-center gap-2 border-start ps-3 border-secondary">
                <label class="fw-bold">Level:</label>
                <input type="number" class="form-control form-control-sm text-center" style="width: 70px;" 
                    :value="playerLevel" 
                    @input="let v = parseInt($event.target.value); if(isNaN(v)) v = 0; $emit('update:playerLevel', v)" 
                    min="0" max="79">
            </div>
        </div>
    </div>
    `
};