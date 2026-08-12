# Full Audit Remediation Handoff

Status: completed
Branch: `Edit`
Target version: `3.2.1`

## Outcome

Resolve every reproducible item from the 2026-08-13 full audit and leave the
`Edit` branch ready for the user's Cloudflare Pages review deployment.

## Acceptance mechanics

1. Backup/import
   - Export contains a schema version, source game mode, all current-mode user
     progress including story and overlay task/count progress.
   - Import validates size and the complete payload before mutating any state.
   - Malformed collection/object/scalar values fail without partial writes.
   - A valid backup with a different supported mode is applied to that mode,
     never silently written into the currently selected mode.
   - Existing v2 name-based task backups and existing v3.2.0 backups remain
     importable.
2. API and cache
   - JSON API remains primary; one bounded GraphQL fallback remains secondary.
   - GraphQL-shaped task requirements no longer fail solely because the legacy
     response omits a trader ID, while JSON batches retain strict reference
     validation.
   - JSON and GraphQL requests have a bounded timeout with an actionable error.
   - The per-context five-minute attempt cooldown, twenty-hour automatic refresh,
     in-flight dedupe, request race guards, last-known-good IndexedDB behavior,
     and `pvp` to `regular` compatibility remain unchanged.
   - API language is normalized to `ja` or `en` before endpoint/cache use.
3. Overlay
   - Open overlay windows follow mode and language changes from the main tab,
     reload the matching cache/API context, and cannot mix focused IDs from one
     mode with task data from another.
   - Loading and failure states are visible without destroying transparent OBS
     output when data is available.
4. Tasks, story, and flowchart
   - Story bulk completion does not claim required user choices were completed;
     stale selected chapter IDs recover to a valid chapter.
   - API-backed links open tasks by stable ID. Name-only references either open a
     unique match or present an honest ambiguous/not-found outcome.
   - Live duplicate task names never resolve silently to the first record.
   - Recursive prerequisite closure, AND across requirement entries, OR within a
     status array, other-trader ancestors, cycle safety, and setup conflicts stay
     correct for all three live modes.
   - Flowchart rerenders are bounded/debounced and zoom uses standard layout
     behavior rather than CSS `zoom`.
5. UI/accessibility/security
   - Shared modals expose an accessible name, trap focus, close on Escape, and
     restore focus.
   - Interactive text/rows and graph nodes have keyboard activation and visible
     focus behavior.
   - Dynamic external URLs accept HTTPS only; new-tab links use `noopener`.
   - Cloudflare Pages ships security headers without breaking Vue chunks,
     tarkov.dev requests, the self-hosted Umami script, images, Mermaid styles,
     or the DebugView Blob worker.
   - The production debug route is an explicit development-only surface or is
     otherwise removed from the public tab/route.
6. Dependencies, dead code, documentation
   - Supported patch/minor dependency updates remove all fixable high/moderate
     audit findings without a Vue Router major migration.
   - Unused direct Markdown dependencies and unused source/data artifacts are
     removed only after a repository-wide reference check.
   - README, Guide, FAQ, Privacy, notice, sitemap, storage/reset descriptions,
     API URL, version, and Cloudflare behavior match the implementation.
   - `.serena/` and `.codex/` are ignored; the pre-existing `.codex/config.toml`
     is never inspected, staged, or modified.

## Protected boundaries and gates

- No backend, account system, proxy, automatic retry loop, polling expansion,
  analytics provider/domain change, Cloudflare project setting change, deploy,
  or production-data mutation.
- Do not edit generated `dist/`, `.vite/`, or `node_modules` as source.
- Preserve unrelated user changes and the local documentation commit at
  `3492648`.
- Import changes must be additive/backward-compatible and mode-safe.
- Dependency and CSP changes are a material gate: require full build, preview,
  route/asset checks, audit output, and a fresh stable review before push.

## Focused verification

- Deterministic Node assertions for import sanitization/atomicity/mode routing,
  API-language normalization, mode-scoped state swapping, GraphQL-shaped
  validation, overlay message/context handling, URL sanitization, story bulk
  completion semantics, task-reference ambiguity, prerequisite closure/status
  logic, and reset-key coverage.
- Live `fetch -> validate -> convert -> validate` for `regular`, `pve`, and
  `pvp-season` in Japanese, plus duplicate/cycle/unresolved-reference checks.
- `npm audit --omit=dev` and full `npm audit`; document any unavoidable residual.

## Affected full checks

- `npm run build`
- `npm run dev` plus browser-level route/modal/keyboard/flowchart/overlay checks
  when a connected browser is available.
- `npm run preview` plus HTTP 200 checks for every route, SPA fallback, overlay
  entry, emitted entry assets, `_redirects`, `_headers`, and sitemap.
- `git diff --check`, status review, dependency/build/persistence/routing/
  analytics/Cloudflare/domain/exposure sweep, and stale-reference scan.

## Stable-diff review evidence required

Each writer reports every owned acceptance item as `passed`, `blocked`, or
`unmet`, lists changed files, runs focused checks and `npm run build`, and
confirms unrelated files were untouched. After all writers stop changing the
candidate, run one fresh independent final review because persistence,
dependencies, CSP, routing, and broad UI behavior are material risks.

## Completion evidence

- `npm test`: 18/18 passed.
- `npm run build`: passed; only the existing chunk-size warning remains.
- `npm audit --json` and `npm audit --omit=dev --json`: 0 vulnerabilities.
- Live Japanese JSON API validation passed for `regular`, `pve`, and
  `pvp-season`, with no unresolved references, duplicate IDs, or prerequisite
  cycles.
- Development and production-preview HTTP checks returned 200 for all public
  routes, the overlay entry, SPA fallback, emitted entry assets, `_redirects`,
  `_headers`, and sitemap.
- CSP hashes match the emitted JSON-LD script; the production build contains no
  DebugView route or chunk.
- Two independent stable-candidate reviews reported no remaining material
  findings after correcting the final stale Settings-tab reference.
- Browser-level modal, keyboard, flowchart, and cross-tab overlay interaction
  checks were blocked because no connected browser was available. These remain
  the user's final Cloudflare Pages review checks and are not source-code
  blockers.
