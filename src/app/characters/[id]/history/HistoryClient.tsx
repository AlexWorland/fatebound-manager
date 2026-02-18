"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import type { Character, FormHistory, SessionNote } from "@/types/character";

interface FormSummarySnapshot {
  formType?: "CHAOS" | "STABILIZED";
  dawnRollOutcome?: string;
  dawnRoll?: { die1: number; die2?: number; chosen: number };
  // Chaos form fields
  chassisName?: string;
  primaryFeature?: string;
  defensiveFeature?: string;
  feats?: string[];
  // Stabilized form fields
  stabilizedFormName?: string;
  stabilizedSubclassName?: string;
  secondaryFormName?: string;
}

interface HistoryClientProps {
  character: Character;
  history: FormHistory[];
  notes: SessionNote[];
}

const OUTCOME_COLORS: Record<string, string> = {
  DM_DESIGN: "text-text-secondary border-border-subtle",
  DEEP_CHAOS: "text-hp-red border-hp-red",
  UNSTABLE: "text-hp-yellow border-hp-yellow",
  GUIDED: "text-fate-glow border-fate",
  FAVORED: "text-fate-glow border-fate",
  MASTER: "text-text-highlight border-accent",
};

const OUTCOME_LABELS: Record<string, string> = {
  DM_DESIGN: "DM Design",
  DEEP_CHAOS: "Deep Chaos",
  UNSTABLE: "Unstable",
  GUIDED: "Guided",
  FAVORED: "Favored",
  MASTER: "Master",
};

