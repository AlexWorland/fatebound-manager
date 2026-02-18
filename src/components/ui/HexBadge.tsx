"use client";

import React from "react";

interface HexBadgeProps {
  ability: string;
  score: number;
  modifier: number;
  isSwapped?: boolean;
  saveProficient?: boolean;
  saveBonus?: number;
}

export default function HexBadge({
  ability,
  score,
  modifier,
  isSwapped = false,
  saveProficient = false,
  saveBonus,
}: HexBadgeProps) {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  const saveStr = saveBonus !== undefined
    ? (saveBonus >= 0 ? `+${saveBonus}` : `${saveBonus}`)
    : modStr;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Ability label */}
      <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
        {ability}
      </span>

      {/* Hex shape */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 64, height: 72 }}
      >
        {/* Outer glow layer when swapped */}
        {isSwapped && (
          <div
            className="absolute inset-0 bg-fate opacity-30"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
        )}

        {/* Hex border background */}
        <div
          className={`absolute inset-0 ${isSwapped ? "bg-fate" : "bg-border-subtle"}`}
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />

        {/* Hex inner background (inset 2px) */}
        <div
          className="absolute bg-bg-elevated"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            inset: 2,
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col items-center leading-none z-10">
          <span
            className={`text-2xl font-bold font-heading ${isSwapped ? "text-fate-glow" : "text-text-highlight"}`}
          >
            {modStr}
          </span>
          <span className="text-xs text-text-secondary font-body mt-0.5">{score}</span>
        </div>
      </div>

      {/* Save throw indicator */}
      <div className="flex items-center gap-1">
        <div
          className={`w-2.5 h-2.5 rounded-full border ${
            saveProficient
              ? "bg-accent border-accent"
              : "bg-transparent border-text-secondary"
          }`}
        />
        <span className="text-xs text-text-secondary font-body">{saveStr}</span>
      </div>
    </div>
  );
}
