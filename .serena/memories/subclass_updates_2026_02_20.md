# Subclass Updates - 2026-02-20

## Task Completed
Updated all 6 subclass files (shepherd, stalker, tempest, tinker, trickster, warden) to match source docs from `the-fatebound/Subclasses/`.

## Changes Summary

### Shepherd (Circle of Dreams, Spores, Stars, Wildfire)
- **Circle of Dreams (L9)**: Hidden Paths now correctly specifies separate mechanics for teleporting self vs ally
- **Circle of Dreams (L17)**: Renamed from "Hidden Paths Mastery" to "Dream Realm" with correct mechanics (short rest recharge, bring ally along)
- **Circle of Spores (L9)**: Halo damage corrected to 1d4 (was 1d6), doubles to 2d4 in Symbiotic Entity
- **Circle of Spores (L13)**: Spreading Spores completely rewritten - now about 10-ft cube cloud emanating from point within 30 ft, not bonus action emanation from caster
- **Circle of Stars (L17)**: Renamed from "Star Flare" to "Cosmic Form" - no longer requires Wild Shape use, can change constellation 1/long rest

### Stalker
- **Hunter (L13)**: Changed from listing disadvantage mechanic to granting +4 AC bonus
- **Beast Master (L9)**: Fixed companion HP formula - Beast of Sky is 4 + (4 × level), not 5 + (5 × level)
- **Beast Master (L13)**: Added "Exceptional Training" feature details, Bestial Fury (two attacks)
- **Gloom Stalker (L9)**: Added initiative bonus equal to WIS modifier
- **Fey Wanderer (L9)**: Added full bonus spell list (charm person, misty step, dispel magic, dimension door, mislead at appropriate levels)
- **Fey Wanderer (L13)**: Added "Fey Reinforcements" feature (summon fey without material component, cast 1/long rest no slot, modify to non-concentration)
- **Swarmkeeper (L9)**: Rewritten to include both "Gathered Swarm" AND "Writhing Tide" at same level
- **Drakewarden (L9)**: Infused Strikes added - reaction when ally hits, add extra 1d6 damage
- **Drakewarden (L13)**: Complete rewrite with Drake's Breath cone (30 ft at L13, 8d6 damage)
- **Drakewarden (L17)**: Now Large size with flying capability while mounted, Reflexive Resistance added

### Tempest
- **All subclasses (L9)**: Added "Brutal Critical" to all - extra 1d weapon die on critical hit
- **Berserker (L13)**: Expanded Intimidating Presence with full mechanics (WIS save DC, duration, 60 ft range ending, 24 hr immunity)
- **Ancestral Guardian (L9)**: Rewritten as "Ancestral Protectors + Spirit Shield" - unified description of both features
- **Storm Herald (L9)**: Desert damage corrected to 2 fire (not 1d4 + proficiency), Sea damage is 1d6 lightning (not 2d6)
- **Battlerager (L9)**: Armor transformation now explicitly magical (replaces vanilla equipment requirement)
- **Wild Magic (L9)**: Complete table rewrite with 8 distinct effects (shadows, teleport, spirits, weapons, retaliation, lights, terrain, light bolts)

### Tinker
- **Alchemist (L9)**: Elixir production = INT modifier (unified scaling, replaces vanilla 1/2/3 by tier)
- **Armorer (L9)**: Arcane Armor now grants "no STR requirement, can't be removed against will, replaces missing limbs, serves as focus"
- **Armorer (L9)**: Guardian Defensive Field grants temp HP = Fatebound level (was prof bonus), uses = prof bonus/long rest
- **Armorer (L17)**: Complete rewrite - Guardian now pulls creature 25 ft (with STR save), Infiltrator adds glow mechanic with advantage attacks
- **Artillerist (L9)**: Cannon HP = 5 × Fatebound level (was per-type variation)
- **Battle Smith (L9)**: Steel Defender now has "Repair (3/day)" feature - restores 2d8 + prof bonus HP
- **Battle Smith (L9)**: Defender no longer dissolves in description

### Trickster
- **Lore (L13)**: Changed from "Additional Magical Secrets: 2 additional spells" to "4 total spells"
- **Glamour (L13)**: Completely replaced "Enthralling Performance" with "Mantle of Majesty" (casting command repeatedly with concentration)
- **Swords (L9)**: Blade Flourish options now Defensive/Slashing/Mobile (correct mobility mechanics)
- **Whispers (L9)**: Psychic Blades damage now uses level-based scaling (2d6/3d6/5d6/8d6), not single die
- **Creation (L13)**: Performance of Creation now "1/long rest or by spell slot" format, item worth 20 × Fatebound level GP
- **Spirits (L9)**: Complete rewrite with explicit Spirit Tales description and Fate's Selection mechanics (d6 at L9, d12 at L13+ via ritual)
- **Spirits (L13)**: Replaced undefined "Spiritual Focus Improvement" with explicit "Spirit Session" ritual feature

### Warden
- **All (L13)**: All subclass auras now extend to **30 ft** (was 10 ft)
- **Devotion (L9)**: Sacred Weapon now "becomes magical if it isn't already" (explicit mechanical change)
- **Ancients (L17)**: Completely replaced with "Elder Champion" - 10 HP regen/turn, bonus action casting, enemy spell disadvantage
- **Vengeance (L13)**: Split into "Relentless Avenger" (opportunity attack mobility) + "Soul of Vengeance" (reaction attacks)
- **Conquest (L9)**: Removed "Guided Strike" mention - Channel Divinity is only Conquering Presence
- **Redemption (L9)**: Corrected save type in Rebuke the Violent from CHA to WIS
- **Glory (L13)**: Replaced with "Aura of Alacrity" - +10 ft speed to allies (per source spec with 30 ft aura range)
- **Watchers (L13)**: Aura of Sentinel now adds proficiency to initiative for allies within 30 ft
- **Oathbreaker (L17)**: Complete rewrite as "Dread Lord" with 30-ft gloom aura, shadow concealment, bonus action necrotic spell attack

## Verification
- All 6 files updated via Serena's replace_symbol_body tool (handles encoding correctly)
- Ran ESLint - no errors
- TypeScript check passed
- Git commit created with detailed message

## Status
Complete. All source doc compliance verified against `the-fatebound/` submodule content.
