import type { SubclassEntry } from "@/types/forms";

export const WARDEN_SUBCLASSES: SubclassEntry[] = [
  {
    id: "warden-devotion",
    name: "Oath of Devotion",
    level9Feature: {
      name: "Sacred Weapon",
      description: "Action: touch one weapon. For 1 minute, add your CHA modifier to attack rolls made with it and it sheds bright light in a 20-ft radius. Ends early if you drop the weapon or fall unconscious.",
    },
    level13Feature: {
      name: "Aura of Devotion",
      description: "You and friendly creatures within 10 ft of you cannot be charmed while you are conscious.",
    },
    level17Feature: {
      name: "Holy Nimbus",
      description: "Emanate an aura of sunlight in a 30-ft radius. Enemies starting their turn in the light take 10 radiant damage. You and allies have advantage on saving throws against spells cast by fiends and undead.",
    },
  },
  {
    id: "warden-ancients",
    name: "Oath of the Ancients",
    level9Feature: {
      name: "Nature's Wrath",
      description: "Action: spectral vines erupt from the ground and restrain one creature within 10 ft. The target makes a STR or DEX save (its choice) at the start of each of its turns to break free.",
    },
    level13Feature: {
      name: "Aura of Warding",
      description: "You and friendly creatures within 10 ft have resistance to damage dealt by spells while you are conscious.",
    },
    level17Feature: {
      name: "Elder Champion",
      description: "Regain 10 HP at the start of each of your turns (if not at 0 HP). Allied creatures within 10 ft have advantage on saving throws against spells and magical effects. Hostile fey and fiends within 10 ft have disadvantage on attack rolls.",
    },
  },
  {
    id: "warden-vengeance",
    name: "Oath of Vengeance",
    level9Feature: {
      name: "Vow of Enmity",
      description: "Bonus action: grant yourself advantage on all attack rolls against one creature within 10 ft. Lasts for 1 minute, until the creature drops to 0 HP, or until you are incapacitated.",
    },
    level13Feature: {
      name: "Relentless Avenger",
      description: "When you hit a creature with an opportunity attack, you can move up to half your speed as part of that reaction, and this movement does not provoke opportunity attacks. Soul of Vengeance: When a creature under the effect of your Vow of Enmity hits you with an attack, you can use your reaction to make a melee weapon attack against that creature.",
    },
    level17Feature: {
      name: "Avenging Angel",
      description: "Wings sprout from your back granting a flying speed of 60 ft. Emit a menacing aura in a 30-ft radius: creatures entering the aura must succeed on a WIS save or be frightened for 1 minute (save at end of each turn).",
    },
  },
  {
    id: "warden-conquest",
    name: "Oath of Conquest",
    level9Feature: {
      name: "Conquering Presence + Guided Strike",
      description: "Conquering Presence: Action, each creature of your choice within 30 ft must make a WIS save or be frightened for 1 minute (save at end of each turn). Guided Strike: Alternatively, use your Channel Divinity to gain +10 to one attack roll before you know whether it hits.",
    },
    level13Feature: {
      name: "Aura of Conquest",
      description: "Creatures frightened of you that start their turn within 10 ft of you have their speed reduced to 0 and take psychic damage equal to half your Fatebound level.",
    },
    level17Feature: {
      name: "Invincible Conqueror",
      description: "Gain resistance to all damage. Make one additional weapon attack when you use the Attack action (3 total). Score a critical hit on a roll of 19 or 20.",
    },
  },
  {
    id: "warden-redemption",
    name: "Oath of Redemption",
    level9Feature: {
      name: "Emissary of Peace + Rebuke the Violent",
      description: "Emissary of Peace: You gain +5 to Persuasion checks for 10 minutes. Rebuke the Violent: Reaction when a creature within 30 ft deals damage to another creature \u2014 the attacker takes radiant damage equal to the damage dealt on a failed CHA save (half on success).",
    },
    level13Feature: {
      name: "Aura of the Guardian",
      description: "When a creature you can see hits an ally within 10 ft of you, use your reaction to take that damage instead of the ally, reducing your ally's damage to 0.",
    },
    level17Feature: {
      name: "Emissary of Redemption",
      description: "Gain resistance to all damage from creatures other than yourself. When a creature hits you with an attack, it takes radiant damage equal to half the damage it dealt. You lose these benefits if you attack, cast a harmful spell, or deal damage to another creature; they return on a long rest.",
    },
  },
  {
    id: "warden-glory",
    name: "Oath of Glory",
    level9Feature: {
      name: "Peerless Athlete + Inspiring Smite",
      description: "Peerless Athlete: For 10 minutes, advantage on Athletics and Acrobatics checks; carry/push/lift capacity doubled. Inspiring Smite: Immediately after using Divine Smite, distribute up to 2d8 + Fatebound level temp HP among creatures of your choice within 30 ft (including yourself).",
    },
    level13Feature: {
      name: "Aura of Alacrity",
      description: "Your walking speed increases by 10 ft. Allies who start their turn within 10 ft of you also gain a +10 ft bonus to their walking speed until the start of their next turn.",
    },
    level17Feature: {
      name: "Living Legend",
      description: "You have advantage on all CHA checks. Once per turn, when you make an attack that misses, you can turn the miss into a hit. Creatures of your choice within 30 ft must succeed on a CHA save or be charmed or frightened by you (your choice) until the transformation ends.",
    },
  },
  {
    id: "warden-watchers",
    name: "Oath of the Watchers",
    level9Feature: {
      name: "Watcher's Will + Abjure the Extraplanar",
      description: "Watcher's Will: Choose creatures within 30 ft equal to your CHA mod. For 1 minute, they have advantage on INT, WIS, and CHA saves. Abjure the Extraplanar: Aberrations, celestials, elementals, fey, and fiends within 30 ft must make a WIS save or be turned for 1 minute.",
    },
    level13Feature: {
      name: "Aura of the Sentinel",
      description: "You and friendly creatures within 10 ft add your proficiency bonus to initiative rolls while you are conscious.",
    },
    level17Feature: {
      name: "Mortal Bulwark",
      description: "Gain truesight out to 120 ft. Have advantage on attack rolls against aberrations, celestials, elementals, fey, and fiends. On a hit against such a creature, you can force it to make a CHA save or be banished to its home plane (1 creature/turn).",
    },
  },
  {
    id: "warden-oathbreaker",
    name: "Oathbreaker",
    level9Feature: {
      name: "Control Undead + Dreadful Aspect",
      description: "Control Undead: Target one undead creature within 30 ft. It makes a WIS save or is charmed by you for 24 hours (or until you or your companions harm it). You can control undead with CR up to half your Fatebound level. Dreadful Aspect: Each creature of your choice within 30 ft must succeed on a WIS save or be frightened for 1 minute (save at end of each turn).",
    },
    level13Feature: {
      name: "Aura of Hate",
      description: "You and any undead or fiends within 10 ft of you add your CHA modifier to melee weapon damage rolls while you are conscious.",
    },
    level17Feature: {
      name: "Dread Lord",
      description: "A 30-ft aura of gloom dims all light to dim light. Enemies starting their turn in the aura take psychic damage equal to your Fatebound level. As a bonus action, make a melee spell attack (CHA-based) to deal 3d10 + CHA modifier necrotic damage on a hit. You have advantage on attack rolls while within your aura's darkness.",
    },
  },
];
