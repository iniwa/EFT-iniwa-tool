# tarkov.dev JSON API migration

## Goal

Restore fresh-data updates for new and existing users while the legacy GraphQL endpoint returns HTTP 503 by moving supported data reads to tarkov.dev's official JSON API, without changing browser-only persistence or deployment behavior.

## Background

- On 2026-07-22, `https://api.tarkov.dev/graphql` returned HTTP 503 even for `{ __typename }`.
- The 2026-06-29 upstream deployment did not move the GraphQL URL. It moved cache-miss execution from the Cloudflare Worker to a VM and disabled Worker-side GraphQL execution.
- tarkov.dev had already moved its official website to the JSON API on 2026-03-25.
- Current official documentation calls GraphQL a legacy API in maintenance mode and says new clients should use the JSON API.
- The live JSON endpoint is browser-accessible from `https://efttool.iniwach.com`, exposes CORS `*`, supports `regular` and `pve`, supports `ja` and `en`, and currently returns the data required by this application.

## Primary data sources

- JSON API manifest: `https://json.tarkov.dev/endpoints`
- JSON API client used by the official site: `https://github.com/the-hideout/tarkov-dev/blob/main/src/modules/api-request.mjs`
- Official GraphQL legacy notice: `https://github.com/the-hideout/tarkov-dev/blob/main/src/pages/api-graphql/index.jsx`
- Official JSON API documentation: `https://github.com/the-hideout/tarkov-dev/blob/main/src/pages/api-docs/index.jsx`
- Official resource adapters:
  - `src/features/quests/do-fetch-quests.mjs`
  - `src/features/hideout/do-fetch-hideout.mjs`
  - `src/features/items/do-fetch-items.mjs`
  - `src/features/maps/do-fetch-maps.mjs`
  - `src/features/traders/do-fetch-traders.mjs`
  - `src/features/crafts/do-fetch-crafts.mjs`
  in `https://github.com/the-hideout/tarkov-dev`
- Live resources under `https://json.tarkov.dev/{regular|pve}/`:
  - `tasks`, `hideout`, `items`, `maps`, `traders`, `crafts`, `barters`
  - localized dictionaries use `_ja` or `_en` suffixes for the resources marked translatable by the manifest

## Verified live shape

The 2026-07-22 regular data contained 499 tasks, 5,055 items, 17 maps, 16 traders, 26 hideout stations, 211 crafts, 780 barters, and 195 ammo items. Every task prerequisite, objective item, needed key, objective map, hideout item, craft item, barter item, task trader, and task map ID resolved against the corresponding resource.

## Files to inspect

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `package.json`
- `src/composables/useApiData.js`
- `src/composables/useStorage.js`
- `src/data/constants.js`
- `src/logic/queries.js`
- `src/logic/taskLogic.js`
- `src/logic/hideoutLogic.js`
- `src/logic/keyLogic.js`
- `src/App.vue`
- `src/components/AppHeader.vue`
- `src/components/AppNotice.vue`
- `src/components/ItemSearch.vue`
- `src/components/OverlayWindow.vue`
- `src/components/ItemSearch.vue`
- `src/components/pages/AboutPage.vue`
- `src/components/pages/PrivacyPage.vue`

## Files to edit

- Add one dependency-free pure adapter module under `src/logic/` for JSON fetching/translation/shape conversion.
- `src/composables/useApiData.js`
- `src/data/constants.js`
- `src/App.vue` only if needed for non-blocking cached-data warnings.
- `src/components/OverlayWindow.vue` only if the cache initializer needs mode/language context.
- `src/components/AppNotice.vue`
- `README.md`
- `src/components/pages/AboutPage.vue`
- `src/components/pages/PrivacyPage.vue`
- This handoff for the final implementation report.

Do not edit dependencies, package metadata, Cloudflare configuration, routes, storage helpers, or unrelated files. Return any required scope expansion to Codex.

### Coordinator review scope expansion

- Final cache review found that propagating IndexedDB write failures and making read-modify-write updates atomic across the main page and overlay required a focused edit to `src/composables/useStorage.js`.
- Final cache review also found that the multi-context cache must be selected explicitly in the data viewer, requiring a focused edit to `src/components/DebugView.vue`.
- These two edits preserve the existing database name, object store, cache keys, record fields, routes, and deployment behavior; no dependency or schema-version change was made.

## Required design

