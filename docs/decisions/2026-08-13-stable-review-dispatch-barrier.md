# Establish the stable-review dispatch barrier

Date: 2026-08-13

Status: Accepted

## Decision

The implementation writer's stable self-gate is a dispatch barrier for final
acceptance review. Do not start or retain a `bounded_reviewer` as the final
acceptance reviewer while the implementation writer is still changing the
candidate.

If the implementation writer, or a replacement writer, changes the candidate
after review begins, classify the earlier review as diagnostic/pre-stable. The
writer must complete a new stable self-gate; only then may one fresh final
review start, and only when the material-risk threshold still warrants
independent review.

## Rationale

Two consecutive cross-project WTS tasks showed final review beginning before
adaptive writers had finished their candidate. One reviewer had a
2135.564-second wall span but approximately 405 seconds across all six
completed active windows; its final two monitored windows used 85.174 active
seconds across a 277.566-second span. This is external operational evidence
about dispatch timing, not an EFT product defect and not a reason to add
execution telemetry.

The barrier keeps review evidence aligned with the candidate that can actually
be accepted, avoids treating a moving-candidate review as final acceptance,
and preserves the existing writer routing, correction-reset, approval gates,
and review-threshold rules.

## Scope and non-goals

This decision changes delegation sequencing only. It does not adopt JSONL
telemetry, alter storage or API behavior, broaden reviewer use for localized
documentation, or change deployment, security, or external-system authority.
