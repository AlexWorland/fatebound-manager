import type { SubclassEntry } from "@/types/forms";

export const WARDEN_SUBCLASSES: SubclassEntry[] = [
  {
    id: "warden-devotion",
    name: "Oath of Devotion",
    level9Feature: {
      name: "Sacred Weapon",
      description: "Action: touch one weapon. For 1 minute, add your CHA modifier (minimum +1) to attack rolls made with it; it becomes magical if it isn't already; and it sheds bright light in a 20-ft radius and dim light 20 ft beyond that. Ends early if you drop the weapon or fall unconscious.",
    },
    level13Feature: {
      name: "Aura of Devotion",
      description: "You and friendly creatures within 30 ft of you cannot be charmed while you are conscious.",
    },
    level17Feature: {
      name: "Holy Nimbus",
      description: "Emanate an aura of sunlight in a 30-ft radius. Enemies starting their turn in the bright light take 10 radiant damage. You have advantage on saving throws against spells cast by fiends and undead.",
    },
  },
  {
    id: "warden-ancients",
    name: "Oath of the Ancients",
    level9Feature: {
      name: "Nature's Wrath",
      description: "Action: spectral vines erupt from the ground and restrain one creature within 10 ft. The target makes a STR or DEX save (its choice) at the end of each of its turns to break free.",
    },
    level13Feature: {
      name: "Aura of Warding",
      description: "You and friendly creatures within 30 ft have resistance to damage dealt by spells while you are conscious.",
    },
    level17Feature: {
      name: "Elder Champion",
      description: "Regain 10 HP at the start of each of your turns. Whenever you cast a Warden spell that has a casting time of 1 action, you can cast it using a bonus action instead. Enemy creatures within 10 ft have disadvantage on saving throws against your Warden spells and Channel Divinity options.",
    },
  },
  {
    id: "warden-vengeance",
    name: "Oath of Vengeance",
    level9Feature: {
      name: "Vow of Enmity",
      description: "Bonus action: grant yourself advantage on all attack rolls against one creature you can see within 10 ft. Lasts for 1 minute or until the target drops to 0 HP or falls unconscious.",
    },
    level13Feature: {
      name: "Relentless Avenger + Soul of Vengeance",
      description: "Relentless Avenger: When you hit a creature with an opportunity attack, you can move up to half your speed as part of that reaction, and this movement does not provoke opportunity attacks. Soul of Vengeance: When a creature under the effect of your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature.",
    },
    level17Feature: {
      name: "Avenging Angel",
      description: "Duration: 1 hour. Wings sprout from your back granting a flying speed of 60 ft. Emit a menacing aura in a 30-ft radius: the first time any enemy enters the aura or starts its turn there during a battle, that creature must succeed on a WIS save or be frightened for 1 minute or until it takes any damage. Attack rolls against the frightened creature have advantage.",
    },
  },
  {
    id: "warden-conquest",
    name: "Oath of Conquest",
    level9Feature: {
      name: "Conquering Presence",
      description: "Action: each creature of your choice that you can see within 30 ft must make a WIS save or be frightened for 1 minute (save at end of each turn).",
    },
    level13Feature: {
      name: "Aura of Conquest",
      description: "Creatures frightened of you that start their turn within 30 ft of you have their speed reduced to 0 and take psychic damage equal to half your Fatebound level.",
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
      description: "Emissary of Peace: Bonus action: You gain +5 to Persuasion checks for 10 minutes. Rebuke the Violent: Reaction when a creature within 30 ft deals damage to a creature other than you — the attacker takes radiant damage equal to the damage dealt on a failed WIS save (half on success).",
    },
    level13Feature: {
      name: "Aura of the Guardian",
      description: "When a creature within 30 ft of you takes damage, you can use your reaction to magically take that damage instead. This damage can't be reduced in any way.",
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
      description: "Peerless Athlete: Bonus action: For 10 minutes, advantage on Athletics and Acrobatics checks; carry/push/lift capacity doubled; jump distance increases by 10 ft. Inspiring Smite: Immediately after you deal damage to a creature with your Divine Smite, as a bonus action, distribute up to 2d8 + Fatebound level temp HP among creatures of your choice within 30 ft (including yourself).",
    },
    level13Feature: {
      name: "Aura of Alacrity",
      description: "Your walking speed increases by 10 ft. The walking speed of any ally who starts their turn within 30 ft of you increases by 10 ft until the end of that turn.",
    },
    level17Feature: {
      name: "Living Legend",
      description: "You have advantage on all CHA checks. Once on each of your turns when you make a weapon attack and miss, you can cause that attack to hit instead. If you fail a saving throw, you can use your reaction to reroll it and must use the new roll.",
    },
  },
  {
    id: "warden-watchers",
    name: "Oath of the Watchers",
    level9Feature: {
      name: "Watcher's Will + Abjure the Extraplanar",
      description: "Watcher's Will: Choose a number of creatures you can see within 30 ft equal to your CHA modifier (minimum of one). For 1 minute, you and the chosen creatures have advantage on INT, WIS, and CHA saving throws. Abjure the Extraplanar: Aberrations, celestials, elementals, fey, and fiends within 30 ft must make a WIS save or be turned for 1 minute. The effect ends early if the creature takes any damage.",
    },
    level13Feature: {
      name: "Aura of the Sentinel",
      description: "You and friendly creatures within 30 ft add your proficiency bonus to initiative rolls while you are conscious.",
    },
    level17Feature: {
      name: "Mortal Bulwark",
      description: "Gain truesight out to 120 ft. Have advantage on attack rolls against aberrations, celestials, elementals, fey, and fiends. When you hit such a creature, you can use a bonus action to force it to make a CHA save or be banished to its home plane if it is not native to the plane you're on (1 creature/turn).",
    },
  },
  {
    id: "warden-oathbreaker",
    name: "Oathbreaker",
    level9Feature: {
      name: "Control Undead + Dreadful Aspect",
      description: "Control Undead: Target one undead creature within 30 ft. It makes a WIS save or must obey your commands for the next 24 hours, or until you use this Channel Divinity again. Undead with CR equal to or greater than your Fatebound level are immune. Dreadful Aspect: Each creature of your choice within 30 ft that can see you must succeed on a WIS save or be frightened for 1 minute. A frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's save is successful or the effect ends for it, the creature is immune to your Dreadful Aspect for the next 24 hours.",
    },
    level13Feature: {
      name: "Aura of Hate",
      description: "You and any undead or fiends within 30 ft of you add your CHA modifier to melee weapon damage rolls while you are conscious.",
    },
    level17Feature: {
      name: "Dread Lord",
      description: "A 30-ft aura of gloom dims all light to dim light. You and any creatures of your choice in the aura are draped in deeper shadow; creatures that rely on sight have disadvantage on attack rolls against creatures draped in this shadow. Enemies that are frightened of you and start their turn in the aura take 4d10 psychic damage. As a bonus action, make a melee spell attack (CHA-based) to deal 3d10 + CHA modifier necrotic damage on a hit.",
    },
  },
];;
