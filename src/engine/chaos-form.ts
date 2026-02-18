import { TABLE_A_CHASSIS } from "@/data/tables/table-a-chassis";
import { TABLE_B_PRIMARY } from "@/data/tables/table-b-primary";
import { TABLE_C_DEFENSIVE } from "@/data/tables/table-c-defensive";
import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";
import { rollFatesSelection } from "@/lib/dice";
import type {
  Chassis,
  PrimaryFeature,
  DefensiveFeature,
  HitDie,
} from "@/types/forms";
import type { Feat } from "@/types/features";

export interface FatesMercyDetails {
  hitDieUpgraded: boolean;
  armorAdded: boolean;
  weaponAdded: boolean;
  acFloor: boolean;
  grantsFateStrike: boolean;
  bonusUnarmoredDefense: boolean;
}

export interface TableCReroll {
  originalId: number;
  originalName: string;
  reason: string;
}

export interface ChaosFormResult {
  level: number;
  chassis: Chassis;
  primaryFeature: PrimaryFeature;
  defensiveFeature: DefensiveFeature;
  feats: Feat[];
  tableCRerolled: boolean;
  tableCRerollInfo: TableCReroll | null;
  fatesMercyApplied: boolean;
  fatesMercy: FatesMercyDetails;
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
 *
 * Source: The Fatebound.md, Table D Rolls table
 * - Levels 1-3: 0
 * - Levels 4-7: 1
 * - Levels 8-11: 2
 * - Levels 12-15: 3
 * - Levels 16-18: 4
 * - Levels 19+: 5
 */
export function getTableDRollCount(level: number): number {
  if (level >= 19) return 5;
  if (level >= 16) return 4;
  if (level >= 12) return 3;
  if (level >= 8) return 2;
  if (level >= 4) return 1;
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
 * Build the incompatibility reason string for a Table C reroll.
 */
function getIncompatibilityReason(
  chassis: Chassis,
  primary: PrimaryFeature,
  defensive: DefensiveFeature
): string {
  if (defensive.incompatibleChassis?.includes(chassis.id)) {
    return `Incompatible: ${chassis.name} + ${defensive.name}`;
  }
  if (defensive.requiresSpellcasting && !primary.hasSpellcasting) {
    return `Incompatible: ${defensive.name} requires spellcasting but ${primary.name} does not grant it`;
  }
  return "Incompatible combination";
}

/**
 * Apply Fate's Mercy corrections to a Chaos Form chassis.
 *
 * Per the rules (The Fatebound.md lines 79-82):
 * - Minimum d8 hit die (upgrade d6 to d8)
 * - Light armor proficiency (if chassis grants none)
 * - Simple weapon proficiency (if chassis lacks simple/martial)
 * - AC floor of 12 + DEX modifier (always noted)
 * - Fate Strike cantrip if no combat option from any table
 * - Arcanist + Rage = bonus Unarmored Defense (CON)
 *
 * Returns a deep copy of the chassis with corrections applied, plus detail flags.
 */
function applyFatesMercyCorrections(
  chassis: Chassis,
  primary: PrimaryFeature,
  defensive: DefensiveFeature,
  feats: Feat[]
): { chassis: Chassis; mercy: FatesMercyDetails } {
  const corrected: Chassis = {
    ...chassis,
    armorProficiencies: [...chassis.armorProficiencies],
    weaponProficiencies: [...chassis.weaponProficiencies],
  };

  const mercy: FatesMercyDetails = {
    hitDieUpgraded: false,
    armorAdded: false,
    weaponAdded: false,
    acFloor: true, // AC floor of 12+DEX always applies as a minimum
    grantsFateStrike: false,
    bonusUnarmoredDefense: false,
  };

  // Upgrade d6 hit die to d8
  if (corrected.hitDie < 8) {
    corrected.hitDie = 8 as HitDie;
    mercy.hitDieUpgraded = true;
  }

  // Add light armor if chassis grants none (i.e., only has "none")
  const hasArmor = corrected.armorProficiencies.some((a) => a !== "none");
  if (!hasArmor) {
    corrected.armorProficiencies = corrected.armorProficiencies.filter(
      (a) => a !== "none"
    );
    corrected.armorProficiencies.push("light");
    mercy.armorAdded = true;
  }

  // Add simple weapon proficiency if chassis lacks simple/martial
  const hasBasicWeapons = corrected.weaponProficiencies.some(
    (w) => w === "simple" || w === "martial"
  );
  if (!hasBasicWeapons) {
    corrected.weaponProficiencies.push("simple");
    mercy.weaponAdded = true;
  }

  // Grant Fate Strike cantrip if no combat option exists
  if (needsFatesMercy(corrected, primary)) {
    mercy.grantsFateStrike = true;
  }

  // Arcanist chassis (id 7) + Rage (Table B id 1) = bonus Unarmored Defense (CON)
  if (chassis.id === 7 && primary.id === 1) {
    mercy.bonusUnarmoredDefense = true;
  }

  return { chassis: corrected, mercy };
}

/**
 * Assemble a complete Chaos Form.
 *
 * If `rolls` are provided, those values are used (for testing or DM override).
 * Otherwise, each table is rolled randomly via Fate's Selection.
 *
 * Table C is rerolled ONCE if the initial result is incompatible with the
 * chassis and primary feature. The second result stands regardless (per rules).
 *
 * Fate's Mercy corrections are always applied to ensure minimum viability.
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
  const chassisRoll =
    rolls?.tableA ?? rollFatesSelection(TABLE_A_CHASSIS.length);
  const originalChassis = TABLE_A_CHASSIS[chassisRoll - 1];

  // Roll or use provided Table B
  const primaryRoll =
    rolls?.tableB ?? rollFatesSelection(TABLE_B_PRIMARY.length);
  const primaryFeature = TABLE_B_PRIMARY[primaryRoll - 1];

  // Roll or use provided Table C, with ONE incompatibility reroll
  let defensiveRoll =
    rolls?.tableC ?? rollFatesSelection(TABLE_C_DEFENSIVE.length);
  let tableCRerolled = false;
  let tableCRerollInfo: TableCReroll | null = null;

  if (
    isTableCIncompatible(originalChassis.id, primaryFeature.id, defensiveRoll)
  ) {
    const originalDefensive = TABLE_C_DEFENSIVE[defensiveRoll - 1];
    const reason = getIncompatibilityReason(
      originalChassis,
      primaryFeature,
      originalDefensive
    );

    tableCRerolled = true;
    tableCRerollInfo = {
      originalId: defensiveRoll,
      originalName: originalDefensive.name,
      reason,
    };

    // Reroll exactly once — the second result stands regardless
    defensiveRoll = rollFatesSelection(TABLE_C_DEFENSIVE.length);
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

  // Apply Fate's Mercy corrections
  const { chassis, mercy } = applyFatesMercyCorrections(
    originalChassis,
    primaryFeature,
    defensiveFeature,
    feats
  );

  const fatesMercyApplied =
    mercy.hitDieUpgraded ||
    mercy.armorAdded ||
    mercy.weaponAdded ||
    mercy.grantsFateStrike ||
    mercy.bonusUnarmoredDefense;

  return {
    level,
    chassis,
    primaryFeature,
    defensiveFeature,
    feats,
    tableCRerolled,
    tableCRerollInfo,
    fatesMercyApplied,
    fatesMercy: mercy,
  };
}
