export type StandardDie = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export interface DiceRoll {
  die: StandardDie;
  result: number;
}

export interface DawnRollResult {
  die1: number;
  die2?: number;
  chosen: number;
}

export type DawnRollOutcome =
  | "DM_DESIGN"
  | "DEEP_CHAOS"
  | "UNSTABLE"
  | "GUIDED"
  | "FAVORED"
  | "MASTER";
