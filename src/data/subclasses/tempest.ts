import type { SubclassEntry } from "@/types/forms";

export const TEMPEST_SUBCLASSES: SubclassEntry[] = [
  {
    id: "tempest-berserker",
    name: "Berserker",
    level9Feature: {
      name: "Frenzy",
      description: "While raging, you can go into a frenzy: make one additional melee weapon attack as a bonus action each turn. When the rage ends, you gain one level of exhaustion.",
    },
    level13Feature: {
      name: "Intimidating Presence",
      description: "Action \u2014 one creature within 30 ft you can see must succeed on a WIS save (DC = 8 + proficiency bonus + CHA modifier) or be frightened of you until the end of your next turn.",
    },
    level17Feature: {
      name: "Retaliation",
      description: "Reaction \u2014 when you take damage from a creature within 5 ft of you, make one melee weapon attack against that creature.",
    },
  },
  {
    id: "tempest-totem-warrior",
    name: "Totem Warrior",
    level9Feature: {
      name: "Totem Spirit",
      description: "Randomly select your totem: Bear (1) \u2014 resistance to all damage types except psychic while raging; Eagle (2) \u2014 Dash as bonus action while raging, opportunity attacks against you have disadvantage; Wolf (3) \u2014 allies have advantage on melee attacks against creatures within 5 ft of you while you rage.",
    },
    level13Feature: {
      name: "Spirit Walker",
      description: "You can cast commune with nature as a ritual, communing with the spirit of nature in your current environment.",
    },
    level17Feature: {
      name: "Totemic Attunement",
      description: "Your totem's power deepens \u2014 Bear: creatures within 5 ft of you have disadvantage on attack rolls against your allies while you rage; Eagle: you gain a fly speed equal to your walking speed while raging; Wolf: when you hit a Large or smaller creature while raging, you can knock it prone as a bonus action.",
    },
  },
  {
    id: "tempest-ancestral-guardian",
    name: "Ancestral Guardian",
    level9Feature: {
      name: "Spirit Shield",
      description: "While raging, the first creature you hit each turn has disadvantage on attacks against anyone other than you, and allies have resistance to that creature's damage, until your next turn.",
    },
    level13Feature: {
      name: "Consult the Spirits",
      description: "You can cast augury or clairvoyance once without expending a spell slot or material components (short rest recharge).",
    },
    level17Feature: {
      name: "Vengeful Ancestors",
      description: "When your Spirit Shield reduces incoming damage, the attacker takes force damage equal to the amount of damage Spirit Shield prevented.",
    },
  },
  {
    id: "tempest-storm-herald",
    name: "Storm Herald",
    level9Feature: {
      name: "Storm Aura",
      description: "While raging, emit a 10-ft aura. Choose when you rage: Desert (deal 1d4 + proficiency bonus fire damage to one chosen creature/turn), Sea (one creature makes DEX save or takes 2d6 lightning, half on save), or Tundra (chosen creatures gain CON mod temp HP/turn).",
    },
    level13Feature: {
      name: "Storm Soul",
      description: "You gain resistance to your aura's element \u2014 Desert: fire resistance + immunity to hot environment exhaustion; Sea: resistance to lightning + can breathe water and swim at full speed; Tundra: cold resistance + immunity to cold environment exhaustion.",
    },
    level17Feature: {
      name: "Raging Storm",
      description: "Your aura strikes back \u2014 Desert: reaction when hit by a melee attack, deal 1d6 fire damage to the attacker; Sea: reaction when you hit a creature, force a STR save or knock it prone; Tundra: when your aura deals damage to a creature, it must succeed on a STR save or its speed is reduced to 0 until the start of your next turn.",
    },
  },
  {
    id: "tempest-zealot",
    name: "Zealot",
    level9Feature: {
      name: "Divine Fury + Warrior of the Gods",
      description: "Divine Fury: First hit each turn while raging deals bonus radiant or necrotic damage (your choice) equal to 1d6 + half your Fatebound level. Warrior of the Gods: Spells to resurrect you require no material components.",
    },
    level13Feature: {
      name: "Zealous Presence",
      description: "Bonus action once per long rest \u2014 allies within 60 ft gain advantage on attack rolls and saving throws until the start of your next turn.",
    },
    level17Feature: {
      name: "Rage Beyond Death",
      description: "While raging, having 0 HP doesn't kill you; you remain conscious and keep fighting. If you still have 0 HP when your rage ends, you die.",
    },
  },
  {
    id: "tempest-beast",
    name: "Beast",
    level9Feature: {
      name: "Form of the Beast",
      description: "On the Attack action while raging, your body sprouts a natural weapon. Choose one: Bite (1d8 piercing; on hit, regain HP = proficiency bonus, once per turn), Claws (two attacks each dealing 1d6 slashing), or Tail (reach, 1d8 piercing; reaction when hit to add 1d8 to AC for that attack).",
    },
    level13Feature: {
      name: "Infectious Fury",
      description: "When you hit a creature while raging, you can force it to make a WIS save (DC = 8 + proficiency bonus + CON modifier) or use its reaction to make a melee attack against one of its allies (your choice) or take 2d12 psychic damage. Usable a number of times equal to your proficiency bonus per long rest.",
    },
    level17Feature: {
      name: "Call the Hunt",
      description: "Bonus action once per long rest (proficiency bonus times) \u2014 allies within 30 ft who can see or hear you gain a +1d6 bonus to their first damage roll each turn for 1 minute.",
    },
  },
  {
    id: "tempest-wild-magic",
    name: "Wild Magic",
    level9Feature: {
      name: "Wild Surge",
      description: "While raging, you emanate wild magic. At the start of each of your turns while raging, the DM can have you randomly select from the Wild Magic Surge table (PHB) \u2014 on an 8, you cast detect magic for free. Additionally, once per rage you can randomly select from the table voluntarily.",
    },
    level13Feature: {
      name: "Unstable Backlash",
      description: "Reaction \u2014 when you take damage while raging, randomly select from the Wild Magic Surge table and replace your current wild magic effect with the new result.",
    },
    level17Feature: {
      name: "Controlled Surge",
      description: "When the Wild Surge table is rolled, you roll twice and choose which effect to apply.",
    },
  },
  {
    id: "tempest-battlerager",
    name: "Battlerager",
    level9Feature: {
      name: "Spiked Armor",
      description: "While raging in spiked armor, make a bonus action attack (1d4 piercing) against a creature you've grappled. Grappling a creature deals 3 piercing at the start of your turns. When you use Reckless Attack, gain temp HP = proficiency bonus.",
    },
    level13Feature: {
      name: "Battlerager Charge",
      description: "While raging in spiked armor, you can take the Dash action as a bonus action.",
    },
    level17Feature: {
      name: "Spiked Retribution",
      description: "When a creature within 5 ft of you hits you with a melee attack while you are raging, it takes 3 piercing damage from your spiked armor.",
    },
  },
];
