import type { DefensiveFeature } from "@/types/forms";

export const TABLE_C_DEFENSIVE: DefensiveFeature[] = [
  {
    id: 1,
    name: "Unarmored Defense (CON)",
    description: "Unarmored Defense (CON-based, as Barbarian)",
    incompatibleChassis: [1, 2],
  },
  {
    id: 2,
    name: "Unarmored Defense (WIS)",
    description: "Unarmored Defense (WIS-based, as Monk)",
    incompatibleChassis: [1, 2],
  },
  {
    id: 3,
    name: "Shield Spell",
    description: "Shield Spell (free cast, prof bonus times/day)",
  },
  {
    id: 4,
    name: "Cunning Action",
    description: "Cunning Action (Dash, Disengage, or Hide as bonus action)",
  },
  {
    id: 5,
    name: "Lay on Hands",
    description: "Lay on Hands (pool = Fatebound level \u00d7 3)",
  },
  {
    id: 6,
    name: "Metamagic",
    description:
      "Metamagic (randomly select 2 options from the Metamagic Options table; 3 sorcery points/day)",
    requiresSpellcasting: true,
  },
  {
    id: 7,
    name: "Bardic Inspiration",
    description: "Bardic Inspiration (CHA-based, dice = d6, uses = CHA mod)",
  },
  {
    id: 8,
    name: "Danger Sense",
    description:
      "Danger Sense (advantage on DEX saves vs. effects you can see)",
  },
];
