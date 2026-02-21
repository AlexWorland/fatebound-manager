import type { SubclassEntry } from "@/types/forms";

export const SAGE_SUBCLASSES: SubclassEntry[] = [
  {
    id: "sage-abjuration",
    name: "School of Abjuration",
    level9Feature: {
      name: "Arcane Ward + Projected Ward",
      description: "When you cast an abjuration spell, create or recharge a ward with maximum HP equal to twice your Fatebound level + INT modifier. The ward absorbs incoming damage to you first; recharge it by 2× the spell level whenever you cast an abjuration. Projected Ward: Reaction — when a creature you can see within 30 ft takes damage, cause your Arcane Ward to absorb that damage instead. If the ward is reduced to 0 HP, the creature takes any remaining damage.",
    },
    level13Feature: {
      name: "Improved Abjuration + Spell Resistance",
      description: "Add your proficiency bonus to the d20 roll for counterspell and dispel magic ability checks. You have advantage on saving throws against spells and resistance to damage dealt by spells. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Spell Aegis",
      description: "When you succeed on a saving throw against a spell, you can use your reaction to reflect the spell back at the caster, using the original spell save DC and attack bonus. The caster becomes the new target and must make any applicable saving throws. You can use this feature a number of times equal to your INT modifier (minimum 1) per long rest.",
    },
  },
  {
    id: "sage-conjuration",
    name: "School of Conjuration",
    level9Feature: {
      name: "Minor Conjuration + Benign Transposition",
      description: "As an action, conjure a nonmagical object (of a form you have seen) up to 3 ft on a side and up to 10 lbs, appearing in your hand or an unoccupied space within 10 ft; it vanishes after 1 hour or if it takes or deals damage. Benign Transposition: As an action, teleport up to 30 ft to an unoccupied space, or swap positions with a willing Small or Medium creature within 30 ft (1/long rest; recharges when you cast a conjuration spell of 1st level or higher).",
    },
    level13Feature: {
      name: "Focused Conjuration + Durable Summons",
      description: "Your concentration cannot be broken by damage while you are concentrating on a conjuration spell. Any creature you summon or create with a conjuration spell gains 30 temporary hit points when it appears. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Planar Anchor",
      description: "Creatures you conjure with conjuration spells persist until killed, dismissed, or you finish a long rest (they no longer require concentration). Additionally, once per short rest, if a conjured creature is reduced to 0 HP, you can resummon it at half its maximum HP as a bonus action. Only one non-concentration conjuration can persist at a time.",
    },
  },
  {
    id: "sage-divination",
    name: "School of Divination",
    level9Feature: {
      name: "Portent + Expert Divination",
      description: "After a long rest, roll 2d20 and record the results. You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of your Portent rolls — you must choose to do so before the roll, and you can replace only one roll per turn. Expert Divination: When you cast a divination spell of 2nd level or higher using a spell slot, regain one expended spell slot of a level lower than the spell cast (maximum 5th level).",
    },
    level13Feature: {
      name: "The Third Eye + Greater Portent",
      description: "Once per short rest (lasting 1 hour), choose one: darkvision 60 ft, ethereal sight 60 ft (see into the Ethereal Plane), the ability to read any language, or the ability to see invisible creatures and objects within 10 ft. Your Portent now uses 3d20 instead of 2d20. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Fated Convergence",
      description: "When you use a Portent die, you can treat it as any value from 1 to 20 instead of the recorded result. You can use this feature a number of times equal to your INT modifier (minimum 1) per long rest. Unused Portent dice are not consumed.",
    },
  },
  {
    id: "sage-enchantment",
    name: "School of Enchantment",
    level9Feature: {
      name: "Hypnotic Gaze + Instinctive Charm",
      description: "Hypnotic Gaze: As an action, choose one creature within 5 ft; it must succeed on a WIS save or be charmed and incapacitated with a speed of 0. On subsequent turns, you can use your action to maintain this effect, extending its duration until the end of your next turn. The effect ends if you move more than 5 ft away, the creature can neither see nor hear you, or the creature takes damage. This is not concentration — you can maintain a concentration spell simultaneously. Instinctive Charm: When a creature within 30 ft makes an attack roll against you, use your reaction to divert it. The attacker makes a WIS save; on a failed save, it must target the creature closest to it (not including you or itself) within range instead. If the attacker succeeds, you can't use this feature against it again until you finish a long rest.",
    },
    level13Feature: {
      name: "Split Enchantment + Alter Memories",
      description: "When you cast an enchantment spell targeting one creature, you may target a second creature within range at no additional cost. When a creature is charmed by you, you can make it unaware of your magical influence. Once before the charm ends, you can use your action to make the creature forget up to 1 + your CHA modifier hours of time it was charmed (minimum 1 hour) — the creature must succeed on an INT save against your spell save DC to resist. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Thrall of the Mind",
      description: "Creatures targeted by your enchantment spells have disadvantage on the initial saving throw AND on saving throws to end the effect early. Additionally, you can maintain concentration on two enchantment spells simultaneously (if you fail a concentration check, you choose which spell ends).",
    },
  },
  {
    id: "sage-evocation",
    name: "School of Evocation",
    level9Feature: {
      name: "Sculpt Spells + Potent Cantrip",
      description: "When you cast an evocation spell that affects other creatures you can see, choose a number of them equal to 1 + the spell's level; they automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save. Creatures that succeed on a saving throw against one of your cantrips still take half of the cantrip's damage.",
    },
    level13Feature: {
      name: "Empowered Evocation + Overchannel",
      description: "Add your INT modifier to one damage roll of any evocation spell you cast. Overchannel: When you cast a wizard spell of 1st–5th level that deals damage, deal maximum damage instead of rolling. The first use per long rest causes no harm. Each subsequent use before finishing a long rest deals necrotic damage per spell level equal to 2d12 for the second use, 3d12 for the third use, and so on (+1d12 per spell level per additional use). This damage ignores resistance and immunity. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Cataclysm",
      description: "The first time you use Overchannel each long rest, you take no necrotic damage. Subsequent uses still deal necrotic damage as normal. Additionally, the necrotic damage scaling from repeat uses does not increase beyond 2d12 per spell level.",
    },
  },
  {
    id: "sage-illusion",
    name: "School of Illusion",
    level9Feature: {
      name: "Improved Minor Illusion + Malleable Illusions",
      description: "When you cast minor illusion, you can create both a sound and an image simultaneously. When you cast an illusion spell with a duration of 1 minute or longer, you can use your action to change the nature of that illusion (within the spell's normal parameters), provided you can see the illusion.",
    },
    level13Feature: {
      name: "Illusory Self + Illusory Reality",
      description: "Illusory Self: Reaction (1/short rest) — when a creature attacks you, create a duplicate that causes the attack to miss. Illusory Reality: Choose one inanimate, nonmagical object within an illusion created by a spell of 1st level or higher; as a bonus action, make it physically real for up to 1 minute. The object can't deal damage or directly harm a creature. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Phantasmal Persistence",
      description: "One illusion spell you cast no longer requires concentration (one at a time; casting a new persistent illusion ends the previous one). Additionally, Illusory Reality's duration extends to 10 minutes, and the real object can deal damage (up to 2d10 per round, your choice of type).",
    },
  },
  {
    id: "sage-necromancy",
    name: "School of Necromancy",
    level9Feature: {
      name: "Grim Harvest + Undead Thralls",
      description: "Grim Harvest: Once per turn when you kill one or more creatures with a spell of 1st level or higher, regain HP equal to twice the spell's level (three times for necromancy spells). You don't gain this benefit for killing constructs or undead. Undead Thralls: When you cast animate dead, create one additional skeleton or zombie. Your undead gain your proficiency bonus to weapon damage rolls and a bonus to their maximum HP equal to your Fatebound level.",
    },
    level13Feature: {
      name: "Inured to Undeath + Command Undead",
      description: "You gain resistance to necrotic damage and your maximum HP cannot be reduced. Command Undead: As an action, target an undead creature within 60 ft; it makes a CHA save or becomes friendly and obeys your commands. Undead with INT 8+ make the save with advantage. Undead with INT 12+ can repeat the save at the end of every hour until they succeed and break free. The effect ends if you use this feature again. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Dread Sovereign",
      description: "Undead targeted by Command Undead have disadvantage on the saving throw regardless of their INT score, and do not receive repeated saves. Additionally, undead under your control deal an extra 1d8 necrotic damage on all attacks.",
    },
  },
  {
    id: "sage-transmutation",
    name: "School of Transmutation",
    level9Feature: {
      name: "Transmuter's Stone",
      description: "Spend 8 hours crafting a Transmuter's Stone that grants its holder one of the following benefits (your choice when created): darkvision 60 ft, +10 ft to walking speed (while unencumbered), proficiency in CON saves, or resistance to acid, cold, fire, lightning, or thunder damage (your choice). When you cast a transmutation spell of 1st level or higher, you can change the benefit granted. The stone vanishes when you die or craft a new one.",
    },
    level13Feature: {
      name: "Master Transmuter + Shapechanger",
      description: "You can destroy your Transmuter's Stone as an action to produce one of the following effects: transmute up to 5 cubic feet of nonmagical material into another nonmagical substance; remove all curses, diseases, and poisons affecting a creature you touch and restore that creature to its maximum hit point total; cast raise dead without a spell slot or material components; or restore a creature's youth by up to 3d10 years. You must then craft a new stone. Shapechanger: Cast polymorph on yourself without expending a spell slot (1/short rest), transforming into a beast of CR 1 or lower. The transformation requires concentration as normal. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Living Transmutation",
      description: "Once per long rest, you can transform into a beast or monstrosity with a CR equal to half your Fatebound level (rounded down) for up to 1 hour. You retain your mental ability scores, personality, alignment, and class features. This does not require concentration and is separate from Wild Shape.",
    },
  },
  {
    id: "sage-war-magic",
    name: "War Magic",
    level9Feature: {
      name: "Arcane Deflection + Tactical Wit",
      description: "Arcane Deflection: As a reaction when you are hit by an attack or fail a saving throw, gain +2 AC against that attack or +4 to that save. If you use this feature, you can only cast cantrips on your next turn. Add your INT modifier to initiative rolls.",
    },
    level13Feature: {
      name: "Durable Magic + Deflecting Shroud",
      description: "While you are concentrating on a spell, you gain a +2 bonus to AC and all saving throws. When you use Arcane Deflection, arcane energy crackles outward — up to 3 creatures of your choice within 60 ft take force damage equal to half your Fatebound level. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Arcane Tempest",
      description: "When you use Arcane Deflection, you can also cast one cantrip as part of the same reaction. Additionally, using Arcane Deflection no longer restricts you to cantrips on your next turn — you may cast spells normally.",
    },
  },
  {
    id: "sage-bladesinging",
    name: "Bladesinging",
    level9Feature: {
      name: "Bladesong",
      description: "As a bonus action, enter your Bladesong for 1 minute (proficiency bonus/long rest, requires light armor or no armor and one hand free). While active: add your INT modifier to your AC, gain +10 ft speed, gain advantage on Dexterity (Acrobatics) checks, and add your INT modifier to concentration saving throws.",
    },
    level13Feature: {
      name: "Song of Defense + Extra Attack",
      description: "Song of Defense: While your Bladesong is active, when you take damage, you can expend a spell slot as a reaction to reduce the damage by 5 × the slot level. Additionally, you gain Extra Attack (you can attack twice when you take the Attack action). This Extra Attack replaces (does not stack with) any other Extra Attack feature you have. When you use it, you can replace one attack with a cantrip. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Song of Victory",
      description: "While Bladesinging, add your INT modifier to melee weapon damage rolls.",
    },
  },
  {
    id: "sage-chronurgy",
    name: "Chronurgy Magic",
    level9Feature: {
      name: "Chronal Shift + Temporal Awareness",
      description: "Chronal Shift: When a creature you can see within 30 ft makes an attack roll, ability check, or saving throw, use your reaction to force a reroll — the creature must use the new result. You can use this feature after seeing the roll but before any effects occur (2/long rest). Add your INT modifier to initiative rolls.",
    },
    level13Feature: {
      name: "Momentary Stasis + Arcane Abeyance",
      description: "Momentary Stasis: As an action (INT mod/long rest), target a creature of Large or smaller within 60 ft; it must succeed on a CON save or be incapacitated and have a speed of 0 until the end of your next turn or until it takes damage. Arcane Abeyance: When you cast a spell of 4th level or lower, store it in a mote of light (1/short rest); any creature holding the mote can use an action to cast the stored spell (no components, uses your spell save DC), and the mote vanishes after 1 hour. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "Convergent Future",
      description: "As a reaction when you or a creature you can see within 60 ft makes an attack roll, ability check, or saving throw, declare it an automatic success or failure (before or after the roll). Each use causes 1 level of exhaustion (removable only by a long rest). There is no per-rest limit — you may use this feature as many times as you can bear the exhaustion cost.",
    },
  },
  {
    id: "sage-scribes",
    name: "Order of Scribes",
    level9Feature: {
      name: "Awakened Spellbook + Manifest Mind",
      description: "Your spellbook awakens. When you cast a prepared wizard spell, you can replace its damage type with a damage type used by another spell in your spellbook. When casting a ritual, it takes the spell's normal casting time (not +10 minutes). Manifest Mind: As a bonus action, conjure a Tiny spectral spellbook in an unoccupied space within 60 ft; you can cast prepared wizard spells through the manifested mind as though you were in its space (proficiency bonus times per long rest), and you can use its senses as a bonus action. As a bonus action, you can move the mind up to 30 ft. The mind stops manifesting if it moves more than 300 ft from you.",
    },
    level13Feature: {
      name: "Master Scrivener",
      description: "After each long rest, touch your spellbook to a blank piece of parchment to inscribe one 1st- or 2nd-level spell as a temporary scroll. When cast from the scroll, the spell counts as one level higher than normal. The scroll vanishes after casting or your next long rest. Additionally, the gold and time required to craft spell scrolls is halved when using your spellbook. Learn 2 additional spells from any class's spell list (these count as Wizard spells for you).",
    },
    level17Feature: {
      name: "One with the Word",
      description: "As a reaction when you take damage that would kill you while your Manifest Mind is active, you dismiss the mind — it absorbs the blow and you drop to 1 HP instead. Roll 3d6; your spellbook temporarily loses spells of your choice with a combined spell level equal to that roll or higher. Those spells are unavailable until you finish 1d6 long rests (1/long rest).",
    },
  },
];
