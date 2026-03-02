import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSkillAbility,
  getSkillMod,
  getSaveMod,
  getPassiveScore,
  rollCheck,
  formatCheckBreakdown,
} from "../skill-calc";
import { rollDie } from "@/lib/dice";

vi.mock("@/lib/dice", () => ({ rollDie: vi.fn() }));

const baseScores = {
  STR: 10,
  DEX: 14,
  CON: 12,
  INT: 16,
  WIS: 13,
  CHA: 8,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSkillAbility", () => {
  it("returns DEX for Acrobatics", () => {
    expect(getSkillAbility("Acrobatics")).toBe("DEX");
  });
  it("returns WIS for Animal Handling", () => {
    expect(getSkillAbility("Animal Handling")).toBe("WIS");
  });
  it("returns INT for Arcana", () => {
    expect(getSkillAbility("Arcana")).toBe("INT");
  });
  it("returns STR for Athletics", () => {
    expect(getSkillAbility("Athletics")).toBe("STR");
  });
  it("returns CHA for Deception", () => {
    expect(getSkillAbility("Deception")).toBe("CHA");
  });
  it("returns INT for History", () => {
    expect(getSkillAbility("History")).toBe("INT");
  });
  it("returns WIS for Insight", () => {
    expect(getSkillAbility("Insight")).toBe("WIS");
  });
  it("returns CHA for Intimidation", () => {
    expect(getSkillAbility("Intimidation")).toBe("CHA");
  });
  it("returns INT for Investigation", () => {
    expect(getSkillAbility("Investigation")).toBe("INT");
  });
  it("returns WIS for Medicine", () => {
    expect(getSkillAbility("Medicine")).toBe("WIS");
  });
  it("returns INT for Nature", () => {
    expect(getSkillAbility("Nature")).toBe("INT");
  });
  it("returns WIS for Perception", () => {
    expect(getSkillAbility("Perception")).toBe("WIS");
  });
  it("returns CHA for Performance", () => {
    expect(getSkillAbility("Performance")).toBe("CHA");
  });
  it("returns CHA for Persuasion", () => {
    expect(getSkillAbility("Persuasion")).toBe("CHA");
  });
  it("returns INT for Religion", () => {
    expect(getSkillAbility("Religion")).toBe("INT");
  });
  it("returns DEX for Sleight of Hand", () => {
    expect(getSkillAbility("Sleight of Hand")).toBe("DEX");
  });
  it("returns DEX for Stealth", () => {
    expect(getSkillAbility("Stealth")).toBe("DEX");
  });
  it("returns WIS for Survival", () => {
    expect(getSkillAbility("Survival")).toBe("WIS");
  });
  it("throws for unknown skill", () => {
    expect(() => getSkillAbility("Underwater Basketweaving")).toThrow();
  });
});

describe("getSkillMod", () => {
  it("returns ability mod without proficiency", () => {
    // DEX 14 → mod +2
    expect(getSkillMod(baseScores, null, "Acrobatics", 3, [])).toBe(2);
  });

  it("adds proficiency bonus when proficient", () => {
    // DEX 14 → mod +2, prof +3 = +5
    expect(getSkillMod(baseScores, null, "Acrobatics", 3, ["Acrobatics"])).toBe(5);
  });

  it("applies ability swap before calculating mod", () => {
    // Swap DEX (14, +2) and STR (10, +0), Acrobatics now uses STR mod = 0
    const swap = { score1: "DEX" as const, score2: "STR" as const };
    expect(getSkillMod(baseScores, swap, "Acrobatics", 3, [])).toBe(0);
  });

  it("applies proficiency after ability swap", () => {
    // Swap DEX (14) and STR (10), Acrobatics uses STR (+0) + prof 3 = 3
    const swap = { score1: "DEX" as const, score2: "STR" as const };
    expect(getSkillMod(baseScores, swap, "Acrobatics", 3, ["Acrobatics"])).toBe(3);
  });

  it("calculates negative mod correctly", () => {
    // CHA 8 → mod -1
    expect(getSkillMod(baseScores, null, "Deception", 3, [])).toBe(-1);
  });

  it("calculates INT-based skill mod", () => {
    // INT 16 → mod +3
    expect(getSkillMod(baseScores, null, "Arcana", 2, [])).toBe(3);
    // with proficiency +2 = +5
    expect(getSkillMod(baseScores, null, "Arcana", 2, ["Arcana"])).toBe(5);
  });
});

