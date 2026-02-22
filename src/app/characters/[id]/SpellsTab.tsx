"use client";

import React from "react";
import { Character, DailyState } from "@/types/character";
import { Card, PipTracker } from "@/components/ui";
import SpellRow from "@/components/character-sheet/SpellRow";
import { FATEBOUND_SPELLS } from "@/data/spells";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { getMysticArcanumLevels } from "@/engine/spell-slots";

interface Props {
  character: Character;
  dailyState: DailyState | null;
  onDailyStateChange: (state: DailyState) => void;
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

  // Consume one use of a specific slot level
  const handleCast = async (spellSlotLevel: number) => {
    if (!dailyState) return;
    const key = String(spellSlotLevel);
    const tracker = dailyState.spellSlots[key];
    if (!tracker || tracker.used >= tracker.max) return;

    const newState: DailyState = {
      ...dailyState,
      spellSlots: {
        ...dailyState.spellSlots,
        [key]: { ...tracker, used: tracker.used + 1 },
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
      // Ignore network errors; parent state already updated optimistically
    }
  };

  const currentSpellSlots = dailyState?.spellSlots ?? {};

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
          <div className="flex flex-col gap-1">
            {FATEBOUND_SPELLS.map((spell) => (
              <SpellRow
                key={spell.name}
                name={spell.name}
                level={spell.level}
                school={spell.school}
                castingTime={spell.castingTime}
                range={spell.range}
                components={spell.components}
                duration={spell.duration}
                description={spell.description}
                spellSlots={{}}
                onCast={() => {}}
              />
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
        <div className="flex flex-col gap-1">
          {FATEBOUND_SPELLS.map((spell) => (
            <SpellRow
              key={spell.name}
              name={spell.name}
              level={spell.level}
              school={spell.school}
              castingTime={spell.castingTime}
              range={spell.range}
              components={spell.components}
              duration={spell.duration}
              description={spell.description}
              spellSlots={currentSpellSlots}
              onCast={handleCast}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
