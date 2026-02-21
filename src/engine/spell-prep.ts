import type { AbilityScores } from "@/types/character";
import type { SpellcastingProfile } from "@/types/spells";
import type { AbilityScore } from "@/types/forms";

interface CasterConfig {
  mechanic: "prepared" | "known" | "pact" | "grimoire";
  spellList: string;
  castingAbility: AbilityScore;
  countFormula: "prof+ability" | "prof" | "pact";
  cantrips: number;
}

const STABILIZED_CASTER_MAP: Record<string, CasterConfig> = {
  Bard: { mechanic: "known", spellList: "Bard", castingAbility: "CHA", countFormula: "prof+ability", cantrips: 3 },
  Cleric: { mechanic: "prepared", spellList: "Cleric", castingAbility: "WIS", countFormula: "prof+ability", cantrips: 4 },
  Druid: { mechanic: "prepared", spellList: "Druid", castingAbility: "WIS", countFormula: "prof+ability", cantrips: 2 },
  Paladin: { mechanic: "prepared", spellList: "Paladin", castingAbility: "CHA", countFormula: "prof+ability", cantrips: 0 },
  Ranger: { mechanic: "known", spellList: "Ranger", castingAbility: "WIS", countFormula: "prof+ability", cantrips: 0 },
  Sorcerer: { mechanic: "known", spellList: "Sorcerer", castingAbility: "CHA", countFormula: "prof+ability", cantrips: 5 },
  Warlock: { mechanic: "pact", spellList: "Warlock", castingAbility: "CHA", countFormula: "pact", cantrips: 2 },
  Wizard: { mechanic: "grimoire", spellList: "Wizard", castingAbility: "INT", countFormula: "prof+ability", cantrips: 3 },
  Artificer: { mechanic: "prepared", spellList: "Artificer", castingAbility: "INT", countFormula: "prof+ability", cantrips: 2 },
};

/** Chaos form overrides applied on top of stabilized caster configs. */
const CHAOS_CASTER_OVERRIDES: Partial<Record<string, Partial<CasterConfig>>> = {
  Wizard: { mechanic: "known", countFormula: "prof" },
};

/** Compute proficiency bonus for a given character level. */
function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/** Compute ability score modifier. */
function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Builds a SpellcastingProfile for a given class at a given level.
 * Returns null if the class has no spellcasting.
 */
export function getCasterProfile(
  className: string,
  level: number,
  abilityScores: AbilityScores,
  isChaosForm: boolean,
): SpellcastingProfile | null {
  const base = STABILIZED_CASTER_MAP[className];
  if (!base) return null;

  // Apply chaos overrides if applicable
  const config = isChaosForm
    ? { ...base, ...CHAOS_CASTER_OVERRIDES[className] }
    : { ...base };

  const profBonus = getProficiencyBonus(level);
  const abilityMod = getAbilityModifier(abilityScores[config.castingAbility]);

  let maxPreparedOrKnown: number;
  switch (config.countFormula) {
    case "prof+ability":
      maxPreparedOrKnown = Math.max(1, profBonus + abilityMod);
      break;
    case "prof":
      maxPreparedOrKnown = profBonus;
      break;
    case "pact":
      maxPreparedOrKnown = Math.max(1, profBonus + abilityMod);
      break;
  }

  const cantripsKnown = getCantripsKnown(className, level, isChaosForm);

  return {
    mechanic: config.mechanic,
    spellList: config.spellList,
    castingAbility: config.castingAbility,
    maxPreparedOrKnown,
    cantripsKnown,
  };
}

/**
 * Returns the number of cantrips known for a given class at a given level.
 * Chaos forms always use proficiency bonus for cantrip count.
 * Stabilized Hexer (Warlock) gains an extra cantrip at level 10+.
 */
export function getCantripsKnown(className: string, level: number, isChaosForm: boolean): number {
  const base = STABILIZED_CASTER_MAP[className];
  if (!base) return 0;

  if (isChaosForm) {
    return getProficiencyBonus(level);
  }

  // Warlock special: at level 10+, cantrips = 3 (Stabilized Hexer)
  if (className === "Warlock" && level >= 10) {
    return 3;
  }

  return base.cantrips;
}

/**
 * Returns the Sage Grimoire capacity (persistent wizard spell pool).
 * Capacity = 4 + level.
 */
export function getSageGrimoireCapacity(level: number): number {
  return 4 + level;
}

/**
 * Validates that the number of selected spells doesn't exceed the maximum.
 */
export function validateSpellSelection(selectedSlugs: string[], maxCount: number): boolean {
  return selectedSlugs.length <= maxCount;
}

/**
 * Returns the maximum spell level available at a given Fatebound level.
 * Uses the half-caster spell slot table to determine the highest level
 * with at least one slot.
 */
export function getMaxSpellLevel(level: number): number {
  if (level >= 17) return 5;
  if (level >= 13) return 4;
  if (level >= 9) return 3;
  if (level >= 5) return 2;
  return 1;
}
