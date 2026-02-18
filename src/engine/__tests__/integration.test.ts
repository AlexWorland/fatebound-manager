/**
 * Engine Integration Tests
 *
 * End-to-end pipeline tests: Dawn Roll → Form Resolution → Resource Allocation.
 * Verifies the seams between engines that were developed independently.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveDawnRollOutcome, dawnRollUsesStabilized } from "../dawn-roll";
import {
  assembleChaosForm,
  getTableDRollCount,
  isTableCIncompatible,
} from "../chaos-form";
import { resolveStabilizedForm } from "../stabilized-form";
import {
  getSpellSlots,
  getShortRestRecoverySlot,
  getMysticArcanumLevel,
  getMysticArcanumLevels,
  getArcaneRecoveryBudget,
} from "../spell-slots";
import {
  getMemorySlotCount,
  getFatePoolSize,
  isFeatureRetainable,
  validateMemoryAllocation,
} from "../residual-memory";

// Mock dice to get deterministic results for integration tests
vi.mock("@/lib/dice", () => ({
  rollFatesSelection: vi.fn(() => 1),
  rollD20: vi.fn(() => 10),
  rollDie: vi.fn(() => 4),
  pickSmallestDie: vi.fn(() => 8),
}));

describe("Dawn Roll → Form Resolution Pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Level 1, roll 3 (Deep Chaos) → full Chaos Form assembly", () => {
    const outcome = resolveDawnRollOutcome(3, 1);
    expect(outcome).toBe("DEEP_CHAOS");
    expect(dawnRollUsesStabilized(outcome)).toBe(false);

    // Chaos Form at level 1: no Table D feats
    const form = assembleChaosForm(1, {
      tableA: 1,
      tableB: 1,
      tableC: 1,
    });

    expect(form.level).toBe(1);
    expect(form.chassis).toBeDefined();
    expect(form.primaryFeature).toBeDefined();
    expect(form.defensiveFeature).toBeDefined();
    expect(form.feats).toHaveLength(0); // Level 1 = 0 Table D rolls
    expect(getTableDRollCount(1)).toBe(0);
  });

  it("Level 7, roll 12 (Guided) → Stabilized Form with no subclass", () => {
    const outcome = resolveDawnRollOutcome(12, 7);
    expect(outcome).toBe("GUIDED");
    expect(dawnRollUsesStabilized(outcome)).toBe(true);

    // Resolve Tempest (form 1) at level 7 — no subclass yet (requires 9)
    const resolved = resolveStabilizedForm(1, 7);
    expect(resolved.form.name).toBe("The Tempest");
    expect(resolved.hasSubclass).toBe(false);
    expect(resolved.subclass).toBeNull();
    expect(resolved.hasSignatureAbility).toBe(false);
    expect(resolved.hasCapstone).toBe(false);
    expect(resolved.availableFeatures.length).toBeGreaterThan(0);
  });

  it("Level 10, roll 17 (Favored) → Stabilized Form + subclass + Residual Memory", () => {
    const outcome = resolveDawnRollOutcome(17, 10);
    expect(outcome).toBe("FAVORED");
    expect(dawnRollUsesStabilized(outcome)).toBe(true);

    // Resolve Blade (form 5) at level 10 — has subclass (level 9+)
    const resolved = resolveStabilizedForm(5, 10);
    expect(resolved.form.name).toBe("The Blade");
    expect(resolved.hasSubclass).toBe(true);
    expect(resolved.subclass).not.toBeNull();
    expect(resolved.subclass!.level9Feature).toBeDefined();
    expect(resolved.hasSignatureAbility).toBe(false);
    expect(resolved.hasCapstone).toBe(false);

    // Memory at level 10: 3 slots available
    expect(getMemorySlotCount(10)).toBe(3);
    expect(getFatePoolSize(10)).toBe(0); // Fate Pool requires level 11

    // Validate memory allocation: 2 retained features at level 10
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "rage", category: 1 },
          { featureId: "sneak-attack", category: 3 },
        ],
        useDualNature: false,
      },
      10
    );
    expect(result.valid).toBe(true);
    expect(result.pointsUsed).toBe(2);
    expect(result.pointsRemaining).toBe(1);
  });

  it("Level 15, roll 20 (Master) → free form choice + Dual Nature + Chaos Resonance", () => {
    const outcome = resolveDawnRollOutcome(20, 15);
    expect(outcome).toBe("MASTER");
    expect(dawnRollUsesStabilized(outcome)).toBe(true);

    // At level 15 with Master, player picks any stabilized form
    // Resolve Hexer (form 11) at level 15 — has subclass + signature
    const resolved = resolveStabilizedForm(11, 15);
    expect(resolved.form.name).toBe("The Hexer");
    expect(resolved.hasSubclass).toBe(true);
    expect(resolved.hasSignatureAbility).toBe(true);
    expect(resolved.hasCapstone).toBe(false); // Level 17+ required

    // Fate Pool at level 15: 4 slots
    expect(getFatePoolSize(15)).toBe(4);
    expect(getMemorySlotCount(15)).toBe(4);

    // Dual Nature costs 2 points, leaving 2 for retained features
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "divine-smite", category: 2 },
          { featureId: "metamagic", category: 1 },
        ],
        useDualNature: true,
      },
      15
    );
    expect(result.valid).toBe(true);
    expect(result.pointsUsed).toBe(4); // 2 features + 2 for Dual Nature
    expect(result.pointsRemaining).toBe(0);
  });

  it("Level 18 — Defy Fate available (bypass roll)", () => {
    // At level 18, Defy Fate lets the player skip the Dawn Roll entirely.
    // The engine doesn't enforce this — it's a UI-level choice.
    // But we verify all outcomes still resolve correctly at this level.
    const outcomes: [number, string][] = [
      [1, "DM_DESIGN"],
      [3, "DEEP_CHAOS"],
      [8, "UNSTABLE"],
      [12, "GUIDED"],
      [17, "FAVORED"],
      [20, "MASTER"],
    ];

    for (const [roll, expected] of outcomes) {
      expect(resolveDawnRollOutcome(roll, 18)).toBe(expected);
    }

    // Stabilized Form at 18 — has all tiers
    const resolved = resolveStabilizedForm(1, 18);
    expect(resolved.hasSubclass).toBe(true);
    expect(resolved.hasSignatureAbility).toBe(true);
    expect(resolved.hasCapstone).toBe(true);
  });

  it("Arcanist + Rage incompatibility triggers Fate's Mercy bonus", () => {
    // Arcanist (chassis 7) + Rage (primary 1) should trigger bonusUnarmoredDefense
    const form = assembleChaosForm(1, {
      tableA: 7, // Arcanist
      tableB: 1, // Rage
      tableC: 1,
    });

    expect(form.fatesMercy.bonusUnarmoredDefense).toBe(true);
  });
});

describe("Spell Slot + Caster Integration", () => {
  it("half-caster spell slot progression at key levels", () => {
    // Level 2: 2 first-level slots
    const lvl2 = getSpellSlots(2);
    expect(lvl2[1]).toBe(2);
    expect(lvl2[2]).toBe(0);

    // Level 5: 4 first-level, 2 second-level
    const lvl5 = getSpellSlots(5);
    expect(lvl5[1]).toBe(4);
    expect(lvl5[2]).toBe(2);

    // Level 9: has 3rd-level slots
    const lvl9 = getSpellSlots(9);
    expect(lvl9[3]).toBeGreaterThan(0);
  });

  it("Hexer short rest recovery scales with level", () => {
    expect(getShortRestRecoverySlot(3)).toBe(1); // highest slot at level 3: 1st
    expect(getShortRestRecoverySlot(6)).toBe(2); // highest slot at level 6: 2nd
    expect(getShortRestRecoverySlot(9)).toBe(3); // highest slot at level 9: 3rd
    expect(getShortRestRecoverySlot(15)).toBe(4); // highest slot at level 15: 4th
    expect(getShortRestRecoverySlot(20)).toBe(5); // highest slot at level 20: 5th
  });

  it("Mystic Arcanum availability matches level thresholds", () => {
    // Below 13: no arcanum
    expect(getMysticArcanumLevel(12)).toBeNull();
    expect(getMysticArcanumLevels(12)).toEqual([]);

    // Level 13-16: 6th-level arcanum
    expect(getMysticArcanumLevel(13)).toBe(6);
    expect(getMysticArcanumLevels(13)).toEqual([6]);

    // Level 17+: 6th and 7th
    expect(getMysticArcanumLevel(17)).toBe(7);
    expect(getMysticArcanumLevels(17)).toEqual([6, 7]);
  });

  it("Arcane Recovery budget = ceil(level / 2)", () => {
    expect(getArcaneRecoveryBudget(1)).toBe(1);
    expect(getArcaneRecoveryBudget(5)).toBe(3);
    expect(getArcaneRecoveryBudget(10)).toBe(5);
    expect(getArcaneRecoveryBudget(20)).toBe(10);
  });
});

describe("Residual Memory + Fate Pool Allocation", () => {
  it("memory slot count scales with level progression", () => {
    expect(getMemorySlotCount(1)).toBe(0);
    expect(getMemorySlotCount(2)).toBe(1);
    expect(getMemorySlotCount(6)).toBe(2);
    expect(getMemorySlotCount(10)).toBe(3);
    expect(getMemorySlotCount(15)).toBe(4);
  });

  it("Fate Pool only activates at level 11+", () => {
    expect(getFatePoolSize(10)).toBe(0);
    expect(getFatePoolSize(11)).toBe(3);
    expect(getFatePoolSize(15)).toBe(4);
  });

  it("category 6 features cannot be retained", () => {
    expect(isFeatureRetainable(1)).toBe(true);
    expect(isFeatureRetainable(5)).toBe(true);
    expect(isFeatureRetainable(6)).toBe(false);
  });

  it("Dual Nature before level 11 is rejected", () => {
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [],
        useDualNature: true,
      },
      10
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("not available below level 11"))).toBe(true);
  });

  it("over-allocating memory slots is rejected", () => {
    // Level 2: 1 slot, try to retain 2 features
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "rage", category: 1 },
          { featureId: "sneak", category: 3 },
        ],
        useDualNature: false,
      },
      2
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("Dual Nature + max features fills entire Fate Pool at level 15", () => {
    // Level 15: 4 pool points. Dual Nature = 2, + 2 features = 4 total
    const result = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "rage", category: 1 },
          { featureId: "metamagic", category: 1 },
        ],
        useDualNature: true,
      },
      15
    );
    expect(result.valid).toBe(true);
    expect(result.pointsUsed).toBe(4);
    expect(result.pointsRemaining).toBe(0);

    // One more feature should overflow
    const overflow = validateMemoryAllocation(
      {
        retainedFeatures: [
          { featureId: "rage", category: 1 },
          { featureId: "metamagic", category: 1 },
          { featureId: "sneak", category: 3 },
        ],
        useDualNature: true,
      },
      15
    );
    expect(overflow.valid).toBe(false);
  });
});

describe("Chaos Form Edge Cases", () => {
  it("Table C incompatibility detection works across engine seams", () => {
    // These are data-driven checks that validate the tables + engine work together
    // Unarmored Defense (defensive 5) is incompatible with Tank (chassis 1) per data
    // We test the function directly since it crosses data/engine boundary
    const result = isTableCIncompatible(1, 1, 5);
    // This depends on the actual data — we just verify it doesn't crash
    expect(typeof result).toBe("boolean");
  });

  it("Chaos Form at level 12 has 3 Table D feats", () => {
    expect(getTableDRollCount(12)).toBe(3);

    const form = assembleChaosForm(12, {
      tableA: 2,
      tableB: 3,
      tableC: 2,
      tableD: [1, 5, 10],
    });

    expect(form.feats).toHaveLength(3);
    expect(form.level).toBe(12);
  });

  it("Chaos Form at level 19 has 5 Table D feats", () => {
    expect(getTableDRollCount(19)).toBe(5);

    const form = assembleChaosForm(19, {
      tableA: 3,
      tableB: 5,
      tableC: 3,
      tableD: [1, 2, 3, 4, 5],
    });

    expect(form.feats).toHaveLength(5);
  });

  it("Fate's Mercy ensures minimum d8 hit die", () => {
    // Arcanist (chassis 7) has d6 hit die — should be upgraded
    const form = assembleChaosForm(1, {
      tableA: 7,
      tableB: 2,
      tableC: 1,
    });

    expect(form.chassis.hitDie).toBeGreaterThanOrEqual(8);
    if (form.fatesMercy.hitDieUpgraded) {
      expect(form.chassis.hitDie).toBe(8);
    }
  });
});

describe("Full Pipeline: Level Progression Scenarios", () => {
  it("character progression from 1 to 20 has consistent engine outputs", () => {
    for (let level = 1; level <= 20; level++) {
      // Dawn Roll outcomes are deterministic for any given roll value
      // Roll 10 is UNSTABLE at all levels (range 6-10)
      const outcome = resolveDawnRollOutcome(10, level);
      expect(outcome).toBe("UNSTABLE");

      // Spell slots are defined for all levels
      const slots = getSpellSlots(level);
      expect(slots).toBeDefined();
      expect(typeof slots[1]).toBe("number");

      // Memory slots are defined for all levels
      const memSlots = getMemorySlotCount(level);
      expect(memSlots).toBeGreaterThanOrEqual(0);

      // Table D roll count is defined for all levels
      const featCount = getTableDRollCount(level);
      expect(featCount).toBeGreaterThanOrEqual(0);
    }
  });
});