describe("getSaveMod", () => {
  it("returns ability mod without proficiency", () => {
    // CON 12 → mod +1
    expect(getSaveMod(baseScores, null, "CON", 3, [])).toBe(1);
  });

  it("adds proficiency bonus when save is proficient", () => {
    // INT 16 → mod +3, prof +3 = +6
    expect(getSaveMod(baseScores, null, "INT", 3, ["INT"])).toBe(6);
  });

  it("applies ability swap before calculating save mod", () => {
    // Swap STR (10) and INT (16): STR save now uses INT value (16, +3)
    const swap = { score1: "STR" as const, score2: "INT" as const };
    expect(getSaveMod(baseScores, swap, "STR", 3, [])).toBe(3);
  });

  it("calculates negative save correctly", () => {
    // CHA 8 → mod -1
    expect(getSaveMod(baseScores, null, "CHA", 2, [])).toBe(-1);
  });

  it("does not add proficiency for non-proficient save", () => {
    expect(getSaveMod(baseScores, null, "DEX", 3, ["STR", "CON"])).toBe(2);
  });
});

describe("getPassiveScore", () => {
  it("returns 10 + skill mod", () => {
    expect(getPassiveScore(3)).toBe(13);
    expect(getPassiveScore(-1)).toBe(9);
    expect(getPassiveScore(0)).toBe(10);
  });
});

describe("formatCheckBreakdown", () => {
  it("formats breakdown with no label", () => {
    expect(formatCheckBreakdown(15, "", 3, 18)).toBe("d20(15)(+3) = 18");
  });

  it("formats breakdown with a label", () => {
    expect(formatCheckBreakdown(10, "Athletics", 4, 14)).toBe(
      "d20(10) + Athletics(+4) = 14"
    );
  });

  it("formats negative modifier correctly", () => {
    expect(formatCheckBreakdown(12, "", -1, 11)).toBe("d20(12)(-1) = 11");
  });
});

describe("rollCheck", () => {
  it("normal mode uses single d20 roll", () => {
    vi.mocked(rollDie).mockReturnValue(15);
    const result = rollCheck(3);
    expect(rollDie).toHaveBeenCalledTimes(1);
    expect(result.d20).toBe(15);
    expect(result.d20Second).toBeUndefined();
    expect(result.total).toBe(18);
    expect(result.rollMode).toBe("normal");
    expect(result.isNat20).toBe(false);
    expect(result.isNat1).toBe(false);
  });

  it("detects nat 20", () => {
    vi.mocked(rollDie).mockReturnValue(20);
    const result = rollCheck(0);
    expect(result.isNat20).toBe(true);
    expect(result.isNat1).toBe(false);
  });

  it("detects nat 1", () => {
    vi.mocked(rollDie).mockReturnValue(1);
    const result = rollCheck(0);
    expect(result.isNat1).toBe(true);
    expect(result.isNat20).toBe(false);
  });

  it("advantage mode picks higher of two rolls", () => {
    vi.mocked(rollDie).mockReturnValueOnce(8).mockReturnValueOnce(15);
    const result = rollCheck(2, "advantage");
    expect(rollDie).toHaveBeenCalledTimes(2);
    expect(result.d20).toBe(8);
    expect(result.d20Second).toBe(15);
    expect(result.total).toBe(17); // max(8,15)+2
    expect(result.rollMode).toBe("advantage");
  });

  it("disadvantage mode picks lower of two rolls", () => {
    vi.mocked(rollDie).mockReturnValueOnce(15).mockReturnValueOnce(8);
    const result = rollCheck(2, "disadvantage");
    expect(rollDie).toHaveBeenCalledTimes(2);
    expect(result.d20).toBe(15);
    expect(result.d20Second).toBe(8);
    expect(result.total).toBe(10); // min(15,8)+2
    expect(result.rollMode).toBe("disadvantage");
  });

  it("includes breakdown string", () => {
    vi.mocked(rollDie).mockReturnValue(10);
    const result = rollCheck(3);
    expect(result.breakdown).toBe("d20(10)(+3) = 13");
  });
});
