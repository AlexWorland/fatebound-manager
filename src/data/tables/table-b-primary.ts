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
      "Cleric spell list. Slots = half-caster table. WIS-based. Prepared caster (prof bonus + WIS mod spells).",
    hasSpellcasting: true,
    spellList: "Cleric",
    castingAbility: "WIS",
  },
  {
    id: 4,
    name: "Spellcasting (Primal)",
    className: "Druid",
    description:
      "Druid spell list. Slots = half-caster table. WIS-based.",
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
      "On hit, expend a spell slot for +2d8 radiant (+1d8 per slot above 1st). Lay on Hands pool = Fatebound level \u00d7 3. Requires half-caster slots from a spellcasting feature (e.g., Table B results 3, 4, or 12 via Residual Memory or Dual Nature).",
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
      "Points = prof bonus + CHA mod. Know 2 Metamagic options (randomly select 2 from the Metamagic Options table). Can convert spell slots \u2194 points. Requires half-caster slots from a spellcasting feature (e.g., Table B results 3, 4, or 12 via Residual Memory or Dual Nature).",
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
];
