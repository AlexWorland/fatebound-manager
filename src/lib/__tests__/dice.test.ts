import { describe, it, expect } from "vitest";
import { rollDie, rollFatesSelection, pickSmallestDie } from "../dice";

describe("pickSmallestDie", () => {
  it("returns d4 for 4 or fewer entries", () => {
    expect(pickSmallestDie(3)).toBe(4);
    expect(pickSmallestDie(4)).toBe(4);
  });
  it("returns d6 for 5-6 entries", () => {
    expect(pickSmallestDie(5)).toBe(6);
    expect(pickSmallestDie(6)).toBe(6);
  });
  it("returns d8 for 7-8 entries", () => {
    expect(pickSmallestDie(8)).toBe(8);
  });
  it("returns d10 for 9-10 entries", () => {
    expect(pickSmallestDie(10)).toBe(10);
  });
  it("returns d12 for 11-12 entries", () => {
    expect(pickSmallestDie(12)).toBe(12);
  });
  it("returns d20 for 13-20 entries", () => {
    expect(pickSmallestDie(20)).toBe(20);
  });
  it("returns d100 for >20 entries", () => {
    expect(pickSmallestDie(92)).toBe(100);
  });
});

describe("rollDie", () => {
  it("returns a number between 1 and the die size", () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDie(20);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(20);
    }
  });
});

describe("rollFatesSelection", () => {
  it("returns a valid index for the given table size", () => {
    for (let i = 0; i < 100; i++) {
      const result = rollFatesSelection(8);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(8);
    }
  });
  it("handles table size of 92 (feat table)", () => {
    for (let i = 0; i < 50; i++) {
      const result = rollFatesSelection(92);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(92);
    }
  });
});
