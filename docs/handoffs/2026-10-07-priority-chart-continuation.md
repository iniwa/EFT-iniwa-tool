# Priority items and chart continuation — 2026-10-07

Scope: priority prerequisite correctness, Necessary Items view preference, chart-only PMC/LL removal, reconciliation of inherited unverified-condition display and Icebreaker research. Modifier and version changes are excluded. Version remains 3.3.1.

## Ownership and preserved candidate

Source owner thread `01a114b4-659e-7469-9c8d-5b0eaba8e0b7` was observed idle with its latest turn completed before editing. Parent explicitly transferred that owner's candidate. Continuation uses the same isolated worktree `D:/Git/EFT-iniwa-tool-codex-first-slice`, new branch `codex/eft-priority-chart-continuation`, based on accepted `4f297bbf661e3993a523853a77a1ded8665a5be1`.

The inherited tracked binary diff, all three untracked files and status were copied before editing to `C:/Users/iniwa/Documents/Codex/2026-10-07/task-9/prior-candidate`. Tracked patch SHA256: `8597028793B1DB6B3158847141E09BF35ED2C2E5E8AEA8C9343814FBC948EB55`; the backup files are retained for exact recovery. The seven tracked files were FlowchartView, TaskModal, flowchartLogic, taskObjectiveLogic, ammo-task-modal, core-runtime and ui-logic tests. The untracked files were globalConditionLabels, its test and Icebreaker research. All were reviewed and reused. Original dirty `D:/Git/EFT-iniwa-tool` was not edited or reset.

## Actual data and reproducible synthetic states

No fixed task dataset was present in the worktree or prior owner's workspace. A single bounded request through existing `fetchJsonBundle('regular', 'en')` and `convertMainData` produced 504 actual tasks, fixed in Temp at `2026-10-07T06:52:30.705Z`. No browser storage, progress or API cache was read or changed. Source is `https://json.tarkov.dev/regular/tasks` with the adapter's English/item/trader dictionaries. Selected exact records are test-only in `tests/fixtures/priority-real-tasks.json`; its provenance includes the complete converted snapshot SHA256. This is regular-mode data at that retrieval time, not a claim about another player's cached dataset, game mode or later revisions.

All states below are synthetic: unlisted tasks are unstarted and statuses are empty unless stated. Quantities are remaining full-task giveItem quantities; findItem objectives are not counted twice.

| Case | Priorities | Completed | Mandatory tasks and quantities |
|---|---|---|---|
| Simple chain | Sanitary Standards - Part 2 `596a204686f774576d4c95de` | none | Goal + Sanitary Standards `59689ee586f7740d1570bbd5`; Gas analyzer `590a3efd86f77437d351a25b` FIR **4**, 2 per task. If Sanitary Standards is completed, FIR **2**. |
| Shared prerequisite | The Blood of War - Part 2 `5b47876e86f7744d1c353205` + Sew it Good - Part 2 `5ae4497b86f7744cf402ed00` | Fuel Crisis `5ae448f286f77448d73c0131` | Shared Sew it Good - Part 1 `5ae4495086f77443c122bc40` once. FIR: Fuel conditioner `5b43575a86f77424f443fe62` **4**; WARTECH TV-109 + TV-106 `59e7643b86f7742cbf2c109a` **2**; BlackRock `5648a69d4bdc2ded0b8b457b` **2**; Ski hat with holes for eyes `5ab8f20c86f7745cdb629fb2` **1**; Pilgrim `59e763f286f7742ee57895da` **1**. |
| Active bridge + ambiguous state | Out of Curiosity `597a160786f77477531d39d2` | none | Chemical - Part 4 `597a0f5686f774273b74f676` must be active; it requires Chemical - Part 3 `597a0e5786f77426d66c0636` complete. Chemical - Part 2 `597a0b2986f77426d66c0633` accepts active OR complete; both require Chemical - Part 1 `5979f9ba86f7740f6c3fe9f2` complete. Count goal + Parts 3 and 1; normal Dorm room 220 key `5780cfa52459777dfb276eb1` **1**. Parts 4/2 handovers are not mandatory. Part 2 remains flagged as alternative. |

