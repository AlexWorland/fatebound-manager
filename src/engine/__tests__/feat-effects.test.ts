import { describe, it, expect } from "vitest";
import {
  getFeatEffects,
  getFeatAttackModifiers,
  getFeatDamageModifiers,
} from "../feat-effects";

// Feat IDs from TABLE_D_FEATS
const ALERT_ID = 4;
const DUAL_WIELDER_ID = 18;
const GREAT_WEAPON_MASTER_ID = 35;
const SHARPSHOOTER_ID = 70;
const SAVAGE_ATTACKER_ID = 66;
const TOUGH_ID = 85;
const WAR_CASTER_ID = 86;
const SENTINEL_ID = 68;
const POLEARM_MASTER_ID = 61;
const SHIELD_MASTER_ID = 71;
const LUCKY_ID = 46;
const RESILIENT_ID = 63;
const UNKNOWN_ID = 9999;
const ABILITY_SCORE_IMPROVEMENT_ID = 2; // no mechanical effect entry
const LINGUIST_ID = 45; // no mechanical effect entry

describe("getFeatEffects", () => {
  it("returns empty array for empty input", () => {
    expect(getFeatEffects([])).toEqual([]);
  });

  it("returns empty array for unknown feat IDs", () => {
    expect(getFeatEffects([UNKNOWN_ID])).toEqual([]);
  });

  it("returns empty array for feats without mapped effects", () => {
    // ASI and Linguist have no combat mechanical effects in the map
    expect(getFeatEffects([ABILITY_SCORE_IMPROVEMENT_ID, LINGUIST_ID])).toEqual([]);
  });

  it("returns correct effect for Alert (id: 4)", () => {
    const effects = getFeatEffects([ALERT_ID]);
    expect(effects).toHaveLength(1);
    expect(effects[0].featId).toBe(ALERT_ID);
    expect(effects[0].featName).toBe("Alert");
    expect(effects[0].attackRollModifier).toBe("+5 to initiative rolls");
    expect(effects[0].specialNote).toBeTruthy();
  });

  it("returns correct effect for Dual Wielder (id: 18)", () => {
    const effects = getFeatEffects([DUAL_WIELDER_ID]);
    expect(effects).toHaveLength(1);
    expect(effects[0].featId).toBe(DUAL_WIELDER_ID);
    expect(effects[0].featName).toBe("Dual Wielder");
    expect(effects[0].acBonus).toBe(1);
  });

  it("returns correct effect for Great Weapon Master (id: 35)", () => {
    const effects = getFeatEffects([GREAT_WEAPON_MASTER_ID]);
    expect(effects).toHaveLength(1);
    expect(effects[0].featId).toBe(GREAT_WEAPON_MASTER_ID);
    expect(effects[0].featName).toBe("Great Weapon Master");
    expect(effects[0].attackBonus).toBe(-5);
    expect(effects[0].damageBonus).toBe(10);
  });

  it("returns correct effect for Sharpshooter (id: 70)", () => {
    const effects = getFeatEffects([SHARPSHOOTER_ID]);
    expect(effects).toHaveLength(1);
    expect(effects[0].featId).toBe(SHARPSHOOTER_ID);
    expect(effects[0].attackBonus).toBe(-5);
    expect(effects[0].damageBonus).toBe(10);
  });

  it("returns correct effect for Savage Attacker (id: 66)", () => {
    const effects = getFeatEffects([SAVAGE_ATTACKER_ID]);
    expect(effects).toHaveLength(1);
    expect(effects[0].specialNote).toBeTruthy();
  });

  it("returns correct effect for Tough (id: 85)", () => {
    const effects = getFeatEffects([TOUGH_ID]);
    expect(effects).toHaveLength(1);
    expect(effects[0].specialNote).toContain("hit points");
  });

  it("returns correct effect for War Caster (id: 86)", () => {
    const effects = getFeatEffects([WAR_CASTER_ID]);
    expect(effects).toHaveLength(1);
    expect(effects[0].specialNote).toContain("concentration");
  });

  it("returns multiple effects for multiple feat IDs", () => {
    const effects = getFeatEffects([ALERT_ID, DUAL_WIELDER_ID, SENTINEL_ID]);
    expect(effects).toHaveLength(3);
    const ids = effects.map((e) => e.featId);
    expect(ids).toContain(ALERT_ID);
    expect(ids).toContain(DUAL_WIELDER_ID);
    expect(ids).toContain(SENTINEL_ID);
  });

  it("ignores unknown IDs in a mixed list", () => {
    const effects = getFeatEffects([ALERT_ID, UNKNOWN_ID, TOUGH_ID]);
    expect(effects).toHaveLength(2);
    const ids = effects.map((e) => e.featId);
    expect(ids).toContain(ALERT_ID);
    expect(ids).toContain(TOUGH_ID);
    expect(ids).not.toContain(UNKNOWN_ID);
  });

  it("includes featId and featName on every returned effect", () => {
    const effects = getFeatEffects([LUCKY_ID, POLEARM_MASTER_ID, SHIELD_MASTER_ID]);
    for (const effect of effects) {
      expect(effect.featId).toBeTypeOf("number");
      expect(effect.featName).toBeTypeOf("string");
      expect(effect.featName.length).toBeGreaterThan(0);
    }
  });
});

