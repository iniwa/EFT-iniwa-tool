<script setup>
// 鍵管理タブ — マップごとにグループ化した鍵一覧の管理
import { ref, computed, watch, onMounted } from 'vue'
import { useUserProgress } from '../composables/useUserProgress.js'
import { useShoppingList } from '../composables/useShoppingList.js'
import { useApiData } from '../composables/useApiData.js'
import { MAP_ORDER } from '../data/constants.js'
import { loadLS, saveLS } from '../composables/useStorage.js'

const emit = defineEmits(['open-task-from-name'])

const {
  ownedKeys,
  keyUserData,
  keysViewMode,
  keysSortMode,
  toggleOwnedKey,
  updateKeyUserData,
} = useUserProgress()

const { shoppingList } = useShoppingList()
const { itemsData } = useApiData()

// ---------------------------------------------------------------------------
// ローカル状態
// ---------------------------------------------------------------------------

const searchQuery = ref('')
const collapsedMaps = ref({})
const ratings = ['-', 'SS', 'S', 'A', 'B', 'C', 'D', 'F']

// ---------------------------------------------------------------------------
// 折りたたみ状態の永続化
// ---------------------------------------------------------------------------

const COLLAPSED_LS_KEY = 'eft_keys_collapsed_state'

onMounted(() => {
  const saved = loadLS(COLLAPSED_LS_KEY, null)
  if (saved) {
    collapsedMaps.value = saved
    // 新しいマップ名が追加された場合にデフォルト値を補完
    MAP_ORDER.forEach((m) => {
      if (collapsedMaps.value[m] === undefined) {
        collapsedMaps.value[m] = true
      }
    })
    if (collapsedMaps.value['Unknown / Other'] === undefined) {
      collapsedMaps.value['Unknown / Other'] = true
    }
  } else {
    collapseAll()
  }
})

watch(collapsedMaps, (val) => saveLS(COLLAPSED_LS_KEY, val), { deep: true })

// ---------------------------------------------------------------------------
// アイテム画像の参照用マップ
// ---------------------------------------------------------------------------

const itemImageMap = computed(() => {
  const map = {}
  const items = itemsData.value?.items || []
  items.forEach((item) => {
    map[item.id] = {
      image512pxLink: item.image512pxLink,
      normalizedName: item.normalizedName,
    }
  })
  return map
})

// ---------------------------------------------------------------------------
// フィルタリング済み鍵リスト
// ---------------------------------------------------------------------------

const filteredKeys = computed(() => {
  let keys = shoppingList.value.keys || []

  // 所持モードフィルタ (composable側でも処理されるがsearchQueryは未適用)
  if (keysViewMode.value === 'owned') {
    keys = keys.filter((k) => ownedKeys.value.includes(k.id))
  }

  // テキスト検索
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    keys = keys.filter((k) => {
      return (
        (k.name && k.name.toLowerCase().includes(q)) ||
        (k.shortName && k.shortName.toLowerCase().includes(q))
      )
    })
  }

  return keys
})

// ---------------------------------------------------------------------------
// マップごとにグループ化
// ---------------------------------------------------------------------------

const groupedKeys = computed(() => {
  const groups = {}
  filteredKeys.value.forEach((k) => {
    const map = k.mapName || 'Unknown / Other'
    if (!groups[map]) groups[map] = []
    groups[map].push(k)
  })

  // MAP_ORDER に従ってソート、未知のマップは末尾
  const sortedMapNames = Object.keys(groups).sort((a, b) => {
    if (a === 'Unknown / Other') return 1
    if (b === 'Unknown / Other') return -1
    const idxA = MAP_ORDER.indexOf(a)
    const idxB = MAP_ORDER.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })

  // グループ内ソート
  const rateValues = { SS: 12, S: 10, A: 8, B: 6, C: 4, D: 2, F: 0, '-': -1 }
  const result = {}
  sortedMapNames.forEach((mapName) => {
    const items = groups[mapName]
    items.sort((a, b) => {
      if (keysSortMode.value === 'owned_first') {
        const isOwnedA = ownedKeys.value.includes(a.id)
        const isOwnedB = ownedKeys.value.includes(b.id)
        if (isOwnedA !== isOwnedB) return isOwnedA ? -1 : 1
      } else if (keysSortMode.value === 'rating') {
        const getScore = (id) => {
          const r = keyUserData.value[id]?.rating || '-'
          return rateValues[r] !== undefined ? rateValues[r] : -1
        }
        const scoreA = getScore(a.id)
        const scoreB = getScore(b.id)
        if (scoreA !== scoreB) return scoreB - scoreA
      }
      return a.name.localeCompare(b.name)
    })
    result[mapName] = items
  })

  return result
})

