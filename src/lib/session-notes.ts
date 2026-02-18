import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";
import { initSchema } from "./schema";
import type { SessionNote } from "@/types/character";

type SessionNoteRow = {
  id: string;
  character_id: string;
  date: string;
  title: string;
  content: string;
  tags: string;
};

function rowToSessionNote(row: SessionNoteRow): SessionNote {
  return {
    id: row.id,
    characterId: row.character_id,
    date: row.date,
    title: row.title,
    content: row.content,
    tags: JSON.parse(row.tags),
  };
}

export function getSessionNotes(characterId: string): SessionNote[] {
  initSchema();
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM session_notes WHERE character_id = ? ORDER BY date DESC")
    .all(characterId) as SessionNoteRow[];
  return rows.map(rowToSessionNote);
}

export function createSessionNote(note: Omit<SessionNote, "id">): SessionNote {
  initSchema();
  const db = getDb();
  const id = uuidv4();

  db.prepare(`
    INSERT INTO session_notes (id, character_id, date, title, content, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    note.characterId,
    note.date,
    note.title,
    note.content,
    JSON.stringify(note.tags)
  );

  const row = db.prepare("SELECT * FROM session_notes WHERE id = ?").get(id) as SessionNoteRow;
  return rowToSessionNote(row);
}

export function updateSessionNote(
  id: string,
  data: Partial<Omit<SessionNote, "id" | "characterId" | "date">>
): SessionNote | null {
  initSchema();
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM session_notes WHERE id = ?")
    .get(id) as SessionNoteRow | undefined;
  if (!existing) return null;

  const current = rowToSessionNote(existing);
  const merged = { ...current, ...data };

  db.prepare(`
    UPDATE session_notes SET title = ?, content = ?, tags = ? WHERE id = ?
  `).run(merged.title, merged.content, JSON.stringify(merged.tags), id);

  const row = db.prepare("SELECT * FROM session_notes WHERE id = ?").get(id) as SessionNoteRow;
  return rowToSessionNote(row);
}

export function deleteSessionNote(id: string): void {
  initSchema();
  const db = getDb();
  db.prepare("DELETE FROM session_notes WHERE id = ?").run(id);
}
