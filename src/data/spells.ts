import type { Spell } from "@/types/features";

export const FATEBOUND_SPELLS: Spell[] = [
  {
    name: "Fate's Whisper",
    level: 1,
    school: "Divination",
    castingTime: "1 minute",
    range: "Self",
    components: "V, S, M (silver coin marked with your Fatemark)",
    duration: "Instantaneous",
    description:
      "You peer into fate's threads. During a long rest (counts as light activity), learn the result of your next Dawn Roll before it happens, including all Dawn Roll dice (including Extra Dawn Die if available). You cannot change the roll \u2014 only prepare for it. At Higher Levels: When you cast this spell using a spell slot of 3rd level or higher, you also glimpse up to two Chaos Form table results (your choice of which tables).",
    spellLists: ["Fatebound"],
  },
  {
    name: "Destined Strike",
    level: 1,
    school: "Divination",
    castingTime: "1 bonus action",
    range: "Self",
    components: "V",
    duration: "Concentration, up to 1 minute",
    description:
      "Your next weapon attack has advantage. If it hits, roll one weapon damage die an additional time and add it to the damage. If you don't attack before your next turn, you gain +2 AC until your next turn instead.",
    spellLists: ["Fatebound"],
  },
  {
    name: "Chaotic Surge",
    level: 2,
    school: "Evocation",
    castingTime: "1 action",
    range: "60 feet",
    components: "V, S, M (a die with an unknown number of sides)",
    duration: "Instantaneous",
    description:
      "Roll a d4 to select a damage type (1-fire, 2-cold, 3-lightning, 4-force). The target must make a DEX save or take 3d8 damage of the selected type, or half as much on a success. At Higher Levels: When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.",
    spellLists: ["Fatebound"],
  },
  {
    name: "Thread of Fate",
    level: 3,
    school: "Divination",
    castingTime: "1 action",
    range: "Touch",
    components: "V, S, M (golden thread worth 50 gp)",
    duration: "Concentration, up to 10 minutes",
    description:
      "A touched creature gains the following benefits for the duration: +1d4 to one attack roll, ability check, or saving throw per round (must declare before the triggering roll is made); advantage on initiative rolls; and a DC 15 WIS (Insight) check to avoid being surprised. The spell ends immediately if the target takes any damage. At Higher Levels: The bonus die increases to d6 at 4th level and d8 at 5th level.",
    spellLists: ["Fatebound"],
  },
  {
    name: "Unravel",
    level: 4,
    school: "Abjuration",
    castingTime: "1 action",
    range: "60 feet",
    components: "V, S, M (tangled knot of silk)",
    duration: "Concentration, up to 1 minute",
    description:
      "Target a creature within range. It must make a CHA saving throw. On a failure, choose one of the following to suppress for the duration: a class feature (Rage, Sneak Attack, Channel Divinity, etc.) or a racial trait (darkvision, breath weapon, innate spellcasting, etc.). Suppressing Spellcasting as a whole requires a 6th-level or higher spell slot. The target repeats the saving throw at the end of each of its turns, ending the effect on a success. At Higher Levels: When you cast this spell using a 5th-level slot, you can target two creatures or suppress two features on a single creature.",
    spellLists: ["Fatebound"],
  },
  {
    name: "Probability Storm",
    level: 5,
    school: "Evocation",
    castingTime: "1 action",
    range: "Self (30-foot radius)",
    components: "V, S, M (loaded die and broken mirror shard)",
    duration: "Concentration, up to 1 minute",
    description:
      "A 30-foot sphere of chaotic probability centered on you manifests and moves with you. At the start of each of your turns, randomly select the effect (1\u20136): 1 \u2014 Each hostile creature in the sphere takes 3d6 necrotic damage (CON save for half); 2 \u2014 Each creature in the sphere (including you) takes 2d6 force damage (no save); 3 \u2014 Each friendly creature in the sphere (including you) regains 2d6 hit points; 4 \u2014 Each creature in the sphere has its speed halved until the start of your next turn; 5 \u2014 One random creature in the sphere is teleported to a random unoccupied space within 30 feet; 6 \u2014 Roll twice more on this table (rerolling further 6s); both effects occur simultaneously.",
    spellLists: ["Fatebound"],
  },
  {
    name: "Fate's Gambit",
    level: 6,
    school: "Transmutation",
    castingTime: "1 action",
    range: "Self",
    components: "V, S, M (a set of bone dice worth at least 100 gp, which shatter when the spell is cast)",
    duration: "Until your next Dawn Roll",
    description:
      "You surrender your body and mind to fate's whim, rewriting yourself from the ground up. Roll 4d6 and drop the lowest die six times, assigning each result in order to Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. Each score is locked before the next is rolled. You cannot rearrange the results. These new scores replace your current ability scores \u2014 including any modifications from Fate Attunement \u2014 for the duration. Your Fate Attunement feature cannot be used to modify these scores. All derived statistics (AC, attack bonuses, save DCs, skill modifiers, spell preparation counts, maximum hit points) are recalculated immediately using the new scores. Irreversible: Once cast, the new scores cannot be reversed, suppressed, or altered by dispel magic, remove curse, greater restoration, or similar magic. Only completing a long rest and making a new Dawn Roll restores your original ability scores. Restriction: This spell can be cast only once per long rest. Access: This spell is accessible only through Mystic Arcanum (level 13+) or similar features that grant 6th-level casting.",
    spellLists: ["Fatebound"],
  },
];
