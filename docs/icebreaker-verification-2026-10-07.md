# Icebreaker and opaque condition verification

Date: 2026-10-07 (UTC). Scope: requested Icebreaker story addition and game-variable display only.

## Sources attempted

| Source | Exact URL | Access result |
|---|---|---|
| English EFT Wiki | https://escapefromtarkov.fandom.com/wiki/Icebreaker | Retrieval failed: restricted URL |
| English EFT Wiki story page candidate | https://escapefromtarkov.fandom.com/wiki/Icebreaker_(story_chapter) | Domain blocked by robots.txt (non-retryable). Page existence and contents were not confirmed. |
| Official news | https://www.escapefromtarkov.com/news | Retrieval failed |
| Official game site | https://www.escapefromtarkov.com/ | Retrieval failed |

Search results did not provide a usable Icebreaker-specific source. No robots restriction, login, security setting, API cooldown, or hosted configuration was bypassed.

## Confirmed local facts

- Existing manual story chapters use stable local chapter/step IDs in `storyChaptersMain.js` and `storyChaptersSide.js`; saved `storyProgress` and choice values must remain unchanged.
- No Icebreaker chapter or verified opaque-variable ID mapping exists in the inspected story sources or `.docs/story-wiki-data.md`.
- The JSON adapter preserves `otherRequirements[].variableId`, comparison and value. Task objectives use `globalVariable.id`. These are identifiers, not evidence of their meaning.
- Flowchart keys and edges remain tied to the exact variable and task IDs. Comparison/value details are retained; conditions continue to have `automatic: false`.

## Completed independent display change

Opaque variables are explicitly described as unverified game conditions. Technical ID, comparison and value remain available under native expandable details in task details and the chart. Per-chart numbering distinguishes unknown gates without inventing semantic labels. No semantic ID mapping, automatic availability rule or task-to-task edge was added.

## Blocked subset

No Icebreaker sequence, unlock rule, objective/task/item game IDs, choices, waits, quantities, game-version applicability or PvE/PvP distinction could be verified from the requested source. No chapter placeholder or guessed checklist was added. All opaque variable semantics remain unverified; names inferred from nearby tasks or ID spellings are not sufficient evidence.

To finish this subset, obtain the English Wiki source content (or an accessible source with the same facts), then match each claim to exact live IDs and record revision/access date, game version and mode. Relevant official patch notes must be checked before applying version/mode-specific rules. Add new story progress IDs without renaming existing IDs or changing saved choices.

Version remains 3.3.1. Final version/changelog synchronization remains required at the full-batch checkpoint before any main acceptance.
