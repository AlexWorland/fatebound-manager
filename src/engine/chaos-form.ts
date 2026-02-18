import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";
import { rollFatesSelection } from "@/lib/dice";
import type { Chassis, PrimaryFeature, DefensiveFeature } from "@/types/forms";
import type { Feat } from "@/types/features";

export interface ChaosFormResult {
  chassis: Chassis;
  primaryFeature: PrimaryFeature;
  defensiveFeature: DefensiveFeature;
  feats: Feat[];
  tableCRerolled: boolean;
  fatesMercyApplied: boolean;
}

/**
 * Check if a Table C defensive feature is incompatible with the given
 * chassis and primary feature combination.
 *
 * Uses the data-driven fields on DefensiveFeature:
 * - incompatibleChassis: chassis ids that conflict (e.g., Unarmored Defense
 *   is useless when the chassis already grants medium/heavy armor)
 * - requiresSpellcasting: true if the defensive feature needs the primary
 *   feature to provide spellcasting (e.g., Metamagic without spell slots)
 */
export function isTableCIncompatible(
  chassisId: number,
  primaryId: number,
  defensiveId: number
): boolean {
  const defensive = TABLE_C_DEFENSIVE.find((d) => d.id === defensiveId);
  if (!defensive) return false;

  // Check chassis incompatibility
  if (defensive.incompatibleChassis?.includes(chassisId)) {
    return true;
  }

  // Check spellcasting requirement
  if (defensive.requiresSpellcasting) {
    const primary = TABLE_B_PRIMARY.find((p) => p.id === primaryId);
    if (!primary?.hasSpellcasting) {
      return true;
    }
  }

  return false;
}

/**
 * Returns the number of Table D feat rolls granted at the given level.
 */
export function getTableDRollCount(level: number): number {
  if (level >= 20) return 5;
  if (level >= 17) return 4;
  if (level >= 13) return 3;
  if (level >= 9) return 2;
  if (level >= 5) return 1;
  return 0;
}

/**
 * Roll Table D feats using Fate's Selection, rerolling duplicates
 * for non-repeatable feats. Optionally exclude specific feat ids.
 */
export function rollTableDFeats(count: number, exclude?: number[]): Feat[] {
  if (count === 0) return [];

  const results: Feat[] = [];
  const usedIds = new Set<number>(exclude ?? []);
  const tableSize = TABLE_D_FEATS.length;

  for (let i = 0; i < count; i++) {
    let feat: Feat;
    do {
      const roll = rollFatesSelection(tableSize);
      feat = TABLE_D_FEATS[roll - 1]; // rolls are 1-indexed
    } while (usedIds.has(feat.id) && !feat.canRepeat);

    results.push(feat);
    if (!feat.canRepeat) {
      usedIds.add(feat.id);
    }
  }

  return results;
}

/** Primary feature IDs that grant an attack capability even without spellcasting */
const ATTACK_GRANTING_PRIMARY_IDS = new Set([
  1,  // Rage (enhances melee attacks, implies martial use)
  5,  // Fighting Style + Extra Attack
  6,  // Ki (Flurry of Blows)
  7,  // Divine Smite
  8,  // Favored Foe (marks + bonus damage on hit)
  9,  // Sneak Attack
  11, // Eldritch Invocations (grants Eldritch Blast cantrip)
]);

/** Weapon proficiencies that indicate meaningful combat capability */
const COMBAT_WEAPON_PROFS = new Set(["martial", "martial_ranged"]);

/**
 * Determine if a Chaos Form combination lacks any meaningful combat capability,
 * triggering the Fate's Mercy floor (grant Fate Strike cantrip).
 *
 * A character needs the mercy floor if they have:
 * - No weapon proficiency beyond simple weapons and basic implements
 * - No offensive spellcasting
 * - No attack-granting primary feature
 */
function needsFatesMercy(
  chassis: Chassis,
  primary: PrimaryFeature
): boolean {
  // Has martial/ranged martial weapon proficiency?
  const hasCombatWeapons = chassis.weaponProficiencies.some((w) =>
    COMBAT_WEAPON_PROFS.has(w)
  );
  if (hasCombatWeapons) return false;

  // Has offensive spellcasting?
  if (primary.hasSpellcasting) return false;

  // Has an attack-granting feature?
  if (ATTACK_GRANTING_PRIMARY_IDS.has(primary.id)) return false;

  return true;
}

/**
 * Assemble a complete Chaos Form.
 *
 * If `rolls` are provided, those values are used (for testing or DM override).
 * Otherwise, each table is rolled randomly via Fate's Selection.
 *
 * Table C is rerolled if the initial result is incompatible with the chassis
 * and primary feature. Fate's Mercy is applied as a floor if the resulting
 * combination has no combat capability.
 */
export function assembleChaosForm(
  level: number,
  rolls?: {
    tableA?: number;
    tableB?: number;
    tableC?: number;
    tableD?: number[];
  }
): ChaosFormResult {
  // Roll or use provided Table A
  const chassisRoll = rolls?.tableA ?? rollFatesSelection(TABLE_A_CHASSIS.length);
  const chassis = TABLE_A_CHASSIS[chassisRoll - 1];

  // Roll or use provided Table B
  const primaryRoll = rolls?.tableB ?? rollFatesSelection(TABLE_B_PRIMARY.length);
  const primaryFeature = TABLE_B_PRIMARY[primaryRoll - 1];

  // Roll or use provided Table C, with incompatibility reroll
  let defensiveRoll = rolls?.tableC ?? rollFatesSelection(TABLE_C_DEFENSIVE.length);
  let tableCRerolled = false;

  if (isTableCIncompatible(chassis.id, primaryFeature.id, defensiveRoll)) {
    tableCRerolled = true;
    do {
      defensiveRoll = rollFatesSelection(TABLE_C_DEFENSIVE.length);
    } while (isTableCIncompatible(chassis.id, primaryFeature.id, defensiveRoll));
  }

  const defensiveFeature = TABLE_C_DEFENSIVE[defensiveRoll - 1];

  // Roll Table D feats
  const featCount = getTableDRollCount(level);
  let feats: Feat[];
  if (rolls?.tableD) {
    feats = rolls.tableD.map((id) => {
      const feat = TABLE_D_FEATS.find((f) => f.id === id);
      if (!feat) throw new Error(`Unknown feat id: ${id}`);
      return feat;
    });
  } else {
    feats = rollTableDFeats(featCount);
  }

  // Fate's Mercy floor check
  const fatesMercyApplied = needsFatesMercy(chassis, primaryFeature);

  return {
    chassis,
    primaryFeature,
    defensiveFeature,
    feats,
    tableCRerolled,
    fatesMercyApplied,
  };
}
