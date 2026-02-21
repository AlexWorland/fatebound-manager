import type { SubclassEntry } from "@/types/forms";

export const FERAL_SUBCLASSES: SubclassEntry[] = [
  {
    id: "feral-open-hand",
    name: "Way of the Open Hand",
    level9Feature: {
      name: "Open Hand Technique",
      description: "When you hit with a Flurry of Blows attack, impose one additional effect at no Ki cost: target makes a DEX save or falls prone; target makes a STR save or is pushed 15 ft away; or target cannot take reactions until the end of your next turn.",
    },
    level13Feature: {
      name: "Wholeness of Body + Tranquility",
      description: "Wholeness of Body: Heal yourself for three times your Fatebound level as an action (1/long rest). Tranquility: After completing a long rest, gain the benefit of a sanctuary spell (WIS-based DC) that lasts until your next long rest or until you attack or cast a spell.",
    },
    level17Feature: {
      name: "Quivering Palm",
      description: "Spend 3 Ki when you hit with an unarmed strike; set up imperceptible vibrations in the creature's body. At any point within the next number of days equal to your Fatebound level, you can use your action to end those vibrations: the creature makes a CON save or drops to 0 HP; on a success, it takes 10d10 necrotic damage. Only one creature can be affected at a time.",
    },
  },
  {
    id: "feral-shadow",
    name: "Way of Shadow",
    level9Feature: {
      name: "Shadow Arts + Shadow Step",
      description: "Spend 2 Ki to cast darkness, darkvision, pass without trace, or silence (no components). You know minor illusion as an at-will effect. Shadow Step: Bonus action teleport up to 60 ft between areas of dim light or darkness; you have advantage on the first melee attack you make this turn after teleporting.",
    },
    level13Feature: {
      name: "Cloak of Shadows",
      description: "As an action while in dim light or darkness, become invisible. The invisibility ends if you attack, cast a spell, or enter an area of bright light.",
    },
    level17Feature: {
      name: "Opportunist",
      description: "When a creature within 5 ft of you is hit by an attack made by a creature other than you, use your reaction to make a melee attack against that creature.",
    },
  },
  {
    id: "feral-four-elements",
    name: "Way of the Four Elements",
    level9Feature: {
      name: "Elemental Disciplines",
      description: "Learn 2 Elemental Disciplines (roll 2d6, rerolling duplicates: 1-Fangs of the Fire Snake, 2-Fist of Unbroken Air, 3-Rush of the Gale Spirits, 4-Shape the Flowing River, 5-Sweeping Cinder Strike, 6-Water Whip). Each discipline lets you spend Ki to produce magical effects; disciplines that replicate spells use your WIS modifier.",
    },
    level13Feature: {
      name: "Additional Discipline + Reduced Cost",
      description: "Learn a 3rd Elemental Discipline (roll d8, rerolling duplicates: 1-Fangs of the Fire Snake, 2-Fist of Unbroken Air, 3-Rush of the Gale Spirits, 4-Shape the Flowing River, 5-Sweeping Cinder Strike, 6-Water Whip, 7-Clench of the North Wind [6th-level prereq discipline, Hold Person for 3 Ki], 8-Ride the Wind [11th-level prereq discipline, Fly for 4 Ki]). You gain access to disciplines that replicate 4th-level spells (such as Ride the Wind).",
    },
    level17Feature: {
      name: "Master of Elements",
      description: "Learn a 4th Elemental Discipline from the full discipline list (including high-level options such as Wave of Rolling Earth, which requires spending 6 Ki to cast wall of stone).",
    },
  },
  {
    id: "feral-drunken-master",
    name: "Way of the Drunken Master",
    level9Feature: {
      name: "Drunken Technique + Tipsy Sway",
      description: "When you use Flurry of Blows, you gain the benefit of the Disengage action and your movement speed increases by 10 ft for that turn. Tipsy Sway: You can stand up from prone using only 5 ft of movement. When a creature misses you with a melee attack, spend 1 Ki as a reaction to redirect that attack to a different creature within 5 ft of you (other than the attacker).",
    },
    level13Feature: {
      name: "Drunkard's Luck",
      description: "Spend 2 Ki when you make an ability check, attack roll, or saving throw with disadvantage to cancel the disadvantage.",
    },
    level17Feature: {
      name: "Intoxicated Frenzy",
      description: "When you use Flurry of Blows, you can make up to 3 additional attacks with it (up to a total of 5 Flurry of Blows attacks), provided that each Flurry of Blows attack targets a different creature this turn.",
    },
  },
  {
    id: "feral-kensei",
    name: "Way of the Kensei",
    level9Feature: {
      name: "Kensei Weapons + Agile Parry",
      description: "Choose 2 weapons as Kensei weapons (one melee, one ranged); gain proficiency with them, and they count as monk weapons. Agile Parry: If you make an unarmed strike as part of the Attack action while holding a Kensei weapon, you gain +2 AC until the start of your next turn. Kensei's Shot: Bonus action to add 1d4 damage to all ranged Kensei attacks until the end of this turn.",
    },
    level13Feature: {
      name: "Deft Strike + One with the Blade + Sharpen the Blade",
      description: "Deft Strike: Spend 1 Ki when you hit with a Kensei weapon to deal additional damage equal to your Martial Arts die. One with the Blade: Your Kensei weapons are considered magical. Sharpen the Blade: Bonus action, spend 1–3 Ki to grant your Kensei weapon a +1 to +3 bonus on attack and damage rolls for 1 minute, or until you use this feature again.",
    },
    level17Feature: {
      name: "Unerring Accuracy",
      description: "Once per turn, when you miss with a monk weapon or Kensei weapon attack, you may reroll the attack die and use the new result.",
    },
  },
  {
    id: "feral-sun-soul",
    name: "Way of the Sun Soul",
    level9Feature: {
      name: "Radiant Sun Bolt + Searing Arc Strike",
      description: "You can make a ranged spell attack (30 ft range) as one of your attacks, dealing 1d4 + DEX modifier radiant damage (this scales with your Martial Arts die); spend 1 Ki to make two additional bolt attacks as a bonus action. After taking the Attack action, spend 2 Ki to cast burning hands as a bonus action (WIS-based).",
    },
    level13Feature: {
      name: "Searing Sunburst",
      description: "Action, hurl a orb of light (150 ft range, 20-ft sphere). Creatures in the sphere make a CON save (DC 8 + prof + WIS mod) or take 2d6 radiant damage (no damage on success); spend 1–3 Ki to add 2d6 radiant per Ki spent.",
    },
    level17Feature: {
      name: "Sun Shield",
      description: "You emit bright light in a 30-ft radius at will (bonus action to activate or deactivate). When a creature hits you with a melee attack, you can use your reaction to deal 5 + WIS modifier radiant damage to the attacker.",
    },
  },
  {
    id: "feral-mercy",
    name: "Way of Mercy",
    level9Feature: {
      name: "Hands of Healing + Hands of Harm",
      description: "Healing: Spend 1 Ki as an action to touch a creature and restore hit points equal to 1 Martial Arts die + WIS modifier. When you use Flurry of Blows, you can replace one unarmed strike with this healing touch at no additional Ki cost. Harm: When you hit with an unarmed strike, spend 1 Ki to deal an additional 1 Martial Arts die + WIS modifier necrotic damage.",
    },
    level13Feature: {
      name: "Physician's Touch",
      description: "Hands of Healing can also end one disease or one of the following conditions: blinded, deafened, paralyzed, poisoned, or stunned. Hands of Harm also applies the poisoned condition to the target until the end of your next turn.",
    },
    level17Feature: {
      name: "Hand of Ultimate Mercy",
      description: "Spend 5 Ki as an action to touch a creature that died within the past 24 hours. It returns to life with 4d10 + WIS modifier hit points, and all conditions affecting it are removed. 1/long rest.",
    },
  },
  {
    id: "feral-astral-self",
    name: "Way of the Astral Self",
    level9Feature: {
      name: "Arms of the Astral Self",
      description: "Bonus action, spend 1 Ki: summon spectral arms for 10 minutes. When you summon the arms, each creature of your choice that you can see within 10 ft must succeed on a DEX save (DC 8 + prof + WIS mod) or take force damage equal to two rolls of your Martial Arts die. The arms give your unarmed strikes a reach of 10 ft, deal force damage using your Martial Arts die + WIS modifier (instead of STR or DEX), and count as weapons for Extra Attack.",
    },
    level13Feature: {
      name: "Visage of the Astral Self",
      description: "Spend 1 Ki (bonus action): manifest a spectral visage for 10 minutes, gaining darkvision 120 ft, advantage on Insight and Intimidation checks, and the ability to speak telepathically to one creature within 60 ft you can see (no shared language required).",
    },
    level17Feature: {
      name: "Awakened Astral Self",
      description: "Spend 5 Ki as a bonus action for 10 minutes: gain a +2 bonus to AC, and when you use Extra Attack to attack twice, you can instead attack three times if all attacks are made with your astral arms. When your astral arms and visage are both active, you can also use your reaction to reduce incoming acid, cold, fire, force, lightning, or thunder damage by 1d10 + WIS modifier (Deflect Energy), and your Astral Self arms deal extra force damage equal to one Martial Arts die on attacks.",
    },
  },
  {
    id: "feral-ascendant-dragon",
    name: "Way of the Ascendant Dragon",
    level9Feature: {
      name: "Draconic Disciple",
      description: "Your unarmed strikes can deal your choice of acid, cold, fire, lightning, or poison damage (chosen when you roll). You can replace one attack in the Attack action with a breath weapon: a 20-ft cone or 30-ft line (5 ft wide). Creatures in the area make a DEX save (DC 8 + prof + WIS mod) or take damage equal to two rolls of your Martial Arts die of your chosen type (half on save). Uses = prof bonus/long rest. Draconic Presence: If you fail a CHA (Intimidation) or CHA (Persuasion) check, you can use your reaction to reroll it, tapping into your draconic presence. Once this turns a failure into a success, you can't use it again until you finish a long rest.",
    },
    level13Feature: {
      name: "Wings Unfurled + Aspect of the Wyrm",
      description: "Wings Unfurled: When you use Step of the Wind, you gain a flying speed equal to your walking speed until the end of your turn (uses = prof bonus/long rest; spend 2 Ki when you have no uses remaining). Aspect of the Wyrm: Bonus action, spend 3 Ki: create a 10-ft aura for 1 minute (concentration). Choose frightened (creatures that enter the aura or start their turn there must succeed on a WIS save or become frightened for 1 minute) or resistance (you and your allies gain resistance to your chosen damage type while in the aura).",
    },
    level17Feature: {
      name: "Ascendant Aspect",
      description: "You gain blindsight out to 10 ft. When you use your Breath of the Dragon, you can spend 1 Ki to augment it: the exhalation becomes a 60-ft cone or 90-ft line (5 ft wide), and each creature in the area takes damage equal to four rolls of your Martial Arts die on a failed save, or half on a success. Explosive Fury: When you activate your Aspect of the Wyrm aura, each creature in that aura must succeed on a DEX save (DC 8 + prof + WIS mod) or take 3d10 damage of your chosen type.",
    },
  },
  {
    id: "feral-long-death",
    name: "Way of the Long Death",
    level9Feature: {
      name: "Touch of Death + Hour of Reaping",
      description: "Touch of Death: When you reduce a creature within 5 ft of you to 0 HP, you gain temporary hit points equal to your WIS modifier + your Fatebound level. Hour of Reaping: Action: each creature within 30 ft that can see you makes a WIS save (DC 8 + prof + WIS mod) or becomes frightened until the end of your next turn.",
    },
    level13Feature: {
      name: "Mastery of Death",
      description: "When you are reduced to 0 hit points, spend 1 Ki to immediately drop to 1 hit point instead (no action required).",
    },
    level17Feature: {
      name: "Touch of the Long Death",
      description: "Action, spend 1–10 Ki: a creature within 5 ft of you takes 2d10 necrotic damage per Ki spent. The creature makes a CON save (DC 8 + prof + WIS mod); on a success it takes half damage.",
    },
  },
];;
