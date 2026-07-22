# JSON API adapter slice

## Goal

Implement and verify one dependency-free pure adapter that converts a complete tarkov.dev JSON bundle into the GraphQL-like main-data and item-database shapes already consumed by this application. Do not integrate network, cache, or UI behavior in this slice.

## Background and fixed design

- The parent decision is `docs/decisions/2026-07-22-tarkov-json-api.md`.
- The interrupted broad handoff is `docs/handoffs/2026-07-22-json-api-migration.md`; read its evidence but do not implement its integration/UI portion.
- Input resources are the unmodified `.data` payloads from `{mode}/{tasks,hideout,items,maps,traders,crafts,barters}` plus per-resource requested-language and English-fallback dictionaries.
- This module must not fetch, use Vue, access storage, mutate inputs, or add dependencies.

## Files to inspect

- `AGENTS.md`
- `CLAUDE.md`
- `src/composables/useApiData.js`
- `src/logic/taskLogic.js`
- `src/logic/hideoutLogic.js`
- `src/logic/keyLogic.js`
- `src/components/ItemSearch.vue`
- `src/components/AmmoChart.vue`
- `docs/handoffs/2026-07-22-json-api-migration.md`

## Files to edit

- Add `src/logic/tarkovJsonAdapter.js`.
- This handoff only, for the implementation report.

Do not edit any other tracked file. Remove the generated untracked `.tmp_probe/` directory before reporting. Do not inspect or modify `.codex/`.

## Adapter contract

Export a main function with a clear documented signature equivalent to:

```js
adaptTarkovJsonBundle(
  { tasks, hideout, items, maps, traders, crafts, barters },
  { tasks, hideout, items, maps, traders },
)
```

Each translation entry contains `{ primary, fallback }` dictionaries. Return:

```js
{
  main: { tasks, hideoutStations, items, maps, ammo },
  itemDatabase: items,
}
```

Export focused helpers only where useful for deterministic verification and later integration. Throw a stable `Error` when a required root or converted collection is missing/empty.

## Required conversions

1. Translation uses requested-language value, then English fallback, then the source token. Localize all user-visible fields this app consumes: task names and objective descriptions/targets/body parts; item names/short names/descriptions; map, trader, and hideout names.
2. Tasks:
   - trader ID -> object with `id`, localized `name`, `normalizedName`, `imageLink`
   - task/map/objective-map/item/marker/key/station IDs -> compatible references with names
   - task requirements -> `{ task: { id, name } }`
   - preserve/alias trader requirement fields needed by the existing query shape
   - convert finish reward items, offer unlocks, and craft unlocks
   - preserve task and objective IDs
3. Hideout:
   - preserve station `id` and `normalizedName`
   - item/trader/station requirements become named references
   - raw requirement attributes objects become arrays containing `{ type, name, value }`
4. Items:
   - build GraphQL-like flea/trader `buyFor` and `sellFor`
   - convert `containsItems[].item` to `{ id }`
   - preserve stable IDs, image/wiki links, normalized names, and `types`
5. Maps: return `Object.values(maps)` with localized names and every lock key as `{ id }`.
6. Crafts:
   - use `rewardItems` when present, otherwise `[productItem]`
   - hydrate station, task, required-item, and reward-item references
   - convert attributes objects to `{ name, type, value }` arrays
7. Ammo:
   - derive it from the item collection, excluding BB/projectile-only entries that the current ammo chart should not show
   - include item reference, current buy offers, crafts, and all fields consumed by `processAmmo`/`AmmoChart.vue`
   - map `initialSpeed` so the current chart receives `projectileSpeed`
8. Item database:
   - populate base item/price fields and buy/sell arrays
   - reverse-index barters into `bartersFor` and `bartersUsing`
   - reverse-index crafts into `craftsFor` and `craftsUsing`
   - derive `usedInTasks` from item-bearing objective fields
   - hydrate every nested item/trader/station with the names/icons consumed by `ItemSearch.vue`
9. Do not share mutable nested relation objects between item entries where a consumer could accidentally mutate another item.
10. Validate only structural invariants, not hard-coded production counts.

## Acceptance criteria

1. A small deterministic fixture proves primary/fallback/token localization and every conversion family above.
2. Input objects remain deeply equal to a clone made before conversion.
3. A bounded live conversion of existing `.tmp_probe/` data or freshly fetched temporary data reports nonempty main collections and item database, with zero unresolved required references. Do not retain live data in the repository.
4. `regular/ja` validation covers Japanese strings; `pve/en` may be deferred to the integration slice if it would require another large download.
5. No dependency, package, network integration, storage, Vue, UI, deployment, or unrelated change is made.
6. `git diff --check` passes.

## Verification

- Run a deterministic Node ESM smoke script against the exported adapter.
- Run one bounded live `regular/ja` conversion using temporary data, print only counts/invariant results, then delete `.tmp_probe/`.
- Run `node --check src/logic/tarkovJsonAdapter.js`.
- Run `git diff --check` and inspect the complete diff.
- Report final `git status --short` and preserve the pre-existing untracked `.codex/`.

## Expected report

- `status=complete` only if all acceptance criteria pass.
- List exports, converted counts, verification commands/results, and remaining integration work.
- Otherwise use `status=interrupted` with the exact failure and resume condition.

## Delegation attempt

status=interrupted

- Claude Code Sonnet was started with `--effort medium --permission-mode auto` for this narrowed slice.
- After approximately eleven minutes it had not edited the adapter or reported verification, so the coordinator stopped it to avoid another orphaned background process.
- The pre-existing `src/logic/jsonApiAdapter.js` and broad integration diffs were produced by the earlier broad attempt immediately before it timed out; this narrowed attempt did not validate them.
- Resume condition: Codex must review the full existing diff, repair or replace the adapter as needed, remove `.tmp_probe/`, and run every acceptance check directly.

## Coordinator completion report

status=complete

- The coordinator reviewed and repaired the existing broad-attempt module under its established name, `src/logic/jsonApiAdapter.js`.
- Deterministic fixture validation covered localization fallbacks, task/hideout/item/map/ammo conversion, craft/barter reverse indexes, popup DTO fields, input immutability, and non-shared nested relations.
- Live `regular/ja` and `pve/en` conversions passed structural and reference validation.
- The live regular conversion produced 499 tasks, 26 hideout stations, 5,055 items, 17 maps, 195 ammo records, and a 5,055-item search database.
- Generated probe data is no longer present in the worktree; dependencies and unrelated files were not changed by this slice.
- `node --check src/logic/jsonApiAdapter.js` and `git diff --check` passed.
