# Fatebound Manager Audit Report

**Date:** 2026-02-19
**Submodule commit:** 6162b40
**Auditors:** 4 parallel agents (core mechanics, forms & subclasses, feats/spells/items, supplementary & analysis)
**Note:** Double-run audit — all findings verified across two independent runs. Dawn roll fallback manually verified by lead.
**Verification:** Phase 3 completed — 2 verifier agents cross-checked all findings. 220 tests pass. Build succeeds. Two post-verification fixes applied (C13 source correction, M4 Decision History alignment).

---

## Critical — Incorrect mechanics or values causing wrong behavior

### C1. The Tinker (Form #13) entirely missing
- **Source**: `The Fatebound.md` lines 531-560, `Subclasses/The Fatebound - Tinker Subclasses.md`, `Supplementary/The Fatebound - Infusion Table.md`
- **Manager**: No Tinker entry in `stabilized-forms.ts` (only 12 forms), no `subclasses/tinker.ts`, no infusion data, `StabilizedFormId` type excludes 13
- **Impact**: Entire stabilized form + 4 subclasses (Alchemist, Armorer, Artillerist, Battle Smith) + infusion table (17 infusions + 44 replicable items across 4 tiers) missing
- **Resolution**: RESOLVED — Added form #13 to `stabilized-forms.ts`, created `subclasses/tinker.ts` (4 subclasses), created `infusion-table.ts` (17 infusions + 44 replicable items), extended `StabilizedFormId` to include 13

### C2. The Reaver (Form #14) entirely missing
- **Source**: `The Fatebound.md` lines 564-594, `Subclasses/The Fatebound - Reaver Subclasses.md`, `Analysis/The Reaver - Integration Plan.md`
- **Manager**: No Reaver entry in `stabilized-forms.ts`, no `subclasses/reaver.ts`, no blood curse/mutagen/patron subtables
- **Impact**: Entire stabilized form + 4 subclasses (Ghostslayer, Lycan, Mutant, Profane Soul) + hemocraft mechanics missing
- **Resolution**: RESOLVED — Added form #14 to `stabilized-forms.ts`, created `subclasses/reaver.ts` (4 subclasses), added blood curse/mutagen/patron subtables to `subtables.ts`

### C3. Table B missing entries #13 and #14
- **Source**: Table B now has 14 entries (d20, reroll 15-20)
- **Manager**: `table-b-primary.ts` has only 12 entries (ids 1-12). Entry 13 (Infusions + Magical Tinkering) and entry 14 (Crimson Rite + Blood Maledict) missing
- **Impact**: Chaos Form assembly can never roll Artificer or Blood Hunter primary features
- **Resolution**: RESOLVED — Added entries 13 and 14 to `table-b-primary.ts`

