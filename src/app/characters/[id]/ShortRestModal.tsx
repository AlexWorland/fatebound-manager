"use client";

import React, { useState, useMemo } from "react";
import type { DailyState, Character } from "@/types/character";
import { applyShortRest } from "@/engine/rest";

interface Props {
  dailyState: DailyState;
  character: Character;
  maxHP: number;
  hitDie: number;
  onConfirm: (updates: Partial<DailyState>) => void;
  onClose: () => void;
}

export default function ShortRestModal({ dailyState, character, maxHP, hitDie, onConfirm, onClose }: Props) {
  const conMod = Math.floor((character.abilityScores.CON - 10) / 2);
  const available = dailyState.hitDice.max - dailyState.hitDice.used;
  const [toSpend, setToSpend] = useState(0);

  const healPerDie = Math.floor(hitDie / 2) + 1 + conMod;
  const projectedHP = Math.min(dailyState.currentHP + toSpend * healPerDie, maxHP);

  // Count resources that will reset
  const shortRestResources = useMemo(() => {
    const resources: string[] = [];
    for (const [key, tracker] of Object.entries(dailyState.classResources)) {
      if (tracker.recovery === "short" && tracker.used > 0) {
        resources.push(key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
      }
    }
    for (const [key, tracker] of Object.entries(dailyState.spellSlots)) {
      if (tracker.recovery === "short" && tracker.used > 0) {
        resources.push(key === "pact" ? "Pact Magic Slots" : `Level ${key} Slots`);
      }
    }
    return resources;
  }, [dailyState]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-bg-surface border border-border-subtle rounded-lg p-6 w-full max-w-sm mx-4 shadow-floating"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-heading text-text-highlight mb-4 border-b border-border-subtle pb-3">Short Rest</h2>

        {/* Hit Dice section */}
        <div className="mb-4">
          <p className="text-xs font-condensed font-bold uppercase tracking-wider text-text-secondary mb-2">
            Spend Hit Dice to Heal
          </p>
          <p className="text-xs text-text-secondary mb-3">
            {available} of {dailyState.hitDice.max} hit dice available (d{hitDie} + {conMod >= 0 ? "+" : ""}{conMod} CON = {healPerDie} HP each)
          </p>

          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setToSpend(Math.max(0, toSpend - 1))}
              disabled={toSpend === 0}
              className="w-8 h-8 rounded border border-border-subtle text-text-secondary hover:text-text-highlight disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-condensed font-bold"
            >
              −
            </button>
            <span className="text-lg font-mono text-text-primary min-w-[2ch] text-center">{toSpend}</span>
            <button
              onClick={() => setToSpend(Math.min(available, toSpend + 1))}
              disabled={toSpend >= available}
              className="w-8 h-8 rounded border border-border-subtle text-text-secondary hover:text-text-highlight disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-condensed font-bold"
            >
              +
            </button>
          </div>

          {toSpend > 0 && (
            <p className="text-xs text-hp-green font-body">
              HP: {dailyState.currentHP} → {projectedHP} (+{projectedHP - dailyState.currentHP})
            </p>
          )}
        </div>

        {/* Resources that will reset */}
        {shortRestResources.length > 0 && (
          <div className="mb-4 border-t border-border-subtle pt-3">
            <p className="text-xs font-condensed uppercase tracking-wider text-text-secondary mb-1">Will be restored:</p>
            <ul className="text-xs text-text-primary font-body">
              {shortRestResources.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-condensed font-bold uppercase tracking-wider border border-border-subtle text-text-secondary hover:text-text-highlight transition-colors rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const updates = applyShortRest(dailyState, toSpend, hitDie, conMod, maxHP);
              onConfirm(updates);
            }}
            className="px-4 py-2 text-xs font-condensed font-bold uppercase tracking-wider bg-fate text-white rounded hover:bg-fate/80 transition-colors"
          >
            Confirm Short Rest
          </button>
        </div>
      </div>
    </div>
  );
}
