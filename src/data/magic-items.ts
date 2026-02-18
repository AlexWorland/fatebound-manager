import type { MagicItem } from "@/types/features";

export const FATEBOUND_MAGIC_ITEMS: MagicItem[] = [
  {
    name: "Dice of the Fatebound",
    type: "Wondrous item",
    rarity: "Rare",
    attunement: "Requires attunement by a Fatebound",
    description:
      "Seven obsidian dice with shifting golden veins that pulse in time with your Fatemark. Once per long rest, after completing your Dawn Roll, you may roll any one of the seven dice and add or subtract the result from your Dawn Roll (minimum 1, maximum 20). A modified result does not count as a natural 1 or natural 20 for the purposes of DM's Design or Master of Fate. Additionally, once per day you can cast augury without expending a spell slot by casting the dice. Curse: Each time you modify your Dawn Roll, roll a d20. On a 1, the dice become cursed until the next dawn \u2014 your next Dawn Roll is made with disadvantage (roll 2d20, keep lowest).",
  },
  {
    name: "Cloak of Many Forms",
    type: "Wondrous item",
    rarity: "Rare",
    attunement: "Requires attunement",
    description:
      "A shimmering cloak woven from a thousand colors that shift and adapt to match your current form. When you use Chaos Surge, roll twice on the target table and choose which result to use. You also have advantage on CHA (Performance) checks to impersonate another person or disguise your identity.",
  },
  {
    name: "Fatemark Ink",
    type: "Wondrous item",
    rarity: "Very Rare",
    attunement: "Requires attunement by a Fatebound",
    description:
      "A vial of iridescent ink that never dries, harvested from the border between the Material Plane and the Far Realm. When you apply the ink to your Fatemark (1-hour ritual), choose one active feature from your current Daily Form. That feature is permanently inscribed into your Fatemark and no longer requires a Residual Memory slot \u2014 it persists across all future forms. You can have only one feature inscribed at a time. You cannot inscribe chassis features (proficiencies, hit die). The inscription can be removed only by applying another vial of Fatemark Ink or by remove curse or greater restoration cast at 7th level or higher.",
  },
  {
    name: "Mirror of the Unformed",
    type: "Wondrous item",
    rarity: "Rare",
    attunement: "Requires attunement",
    description:
      "A polished hand mirror whose surface shows not your reflection, but what you might have been. As an action, you can peer into the mirror and see the Stabilized Form you would have received if your Dawn Roll had been 1 higher or 1 lower (your choice). This vision lasts up to 1 minute and reveals the form's base features, subclass, and any relevant details. Once per long rest, after completing your Dawn Roll, you can use the mirror to shift your result by 1 up or down on the Dawn Roll table. A shifted result does not trigger natural 1 or natural 20 features.",
  },
  {
    name: "Amulet of Fractured Identity",
    type: "Wondrous item",
    rarity: "Rare",
    attunement: "Requires attunement by a Fatebound",
    description:
      "A cracked crystal sphere set in a silver frame, containing shifting ghostly faces that mirror your past forms. While attuned, you gain proficiency in Deception and Persuasion. If you are already proficient in either skill, you gain Expertise in it instead. As a bonus action, you can channel the amulet to gain advantage on CHA checks related to lying, misdirection, or avoiding recognition until the end of your next turn. You can use this feature a number of times equal to your proficiency bonus per long rest.",
  },
  {
    name: "Ring of Yesterday's Power",
    type: "Ring",
    rarity: "Rare",
    attunement: "Requires attunement by a Fatebound",
    description:
      "A tarnished bronze ring inscribed with the words: \"What was, is not. What is, was not. What will be, already is.\" When you allocate your Fate Pool after a Dawn Roll, designate one feature stored in Residual Memory as \"empowered.\" That feature functions as if you were one class level higher than your Fatebound level (affecting damage dice, uses per rest, DC calculations, or other scaling). Only one feature can be empowered at a time. Additionally, once per long rest, when you lose a Residual Memory feature due to Chaos Surge, you can retain it for 1 hour before it fades.",
  },
  {
    name: "Coin of Fickle Fortune",
    type: "Wondrous item",
    rarity: "Legendary",
    attunement: "Requires attunement by a Fatebound",
    description:
      "A gold coin with a laughing face on one side and a screaming face on the other. It feels warm to the touch and occasionally flips itself when you aren't looking. Rewrite Fate (1/long rest): After completing your Dawn Roll, flip the coin and call it. If you call correctly, you may reroll the Dawn Roll and use the new result. If you call incorrectly, you lose the benefits of Extra Dawn Die and Defy Fate for the day (if applicable). Tempt Destiny (proficiency bonus uses/day): Before making an attack roll, ability check, or saving throw, flip the coin and call it. If correct, you have advantage on all d20 rolls until the end of your next turn. If incorrect, you have disadvantage on all d20 rolls until the end of your next turn. Curse of Hubris: If you call Rewrite Fate incorrectly three times in a row (across multiple days), the coin becomes cursed. While cursed, your Dawn Roll is made with disadvantage until the curse is removed by remove curse cast at 9th level or higher.",
  },
];