describe("getFeatAttackModifiers", () => {
  it("returns zero bonus and empty notes for empty list", () => {
    const result = getFeatAttackModifiers([]);
    expect(result.attackBonus).toBe(0);
    expect(result.notes).toEqual([]);
  });

  it("returns zero bonus for feats without attack modifiers", () => {
    const result = getFeatAttackModifiers([TOUGH_ID, LUCKY_ID]);
    expect(result.attackBonus).toBe(0);
  });

  it("does NOT auto-apply GWM -5 penalty (it is optional)", () => {
    const result = getFeatAttackModifiers([GREAT_WEAPON_MASTER_ID]);
    expect(result.attackBonus).toBe(0);
    expect(result.notes.some((n) => n.includes("Great Weapon Master"))).toBe(true);
    expect(result.notes.some((n) => n.includes("Optional"))).toBe(true);
  });

  it("does NOT auto-apply Sharpshooter -5 penalty (it is optional)", () => {
    const result = getFeatAttackModifiers([SHARPSHOOTER_ID]);
    expect(result.attackBonus).toBe(0);
    expect(result.notes.some((n) => n.includes("Sharpshooter"))).toBe(true);
    expect(result.notes.some((n) => n.includes("Optional"))).toBe(true);
  });

  it("includes Alert initiative note in notes", () => {
    const result = getFeatAttackModifiers([ALERT_ID]);
    expect(result.attackBonus).toBe(0);
    expect(result.notes.some((n) => n.includes("Alert"))).toBe(true);
    expect(result.notes.some((n) => n.includes("+5"))).toBe(true);
  });

  it("accumulates notes from multiple feats", () => {
    const result = getFeatAttackModifiers([ALERT_ID, GREAT_WEAPON_MASTER_ID, SHARPSHOOTER_ID]);
    expect(result.notes.length).toBeGreaterThanOrEqual(3);
  });
});

describe("getFeatDamageModifiers", () => {
  it("returns zero bonus and empty notes for empty list", () => {
    const result = getFeatDamageModifiers([]);
    expect(result.damageBonus).toBe(0);
    expect(result.notes).toEqual([]);
  });

  it("returns zero bonus for feats without damage bonuses", () => {
    const result = getFeatDamageModifiers([ALERT_ID, TOUGH_ID, RESILIENT_ID]);
    expect(result.damageBonus).toBe(0);
  });

  it("does NOT auto-apply GWM +10 bonus (it is optional)", () => {
    const result = getFeatDamageModifiers([GREAT_WEAPON_MASTER_ID]);
    expect(result.damageBonus).toBe(0);
    expect(result.notes.some((n) => n.includes("Great Weapon Master"))).toBe(true);
    expect(result.notes.some((n) => n.includes("Optional"))).toBe(true);
  });

  it("does NOT auto-apply Sharpshooter +10 bonus (it is optional)", () => {
    const result = getFeatDamageModifiers([SHARPSHOOTER_ID]);
    expect(result.damageBonus).toBe(0);
    expect(result.notes.some((n) => n.includes("Sharpshooter"))).toBe(true);
  });

  it("includes +10 damage note for GWM", () => {
    const result = getFeatDamageModifiers([GREAT_WEAPON_MASTER_ID]);
    expect(result.notes.some((n) => n.includes("+10"))).toBe(true);
  });

  it("accumulates notes from multiple feats with damage effects", () => {
    const result = getFeatDamageModifiers([GREAT_WEAPON_MASTER_ID, SHARPSHOOTER_ID]);
    expect(result.notes.length).toBeGreaterThanOrEqual(2);
  });
});