Cases 1/2 passed on the accepted implementation. Case 3 previously returned only Out of Curiosity and zero items: activation prerequisite bridges were not traversed. The small fix traverses active/complete activation prerequisites separately from the set of tasks whose own completion consumables are counted. Already-active bridges stop upstream traversal; completing Part 4 conflicts with Out of Curiosity's active-only requirement. Cycles, missing IDs, incompatible statuses and complete/failed alternatives retain explicit uncertainty handling.

## View preference

`shoppingListMode` is now a singleton UI preference in `useUserProgress`, persisted under `eft_shopping_list_mode`, consistent with existing global UI filters. It survives route/component remount and page reload in the same browser profile/origin, shared across game modes. Only `priority` is accepted as priority; missing, invalid JSON and unsupported values default to `all`. Priority assignments, task status and collection keys do not change when selecting the view. The setting is included in Settings reset. No backup format or cross-device synchronization was added.

## Chart and distance evidence

PMC-level and trader loyalty-level gates are omitted only by `buildFlowchartGateGraph`; task data, TaskModal requirements and `evaluateTaskAvailability` remain intact. Trader reputation, dialogue, global variables, faction, delays and other gates remain visible. Across the fixed 504 tasks, task edges remain **222**; condition nodes change **98 → 44** and condition edges **561 → 213** (54 PMC/LL gates removed).

FlowchartView builds one `graph LR`, task edges retain their actual status labels, with no quest-family subgraphs or per-series grouping. Mermaid's Dagre ordering/ranks apply to the entire graph. Shared gates can link otherwise independent task chains and add rank/crossing constraints; LR alone does not promise adjacent pixels for sequential quest names. Branches/merges and remaining shared conditions can still separate connected tasks.

The actual installed Dagre engine was run on the 11 real fixture tasks with fixed 200×40 node dimensions and 50 rank/node spacing, preserving all task and gate edges. Baseline/candidate comparison: width **1450 → 1450**, height **600 → 320**. Chemical Parts 1/2/3/4/Out of Curiosity candidate positions have consecutive x values 350/600/850/1100/1350, all y=210; baseline y values were 580/580/535/425/345. Shared Sew it Good prerequisite feeds two goals, which retain the same next x rank and separate rows. These are engine/graph tests with controlled dimensions, not actual SVG measurements or visual QA; no universal spacing fix is claimed. No invented sequencing edges or family grouping were added.

## Condition meanings and Icebreaker

Inherited research found no verified opaque-variable meaning. `.docs/story-wiki-data.md` is an April 2026 source summary with no verified Icebreaker sequence or ID mapping. The technical variable/comparison/value remains available in collapsed details; unknown meanings remain explicitly unverified, keys and task edges remain exact, automatic:false is preserved. No guessed semantics or story progress IDs were added.

English Wiki recheck: `https://escapefromtarkov.fandom.com/wiki/Icebreaker_(story_chapter)` was inaccessible; `https://escapefromtarkov.fandom.com/wiki/Icebreaker` returned 402 through the browsing tool. The earlier robots/official-site failures are retained in `docs/icebreaker-verification-2026-10-07.md`. Icebreaker sequence/requirements and human meanings of opaque IDs remain blocked pending accessible source evidence. The existing research is saved, not represented as completed story content.

## Validation

Focused tests: actual-data quantities/IDs/deduplication, activation bridges and cycles, chart-only filtering with eligibility preserved, actual Dagre ranks, actual FlowchartView real graph inputs, actual ResultList remount, fresh-session reload/default/malformed preference and reset.

Actual browser QA: not run. `cua.getState()` failed during initialization with “trusted Node process exited unexpectedly; kernel reset”. No security or browser profile changes were used to bypass it. Vue renderer substitutes and controlled Dagre tests are separate evidence.

Validation succeeded: full Node test suite **79/79**, Vite production build to an isolated Temp directory, and git diff --check. Build retains the existing large-chunk warning. Test/build logs: Temp/eft-continuation-tests.log and Temp/eft-continuation-build.log. Gitea Edit and GitHub Edit were both 4f297bb before publication. Exact commit/deployment receipt is reported by the continuation's final execution response. Main remains unapproved.
