import { describe, it, expect } from "vitest";
import {
  getAbilityMod,
  getEffectiveScores,
  parseDamage,
  isFinesse,
  isThrown,
  isTwoHanded,
  isLight,
  isHeavy,
  isVersatile,
  getVersatileDamage,
  getAttackAbility,
  getAttackStyleBonus,
  getDamageStyleBonus,
  formatMod,
  computeAttacks,
} from "../attack-calc";
import type { AbilityScores } from "@/types/character";
import type { Weapon } from "@/types/equipment";

const DEFAULT_SCORES: AbilityScores = {
  STR: 16, // +3
  DEX: 14, // +2
  CON: 12, // +1
  INT: 10, // +0
  WIS: 8,  // -1
  CHA: 13, // +1
};

const RAPIER: Weapon = {
  name: "Rapier",
  category: "martial",
  range: "melee",
  damage: "1d8",
  damageType: "piercing",
  properties: ["finesse"],
  weight: 2,
  cost: "25 gp",
};

const LONGBOW: Weapon = {
  name: "Longbow",
  category: "martial",
  range: "ranged",
  damage: "1d8",
  damageType: "piercing",
  properties: ["ammunition (150/600)", "heavy", "two-handed"],
  weight: 2,
  cost: "50 gp",
};

const LONGSWORD: Weapon = {
  name: "Longsword",
  category: "martial",
  range: "melee",
  damage: "1d8",
  damageType: "slashing",
  properties: ["versatile (1d10)"],
  weight: 3,
  cost: "15 gp",
};

const SHORTSWORD: Weapon = {
  name: "Shortsword",
  category: "martial",
  range: "melee",
  damage: "1d6",
  damageType: "piercing",
  properties: ["finesse", "light"],
  weight: 2,
  cost: "10 gp",
};

const HANDAXE: Weapon = {
  name: "Handaxe",
  category: "simple",
  range: "melee",
  damage: "1d6",
  damageType: "slashing",
  properties: ["light", "thrown (20/60)"],
  weight: 2,
  cost: "5 gp",
};

describe("getAbilityMod", () => {
  it("returns correct modifier for standard scores", () => {
    expect(getAbilityMod(10)).toBe(0);
    expect(getAbilityMod(11)).toBe(0);
    expect(getAbilityMod(16)).toBe(3);
    expect(getAbilityMod(8)).toBe(-1);
    expect(getAbilityMod(20)).toBe(5);
    expect(getAbilityMod(1)).toBe(-5);
  });
});

describe("getEffectiveScores", () => {
  it("returns original scores when no swap", () => {
    expect(getEffectiveScores(DEFAULT_SCORES, null)).toBe(DEFAULT_SCORES);
    expect(getEffectiveScores(DEFAULT_SCORES, undefined)).toBe(DEFAULT_SCORES);
  });

  it("swaps the two specified scores", () => {
    const swapped = getEffectiveScores(DEFAULT_SCORES, { score1: "STR", score2: "DEX" });
    expect(swapped.STR).toBe(14);
    expect(swapped.DEX).toBe(16);
    expect(swapped.CON).toBe(DEFAULT_SCORES.CON);
  });
});

describe("parseDamage", () => {
  it("parses dice notation", () => {
    expect(parseDamage("1d8")).toEqual({ count: 1, sides: 8 });
    expect(parseDamage("2d6")).toEqual({ count: 2, sides: 6 });
  });

  it("parses fixed damage", () => {
    expect(parseDamage("1")).toEqual({ count: 1, sides: 0 });
  });
});

describe("property checkers", () => {
  it("detects finesse", () => {
    expect(isFinesse(RAPIER)).toBe(true);
    expect(isFinesse(LONGBOW)).toBe(false);
  });

  it("detects thrown", () => {
    expect(isThrown(HANDAXE)).toBe(true);
    expect(isThrown(RAPIER)).toBe(false);
  });

  it("detects two-handed", () => {
    expect(isTwoHanded(LONGBOW)).toBe(true);
    expect(isTwoHanded(RAPIER)).toBe(false);
  });

  it("detects light", () => {
    expect(isLight(SHORTSWORD)).toBe(true);
    expect(isLight(LONGSWORD)).toBe(false);
  });

  it("detects heavy", () => {
    expect(isHeavy(LONGBOW)).toBe(true);
    expect(isHeavy(RAPIER)).toBe(false);
  });

  it("detects versatile", () => {
    expect(isVersatile(LONGSWORD)).toBe(true);
    expect(isVersatile(RAPIER)).toBe(false);
  });
});

describe("getVersatileDamage", () => {
  it("extracts versatile damage string", () => {
    expect(getVersatileDamage(LONGSWORD)).toBe("1d10");
  });

  it("returns base damage for non-versatile weapons", () => {
    expect(getVersatileDamage(RAPIER)).toBe("1d8");
  });
});

describe("getAttackAbility", () => {
  it("uses DEX for ranged weapons", () => {
    const result = getAttackAbility(LONGBOW, DEFAULT_SCORES);
    expect(result.ability).toBe("DEX");
    expect(result.mod).toBe(2);
  });

  it("uses higher of STR/DEX for finesse melee", () => {
    // STR 16 (+3) > DEX 14 (+2) → uses STR
    const result = getAttackAbility(RAPIER, DEFAULT_SCORES);
    expect(result.ability).toBe("STR");
    expect(result.mod).toBe(3);
  });

  it("uses DEX for finesse when DEX is higher", () => {
    const dexScores: AbilityScores = { ...DEFAULT_SCORES, STR: 10, DEX: 18 };
    const result = getAttackAbility(RAPIER, dexScores);
    expect(result.ability).toBe("DEX");
    expect(result.mod).toBe(4);
  });

  it("uses STR for thrown weapons", () => {
    const result = getAttackAbility(HANDAXE, DEFAULT_SCORES);
    expect(result.ability).toBe("STR");
    expect(result.mod).toBe(3);
  });

  it("uses STR for standard melee", () => {
    const result = getAttackAbility(LONGSWORD, DEFAULT_SCORES);
    expect(result.ability).toBe("STR");
    expect(result.mod).toBe(3);
  });
});

