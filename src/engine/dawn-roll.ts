import type { DawnRollOutcome } from "@/types/dice";

export function resolveDawnRollOutcome(
  roll: number,
  level: number
): DawnRollOutcome {
  if (roll === 1) return "DM_DESIGN";
  if (roll === 20) return "MASTER";
  if (roll >= 16) return level >= 5 ? "FAVORED" : "UNSTABLE";
  if (roll >= 11) return level >= 5 ? "GUIDED" : "DEEP_CHAOS";
  if (roll >= 6) return "UNSTABLE";
  return "DEEP_CHAOS";
}

export function dawnRollUsesStabilized(outcome: DawnRollOutcome): boolean {
  return outcome === "GUIDED" || outcome === "FAVORED" || outcome === "MASTER";
}

/**
 * Twist of Fate (Level 14): Once per long rest, force a reroll on any attack
 * roll, saving throw, or ability check within 60 feet and choose which result
 * is used. Availability check only — tracking usage is the UI/state layer's job.
 */
export function hasTwistOfFate(level: number): boolean {
  return level >= 14;
}

/**
 * Defy Fate (Level 18): Once per long rest, ignore the Dawn Roll entirely and
 * choose any form or Chaos Form table results freely for 24 hours.
 * The next Dawn Roll after use is automatically DM's Design (Fate's Reckoning).
 * Availability check only — tracking usage and Fate's Reckoning is the UI/state layer's job.
 */
export function hasDefyFate(level: number): boolean {
  return level >= 18;
}

/**
 * Lord of Chaos (Level 20): Expanded Dual Nature (all secondary form base features),
 * Chaos Mastery (choose 2 of 4 table results), and Persistent Memory (one permanent
 * Residual Memory slot). Also keeps the 2d20-keep-highest Dawn Roll from Extra Dawn Die.
 * Availability check only — the full mechanics are handled by the UI/state layer.
 */
export function hasLordOfChaos(level: number): boolean {
  return level >= 20;
}
