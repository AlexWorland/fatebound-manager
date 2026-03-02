export interface Species {
  name: string;
  abilityBonuses: Partial<Record<string, number>>;
  speed: number;
  traits: string[];
  languages: string[];
}

export const SPECIES: Species[] = [
  {
    name: "Human",
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    speed: 30,
    traits: ["Extra Language"],
    languages: ["Common", "One extra"],
  },
  {
    name: "Elf (High)",
    abilityBonuses: { DEX: 2, INT: 1 },
    speed: 30,
    traits: ["Darkvision", "Fey Ancestry", "Trance", "Cantrip"],
    languages: ["Common", "Elvish"],
  },
  {
    name: "Dwarf (Hill)",
    abilityBonuses: { CON: 2, WIS: 1 },
    speed: 25,
    traits: ["Darkvision", "Dwarven Resilience", "Stonecunning"],
    languages: ["Common", "Dwarvish"],
  },
  {
    name: "Halfling (Lightfoot)",
    abilityBonuses: { DEX: 2, CHA: 1 },
    speed: 25,
    traits: ["Lucky", "Brave", "Halfling Nimbleness", "Naturally Stealthy"],
    languages: ["Common", "Halfling"],
  },
  {
    name: "Half-Elf",
    abilityBonuses: { CHA: 2 },
    speed: 30,
    traits: ["Darkvision", "Fey Ancestry", "Two +1 bonuses"],
    languages: ["Common", "Elvish", "One extra"],
  },
  {
    name: "Tiefling",
    abilityBonuses: { CHA: 2, INT: 1 },
    speed: 30,
    traits: ["Darkvision", "Hellish Resistance", "Infernal Legacy"],
    languages: ["Common", "Infernal"],
  },
  {
    name: "Half-Orc",
    abilityBonuses: { STR: 2, CON: 1 },
    speed: 30,
    traits: ["Darkvision", "Menacing", "Relentless Endurance", "Savage Attacks"],
    languages: ["Common", "Orc"],
  },
  {
    name: "Dragonborn",
    abilityBonuses: { STR: 2, CHA: 1 },
    speed: 30,
    traits: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"],
    languages: ["Common", "Draconic"],
  },
  {
    name: "Gnome (Rock)",
    abilityBonuses: { INT: 2, CON: 1 },
    speed: 25,
    traits: ["Darkvision", "Gnome Cunning", "Tinker"],
    languages: ["Common", "Gnomish"],
  },
];
