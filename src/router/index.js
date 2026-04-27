// src/router/index.js
// Vue Router 設定 — タブ＝ルートとして扱う
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'input',
        component: () => import('../components/TaskInput.vue'),
        meta: { label: '📝 進捗入力', tab: true, title: '進捗入力' },
    },
    {
        path: '/result',
        name: 'result',
        component: () => import('../components/ResultList.vue'),
        meta: { label: '📦 必要なアイテム', tab: true, title: '必要なアイテム' },
    },
    {
        path: '/keys',
        name: 'keys',
        component: () => import('../components/KeyManager.vue'),
        meta: { label: '🔑 鍵管理', tab: true, title: '鍵管理' },
    },
    {
        path: '/flowchart',
        name: 'flowchart',
        component: () => import('../components/FlowchartView.vue'),
        meta: { label: '🗺️ フローチャート', tab: true, title: 'フローチャート' },
    },
    {
        path: '/story',
        name: 'story',
        component: () => import('../components/StoryView.vue'),
        meta: { label: '📖 ストーリー', tab: true, requiresFlag: 'showStoryTab', title: 'ストーリー' },
    },
    {
        path: '/ammo',
        name: 'ammo',
        component: () => import('../components/AmmoChart.vue'),
        meta: { label: '🔫 弾薬', tab: true, title: '弾薬' },
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('../components/ItemSearch.vue'),
        meta: { label: '🔍 アイテム検索', tab: true, title: 'アイテム検索' },
    },
    {
        path: '/memo',
        name: 'memo',
        component: () => import('../components/MemoView.vue'),
        meta: { label: '📋 メモ', tab: true, title: 'メモ' },
    },
    {
        path: '/overlay',
        name: 'overlay',
        component: () => import('../components/OverlaySettings.vue'),
        meta: { label: '📺 配信オーバーレイ', tab: true, requiresFlag: 'overlayEnabled', title: '配信オーバーレイ' },
    },
    {
        path: '/debug',
        name: 'debug',
        component: () => import('../components/DebugView.vue'),
        meta: { label: 'デバッグ', tab: true, cssClass: 'text-secondary', title: 'デバッグ' },
    },

    // --- 静的ページ（タブには表示しない） ---
    {
        path: '/about',
        name: 'about',
        component: () => import('../components/pages/AboutPage.vue'),
        meta: { title: 'About' },
    },
    {
        path: '/privacy',
        name: 'privacy',
        component: () => import('../components/pages/PrivacyPage.vue'),
        meta: { title: 'プライバシーポリシー' },
    },
    {
        path: '/terms',
        name: 'terms',
        component: () => import('../components/pages/TermsPage.vue'),
        meta: { title: '利用規約' },
    },
    {
        path: '/guide',
        name: 'guide',
        component: () => import('../components/pages/GuidePage.vue'),
        meta: { title: '使い方ガイド' },
    },
    {
        path: '/faq',
        name: 'faq',
        component: () => import('../components/pages/FaqPage.vue'),
        meta: { title: 'よくある質問' },
    },

    // 不明ルートはトップへ
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        return { top: 0 }
    },
})

// ページタイトル更新 + Umami のタブ計測
router.afterEach((to) => {
    const baseTitle = "EFT タスク＆ハイドアウト管理ツール | Iniwa's Intel Center"
    if (to.meta?.title && to.name !== 'input') {
        document.title = `${to.meta.title} | ${baseTitle}`
    } else {
        document.title = baseTitle
    }
    if (window.umami?.track) {
        window.umami.track('Tab Switch', { name: to.name })
    }
})

export default router
