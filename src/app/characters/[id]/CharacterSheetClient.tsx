"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Character, DailyState } from "@/types/character";
import { TabNav, HPBox } from "@/components/ui";
import CombatStatsBar from "@/components/character-sheet/CombatStatsBar";
import AbilitySidebar from "./AbilitySidebar";
import FeaturesTab from "./FeaturesTab";
import ActionsTab from "./ActionsTab";
import SpellsTab from "./SpellsTab";
import EquipmentTab from "./EquipmentTab";
import NotesTab from "./NotesTab";
import CharacterEditModal from "./CharacterEditModal";
import ShortRestModal from "./ShortRestModal";
import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";
import { CLASS_FEATURE_DESCRIPTIONS } from "@/data/level-progression";
import FateAbilityButton from "@/components/FateAbilityButton";
import AttackRoller from "@/components/AttackRoller";

interface Props {
  character: Character;
  dailyState: DailyState | null;
}

const TABS = [
  { id: "features", label: "Features" },
  { id: "actions", label: "Actions" },
  { id: "spells", label: "Spells" },
  { id: "equipment", label: "Equipment" },
  { id: "notes", label: "Notes" },
];

function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
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
  const router = useRouter();
  const [dailyState, setDailyState] = useState<DailyState | null>(initialDailyState);
  const [activeTab, setActiveTab] = useState("features");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShortRest, setShowShortRest] = useState(false);
  const [showAttackRoller, setShowAttackRoller] = useState(false);

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

  // Determine hit die for current form (needed for short rest)
  const hitDie = useMemo(() => {
    if (!dailyState) return 8;
    if (dailyState.formType === "STABILIZED" && dailyState.stabilizedFormId) {
      const form = STABILIZED_FORMS.find(f => f.id === dailyState.stabilizedFormId);
      return form?.hitDie ?? 8;
    }
    if (dailyState.formType === "CHAOS" && dailyState.chaosTableA) {
      const chassis = TABLE_A_CHASSIS.find(c => c.id === dailyState.chaosTableA!.chassisId);
      return chassis?.hitDie ?? 8;
    }
    return 8;
  }, [dailyState]);

  const handleFateToggle = useCallback(
    async (key: "chaosSurgeUsed" | "twistOfFateUsed" | "defyFateUsed") => {
      if (!dailyState) return;
      const newValue = !dailyState[key];
      setDailyState((prev) => prev ? { ...prev, [key]: newValue } : prev);
      try {
        const res = await fetch(`/api/characters/${character.id}/daily-state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: newValue }),
        });
        if (!res.ok) setDailyState(initialDailyState);
      } catch {
        setDailyState(initialDailyState);
      }
    },
    [character.id, dailyState, initialDailyState]
  );

  const handleLongRest = useCallback(async () => {
    if (!dailyState) return;
    if (!confirm("Take a Long Rest? This will restore resources and trigger a new Dawn Roll.")) return;

    router.push(`/characters/${character.id}/dawn-roll`);
  }, [character.id, dailyState, router]);

  // Combat stats derived from character data
  const dexMod = getModifier(character.abilityScores.DEX);
  const initiative = dexMod;
  const armorClass = 10 + dexMod;

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="bg-bg-surface border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 py-4">

          {/* Row 1: Name/class/form badge + Rest buttons */}
          <div className="flex items-start justify-between gap-4">
            {/* Left: Name, class, form badge */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[1.625rem] font-condensed text-text-highlight leading-tight tracking-wide">
                  {character.name}
                </h1>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-text-secondary hover:text-text-highlight transition-colors p-1 mt-0.5"
                  aria-label="Edit character"
                  title="Edit character"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-text-secondary mt-0.5">
                The Fatebound · Level {character.level}
                {character.background ? ` · ${character.background}` : ""}
              </p>
              {/* Form badge + outcome */}
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`text-xs font-condensed uppercase tracking-widest px-2 py-0.5 rounded border ${
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
                  <span className="text-xs text-text-secondary">
                    {outcomeLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Rest + Attack buttons */}
            {dailyState && (
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => setShowShortRest(true)}
                  className="px-3 py-1.5 text-xs font-condensed font-bold uppercase tracking-wider border border-border-subtle text-text-secondary rounded hover:text-text-highlight hover:border-text-secondary transition-colors whitespace-nowrap"
                >
                  Short Rest
                </button>
                <button
                  onClick={handleLongRest}
                  className="px-3 py-1.5 text-xs font-condensed font-bold uppercase tracking-wider border border-border-subtle text-text-secondary rounded hover:text-text-highlight hover:border-text-secondary transition-colors whitespace-nowrap"
                >
                  Long Rest
                </button>
                <button
                  onClick={() => setShowAttackRoller(true)}
                  className="px-3 py-1.5 text-xs font-condensed font-bold uppercase tracking-wider border border-accent/50 text-accent rounded hover:bg-accent/10 hover:border-accent transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                  title="Open Attack Roller"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                  </svg>
                  Attack
                </button>
              </div>
            )}
          </div>

          {/* Row 2: Combat Stats Bar */}
          <div className="mt-4">
            <CombatStatsBar
              initiative={initiative}
              armorClass={armorClass}
              speed={30}
              proficiencyBonus={profBonus}
            />
          </div>

          {/* Row 3: Fate Abilities (left) + HP Box (right) */}
          {dailyState && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Fate abilities */}
              <div className="flex flex-wrap gap-3 text-xs text-text-secondary flex-1">
                {[
                  { key: "chaosSurgeUsed" as const, label: "Chaos Surge" },
                  { key: "twistOfFateUsed" as const, label: "Twist of Fate" },
                  { key: "defyFateUsed" as const, label: "Defy Fate" },
                ].map(({ key, label }) => (
                  <FateAbilityButton
                    key={key}
                    label={label}
                    description={CLASS_FEATURE_DESCRIPTIONS[label] ?? ""}
                    isUsed={dailyState[key]}
                    onToggle={() => handleFateToggle(key)}
                  />
                ))}
                {dailyState.fateResistanceSave && (
                  <span className="self-center">
                    Fate Resistance:{" "}
                    <span className="text-text-primary">{dailyState.fateResistanceSave}</span>
                  </span>
                )}
              </div>

              {/* HP Box — right-aligned */}
              <div className="sm:ml-auto w-full sm:w-auto sm:min-w-[200px]">
                <HPBox
                  current={currentHP}
                  max={maxHP}
                  temp={tempHP}
                  onUpdate={handleHPUpdate}
                />
              </div>
            </div>
          )}

          {/* HP Box when no dailyState */}
          {!dailyState && (
            <div className="mt-4 flex justify-end">
              <div className="w-full sm:w-auto sm:min-w-[200px]">
                <HPBox
                  current={currentHP}
                  max={maxHP}
                  temp={tempHP}
                  onUpdate={handleHPUpdate}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Dawn Roll CTA ─────────────────────────────────── */}
      {!dailyState && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-fate/10 border border-fate rounded-lg px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-text-highlight font-heading text-lg">No Dawn Roll Today</p>
              <p className="text-text-secondary text-sm mt-0.5">
                Roll to determine today&apos;s form and features.
              </p>
            </div>
            <button
              onClick={() => router.push(`/characters/${character.id}/dawn-roll`)}
              className="px-4 py-2 bg-fate text-white font-condensed font-semibold text-sm rounded-lg hover:bg-fate/80 transition-colors whitespace-nowrap"
            >
              Roll Dawn &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left sidebar: ability scores */}
          <aside className="w-full lg:w-56 shrink-0">
            <AbilitySidebar
              name={character.name}
              abilityScores={character.abilityScores}
              proficiencyBonus={profBonus}
              dailyState={dailyState}
              level={character.level}
              permanentSkills={character.permanentSkills}
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
                  onDailyStateChange={setDailyState}
                />
              )}
              {activeTab === "actions" && (
                <ActionsTab
                  character={character}
                  dailyState={dailyState}
                  proficiencyBonus={profBonus}
                  onOpenAttackRoller={() => setShowAttackRoller(true)}
                  onDailyStateChange={setDailyState}
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

      {/* ── Edit Modal ──────────────────────────────────── */}
      {showEditModal && (
        <CharacterEditModal
          character={character}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            router.refresh();
          }}
        />
      )}

      {/* ── Attack Roller Modal ──────────────────────────── */}
      {showAttackRoller && (
        <AttackRoller
          abilityScores={character.abilityScores}
          proficiencyBonus={profBonus}
          abilitySwap={dailyState?.abilitySwap}
          fightingStyle={dailyState?.autoRollResults?.["Fighting Style"]}
          characterWeapons={character.equippedWeapons}
          onClose={() => setShowAttackRoller(false)}
        />
      )}

      {/* ── Short Rest Modal ─────────────────────────────── */}
      {showShortRest && dailyState && (
        <ShortRestModal
          dailyState={dailyState}
          character={character}
          maxHP={maxHP}
          hitDie={hitDie}
          onConfirm={async (updates) => {
            setShowShortRest(false);
            const newState = { ...dailyState, ...updates };
            setDailyState(newState);
            try {
              await fetch(`/api/characters/${character.id}/daily-state`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
              });
            } catch {
              setDailyState(initialDailyState);
            }
          }}
          onClose={() => setShowShortRest(false)}
        />
      )}
    </div>
  );
}
