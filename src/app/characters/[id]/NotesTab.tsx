"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Character, SessionNote } from "@/types/character";
import { Card } from "@/components/ui";

interface Props {
  character: Character;
}

function NoteCard({ note }: { note: SessionNote }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border-subtle last:border-0">
      <button
        className="w-full flex items-start gap-3 py-2.5 text-left group"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm font-body text-text-primary group-hover:text-text-highlight transition-colors">
            {note.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-secondary font-mono">{note.date}</span>
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded-full bg-bg-elevated text-text-secondary border border-border-subtle"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span className="text-xs text-text-secondary mt-0.5 shrink-0">
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && note.content && (
        <div className="pb-3 pl-0">
          <p className="text-xs font-body text-text-secondary leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
      )}
    </div>
  );
}

export default function NotesTab({ character }: Props) {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/characters/${character.id}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } finally {
      setLoading(false);
    }
  }, [character.id]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/characters/${character.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setTitle("");
        setContent("");
        setTags("");
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Character notes */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Character Notes
        </h3>
        {character.notes ? (
          <p className="text-sm font-body text-text-secondary leading-relaxed whitespace-pre-wrap">
            {character.notes}
          </p>
        ) : (
          <p className="text-sm text-text-secondary font-body">No notes yet.</p>
        )}
      </Card>

      {/* Session notes */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest">
            Session Notes
          </h3>
          <button
            onClick={() => setShowForm((f) => !f)}
            className="text-xs font-body text-accent hover:text-accent-hover transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Note"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="mb-4 flex flex-col gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
              className="w-full bg-bg-elevated border border-border-subtle rounded px-3 py-1.5 text-sm font-body text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content (optional)"
              rows={4}
              className="w-full bg-bg-elevated border border-border-subtle rounded px-3 py-1.5 text-sm font-body text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent resize-y"
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full bg-bg-elevated border border-border-subtle rounded px-3 py-1.5 text-sm font-body text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="self-end px-4 py-1.5 rounded bg-accent hover:bg-accent-hover text-text-highlight text-sm font-body transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Note"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-text-secondary font-body">Loading notes…</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-text-secondary font-body">No session notes yet.</p>
        ) : (
          <div>
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
