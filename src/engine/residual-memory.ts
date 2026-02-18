import { getFatePoolSlots } from "../data/level-progression";

/** Feature categories for Residual Memory retention rules.
 *  1 = Single-Effect Features, 2 = Resource Pool, 3 = Scaling Damage,
 *  4 = Spell Slots, 5 = Multi-Part Features (Subclass), 6 = Proficiency/Hit Die (NOT retainable) */
export type FeatureCategory = 1 | 2 | 3 | 4 | 5 | 6;

export interface MemoryAllocation {
  retainedFeatures: { featureId: string; category: number }[];
  useDualNature: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  pointsUsed: number;
  pointsRemaining: number;
}

/** Returns the number of Residual Memory slots available at the given level. */
export function getMemorySlotCount(level: number): number {
  return getFatePoolSlots(level);
}

/** Returns the Fate Pool size at the given level.
 *  The pool shares the same slot count as Residual Memory, but is only
 *  active at level 11+ (when Dual Nature unlocks). */
export function getFatePoolSize(level: number): number {
  if (level < 11) return 0;
  return getFatePoolSlots(level);
}

/** Returns true if a feature in the given category can be retained as Residual Memory.
 *  Category 6 (Proficiency / Hit Die) cannot be retained — it is too fundamental. */
export function isFeatureRetainable(category: number): boolean {
  return category !== 6;
}

/** Default cost overrides for features that cost more than 1 Fate Pool point. */
export const DEFAULT_COST_OVERRIDES: Record<string, number> = {
  "action-surge": 2,
};

/** Validates a Residual Memory / Fate Pool allocation against the rules for the given level.
 *
 *  Point costs:
 *  - 1 point per retained feature (unless overridden by costOverrides)
 *  - 2 points to activate Dual Nature
 *
 *  Total points available = Fate Pool size (level 11+), or Memory slots (below 11, no Dual Nature).
 */
export function validateMemoryAllocation(
  allocation: MemoryAllocation,
  level: number,
  previousDayRetainedIds?: string[],
  costOverrides: Record<string, number> = DEFAULT_COST_OVERRIDES
): ValidationResult {
  const errors: string[] = [];

  // Determine available pool
  const memorySlots = getMemorySlotCount(level);
  const fatePool = getFatePoolSize(level);

  // Dual Nature gate
  if (allocation.useDualNature && level < 11) {
    errors.push("Dual Nature is not available below level 11");
  }

  // Validate individual features
  for (const feature of allocation.retainedFeatures) {
    if (!isFeatureRetainable(feature.category)) {
      errors.push(
        `Feature "${feature.featureId}" (category ${feature.category}) cannot be retained via Residual Memory`
      );
    }
    // Anti-daisy-chaining: cannot retain a feature that was itself retained the previous day
    if (previousDayRetainedIds?.includes(feature.featureId)) {
      errors.push(
        `Feature "${feature.featureId}" was retained yesterday and cannot be retained again (anti-daisy-chaining)`
      );
    }
  }

  // Calculate point costs with overrides
  const featureCost = allocation.retainedFeatures.reduce((sum, f) => {
    return sum + (costOverrides[f.featureId] ?? 1);
  }, 0);
  const dualNatureCost = allocation.useDualNature ? 2 : 0;
  const pointsUsed = featureCost + dualNatureCost;

  // Budget check
  const budget = level >= 11 ? fatePool : memorySlots;

  if (allocation.retainedFeatures.length > memorySlots) {
    errors.push(
      `Cannot retain ${allocation.retainedFeatures.length} feature(s): only ${memorySlots} Residual Memory slot(s) available at level ${level}`
    );
  }

  if (pointsUsed > budget) {
    errors.push(
      `Allocation costs ${pointsUsed} point(s) but only ${budget} Fate Pool point(s) are available at level ${level}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    pointsUsed,
    pointsRemaining: Math.max(budget - pointsUsed, 0),
  };
}
