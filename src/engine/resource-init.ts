import type { ResourceTracker, AbilityScores } from "@/types/character";
import type { BaseFeature, PrimaryFeature, AbilityScore } from "@/types/forms";
import { getSpellSlots, getHexerPactSlots, getMysticArcanumLevels } from "./spell-slots";

function abilityMod(scores: AbilityScores, ability: AbilityScore): number {
  return Math.floor((scores[ability] - 10) / 2);
}

/**
 * Parse a maxUses string into a numeric value.
 * Handles all patterns found in stabilized form and chaos form data.
 */
export function resolveMaxUses(
  maxUses: string,
  level: number,
  profBonus: number,
  scores: AbilityScores
): number {
  const s = maxUses.toLowerCase().trim();

  // "proficiency bonus/day" or "proficiency bonus/long rest"
  if (s.startsWith("proficiency bonus/") || s === "proficiency bonus") {
    return profBonus;
  }

  // "prof bonus + CHA mod" or "prof bonus + WIS mod" etc.
  const profPlusAbilityMatch = s.match(/^prof(?:iciency)?\s*bonus\s*\+\s*(str|dex|con|int|wis|cha)\s*mod/i);
  if (profPlusAbilityMatch) {
    const ability = profPlusAbilityMatch[1].toUpperCase() as AbilityScore;
    return Math.max(1, profBonus + abilityMod(scores, ability));
  }

  // "CHA mod/short or long rest" or "CHA mod/long rest"
  const abilityModMatch = s.match(/^(str|dex|con|int|wis|cha)\s*mod/i);
  if (abilityModMatch) {
    const ability = abilityModMatch[1].toUpperCase() as AbilityScore;
    return Math.max(1, abilityMod(scores, ability));
  }

  // "1 + CHA mod/long rest"
  const onePlusAbilityMatch = s.match(/^1\s*\+\s*(str|dex|con|int|wis|cha)\s*mod/i);
  if (onePlusAbilityMatch) {
    const ability = onePlusAbilityMatch[1].toUpperCase() as AbilityScore;
    return Math.max(1, 1 + abilityMod(scores, ability));
  }

  // "Fatebound level × 5 HP pool" (Lay on Hands)
  if (s.includes("level") && s.includes("5")) {
    return level * 5;
  }

  // "N uses/rest" or "N use/rest" or "N/day" or "N/long rest"
  const numericMatch = s.match(/^(\d+)\s*(?:uses?)?/i);
  if (numericMatch) {
    return parseInt(numericMatch[1], 10);
  }

  return 1;
}

/**
 * Determine recovery type from a maxUses string.
 * "short or long rest" or "/rest" → short; "/long rest" or "/day" → long.
 */
export function resolveRecoveryType(maxUses: string): "short" | "long" {
  const s = maxUses.toLowerCase();
  if (s.includes("short or long rest") || (s.includes("/rest") && !s.includes("/long rest"))) {
    return "short";
  }
  return "long";
}

/**
 * Initialize spell slot trackers for a daily state.
 */
export function initSpellSlots(
  level: number,
  formHasSpellcasting: boolean,
  isPactMagic?: boolean
): Record<string, ResourceTracker> {
  if (!formHasSpellcasting) return {};

  const result: Record<string, ResourceTracker> = {};

  if (isPactMagic) {
    const pact = getHexerPactSlots(level);
    if (pact.count > 0) {
      result["pact"] = { used: 0, max: pact.count, recovery: "short" };
    }
  } else {
    const slots = getSpellSlots(level);
    for (const [lvl, count] of Object.entries(slots)) {
      if (count > 0) {
        result[lvl] = { used: 0, max: count, recovery: "long" };
      }
    }
  }

  // Mystic Arcanum (level 13+)
  for (const arcanumLevel of getMysticArcanumLevels(level)) {
    result[`arcanum_${arcanumLevel}`] = { used: 0, max: 1, recovery: "long" };
  }

  return result;
}

/**
 * Initialize class resource trackers for a stabilized form.
 */
export function initClassResources(
  baseFeatures: BaseFeature[],
  level: number,
  profBonus: number,
  abilityScores: AbilityScores
): Record<string, ResourceTracker> {
  const result: Record<string, ResourceTracker> = {};

  for (const feature of baseFeatures) {
    if (!feature.resourceKey || !feature.maxUses) continue;

    // Skip features gated behind level requirements mentioned in their description
    const levelMatch = feature.description.match(/Level (\d+)\+/i);
    if (levelMatch && level < parseInt(levelMatch[1], 10)) continue;

    result[feature.resourceKey] = {
      used: 0,
      max: resolveMaxUses(feature.maxUses, level, profBonus, abilityScores),
      recovery: resolveRecoveryType(feature.maxUses),
    };
  }

  return result;
}

/**
 * Hardcoded resource formulas for Chaos Form Table B primary features.
 * Maps resourcePool keys to {max formula, recovery type}.
 */
const CHAOS_RESOURCE_FORMULAS: Record<
  string,
  { resolve: (level: number, profBonus: number, scores: AbilityScores) => number; recovery: "short" | "long" }
> = {
  rage: {
    resolve: (_level, profBonus) => profBonus,
    recovery: "long",
  },
  bardic_inspiration: {
    resolve: (_level, _profBonus, scores) => Math.max(1, abilityMod(scores, "CHA")),
    recovery: "long",
  },
  ki: {
    resolve: (_level, profBonus, scores) => Math.max(1, profBonus + abilityMod(scores, "WIS")),
    recovery: "short",
  },
  lay_on_hands: {
    resolve: (level) => level * 5,
    recovery: "long",
  },
  favored_foe: {
    resolve: (_level, profBonus) => profBonus,
    recovery: "long",
  },
  sorcery_points: {
    resolve: (_level, profBonus, scores) => Math.max(1, profBonus + abilityMod(scores, "CHA")),
    recovery: "long",
  },
  blood_maledict: {
    resolve: (_level, _profBonus) => 1,
    recovery: "short",
  },
  infusions: {
    resolve: (_level, _profBonus) => 2,
    recovery: "long",
  },
};

/**
 * Initialize class resources for a Chaos Form based on Table B primary feature.
 */
export function initChaosResources(
  primaryFeature: PrimaryFeature,
  level: number,
  profBonus: number,
  abilityScores: AbilityScores
): Record<string, ResourceTracker> {
  if (!primaryFeature.resourcePool) return {};

  const formula = CHAOS_RESOURCE_FORMULAS[primaryFeature.resourcePool];
  if (!formula) return {};

  return {
    [primaryFeature.resourcePool]: {
      used: 0,
      max: formula.resolve(level, profBonus, abilityScores),
      recovery: formula.recovery,
    },
  };
}
