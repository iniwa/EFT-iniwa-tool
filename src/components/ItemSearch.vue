<script setup>
// アイテム検索/データベースタブ — ページネーション付き検索テーブル + 詳細展開
import { ref, computed, reactive, watch } from 'vue'
import { useApiData } from '../composables/useApiData.js'
import { useAppState } from '../composables/useAppState.js'
import { useUserProgress } from '../composables/useUserProgress.js'
import * as ItemLogic from '../logic/itemLogic.js'

const emit = defineEmits(['open-task-from-name'])

const {
  itemDb,
  itemDbLoading,
  itemDbLastUpdated,
  updatingItemIds,
  hideoutData,
  taskData,
  fetchItemDatabase,
  updateSingleItemPrice,
} = useApiData()

const { gameMode, apiLang } = useAppState()

const {
  completedTasks,
  wishlist,
  toggleWishlist,
} = useUserProgress()

// ---------------------------------------------------------------------------
// ローカル状態
// ---------------------------------------------------------------------------

const searchQuery = ref('')
const showWishlistOnly = ref(false)
const currentPage = ref(1)
const itemsPerPage = 50
const expandedItems = reactive({})
const selectedBarter = ref(null)
const selectedCraft = ref(null)

// 検索条件が変わったらページを1に戻す
watch(searchQuery, () => { currentPage.value = 1 })
watch(showWishlistOnly, () => { currentPage.value = 1 })

// ---------------------------------------------------------------------------
// ヘルパー関数
// ---------------------------------------------------------------------------

/** 価格フォーマット (通貨記号付き) */
function formatPrice(num, currency) {
  if (num === null || num === undefined) return '-'
  const str = num.toLocaleString()
  if (currency === 'USD') return `$${str}`
  if (currency === 'EUR') return `\u20AC${str}`
  return `\u20BD${str}`
}

/** 秒数を「Xh Ym」形式に変換 */
function formatDuration(sec) {
  if (!sec) return ''
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return `${h}h ${m}m`
}

/** 詳細行の展開/折りたたみ (reactive 対応) */
function toggleDetails(id) {
  expandedItems[id] = !expandedItems[id]
}

/** タスク完了判定 (completedTasksはIDベース、usedInTasksはname参照) */
function isTaskDone(taskName) {
  if (!taskData.value) return false
  const task = taskData.value.find(t => t.name === taskName)
  return task ? completedTasks.value.includes(task.id) : false
}

/** トレーダーへの最高売却価格 */
function getBestSell(item) {
  return ItemLogic.getBestSellPrice(item)
}

/**
 * 購入元情報の統合 (現金購入 + バーター + クラフト)
 * Flea Market とバーター型の buyFor は除外
 */
function getBuySources(item) {
  const sources = []
  if (item.buyFor) {
    item.buyFor.forEach((offer) => {
      if (offer.vendor.name === 'Flea Market' || offer.vendor.name === 'フリーマーケット') return
      const isBarter = offer.requirements?.some((r) => r.type === 'item')
      if (isBarter) return
      const llReq = offer.requirements?.find((r) => r.type === 'loyaltyLevel')
      const level = llReq ? `LL${llReq.value}` : ''
      sources.push({
        type: 'cash',
        vendor: offer.vendor.name,
        level,
        price: offer.price,
        currency: offer.currency,
      })
    })
  }
  if (item.bartersFor) {
    item.bartersFor.forEach((barter) => {
      sources.push({
        type: 'barter',
        vendor: barter.trader.name,
        level: `LL${barter.level}`,
        requiredItems: barter.requiredItems,
        raw: barter,
      })
    })
  }
  return sources
}

/** ハイドアウト使用箇所の検索 */
function getHideoutUsage(item) {
  if (!hideoutData.value) return []
  const usages = []
  hideoutData.value.forEach((station) => {
    if (station.levels) {
      station.levels.forEach((lvl) => {
        if (lvl.itemRequirements) {
          const req = lvl.itemRequirements.find((r) => r.item.id === item.id)
          if (req) {
            usages.push({
              stationName: station.name,
              level: lvl.level,
              count: req.count,
            })
          }
        }
      })
    }
  })
  return usages
}

/** クラフト成果物の個数を取得 */
function getCraftCount(craft, itemId) {
  if (!craft.rewardItems) return null
  const selfReward = craft.rewardItems.find((r) => r.item.id === itemId)
  return selfReward ? selfReward.count : null
}

function isUpdating(id) {
  return updatingItemIds.value && updatingItemIds.value.includes(id)
}

