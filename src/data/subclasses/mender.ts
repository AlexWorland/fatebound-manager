import type { SubclassEntry } from "@/types/forms";

export const MENDER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "mender-knowledge",
    name: "Knowledge",
    level9Feature: {
      name: "Blessings of Knowledge + CD: Knowledge of the Ages",
      description: "Gain proficiency in 2 languages and Expertise in 2 of: Arcana, History, Nature, or Religion. CD: Knowledge of the Ages: You gain proficiency in any one skill or tool of your choice for 10 minutes.",
    },
    level13Feature: {
      name: "Read Thoughts",
      description: "As an action, read the surface thoughts of one creature within 60 ft; it makes a WIS save or you learn its thoughts and can cast suggestion on it without expending a spell slot (1/short rest).",
    },
    level17Feature: {
      name: "Visions of the Past",
      description: "Meditate on an object or location for 1 minute to receive visions of events that occurred there within a number of days equal to your INT score. Usable once per short rest.",
    },
  },
  {
    id: "mender-life",
    name: "Life",
    level9Feature: {
      name: "Disciple of Life + CD: Preserve Life",
      description: "Healing spells restore additional HP equal to 2 + the spell's level. CD: Preserve Life: Distribute HP equal to your Fatebound level \u00d7 3 among any creatures within 30 ft, restoring each to no more than half their maximum HP.",
    },
    level13Feature: {
      name: "Blessed Healer",
      description: "When you cast a healing spell that restores HP to another creature, you also regain HP equal to 2 + the spell's level.",
    },
    level17Feature: {
      name: "Supreme Healing",
      description: "When you would roll dice to restore HP with a spell, use the maximum value of each die instead.",
    },
  },
  {
    id: "mender-light",
    name: "Light",
    level9Feature: {
      name: "Warding Flare + CD: Radiance of the Dawn",
      description: "When a creature within 30 ft attacks you, use your reaction to impose disadvantage on the attack roll (WIS mod uses/long rest). CD: Radiance of the Dawn: 30-ft radius dispels magical darkness; hostile creatures make a CON save or take 2d10 + Fatebound level radiant (half on success).",
    },
    level13Feature: {
      name: "Improved Flare",
      description: "Your Warding Flare can now protect allies within 30 ft, not only yourself \u2014 use your reaction to impose disadvantage on an attack roll against any creature you can see within range.",
    },
    level17Feature: {
      name: "Corona of Light",
      description: "As an action (1/long rest), cause yourself to emit a blinding solar aura for 1 minute \u2014 bright light 60 ft, dim light a further 60 ft. Enemies in the bright light have disadvantage on saving throws against your fire and radiant spells.",
    },
  },
  {
    id: "mender-nature",
    name: "Nature",
    level9Feature: {
      name: "Acolyte of Nature + CD: Charm Animals and Plants",
      description: "Learn a Druid cantrip and gain proficiency in Animal Handling, Nature, or Survival (your choice). CD: Charm Animals and Plants: Beasts and plant creatures within 30 ft must make a WIS save or be charmed by you for 1 minute.",
    },
    level13Feature: {
      name: "Dampen Elements",
      description: "When you or a creature within 30 ft takes acid, cold, fire, lightning, or thunder damage, use your reaction to grant that creature resistance to the triggering damage type for that instance.",
    },
    level17Feature: {
      name: "Master of Nature",
      description: "Beasts and plant creatures charmed by your Channel Divinity obey your verbal commands. You can command all charmed creatures as a single bonus action each turn.",
    },
  },
  {
    id: "mender-tempest",
    name: "Tempest",
    level9Feature: {
      name: "Wrath of the Storm + CD: Destructive Wrath",
      description: "When a creature within 5 ft hits you, use your reaction to deal 2d8 lightning or thunder damage; DEX save for half (WIS mod uses/long rest). CD: Destructive Wrath: Maximize all lightning and thunder damage dice on one spell or attack instead of rolling.",
    },
    level13Feature: {
      name: "Thunderbolt Strike",
      description: "When you deal lightning damage to a creature, you can push it up to 10 ft away from you if it is Large or smaller.",
    },
    level17Feature: {
      name: "Stormborn",
      description: "You gain a flying speed equal to your walking speed when you are outdoors and not underground.",
    },
  },
  {
    id: "mender-trickery",
    name: "Trickery",
    level9Feature: {
      name: "Blessing of the Trickster + CD: Invoke Duplicity",
      description: "Touch a willing creature to grant it advantage on Stealth checks for 1 hour (concentration). CD: Invoke Duplicity: Summon an illusory duplicate within 30 ft for 1 minute. You can cast spells as if you occupied its space, and gain advantage on attacks against creatures within 5 ft of both you and the duplicate.",
    },
    level13Feature: {
      name: "Improved Duplicate",
      description: "Your Invoke Duplicity duplicate can move up to 120 ft from you. You also gain advantage on attack rolls against targets within 5 ft of both you and the duplicate simultaneously.",
    },
    level17Feature: {
      name: "Improved Duplicity",
      description: "You can create up to 4 duplicates simultaneously with Invoke Duplicity. As a bonus action, move any or all duplicates up to 30 ft.",
    },
  },
  {
    id: "mender-war",
    name: "War",
    level9Feature: {
      name: "War Priest + CD: Guided Strike",
      description: "When you take the Attack action, make one weapon attack as a bonus action (WIS mod uses/long rest). CD: Guided Strike: Add +10 to one attack roll you or an ally within 30 ft is making, after seeing the roll but before the outcome.",
    },
    level13Feature: {
      name: "War God's Blessing",
      description: "When a creature within 30 ft makes an attack roll, use your reaction and expend a use of Channel Divinity to grant it a +10 bonus to that roll (declared after the roll, before the outcome).",
    },
    level17Feature: {
      name: "Avatar of Battle",
      description: "You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
    },
  },
  {
    id: "mender-forge",
    name: "Forge",
    level9Feature: {
      name: "Blessing of the Forge + CD: Artisan's Blessing",
      description: "Touch one nonmagical suit of armor or a weapon at the end of a long rest; it becomes +1 until your next long rest. CD: Artisan's Blessing: Conduct a 1-hour ritual to create a nonmagical metal object worth up to 100 gp (consumes raw materials of equal value).",
    },
    level13Feature: {
      name: "Soul of the Forge",
      description: "You gain +1 AC while wearing heavy armor, and you gain resistance to fire damage.",
    },
    level17Feature: {
      name: "Saint of Forge and Fire",
      description: "You gain immunity to fire damage and resistance to bludgeoning, piercing, and slashing from nonmagical weapons. While wearing heavy armor, you gain an additional +1 bonus to AC.",
    },
  },
  {
    id: "mender-grave",
    name: "Grave",
    level9Feature: {
      name: "Circle of Mortality + CD: Path to the Grave",
      description: "Healing spell dice that affect a creature at 0 HP use their maximum values. You can cast spare the dying as a bonus action at a range of 30 ft. CD: Path to the Grave: Curse a creature within 30 ft; the next hit it takes is treated as a critical hit, consuming the curse.",
    },
    level13Feature: {
      name: "Sentinel at Death's Door",
      description: "When a creature within 30 ft of you suffers a critical hit, use your reaction to turn that hit into a normal hit. You can use this feature a number of times equal to your WIS modifier per long rest.",
    },
    level17Feature: {
      name: "Keeper of Souls",
      description: "When a creature dies within 60 ft of you, you or one ally within 60 ft regains HP equal to the creature's number of Hit Dice (once per turn, not on creatures you kill yourself).",
    },
  },
  {
    id: "mender-order",
    name: "Order",
    level9Feature: {
      name: "Voice of Authority + CD: Order's Demand",
      description: "When you cast a spell of 1st level or higher targeting an ally, that ally can use its reaction to make one weapon attack. CD: Order's Demand: Creatures of your choice within 30 ft must make a WIS save or be charmed by you until end of your next turn and drop anything they are holding.",
    },
    level13Feature: {
      name: "Embodiment of the Law",
      description: "When you cast an enchantment spell of 1st level or higher, one creature of your choice within 60 ft can use its reaction to make one weapon attack.",
    },
    level17Feature: {
      name: "Order's Wrath",
      description: "When you deal damage to a creature on your turn, it is marked until the start of your next turn. The next ally to hit a marked creature deals an extra 2d8 psychic damage.",
    },
  },
  {
    id: "mender-peace",
    name: "Peace",
    level9Feature: {
      name: "Emboldening Bond + CD: Balm of Peace",
      description: "Bond a number of creatures equal to your proficiency bonus for 10 minutes. Once per turn, a bonded creature can add 1d4 to an attack roll, ability check, or saving throw if it can see another bonded creature within 30 ft. CD: Balm of Peace: Move up to your speed without provoking opportunity attacks; each creature you pass within 5 ft heals 2d6 + WIS mod HP.",
    },
    level13Feature: {
      name: "Protective Bond",
      description: "When a creature bonded by your Emboldening Bond would take damage, another bonded creature within 60 ft can use its reaction to teleport to an unoccupied space adjacent to the first creature and take the damage in its place.",
    },
    level17Feature: {
      name: "Expansive Bond",
      description: "Emboldening Bond extends to 60 ft. When a bonded creature is about to take damage, another bonded creature within 60 ft can use its reaction to teleport adjacent and take that damage instead.",
    },
  },
  {
    id: "mender-twilight",
    name: "Twilight",
    level9Feature: {
      name: "Eyes of Night + Vigilant Blessing + CD: Twilight Sanctuary",
      description: "You gain darkvision out to 300 ft, and as an action can extend darkvision 300 ft to any number of creatures within 10 ft for 1 hour (1/long rest). Vigilant Blessing: When initiative is rolled, grant one creature you can see advantage on that roll. CD: Twilight Sanctuary: Create a 30-ft radius sphere of dim light centered on you for 1 minute (concentration). Each turn a creature inside can gain temp HP equal to 1d6 + your Fatebound level, or end one charmed or frightened effect on itself.",
    },
    level13Feature: {
      name: "Steps of Night",
      description: "As a bonus action while in dim light or darkness, you can grant yourself a flying speed equal to your walking speed for 1 minute. You can use this feature a number of times equal to your proficiency bonus per long rest.",
    },
    level17Feature: {
      name: "Twilight Shroud",
      description: "Creatures inside your Twilight Sanctuary gain the benefits of half cover (+2 AC and DEX saves).",
    },
  },
];
