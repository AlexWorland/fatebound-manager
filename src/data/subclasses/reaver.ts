import type { SubclassEntry } from "@/types/forms";

export const REAVER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "reaver-ghostslayer",
    name: "Ghostslayer",
    level9Feature: {
      name: "Rite of the Dawn + Curse Specialist + Aether Walk",
      description: "Gain the Rite of the Dawn (radiant damage). While active: weapon sheds 20 ft bright light, you have resistance to necrotic damage, and you roll an additional hemocraft die of damage against undead. Curse Specialist: +1 Blood Maledict use; your blood curses affect any creature regardless of whether it has blood. Aether Walk (1 use per short or long rest): At the start of your turn, you can magically step into the veil between the planes for a number of rounds equal to your hemocraft modifier (minimum 1). You can move through creatures and objects (1d10 force damage if ending your turn inside one) and see into the Ethereal Plane.",
    },
    level13Feature: {
      name: "Brand of Sundering + Level 13 Upgrades",
      description: "All subclasses: Hemocraft Die increases to d8. Brand of Castigation upgrades to Brand of Tethering — psychic damage increases to 2× your INT modifier (min 2). The branded creature cannot use the Dash action. If it attempts teleportation or plane-shifting, it takes 4d6 psychic damage and must succeed on a WIS save (against your Hemocraft save DC) or the attempt fails. Hardened Soul: Advantage on saving throws against being charmed or frightened. Esoteric Rites unlock: Rite of the Dead (necrotic damage), Rite of the Oracle (psychic damage), Rite of the Roar (thunder damage). Channel Divinity gains an additional use between rests (3 total). Learn 1 additional Blood Curse. Ghostslayer: Your Crimson Rite hits against branded creatures deal an additional hemocraft die of damage. Branded creatures with Incorporeal Movement lose the ability to move through objects and other creatures.",
    },
    level17Feature: {
      name: "Rite Revival + Blood Curse of the Exorcist",
      description: "All subclasses: Hemocraft Die increases to d10. Sanguine Mastery: Once per turn, you may reroll any hemocraft die and use either result. Critical hits with a Crimson Rite weapon restore one expended Blood Maledict use. Ghostslayer: If you are reduced to 0 HP while any crimson rites are active (and the damage would not kill you outright), you may end all active rites to drop to 1 HP instead. Gain the Blood Curse of the Exorcist (bonus action, 30 ft: remove one charm, frighten, or possession effect from a target; amplified: the source creature takes 3d6 psychic damage and must succeed on a WIS save against your Hemocraft save DC or be stunned until the end of your next turn). This curse does not count against your curses known.",
    },
  },
  {
    id: "reaver-lycan",
    name: "Lycan",
    level9Feature: {
      name: "Hybrid Transformation + Heightened Senses",
      description: "Heightened Senses: Advantage on Perception checks relying on hearing or smell. Hybrid Transformation (1/short rest, up to 1 hour): Bonus action to transform. Feral Might: Advantage on STR checks and saves, +1 melee damage. Resilient Hide: Resistance to nonmagical bludgeoning, piercing, and slashing damage (not silvered), +1 AC without heavy armor. Predatory Strikes: Unarmed strikes deal 1d6 (use STR or DEX); you can apply Crimson Rite to unarmed strikes; bonus action unarmed strike after using the Attack action. Bloodlust: At the start of your turn if you are below half HP, make a DC 8 WIS save or you must move toward and attack the nearest creature. Stalker's Prowess: Speed +10 ft while transformed, long jump +10 ft, high jump +3 ft. Improved Predatory Strikes: +1 attack bonus on unarmed strikes; unarmed strikes with an active Crimson Rite count as magical.",
    },
    level13Feature: {
      name: "Advanced Transformation + Lycan Regeneration + Level 13 Upgrades",
      description: "All subclasses: Hemocraft Die increases to d8. Brand of Castigation upgrades to Brand of Tethering — psychic damage increases to 2× your INT modifier (min 2). The branded creature cannot use the Dash action. If it attempts teleportation or plane-shifting, it takes 4d6 psychic damage and must succeed on a WIS save (against your Hemocraft save DC) or the attempt fails. Hardened Soul: Advantage on saving throws against being charmed or frightened. Esoteric Rites unlock: Rite of the Dead (necrotic damage), Rite of the Oracle (psychic damage), Rite of the Roar (thunder damage). Channel Divinity gains an additional use between rests (3 total). Learn 1 additional Blood Curse. Lycan: Hybrid Transformation gains a 2nd use per short rest. While in hybrid form and below half HP, regain HP equal to 1 + your CON modifier at the start of each of your turns (min 1). Feral Might damage bonus increases to +2. Predatory Strikes unarmed damage die increases to 1d8.",
    },
    level17Feature: {
      name: "Hybrid Mastery + Blood Curse of the Howl",
      description: "All subclasses: Hemocraft Die increases to d10. Sanguine Mastery: Once per turn, you may reroll any hemocraft die and use either result. Critical hits with a Crimson Rite weapon restore one expended Blood Maledict use. Lycan: Hybrid Transformation has unlimited uses and no duration limit. Feral Might damage bonus increases to +3. Gain the Blood Curse of the Howl (action, 30 ft: each creature that can hear you must make a WIS save or be frightened until the end of your next turn; a creature that fails by 5 or more is stunned instead; creatures that succeed are immune for 24 hours; amplified: range increases to 60 ft). This curse does not count against your curses known.",
    },
  },
  {
    id: "reaver-mutant",
    name: "Mutant",
    level9Feature: {
      name: "Mutagencraft + Strange Metabolism",
      description: "Mutagencraft: Learn 4 mutagen formulas (randomly select from the Mutagen Formula Table using Fate's Selection). Consume a mutagen as an action; its benefit and side effect last until you finish a short or long rest. Flush all active mutagens as an action. Up to 2 mutagens can be active simultaneously (they must be different formulas). Strange Metabolism: Immunity to poison damage and the poisoned condition. Bonus action to ignore one active mutagen's negative side effect for 1 minute (1/long rest).",
    },
    level13Feature: {
      name: "Brand of Axiom + Level 13 Upgrades",
      description: "All subclasses: Hemocraft Die increases to d8. Brand of Castigation upgrades to Brand of Tethering — psychic damage increases to 2× your INT modifier (min 2). The branded creature cannot use the Dash action. If it attempts teleportation or plane-shifting, it takes 4d6 psychic damage and must succeed on a WIS save (against your Hemocraft save DC) or the attempt fails. Hardened Soul: Advantage on saving throws against being charmed or frightened. Esoteric Rites unlock: Rite of the Dead (necrotic damage), Rite of the Oracle (psychic damage), Rite of the Roar (thunder damage). Channel Divinity gains an additional use between rests (3 total). Learn 1 additional Blood Curse. Mutant: Brand of Tethering also ends illusions and invisibility on the branded creature. Creatures that are in an alternate form (polymorph, shapechange, Wild Shape, etc.) must succeed on a WIS save (against your Hemocraft save DC) or revert to their true form and be stunned until the end of your next turn. Learn a 5th mutagen formula. The number of mutagens that can be active simultaneously increases to 2.",
    },
    level17Feature: {
      name: "Exalted Mutation + Blood Curse of Corrosion",
      description: "All subclasses: Hemocraft Die increases to d10. Sanguine Mastery: Once per turn, you may reroll any hemocraft die and use either result. Critical hits with a Crimson Rite weapon restore one expended Blood Maledict use. Mutant: Bonus action to end one active mutagen and instantly apply another known formula (usable a number of times equal to your INT modifier per long rest, min 1). Learn a 6th mutagen formula. The number of mutagens that can be active simultaneously increases to 3. Gain the Blood Curse of Corrosion (bonus action, 30 ft: target is poisoned; the target makes a CON save at the end of each of its turns to end the effect; amplified: the target takes 4d6 necrotic damage on each failed save). This curse does not count against your curses known.",
    },
  },
  {
    id: "reaver-profane-soul",
    name: "Profane Soul",
    level9Feature: {
      name: "Otherworldly Patron + Pact Magic + Rite Focus",
      description: "Otherworldly Patron: Randomly select — 1: Archfey, 2: Fiend, 3: Great Old One (d3; see Fate's Selection). Spell Slot Access: When you roll this subclass, you gain access to the Fatebound half-caster spell slot table for the day, using the Warlock spell list. Spellcasting ability is your choice of Intelligence or Wisdom (chosen when you first gain this feature). Learn 2 warlock cantrips. This is in addition to your base Reaver features — it does not replace them. Rite Focus: While Crimson Rite is active on a weapon, it becomes your spellcasting focus and grants a patron-specific benefit (see Profane Soul Patron Benefits table). Mystic Frenzy: When you use your action to cast a cantrip, you may make one weapon attack as a bonus action.",
    },
    level13Feature: {
      name: "Brand of the Sapping Scar + Revealed Arcana + Level 13 Upgrades",
      description: "All subclasses: Hemocraft Die increases to d8. Brand of Castigation upgrades to Brand of Tethering — psychic damage increases to 2× your INT modifier (min 2). The branded creature cannot use the Dash action. If it attempts teleportation or plane-shifting, it takes 4d6 psychic damage and must succeed on a WIS save (against your Hemocraft save DC) or the attempt fails. Hardened Soul: Advantage on saving throws against being charmed or frightened. Esoteric Rites unlock: Rite of the Dead (necrotic damage), Rite of the Oracle (psychic damage), Rite of the Roar (thunder damage). Channel Divinity gains an additional use between rests (3 total). Learn 1 additional Blood Curse. Profane Soul: Branded creatures have disadvantage on saving throws against your warlock spells. Revealed Arcana: Gain a patron-specific spell, castable 1/long rest using a spell slot (see Profane Soul Patron Benefits table).",
    },
    level17Feature: {
      name: "Unsealed Arcana + Blood Curse of the Souleater",
      description: "All subclasses: Hemocraft Die increases to d10. Sanguine Mastery: Once per turn, you may reroll any hemocraft die and use either result. Critical hits with a Crimson Rite weapon restore one expended Blood Maledict use. Profane Soul: Gain a patron-specific spell, castable 1/long rest without expending a spell slot (see Profane Soul Patron Benefits table). Gain the Blood Curse of the Souleater (reaction when a non-construct, non-undead creature within 30 ft drops to 0 HP: you have advantage on attack rolls and resistance to all damage until the end of your next turn; amplified: you regain one expended spell slot; you must finish a long rest before using the amplified effect again). This curse does not count against your curses known.",
    },
  },
];
