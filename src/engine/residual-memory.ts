import { getFatePoolSlots } from "../data/level-progression";

/** Feature categories for Residual Memory retention rules.
 *  1 = Combat Style, 2 = Resource Pool, 3 = Scaling Damage,
 *  4 = Spell Slots, 5 = Passive, 6 = Proficiency/Hit Die (NOT retainable) */
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

/** Validates a Residual Memory / Fate Pool allocation against the rules for the given level.
 *
 *  Point costs:
 *  - 1 point per retained feature
 *  - 2 points to activate Dual Nature
 *
 *  Total points available = Fate Pool size (level 11+), or Memory slots (below 11, no Dual Nature).
 */
export function validateMemoryAllocation(
  allocation: MemoryAllocation,
  level: number
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
  }

  // Calculate point costs
  const featureCost = allocation.retainedFeatures.length;
  const dualNatureCost = allocation.useDualNature ? 2 : 0;
  const pointsUsed = featureCost + dualNatureCost;

  // Budget check
  // At level 11+, total budget = fatePool (same slots, but the Fate Pool mechanic applies).
  // Below level 11, Dual Nature is impossible, so budget = memorySlots, one point per feature.
  const budget = level >= 11 ? fatePool : memorySlots;

  if (featureCost > memorySlots) {
    errors.push(
      `Cannot retain ${featureCost} feature(s): only ${memorySlots} Residual Memory slot(s) available at level ${level}`
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
