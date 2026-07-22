# CLAUDE.md

## Purpose

This file contains Claude Code execution rules for `EFT-iniwa-tool`. `AGENTS.md` owns design intent, delegation policy, and Codex review.

## Read Before Editing

Before editing, read:

- `AGENTS.md` and this file.
- The supplied handoff or equivalent inline task scope permitted by `AGENTS.md`.
- `README.md`, `package.json`, and every file listed for inspection.
- Relevant active records under `docs/` and applicable legacy design notes under `.docs/`.

## Project Facts

- Vue 3.5 and Vite 8 single-page browser application managed with npm and `package-lock.json`.
- Vue Router uses history mode; `public/_redirects` supplies the production SPA fallback.
- `?overlay=tasks` is a separate browser entry path for the streaming overlay.
- User progress and settings are stored in `localStorage`; tarkov.dev API cache data is stored in IndexedDB.
- There is no backend, authentication service, desktop executable, wrapper, or installer.
- The Vite application must be served with `npm run dev` for development; directly opening `index.html` is not a supported execution path.
- Production is a Cloudflare Pages static deployment.
- No automated test suite, linter, formatter, or repository CI configuration is currently tracked.

## Instruction Handling

- Apply the instruction precedence defined in `AGENTS.md`.
- The handoff or equivalent inline scope is the approved task scope. It may narrow durable project constraints but may not weaken them.
- If instructions conflict or a required choice is unresolved, stop and return the conflict or design question to Codex instead of guessing.

## Execution Rules

- If the user writes in Japanese, respond in Japanese. Preserve the repository's established language for documentation, comments, identifiers, logs, and user-facing text unless the task changes it.
- Before editing, capture `git status --short`. After editing, compare the final status and diff with that baseline; do not reset, clean, stage, or rewrite pre-existing changes.
- Implement and report only the current independently verifiable slice. Wait for Codex review before starting a later slice.
- If the listed files are insufficient to reach the first scoped edit, stop and report the missing discovery or proposed split instead of broadening the task.
- Stop before adding a dependency or changing build tooling, packaging, CI/CD, deployment, analytics, custom domains, or external exposure unless the task explicitly includes it.
- Subagents are optional and limited to clearly parallel mechanical work within the same files, scope, and constraints.
- When a delegated Windows command would contain non-ASCII instructions, keep the command line ASCII-only and put the instructions in a UTF-8 handoff file.
- Preserve unrelated user and other-agent changes. Treat unexpected diffs as having unknown authorship and exclude them from the current task unless confirmed.
- Do not commit, push, or deploy unless explicitly requested.

## Project Constraints

- Keep the application backend-free and browser-only unless the approved design says otherwise.
- Preserve storage keys, migrations, import/export compatibility, and the split between `localStorage` user data and IndexedDB API cache data.
- Use checked-in data or an explicitly authorized test fixture; do not substitute personal browser data for project inputs.
- Preserve the tarkov.dev request cooldown and avoid automatic or abusive polling.
- Preserve overlay behavior, including `?overlay=tasks`.
- Keep `public/_redirects`; direct routes require the SPA fallback.
- Follow existing Vue single-file component, Composition API, composable-singleton, naming, and styling patterns.
- Prefer small, readable changes and minimal dependencies.

## Protected Files and Data

- Do not inspect secrets, credentials, personal data, browser-local user progress, or imported/exported user backups unless their contents are strictly necessary for the approved task.
- Do not edit secrets, credentials, `.env` files, keys, local settings, browser runtime data, production data, generated `dist/`, `.vite/`, `node_modules/`, or heavy artifacts unless the approved task explicitly requires the change.
- Never reproduce secrets, credentials, personal data, user progress, backup contents, or private infrastructure values in prompts, handoffs, reports, or external tools.
- Do not change the Cloudflare Pages branch, domain, analytics, deployment configuration, or external exposure outside an approved deployment task.

## Verification

Run the smallest check that demonstrates the scoped change:

- Documentation-only changes: `git diff --check -- AGENTS.md CLAUDE.md` and a focused reference scan.
- Source changes: `npm run build`.
- Interactive or routing changes: run `npm run dev`, exercise the affected behavior in a browser, check the console, and inspect neighboring routes where regression risk exists.
- Use `npm run preview` when the production build output or SPA routing needs verification.

No automated test or lint command is configured. Report that limitation rather than inventing a check.

## Report

Report:

- Changed files and a concise summary.
- Verification commands and results, including blocked checks.
- Pre-existing changes preserved and any partial edits left in the worktree.
- Subagent usage.
- Design questions for Codex.
- If acceptance criteria are unmet, report `status=interrupted`, usable partial results, remaining scope, and the exact resume condition.
