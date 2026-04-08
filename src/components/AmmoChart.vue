<script setup>
// 弾薬チャートタブ — 口径フィルター + ソート可能テーブル + 詳細モーダル
import { ref, computed, watch } from 'vue'
import { useApiData } from '../composables/useApiData.js'
import { CALIBER_GROUPS, CALIBER_MAP } from '../data/caliberData.js'
import { loadLS, saveLS } from '../composables/useStorage.js'
import BaseModal from './ui/BaseModal.vue'

const emit = defineEmits(['open-task-from-name'])

const { ammoData } = useApiData()

// ---------------------------------------------------------------------------
// ローカル状態
// ---------------------------------------------------------------------------

const selectedCalibers = ref(loadLS('eft_ammo_filters', []))
const sortKey = ref('penetrationPower')
const sortDesc = ref(true)
const selectedAmmo = ref(null)

// フィルター選択の永続化
watch(selectedCalibers, (val) => saveLS('eft_ammo_filters', val), { deep: true })

// ---------------------------------------------------------------------------
// .308 ME 特殊処理を含む前処理済みデータ
// ---------------------------------------------------------------------------

const processedAmmoData = computed(() => {
  if (!ammoData.value) return []
  return ammoData.value.map((item) => {
    const newItem = { ...item }
    // 名前に '.308 ME' を含む場合、口径を Caliber308ME にオーバーライド
    if (newItem.name && newItem.name.includes('.308 ME')) {
      newItem.caliber = 'Caliber308ME'
    }
    return newItem
  })
})

// ---------------------------------------------------------------------------
// 口径フィルター関連の算出プロパティ
// ---------------------------------------------------------------------------

/** APIデータに存在する全口径ID (フラット) */
const allCalibersFlat = computed(() => {
  if (!processedAmmoData.value) return []
  return Array.from(new Set(processedAmmoData.value.map((a) => a.caliber)))
})

/** CALIBER_GROUPS に定義済みの口径IDセット */
const knownCalibers = computed(() => {
  const ids = new Set()
  CALIBER_GROUPS.forEach((group) => {
    group.sections.forEach((section) => {
      section.ids.forEach((id) => ids.add(id))
    })
  })
  return ids
})

/** データにあるが CALIBER_GROUPS に未定義の口径 */
const unknownCalibers = computed(() => {
  return allCalibersFlat.value
    .filter((cal) => !knownCalibers.value.has(cal))
    .sort()
})

/** 未知の口径を含む拡張グループ */
const extendedCaliberGroups = computed(() => {
  const groups = JSON.parse(JSON.stringify(CALIBER_GROUPS))
  if (unknownCalibers.value.length > 0) {
    groups.push({
      category: 'Unknown / New',
      icon: '?',
      sections: [{ title: 'Uncategorized', ids: unknownCalibers.value }],
    })
  }
  return groups
})

// ---------------------------------------------------------------------------
// フィルタリング + ソート済み弾薬リスト
// ---------------------------------------------------------------------------

const filteredAmmo = computed(() => {
  if (!processedAmmoData.value) return []
  let data = processedAmmoData.value
  if (selectedCalibers.value.length > 0) {
    data = data.filter((a) => selectedCalibers.value.includes(a.caliber))
  }
  return data.sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return sortDesc.value ? 1 : -1
    if (valA > valB) return sortDesc.value ? -1 : 1
    return 0
  })
})

// ---------------------------------------------------------------------------
// ヘルパー関数
// ---------------------------------------------------------------------------

/** 口径チェックボックスのトグル */
function toggleCaliber(cal) {
  const idx = selectedCalibers.value.indexOf(cal)
  if (idx > -1) selectedCalibers.value.splice(idx, 1)
  else selectedCalibers.value.push(cal)
}

/** カラムヘッダークリックでソート切替 */
function sortBy(key) {
  if (sortKey.value === key) {
    sortDesc.value = !sortDesc.value
  } else {
    sortKey.value = key
    sortDesc.value = true
  }
}

/** アクティブなソートカラムのCSSクラス */
function getSortClass(key) {
  return sortKey.value === key ? 'text-warning' : 'text-white'
}

/** 貫通力に応じた色分け */
function getBgColor(pen) {
  if (pen >= 60) return '#dc3545'
  if (pen >= 50) return '#fd7e14'
  if (pen >= 40) return '#ffc107'
  if (pen >= 30) return '#198754'
  return '#6c757d'
}

