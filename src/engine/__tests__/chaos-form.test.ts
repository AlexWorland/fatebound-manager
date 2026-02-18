import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isTableCIncompatible,
  getTableDRollCount,
  rollTableDFeats,
  assembleChaosForm,
} from "../chaos-form";
import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";

// Mock dice module so tests are deterministic
vi.mock("@/lib/dice", () => ({
  rollFatesSelection: vi.fn(),
  rollDie: vi.fn(),
  pickSmallestDie: vi.fn((n: number) => {
    if (n <= 4) return 4;
    if (n <= 6) return 6;
    if (n <= 8) return 8;
    if (n <= 10) return 10;
    if (n <= 12) return 12;
    if (n <= 20) return 20;
    return 100;
  }),
}));

import { rollFatesSelection, rollDie } from "@/lib/dice";
const mockRollFatesSelection = vi.mocked(rollFatesSelection);
const mockRollDie = vi.mocked(rollDie);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("isTableCIncompatible", () => {
  it("returns true for Brute (chassis 1) + Unarmored Defense CON (defensive 1)", () => {
    expect(isTableCIncompatible(1, 1, 1)).toBe(true);
    expect(isTableCIncompatible(1, 5, 1)).toBe(true); // any Table B
  });

  it("returns true for Brute (chassis 1) + Unarmored Defense WIS (defensive 2)", () => {
    expect(isTableCIncompatible(1, 1, 2)).toBe(true);
  });

  it("returns true for Skirmisher (chassis 2) + Unarmored Defense CON (defensive 1)", () => {
    expect(isTableCIncompatible(2, 3, 1)).toBe(true);
  });

  it("returns true for Skirmisher (chassis 2) + Unarmored Defense WIS (defensive 2)", () => {
    expect(isTableCIncompatible(2, 1, 2)).toBe(true);
  });

  it("returns true for non-caster Table B + Metamagic (defensive 6, requiresSpellcasting)", () => {
    // Table B id 1 = Rage (hasSpellcasting: false)
    expect(isTableCIncompatible(3, 1, 6)).toBe(true);
    // Table B id 5 = Fighting Style (hasSpellcasting: false)
    expect(isTableCIncompatible(5, 5, 6)).toBe(true);
  });

  it("returns false for spellcaster Table B + Metamagic (defensive 6)", () => {
    // Table B id 3 = Spellcasting Divine (hasSpellcasting: true)
    expect(isTableCIncompatible(3, 3, 6)).toBe(false);
    // Table B id 12 = Spellcasting Arcane (hasSpellcasting: true)
    expect(isTableCIncompatible(3, 12, 6)).toBe(false);
  });

  it("returns false for compatible combinations", () => {
    // Duelist (3) + Shield Spell (3) — no incompatibility
    expect(isTableCIncompatible(3, 1, 3)).toBe(false);
    // Trickster (6) + Cunning Action (4)
    expect(isTableCIncompatible(6, 9, 4)).toBe(false);
    // Arcanist (7) + Danger Sense (8)
    expect(isTableCIncompatible(7, 12, 8)).toBe(false);
  });
});

describe("getTableDRollCount", () => {
  // Source: The Fatebound.md Table D Rolls table
  // 1-3: 0, 4-7: 1, 8-11: 2, 12-15: 3, 16-18: 4, 19+: 5
  it("returns 0 for levels 1-3", () => {
    expect(getTableDRollCount(1)).toBe(0);
    expect(getTableDRollCount(2)).toBe(0);
    expect(getTableDRollCount(3)).toBe(0);
  });

  it("returns 1 for levels 4-7", () => {
    expect(getTableDRollCount(4)).toBe(1);
    expect(getTableDRollCount(5)).toBe(1);
    expect(getTableDRollCount(7)).toBe(1);
  });

  it("returns 2 for levels 8-11", () => {
    expect(getTableDRollCount(8)).toBe(2);
    expect(getTableDRollCount(11)).toBe(2);
  });

  it("returns 3 for levels 12-15", () => {
    expect(getTableDRollCount(12)).toBe(3);
    expect(getTableDRollCount(15)).toBe(3);
  });

  it("returns 4 for levels 16-18", () => {
    expect(getTableDRollCount(16)).toBe(4);
    expect(getTableDRollCount(18)).toBe(4);
  });

  it("returns 5 for levels 19-20", () => {
    expect(getTableDRollCount(19)).toBe(5);
    expect(getTableDRollCount(20)).toBe(5);
  });
});

