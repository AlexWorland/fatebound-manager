"use client";

import React from "react";

interface SpellRowSpell {
  name: string;
  level: number;
  school?: string;
  castingTime?: string;
  range?: string;
  description: string;
  concentration?: boolean;
  ritual?: boolean;
}

interface SpellRowProps {
  spell: SpellRowSpell;
  onCast?: () => void;
  expanded: boolean;
  onToggle: () => void;
  hitDC?: string;
  effect?: string;
  showInlineColumns?: boolean;
}

export default function SpellRow({
  spell,
  onCast,
  expanded,
  onToggle,
  hitDC,
  effect,
  showInlineColumns,
}: SpellRowProps) {
  return (
    <div className="border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-2 py-2">
        {/* Expand toggle */}
        <button
          onClick={onToggle}
          className="shrink-0 text-text-secondary hover:text-text-primary transition-colors"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse spell" : "Expand spell"}
        >
          <span className="text-xs">{expanded ? "▼" : "▶"}</span>
        </button>

        {/* Spell name + badges */}
        <button
          onClick={onToggle}
          className="flex-1 min-w-0 text-left flex items-center gap-1.5"
        >
          <span className="text-sm font-body text-text-primary hover:text-text-highlight transition-colors truncate">
            {spell.name}
          </span>
          {spell.concentration && (
            <span className="shrink-0 text-[10px] font-bold text-white bg-fate/60 border border-fate/40 rounded px-1">
              C
            </span>
          )}
          {spell.ritual && (
            <span className="shrink-0 text-[10px] font-bold text-text-muted border border-border-subtle rounded px-1">
              R
            </span>
          )}
        </button>

        {/* Casting time */}
        {spell.castingTime && (
          <span className="hidden sm:block text-xs text-text-muted shrink-0 w-24 text-center truncate">
            {spell.castingTime}
          </span>
        )}

        {/* Range */}
        {spell.range && (
          <span className="hidden sm:block text-xs text-text-muted shrink-0 w-16 text-center truncate">
            {spell.range}
          </span>
        )}

        {/* HIT/DC column */}
        {showInlineColumns && hitDC && (
          <span className="hidden sm:block text-xs text-text-muted shrink-0 w-20 text-center truncate">
            {hitDC}
          </span>
        )}

        {/* Effect column */}
        {showInlineColumns && effect && (
          <span className="hidden sm:block text-xs text-text-muted shrink-0 w-24 text-center truncate">
            {effect}
          </span>
        )}

        {/* Cast button */}
        {onCast && (
          <button
            onClick={onCast}
            className="shrink-0 bg-spell text-white text-xs font-bold px-2 py-1 rounded hover:opacity-90 transition-opacity"
          >
            CAST
          </button>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="pb-3 pl-6 pr-2 space-y-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-text-secondary">
            {spell.castingTime && (
              <span>
                <span className="text-text-primary">Casting Time:</span>{" "}
                {spell.castingTime}
              </span>
            )}
            {spell.range && (
              <span>
                <span className="text-text-primary">Range:</span> {spell.range}
              </span>
            )}
            {spell.school && (
              <span>
                <span className="text-text-primary">School:</span>{" "}
                {spell.school}
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mt-1.5">
            {spell.description}
          </p>
        </div>
      )}
    </div>
  );
}
