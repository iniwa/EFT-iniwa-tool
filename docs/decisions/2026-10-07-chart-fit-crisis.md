# Chart fit cap and Crisis condition check — 2026-10-07

Scope: user-reported excessive detail-to-chart zoom and read-only Crisis condition association. Baseline `173edb448029a8733fed212ba3175a6eedc4fda8`; continuation branch `codex/eft-priority-chart-continuation`.

## Chart fit

Confirmed: automatic context fitting previously passed fit factors above 1 to the general 10–300% zoom clamp, enlarging small quest contexts up to 300%. Context and whole-graph fitting now cap the requested factor at 1; larger contexts shrink when required. Centering and padding are retained. Manual wheel/button zoom still reaches 300%; pan and return navigation are retained.

Verification covers tiny context/whole graph, large prerequisite/successor context, narrow viewport, manual 300% zoom, and detail → chart → Back restoring the same task and opener. Existing actual FlowchartView integration, wheel and pan checks are included. Browser visual QA remains unavailable after the previously recorded CUA initialization failure; renderer tests are not visual acceptance.

## Crisis: separate finding

Source: existing local fixed snapshot `C:/Users/iniwa/AppData/Local/Temp/eft-continuation-data.json`, retrieved `2026-10-07T06:52:30.705Z`, regular/en, via `fetchJsonBundle` / `convertMainData`. No new data request or browser progress access was made.

- Confirmed task: Crisis `60e71c48c1bfa3050473b8e5`; trader Therapist `54cb57776803fa99248b456e`; `minPlayerLevel: 38`.
- Confirmed normalized `traderLevelRequirements: []`, `taskRequirements: []`; `traderRequirements` is not a separate field in the converted shape.
- Confirmed additional condition: condition ID `6a56928eb6f60e911714b7d5`, type `globalVariable`, variable ID `6a56925b1c30ba5a77c7c518`, comparison `>=`, value `1`.
- Source reference stored on task: `https://escapefromtarkov.fandom.com/wiki/Crisis` (not fetched in this check).
- Adapter maps raw `traderRequirements` into normalized `traderLevelRequirements`; the original raw bundle was not retained. LL4 is not separately represented in this saved normalized task.
- User-reported: Crisis unlocks at Therapist LL4. This is useful evidence for source reconciliation, but no local source directly associates the opaque variable with LL4.
- Unresolved: the variable's actual semantics, whether upstream data omitted LL4, and version/mode applicability of the reported LL4 condition. No semantic label, new eligibility condition, or deduplication was added by correlation. Existing LL conditions remain in details/eligibility and outside the chart.

Validation: focused navigation/viewport tests 16/16 passed. Full suite 82/82, Vite production build to Temp, and git diff --check passed. The existing large-chunk build warning remains. Exact Edit deployment is in the execution receipt. Version remains 3.3.1; main remains unapproved.
