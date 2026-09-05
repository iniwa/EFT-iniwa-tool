# EFT-iniwa-tool

Browser-only Vue 3.5/Vite 8 Escape from Tarkov SPA on Cloudflare Pages; no backend, accounts, authentication, or desktop wrapper. Read `README.md`, `package.json`, affected `src/`, `public/`, `docs/decisions/`, and relevant handoffs or `.docs/` notes.

Preserve localStorage user progress/settings and IndexedDB tarkov.dev cache separation, storage keys/import-export compatibility, Vue Router history mode, `public/_redirects`, `?overlay=tasks`, singleton composables, accessibility/responsiveness, five-minute API cooldown, twenty-hour refresh, bounded GraphQL fallback, and last-known-good cache behavior. Do not add automatic retries, abusive polling, or an unapproved proxy. Keep `dist/`, `.vite/`, `node_modules/`, secrets, local/browser data, hosted config, domain, deployment, and exposure gated.

Commands are `npm ci`, `npm run dev`, `npm run build`, `npm run preview`, and `npm test`; no lint, format, typecheck, or CI command is defined. Documentation work requires `git diff --check` and focused scans. Choose route from evidence; user runtime model/effort belongs to configuration. Native delegation, one-writer ownership, named-risk review after stable self-review, and correction reset are conditional.

Keep durable rules here, rationale in `docs/decisions/`, reusable notes in `.docs/`/`docs/`, and active/blocked handoffs in `docs/handoffs/`.

Authority reminder: runtime/tool/safety policy, explicit user policy, this entry, then task scope apply in that order; facts do not grant authority.

The current task may narrow standing permissions; it never widens persistence, API, domain, deployment, or exposure gates. For bounded personal work, make a minimal diff and useful normal-path check, then use the established authorized target/procedure, smoke normal use, and correct observed failures. Cheap direct tests are optional; no speculative suite or new harness is required. If a target/check is unavailable, separate source readiness from operation. Only the primary delegates; configured roles must be observable or primary/equivalent continues, with parent permissions/live overrides/read-only behavior binding. Stable self-review precedes named-risk review and later edits invalidate it. A second correction or two blocked/partial returns requires primary contract restatement and one selected writer.
