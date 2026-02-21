import type { SubclassEntry } from "@/types/forms";

export const HEXER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "hexer-fiend",
    name: "The Fiend",
    level9Feature: {
      name: "Dark One's Blessing + Dark One's Own Luck",
      description: "When you reduce a hostile creature to 0 HP, gain temp HP equal to your CHA modifier + Fatebound level. Dark One's Own Luck (1/short rest): Add 1d10 to one ability check or saving throw after seeing the roll.",
    },
    level13Feature: {
      name: "Fiendish Resilience",
      description: "After each short or long rest, choose one damage type other than force — you gain resistance to it until you choose a different one with this feature.",
    },
    level17Feature: {
      name: "Hurl Through Hell",
      description: "On a hit (1/long rest): banish the target to a lower plane of existence. It returns at the end of your next turn. If the target is not a fiend, it takes 10d10 psychic damage from the experience.",
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
      description: "Your thoughts can't be read by telepathy or other means unless you allow it. You gain resistance to psychic damage. Whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do (after applying your resistance).",
    },
    level17Feature: {
      name: "Create Thrall",
      description: "Touch an incapacitated humanoid. It becomes charmed by you until a remove curse spell is cast on it, the charmed condition is removed, or you use this feature again (which ends the previous thrall). You can communicate telepathically with the charmed creature as long as you are on the same plane.",
    },
  },
  {
    id: "hexer-archfey",
    name: "The Archfey",
    level9Feature: {
      name: "Fey Presence + Misty Escape",
      description: "Fey Presence: Action, charm or frighten creatures in a 10-ft cube originating from you; WIS save negates, lasts until end of your next turn (1/short rest). Misty Escape: Reaction when you take damage, turn invisible and teleport up to 60 ft to an unoccupied space you can see (1/short rest; invisibility ends at the start of your next turn, or earlier if you attack or cast a spell).",
    },
    level13Feature: {
      name: "Beguiling Defenses",
      description: "You are immune to the charmed condition. When a creature attempts to charm you, you can use your reaction to turn the charm back on it; the creature must succeed on a WIS save or be charmed by you for 1 minute or until the creature takes any damage.",
    },
    level17Feature: {
      name: "Dark Delirium",
      description: "Action (1/short rest): target one creature within 60 ft. It makes a WIS save or is charmed or frightened (your choice) for 1 minute (concentration). The creature perceives a misty, illusory world. It can repeat the save at the end of each of its turns. The effect ends early if the creature takes any damage.",
    },
  },
  {
    id: "hexer-celestial",
    name: "The Celestial",
    level9Feature: {
      name: "Healing Light + Radiant Soul",
      description: "Gain a pool of healing dice = (1 + Fatebound level) d6. Bonus action, expend dice from the pool (a number equal to your Charisma modifier, minimum of one, at once) to heal a creature you can see within 60 ft. Radiant Soul: When you cast a spell that deals radiant or fire damage, add your CHA modifier to one radiant or fire damage roll of that spell against one target. Resistance to radiant damage.",
    },
    level13Feature: {
      name: "Celestial Resilience",
      description: "When you finish a short or long rest, you gain temporary HP equal to your Fatebound level + your CHA modifier. Choose up to 5 creatures you can see — each also gains temporary HP equal to half your Fatebound level + your CHA modifier.",
    },
    level17Feature: {
      name: "Searing Vengeance",
      description: "When you would have to make a death saving throw at the start of your turn, you can instead spring back to your feet (1/long rest). You regain hit points equal to half your hit point maximum and stand up. Each creature of your choice within 30 ft takes 2d8 + CHA modifier radiant damage and is blinded until the end of the current turn.",
    },
  },
  {
    id: "hexer-hexblade",
    name: "The Hexblade",
    level9Feature: {
      name: "Hexblade's Curse + Hex Warrior",
      description: "Hexblade's Curse (1/short rest): Bonus action, curse a creature within 30 ft for 1 minute. Your attacks against it score a critical hit on a roll of 19 or 20, deal bonus damage equal to your proficiency bonus, and if it dies while cursed you regain HP = Fatebound level + CHA mod. Hex Warrior: You can use CHA instead of STR or DEX for attacks with one weapon you are proficient with and that lacks the two-handed property, touching it during a long rest. Gain proficiency with medium armor, shields, and martial weapons.",
    },
    level13Feature: {
      name: "Armor of Hexes",
      description: "When the target of your Hexblade's Curse hits you with an attack, roll a d6. On a 4 or higher, the attack misses you, regardless of its roll.",
    },
    level17Feature: {
      name: "Master of Hexes",
      description: "When a creature cursed by your Hexblade's Curse dies, you can apply the curse to a different creature you can see within 30 feet of you (no action required, no spell slot expended). When you apply the curse in this way, you don't regain hit points from Hexblade's Curse.",
    },
  },
  {
    id: "hexer-undead",
    name: "The Undead",
    level9Feature: {
      name: "Form of Dread",
      description: "Bonus action (prof bonus/long rest): transform for 1 minute. You gain temp HP equal to 1d10 + Fatebound level, become immune to the frightened condition, and once during each of your turns when you hit a creature with an attack, you can force it to make a WIS save or be frightened of you until the end of your next turn.",
    },
    level13Feature: {
      name: "Spirit Projection",
      description: "Once per long rest, as an action, your spirit leaves your body (concentration, up to 1 hour). Your body falls unconscious, though it remains stable. While projected, your spirit can move through creatures and objects. Your spirit and body both gain resistance to bludgeoning, piercing, and slashing damage. You have a flying speed equal to your walking speed. Your conjuration and necromancy spells require no verbal, somatic, or non-costly material components while projected. While using your Form of Dread, you regain hit points equal to half any necrotic damage you deal. If you end your turn inside a solid object, you take 1d10 force damage. The projection ends early if your concentration is broken.",
    },
    level17Feature: {
      name: "Necrotic Husk",
      description: "Your connection to undeath saturates your body: you gain resistance to necrotic damage, or immunity if you are transformed using your Form of Dread. Additionally, when you are reduced to 0 hit points, you can use your reaction to drop to 1 hit point instead. Each creature within 10 ft of you takes necrotic damage equal to 2d10 + your Fatebound level when you trigger this reaction. You then gain 1 level of exhaustion. You can use this reaction once per 1d4 long rests.",
    },
  },
  {
    id: "hexer-fathomless",
    name: "The Fathomless",
    level9Feature: {
      name: "Tentacle of the Deeps + Gift of the Sea",
      description: "Tentacle of the Deeps: Bonus action (prof bonus/long rest) to summon a 10-ft spectral tentacle at a point within 60 ft for 1 minute. When you summon it, you can make a melee spell attack (10 ft reach) against one creature within 10 ft of it — on a hit, 1d8 cold damage and the target's speed is reduced by 10 ft until the start of your next turn. As a bonus action on your turn, you can move the tentacle up to 30 ft and repeat the attack. Gift of the Sea: You gain a swimming speed of 40 ft and can breathe underwater.",
    },
    level13Feature: {
      name: "Oceanic Soul + Guardian Coil",
      description: "You gain resistance to cold damage. You can also speak and understand Aquan. Guardian Coil: As a reaction when you or a creature you can see within 10 ft of your Tentacle of the Deeps takes damage, the tentacle interposes itself — reduce the damage by 1d8.",
    },
    level17Feature: {
      name: "Fathomless Plunge",
      description: "As an action, you can teleport yourself and up to 5 other willing creatures you can see within 30 ft. Amid a whirl of tentacles, you all vanish and reappear up to 1 mile away in a body of water you have seen (pond size or larger) or within 30 ft of it, each of you appearing in an unoccupied space within 30 ft of the others. 1/short or long rest. Additionally, your Tentacle of the Deeps improves: it now deals 2d8 cold damage on a hit, and the Guardian Coil reaction reduces damage by 2d8.",
    },
  },
  {
    id: "hexer-genie",
    name: "The Genie",
    level9Feature: {
      name: "Genie's Vessel + Elemental Gift",
      description: "Randomly select genie type: 1-Dao (bludgeoning), 2-Djinni (thunder), 3-Efreeti (fire), 4-Marid (cold). Once per turn, deal bonus damage of that type = prof bonus on a hit. Genie's Vessel: You possess a tiny vessel (bottle, lamp, etc.) — you can enter it as an action (holds only you) and spend up to a number of hours equal to twice your proficiency bonus inside per long rest, emerging refreshed. Elemental Gift: You gain resistance to your genie's damage type.",
    },
    level13Feature: {
      name: "Sanctuary Vessel",
      description: "When you enter your Genie's Vessel, you can choose up to 5 willing creatures you can see within 30 ft to enter with you. The interior becomes a comfortable extradimensional space. As a bonus action, you can eject any number of creatures from the vessel; everyone is also ejected if you leave, die, or the vessel is destroyed. Anyone who remains inside for at least 10 minutes gains the benefit of a short rest, and can add your proficiency bonus to the number of hit points they regain if they spend any Hit Dice as part of that short rest. As a bonus action, you can gain a fly speed of 30 ft for up to 10 minutes (proficiency bonus uses per long rest).",
    },
    level17Feature: {
      name: "Limited Wish",
      description: "Once per 1d4 long rests, you can entreat your patron for a wish. Choose one spell of 6th level or lower from any spell list that has a casting time of 1 action. That spell is cast as part of this action, requiring no components or spell slots. You don't need to meet any requirements of the spell, including level requirements.",
    },
  },
  {
    id: "hexer-undying",
    name: "The Undying",
    level9Feature: {
      name: "Among the Dead + Defy Death",
      description: "You learn the spare the dying cantrip. When an undead targets you directly with an attack or harmful spell, that creature must make a WIS save against your spell save DC or choose a new target, potentially wasting the attack or spell (on a success, immune to this effect for 24 hours; if you target the undead with an attack or harmful spell, it is also immune for 24 hours). Defy Death (1/long rest): When you succeed on a death saving throw or stabilize a creature with spare the dying, regain hit points equal to 1d8 + your CON modifier (minimum 1).",
    },
    level13Feature: {
      name: "Undying Nature",
      description: "You can hold your breath indefinitely and you don't require food, water, or sleep (though you still benefit from finishing rests). For every 10 years that pass, your body ages only 1 year, and you are immune to being magically aged.",
    },
    level17Feature: {
      name: "Indestructible Life",
      description: "On your turn, you can use a bonus action to regain hit points equal to 1d8 + your Fatebound level. If you put a severed part of your body back in place when you use this feature, the part reattaches. Once you use this feature, you can't use it again until you finish a short or long rest.",
    },
  },
];;
