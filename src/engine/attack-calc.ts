import type { AbilityScores } from "@/types/character";
import type { AbilityScore } from "@/types/forms";
import type { Weapon, CharacterWeapon } from "@/types/equipment";
import type { ComputedAttack } from "@/types/actions";
import { WEAPONS } from "@/data/weapons";

export function getAbilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Returns effective ability scores after applying an ability swap (Fate Attunement). */
export function getEffectiveScores(
  scores: AbilityScores,
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null | undefined
): AbilityScores {
  if (!abilitySwap) return scores;
  return {
    ...scores,
    [abilitySwap.score1]: scores[abilitySwap.score2],
    [abilitySwap.score2]: scores[abilitySwap.score1],
  };
}

/** Parse "NdM" or "N" damage strings into { count, sides }. */
export function parseDamage(damage: string): { count: number; sides: number } {
  if (damage.includes("d")) {
    const [countStr, sidesStr] = damage.split("d");
    return { count: parseInt(countStr, 10), sides: parseInt(sidesStr, 10) };
  }
  return { count: parseInt(damage, 10), sides: 0 };
}

export function hasProperty(weapon: Weapon, prop: string): boolean {
  return weapon.properties.some((p) => p === prop || p.startsWith(prop));
}

export function isFinesse(weapon: Weapon): boolean {
  return hasProperty(weapon, "finesse");
}

export function isThrown(weapon: Weapon): boolean {
  return hasProperty(weapon, "thrown");
}

export function isTwoHanded(weapon: Weapon): boolean {
  return hasProperty(weapon, "two-handed");
}

export function isLight(weapon: Weapon): boolean {
  return hasProperty(weapon, "light");
}

export function isHeavy(weapon: Weapon): boolean {
  return hasProperty(weapon, "heavy");
}

export function isVersatile(weapon: Weapon): boolean {
  return hasProperty(weapon, "versatile");
}

/** Returns the versatile damage string (e.g. "1d10") from properties. */
export function getVersatileDamage(weapon: Weapon): string {
  const prop = weapon.properties.find((p) => p.startsWith("versatile ("));
  if (!prop) return weapon.damage;
  const match = prop.match(/versatile \((.+)\)/);
  return match ? match[1] : weapon.damage;
}

/** Determines which ability score drives attack rolls for a weapon. */
export function getAttackAbility(
  weapon: Weapon,
  scores: AbilityScores
): { ability: AbilityScore; mod: number } {
  if (weapon.range === "ranged") {
    if (isFinesse(weapon)) {
      const strMod = getAbilityMod(scores.STR);
      const dexMod = getAbilityMod(scores.DEX);
      const ability = strMod >= dexMod ? "STR" : "DEX";
      return { ability, mod: Math.max(strMod, dexMod) };
    }
    return { ability: "DEX", mod: getAbilityMod(scores.DEX) };
  }
  if (isFinesse(weapon)) {
    const strMod = getAbilityMod(scores.STR);
    const dexMod = getAbilityMod(scores.DEX);
    const ability = strMod >= dexMod ? "STR" : "DEX";
    return { ability, mod: Math.max(strMod, dexMod) };
  }
  if (isThrown(weapon)) {
    return { ability: "STR", mod: getAbilityMod(scores.STR) };
  }
  return { ability: "STR", mod: getAbilityMod(scores.STR) };
}

/** Fighting style bonus to attack roll. */
export function getAttackStyleBonus(weapon: Weapon, fightingStyle: string | undefined): number {
  if (fightingStyle === "Archery" && weapon.range === "ranged") return 2;
  return 0;
}

/** Fighting style bonus to damage. */
export function getDamageStyleBonus(
  weapon: Weapon,
  fightingStyle: string | undefined,
  isOffHand: boolean,
  abilityMod: number,
  useVersatile: boolean
): number {
  if (fightingStyle === "Dueling" && weapon.range === "melee" && !isLight(weapon) && !isTwoHanded(weapon) && !useVersatile) {
    return 2;
  }
  if (fightingStyle === "Two-Weapon Fighting" && isOffHand) {
    return abilityMod;
  }
  return 0;
}

export function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** Compute attack entries for all equipped weapons plus Unarmed Strike. */
export function computeAttacks(
  equippedWeapons: CharacterWeapon[],
  abilityScores: AbilityScores,
  proficiencyBonus: number,
  abilitySwap?: { score1: AbilityScore; score2: AbilityScore } | null,
  fightingStyle?: string
): ComputedAttack[] {
  const effectiveScores = getEffectiveScores(abilityScores, abilitySwap);
  const attacks: ComputedAttack[] = [];

  for (const cw of equippedWeapons) {
    if (!cw.isEquipped) continue;
    const baseWeapon = WEAPONS.find((w) => w.name === cw.weaponName);
    if (!baseWeapon) continue;

    const { mod: abilityMod } = getAttackAbility(baseWeapon, effectiveScores);
    const styleBonus = getAttackStyleBonus(baseWeapon, fightingStyle);
    const attackBonus = abilityMod + proficiencyBonus + styleBonus + (cw.magicBonus || 0);

    const rangeStr = baseWeapon.range === "ranged"
      ? (baseWeapon.properties.find(p => p.startsWith("range"))?.replace("range ", "") ?? "ranged")
      : (baseWeapon.properties.find(p => p.startsWith("thrown"))?.replace("thrown ", "") ?? "5 ft.");

    attacks.push({
      weaponId: cw.id,
      displayName: cw.customName || cw.weaponName,
      weaponType: `${baseWeapon.category} ${baseWeapon.range}`,
      range: rangeStr,
      attackBonus,
      damage: baseWeapon.damage,
      damageType: baseWeapon.damageType,
      bonusDamage: cw.bonusDamage,
      bonusDamageType: cw.bonusDamageType,
      notes: cw.notes || "",
      weapon: cw,
      baseWeapon,
    });
  }

  // Always include Unarmed Strike
  attacks.push({
    weaponId: "unarmed",
    displayName: "Unarmed Strike",
    weaponType: "melee",
    range: "5 ft.",
    attackBonus: getAbilityMod(effectiveScores.STR) + proficiencyBonus,
    damage: "1",
    damageType: "bludgeoning",
    notes: "",
    weapon: { id: "unarmed", weaponName: "Unarmed Strike", magicBonus: 0, isEquipped: true },
    baseWeapon: { name: "Unarmed Strike", category: "simple", range: "melee", damage: "1", damageType: "bludgeoning", properties: [], weight: 0, cost: "—" },
  });

  return attacks;
}
