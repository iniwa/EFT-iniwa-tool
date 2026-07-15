# CLAUDE.md

## Purpose

This file contains Claude Code execution rules for `EFT-iniwa-tool`. `AGENTS.md` owns design intent, delegation policy, and Codex review.

## Read Before Editing

Read:

- `AGENTS.md`.
- The supplied handoff, when present.
- `README.md`, `package.json`, and every file listed for inspection.
- Relevant active records under `docs/` and applicable legacy design notes under `.docs/`.

## Project Facts

- Vue 3.5 and Vite 8 single-page browser application.
- Vue Router uses history mode.
- User data is stored in `localStorage`; tarkov.dev API cache data is stored in IndexedDB.
- There is no backend, authentication service, automated test suite, linter, or formatter configured.
- Production is a Cloudflare Pages static deployment.

## Execution Rules

- Implement and report only the current independently verifiable slice.
- A handoff defines task scope but does not override durable constraints in `AGENTS.md`.
- If the listed files are insufficient to reach the first scoped edit, stop and report the missing discovery or proposed split instead of broadening the task.
- Return unresolved requirements and design choices to Codex.
- Stop before adding a dependency or changing build tooling, packaging, CI/CD, deployment, analytics, custom domains, or external exposure unless the task explicitly includes it.
- Subagents are optional and limited to clearly parallel mechanical work within the same files, scope, and constraints.
- Preserve unrelated user and other-agent changes. Treat unexpected diffs as having unknown authorship and exclude them from the current task.
- Do not commit, push, or deploy unless explicitly requested.

## Project Constraints

- Keep the application backend-free unless the approved design says otherwise.
- Preserve storage keys, migrations, import/export compatibility, and the split between `localStorage` user data and IndexedDB API cache data.
- Preserve the tarkov.dev request cooldown and avoid automatic or abusive polling.
- Preserve overlay behavior, including `?overlay=tasks`.
- Keep `public/_redirects`; direct routes require the SPA fallback.
- Follow existing Vue single-file component, Composition API, composable-singleton, naming, and styling patterns.
- Prefer small, readable changes and minimal dependencies.

## Protected Files and Data

Do not edit or delete unless explicitly required:

- Secrets, credentials, `.env` files, keys, and local settings.
- Browser runtime data.
- Generated `dist/`, `.vite/`, `node_modules/`, and heavy artifacts.
- Cloudflare Pages branch, domain, analytics, and deployment configuration outside an approved deployment task.

## Verification

Run the smallest check that demonstrates the scoped change:

- Documentation-only changes: `git diff --check` and a focused reference scan.
- Source changes: `npm run build`.
- Interactive or routing changes: run `npm run dev`, exercise the affected behavior in a browser, check the console, and inspect neighboring routes where regression risk exists.
- Use `npm run preview` when the production build output or SPA routing needs verification.

No automated tests or lint command are configured. Report that limitation rather than inventing a check.

## Report

Report:

- Changed files.
- Concise summary.
- Verification commands and results.
- Blocked checks.
- Subagent usage.
- Design questions for Codex.
