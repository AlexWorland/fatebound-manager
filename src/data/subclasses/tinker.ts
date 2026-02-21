import type { SubclassEntry } from "@/types/forms";

export const TINKER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "tinker-alchemist",
    name: "Alchemist",
    level9Feature: {
      name: "Experimental Elixir + Alchemical Savant",
      description: "At dawn, produce a number of experimental elixirs equal to your INT modifier (random type per elixir, Fate's Selection d6: 1-Healing 2d4 + INT mod HP, 2-Swiftness +10 ft walking speed for 1 hour, 3-Resilience +1 bonus to AC for 10 minutes, 4-Boldness 1d4 bonus to attack rolls and saving throws for 1 minute, 5-Flight 10-ft flying speed for 10 minutes, 6-Transformation drinker's body changes per alter self for 10 minutes). Creature drinks as action. Expire at dawn. Spend a spell slot to create one elixir of your choice instead. Alchemical Savant: +INT mod (minimum +1) to one roll of an Artificer spell cast through alchemist's supplies that restores hit points or deals acid, fire, necrotic, or poison damage.",
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
      description: "Heavy armor proficiency. Action (using smith's tools): turn heavy armor into Arcane Armor (no STR requirement, can't be removed against your will, replaces missing limbs, serves as spellcasting focus). As a bonus action, you can retract or deploy the helmet. Randomly select model (Fate's Selection, d4 reroll 3–4): 1-Guardian (Thunder Gauntlets: melee weapon, 1d8 thunder, hit creature has disadvantage on attacks against targets other than you; Defensive Field: gain temp HP = Fatebound level, bonus action, prof bonus uses/long rest) or 2-Infiltrator (Lightning Launcher: ranged weapon 90/300, 1d6 lightning + 1d6 bonus lightning damage 1/turn; +5 ft speed; advantage on Stealth checks). Your Armorer model persists as long as you are in the Tinker form. Re-donning armor does not reset or change your model. Extra Attack.",
    },
    level13Feature: {
      name: "Armor Modifications",
      description: "Arcane Armor counts as 4 separate items (chest, boots, helmet, weapon) for infusion purposes. The maximum number of items you can infuse at once increases by 2, but those extra items must be part of your Arcane Armor.",
    },
    level17Feature: {
      name: "Perfected Armor",
      description: "Guardian: Reaction when a Huge or smaller creature within 30 ft ends its turn — force it to make a STR save or be pulled up to 25 ft toward you. If it ends within 5 ft, make one melee weapon attack against it. Usable a number of times = prof bonus/long rest. Infiltrator: A creature that takes lightning damage from your Lightning Launcher glows with dim light in a 5-ft radius until the start of your next turn. The next attack roll against the glowing creature before the end of your next turn has advantage, and if that attack hits, the target takes an extra 1d6 lightning damage.",
    },
  },
  {
    id: "tinker-artillerist",
    name: "Artillerist",
    level9Feature: {
      name: "Eldritch Cannon + Arcane Firearm",
      description: "Action: create a Small or Tiny Eldritch Cannon in an unoccupied space within 5 ft. Random type (Fate's Selection, d4 reroll 4): 1-Flamethrower (15-ft cone, DEX save, 2d8 fire), 2-Force Ballista (ranged spell attack 120 ft, 2d8 force, push target 5 ft), 3-Protector (10-ft radius, each creature of your choice gains 1d8 + INT mod temp HP). Cannon AC 18, HP = 5 × Fatebound level. Bonus action to fire/activate each turn. Lasts 1 hour or until destroyed. Free 1/long rest, or spend a spell slot for additional cannons. Arcane Firearm: +1d8 to one damage roll when casting an Artificer spell through a wand, staff, or rod.",
    },
    level13Feature: {
      name: "Explosive Cannon",
      description: "Eldritch Cannon damage increases by 1d8. Action: detonate a cannon within 60 ft — each creature in a 20-ft radius makes a DEX save or takes 3d8 force damage (half on save).",
    },
    level17Feature: {
      name: "Fortified Position",
      description: "Create 2 cannons with one action (but not the same spell slot; you determine whether they are identical or different). You can activate both cannons with the same bonus action. You and allies within 10 ft of a cannon have half cover (+2 AC and DEX saves).",
    },
  },
  {
    id: "tinker-battle-smith",
    name: "Battle Smith",
    level9Feature: {
      name: "Battle Ready + Steel Defender + Extra Attack",
      description: "Martial weapon proficiency. Use INT instead of STR or DEX for magic weapon attack and damage rolls. Steel Defender: AC 15, HP = 2 + INT mod + 5 × Fatebound level, Speed 40 ft, Deflect Attack reaction (impose disadvantage on one attack roll against a creature within 5 ft of the Defender), Force-Empowered Rend: 1d8 + prof bonus force damage. Repair (3/day): The Defender restores 2d8 + prof bonus HP to itself or one construct or object within 5 ft of it. Requires your bonus action to command it to take the Attack, Dash, Disengage, Dodge, or Help action. The Steel Defender manifests when you assume this form and dissolves at form change. Extra Attack.",
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
];;
