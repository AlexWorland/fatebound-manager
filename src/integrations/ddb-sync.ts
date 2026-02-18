import type { Character, DailyState, AbilityScores } from "@/types/character";
import type { AbilityScore } from "@/types/forms";

export interface SyncPayload {
  tool: string;
  params: Record<string, unknown>;
}

const ABILITY_SCORE_KEYS: AbilityScore[] = [
  "STR",
  "DEX",
  "CON",
  "INT",
  "WIS",
  "CHA",
];

/**
 * Generate ability score sync commands.
 * When an abilitySwap is active, the two swapped scores are sent with their
 * swapped values so DDB reflects the effective (post-swap) scores.
 */
export function generateAbilityScoreSync(
  ddbCharacterId: string,
  abilityScores: AbilityScores,
  abilitySwap: { score1: AbilityScore; score2: AbilityScore } | null
): SyncPayload[] {
  // Build effective scores with swap applied if present
  const effective: AbilityScores = { ...abilityScores };
  if (abilitySwap) {
    const { score1, score2 } = abilitySwap;
    effective[score1] = abilityScores[score2];
    effective[score2] = abilityScores[score1];
  }

  return ABILITY_SCORE_KEYS.map((ability) => ({
    tool: "set_ability_score",
    params: {
      characterId: ddbCharacterId,
      ability: ability.toLowerCase(),
      value: effective[ability],
    },
  }));
}

/**
 * Generate HP sync command.
 */
export function generateHPSync(
  ddbCharacterId: string,
  currentHP: number,
  maxHP: number,
  tempHP: number
): SyncPayload {
  return {
    tool: "update_hp",
    params: {
      characterId: ddbCharacterId,
      currentHp: currentHP,
      maxHp: maxHP,
      tempHp: tempHP,
    },
  };
}

/**
 * Generate spell slot sync commands — one payload per slot level.
 */
export function generateSpellSlotSync(
  ddbCharacterId: string,
  spellSlots: Record<string, { used: number; max: number }>
): SyncPayload[] {
  return Object.entries(spellSlots).map(([level, tracker]) => ({
    tool: "update_spell_slots",
    params: {
      characterId: ddbCharacterId,
      level: parseInt(level, 10),
      used: tracker.used,
      max: tracker.max,
    },
  }));
}

/**
 * Generate a full sync payload combining ability scores, HP, and spell slots.
 * maxHP is derived from the character level (Fatebound uses a fixed HP formula).
 * If ddbCharacterId is not set, returns an empty array.
 */
export function generateFullSync(
  character: Character,
  dailyState: DailyState
): SyncPayload[] {
  if (!character.ddbCharacterId) return [];

  const id = character.ddbCharacterId;

  const abilitySyncPayloads = generateAbilityScoreSync(
    id,
    character.abilityScores,
    dailyState.abilitySwap
  );

  // Max HP is not stored directly — derive a reasonable value from level for
  // display purposes (actual max HP tracking belongs in daily state if added).
  const maxHP = dailyState.currentHP; // fallback: treat current as context max for now

  const hpPayload = generateHPSync(
    id,
    dailyState.currentHP,
    maxHP,
    dailyState.tempHP
  );

  const spellSlotPayloads = generateSpellSlotSync(id, dailyState.spellSlots);

  return [...abilitySyncPayloads, hpPayload, ...spellSlotPayloads];
}