1. The JSON API is the primary network source for main data and the full item database. Each legacy GraphQL query may be attempted once as a final network fallback only after a JSON batch fails; do not retry it.
2. Fetch JSON with `cache: 'no-cache'`, matching the official client so the browser conditionally revalidates cached responses. Do not add timestamp query parameters, polling, or retry loops.
3. For localized resources, fetch the base resource plus the requested language dictionary and English fallback dictionary where necessary. Reimplement only the localization behavior this app needs; do not copy licensed upstream source wholesale and do not add a JSONPath dependency.
4. Convert raw IDs to the GraphQL-like object references the current app consumes. Preserve stable task/item/station IDs and `hideout.normalizedName`.
5. Fetch one shared JSON bundle and build main data atomically:
   - translated tasks with trader/map/item/task/station references and rewards
   - translated hideout requirements
   - translated minimal items and map locks
   - ammo derived from item `types` and `properties`, including trader offers and crafts
6. From the same validated bundle, build the item-search database from items, traders, tasks, crafts, and barters. Populate current price/trader fields, `bartersFor`, `craftsFor`, `usedInTasks`, `bartersUsing`, and `craftsUsing` in the shapes consumed by `ItemSearch.vue`, then write it under the existing item DB cache key. Do not repeat the large resource downloads solely to initialize item search.
7. The JSON manifest has no equivalent lightweight current-item/trader endpoint. Remove the per-item refresh action from `ItemSearch.vue` and explain that the existing full update refreshes price data. Do not download the complete items resource for every individual click. The shared GraphQL helper and query definitions may remain for fallback compatibility; do not perform unrelated cleanup.
8. Validate every converted batch before touching reactive state or IndexedDB. On any failure, retain the last known good state/cache.
9. Keep existing IndexedDB keys and value fields compatible. Add optional `gameMode`, `lang`, and `source` metadata to new records. Continue to read legacy records without those fields.
10. Enforce the five-minute request cooldown for header/manual refreshes as well as automatic refreshes. A failed attempt must not permit immediate repeated requests. Context changes may use independent `mode:lang` cooldown entries. Do not change the twenty-hour automatic freshness interval.
11. Prevent an older in-flight mode/language response from overwriting a newer selection.
12. When both network sources fail but matching cached data exists, keep the app usable and show a non-blocking warning. Show a blocking error only when no usable data exists.
13. Update the v3.1.3 notice and data-source documentation: GraphQL is legacy/maintenance mode, the official JSON API is now the primary source, and new users can load data again. Keep version `3.1.3` and the existing notice visibility policy.

## Acceptance criteria

1. With an empty IndexedDB and the live GraphQL 503, the app loads current JSON data and shows tasks, hideout requirements, keys/maps, and ammo for all four `regular|pve` x `ja|en` contexts.
2. Task prerequisites use IDs; item objectives and needed keys have item names; hideout stations retain `normalizedName`; map locks expose `key: { id }`; ammo has stable item IDs and trader/craft information.
3. Full item DB JSON conversion produces nonempty items with current prices and the relation arrays consumed by `ItemSearch.vue`; it is available after the successful shared update without a second large download.
4. A malformed/incomplete JSON batch never partially replaces visible state or a good cache. Each GraphQL fallback query is attempted at most once, with no retry loop.
5. A successful JSON batch updates the existing cache record and twenty-hour freshness timestamp. Old cache records still load.
6. A failed refresh preserves existing matching data. The user sees a warning rather than losing the tool. With no usable data, a clear error is shown.
7. Header/manual refresh cannot bypass the five-minute cooldown, including after a failed request. Mode/language contexts do not incorrectly block one another.
8. Rapid context changes cannot allow stale responses to win.
9. `?overlay=tasks` continues to load from the same cache/network path.
10. Item search no longer offers a misleading GraphQL-only per-item refresh; its full refresh remains available and uses the shared JSON update path.
11. No dependency, localStorage key, user-progress migration, IndexedDB key, import/export format, route, overlay contract, backend, polling, Cloudflare Pages, domain, analytics, or deployment change is introduced.
12. `APP_VERSION`, `package.json`, and `package-lock.json` remain `3.1.3`.

## Verification

