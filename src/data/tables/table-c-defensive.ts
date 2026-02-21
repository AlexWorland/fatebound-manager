import type { DefensiveFeature } from "@/types/forms";

export const TABLE_C_DEFENSIVE: DefensiveFeature[] = [
  {
    id: 1,
    name: "Unarmored Defense (CON)",
    description: "Unarmored Defense (CON-based, as Barbarian)",
  },
  {
    id: 2,
    name: "Unarmored Defense (WIS)",
    description: "Unarmored Defense (WIS-based, as Monk)",
  },
  {
    id: 3,
    name: "Arcane Recovery",
    description:
      "Arcane Recovery — Once per day when you finish a short rest, choose expended spell slots to recover. The spell slots can have a combined level equal to no more than half your Fatebound level (rounded up), and none of the slots can be 6th level or higher.",
    requiresSpellcasting: true,
  },
  {
    id: 4,
    name: "Cunning Action",
    description:
      "Cunning Action (Dash, Disengage, or Hide as bonus action)",
  },
  {
    id: 5,
    name: "Second Wind",
    description:
      "Second Wind — On your turn, use a bonus action to regain hit points equal to 1d10 + your Fatebound level. Once you use this feature, you must finish a short or long rest before you can use it again.",
  },
  {
    id: 6,
    name: "Evasion",
    description:
      "Evasion — When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
  },
  {
    id: 7,
    name: "Danger Sense",
    description:
      "Danger Sense (advantage on DEX saves vs. effects you can see, provided you aren't blinded, deafened, or incapacitated)",
  },
  {
    id: 8,
    name: "Wild Shape",
    description:
      "Wild Shape — Use your action to magically assume the shape of a beast you have seen before. 2 uses per short or long rest. Duration = half your Fatebound level hours (rounded down, minimum 1 hour). Beast CR scales with level: CR ≤ 1/4 (levels 1–3, no flying/swimming), CR ≤ 1/2 (levels 4–7, no flying), CR ≤ 1 (levels 8+, no restrictions). You can't cast spells while transformed but maintain concentration. You assume the beast's HP; excess damage carries over when you revert. Dissolves at dawn.",
  },
  {
    id: 9,
    name: "Flash of Genius",
    description:
      "Flash of Genius (Level 7+) — When you or another creature you can see within 30 feet makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll. You can use this feature a number of times equal to your Intelligence modifier (minimum of once). You regain all expended uses when you finish a long rest.",
  },
  {
    id: 10,
    name: "Jack of All Trades",
    description:
      "Jack of All Trades — You can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.",
  },
  {
    id: 11,
    name: "Uncanny Dodge",
    description:
      "Uncanny Dodge — When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.",
  },
  {
    id: 12,
    name: "Action Surge",
    description:
      "Action Surge — On your turn, you can take one additional action on top of your regular action and a possible bonus action. Once you use this feature, you must finish a short or long rest before you can use it again.",
  },
];
