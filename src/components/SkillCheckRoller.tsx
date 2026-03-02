"use client";

import React, { useState, useEffect } from "react";
import type { AbilityScores } from "@/types/character";
import type { AbilityScore } from "@/types/forms";
import type { CheckResult, RollMode } from "@/types/rolls";
import {
  getSkillMod,
  getSaveMod,
  rollCheck,
  formatCheckBreakdown,
} from "@/engine/skill-calc";
import { getAbilityMod, getEffectiveScores, formatMod } from "@/engine/attack-calc";

const SKILLS: { name: string; ability: AbilityScore }[] = [
  { name: "Acrobatics", ability: "DEX" },
  { name: "Animal Handling", ability: "WIS" },
  { name: "Arcana", ability: "INT" },
  { name: "Athletics", ability: "STR" },
  { name: "Deception", ability: "CHA" },
  { name: "History", ability: "INT" },
  { name: "Insight", ability: "WIS" },
  { name: "Intimidation", ability: "CHA" },
  { name: "Investigation", ability: "INT" },
  { name: "Medicine", ability: "WIS" },
  { name: "Nature", ability: "INT" },
  { name: "Perception", ability: "WIS" },
  { name: "Performance", ability: "CHA" },
  { name: "Persuasion", ability: "CHA" },
  { name: "Religion", ability: "INT" },
  { name: "Sleight of Hand", ability: "DEX" },
  { name: "Stealth", ability: "DEX" },
  { name: "Survival", ability: "WIS" },
];

const ABILITIES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

type TabId = "skills" | "saves" | "ability";

interface SelectedCheck {
  label: string;
  modifier: number;
}

export interface SkillCheckRollerProps {
  abilityScores: AbilityScores;
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null;
  proficiencyBonus: number;
  proficientSkills: string[];
  proficientSaves: AbilityScore[];
  preselectedSkill?: string;
  preselectedSave?: AbilityScore;
  preselectedAbility?: AbilityScore;
  onClose: () => void;
}

