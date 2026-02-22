import type { AbilityScores } from "@/types/character";
import type { AbilityScore } from "@/types/forms";

export function getAbilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getEffectiveScores(
  scores: AbilityScores,
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null
): AbilityScores {
  if (!abilitySwap) return scores;
  const { score1, score2 } = abilitySwap;
  return {
    ...scores,
    [score1]: scores[score2],
    [score2]: scores[score1],
  };
}
