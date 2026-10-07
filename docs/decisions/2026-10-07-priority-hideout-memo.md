# Priority hideout inclusion and memo restore — 2026-10-07

Confirmed defect retained from 95deaf8: priorityDisplayLists omitted hideoutFir and hideoutBuy. The fix starts from existing displayLists and overrides only taskFir, collector, and taskNormal. Existing hideout category UIDs, source names, completion quantities, FIR separation, and collected toggles are preserved. No hideout enable switch exists; showMaxedHideout filters progress-input rows only.

Memo correction: the 3.4.0 concise quick-reference sections are restored verbatim from 86f135ea26db24c4e76879070058e018070d9477. Their practical entries and estimated tips remain in place. No game-fact refresh is claimed. The exact original source, table values, formulas, item names, task references, per-section hashes, and verified public file links are in docs/research/2026-10-07-original-built-in-memo-snapshot.md for independent review.

95deaf8 removed/replaced all seven original lookup sections with procedural guidance, changed accordion names and the memo introduction. Its memo copy is fully reversed. The hideout item-list correction remains.

Version is restored to 3.4.0 in package, lockfile, APP_VERSION, README, AppNotice, and docs/improvements. Edit-only iterations do not bump the version. Personal memo data and accordion storage remain untouched.

Validation: all 8 memo source files match the verified 3.4.0 baseline; version consistency and git diff --check passed; full suite 88/88 and production build passed. Existing >500 kB chunk warning remains. No external game claims were researched or changed in this restore turn.

Follow-up: prepared memo research now updates the original lookup cells at version 3.4.0, preserving their breadth and practical estimates. See docs/research/2026-10-07-memo-research-applied.md for sources, older/unverified claims, actual task-link IDs and validation. The restore above is a historical checkpoint; the exact original snapshot is preserved.
