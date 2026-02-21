import { describe, it, expect } from "vitest";
import {
  resolveMaxUses,
  resolveRecoveryType,
  initSpellSlots,
  initClassResources,
  initChaosResources,
} from "../resource-init";
import type { AbilityScores } from "@/types/character";
import type { BaseFeature, PrimaryFeature } from "@/types/forms";

const DEFAULT_SCORES: AbilityScores = {
  STR: 10,
  DEX: 14,
  CON: 12,
  INT: 16,
  WIS: 14,
  CHA: 18,
};

describe("resolveMaxUses", () => {
  const level = 5;
  const profBonus = 3;

  it("parses 'proficiency bonus/day'", () => {
    expect(resolveMaxUses("proficiency bonus/day", level, profBonus, DEFAULT_SCORES)).toBe(3);
  });

  it("parses 'proficiency bonus/long rest'", () => {
    expect(resolveMaxUses("proficiency bonus/long rest", level, profBonus, DEFAULT_SCORES)).toBe(3);
  });

  it("parses 'CHA mod/short or long rest'", () => {
    // CHA 18 → mod 4
    expect(resolveMaxUses("CHA mod/short or long rest", level, profBonus, DEFAULT_SCORES)).toBe(4);
  });

  it("parses 'INT mod/long rest'", () => {
    // INT 16 → mod 3
    expect(resolveMaxUses("INT mod/long rest", level, profBonus, DEFAULT_SCORES)).toBe(3);
  });

  it("clamps ability mod to minimum 1", () => {
    const lowScores: AbilityScores = { ...DEFAULT_SCORES, CHA: 8 }; // mod -1
    expect(resolveMaxUses("CHA mod/long rest", level, profBonus, lowScores)).toBe(1);
  });

  it("parses 'prof bonus + WIS mod'", () => {
    // prof 3 + WIS mod 2 = 5
    expect(resolveMaxUses("prof bonus + WIS mod", level, profBonus, DEFAULT_SCORES)).toBe(5);
  });

  it("parses 'prof bonus + CHA mod'", () => {
    // prof 3 + CHA mod 4 = 7
    expect(resolveMaxUses("prof bonus + CHA mod", level, profBonus, DEFAULT_SCORES)).toBe(7);
  });

  it("parses '1 + CHA mod/long rest'", () => {
    // 1 + CHA mod 4 = 5
    expect(resolveMaxUses("1 + CHA mod/long rest", level, profBonus, DEFAULT_SCORES)).toBe(5);
  });

  it("parses 'Fatebound level × 5 HP pool'", () => {
    expect(resolveMaxUses("Fatebound level × 5 HP pool", level, profBonus, DEFAULT_SCORES)).toBe(25);
  });

  it("parses '1 use/rest'", () => {
    expect(resolveMaxUses("1 use/rest", level, profBonus, DEFAULT_SCORES)).toBe(1);
  });

  it("parses '2 uses/rest'", () => {
    expect(resolveMaxUses("2 uses/rest", level, profBonus, DEFAULT_SCORES)).toBe(2);
  });

  it("parses '1/day'", () => {
    expect(resolveMaxUses("1/day", level, profBonus, DEFAULT_SCORES)).toBe(1);
  });

  it("parses '1/long rest'", () => {
    expect(resolveMaxUses("1/long rest", level, profBonus, DEFAULT_SCORES)).toBe(1);
  });
});

describe("resolveRecoveryType", () => {
  it("returns 'short' for 'short or long rest'", () => {
    expect(resolveRecoveryType("CHA mod/short or long rest")).toBe("short");
  });

  it("returns 'short' for '/rest' without long qualifier", () => {
    expect(resolveRecoveryType("1 use/rest")).toBe("short");
    expect(resolveRecoveryType("2 uses/rest")).toBe("short");
  });

  it("returns 'long' for '/long rest'", () => {
    expect(resolveRecoveryType("1/long rest")).toBe("long");
    expect(resolveRecoveryType("proficiency bonus/long rest")).toBe("long");
  });

  it("returns 'long' for '/day'", () => {
    expect(resolveRecoveryType("proficiency bonus/day")).toBe("long");
    expect(resolveRecoveryType("1/day")).toBe("long");
  });
});