// ---------------------------------------------------------------------------
// ヘルパー
// ---------------------------------------------------------------------------

function toggleMap(mapName) {
  collapsedMaps.value[mapName] = !collapsedMaps.value[mapName]
}

function collapseAll() {
  const newState = {}
  Object.keys(groupedKeys.value).forEach((m) => {
    newState[m] = true
  })
  newState['Unknown / Other'] = true
  collapsedMaps.value = newState
}

function expandAll() {
  const newState = { ...collapsedMaps.value }
  Object.keys(newState).forEach((k) => {
    newState[k] = false
  })
  collapsedMaps.value = newState
}

function getRating(id) {
  return keyUserData.value[id]?.rating || '-'
}

function getMemo(id) {
  return keyUserData.value[id]?.memo || ''
}

function onRatingChange(id, event) {
  updateKeyUserData(id, 'rating', event.target.value)
}

function onMemoChange(id, event) {
  updateKeyUserData(id, 'memo', event.target.value)
}

/** ソース名から "Task: " プレフィックスを除去 */
function formatSourceName(name) {
  if (!name) return ''
  return name.replace(/^Task:\s*/, '')
}

/** 鍵の画像URLを取得 */
function getKeyImage(id) {
  return itemImageMap.value[id]?.image512pxLink || null
}

/** 鍵のnormalizedNameを取得 */
function getKeyNormalizedName(id) {
  return itemImageMap.value[id]?.normalizedName || null
}
</script>

