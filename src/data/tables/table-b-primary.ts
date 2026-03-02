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
    name: "Bardic Inspiration + Expertise",
    className: "Bard",
    description:
      "Bardic Inspiration die = d6, uses = CHA mod/long rest. Expertise in 2 skills.",
    hasSpellcasting: false,
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
    name: "Divine Smite + Lay on Hands",
    className: "Paladin",
    description:
      "On hit, expend a spell slot for +2d8 radiant (+1d8 per slot above 1st). Damage capped at 5d8. +1d8 against undead or fiend. Lay on Hands pool = Fatebound level \u00d7 5. If you have no spellcasting source from another feature, you gain 2 first-level spell slots usable only for Divine Smite.",
    hasSpellcasting: false,
    resourcePool: "lay_on_hands",
  },
  {
    id: 8,
    name: "Favored Foe + Deft Explorer",
    className: "Ranger",
    description:
      "Mark a creature on hit (prof bonus times/day, concentration); first hit each turn deals +1d6. Expertise in one skill, +5 ft walking speed.",
    hasSpellcasting: false,
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
    name: "Sorcery Points + Metamagic",
    className: "Sorcerer",
    description:
      "Points = prof bonus + CHA mod. Know 2 Metamagic options (randomly select 2 from the Metamagic Options table). Can convert spell slots \u2194 points. If you have no spellcasting source from another feature, you gain 2 first-level spell slots.",
    hasSpellcasting: false,
    resourcePool: "sorcery_points",
  },
  {
    id: 11,
    name: "Eldritch Invocations",
    className: "Warlock",
    description:
      "Gain Eldritch Blast cantrip + 2 Invocations (randomly select 2 from the Eldritch Invocation Table; no Pact Boon in this context \u2014 reroll pact-dependent results).",
    hasSpellcasting: false,
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
    name: "Infusions + Magical Tinkering",
    className: "Artificer",
    description:
      "Randomly select 2 infusions from the Infusion Table (using Fate's Selection). Apply to items you carry only (no party distribution in Chaos Form context). Dissolve at dawn. Additionally, touch up to INT mod Tiny nonmagical objects to give each one minor property (light, sound, odor, or static visual). INT-based.",
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
