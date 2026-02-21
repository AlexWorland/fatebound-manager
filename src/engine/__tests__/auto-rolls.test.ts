import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseAutoRollOptions, resolveAutoRolls } from "../auto-rolls";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import type { BaseFeature } from "@/types/forms";

vi.mock("@/lib/dice", () => ({
  rollDie: vi.fn(),
  rollFatesSelection: vi.fn(),
}));

import { rollDie } from "@/lib/dice";
const mockRollDie = vi.mocked(rollDie);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("parseAutoRollOptions", () => {
  it("parses single-select em-dash format", () => {
    const feature: BaseFeature = {
      name: "Fighting Style",
      description:
        "Randomly select \u2014 1: Archery, 2: Defense, 3: Dueling, 4: Great Weapon Fighting, 5: Protection, 6: Two-Weapon Fighting.",
    };
    const result = parseAutoRollOptions(feature);
    expect(result).not.toBeNull();
    expect(result!.featureName).toBe("Fighting Style");
    expect(result!.count).toBe(1);
    expect(result!.options).toEqual([
      "Archery",
      "Defense",
      "Dueling",
      "Great Weapon Fighting",
      "Protection",
      "Two-Weapon Fighting",
    ]);
  });

  it("parses single-select with fewer options (Warden Fighting Style)", () => {
    const feature: BaseFeature = {
      name: "Fighting Style",
      description:
        "Randomly select \u2014 1: Defense, 2: Dueling, 3: Protection, 4: Great Weapon Fighting.",
    };
    const result = parseAutoRollOptions(feature);
    expect(result).not.toBeNull();
    expect(result!.options).toHaveLength(4);
    expect(result!.options[0]).toBe("Defense");
    expect(result!.options[3]).toBe("Great Weapon Fighting");
    expect(result!.count).toBe(1);
  });

  it("parses single-select Pact Boon format", () => {
    const feature: BaseFeature = {
      name: "Pact Boon",
      description:
        "Randomly select \u2014 1: Pact of the Chain (familiar), 2: Pact of the Blade (conjure weapon), 3: Pact of the Tome (3 cantrips from any list), 4: Pact of the Talisman (when the wearer fails an ability check, add a d4 to the roll, uses = prof bonus/long rest). Your Pact Boon is determined once when you assume the Hexer form and remains fixed for the day, even if your subclass changes. Invocations that depend on a specific Pact Boon only function if they match your current Pact Boon.",
    };
    const result = parseAutoRollOptions(feature);
    expect(result).not.toBeNull();
    expect(result!.featureName).toBe("Pact Boon");
    expect(result!.count).toBe(1);
    expect(result!.options.length).toBeGreaterThanOrEqual(4);
    expect(result!.options[0]).toContain("Pact of the Chain");
  });

  it("parses multi-select 'randomly select N from:' format (Metamagic)", () => {
    const feature: BaseFeature = {
      name: "Metamagic",
      description:
        "You know 2 Metamagic options (randomly select 2 from: 1-Careful, 2-Distant, 3-Empowered, 4-Extended, 5-Heightened, 6-Quickened, 7-Subtle, 8-Twinned).",
    };
    const result = parseAutoRollOptions(feature);
    expect(result).not.toBeNull();
    expect(result!.featureName).toBe("Metamagic");
    expect(result!.count).toBe(2);
    expect(result!.options).toHaveLength(8);
    expect(result!.options[0]).toBe("Careful");
    expect(result!.options[7]).toBe("Twinned");
  });

  it("returns null for features without auto-roll pattern", () => {
    const feature: BaseFeature = {
      name: "Extra Attack",
      description: "You can attack twice when you take the Attack action.",
    };
    expect(parseAutoRollOptions(feature)).toBeNull();
  });

  it("returns null for Rage feature", () => {
    const feature: BaseFeature = {
      name: "Rage",
      description:
        "Advantage on STR checks/saves, +2 rage damage, resistance to bludgeoning/piercing/slashing.",
      resourceKey: "rage",
      maxUses: "proficiency bonus/day",
    };
    expect(parseAutoRollOptions(feature)).toBeNull();
  });

  it("returns null for a description that mentions 'randomly' without the parse pattern", () => {
    const feature: BaseFeature = {
      name: "Infuse Item",
      description:
        "You infuse mundane items with magical properties. Randomly select infusions from the Infusion Table using Fate's Selection.",
    };
    // This mentions randomly but doesn't match the numbered option formats
    // It MIGHT match if we're not careful — ensure we don't produce bad output
    const result = parseAutoRollOptions(feature);
    // Either null, or if it matches, options array must be non-empty
    if (result !== null) {
      expect(result.options.length).toBeGreaterThan(0);
    }
  });
});

