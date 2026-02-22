"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import type { AbilityScore } from "@/types/forms";
import type { AbilityScores } from "@/types/character";

// ── Constants ──────────────────────────────────────────────────────────

const TOTAL_POINTS = 27;
const MIN_SCORE = 8;
const MAX_SCORE = 15;

const POINT_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const ABILITIES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const ABILITY_LABELS: Record<AbilityScore, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

export type ScoreMethod = "standard" | "pointbuy" | "manual";

// ── Helpers ─────────────────────────────────────────────────────────────

export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(score: number): string {
  const mod = getModifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function getTotalPointsUsed(scores: AbilityScores): number {
  return ABILITIES.reduce((sum, ab) => sum + (POINT_COST[scores[ab]] ?? 0), 0);
}

// ── Component ───────────────────────────────────────────────────────────

export function AbilityScoreStep({
  scores,
  method,
  onScoresChange,
  onMethodChange,
}: {
  scores: AbilityScores;
  method: ScoreMethod;
  onScoresChange: (s: AbilityScores) => void;
  onMethodChange: (m: ScoreMethod) => void;
}) {
  const pointsUsed = getTotalPointsUsed(scores);
  const pointsRemaining = TOTAL_POINTS - pointsUsed;

  // Standard array: track which slot each ability is assigned to
  // null means unassigned
  const [standardAssignments, setStandardAssignments] = useState<
    Partial<Record<AbilityScore, number>>
  >({});

  function assignStandardValue(ability: AbilityScore, value: number | null) {
    const next = { ...standardAssignments };
    // Remove any existing assignment of this value to another ability
    for (const [ab, v] of Object.entries(next)) {
      if (v === value) delete next[ab as AbilityScore];
    }
    if (value === null) {
      delete next[ability];
    } else {
      next[ability] = value;
    }
    setStandardAssignments(next);

    // Rebuild scores from assignments (unassigned = 8)
    const newScores = { ...scores };
    for (const ab of ABILITIES) {
      newScores[ab] = next[ab] ?? 8;
    }
    onScoresChange(newScores);
  }

  function adjustPointBuyScore(ability: AbilityScore, delta: number) {
    const current = scores[ability];
    const next = current + delta;
    if (next < MIN_SCORE || next > MAX_SCORE) return;
    const costDiff = (POINT_COST[next] ?? 0) - (POINT_COST[current] ?? 0);
    if (costDiff > pointsRemaining) return;
    onScoresChange({ ...scores, [ability]: next });
  }

  function handleManualChange(ability: AbilityScore, raw: string) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onScoresChange({ ...scores, [ability]: Math.max(1, Math.min(30, parsed)) });
    } else if (raw === "") {
      onScoresChange({ ...scores, [ability]: 8 });
    }
  }

  const usedValues = Object.values(standardAssignments) as number[];

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-heading text-text-highlight">Ability Scores</h2>
            <p className="text-sm text-text-secondary mt-1">
              Choose how to generate your ability scores.
            </p>
          </div>

          {method === "pointbuy" && (
            <div className="shrink-0 ml-4 text-right">
              <div className="text-xs text-text-secondary uppercase tracking-widest font-body">
                Points
              </div>
              <div
                className={`text-2xl font-heading font-bold ${
                  pointsRemaining === 0
                    ? "text-accent"
                    : pointsRemaining < 0
                    ? "text-hp-red"
                    : "text-text-highlight"
                }`}
              >
                {pointsRemaining}
              </div>
              <div className="text-xs text-text-secondary font-mono">/ {TOTAL_POINTS}</div>
            </div>
          )}
        </div>

        {/* Method tabs */}
        <div className="flex rounded-lg overflow-hidden border border-border-subtle">
          {(
            [
              { id: "standard", label: "Standard Array" },
              { id: "pointbuy", label: "Point Buy" },
              { id: "manual", label: "Manual" },
            ] as { id: ScoreMethod; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onMethodChange(tab.id)}
              className={`flex-1 py-2 text-sm font-body transition-colors ${
                method === tab.id
                  ? "bg-fate text-white"
                  : "bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Standard Array */}
        {method === "standard" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-secondary">
              Assign the values {STANDARD_ARRAY.join(", ")} to your abilities. Each value can only be used once.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ABILITIES.map((ab) => {
                const assigned = standardAssignments[ab] ?? null;
                return (
                  <div
                    key={ab}
                    className="flex flex-col gap-1.5 p-3 rounded-lg bg-bg-elevated border border-border-subtle"
                  >
                    <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
                      {ABILITY_LABELS[ab]}
                    </span>
                    <select
                      value={assigned ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? null : parseInt(e.target.value, 10);
                        assignStandardValue(ab, val);
                      }}
                      className="bg-bg-deep border border-border-subtle rounded px-2 py-1 text-sm text-text-primary font-mono focus:outline-none focus:border-fate"
                    >
                      <option value="">—</option>
                      {STANDARD_ARRAY.map((v) => (
                        <option
                          key={v}
                          value={v}
                          disabled={usedValues.includes(v) && assigned !== v}
                        >
                          {v}
                        </option>
                      ))}
                    </select>
                    {assigned !== null && (
                      <span className="text-xs text-text-secondary font-mono text-center">
                        {formatModifier(assigned)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 flex-wrap">
              {STANDARD_ARRAY.map((v) => (
                <span
                  key={v}
                  className={`px-2 py-0.5 rounded text-xs font-mono border ${
                    usedValues.includes(v)
                      ? "bg-bg-elevated border-border-subtle text-text-secondary line-through opacity-50"
                      : "bg-fate/10 border-fate/40 text-fate"
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Point Buy */}
        {method === "pointbuy" && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ABILITIES.map((ab) => (
                <PointBuyInput
                  key={ab}
                  ability={ab}
                  score={scores[ab]}
                  pointsRemaining={pointsRemaining}
                  onAdjust={adjustPointBuyScore}
                />
              ))}
            </div>
            {pointsRemaining > 0 && (
              <p className="text-xs text-text-secondary text-center">
                {pointsRemaining} point{pointsRemaining !== 1 ? "s" : ""} remaining
              </p>
            )}
          </div>
        )}

        {/* Manual */}
        {method === "manual" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-secondary">
              Enter any values you like. No validation is applied.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ABILITIES.map((ab) => (
                <div
                  key={ab}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-bg-elevated border border-border-subtle"
                >
                  <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
                    {ABILITY_LABELS[ab]}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={scores[ab]}
                    onChange={(e) => handleManualChange(ab, e.target.value)}
                    className="w-16 text-center px-2 py-1 rounded bg-bg-deep border border-border-subtle text-text-highlight font-heading text-xl font-bold focus:outline-none focus:border-fate"
                  />
                  <span className="text-xs text-text-secondary font-mono">
                    {formatModifier(scores[ab])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function PointBuyInput({
  ability,
  score,
  pointsRemaining,
  onAdjust,
}: {
  ability: AbilityScore;
  score: number;
  pointsRemaining: number;
  onAdjust: (ability: AbilityScore, delta: number) => void;
}) {
  const canIncrease =
    score < MAX_SCORE &&
    (POINT_COST[score + 1] ?? 0) - (POINT_COST[score] ?? 0) <= pointsRemaining;
  const canDecrease = score > MIN_SCORE;

  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-bg-elevated border border-border-subtle">
      <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
        {ABILITY_LABELS[ability]}
      </span>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onAdjust(ability, -1)}
          disabled={!canDecrease}
          className="w-7 h-7 rounded flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &minus;
        </button>

        <div className="flex flex-col items-center min-w-[40px]">
          <span className="text-xl font-heading font-bold text-text-highlight">{score}</span>
          <span className="text-xs text-text-secondary font-mono">
            ({formatModifier(score)})
          </span>
        </div>

        <button
          onClick={() => onAdjust(ability, 1)}
          disabled={!canIncrease}
          className="w-7 h-7 rounded flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <span className="text-xs text-text-secondary font-mono">{POINT_COST[score] ?? 0} pts</span>
    </div>
  );
}
