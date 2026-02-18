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
      description: "As a bonus action, sprout spectral dragon wings and gain a fly speed equal to your walking speed. The wings last until dismissed. You cannot use this feature while wearing heavy armor.",
    },
    level17Feature: {
      name: "Draconic Presence",
      description: "Action (spend 5 sorcery points): exude a draconic aura in a 60-ft radius for 1 minute (concentration). Hostile creatures starting their turn in the aura make a WIS save or are charmed (awe) or frightened (fear) \u2014 your choice \u2014 until the aura ends.",
    },
  },
  {
    id: "conduit-wild-magic",
    name: "Wild Magic",
    level9Feature: {
      name: "Tides of Chaos + Surge",
      description: "Tides of Chaos: Gain advantage on one attack roll, ability check, or saving throw (1/long rest; the DM can reset this early by triggering a Wild Magic Surge). Wild Magic Surge: After casting a spell of 1st level or higher, roll a d20; on a 1, roll on the Wild Magic Surge table (PHB).",
    },
    level13Feature: {
      name: "Bend Luck",
      description: "As a reaction, spend 2 sorcery points to add or subtract 1d4 from a creature's attack roll, ability check, or saving throw \u2014 after seeing the roll but before the outcome is determined.",
    },
    level17Feature: {
      name: "Spell Bombardment",
      description: "When you roll damage for a spell and any die shows its maximum value, roll that die again and add it to the total. This can trigger multiple times per spell.",
    },
  },
  {
    id: "conduit-clockwork",
    name: "Clockwork Soul",
    level9Feature: {
      name: "Restore Balance + Bastion of Law",
      description: "Restore Balance: Reaction (prof bonus/long rest): when a creature you can see within 60 ft rolls with advantage or disadvantage, cancel it, making it a straight roll. Bastion of Law: Spend 1\u20135 sorcery points; a creature you touch gains a ward with that many d8s. When the warded creature takes damage, spend dice from the ward to reduce it.",
    },
    level13Feature: {
      name: "Trance of Order",
      description: "As a bonus action, spend 5 SP to enter a state of perfect precision for 1 minute. While active, your attack rolls and saving throws treat any d20 roll of 9 or lower as a 10.",
    },
    level17Feature: {
      name: "Clockwork Cavalcade",
      description: "Action (spend 7 sorcery points, 1/long rest free): choose a 30-ft cube within 120 ft. Chosen creatures inside are restored up to 100 HP total and have disadvantage-causing effects ended. Unchosen creatures take 7d10 force damage (CON save for half).",
    },
  },
  {
    id: "conduit-shadow",
    name: "Shadow Magic",
    level9Feature: {
      name: "Eyes of the Dark + Strength of the Grave",
      description: "Gain darkvision 120 ft. Spend 1 sorcery point to cast darkness without a spell slot; you can see through this darkness. Strength of the Grave: When damage reduces you to 0 HP (non-radiant, non-critical), make a CHA save (DC 5 + damage dealt) to drop to 1 HP instead (1/long rest).",
    },
    level13Feature: {
      name: "Hound of Ill Omen",
      description: "As a bonus action, spend 3 SP to summon a dire wolf that targets one creature you can see. While the hound is within 5 ft of that creature, the target has disadvantage on saving throws against your spells. The hound uses the dire wolf stat block and obeys your commands.",
    },
    level17Feature: {
      name: "Shadow Walk",
      description: "When you are in dim light or darkness, use a bonus action to teleport up to 120 ft to an unoccupied space you can see that is also in dim light or darkness. Additionally, you gain resistance to necrotic damage and can spend 3 sorcery points to become invisible in dim light or darkness for 1 minute.",
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
      description: "You can communicate telepathically with any creature you can see within 30 ft. Bonus spells are always prepared and don't count against your spells known: arms of Hadar, dissonant whispers, calm emotions, detect thoughts (gained at level 9). You can spend 1 sorcery point to cast any of these without a slot.",
    },
    level13Feature: {
      name: "Psychic Defenses",
      description: "You gain resistance to psychic damage and advantage on saving throws against being charmed or frightened.",
    },
    level17Feature: {
      name: "Warping Implosion",
      description: "Action (1/long rest): choose a point you can see within 120 ft. Each creature within 30 ft of that point makes a STR save. On a failure, it takes 3d10 force damage and is teleported to the chosen point. On a success, it takes half damage. Spend 5 sorcery points to use this again before a long rest.",
    },
  },
  {
    id: "conduit-lunar",
    name: "Lunar Sorcery",
    level9Feature: {
      name: "Moon Fire + Lunar Embodiment",
      description: "You know sacred flame if you don't already (CHA-based). Lunar Embodiment: Each long rest, randomly select your phase \u2014 Full Moon (1, bonus healing spells), New Moon (2, bonus enchantment/illusion spells), or Crescent Moon (3, bonus abjuration/divination spells). Once per turn, spells matching your phase deal +2d6 radiant (Full) or necrotic (New) damage, or restore 1d6 HP to a creature within 30 ft (Crescent).",
    },
    level13Feature: {
      name: "Lunar Boons",
      description: "You can spend 1 SP as a bonus action to change your current lunar phase to any other phase. Additionally, your phase grants a passive benefit: Full Moon \u2014 advantage on Perception checks; New Moon \u2014 advantage on Stealth checks; Crescent Moon \u2014 advantage on saving throws against being charmed, frightened, or put to sleep.",
    },
    level17Feature: {
      name: "Lunar Phenomenon",
      description: "At the start of each of your turns, your current lunar phase triggers an additional effect: Full Moon \u2014 each creature of your choice within 30 ft regains 3d8 HP; New Moon \u2014 each creature of your choice within 30 ft takes 3d10 necrotic (CON save for half); Crescent Moon \u2014 choose up to 3 creatures within 60 ft and teleport them up to 60 ft each to unoccupied spaces you can see.",
    },
  },
  {
    id: "conduit-storm",
    name: "Storm Sorcery",
    level9Feature: {
      name: "Wind Speaker + Tempestuous Magic",
      description: "You speak Primordial. After casting a spell of 1st level or higher, you can fly up to 10 ft as a bonus action without provoking opportunity attacks. You gain resistance to lightning and thunder damage. Spend 1 sorcery point as a bonus action to gain a flying speed of 30 ft until the end of your current turn.",
    },
    level13Feature: {
      name: "Heart of the Storm",
      description: "When you cast a spell of 1st level or higher that deals lightning or thunder damage, deal lightning or thunder damage (your choice) equal to half your Fatebound level to creatures of your choice within 10 ft. Additionally, spend 1 SP as a bonus action to gain a fly speed equal to your walking speed until the end of your next turn.",
    },
    level17Feature: {
      name: "Wind Soul",
      description: "Gain immunity to lightning and thunder damage and a permanent flying speed of 60 ft. As an action, reduce your fly speed to 10 ft for 1 hour and grant up to 3 creatures within 30 ft a fly speed of 30 ft for that duration.",
    },
  },
];