export default function SkillCheckRoller({
  abilityScores,
  abilitySwap,
  proficiencyBonus,
  proficientSkills,
  proficientSaves,
  preselectedSkill,
  preselectedSave,
  preselectedAbility,
  onClose,
}: SkillCheckRollerProps) {
  function getInitialTab(): TabId {
    if (preselectedSave) return "saves";
    if (preselectedAbility) return "ability";
    return "skills";
  }

  function getInitialCheck(): SelectedCheck | null {
    if (preselectedSkill) {
      const skill = SKILLS.find((s) => s.name === preselectedSkill);
      if (skill) {
        const mod = getSkillMod(
          abilityScores,
          abilitySwap,
          preselectedSkill,
          proficiencyBonus,
          proficientSkills
        );
        return { label: preselectedSkill, modifier: mod };
      }
    }
    if (preselectedSave) {
      const mod = getSaveMod(
        abilityScores,
        abilitySwap,
        preselectedSave,
        proficiencyBonus,
        proficientSaves
      );
      return { label: `${preselectedSave} Save`, modifier: mod };
    }
    if (preselectedAbility) {
      const effective = getEffectiveScores(abilityScores, abilitySwap);
      const mod = getAbilityMod(effective[preselectedAbility]);
      return { label: `${preselectedAbility} Check`, modifier: mod };
    }
    return null;
  }

  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab);
  const [selectedCheck, setSelectedCheck] = useState<SelectedCheck | null>(getInitialCheck);
  const [rollMode, setRollMode] = useState<RollMode>("normal");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function selectSkill(skill: { name: string; ability: AbilityScore }) {
    const mod = getSkillMod(
      abilityScores,
      abilitySwap,
      skill.name,
      proficiencyBonus,
      proficientSkills
    );
    setSelectedCheck({ label: skill.name, modifier: mod });
    setResult(null);
  }

  function selectSave(ability: AbilityScore) {
    const mod = getSaveMod(
      abilityScores,
      abilitySwap,
      ability,
      proficiencyBonus,
      proficientSaves
    );
    setSelectedCheck({ label: `${ability} Save`, modifier: mod });
    setResult(null);
  }

  function selectAbility(ability: AbilityScore) {
    const effective = getEffectiveScores(abilityScores, abilitySwap);
    const mod = getAbilityMod(effective[ability]);
    setSelectedCheck({ label: `${ability} Check`, modifier: mod });
    setResult(null);
  }

  function handleRoll() {
    if (!selectedCheck) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    const checkResult = rollCheck(selectedCheck.modifier, rollMode);
    const breakdown = formatCheckBreakdown(
      checkResult.rollMode === "advantage"
        ? Math.max(checkResult.d20, checkResult.d20Second ?? 0)
        : checkResult.rollMode === "disadvantage"
        ? Math.min(checkResult.d20, checkResult.d20Second ?? 20)
        : checkResult.d20,
      selectedCheck.label,
      selectedCheck.modifier,
      checkResult.total
    );
    setResult({ ...checkResult, breakdown });
  }

  function handleReset() {
    setResult(null);
  }

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    setSelectedCheck(null);
    setResult(null);
  }

  const effective = getEffectiveScores(abilityScores, abilitySwap);

  const resultColorClass = result?.isNat20
    ? "text-green-400"
    : result?.isNat1
    ? "text-accent"
    : "text-text-primary";

  const resultBgClass = result?.isNat20
    ? "bg-green-900/20 border-green-600/40"
    : result?.isNat1
    ? "bg-accent/10 border-accent/40"
    : "bg-bg-elevated border-border-subtle";

  // Determine which d20 was used for advantage/disadvantage display
  const usedD20 =
    result?.rollMode === "advantage"
      ? Math.max(result.d20, result.d20Second ?? 0)
      : result?.rollMode === "disadvantage"
      ? Math.min(result.d20, result.d20Second ?? 20)
      : result?.d20;

  const unusedD20 =
    result && result.d20Second !== undefined
      ? result.rollMode === "advantage"
        ? Math.min(result.d20, result.d20Second)
        : Math.max(result.d20, result.d20Second)
      : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6 max-w-md w-full mx-4 flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="font-heading text-lg text-text-primary">Skill Check</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-bg-elevated rounded-lg p-1 flex-shrink-0">
          {(["skills", "saves", "ability"] as TabId[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-1.5 px-2 rounded text-sm font-body capitalize transition-colors ${
                activeTab === tab
                  ? "bg-bg-surface text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab === "ability" ? "Ability" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Check list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === "skills" && (
            <div className="flex flex-col gap-0.5">
              {SKILLS.map((skill) => {
                const mod = getSkillMod(
                  abilityScores,
                  abilitySwap,
                  skill.name,
                  proficiencyBonus,
                  proficientSkills
                );
                const isProficient = proficientSkills.includes(skill.name);
                const isSelected = selectedCheck?.label === skill.name;
                return (
                  <button
                    key={skill.name}
                    onClick={() => selectSkill(skill)}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-left ${
                      isSelected
                        ? "bg-accent/20 border border-accent/40"
                        : "hover:bg-bg-elevated border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 border ${
                        isProficient
                          ? "bg-accent border-accent"
                          : "bg-transparent border-border-subtle"
                      }`}
                    />
                    <span className="text-sm font-body text-text-primary flex-1">
                      {skill.name}
                    </span>
                    <span className="text-xs font-body text-text-secondary mr-1">
                      {skill.ability}
                    </span>
                    <span className="text-sm font-mono text-text-highlight w-8 text-right">
                      {formatMod(mod)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === "saves" && (
            <div className="flex flex-col gap-0.5">
              {ABILITIES.map((ability) => {
                const mod = getSaveMod(
                  abilityScores,
                  abilitySwap,
                  ability,
                  proficiencyBonus,
                  proficientSaves
                );
                const isProficient = proficientSaves.includes(ability);
                const isSelected = selectedCheck?.label === `${ability} Save`;
                return (
                  <button
                    key={ability}
                    onClick={() => selectSave(ability)}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-left ${
                      isSelected
                        ? "bg-accent/20 border border-accent/40"
                        : "hover:bg-bg-elevated border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 border ${
                        isProficient
                          ? "bg-accent border-accent"
                          : "bg-transparent border-border-subtle"
                      }`}
                    />
                    <span className="text-sm font-body text-text-primary flex-1">
                      {ability} Saving Throw
                    </span>
                    <span className="text-sm font-mono text-text-highlight w-8 text-right">
                      {formatMod(mod)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === "ability" && (
            <div className="flex flex-col gap-0.5">
              {ABILITIES.map((ability) => {
                const mod = getAbilityMod(effective[ability]);
                const isSelected = selectedCheck?.label === `${ability} Check`;
                return (
                  <button
                    key={ability}
                    onClick={() => selectAbility(ability)}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-left ${
                      isSelected
                        ? "bg-accent/20 border border-accent/40"
                        : "hover:bg-bg-elevated border border-transparent"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0 border bg-transparent border-border-subtle" />
                    <span className="text-sm font-body text-text-primary flex-1">
                      {ability} Check
                    </span>
                    <span className="text-xs font-mono text-text-secondary mr-1">
                      {effective[ability]}
                    </span>
                    <span className="text-sm font-mono text-text-highlight w-8 text-right">
                      {formatMod(mod)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Roll controls */}
        <div className="flex flex-col gap-3 flex-shrink-0 border-t border-border-subtle pt-3">
          {/* Advantage/Disadvantage toggle */}
          <div className="flex gap-1 bg-bg-elevated rounded-lg p-1">
            {(["normal", "advantage", "disadvantage"] as RollMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setRollMode(mode)}
                className={`flex-1 py-1 px-1 rounded text-xs font-body capitalize transition-colors ${
                  rollMode === mode
                    ? mode === "advantage"
                      ? "bg-green-800/60 text-green-300"
                      : mode === "disadvantage"
                      ? "bg-red-900/60 text-red-300"
                      : "bg-bg-surface text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {mode === "normal" ? "Normal" : mode === "advantage" ? "Adv" : "Dis"}
              </button>
            ))}
          </div>

          {/* Result display */}
          {result && (
            <div
              className={`rounded-lg border p-3 flex flex-col gap-1 transition-all duration-300 ${resultBgClass} ${
                isAnimating ? "scale-95 opacity-70" : "scale-100 opacity-100"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                {/* d20 result(s) */}
                <div className="flex items-center gap-2">
                  {result.d20Second !== undefined ? (
                    <>
                      <span
                        className={`text-3xl font-heading font-bold ${
                          result.d20 === usedD20 ? resultColorClass : "text-text-secondary line-through"
                        }`}
                      >
                        {result.d20}
                      </span>
                      <span className="text-text-secondary text-sm">/</span>
                      <span
                        className={`text-3xl font-heading font-bold ${
                          result.d20Second === usedD20 ? resultColorClass : "text-text-secondary line-through"
                        }`}
                      >
                        {result.d20Second}
                      </span>
                    </>
                  ) : (
                    <span className={`text-3xl font-heading font-bold ${resultColorClass}`}>
                      {result.d20}
                    </span>
                  )}
                </div>
                <span className="text-text-secondary text-xl">=</span>
                <span className={`text-3xl font-heading font-bold ${resultColorClass}`}>
                  {result.total}
                </span>
              </div>
              <p className="text-xs font-mono text-text-secondary text-center">{result.breakdown}</p>
              {result.isNat20 && (
                <p className="text-xs font-body text-green-400 text-center font-semibold">Natural 20!</p>
              )}
              {result.isNat1 && (
                <p className="text-xs font-body text-accent text-center font-semibold">Natural 1!</p>
              )}
            </div>
          )}

          {/* Roll / Reset buttons */}
          <div className="flex gap-2">
            {result ? (
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-4 rounded bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors text-sm font-body"
              >
                Roll Again
              </button>
            ) : (
              <button
                onClick={handleRoll}
                disabled={!selectedCheck}
                className={`flex-1 py-2 px-4 rounded text-sm font-body font-semibold transition-colors ${
                  selectedCheck
                    ? "bg-accent hover:bg-accent-hover text-white"
                    : "bg-bg-elevated border border-border-subtle text-text-secondary cursor-not-allowed"
                }`}
              >
                {selectedCheck
                  ? `Roll ${selectedCheck.label} (${formatMod(selectedCheck.modifier)})`
                  : "Select a check"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
