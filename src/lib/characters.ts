import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";
import { initSchema } from "./schema";
import type { Character } from "@/types/character";

// JSON fields that need serialization
const JSON_FIELDS = [
  "ability_scores",
  "permanent_skills",
  "asi_choices",
  "inventory",
  "currency",
  "ddb_sync_settings",
] as const;

type CharacterRow = {
  id: string;
  name: string;
  level: number;
  ability_scores: string;
  permanent_skills: string;
  permanent_memory_slot: string | null;
  asi_choices: string;
  background: string;
  inventory: string;
  currency: string;
  notes: string;
  ddb_character_id: string | null;
  ddb_sync_settings: string | null;
  equipped_weapons: string;
  sage_grimoire: string;
  created_at: string;
  updated_at: string;
};

function rowToCharacter(row: CharacterRow): Character {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    abilityScores: JSON.parse(row.ability_scores),
    permanentSkills: JSON.parse(row.permanent_skills),
    permanentMemorySlot: row.permanent_memory_slot,
    asiChoices: JSON.parse(row.asi_choices),
    background: row.background,
    inventory: JSON.parse(row.inventory),
    equippedWeapons: JSON.parse(row.equipped_weapons),
    sageGrimoire: JSON.parse(row.sage_grimoire ?? "[]"),
    currency: JSON.parse(row.currency),
    notes: row.notes,
    ddbCharacterId: row.ddb_character_id,
    ddbSyncSettings: row.ddb_sync_settings
      ? JSON.parse(row.ddb_sync_settings)
      : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAllCharacters(): Character[] {
  initSchema();
  const db = getDb();
  const rows = db.prepare("SELECT * FROM characters ORDER BY created_at DESC").all() as CharacterRow[];
  return rows.map(rowToCharacter);
}

export function getCharacterById(id: string): Character | null {
  initSchema();
  const db = getDb();
  const row = db.prepare("SELECT * FROM characters WHERE id = ?").get(id) as CharacterRow | undefined;
  return row ? rowToCharacter(row) : null;
}

export function createCharacter(
  data: Omit<Character, "id" | "createdAt" | "updatedAt">
): Character {
  initSchema();
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO characters (
      id, name, level, ability_scores, permanent_skills, permanent_memory_slot,
      asi_choices, background, inventory, currency, notes,
      ddb_character_id, ddb_sync_settings, equipped_weapons, sage_grimoire,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.name,
    data.level,
    JSON.stringify(data.abilityScores),
    JSON.stringify(data.permanentSkills),
    data.permanentMemorySlot,
    JSON.stringify(data.asiChoices),
    data.background,
    JSON.stringify(data.inventory),
    JSON.stringify(data.currency),
    data.notes,
    data.ddbCharacterId,
    data.ddbSyncSettings ? JSON.stringify(data.ddbSyncSettings) : null,
    JSON.stringify(data.equippedWeapons),
    JSON.stringify(data.sageGrimoire ?? []),
    now,
    now
  );

  return getCharacterById(id)!;
}

export function updateCharacter(
  id: string,
  data: Partial<Omit<Character, "id" | "createdAt" | "updatedAt">>
): Character | null {
  initSchema();
  const db = getDb();
  const existing = getCharacterById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const merged = { ...existing, ...data };

  db.prepare(`
    UPDATE characters SET
      name = ?, level = ?, ability_scores = ?, permanent_skills = ?,
      permanent_memory_slot = ?, asi_choices = ?, background = ?,
      inventory = ?, currency = ?, notes = ?,
      ddb_character_id = ?, ddb_sync_settings = ?, equipped_weapons = ?,
      sage_grimoire = ?, updated_at = ?
    WHERE id = ?
  `).run(
    merged.name,
    merged.level,
    JSON.stringify(merged.abilityScores),
    JSON.stringify(merged.permanentSkills),
    merged.permanentMemorySlot,
    JSON.stringify(merged.asiChoices),
    merged.background,
    JSON.stringify(merged.inventory),
    JSON.stringify(merged.currency),
    merged.notes,
    merged.ddbCharacterId,
    merged.ddbSyncSettings ? JSON.stringify(merged.ddbSyncSettings) : null,
    JSON.stringify(merged.equippedWeapons),
    JSON.stringify(merged.sageGrimoire ?? []),
    now,
    id
  );

  return getCharacterById(id);
}

export function deleteCharacter(id: string): boolean {
  initSchema();
  const db = getDb();
  const result = db.prepare("DELETE FROM characters WHERE id = ?").run(id);
  return result.changes > 0;
}

// Suppress unused variable warning for JSON_FIELDS (kept for documentation)
void JSON_FIELDS;
