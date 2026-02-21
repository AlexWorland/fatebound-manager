import type { SubclassEntry } from "@/types/forms";

export const SHADOW_SUBCLASSES: SubclassEntry[] = [
  {
    id: "shadow-thief",
    name: "Thief",
    level9Feature: {
      name: "Fast Hands + Second-Story Work",
      description: "Your Cunning Action options expand to include making a Sleight of Hand check, using thieves' tools to disarm a trap or open a lock, or taking the Use an Object action. Climbing costs you no extra movement, and you can add your DEX modifier in feet to the distance covered by a running jump.",
    },
    level13Feature: {
      name: "Supreme Sneak + Use Magic Device",
      description: "Supreme Sneak: You have advantage on Stealth checks if you move no more than half your speed on a turn. Use Magic Device: You can ignore all class, race, and level requirements on the use of magic items.",
    },
    level17Feature: {
      name: "Thief's Reflexes",
      description: "On the first round of any combat, you take two turns — once at your normal initiative and once at your initiative minus 10. You can't use this feature when you are surprised.",
    },
  },
  {
    id: "shadow-assassin",
    name: "Assassin",
    level9Feature: {
      name: "Assassinate + Infiltration Expertise",
      description: "You have advantage on attack rolls against creatures that haven't taken a turn in combat yet. Any hit you score against a surprised creature is a critical hit. Infiltration Expertise: You can establish a false identity, including forged documents and a credible backstory, in 7 days and 25 gp.",
    },
    level13Feature: {
      name: "Impostor",
      description: "You can unerringly mimic another person's speech, writing, and behavior. You must spend at least 3 hours studying the person — listening to speech, examining handwriting, and observing mannerisms. Your ruse is indiscernible to a casual observer. If a wary creature suspects something is amiss, you have advantage on any Charisma (Deception) check you make to avoid detection.",
    },
    level17Feature: {
      name: "Death Strike",
      description: "When you hit a creature that is surprised, it must succeed on a CON save (DC 8 + proficiency bonus + DEX mod) or have all damage from the hit doubled. This stacks with the critical hit from Assassinate.",
    },
  },
  {
    id: "shadow-arcane-trickster",
    name: "Arcane Trickster",
    level9Feature: {
      name: "Mage Hand Legerdemain + Spellcasting",
      description: "Your mage hand is invisible and can be used as a bonus action to pick locks, disarm traps, or stow and retrieve objects without being noticed. You learn 3 Wizard cantrips (one of which is mage hand, plus 2 of your choice from any school) and 3 Wizard spells (at least 2 from enchantment or illusion); these are INT-based. Spell Slot Access: When you roll this subclass, you gain access to the Fatebound half-caster spell slot table for the day. This is in addition to your base Shadow features (Sneak Attack, Cunning Action, etc.) — it does not replace them.",
    },
    level13Feature: {
      name: "Versatile Trickster",
      description: "As a bonus action, direct your mage hand to distract a creature within 5 ft of it; you gain advantage on all attack rolls against that creature until the end of your turn.",
    },
    level17Feature: {
      name: "Spell Thief",
      description: "Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can use your reaction to force the creature to make a saving throw with its spellcasting ability modifier against your spell save DC. On a failed save, you negate the spell's effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast. For the next 8 hours, you know the spell and can cast it using your spell slots. The creature can't cast that spell until the 8 hours have passed. Once you use this feature, you can't use it again until you finish a long rest.",
    },
  },
  {
    id: "shadow-mastermind",
    name: "Mastermind",
    level9Feature: {
      name: "Master of Intrigue + Master of Tactics",
      description: "You gain proficiency with the disguise kit, forgery kit, and one gaming set, plus two additional languages. You can unerringly mimic the speech patterns and accent of a creature you've heard speak for at least 1 minute, allowing you to pass as a native speaker of a particular land provided you know the language. You can use the Help action as a bonus action. When you use the Help action to aid an ally in attacking a creature, the target of that attack can be within 30 ft of you, rather than 5 ft, if the target can see or hear you.",
    },
    level13Feature: {
      name: "Misdirection",
      description: "When you are targeted by an attack and a creature within 5 ft of you is granting you cover, you can use your reaction to redirect the attack to that creature instead.",
    },
    level17Feature: {
      name: "Soul of Deceit",
      description: "Your thoughts can't be read by telepathy or other means, unless you allow it. You can present false thoughts by making a Charisma (Deception) check contested by the mind reader's Wisdom (Insight) check. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates you are being truthful if you so choose, and you can't be compelled to tell the truth by magic.",
    },
  },
  {
    id: "shadow-swashbuckler",
    name: "Swashbuckler",
    level9Feature: {
      name: "Rakish Audacity + Fancy Footwork + Panache",
      description: "Add your CHA modifier to your initiative rolls. You can apply your Sneak Attack when no other creature is within 5 ft of you and you are within 5 ft of your target, even without advantage or an ally adjacent. (Vanilla 5e Swashbuckler.) When you make a melee attack against a creature, it cannot make opportunity attacks against you until the start of your next turn. Panache: As an action, make a Persuasion check contested by a creature's Insight. If hostile and you succeed: the creature has disadvantage on attacks against targets other than you and can't make opportunity attacks against creatures other than you. If not hostile and you succeed: the creature is charmed for 1 minute.",
    },
    level13Feature: {
      name: "Elegant Maneuver",
      description: "As a bonus action, you gain advantage on the next Acrobatics or Athletics check you make during the same turn.",
    },
    level17Feature: {
      name: "Master Duelist",
      description: "When you miss with an attack roll, you can roll again with advantage. Once used, you can't do so again until you finish a short or long rest.",
    },
  },
  {
    id: "shadow-inquisitive",
    name: "Inquisitive",
    level9Feature: {
      name: "Ear for Deceit + Insightful Fighting",
      description: "When you roll Insight to determine if someone is lying, treat a roll of 7 or lower on the d20 as an 8. As a bonus action, make a contested Insight check against a creature's Deception; if you succeed, that creature is your Sneak Attack target for 1 minute (no advantage or ally required, but not if you have disadvantage on the attack roll). The effect ends early if you use this feature against a different target.",
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
      description: "When an enemy ends its turn within 5 ft of you, you can use your reaction to move up to half your speed without provoking opportunity attacks. You gain proficiency in Nature and Survival (if you don't already have it), and your proficiency bonus is doubled for any ability check that uses either of those proficiencies.",
    },
    level13Feature: {
      name: "Superior Mobility",
      description: "Your walking speed increases by 10 ft. If you have a climbing or swimming speed, those also increase by 10 ft.",
    },
    level17Feature: {
      name: "Ambush Master + Sudden Strike",
      description: "Ambush Master: You have advantage on initiative rolls. The first creature you hit on your first turn in combat becomes an open target — all friendly creatures have advantage on attack rolls against it until the start of your next turn. Sudden Strike: If you take the Attack action on your turn, you can make one additional attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but you can't use your Sneak Attack against the same target more than once in a turn.",
    },
  },
  {
    id: "shadow-phantom",
    name: "Phantom",
    level9Feature: {
      name: "Whispers of the Dead + Wails from the Grave + Tokens of the Departed",
      description: "After each short or long rest, you gain proficiency in one skill or tool of your choice as a spectral echo clings to you. When you deal Sneak Attack damage, you can force the damage to seep to a second creature within 30 ft of the target, dealing necrotic damage equal to half your Sneak Attack dice (rounded up; no save, no attack roll; uses = proficiency bonus/long rest). Tokens of the Departed: When a creature you can see within 30 ft dies, you can use your reaction to capture a soul trinket (max = proficiency bonus trinkets at once). While you hold any trinkets: advantage on death saving throws and CON saves. You can destroy one trinket as an action to ask its spirit one question. Alternatively, when you deal Sneak Attack damage, you can destroy one trinket on your person to use Wails from the Grave without expending a use of that feature.",
    },
    level13Feature: {
      name: "Ghost Walk",
      description: "As a bonus action, take on a spectral form for up to 10 minutes. While spectral: you have a fly speed of 10 ft, can hover, attack rolls have disadvantage against you, and you can move through creatures and objects as if they were difficult terrain (taking 1d10 force damage if you end your turn inside a creature or object). To use this feature again, you must finish a long rest or destroy one of your soul trinkets as part of the bonus action used to activate Ghost Walk.",
    },
    level17Feature: {
      name: "Death's Friend",
      description: "When you use your Wails from the Grave, you can deal the necrotic damage to both the first and the second creature (both receive half your Sneak Attack dice in necrotic damage). Additionally, at the end of each long rest, a soul trinket appears in your hand if you don't currently have any soul trinkets.",
    },
  },
  {
    id: "shadow-soulknife",
    name: "Soulknife",
    level9Feature: {
      name: "Psionic Power + Psychic Blades",
      description: "Gain a pool of psionic energy dice (d6, scaling to d8 at level 11 and d12 at level 17; count = twice your proficiency bonus). When you fail a proficiency-based skill or tool check, roll one psionic energy die and add the result to the check; you expend the die only if the roll succeeds. As an action (Psychic Whispers), choose up to a number of creatures equal to your proficiency bonus that you can see; roll one psionic energy die. For a number of hours equal to the number rolled, you can communicate telepathically with each chosen creature as long as you are within 1 mile of it (first use after each long rest doesn't expend the die). Psychic Blades: Manifest a psychic blade as part of an attack action (finesse, 1d6 psychic, thrown 60 ft). As a bonus action after attacking with a psychic blade, manifest a second blade in your off hand (1d4 psychic, no proficiency bonus to damage).",
    },
    level13Feature: {
      name: "Soul Blades",
      description: "Two options — Homing Strikes: when you miss with your psychic blades, spend a psionic energy die and add the result to the attack roll. Psychic Teleportation: as a bonus action, hurl a psychic blade and teleport to the space it lands, up to 10 × psionic die roll feet away.",
    },
    level17Feature: {
      name: "Rend Mind + Psychic Veil",
      description: "Rend Mind: When you deal Sneak Attack damage with psychic blades, you can force the target to make a WIS save (DC 8 + proficiency bonus + DEX mod) or be stunned for 1 minute. The stunned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. You can use this feature once per long rest without cost; additional uses require spending 3 psionic energy dice each. Psychic Veil: As an action, become invisible for 1 hour or until you attack, deal damage, or force a save (1/long rest; or spend 1 psionic energy die to use again).",
    },
  },
];
