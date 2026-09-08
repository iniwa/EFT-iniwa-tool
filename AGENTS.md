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

Default to primary design, implementation, and final acceptance at any task size. Delegate autonomously within existing authority only when replacing primary work lowers expected total effort, including handoff, communication, waiting, integration, verification, and corrections, or a named material risk or existing mandatory independent verification gate warrants it. Size or technical uncertainty alone does not justify delegation; routine direct work needs no per-task justification.

- Before implementation, decide whether to delegate, then select the role and initial route: `small-primary` for direct work of any size, `bounded` for a settled delegated outcome, `adaptive` for delegated material technical uncertainty, or `non-implementation` for analysis, design, review, or operations. Reclassify only after a material scope change or contract reset.
- The user controls the primary model and effort. The primary owns interpretation, material design, approvals, integration, final acceptance, and communication. Keep one outcome and its corrections together; use a fresh task boundary for a genuinely independent phase with separate acceptance and verification.
- Settle the outcome, protected behavior, gates, and verification before delegation; require an independently verifiable result. Record exact acceptance mechanics, protected regressions, focused and required affected checks, the stable-diff/reference sweep, and per-item evidence in the handoff.
- When delegation is justified, use one `bounded_implementer` for settled cohesive work or `adaptive_implementer` directly for material browser/platform lifecycle or cross-layer runtime uncertainty. Do not first force a predictable bounded-writer failure. Use `bounded_explorer` only for independent read-only questions the writer cannot cheaply answer.
- Use `bounded_reviewer` only for a named material risk, such as persistence, migration, dependency/build changes, exposure, broad behavior, ambiguous acceptance, or failed verification, or an existing mandatory independent review gate. Localized low-risk documents normally need self-review only. Preserve existing mandatory multi-reviewer gates.
- Only the primary delegates; children do not redelegate. Keep one writer for overlapping files or behavior. Read-only roles remain read-only even if write tools are exposed. If role selection is unavailable or unobservable, use the primary or an observable equivalent and report the actual route. Claude Code remains unapproved unless the user changes policy.
- Ordinary delegation uses a compact inline goal, done criteria, context, constraints, and verification. Persist a handoff only for substantial cross-session, interruption-sensitive, operationally risky, or separately executed work needing durable resume conditions.
- The writer owns related discovery, implementation, verification, and corrections. Before acceptance review, self-review the stable diff against every criterion, stale reference, and protected regression; run focused and required affected checks and return per-item passed/blocked/unmet evidence. A full affected check runs once when required. Unchecked required items are not success.
- Candidate changes after review starts invalidate its acceptance evidence. Restabilize, then request one fresh final review only if risk or an existing gate still requires it. Consolidate findings for the same writer and integrate from the stable diff and evidence without repeating discovery merely to restore context.
- While children run, continue useful work within ownership and parallelism rules or wait for notifications. Do not add research/checks, inspect changing candidates, or repeat liveness polling, rereads, or state updates merely to fill the wait. Respond to errors, inconsistent state, user steering, and host progress rules.
- Reassess ownership when primary execution lowers remaining total effort or delegation is unavailable. The primary may reclaim any size before correction thresholds after confirming child writes have stopped and ownership has returned, then resetting acceptance, protected boundaries, authority, environment, and evidence.
- At the second correction round for one outcome, or after two blocked/partial implementation returns caused by unresolved acceptance, authority, or environment, pause corrective delegation and reset that contract. Choose primary execution, or justified delegation to the same bounded writer if still bounded or an adaptive writer for material technical uncertainty. Resolve missing authority with user input; keep substantive corrections with one selected writer. Verification and safe blocked work remain protected.

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
