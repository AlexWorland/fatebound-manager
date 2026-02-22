"use client";

import React from "react";

const STANDARD_CONDITIONS = [
  "Blinded",
  "Charmed",
  "Deafened",
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
];

const EXHAUSTION_EFFECTS: Record<number, string> = {
  0: "No exhaustion",
  1: "Disadvantage on ability checks",
  2: "Speed halved",
  3: "Disadvantage on attack rolls and saving throws",
  4: "Hit point maximum halved",
  5: "Speed reduced to 0",
  6: "Death",
};

interface ConditionTrackerProps {
  conditions: string[];
  exhaustionLevel: number;
  onConditionsChange: (conditions: string[]) => void;
  onExhaustionChange: (level: number) => void;
}

export default function ConditionTracker({
  conditions,
  exhaustionLevel,
  onConditionsChange,
  onExhaustionChange,
}: ConditionTrackerProps) {
  const handleToggleCondition = (condition: string) => {
    if (conditions.includes(condition)) {
      onConditionsChange(conditions.filter((c) => c !== condition));
    } else {
      onConditionsChange([...conditions, condition]);
    }
  };

  const handleClearAll = () => {
    onConditionsChange([]);
    onExhaustionChange(0);
  };

  return (
    <div className="space-y-6">
      {/* Conditions Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-heading text-text-primary">Conditions</h3>
        <div className="grid grid-cols-2 gap-2">
          {STANDARD_CONDITIONS.map((condition) => {
            const isActive = conditions.includes(condition);
            return (
              <button
                key={condition}
                onClick={() => handleToggleCondition(condition)}
                className={`px-3 py-2 rounded-lg text-sm font-body transition-colors duration-150 ${
                  isActive
                    ? "bg-accent text-white"
                    : "bg-bg-elevated border border-border-subtle text-text-primary hover:bg-bg-hover"
                }`}
              >
                {condition}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exhaustion Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-heading text-text-primary">Exhaustion</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onExhaustionChange(Math.max(0, exhaustionLevel - 1))}
              disabled={exhaustionLevel === 0}
              className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center font-heading"
            >
              −
            </button>
            <div className="flex-1 px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-center">
              <div className="text-sm font-heading text-text-primary">{exhaustionLevel}</div>
              <div className="text-xs text-text-secondary">Level</div>
            </div>
            <button
              onClick={() => onExhaustionChange(Math.min(6, exhaustionLevel + 1))}
              disabled={exhaustionLevel === 6}
              className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center font-heading"
            >
              +
            </button>
          </div>
          <div className="px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle">
            <p className="text-sm text-text-secondary">{EXHAUSTION_EFFECTS[exhaustionLevel]}</p>
          </div>
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={handleClearAll}
        className="w-full px-4 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary hover:bg-bg-hover transition-colors duration-150 font-body text-sm"
      >
        Clear All
      </button>
    </div>
  );
}