// ポップアップ操作
function openBarterPopup(barter) {
  selectedBarter.value = barter
}
function closeBarterPopup() {
  selectedBarter.value = null
}
function openCraftPopup(craft) {
  selectedCraft.value = craft
}
function closeCraftPopup() {
  selectedCraft.value = null
}

// ---------------------------------------------------------------------------
// フィルタリング + ページネーション
// ---------------------------------------------------------------------------

const filteredItems = computed(() => {
  return ItemLogic.filterItems(
    itemDb.value,
    searchQuery.value,
    showWishlistOnly.value,
    wishlist.value,
  )
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredItems.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div class="card h-100 border-secondary" style="position: relative">
    <!-- ヘッダー -->
    <div
      class="card-header bg-dark text-white d-flex justify-content-between align-items-center flex-wrap gap-2"
    >
      <div class="d-flex align-items-center gap-2">
        <span class="fs-5">アイテム検索</span>
        <span
          v-if="itemDbLastUpdated"
          class="badge bg-secondary ms-2 small"
        >
          Updated: {{ itemDbLastUpdated }}
        </span>
      </div>

      <!-- DB読み込み済みの場合: 操作ボタン群 -->
      <div v-if="itemDb.length > 0" class="d-flex gap-2 align-items-center">
        <button
          class="btn btn-sm btn-outline-info"
          @click="fetchItemDatabase(gameMode, apiLang, true)"
          :disabled="itemDbLoading"
          title="全データを再取得"
        >
          <span v-if="itemDbLoading" class="spinner-border spinner-border-sm"></span>
          <span v-else>Update All</span>
        </button>

        <input
          type="text"
          class="form-control form-control-sm bg-dark text-white border-secondary"
          v-model="searchQuery"
          placeholder="名前検索 (JP/EN)..."
          style="width: 200px"
        />

        <button
          class="btn btn-sm"
          :class="showWishlistOnly ? 'btn-warning' : 'btn-outline-secondary'"
          @click="showWishlistOnly = !showWishlistOnly"
        >
          Wishlist
        </button>
      </div>
    </div>

    <!-- ボディ -->
    <div
      class="card-body bg-dark text-white overflow-auto p-0"
      style="position: relative; min-height: 400px"
    >
      <!-- DB未ロード: 読み込みボタン -->
      <div
        v-if="itemDb.length === 0"
        class="d-flex flex-column justify-content-center align-items-center h-100 text-secondary p-5"
      >
        <div class="mb-3 text-center">
          <h4>データベースがロードされていません</h4>
          <p>
            API通信量を節約するため、アイテム検索用データは別途取得します。<br />
            (約 4,000アイテムの情報を取得するため、数秒かかります)
          </p>
        </div>
        <button
          class="btn btn-primary btn-lg"
          @click="fetchItemDatabase(gameMode, apiLang, false)"
          :disabled="itemDbLoading"
        >
          <span v-if="itemDbLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ itemDbLoading ? 'データを構築中...' : 'アイテムデータを取得開始' }}
        </button>
      </div>

      <!-- DB読み込み済み: テーブル -->
      <div v-else>
        <table class="table table-dark table-hover mb-0 align-middle">
          <thead class="sticky-top bg-dark border-bottom border-secondary">
            <tr>
              <th style="width: 50px">IMG</th>
              <th>Name</th>
              <th class="text-end" style="width: 120px">Flea (24h)</th>
              <th class="text-end" style="width: 140px">Trader Sell</th>
              <th class="text-center" style="width: 80px">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in paginatedItems" :key="item.id">
              <!-- メイン行 -->
              <tr @click="toggleDetails(item.id)" style="cursor: pointer">
                <td>
                  <img
                    :src="item.iconLink"
                    alt=""
                    style="width: 40px; height: 40px; object-fit: contain"
                  />
                </td>
                <td>
                  <div class="fw-bold">
                    <span
                      v-if="wishlist.includes(item.id)"
                      class="text-warning me-1"
                    >
                      ★
                    </span>
                    {{ item.name }}
                  </div>
                  <div class="small text-muted">{{ item.shortName }}</div>
                </td>
                <td class="text-end font-monospace">
                  {{ formatPrice(item.avg24hPrice) }}
                </td>
                <td class="text-end font-monospace">
                  <div v-if="getBestSell(item)">
                    <div class="text-success">
                      {{ formatPrice(getBestSell(item).price, getBestSell(item).currency) }}
                    </div>
                    <div class="small text-muted" style="font-size: 0.75rem">
                      {{ getBestSell(item).vendor }}
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click.stop="toggleWishlist(item.id)"
                  >
                    <span v-if="wishlist.includes(item.id)">★</span>
                    <span v-else>☆</span>
                  </button>
                </td>
              </tr>

              <!-- 展開行: 詳細情報 -->
              <tr
                v-if="expandedItems[item.id]"
                class="bg-secondary bg-opacity-10 border-bottom border-secondary"
              >
                <td colspan="5" class="p-3">
                  <div class="row g-3">
                    <!-- 入手・交換・製造 -->
                    <div class="col-md-6 col-lg">
                      <h6 class="text-success border-bottom border-success pb-1 small">
                        入手・交換・製造
                      </h6>

                      <div v-if="getBuySources(item).length > 0">
                        <ul class="list-unstyled mb-0 ps-1">
                          <li
                            v-for="(src, idx) in getBuySources(item)"
                            :key="idx"
                            class="mb-2 border-bottom border-secondary pb-1"
                          >
                            <div class="d-flex align-items-center gap-2 mb-1">
                              <span class="badge bg-primary">
                                {{ src.vendor }} {{ src.level }}
                              </span>
                            </div>
                            <div
                              v-if="src.type === 'barter'"
                              class="d-flex flex-wrap gap-1 align-items-center"
                              style="cursor: pointer"
                              @click.stop="openBarterPopup(src.raw)"
                            >
                              <span class="small text-muted me-1">交換:</span>
                              <span class="text-info text-decoration-underline">
                                レシピ表示
                              </span>
                            </div>
                            <div v-else class="fw-bold text-success small ps-1">
                              {{ formatPrice(src.price, src.currency) }}
                            </div>
                          </li>
                        </ul>
                      </div>

                      <!-- クラフト -->
                      <div
                        v-if="item.craftsFor && item.craftsFor.length > 0"
                        class="mt-2"
                      >
                        <div
                          class="small text-muted fw-bold mb-1"
                          style="font-size: 0.7rem"
                        >
                          [製造 (Craft)]
                        </div>
                        <ul class="list-unstyled mb-0 ps-1">
                          <li
                            v-for="(c, cIdx) in item.craftsFor"
                            :key="cIdx"
                            class="mb-1 text-light"
                          >
                            <span
                              class="badge bg-secondary border border-light me-1"
                            >
                              {{ c.station.name }} Lv{{ c.level }}
                            </span>
                            <span
                              v-if="getCraftCount(c, item.id) > 1"
                              class="badge bg-success border border-light ms-1"
                            >
                              x{{ getCraftCount(c, item.id) }}
                            </span>
                            <span
                              class="text-info text-decoration-underline small ms-1"
                              style="cursor: pointer"
                              @click.stop="openCraftPopup(c)"
                            >
                              レシピ
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div
                        v-if="
                          getBuySources(item).length === 0 &&
                          (!item.craftsFor || item.craftsFor.length === 0)
                        "
                        class="small text-muted"
                      >
                        情報なし
                      </div>
                    </div>

                    <!-- タスク / ハイドアウト -->
                    <div class="col-md-6 col-lg">
                      <h6 class="text-info border-bottom border-info pb-1 small">
                        タスク / 隠れ家
                      </h6>
                      <div
                        v-if="item.usedInTasks && item.usedInTasks.length > 0"
                        class="mb-2"
                      >
                        <div
                          class="small text-muted fw-bold mb-1"
                          style="font-size: 0.7rem"
                        >
                          [タスク]
                        </div>
                        <ul class="list-unstyled mb-0 ps-1">
                          <li
                            v-for="t in item.usedInTasks"
                            :key="t.name"
                            class="small mb-1"
                          >
                            <span
                              class="text-decoration-underline"
                              style="cursor: pointer"
                              :class="
                                isTaskDone(t.name)
                                  ? 'text-success'
                                  : 'text-warning'
                              "
                              @click.stop="emit('open-task-from-name', t.name)"
                            >
                              {{ isTaskDone(t.name) ? 'done' : 'todo' }}
                              {{ t.name }}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div v-if="getHideoutUsage(item).length > 0">
                        <div
                          class="small text-muted fw-bold mb-1"
                          style="font-size: 0.7rem"
                        >
                          [ハイドアウト]
                        </div>
                        <ul class="list-unstyled mb-0 ps-1">
                          <li
                            v-for="(h, hIdx) in getHideoutUsage(item)"
                            :key="hIdx"
                            class="mb-1 text-light"
                          >
                            <span class="small">{{ h.stationName }}</span>
                            <span
                              class="badge bg-secondary border border-dark ms-2"
                            >
                              Lv.{{ h.level }}
                            </span>
                            <span class="text-info fw-bold ms-2">
                              x{{ h.count }}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div
                        v-if="
                          (!item.usedInTasks ||
                            item.usedInTasks.length === 0) &&
                          getHideoutUsage(item).length === 0
                        "
                        class="small text-muted"
                      >
                        特になし
                      </div>
                    </div>

                    <!-- 使用先 (素材として) -->
                    <div class="col-md-6 col-lg">
                      <h6
                        class="text-warning border-bottom border-warning pb-1 small"
                      >
                        使用先 (素材)
                      </h6>

                      <div
                        v-if="
                          item.bartersUsing && item.bartersUsing.length > 0
                        "
                      >
                        <ul class="list-unstyled mb-0 ps-1">
                          <li
                            v-for="(b, idx) in item.bartersUsing"
                            :key="idx"
                            class="small mb-1 text-truncate"
                          >
                            <span
                              class="badge bg-dark border border-secondary me-1"
                            >
                              {{ b.trader.name }} LL{{ b.level }}
                            </span>
                            <span
                              v-for="reward in b.rewardItems"
                              :key="reward.item.name"
                              class="text-info text-decoration-underline"
                              style="cursor: pointer"
                              @click.stop="openBarterPopup(b)"
                            >
                              {{ reward.item.name }}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div
                        v-if="
                          item.craftsUsing && item.craftsUsing.length > 0
                        "
                        class="mt-2"
                      >
                        <div
                          class="small text-muted fw-bold mb-1"
                          style="font-size: 0.7rem"
                        >
                          [クラフト素材]
                        </div>
                        <ul class="list-unstyled mb-0 ps-1">
                          <li
                            v-for="(c, idx) in item.craftsUsing"
                            :key="idx"
                            class="small mb-1 text-truncate"
                          >
                            <span
                              class="badge bg-secondary border border-secondary me-1"
                            >
                              {{ c.station.name }}
                            </span>
                            <span
                              class="text-info text-decoration-underline"
                              style="cursor: pointer"
                              @click.stop="openCraftPopup(c)"
                            >
                              <span
                                v-for="(reward, rIdx) in c.rewardItems"
                                :key="rIdx"
                              >
                                {{ reward.item.name
                                }}<span v-if="rIdx < c.rewardItems.length - 1"
                                  >,
                                </span>
                              </span>
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div
                        v-if="
                          (!item.bartersUsing ||
                            item.bartersUsing.length === 0) &&
                          (!item.craftsUsing ||
                            item.craftsUsing.length === 0)
                        "
                        class="small text-muted"
                      >
                        特になし
                      </div>
                    </div>

                    <!-- アクションボタン列 -->
                    <div
                      class="col-md-6 col-lg-auto d-flex flex-column gap-2 justify-content-start border-start-lg border-secondary ps-lg-3"
                    >
                      <a
                        v-if="item.wikiLink"
                        :href="item.wikiLink"
                        target="_blank"
                        class="btn btn-sm btn-outline-info py-1 px-2"
                        style="font-size: 0.8rem"
                      >
                        Wiki
                      </a>

                      <button
                        class="btn btn-sm py-1 px-2"
                        style="font-size: 0.8rem"
                        :class="
                          isUpdating(item.id)
                            ? 'btn-secondary'
                            : 'btn-success'
                        "
                        @click.stop="
                          updateSingleItemPrice(item.id, gameMode, apiLang)
                        "
                        :disabled="isUpdating(item.id)"
                      >
                        <span v-if="isUpdating(item.id)">
                          <span class="spinner-border spinner-border-sm me-1"></span>
                          更新中...
                        </span>
                        <span v-else>個別更新</span>
                      </button>

                      <small
                        class="text-muted"
                        style="font-size: 0.7rem; line-height: 1.2"
                      >
                        ※フリーマーケット・トレーダー買取価格のみ更新
                      </small>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ページネーション -->
    <div
      v-if="itemDb.length > 0"
      class="card-footer bg-dark border-top border-secondary py-2"
    >
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">Total: {{ filteredItems.length }} items</small>
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-secondary"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            ◀
          </button>
          <button class="btn btn-outline-secondary disabled text-white">
            {{ currentPage }} / {{ totalPages }}
          </button>
          <button
            class="btn btn-outline-secondary"
            @click="nextPage"
            :disabled="currentPage >= totalPages"
          >
            ▶
          </button>
        </div>
      </div>
    </div>

    <!-- バーターポップアップ -->
    <div
      v-if="selectedBarter"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start pt-5"
      style="background: rgba(0, 0, 0, 0.7); z-index: 1050"
      @click.self="closeBarterPopup"
    >
      <div
        class="card bg-dark border-secondary shadow"
        style="width: 400px; max-width: 90%"
      >
        <div
          class="card-header border-secondary d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0 text-white">交換詳細</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeBarterPopup"
          ></button>
        </div>
        <div class="card-body text-white">
          <!-- 交換対象 -->
          <div class="mb-3 text-center border-bottom border-secondary pb-3">
            <div class="small text-muted mb-1">交換対象 (Reward)</div>
            <div
              v-for="r in selectedBarter.rewardItems"
              :key="r.item.name"
              class="fw-bold fs-5 text-success"
            >
              <img
                v-if="r.item.iconLink"
                :src="r.item.iconLink"
                style="width: 30px; height: 30px; object-fit: contain"
                class="me-2"
              />
              {{ r.item.name }} x{{ r.count }}
            </div>
            <div class="mt-2 badge bg-primary">
              {{ selectedBarter.trader.name }} (LL{{ selectedBarter.level }})
            </div>
          </div>
          <!-- 必要素材 -->
          <div>
            <div class="small text-muted mb-2">必要な素材 (Required)</div>
            <ul class="list-group list-group-flush bg-dark">
              <li
                v-for="req in selectedBarter.requiredItems"
                :key="req.item.name"
                class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center px-0"
              >
                <div class="d-flex align-items-center">
                  <img
                    v-if="req.item.iconLink"
                    :src="req.item.iconLink"
                    style="width: 30px; height: 30px; object-fit: contain"
                    class="me-2"
                  />
                  <span>{{ req.item.name }}</span>
                </div>
                <span class="badge bg-secondary rounded-pill">
                  x{{ req.count }}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-footer border-secondary text-end">
          <button class="btn btn-secondary btn-sm" @click="closeBarterPopup">
            閉じる
          </button>
        </div>
      </div>
    </div>

    <!-- クラフトポップアップ -->
    <div
      v-if="selectedCraft"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start pt-5"
      style="background: rgba(0, 0, 0, 0.7); z-index: 1050"
      @click.self="closeCraftPopup"
    >
      <div
        class="card bg-dark border-secondary shadow"
        style="width: 400px; max-width: 90%"
      >
        <div
          class="card-header border-secondary d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0 text-white">クラフト詳細</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeCraftPopup"
          ></button>
        </div>
        <div class="card-body text-white">
          <!-- 作成対象 -->
          <div class="mb-3 text-center border-bottom border-secondary pb-3">
            <div class="small text-muted mb-1">作成対象 (Product)</div>
            <div
              v-if="
                selectedCraft.rewardItems &&
                selectedCraft.rewardItems.length > 0
              "
            >
              <div class="fw-bold fs-5 text-success">
                <img
                  v-if="selectedCraft.rewardItems[0].item.iconLink"
                  :src="selectedCraft.rewardItems[0].item.iconLink"
                  style="width: 30px; height: 30px; object-fit: contain"
                  class="me-2"
                />
                {{ selectedCraft.rewardItems[0].item.name }} x{{
                  selectedCraft.rewardItems[0].count
                }}
              </div>
            </div>
            <div class="mt-2 badge bg-secondary border border-light">
              {{ selectedCraft.station.name }} (Lv{{ selectedCraft.level }})
            </div>
            <div class="mt-1 small text-muted">
              所要時間: {{ formatDuration(selectedCraft.duration) }}
            </div>
          </div>
          <!-- 必要素材 -->
          <div>
            <div class="small text-muted mb-2">必要な素材 (Required)</div>
            <ul class="list-group list-group-flush bg-dark">
              <li
                v-for="req in selectedCraft.requiredItems"
                :key="req.item.name"
                class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center px-0"
              >
                <div class="d-flex align-items-center">
                  <img
                    v-if="req.item.iconLink"
                    :src="req.item.iconLink"
                    style="width: 30px; height: 30px; object-fit: contain"
                    class="me-2"
                  />
                  <span>{{ req.item.name }}</span>
                </div>
                <span class="badge bg-secondary rounded-pill">
                  x{{ req.count }}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-footer border-secondary text-end">
          <button class="btn btn-secondary btn-sm" @click="closeCraftPopup">
            閉じる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 展開行のトランジション */
.bg-opacity-10 {
  background-color: rgba(108, 117, 125, 0.1);
}
</style>
