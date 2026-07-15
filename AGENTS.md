# AGENTS.md

## Purpose

This is the Codex-side working agreement for `EFT-iniwa-tool`. It records design intent, delegation policy, review rules, and durable project constraints. `CLAUDE.md` contains Claude Code execution rules.

## Project Summary

- Static browser tool for Escape from Tarkov task, hideout, key, ammo, item, memo, and story tracking.
- Vue 3.5 and Vite 8 single-page application with no backend.
- User data stays in `localStorage`; tarkov.dev API cache data stays in IndexedDB.
- Production is hosted on Cloudflare Pages. Preserve the existing deployment branch, domain, SPA fallback, and external exposure unless a task explicitly changes them.

## Read First

Before meaningful work, inspect:

- `CLAUDE.md`.
- `README.md`.
- `package.json` and the affected files under `src/` or `public/`.
- Relevant active records under `docs/` and any applicable legacy design note under `.docs/`.

## Model and Role Policy

- Use GPT-5.3-Codex-Spark (`gpt-5.3-codex-spark`) proactively, when available, for low-risk, well-scoped, independently verifiable supporting work that requires no material design judgment or source-code implementation.
- GPT-5.6 Terra (`gpt-5.6-terra`) or Sol (`gpt-5.6-sol`) owns requirements and design. Whenever Terra is used, set its reasoning level to `high`. Prefer Sol for substantial ambiguity, risk, or cross-boundary reasoning.
- After design is fixed, delegate source-code implementation first to Claude Code Sonnet 5 at effort medium from the repository root.
- Only when Sonnet 5 is unavailable because of usage limits or service availability, use GPT-5.6 Luna (`gpt-5.6-luna`) with reasoning level `max` for the same implementation slice.
- Implementation failure, failed verification, or a design question is not model unavailability. Return it to Codex.
- Apply this policy to every coordinating Codex model and its subagents. Do not create coordinator-specific exceptions.
- Codex may retain requirements, design, read-only investigation, synthesis, review, and small documentation-consistency changes in one context.

## Durable Project Rules

- Do not add a backend, account system, or authentication unless explicitly approved.
- Preserve browser-local persistence, existing storage keys and migrations, and import/export compatibility.
- Preserve overlay behavior, including the `?overlay=tasks` entry path.
- Respect the tarkov.dev GraphQL cooldown and do not add abusive or automatic polling.
- Preserve Vue single-file components, Composition API patterns, and the existing composable-singleton state approach unless a design explicitly changes them.
- Keep `public/_redirects`; Vue Router history mode requires the SPA fallback for direct routes.
- Do not change Cloudflare Pages configuration, deployment branch, custom domain, analytics wiring, or external exposure outside an approved task.
- Keep dependencies minimal and do not introduce new build tooling without an approved design.

## Safety and Scope

- Preserve unrelated user and other-agent changes. Treat unexpected diffs as having unknown authorship and keep them outside the current task or commit.
- Do not edit secrets, credentials, `.env` files, local settings, browser runtime data, or generated `dist/`, `.vite/`, and heavy artifacts unless explicitly required.
- Do not add dependencies or change build tooling, packaging, CI/CD, deployment, or external exposure outside the approved scope.
- Do not commit, push, or deploy unless explicitly requested.

## Handoff Workflow

- Keep work in Codex when its main value is policy, design, review, synthesis, read-only investigation, or a small documentation-only correction.
- For substantive implementation, create `docs/handoffs/YYYY-MM-DD-<short-task>.md` with the goal, background, files to inspect, files to edit, constraints, non-goals, verification, and expected report.
- One handoff covers one cohesive, independently verifiable change and its direct verification. Run unresolved discovery as a separate read-only slice.
- Size the slice so the first intended edit is reachable after reading the listed files. Do not combine broad discovery, unresolved design, and implementation.
- If a handoff times out before its intended edit, do not rerun it unchanged. Narrow the behavior, files, and verification first.
- Sonnet 5 implements only the approved slice. Luna at reasoning level `max` may implement that same slice only under the model-unavailability condition above.
- Codex reviews the report and diff before preparing a later slice. Material design questions return to Terra or Sol.
- Keep only active or blocked handoffs in `docs/handoffs/`. Move a handoff to `docs/handoffs/archive/` only after implementation, verification, review, required runtime work, and follow-up are complete.

## Codex Review

Verify that:

- Only approved files and behavior changed and unrelated diffs remain untouched.
- Browser persistence, API cooldown, overlay, routing, import/export, and deployment constraints were preserved.
- No unexpected dependency, build, CI/CD, deployment, domain, analytics, or external-exposure change appeared.
- Verification supports the scoped change and blocked checks are explicit.
- Reusable discoveries are recorded in the correct document without adding history to this file.

## Documentation Lifecycle

- Keep `AGENTS.md` limited to short, current, durable rules and links.
- Put detailed decisions, evidence, rejected options, and rollout history in `docs/decisions/`.
- Move a decision to `docs/decisions/archive/` only after it is fully implemented and no longer needed as current guidance.
- Put reusable procedures in an appropriate `docs/` location.
- Do not rewrite completed handoffs or archived decisions merely to match a newer shared policy.
