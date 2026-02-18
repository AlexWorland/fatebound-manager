"use client";

import React, { useState } from "react";
import type { AbilityScore } from "@/types/forms";
import type { AbilityScores } from "@/types/character";

const ABILITY_SCORES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export interface FateAttunementResult {
  swap: { score1: AbilityScore; score2: AbilityScore } | null;
}

interface FateAttunementProps {
  abilityScores: AbilityScores;
  onComplete: (result: FateAttunementResult) => void;
}

export default function FateAttunement({ abilityScores, onComplete }: FateAttunementProps) {
  const [selected, setSelected] = useState<AbilityScore[]>([]);

  function handleSelect(score: AbilityScore) {
    if (selected.includes(score)) {
      setSelected(selected.filter((s) => s !== score));
      return;
    }
    if (selected.length >= 2) return;
    setSelected([...selected, score]);
  }

  function handleConfirmSwap() {
    if (selected.length !== 2) return;
    onComplete({ swap: { score1: selected[0], score2: selected[1] } });
  }

  function handleSkip() {
    onComplete({ swap: null });
  }

  const previewScores: AbilityScores = { ...abilityScores };
  if (selected.length === 2) {
    const [a, b] = selected;
    previewScores[a] = abilityScores[b];
    previewScores[b] = abilityScores[a];
  }

  const hasSwap = selected.length === 2;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-heading text-text-primary">Fate Attunement</h2>
        <p className="text-sm text-text-secondary font-body">
          Choose two ability scores to swap, or skip to keep them as-is.
        </p>
      </div>

      {/* Ability score grid */}
      <div className="grid grid-cols-3 gap-3">
        {ABILITY_SCORES.map((score) => {
          const isSelected = selected.includes(score);
          const selectionIndex = selected.indexOf(score);
          const currentValue = abilityScores[score];
          const previewValue = previewScores[score];
          const changed = hasSwap && previewValue !== currentValue;

          return (
            <button
              key={score}
              onClick={() => handleSelect(score)}
              disabled={selected.length >= 2 && !isSelected}
              className={`
                relative rounded-lg border p-3 text-center transition-all duration-150
                ${isSelected
                  ? "border-fate bg-fate/10"
                  : selected.length >= 2
                  ? "border-border-subtle bg-bg-elevated opacity-40 cursor-not-allowed"
                  : "border-border-subtle bg-bg-elevated hover:border-fate/50 cursor-pointer"
                }
              `}
            >
              {isSelected && (
                <span className="absolute top-1 right-1.5 text-xs font-bold text-fate">
                  {selectionIndex + 1}
                </span>
              )}
              <p className="text-xs text-text-secondary font-body uppercase tracking-widest">{score}</p>
              <p className="text-2xl font-heading font-bold text-text-primary mt-0.5">
                {changed ? (
                  <span className="text-fate-glow">{previewValue}</span>
                ) : (
                  currentValue
                )}
              </p>
              <p className="text-xs text-text-secondary font-body">
                {getModifier(changed ? previewValue : currentValue)}
              </p>
              {changed && (
                <p className="text-xs text-text-secondary font-body line-through mt-0.5">
                  was {currentValue}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      {hasSwap && (
        <div className="bg-bg-elevated border border-fate/30 rounded-lg px-4 py-3 text-sm font-body text-center">
          <span className="text-fate-glow font-medium">{selected[0]}</span>
          <span className="text-text-secondary mx-2">↔</span>
          <span className="text-fate-glow font-medium">{selected[1]}</span>
          <span className="text-text-secondary ml-2">
            ({abilityScores[selected[0]]} ↔ {abilityScores[selected[1]]})
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleSkip}
          className="px-6 py-2.5 rounded-lg bg-bg-elevated text-text-primary border border-border-subtle font-body font-medium hover:bg-bg-hover transition-all"
        >
          Skip (no swap)
        </button>
        {hasSwap && (
          <button
            onClick={handleConfirmSwap}
            className="px-6 py-2.5 rounded-lg bg-fate text-white font-body font-medium hover:bg-fate/80 transition-all"
          >
            Confirm Swap
          </button>
        )}
      </div>
    </div>
  );
}
