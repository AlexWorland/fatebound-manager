"use client";

import React from "react";

interface SpellLevelFilterProps {
  levels: number[];
  activeLevel: number | null;
  onLevelChange: (level: number | null) => void;
}

const LEVEL_LABELS: Record<number, string> = {
  0: "CANTRIPS",
  1: "1ST",
  2: "2ND",
  3: "3RD",
  4: "4TH",
  5: "5TH",
  6: "6TH",
  7: "7TH",
  8: "8TH",
  9: "9TH",
};

export default function SpellLevelFilter({
  levels,
  activeLevel,
  onLevelChange,
}: SpellLevelFilterProps) {
  return (
    <div className="flex gap-1 items-center flex-wrap">
      <button
        onClick={() => onLevelChange(null)}
        className={
          activeLevel === null
            ? "bg-accent text-white rounded px-2 py-0.5 text-xs font-bold"
            : "text-text-secondary hover:text-text-primary px-2 py-0.5 text-xs font-bold transition-colors"
        }
      >
        ALL
      </button>
      {levels.map((level) => (
        <button
          key={level}
          onClick={() => onLevelChange(level)}
          className={
            activeLevel === level
              ? "bg-accent text-white rounded px-2 py-0.5 text-xs font-bold"
              : "text-text-secondary hover:text-text-primary px-2 py-0.5 text-xs font-bold transition-colors"
          }
        >
          {LEVEL_LABELS[level] ?? `${level}TH`}
        </button>
      ))}
    </div>
  );
}
