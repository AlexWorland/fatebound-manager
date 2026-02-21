import type { SubclassEntry } from "@/types/forms";

export const TEMPEST_SUBCLASSES: SubclassEntry[] = [
  {
    id: "tempest-berserker",
    name: "Berserker",
    level9Feature: {
      name: "Frenzy",
      description: "While raging, you can go into a frenzy: for the duration of your rage you can make one additional melee weapon attack as a bonus action on each of your turns after this one. When the rage ends, you gain one level of exhaustion.",
    },
    level13Feature: {
      name: "Intimidating Presence",
      description: "Action — one creature within 30 ft you can see must succeed on a WIS save (DC = 8 + proficiency bonus + CHA modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. The effect ends if the creature ends its turn out of line of sight or more than 60 ft away from you. If the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.",
    },
    level17Feature: {
      name: "Retaliation",
      description: "Reaction — when you take damage from a creature within 5 ft of you, make one melee weapon attack against that creature.",
    },
  },
  {
    id: "tempest-totem-warrior",
    name: "Totem Warrior",
    level9Feature: {
      name: "Totem Spirit",
      description: "Randomly select your totem: Bear (1) — resistance to all damage types except psychic while raging; Eagle (2) — Dash as bonus action while raging, opportunity attacks against you have disadvantage while you aren't wearing heavy armor; Wolf (3) — allies have advantage on melee attack rolls against any creature within 5 ft of you that is hostile to you while you rage.",
    },
    level13Feature: {
      name: "Spirit Walker",
      description: "You can cast commune with nature as a ritual, communing with the spirit of nature in your current environment.",
    },
    level17Feature: {
      name: "Totemic Attunement",
      description: "Your totem's power deepens — Bear: while you rage, any creature within 5 ft of you that is hostile to you has disadvantage on attack rolls against targets other than you or another creature with this feature; Eagle: you gain a fly speed equal to your walking speed while raging; Wolf: when you hit a Large or smaller creature with a melee weapon attack while raging, you can knock it prone as a bonus action.",
    },
  },
  {
    id: "tempest-ancestral-guardian",
    name: "Ancestral Guardian",
    level9Feature: {
      name: "Ancestral Protectors + Spirit Shield",
      description: "While raging, the first creature you hit each turn becomes the target of your ancestral spirits until the start of your next turn: that target has disadvantage on any attack roll that isn't against you, and when the target hits a creature other than you with an attack, that creature has resistance to the damage dealt by the attack. Spirit Shield: When another creature you can see within 30 ft takes damage while you are raging, you can use your reaction to reduce that damage by 2d6 (increases to 3d6 at level 13, 4d6 at level 17).",
    },
    level13Feature: {
      name: "Consult the Spirits",
      description: "You can cast augury or clairvoyance once without expending a spell slot or material components (short rest recharge).",
    },
    level17Feature: {
      name: "Vengeful Ancestors",
      description: "When you use Spirit Shield to reduce damage, the attacker takes force damage equal to the amount of damage reduced.",
    },
  },
  {
    id: "tempest-storm-herald",
    name: "Storm Herald",
    level9Feature: {
      name: "Storm Aura",
      description: "While raging, emit a 10-ft aura. Randomly select (see Fate's Selection): 1-Desert (all other creatures in your aura take 2 fire damage each/turn), 2-Sea (one creature of your choice makes DEX save or takes 1d6 lightning, half on save), 3-Tundra (chosen creatures gain 2 temp HP/turn).",
    },
    level13Feature: {
      name: "Storm Soul",
      description: "You gain resistance to your aura's element — Desert: fire resistance + immunity to extreme heat exhaustion; Sea: lightning resistance + you can breathe underwater and gain a swimming speed of 30 ft; Tundra: cold resistance + immunity to extreme cold exhaustion.",
    },
    level17Feature: {
      name: "Raging Storm",
      description: "Your aura strikes back — Desert: immediately after a creature in your aura hits you with an attack, you can use your reaction to force that creature to make a DEX save (DC = 8 + proficiency bonus + CON modifier); on a failed save, the creature takes fire damage equal to half your Fatebound level; Sea: reaction when you hit a creature, force a STR save or knock it prone; Tundra: when your aura deals damage to a creature, it must succeed on a STR save or its speed is reduced to 0 until the start of your next turn.",
    },
  },
  {
    id: "tempest-zealot",
    name: "Zealot",
    level9Feature: {
      name: "Divine Fury + Warrior of the Gods",
      description: "Divine Fury: When you gain this feature, choose whether your divine fury deals radiant or necrotic damage. While raging, the first creature you hit on each of your turns takes extra damage of the chosen type equal to 1d6 + half your Fatebound level. Warrior of the Gods: Spells to resurrect you require no material components.",
    },
    level13Feature: {
      name: "Zealous Presence",
      description: "Bonus action once per long rest — up to 10 other creatures within 60 ft of you who can hear you gain advantage on attack rolls and saving throws until the start of your next turn.",
    },
    level17Feature: {
      name: "Rage Beyond Death",
      description: "While raging, having 0 HP doesn't knock you unconscious. You still must make death saving throws, and you suffer the normal effects of taking damage while at 0 HP. You don't die until your rage ends, and only if you still have 0 HP at that point.",
    },
  },
  {
    id: "tempest-beast",
    name: "Beast",
    level9Feature: {
      name: "Form of the Beast",
      description: "On the Attack action while raging, your body sprouts a natural weapon. Randomly select (see Fate's Selection): 1-Bite (1d8 piercing; on hit while below half your hit point maximum, regain HP = proficiency bonus, once per turn), 2-Claws (two attacks each dealing 1d6 slashing), 3-Tail (reach, 1d8 piercing; reaction when hit to add 1d8 to AC for that attack).",
    },
    level13Feature: {
      name: "Infectious Fury",
      description: "When you hit a creature while raging, you can force it to make a WIS save (DC = 8 + proficiency bonus + CON modifier) or use its reaction to make a melee attack against one of its allies (your choice) or take 2d12 psychic damage. Usable a number of times equal to your proficiency bonus per long rest.",
    },
    level17Feature: {
      name: "Call the Hunt",
      description: "Bonus action (proficiency bonus times per long rest) — choose a number of willing creatures within 30 ft of you equal to your Constitution modifier (minimum of one). Each chosen creature gains 5 temporary hit points and a +1d6 bonus to their first damage roll each turn while within 30 ft of you, for 1 minute.",
    },
  },
  {
    id: "tempest-wild-magic",
    name: "Wild Magic",
    level9Feature: {
      name: "Wild Surge",
      description: "While raging, you emanate wild magic. When you enter your rage, roll on the Wild Surge table to determine the magical effect produced. Wild Surge (d8): 1 — Shadowy tendrils lash around you: each creature of your choice you can see within 30 ft makes a CON save or takes 1d12 necrotic damage; you also gain 1d12 temporary hit points. 2 — Teleport up to 30 ft to an unoccupied space you can see (bonus action each turn while raging). 3 — An intangible spirit appears within 5 ft of one creature of your choice within 30 ft; at the end of the current turn, the spirit explodes and each creature within 5 ft of it makes a DEX save or takes 1d6 force damage (bonus action to summon another spirit each turn). 4 — One weapon you hold becomes force damage, gains light and thrown (20/60 ft), and returns to your hand at the end of each turn. 5 — Whenever a creature hits you with an attack roll before your rage ends, that creature takes 1d6 force damage. 6 — You are surrounded by multicolored lights, gaining +1 AC; allies within 10 ft gain the same bonus. 7 — Flowers and vines grow around you: ground within 15 ft of you is difficult terrain for your enemies. 8 — A bolt of light shoots from your chest: one creature of your choice within 30 ft makes a CON save or takes 1d6 radiant damage and is blinded until the start of your next turn (bonus action to repeat each turn).",
    },
    level13Feature: {
      name: "Unstable Backlash",
      description: "Reaction — when you take damage or fail a saving throw while raging, you can roll on the Wild Surge table and immediately apply the effect rolled.",
    },
    level17Feature: {
      name: "Controlled Surge",
      description: "When the Wild Surge table is rolled, you roll twice and choose which effect to apply. If you roll the same number on both dice, you can ignore the number and choose any effect on the table.",
    },
  },
  {
    id: "tempest-battlerager",
    name: "Battlerager",
    level9Feature: {
      name: "Spiked Armor",
      description: "When you assume the Battlerager subclass, your current armor magically transforms into spiked armor for the duration of your form. It reverts when your form changes. While raging in spiked armor, make a bonus action attack (1d4 piercing) against a creature within 5 ft. While you are grappling a creature, it takes 3 piercing damage at the start of each of your turns from your spikes. When you use Reckless Attack, gain temp HP = proficiency bonus.",
    },
    level13Feature: {
      name: "Battlerager Charge",
      description: "While raging in spiked armor, you can take the Dash action as a bonus action.",
    },
    level17Feature: {
      name: "Spiked Retribution",
      description: "When a creature within 5 ft of you hits you with a melee attack while you are raging and you aren't incapacitated, it takes 3 piercing damage from your spiked armor.",
    },
  },
];;
