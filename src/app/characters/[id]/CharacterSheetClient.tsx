"use client";

import React, { useState, useCallback } from "react";
import { Character, DailyState, InventoryItem, Currency } from "@/types/character";
import type { AbilityScore } from "@/types/forms";
import { TabNav, HPBar } from "@/components/ui";
import AbilitySidebar from "./AbilitySidebar";
import FeaturesTab from "./FeaturesTab";
import SpellsTab from "./SpellsTab";
import EquipmentTab from "./EquipmentTab";
import NotesTab from "./NotesTab";
import DescriptionTab from "./DescriptionTab";
import ShortRestModal from "./ShortRestModal";
import SkillCheckRoller from "@/components/SkillCheckRoller";
import ConditionTracker from "@/components/ConditionTracker";
import StatusBar from "@/components/character-sheet/StatusBar";
import DeathSaves from "@/components/character-sheet/DeathSaves";
import PassiveScores from "@/components/character-sheet/PassiveScores";
import DefensesPanel from "@/components/character-sheet/DefensesPanel";
import { Card } from "@/components/ui";

interface Props {
  character: Character;
  dailyState: DailyState | null;
}

const TABS = [
  { id: "features", label: "Features" },
  { id: "spells", label: "Spells" },
  { id: "equipment", label: "Equipment" },
  { id: "description", label: "Description" },
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
  const [showShortRest, setShowShortRest] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>(character.inventory);
  const [currency, setCurrency] = useState<Currency>(character.currency);

  // Skill check roller state
  const [showSkillRoller, setShowSkillRoller] = useState(false);
  const [preselectedSkill, setPreselectedSkill] = useState<string | undefined>();
  const [preselectedSave, setPreselectedSave] = useState<AbilityScore | undefined>();
  const [preselectedAbility, setPreselectedAbility] = useState<AbilityScore | undefined>();

  const updateDailyStateOnServer = useCallback(
    async (updates: Partial<DailyState>) => {
      if (!dailyState) return;

      // Optimistic update
      setDailyState((prev) => (prev ? { ...prev, ...updates } : prev));

      try {
        const res = await fetch(`/api/characters/${character.id}/daily-state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          setDailyState(initialDailyState);
        }
      } catch {
        setDailyState(initialDailyState);
      }
    },
    [character.id, dailyState, initialDailyState]
  );

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

  const handleShortRestConfirm = useCallback(
    async (hitDiceSpent: number) => {
      if (!dailyState) return;

      setShowShortRest(false);

      // Restore Chaos Surge and Twist of Fate on short rest
      const updates = {
        hitDiceSpent,
        chaosSurgeUsed: false,
        twistOfFateUsed: false,
      };

      setDailyState((prev) => (prev ? { ...prev, ...updates } : prev));

      try {
        const res = await fetch(`/api/characters/${character.id}/daily-state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          setDailyState(initialDailyState);
        }
      } catch {
        setDailyState(initialDailyState);
      }
    },
    [character.id, dailyState, initialDailyState]
  );

  const handleInventoryUpdate = useCallback(
    async (updated: InventoryItem[]) => {
      setInventory(updated);
      try {
        await fetch(`/api/characters/${character.id}/inventory`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inventory: updated }),
        });
      } catch {
        // best-effort; local state already updated
      }
    },
    [character.id]
  );

  const handleCurrencyUpdate = useCallback(
    async (updated: Currency) => {
      setCurrency(updated);
      try {
        await fetch(`/api/characters/${character.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency: updated }),
        });
      } catch {
        // best-effort; local state already updated
      }
    },
    [character.id]
  );

  const handleSkillRollerClose = useCallback(() => {
    setShowSkillRoller(false);
    setPreselectedSkill(undefined);
    setPreselectedSave(undefined);
    setPreselectedAbility(undefined);
  }, []);

  const handleSkillClick = useCallback((skill: string) => {
    setPreselectedSkill(skill);
    setPreselectedSave(undefined);
    setPreselectedAbility(undefined);
    setShowSkillRoller(true);
  }, []);

  const handleSaveClick = useCallback((save: AbilityScore) => {
    setPreselectedSkill(undefined);
    setPreselectedSave(save);
    setPreselectedAbility(undefined);
    setShowSkillRoller(true);
  }, []);

  const handleAbilityClick = useCallback((ability: AbilityScore) => {
    setPreselectedSkill(undefined);
    setPreselectedSave(undefined);
    setPreselectedAbility(ability);
    setShowSkillRoller(true);
  }, []);

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

  // Derive form proficient skills from daily state form data
  const formProficientSkills: string[] = [];
  const allProficientSkills = [...character.permanentSkills, ...formProficientSkills];

  // Derive exhaustion level from conditions
  const exhaustionLevel = dailyState?.conditions
    ? dailyState.conditions.reduce((level, c) => {
        const match = c.match(/^Exhaustion (\d)$/);
        return match ? Math.max(level, parseInt(match[1])) : level;
      }, 0)
    : 0;

  return (
    <div className="min-h-screen bg-bg-deep">
      {showShortRest && dailyState && (
        <ShortRestModal
          character={character}
          dailyState={dailyState}
          onClose={() => setShowShortRest(false)}
          onConfirm={handleShortRestConfirm}
        />
      )}

      {/* Skill Check Roller Modal */}
      {showSkillRoller && (
        <SkillCheckRoller
          abilityScores={character.abilityScores}
          abilitySwap={dailyState?.abilitySwap ?? null}
          proficiencyBonus={profBonus}
          proficientSkills={allProficientSkills}
          proficientSaves={["DEX", "CHA"]}
          preselectedSkill={preselectedSkill}
          preselectedSave={preselectedSave}
          preselectedAbility={preselectedAbility}
          onClose={handleSkillRollerClose}
        />
      )}

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

          {/* Status Bar: Inspiration + Concentration */}
          {dailyState && (
            <div className="mt-3">
              <StatusBar
                inspiration={dailyState.inspiration}
                concentrationSpell={dailyState.concentrationSpell}
                onInspirationToggle={() =>
                  updateDailyStateOnServer({ inspiration: !dailyState.inspiration })
                }
                onConcentrationDismiss={() =>
                  updateDailyStateOnServer({ concentrationSpell: null })
                }
              />
            </div>
          )}

          {/* HP Bar + rest actions */}
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div className="max-w-md flex-1">
              <HPBar
                current={currentHP}
                max={maxHP}
                temp={tempHP}
                onUpdate={handleHPUpdate}
              />
            </div>
            {dailyState && (
              <button
                onClick={() => setShowShortRest(true)}
                className="shrink-0 px-3 py-1.5 rounded border border-border-subtle bg-bg-elevated hover:bg-bg-hover text-text-secondary hover:text-text-primary text-xs font-body transition-colors"
              >
                Short Rest
              </button>
            )}
          </div>

          {/* Death Saves — shown when HP is 0 */}
          {dailyState && dailyState.currentHP === 0 && (
            <div className="mt-3 max-w-md">
              <DeathSaves
                successes={dailyState.deathSaves.successes}
                failures={dailyState.deathSaves.failures}
                onUpdate={(s, f) =>
                  updateDailyStateOnServer({
                    deathSaves: { successes: s, failures: f },
                  })
                }
                visible={true}
              />
            </div>
          )}

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
          {/* Left sidebar: ability scores + passive scores + defenses + conditions */}
          <aside className="w-full lg:w-56 shrink-0">
            <AbilitySidebar
              abilityScores={character.abilityScores}
              proficiencyBonus={profBonus}
              dailyState={dailyState}
              level={character.level}
              onSkillClick={handleSkillClick}
              onSaveClick={handleSaveClick}
              onAbilityClick={handleAbilityClick}
            />

            {/* Passive Scores */}
            <div className="mt-4">
              <Card variant="default">
                <PassiveScores
                  abilityScores={character.abilityScores}
                  abilitySwap={dailyState?.abilitySwap ?? null}
                  proficiencyBonus={profBonus}
                  proficientSkills={allProficientSkills}
                />
              </Card>
            </div>

            {/* Defenses & Movement */}
            {dailyState && (
              <div className="mt-4">
                <Card variant="default">
                  <DefensesPanel
                    movementSpeeds={dailyState.movementSpeeds ?? { walking: 30 }}
                    resistances={[]}
                    immunities={[]}
                    vulnerabilities={[]}
                  />
                </Card>
              </div>
            )}

            {/* Conditions Tracker */}
            {dailyState && (
              <div className="mt-4">
                <Card variant="default">
                  <ConditionTracker
                    conditions={dailyState.conditions}
                    exhaustionLevel={exhaustionLevel}
                    onConditionsChange={(conditions) =>
                      updateDailyStateOnServer({ conditions })
                    }
                    onExhaustionChange={(level) => {
                      // Update conditions: remove old exhaustion, add new one
                      const nonExhaustion = dailyState.conditions.filter(
                        (c) => !c.startsWith("Exhaustion")
                      );
                      const newConditions =
                        level > 0
                          ? [...nonExhaustion, `Exhaustion ${level}`]
                          : nonExhaustion;
                      updateDailyStateOnServer({ conditions: newConditions });
                    }}
                  />
                </Card>
              </div>
            )}
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
                <EquipmentTab
                  inventory={inventory}
                  currency={currency}
                  onInventoryUpdate={handleInventoryUpdate}
                  onCurrencyUpdate={handleCurrencyUpdate}
                />
              )}
              {activeTab === "description" && (
                <DescriptionTab
                  characterId={character.id}
                  personality={character.personality}
                  ideals={character.ideals}
                  bonds={character.bonds}
                  flaws={character.flaws}
                  backstory={character.backstory}
                  alignment={character.alignment}
                  appearance={character.appearance}
                  portraitUrl={character.portraitUrl}
                />
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
