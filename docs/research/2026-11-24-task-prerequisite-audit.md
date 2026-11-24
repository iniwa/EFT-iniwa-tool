# Task prerequisite audit

On 2026-11-24 JST, the Tarkov.dev JSON task endpoints returned the following prerequisite records. Each game mode was fetched once for this audit.

| Mode | Tasks | Prerequisites | Complete | Active | Failed | Active or complete | Complete or failed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Regular PvP | 503 | 222 | 195 | 12 | 2 | 10 | 3 |
| PvE | 499 | 221 | 197 | 12 | 2 | 7 | 3 |
| Seasonal PvP | 462 | 184 | 162 | 9 | 2 | 8 | 3 |
| Total | 1,464 | 627 | 554 | 33 | 6 | 25 | 9 |

Every referenced ID resolved within its mode. The returned graph had no duplicate prerequisite IDs within a task, cycles, or explicit grouped alternatives. One record per mode included additional notes. A task requires every prerequisite entry, while each entry accepts any of its listed statuses. For example, all three modes require Chemical - Part 4 to be active for Out of Curiosity, and failed for its failure follow-up.

The task list, detail view, chart labels, priority requirements, and overlay chain use the same interpretation of prerequisite statuses. Overlay chaining compares eligibility before and after completion and respects configured trader requirements. Bulk progress setup stops on contradictory or unverified prerequisites. Existing cache records without a status retain the historical completion default. The GraphQL fallback now requests the status field. The live legacy endpoint returned HTTP 422 with a server-unavailable message during the audit.

This audit covers relationships exposed by the API. Story gates and opaque game variables require separate evidence. No quest IDs or prerequisite relationships were overridden, and no game-client behavior was independently observed.

Sources

- [Tarkov.dev API documentation](https://tarkov.dev/api)
- [Regular PvP task data](https://json.tarkov.dev/regular/tasks)
- [PvE task data](https://json.tarkov.dev/pve/tasks)
- [Seasonal PvP task data](https://json.tarkov.dev/pvp-season/tasks)
