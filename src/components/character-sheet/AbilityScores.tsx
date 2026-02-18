"use client";

import React from "react";
import { HexBadge } from "@/components/ui";
import type { AbilityScores as AbilityScoresType } from "@/types/character";
import type { AbilityScore } from "@/types/forms";

const ABILITIES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Standard 5e proficiency bonus by level
function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

// Standard 5e saving throw proficiency by class (simplified - shown via daily state)
// Skills with their governing ability
const SKILLS: { name: string; ability: AbilityScore; id: string }[] = [
  { name: "Acrobatics", ability: "DEX", id: "acrobatics" },
  { name: "Animal Handling", ability: "WIS", id: "animal_handling" },
  { name: "Arcana", ability: "INT", id: "arcana" },
  { name: "Athletics", ability: "STR", id: "athletics" },
  { name: "Deception", ability: "CHA", id: "deception" },
  { name: "History", ability: "INT", id: "history" },
  { name: "Insight", ability: "WIS", id: "insight" },
  { name: "Intimidation", ability: "CHA", id: "intimidation" },
  { name: "Investigation", ability: "INT", id: "investigation" },
  { name: "Medicine", ability: "WIS", id: "medicine" },
  { name: "Nature", ability: "INT", id: "nature" },
  { name: "Perception", ability: "WIS", id: "perception" },
  { name: "Performance", ability: "CHA", id: "performance" },
  { name: "Persuasion", ability: "CHA", id: "persuasion" },
  { name: "Religion", ability: "INT", id: "religion" },
  { name: "Sleight of Hand", ability: "DEX", id: "sleight_of_hand" },
  { name: "Stealth", ability: "DEX", id: "stealth" },
  { name: "Survival", ability: "WIS", id: "survival" },
];

interface AbilityScoresProps {
  abilityScores: AbilityScoresType;
  level: number;
  swappedAbilities: { score1: AbilityScore; score2: AbilityScore } | null;
  proficientSkills?: string[];
  proficientSaves?: AbilityScore[];
}

export default function AbilityScores({
  abilityScores,
  level,
  swappedAbilities,
  proficientSkills = [],
  proficientSaves = [],
}: AbilityScoresProps) {
  const profBonus = getProficiencyBonus(level);

  function isSwapped(ability: AbilityScore): boolean {
    if (!swappedAbilities) return false;
    return (
      swappedAbilities.score1 === ability || swappedAbilities.score2 === ability
    );
  }

  function getEffectiveScore(ability: AbilityScore): number {
    if (!swappedAbilities) return abilityScores[ability];
    if (swappedAbilities.score1 === ability) return abilityScores[swappedAbilities.score2];
    if (swappedAbilities.score2 === ability) return abilityScores[swappedAbilities.score1];
    return abilityScores[ability];
  }

  function getSaveMod(ability: AbilityScore): number {
    const mod = getModifier(getEffectiveScore(ability));
    const isProficient = proficientSaves.includes(ability);
    return isProficient ? mod + profBonus : mod;
  }

  function getSkillMod(skill: { name: string; ability: AbilityScore; id: string }): number {
    const mod = getModifier(getEffectiveScore(skill.ability));
    const isProficient = proficientSkills.includes(skill.id);
    return isProficient ? mod + profBonus : mod;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Ability Score Hexes */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-2">
        {ABILITIES.map((ability) => {
          const effectiveScore = getEffectiveScore(ability);
          const mod = getModifier(effectiveScore);
          const saveMod = getSaveMod(ability);
          const isProfSave = proficientSaves.includes(ability);
          return (
            <HexBadge
              key={ability}
              ability={ability}
              score={effectiveScore}
              modifier={mod}
              isSwapped={isSwapped(ability)}
              saveProficient={isProfSave}
              saveBonus={saveMod}
            />
          );
        })}
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-xs font-body text-text-secondary uppercase tracking-widest mb-1">
          Skills
        </h3>
        {SKILLS.map((skill) => {
          const mod = getSkillMod(skill);
          const isProficient = proficientSkills.includes(skill.id);
          const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
          return (
            <div key={skill.id} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 border ${
                  isProficient
                    ? "bg-accent border-accent"
                    : "bg-transparent border-border-subtle"
                }`}
              />
              <span className="text-xs font-body text-text-secondary flex-1 truncate">
                {skill.name}
              </span>
              <span className="text-xs font-mono text-text-highlight">{modStr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
