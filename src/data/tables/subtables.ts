export interface FightingStyle {
  id: number;
  name: string;
  effect: string;
}

export const FIGHTING_STYLES: FightingStyle[] = [
  { id: 1, name: "Archery", effect: "+2 to ranged attack rolls" },
  { id: 2, name: "Defense", effect: "+1 AC while wearing armor" },
  { id: 3, name: "Dueling", effect: "+2 damage with one-handed melee, no other weapons" },
  { id: 4, name: "Great Weapon Fighting", effect: "Reroll 1s and 2s on two-handed damage dice" },
  { id: 5, name: "Protection", effect: "Reaction: disadvantage on attack vs. ally within 5 ft (requires shield)" },
  { id: 6, name: "Two-Weapon Fighting", effect: "Add ability mod to off-hand damage" },
];

export interface WildcardWeapon {
  id: number;
  name: string;
  damage: string;
  properties: string;
}

export const WILDCARD_MARTIAL_WEAPONS: WildcardWeapon[] = [
  { id: 1, name: "Longsword", damage: "1d8 slashing", properties: "Versatile (1d10)" },
  { id: 2, name: "Greatsword", damage: "2d6 slashing", properties: "Heavy, Two-Handed" },
  { id: 3, name: "Rapier", damage: "1d8 piercing", properties: "Finesse" },
  { id: 4, name: "Longbow", damage: "1d8 piercing", properties: "Ammunition (150/600), Heavy, Two-Handed" },
  { id: 5, name: "Warhammer", damage: "1d8 bludgeoning", properties: "Versatile (1d10)" },
  { id: 6, name: "Glaive", damage: "1d10 slashing", properties: "Heavy, Reach, Two-Handed" },
  { id: 7, name: "Hand Crossbow", damage: "1d6 piercing", properties: "Ammunition (30/120), Light, Loading" },
  { id: 8, name: "Shortsword", damage: "1d6 piercing", properties: "Finesse, Light" },
  { id: 9, name: "Battleaxe", damage: "1d8 slashing", properties: "Versatile (1d10)" },
  { id: 10, name: "Heavy Crossbow", damage: "1d10 piercing", properties: "Ammunition (100/400), Heavy, Loading, Two-Handed" },
  { id: 11, name: "Maul", damage: "2d6 bludgeoning", properties: "Heavy, Two-Handed" },
  { id: 12, name: "Whip", damage: "1d4 slashing", properties: "Finesse, Reach" },
];

export interface EldritchInvocation {
  id: number;
  name: string;
}

/** Placeholder for the full 50-entry invocation table from the supplementary document.
 *  The invocation table uses Fate's Selection (d100; on 51-100, reroll).
 *  Pact Boon prerequisites apply — reroll pact-dependent invocations you can't use.
 *  Level prerequisites are waived. */
export const ELDRITCH_INVOCATIONS: EldritchInvocation[] = [
  { id: 1, name: "Agonizing Blast" },
  { id: 2, name: "Armor of Shadows" },
  { id: 3, name: "Ascendant Step" },
  { id: 4, name: "Beast Speech" },
  { id: 5, name: "Beguiling Influence" },
  { id: 6, name: "Bewitching Whispers" },
  { id: 7, name: "Bond of the Talisman" },
  { id: 8, name: "Book of Ancient Secrets" },
  { id: 9, name: "Chains of Carceri" },
  { id: 10, name: "Cloak of Flies" },
  { id: 11, name: "Devil's Sight" },
  { id: 12, name: "Dreadful Word" },
  { id: 13, name: "Eldritch Mind" },
  { id: 14, name: "Eldritch Sight" },
  { id: 15, name: "Eldritch Smite" },
  { id: 16, name: "Eyes of the Rune Keeper" },
  { id: 17, name: "Far Scribe" },
  { id: 18, name: "Fiendish Vigor" },
  { id: 19, name: "Gaze of Two Minds" },
  { id: 20, name: "Ghostly Gaze" },
  { id: 21, name: "Gift of the Depths" },
  { id: 22, name: "Gift of the Ever-Living Ones" },
  { id: 23, name: "Gift of the Protectors" },
  { id: 24, name: "Grasp of Hadar" },
  { id: 25, name: "Improved Pact Weapon" },
  { id: 26, name: "Investment of the Chain Master" },
  { id: 27, name: "Lance of Lethargy" },
  { id: 28, name: "Lifedrinker" },
  { id: 29, name: "Mask of Many Faces" },
  { id: 30, name: "Master of Myriad Forms" },
  { id: 31, name: "Minions of Chaos" },
  { id: 32, name: "Mire the Mind" },
  { id: 33, name: "Misty Visions" },
  { id: 34, name: "One with Shadows" },
  { id: 35, name: "Otherworldly Leap" },
  { id: 36, name: "Protection of the Talisman" },
  { id: 37, name: "Rebuke of the Talisman" },
  { id: 38, name: "Relentless Hex" },
  { id: 39, name: "Repelling Blast" },
  { id: 40, name: "Sculptor of Flesh" },
  { id: 41, name: "Shroud of Shadow" },
  { id: 42, name: "Sign of Ill Omen" },
  { id: 43, name: "Thief of Five Fates" },
  { id: 44, name: "Thirsting Blade" },
  { id: 45, name: "Tomb of Levistus" },
  { id: 46, name: "Trickster's Escape" },
  { id: 47, name: "Undying Servitude" },
  { id: 48, name: "Visions of Distant Realms" },
  { id: 49, name: "Whispers of the Grave" },
  { id: 50, name: "Witch Sight" },
];

