export type DamageType = "bludgeoning" | "piercing" | "slashing";
export type WeaponCategory = "simple" | "martial";
export type WeaponRange = "melee" | "ranged";

export interface Weapon {
  name: string;
  category: WeaponCategory;
  range: WeaponRange;
  damage: string; // e.g. "1d8", "2d6", "1" (for blowgun)
  damageType: DamageType;
  properties: string[]; // e.g. ["finesse", "light", "thrown (20/60)"]
  weight: number; // lbs
  cost: string; // e.g. "25 gp"
}

export interface CharacterWeapon {
  id: string; // UUID
  weaponName: string; // references WEAPONS[].name
  customName?: string;
  magicBonus: number; // default 0
  bonusDamage?: string; // dice notation e.g. "1d6"
  bonusDamageType?: string;
  notes?: string;
  isEquipped: boolean;
}
