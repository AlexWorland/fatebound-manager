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

export type PactBoon = "blade" | "chain" | "tome" | "talisman";

export interface EldritchInvocation {
  id: number;
  name: string;
  effect: string;
  pactRequired?: PactBoon;
  requiresEldritchBlast?: boolean;
  requiresHexOrCurse?: boolean;
}

/** Full 53-entry invocation table from the supplementary document.
 *  Fate's Selection (d100; on 54-100, reroll). Duplicates rerolled.
 *  Pact Boon prerequisites apply — reroll pact-dependent invocations you can't use.
 *  Level prerequisites are waived. */
export const ELDRITCH_INVOCATIONS: EldritchInvocation[] = [
  { id: 1, name: "Agonizing Blast", effect: "Add CHA mod to eldritch blast damage (each beam).", requiresEldritchBlast: true },
  { id: 2, name: "Armor of Shadows", effect: "Cast mage armor on self at will, without a spell slot." },
  { id: 3, name: "Ascendant Step", effect: "Cast levitate on self at will, without a spell slot." },
  { id: 4, name: "Aspect of the Moon", effect: "You no longer need sleep; you remain conscious during a 4-hour trance that replaces sleep.", pactRequired: "tome" },
  { id: 5, name: "Beast Speech", effect: "Cast speak with animals at will, without a spell slot." },
  { id: 6, name: "Beguiling Influence", effect: "Proficiency in Deception and Persuasion." },
  { id: 7, name: "Bewitching Whispers", effect: "Cast compulsion once using a warlock spell slot (1/long rest)." },
  { id: 8, name: "Book of Ancient Secrets", effect: "Record ritual spells in your Book of Shadows from any class's spell list; cast any recorded ritual.", pactRequired: "tome" },
  { id: 9, name: "Chains of Carceri", effect: "Cast hold monster at will — targeting celestials, fiends, or elementals only — without a spell slot.", pactRequired: "chain" },
  { id: 10, name: "Cloak of Flies", effect: "Bonus action: surround yourself with a 5-ft aura of flies. Creatures starting their turn in the aura take CHA mod poison damage. Advantage on Intimidation, disadvantage on other CHA checks. Lasts until dismissed or incapacitated (1/short rest)." },
  { id: 11, name: "Devil's Sight", effect: "See normally in magical and nonmagical darkness to 120 ft." },
  { id: 12, name: "Dreadful Word", effect: "Cast confusion once using a warlock spell slot (1/long rest)." },
  { id: 13, name: "Eldritch Mind", effect: "Advantage on CON saves to maintain concentration on a spell." },
  { id: 14, name: "Eldritch Sight", effect: "Cast detect magic at will, without a spell slot." },
  { id: 15, name: "Eldritch Smite", effect: "On hit with your Pact weapon, expend a spell slot: +1d8 force damage per slot level (minimum 2d8), and knock the target prone if Huge or smaller.", pactRequired: "blade" },
  { id: 16, name: "Eldritch Spear", effect: "Eldritch blast range increases to 300 ft.", requiresEldritchBlast: true },
  { id: 17, name: "Eyes of the Rune Keeper", effect: "Read all writing." },
  { id: 18, name: "Far Scribe", effect: "A new page appears in your Book of Shadows. Creatures who write their name on it can be contacted via sending (uses = prof bonus/long rest).", pactRequired: "tome" },
  { id: 19, name: "Fiendish Vigor", effect: "Cast false life on self at will, without a spell slot." },
  { id: 20, name: "Gaze of Two Minds", effect: "Touch a willing humanoid and perceive through its senses (use your action each turn to maintain)." },
  { id: 21, name: "Ghostly Gaze", effect: "As an action, gain the ability to see through solid objects to 30 ft for 1 minute (1/short rest)." },
  { id: 22, name: "Gift of the Depths", effect: "Breathe underwater and gain a swim speed equal to your walking speed. Cast water breathing once without a spell slot (1/long rest)." },
  { id: 23, name: "Gift of the Protectors", effect: "A page in your Book of Shadows allows creatures (up to prof bonus) who inscribe their name to drop to 1 HP instead of 0 HP, once per long rest each.", pactRequired: "tome" },
  { id: 24, name: "Grasp of Hadar", effect: "Once per turn, when you hit with eldritch blast, pull the target 10 ft closer to you.", requiresEldritchBlast: true },
  { id: 25, name: "Improved Pact Weapon", effect: "Your Pact weapon gains +1 to attack and damage rolls, can serve as a spellcasting focus, and can take the form of a shortbow, longbow, light crossbow, or heavy crossbow.", pactRequired: "blade" },
  { id: 26, name: "Investment of the Chain Master", effect: "Your familiar's attacks use your spell attack bonus and deal extra damage = prof bonus. As a reaction when your familiar takes damage, grant it resistance to that damage.", pactRequired: "chain" },
  { id: 27, name: "Lance of Lethargy", effect: "Once per turn, when you hit with eldritch blast, reduce the target's speed by 10 ft until the end of your next turn.", requiresEldritchBlast: true },
  { id: 28, name: "Lifedrinker", effect: "When you hit with your Pact weapon, deal extra necrotic damage = CHA mod (minimum 1).", pactRequired: "blade" },
  { id: 29, name: "Maddening Hex", effect: "Bonus action: deal CHA mod psychic damage to your cursed target and each creature of your choice within 5 ft of it.", requiresHexOrCurse: true },
  { id: 30, name: "Mask of Many Faces", effect: "Cast disguise self at will, without a spell slot." },
  { id: 31, name: "Master of Myriad Forms", effect: "Cast alter self at will, without a spell slot." },
  { id: 32, name: "Minions of Chaos", effect: "Cast conjure elemental once using a warlock spell slot (1/long rest)." },
  { id: 33, name: "Mire the Mind", effect: "Cast slow once using a warlock spell slot (1/long rest)." },
  { id: 34, name: "Misty Visions", effect: "Cast silent image at will, without a spell slot." },
  { id: 35, name: "One with Shadows", effect: "In dim light or darkness, become invisible as an action (until you move, attack, or cast a spell)." },
  { id: 36, name: "Otherworldly Leap", effect: "Cast jump on self at will, without a spell slot." },
  { id: 37, name: "Relentless Hex", effect: "Bonus action: teleport up to 30 ft to an unoccupied space within 5 ft of your cursed target.", requiresHexOrCurse: true },
  { id: 38, name: "Repelling Blast", effect: "When you hit with eldritch blast, push the target up to 10 ft away from you.", requiresEldritchBlast: true },
  { id: 39, name: "Sculptor of Flesh", effect: "Cast polymorph once using a warlock spell slot (1/long rest)." },
  { id: 40, name: "Shroud of Shadow", effect: "Cast invisibility at will, without a spell slot." },
  { id: 41, name: "Sign of Ill Omen", effect: "Cast bestow curse once using a warlock spell slot (1/long rest)." },
  { id: 42, name: "Thief of Five Fates", effect: "Cast bane once using a warlock spell slot (1/long rest)." },
  { id: 43, name: "Thirsting Blade", effect: "Attack twice when you take the Attack action with your Pact weapon.", pactRequired: "blade" },
  { id: 44, name: "Tomb of Levistus", effect: "Reaction when you take damage: entomb yourself in ice and gain 10 temp HP per Fatebound level. You are incapacitated and have vulnerability to fire until end of your next turn (1/short rest)." },
  { id: 45, name: "Trickster's Escape", effect: "Cast freedom of movement on self once without a spell slot (1/long rest)." },
  { id: 46, name: "Undying Servitude", effect: "Cast animate dead once without a spell slot (1/long rest)." },
  { id: 47, name: "Visions of Distant Realms", effect: "Cast arcane eye at will, without a spell slot." },
  { id: 48, name: "Voice of the Chain Master", effect: "Communicate telepathically with your familiar and perceive through its senses while on the same plane.", pactRequired: "chain" },
  { id: 49, name: "Whispers of the Grave", effect: "Cast speak with dead at will, without a spell slot." },
  { id: 50, name: "Witch Sight", effect: "See the true form of any shapechanger or creature concealed by illusion or transmutation magic within 30 ft." },
  { id: 51, name: "Bond of the Talisman", effect: "While someone else is wearing your talisman, you can use your action to teleport to the talisman's location (within 10 ft, same plane). The wearer can also teleport to you. Prof bonus uses/long rest total (shared).", pactRequired: "talisman" },
  { id: 52, name: "Protection of the Talisman", effect: "When the wearer of your talisman fails a saving throw, they can add a d4 to the roll (prof bonus uses/long rest).", pactRequired: "talisman" },
  { id: 53, name: "Rebuke of the Talisman", effect: "When the wearer of your talisman is hit by an attacker, deal psychic damage to the attacker equal to your prof bonus and push it 10 ft away.", pactRequired: "talisman" },
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
