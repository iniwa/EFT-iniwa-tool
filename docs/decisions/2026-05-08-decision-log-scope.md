# Decision Log Scope

## Context
`AGENTS.md` is the active execution policy for repository work. If it accumulates long alternatives, background notes, and task-specific reasoning, it becomes harder for the primary session and any delegated agent to use.

## Decision
Keep `AGENTS.md` short, current, and durable.

Do not add a running decision log or `Alternatives Considered` as a default heading in `AGENTS.md`.

When rejected options or long background will help future work, put them in `docs/decisions/` and keep only the actionable rule, constraint, or conditional link in `AGENTS.md`.

## Reason
This keeps `AGENTS.md` useful as a quick source of rules while still preserving longer design history in the repository.

## Operating Rule
- Put durable, future-facing rules in `AGENTS.md`.
- Put longer background, rejected options, and detailed reasoning in `docs/decisions/`.
- Reference the docs entry from `AGENTS.md` only when future sessions need that detail.