describe("getAttackStyleBonus", () => {
  it("adds +2 for Archery with ranged weapon", () => {
    expect(getAttackStyleBonus(LONGBOW, "Archery")).toBe(2);
  });

  it("returns 0 for Archery with melee weapon", () => {
    expect(getAttackStyleBonus(LONGSWORD, "Archery")).toBe(0);
  });

  it("returns 0 for no fighting style", () => {
    expect(getAttackStyleBonus(LONGBOW, undefined)).toBe(0);
  });
});

describe("getDamageStyleBonus", () => {
  it("adds +2 for Dueling with one-handed melee", () => {
    expect(getDamageStyleBonus(LONGSWORD, "Dueling", false, 3, false)).toBe(2);
  });

  it("no Dueling bonus when using versatile two-handed", () => {
    expect(getDamageStyleBonus(LONGSWORD, "Dueling", false, 3, true)).toBe(0);
  });

  it("no Dueling bonus for light weapons", () => {
    expect(getDamageStyleBonus(SHORTSWORD, "Dueling", false, 3, false)).toBe(0);
  });

  it("Two-Weapon Fighting adds ability mod for off-hand", () => {
    expect(getDamageStyleBonus(SHORTSWORD, "Two-Weapon Fighting", true, 3, false)).toBe(3);
  });

  it("returns 0 for no fighting style", () => {
    expect(getDamageStyleBonus(LONGSWORD, undefined, false, 3, false)).toBe(0);
  });
});

describe("formatMod", () => {
  it("formats positive numbers with +", () => {
    expect(formatMod(3)).toBe("+3");
    expect(formatMod(0)).toBe("+0");
  });

  it("formats negative numbers with -", () => {
    expect(formatMod(-1)).toBe("-1");
  });
});

describe("computeAttacks", () => {
  it("computes attack bonus with proficiency and ability mod", () => {
    const attacks = computeAttacks(
      [{ id: "1", weaponName: "Longsword", magicBonus: 0, isEquipped: true }],
      DEFAULT_SCORES,
      2
    );
    // STR +3, prof +2 = +5
    const longsword = attacks.find((a) => a.displayName === "Longsword");
    expect(longsword).toBeDefined();
    expect(longsword!.attackBonus).toBe(5);
  });

  it("adds magic bonus to attack", () => {
    const attacks = computeAttacks(
      [{ id: "1", weaponName: "Longsword", magicBonus: 2, isEquipped: true }],
      DEFAULT_SCORES,
      2
    );
    // STR +3, prof +2, magic +2 = +7
    const longsword = attacks.find((a) => a.displayName === "Longsword");
    expect(longsword!.attackBonus).toBe(7);
  });

  it("applies Archery fighting style to ranged weapons", () => {
    const attacks = computeAttacks(
      [{ id: "1", weaponName: "Longbow", magicBonus: 0, isEquipped: true }],
      DEFAULT_SCORES,
      2,
      null,
      "Archery"
    );
    // DEX +2, prof +2, Archery +2 = +6
    const longbow = attacks.find((a) => a.displayName === "Longbow");
    expect(longbow!.attackBonus).toBe(6);
  });

  it("applies ability swap before computing attacks", () => {
    const attacks = computeAttacks(
      [{ id: "1", weaponName: "Longsword", magicBonus: 0, isEquipped: true }],
      DEFAULT_SCORES,
      2,
      { score1: "STR", score2: "DEX" }
    );
    // After swap: STR=14 (+2), DEX=16 (+3). Longsword uses STR → +2, prof +2 = +4
    const longsword = attacks.find((a) => a.displayName === "Longsword");
    expect(longsword!.attackBonus).toBe(4);
  });

  it("skips unequipped weapons", () => {
    const attacks = computeAttacks(
      [{ id: "1", weaponName: "Longsword", magicBonus: 0, isEquipped: false }],
      DEFAULT_SCORES,
      2
    );
    expect(attacks.find((a) => a.displayName === "Longsword")).toBeUndefined();
  });

  it("uses custom name for display", () => {
    const attacks = computeAttacks(
      [{ id: "1", weaponName: "Longsword", customName: "Flameblade", magicBonus: 1, isEquipped: true }],
      DEFAULT_SCORES,
      2
    );
    const flame = attacks.find((a) => a.displayName === "Flameblade");
    expect(flame).toBeDefined();
  });

  it("always includes Unarmed Strike", () => {
    const attacks = computeAttacks([], DEFAULT_SCORES, 2);
    expect(attacks).toHaveLength(1);
    expect(attacks[0].displayName).toBe("Unarmed Strike");
    // STR +3, prof +2 = +5
    expect(attacks[0].attackBonus).toBe(5);
  });

  it("includes bonus damage info from CharacterWeapon", () => {
    const attacks = computeAttacks(
      [{ id: "1", weaponName: "Longsword", magicBonus: 0, isEquipped: true, bonusDamage: "1d6", bonusDamageType: "fire" }],
      DEFAULT_SCORES,
      2
    );
    const longsword = attacks.find((a) => a.displayName === "Longsword");
    expect(longsword!.bonusDamage).toBe("1d6");
    expect(longsword!.bonusDamageType).toBe("fire");
  });
});
