# Fatebound Manager Audit Report

**Date:** 2026-02-18
**Source:** `the-fatebound` submodule @ commit 4c30066
**Auditors:** 4 parallel research agents (Core Mechanics, Forms & Subclasses, Feats/Spells/Items, Supplementary & Analysis)

---

## Critical - Incorrect mechanics or values causing wrong behavior

### C1. Fabricated "The Kraken" Hexer subclass
- **Source:** No "Kraken" subclass exists in `Subclasses/The Fatebound - Hexer Subclasses.md` (9 variants total)
- **Manager:** `src/data/subclasses/hexer.ts:148-163` contains a 10th subclass "The Kraken" that was never in source
- **Fix:** Remove the entire Kraken entry from the hexer subclass array

### C2. Hexer Genie capstone: "Wish" vs "Limited Wish"
- **Source:** "Limited Wish: Once per long rest, choose one spell of 6th level or lower from any spell list"
- **Manager:** `src/data/subclasses/hexer.ts:128-130` says "Wish: Once per long rest, you can cast wish (PHB)"
- **Fix:** Replace with Limited Wish (6th-level cap, no components/slots, no level requirements)

### C3. Sage (Wizard) spells known/prepared formulas completely wrong
- **Source:** Grimoire spells known = `4 + Fatebound level`; Prepared = `INT mod + floor(Fatebound level / 2)`
- **Manager:** `src/data/tables/stabilized-forms.ts:405` uses `prof bonus + INT mod` for both
- **Fix:** Update to source formulas (significant divergence at higher levels)

