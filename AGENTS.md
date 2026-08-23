# AGENTS.md

## Project

- `EFT-iniwa-tool` is an npm-managed Vue 3.5 and Vite 8 Escape from Tarkov SPA deployed statically on Cloudflare Pages. It has no backend, accounts, authentication, or desktop wrapper.
- User progress and settings stay in `localStorage`; tarkov.dev caches stay in IndexedDB. Do not mix them or change storage keys, migrations, or import/export compatibility without an approved design.
- Vue Router uses history mode and `public/_redirects` provides the production SPA fallback. `?overlay=tasks` is a separate streaming-overlay entry path.

## Repository Map

- `src/components/` contains SFCs; `src/composables/` owns singleton state, persistence, and API access; `src/logic/` contains transformations; `src/data/` contains constants and content; `src/router/` owns routes.
- `public/` contains static production assets and the Cloudflare Pages fallback. Do not edit generated `dist/`, `.vite/`, or `node_modules/`.
- `docs/decisions/` contains durable rationale. `docs/handoffs/` is for active or blocked persisted work; completed records are archived. `.docs/` contains legacy design references read only when relevant.

## Commands

Run commands from the repository root:

```text
npm ci              clean install from package-lock.json
npm run dev         Vite development server
npm run build       production build to dist/
npm run preview     preview the production build
```

The repository exposes `npm test` for the Node built-in test runner. No lint, format, typecheck, or repository CI command exists. Report those limitations; do not invent commands.

## Scope and Autonomy

- Precedence is runtime and safety policy, explicit user policy, this durable policy, then the current task. Repository facts override shared defaults.
- The outcome defines scope; named files are starting points unless explicitly bounded. Make the smallest correct reversible change and reuse existing code, browser APIs, and platform capabilities first.
- Preserve unrelated changes. Treat unexpected diffs as unknown and stop only when overlap cannot be resolved safely.
- Preserve the browser-only Vue architecture, SFC/Composition API patterns, singleton state, routing, accessibility, responsiveness, and established UI unless the outcome changes them.
- Preserve the tarkov.dev five-minute request cooldown, twenty-hour automatic refresh interval, bounded GraphQL fallback, and last-known-good IndexedDB behavior. Do not add automatic retries, abusive polling, or an unapproved proxy.
- Keep dependencies minimal. Report required dependency, build, or configuration changes.
- Do not inspect or reproduce protected information unless required. Do not edit `.env`, credentials, local settings, browser runtime data, or production data unless explicitly authorized.

## Approval Gates

Stop before destructive live-data changes, unauthorized security or exposure changes, discarding unrelated work, or an unsettled material product, compatibility, persistence, deployment, or architecture choice.

Do not commit, push, merge, publish, deploy, restart, change hosted configuration, the Pages branch/domain, analytics, or exposure unless authorized. Do not request duplicate approval for an explicitly requested operation.

## Delegation

- Before implementation, classify the initial route from acceptance evidence as `small-primary` for small or transfer-negative work, `bounded` for settled multi-step work with one verifiable writer, `adaptive` when unresolved native/platform/runtime or cross-subsystem behavior is material, or `non-implementation` for analysis, design, review, or operations. This does not force delegation; reclassify only after a material scope change or contract reset.
- Reintegrate through the stable diff and verification evidence; do not repeat delegated discovery merely to re-establish context.
- The user selects the primary model. The primary owns interpretation, material design, approvals, integration, and communication.
- Keep one cohesive outcome and its corrections in the current task. Identify a fresh Codex task or chat boundary for a genuinely independent phase with its own acceptance and verification.
- Use native Codex subagents only when outcome, protected behavior, gates, and verification are settled and savings exceed handoff cost. Do not invoke Claude Code unless the user changes this policy.
- Before starting a writer, record exact acceptance mechanics, protected regressions and gates, focused and affected full checks, the stable-diff/reference sweep, and the required per-item evidence.
- Treat the writer's stable self-gate as a dispatch barrier for final acceptance review: do not start or retain a `bounded_reviewer` as the final acceptance reviewer while the implementation writer is still changing the candidate. If the implementation writer or a replacement writer changes the candidate after review begins, classify that review as diagnostic/pre-stable, complete the new writer self-gate, and start one fresh final review only when material risk still warrants review.
- For settled, predictable multi-step work, prefer one observable `bounded_implementer`. Choose `adaptive_implementer` directly when acceptance materially depends on an unresolved browser/platform lifecycle or cross-layer runtime contract; do not require a predictable bounded-writer failure first. Use `bounded_explorer` only for independent behaviorally read-only questions the writer cannot cheaply answer.
- Add one `bounded_reviewer` only for concrete material risk such as persistence, migration, dependency/build changes, exposure, broad behavior, ambiguous acceptance, or failed verification. Localized documentation and deterministic low-risk changes normally need only self-review.
- Only the primary session delegates. Delegated agents must not spawn agents. Keep one writer for overlapping files or behavior. A behaviorally read-only role remains read-only even if its tools technically permit writes.
- If a role cannot be selected or observed, keep work primary or use an observable equivalent and report the fallback.
- Ordinary delegation uses a compact inline goal, done criteria, context, constraints, and verification. Create a persisted `docs/handoffs/YYYY-MM-DD-<short-task>.md` only for substantial cross-session, interruption-sensitive, operationally risky, or separately executed work that needs durable resume conditions.
- Before success, the writer self-reviews the stable diff, sweeps stale references and protected regressions, runs focused checks and the affected full check once, and reports each acceptance item as `passed`, `blocked`, or `unmet` with evidence.
- At the second correction round for one cohesive outcome, or after two blocked or partial implementation returns caused by unresolved acceptance, authority, or environment, pause corrective delegation and reset the contract. Restate acceptance, protected boundaries, authority, environment, and evidence, then select one bounded writer only if the remainder is still bounded, an adaptive writer when warranted, approval or user input when authority is missing, or a fresh independent task boundary. Keep substantive corrections with that selected writer; the primary edits the delegated surface only for a demonstrably small transfer-negative correction or when delegation is unavailable.

## Definition of Done

- The requested outcome is complete, protected behavior remains intact, unrelated work is untouched, and the final diff contains only task-owned changes.
- Documentation-only changes pass `git diff --check` for the edited files plus a focused stale-reference scan.
- Source changes pass `npm run build`. Interactive, routing, overlay, responsive, or accessibility changes also require browser-level checks through `npm run dev`; use `npm run preview` when production output or SPA fallback behavior matters. Report checks that cannot run.
- Review for unexpected dependency, build, persistence, routing, analytics, Cloudflare, domain, or exposure changes. Report changed files, verification, material changes, preserved pre-existing changes, and exact blockers or resume conditions.

## On-Demand Documentation

- Read `docs/decisions/2026-07-22-tarkov-json-api.md` for API-source, validation, fallback, cache, and refresh constraints.
- Read `docs/decisions/2026-08-12-native-writer-routing-refinement.md` for direct adaptive routing and the correction-reset writer rule.
- Read an active or blocked document under `docs/handoffs/` only when the current task resumes that work.
- Read the applicable `.docs/` design note only for work on story data or the documented legacy feature area.
