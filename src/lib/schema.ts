import { getDb } from "./db";

const CREATE_CHARACTERS = `
  CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    ability_scores TEXT NOT NULL,
    permanent_skills TEXT NOT NULL,
    permanent_memory_slot TEXT,
    asi_choices TEXT NOT NULL DEFAULT '[]',
    background TEXT NOT NULL DEFAULT '',
    inventory TEXT NOT NULL DEFAULT '[]',
    currency TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    ddb_character_id TEXT,
    ddb_sync_settings TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

const CREATE_DAILY_STATES = `
  CREATE TABLE IF NOT EXISTS daily_states (
    id TEXT PRIMARY KEY,
    character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    dawn_roll TEXT NOT NULL,
    dawn_roll_outcome TEXT NOT NULL,
    form_type TEXT NOT NULL,
    form_data TEXT NOT NULL DEFAULT '{}',
    residual_memory TEXT NOT NULL DEFAULT '[]',
    ability_swap TEXT,
    resources TEXT NOT NULL DEFAULT '{}',
    feature_usage TEXT NOT NULL DEFAULT '{}',
    current_hp INTEGER NOT NULL DEFAULT 0,
    temp_hp INTEGER NOT NULL DEFAULT 0,
    UNIQUE(character_id, date)
  )
`;

const CREATE_FORM_HISTORY = `
  CREATE TABLE IF NOT EXISTS form_history (
    id TEXT PRIMARY KEY,
    character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    form_summary TEXT NOT NULL,
    retainable_features TEXT NOT NULL DEFAULT '[]'
  )
`;

const CREATE_SESSION_NOTES = `
  CREATE TABLE IF NOT EXISTS session_notes (
    id TEXT PRIMARY KEY,
    character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]'
  )
`;

export function initSchema(): void {
  const db = getDb();
  db.exec(CREATE_CHARACTERS);
  db.exec(CREATE_DAILY_STATES);
  db.exec(CREATE_FORM_HISTORY);
  db.exec(CREATE_SESSION_NOTES);
  try {
    db.exec(
      "ALTER TABLE characters ADD COLUMN equipped_weapons TEXT NOT NULL DEFAULT '[]'"
    );
  } catch {
    // Column already exists
  }
  try {
    db.exec(
      "ALTER TABLE characters ADD COLUMN sage_grimoire TEXT NOT NULL DEFAULT '[]'"
    );
  } catch {
    // Column already exists
  }
}
