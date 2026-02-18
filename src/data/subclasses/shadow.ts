import type { SubclassEntry } from "@/types/forms";

export const SHADOW_SUBCLASSES: SubclassEntry[] = [
  {
    id: "shadow-thief",
    name: "Thief",
    level9Feature: {
      name: "Fast Hands + Second-Story Work",
      description: "Your Cunning Action options expand to include using an object, activating a magic item, or using thieves' tools. Climbing costs you no extra movement, and you can add your DEX modifier in feet to the distance covered by a running jump.",
    },
    level13Feature: {
      name: "Supreme Sneak + Use Magic Device",
      description: "Supreme Sneak: You have advantage on Stealth checks if you move no more than half your speed on a turn. Use Magic Device: You can ignore all class, race, and level requirements on the use of magic items.",
    },
    level17Feature: {
      name: "Thief's Reflexes",
      description: "On the first round of any combat, you take two turns \u2014 once at your normal initiative and once at your initiative minus 10.",
    },
  },
  {
    id: "shadow-assassin",
    name: "Assassin",
    level9Feature: {
      name: "Assassinate + Infiltration Expertise",
      description: "You have advantage on attack rolls against creatures that haven't taken a turn in combat yet. Any hit you score against a surprised creature is a critical hit. Infiltration Expertise: You can establish a false identity, including forged documents and a credible backstory, in 1 hour (rather than the standard 7 days).",
    },
    level13Feature: {
      name: "Improved Infiltration",
      description: "You can create a complete false identity \u2014 including forged documents and a credible backstory \u2014 in 1 minute instead of 1 hour (see level 9 Infiltration Expertise). You have advantage on Deception checks to maintain any false identity.",
    },
    level17Feature: {
      name: "Death Strike",
      description: "When you hit a creature that is surprised, it must succeed on a CON save (DC 8 + proficiency bonus + DEX mod) or have all damage from the hit doubled. This stacks with the critical hit from Assassinate. Additionally, you can perfectly mimic the voice, appearance, and mannerisms of any person you have studied for at least 3 hours.",
    },
  },
  {
    id: "shadow-arcane-trickster",
    name: "Arcane Trickster",
    level9Feature: {
      name: "Mage Hand Legerdemain + Spellcasting",
      description: "Your mage hand is invisible and can be used as a bonus action to pick locks, disarm traps, or stow and retrieve objects without being noticed. You learn 2 additional Wizard cantrips and 3 Wizard spells (at least 2 from enchantment or illusion); these are INT-based. Spell Slot Access: When you roll this subclass, you gain access to the Fatebound half-caster spell slot table for the day.",
    },
    level13Feature: {
      name: "Versatile Trickster",
      description: "As a bonus action, direct your mage hand to distract a creature within 5 ft of it; you gain advantage on all attack rolls against that creature until the end of your turn.",
    },
    level17Feature: {
      name: "Spell Thief",
      description: "Reaction when you are targeted by a spell: the caster must succeed on an INT save (DC 8 + proficiency bonus + INT mod) or the spell fails. If the spell was 3rd level or lower, you can cast it yourself within 8 hours using your INT modifier (1/long rest). Additionally, as a bonus action you can command your mage hand to distract a creature, granting you advantage on the next attack roll you make against it this turn.",
    },
  },
  {
    id: "shadow-mastermind",
    name: "Mastermind",
    level9Feature: {
      name: "Master of Intrigue + Master of Tactics",
      description: "You gain proficiency with the disguise kit, forgery kit, and one gaming set, plus two additional languages. You can use the Help action as a bonus action, and you can Help a creature from up to 30 ft away when aiding on an attack roll or ability check.",
    },
    level13Feature: {
      name: "Misdirection",
      description: "When you are targeted by an attack and a creature within 5 ft of you is granting you cover, you can use your reaction to redirect the attack to that creature instead.",
    },
    level17Feature: {
      name: "Soul of Deceit",
      description: "Your thoughts can't be read by any means. You can present false surface thoughts to any creature reading your mind. You are immune to any effect that compels you to speak the truth. As a reaction when a creature attacks you, you can redirect the attack to a creature within 5 ft of you that is granting you cover (CHA save to resist).",
    },
  },
  {
    id: "shadow-swashbuckler",
    name: "Swashbuckler",
    level9Feature: {
      name: "Rakish Audacity + Fancy Footwork",
      description: "Add your CHA modifier to your initiative rolls. You can apply your Sneak Attack when no other creature is within 5 ft of your target, even without advantage or an ally adjacent. When you make a melee attack against a creature, it cannot make opportunity attacks against you until the start of your next turn.",
    },
    level13Feature: {
      name: "Elegant Maneuver",
      description: "As a bonus action, you gain advantage on the next Acrobatics or Athletics check you make during the same turn.",
    },
    level17Feature: {
      name: "Master Duelist + Panache",
      description: "Master Duelist: When you miss with an attack on your turn, you can reroll the attack with advantage against the same target (1/short rest). Panache: As an action, make a Persuasion check contested by a creature's Insight; a hostile creature that fails is charmed by you for 1 minute (or until harmed), and during that time has disadvantage on attack rolls against any creature other than you.",
    },
  },
  {
    id: "shadow-inquisitive",
    name: "Inquisitive",
    level9Feature: {
      name: "Ear for Deceit + Insightful Fighting",
      description: "When you roll Insight to determine if someone is lying, treat any result below 8 as 8. As a bonus action, make a contested Insight check against a creature's Deception; if you succeed, that creature is your Sneak Attack target until the start of your next turn (no advantage or ally required).",
    },
    level13Feature: {
      name: "Steady Eye",
      description: "You have advantage on Perception and Investigation checks if you move no more than half your speed on your turn.",
    },
    level17Feature: {
      name: "Unerring Eye + Eye for Weakness",
      description: "Unerring Eye: As an action (WIS mod/long rest), sense whether any illusions, shapechangers, or magical deceptions are present within 30 ft. Eye for Weakness: While Insightful Fighting is active against a target, your Sneak Attack deals an additional 3d6 damage against that creature.",
    },
  },
  {
    id: "shadow-scout",
    name: "Scout",
    level9Feature: {
      name: "Skirmisher + Survivalist",
      description: "When an enemy ends its turn within 5 ft of you, you can use your reaction to move up to half your speed without provoking opportunity attacks. You gain proficiency in Nature and Survival; if already proficient in either, you gain Expertise in it instead.",
    },
    level13Feature: {
      name: "Superior Mobility",
      description: "Your walking speed increases by 10 ft. If you have a climbing or swimming speed, those also increase by 10 ft.",
    },
    level17Feature: {
      name: "Ambush Master + Sudden Strike",
      description: "Ambush Master: You have advantage on initiative rolls. The first creature you hit on your first turn in combat becomes an open target \u2014 all friendly creatures have advantage on attack rolls against it until the start of your second turn. Sudden Strike: On your turn, if you use Sneak Attack, you can apply it to two different creatures (each once).",
    },
  },
  {
    id: "shadow-phantom",
    name: "Phantom",
    level9Feature: {
      name: "Whispers of the Dead + Wails from the Grave",
      description: "After each short or long rest, you gain proficiency in one skill or tool of your choice as a spectral echo clings to you. When you deal Sneak Attack damage, you can force the damage to seep to a second creature within 30 ft of the target, dealing necrotic damage equal to half your Sneak Attack dice (no save, no attack roll; uses = proficiency bonus/long rest).",
    },
    level13Feature: {
      name: "Tokens of the Departed",
      description: "When a creature you can see within 30 ft dies, you can use your reaction to capture a soul trinket (max = proficiency bonus trinkets at once). While you hold any trinkets: advantage on death saving throws and CON saves. You can destroy one trinket to ask its spirit one question.",
    },
    level17Feature: {
      name: "Ghost Walk + Death's Friend",
      description: "Ghost Walk: As a bonus action, take on a spectral form for up to 10 minutes (1/long rest). While spectral: you have a fly speed of 10 ft, can move through creatures and objects (taking 1d10 force damage if you end your turn inside an object), and are visible as a ghostly silhouette. Death's Friend: You no longer need to use your Wails from the Grave action \u2014 it triggers automatically when you deal Sneak Attack damage.",
    },
  },
  {
    id: "shadow-soulknife",
    name: "Soulknife",
    level9Feature: {
      name: "Psionic Power + Psychic Blades",
      description: "Gain a pool of psionic energy dice (d6, count = twice your proficiency bonus). Spend a die on a failed proficiency-based skill check to add the result. Spend a die to establish telepathic communication with a creature within 60 ft for 10 minutes. Psychic Blades: Manifest a psychic blade as part of an attack action (finesse, 1d6 psychic, thrown 60 ft). As a bonus action after attacking with a psychic blade, manifest a second blade in your off hand (1d4 psychic, no proficiency bonus to damage).",
    },
    level13Feature: {
      name: "Soul Blades",
      description: "Two options \u2014 Homing Strikes: when you miss with your psychic blades, spend a psionic energy die and add the result to the attack roll. Psychic Teleportation: as a bonus action, hurl a psychic blade and teleport to the space it lands, up to 10 \u00d7 psionic die roll feet away.",
    },
    level17Feature: {
      name: "Rend Mind + Psychic Veil",
      description: "Rend Mind: When you deal Sneak Attack damage with psychic blades, spend 3 psionic energy dice; the target must succeed on a WIS save (DC 8 + proficiency bonus + DEX mod) or be stunned until the end of your next turn (1/long rest without spending dice). Psychic Veil: As an action, become invisible for 1 hour or until you attack, deal damage, or force a save (1/long rest; or spend 1 psionic energy die to use again).",
    },
  },
];
