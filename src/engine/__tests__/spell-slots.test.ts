import { describe, it, expect } from "vitest";
import {
  getSpellSlots,
  getShortRestRecoverySlot,
  getMysticArcanumLevels,
  getMysticArcanumLevel,
  getArcaneRecoveryBudget,
} from "../spell-slots";

describe("getSpellSlots", () => {
  it("level 1 has no spell slots", () => {
    const slots = getSpellSlots(1);
    expect(slots[1]).toBe(0);
    expect(slots[2]).toBe(0);
    expect(slots[3]).toBe(0);
    expect(slots[4]).toBe(0);
    expect(slots[5]).toBe(0);
  });

  it("level 2 has 2 first-level slots only", () => {
    const slots = getSpellSlots(2);
    expect(slots[1]).toBe(2);
    expect(slots[2]).toBe(0);
    expect(slots[3]).toBe(0);
    expect(slots[4]).toBe(0);
    expect(slots[5]).toBe(0);
  });

  it("level 5 has correct half-caster slots", () => {
    const slots = getSpellSlots(5);
    expect(slots[1]).toBe(4);
    expect(slots[2]).toBe(2);
    expect(slots[3]).toBe(0);
    expect(slots[4]).toBe(0);
    expect(slots[5]).toBe(0);
  });

  it("level 9 has 3rd-level slots", () => {
    const slots = getSpellSlots(9);
    expect(slots[1]).toBe(4);
    expect(slots[2]).toBe(3);
    expect(slots[3]).toBe(2);
    expect(slots[4]).toBe(0);
    expect(slots[5]).toBe(0);
  });

  it("level 20 has maximum half-caster slots", () => {
    const slots = getSpellSlots(20);
    expect(slots[1]).toBe(4);
    expect(slots[2]).toBe(3);
    expect(slots[3]).toBe(3);
    expect(slots[4]).toBe(3);
    expect(slots[5]).toBe(2);
  });
});

describe("getShortRestRecoverySlot (Hexer)", () => {
  it("level 3 recovers a 1st-level slot", () => {
    // 3 ÷ 3 = 1
    expect(getShortRestRecoverySlot(3)).toBe(1);
  });

  it("level 1 recovers a 1st-level slot (minimum 1)", () => {
    // 1 ÷ 3 = 0.33 → floor = 0, minimum 1
    expect(getShortRestRecoverySlot(1)).toBe(1);
  });

  it("level 9 recovers a 3rd-level slot", () => {
    // 9 ÷ 3 = 3
    expect(getShortRestRecoverySlot(9)).toBe(3);
  });

  it("level 6 recovers a 2nd-level slot", () => {
    // 6 ÷ 3 = 2
    expect(getShortRestRecoverySlot(6)).toBe(2);
  });

  it("level 20 recovers a 5th-level slot (highest with >0 slots)", () => {
    expect(getShortRestRecoverySlot(20)).toBe(5);
  });

  it("level 5 recovers a 2nd-level slot (highest slot level with slots)", () => {
    // Level 5 has slots [4, 2, 0, 0, 0] — highest with >0 is 2nd
    expect(getShortRestRecoverySlot(5)).toBe(2);
  });
});

describe("getMysticArcanumLevels", () => {
  it("returns empty array below level 13", () => {
    expect(getMysticArcanumLevels(12)).toEqual([]);
    expect(getMysticArcanumLevels(1)).toEqual([]);
  });

  it("returns [6] at level 13", () => {
    expect(getMysticArcanumLevels(13)).toEqual([6]);
  });

  it("returns [6] between level 13 and 16", () => {
    expect(getMysticArcanumLevels(14)).toEqual([6]);
    expect(getMysticArcanumLevels(16)).toEqual([6]);
  });

  it("returns [6, 7] at level 17 (both arcana available)", () => {
    expect(getMysticArcanumLevels(17)).toEqual([6, 7]);
  });

  it("returns [6, 7] at level 20", () => {
    expect(getMysticArcanumLevels(20)).toEqual([6, 7]);
  });
});

describe("getMysticArcanumLevel (highest level helper)", () => {
  it("returns null below level 13", () => {
    expect(getMysticArcanumLevel(12)).toBeNull();
    expect(getMysticArcanumLevel(1)).toBeNull();
  });

  it("returns 6 at levels 13-16", () => {
    expect(getMysticArcanumLevel(13)).toBe(6);
    expect(getMysticArcanumLevel(16)).toBe(6);
  });

  it("returns 7 at level 17+", () => {
    expect(getMysticArcanumLevel(17)).toBe(7);
    expect(getMysticArcanumLevel(20)).toBe(7);
  });
});

describe("getSpellSlots edge cases", () => {
  it("level 13 has 4th-level slots", () => {
    const slots = getSpellSlots(13);
    expect(slots[4]).toBe(1);
    expect(slots[5]).toBe(0);
  });

  it("level 17 has 5th-level slots", () => {
    const slots = getSpellSlots(17);
    expect(slots[5]).toBe(1);
  });

  it("invalid level returns all zeros", () => {
    const slots = getSpellSlots(0);
    expect(slots[1]).toBe(0);
    expect(slots[5]).toBe(0);
  });
});

describe("getShortRestRecoverySlot edge cases", () => {
  it("level 15 recovers a 4th-level slot (highest with >0 slots)", () => {
    // Level 15 has slots [4, 3, 3, 2, 0] — highest with >0 is 4th
    expect(getShortRestRecoverySlot(15)).toBe(4);
  });

  it("level 12 recovers a 3rd-level slot", () => {
    // Level 12 has slots [4, 3, 3, 0, 0] — highest with >0 is 3rd
    expect(getShortRestRecoverySlot(12)).toBe(3);
  });

  it("level 2 recovers a 1st-level slot (minimum floor)", () => {
    // 2 ÷ 3 = 0.66 → floor = 0, minimum 1
    expect(getShortRestRecoverySlot(2)).toBe(1);
  });
});

describe("getArcaneRecoveryBudget (Sage/Shepherd)", () => {
  it("level 1 recovers ceil(1/2) = 1 combined slot level", () => {
    expect(getArcaneRecoveryBudget(1)).toBe(1);
  });

  it("level 5 recovers ceil(5/2) = 3 combined slot levels", () => {
    // e.g., one 3rd-level slot, or one 2nd + one 1st
    expect(getArcaneRecoveryBudget(5)).toBe(3);
  });

  it("level 10 recovers ceil(10/2) = 5 combined slot levels", () => {
    expect(getArcaneRecoveryBudget(10)).toBe(5);
  });

  it("level 20 recovers ceil(20/2) = 10 combined slot levels", () => {
    expect(getArcaneRecoveryBudget(20)).toBe(10);
  });

  it("level 7 recovers ceil(7/2) = 4 combined slot levels", () => {
    expect(getArcaneRecoveryBudget(7)).toBe(4);
  });
});