describe("initSpellSlots", () => {
  it("returns empty for non-casters", () => {
    expect(initSpellSlots(5, false)).toEqual({});
  });

  it("returns half-caster slots for level 5", () => {
    const slots = initSpellSlots(5, true);
    expect(slots["1"]).toEqual({ used: 0, max: 4, recovery: "long" });
    expect(slots["2"]).toEqual({ used: 0, max: 2, recovery: "long" });
    // No 3rd+ level slots at level 5
    expect(slots["3"]).toBeUndefined();
    expect(slots["4"]).toBeUndefined();
  });

  it("returns pact magic for Warlock", () => {
    const slots = initSpellSlots(9, true, true);
    expect(slots["pact"]).toEqual({ used: 0, max: 2, recovery: "short" });
    // Should not have normal spell slots
    expect(slots["1"]).toBeUndefined();
  });

  it("adds mystic arcanum at level 13", () => {
    const slots = initSpellSlots(13, true);
    expect(slots["arcanum_6"]).toEqual({ used: 0, max: 1, recovery: "long" });
    expect(slots["arcanum_7"]).toBeUndefined();
  });

  it("adds both arcanum levels at level 17", () => {
    const slots = initSpellSlots(17, true);
    expect(slots["arcanum_6"]).toEqual({ used: 0, max: 1, recovery: "long" });
    expect(slots["arcanum_7"]).toEqual({ used: 0, max: 1, recovery: "long" });
  });
});

describe("initClassResources", () => {
  it("creates resources for features with resourceKey", () => {
    const features: BaseFeature[] = [
      { name: "Rage", description: "Rage stuff", resourceKey: "rage", maxUses: "proficiency bonus/day" },
      { name: "Reckless Attack", description: "No resource" },
    ];
    const result = initClassResources(features, 5, 3, DEFAULT_SCORES);
    expect(result).toEqual({
      rage: { used: 0, max: 3, recovery: "long" },
    });
  });

  it("respects level requirements in description", () => {
    const features: BaseFeature[] = [
      {
        name: "Flash of Genius",
        description: "Level 7+: Reaction to add INT mod.",
        resourceKey: "flash_of_genius",
        maxUses: "INT mod/long rest",
      },
    ];
    // Level 5 — should skip
    expect(initClassResources(features, 5, 3, DEFAULT_SCORES)).toEqual({});
    // Level 7 — should include
    const result = initClassResources(features, 7, 3, DEFAULT_SCORES);
    expect(result["flash_of_genius"]).toEqual({ used: 0, max: 3, recovery: "long" });
  });

  it("handles Channel Divinity at-will and Level 6+ upgrade", () => {
    const features: BaseFeature[] = [
      {
        name: "Channel Divinity",
        description: "Turn Undead — each undead within 30 ft...",
        resourceKey: "channel_divinity",
        maxUses: "1 use/rest",
      },
    ];
    const result = initClassResources(features, 3, 2, DEFAULT_SCORES);
    expect(result["channel_divinity"]).toEqual({ used: 0, max: 1, recovery: "short" });
  });
});

describe("initChaosResources", () => {
  it("returns empty for features without resourcePool", () => {
    const feature: PrimaryFeature = {
      id: 5,
      name: "Fighting Style + Extra Attack",
      className: "Fighter",
      description: "...",
      hasSpellcasting: false,
    };
    expect(initChaosResources(feature, 5, 3, DEFAULT_SCORES)).toEqual({});
  });

  it("resolves rage uses from proficiency bonus", () => {
    const feature: PrimaryFeature = {
      id: 1,
      name: "Rage",
      className: "Barbarian",
      description: "...",
      hasSpellcasting: false,
      resourcePool: "rage",
    };
    const result = initChaosResources(feature, 5, 3, DEFAULT_SCORES);
    expect(result).toEqual({
      rage: { used: 0, max: 3, recovery: "long" },
    });
  });

  it("resolves lay_on_hands from level × 5", () => {
    const feature: PrimaryFeature = {
      id: 7,
      name: "Divine Smite + Lay on Hands + Spellcasting",
      className: "Paladin",
      description: "...",
      hasSpellcasting: true,
      resourcePool: "lay_on_hands",
    };
    const result = initChaosResources(feature, 10, 4, DEFAULT_SCORES);
    expect(result).toEqual({
      lay_on_hands: { used: 0, max: 50, recovery: "long" },
    });
  });

  it("resolves ki from profBonus + WIS mod", () => {
    const feature: PrimaryFeature = {
      id: 6,
      name: "Ki",
      className: "Monk",
      description: "...",
      hasSpellcasting: false,
      resourcePool: "ki",
    };
    // prof 3 + WIS mod 2 = 5
    const result = initChaosResources(feature, 5, 3, DEFAULT_SCORES);
    expect(result).toEqual({
      ki: { used: 0, max: 5, recovery: "short" },
    });
  });

  it("resolves sorcery_points from profBonus + CHA mod", () => {
    const feature: PrimaryFeature = {
      id: 10,
      name: "Sorcery Points + Metamagic + Spellcasting",
      className: "Sorcerer",
      description: "...",
      hasSpellcasting: true,
      resourcePool: "sorcery_points",
    };
    // prof 3 + CHA mod 4 = 7
    const result = initChaosResources(feature, 5, 3, DEFAULT_SCORES);
    expect(result).toEqual({
      sorcery_points: { used: 0, max: 7, recovery: "long" },
    });
  });
});
