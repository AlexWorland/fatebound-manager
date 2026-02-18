"use client";

import React from "react";
import Link from "next/link";
import type { Character, DailyState } from "@/types/character";
import type { DawnRollOutcome } from "@/types/dice";

interface CharacterHeaderProps {
  character: Character;
  dailyState: DailyState | null;
}

const OUTCOME_LABELS: Record<DawnRollOutcome, string> = {
  DM_DESIGN: "DM Design",
  DEEP_CHAOS: "Deep Chaos",
  UNSTABLE: "Unstable",
  GUIDED: "Guided",
  FAVORED: "Favored",
  MASTER: "Master",
};

function FormTypeBadge({ formType }: { formType: "CHAOS" | "STABILIZED" }) {
  if (formType === "CHAOS") {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-body uppercase tracking-widest bg-accent text-text-highlight">
        Chaos
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-xs font-body uppercase tracking-widest bg-fate text-text-highlight">
      Stabilized
    </span>
  );
}

export default function CharacterHeader({ character, dailyState }: CharacterHeaderProps) {
  const dawnRollValue = dailyState?.dawnRoll.chosen;
  const outcomeLabel = dailyState ? OUTCOME_LABELS[dailyState.dawnRollOutcome] : null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-bg-surface border-b border-border-subtle">
      {/* Left: name + badges */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-heading text-text-highlight tracking-wide">
          {character.name}
        </h1>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded text-xs font-body uppercase tracking-widest border border-border-subtle text-text-secondary">
            Level {character.level}
          </span>
          {dailyState && <FormTypeBadge formType={dailyState.formType} />}
          {dawnRollValue !== undefined && outcomeLabel && (
            <span className="text-sm font-body text-text-secondary">
              Dawn Roll:{" "}
              <span className="text-text-highlight font-semibold">{dawnRollValue}</span>
              {" — "}
              <span className="text-fate-glow">{outcomeLabel}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2">
        <Link
          href={`/characters/${character.id}/dawn-roll`}
          className="px-4 py-2 rounded bg-accent hover:bg-accent-hover text-text-highlight text-sm font-body transition-colors"
        >
          New Dawn Roll
        </Link>
        <Link
          href={`/characters/${character.id}/level-up`}
          className="px-4 py-2 rounded border border-border-subtle hover:border-border-accent text-text-secondary hover:text-text-primary text-sm font-body transition-colors"
        >
          Level Up
        </Link>
      </div>
    </div>
  );
}
