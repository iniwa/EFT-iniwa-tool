# Underdog as Negative Modifier — 2026-10-07

The user confirmed that Underdog has no debuff and grants 4 points to late starters, then clarified that it belongs in Negative Modifier. The inventory now counts it as an ordinary Negative Modifier. Its point value is +4 and the selection stays off unless the user selects it.

Existing count-based achievement hints include Underdog because it is now an ordinary Negative Modifier. Whether the game grants those achievements for this modifier is unverified. No special exception was added. The official acquisition/eligibility rules also remain unverified. Community pages supplied by the user were not independently readable for their dynamic Underdog content.

The preview-only implementation had already saved and shared the ID underdog. Keeping the same ID preserves existing drafts, presets, imported schema-1 states, and share links. A prior selected ID now produces the standard Negative Modifier behavior once, without migration, a new storage key, or a duplicate grant.

Validation: focused modifier and Vue UI tests 17/17; full suite 88/88; production build and git diff --check passed. Existing >500 kB chunk warning remains. Visual browser QA remains unverified. Version 3.4.0 is synchronized in package metadata, APP_VERSION, README, and AppNotice. The AppNotice calls out unresolved Boreas/Icebreaker data, unverified internal condition-variable meanings, and uncertain Underdog achievement eligibility. Browser visual QA was unavailable.
