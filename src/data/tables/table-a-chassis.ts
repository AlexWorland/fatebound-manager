import type { Chassis } from "@/types/forms";

export const TABLE_A_CHASSIS: Chassis[] = [
  {
    id: 1,
    name: "Brute",
    hitDie: 12,
    armorProficiencies: ["heavy", "medium", "shields"],
    weaponProficiencies: ["martial", "simple"],
  },
  {
    id: 2,
    name: "Skirmisher",
    hitDie: 10,
    armorProficiencies: ["medium", "shields"],
    weaponProficiencies: ["martial", "simple"],
  },
  {
    id: 3,
    name: "Duelist",
    hitDie: 10,
    armorProficiencies: ["light", "medium"],
    weaponProficiencies: ["martial", "simple"],
  },
  {
    id: 4,
    name: "Ranger-type",
    hitDie: 10,
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["simple", "martial_ranged"],
  },
  {
    id: 5,
    name: "Devotee",
    hitDie: 8,
    armorProficiencies: ["medium", "shields"],
    weaponProficiencies: ["simple"],
  },
  {
    id: 6,
    name: "Trickster",
    hitDie: 8,
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple", "hand_crossbows", "rapiers", "shortswords"],
  },
  {
    id: 7,
    name: "Arcanist",
    hitDie: 6,
    armorProficiencies: ["none"],
    weaponProficiencies: ["daggers", "quarterstaffs", "light_crossbows"],
  },
  {
    id: 8,
    name: "Wildcard",
    hitDie: 8,
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple"],
  },
];
