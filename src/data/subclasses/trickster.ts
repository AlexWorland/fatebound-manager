import type { SubclassEntry } from "@/types/forms";

export const TRICKSTER_SUBCLASSES: SubclassEntry[] = [
  {
    id: "trickster-lore",
    name: "College of Lore",
    level9Feature: {
      name: "Cutting Words",
      description: "Reaction: when a creature within 60 ft you can see makes an attack roll, ability check, or damage roll, expend one Bardic Inspiration die and subtract the result from the roll.",
    },
    level13Feature: {
      name: "Additional Magical Secrets",
      description: "You learn 2 additional spells from any class's spell list, for 4 total Magical Secrets spells gained at this level.",
    },
    level17Feature: {
      name: "Peerless Skill",
      description: "When you make an ability check, you can expend one Bardic Inspiration use to roll a Bardic Inspiration die and add the result to your check. You can choose to do so after you roll the die for the ability check, but before the DM tells you whether you succeed or fail.",
    },
  },
  {
    id: "trickster-valor",
    name: "College of Valor",
    level9Feature: {
      name: "Combat Inspiration",
      description: "You gain proficiency with medium armor, shields, and martial weapons. Creatures with your Bardic Inspiration die can expend it when they hit with a weapon attack to add it to damage, or as a reaction when hit to add it to their AC against that attack. If the total equals or exceeds the attack roll, the attack misses.",
    },
    level13Feature: {
      name: "Extra Attack",
      description: "You can attack twice when you take the Attack action (if you don't already have Extra Attack from another source).",
    },
    level17Feature: {
      name: "Battle Magic",
      description: "When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.",
    },
  },
  {
    id: "trickster-glamour",
    name: "College of Glamour",
    level9Feature: {
      name: "Mantle of Inspiration",
      description: "Bonus action, expend one Bardic Inspiration use: a number of creatures of your choice within 60 ft that you can see and that can see you, up to your Charisma modifier (minimum of one), each gain 5 temporary HP (8 at level 5, 11 at level 10, 14 at level 15), and can immediately use their reaction to move up to their speed without provoking opportunity attacks.",
    },
    level13Feature: {
      name: "Mantle of Majesty",
      description: "As a bonus action, you cast command without expending a spell slot. You take on an appearance of unearthly beauty for 1 minute or until your concentration ends. During this time, you can cast command as a bonus action on each of your turns without expending a spell slot. Any creature charmed by you automatically fails its saving throw against the command you cast with this feature. Uses: 1/long rest.",
    },
    level17Feature: {
      name: "Unbreakable Majesty",
      description: "Bonus action once per short rest — you assume a magisterial presence for 1 minute. Whenever any creature tries to attack you for the first time on a turn, it must make a CHA save. On a failed save, it can't attack you and must choose a new target (or the attack is wasted). On a successful save, it can attack you but has disadvantage on any saving throw it makes against your spells on your next turn.",
    },
  },
  {
    id: "trickster-swords",
    name: "College of Swords",
    level9Feature: {
      name: "Blade Flourish",
      description: "You gain proficiency with medium armor and scimitars. When you take the Attack action, your speed increases by 10 ft until the end of the turn. Once per turn on a hit, you can expend a Bardic Inspiration die to choose: Defensive (add roll to your AC until your next turn), Slashing (the target you hit and one creature of your choice within 5 ft of it each take extra damage equal to the die roll), or Mobile (push target up to 5 ft + die roll away from you; you can then immediately use your reaction to move up to your walking speed to an unoccupied space within 5 ft of the target).",
    },
    level13Feature: {
      name: "Extra Attack",
      description: "You can attack twice when you take the Attack action (if you don't already have Extra Attack from another source).",
    },
    level17Feature: {
      name: "Master's Flourish",
      description: "When you use a Blade Flourish option, you can use a d6 in place of your Bardic Inspiration die, expending neither the die nor an Inspiration use.",
    },
  },
  {
    id: "trickster-whispers",
    name: "College of Whispers",
    level9Feature: {
      name: "Psychic Blades",
      description: "When you hit a creature with a weapon attack, you can expend one Bardic Inspiration use to deal extra psychic damage: 2d6 (levels 1–4), 3d6 (levels 5–9), 5d6 (levels 10–14), or 8d6 (level 15+). You can do this only once per round on your turn. Words of Terror: After speaking alone with a humanoid for at least 1 minute, they must succeed on a WIS save or be frightened of you for 1 hour (or until it is attacked or damaged, or until it witnesses its allies being attacked or damaged).",
    },
    level13Feature: {
      name: "Mantle of Whispers",
      description: "Reaction when a humanoid dies within 30 ft — you magically capture its shadow (retained until used or long rest). As an action, you can use the shadow: it vanishes, becoming a magical disguise on you. You look like the dead creature, healthy and alive, for 1 hour (ends early as a bonus action). While disguised, you gain access to all information the creature would freely share with a casual acquaintance — enough to pass as the person by drawing on its memories. Another creature can see through the disguise by succeeding on a WIS (Insight) check contested by your CHA (Deception) check, to which you add a +5 bonus.",
    },
    level17Feature: {
      name: "Shadow Lore",
      description: "Action once per long rest — whisper a phrase only one creature within 30 ft can hear. That creature must make a WIS save; it auto-succeeds if it doesn't share a language with you or can't hear you. On a failed save, the creature is charmed by you for 8 hours or until you or your companions do anything harmful to it, believing you know its darkest secret and doing nothing to risk your displeasure.",
    },
  },
  {
    id: "trickster-creation",
    name: "College of Creation",
    level9Feature: {
      name: "Mote of Potential",
      description: "When you grant a creature a Bardic Inspiration die, you also grant a Mote of Potential. When they use the die for: an ability check — roll the die twice and use the higher result; an attack roll — on a hit, the target and each creature of your choice that you can see within 5 ft of it must succeed on a CON saving throw against your spell save DC or take thunder damage equal to the number rolled; a saving throw — gain temp HP equal to the roll + CHA mod.",
    },
    level13Feature: {
      name: "Performance of Creation",
      description: "Action once per long rest (or by expending a 2nd-level or higher spell slot) — create one Medium or smaller nonmagical item worth up to 20 × your Fatebound level in GP in an unoccupied space within 10 ft of you. The item lasts a number of hours equal to your proficiency bonus.",
    },
    level17Feature: {
      name: "Creative Crescendo",
      description: "When you use Performance of Creation, you can create a number of items equal to your CHA modifier (minimum 2) simultaneously; only one can be the maximum size you can create, the rest must be Small or Tiny. Each lasts a number of hours equal to your proficiency bonus.",
    },
  },
  {
    id: "trickster-eloquence",
    name: "College of Eloquence",
    level9Feature: {
      name: "Silver Tongue + Unsettling Words",
      description: "When you make a Persuasion or Deception check, treat a d20 roll of 9 or lower as a 10. Unsettling Words: Bonus action, expend one Bardic Inspiration die — a creature of your choice within 60 ft that you can see subtracts the result from its next saving throw before the start of your next turn.",
    },
    level13Feature: {
      name: "Unfailing Inspiration",
      description: "When a creature uses your Bardic Inspiration die and fails the roll it was applied to, they do not expend the die.",
    },
    level17Feature: {
      name: "Infectious Inspiration",
      description: "Reaction — when a creature uses your Bardic Inspiration die and succeeds on the roll it was applied to, you can grant a new Bardic Inspiration die to a different creature within 60 ft without expending a use. Usable a number of times equal to your CHA modifier per long rest.",
    },
  },
  {
    id: "trickster-spirits",
    name: "College of Spirits",
    level9Feature: {
      name: "Tales from Beyond",
      description: "You gain a spiritual focus (candle, crystal ball, skull, etc.) that boosts healing spells by +1d6 and damage spells by +1d6 when wielded. Tales from Beyond: Bonus action, expend one Bardic Inspiration die to randomly select from the Spirit Tales table, producing a random magical effect based on the result. Uses Fate's Selection to determine the tale told (d6 for entries 1–6 at level 9; d12 for entries 1–12 if the Spirit Session ritual is used to access higher tales). At level 17, Mystical Connection allows rolling the die twice and choosing which result to use. This replaces the standard Bardic Inspiration die roll for tale selection. (Uses Fate's Selection per Fatebound convention instead of the Bardic Inspiration die. Tale power is fixed rather than scaling with BI die size.)",
    },
    level13Feature: {
      name: "Spirit Session",
      description: "During a 1-hour ritual with a number of willing participants equal to or less than your proficiency bonus, you temporarily learn one spell of your choice from any class list. The spell must be of a level equal to or less than the number of participants (max 5th level), must be of the Divination or Necromancy school, and counts as a Bard spell for you. The spell lasts until you use this feature again.",
    },
    level17Feature: {
      name: "Mystical Connection",
      description: "Whenever you roll on the Spirit Tales table, you can roll the die twice and choose which of the two effects to bestow. If you roll the same number on both dice, you can ignore the number and choose any effect on the table.",
    },
  },
];;
