# Refine native writer routing

Date: 2026-08-12

Status: Accepted

## Decision

Use one `bounded_implementer` for settled and predictable multi-step work, but
select `adaptive_implementer` directly when acceptance materially depends on an
unresolved browser/platform lifecycle or cross-layer runtime contract. Do not
spend a bounded-writer attempt merely to prove that adaptive reasoning is
required.

At the second correction round, or after two blocked or partial implementation
returns caused by unresolved acceptance, authority, or environment, reset the
contract before delegating again. Select one writer for the remaining
substantive corrections. The primary edits that surface only when the remaining
fix is demonstrably small and transfer-negative or delegation is unavailable.

## Rationale

Recent cross-project execution evidence showed a bounded native-lifecycle
implementation return partial before the correction circuit breaker selected
an adaptive writer, which then passed the full acceptance matrix. The circuit
breaker preserved correctness, but direct routing avoids a predictable failed
handoff when the lifecycle or cross-layer requirement is already explicit.

This project does not currently adopt JSONL execution telemetry, so this
decision adds no worklog or active-task-monitoring requirement. It does not
change the user-selected primary model, review thresholds, approval gates,
storage compatibility, API cooldowns, or deployment authority.
