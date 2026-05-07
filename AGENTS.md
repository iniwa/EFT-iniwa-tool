# AGENTS.md

## Purpose
This file is the Codex-side working agreement for `EFT-iniwa-tool`.

Codex uses this file to preserve design intent, decide whether work should stay in Codex or be handed off to Claude Code, and review implementation results.
Claude Code uses `CLAUDE.md` for execution rules.

## Project Summary
- Project name: `EFT-iniwa-tool`
- Purpose: Static browser tool for Escape from Tarkov task, hideout, key, ammo, and item tracking.
- Summary from project docs: Electron-based Escape from Tarkov support tool for local Windows use.
- Runtime target: Browser static app
- Repository path: `D:\Git\EFT-iniwa-tool`
- Stack: Vue 3, Vite, Bootstrap, Mermaid, marked, localStorage

## Base References
- Codex base: `D:/Git/CLAUDEmdStrage/_base/AGENTS.md`
- Claude Code base for Windows/local projects: `D:/Git/CLAUDEmdStrage/_base/CLAUDE_windows.md`
- Claude Code base for Raspberry Pi Docker projects: `D:/Git/CLAUDEmdStrage/_base/CLAUDE_docker.md`

## Role Split
Codex is responsible for:
- clarifying requirements, non-goals, and success criteria
- identifying change type and design risk
- preserving responsibility boundaries and design intent
- preparing scoped Claude Code handoffs when execution is clear
- reviewing Claude Code output against this file and the handoff
- recording durable decisions in `AGENTS.md` or `docs/*.md`

Claude Code is responsible for:
- following the current Codex handoff and `CLAUDE.md`
- editing only allowed files unless it explains why more files are required
- running requested verification where possible
- reporting changed files, summary, verification results, blocked checks, and design questions

## Decision Rule
Keep work in Codex when:
- requirements are ambiguous
- design intent or responsibility boundaries may change
- the task is small enough to edit and review in one context
- the main value is planning, review, or documentation consistency

Hand off to Claude Code when:
- goal, files, constraints, non-goals, and verification are clear
- the task is mostly implementation or mechanical editing
- the allowed edit scope can be stated explicitly
- Claude Code tooling or iteration speed is useful

## Project-Specific Guidance
- Use Windows / local tool guidance from `D:/Git/CLAUDEmdStrage/_base`.
- Respect the existing package manager and scripts.
- Do not introduce new build tooling unless explicitly requested.

## Files To Inspect First
- CLAUDE.md
- CLAUDE_ja.md
- README.md
- src/
- package.json

## Files Claude Code May Edit In Scoped Tasks
- src/
- index.html
- package.json
- vite.config.js

## Constraints
- No backend; persistence is localStorage.
- Respect tarkov.dev GraphQL cooldown and avoid abusive polling.
- Do not add a backend or authentication unless explicitly requested.
- Keep overlay and import/export compatibility in mind.
- Do not commit automatically unless explicitly requested.
- Do not revert user or other-agent changes unless explicitly requested.
- Do not edit secrets, credentials, `.env`, local runtime data, or generated heavy artifacts unless explicitly requested.

## Handoff Template
When Codex hands work to Claude Code, create `docs/handoffs/YYYY-MM-DD-<short-task>.md`. Create the `docs/handoffs/` directory if it does not exist. Use this format in that file.

```md
Read AGENTS.md, CLAUDE.md, and this handoff file before implementation.
If implementation would violate constraints or require files outside this handoff, stop and ask before editing.

## Goal
...

## Background
...

## Files To Inspect
- ...

## Files To Edit
- ...

## Constraints
- ...

## Non Goals
- ...

## Verification
- ...

## Expected Report
- Changed files
- Summary
- Verification results
- Blocked checks
- Design questions for Codex
```

## Codex Review Checklist
After Claude Code returns, review:
- Did the diff stay inside the handoff?
- Did any file outside `Files To Edit` change? If yes, was it necessary?
- Did the implementation preserve stated constraints and non-goals?
- Did it introduce dependencies, build tooling, packaging, CI/CD, deployment changes, or external exposure changes unexpectedly?
- Did it touch secrets, credentials, `.env`, local settings, or runtime data?
- Did verification run, and are blocked checks explained?
- Does any discovery need to become a new `AGENTS.md` or `docs/*.md` decision?

## Knowledge Persistence
- Use `AGENTS.md` for durable workflow and design decisions.
- Use `docs/*.md` for reusable technical notes, architecture details, procedures, and project-specific knowledge.
- Before meaningful work, check relevant existing docs.
- Do not silently encode durable design decisions only in code.

## Decision Log

### YYYY-MM-DD: Decision title

Context:
- What problem or requirement caused this decision?

Decision:
- What did we decide?

Reason:
- Why is this the right tradeoff now?

Constraints Introduced:
- What should future implementation preserve?

Do Not Change Casually:
- What would cause design drift if changed without review?