### C4. Fatemark Adept feat exists in manager but removed from source
- **Source:** 91 feats total, 3 Fatebound-specific (Echoes of Yesterday #89, Controlled Chaos #90, Burden of Many Selves #91)
- **Manager:** `src/data/tables/table-d-feats.ts:110-114` has Fatemark Adept at ID 91, pushing Burden to ID 92 (92 total)
- **Decision:** C5/FT-1 explicitly removed Fatemark Adept
- **Fix:** Remove Fatemark Adept, renumber Burden of Many Selves to ID 91, total = 91 feats

### C5. 4 magic items in manager were never promoted to official source
- **Source:** 3 items only (Mirror of the Unformed, Amulet of Fractured Identity, Ring of Yesterday's Power)
- **Manager:** `src/data/magic-items.ts` has 7 items; 4 extras from Research doc never promoted (Decision C7)
- **Fix:** Remove Dice of the Fatebound, Cloak of Many Forms, Fatemark Ink, Coin of Fickle Fortune

### C6. Spell lists have fabricated class assignments on 6 of 7 spells
- **Source:** ALL 7 Fatebound spells list only "Fatebound" as their spell list
- **Manager:** `src/data/spells.ts` adds extra classes: Fate's Whisper (+Bard, Wizard), Destined Strike (+Paladin, Ranger), Chaotic Surge (+Sorcerer), Thread of Fate (+Bard, Wizard), Unravel (+Wizard), Probability Storm (+Sorcerer)
- **Fix:** Set all spell lists to `["Fatebound"]` only (Fate's Gambit is already correct)

### C7. Unravel spell incorrectly allows Spellcasting suppression at base level
- **Source:** "You cannot suppress 'Spellcasting' as a whole at this spell level -- suppressing Spellcasting requires a 6th-level or higher spell slot"
- **Manager:** `src/data/spells.ts:61` lists "Spellcasting" as a base-level suppressible option
- **Fix:** Remove Spellcasting from base description, add 6th-level upcast clause

### C8. Table B #7 and #10 descriptions say opposite of source
- **Source:** "If you have no spellcasting source, you GAIN 2 first-level spell slots" (fallback slots)
- **Manager:** `src/data/tables/table-b-primary.ts:64,90` says "Requires half-caster slots from a spellcasting feature"
- **Decisions:** C2/MJ-001 and C3/MJ-002 confirmed the fallback slot grant
- **Fix:** Reverse the description to match source; ideally add engine logic for fallback slots

### C9. Psi Warrior dice count doubled
- **Source:** "Psionic energy dice equal to your proficiency bonus"
- **Manager:** `src/data/subclasses/blade.ts:121` says "twice your proficiency bonus"
- **Decision:** MN-007 confirms revert to vanilla 5e value
- **Fix:** Change to "equal to your proficiency bonus"

### C10. Extra Dawn Die at wrong level (5 vs 6)
- **Source (post-decision M17):** Extra Dawn Die moved to level 6 to split the triple-spike at level 5
- **Manager:** `src/data/level-progression.ts:11` still shows Extra Dawn Die at level 5
- **Fix:** Move Extra Dawn Die to level 6 in level progression data

---

## Major - Missing features defined in source and expected to work

### M1. Ring of Yesterday's Power has dead secondary ability
- **Source (post-decision MJ-011):** Secondary ability referencing Chaos Surge + Residual Memory removed (impossible scenario)
- **Manager:** `src/data/magic-items.ts:50` still includes "when you lose a Residual Memory feature due to Chaos Surge"
- **Fix:** Remove the secondary ability text

### M2. Burden of Many Selves recovery mechanic mismatch
- **Source:** "you can't use it again until you finish a **long rest**"
- **Manager:** `src/data/tables/table-d-feats.ts:118` says "short or long rest"
- **Fix:** Change to "long rest" only

### M3. Channel Divinity missing from Table B entry 3 (Divine Spellcasting)
- **Source + Decision IC-4:** Table B result 3 includes "Channel Divinity (1 use/short or long rest): Roll on the Random Cleric Domain Table"
- **Manager:** `src/data/tables/table-b-primary.ts:24-31` omits Channel Divinity entirely
- **Fix:** Add Channel Divinity sub-feature to Table B entry 3

### M4. Divine Smite missing 5d8 cap and undead/fiend bonus
- **Source + Decision 5E-3/4:** Divine Smite damage capped at 5d8, +1d8 vs undead/fiend
- **Manager:** `src/data/tables/table-b-primary.ts:64` has no cap or creature type bonus
- **Fix:** Add both rules to description

### M5. Ancestral Guardian Spirit Shield uses different mechanic
- **Source:** "Use reaction to reduce damage by 2d6 (3d6 at 13, 4d6 at 17)"
- **Manager:** `src/data/subclasses/tempest.ts:41` says "allies have resistance to that creature's damage"
- **Fix:** Replace with specific damage reduction dice

### M6. Level 17 progression missing Dual Nature Improvement
- **Source + Decision IC-10:** Level 17 includes "Dual Nature Improvement (secondary form gains two features)"
- **Manager:** `src/data/level-progression.ts:23` only shows "Stabilized Form Capstones"
- **Fix:** Add Dual Nature Improvement to level 17 features

### M7. Anti-daisy-chaining rule not implemented for Residual Memory
- **Source + Decision MJ-009:** "Cannot retain a feature that was itself retained via Residual Memory the previous day"
- **Manager:** `src/engine/residual-memory.ts` has no such validation
- **Fix:** Add validation checking previous day's retained features

### M8. Action Surge should cost 2 Fate Pool points for Residual Memory
- **Source + Decision M15:** Action Surge costs 2 points (not 1) to retain
- **Manager:** `src/engine/residual-memory.ts` treats all features as cost 1
- **Fix:** Add variable cost support, Action Surge = 2

### M9. Thread of Fate d4 timing differs from source
- **Source:** "target must declare use of the die **before the triggering roll is made**"
- **Manager:** `src/data/spells.ts:49` says "**their choice when rolling**"
- **Fix:** Update to pre-declaration wording

### M10. Thread of Fate "consumed" component not in source
- **Source:** "V, S, M (golden thread worth 50 gp)"
- **Manager:** `src/data/spells.ts:46` adds "consumed"
- **Fix:** Remove "consumed"

### M11. Fate's Whisper missing Extra Dawn Die and light activity details
- **Source:** "Fate's Whisper reveals all Dawn Roll dice (including Extra Dawn Die) before the player chooses" + "counts as light activity during a long rest"
- **Manager:** `src/data/spells.ts:13` omits both
- **Fix:** Add to description

### M12. Hexer short rest recovery formula wrong at level 5
- **Source:** "Regain one slot per short rest (slot level = your highest available slot level)"
- **Manager:** `src/engine/spell-slots.ts:19-22` uses `floor(level/3)` which gives 1 at level 5 (should be 2)
- **Fix:** Replace formula with table lookup for highest available slot level

### M13. Multiple "choose" vs "randomly select" discrepancies
- `src/data/subclasses/tempest.ts:57` — Storm Herald aura: should be "randomly select" not "choose when you rage"
- `src/data/subclasses/tempest.ts:89` — Beast form weapon: should be "randomly select" not "choose one"
- `src/data/subclasses/feral.ts:41` — Four Elements disciplines: should be "randomly select 2" not "choose or randomly select 2"
- **Fix:** Change all to "randomly select" per Fatebound core design

---

## Minor - Text mismatches, missing details, nice-to-haves

### m1. Feral Martial Arts die scaling missing
- **Source:** "d6 (d8 at level 11, d10 at level 17)"
- **Manager:** `src/data/tables/stabilized-forms.ts:189` says "d6" only
- **Fix:** Add scaling text

### m2. Feral Stunning Strike has incorrect maxUses
- **Source:** No uses limit (costs 1 Ki per use, Ki is the limiter)
- **Manager:** `src/data/tables/stabilized-forms.ts:205` has `maxUses: "proficiency bonus/long rest"`
- **Fix:** Remove the maxUses cap

### m3. Shepherd (Druid) weapon proficiencies oversimplified
- **Source:** Lists specific weapons including scimitars (martial)
- **Manager:** `src/data/tables/stabilized-forms.ts:113` just says `["simple"]`
- **Fix:** Add scimitars explicitly or use `["simple", "scimitars"]`

### m4. Shepherd (Druid) armor nonmetal restriction missing
- **Source:** "Medium (nonmetal), Shields (nonmetal)"
- **Manager:** `src/data/tables/stabilized-forms.ts:112` has `["light", "medium", "shields"]`
- **Fix:** Add nonmetal annotations

### m5. Shepherd Wild Shape swimming/flying beast restrictions missing
- **Source:** "Beasts with a swimming speed available immediately; flying speed restricted until level 8"
- **Manager:** `src/data/tables/stabilized-forms.ts:123` omits this
- **Fix:** Add restriction text

### m6. Conduit (Sorcerer) cantrips known count missing
- **Source + Decision 5E-11:** "Cantrips known: 4"
- **Manager:** Omitted from stabilized form data
- **Fix:** Add cantrip count

### m7. Conduit SP-to-slot conversion rates missing
- **Source + Decision 5E-8:** "2 SP -> 1st, 3 SP -> 2nd, 5 SP -> 3rd, 6 SP -> 4th, 7 SP -> 5th"
- **Manager:** Omitted from form/engine data
- **Fix:** Add conversion table

### m8. Hexer Pact Magic recovery rule omitted
- **Source:** "Recovered slots cannot exceed your highest available slot level on the half-caster table"
- **Manager:** `src/data/tables/stabilized-forms.ts:371-372` omits this
- **Fix:** Add to description

### m9. Blade Arcane Archer save DC missing
- **Source:** "8 + proficiency bonus + Intelligence modifier"
- **Manager:** `src/data/subclasses/blade.ts:57` omits
- **Fix:** Add DC formula

### m10. Blade Rune Knight duplicate rune handling missing
- **Source:** "If you roll the same rune twice, reroll the second die"
- **Manager:** `src/data/subclasses/blade.ts:137` omits
- **Fix:** Add reroll rule

### m11. Mender Twilight Sanctuary incorrectly marked as concentration
- **Source:** Does NOT require concentration
- **Manager:** `src/data/subclasses/mender.ts:185` adds "(concentration)"
- **Fix:** Remove concentration tag

### m12. Tempest Wild Magic Surge table references wrong book
- **Source:** "Path of Wild Magic table (Tasha's Cauldron of Everything)"
- **Manager:** `src/data/subclasses/tempest.ts:105` references "Wild Magic Surge table (PHB)"
- **Fix:** Change to Tasha's reference

### m13. Tempest Battlerager spiked armor transformation explanation missing
- **Source:** "Your current armor magically transforms into spiked armor for the duration of your form"
- **Manager:** `src/data/subclasses/tempest.ts:121` omits
- **Fix:** Add transformation text

### m14. Sage Bladesinging Extra Attack non-stacking rule missing
- **Source:** "This Extra Attack replaces (does not stack with) any other Extra Attack feature you have"
- **Manager:** `src/data/subclasses/sage.ts:157` omits the non-stacking rule
- **Fix:** Add clarification

### m15. Trickster College of Spirits Spirit Session spell level formula missing
- **Source:** "Max spell level = participants / 2, rounded up"
- **Manager:** `src/data/subclasses/trickster.ts:125` omits
- **Fix:** Add formula

### m16. Heavy Armor Master source note about proficiency requirement missing
- **Source:** "This feat's damage reduction requires you to be wearing heavy armor. If your current form does not grant heavy armor proficiency, the damage reduction is inactive."
- **Manager:** `src/data/tables/table-d-feats.ts:42` omits
- **Fix:** Add note

### m17. Residual Memory category names don't match source taxonomy
- **Source:** Category 1 = "Single-Effect Features", Category 5 = "Multi-Part Features (Subclass)"
- **Manager:** `src/engine/residual-memory.ts:3-4` uses "Combat Style" and "Passive"
- **Fix:** Rename to match source

### m18. Chaotic Surge spell missing d4 die specification
- **Source:** "Roll a d4 to select a damage type"
- **Manager:** `src/data/spells.ts` says "Randomly select a damage type"
- **Fix:** Add "Roll a d4" specification

### m19. Level progression terminology: "Fate Pool point" vs "slot"
- **Source:** Uses "Fate Pool point" from level 2
- **Manager:** `src/data/level-progression.ts:8` uses "slot"
- **Fix:** Align terminology

---

## Info - Observations, potential improvements, already tracked

### I1. Chaos-Marked Background partially implemented
- Character type has `background` field but it's free-text. Source defines structured data (skill choices, rollable tables, Ambient Chaos feature). Low priority unless character creation UX is enhanced.

### I2. Origin Stories not implemented
- 5 narrative origin stories. Purely flavor, no mechanical impact. Would be a character creation UX enhancement.

### I3. Dual Nature conflict rules not implemented in engine
- Source specifies detailed rules: shared spell slot pool, primary hit die, Extra Attack non-stacking, saving throw limits, Rage + Spellcasting interaction. Currently display-only.

### I4. Dual Nature Chaos Surge refund not implemented
- Decision M10/MJ-003: Refund Fate Pool points when Chaos Surge disrupts Dual Nature. No engine logic.

### I5. "Cannot retain previously retained features" validation missing
- Same as M7 but worth noting the engine currently has no concept of "previous day's state" for comparison.

### I6. Defy Fate (level 18) has type support but no engine logic
- `DailyState` has `defyFateUsed` boolean but no engine function processes it.

### I7. Lord of Chaos (level 20) "keep highest" not distinguished from "choose"
- Extra Dawn Die is "choose" at 5+, but at 20 should be "keep highest" — currently no distinction.

### I8. Stabilized Form level 13/17 "all subclasses" base features not in data
- Features that apply to ALL subclasses at 13/17 (e.g., Tempest: Relentless Rage, Blade: Indomitable) aren't represented separately from subclass-specific features.

### I9. Multiclass stubs (Barbarian.md, etc.) are documentation aids only
- Map vanilla class names to Fatebound forms. Manager already has this mapping. No action needed.

---

## Resolution Status

| ID | Status | Notes |
|----|--------|-------|
| C1 | RESOLVED | Kraken subclass removed from hexer.ts |
| C2 | RESOLVED | Genie capstone renamed to Limited Wish, 6th-level cap |
| C3 | RESOLVED | Sage spells known = 4 + level, prepared = INT mod + floor(level/2) |
| C4 | RESOLVED | Fatemark Adept removed, Burden renumbered to ID 91 |
| C5 | RESOLVED | 4 fabricated magic items removed (Dice, Cloak, Ink, Coin) |
| C6 | RESOLVED | All spell lists set to ["Fatebound"] only |
| C7 | RESOLVED | Spellcasting removed from base Unravel, 6th-level clause added |
| C8 | RESOLVED | Table B #7 and #10 reversed to fallback slot grant |
| C9 | RESOLVED | Psi Warrior dice = proficiency bonus (not 2x) |
| C10 | RESOLVED | Extra Dawn Die moved to level 6 |
| M1 | RESOLVED | Ring of Yesterday's Power secondary ability removed |
| M2 | RESOLVED | Burden of Many Selves changed to long rest only |
| M3 | RESOLVED | Channel Divinity + cantrips known added to Table B entry 3 |
| M4 | RESOLVED | Divine Smite 5d8 cap and undead/fiend bonus added |
| M5 | RESOLVED | Ancestral Guardian uses 2d6/3d6/4d6 damage reduction |
| M6 | RESOLVED | Dual Nature Improvement added to level 17 |
| M7 | RESOLVED | Anti-daisy-chaining validation added to residual-memory.ts |
| M8 | RESOLVED | Action Surge costs 2 Fate Pool points |
| M9 | RESOLVED | Thread of Fate: declare before triggering roll |
| M10 | RESOLVED | Thread of Fate: "consumed" removed from components |
| M11 | RESOLVED | Fate's Whisper: Extra Dawn Die + light activity added |
| M12 | RESOLVED | getShortRestRecoverySlot uses table lookup |
| M13 | RESOLVED | All "choose" changed to "randomly select" |
| m1 | RESOLVED | Feral Martial Arts die scaling (d8@11, d10@17) |
| m2 | RESOLVED | Stunning Strike maxUses removed |
| m3 | RESOLVED | Shepherd weaponProficiencies: added scimitars |
| m4 | RESOLVED | Shepherd armorProficiencies: nonmetal annotations |
| m5 | RESOLVED | Shepherd Wild Shape: swimming/flying restrictions |
| m6 | RESOLVED | Conduit cantrips known: 4 |
| m7 | RESOLVED | Conduit SP-to-slot conversion rates added |
| m8 | RESOLVED | Hexer recovery cap rule added |
| m9 | RESOLVED | Arcane Archer save DC formula added |
| m10 | RESOLVED | Rune Knight duplicate reroll rule added |
| m11 | RESOLVED | Twilight Sanctuary concentration removed |
| m12 | RESOLVED | Wild Magic Surge reference: Tasha's |
| m13 | RESOLVED | Battlerager armor transformation text added |
| m14 | RESOLVED | Bladesinging Extra Attack non-stacking rule |
| m15 | RESOLVED | Spirit Session max spell level formula |
| m16 | RESOLVED | Heavy Armor Master proficiency note added |
| m17 | RESOLVED | Residual Memory category names updated |
| m18 | RESOLVED | Chaotic Surge: "Roll a d4" specification |
| m19 | RESOLVED | Level progression: "Fate Pool point" terminology |
| I1-I9 | NO ACTION REQUIRED | |
