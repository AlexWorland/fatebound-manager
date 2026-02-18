"use client";

import React, { useState } from "react";
import { Character, DailyState } from "@/types/character";
import { Card, PipTracker } from "@/components/ui";
import { FATEBOUND_SPELLS } from "@/data/spells";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { getMysticArcanumLevels } from "@/engine/spell-slots";

interface Props {
  character: Character;
  dailyState: DailyState | null;
  onDailyStateChange: (state: DailyState) => void;
}

function SpellCard({ spell }: { spell: (typeof FATEBOUND_SPELLS)[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-subtle last:border-0">
      <button
        className="w-full flex items-start gap-3 py-2 text-left group"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-bg-elevated text-xs font-mono text-text-secondary border border-border-subtle">
          {spell.level === 0 ? "C" : spell.level}
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-body text-text-primary group-hover:text-text-highlight transition-colors">
            {spell.name}
          </span>
          <span className="text-xs text-text-secondary ml-2">{spell.school}</span>
        </div>
        <span className="text-xs text-text-secondary mt-0.5">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="pb-3 pl-8 text-xs font-body text-text-secondary space-y-1">
          <p>
            <span className="text-text-primary">Casting Time:</span> {spell.castingTime}
          </p>
          <p>
            <span className="text-text-primary">Range:</span> {spell.range}
          </p>
          <p>
            <span className="text-text-primary">Components:</span> {spell.components}
          </p>
          <p>
            <span className="text-text-primary">Duration:</span> {spell.duration}
          </p>
          <p className="leading-relaxed mt-2">{spell.description}</p>
        </div>
      )}
    </div>
  );
}

export default function SpellsTab({ character, dailyState, onDailyStateChange }: Props) {
  // Determine if the current form has spellcasting
  const hasSpellcasting = (() => {
    if (!dailyState) return false;
    if (dailyState.formType === "STABILIZED" && dailyState.stabilizedFormId) {
      const form = STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId);
      return form?.hasSpellcasting ?? false;
    }
    // Chaos form — spellcasting comes from Table B; spellSlots will be non-empty
    return Object.values(dailyState.spellSlots).some((s) => s.max > 0);
  })();

  const mysticArcanumLevels = getMysticArcanumLevels(character.level);

  const handleSlotToggle = async (slotLevel: string, index: number) => {
    if (!dailyState) return;
    const tracker = dailyState.spellSlots[slotLevel];
    if (!tracker) return;

    const currentUsed = tracker.used;
    // Clicking pip at index: if index < used, reduce used; else increase
    const newUsed =
      index < currentUsed
        ? index
        : Math.min(index + 1, tracker.max);

    const newState: DailyState = {
      ...dailyState,
      spellSlots: {
        ...dailyState.spellSlots,
        [slotLevel]: { ...tracker, used: newUsed },
      },
    };
    onDailyStateChange(newState);

    try {
      await fetch(`/api/characters/${character.id}/daily-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spellSlots: newState.spellSlots }),
      });
    } catch {
      // Ignore network errors here; parent state already updated optimistically
    }
  };

  if (!hasSpellcasting) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <p className="text-text-secondary font-body text-sm">
            {dailyState
              ? "Today's form does not grant spellcasting."
              : "No dawn roll recorded. Spellcasting depends on today's form."}
          </p>
        </Card>
        <Card>
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Fatebound Spell List (Reference)
          </h3>
          <div>
            {FATEBOUND_SPELLS.map((spell) => (
              <SpellCard key={spell.name} spell={spell} />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const slotEntries = Object.entries(dailyState!.spellSlots)
    .filter(([, tracker]) => tracker.max > 0)
    .sort(([a], [b]) => Number(a) - Number(b));

  return (
    <div className="flex flex-col gap-4">
      {/* Spell slots */}
      {slotEntries.length > 0 && (
        <Card variant="fate">
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Spell Slots
          </h3>
          <div className="flex flex-col gap-3">
            {slotEntries.map(([level, tracker]) => (
              <PipTracker
                key={level}
                label={`Level ${level}`}
                max={tracker.max}
                used={tracker.used}
                color="bg-fate"
                onToggle={(i) => handleSlotToggle(level, i)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Mystic Arcanum (level 13+) */}
      {mysticArcanumLevels.length > 0 && (
        <Card variant="fate">
          <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Mystic Arcanum
          </h3>
          <div className="flex flex-col gap-3">
            {mysticArcanumLevels.map((slotLevel) => {
              const key = `arcanum_${slotLevel}`;
              const tracker = dailyState?.spellSlots[key] ?? { max: 1, used: 0 };
              return (
                <PipTracker
                  key={key}
                  label={`${slotLevel}th-level (1/LR)`}
                  max={tracker.max}
                  used={tracker.used}
                  color="bg-fate"
                  onToggle={(i) => handleSlotToggle(key, i)}
                />
              );
            })}
          </div>
        </Card>
      )}

      {/* Fatebound spell list */}
      <Card>
        <h3 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Fatebound Spells
        </h3>
        <div>
          {FATEBOUND_SPELLS.map((spell) => (
            <SpellCard key={spell.name} spell={spell} />
          ))}
        </div>
      </Card>
    </div>
  );
}
