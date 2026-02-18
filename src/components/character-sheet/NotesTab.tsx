"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui";
import type { SessionNote } from "@/types/character";

interface NotesTabProps {
  notes: SessionNote[];
  onAddNote: (note: Omit<SessionNote, "id" | "characterId" | "date">) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, update: Partial<Pick<SessionNote, "title" | "content" | "tags">>) => void;
}

function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs font-body px-2 py-0.5 rounded-full bg-bg-elevated border border-border-subtle text-text-secondary"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}

function NoteCard({
  note,
  onDelete,
  onUpdate,
}: {
  note: SessionNote;
  onDelete: () => void;
  onUpdate: (update: Partial<Pick<SessionNote, "title" | "content" | "tags">>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editTagsStr, setEditTagsStr] = useState(note.tags.join(", "));

  function saveEdit() {
    const tags = editTagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onUpdate({ title: editTitle.trim() || "Untitled", content: editContent, tags });
    setIsEditing(false);
  }

  function cancelEdit() {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTagsStr(note.tags.join(", "));
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <Card className="flex flex-col gap-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="bg-bg-elevated border border-border-subtle rounded px-2 py-1.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent"
          placeholder="Note title"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={5}
          className="bg-bg-elevated border border-border-subtle rounded px-2 py-1.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent resize-y"
          placeholder="Note content..."
        />
        <input
          type="text"
          value={editTagsStr}
          onChange={(e) => setEditTagsStr(e.target.value)}
          className="bg-bg-elevated border border-border-subtle rounded px-2 py-1.5 text-text-secondary font-body text-xs focus:outline-none focus:border-accent"
          placeholder="Tags: combat, session-3, important"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={cancelEdit}
            className="text-xs font-body px-3 py-1 rounded border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="text-xs font-body px-3 py-1 rounded bg-accent hover:bg-accent-hover text-text-highlight transition-colors"
          >
            Save
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-body font-semibold text-text-highlight">{note.title}</h4>
          <p className="text-xs text-text-secondary font-body mt-0.5">{note.date}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-body px-2 py-0.5 rounded border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs font-body px-2 py-0.5 rounded border border-border-subtle text-text-secondary hover:text-accent transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      {note.content && (
        <p className="text-sm font-body text-text-secondary mt-2 leading-relaxed whitespace-pre-wrap">
          {note.content}
        </p>
      )}
      <TagList tags={note.tags} />
    </Card>
  );
}

export default function NotesTab({ notes, onAddNote, onDeleteNote, onUpdateNote }: NotesTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTagsStr, setNewTagsStr] = useState("");

  function submitNote() {
    const tags = newTagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onAddNote({ title: newTitle.trim() || "Untitled", content: newContent, tags });
    setNewTitle("");
    setNewContent("");
    setNewTagsStr("");
    setShowAddForm(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="text-xs font-body px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-text-highlight transition-colors"
        >
          + New Note
        </button>
      </div>

      {/* Add note form */}
      {showAddForm && (
        <Card className="flex flex-col gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-bg-elevated border border-border-subtle rounded px-2 py-1.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent"
            placeholder="Note title"
            autoFocus
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={5}
            className="bg-bg-elevated border border-border-subtle rounded px-2 py-1.5 text-text-primary font-body text-sm focus:outline-none focus:border-accent resize-y"
            placeholder="Note content..."
          />
          <input
            type="text"
            value={newTagsStr}
            onChange={(e) => setNewTagsStr(e.target.value)}
            className="bg-bg-elevated border border-border-subtle rounded px-2 py-1.5 text-text-secondary font-body text-xs focus:outline-none focus:border-accent"
            placeholder="Tags (comma-separated): combat, session-3"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs font-body px-3 py-1 rounded border border-border-subtle text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitNote}
              className="text-xs font-body px-3 py-1 rounded bg-accent hover:bg-accent-hover text-text-highlight transition-colors"
            >
              Add Note
            </button>
          </div>
        </Card>
      )}

      {/* Note list */}
      {notes.length > 0 ? (
        <div className="flex flex-col gap-3">
          {[...notes].reverse().map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => onDeleteNote(note.id)}
              onUpdate={(update) => onUpdateNote(note.id, update)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-text-secondary font-body py-8">
          No session notes yet. Add your first note above.
        </div>
      )}
    </div>
  );
}
