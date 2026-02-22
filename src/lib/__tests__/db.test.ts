import { describe, it, expect, beforeEach, vi } from "vitest";
import Database from "better-sqlite3";
import os from "os";
import path from "path";
import fs from "fs";

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "fatebound-test-"));
const tmpDbPath = path.join(tmpDir, "test.db");

let _db: InstanceType<typeof Database> | null = null;

function getTestDb() {
  if (!_db) {
    _db = new Database(tmpDbPath);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
  }
  return _db;
}

vi.mock("../db", () => ({
  getDb: () => getTestDb(),
  closeDb: () => {
    _db?.close();
    _db = null;
  },
}));

import { initSchema } from "../schema";
import {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../characters";
import { getDailyState, saveDailyState, updateDailyState } from "../daily-states";
import { getFormHistory, saveFormHistory } from "../form-history";
import {
  getSessionNotes,
  createSessionNote,
  updateSessionNote,
  deleteSessionNote,
} from "../session-notes";
import type { Character, DailyState } from "@/types/character";

const DEFAULT_CHARACTER: Omit<Character, "id" | "createdAt" | "updatedAt"> = {
  name: "Test Hero",
  level: 5,
  abilityScores: { STR: 10, DEX: 12, CON: 14, INT: 8, WIS: 11, CHA: 13 },
  permanentSkills: ["Perception", "Athletics"],
  permanentMemorySlot: null,
  asiChoices: [],
  background: "Soldier",
  inventory: [],
  currency: { cp: 0, sp: 10, ep: 0, gp: 5, pp: 0 },
  notes: "Test notes",
  ddbCharacterId: null,
  ddbSyncSettings: null,
  personality: "",
  ideals: "",
  bonds: "",
  flaws: "",
  backstory: "",
  alignment: "",
  appearance: {},
  portraitUrl: null,
};

const DEFAULT_DAILY_STATE: Omit<DailyState, "id"> = {
  characterId: "",
  date: "2026-02-18",
  dawnRoll: { die1: 15, chosen: 15 },
  dawnRollOutcome: "GUIDED",
  formType: "STABILIZED",
  stabilizedFormId: 1,
  stabilizedSubclassId: "tempest-berserker",
  residualMemorySlots: [],
  abilitySwap: null,
  currentHP: 40,
  tempHP: 0,
  hitDiceSpent: 0,
  spellSlots: {},
  classResources: { rage: { used: 0, max: 3 } },
  chaosSurgeUsed: false,
  twistOfFateUsed: false,
  defyFateUsed: false,
  fateResistanceSave: null,
  conditions: [],
  inspiration: false,
  concentrationSpell: null,
  deathSaves: { successes: 0, failures: 0 },
  movementSpeeds: { walking: 30 },
};

beforeEach(() => {
  const db = getTestDb();
  // Ensure schema exists
  initSchema();
  // Wipe between tests
  db.prepare("DELETE FROM session_notes").run();
  db.prepare("DELETE FROM form_history").run();
  db.prepare("DELETE FROM daily_states").run();
  db.prepare("DELETE FROM characters").run();
});

// ─── Characters ───────────────────────────────────────────────────────────────

describe("characters CRUD", () => {
  it("creates and retrieves a character", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    expect(char.id).toBeTruthy();
    expect(char.name).toBe("Test Hero");
    expect(char.level).toBe(5);
    expect(char.abilityScores.STR).toBe(10);
    expect(char.permanentSkills).toEqual(["Perception", "Athletics"]);
    expect(char.currency.gp).toBe(5);
  });

  it("getAllCharacters returns created character", () => {
    createCharacter(DEFAULT_CHARACTER);
    const all = getAllCharacters();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe("Test Hero");
  });

  it("getCharacterById returns null for missing id", () => {
    expect(getCharacterById("nonexistent")).toBeNull();
  });

  it("updates character fields", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const updated = updateCharacter(char.id, { name: "Updated Hero", level: 7 });
    expect(updated?.name).toBe("Updated Hero");
    expect(updated?.level).toBe(7);
    expect(updated?.abilityScores.STR).toBe(10);
  });

  it("updateCharacter returns null for missing id", () => {
    expect(updateCharacter("nonexistent", { name: "X" })).toBeNull();
  });

  it("deletes a character", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    expect(deleteCharacter(char.id)).toBe(true);
    expect(getCharacterById(char.id)).toBeNull();
  });

  it("deleteCharacter returns false for missing id", () => {
    expect(deleteCharacter("nonexistent")).toBe(false);
  });

  it("serializes and deserializes DDB sync settings", () => {
    const char = createCharacter({
      ...DEFAULT_CHARACTER,
      ddbSyncSettings: {
        enabled: true,
        syncAbilityScores: true,
        syncHP: false,
        syncSpellSlots: false,
        syncConditions: false,
        syncInventory: true,
        syncCurrency: true,
        lastSyncedAt: null,
      },
    });
    const retrieved = getCharacterById(char.id);
    expect(retrieved?.ddbSyncSettings?.enabled).toBe(true);
    expect(retrieved?.ddbSyncSettings?.syncHP).toBe(false);
  });
});

// ─── Daily States ─────────────────────────────────────────────────────────────

