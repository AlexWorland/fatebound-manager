import { describe, it, expect } from "vitest";
import { applyShortRest, applyLongRest } from "../rest";
import type { DailyState } from "@/types/character";

function makeDailyState(overrides: Partial<DailyState> = {}): DailyState {
  return {
    id: "ds-1",
    characterId: "char-1",
    date: "2026-02-20",
    dawnRoll: { die1: 15, chosen: 15 },
    dawnRollOutcome: "GUIDED",
    formType: "STABILIZED",
    stabilizedFormId: 1,
    residualMemorySlots: [],
    abilitySwap: null,
    currentHP: 20,
    tempHP: 0,
    spellSlots: {
      "1": { used: 2, max: 4, recovery: "long" },
      "2": { used: 1, max: 2, recovery: "long" },
      pact: { used: 2, max: 2, recovery: "short" },
    },
    classResources: {
      rage: { used: 1, max: 3, recovery: "long" },
      channel_divinity: { used: 1, max: 1, recovery: "short" },
      ki: { used: 3, max: 5, recovery: "short" },
    },
    hitDice: { used: 2, max: 5, recovery: "long" },
    chaosSurgeUsed: true,
    twistOfFateUsed: true,
    defyFateUsed: false,
    fateResistanceSave: null,
    autoRollResults: {},
    ...overrides,
  };
}

describe("applyShortRest", () => {
  it("resets short-rest recovery resources to used: 0", () => {
    const state = makeDailyState();
    const result = applyShortRest(state, 0, 10, 2, 50);

    // Short rest resources should reset
    expect(result.classResources!.channel_divinity.used).toBe(0);
    expect(result.classResources!.ki.used).toBe(0);
    // Pact magic (short rest recovery) should reset
    expect(result.spellSlots!.pact.used).toBe(0);

    // Long rest resources should NOT reset
    expect(result.classResources!.rage.used).toBe(1);
    expect(result.spellSlots!["1"].used).toBe(2);
    expect(result.spellSlots!["2"].used).toBe(1);
  });

  it("heals HP when hit dice are spent", () => {
    const state = makeDailyState({ currentHP: 20 });
    // hitDie=10 → avg = floor(10/2)+1 = 6, +2 CON mod = 8 HP per die
    const result = applyShortRest(state, 2, 10, 2, 50);

    expect(result.currentHP).toBe(20 + 16); // 36
    expect(result.hitDice!.used).toBe(4); // was 2, spent 2 more
  });

  it("caps HP at maxHP", () => {
    const state = makeDailyState({ currentHP: 45 });
    const result = applyShortRest(state, 2, 10, 2, 50);

    expect(result.currentHP).toBe(50); // capped at maxHP
  });

  it("handles zero hit dice spent", () => {
    const state = makeDailyState({ currentHP: 20 });
    const result = applyShortRest(state, 0, 10, 2, 50);

    expect(result.currentHP).toBe(20); // no healing
    expect(result.hitDice!.used).toBe(2); // unchanged
  });

  it("preserves recovery metadata on trackers", () => {
    const state = makeDailyState();
    const result = applyShortRest(state, 0, 8, 1, 50);

    expect(result.spellSlots!["1"].recovery).toBe("long");
    expect(result.spellSlots!.pact.recovery).toBe("short");
    expect(result.classResources!.rage.recovery).toBe("long");
    expect(result.classResources!.ki.recovery).toBe("short");
  });
});

describe("applyLongRest", () => {
  it("resets ALL spell slots to used: 0", () => {
    const state = makeDailyState();
    const result = applyLongRest(state, 50);

    expect(result.spellSlots!["1"].used).toBe(0);
    expect(result.spellSlots!["2"].used).toBe(0);
    expect(result.spellSlots!.pact.used).toBe(0);
  });

  it("resets ALL class resources to used: 0", () => {
    const state = makeDailyState();
    const result = applyLongRest(state, 50);

    expect(result.classResources!.rage.used).toBe(0);
    expect(result.classResources!.channel_divinity.used).toBe(0);
    expect(result.classResources!.ki.used).toBe(0);
  });

  it("restores HP to max and clears temp HP", () => {
    const state = makeDailyState({ currentHP: 20, tempHP: 5 });
    const result = applyLongRest(state, 50);

    expect(result.currentHP).toBe(50);
    expect(result.tempHP).toBe(0);
  });

  it("resets all fate ability flags", () => {
    const state = makeDailyState({
      chaosSurgeUsed: true,
      twistOfFateUsed: true,
      defyFateUsed: true,
    });
    const result = applyLongRest(state, 50);

    expect(result.chaosSurgeUsed).toBe(false);
    expect(result.twistOfFateUsed).toBe(false);
    expect(result.defyFateUsed).toBe(false);
  });

  it("recovers half of spent hit dice", () => {
    // 2 spent out of 5 → recover floor(5/2) = 2 → used = max(0, 2-2) = 0
    const state = makeDailyState({ hitDice: { used: 2, max: 5, recovery: "long" } });
    const result = applyLongRest(state, 50);
    expect(result.hitDice!.used).toBe(0);
  });

  it("recovers half hit dice (rounds down recovery)", () => {
    // 4 spent out of 7 → recover floor(7/2) = 3 → used = max(0, 4-3) = 1
    const state = makeDailyState({ hitDice: { used: 4, max: 7, recovery: "long" } });
    const result = applyLongRest(state, 50);
    expect(result.hitDice!.used).toBe(1);
  });

  it("does not go below 0 used hit dice", () => {
    // 1 spent out of 10 → recover floor(10/2) = 5 → used = max(0, 1-5) = 0
    const state = makeDailyState({ hitDice: { used: 1, max: 10, recovery: "long" } });
    const result = applyLongRest(state, 50);
    expect(result.hitDice!.used).toBe(0);
  });

  it("preserves recovery metadata on trackers", () => {
    const state = makeDailyState();
    const result = applyLongRest(state, 50);

    expect(result.spellSlots!["1"].recovery).toBe("long");
    expect(result.spellSlots!.pact.recovery).toBe("short");
    expect(result.classResources!.rage.recovery).toBe("long");
  });
});
