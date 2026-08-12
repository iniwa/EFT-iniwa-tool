# Use tarkov.dev JSON API as the primary data source

## Status

Accepted and implemented on 2026-07-22.

## Decision

Use `https://json.tarkov.dev/` as the primary network source for game data. Keep the existing IndexedDB records as last-known-good data and retain the legacy GraphQL request path only as a bounded compatibility fallback.

Use conditional revalidation through `fetch(..., { cache: 'no-cache' })`. Keep the application's five-minute request cooldown and twenty-hour automatic refresh interval. Do not add polling, automatic retries, a proxy, or a bundled stale snapshot.

## Evidence

- tarkov.dev moved its official website to the JSON API in the 2026-03-25 `dacd1739` commit.
- Current official documentation labels GraphQL as a legacy API in maintenance mode and recommends the JSON API for future use.
- On 2026-07-22, the official JSON manifest exposed the required resources for `regular` and `pve`, with Japanese and English translations.
- On 2026-08-12, the same manifest also exposed `pvp-season`; its tasks, hideout, items, maps, traders, crafts, and barters passed the existing conversion and reference validation pipeline.
- Live browser-origin checks on 2026-07-22 returned CORS `Access-Control-Allow-Origin: *` and current data for all resources needed by this application.
- The current JSON resources resolve every task, hideout, craft, barter, trader, map, and item reference used by the application.
- The 2026-06-29 infrastructure change moved GraphQL cache-miss execution away from the Worker to a VM origin and disabled Worker-side execution. The endpoint was observed returning HTTP 503 afterward; together, these facts indicate the new delivery path was the practical source of the outage seen by this client.

## Consequences

- New users can initialize the tool without a pre-existing browser cache while GraphQL is unavailable.
- The client must translate JSON localization tokens and hydrate ID references into the object shapes expected by the existing Vue logic.
- A full JSON update is larger than the tailored GraphQL query, so all required resources are fetched once per update and reused to build both main data and the item-search database.
- JSON responses do not provide a lightweight replacement for the current single-item trader-price query. The UI uses full-data refresh instead of issuing a misleading GraphQL-only individual refresh.
- JSON paths are not versioned and no published JSON Schema or SLA was found. Converted batches must be validated before replacing visible data or IndexedDB cache records.
- Network requests use a bounded timeout. If JSON fails or times out, one bounded GraphQL fallback may be attempted; when both fail, the UI reports an actionable error and retains the last-known-good IndexedDB data rather than replacing it with partial results.

## Preserved constraints

- User progress and settings remain in `localStorage`.
- tarkov.dev game data remains in IndexedDB under the existing cache keys.
- Import/export compatibility, task and item IDs, hideout normalized names, overlay behavior, routing, deployment, analytics, and the browser-only architecture remain unchanged.

## References

- `https://json.tarkov.dev/endpoints`
- `https://github.com/the-hideout/tarkov-dev/commit/dacd173922907adeefceddc7d5a146876bcdb75e`
- `https://github.com/the-hideout/tarkov-dev/blob/main/src/pages/api-docs/index.jsx`
- `https://github.com/the-hideout/tarkov-dev/blob/main/src/pages/api-graphql/index.jsx`
- `https://github.com/the-hideout/tarkov-dev/blob/main/src/modules/api-request.mjs`
- `https://github.com/the-hideout/tarkov-api/issues/312`
