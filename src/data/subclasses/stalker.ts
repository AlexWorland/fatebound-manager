import type { SubclassEntry } from "@/types/forms";

export const STALKER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "stalker-hunter",
    name: "Hunter",
    level9Feature: {
      name: "Hunter's Prey",
      description: "Randomly select (see Fate's Selection): Colossus Slayer — once per turn, deal +1d8 damage to a creature that is below its hit point maximum; Giant Killer — when a Large or larger creature within 5 ft of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature; Horde Breaker — once per turn, when you make a weapon attack, you can make another attack with the same weapon against a different creature within 5 ft of the original target and within range of your weapon.",
    },
    level13Feature: {
      name: "Multiattack Defense + Steel Will",
      description: "Multiattack Defense: When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn. Steel Will: Advantage on saving throws against the frightened condition.",
    },
    level17Feature: {
      name: "Superior Hunter's Defense",
      description: "Choose one: Evasion (DEX save for half → no damage, fail → half damage), Stand Against the Tide (when a hostile creature misses you with a melee attack, use your reaction to force that creature to repeat the same attack against another creature of your choice within reach, other than itself), or Uncanny Dodge (use your reaction to halve one attack's damage).",
    },
  },
  {
    id: "stalker-beast-master",
    name: "Beast Master",
    level9Feature: {
      name: "Primal Companion",
      description: "You gain a Primal Companion beast (see options below); it acts on your turn and requires your bonus action to command it to take Attack, Dash, Disengage, Dodge, or Help. Beast of the Land (40 ft speed, climb 40 ft, AC 13 + PB, HP = 5 + (5 × Fatebound level), Maul: 1d8 + STR mod + PB piercing, Charge: prone on hit with STR save). Beast of the Sea (swim 60 ft, AC 13 + PB, HP = 5 + (5 × Fatebound level), Binding Strike: 1d6 + STR mod + PB bludgeoning or piercing, Grasping Foe: grappled on hit). Beast of the Sky (fly 60 ft, AC 13 + PB, HP = 4 + (4 × Fatebound level), Shred: 1d4 + DEX mod + PB slashing, Flyby: no opportunity attacks).",
    },
    level13Feature: {
      name: "Exceptional Training + Bestial Fury",
      description: "Exceptional Training: On any of your turns when your beast companion doesn't attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action on its turn. Its attacks count as magical for the purpose of overcoming immunity and resistance to nonmagical attacks and damage. Bestial Fury: Your beast companion can make two attacks when you command it to use the Attack action.",
    },
    level17Feature: {
      name: "Share Spells",
      description: "When you cast a spell targeting yourself, your beast companion also receives the spell's effects if it is within 30 ft of you.",
    },
  },
  {
    id: "stalker-gloom-stalker",
    name: "Gloom Stalker",
    level9Feature: {
      name: "Dread Ambusher + Umbral Sight",
      description: "You gain a bonus to your initiative rolls equal to your Wisdom modifier. On the first turn of combat, your walking speed increases by 10 ft until the end of that turn, and if you take the Attack action, you can make one additional weapon attack as part of that action. If that attack hits, it deals +1d8 damage of the weapon's damage type. You gain darkvision out to 60 ft; if you already have darkvision, it extends by 30 ft. In darkness, you are invisible to creatures that rely on darkvision to see you.",
    },
    level13Feature: {
      name: "Stalker's Flurry + Iron Mind",
      description: "Stalker's Flurry: Once per turn when you miss with a weapon attack, immediately make another weapon attack. Iron Mind: Gain proficiency in WIS saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
    },
    level17Feature: {
      name: "Shadowy Dodge",
      description: "When a creature makes an attack roll against you and doesn't have advantage on the roll, you can use your reaction to impose disadvantage on it. You must use this feature before you know the outcome of the attack roll.",
    },
  },
  {
    id: "stalker-horizon-walker",
    name: "Horizon Walker",
    level9Feature: {
      name: "Detect Portal + Planar Warrior",
      description: "As an action, sense the location of any planar portal within 1 mile (1/short rest). Planar Warrior: As a bonus action, choose one creature you can see within 30 ft of you. The next time you hit that creature on this turn with a weapon attack, all damage from the attack becomes force damage and the creature takes an extra 1d8 force damage.",
    },
    level13Feature: {
      name: "Ethereal Step + Distant Strike",
      description: "Ethereal Step: Bonus action (1/short rest): cast etherealness without a spell slot; the effect ends at the end of the current turn. Distant Strike: When you take the Attack action, you can teleport up to 10 ft before each attack to an unoccupied space you can see within 5 ft of that attack's target. If you attack at least two different creatures with this action, you can make one additional attack against a third creature, teleporting to within 5 ft of it as part of the attack.",
    },
    level17Feature: {
      name: "Spectral Defense",
      description: "When you take damage from an attack, use your reaction to gain resistance to all damage from that attack (including damage types you wouldn't normally resist).",
    },
  },
  {
    id: "stalker-monster-slayer",
    name: "Monster Slayer",
    level9Feature: {
      name: "Hunter's Sense + Slayer's Prey",
      description: "Hunter's Sense: As an action, choose one creature you can see within 60 ft; immediately learn all of its damage immunities, resistances, and vulnerabilities (WIS mod/long rest). Slayer's Prey: Bonus action, mark one creature within 60 ft; the first time each turn that you hit the marked target, deal +1d6 damage. The mark lasts until you finish a short or long rest or mark a new target.",
    },
    level13Feature: {
      name: "Supernatural Defense + Magic-User's Nemesis",
      description: "Supernatural Defense: When you make a saving throw that your Slayer's Prey target forced you to make, add 1d6 to the roll. When you make an ability check to escape your Slayer's Prey target's grapple, add 1d6 to the roll. Magic-User's Nemesis: Reaction when a creature within 60 ft attempts to cast a spell or teleport: the creature makes a WIS save (DC 8 + prof + WIS mod) or the spell or teleportation fails.",
    },
    level17Feature: {
      name: "Slayer's Counter",
      description: "When your Slayer's Prey target forces you to make a saving throw, use your reaction to make one weapon attack against it. If the attack hits, you automatically succeed on the saving throw.",
    },
  },
  {
    id: "stalker-fey-wanderer",
    name: "Fey Wanderer",
    level9Feature: {
      name: "Dreadful Strikes + Otherworldly Glamour",
      description: "When you hit a creature with a weapon attack, it takes +1d4 psychic damage (once per turn per creature). Add your WIS modifier to all Charisma checks (if not already included), and you gain proficiency in one of the following skills of your choice: Deception, Performance, or Persuasion. Bonus Spells (always prepared, count as Ranger spells): charm person (1st), misty step (2nd), dispel magic (3rd); at level 13+ (vanilla Ranger 9th): dimension door (4th); at level 17+ (vanilla Ranger 13th): mislead (5th).",
    },
    level13Feature: {
      name: "Beguiling Twist + Fey Reinforcements",
      description: "Beguiling Twist: You have advantage on saving throws against the charmed and frightened conditions. In addition, when a creature within 120 ft of you succeeds on a saving throw against the charmed or frightened condition, use your reaction to force a different creature you can see within 120 ft to make a WIS save against your spell save DC or be charmed or frightened by you (your choice) for 1 minute. Dreadful Strikes damage increases to 1d6. Fey Reinforcements: You know summon fey and can cast it without a material component. You can also cast it once without a spell slot (regaining this ability on a long rest), and whenever you cast it you can modify it to not require concentration, reducing its duration to 1 minute.",
    },
    level17Feature: {
      name: "Misty Wanderer",
      description: "Cast misty step without a spell slot (WIS modifier/long rest). When you misty step, you can bring one willing creature within 5 ft of you to the destination.",
    },
  },
  {
    id: "stalker-swarmkeeper",
    name: "Swarmkeeper",
    level9Feature: {
      name: "Gathered Swarm + Writhing Tide",
      description: "You attract a swarm of spirits that surround you. Once per turn when you hit with an attack, choose one effect: push the target up to 15 ft horizontally (STR save or it moves), move yourself 5 ft horizontally in a direction of your choice, or the target takes 1d6 piercing damage from the swarm. Writhing Tide: As a bonus action, gain a flying speed of 10 ft and the ability to hover, lasting 1 minute (proficiency bonus uses per long rest).",
    },
    level13Feature: {
      name: "Mighty Swarm",
      description: "Your Gathered Swarm effects improve: the push also knocks the target prone on a failed STR save, and the movement option grants you half cover until the start of your next turn. The swarm's damage increases to 1d8 piercing.",
    },
    level17Feature: {
      name: "Swarming Dispersal",
      description: "When you take damage, you can use your reaction to give yourself resistance to that damage, then vanish into your swarm and teleport to an unoccupied space you can see within 30 ft, reappearing with the swarm. You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a long rest.",
    },
  },
  {
    id: "stalker-drakewarden",
    name: "Drakewarden",
    level9Feature: {
      name: "Drake Companion",
      description: "You attract a drake companion of a damage type you choose (acid, cold, fire, lightning, or poison). It is Small, has AC 14 + PB, HP = 5 + (5 × Fatebound level), Speed 40 ft, and makes a Bite attack (+3 + PB to hit, 1d6 + PB piercing). Infused Strikes: As a reaction when an ally within 30 ft hits a creature the drake can see, the attack deals an extra 1d6 damage of your chosen type.",
    },
    level13Feature: {
      name: "Bond of Fang and Scale + Drake's Breath",
      description: "Your drake grows to Medium size, sprouts wings (gaining a flying speed equal to its walking speed), and can serve as a mount (if you are Medium or smaller; while mounted, the drake cannot use its flying speed). You gain resistance to your drake's damage type. Drake's Bite now deals an extra 1d6 damage of that type. You also gain Drake's Breath: as an action, you or your drake can exhale a 30-ft cone; each creature in the cone makes a DEX save against your spell save DC, taking 8d6 damage of your chosen type on a failure, or half on a success. Once you use Drake's Breath, you can't do so again until you finish a long rest, unless you expend a spell slot of 3rd level or higher to use it again.",
    },
    level17Feature: {
      name: "Perfected Bond",
      description: "Your drake grows to Large size, and when you ride it, it can now use its flying speed. The drake's Bite attack deals an additional 1d6 damage of its chosen type (2d6 total extra, on top of its base damage). Your drake also gains Reflexive Resistance: when you or the drake takes damage while you are within 30 ft of each other, the drake can use its reaction to give itself or you resistance to that instance of damage (uses = proficiency bonus per long rest).",
    },
  },
];;