export default function HistoryClient({
  character,
  history,
  notes,
}: HistoryClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    history.length > 0 ? history[0].id : null
  );

  // Build a map: date -> notes for that day
  const notesByDate = new Map<string, SessionNote[]>();
  for (const note of notes) {
    const existing = notesByDate.get(note.date) ?? [];
    existing.push(note);
    notesByDate.set(note.date, existing);
  }

  return (
    <div className="min-h-screen bg-bg-deep p-6 max-w-2xl mx-auto">
      {/* Header */}
      <a
        href={`/characters/${character.id}`}
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm font-body mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Character
      </a>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-3xl text-text-highlight">Form History</h1>
          <p className="text-text-secondary mt-1 text-sm">
            {character.name} — {history.length} day{history.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border-subtle" />

          <div className="space-y-4">
            {history.map((entry, idx) => {
              const summary = entry.formSummary as FormSummarySnapshot;
              const isExpanded = expandedId === entry.id;
              const dayNotes = notesByDate.get(entry.date) ?? [];
              const isFirst = idx === 0;

              return (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  summary={summary}
                  dayNotes={dayNotes}
                  isExpanded={isExpanded}
                  isFirst={isFirst}
                  onToggle={() =>
                    setExpandedId(isExpanded ? null : entry.id)
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────

interface TimelineEntryProps {
  entry: FormHistory;
  summary: FormSummarySnapshot;
  dayNotes: SessionNote[];
  isExpanded: boolean;
  isFirst: boolean;
  onToggle: () => void;
}

function TimelineEntry({
  entry,
  summary,
  dayNotes,
  isExpanded,
  isFirst,
  onToggle,
}: TimelineEntryProps) {
  const outcome = summary.dawnRollOutcome ?? "UNSTABLE";
  const outcomeColor = OUTCOME_COLORS[outcome] ?? OUTCOME_COLORS.UNSTABLE;
  const outcomeLabel = OUTCOME_LABELS[outcome] ?? outcome;
  const formType = summary.formType ?? "CHAOS";

  const roll = summary.dawnRoll;
  const rollDisplay = roll
    ? roll.die2
      ? `${roll.die1} / ${roll.die2} → ${roll.chosen}`
      : `${roll.chosen}`
    : "—";

  const formName =
    formType === "STABILIZED"
      ? summary.stabilizedFormName ?? "Stabilized Form"
      : "Chaos Form";

  return (
    <div className="relative pl-12">
      {/* Timeline dot */}
      <div
        className={`absolute left-3.5 top-4 w-3 h-3 rounded-full border-2 bg-bg-deep ${
          isFirst ? "border-accent" : "border-border-subtle"
        }`}
      />

      <Card
        variant={isFirst ? "accent" : "default"}
        className="cursor-pointer select-none"
      >
        {/* Collapsed header — always visible */}
        <button
          onClick={onToggle}
          className="w-full text-left"
          aria-expanded={isExpanded}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading text-sm text-text-highlight">
                  {formatDate(entry.date)}
                </span>
                <span
                  className={`text-xs border rounded px-1.5 py-0.5 font-mono ${outcomeColor}`}
                >
                  {outcomeLabel}
                </span>
                <span
                  className={`text-xs rounded px-1.5 py-0.5 font-body ${
                    formType === "STABILIZED"
                      ? "bg-fate/20 text-fate-glow"
                      : "bg-accent/20 text-accent"
                  }`}
                >
                  {formType === "STABILIZED" ? "Stabilized" : "Chaos"}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-0.5 truncate">
                {formName}
                {summary.stabilizedSubclassName
                  ? ` — ${summary.stabilizedSubclassName}`
                  : ""}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {roll && (
                <div className="text-right">
                  <div className="text-xs text-text-secondary uppercase tracking-widest">
                    Roll
                  </div>
                  <div className="font-mono text-sm text-text-primary">
                    {rollDisplay}
                  </div>
                </div>
              )}
              <svg
                className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border-subtle space-y-4">
            <FormDetails summary={summary} />

            {entry.retainableFeatures.length > 0 && (
              <RetainedFeatures features={entry.retainableFeatures} />
            )}

            {dayNotes.length > 0 && (
              <DayNotes notes={dayNotes} />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Form Details ─────────────────────────────────────────────────────────────

function FormDetails({ summary }: { summary: FormSummarySnapshot }) {
  if (summary.formType === "STABILIZED") {
    return (
      <div className="space-y-2">
        <SectionLabel>Form Details</SectionLabel>
        <DetailRow label="Form" value={summary.stabilizedFormName ?? "—"} />
        {summary.stabilizedSubclassName && (
          <DetailRow label="Subclass" value={summary.stabilizedSubclassName} />
        )}
        {summary.secondaryFormName && (
          <DetailRow label="Secondary (Dual Nature)" value={summary.secondaryFormName} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <SectionLabel>Chaos Form</SectionLabel>
      {summary.chassisName && (
        <DetailRow label="Chassis" value={summary.chassisName} />
      )}
      {summary.primaryFeature && (
        <DetailRow label="Primary" value={summary.primaryFeature} />
      )}
      {summary.defensiveFeature && (
        <DetailRow label="Defensive" value={summary.defensiveFeature} />
      )}
      {summary.feats && summary.feats.length > 0 && (
        <DetailRow label="Feats" value={summary.feats.join(", ")} />
      )}
    </div>
  );
}

// ─── Retained Features ────────────────────────────────────────────────────────

import type { RetainableFeature } from "@/types/features";

const CATEGORY_LABELS: Record<number, string> = {
  1: "Combat",
  2: "Utility",
  3: "Spellcasting",
  4: "Defense",
  5: "Social",
  6: "Exploration",
};

const CATEGORY_COLORS: Record<number, string> = {
  1: "bg-hp-red/20 text-hp-red",
  2: "bg-border-subtle text-text-secondary",
  3: "bg-fate/20 text-fate-glow",
  4: "bg-hp-green/20 text-hp-green",
  5: "bg-hp-yellow/20 text-hp-yellow",
  6: "bg-border-accent/20 text-text-secondary",
};

function RetainedFeatures({ features }: { features: RetainableFeature[] }) {
  return (
    <div>
      <SectionLabel>Retained via Residual Memory</SectionLabel>
      <div className="flex flex-wrap gap-2 mt-2">
        {features.map((f) => (
          <div
            key={f.featureId}
            className="flex items-center gap-1.5 bg-bg-elevated border border-border-subtle rounded px-2 py-1"
            title={f.description}
          >
            <span
              className={`text-xs rounded px-1 py-0.5 font-mono ${
                CATEGORY_COLORS[f.category] ?? "bg-bg-hover text-text-secondary"
              }`}
            >
              {CATEGORY_LABELS[f.category] ?? `Cat ${f.category}`}
            </span>
            <span className="text-xs text-text-primary">{f.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Day Notes ────────────────────────────────────────────────────────────────

function DayNotes({ notes }: { notes: SessionNote[] }) {
  return (
    <div>
      <SectionLabel>Session Notes</SectionLabel>
      <div className="space-y-2 mt-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-bg-elevated rounded-lg px-3 py-2 border border-border-subtle"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-heading text-text-primary">
                {note.title}
              </span>
              {note.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap justify-end">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-bg-hover text-text-secondary rounded px-1.5 py-0.5 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {note.content && (
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                {note.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-4xl mb-4 opacity-30">📜</div>
      <h2 className="font-heading text-lg text-text-secondary mb-2">
        No History Yet
      </h2>
      <p className="text-text-secondary text-sm max-w-xs mx-auto">
        Complete a Dawn Roll to start recording your character{"'"}s form history.
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-text-secondary uppercase tracking-widest font-body">
      {children}
    </p>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-text-secondary w-24 flex-shrink-0">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00"); // avoid tz offset issues
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
