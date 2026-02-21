"use client";

import React, { useState } from "react";

const CONDITIONS = [
  "Blinded",
  "Charmed",
  "Deafened",
  "Exhaustion",
  "Frightened",
  "Grappled",
  "Incapacitated",
  "Invisible",
  "Paralyzed",
  "Petrified",
  "Poisoned",
  "Prone",
  "Restrained",
  "Stunned",
  "Unconscious",
] as const;

type Condition = (typeof CONDITIONS)[number];

const CONDITION_COLORS: Record<Condition, string> = {
  Blinded: "border-text-muted text-text-muted",
  Charmed: "border-fate/60 text-fate-glow",
  Deafened: "border-text-muted text-text-muted",
  Exhaustion: "border-hp-red/60 text-hp-red",
  Frightened: "border-accent/60 text-accent",
  Grappled: "border-hp-yellow/60 text-hp-yellow",
  Incapacitated: "border-accent/60 text-accent",
  Invisible: "border-fate/60 text-fate-glow",
  Paralyzed: "border-hp-red/60 text-hp-red",
  Petrified: "border-text-secondary text-text-secondary",
  Poisoned: "border-hp-green/60 text-hp-green",
  Prone: "border-hp-yellow/60 text-hp-yellow",
  Restrained: "border-builder-blue/60 text-builder-blue",
  Stunned: "border-hp-red/60 text-hp-red",
  Unconscious: "border-accent text-accent",
};

export default function ConditionTracker() {
  const [active, setActive] = useState<Set<Condition>>(new Set());

  function toggle(c: Condition) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) {
        next.delete(c);
      } else {
        next.add(c);
      }
      return next;
    });
  }

  const hasActive = active.size > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-condensed font-bold uppercase tracking-wider text-text-secondary">
          Conditions
        </span>
        {hasActive && (
          <button
            onClick={() => setActive(new Set())}
            className="text-[10px] font-condensed uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {CONDITIONS.map((c) => {
          const isActive = active.has(c);
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              title={c}
              className={`
                text-[10px] font-condensed font-bold uppercase tracking-wider
                px-1.5 py-0.5 rounded border transition-all duration-150
                ${isActive
                  ? `${CONDITION_COLORS[c]} bg-bg-elevated`
                  : "border-border-subtle text-text-muted bg-transparent hover:border-text-muted hover:text-text-secondary"
                }
              `}
            >
              {c}
            </button>
          );
        })}
      </div>

      {hasActive && (
        <p className="mt-2 text-[10px] font-condensed text-text-muted">
          {active.size} condition{active.size !== 1 ? "s" : ""} active
        </p>
      )}
    </div>
  );
}
