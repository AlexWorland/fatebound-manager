import type { SubclassEntry } from "@/types/forms";

export const HEXER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "hexer-fiend",
    name: "The Fiend",
    level9Feature: {
      name: "Dark One's Blessing + Own Fortune",
      description: "When you reduce a hostile creature to 0 HP, gain temp HP equal to your CHA modifier + Fatebound level. Own Fortune (1/rest): Add 1d10 to one ability check or saving throw after seeing the roll.",
    },
    level13Feature: {
      name: "Fiendish Resilience",
      description: "After each short or long rest, choose one damage type \u2014 you gain resistance to it until you choose a different one. You cannot choose bludgeoning, piercing, slashing, force, radiant, or psychic.",
    },
    level17Feature: {
      name: "Hurl Through Hell",
      description: "On a hit (1/long rest): banish the target to a lower plane of existence. It returns at the end of your next turn and takes 10d10 psychic damage from the experience. If this reduces it to 0 HP, it is destroyed and permanently banished.",
    },
  },
  {
    id: "hexer-great-old-one",
    name: "The Great Old One",
    level9Feature: {
      name: "Awakened Mind + Entropic Ward",
      description: "You can telepathically communicate with any creature within 30 ft that has a language (no shared language needed). Entropic Ward: Reaction when attacked, impose disadvantage. If the attack misses, you have advantage on your next attack against that creature (1/short rest).",
    },
    level13Feature: {
      name: "Thought Shield",
      description: "Your thoughts cannot be read by any means. You gain resistance to psychic damage. When a creature attempts to read your thoughts or deal psychic damage to you, that creature takes 2d6 psychic damage.",
    },
    level17Feature: {
      name: "Create Thrall",
      description: "Touch an incapacitated creature. It becomes charmed by you indefinitely and shares a telepathic bond with you across any distance (same plane). Remove curse or greater restoration ends the effect.",
    },
  },
  {
    id: "hexer-archfey",
    name: "The Archfey",
    level9Feature: {
      name: "Fey Presence + Misty Escape",
      description: "Fey Presence: Action, charm or frighten creatures in a 10-ft cube originating from you; WIS save negates, lasts until end of your next turn (1/short rest). Misty Escape: Reaction when you take damage, turn invisible and teleport up to 60 ft to an unoccupied space you can see (1/short rest; invisibility ends if you attack or cast).",
    },
    level13Feature: {
      name: "Beguiling Defenses",
      description: "You are immune to the charmed condition. When a creature attempts to charm you, you can use your reaction to turn the charm back on it; the creature must succeed on a WIS save or be charmed by you for 1 minute.",
    },
    level17Feature: {
      name: "Dark Delirium",
      description: "Action (1/short rest): target one creature within 60 ft. It makes a WIS save or is charmed or frightened (your choice) for 1 minute (concentration). The creature perceives a misty, illusory world. It can repeat the save at the end of each of its turns.",
    },
  },
  {
    id: "hexer-celestial",
    name: "The Celestial",
    level9Feature: {
      name: "Healing Light + Radiant Soul",
      description: "Gain a pool of healing dice = 1d6 per Fatebound level. Bonus action, expend dice from the pool (up to 5 at once) to heal a creature you can see within 60 ft. Radiant Soul: Add CHA modifier to radiant or fire damage once per turn. Resistance to radiant damage.",
    },
    level13Feature: {
      name: "Celestial Resilience",
      description: "When you finish a short or long rest, you gain temporary HP equal to half your Fatebound level + your CHA modifier. Choose up to 5 allies within 30 ft \u2014 each also gains temporary HP equal to half your Fatebound level.",
    },
    level17Feature: {
      name: "Searing Vengeance",
      description: "When you or an ally within 60 ft would be reduced to 0 HP, you can use your reaction to have them instead drop to 1 HP, then deal 2d8 + CHA modifier radiant damage to each hostile creature within 30 ft and blind them until end of their next turn (1/long rest).",
    },
  },
  {
    id: "hexer-hexblade",
    name: "The Hexblade",
    level9Feature: {
      name: "Hexblade's Curse + Hex Warrior",
      description: "Hexblade's Curse (1/short rest): Bonus action, curse a creature within 30 ft for 1 minute. Your attacks against it score a critical hit on a roll of 19 or 20, deal bonus necrotic = your proficiency bonus, and if it dies while cursed you regain HP = Fatebound level + CHA mod. Hex Warrior: You can use CHA instead of STR or DEX for attacks with one weapon you touch during a long rest. Gain proficiency with medium armor, shields, and martial weapons.",
    },
    level13Feature: {
      name: "Armor of Hexes",
      description: "When the target of your Hexblade's Curse hits you with an attack, roll a d6. On a 4 or higher, the attack misses you, regardless of its roll.",
    },
    level17Feature: {
      name: "Master of Hexes",
      description: "When the creature affected by your Hexblade's Curse dies, you can apply the curse to a new creature within 30 ft (no action required). Additionally, your critical hit range with the Hexblade's Curse extends to 18\u201320, and the bonus necrotic damage doubles.",
    },
  },
  {
    id: "hexer-undead",
    name: "The Undead",
    level9Feature: {
      name: "Form of Dread",
      description: "Bonus action (prof bonus/long rest): transform for 1 minute. You gain temp HP equal to 1d10 + Fatebound level, become immune to the frightened condition, and once per turn when you deal damage to a creature you can make it frightened of you until end of your next turn (WIS save negates).",
    },
    level13Feature: {
      name: "Spirit Projection",
      description: "Once per long rest, your spirit projects from your body for up to 1 hour. While projected: you have resistance to all damage except radiant, you can move through creatures and objects, and when you deal necrotic damage you regain HP equal to half the necrotic damage dealt.",
    },
    level17Feature: {
      name: "Mortal Husk",
      description: "When you are reduced to 0 HP, you can use your reaction to instantly restore yourself to half your HP maximum and cause a burst of necrotic energy \u2014 each creature within 30 ft takes 2d8 + CHA modifier necrotic damage (CON save for half). Usable once per long rest; your body withers visibly until you complete a long rest.",
    },
  },
  {
    id: "hexer-fathomless",
    name: "The Fathomless",
    level9Feature: {
      name: "Tentacle of the Deeps + Gift of the Sea",
      description: "Bonus action (prof bonus/long rest): summon a spectral tentacle within 10 ft. When a creature starts its turn within 10 ft of the tentacle, you can deal 1d8 cold damage and reduce its speed by 10 ft until your next turn. Gift of the Sea: Gain a swimming speed of 40 ft and the ability to breathe underwater.",
    },
    level13Feature: {
      name: "Oceanic Soul",
      description: "You gain resistance to cold damage. As an action, you can grant up to 5 willing creatures you touch the ability to breathe underwater and a swim speed equal to their walking speed for 10 minutes.",
    },
    level17Feature: {
      name: "Fathomless Plunge",
      description: "Action (1/long rest): open a rift to the deep ocean. Each creature of your choice within 30 ft is teleported to an unoccupied space within 90 ft that you designate, as if dragged by invisible currents. Until the start of your next turn, each creature in the 30-ft radius that moves more than 10 ft takes 4d8 cold damage.",
    },
  },
  {
    id: "hexer-genie",
    name: "The Genie",
    level9Feature: {
      name: "Genie's Vessel + Elemental Gift",
      description: "Randomly select genie type: 1-Dao (bludgeoning), 2-Djinni (thunder), 3-Efreeti (fire), 4-Marid (cold). Once per turn, deal bonus damage of that type = prof bonus on a hit. Genie's Vessel: You possess a tiny vessel (bottle, lamp, etc.) \u2014 you can enter it as an action (holds only you) and spend up to 4 hours inside per long rest, emerging refreshed. Expend a spell slot of any level to grant yourself advantage on one attack or ability check.",
    },
    level13Feature: {
      name: "Elemental Gift",
      description: "You gain resistance to your genie's damage type (bludgeoning for Dao, thunder for Djinni, fire for Efreeti, cold for Marid). As a bonus action, you can gain a fly speed of 30 ft for up to 10 minutes (proficiency bonus uses per long rest).",
    },
    level17Feature: {
      name: "Limited Wish",
      description: "Once per long rest, choose one spell of 6th level or lower from any spell list. That spell is cast as part of this action, requiring no components or spell slots. You don't need to meet any requirements of the spell, including level requirements.",
    },
  },
  {
    id: "hexer-undying",
    name: "The Undying",
    level9Feature: {
      name: "Among the Dead + Defy Death",
      description: "You learn the spare the dying cantrip (CHA-based, 30-ft range). Undead have disadvantage on attack rolls against you. If you succeed on a death saving throw, gain 1 HP as a reaction (1/long rest).",
    },
    level13Feature: {
      name: "Undying Nature",
      description: "You can hold your breath indefinitely, require no food or water, and age at one-tenth the normal rate. You have advantage on saving throws against disease and the poisoned condition, and you require only 4 hours of sleep to gain the benefits of a long rest.",
    },
    level17Feature: {
      name: "Indestructible Life",
      description: "When you make a death saving throw and roll a 20, you regain 1 HP as normal \u2014 and additionally regain HP equal to your Fatebound level. You have advantage on death saving throws. When you stabilize, you regain consciousness (1 HP) at the start of your next turn rather than after 1d4 hours.",
    },
  },
];