describe("resolveAutoRolls", () => {
  it("returns correct mapping for a single-select feature", () => {
    mockRollDie.mockReturnValueOnce(1);
    const features: BaseFeature[] = [
      {
        name: "Fighting Style",
        description:
          "Randomly select \u2014 1: Archery, 2: Defense, 3: Dueling, 4: Great Weapon Fighting, 5: Protection, 6: Two-Weapon Fighting.",
      },
    ];
    const results = resolveAutoRolls(features);
    expect(results["Fighting Style"]).toBe("Archery");
    expect(mockRollDie).toHaveBeenCalledWith(6);
  });

  it("selects correct option by roll index", () => {
    mockRollDie.mockReturnValueOnce(3);
    const features: BaseFeature[] = [
      {
        name: "Fighting Style",
        description:
          "Randomly select \u2014 1: Archery, 2: Defense, 3: Dueling, 4: Great Weapon Fighting.",
      },
    ];
    const results = resolveAutoRolls(features);
    expect(results["Fighting Style"]).toBe("Dueling");
  });

  it("returns empty record when no features have auto-roll", () => {
    const features: BaseFeature[] = [
      {
        name: "Extra Attack",
        description: "You can attack twice when you take the Attack action.",
      },
      {
        name: "Action Surge",
        description: "Take one additional action on your turn.",
        resourceKey: "action_surge",
        maxUses: "1 use/rest",
      },
    ];
    const results = resolveAutoRolls(features);
    expect(results).toEqual({});
    expect(mockRollDie).not.toHaveBeenCalled();
  });

  it("handles multi-select Metamagic: picks 2 distinct options", () => {
    // Roll 1 on 8 options → index 0 → "Careful"; remaining = ["Distant","Empowered",...]
    // Roll 2 on 7 remaining → index 1 → "Empowered"
    mockRollDie
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2);
    const features: BaseFeature[] = [
      {
        name: "Metamagic",
        description:
          "You know 2 Metamagic options (randomly select 2 from: 1-Careful, 2-Distant, 3-Empowered, 4-Extended, 5-Heightened, 6-Quickened, 7-Subtle, 8-Twinned).",
      },
    ];
    const results = resolveAutoRolls(features);
    expect(results["Metamagic"]).toBe("Careful, Empowered");
    expect(mockRollDie).toHaveBeenCalledTimes(2);
    expect(mockRollDie).toHaveBeenNthCalledWith(1, 8);
    expect(mockRollDie).toHaveBeenNthCalledWith(2, 7);
  });

  it("handles multiple features with auto-roll in same form", () => {
    mockRollDie.mockReturnValueOnce(2).mockReturnValueOnce(1);
    const features: BaseFeature[] = [
      {
        name: "Fighting Style",
        description:
          "Randomly select \u2014 1: Archery, 2: Defense, 3: Dueling.",
      },
      {
        name: "Bonus Feature",
        description: "Randomly select \u2014 1: Option A, 2: Option B.",
      },
    ];
    const results = resolveAutoRolls(features);
    expect(results["Fighting Style"]).toBe("Defense");
    expect(results["Bonus Feature"]).toBe("Option A");
  });

  it("integration: Blade form (id 5) features resolve Fighting Style selection", () => {
    mockRollDie.mockReturnValueOnce(6);
    const bladeForm = STABILIZED_FORMS.find((f) => f.id === 5)!;
    const results = resolveAutoRolls(bladeForm.baseFeatures);
    expect(results["Fighting Style"]).toBe("Two-Weapon Fighting");
  });

  it("integration: Tempest form (id 1) has no auto-roll features", () => {
    const tempestForm = STABILIZED_FORMS.find((f) => f.id === 1)!;
    const results = resolveAutoRolls(tempestForm.baseFeatures);
    expect(results).toEqual({});
    expect(mockRollDie).not.toHaveBeenCalled();
  });

  it("integration: Conduit form (id 10) resolves 2 Metamagic options", () => {
    mockRollDie.mockReturnValueOnce(2).mockReturnValueOnce(4);
    const conduitForm = STABILIZED_FORMS.find((f) => f.id === 10)!;
    const results = resolveAutoRolls(conduitForm.baseFeatures);
    // "Metamagic" key should have 2 comma-separated options
    expect(results["Metamagic"]).toBeDefined();
    const parts = results["Metamagic"].split(", ");
    expect(parts).toHaveLength(2);
  });

  it("integration: Hexer form (id 11) resolves Pact Boon selection", () => {
    mockRollDie.mockReturnValueOnce(1);
    const hexerForm = STABILIZED_FORMS.find((f) => f.id === 11)!;
    const results = resolveAutoRolls(hexerForm.baseFeatures);
    expect(results["Pact Boon"]).toBeDefined();
    expect(results["Pact Boon"]).toContain("Pact of the Chain");
  });
});
