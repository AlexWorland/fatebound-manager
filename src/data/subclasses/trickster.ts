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
      description: "When you make an ability check and fail, you can expend one Bardic Inspiration use to add the die result to your roll (applied after seeing the result).",
    },
  },
  {
    id: "trickster-valor",
    name: "College of Valor",
    level9Feature: {
      name: "Combat Inspiration",
      description: "You gain proficiency with medium armor, shields, and martial weapons. Creatures with your Bardic Inspiration die can expend it when they hit with a weapon attack to add it to damage, or as a reaction when hit to add it to their AC against that attack.",
    },
    level13Feature: {
      name: "Extra Attack",
      description: "You can attack twice when you take the Attack action (if you don't already have Extra Attack from another source).",
    },
    level17Feature: {
      name: "Battle Magic",
      description: "When you use your action to cast a spell, you can make one weapon attack as a bonus action.",
    },
  },
  {
    id: "trickster-glamour",
    name: "College of Glamour",
    level9Feature: {
      name: "Mantle of Inspiration",
      description: "Bonus action, expend one Bardic Inspiration use: up to 5 creatures of your choice within 60 ft each gain temp HP equal to your Bardic Inspiration die roll + CHA mod, and can immediately use their reaction to move up to their speed without provoking opportunity attacks.",
    },
    level13Feature: {
      name: "Enthralling Performance",
      description: "After performing for at least 1 minute, a number of creatures equal to your proficiency bonus who heard you must succeed on a WIS save or be charmed by you for 1 hour; they regard you as a friendly acquaintance.",
    },
    level17Feature: {
      name: "Unbreakable Majesty",
      description: "Bonus action once per short rest \u2014 you assume a magisterial presence for 1 minute. Creatures that try to attack you must first succeed on a CHA save or waste the attack targeting another creature of your choice.",
    },
  },
  {
    id: "trickster-swords",
    name: "College of Swords",
    level9Feature: {
      name: "Blade Flourish",
      description: "You gain proficiency with medium armor and scimitars. When you take the Attack action, your speed increases by 10 ft until the end of the turn. Once per turn on a hit, you can expend a Bardic Inspiration die to choose: Defensive (add roll to your AC until your next turn), Slashing (adjacent creature takes die roll in slashing damage), or Mobile (push target 5 ft + die roll, add roll to AC until next turn).",
    },
    level13Feature: {
      name: "Extra Attack + Flourish Improvement",
      description: "You can attack twice when you take the Attack action. Your Blade Flourish Bardic Inspiration die increases to a d8.",
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
      name: "Psychic Blades + Words of Terror",
      description: "When you hit a creature with a weapon attack, you can expend one Bardic Inspiration die to deal extra psychic damage equal to the roll. Words of Terror: After speaking privately with a humanoid for at least 1 minute, they must succeed on a WIS save or be frightened of you for 1 hour (or until they see you act threateningly).",
    },
    level13Feature: {
      name: "Mantle of Whispers",
      description: "Reaction when a humanoid dies within 30 ft \u2014 you magically capture its shadow. As an action, you can don the shadow to assume that creature's appearance and voice for 1 hour, gaining advantage on Deception checks to pass as it.",
    },
    level17Feature: {
      name: "Shadow Lore",
      description: "Action once per long rest \u2014 one creature within 30 ft that can hear you must make a WIS save or be charmed by you for 8 hours, believing you know its darkest secret and doing nothing to risk your displeasure.",
    },
  },
  {
    id: "trickster-creation",
    name: "College of Creation",
    level9Feature: {
      name: "Mote of Potential",
      description: "When you grant a creature a Bardic Inspiration die, you also grant a Mote of Potential. When they use the die for: an ability check \u2014 roll the die twice and use the higher result; an attack roll \u2014 deal thunder damage to nearby creatures equal to the roll on a hit; a saving throw \u2014 gain temp HP equal to the roll + CHA mod.",
    },
    level13Feature: {
      name: "Performance of Creation",
      description: "Action once per short rest \u2014 create one nonmagical item worth up to 20 \u00d7 your Fatebound level in GP that you can see. The item lasts a number of hours equal to your proficiency bonus.",
    },
    level17Feature: {
      name: "Creative Crescendo",
      description: "When you use Performance of Creation, you can create multiple items simultaneously up to a number equal to your proficiency bonus, with no total GP limit; each lasts a number of hours equal to your Bardic Inspiration die roll.",
    },
  },
  {
    id: "trickster-eloquence",
    name: "College of Eloquence",
    level9Feature: {
      name: "Silver Tongue + Unsettling Words",
      description: "When you make a Persuasion or Deception check, treat any result below 10 as a 10. Unsettling Words: Bonus action, expend one Bardic Inspiration die \u2014 a creature of your choice within 60 ft that you can see subtracts the result from its next saving throw before the start of your next turn.",
    },
    level13Feature: {
      name: "Unfailing Inspiration",
      description: "When a creature uses your Bardic Inspiration die and fails the roll it was applied to, they do not expend the die.",
    },
    level17Feature: {
      name: "Infectious Inspiration",
      description: "Reaction \u2014 when a creature uses your Bardic Inspiration die and succeeds on the roll it was applied to, you can grant a new Bardic Inspiration die to a different creature within 60 ft without expending a use. Usable a number of times equal to your CHA modifier per long rest.",
    },
  },
  {
    id: "trickster-spirits",
    name: "College of Spirits",
    level9Feature: {
      name: "Tales from Beyond + Spiritual Focus",
      description: "You gain a spiritual focus (candle, crystal ball, skull, etc.) that boosts healing spells by +1d6 and damage spells by +1d6 when wielded. Tales from Beyond: Bonus action, expend one Bardic Inspiration die to randomly select from the Spirit Tales table, producing a random magical effect based on the result.",
    },
    level13Feature: {
      name: "Spiritual Focus Improvement + Spirit Session",
      description: "Your spiritual focus now adds +1d6 to the healing or damage dealt by your spells. Spirit Session: During a 1-hour ritual with a number of willing participants, you temporarily learn one spell from any class list based on the number of participants.",
    },
    level17Feature: {
      name: "Mystical Connection",
      description: "Your Tales from Beyond selections are made from a 12-entry extended table granting access to more powerful effects. Additionally, creatures targeted by Tales from Beyond can be within 120 ft rather than 30 ft.",
    },
  },
];