/** 口径IDから表示名と武器例を取得 */
function getCaliberInfo(calId) {
  if (!calId) return { name: 'Unknown', examples: '' }
  return (
    CALIBER_MAP[calId] || {
      name: calId.replace('Caliber', ''),
      examples: 'Unknown Weapon',
    }
  )
}

/** データに該当口径の弾薬が存在するか */
function hasData(calId) {
  return allCalibersFlat.value.includes(calId)
}

/** 符号付きパーセント表示 */
function formatSigned(val) {
  if (!val) return '0'
  const num = Math.round(val * 100)
  return num > 0 ? `+${num}` : `${num}`
}

/** トレーダー販売データがあるか */
function hasTrader(ammo) {
  return ammo.soldBy && ammo.soldBy.length > 0
}

/** クラフトデータがあるか */
function hasCraft(ammo) {
  return ammo.crafts && ammo.crafts.length > 0
}

function openDetail(ammo) {
  selectedAmmo.value = ammo
}

function closeDetail() {
  selectedAmmo.value = null
}
</script>

<template>
  <div class="row">
    <!-- 左サイドバー: 口径フィルター -->
    <div class="col-md-3 mb-3">
      <div class="card h-100 border-secondary">
        <div
          class="card-header bg-dark text-white border-secondary d-flex justify-content-between align-items-center"
        >
          <span>口径フィルター</span>
          <button
            class="btn btn-sm btn-outline-light"
            @click="selectedCalibers = []"
          >
            クリア
          </button>
        </div>
        <div
          class="card-body bg-dark text-white overflow-auto p-2"
          style="max-height: 80vh"
        >
          <div
            v-for="(group, gIdx) in extendedCaliberGroups"
            :key="gIdx"
            class="mb-3"
          >
            <div
              class="text-warning border-bottom border-secondary mb-2 pb-1 small fw-bold"
            >
              {{ group.icon }} {{ group.category }}
            </div>
            <div
              v-for="(section, sIdx) in group.sections"
              :key="sIdx"
              class="mb-2 ms-1"
            >
              <div class="text-muted small mb-1" style="font-size: 0.75rem">
                {{ section.title }}
              </div>
              <div v-for="cal in section.ids" :key="cal">
                <div v-if="hasData(cal)" class="form-check mb-1 ms-2">
                  <input
                    class="form-check-input mt-1"
                    type="checkbox"
                    :value="cal"
                    :id="'cal-' + cal"
                    :checked="selectedCalibers.includes(cal)"
                    @change="toggleCaliber(cal)"
                  />
                  <label
                    class="form-check-label w-100"
                    :for="'cal-' + cal"
                    style="cursor: pointer; line-height: 1.2"
                  >
                    <div class="small fw-bold">{{ getCaliberInfo(cal).name }}</div>
                    <div class="text-secondary" style="font-size: 0.7em">
                      {{ getCaliberInfo(cal).examples }}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右メイン: 弾薬テーブル -->
    <div class="col-md-9 mb-3">
      <div class="card h-100 border-secondary">
        <div
          class="card-header bg-dark text-white border-secondary d-flex justify-content-between align-items-center"
        >
          <span>弾薬データ一覧 ({{ filteredAmmo.length }} 件)</span>
        </div>
        <div
          class="card-body bg-dark p-0 table-responsive"
          style="max-height: 80vh"
        >
          <table
            class="table table-dark table-hover table-striped mb-0 small"
            style="white-space: nowrap"
          >
            <thead class="sticky-top bg-dark" style="z-index: 10">
              <tr>
                <th
                  @click="sortBy('name')"
                  style="cursor: pointer"
                  :class="getSortClass('name')"
                >
                  名前
                </th>
                <th
                  @click="sortBy('caliber')"
                  style="cursor: pointer"
                  :class="getSortClass('caliber')"
                >
                  口径
                </th>
                <th
                  @click="sortBy('damage')"
                  style="cursor: pointer"
                  class="text-end"
                  :class="getSortClass('damage')"
                >
                  ダメージ
                </th>
                <th
                  @click="sortBy('penetrationPower')"
                  style="cursor: pointer"
                  class="text-end"
                  :class="getSortClass('penetrationPower')"
                >
                  貫通力
                </th>
                <th
                  @click="sortBy('armorDamage')"
                  style="cursor: pointer"
                  class="text-end"
                  :class="getSortClass('armorDamage')"
                >
                  アーマーDmg
                </th>
                <th
                  @click="sortBy('projectileSpeed')"
                  style="cursor: pointer"
                  class="text-end"
                  :class="getSortClass('projectileSpeed')"
                >
                  初速
                </th>
                <th class="text-center text-white">販売</th>
                <th class="text-center text-white">製造</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ammo in filteredAmmo" :key="ammo.id">
                <td>
                  <div
                    @click="openDetail(ammo)"
                    class="text-info fw-bold d-flex align-items-center gap-2"
                    style="cursor: pointer"
                  >
                    <img
                      :src="ammo.image512pxLink"
                      alt=""
                      style="width: 24px; height: 24px; object-fit: contain"
                    />
                    {{ ammo.shortName || ammo.name }}
                  </div>
                </td>
                <td class="text-muted small">
                  {{ getCaliberInfo(ammo.caliber).name }}
                </td>
                <td class="text-end fw-bold">{{ ammo.damage }}</td>
                <td class="text-end fw-bold position-relative">
                  <span
                    class="badge"
                    :style="{ backgroundColor: getBgColor(ammo.penetrationPower) }"
                  >
                    {{ ammo.penetrationPower }}
                  </span>
                </td>
                <td class="text-end">{{ ammo.armorDamage }}%</td>
                <td class="text-end">{{ ammo.projectileSpeed }} m/s</td>
                <td class="text-center">
                  <span v-if="hasTrader(ammo)" title="トレーダー販売あり">cart</span>
                  <span v-else class="text-muted text-opacity-25">-</span>
                </td>
                <td class="text-center">
                  <span v-if="hasCraft(ammo)" title="ワークベンチ作成可能">wrench</span>
                  <span v-else class="text-muted text-opacity-25">-</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="filteredAmmo.length === 0"
            class="text-center text-secondary py-5"
          >
            データがありません。左のフィルターを選択してください。
          </div>
        </div>
      </div>
    </div>

    <!-- 詳細モーダル -->
    <BaseModal
      :show="selectedAmmo !== null"
      max-width="700px"
      @close="closeDetail"
    >
      <template v-if="selectedAmmo">
        <div class="bg-dark text-white border border-secondary rounded shadow-lg">
          <!-- モーダルヘッダー -->
          <div
            class="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary"
          >
            <h5 class="mb-0 d-flex align-items-center gap-2">
              <img
                :src="selectedAmmo.image512pxLink"
                width="32"
                height="32"
              />
              {{ selectedAmmo.name }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeDetail"
            ></button>
          </div>

          <!-- モーダルボディ -->
          <div class="p-3">
            <!-- 基本性能 -->
            <h6
              class="text-warning border-bottom border-secondary pb-1 mb-2"
            >
              基本性能 (Basic Stats)
            </h6>
            <div class="row g-2 mb-3 text-center">
              <div class="col-3">
                <div class="p-2 border border-secondary rounded bg-black">
                  <div>ダメージ</div>
                  <div class="fs-4 fw-bold">{{ selectedAmmo.damage }}</div>
                </div>
              </div>
              <div class="col-3">
                <div class="p-2 border border-secondary rounded bg-black">
                  <div>貫通力</div>
                  <div class="fs-4 fw-bold">
                    {{ selectedAmmo.penetrationPower }}
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="p-2 border border-secondary rounded bg-black">
                  <div>アーマーDmg</div>
                  <div class="fs-4">{{ selectedAmmo.armorDamage }}%</div>
                </div>
              </div>
              <div class="col-3">
                <div class="p-2 border border-secondary rounded bg-black">
                  <div>初速</div>
                  <div class="fs-4">{{ selectedAmmo.projectileSpeed }} m/s</div>
                </div>
              </div>
            </div>

            <!-- 補正値 -->
            <h6 class="text-info border-bottom border-secondary pb-1 mb-2">
              武器・状態異常補正 (Modifiers)
            </h6>
            <div class="row g-2 mb-3 small">
              <div
                class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1"
              >
                <span>精度補正:</span>
                <span
                  :class="
                    selectedAmmo.accuracyModifier > 0
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  {{ formatSigned(selectedAmmo.accuracyModifier) }}%
                </span>
              </div>
              <div
                class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1"
              >
                <span>反動補正:</span>
                <span
                  :class="
                    selectedAmmo.recoilModifier < 0
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  {{ formatSigned(selectedAmmo.recoilModifier) }}%
                </span>
              </div>
              <div
                class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1"
              >
                <span>跳弾確率:</span>
                <span>
                  {{ ((selectedAmmo.ricochetChance || 0) * 100).toFixed(1) }}%
                </span>
              </div>
              <div
                class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1"
              >
                <span>軽出血率:</span>
                <span
                  :class="
                    selectedAmmo.lightBleedModifier > 0 ? 'text-success' : ''
                  "
                >
                  {{ formatSigned(selectedAmmo.lightBleedModifier) }}%
                </span>
              </div>
              <div
                class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1"
              >
                <span>重出血率:</span>
                <span
                  :class="
                    selectedAmmo.heavyBleedModifier > 0 ? 'text-success' : ''
                  "
                >
                  {{ formatSigned(selectedAmmo.heavyBleedModifier) }}%
                </span>
              </div>
              <div
                class="col-6 col-md-4 d-flex justify-content-between border-bottom border-secondary py-1"
              >
                <span>破砕確率:</span>
                <span>
                  {{ ((selectedAmmo.fragmentationChance || 0) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>

            <!-- トレーダー販売 -->
            <h6
              class="text-success border-bottom border-secondary pb-1 mb-2"
            >
              入手方法 (Traders)
            </h6>
            <div v-if="selectedAmmo.soldBy && selectedAmmo.soldBy.length > 0">
              <ul class="list-group list-group-flush small">
                <li
                  v-for="(deal, idx) in selectedAmmo.soldBy"
                  :key="idx"
                  class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span>
                      {{ deal.vendor.name }} (Lv.{{ deal.minTraderLevel }})
                    </span>
                    <div
                      v-if="deal.taskUnlockName"
                      class="small text-warning"
                    >
                      要:
                      <span
                        class="text-decoration-underline"
                        style="cursor: pointer"
                        @click="emit('open-task-from-name', deal.taskUnlockName)"
                      >
                        {{ deal.taskUnlockName }}
                      </span>
                    </div>
                  </div>
                  <span class="fw-bold text-warning">
                    {{ deal.priceRUB.toLocaleString() }} RUB
                  </span>
                </li>
              </ul>
            </div>
            <div v-else class="text-muted small mb-3">
              トレーダー販売なし (またはデータなし)
            </div>

            <!-- クラフトレシピ -->
            <div v-if="hasCraft(selectedAmmo)">
              <h6
                class="text-primary border-bottom border-secondary pb-1 mb-2 mt-3"
              >
                製造レシピ (Crafts)
              </h6>
              <div
                v-for="(craft, cIdx) in selectedAmmo.crafts"
                :key="cIdx"
                class="bg-black border border-secondary rounded p-2 mb-2"
              >
                <div
                  class="d-flex justify-content-between mb-1 align-items-center"
                >
                  <div>
                    <span class="fw-bold text-primary">
                      {{ craft.station.name }} (Lv.{{ craft.level }})
                    </span>
                    <div
                      v-if="craft.taskUnlock"
                      class="small text-warning"
                    >
                      要:
                      <span
                        class="text-decoration-underline"
                        style="cursor: pointer"
                        @click="emit('open-task-from-name', craft.taskUnlock.name)"
                      >
                        {{ craft.taskUnlock.name }}
                      </span>
                    </div>
                  </div>
                  <div class="text-end">
                    <span
                      v-if="
                        craft.rewardItems && craft.rewardItems.length > 0
                      "
                      class="badge bg-success border border-light me-2"
                    >
                      x{{ craft.rewardItems[0].count }}
                    </span>
                    <span class="text-white small">{{ craft.duration }} s</span>
                  </div>
                </div>
                <div class="small text-muted mb-1">素材:</div>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="(req, rIdx) in craft.requiredItems"
                    :key="rIdx"
                    class="badge bg-secondary border border-dark text-white"
                  >
                    {{
                      req.item
                        ? req.item.name
                        : req.attributes?.[0]?.name || 'Item'
                    }}
                    x{{ req.count }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 説明文 -->
            <div
              v-if="selectedAmmo.description"
              class="mt-3 p-2 bg-black border border-secondary rounded small text-muted"
            >
              {{ selectedAmmo.description }}
            </div>

            <!-- Wiki リンク -->
            <div class="d-grid gap-2 mt-3">
              <a
                :href="selectedAmmo.wikiLink"
                target="_blank"
                class="btn btn-outline-info btn-sm"
              >
                Wikiで詳細を見る
              </a>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
/* テーブル行のカーソル */
.table tbody tr {
  transition: background-color 0.15s;
}
</style>