describe("daily states CRUD", () => {
  it("saves and retrieves a daily state", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const state = saveDailyState({ ...DEFAULT_DAILY_STATE, characterId: char.id });
    expect(state.id).toBeTruthy();
    expect(state.dawnRollOutcome).toBe("GUIDED");
    expect(state.formType).toBe("STABILIZED");
    expect(state.stabilizedFormId).toBe(1);
    expect(state.currentHP).toBe(40);
    expect(state.classResources.rage.max).toBe(3);
  });

  it("getDailyState returns null for missing entry", () => {
    expect(getDailyState("nonexistent", "2026-01-01")).toBeNull();
  });

  it("saveDailyState upserts on conflict (same character+date)", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    saveDailyState({ ...DEFAULT_DAILY_STATE, characterId: char.id });
    const updated = saveDailyState({
      ...DEFAULT_DAILY_STATE,
      characterId: char.id,
      dawnRollOutcome: "MASTER",
    });
    expect(updated.dawnRollOutcome).toBe("MASTER");
  });

  it("updateDailyState patches resource tracking", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const state = saveDailyState({ ...DEFAULT_DAILY_STATE, characterId: char.id });
    const patched = updateDailyState(state.id, {
      currentHP: 25,
      chaosSurgeUsed: true,
    });
    expect(patched?.currentHP).toBe(25);
    expect(patched?.chaosSurgeUsed).toBe(true);
    expect(patched?.dawnRollOutcome).toBe("GUIDED");
  });

  it("serializes CHAOS form data correctly", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const state = saveDailyState({
      ...DEFAULT_DAILY_STATE,
      characterId: char.id,
      formType: "CHAOS",
      dawnRollOutcome: "UNSTABLE",
      chaosTableA: { roll: 3, chassisId: 2 },
      chaosTableB: { roll: 7, featureId: 5 },
      chaosTableC: { roll: 4, featureId: 12 },
      chaosTableD: [{ roll: 22, featId: 14 }],
    });
    expect(state.chaosTableA?.chassisId).toBe(2);
    expect(state.chaosTableD?.[0].featId).toBe(14);
  });

  it("serializes ability swap correctly", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const state = saveDailyState({
      ...DEFAULT_DAILY_STATE,
      characterId: char.id,
      abilitySwap: { score1: "STR", score2: "CHA" },
    });
    expect(state.abilitySwap?.score1).toBe("STR");
    expect(state.abilitySwap?.score2).toBe("CHA");
  });
});

// ─── Form History ─────────────────────────────────────────────────────────────

describe("form history", () => {
  it("saves and retrieves form history", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const entry = saveFormHistory({
      characterId: char.id,
      date: "2026-02-18",
      formSummary: { formId: 1, name: "The Tempest" },
      retainableFeatures: [],
    });
    const history = getFormHistory(char.id);
    expect(history.length).toBe(1);
    expect(history[0].id).toBe(entry.id);
    expect((history[0].formSummary as { name: string }).name).toBe("The Tempest");
  });

  it("respects limit parameter", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    saveFormHistory({ characterId: char.id, date: "2026-02-16", formSummary: {}, retainableFeatures: [] });
    saveFormHistory({ characterId: char.id, date: "2026-02-17", formSummary: {}, retainableFeatures: [] });
    saveFormHistory({ characterId: char.id, date: "2026-02-18", formSummary: {}, retainableFeatures: [] });
    expect(getFormHistory(char.id, 2).length).toBe(2);
    expect(getFormHistory(char.id).length).toBe(3);
  });
});

// ─── Session Notes ────────────────────────────────────────────────────────────

describe("session notes CRUD", () => {
  it("creates and retrieves session notes", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const note = createSessionNote({
      characterId: char.id,
      date: "2026-02-18",
      title: "Session 12",
      content: "The party entered the dungeon.",
      tags: ["dungeon", "combat"],
    });
    const notes = getSessionNotes(char.id);
    expect(notes.length).toBe(1);
    expect(notes[0].title).toBe("Session 12");
    expect(notes[0].tags).toEqual(["dungeon", "combat"]);
    expect(note.id).toBeTruthy();
  });

  it("updates a session note", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const note = createSessionNote({
      characterId: char.id,
      date: "2026-02-18",
      title: "Old Title",
      content: "",
      tags: [],
    });
    const updated = updateSessionNote(note.id, { title: "New Title", tags: ["updated"] });
    expect(updated?.title).toBe("New Title");
    expect(updated?.tags).toEqual(["updated"]);
  });

  it("deletes a session note", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    const note = createSessionNote({
      characterId: char.id,
      date: "2026-02-18",
      title: "Temp Note",
      content: "",
      tags: [],
    });
    deleteSessionNote(note.id);
    expect(getSessionNotes(char.id)).toHaveLength(0);
  });

  it("cascade deletes notes when character is deleted", () => {
    const char = createCharacter(DEFAULT_CHARACTER);
    createSessionNote({ characterId: char.id, date: "2026-02-18", title: "Note", content: "", tags: [] });
    deleteCharacter(char.id);
    expect(getSessionNotes(char.id)).toHaveLength(0);
  });
});