export interface BattleMasterManeuver {
  id: number;
  name: string;
  effect: string;
}

export const BATTLE_MASTER_MANEUVERS: BattleMasterManeuver[] = [
  { id: 1, name: "Trip Attack", effect: "+die damage; STR save or prone" },
  { id: 2, name: "Riposte", effect: "Reaction on miss; attack + die damage" },
  { id: 3, name: "Precision Attack", effect: "+die to attack roll" },
  { id: 4, name: "Menacing Attack", effect: "+die damage; WIS save or frightened" },
  { id: 5, name: "Commander's Strike", effect: "Forgo attack; ally reaction attack + die" },
  { id: 6, name: "Disarming Attack", effect: "+die damage; STR save or drop item" },
  { id: 7, name: "Evasive Footwork", effect: "+die to AC while moving" },
  { id: 8, name: "Feinting Attack", effect: "Bonus action: advantage + die damage" },
  { id: 9, name: "Goading Attack", effect: "+die damage; WIS save or disadvantage on non-you attacks" },
  { id: 10, name: "Lunging Attack", effect: "+5 ft reach + die damage" },
  { id: 11, name: "Maneuvering Attack", effect: "+die damage; ally moves half speed (no OA)" },
  { id: 12, name: "Pushing Attack", effect: "+die damage; STR save or pushed 15 ft" },
];

export interface MetamagicOption {
  id: number;
  name: string;
  cost: string;
  effect: string;
}

export const METAMAGIC_OPTIONS: MetamagicOption[] = [
  { id: 1, name: "Careful Spell", cost: "1 SP", effect: "Chosen creatures auto-succeed on save" },
  { id: 2, name: "Distant Spell", cost: "1 SP", effect: "Double range (touch \u2192 30 ft)" },
  { id: 3, name: "Empowered Spell", cost: "1 SP", effect: "Reroll up to your spellcasting ability modifier damage dice (minimum 1)" },
  { id: 4, name: "Extended Spell", cost: "1 SP", effect: "Double duration (max 24 hr)" },
  { id: 5, name: "Heightened Spell", cost: "3 SP", effect: "One target has disadvantage on first save" },
  { id: 6, name: "Quickened Spell", cost: "2 SP", effect: "Casting time \u2192 bonus action" },
  { id: 7, name: "Subtle Spell", cost: "1 SP", effect: "No V/S components" },
  { id: 8, name: "Twinned Spell", cost: "Level SP", effect: "Target second creature with single-target spell" },
];

export interface ClericDomain {
  id: number;
  name: string;
  channelDivinity: string;
}

export const CLERIC_DOMAINS: ClericDomain[] = [
  { id: 1, name: "Life", channelDivinity: "Preserve Life \u2014 Restore HP = 5 \u00d7 Fatebound level, distributed among creatures within 30 ft (no creature above half max HP)" },
  { id: 2, name: "Light", channelDivinity: "Radiance of the Dawn \u2014 30-ft radius: CON save or 2d10 + level radiant damage (half on save). Dispels magical darkness." },
  { id: 3, name: "War", channelDivinity: "Guided Strike \u2014 +10 to one attack roll" },
  { id: 4, name: "Tempest", channelDivinity: "Destructive Wrath \u2014 Maximize lightning or thunder damage roll" },
  { id: 5, name: "Knowledge", channelDivinity: "Knowledge of the Ages \u2014 Proficiency in one skill or tool for 10 minutes" },
  { id: 6, name: "Trickery", channelDivinity: "Invoke Duplicity \u2014 Create illusory duplicate within 30 ft (1 min, concentration). Advantage on attacks vs. creatures within 5 ft of duplicate." },
  { id: 7, name: "Nature", channelDivinity: "Charm Animals and Plants \u2014 Beasts/plants within 30 ft: WIS save or charmed 1 min" },
  { id: 8, name: "Forge", channelDivinity: "Artisan's Blessing \u2014 1-hour ritual to craft a weapon or armor (consumes 100 gp metal)" },
];
