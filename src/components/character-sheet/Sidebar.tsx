"use client";

import React from "react";
import { HPBar } from "@/components/ui";
import AbilityScores from "./AbilityScores";
import type { Character, DailyState } from "@/types/character";
import type { AbilityScore } from "@/types/forms";

interface SidebarProps {
  character: Character;
  dailyState: DailyState | null;
  onHPUpdate: (current: number, temp: number) => void;
}

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Compute AC based on DEX mod (default unarmored: 10 + DEX)
function computeAC(dex: number): number {
  return 10 + getModifier(dex);
}

function computeInitiative(dex: number): number {
  return getModifier(dex);
}

function getEffectiveDex(
  character: Character,
  dailyState: DailyState | null
): number {
  const swap = dailyState?.abilitySwap;
  if (!swap) return character.abilityScores.DEX;
  if (swap.score1 === "DEX") return character.abilityScores[swap.score2 as AbilityScore];
  if (swap.score2 === "DEX") return character.abilityScores[swap.score1 as AbilityScore];
  return character.abilityScores.DEX;
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-bg-elevated border border-border-subtle rounded-lg p-2">
      <span className="text-xs font-body text-text-secondary uppercase tracking-widest">
        {label}
      </span>
      <span className="text-xl font-heading text-text-highlight">
        {typeof value === "number" && value >= 0 ? `+${value}` : value}
      </span>
    </div>
  );
}

export default function Sidebar({ character, dailyState, onHPUpdate }: SidebarProps) {
  const effectiveDex = getEffectiveDex(character, dailyState);
  const ac = computeAC(effectiveDex);
  const initiative = computeInitiative(effectiveDex);
  const currentHP = dailyState?.currentHP ?? 0;
  const tempHP = dailyState?.tempHP ?? 0;

  // Estimate max HP: 8 (base) + CON mod * level (simplified)
  const conMod = getModifier(character.abilityScores.CON);
  const maxHP = Math.max(1, (8 + conMod) * character.level);

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col gap-4 p-4 bg-bg-surface border-r border-border-subtle overflow-y-auto">
      {/* Ability Scores */}
      <AbilityScores
        abilityScores={character.abilityScores}
        level={character.level}
        swappedAbilities={dailyState?.abilitySwap ?? null}
      />

      {/* Divider */}
      <div className="border-t border-border-subtle" />

      {/* HP */}
      <div>
        <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest mb-2">
          Hit Points
        </h3>
        <HPBar
          current={currentHP}
          max={maxHP}
          temp={tempHP}
          onUpdate={onHPUpdate}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border-subtle" />

      {/* Combat stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="AC" value={ac} />
        <StatBox label="Speed" value="30" />
        <StatBox label="Init" value={initiative} />
      </div>
    </aside>
  );
}
