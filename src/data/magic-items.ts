import type { MagicItem } from "@/types/features";

export const FATEBOUND_MAGIC_ITEMS: MagicItem[] = [
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
      "A tarnished bronze ring inscribed with the words: \"What was, is not. What is, was not. What will be, already is.\" When you allocate your Fate Pool after a Dawn Roll, designate one feature stored in Residual Memory as \"empowered.\" That feature functions as if your Fatebound level were one higher for the purpose of calculating that feature's effects (affecting damage dice, uses per rest, DC calculations, or other scaling). Only one feature can be empowered at a time.",
  },
];
