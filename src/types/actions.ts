import type { CharacterWeapon, Weapon } from "@/types/equipment";

export type ActionCategory =
  | "ALL"
  | "ATTACK"
  | "ACTION"
  | "BONUS_ACTION"
  | "REACTION"
  | "OTHER"
  | "LIMITED_USE";

export interface ComputedAttack {
  weaponId: string;
  displayName: string;
  weaponType: string; // e.g. "simple melee"
  range: string;
  attackBonus: number;
  damage: string;
  damageType: string;
  bonusDamage?: string;
  bonusDamageType?: string;
  notes: string;
  weapon: CharacterWeapon;
  baseWeapon: Weapon;
}
