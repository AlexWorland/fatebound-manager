import type { SubclassEntry } from "@/types/forms";

export const CONDUIT_SUBCLASSES: SubclassEntry[] = [
  {
    id: "conduit-draconic",
    name: "Draconic Bloodline",
    level9Feature: {
      name: "Elemental Affinity",
      description: "Randomly select your element: Fire (1), Cold (2), Lightning (3), or Acid (4). Add your CHA modifier to one damage roll of that type per spell. Spend 1 sorcery point to gain resistance to that damage type for 1 hour. You gain +1 HP per Fatebound level (retroactive), and your AC becomes 13 + DEX when unarmored.",
    },
    level13Feature: {
      name: "Dragon Wings",
      description: "As a bonus action, sprout spectral dragon wings and gain a fly speed equal to your walking speed. The wings last until dismissed. You cannot use this feature while wearing armor unless the armor is made to accommodate the wings.",
    },
    level17Feature: {
      name: "Draconic Presence",
      description: "Action (spend 5 sorcery points): exude a draconic aura in a 60-ft radius for 1 minute (concentration). Hostile creatures starting their turn in the aura make a WIS save or are charmed (awe) or frightened (fear) — your choice — until the aura ends.",
    },
  },
  {
    id: "conduit-wild-magic",
    name: "Wild Magic",
    level9Feature: {
      name: "Tides of Chaos + Surge",
      description: "Tides of Chaos: Gain advantage on one attack roll, ability check, or saving throw (1/long rest; the DM can reset this early by triggering a Wild Magic Surge). Wild Magic Surge: After you cast a sorcerer spell of 1st level or higher, the DM can have you roll a d20; on a 1, roll on the Wild Magic Surge table (PHB).",
    },
    level13Feature: {
      name: "Bend Luck",
      description: "As a reaction, spend 2 sorcery points to add or subtract 1d4 from a creature's attack roll, ability check, or saving throw — after seeing the roll but before the outcome is determined.",
    },
    level17Feature: {
      name: "Spell Bombardment",
      description: "When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again and add that roll to the damage. You can use this feature only once per turn.",
    },
  },
  {
    id: "conduit-clockwork",
    name: "Clockwork Soul",
    level9Feature: {
      name: "Restore Balance + Bastion of Law",
      description: "Restore Balance: Reaction (prof bonus/long rest): when a creature you can see within 60 ft rolls with advantage or disadvantage, cancel it, making it a straight roll. Bastion of Law: Spend 1–5 sorcery points; a creature you touch gains a ward with that many d8s. When the warded creature takes damage, spend dice from the ward to reduce it. The ward lasts until you finish a long rest or until you use this feature again. Bonus Spells (always prepared, don't count against spells known): alarm, protection from evil and good (1st level); aid, lesser restoration (2nd level); dispel magic, protection from energy (3rd level).",
    },
    level13Feature: {
      name: "Trance of Order",
      description: "As a bonus action, enter a state of perfect precision for 1 minute. While active, attack rolls against you can't benefit from advantage, and your attack rolls, ability checks, and saving throws treat any d20 roll of 9 or lower as a 10. You can use this feature once per long rest; you can spend 5 sorcery points to use it again before finishing a long rest. Additionally, you gain higher-level clockwork spells (always prepared, don't count against spells known): freedom of movement, summon construct (4th level); greater restoration, wall of force (5th level).",
    },
    level17Feature: {
      name: "Clockwork Cavalcade",
      description: "Action (1/long rest; spend 7 sorcery points to use again): summon spirits of order in a 30-ft cube originating from you. The spirits create the following effects before vanishing: restore up to 100 HP distributed among any creatures of your choice in the cube; repair all damaged objects entirely within the cube; end every spell of 6th level or lower on creatures and objects of your choice within the cube.",
    },
  },
  {
    id: "conduit-shadow",
    name: "Shadow Magic",
    level9Feature: {
      name: "Eyes of the Dark + Strength of the Grave",
      description: "Gain darkvision 120 ft. Spend 2 sorcery points to cast darkness without a spell slot; you can see through this darkness. Strength of the Grave: When damage reduces you to 0 HP (non-radiant, non-critical), make a CHA save (DC 5 + damage dealt) to drop to 1 HP instead (1/long rest).",
    },
    level13Feature: {
      name: "Hound of Ill Omen",
      description: "As a bonus action, spend 3 SP to summon a hound (dire wolf stat block, shadow monstrosity) that targets one creature you can see. The hound appears in an unoccupied space within 30 ft of the target and acts immediately after you on your initiative count. It can only move toward the target by the most direct route or take the Attack action against the target, and it has advantage on attack rolls against the target. While the hound is within 5 ft of that creature, the target has disadvantage on saving throws against your spells.",
    },
    level17Feature: {
      name: "Shadow Walk + Umbral Form",
      description: "When you are in dim light or darkness, use a bonus action to teleport up to 120 ft to an unoccupied space you can see that is also in dim light or darkness. Umbral Form: As a bonus action, spend 6 sorcery points to transform for 1 minute. While transformed, you have resistance to all damage except force and radiant damage, and you can move through other creatures and objects as if they were difficult terrain (you take 5 force damage if you end your turn inside an object). Ends early if incapacitated, killed, or dismissed as a bonus action.",
    },
  },
  {
    id: "conduit-divine-soul",
    name: "Divine Soul",
    level9Feature: {
      name: "Divine Magic + Favored by the Gods",
      description: "You can choose spells from the Cleric spell list in addition to the Sorcerer list (they count as Sorcerer spells for you). Favored by the Gods: When you fail a saving throw or miss an attack, add 2d4 to the roll (1/short rest).",
    },
    level13Feature: {
      name: "Empowered Healing",
      description: "Once per turn when you or an ally within 5 ft rolls dice for a healing spell, you can spend 1 SP to reroll any number of those dice, taking the new results.",
    },
    level17Feature: {
      name: "Unearthly Recovery",
      description: "When you have fewer than half your maximum HP remaining, you can use a bonus action to regain HP equal to half your HP maximum (1/long rest).",
    },
  },
  {
    id: "conduit-aberrant",
    name: "Aberrant Mind",
    level9Feature: {
      name: "Telepathic Speech + Psionic Spells",
      description: "Telepathic Speech: As a bonus action, choose one creature you can see within 30 ft to form a telepathic connection. While within a number of miles of each other equal to your CHA modifier (minimum 1), you and that creature can speak telepathically. The connection lasts for a number of minutes equal to your Fatebound level and ends early if you are incapacitated, die, or form a new connection. Bonus Spells (always prepared, don't count against spells known, gained at level 9): arms of Hadar, dissonant whispers (1st level); calm emotions, detect thoughts (2nd level); hunger of Hadar, sending (3rd level); Evard's black tentacles, summon aberration (4th level); Rary's telepathic bond, telekinesis (5th level). You can spend 1 sorcery point per spell level to cast any of these without a slot.",
    },
    level13Feature: {
      name: "Psychic Defenses",
      description: "You gain resistance to psychic damage and advantage on saving throws against being charmed or frightened.",
    },
    level17Feature: {
      name: "Warping Implosion",
      description: "Action (1/long rest): you teleport to an unoccupied space you can see within 120 ft. Immediately after you disappear, each creature within 30 ft of the space you left must make a STR save. On a failure, a creature takes 3d10 force damage and is pulled straight toward the space you left, ending in an unoccupied space as close to your vacated space as possible. On a success, it takes half damage and isn't pulled. Spend 5 sorcery points to use this again before a long rest.",
    },
  },
  {
    id: "conduit-lunar",
    name: "Lunar Sorcery",
    level9Feature: {
      name: "Moon Fire + Lunar Embodiment",
      description: "You know sacred flame if you don't already (CHA-based). When you cast sacred flame, you can target one creature as normal or target two creatures within range that are within 5 ft of each other. Lunar Embodiment: Each long rest, randomly select your phase (d3): Full Moon (1) — bonus spells: shield, lesser restoration, dispel magic, death ward, Rary's telepathic bond; New Moon (2) — bonus spells: ray of sickness, blindness/deafness, vampiric touch, confusion, hold monster; Crescent Moon (3) — bonus spells: color spray, alter self, phantom steed, hallucinatory terrain, mislead. These bonus spells are always prepared and don't count against your spells known.",
    },
    level13Feature: {
      name: "Waxing and Waning + Lunar Boons",
      description: "You can spend 1 SP as a bonus action to change your current lunar phase to any other phase. Lunar Boons: When you use Metamagic on a spell of a school associated with your current Lunar Embodiment phase, you can reduce the sorcery points spent by 1 (minimum 0). You can use this feature a number of times equal to your proficiency bonus per long rest. Your phase grants a passive benefit: Full Moon — advantage on Perception checks; New Moon — advantage on Stealth checks, and attack rolls against you have disadvantage while you are in darkness; Crescent Moon — resistance to necrotic and radiant damage.",
    },
    level17Feature: {
      name: "Lunar Phenomenon",
      description: "As a bonus action (1/long rest; spend 5 sorcery points to use again), trigger your current lunar phase effect: Full Moon — each creature of your choice within 30 ft must succeed on a CON save or be blinded until the end of its next turn, and one creature of your choice within 30 ft regains 3d8 HP; New Moon — you become invisible until the start of your next turn (or until you make an attack or cast a spell), and each creature of your choice within 30 ft must succeed on a DEX save or take 3d10 necrotic damage and have its speed reduced to 0 until the end of its next turn; Crescent Moon — you teleport up to 60 ft to an unoccupied space you can see, and you can bring one willing creature within 5 ft of you (it appears in an unoccupied space within 5 ft of your destination); you and that creature gain resistance to all damage until the start of your next turn.",
    },
  },
  {
    id: "conduit-storm",
    name: "Storm Sorcery",
    level9Feature: {
      name: "Wind Speaker + Tempestuous Magic + Heart of the Storm",
      description: "You can speak, read, and write Primordial. Tempestuous Magic: Immediately before or after casting a spell of 1st level or higher, you can use a bonus action to fly up to 10 ft without provoking opportunity attacks. Heart of the Storm: You gain resistance to lightning and thunder damage. When you cast a spell of 1st level or higher that deals lightning or thunder damage, deal lightning or thunder damage (your choice) equal to half your Fatebound level to creatures of your choice within 10 ft.",
    },
    level13Feature: {
      name: "Heart of the Storm + Storm's Fury",
      description: "When you cast a spell of 1st level or higher that deals lightning or thunder damage, deal lightning or thunder damage (your choice) equal to half your Fatebound level to creatures of your choice within 10 ft. Storm's Fury: When you are hit by a melee attack, you can use your reaction to deal lightning damage to the attacker equal to your Fatebound level. The attacker must also succeed on a STR saving throw against your spell save DC or be pushed up to 20 ft away from you in a straight line.",
    },
    level17Feature: {
      name: "Wind Soul",
      description: "Gain immunity to lightning and thunder damage and a permanent flying speed of 60 ft. As an action, reduce your fly speed to 30 ft for 1 hour and grant a number of creatures equal to 3 + your Charisma modifier within 30 ft a fly speed of 30 ft for that duration. Once you use this sharing ability, you must finish a short or long rest before using it again.",
    },
  },
];;
