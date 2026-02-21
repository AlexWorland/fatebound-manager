import type { PrimaryFeature } from "@/types/forms";

export const TABLE_B_PRIMARY: PrimaryFeature[] = [
  {
    id: 1,
    name: "Rage",
    className: "Barbarian",
    description:
      "Functions as Barbarian Rage (uses = proficiency bonus/day).",
    hasSpellcasting: false,
    resourcePool: "rage",
  },
  {
    id: 2,
    name: "Bardic Inspiration + Expertise + Spellcasting",
    className: "Bard",
    description:
      "Bardic Inspiration d6, uses = CHA mod/long rest. Expertise in 2 skills. Spellcasting: Bard spell list (CHA-based); spells known = prof bonus + CHA mod; slots = half-caster table.",
    hasSpellcasting: true,
    spellList: "Bard",
    castingAbility: "CHA",
    resourcePool: "bardic_inspiration",
  },
  {
    id: 3,
    name: "Spellcasting (Divine)",
    className: "Cleric",
    description:
      "Cleric spell list. Slots = half-caster table. WIS-based. Prepared caster (prof bonus + WIS mod spells). Cantrips known = proficiency bonus. Channel Divinity (1 use/short or long rest): Roll on the Random Cleric Domain Table to determine your domain and Channel Divinity option for the day.",
    hasSpellcasting: true,
    spellList: "Cleric",
    castingAbility: "WIS",
  },
  {
    id: 4,
    name: "Spellcasting (Primal)",
    className: "Druid",
    description:
      "Druid spell list. Slots = half-caster table. WIS-based. Cantrips known = prof bonus. Prepared caster (prof bonus + WIS mod spells).",
    hasSpellcasting: true,
    spellList: "Druid",
    castingAbility: "WIS",
  },
  {
    id: 5,
    name: "Fighting Style + Extra Attack",
    className: "Fighter",
    description:
      "Randomly select a Fighting Style from the Fighting Style table. Gain Extra Attack if level 5+.",
    hasSpellcasting: false,
  },
  {
    id: 6,
    name: "Ki",
    className: "Monk",
    description:
      "Functions as Monk Ki (points = proficiency bonus + WIS mod; use Fate Attunement to swap a high score into WIS). Access to Flurry of Blows, Patient Defense, Step of the Wind.",
    hasSpellcasting: false,
    resourcePool: "ki",
  },
  {
    id: 7,
    name: "Divine Smite + Lay on Hands + Spellcasting",
    className: "Paladin",
    description:
      "On a hit, expend a spell slot for +2d8 radiant (+1d8/slot above 1st, max 5d8; +1d8 bonus vs. undead/fiends, true max 6d8). Lay on Hands pool = level × 5 HP. Spellcasting: Paladin spell list (CHA-based); prepared caster (prof bonus + CHA mod spells); slots = half-caster table.",
    hasSpellcasting: true,
    spellList: "Paladin",
    castingAbility: "CHA",
    resourcePool: "lay_on_hands",
  },
  {
    id: 8,
    name: "Favored Foe + Deft Explorer + Spellcasting",
    className: "Ranger",
    description:
      "Mark a creature on hit (prof bonus times/day, concentration); first hit each turn deals +1d4. Expertise in one skill, +5 ft walking speed. Spellcasting: Ranger spell list (WIS-based); spells known = prof bonus + WIS mod; slots = half-caster table. If you also gain a Fighting Style: Ranger options only — Archery, Defense, Dueling, Two-Weapon Fighting.",
    hasSpellcasting: true,
    spellList: "Ranger",
    castingAbility: "WIS",
    resourcePool: "favored_foe",
  },
  {
    id: 9,
    name: "Sneak Attack",
    className: "Rogue",
    description:
      "Functions as Rogue Sneak Attack (dice scale with Fatebound level \u00f7 2, rounded up).",
    hasSpellcasting: false,
  },
  {
    id: 10,
    name: "Sorcery Points + Metamagic + Spellcasting",
    className: "Sorcerer",
    description:
      "Points = prof bonus + CHA mod; convert spell slots ↔ points. Know 2 randomly selected Metamagic options. Spellcasting: Sorcerer spell list (CHA-based); spells known = prof bonus + CHA mod; cantrips = prof bonus; slots = half-caster table.",
    hasSpellcasting: true,
    spellList: "Sorcerer",
    castingAbility: "CHA",
    resourcePool: "sorcery_points",
  },
  {
    id: 11,
    name: "Eldritch Invocations + Pact Magic",
    className: "Warlock",
    description:
      "Eldritch Blast cantrip + 2 randomly selected Invocations (reroll pact-dependent results). Pact Magic (CHA-based, Warlock spell list, short-rest recovery): 2 first-level slots at levels 1–4; then follows the Hexer Pact Magic table (2 slots/3rd at levels 5–8; 2 slots/4th at 9–12; 3 slots/5th at 13+). (No Pact Boon in Chaos Form.)",
    hasSpellcasting: true,
    spellList: "Warlock",
    castingAbility: "CHA",
  },
  {
    id: 12,
    name: "Spellcasting (Arcane)",
    className: "Wizard",
    description:
      "Wizard spell list. Slots = half-caster table. INT-based. You know a number of cantrips and spells equal to your proficiency bonus for each.",
    hasSpellcasting: true,
    spellList: "Wizard",
    castingAbility: "INT",
  },
  {
    id: 13,
    name: "Infusions + Magical Tinkering + Spellcasting",
    className: "Artificer",
    description:
      "Randomly select 2 infusions from the Infusion Table (using Fate's Selection). Apply to items you carry only (no party distribution in Chaos Form context). Dissolve at dawn. Touch up to INT mod Tiny nonmagical objects to grant a minor property (light, sound, odor, or static visual). Spellcasting: Artificer spell list (INT-based); prepared caster (prof bonus + INT mod spells); slots = half-caster table.",
    hasSpellcasting: true,
    spellList: "Artificer",
    castingAbility: "INT",
    resourcePool: "infusions",
  },
  {
    id: 14,
    name: "Crimson Rite + Blood Maledict",
    className: "Blood Hunter",
    description:
      "Activate Crimson Rite on a weapon (bonus action; take hemocraft die [d4] irreducible necrotic, max HP reduced by same; weapon deals extra d4 of chosen type per hit until rest). Primal Rites: fire, cold, or lightning. Blood Maledict (1 use/short rest): Randomly select 1 blood curse from the Blood Curse Table. Hemocraft save DC = 8 + prof + INT mod.",
    hasSpellcasting: false,
    resourcePool: "blood_maledict",
  },
];