describe("rollTableDFeats", () => {
  it("returns empty array when count is 0", () => {
    expect(rollTableDFeats(0)).toEqual([]);
  });

  it("returns the correct number of feats", () => {
    // Return sequential feat ids
    mockRollFatesSelection.mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValueOnce(3);
    const feats = rollTableDFeats(3);
    expect(feats).toHaveLength(3);
    expect(feats[0].id).toBe(1);
    expect(feats[1].id).toBe(2);
    expect(feats[2].id).toBe(3);
  });

  it("rerolls duplicates for non-repeatable feats", () => {
    // First roll = 1, second roll = 1 (duplicate, reroll), then 3
    mockRollFatesSelection
      .mockReturnValueOnce(1)  // first feat: Aberrant Dragonmark
      .mockReturnValueOnce(1)  // duplicate — reroll
      .mockReturnValueOnce(3); // Actor
    const feats = rollTableDFeats(2);
    expect(feats).toHaveLength(2);
    expect(feats[0].id).toBe(1);
    expect(feats[1].id).toBe(3);
  });

  it("allows duplicates for repeatable feats (ASI)", () => {
    // Feat id 2 = ASI, canRepeat: true
    mockRollFatesSelection.mockReturnValueOnce(2).mockReturnValueOnce(2);
    const feats = rollTableDFeats(2);
    expect(feats).toHaveLength(2);
    expect(feats[0].id).toBe(2);
    expect(feats[1].id).toBe(2);
  });

  it("excludes pre-excluded feat ids", () => {
    // Exclude id 1, roll returns 1 first (skip), then 3
    mockRollFatesSelection.mockReturnValueOnce(1).mockReturnValueOnce(3);
    const feats = rollTableDFeats(1, [1]);
    expect(feats).toHaveLength(1);
    expect(feats[0].id).toBe(3);
  });
});

