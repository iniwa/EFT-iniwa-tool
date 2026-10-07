# Built-in memo research applied — 2026-10-07

Scope: update cells and short tips in the original seven concise lookup sections, preserving all tables, weapon RPMs and existing accordion/storage behavior. Version stays 3.4.0. This supersedes the no-refresh claim in the preceding restore decision; its exact original snapshot remains unchanged.

Evidence: the owner supplied a prepared, dated dot-side research pass. The current implementation uses that evidence and checked the community medication, surgery, armor, case and trader pages again. WikiWiki is community-maintained, not official BSG documentation. BSG’s Steam announcement is the official source only for Patch 1.1 trader restructuring; no surgery change is attributed to Patch 1.2.

| Section | Sources | Applied / limits |
| --- | --- | --- |
| Health | [Medication](https://wikiwiki.jp/eft/医薬品), [CMS](https://wikiwiki.jp/eft/CMS%20surgical%20kit), [Surv12](https://wikiwiki.jp/eft/Surv12%20field%20surgical%20kit), [Skills](https://wikiwiki.jp/eft/スキル) | CMS / Surv12 durability 3 / 9, retained maximum HP 25–45% / 60–72%. Reduction 55–75% / 28–40% is calculated, skill dependent. Prepared source dates: CMS Sep 24 (before 1.2), Surv12 Oct 7. Medkit maximum healing per animation remains an older English Wiki value, explicitly unverified; first-heal/cancel timing remains an unretested practical estimate. |
| Weapons | [Weapon list](https://wikiwiki.jp/eft/武器一覧), [Ammo](https://wikiwiki.jp/eft/弾薬), [SPEAR](https://wikiwiki.jp/eft/SIG%20MCX%20SPEAR%206.8x51%20assault%20rifle), [ASh-12](https://wikiwiki.jp/eft/ASh-12%2012.7x55%20assault%20rifle), [9A-91](https://wikiwiki.jp/eft/KBP%209A-91%209x39%20compact%20assault%20rifle) | RPD 700, M60 550, UZI PRO 1075, AUG A3 715, NL-545 DI 800 / GP 850, M4 800 / HK416 850. All 35 weapon rows retained. Opinions are estimates; no guaranteed class-4 one-shot or absolute best gun. Prepared ammo table version 1.1.5.1.47510. |
| Armor | [Body armor](https://wikiwiki.jp/eft/ボディアーマー), [Repair](https://wikiwiki.jp/eft/銃と装備の修理), [Plates](https://wikiwiki.jp/eft/アーマープレート) | Eight bullet/explosive durability multipliers copied from material table, not penetration or player-damage multipliers. Repair descriptions remain qualitative. Ceramic is repairable; glass visibility claim stays unverified. Prepared page dates: body armor Oct 1, repair Oct 7. |
| Stims | [Medication table](https://wikiwiki.jp/eft/医薬品) and linked individual drug pages | All 19 rows retained, with durations, delayed side effects and calculated totals. Obdolbos 2 HP drain and normal Obdolbos lethal random effect restored. Older DR/damage/reload/weight effects absent from the current table stay explicitly unverified, not declared removed. Prepared Obdolbos 2 page Jun 2024 / Obdolbos May 2024: older individual-page evidence remains a limitation alongside the current medication table. |
| Grenades | [VOG-25](https://wikiwiki.jp/eft/VOG-25%20Khattabka%20hand%20grenade), [VOG-17](https://wikiwiki.jp/eft/VOG-17%20Khattabka%20hand%20grenade), [V40](https://wikiwiki.jp/eft/V40%20Mini%20hand%20grenade), [RGD-5](https://wikiwiki.jp/eft/RGD-5%20hand%20grenade), [F-1](https://wikiwiki.jp/eft/F-1%20hand%20grenade), [M67](https://wikiwiki.jp/eft/M67%20hand%20grenade), [RGN](https://wikiwiki.jp/eft/RGN%20hand%20grenade), [RGO](https://wikiwiki.jp/eft/RGO%20hand%20grenade) | Seven rows retained. Range is source minimum–maximum, not guaranteed kill radius. RGN/RGO normal fuse 3.5s; 0.3s may describe throw-to-arm delay. It is not represented as a delay after impact. Early collision failure and thermal invisibility claims remain older unverified observations. |
| Traders | [Community trader table](https://wikiwiki.jp/eft/トレーダー), [BSG official Patch 1.1](https://steamcommunity.com/games/3932890/announcements/detail/686386819418294181) | Updated player level / reputation for seven traders, retained Ref values, added Fence karma 6.00. Sales condition removed for regular PvP, seasonal and PvE. Static memo only; no eligibility-code changes. |
| Items / unlocks | [Cases](https://wikiwiki.jp/eft/ケース), [THICC](https://wikiwiki.jp/eft/T%20H%20I%20C%20C%20item%20case), [SICC](https://wikiwiki.jp/eft/S%20I%20C%20C%20organizational%20pouch), [Medication](https://wikiwiki.jp/eft/医薬品), [Ammo](https://wikiwiki.jp/eft/弾薬) | Existing five cards and 11 unlock rows retained. Corrected THICC / SICC recipes and added alternate trades; purchase, barter, craft and rewards remain separate. Task names verified against the existing 504-task regular English dataset; this proves link identity, not reward correctness in every game mode. |

Internal links (exact names → actual dataset IDs):

- Health Care Privacy - Part 2 → 5a68663e86f774501078f78a
- Postman Pat - Part 2 → 596760e186f7741e11214d58
- Health Care Privacy - Part 4 → 5a68667486f7742607157d28
- Broadcast - Part 3 → 63a511ea30d85e10e375b045
- Thirsty - Secrets → 665eeca92f7aedcc900b0437
- A Difficult Choice → 5edac34d0bb72a50635c2bfa
- The Punisher - Part 6 → 59ca2eb686f77445a80ed049
- Special Equipment → 60e71ce009d7c801eb0c0ec6
- Wet Job - Part 4 → 5a27bc3686f7741c73584026
- Intimidator → 60e71bb4e456d449cd47ca75
- Decontamination Service → 5c0d1c4cd0928202a02a6f5c

Validation: all 88 tests passed; production build passed (existing >500 kB chunk warning); all 11 task links resolved. Table/row counts preserved except the new Fence row; UTF-8 replacement characters 0. Final source-link correction was followed by a rebuild. Actual browser visual QA remains unavailable; static and component checks are not visual acceptance.
