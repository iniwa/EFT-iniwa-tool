# v3.1.3 tarkov.dev API error handling

## Goal

Release the client-side fix as v3.1.3 so tarkov.dev outages never surface as `GraphQL Error: undefined`, and add an accurate v3.1.3 entry to the update notice.

## Background

- Production at `https://efttool.iniwach.com/` currently reports `更新失敗: GraphQL Error: undefined` while refreshing API data.
- On 2026-07-22, the exact `getMainQuery('regular', 'ja')` request returned HTTP 503 with `Content-Type: text/plain;charset=UTF-8` and this JSON-shaped body:

  ```json
  {"errors":["GraphQL server unavailable. Try again later."]}
  ```

- A minimal traders query returned the same response, so this is a current upstream API-wide outage rather than a bad selection in this repository's query.
- `src/composables/useApiData.js` reads `result.errors[0].message`; because the first error is a string, the rendered message becomes `undefined`.
- The external outage itself cannot be fixed by this browser-only application. The approved change is robust, truthful client-side error handling without retries.

## Data sources

- Current source in `src/composables/useApiData.js` and `src/logic/queries.js`.
- Direct response from `https://api.tarkov.dev/graphql` captured above.
- Git history for v3.1.1 (`37c83e8`) and v3.1.2 (`7c92358`).

## Files to inspect

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `package.json`
- `package-lock.json`
- `src/composables/useApiData.js`
- `src/data/constants.js`
- `src/components/AppNotice.vue`

## Files to edit

- `src/composables/useApiData.js`
- `src/data/constants.js`
- `src/components/AppNotice.vue`
- `package.json`
- `package-lock.json`
- This handoff only when adding the final implementation report or status.

Do not edit any other file without returning the scope question to Codex.

## Acceptance criteria

1. Main data refresh handles GraphQL `errors` entries that are either strings or objects with a `message` field; it never renders `undefined` for the captured response.
2. Non-2xx HTTP responses include the HTTP status and the best available upstream detail. HTTP 503 receives a clear Japanese explanation that tarkov.dev is temporarily unavailable and the user should retry later.
3. A non-JSON API response produces a stable, useful error rather than exposing a JSON parser exception.
4. The same response/error helper is used by the main data fetch, full item database fetch, and single-item update so their behavior does not diverge.
5. Successful response processing, cache writes, existing cached-data fallback, five-minute cooldown, twenty-hour auto-update interval, and request count are unchanged. Do not add retries or polling.
6. `APP_VERSION`, `package.json`, and the root package entries in `package-lock.json` are all exactly `3.1.3`. Do not change dependency versions.
7. `AppNotice.vue` starts with a v3.1.3 `FIX` card explaining the observed `GraphQL Error: undefined`, its string-form error cause, and the new clear outage guidance. Remove the `NEW` badge from the older v3.1.2 card.
8. Preserve the existing major/minor notification visibility policy. Updating the notice content does not authorize changing when patch notices auto-open.
9. No backend, dependency, build-tooling, storage-key, routing, overlay, Cloudflare Pages, analytics, domain, or deployment change is introduced.

## Constraints and non-goals

- Do not attempt to fix, bypass, or repeatedly probe the upstream tarkov.dev outage.
- Do not add a fallback data provider, backend, proxy, retry loop, dependency, or test framework.
- Do not change GraphQL query selections; the minimal query fails identically during the current upstream outage.
- Do not commit, push, tag, or deploy.
- Preserve unrelated changes. Baseline before this handoff was a clean `main` at `origin/main` commit `96bc594`.

## Verification

- Run `npm run build`.
- Run a focused, deterministic smoke check for the error-normalization helper or otherwise demonstrate with the captured `{ errors: ['GraphQL server unavailable. Try again later.'] }` shape that the output contains HTTP 503/upstream detail and not `undefined`.
- Run focused searches confirming only the three intended app/package version locations are `3.1.3` and dependency versions were not mechanically rewritten.
- Run `git diff --check` and inspect the complete scoped diff.
- Report that no automated test/lint suite is configured.

## Expected report

- Files changed and concise behavior summary.
- Exact verification commands and results.
- Confirmation that retries, cooldown, cache, routing, overlay, storage, dependencies, and deployment were not changed.
- Final `git status --short` and any unexpected/pre-existing changes.
- `status=complete` only when all acceptance criteria are met; otherwise `status=interrupted` with the remaining scope and resume condition.

## Implementation report

status=complete

- Added a shared exported `requestGraphQL` helper in `src/composables/useApiData.js`. All three GraphQL call sites now use it for guarded text-to-JSON parsing, string/object error normalization, HTTP status handling, and stable non-JSON errors.
- HTTP 503 now explains in Japanese that tarkov.dev is temporarily unavailable, asks the user to retry later, and includes the upstream detail when available. No retry or polling was added.
- Synchronized `APP_VERSION`, `package.json`, and only the two root `package-lock.json` entries to `3.1.3`.
- Added the leading v3.1.3 FIX card to `AppNotice.vue` and removed the older v3.1.2 NEW badge. Notice visibility logic was not changed.
- Verification passed:
  - Deterministic Node smoke check covered the captured string-form HTTP 503, object-form GraphQL errors, non-JSON 503/200 responses, and a successful response; no `undefined` or JSON parser text surfaced.
  - `npm run build` completed successfully with Vite 8.0.7.
  - Focused scans confirmed one network fetch inside the shared helper, three helper callers, no remaining `result.errors[0].message`, and synchronized v3.1.3 metadata.
  - `git diff --check` passed.
- No automated test, lint, or formatter suite is configured. Interactive Browser verification was unavailable because the in-app browser runtime failed to start; the compiled notice and request behavior were covered by the build and deterministic smoke check.
- Cache writes, cached-data fallback, the five-minute cooldown, the twenty-hour auto-update interval, storage, import/export, routing, overlay behavior, dependencies, Cloudflare Pages settings, analytics, domain, and deployment were not changed.
- Delegation record: Claude Code Sonnet could not authenticate; Luna was attempted per policy but its nested workspace was forced read-only. Codex applied the fixed design through the repository's Serena editor after the standard apply-patch sandbox helper also failed.