describe("assembleChaosForm", () => {
  it("uses provided rolls for deterministic output", () => {
    const result = assembleChaosForm(1, {
      tableA: 3,  // Duelist
      tableB: 5,  // Fighting Style + Extra Attack
      tableC: 4,  // Cunning Action
    });
    expect(result.chassis.id).toBe(3);
    expect(result.chassis.name).toBe("Duelist");
    expect(result.primaryFeature.id).toBe(5);
    expect(result.primaryFeature.name).toBe("Fighting Style + Extra Attack");
    expect(result.defensiveFeature.id).toBe(4);
    expect(result.defensiveFeature.name).toBe("Cunning Action");
    expect(result.feats).toEqual([]); // level 1 = 0 feat rolls
    expect(result.tableCRerolled).toBe(false);
    expect(result.fatesMercyApplied).toBe(false);
    expect(result.level).toBe(1);
  });

  it("rerolls Table C exactly once when incompatible (Brute + Unarmored CON)", () => {
    // Force Table C incompatibility: Brute (1) + Unarmored CON (1)
    // After reroll, use rollFatesSelection to pick defensive 3 (Shield Spell)
    mockRollFatesSelection.mockReturnValueOnce(3); // reroll result for Table C
    const result = assembleChaosForm(1, {
      tableA: 1,  // Brute
      tableB: 1,  // Rage
      tableC: 1,  // Unarmored CON — incompatible with Brute
    });
    expect(result.tableCRerolled).toBe(true);
    expect(result.defensiveFeature.id).toBe(3); // Shield Spell from reroll
    expect(result.chassis.id).toBe(1); // Brute unchanged
    expect(result.tableCRerollInfo).not.toBeNull();
    expect(result.tableCRerollInfo!.originalId).toBe(1);
    expect(result.tableCRerollInfo!.reason).toContain("Brute");
  });

  it("keeps second Table C result even if also incompatible (reroll once rule)", () => {
    // Brute + Unarmored CON => reroll => Unarmored WIS (still incompatible, but kept)
    mockRollFatesSelection.mockReturnValueOnce(2); // reroll: Unarmored WIS
    const result = assembleChaosForm(1, {
      tableA: 1,  // Brute
      tableB: 1,  // Rage
      tableC: 1,  // Unarmored CON — incompatible
    });
    // Second result stands regardless per rules
    expect(result.tableCRerolled).toBe(true);
    expect(result.defensiveFeature.id).toBe(2); // Unarmored WIS, still incompatible but kept
  });

  it("rerolls Table C when non-caster + requiresSpellcasting defensive", () => {
    // Duelist (3) + Rage (1, non-caster) + Metamagic (6, requiresSpellcasting)
    mockRollFatesSelection.mockReturnValueOnce(4); // reroll: Cunning Action
    const result = assembleChaosForm(1, {
      tableA: 3,
      tableB: 1,  // Rage (hasSpellcasting: false)
      tableC: 6,  // Metamagic (requiresSpellcasting: true)
    });
    expect(result.tableCRerolled).toBe(true);
    expect(result.defensiveFeature.id).toBe(4);
    expect(result.tableCRerollInfo!.reason).toContain("Metamagic");
  });

  it("does not reroll Table C when spellcasting + Metamagic", () => {
    const result = assembleChaosForm(1, {
      tableA: 3,  // Duelist
      tableB: 3,  // Spellcasting Divine (has spellcasting)
      tableC: 6,  // Metamagic — compatible
    });
    expect(result.tableCRerolled).toBe(false);
    expect(result.defensiveFeature.id).toBe(6);
    expect(result.tableCRerollInfo).toBeNull();
  });

  it("rolls randomly when no rolls provided", () => {
    mockRollFatesSelection
      .mockReturnValueOnce(3)  // Table A: Duelist
      .mockReturnValueOnce(5)  // Table B: Fighting Style
      .mockReturnValueOnce(8); // Table C: Danger Sense
    const result = assembleChaosForm(1);
    expect(result.chassis.id).toBe(3);
    expect(result.primaryFeature.id).toBe(5);
    expect(result.defensiveFeature.id).toBe(8);
  });

  it("includes feats at level 4 (first ASI level)", () => {
    // Level 4 = 1 feat roll per source doc
    mockRollFatesSelection.mockReturnValueOnce(10); // Table D: Chef
    const result = assembleChaosForm(4, {
      tableA: 3,
      tableB: 5,
      tableC: 4,
    });
    expect(result.feats).toHaveLength(1);
    expect(result.feats[0].id).toBe(10);
  });

  it("uses provided Table D rolls", () => {
    const result = assembleChaosForm(4, {
      tableA: 3,
      tableB: 5,
      tableC: 4,
      tableD: [46], // Lucky
    });
    expect(result.feats).toHaveLength(1);
    expect(result.feats[0].id).toBe(46);
    expect(result.feats[0].name).toBe("Lucky");
  });

  it("applies Fate's Mercy when chassis is Arcanist", () => {
    // Arcanist (7): d6, no armor, specific weapons only
    const result = assembleChaosForm(1, {
      tableA: 7,  // Arcanist
      tableB: 2,  // Bardic Inspiration — no spellcasting, no direct attacks
      tableC: 5,  // Lay on Hands — purely defensive
    });
    expect(result.fatesMercyApplied).toBe(true);
    // Hit die upgraded from d6 to d8
    expect(result.fatesMercy.hitDieUpgraded).toBe(true);
    expect(result.chassis.hitDie).toBe(8);
    // Light armor added
    expect(result.fatesMercy.armorAdded).toBe(true);
    expect(result.chassis.armorProficiencies).toContain("light");
    // Simple weapon added
    expect(result.fatesMercy.weaponAdded).toBe(true);
    expect(result.chassis.weaponProficiencies).toContain("simple");
    // AC floor always true
    expect(result.fatesMercy.acFloor).toBe(true);
  });

  it("does not upgrade hit die when chassis is >= d8", () => {
    // Brute (1): d12
    const result = assembleChaosForm(1, {
      tableA: 1,
      tableB: 2,
      tableC: 8,
    });
    expect(result.chassis.hitDie).toBe(12);
    expect(result.fatesMercy.hitDieUpgraded).toBe(false);
  });

  it("does not apply Fate's Mercy when chassis has martial weapons", () => {
    // Brute (1): martial + simple weapons
    const result = assembleChaosForm(1, {
      tableA: 1,  // Brute — has martial weapons
      tableB: 2,  // Bardic Inspiration
      tableC: 8,  // Danger Sense
    });
    expect(result.fatesMercyApplied).toBe(false);
    expect(result.fatesMercy.hitDieUpgraded).toBe(false);
    expect(result.fatesMercy.armorAdded).toBe(false);
    expect(result.fatesMercy.weaponAdded).toBe(false);
    expect(result.fatesMercy.grantsFateStrike).toBe(false);
  });

  it("does not apply Fate's Mercy when primary feature has spellcasting", () => {
    // Arcanist (7) weak weapons + Spellcasting Divine (3) = offensive spells
    const result = assembleChaosForm(1, {
      tableA: 7,
      tableB: 3,  // Spellcasting Divine — offensive spellcasting
      tableC: 8,
    });
    // Hit die and armor still get corrected (Arcanist is d6, no armor)
    expect(result.fatesMercy.hitDieUpgraded).toBe(true);
    expect(result.fatesMercy.armorAdded).toBe(true);
    // But no Fate Strike needed since spellcasting provides combat
    expect(result.fatesMercy.grantsFateStrike).toBe(false);
  });

  it("does not grant Fate Strike when primary grants attack feature", () => {
    // Arcanist (7) + Eldritch Invocations (11) — grants Eldritch Blast
    const result = assembleChaosForm(1, {
      tableA: 7,
      tableB: 11, // Eldritch Invocations — grants Eldritch Blast cantrip
      tableC: 8,
    });
    expect(result.fatesMercy.grantsFateStrike).toBe(false);
  });

  it("grants bonus Unarmored Defense for Arcanist + Rage", () => {
    const result = assembleChaosForm(1, {
      tableA: 7, // Arcanist
      tableB: 1, // Rage
      tableC: 8, // Danger Sense
    });
    expect(result.fatesMercy.bonusUnarmoredDefense).toBe(true);
  });

  it("does not grant bonus Unarmored Defense for non-Arcanist + Rage", () => {
    const result = assembleChaosForm(1, {
      tableA: 1, // Brute (not Arcanist)
      tableB: 1, // Rage
      tableC: 4, // Cunning Action
    });
    expect(result.fatesMercy.bonusUnarmoredDefense).toBe(false);
  });

  it("level 1 produces 0 Table D feats", () => {
    const result = assembleChaosForm(1, {
      tableA: 3,
      tableB: 9,
      tableC: 4,
    });
    expect(result.feats).toHaveLength(0);
  });

  it("level 19 gets 5 Table D feats", () => {
    const result = assembleChaosForm(19, {
      tableA: 3,
      tableB: 9,
      tableC: 4,
      tableD: [4, 10, 20, 30, 50],
    });
    expect(result.feats).toHaveLength(5);
  });
});