<template>
  <div class="card border-info">
    <!-- ヘッダー: 検索 + 表示モード + ソート + 折りたたみボタン -->
    <div class="card-header bg-dark text-info border-bottom border-info">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div class="d-flex align-items-center flex-wrap gap-2">
          <div class="fw-bold fs-5">鍵管理</div>
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-outline-secondary text-light text-nowrap"
              @click="collapseAll"
              title="全てのマップを閉じる"
            >
              全て収納
            </button>
            <button
              class="btn btn-outline-secondary text-light text-nowrap"
              @click="expandAll"
              title="全てのマップを開く"
            >
              全て展開
            </button>
          </div>
        </div>
        <input
          type="text"
          class="form-control form-control-sm key-search"
          placeholder="鍵名で検索..."
          v-model="searchQuery"
        />
      </div>

      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <!-- 表示モード切替 -->
        <div class="d-flex align-items-center gap-2">
          <span class="small text-secondary">表示:</span>
          <div class="btn-group btn-group-sm">
            <button
              class="btn"
              :class="keysViewMode === 'all' ? 'btn-info' : 'btn-outline-secondary'"
              @click="keysViewMode = 'all'"
            >
              全ての鍵
            </button>
            <button
              class="btn"
              :class="keysViewMode === 'owned' ? 'btn-info' : 'btn-outline-secondary'"
              @click="keysViewMode = 'owned'"
            >
              所持のみ
            </button>
          </div>
        </div>

        <!-- ソートモード -->
        <div class="d-flex align-items-center gap-2">
          <span class="small text-secondary">並び順:</span>
          <select
            class="form-select form-select-sm bg-dark text-white border-secondary"
            style="width: auto"
            v-model="keysSortMode"
          >
            <option value="map">マップ順 (Default)</option>
            <option value="owned_first">所持済みを先頭に</option>
            <option value="rating">Rate順 (SS -> F)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 鍵テーブル本体 -->
    <div class="card-body p-0 overflow-auto" style="max-height: 80vh">
      <div
        v-for="(keys, mapName) in groupedKeys"
        :key="mapName"
        class="map-group"
      >
        <!-- マップヘッダー -->
        <div
          class="map-header px-3 py-2 d-flex justify-content-between align-items-center"
          @click="toggleMap(mapName)"
          style="background-color: #2c3e50; cursor: pointer; border-bottom: 1px solid #444"
        >
          <span class="fw-bold text-white">{{ mapName }} ({{ keys.length }})</span>
          <span class="small text-muted">
            {{ collapsedMaps[mapName] ? '▼ 表示' : '▲ 非表示' }}
          </span>
        </div>

        <!-- 鍵テーブル (折りたたみ可能) -->
        <div v-show="!collapsedMaps[mapName]">
          <table
            class="table table-dark table-hover mb-0 table-sm"
            style="table-layout: fixed"
          >
            <thead>
              <tr>
                <th style="width: 50px" class="text-center">所持</th>
                <th style="width: 70px" class="text-center">Rate</th>
                <th style="width: 100px">ShortName</th>
                <th>Name / Memo</th>
                <th style="width: 180px">使用Task</th>
                <th style="width: 50px" class="text-center">Wiki</th>
                <th style="width: 50px" class="text-center">Dev</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in keys"
                :key="item.id"
                :class="{ 'key-owned': ownedKeys.includes(item.id) }"
              >
                <!-- 所持チェックボックス -->
                <td class="text-center align-middle">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    style="cursor: pointer"
                    :checked="ownedKeys.includes(item.id)"
                    @change="toggleOwnedKey(item.id)"
                  />
                </td>

                <!-- レーティング選択 -->
                <td class="align-middle text-center">
                  <select
                    class="form-select form-select-sm p-0 text-center"
                    style="height: 24px; background-color: #222; color: gold; border: 1px solid #555"
                    :value="getRating(item.id)"
                    @change="onRatingChange(item.id, $event)"
                    @click.stop
                  >
                    <option v-for="r in ratings" :key="r" :value="r">{{ r }}</option>
                  </select>
                </td>

                <!-- ショートネーム -->
                <td
                  class="align-middle text-info small text-truncate"
                  :title="item.shortName"
                >
                  {{ item.shortName || '-' }}
                </td>

                <!-- 名前 + メモ入力 -->
                <td class="align-middle">
                  <div class="d-flex align-items-center gap-2">
                    <div
                      class="bg-black rounded d-flex align-items-center justify-content-center flex-shrink-0"
                      style="width: 32px; height: 32px; border: 1px solid #444"
                    >
                      <img
                        v-if="getKeyImage(item.id)"
                        :src="getKeyImage(item.id)"
                        alt=""
                        style="max-width: 100%; max-height: 100%; object-fit: contain"
                      />
                    </div>

                    <div style="min-width: 0; flex-grow: 1">
                      <div
                        :class="{ 'item-collected': ownedKeys.includes(item.id) }"
                        class="fw-bold small text-truncate"
                        :title="item.name"
                      >
                        {{ item.name }}
                      </div>
                      <input
                        type="text"
                        class="form-control form-control-sm mt-1 py-0"
                        style="
                          background: transparent;
                          border: none;
                          border-bottom: 1px solid #444;
                          color: #aaa;
                          font-size: 0.8em;
                        "
                        placeholder="メモ..."
                        :value="getMemo(item.id)"
                        @input="onMemoChange(item.id, $event)"
                      />
                    </div>
                  </div>
                </td>

                <!-- 使用タスク -->
                <td class="align-middle small">
                  <div v-if="item.sources && item.sources.length > 0">
                    <div
                      v-for="(source, idx) in item.sources"
                      :key="idx"
                      class="text-truncate"
                    >
                      <span
                        v-if="source.type === 'task'"
                        class="text-info"
                        style="cursor: pointer; text-decoration: underline"
                        @click="emit('open-task-from-name', formatSourceName(source.name))"
                      >
                        {{ formatSourceName(source.name) }}
                      </span>
                      <span v-else>{{ source.name }}</span>
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
                </td>

                <!-- Wiki リンク -->
                <td class="align-middle text-center">
                  <a
                    v-if="item.wikiLink"
                    :href="item.wikiLink"
                    target="_blank"
                    class="btn btn-sm btn-outline-warning py-0 px-1"
                    title="Wiki"
                    @click.stop
                  >
                    W
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>

                <!-- tarkov.dev リンク -->
                <td class="align-middle text-center">
                  <a
                    v-if="item.normalizedName || getKeyNormalizedName(item.id)"
                    :href="'https://tarkov.dev/item/' + (item.normalizedName || getKeyNormalizedName(item.id))"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary py-0 px-1"
                    title="Tarkov.dev"
                    @click.stop
                  >
                    D
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 鍵が見つからない場合 -->
      <div
        v-if="Object.keys(groupedKeys).length === 0"
        class="text-center py-4 text-muted"
      >
        鍵が見つかりません。
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 所持済み鍵の行ハイライト */
.key-owned {
  background-color: rgba(25, 135, 84, 0.15);
}

/* マップヘッダーのホバー効果 */
.map-header:hover {
  background-color: #34495e;
}

/* 検索欄: デスクトップは固定幅、モバイルは1行使い切る */
.key-search {
  width: 200px;
}
@media (max-width: 575.98px) {
  .key-search {
    width: 100%;
  }
}
</style>
