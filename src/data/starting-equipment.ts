export interface EquipmentPack {
  name: string;
  items: string[];
}

export const EQUIPMENT_PACKS: EquipmentPack[] = [
  {
    name: "Explorer's Pack",
    items: [
      "Backpack",
      "Bedroll",
      "Mess kit",
      "Tinderbox",
      "10 torches",
      "10 days of rations",
      "Waterskin",
      "50 ft. hempen rope",
    ],
  },
  {
    name: "Scholar's Pack",
    items: [
      "Backpack",
      "Book of lore",
      "Bottle of ink",
      "Ink pen",
      "10 sheets of parchment",
      "Little bag of sand",
      "Small knife",
    ],
  },
  {
    name: "Dungeoneer's Pack",
    items: [
      "Backpack",
      "Crowbar",
      "Hammer",
      "10 pitons",
      "10 torches",
      "Tinderbox",
      "10 days of rations",
      "Waterskin",
      "50 ft. hempen rope",
    ],
  },
];

export const STARTING_WEAPONS = [
  "Dagger",
  "Handaxe",
  "Javelin",
  "Light Hammer",
  "Mace",
  "Quarterstaff",
  "Sickle",
  "Spear",
  "Longsword",
  "Rapier",
  "Shortsword",
  "Scimitar",
  "Battleaxe",
  "Morningstar",
  "War Pick",
  "Warhammer",
];

export const STARTING_GOLD = { min: 10, max: 200, default: 50 };
