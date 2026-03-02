"use client";

import React from "react";
import { AbilityScores } from "@/types/character";
import { DailyState } from "@/types/character";
import { AbilityScore } from "@/types/forms";
import { HexBadge, Card } from "@/components/ui";
import RollableValue from "@/components/ui/RollableValue";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";

interface Props {
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  dailyState: DailyState | null;
  level: number;
  onSkillClick?: (skill: string) => void;
  onSaveClick?: (save: AbilityScore) => void;
  onAbilityClick?: (ability: AbilityScore) => void;
}

const ABILITY_ORDER: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function getSavingThrows(
  dailyState: DailyState | null
): [AbilityScore, AbilityScore] | null {
  if (!dailyState || dailyState.formType !== "STABILIZED" || !dailyState.stabilizedFormId) {
    return null;
  }
  const form = STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId);
  return form?.savingThrows ?? null;
}

export default function AbilitySidebar({
  abilityScores,
  proficiencyBonus,
  dailyState,
  level,
  onSkillClick,
  onSaveClick,
  onAbilityClick,
}: Props) {
  const swappedAbilities = dailyState?.abilitySwap
    ? new Set([dailyState.abilitySwap.score1, dailyState.abilitySwap.score2])
    : new Set<AbilityScore>();

  const savingThrows = getSavingThrows(dailyState);
  const saveSet = savingThrows ? new Set<AbilityScore>(savingThrows) : new Set<AbilityScore>();

  // Effective scores after swap
  function effectiveScore(ability: AbilityScore): number {
    if (!dailyState?.abilitySwap) return abilityScores[ability];
    const { score1, score2 } = dailyState.abilitySwap;
    if (ability === score1) return abilityScores[score2];
    if (ability === score2) return abilityScores[score1];
    return abilityScores[ability];
  }

  // Passive perception
  const wisScore = effectiveScore("WIS");
  const wisMod = getModifier(wisScore);
  const passivePerception = 10 + wisMod + (saveSet.has("WIS") ? proficiencyBonus : 0);

  // Initiative
  const dexScore = effectiveScore("DEX");
  const dexMod = getModifier(dexScore);

  return (
    <div className="flex flex-col gap-4">
      {/* Ability scores */}
      <Card variant="default">
        <h2 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Ability Scores
        </h2>
        {dailyState?.abilitySwap && (
          <p className="text-xs text-fate-glow font-body mb-3 leading-snug">
            Fate Attuned: {dailyState.abilitySwap.score1} ↔{" "}
            {dailyState.abilitySwap.score2}
          </p>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-2 gap-y-3 gap-x-2 justify-items-center">
          {ABILITY_ORDER.map((ability) => {
            const score = effectiveScore(ability);
            const mod = getModifier(score);
            const isSwapped = swappedAbilities.has(ability);
            const isProfSave = saveSet.has(ability);
            const saveBonus = isProfSave ? mod + proficiencyBonus : mod;

            return (
              <div
                key={ability}
                className={onAbilityClick ? "cursor-pointer" : ""}
                onClick={() => onAbilityClick?.(ability)}
              >
                <HexBadge
                  ability={ability}
                  score={score}
                  modifier={mod}
                  isSwapped={isSwapped}
                  saveProficient={isProfSave}
                  saveBonus={saveBonus}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Combat stats */}
      <Card variant="default">
        <h2 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
          Combat
        </h2>
        <div className="flex flex-col gap-2 text-sm font-body">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Initiative</span>
            <RollableValue onClick={() => onAbilityClick?.("DEX")} label="Initiative">
              {dexMod >= 0 ? `+${dexMod}` : `${dexMod}`}
            </RollableValue>
          </div>
          <StatRow label="Passive Perc." value={`${passivePerception}`} />
          <StatRow label="Prof. Bonus" value={`+${proficiencyBonus}`} />
          <StatRow label="Level" value={`${level}`} />
        </div>
      </Card>

      {/* Saving throws */}
      {savingThrows && (
        <Card variant="default">
          <h2 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-3">
            Saving Throws
          </h2>
          <div className="flex flex-col gap-1.5 text-sm font-body">
            {ABILITY_ORDER.map((ability) => {
              const score = effectiveScore(ability);
              const mod = getModifier(score);
              const isProfSave = saveSet.has(ability);
              const saveBonus = isProfSave ? mod + proficiencyBonus : mod;
              const saveStr = saveBonus >= 0 ? `+${saveBonus}` : `${saveBonus}`;

              return (
                <div key={ability} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full border ${
                        isProfSave
                          ? "bg-accent border-accent"
                          : "bg-transparent border-border-subtle"
                      }`}
                    />
                    <span className="text-text-secondary">{ability}</span>
                  </div>
                  <RollableValue onClick={() => onSaveClick?.(ability)} label={`${ability} Save`}>
                    {saveStr}
                  </RollableValue>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Dawn roll info */}
      {dailyState && (
        <Card variant={dailyState.formType === "CHAOS" ? "accent" : "fate"}>
          <h2 className="text-xs font-heading text-text-secondary uppercase tracking-widest mb-2">
            Dawn Roll
          </h2>
          <div className="text-sm font-body text-text-secondary space-y-1">
            <p>
              <span className="text-text-primary font-mono text-base">
                {dailyState.dawnRoll.chosen}
              </span>{" "}
              {dailyState.dawnRoll.die2 !== undefined && (
                <span className="text-xs">
                  (rolled {dailyState.dawnRoll.die1} &amp; {dailyState.dawnRoll.die2})
                </span>
              )}
            </p>
            <p className="text-xs capitalize">
              {dailyState.dawnRollOutcome.replace(/_/g, " ").toLowerCase()}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary font-mono">{value}</span>
    </div>
  );
}
