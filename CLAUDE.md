# CLAUDE.md

> Detailed notes (Japanese): CLAUDE_ja.md

## Project

Static browser tool for Escape from Tarkov (EFT) — task/hideout/key/ammo tracker.
Live at: https://efttool.iniwach.com/

## Tech Stack

- **Vue 3.5** (Composition API, `<script setup>` SFC)
- **Vue Router 4** (`createWebHistory` mode)
- **Vite 8** (`@vitejs/plugin-vue`)
- **Bootstrap 5** + custom CSS (dark theme)
- **Mermaid 11** — flowchart rendering
- **marked 15** + DOMPurify — Markdown rendering
- **Data source**: tarkov.dev GraphQL API (no API-side limit; we self-impose a 5-min cooldown for politeness)
- **Persistence**: localStorage (no backend)
- **Analytics**: Umami (self-hosted, cookieless)

## Build & Run

Vite is the build system. There is no test framework, linter, or formatter configured.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to dist/
npm run preview
```

The repo root `index.html` is the Vite entry; `src/` is the real source tree.
Static assets (favicon, OGP image, sitemap, robots) live under `public/` and are
copied to `dist/` root by Vite at build time.

## Hosting / Deploy

- **Cloudflare Pages** hosts the production site (https://efttool.iniwach.com/).
- Source is mirrored from this Gitea repo to GitHub; Cloudflare Pages watches the
  GitHub mirror and builds the **`main`** branch with `npm run build`, publishing
  the `dist/` directory.
- Pushing to `main` (after the mirror replays) triggers an automatic deploy.
- SPA fallback for the History API is provided by `public/_redirects`
  (`/*  /index.html  200`) — keep this file when editing `public/`.

## Work Location Detection

- Working in `D:/Git/` → **Home (Sub PC)** (Main PC / Sub PC available)
- Working in `C:/Git/` → **Home (Main PC)** (Main PC / Sub PC available)
- Working in `C:/Users/**/Documents/git/` → **Remote PC**
  - Remote PC lacks required environments. Focus on code adjustments only.

## Code Style

- Components: `.vue` SFC with `<script setup>`, PascalCase filenames (e.g. `AppHeader.vue`, `KeyManager.vue`)
- The legacy `Comp*` prefix is no longer used in `src/`
- Logic modules: `src/logic/*Logic.js` (camelCase), each exporting a single const object (e.g. `TaskLogic`)
- State management: composable singletons in `src/composables/*.js` — module-level `ref()` returned via `useXxx()`. No Vuex/Pinia.
- Persistent values use `loadLS` / `saveLS` from `useStorage.js` with a `watch` for sync
- Comments in Japanese; only write comments when the *why* is non-obvious
- Avoid backwards-compatibility shims, `_var` renames, and `// removed` markers — just delete

## Codebase Structure

```
src/
  main.js                       Entry. Branches on ?overlay=tasks before mounting.
  App.vue                       Header + tabs + <router-view> + modal + footer.
  router/index.js               Routes (9 tab + 5 static + catch-all). meta.tab gates tab nav.
                                afterEach updates document.title and tracks Umami "Tab Switch".
  components/
    AppHeader.vue, AppFooter.vue, AppNotice.vue
    TaskInput.vue, ResultList.vue, KeyManager.vue, FlowchartView.vue,
    StoryView.vue, StoryPlaceholder.vue, AmmoChart.vue, ItemSearch.vue,
    MemoView.vue, OverlaySettings.vue, DebugView.vue, TaskModal.vue
    OverlayWindow.vue           Mounted independently for ?overlay=tasks (no router).
    pages/                      Static pages for AdSense readiness:
      AboutPage.vue, PrivacyPage.vue, TermsPage.vue, GuidePage.vue, FaqPage.vue
    memo/Memo*.vue              Memo subcomponents (weapon/armor/grenade/health/stims/traders/items)
    ui/BaseModal.vue, ui/ToastNotify.vue
  composables/
    useAppState.js              gameMode / apiLang / playerLevel / loading / error
    useUserProgress.js          Task/hideout progress + persistence
    useApiData.js               tarkov.dev GraphQL fetch + 5-min cache
    useImportExport.js          JSON import/export
    useOverlay.js               Overlay enabled flag
    useShoppingList.js          Required items aggregation
    useStorage.js               loadLS / saveLS wrappers
  logic/                        Pure-function logic (taskLogic, itemLogic, hideoutLogic, keyLogic, queries)
  data/                         Static data (constants, caliberData, keyPresets, storyChapters*)
  assets/style.css

public/
  sitemap.xml                   12 URLs covering tabs + static pages
```

## Parent/Child Contract

Children emit `@open-task-details` and `@open-task-from-name` to open the task modal.
`App.vue` binds both listeners on `<router-view v-slot>`, so the router was added without
modifying any child component.

## Routing Notes

- `createWebHistory()` requires SPA fallback in production (e.g. nginx `try_files $uri $uri/ /index.html;`).
  Without it, direct hits like `/keys` return 404.
- `?overlay=tasks` is handled in `src/main.js` *before* the router is created — overlay mode
  mounts `OverlayWindow.vue` without ever instantiating the router.

## Testing

No automated tests. Verify changes manually:

1. `npm run dev` — open browser, exercise the affected feature
2. Check the console for errors
3. Walk neighboring tabs to confirm no regressions
4. For broader validation, drive the dev server with Playwright MCP

## Tooling

- Use **Serena MCP** tools for code navigation and editing (symbol search, overview, replace, insert, etc.)
- Use **Tavily MCP** tools for web search and research:
  - `tavily_search` — General web search for documentation, error messages, library usage, etc.
  - `tavily_crawl` — Crawl a specific website for detailed information
  - `tavily_extract` — Extract structured content from a URL
  - `tavily_research` — In-depth research on a topic (use for complex or multi-faceted questions)
- Use **Playwright MCP** tools to run the dev server in a real browser when verifying UI changes.

## Persisting Design Knowledge

- Save non-obvious design decisions and rationale to `.docs/*.md` so future sessions inherit context.
- Check `.docs/` at the start of work — e.g. `.docs/adsense-prep-design.md` documents this branch's design.
