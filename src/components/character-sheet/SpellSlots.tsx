"use client";

import React from "react";
import { PipTracker } from "@/components/ui";
import type { ResourceTracker } from "@/types/character";

const LEVEL_LABELS: Record<string, string> = {
  "1": "1st Level",
  "2": "2nd Level",
  "3": "3rd Level",
  "4": "4th Level",
  "5": "5th Level",
  "6": "6th Level",
  "7": "7th Level",
  "8": "8th Level",
  "9": "9th Level",
};

interface SpellSlotsProps {
  spellSlots: Record<string, ResourceTracker>;
  onToggle: (level: string, index: number) => void;
}

export default function SpellSlots({ spellSlots, onToggle }: SpellSlotsProps) {
  const entries = Object.entries(spellSlots).sort(
    ([a], [b]) => parseInt(a) - parseInt(b)
  );

  if (entries.length === 0) {
    return (
      <p className="text-sm font-body text-text-secondary">
        No spell slots available for today&apos;s form.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-bg-surface border border-border-subtle rounded-lg">
      <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest">
        Spell Slots
      </h3>
      {entries.map(([level, tracker]) => (
        <PipTracker
          key={level}
          label={LEVEL_LABELS[level] ?? `Level ${level}`}
          max={tracker.max}
          used={tracker.used}
          color="bg-fate"
          onToggle={(i) => onToggle(level, i)}
        />
      ))}
    </div>
  );
}
