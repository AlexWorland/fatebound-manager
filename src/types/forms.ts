export type AbilityScore = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export type ArmorProficiency =
  | "heavy"
  | "medium"
  | "medium (nonmetal)"
  | "light"
  | "shields"
  | "shields (nonmetal)"
  | "none";

export type WeaponProficiency =
  | "martial"
  | "simple"
  | "martial_ranged"
  | "hand_crossbows"
  | "rapiers"
  | "shortswords"
  | "longswords"
  | "scimitars"
  | "daggers"
  | "quarterstaffs"
  | "light_crossbows"
  | "darts"
  | "slings";

export type HitDie = 6 | 8 | 10 | 12;

export interface Chassis {
  id: number;
  name: string;
  hitDie: HitDie;
  armorProficiencies: ArmorProficiency[];
  weaponProficiencies: WeaponProficiency[];
}

export interface PrimaryFeature {
  id: number;
  name: string;
  className: string;
  description: string;
  hasSpellcasting: boolean;
  spellList?: string;
  castingAbility?: AbilityScore;
  resourcePool?: string;
}

export interface DefensiveFeature {
  id: number;
  name: string;
  description: string;
  requiresSpellcasting?: boolean;
  incompatibleChassis?: number[];
}

export type StabilizedFormId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface StabilizedForm {
  id: StabilizedFormId;
  name: string;
  className: string;
  flavorText: string;
  hitDie: HitDie;
  armorProficiencies: ArmorProficiency[];
  weaponProficiencies: WeaponProficiency[];
  savingThrows: [AbilityScore, AbilityScore];
  dailySkillOptions: string[];
  baseFeatures: BaseFeature[];
  hasSpellcasting: boolean;
  spellList?: string;
  castingAbility?: AbilityScore;
  subclasses: SubclassEntry[];
}

export interface BaseFeature {
  name: string;
  description: string;
  resourceKey?: string;
  maxUses?: string;
}

export interface SubclassEntry {
  id: string;
  name: string;
  level9Feature: FeatureDescription;
  level13Feature: FeatureDescription;
  level17Feature: FeatureDescription;
}

export interface FeatureDescription {
  name: string;
  description: string;
}

export type FormType = "CHAOS" | "STABILIZED";
