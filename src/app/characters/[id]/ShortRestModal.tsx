"use client";

import React, { useState, useEffect } from "react";
import { Character, DailyState } from "@/types/character";

const HIT_DIE_SIZE = 8;

interface HitDiceDisplayProps {
  total: number;
  spent: number;
  dieSize: number;
  onToggle: (index: number) => void;
}

function HitDiceDisplay({ total, spent, dieSize, onToggle }: HitDiceDisplayProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const isSpent = i < spent;
        return (
          <button
            key={i}
            onClick={() => onToggle(i)}
            className={`w-8 h-8 rounded border text-xs font-mono flex items-center justify-center transition-colors ${
              isSpent
                ? "bg-bg-deep border-border-subtle text-text-secondary line-through opacity-50"
                : "bg-bg-elevated border-accent/40 text-text-primary hover:border-accent"
            }`}
          >
            d{dieSize}
          </button>
        );
      })}
    </div>
  );
}

interface ShortRestModalProps {
  character: Character;
  dailyState: DailyState;
  onClose: () => void;
  onConfirm: (hitDiceSpent: number) => void;
}

export default function ShortRestModal({
  character,
  dailyState,
  onClose,
  onConfirm,
}: ShortRestModalProps) {
  const [hitDiceSpent, setHitDiceSpent] = useState(dailyState.hitDiceSpent);
  const [countdown, setCountdown] = useState<number | null>(null);

  const totalHitDice = character.level;
  const available = totalHitDice - hitDiceSpent;

  const startConfirmation = () => setCountdown(3);
  const cancelCountdown = () => setCountdown(null);

  function handleConfirmRest() {
    onConfirm(hitDiceSpent);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      handleConfirmRest();
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  function handleToggle(index: number) {
    // Toggling a die below the spent threshold removes it (unspends up to it)
    // Toggling a die at/above threshold marks up to it as spent
    if (index < hitDiceSpent) {
      // Unspend: clicking a spent die collapses spent count to that index
      setHitDiceSpent(index);
    } else {
      // Spend: clicking an available die sets spent to index + 1
      const newSpent = Math.min(index + 1, totalHitDice);
      setHitDiceSpent(newSpent);
    }
    // Reset countdown if user changes dice selection
    setCountdown(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-surface border border-border-subtle rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-heading text-text-highlight tracking-wide">
            Short Rest
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Hit Dice section */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-sm font-body font-medium text-text-secondary uppercase tracking-wider">
              Hit Dice
            </h3>
            <span className="text-xs font-mono text-text-secondary">
              {available} / {totalHitDice} available
            </span>
          </div>

          <p className="text-xs text-text-secondary font-body mb-3">
            Click a die to spend it and roll for HP recovery. Each d{HIT_DIE_SIZE} restores 1d{HIT_DIE_SIZE} + CON modifier.
          </p>

          <HitDiceDisplay
            total={totalHitDice}
            spent={hitDiceSpent}
            dieSize={HIT_DIE_SIZE}
            onToggle={handleToggle}
          />

          {hitDiceSpent > dailyState.hitDiceSpent && (
            <p className="mt-2 text-xs font-body text-hp-green">
              +{hitDiceSpent - dailyState.hitDiceSpent} dice spent this rest
            </p>
          )}
        </div>

        {/* Short rest effects */}
        <div className="mb-6 p-3 bg-bg-elevated rounded-lg border border-border-subtle text-xs font-body text-text-secondary space-y-1">
          <p className="font-medium text-text-primary">Short rest restores:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>HP from hit dice spent above</li>
            <li>Chaos Surge (if expended)</li>
            <li>Twist of Fate (if expended)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded font-body text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>

          {countdown !== null ? (
            <div className="flex gap-2">
              <button
                onClick={cancelCountdown}
                className="px-4 py-2 rounded bg-bg-elevated border border-border-subtle text-text-secondary hover:bg-bg-hover text-sm font-body transition-colors"
              >
                Cancel
              </button>
              <button
                disabled
                className="px-4 py-2 rounded bg-accent/60 text-text-primary cursor-wait text-sm font-body"
              >
                Confirm ({countdown}...)
              </button>
            </div>
          ) : (
            <button
              onClick={startConfirmation}
              className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-text-primary text-sm font-body transition-colors"
            >
              Confirm Short Rest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
