"use client";
import { AbilityScores } from "@/types/character";
import { AbilityScore } from "@/types/forms";
import { getSkillMod, getPassiveScore } from "@/engine/skill-calc";

interface PassiveScoresProps {
  abilityScores: AbilityScores;
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null;
  proficiencyBonus: number;
  proficientSkills: string[];
}

const PASSIVE_SKILLS = ["Perception", "Investigation", "Insight"] as const;

export default function PassiveScores({
  abilityScores,
  abilitySwap,
  proficiencyBonus,
  proficientSkills,
}: PassiveScoresProps) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs uppercase tracking-wider text-text-secondary font-heading">
        Passive Scores
      </h4>
      {PASSIVE_SKILLS.map((skill) => {
        const mod = getSkillMod(
          abilityScores,
          abilitySwap,
          skill,
          proficiencyBonus,
          proficientSkills
        );
        const passive = getPassiveScore(mod);
        return (
          <div
            key={skill}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-text-secondary">{skill}</span>
            <span className="text-text-primary font-mono">{passive}</span>
          </div>
        );
      })}
    </div>
  );
}
