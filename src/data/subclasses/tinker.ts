import type { SubclassEntry } from "@/types/forms";

export const TINKER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "tinker-alchemist",
    name: "Alchemist",
    level9Feature: {
      name: "Experimental Elixir + Alchemical Savant",
      description: "At dawn, produce INT modifier experimental elixirs (random type per elixir, Fate's Selection d6: 1-Healing 2d4 + INT mod HP, 2-Swiftness +10 ft walking speed for 1 hour, 3-Resilience +1 bonus to AC for 10 minutes, 4-Boldness 1d4 bonus to attack rolls and saving throws for 1 minute, 5-Flight 10-ft flying speed for 10 minutes, 6-Transformation drinker's body changes per alter self for 10 minutes). Creature drinks as action. Expire at dawn. Spend a spell slot to create one elixir of your choice instead. Alchemical Savant: +INT mod to one damage or healing roll of Artificer spells cast through alchemist's supplies.",
    },
    level13Feature: {
      name: "Restorative Reagents",
      description: "Cast lesser restoration without a spell slot (INT mod times/long rest). Creatures drinking your elixirs gain temp HP = 2d6 + INT mod.",
    },
    level17Feature: {
      name: "Chemical Mastery",
      description: "Resistance to acid and poison damage; immunity to the poisoned condition. Cast greater restoration and heal once each per long rest without expending a spell slot.",
    },
  },
  {
    id: "tinker-armorer",
    name: "Armorer",
    level9Feature: {
      name: "Arcane Armor + Armor Model + Extra Attack",
      description: "Heavy armor proficiency. Bonus action: turn heavy armor into Arcane Armor (no STR requirement, can't be removed against your will, replaces missing limbs, serves as spellcasting focus). Randomly select model (Fate's Selection, d4 reroll 3\u20134): 1-Guardian (Thunder Gauntlets: melee weapon, 1d8 thunder, hit creature has disadvantage on attacks against targets other than you; Defensive Field: gain temp HP = prof bonus, bonus action, prof bonus uses/long rest) or 2-Infiltrator (Lightning Launcher: ranged weapon 90/300, 1d6 lightning + 1d6 bonus lightning damage 1/turn; +5 ft speed; advantage on Stealth checks). Model is re-rolled each time you don the armor. Extra Attack.",
    },
    level13Feature: {
      name: "Armor Modifications",
      description: "Arcane Armor counts as 4 separate items (chest, boots, helmet, weapon) for infusion purposes. These 4 infusion slots do not count against your maximum number of infused items.",
    },
    level17Feature: {
      name: "Perfected Armor",
      description: "Guardian: Reaction \u2014 pull one Huge or smaller creature within 30 ft up to 30 ft toward you (STR save negates). If it ends within 5 ft, make one melee weapon attack against it. Alternatively, prevent forced movement of one creature within 30 ft. Infiltrator: Lightning Launcher bonus damage increases to 2d6. A hit creature glows with dim light until the start of your next turn (attack rolls against it have advantage, and it can't benefit from being invisible).",
    },
  },
  {
    id: "tinker-artillerist",
    name: "Artillerist",
    level9Feature: {
      name: "Eldritch Cannon + Arcane Firearm",
      description: "Action: create a Small or Tiny Eldritch Cannon in an unoccupied space within 5 ft. Random type (Fate's Selection, d4 reroll 4): 1-Flamethrower (15-ft cone, DEX save, 2d8 fire), 2-Force Ballista (ranged spell attack 120 ft, 2d8 force, push target 5 ft), 3-Protector (10-ft radius, each creature of your choice gains 1d8 + INT mod temp HP). Cannon AC 18, HP = 5 \u00d7 Fatebound level. Bonus action to fire/activate each turn. Lasts 1 hour or until destroyed. Free 1/long rest, or spend a spell slot for additional cannons. Arcane Firearm: +1d8 to one damage or healing roll when casting an Artificer spell through a wand, staff, or rod.",
    },
    level13Feature: {
      name: "Explosive Cannon",
      description: "Eldritch Cannon damage increases by 1d8. Action: detonate a cannon within 60 ft \u2014 each creature in a 20-ft radius makes a DEX save or takes 3d8 force damage (half on save).",
    },
    level17Feature: {
      name: "Fortified Position",
      description: "Create 2 cannons with one action (they cannot be the same type). You and allies within 10 ft of a cannon have half cover (+2 AC and DEX saves).",
    },
  },
  {
    id: "tinker-battle-smith",
    name: "Battle Smith",
    level9Feature: {
      name: "Battle Ready + Steel Defender + Extra Attack",
      description: "Martial weapon proficiency. Use INT instead of STR or DEX for magic weapon attack and damage rolls. Steel Defender: AC 15, HP = 2 + INT mod + 5 \u00d7 Fatebound level, Speed 40 ft, Deflect Attack reaction (impose disadvantage on one attack roll against a creature within 5 ft of the Defender), Force-Empowered Rend: 1d8 + prof bonus force damage. Requires your bonus action to command it to take the Attack, Dash, Disengage, Dodge, or Help action. The Steel Defender manifests when you assume this form and dissolves at form change. Extra Attack.",
    },
    level13Feature: {
      name: "Arcane Jolt",
      description: "When you or your Steel Defender hit with a melee attack or Force-Empowered Rend: deal +2d6 force damage OR heal one creature within 30 ft for 2d6 HP. Uses = INT mod/long rest.",
    },
    level17Feature: {
      name: "Improved Defender",
      description: "Steel Defender gains +2 AC. Deflect Attack deals 1d4 + INT mod force damage to the attacker. Arcane Jolt damage and healing increase to 4d6.",
    },
  },
];
