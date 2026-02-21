import { describe, it, expect } from "vitest";
import { extractSpellEffect, extractSpellHitDC } from "../spell-utils";

describe("extractSpellEffect", () => {
  it("extracts damage dice with type", () => {
    expect(extractSpellEffect("Deal 2d8 fire damage to the target")).toBe("2d8 fire");
  });

  it("extracts damage dice without type", () => {
    expect(extractSpellEffect("The target takes 3d6 damage")).toBe("3d6");
  });

  it("extracts healing", () => {
    expect(extractSpellEffect("The creature regains 2d8 + 3 hit points")).toBe("Heal 2d8 + 3");
  });

  it("detects frightened condition", () => {
    expect(extractSpellEffect("The target becomes frightened of you")).toBe("Frightened");
  });

  it("detects charmed condition", () => {
    expect(extractSpellEffect("The creature is charmed by you for the duration")).toBe("Charmed");
  });

  it("detects restrained condition", () => {
    expect(extractSpellEffect("A creature restrained by the webs can use its action to escape")).toBe("Restrained");
  });

  it("detects blinded condition", () => {
    expect(extractSpellEffect("A creature in the area is blinded")).toBe("Blinded");
  });

  it("detects stunned condition", () => {
    expect(extractSpellEffect("On a failed save, the target is stunned until the end of your next turn")).toBe("Stunned");
  });

  it("detects paralyzed condition", () => {
    expect(extractSpellEffect("The target is paralyzed for the duration")).toBe("Paralyzed");
  });

  it("detects poisoned condition", () => {
    expect(extractSpellEffect("The target is poisoned")).toBe("Poisoned");
  });

  it("detects advantage", () => {
    expect(extractSpellEffect("You have advantage on the next attack roll")).toBe("Advantage");
  });

  it("detects disadvantage", () => {
    expect(extractSpellEffect("The target has disadvantage on attack rolls")).toBe("Disadvantage");
  });

  it("returns dash for utility spells with no matches", () => {
    expect(extractSpellEffect("You teleport to an unoccupied space within range")).toBe("—");
  });

  it("prioritizes damage over conditions", () => {
    expect(extractSpellEffect("Deal 1d10 radiant damage, and the target is blinded"))
      .toBe("1d10 radiant");
  });
});

describe("extractSpellHitDC", () => {
  it("detects spell attack", () => {
    expect(extractSpellHitDC("Make a ranged spell attack against the target", 7, 15)).toBe("+7");
  });

  it("detects ranged attack", () => {
    expect(extractSpellHitDC("Make a ranged attack roll", 5, 13)).toBe("+5");
  });

  it("detects melee attack", () => {
    expect(extractSpellHitDC("Make a melee attack against one creature", 6, 14)).toBe("+6");
  });

  it("detects Dexterity saving throw", () => {
    expect(extractSpellHitDC("Each creature must make a Dexterity saving throw", 7, 15)).toBe("DC 15 DEX");
  });

  it("detects Wisdom saving throw", () => {
    expect(extractSpellHitDC("The target must succeed on a Wisdom saving throw", 7, 15)).toBe("DC 15 WIS");
  });

  it("detects Constitution saving throw", () => {
    expect(extractSpellHitDC("The creature must make a Constitution saving throw", 7, 15)).toBe("DC 15 CON");
  });

  it("detects Strength saving throw", () => {
    expect(extractSpellHitDC("Each creature must succeed on a Strength saving throw", 7, 15)).toBe("DC 15 STR");
  });

  it("detects Intelligence saving throw", () => {
    expect(extractSpellHitDC("The target must make an Intelligence saving throw", 7, 15)).toBe("DC 15 INT");
  });

  it("detects Charisma saving throw", () => {
    expect(extractSpellHitDC("The target must succeed on a Charisma saving throw", 7, 15)).toBe("DC 15 CHA");
  });

  it("returns dash for utility spells", () => {
    expect(extractSpellHitDC("You create a glowing hand", 7, 15)).toBe("—");
  });

  it("prioritizes attack over saving throw when both present", () => {
    expect(extractSpellHitDC("Make a spell attack. On hit the target makes a Wisdom saving throw", 7, 15)).toBe("+7");
  });
});
