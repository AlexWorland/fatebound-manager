import type { DawnRollOutcome } from "@/types/dice";

export function resolveDawnRollOutcome(
  roll: number,
  level: number
): DawnRollOutcome {
  if (roll === 1) return "DM_DESIGN";
  if (roll === 20) return "MASTER";
  if (roll >= 16) return level >= 5 ? "FAVORED" : "UNSTABLE";
  if (roll >= 11) return level >= 5 ? "GUIDED" : "UNSTABLE";
  if (roll >= 6) return "UNSTABLE";
  return "DEEP_CHAOS";
}

export function dawnRollUsesStabilized(outcome: DawnRollOutcome): boolean {
  return outcome === "GUIDED" || outcome === "FAVORED" || outcome === "MASTER";
}
