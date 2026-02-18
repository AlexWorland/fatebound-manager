import { describe, it, expect } from "vitest";
import {
  getMemorySlotCount,
  getFatePoolSize,
  isFeatureRetainable,
  validateMemoryAllocation,
} from "../residual-memory";

describe("getMemorySlotCount", () => {
  it("level 1 has 0 memory slots", () => {
    expect(getMemorySlotCount(1)).toBe(0);
  });

  it("level 2 has 1 memory slot", () => {
    expect(getMemorySlotCount(2)).toBe(1);
  });

  it("level 5 has 1 memory slot", () => {
    expect(getMemorySlotCount(5)).toBe(1);
  });

  it("level 6 has 2 memory slots", () => {
    expect(getMemorySlotCount(6)).toBe(2);
  });

  it("level 9 has 2 memory slots", () => {
    expect(getMemorySlotCount(9)).toBe(2);
  });

  it("level 10 has 3 memory slots", () => {
    expect(getMemorySlotCount(10)).toBe(3);
  });

  it("level 14 has 3 memory slots", () => {
    expect(getMemorySlotCount(14)).toBe(3);
  });

  it("level 15 has 4 memory slots", () => {
    expect(getMemorySlotCount(15)).toBe(4);
  });

  it("level 20 has 4 memory slots", () => {
    expect(getMemorySlotCount(20)).toBe(4);
  });
});

describe("getFatePoolSize", () => {
  it("returns 0 below level 11 (Fate Pool not unlocked)", () => {
    expect(getFatePoolSize(1)).toBe(0);
    expect(getFatePoolSize(10)).toBe(0);
  });

  it("level 11 has a Fate Pool of 3", () => {
    expect(getFatePoolSize(11)).toBe(3);
  });

  it("level 15 has a Fate Pool of 4", () => {
    expect(getFatePoolSize(15)).toBe(4);
  });

  it("level 20 has a Fate Pool of 4", () => {
    expect(getFatePoolSize(20)).toBe(4);
  });
});

describe("isFeatureRetainable", () => {
  it("category 1 (Combat Style) is retainable", () => {
    expect(isFeatureRetainable(1)).toBe(true);
  });

  it("category 2 (Resource Pool) is retainable", () => {
    expect(isFeatureRetainable(2)).toBe(true);
  });

  it("category 3 (Scaling Damage) is retainable", () => {
    expect(isFeatureRetainable(3)).toBe(true);
  });

  it("category 4 (Spell Slots) is retainable", () => {
    expect(isFeatureRetainable(4)).toBe(true);
  });

  it("category 5 (Passive) is retainable", () => {
    expect(isFeatureRetainable(5)).toBe(true);
  });

  it("category 6 (Proficiency/Hit Die) is NOT retainable", () => {
    expect(isFeatureRetainable(6)).toBe(false);
  });
});

describe("validateMemoryAllocation", () => {
  it("valid: Dual Nature (2) + 1 memory at level 11 uses exactly 3 points", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [{ featureId: "extra-attack", category: 1 }],
        useDualNature: true,
      },
      11
    );
    expect(result.valid).toBe(true);
    expect(result.pointsUsed).toBe(3);
    expect(result.pointsRemaining).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it("invalid: Dual Nature (2) + 2 memories at level 11 exceeds 3-point pool", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "extra-attack", category: 1 },
          { featureId: "rage", category: 2 },
        ],
        useDualNature: true,
      },
      11
    );
    expect(result.valid).toBe(false);
    expect(result.pointsUsed).toBe(4);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("valid: Dual Nature (2) + 2 memories at level 15 uses exactly 4 points", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "extra-attack", category: 1 },
          { featureId: "rage", category: 2 },
        ],
        useDualNature: true,
      },
      15
    );
    expect(result.valid).toBe(true);
    expect(result.pointsUsed).toBe(4);
    expect(result.pointsRemaining).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it("invalid: Dual Nature not available below level 11", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [],
        useDualNature: true,
      },
      10
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Dual Nature is not available below level 11"
    );
  });

  it("invalid: retaining a category 6 feature", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [{ featureId: "proficiency", category: 6 }],
        useDualNature: false,
      },
      5
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("proficiency"))).toBe(true);
  });

  it("valid: 3 memories and no Dual Nature at level 11", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "sneak-attack", category: 3 },
          { featureId: "ki", category: 2 },
          { featureId: "evasion", category: 5 },
        ],
        useDualNature: false,
      },
      11
    );
    expect(result.valid).toBe(true);
    expect(result.pointsUsed).toBe(3);
  });

  it("invalid: more retained features than memory slots", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "feature-a", category: 1 },
          { featureId: "feature-b", category: 2 },
        ],
        useDualNature: false,
      },
      2 // only 1 memory slot at level 2
    );
    expect(result.valid).toBe(false);
  });
});