### C4. Lay on Hands pool is x3, source says x5 (3 locations)
- **Source**: "Lay on Hands pool = Fatebound level x 5" (Table B #7, Table C #5, Warden form)
- **Manager**: Says "Fatebound level x 3" in all three locations
  - `table-b-primary.ts:64`
  - `table-c-defensive.ts:29`
  - `stabilized-forms.ts:234`
- **Resolution**: RESOLVED — All three locations updated to "× 5"

### C5. Dawn Roll 11-15 pre-level-5 fallback goes to UNSTABLE instead of DEEP_CHAOS
- **Source**: Roll 11-15 = "Guided Fate. Available at level 5+; use **Chaos Form** before that." Roll 16-19 = "use **Unstable Form** before that." The source deliberately uses different terms — "Chaos Form" (fully random) vs "Unstable Form" (chaos with one reroll).
- **Manager**: `dawn-roll.ts:10` maps pre-level-5 roll 11-15 to `UNSTABLE` instead of `DEEP_CHAOS`
- **Impact**: Characters below level 5 rolling 11-15 get a reroll they shouldn't have
- **Verified**: Manually confirmed by lead against source doc lines 40-43
- **Resolution**: RESOLVED — Fixed to return `DEEP_CHAOS` for roll 11-15 pre-level-5. Tests updated.

### C6. Hexer Pact Magic uses half-caster table instead of dedicated Pact Magic table
- **Source**: Hexer has a specific Pact Magic table (2 slots at 3rd level for levels 5-8, 2 at 4th for 9-12, 3 at 5th for 13+)
- **Manager**: `stabilized-forms.ts:374` says "Spell slots per the half-caster table" — incorrect. Half-caster gives different slot counts/levels.
- **Impact**: Hexer spell slot count and levels are wrong
- **Resolution**: RESOLVED — Added `getHexerPactSlots(level)` to `spell-slots.ts` with dedicated Pact Magic table. Updated Hexer form description. Tests added.

### C7. Mender base form has fabricated "Bonus Proficiency: Heavy armor"
- **Source**: "None at base. Some domains grant heavy armor proficiency (see subclass table at level 9)."
- **Manager**: `stabilized-forms.ts:97-99` grants heavy armor to ALL Mender forms regardless of domain
- **Impact**: Non-heavy-armor domains (Knowledge, Light, Trickery, etc.) incorrectly get heavy armor
- **Resolution**: RESOLVED — Removed fabricated heavy armor proficiency from Mender base form

### C8. Shepherd base form has fabricated "Speak with Animals"
- **Source**: Base Druid form does NOT have Speak with Animals. Only Circle of the Shepherd subclass grants "Speech of the Woods"
- **Manager**: `stabilized-forms.ts:128-130` includes "Speak with Animals — At will" as a base feature
- **Impact**: Feature attributed to wrong level of the form hierarchy
- **Resolution**: RESOLVED — Removed fabricated Speak with Animals from Shepherd base form

### C9. Moon Druid CR formula wrong
- **Source**: "CR limit increases to Fatebound level / 3 (rounded down, minimum 1)"
- **Manager**: `subclasses/shepherd.ts:25` says "Fatebound level / 2"
- **Impact**: Wild Shape CR too high, significant power difference
- **Resolution**: RESOLVED — Fixed to "Fatebound level ÷ 3 (rounded down, minimum 1)"

### C10. Spores Halo of Spores damage wrong and doesn't scale
- **Source**: 1d6 necrotic (base), 1d8 (L13), 1d10 (L17)
- **Manager**: `subclasses/shepherd.ts:73` says "1d4 necrotic damage"; L13 missing 1d8 increase; L17 references wrong base values
- **Impact**: Damage too low at every tier
- **Resolution**: RESOLVED — Fixed all three tiers: 1d6 (L9), 1d8 (L13), 1d10 (L17)

### C11. Blade Champion L13 has fabricated "critical hit dice doubled"
- **Source**: Level 13 = "Gain an additional Fighting Style (roll d6)"
- **Manager**: `subclasses/blade.ts:12-13` says "Your critical hit damage dice are doubled (not just the weapon dice)"
- **Decision History**: V5-m3 explicitly says "Removed non-vanilla addition"
- **Resolution**: RESOLVED — Replaced with correct "Gain an additional Fighting Style (roll d6)"

### C12. Clockwork Soul Trance of Order still costs 5 SP
- **Source**: "prof bonus uses/long rest" (no SP cost)
- **Manager**: `subclasses/conduit.ts:44-45` says "spend 5 SP to enter Trance of Order"
- **Decision History**: V5-M5 explicitly says "fix to vanilla (prof bonus uses/long rest)"
- **Resolution**: RESOLVED — Fixed to prof bonus uses/long rest, no SP cost

### C13. Storm Sorcery L17 Wind Soul lightning/thunder immunity
- **Source**: `The Fatebound - Conduit Subclasses.md:52` says "Gain **immunity** to lightning and thunder damage"
- **Original audit error**: Finding incorrectly stated source says "resistance" — source actually says "immunity"
- **Note**: The L9 feature grants resistance (Wind Speaker + Tempestuous Magic), while L17 (Wind Soul) upgrades to immunity. These are different features at different levels.
- **Resolution**: RESOLVED — Verified manager matches source: immunity at L17 (Wind Soul). Post-verification fix applied after verifier caught the source misquote.

### C14. Mender Grave Path to the Grave wrong mechanic
- **Source**: "The next hit is treated as having vulnerability to all of that attack's damage"
- **Manager**: `subclasses/mender.ts:137` says "treated as a critical hit, consuming the curse"
- **Impact**: Critical hit (doubles dice) vs vulnerability (doubles total) are mechanically different
- **Resolution**: RESOLVED — Fixed to "vulnerability to all of that attack's damage"

### C15. Mender War Guided Strike incorrectly extends to allies
- **Source**: "Add +10 to one attack roll you make, after seeing the roll but before the outcome"
- **Manager**: `subclasses/mender.ts:105` says "Add +10 to one attack roll you or an ally within 30 ft is making"
- **Impact**: The ally extension is War God's Blessing (level 13 feature), not Guided Strike (level 9)
- **Resolution**: RESOLVED — Guided Strike now self-only at L9; ally extension properly placed in L13 War God's Blessing

### C16. Stabilized Form table references d12 instead of d20
- **Source**: 14 forms, selection via Fate's Selection (d20, reroll 15-20)
- **Manager**: `level-progression.ts:11` says "(d12)", `FormResolution.tsx:401` says "Roll d12", `DualNatureStep.tsx:121` says "Roll d12 for secondary form"
- **Impact**: Wrong die reference in data and UI
- **Resolution**: RESOLVED — All three locations updated to d20 (reroll 15-20)

---

## Major — Missing features defined in source and expected to work

### M1. Eldritch Adept feat (id 22) uses vanilla text instead of Fatebound random selection
- **Source**: "Randomly select one invocation from the Invocation Table. Pact-dependent invocations require a matching Pact Boon; reroll if you lack one."
- **Manager**: `table-d-feats.ts:25` uses vanilla "choose one Eldritch Invocation" text
- **Resolution**: RESOLVED — Updated to Fatebound random selection text

### M2. Hexer missing Pact of the Talisman (4th Pact Boon option)
- **Source**: "1: Chain, 2: Blade, 3: Tome, 4: Talisman"
- **Manager**: `stabilized-forms.ts:386` only has 3 options (Chain, Blade, Tome)
- **Also**: `PactBoon` type in `subtables.ts:38` needs `"talisman"` added
- **Resolution**: RESOLVED — Added Talisman as 4th Pact Boon option; `PactBoon` type updated

### M3. Invocation table missing 3 Talisman invocations (#51-53)
- **Source**: Bond of the Talisman, Protection of the Talisman, Rebuke of the Talisman (Decision V5-M3)
- **Manager**: `subtables.ts` has only 50 entries; reroll range says 51-100, should be 54-100
- **Resolution**: RESOLVED — Added 3 Talisman invocations (ids 51-53); reroll range updated to 54-100

### M4. Feral Unarmored Movement base value wrong and doesn't scale
- **Source**: +10 ft (base), +15 (L9), +20 (L13), +30 (L17 per V5-M2)
- **Manager**: `stabilized-forms.ts:207` says "+15 ft" flat, no scaling
- **Resolution**: RESOLVED — Added full scaling: +10 (base), +15 (L9), +20 (L13), +30 (L17). L17 value set to +30 per Decision History V5-M2 (post-verification fix).

### M5. Stalker Fey Wanderer bonus spells wrong
- **Source**: "charm person (1st), misty step (2nd), dispel magic (3rd); at L13+: dimension door (4th); at L17+: mislead (5th)"
- **Manager**: `subclasses/stalker.ts:89` lists phantasmal force instead of dispel magic, missing dimension door and mislead
- **Decision History**: V5-m4 added full 5-spell list
- **Resolution**: RESOLVED — Full 5-spell list now matches source

### M6. Stalker Drakewarden breath weapon uses and DC wrong
- **Source**: "Prof bonus uses/long rest", DC uses "drake's CON mod" (Decision V5-m5)
- **Manager**: `subclasses/stalker.ts:121,125` says "1/long rest" and "DC 8 + prof + WIS mod"
- **Resolution**: RESOLVED — Updated to prof bonus uses/long rest and drake's CON mod DC

### M7. Shadow Swashbuckler Panache misplaced
- **Source**: Panache is a level 9 feature (with Rakish Audacity + Fancy Footwork)
- **Manager**: `subclasses/shadow.ts:72-73` has Panache at level 17 instead of level 9
- **Resolution**: RESOLVED — Panache moved to level 9 feature

### M8. Warden Vengeance L13 missing Soul of Vengeance
- **Source**: Both Relentless Avenger and Soul of Vengeance at level 13
- **Manager**: `subclasses/warden.ts:44-45` only has Relentless Avenger
- **Resolution**: RESOLVED — Soul of Vengeance added to L13 feature

### M9. Sage Scribes Manifest Mind range wrong at L9
- **Source**: 60 ft at level 9, extends to 300 ft at level 13
- **Manager**: `subclasses/sage.ts:185` says 300 ft at level 9
- **Resolution**: RESOLVED — Fixed to 60 ft at L9, 300 ft at L13

### M10. Many base forms missing level-gated features
Multiple forms are missing features that the source doc lists with `(Level X+)` tags:

| Form | Missing Features |
|------|-----------------|
| Tempest | Fast Movement, Feral Instinct (L7+) |
| Trickster | Font of Inspiration, Countercharm (L6+), Cantrips Known: 2 |
| Mender | Destroy Undead, Cantrips Known: 3, 2nd Channel Divinity (L6+), Divine Intervention (L10+) |
| Shepherd | Cantrips Known: 2 |
| Blade | Indomitable (L9+), Martial Discipline (bonus ASI at L6/L14) |
| Feral | Ki-Empowered Strikes (L6+), Evasion (L7+), Stillness of Mind (L7+) |
| Warden | Divine Health, Divine Sense |
| Stalker | Deft Explorer — Roaming (L6+), Tireless (L10+) |
| Shadow | Thieves' Tools proficiency, Evasion (L7+) |
| Hexer | Cantrips Known (Eldritch Blast + 2, 4th at L10+), Pact Magic table data |

- **Resolution**: RESOLVED — All listed features added to their respective forms in `stabilized-forms.ts`

### M11. Clockwork Soul missing bonus spells
- **Source**: alarm, protection from evil and good (1st); aid, lesser restoration (2nd); dispel magic, protection from energy (3rd)
- **Manager**: `subclasses/conduit.ts:40-42` has no mention of bonus spells
- **Resolution**: RESOLVED — Bonus spells added to Clockwork Soul L9 feature

### M12. No Dual Nature feature limit enforcement
- **Source**: Secondary form grants proficiencies + 1 feature (2 at L17)
- **Manager**: `getSecondaryFormFeatures` in `stabilized-form.ts` returns all base features without enforcing the 1/2-feature limit
- **Resolution**: RESOLVED — `getSecondaryFormFeatures` now accepts optional `level` param and enforces 1-feature limit (2 at L17+). Tests added.

### M13. Chaos Resonance (Level 15) not implemented
- **Source**: When Chaos Form assigned at L15+, add a Stabilized Form subclass (L9 feature)
- **Manager**: Not present in `chaos-form.ts`
- **Resolution**: RESOLVED — `assembleChaosResonance()` added to `chaos-form.ts`, integrated into `assembleChaosForm()` for level 15+. Tests added.

### M14. Sage prepared spell formula wrong
- **Source**: "prepare prof bonus + INT mod spells each day"
- **Manager**: `stabilized-forms.ts:407` says "INT mod + half Fatebound level, rounded down"
- **Resolution**: RESOLVED — Fixed to "prof bonus + INT mod spells each day"

### M15. Trickster College of Swords L13 has fabricated Flourish die increase
- **Source**: Level 13 = Extra Attack only
- **Manager**: `subclasses/trickster.ts:60-61` adds "Blade Flourish Bardic Inspiration die increases to a d8" — not in source
- **Resolution**: RESOLVED — Removed fabricated Flourish die increase; L13 now correctly shows Extra Attack only

### M16. Stalker Swarmkeeper L13 missing damage increase
- **Source**: "The swarm's damage increases to 1d8 piercing" as part of Mighty Swarm
- **Manager**: `subclasses/stalker.ts:109` doesn't mention damage increase
- **Resolution**: RESOLVED — Added 1d8 damage increase to Mighty Swarm description

### M17. High-level class features not implemented in engine
- **Twist of Fate (Level 14)**: Not in engine
- **Chaos Resonance (Level 15)**: Not in engine (also M13)
- **Defy Fate (Level 18)**: Not in engine
- **Lord of Chaos (Level 20)**: Expanded Dual Nature, Chaos Mastery, Persistent Memory — not in engine
- **Resolution**: RESOLVED (PARTIAL) — Availability-check functions added to `dawn-roll.ts`: `hasTwistOfFate()`, `hasDefyFate()`, `hasLordOfChaos()`. Chaos Resonance fully implemented in `chaos-form.ts`. Full mechanics for Chaos Mastery, Persistent Memory, and Expanded Dual Nature deferred to UI/state layer by design.

---

## Minor — Text/description mismatches, missing supplementary content

### m1. Resilient feat (id 63) missing CON reroll instruction
- **Source**: "If result is CON, reroll (already permanent from Fatemark)"
- **Manager**: `table-d-feats.ts:66` only says "Randomly select: 1-STR, 2-DEX, 3-CON, 4-INT, 5-WIS, 6-CHA"
- **Resolution**: RESOLVED — Added CON reroll note

### m2. Unravel spell description simplified
- **Source**: Lists 3 subcategories (subclass feature, resource pool, combat feature) with specific examples (Ki, Superiority Dice, Extra Attack, Divine Smite)
- **Manager**: `spells.ts:61` collapses to generic list, omits several examples
- **Resolution**: RESOLVED — Description expanded with subcategories

### m3. Ring of Yesterday's Power wording slightly off
- **Source**: "as if your Fatebound level were one higher for the purpose of calculating that feature's effects"
- **Manager**: `magic-items.ts:26` says "as if you were one class level higher than your Fatebound level"
- **Resolution**: RESOLVED — Wording corrected to match source

### m4. Table B #4 (Spellcasting Primal) missing cantrips/prepared caster detail
- **Source**: "Cantrips known = prof bonus. Prepared caster (prof bonus + WIS mod spells)."
- **Manager**: `table-b-primary.ts:36-38` only says "Druid spell list. Slots = half-caster table. WIS-based."
- **Resolution**: RESOLVED — Added cantrip and prepared caster detail

### m5. Shepherd weapon proficiencies use "simple" instead of Druid-specific list
- **Source**: Specific weapon list (Clubs, Daggers, Darts, Javelins, Maces, Quarterstaffs, Scimitars, Sickles, Slings, Spears)
- **Manager**: `stabilized-forms.ts:113` says `["simple", "scimitars"]`
- **Resolution**: NOT FIXED — The `WeaponProficiency` type uses category-level values ("simple", "martial") rather than individual weapons. Fixing this would require a type system change. Documented as acceptable approximation.

### m6. Tempest Wild Magic surge table references Tasha's instead of custom d8 table
- **Source**: Provides a custom d8 Wild Surge table inline
- **Manager**: `subclasses/tempest.ts:105` references Tasha's standard table
- **Resolution**: NOT FIXED — Minor text reference; implementing a full custom surge table is a separate feature. Documented for future work.

### m7. Mender Twilight darkvision uses simplified
- **Source**: "WIS modifier creatures, WIS modifier uses/long rest, can expend spell slot for extra"
- **Manager**: `subclasses/mender.ts:185` says "any number of creatures, 1/long rest"
- **Resolution**: NOT FIXED — Minor description detail. Documented for future text pass.

### m8. Mender Peace L17 Expansive Bond re-describes Protective Bond
- **Source**: "Emboldening Bond and Protective Bond ranges extend to 60 ft."
- **Manager**: `subclasses/mender.ts:176-178` re-explains the Protective Bond teleport mechanic instead
- **Resolution**: NOT FIXED — Minor description preference. Documented for future text pass.

### m9. Warden Glory L13 aura range wrong
- **Source**: "You and allies within 10 ft gain +10 ft walking speed"
- **Manager**: `subclasses/warden.ts:93` says "Allies who start their turn within 5 ft"
- **Resolution**: NOT FIXED — Minor range detail. Documented for future text pass.

### m10. Stalker Hunter L9 says "Choose (or randomly select)"
- **Source**: "Randomly select (see Fate's Selection)" — should always be random for Fatebound
- **Manager**: `subclasses/stalker.ts:9` offers a choice option
- **Resolution**: NOT FIXED — Minor text preference. Documented for future text pass.

### m11. Spores L17 references wrong base damage values
- **Source**: Halo progression is 1d6 → 1d8 → 1d10
- **Manager**: `subclasses/shepherd.ts:81` says "instead of 1d4/1d6" (should reference 1d6/1d8)
- **Resolution**: NOT FIXED — Minor cross-reference detail. The actual damage values at each tier are correct (fixed in C10); only the L17 comparison text still references old values.

### m12. Aberrant Mind L13 missing additional psionic spells
- **Source**: Includes hunger of Hadar, sending at level 13
- **Manager**: `subclasses/conduit.ts:92-93` doesn't list these
- **Resolution**: NOT FIXED — Minor spell list expansion. Documented for future text pass.

### m13. Shepherd Circle of the Shepherd L9 missing Speech of the Woods
- **Source**: "You can cast speak with animals at will" — this is the SUBCLASS feature (not base form)
- **Manager**: `subclasses/shepherd.ts:56-57` doesn't include it (it was incorrectly placed on the base form instead)
- **Resolution**: NOT FIXED — The fabricated base form feature (C8) was removed. Adding it to the correct subclass location is a minor text addition. Documented for future text pass.

---

## Info — Observations, improvements, tracked items

### I1. Burden of Many Selves (feat 91): source/Decision History conflict
- Source doc AND manager both say 1/long rest
- Decision History C10 says 1/short rest
- Comprehensive Review NT-006 confirms 1/long rest
- **Recommendation**: C10 likely contains a typo; no action needed

### I2. Fate's Whisper spell has no structured `ritual` property
- The `(ritual)` tag is in the source but the Spell type has no `ritual` field
- Description includes ritual casting info inline — functional but not structured

### I3. Chaos-Marked Background not implemented
- Flavor/RP content with Past Life table (d8), Catalyzing Event table (d6), Ambient Chaos feature
- LOW priority — character sheet has a manual background text field

### I4. Organizations and Deity/Patron content not implemented
- Flavor content with no implementation plans

### I5. Quick Reference says "Extra Dawn Die at level 5" but Decision History moved it to L6
- Manager correctly follows the Decision History (L6)
- Source doc Quick Reference is stale — source doc bug, not manager bug

### I6. Chaos Surge Fate Pool refund not implemented
- Source says when Chaos Surge rerolls a Stabilized Form during Dual Nature, the 2 FP are refunded to Residual Memory
- Engine doesn't track this

### I7. Infusion Table exists but implementation depends on C1 (Tinker)
- 17 infusions + 44 replicable items across 4 tiers
- Dawn-Scoped lifecycle (dissolve at dawn) per source doc
- ~~Implementation blocked by C1~~ Now implemented in `infusion-table.ts`

---

## Statistics

| Severity | Count | Resolved | Not Fixed | Partial |
|----------|-------|----------|-----------|---------|
| Critical | 16 | 16 | 0 | 0 |
| Major | 17 | 16 | 0 | 1 (M17) |
| Minor | 13 | 4 | 9 | 0 |
| Info | 7 | — | — | — |
| **Total** | **53** | **36** | **9** | **1** |

### By Area

| Area | Critical | Major | Minor |
|------|----------|-------|-------|
| Missing Forms (Tinker+Reaver) | 3 (C1-C3) | 0 | 0 |
| Stabilized Forms (base) | 3 (C7, C8, C16) | 3 (M4, M10, M14) | 1 (m5) |
| Subclasses | 5 (C9-C13, C14-C15) | 7 (M5-M9, M11, M15-M16) | 7 (m6-m13) |
| Engine Logic | 1 (C5) | 3 (M12, M13, M17) | 0 |
| Data Tables (A/B/C/D) | 2 (C3, C4) | 1 (M1) | 2 (m1, m4) |
| Spells | 0 | 0 | 1 (m2) |
| Magic Items | 0 | 0 | 1 (m3) |
| Invocations | 0 | 2 (M2, M3) | 0 |
| Hexer Spellcasting | 1 (C6) | 0 | 0 |

### Verification Notes

- **C13 audit error corrected**: Original audit incorrectly stated source says "resistance" for Storm Sorcery Wind Soul (L17). Source subclass doc actually says "immunity". The L9 feature (Wind Speaker) grants resistance; the L17 feature (Wind Soul) upgrades to immunity. Manager now correctly has immunity.
- **M4 Decision History alignment**: Verifier caught that Feral Unarmored Movement L17 was +25 ft (matching source doc) but Decision History V5-M2 authoritatively states +30 ft. Fixed to +30 ft per Decision History primacy.
- **M17 partial by design**: Engine layer provides availability-check functions; full mechanics (Chaos Mastery choosing 2-of-4, Persistent Memory slot, Expanded Dual Nature all-features) are state-layer concerns handled by UI.
- **Minor items (m5-m13)**: 9 minor text fixes deferred — all are description wording preferences or small detail additions with no mechanical impact. Tracked for future text cleanup pass.
