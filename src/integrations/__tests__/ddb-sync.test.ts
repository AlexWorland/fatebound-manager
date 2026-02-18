import { describe, it, expect } from "vitest";
import {
  generateAbilityScoreSync,
  generateHPSync,
  generateSpellSlotSync,
  generateConditionSync,
  generateInventorySync,
  generateCurrencySync,
  generateFullSync,
  importFromDDB,
} from "../ddb-sync";
import type { Character, DailyState, DDBSyncSettings } from "@/types/character";

// ── Fixtures ──────────────────────────────────────────────────────────────

const BASE_SYNC_SETTINGS: DDBSyncSettings = {
  enabled: true,
  syncAbilityScores: true,
  syncHP: true,
  syncSpellSlots: true,
  syncConditions: true,
  syncInventory: true,
  syncCurrency: true,
  lastSyncedAt: null,
};

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    name: "Test Hero",
    level: 5,
    abilityScores: { STR: 16, DEX: 14, CON: 12, INT: 10, WIS: 8, CHA: 13 },
    permanentSkills: ["Perception", "Stealth"],
    permanentMemorySlot: null,
    asiChoices: [],
    background: "Soldier",
    inventory: [
      {
        id: "item-1",
        name: "Longsword",
        quantity: 1,
        weight: 3,
        description: "A standard longsword",
        isEquipped: true,
        isMagic: false,
      },
    ],
    currency: { cp: 10, sp: 20, ep: 0, gp: 50, pp: 0 },
    notes: "",
    ddbCharacterId: "99999",
    ddbSyncSettings: BASE_SYNC_SETTINGS,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeDailyState(overrides: Partial<DailyState> = {}): DailyState {
  return {
    id: "ds-1",
    characterId: "char-1",
    date: "2026-01-15",
    dawnRoll: { die1: 10, chosen: 10 },
    dawnRollOutcome: "UNSTABLE",
    formType: "CHAOS",
    residualMemorySlots: [],
    abilitySwap: null,
    currentHP: 30,
    tempHP: 5,
    spellSlots: {
      "1": { used: 1, max: 4 },
      "2": { used: 0, max: 3 },
      "3": { used: 2, max: 2 },
    },
    classResources: {},
    chaosSurgeUsed: false,
    twistOfFateUsed: false,
    defyFateUsed: false,
    fateResistanceSave: null,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("generateAbilityScoreSync", () => {
  it("generates one payload per ability score", () => {
    const scores = { STR: 16, DEX: 14, CON: 12, INT: 10, WIS: 8, CHA: 13 };
    const payloads = generateAbilityScoreSync("99999", scores, null);

    expect(payloads).toHaveLength(6);
    expect(payloads[0]).toEqual({
      tool: "set_ability_score",
      params: { characterId: "99999", ability: "str", value: 16 },
    });
    expect(payloads[5]).toEqual({
      tool: "set_ability_score",
      params: { characterId: "99999", ability: "cha", value: 13 },
    });
  });

  it("applies ability swap when present", () => {
    const scores = { STR: 16, DEX: 14, CON: 12, INT: 10, WIS: 8, CHA: 13 };
    const swap = { score1: "STR" as const, score2: "DEX" as const };
    const payloads = generateAbilityScoreSync("99999", scores, swap);

    const strPayload = payloads.find((p) => p.params.ability === "str");
    const dexPayload = payloads.find((p) => p.params.ability === "dex");
    expect(strPayload?.params.value).toBe(14);
    expect(dexPayload?.params.value).toBe(16);
  });
});

describe("generateHPSync", () => {
  it("generates correct HP payload", () => {
    const payload = generateHPSync("99999", 30, 40, 5);
    expect(payload).toEqual({
      tool: "update_hp",
      params: { characterId: "99999", currentHp: 30, maxHp: 40, tempHp: 5 },
    });
  });
});

describe("generateSpellSlotSync", () => {
  it("generates one payload per spell level", () => {
    const slots = {
      "1": { used: 1, max: 4 },
      "2": { used: 0, max: 3 },
    };
    const payloads = generateSpellSlotSync("99999", slots);

    expect(payloads).toHaveLength(2);
    expect(payloads[0]).toEqual({
      tool: "update_spell_slots",
      params: { characterId: "99999", level: 1, used: 1, max: 4 },
    });
    expect(payloads[1]).toEqual({
      tool: "update_spell_slots",
      params: { characterId: "99999", level: 2, used: 0, max: 3 },
    });
  });

  it("returns empty array when no spell slots", () => {
    expect(generateSpellSlotSync("99999", {})).toEqual([]);
  });
});

describe("generateConditionSync", () => {
  it("adds new conditions not present on DDB", () => {
    const state = makeDailyState({
      classResources: { exhaustion: { used: 2, max: 6 } },
    });
    const calls = generateConditionSync("99999", state, []);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual({
      tool: "add_condition",
      params: { characterId: "99999", condition: "Exhaustion" },
    });
  });

  it("removes conditions no longer active", () => {
    const state = makeDailyState({ classResources: {} });
    const calls = generateConditionSync("99999", state, ["Exhaustion"]);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual({
      tool: "remove_condition",
      params: { characterId: "99999", condition: "Exhaustion" },
    });
  });

  it("produces no calls when conditions match", () => {
    const state = makeDailyState({
      classResources: { exhaustion: { used: 1, max: 6 } },
    });
    const calls = generateConditionSync("99999", state, ["Exhaustion"]);
    expect(calls).toHaveLength(0);
  });
});

describe("generateInventorySync", () => {
  it("maps inventory items to DDB format", () => {
    const items = [
      {
        id: "i1",
        name: "Shield",
        quantity: 1,
        weight: 6,
        description: "A wooden shield",
        isEquipped: true,
        isMagic: false,
      },
    ];
    const payload = generateInventorySync("99999", items);

    expect(payload.tool).toBe("add_inventory_items");
    expect(payload.params.items).toEqual([
      { name: "Shield", quantity: 1, equipped: true, description: "A wooden shield" },
    ]);
  });
});

describe("generateCurrencySync", () => {
  it("maps currency to DDB format", () => {
    const currency = { cp: 10, sp: 20, ep: 0, gp: 50, pp: 0 };
    const payload = generateCurrencySync("99999", currency);

    expect(payload).toEqual({
      tool: "update_currency",
      params: { characterId: "99999", cp: 10, sp: 20, ep: 0, gp: 50, pp: 0 },
    });
  });
});

describe("generateFullSync", () => {
  it("generates all sync calls when all toggles enabled", () => {
    const character = makeCharacter();
    const dailyState = makeDailyState();
    const result = generateFullSync(character, dailyState);

    expect(result.errors).toHaveLength(0);
    expect(result.skipped).toHaveLength(0);

    // 6 ability scores + 1 HP + 3 spell slots + 0 conditions (none active) + 1 inventory + 1 currency = 12
    expect(result.calls).toHaveLength(12);
  });

  it("returns error when no DDB character ID", () => {
    const character = makeCharacter({ ddbCharacterId: null });
    const result = generateFullSync(character, makeDailyState());

    expect(result.calls).toHaveLength(0);
    expect(result.errors).toContain("No D&D Beyond character ID configured");
  });

  it("returns error when sync disabled", () => {
    const character = makeCharacter({
      ddbSyncSettings: { ...BASE_SYNC_SETTINGS, enabled: false },
    });
    const result = generateFullSync(character, makeDailyState());

    expect(result.calls).toHaveLength(0);
    expect(result.errors).toContain("D&D Beyond sync is not enabled");
  });

  it("skips fields that are toggled off", () => {
    const character = makeCharacter({
      ddbSyncSettings: {
        ...BASE_SYNC_SETTINGS,
        syncHP: false,
        syncInventory: false,
      },
    });
    const result = generateFullSync(character, makeDailyState());

    expect(result.skipped).toContain("hp");
    expect(result.skipped).toContain("inventory");
    expect(result.calls.find((c) => c.tool === "update_hp")).toBeUndefined();
    expect(result.calls.find((c) => c.tool === "add_inventory_items")).toBeUndefined();
  });

  it("reports errors for daily-state-dependent fields when no daily state", () => {
    const character = makeCharacter();
    const result = generateFullSync(character, null);

    expect(result.errors).toContain("HP sync requires an active daily state");
    expect(result.errors).toContain("Spell slot sync requires an active daily state");
    expect(result.errors).toContain("Condition sync requires an active daily state");
    // Ability scores and inventory/currency should still work
    expect(result.calls.filter((c) => c.tool === "set_ability_score")).toHaveLength(6);
    expect(result.calls.find((c) => c.tool === "add_inventory_items")).toBeDefined();
    expect(result.calls.find((c) => c.tool === "update_currency")).toBeDefined();
  });

  it("includes condition add calls when exhaustion is present", () => {
    const character = makeCharacter();
    const dailyState = makeDailyState({
      classResources: { exhaustion: { used: 3, max: 6 } },
    });
    const result = generateFullSync(character, dailyState);

    const conditionCalls = result.calls.filter((c) => c.tool === "add_condition");
    expect(conditionCalls).toHaveLength(1);
    expect(conditionCalls[0].params.condition).toBe("Exhaustion");
  });
});

describe("importFromDDB", () => {
  it("maps DDB character data to our Character type", () => {
    const ddbData = {
      id: 123456,
      name: "Imported Hero",
      stats: [
        { id: 1, value: 18 },
        { id: 2, value: 14 },
        { id: 3, value: 16 },
        { id: 4, value: 10 },
        { id: 5, value: 12 },
        { id: 6, value: 8 },
      ],
      hitPoints: { current: 45, temp: 0, max: 50 },
      inventory: [
        {
          name: "Greatsword",
          quantity: 1,
          equipped: true,
          definition: { description: "A heavy blade", weight: 6, magic: false },
        },
        {
          name: "Potion of Healing",
          quantity: 3,
          equipped: false,
          definition: { description: "Heals 2d4+2 HP", weight: 0.5, magic: true },
        },
      ],
      currencies: { cp: 5, sp: 10, ep: 0, gp: 100, pp: 2 },
    };

    const result = importFromDDB(ddbData);

    expect(result.name).toBe("Imported Hero");
    expect(result.ddbCharacterId).toBe("123456");
    expect(result.abilityScores).toEqual({
      STR: 18,
      DEX: 14,
      CON: 16,
      INT: 10,
      WIS: 12,
      CHA: 8,
    });
    expect(result.inventory).toHaveLength(2);
    expect(result.inventory![0].name).toBe("Greatsword");
    expect(result.inventory![0].isEquipped).toBe(true);
    expect(result.inventory![0].isMagic).toBe(false);
    expect(result.inventory![1].isMagic).toBe(true);
    expect(result.currency).toEqual({ cp: 5, sp: 10, ep: 0, gp: 100, pp: 2 });
  });

  it("handles missing optional fields gracefully", () => {
    const ddbData = {
      id: 999,
      name: "Minimal",
      stats: [{ id: 1, value: 10 }],
      hitPoints: { current: 10, temp: 0, max: 10 },
      inventory: [{ name: "Rock", quantity: 1, equipped: false }],
      currencies: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    };

    const result = importFromDDB(ddbData);
    expect(result.inventory![0].weight).toBe(0);
    expect(result.inventory![0].description).toBe("");
    expect(result.inventory![0].isMagic).toBe(false);
  });
});
