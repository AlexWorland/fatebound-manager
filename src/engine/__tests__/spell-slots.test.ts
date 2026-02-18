import { describe, it, expect } from "vitest";
import {
  getSpellSlots,
  getShortRestRecoverySlot,
  getMysticArcanumLevel,
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

  it("level 20 recovers a 6th-level slot (capped at max spell level 5)", () => {
    // 20 ÷ 3 = 6.6 → floor = 6, but max slot is 5
    expect(getShortRestRecoverySlot(20)).toBe(5);
  });
});

describe("getMysticArcanumLevel", () => {
  it("returns null below level 13", () => {
    expect(getMysticArcanumLevel(12)).toBeNull();
    expect(getMysticArcanumLevel(1)).toBeNull();
  });

  it("returns 6 at level 13", () => {
    expect(getMysticArcanumLevel(13)).toBe(6);
  });

  it("returns 6 between level 13 and 16", () => {
    expect(getMysticArcanumLevel(14)).toBe(6);
    expect(getMysticArcanumLevel(16)).toBe(6);
  });

  it("returns 7 at level 17", () => {
    expect(getMysticArcanumLevel(17)).toBe(7);
  });

  it("returns 7 at level 20", () => {
    expect(getMysticArcanumLevel(20)).toBe(7);
  });
});
