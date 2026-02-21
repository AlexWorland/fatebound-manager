"use client";

import React from "react";
import { AbilityScores } from "@/types/character";
import { DailyState } from "@/types/character";
import { AbilityScore } from "@/types/forms";
import { AbilityScoreBox } from "@/components/ui";
import PassiveSenses from "@/components/character-sheet/PassiveSenses";
import ProficienciesPanel from "@/components/character-sheet/ProficienciesPanel";
import { STABILIZED_FORMS } from "@/data/tables/stabilized-forms";

interface Props {
  name: string;
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  dailyState: DailyState | null;
  level: number;
  permanentSkills: [string, string];
}

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

const ABILITY_ORDER: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

// Skills that grant passive sense bonuses when proficient
const PERCEPTION_SKILL = "Perception";
const INVESTIGATION_SKILL = "Investigation";
const INSIGHT_SKILL = "Insight";

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function getSavingThrowProficiencies(dailyState: DailyState | null): AbilityScore[] {
  if (!dailyState || dailyState.formType !== "STABILIZED" || !dailyState.stabilizedFormId) {
    return [];
  }
  const form = STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId);
  return form?.savingThrows ? [...form.savingThrows] : [];
}

export default function AbilitySidebar({
  name: _name,
  abilityScores,
  proficiencyBonus,
  dailyState,
  level: _level,
  permanentSkills,
}: Props) {
  const swappedAbilities = dailyState?.abilitySwap
    ? new Set([dailyState.abilitySwap.score1, dailyState.abilitySwap.score2])
    : new Set<AbilityScore>();

  const saveProficiencies = getSavingThrowProficiencies(dailyState);
  const saveSet = new Set<AbilityScore>(saveProficiencies);

  function effectiveScore(ability: AbilityScore): number {
    if (!dailyState?.abilitySwap) return abilityScores[ability];
    const { score1, score2 } = dailyState.abilitySwap;
    if (ability === score1) return abilityScores[score2];
    if (ability === score2) return abilityScores[score1];
    return abilityScores[ability];
  }

  function isSkillProficient(skillName: string): boolean {
    if (permanentSkills.includes(skillName)) return true;
    if (dailyState?.formType === "STABILIZED" && dailyState.stabilizedFormId) {
      const form = STABILIZED_FORMS.find((f) => f.id === dailyState.stabilizedFormId);
      return (form?.dailySkillOptions ?? []).includes(skillName);
    }
    return false;
  }

  // Passive senses
  const wisMod = getModifier(effectiveScore("WIS"));
  const intMod = getModifier(effectiveScore("INT"));
  const percProficient = isSkillProficient(PERCEPTION_SKILL);
  const invProficient = isSkillProficient(INVESTIGATION_SKILL);
  const insightProficient = isSkillProficient(INSIGHT_SKILL);

  const passivePerception = 10 + wisMod + (percProficient ? proficiencyBonus : 0);
  const passiveInvestigation = 10 + intMod + (invProficient ? proficiencyBonus : 0);
  const passiveInsight = 10 + wisMod + (insightProficient ? proficiencyBonus : 0);

  // Fatebound common proficiencies
  const fateboundArmor = ["Light Armor", "Medium Armor", "Shields"];
  const fateboundWeapons = ["Simple Weapons", "Martial Weapons"];
  const fateboundLanguages = ["Common"];

  return (
    <div className="flex flex-col gap-3">
      {/* Ability Scores */}
      <div>
        <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-2">
          Ability Scores
        </div>
        {dailyState?.abilitySwap && (
          <p className="text-[10px] font-condensed text-fate mb-2">
            Fate Attuned: {dailyState.abilitySwap.score1} ↔ {dailyState.abilitySwap.score2}
          </p>
        )}
        <div className="grid grid-cols-2 gap-2 justify-items-center">
          {ABILITY_ORDER.map((ability) => {
            const score = effectiveScore(ability);
            const mod = getModifier(score);
            const isSwapped = swappedAbilities.has(ability);
            const isProfSave = saveSet.has(ability);
            const saveModifier = isProfSave ? mod + proficiencyBonus : mod;

            return (
              <AbilityScoreBox
                key={ability}
                ability={ability}
                score={score}
                modifier={mod}
                isSwapped={isSwapped}
                saveProficient={isProfSave}
                saveModifier={saveModifier}
              />
            );
          })}
        </div>
      </div>

      {/* Passive Senses */}
      <PassiveSenses
        passivePerception={passivePerception}
        passiveInvestigation={passiveInvestigation}
        passiveInsight={passiveInsight}
      />

      {/* Skills */}
      <div className="bg-bg-surface rounded p-3">
        <div className="text-[10px] font-condensed font-bold uppercase text-text-muted tracking-wider mb-2">
          Skills
        </div>
        <div className="flex flex-col">
          {SKILLS.map((skill) => {
            const mod = getModifier(effectiveScore(skill.ability));
            const proficient = isSkillProficient(skill.name);
            const total = proficient ? mod + proficiencyBonus : mod;
            const modStr = total >= 0 ? `+${total}` : `${total}`;

            return (
              <div key={skill.name} className="flex items-center h-[26px] gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    proficient
                      ? "bg-accent"
                      : "border border-text-muted bg-transparent"
                  }`}
                />
                <span className="text-[10px] font-condensed font-bold text-text-muted w-[24px] flex-shrink-0 uppercase">
                  {skill.ability}
                </span>
                <span className="text-[11px] font-condensed text-text-secondary flex-1 truncate">
                  {skill.name}
                </span>
                <span className="text-[11px] font-condensed font-bold text-text-highlight tabular-nums">
                  {modStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proficiencies */}
      <ProficienciesPanel
        armor={fateboundArmor}
        weapons={fateboundWeapons}
        languages={fateboundLanguages}
      />
    </div>
  );
}
