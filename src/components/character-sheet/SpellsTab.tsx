"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui";
import SpellSlots from "./SpellSlots";
import type { DailyState } from "@/types/character";
import type { Spell } from "@/types/features";

interface SpellsTabProps {
  dailyState: DailyState | null;
  availableSpells: Spell[];
  onSlotToggle: (level: string, index: number) => void;
}

const SCHOOL_COLORS: Record<string, string> = {
  abjuration: "text-blue-400",
  conjuration: "text-yellow-400",
  divination: "text-purple-400",
  enchantment: "text-pink-400",
  evocation: "text-red-400",
  illusion: "text-indigo-400",
  necromancy: "text-green-700",
  transmutation: "text-orange-400",
};

function SpellCard({ spell }: { spell: Spell }) {
  const [isOpen, setIsOpen] = useState(false);
  const schoolColor = SCHOOL_COLORS[spell.school.toLowerCase()] ?? "text-text-secondary";
  const levelLabel = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;

  return (
    <Card className="cursor-pointer select-none">
      <button
        className="w-full text-left"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-sm transition-transform duration-150 text-text-secondary ${
                isOpen ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
            <span className="font-body font-semibold text-text-highlight truncate">
              {spell.name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-body capitalize ${schoolColor}`}>
              {spell.school}
            </span>
            <span className="text-xs font-body text-text-secondary border border-border-subtle rounded px-1.5 py-0.5">
              {levelLabel}
            </span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-border-subtle flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-body text-text-secondary">
            <span>
              <span className="text-text-primary">Casting Time:</span> {spell.castingTime}
            </span>
            <span>
              <span className="text-text-primary">Range:</span> {spell.range}
            </span>
            <span>
              <span className="text-text-primary">Components:</span> {spell.components}
            </span>
            <span>
              <span className="text-text-primary">Duration:</span> {spell.duration}
            </span>
          </div>
          <p className="text-sm font-body text-text-secondary leading-relaxed mt-1">
            {spell.description}
          </p>
        </div>
      )}
    </Card>
  );
}

export default function SpellsTab({
  dailyState,
  availableSpells,
  onSlotToggle,
}: SpellsTabProps) {
  const hasSpellcasting = dailyState && Object.keys(dailyState.spellSlots).length > 0;

  if (!hasSpellcasting && availableSpells.length === 0) {
    return (
      <div className="text-center text-text-secondary font-body py-8">
        Today&apos;s form does not include spellcasting.
      </div>
    );
  }

  const cantrips = availableSpells.filter((s) => s.level === 0);
  const leveledSpells = availableSpells.filter((s) => s.level > 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Spell Slots */}
      {dailyState && (
        <SpellSlots spellSlots={dailyState.spellSlots} onToggle={onSlotToggle} />
      )}

      {/* Cantrips */}
      {cantrips.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest">
            Cantrips
          </h3>
          {cantrips.map((spell) => (
            <SpellCard key={spell.name} spell={spell} />
          ))}
        </div>
      )}

      {/* Leveled Spells */}
      {leveledSpells.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest">
            Spells
          </h3>
          {leveledSpells.map((spell) => (
            <SpellCard key={spell.name} spell={spell} />
          ))}
        </div>
      )}

      {availableSpells.length === 0 && hasSpellcasting && (
        <p className="text-sm font-body text-text-secondary text-center py-4">
          No spells loaded for this form&apos;s spell list.
        </p>
      )}
    </div>
  );
}
