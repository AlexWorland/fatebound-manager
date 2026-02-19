import type { SubclassEntry } from "@/types/forms";

export const STALKER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "stalker-hunter",
    name: "Hunter",
    level9Feature: {
      name: "Hunter's Prey",
      description: "Randomly select (see Fate's Selection): Colossus Slayer \u2014 once per turn, deal +1d8 damage to a creature that is below its hit point maximum; Giant Killer \u2014 when a Large or larger creature within 5 ft misses you, use your reaction to make one melee weapon attack against it; Horde Breaker \u2014 once per turn, make one additional attack against a different creature within 5 ft of the first target of your attack.",
    },
    level13Feature: {
      name: "Multiattack Defense + Steel Will",
      description: "Multiattack Defense: When a creature hits you with an attack, all subsequent attacks by that creature against you this turn have disadvantage. Steel Will: Advantage on saving throws against the frightened condition.",
    },
    level17Feature: {
      name: "Superior Hunter's Defense",
      description: "Choose one: Evasion (DEX save for half \u2192 no damage, fail \u2192 half damage), Stand Against the Tide (when a creature misses you with a melee attack, use your reaction to force it to repeat the attack against another creature of your choice within reach), or Uncanny Dodge (use your reaction to halve one attack's damage).",
    },
  },
  {
    id: "stalker-beast-master",
    name: "Beast Master",
    level9Feature: {
      name: "Primal Companion",
      description: "You gain a Primal Companion beast; it acts on your turn and requires your bonus action to command it to take Attack, Dash, Disengage, Dodge, or Help. Beast of the Land (40 ft speed, Maul: 1d8 + 2 + PB piercing, Charge: prone on hit with STR save). Beast of the Sea (swim 60 ft, Binding Strike: 1d6 + PB bludgeoning or piercing, Grasping Foe: grappled on hit). Beast of the Sky (fly 60 ft, Shred: 1d4 + PB slashing, Flyby: no opportunity attacks). Beast HP = 5 \u00d7 Fatebound level; AC = 13 + DEX mod.",
    },
    level13Feature: {
      name: "Exceptional Training + Bestial Fury",
      description: "Exceptional Training: Your beast companion can use Dash, Disengage, Dodge, or Help as a bonus action on each of its turns. Its attacks count as magical. Bestial Fury: Your beast companion can make two attacks when you command it to use the Attack action.",
    },
    level17Feature: {
      name: "Share Spells",
      description: "When you cast a spell targeting yourself, your beast companion also receives the spell's effects if it is within 30 ft of you. Your beast gains additional HP equal to twice your Fatebound level.",
    },
  },
  {
    id: "stalker-gloom-stalker",
    name: "Gloom Stalker",
    level9Feature: {
      name: "Dread Ambusher + Umbral Sight",
      description: "On the first turn of combat, your walking speed increases by 10 ft, and you can make one additional attack that deals +1d8 damage. You gain darkvision out to 60 ft; if you already have darkvision, it extends by 30 ft. In darkness, you are invisible to creatures that rely on darkvision to see you.",
    },
    level13Feature: {
      name: "Stalker's Flurry + Iron Mind",
      description: "Stalker's Flurry: Once per turn when you miss with a weapon attack, immediately make another weapon attack. Iron Mind: Gain proficiency in WIS saving throws.",
    },
    level17Feature: {
      name: "Shadowy Dodge",
      description: "Reaction when a creature attacks you without advantage: impose disadvantage on the attack roll. If the attack misses, immediately make one weapon attack against the attacker.",
    },
  },
  {
    id: "stalker-horizon-walker",
    name: "Horizon Walker",
    level9Feature: {
      name: "Detect Portal + Planar Warrior",
      description: "As an action, sense the location of any planar portal within 1 mile (1/short rest). Planar Warrior: Bonus action before you attack: the first time you hit a creature this turn, it takes an additional 1d8 force damage and all damage from that hit changes to force.",
    },
    level13Feature: {
      name: "Ethereal Step + Distant Strike",
      description: "Ethereal Step: Bonus action (1/short rest): enter the Ethereal Plane until the start of your next turn. Distant Strike: Teleport up to 10 ft before each attack (during the Attack action). If you use this teleport and attack at least three separate creatures, make one additional attack against a creature of your choice.",
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
      description: "Hunter's Sense: As an action, learn one damage immunity, resistance, or vulnerability of one creature within 60 ft (WIS mod/long rest). Slayer's Prey: Bonus action, mark one creature within 60 ft; the first time each turn that you hit the marked target, deal +1d6 damage. The mark lasts until the creature drops to 0 HP or you mark a new target.",
    },
    level13Feature: {
      name: "Supernatural Defense + Magic-User's Nemesis",
      description: "Supernatural Defense: When you make a saving throw that your Slayer's Prey target forced you to make, add 1d6 to the roll. When a creature attempts to grapple you, add 1d6 to your escape check. Magic-User's Nemesis: Reaction (1/short rest) when a creature within 60 ft attempts to cast a spell or teleport: the creature makes a WIS save (DC 8 + prof + WIS mod) or the spell or teleportation fails.",
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
      description: "When you hit a creature with a weapon attack, it takes +1d4 psychic damage (once per turn per creature). Add your WIS modifier to all Charisma checks. Bonus Spells (always prepared, count as Ranger spells): charm person (1st), misty step (2nd), dispel magic (3rd); at level 13+: dimension door (4th); at level 17+: mislead (5th).",
    },
    level13Feature: {
      name: "Beguiling Twist",
      description: "When a creature within 120 ft of you succeeds on a saving throw against the charmed or frightened condition, use your reaction to redirect the effect to another creature within 120 ft (WIS save or be charmed or frightened for 1 minute). Dreadful Strikes damage increases to 1d6.",
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
      name: "Gathered Swarm",
      description: "You attract a swarm of spirits that surround you. Once per turn when you hit with an attack, choose one effect: push the target up to 15 ft horizontally (STR save or it moves), move yourself up to 5 ft in any direction without provoking opportunity attacks, or the target takes 1d6 piercing damage from the swarm.",
    },
    level13Feature: {
      name: "Writhing Tide + Mighty Swarm",
      description: "Writhing Tide: As a bonus action, use the swarm to fly up to 10 ft without provoking opportunity attacks. Mighty Swarm: Your Gathered Swarm effects improve: the push also knocks the target prone on a failed STR save, and the movement option grants you half cover until the start of your next turn. The swarm's damage increases to 1d8 piercing.",
    },
    level17Feature: {
      name: "Swarming Dispersal",
      description: "Reaction when you take damage (1/long rest, or spend a spell slot): gain resistance to the triggering damage and immediately teleport up to 30 ft to an unoccupied space you can see.",
    },
  },
  {
    id: "stalker-drakewarden",
    name: "Drakewarden",
    level9Feature: {
      name: "Drake Companion",
      description: "You attract a drake companion of a damage type you choose (acid, cold, fire, lightning, or poison). It is Small, has AC 14 + PB, HP = 5 \u00d7 Fatebound level, Speed 40 ft, and makes a Bite attack (1d6 + PB of your chosen type). As a reaction when you hit a creature within 30 ft of the drake, the drake exhales a breath weapon: one creature of your choice within 15 ft makes a DEX save (DC 8 + prof + drake's CON mod) or takes 1d6 \u00d7 prof bonus damage of its type (half on save). Prof bonus uses/long rest.",
    },
    level13Feature: {
      name: "Bond of Fang and Scale",
      description: "Your drake grows to Large size and can serve as a mount for you. You gain resistance to the damage type associated with your drake. Your drake's breath weapon becomes a 30-ft cone dealing 8d6 damage (DEX save for half, prof bonus uses/long rest).",
    },
    level17Feature: {
      name: "Perfected Bond",
      description: "Your drake's Bite attack deals an additional 1d6 damage. Its breath weapon becomes a 60-ft cone dealing 12d6 damage. You and your drake both gain resistance to the drake's damage type, and you can use Favored Foe marks to designate targets for your drake without expending your bonus action.",
    },
  },
];
