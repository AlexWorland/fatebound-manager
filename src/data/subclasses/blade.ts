import type { SubclassEntry } from "@/types/forms";

export const BLADE_SUBCLASSES: SubclassEntry[] = [
  {
    id: "blade-champion",
    name: "Champion",
    level9Feature: {
      name: "Improved Critical + Remarkable Athlete",
      description: "Your weapon attacks score a critical hit on a roll of 19 or 20. Add half your proficiency bonus (rounded up) to any STR, DEX, or CON check that doesn't already include your full proficiency bonus.",
    },
    level13Feature: {
      name: "Additional Fighting Style",
      description: "Gain an additional Fighting Style (roll d6).",
    },
    level17Feature: {
      name: "Superior Critical + Survivor",
      description: "Crit on 18\u201320. Survivor: At the start of each of your turns, if you are below half your hit point maximum and have at least 1 HP, you regain 5 + CON mod hit points.",
    },
  },
  {
    id: "blade-battle-master",
    name: "Battle Master",
    level9Feature: {
      name: "Superiority Dice",
      description: "Gain 4 superiority dice (d8) that recharge on a short rest. Randomly select 3 maneuvers from the Battle Master Maneuver table; maneuver save DC = 8 + prof + STR or DEX mod.",
    },
    level13Feature: {
      name: "Superiority Dice d10 + Know Your Enemy",
      description: "Superiority dice increase to d10. Learn a 4th maneuver. Know Your Enemy: Study a creature for 1 minute to learn two of: STR/DEX/CON scores, AC, current HP total, class levels, or fighter levels (if any).",
    },
    level17Feature: {
      name: "Superiority Dice d12 + Relentless",
      description: "Superiority dice increase to d12 and you gain a 5th maneuver. Relentless: If you have no superiority dice remaining when you roll initiative, regain 1 die.",
    },
  },
  {
    id: "blade-eldritch-knight",
    name: "Eldritch Knight",
    level9Feature: {
      name: "Spellcasting + Weapon Bond",
      description: "Learn 3 Wizard cantrips and 3 Wizard spells (at least 2 from abjuration or evocation); these are INT-based. Spell Slot Access: When you roll this subclass, you gain access to the Fatebound half-caster spell slot table for the day. Weapon Bond: ritual-bond a weapon; you can summon it to your hand as a bonus action and cannot be disarmed of it.",
    },
    level13Feature: {
      name: "War Magic + Eldritch Strike",
      description: "War Magic: When you cast a cantrip, you may make one weapon attack as a bonus action. Eldritch Strike: A creature you hit with a weapon attack has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.",
    },
    level17Feature: {
      name: "Arcane Charge + Improved War Magic",
      description: "Arcane Charge: When you Action Surge, you may teleport up to 30 ft to an unoccupied space you can see before or after the extra action. Improved War Magic: When you cast any spell (not just a cantrip), you may make one weapon attack as a bonus action.",
    },
  },
  {
    id: "blade-arcane-archer",
    name: "Arcane Archer",
    level9Feature: {
      name: "Arcane Shot",
      description: "Randomly select 2 Arcane Shot options from: 1-Banishing, 2-Beguiling, 3-Bursting, 4-Enfeebling, 5-Grasping, 6-Piercing, 7-Seeking, 8-Shadow. Gain 2 uses per short rest; shots deal +2d6 of their type. All arrows you fire count as magical. Save DC = 8 + proficiency bonus + Intelligence modifier.",
    },
    level13Feature: {
      name: "Curving Shot",
      description: "When an Arcane Shot misses, you may redirect it to a different creature within 60 ft of the original target (no new attack roll needed). Arcane Shot damage increases to +3d6.",
    },
    level17Feature: {
      name: "Ever-Ready Shot",
      description: "If you have no Arcane Shot uses remaining when you roll initiative, regain 1 use. Arcane Shot damage dice are doubled (roll twice, add both results).",
    },
  },
  {
    id: "blade-cavalier",
    name: "Cavalier",
    level9Feature: {
      name: "Unwavering Mark + Born to the Saddle",
      description: "When you hit a creature with a melee attack, mark it until the end of your next turn. The marked creature has disadvantage on attack rolls against any target other than you. If it attacks someone else while within 5 ft of you, you may make one melee weapon attack against it as a bonus action (uses = STR mod/long rest). You have advantage on saving throws to avoid falling off a mount.",
    },
    level13Feature: {
      name: "Warding Maneuver + Sentinel Reach",
      description: "Warding Maneuver: When you or a creature within 5 ft is hit, use your reaction to add 1d8 to the target's AC; if the attack still hits, the target has resistance to its damage (CON mod/long rest). Creatures provoke opportunity attacks from you when they move within your reach.",
    },
    level17Feature: {
      name: "Ferocious Charger + Vigilant Defender",
      description: "Ferocious Charger: When you move at least 10 ft in a straight line before hitting with a melee attack, deal an extra 1d8 damage and the target must succeed on a STR save (DC 8 + prof + STR mod) or be knocked prone. Vigilant Defender: You can make an opportunity attack on each other creature's turn (not only once per round), though never on the same creature twice per round.",
    },
  },
  {
    id: "blade-samurai",
    name: "Samurai",
    level9Feature: {
      name: "Fighting Spirit",
      description: "Bonus action: gain advantage on all weapon attack rolls this turn and 5 temporary hit points. Uses = 3/long rest. Additionally, gain proficiency in one of History, Insight, Performance, or Persuasion.",
    },
    level13Feature: {
      name: "Elegant Courtier + Tireless Spirit",
      description: "Elegant Courtier: Add your WIS modifier to Persuasion checks and gain proficiency in WIS saving throws. Tireless Spirit: If you have no Fighting Spirit uses remaining when you roll initiative, regain 1 use.",
    },
    level17Feature: {
      name: "Rapid Strike + Strength Before Death",
      description: "Rapid Strike: When you have advantage on a weapon attack, forgo the advantage to make one additional weapon attack as part of the same action. Strength Before Death: When you are reduced to 0 HP, you may immediately take an extra turn (1/long rest). After that turn ends, you fall unconscious normally.",
    },
  },
  {
    id: "blade-echo-knight",
    name: "Echo Knight",
    level9Feature: {
      name: "Manifest Echo",
      description: "As a bonus action, create a magical echo in an unoccupied space within 15 ft (CON mod/long rest). You can make attacks as though you were in the echo's space, swap places with your echo as a bonus action (maximum once per turn), and creatures provoke opportunity attacks from the echo as well as from you.",
    },
    level13Feature: {
      name: "Echo Avatar + Shadow Martyr",
      description: "Echo Avatar: Transfer your senses to your echo for up to 10 minutes (concentration); you are blinded and deafened while doing so, but perceive through the echo up to 1,000 ft away. Shadow Martyr: Reaction when a creature you can see within 5 ft of your echo is attacked: teleport your echo to the attacker's target, and the echo takes the hit instead.",
    },
    level17Feature: {
      name: "Legion of One + Reclaim Potential",
      description: "Legion of One: You can create two echoes simultaneously with a single bonus action. Reclaim Potential: When your echo is destroyed, you gain temporary hit points equal to your CON modifier + your proficiency bonus (CON mod/long rest).",
    },
  },
  {
    id: "blade-psi-warrior",
    name: "Psi Warrior",
    level9Feature: {
      name: "Psionic Power",
      description: "Gain psionic energy dice equal to your proficiency bonus (d6 each, recharge on long rest; spend 1 to recharge one die on a short rest). Use them for: Protective Field (reaction: reduce damage to yourself or an ally within 30 ft by the die roll), Psionic Strike (bonus force damage on a hit equal to the die), or Telekinetic Movement (move one Large-or-smaller creature or object up to 30 ft with an action).",
    },
    level13Feature: {
      name: "Telekinetic Adept",
      description: "Psi-Powered Leap: bonus action, fly at double your walking speed until the end of this turn. Telekinetic Thrust: when you deal Psionic Strike damage, the target must succeed on a STR save (DC 8 + prof + INT mod) or be knocked 10 ft in a direction of your choice and fall prone. Psionic dice increase to d8.",
    },
    level17Feature: {
      name: "Bulwark of Force + Telekinetic Master",
      description: "Bulwark of Force: Bonus action (1/long rest, 1 minute): choose up to your INT modifier creatures you can see within 30 ft (including yourself). Each chosen creature gains half cover. Telekinetic Master: Cast telekinesis once per long rest without a spell slot (INT-based); you can use a bonus action to make a Psionic Strike attack while concentrating. Psionic dice increase to d10.",
    },
  },
  {
    id: "blade-rune-knight",
    name: "Rune Knight",
    level9Feature: {
      name: "Rune Carving + Giant's Might",
      description: "Learn 2 runes (roll 2d6: 1-Cloud, 2-Fire, 3-Frost, 4-Hill, 5-Stone, 6-Storm; if you roll the same rune twice, reroll the second die); each grants an active and a passive benefit (e.g., Fire Rune: +2\u00d7 prof bonus to tool checks, and use reaction to restrain a creature on a hit in a flaming cage). Giant's Might (bonus action, prof bonus/long rest): grow to Large size, deal +1d6 damage once per turn, and gain advantage on STR checks and saves for 1 minute.",
    },
    level13Feature: {
      name: "Runic Shield + 3rd Rune",
      description: "Runic Shield: Reaction when a creature within 60 ft is hit by an attack: force the attacker to reroll the attack die and use the new result. Learn a 3rd rune. Giant's Might bonus damage increases to +1d8.",
    },
    level17Feature: {
      name: "Runic Juggernaut",
      description: "Giant's Might now grants Huge size and +1d10 bonus damage (instead of +1d8). Learn a 4th rune. Each rune can be invoked twice per short rest instead of once.",
    },
  },
  {
    id: "blade-banneret",
    name: "Banneret (Purple Dragon Knight)",
    level9Feature: {
      name: "Rallying Cry + Royal Envoy",
      description: "When you use Second Wind, up to 3 allies within 60 ft that you can see regain hit points equal to your Fatebound level (no action required). Gain proficiency in Persuasion; if already proficient, gain Expertise in it instead.",
    },
    level13Feature: {
      name: "Inspiring Surge",
      description: "When you use Action Surge, choose one ally within 60 ft who can see or hear you; that ally may use their reaction to make one melee or ranged weapon attack.",
    },
    level17Feature: {
      name: "Bulwark",
      description: "When you use your Indomitable feature to reroll a saving throw, you may choose one ally within 60 ft that failed the same save. That ally may also reroll and use the new result.",
    },
  },
];
