# CLAUDE.md

> Detailed notes (Japanese): CLAUDE_ja.md

## Project

Static browser tool for Escape from Tarkov (EFT) — task/hideout/key/ammo tracker.
Live at: https://efttool.iniwach.com/

## Tech Stack

- **Vue.js 3** (CDN, no build tools) — Composition API with `setup()`, object-literal components
- **Bootstrap 5** (CDN) — dark theme with custom CSS
- **Mermaid.js** — flowchart rendering
- **marked.js** — Markdown rendering
- **Data source**: tarkov.dev GraphQL API (5-min rate limit)
- **Persistence**: localStorage (no backend)
- **Analytics**: Umami (self-hosted)

## No Build System

There is no npm/webpack/vite. All JS files are loaded via `<script>` tags in `index.html`.
Open `index.html` directly in a browser to run. For local dev server: `npx serve .`

## Work Location Detection

- Working in `D:/Git/` → **Home (Sub PC)** (Main PC / Sub PC available)
- Working in `C:/Git/` → **Home (Main PC)** (Main PC / Sub PC available)
- Working in `C:/Users/**/Documents/git/` → **Remote PC**
  - Remote PC lacks required environments. Focus on code adjustments only.
- Can SSH into Raspberry Pi via `ssh iniwapi` to read code/logs from the Pi

## Code Style

- Components: `CompXxx` (PascalCase), defined as object literals with `template` string
- Logic modules: `logic_xxx.js` (snake_case), export a single const object (e.g. `TaskLogic`)
- State management: `ref()` / `computed()` in `app.js` setup — no Vuex/Pinia
- Comments in Japanese
- Keep code simple and readable; no unnecessary abstractions

## Codebase Structure

```
index.html          — Entry point, mounts Vue app
style.css           — Global dark-theme CSS
data.js             — TARKOV_DATA (local hideout data)
js/
  app.js            — Vue app (setup, state, all logic integration)
  queries.js        — GraphQL query builder (getMainQuery)
  logic_tasks.js    — TaskLogic
  logic_items.js    — ItemLogic
  logic_hideout.js  — HideoutLogic
  logic_keys.js     — Key logic
  key_presets.js    — Key preset data
  story_data.js     — Story data
  components/       — 15 Vue components (CompHeader, CompInput, CompResult, etc.)
    memo/           — Memo sub-components (weapon, armor, grenade, health, stims, traders, items)
```

## Testing

No test framework. Verify changes manually in browser:
1. Open `index.html` in browser
2. Check console for errors
3. Verify affected features work correctly
4. Confirm other tabs/features are unaffected

## Tooling

- Use **Serena MCP** tools for code navigation and editing (symbol search, overview, replace, insert, etc.)
- Use **Tavily MCP** tools for web search and research:
  - `tavily_search` — General web search for documentation, error messages, library usage, etc.
  - `tavily_crawl` — Crawl a specific website for detailed information
  - `tavily_extract` — Extract structured content from a URL
  - `tavily_research` — In-depth research on a topic (use for complex or multi-faceted questions)
