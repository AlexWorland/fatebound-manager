import type { SubclassEntry } from "@/types/forms";

export const SAGE_SUBCLASSES: SubclassEntry[] = [
  {
    id: "sage-abjuration",
    name: "School of Abjuration",
    level9Feature: {
      name: "Arcane Ward + Projected Ward",
      description: "When you cast an abjuration spell, create or recharge a ward with maximum HP equal to twice your Fatebound level + INT modifier. The ward absorbs incoming damage to you first; recharge it by 2\u00d7 the spell level whenever you cast an abjuration. Projected Ward: Reaction \u2014 transfer the ward's protection to a creature within 30 ft until the start of your next turn.",
    },
    level13Feature: {
      name: "Improved Abjuration + Spell Resistance",
      description: "Add your proficiency bonus to the d20 roll for counterspell and dispel magic ability checks. You have advantage on saving throws against spells and resistance to damage dealt by spells.",
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
      description: "As an action, conjure a nonmagical object up to 3 ft on a side and up to 10 lbs; it vanishes after 1 hour. Benign Transposition: As an action, teleport up to 30 ft to an unoccupied space, or swap positions with a willing Small or Medium creature within 30 ft (1/long rest; recharges when you cast a conjuration spell of 1st level or higher).",
    },
    level13Feature: {
      name: "Focused Conjuration + Durable Summons",
      description: "Your concentration cannot be broken by damage while you are concentrating on a conjuration spell. Beasts and monstrosities you conjure with spells gain 30 temporary hit points when they appear.",
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
      description: "After a long rest, roll 2d20 and record the results. Once per round, replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of your Portent rolls (your choice which result to use). Expert Divination: When you cast a divination spell of 2nd level or higher, regain one expended spell slot of a level lower than the spell cast.",
    },
    level13Feature: {
      name: "The Third Eye + Greater Portent",
      description: "Once per short rest (lasting 1 hour), choose one: darkvision 60 ft, ethereal sight 60 ft (see into the Ethereal Plane), the ability to read any language, or the ability to see invisible creatures and objects within 10 ft. Your Portent now uses 3d20 instead of 2d20.",
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
      description: "Hypnotic Gaze: As an action, choose one creature within 5 ft; it must succeed on a WIS save or be charmed and incapacitated with a speed of 0 while you maintain it (concentration; creature resaves each turn, ends if you move 5+ ft away). Instinctive Charm: When a creature within 30 ft attacks you, use your reaction to redirect the attack to another creature within 30 ft (WIS save to resist; 1/long rest).",
    },
    level13Feature: {
      name: "Split Enchantment + Alter Memories",
      description: "When you cast an enchantment spell targeting one creature, you may target a second creature within range at no additional cost. When a creature is charmed by you, you can make it unable to remember the time it was charmed (WIS save at disadvantage to resist losing the memory).",
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
      description: "When you cast an evocation spell, choose a number of creatures equal to 1 + the spell's level; they automatically succeed on their saving throws and take no damage from the spell. Creatures that succeed on a saving throw against one of your cantrips still take half of the cantrip's damage.",
    },
    level13Feature: {
      name: "Empowered Evocation + Overchannel",
      description: "Add your INT modifier to one damage roll of any evocation spell you cast. Overchannel: When you cast a wizard spell of 1st\u20133rd level, deal maximum damage instead of rolling. Each additional use before a long rest deals 2d12 necrotic damage per spell level to you (this damage cannot be reduced in any way).",
    },
    level17Feature: {
      name: "Cataclysm",
      description: "Overchannel now works on spells up to 5th level (instead of 3rd). The first time you use Overchannel per long rest, you take no necrotic damage. Subsequent uses still deal 2d12 necrotic per spell level.",
    },
  },
  {
    id: "sage-illusion",
    name: "School of Illusion",
    level9Feature: {
      name: "Improved Minor Illusion + Malleable Illusions",
      description: "When you cast minor illusion, you can create both a sound and an image simultaneously. You can change the nature of an active illusion you created \u2014 altering its appearance, sound, or movement \u2014 as an action.",
    },
    level13Feature: {
      name: "Illusory Self + Illusory Reality",
      description: "Illusory Self: Reaction (1/short rest) \u2014 when a creature attacks you, create a duplicate that causes the attack to miss. Illusory Reality: Choose one non-living, non-damaging object within an illusion you've created; as a bonus action, make it physically real for up to 1 minute.",
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
      description: "Grim Harvest: Once per turn when you kill a creature with a spell of 1st level or higher, regain HP equal to twice the spell's level (three times for necromancy spells). Undead Thralls: When you cast animate dead, create one additional skeleton or zombie. Your undead gain your proficiency bonus to weapon damage rolls and a bonus to their maximum HP equal to your Fatebound level.",
    },
    level13Feature: {
      name: "Inured to Undeath + Command Undead",
      description: "You gain resistance to necrotic damage and your maximum HP cannot be reduced. Command Undead: As an action, target an undead creature within 60 ft; it makes a CHA save or obeys your commands for 24 hours (undead with INT 8+ make saves with advantage, and repeat the save at the end of each long rest).",
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
      description: "Spend 8 hours crafting a Transmuter's Stone that grants its holder one of the following benefits (your choice when created): darkvision 60 ft, +10 ft to walking speed, proficiency in CON saves, or resistance to one damage type of your choice. When you cast a transmutation spell of 1st level or higher, you can change the benefit granted. The stone vanishes when you die or craft a new one.",
    },
    level13Feature: {
      name: "Master Transmuter + Shapechanger",
      description: "You can destroy your Transmuter's Stone as an action to produce one of the following effects: transmute up to 5 cubic feet of nonmagical material into another nonmagical substance; remove all curses, diseases, and poisons affecting a creature you touch; cast raise dead without a spell slot or material components; or restore a creature's youth by up to 3d10 years. You must then craft a new stone. Shapechanger: Cast polymorph on yourself without expending a spell slot or concentration (1/short rest).",
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
      description: "While you are concentrating on a spell, you gain a +2 bonus to AC and all saving throws. When you use Arcane Deflection, arcane energy crackles outward \u2014 up to 3 creatures of your choice within 60 ft take force damage equal to half your INT modifier (minimum 1).",
    },
    level17Feature: {
      name: "Arcane Tempest",
      description: "When you use Arcane Deflection, you can also cast one cantrip as part of the same reaction. Additionally, using Arcane Deflection no longer restricts you to cantrips on your next turn \u2014 you may cast spells normally.",
    },
  },
  {
    id: "sage-bladesinging",
    name: "Bladesinging",
    level9Feature: {
      name: "Bladesong",
      description: "As a bonus action, enter your Bladesong for 1 minute (proficiency bonus/long rest, requires light armor or no armor and one hand free). While active: add your INT modifier to your AC, gain +10 ft speed, add your INT modifier to Acrobatics checks, and add your INT modifier to concentration saving throws.",
    },
    level13Feature: {
      name: "Song of Defense + Extra Attack",
      description: "While Bladesinging, when you take damage, you can expend a spell slot as a reaction to reduce the damage by 5 \u00d7 the slot level. Additionally, you gain Extra Attack (you can attack twice when you take the Attack action), and you can replace one of those attacks with a cantrip. This Extra Attack replaces (does not stack with) any other Extra Attack feature you have.",
    },
    level17Feature: {
      name: "Song of Victory",
      description: "While Bladesinging, add your INT modifier to melee weapon damage rolls. Your Bladesong's AC bonus also applies to saving throws against spells.",
    },
  },
  {
    id: "sage-chronurgy",
    name: "Chronurgy Magic",
    level9Feature: {
      name: "Chronal Shift + Temporal Awareness",
      description: "Chronal Shift: When a creature you can see within 30 ft makes an attack roll, ability check, or saving throw, use your reaction to force a reroll \u2014 you choose which result stands (2/long rest). Add your INT modifier to initiative rolls.",
    },
    level13Feature: {
      name: "Momentary Stasis + Arcane Abeyance",
      description: "Momentary Stasis: As an action (INT mod/long rest), target a creature of Large or smaller within 60 ft; it must succeed on a CON save or be incapacitated and have a speed of 0 until the end of your next turn. Arcane Abeyance: When you cast a spell of 4th level or lower, store it in a mote of light (1/short rest); any creature holding the mote can use an action to cast the stored spell (no components, uses your spell save DC), and the mote vanishes after 1 hour.",
    },
    level17Feature: {
      name: "Convergent Future",
      description: "As a reaction when a creature you can see within 60 ft makes an attack roll, ability check, or saving throw, declare it an automatic success or failure. You then gain one level of exhaustion that cannot be removed except by a long rest (1/long rest without triggering exhaustion).",
    },
  },
  {
    id: "sage-scribes",
    name: "Order of Scribes",
    level9Feature: {
      name: "Awakened Spellbook + Manifest Mind",
      description: "Your spellbook awakens. When you cast a prepared wizard spell, you can replace its damage type with a damage type used by another spell in your spellbook. When casting a ritual, it takes the spell's normal casting time (not +10 minutes). Manifest Mind: Conjure a Tiny spectral spellbook in an unoccupied space within 60 ft; you can cast any spell through the manifested mind as though you were in its space, and you can use its senses as a bonus action (proficiency bonus/long rest). At level 13+, the range extends to 300 ft.",
    },
    level13Feature: {
      name: "Master Scrivener",
      description: "Once per long rest, transcribe a spell into a temporary spell scroll using your Awakened Spellbook; it must be a 1st- or 2nd-level spell, and casting it costs no spell slot. Manifest Mind activations now recharge on a short rest and the spectral book can be sent up to 1 mile away.",
    },
    level17Feature: {
      name: "One with the Word",
      description: "If you would be killed, your Awakened Spellbook absorbs the blow \u2014 you drop to 1 HP instead and permanently lose 3d6 levels of spells from your spellbook (1/long rest). Additionally, your Manifest Mind can now cast spells of any level (not just cantrips) from its space.",
    },
  },
];
