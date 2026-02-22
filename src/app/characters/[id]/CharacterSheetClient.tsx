"use client";

import React, { useState, useCallback } from "react";
import { Character, DailyState } from "@/types/character";
import { TabNav, HPBar } from "@/components/ui";
import AbilitySidebar from "./AbilitySidebar";
import FeaturesTab from "./FeaturesTab";
import SpellsTab from "./SpellsTab";
import EquipmentTab from "./EquipmentTab";
import NotesTab from "./NotesTab";

interface Props {
  character: Character;
  dailyState: DailyState | null;
}

const TABS = [
  { id: "features", label: "Features" },
  { id: "spells", label: "Spells" },
  { id: "equipment", label: "Equipment" },
  { id: "notes", label: "Notes" },
];

function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

function getFormLabel(dailyState: DailyState | null): string {
  if (!dailyState) return "No Dawn Roll Today";
  if (dailyState.formType === "CHAOS") return "Chaos Form";
  return "Stabilized Form";
}

function getOutcomeLabel(dailyState: DailyState | null): string {
  if (!dailyState) return "";
  const labels: Record<string, string> = {
    DM_DESIGN: "DM Design",
    DEEP_CHAOS: "Deep Chaos",
    UNSTABLE: "Unstable",
    GUIDED: "Guided",
    FAVORED: "Favored",
    MASTER: "Master",
  };
  return labels[dailyState.dawnRollOutcome] ?? dailyState.dawnRollOutcome;
}

export default function CharacterSheetClient({ character, dailyState: initialDailyState }: Props) {
  const [dailyState, setDailyState] = useState<DailyState | null>(initialDailyState);
  const [activeTab, setActiveTab] = useState("features");

  const handleHPUpdate = useCallback(
    async (current: number, temp: number) => {
      if (!dailyState) return;

      // Optimistic update
      setDailyState((prev) =>
        prev ? { ...prev, currentHP: current, tempHP: temp } : prev
      );

      try {
        const res = await fetch(`/api/characters/${character.id}/daily-state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentHP: current, tempHP: temp }),
        });
        if (!res.ok) {
          // Revert on failure
          setDailyState(initialDailyState);
        }
      } catch {
        setDailyState(initialDailyState);
      }
    },
    [character.id, dailyState, initialDailyState]
  );

  const profBonus = getProficiencyBonus(character.level);
  const formLabel = getFormLabel(dailyState);
  const outcomeLabel = getOutcomeLabel(dailyState);

  const currentHP = dailyState?.currentHP ?? 0;
  const maxHP = dailyState
    ? Math.max(
        // Simple estimate if no state: 8 per level
        currentHP,
        character.level * 8
      )
    : character.level * 8;
  const tempHP = dailyState?.tempHP ?? 0;

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="bg-bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            {/* Name + level */}
            <div>
              <h1 className="text-3xl font-heading text-text-highlight tracking-wide">
                {character.name}
              </h1>
              <p className="text-text-secondary font-body text-sm mt-0.5">
                The Fatebound — Level {character.level}
                {character.background ? ` · ${character.background}` : ""}
              </p>
            </div>

            {/* Form badge + proficiency */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span
                    className={`text-xs font-body uppercase tracking-widest px-2 py-0.5 rounded border ${
                      dailyState?.formType === "CHAOS"
                        ? "border-accent text-accent"
                        : dailyState?.formType === "STABILIZED"
                        ? "border-fate text-fate-glow"
                        : "border-border-subtle text-text-secondary"
                    }`}
                  >
                    {formLabel}
                  </span>
                  {outcomeLabel && (
                    <span className="text-xs text-text-secondary font-body">
                      {outcomeLabel}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary font-body mt-1">
                  Proficiency Bonus:{" "}
                  <span className="text-text-primary font-mono">+{profBonus}</span>
                </p>
              </div>
            </div>
          </div>

          {/* HP Bar */}
          <div className="mt-4 max-w-md">
            <HPBar
              current={currentHP}
              max={maxHP}
              temp={tempHP}
              onUpdate={handleHPUpdate}
            />
          </div>

          {/* Fate abilities row */}
          {dailyState && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-body text-text-secondary">
              <span>
                Chaos Surge:{" "}
                <span
                  className={
                    dailyState.chaosSurgeUsed ? "text-hp-red" : "text-hp-green"
                  }
                >
                  {dailyState.chaosSurgeUsed ? "Used" : "Ready"}
                </span>
              </span>
              <span>
                Twist of Fate:{" "}
                <span
                  className={
                    dailyState.twistOfFateUsed ? "text-hp-red" : "text-hp-green"
                  }
                >
                  {dailyState.twistOfFateUsed ? "Used" : "Ready"}
                </span>
              </span>
              <span>
                Defy Fate:{" "}
                <span
                  className={
                    dailyState.defyFateUsed ? "text-hp-red" : "text-hp-green"
                  }
                >
                  {dailyState.defyFateUsed ? "Used" : "Ready"}
                </span>
              </span>
              {dailyState.fateResistanceSave && (
                <span>
                  Fate Resistance:{" "}
                  <span className="text-text-primary">
                    {dailyState.fateResistanceSave}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar: ability scores */}
          <aside className="w-full lg:w-56 shrink-0">
            <AbilitySidebar
              abilityScores={character.abilityScores}
              proficiencyBonus={profBonus}
              dailyState={dailyState}
              level={character.level}
            />
          </aside>

          {/* Main content: tabbed panels */}
          <main className="flex-1 min-w-0">
            <TabNav
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-4">
              {activeTab === "features" && (
                <FeaturesTab
                  character={character}
                  dailyState={dailyState}
                  proficiencyBonus={profBonus}
                  characterId={character.id}
                />
              )}
              {activeTab === "spells" && (
                <SpellsTab
                  character={character}
                  dailyState={dailyState}
                  onDailyStateChange={setDailyState}
                />
              )}
              {activeTab === "equipment" && (
                <EquipmentTab character={character} />
              )}
              {activeTab === "notes" && (
                <NotesTab character={character} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
