export type RollMode = "normal" | "advantage" | "disadvantage";

export interface CheckResult {
  d20: number;
  d20Second?: number;
  total: number;
  breakdown: string;
  isNat20: boolean;
  isNat1: boolean;
  rollMode: RollMode;
}
