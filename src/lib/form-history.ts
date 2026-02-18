import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";
import { initSchema } from "./schema";
import type { FormHistory } from "@/types/character";

type FormHistoryRow = {
  id: string;
  character_id: string;
  date: string;
  form_summary: string;
  retainable_features: string;
};

function rowToFormHistory(row: FormHistoryRow): FormHistory {
  return {
    id: row.id,
    characterId: row.character_id,
    date: row.date,
    formSummary: JSON.parse(row.form_summary),
    retainableFeatures: JSON.parse(row.retainable_features),
  };
}

export function getFormHistory(characterId: string, limit?: number): FormHistory[] {
  initSchema();
  const db = getDb();
  const query = limit
    ? "SELECT * FROM form_history WHERE character_id = ? ORDER BY date DESC LIMIT ?"
    : "SELECT * FROM form_history WHERE character_id = ? ORDER BY date DESC";
  const rows = (
    limit
      ? db.prepare(query).all(characterId, limit)
      : db.prepare(query).all(characterId)
  ) as FormHistoryRow[];
  return rows.map(rowToFormHistory);
}

export function saveFormHistory(entry: Omit<FormHistory, "id">): FormHistory {
  initSchema();
  const db = getDb();
  const id = uuidv4();

  db.prepare(`
    INSERT INTO form_history (id, character_id, date, form_summary, retainable_features)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    entry.characterId,
    entry.date,
    JSON.stringify(entry.formSummary),
    JSON.stringify(entry.retainableFeatures)
  );

  const row = db.prepare("SELECT * FROM form_history WHERE id = ?").get(id) as FormHistoryRow;
  return rowToFormHistory(row);
}
