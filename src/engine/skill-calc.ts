import type { AbilityScores } from "@/types/character";
import type { AbilityScore } from "@/types/forms";
import type { CheckResult, RollMode } from "@/types/rolls";
import { getAbilityMod, getEffectiveScores, formatMod } from "./attack-calc";
import { rollDie } from "@/lib/dice";

const SKILL_ABILITY_MAP: Record<string, AbilityScore> = {
  "Acrobatics": "DEX",
  "Animal Handling": "WIS",
  "Arcana": "INT",
  "Athletics": "STR",
  "Deception": "CHA",
  "History": "INT",
  "Insight": "WIS",
  "Intimidation": "CHA",
  "Investigation": "INT",
  "Medicine": "WIS",
  "Nature": "INT",
  "Perception": "WIS",
  "Performance": "CHA",
  "Persuasion": "CHA",
  "Religion": "INT",
  "Sleight of Hand": "DEX",
  "Stealth": "DEX",
  "Survival": "WIS",
};

export function getSkillAbility(skill: string): AbilityScore {
  const ability = SKILL_ABILITY_MAP[skill];
  if (!ability) throw new Error(`Unknown skill: ${skill}`);
  return ability;
}

export function getSkillMod(
  scores: AbilityScores,
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null,
  skill: string,
  proficiencyBonus: number,
  proficientSkills: string[]
): number {
  const effective = getEffectiveScores(scores, abilitySwap);
  const ability = getSkillAbility(skill);
  const mod = getAbilityMod(effective[ability]);
  return proficientSkills.includes(skill) ? mod + proficiencyBonus : mod;
}

export function getSaveMod(
  scores: AbilityScores,
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null,
  ability: AbilityScore,
  proficiencyBonus: number,
  proficientSaves: AbilityScore[]
): number {
  const effective = getEffectiveScores(scores, abilitySwap);
  const mod = getAbilityMod(effective[ability]);
  return proficientSaves.includes(ability) ? mod + proficiencyBonus : mod;
}

export function getPassiveScore(skillMod: number): number {
  return 10 + skillMod;
}

export function formatCheckBreakdown(
  d20: number,
  label: string,
  modifier: number,
  total: number
): string {
  return `d20(${d20})${label ? ` + ${label}` : ""}(${formatMod(modifier)}) = ${total}`;
}

export function rollCheck(
  modifier: number,
  rollMode: RollMode = "normal"
): CheckResult {
  const d20 = rollDie(20);
  const d20Second = rollMode !== "normal" ? rollDie(20) : undefined;
  const used =
    rollMode === "advantage"
      ? Math.max(d20, d20Second!)
      : rollMode === "disadvantage"
      ? Math.min(d20, d20Second!)
      : d20;
  const total = used + modifier;
  return {
    d20,
    d20Second,
    total,
    breakdown: formatCheckBreakdown(used, "", modifier, total),
    isNat20: used === 20,
    isNat1: used === 1,
    rollMode,
  };
}
