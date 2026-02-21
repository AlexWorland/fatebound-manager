import { describe, it, expect } from "vitest";
import {
  getCasterProfile,
  getCantripsKnown,
  getSageGrimoireCapacity,
  validateSpellSelection,
  getMaxSpellLevel,
} from "../spell-prep";
import type { AbilityScores } from "@/types/character";

const DEFAULT_SCORES: AbilityScores = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

function scores(overrides: Partial<AbilityScores> = {}): AbilityScores {
  return { ...DEFAULT_SCORES, ...overrides };
}

describe("getCasterProfile", () => {
  it("returns prepared caster profile for Cleric", () => {
    const profile = getCasterProfile("Cleric", 5, scores({ WIS: 16 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("prepared");
    expect(profile!.spellList).toBe("Cleric");
    expect(profile!.castingAbility).toBe("WIS");
    expect(profile!.maxPreparedOrKnown).toBe(6); // prof(3) + WIS(3)
    expect(profile!.cantripsKnown).toBe(4);
  });

  it("returns known caster profile for Bard", () => {
    const profile = getCasterProfile("Bard", 5, scores({ CHA: 14 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("known");
    expect(profile!.spellList).toBe("Bard");
    expect(profile!.castingAbility).toBe("CHA");
    expect(profile!.maxPreparedOrKnown).toBe(5); // prof(3) + CHA(2)
    expect(profile!.cantripsKnown).toBe(3);
  });

  it("returns prepared caster profile for Druid", () => {
    const profile = getCasterProfile("Druid", 9, scores({ WIS: 18 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("prepared");
    expect(profile!.spellList).toBe("Druid");
    expect(profile!.castingAbility).toBe("WIS");
    expect(profile!.maxPreparedOrKnown).toBe(8); // prof(4) + WIS(4)
    expect(profile!.cantripsKnown).toBe(2);
  });

  it("returns prepared caster profile for Paladin with 0 cantrips", () => {
    const profile = getCasterProfile("Paladin", 5, scores({ CHA: 14 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("prepared");
    expect(profile!.spellList).toBe("Paladin");
    expect(profile!.cantripsKnown).toBe(0);
    expect(profile!.maxPreparedOrKnown).toBe(5); // prof(3) + CHA(2)
  });

  it("returns known caster profile for Ranger with 0 cantrips", () => {
    const profile = getCasterProfile("Ranger", 5, scores({ WIS: 14 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("known");
    expect(profile!.spellList).toBe("Ranger");
    expect(profile!.cantripsKnown).toBe(0);
    expect(profile!.maxPreparedOrKnown).toBe(5); // prof(3) + WIS(2)
  });

  it("returns known caster profile for Sorcerer", () => {
    const profile = getCasterProfile("Sorcerer", 1, scores({ CHA: 16 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("known");
    expect(profile!.spellList).toBe("Sorcerer");
    expect(profile!.cantripsKnown).toBe(5);
    expect(profile!.maxPreparedOrKnown).toBe(5); // prof(2) + CHA(3)
  });

  it("returns pact caster profile for Warlock", () => {
    const profile = getCasterProfile("Warlock", 5, scores({ CHA: 16 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("pact");
    expect(profile!.spellList).toBe("Warlock");
    expect(profile!.castingAbility).toBe("CHA");
    expect(profile!.maxPreparedOrKnown).toBe(6); // prof(3) + CHA(3)
    expect(profile!.cantripsKnown).toBe(2);
  });

  it("returns grimoire caster profile for Wizard (stabilized)", () => {
    const profile = getCasterProfile("Wizard", 5, scores({ INT: 18 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("grimoire");
    expect(profile!.spellList).toBe("Wizard");
    expect(profile!.castingAbility).toBe("INT");
    expect(profile!.maxPreparedOrKnown).toBe(7); // prof(3) + INT(4)
    expect(profile!.cantripsKnown).toBe(3);
  });

  it("returns prepared caster profile for Artificer", () => {
    const profile = getCasterProfile("Artificer", 5, scores({ INT: 16 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.mechanic).toBe("prepared");
    expect(profile!.spellList).toBe("Artificer");
    expect(profile!.castingAbility).toBe("INT");
    expect(profile!.maxPreparedOrKnown).toBe(6); // prof(3) + INT(3)
    expect(profile!.cantripsKnown).toBe(2);
  });

  it("returns null for non-caster class", () => {
    expect(getCasterProfile("Fighter", 5, DEFAULT_SCORES, false)).toBeNull();
    expect(getCasterProfile("Barbarian", 5, DEFAULT_SCORES, false)).toBeNull();
    expect(getCasterProfile("Rogue", 5, DEFAULT_SCORES, false)).toBeNull();
  });

  it("enforces minimum 1 for maxPreparedOrKnown", () => {
    // Very low ability score: prof(2) + mod(-2) = 0, minimum 1
    const profile = getCasterProfile("Cleric", 1, scores({ WIS: 6 }), false);
    expect(profile).not.toBeNull();
    expect(profile!.maxPreparedOrKnown).toBe(1);
  });

  describe("chaos form overrides", () => {
    it("Chaos Wizard uses known mechanic instead of grimoire", () => {
      const profile = getCasterProfile("Wizard", 5, scores({ INT: 16 }), true);
      expect(profile).not.toBeNull();
      expect(profile!.mechanic).toBe("known");
    });

    it("Chaos Wizard uses prof-only count formula", () => {
      const profile = getCasterProfile("Wizard", 5, scores({ INT: 16 }), true);
      expect(profile).not.toBeNull();
      expect(profile!.maxPreparedOrKnown).toBe(3); // prof(3) only, no INT mod
    });

    it("Chaos Wizard cantrips equal proficiency bonus", () => {
      const profile = getCasterProfile("Wizard", 5, scores({ INT: 16 }), true);
      expect(profile).not.toBeNull();
      expect(profile!.cantripsKnown).toBe(3); // prof bonus at level 5
    });

    it("Chaos Cleric cantrips equal proficiency bonus", () => {
      const profile = getCasterProfile("Cleric", 5, scores({ WIS: 16 }), true);
      expect(profile).not.toBeNull();
      expect(profile!.cantripsKnown).toBe(3); // prof bonus at level 5
    });

    it("Chaos Bard cantrips equal proficiency bonus at level 9", () => {
      const profile = getCasterProfile("Bard", 9, scores({ CHA: 14 }), true);
      expect(profile).not.toBeNull();
      expect(profile!.cantripsKnown).toBe(4); // prof bonus at level 9
    });

    it("Chaos non-Wizard casters keep their normal mechanic", () => {
      const clericProfile = getCasterProfile("Cleric", 5, scores({ WIS: 16 }), true);
      expect(clericProfile!.mechanic).toBe("prepared");

      const bardProfile = getCasterProfile("Bard", 5, scores({ CHA: 14 }), true);
      expect(bardProfile!.mechanic).toBe("known");
    });

    it("Chaos non-Wizard casters keep prof+ability count", () => {
      const profile = getCasterProfile("Cleric", 5, scores({ WIS: 16 }), true);
      expect(profile!.maxPreparedOrKnown).toBe(6); // prof(3) + WIS(3)
    });
  });
});

describe("getCantripsKnown", () => {
  it("returns fixed cantrip count for stabilized forms", () => {
    expect(getCantripsKnown("Bard", 5, false)).toBe(3);
    expect(getCantripsKnown("Cleric", 5, false)).toBe(4);
    expect(getCantripsKnown("Druid", 5, false)).toBe(2);
    expect(getCantripsKnown("Paladin", 5, false)).toBe(0);
    expect(getCantripsKnown("Ranger", 5, false)).toBe(0);
    expect(getCantripsKnown("Sorcerer", 5, false)).toBe(5);
    expect(getCantripsKnown("Warlock", 5, false)).toBe(2);
    expect(getCantripsKnown("Wizard", 5, false)).toBe(3);
    expect(getCantripsKnown("Artificer", 5, false)).toBe(2);
  });

  it("returns proficiency bonus for all chaos form casters", () => {
    // Level 1: prof = 2
    expect(getCantripsKnown("Cleric", 1, true)).toBe(2);
    // Level 5: prof = 3
    expect(getCantripsKnown("Wizard", 5, true)).toBe(3);
    // Level 9: prof = 4
    expect(getCantripsKnown("Druid", 9, true)).toBe(4);
    // Level 13: prof = 5
    expect(getCantripsKnown("Sorcerer", 13, true)).toBe(5);
    // Level 17: prof = 6
    expect(getCantripsKnown("Bard", 17, true)).toBe(6);
  });

  it("Stabilized Warlock gets 3 cantrips at level 10+", () => {
    expect(getCantripsKnown("Warlock", 9, false)).toBe(2);
    expect(getCantripsKnown("Warlock", 10, false)).toBe(3);
    expect(getCantripsKnown("Warlock", 15, false)).toBe(3);
    expect(getCantripsKnown("Warlock", 20, false)).toBe(3);
  });

  it("returns 0 for non-caster classes", () => {
    expect(getCantripsKnown("Fighter", 5, false)).toBe(0);
    expect(getCantripsKnown("Fighter", 5, true)).toBe(0);
  });
});

describe("getSageGrimoireCapacity", () => {
  it("returns 4 + level", () => {
    expect(getSageGrimoireCapacity(1)).toBe(5);
    expect(getSageGrimoireCapacity(5)).toBe(9);
    expect(getSageGrimoireCapacity(10)).toBe(14);
    expect(getSageGrimoireCapacity(20)).toBe(24);
  });
});

describe("validateSpellSelection", () => {
  it("returns true when within limit", () => {
    expect(validateSpellSelection(["cure-wounds", "bless"], 5)).toBe(true);
  });

  it("returns true when exactly at limit", () => {
    expect(validateSpellSelection(["cure-wounds", "bless", "shield"], 3)).toBe(true);
  });

  it("returns false when exceeding limit", () => {
    expect(validateSpellSelection(["cure-wounds", "bless", "shield", "fireball"], 3)).toBe(false);
  });

  it("returns true for empty selection", () => {
    expect(validateSpellSelection([], 5)).toBe(true);
  });

  it("returns true for empty selection with 0 max", () => {
    expect(validateSpellSelection([], 0)).toBe(true);
  });

  it("returns false for any selection with 0 max", () => {
    expect(validateSpellSelection(["shield"], 0)).toBe(false);
  });
});

describe("getMaxSpellLevel", () => {
  it("returns 1 at level 1", () => {
    expect(getMaxSpellLevel(1)).toBe(1);
  });

  it("returns 1 at level 4 (before 2nd-level slots)", () => {
    expect(getMaxSpellLevel(4)).toBe(1);
  });

  it("returns 2 at level 5", () => {
    expect(getMaxSpellLevel(5)).toBe(2);
  });

  it("returns 2 at level 8 (before 3rd-level slots)", () => {
    expect(getMaxSpellLevel(8)).toBe(2);
  });

  it("returns 3 at level 9", () => {
    expect(getMaxSpellLevel(9)).toBe(3);
  });

  it("returns 3 at level 12", () => {
    expect(getMaxSpellLevel(12)).toBe(3);
  });

  it("returns 4 at level 13", () => {
    expect(getMaxSpellLevel(13)).toBe(4);
  });

  it("returns 4 at level 16", () => {
    expect(getMaxSpellLevel(16)).toBe(4);
  });

  it("returns 5 at level 17", () => {
    expect(getMaxSpellLevel(17)).toBe(5);
  });

  it("returns 5 at level 20", () => {
    expect(getMaxSpellLevel(20)).toBe(5);
  });
});
