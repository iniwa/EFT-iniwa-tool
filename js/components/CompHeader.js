// js/components/CompHeader.js

const CompHeader = {
    // ★Propsに追加
    props: ['lastUpdated', 'isLoading', 'playerLevel', 'gameMode', 'apiLang'],
    emits: ['fetch-data', 'update:playerLevel', 'export-data', 'trigger-import', 'update:gameMode', 'update:apiLang'],
    template: `
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <div>
            <h1 class="m-0">Iniwa's Intel Center</h1>
            <small class="text-muted" style="font-size: 0.6em;">EFT タスク・ハイドアウト管理ツール</small>
        </div>

        <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <div class="btn-group btn-group-sm me-2">
                <button class="btn btn-outline-light" @click="$emit('export-data')">Export</button>
                <button class="btn btn-outline-light" @click="$emit('trigger-import')">Import</button>
            </div>
            
            <div class="text-end small text-secondary d-none d-lg-block me-2">
                <div v-if="lastUpdated">Data: {{ lastUpdated }}</div>
                <div v-else>Data: Backup</div>
            </div>

            <button class="btn btn-outline-info btn-sm me-2" @click="$emit('fetch-data', true)" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                {{ isLoading ? '通信中...' : 'データ更新' }}
            </button>

            <div class="d-flex align-items-center gap-3 border-start ps-3 border-secondary">
                
                <div class="btn-group btn-group-sm" role="group">
                    <input type="radio" class="btn-check" name="gmode" id="gm-pve" 
                        :checked="gameMode === 'pve'" 
                        @change="$emit('update:gameMode', 'pve')">
                    <label class="btn btn-outline-success" for="gm-pve">PvE</label>

                    <input type="radio" class="btn-check" name="gmode" id="gm-pvp" 
                        :checked="gameMode === 'pvp'" 
                        @change="$emit('update:gameMode', 'pvp')">
                    <label class="btn btn-outline-danger" for="gm-pvp">PvP</label>
                </div>

                <div class="btn-group btn-group-sm" role="group">
                    <input type="radio" class="btn-check" name="alang" id="al-ja" 
                        :checked="apiLang === 'ja'" 
                        @change="$emit('update:apiLang', 'ja')">
                    <label class="btn btn-outline-light" for="al-ja">JP</label>

                    <input type="radio" class="btn-check" name="alang" id="al-en" 
                        :checked="apiLang === 'en'" 
                        @change="$emit('update:apiLang', 'en')">
                    <label class="btn btn-outline-light" for="al-en">EN</label>
                </div>

                <div class="d-flex align-items-center gap-1">
                    <label class="fw-bold small">Lv:</label>
                    <input type="number" class="form-control form-control-sm text-center" style="width: 60px;" 
                        :value="playerLevel" 
                        @input="$emit('update:playerLevel', Number($event.target.value))"
                        min="1" max="79">
                </div>
            </div>
        </div>
    </div>
    `
};