- Run a dependency-free deterministic adapter smoke test with representative raw fixtures for translations and all ID-reference conversions.
- Run one bounded live JSON smoke check for `regular/ja` and one for `pve/en`; report counts and required-field validation without storing upstream data in the repository.
- Simulate JSON failure plus GraphQL success, and both-network failure with/without an existing cache.
- Verify five-minute cooldown and stale-response protection deterministically.
- Run `npm run build`.
- Run the site locally and inspect the core views and `?overlay=tasks` in a browser.
- Run `git diff --check` and review the complete scoped diff.
- Report that no automated test/lint suite is configured unless that fact changes independently.

## Constraints and non-goals

- Do not add a backend, proxy, bundled snapshot, dependency, test framework, retry loop, or polling.
- Do not copy upstream GPL server implementation. Reimplement the client-side conversion from the documented response shape.
- Do not remove the shared GraphQL error handling added in v3.1.3.
- Do not inspect personal browser cache, user progress, backups, credentials, `.env`, `.codex/`, or `.serena/`.
- Do not commit, push, deploy, tag, or change branches.
- Preserve the existing untracked `.codex/` directory and all unrelated changes.

## Expected report

- Files changed and concise behavior summary.
- Exact verification commands/results, live counts, and any known feature limitation.
- Confirmation that storage compatibility, cache retention, cooldown, overlay, routing, import/export, dependencies, and deployment remained intact.
- Final `git status --short`.
- `status=complete` only if all acceptance criteria are met; otherwise `status=interrupted` with the exact remaining work and resume condition.

## Delegation attempt 1

status=interrupted

- Claude Code Sonnet was started with `--effort medium --permission-mode auto` from the repository root.
- It downloaded bounded live `regular` resources into `.tmp_probe/` and continued schema investigation, but the 15-minute command limit expired before the first source edit.
- No application source, package, deployment, or existing tracked file was changed by this attempt.
- Usable result: the live endpoint/resource/translation availability and relationship coverage in this handoff were reconfirmed.
- Remaining scope: all implementation and verification.
- Resume condition: split the work into a pure JSON adapter slice followed by a separate integration/UI/cache slice. Do not rerun this broad handoff unchanged.
- `.tmp_probe/` is a generated temporary directory and must be removed before final review; the coordinator's direct removal command was blocked by the execution policy.

## Final implementation report

status=complete

The coordinator completed and reviewed the implementation after the interrupted delegation attempts.

### Implemented

- Added a dependency-free `src/logic/jsonApiAdapter.js` that fetches, localizes, validates, and converts the official JSON resources.
- Made JSON the primary source and retained one bounded GraphQL fallback attempt.
- A successful main refresh now builds and saves both main data and the full Item DB from the same in-flight bundle.
- Added context-aware cache records while preserving the active record's legacy top-level fields and existing IndexedDB keys.
- Added persisted per-context cooldowns, in-flight request sharing, stale-response guards, matching-cache retention, and non-blocking warnings.
- Propagated IndexedDB write failures, made cache read-modify-write operations transactional across tabs, and made DebugView select the requested mode/language record without rewriting the large cache on every switch.
- Kept the legacy fallback resilient by validating and applying core data independently from the optional full Item DB fallback.
- Removed the GraphQL-only per-item refresh and updated v3.1.3 notices and data-source documentation.
- Preserved routes, `?overlay=tasks`, localStorage/import-export contracts, dependencies, Cloudflare configuration, analytics, and browser-only architecture.
- Removed generated probe data from the worktree and preserved the pre-existing untracked `.codex/` directory.

### Verification

- Deterministic adapter fixture: primary/fallback/token localization, all conversion families, input immutability, and independent nested relation DTOs passed.
- Deterministic integration checks: JSON failure to GraphQL success, both-source failure with and without a matching cache, failed-attempt cooldown, legacy-cache context isolation, and stale-response protection passed.
- Follow-up deterministic checks passed for split GraphQL fallback success/partial failure, write-failure cache rollback and usable-display protection, and atomic IndexedDB update behavior.
- Live JSON validation passed for `regular/ja` and `pve/en`; representative counts were 499/495 tasks, 26 hideout stations, 5,055 items, 17 maps, and 195 ammo records.
- Local browser checks passed for first load, 5,055-item search data, price display, barter/craft popups, cache reload, PvE/PvP and JP/EN switches, DebugView compatibility, and the transparent overlay entry path.
- `npm run build`, `node --check`, and `git diff --check` passed.
- No automated test or lint script is configured in `package.json`.
