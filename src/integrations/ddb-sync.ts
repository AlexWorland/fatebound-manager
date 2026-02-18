/**
 * D&D Beyond MCP Sync Service
 *
 * Generates payloads for DDB MCP tool calls. The Fatebound Manager is the
 * source of truth; D&D Beyond is the display layer. Actual MCP tool invocations
 * happen externally (from Claude Code), not from the web app.
 *
 * Each generator returns a tool name + parameters object matching the DDB MCP
 * tool schema, ready to be passed to the MCP runtime.
 */

import type {
  Character,
  DailyState,
  AbilityScores,
  Currency,
  InventoryItem,
} from "@/types/character";
import type { AbilityScore } from "@/types/forms";

// ── Payload Types ─────────────────────────────────────────────────────────

export interface SyncPayload {
  tool: string;
  params: Record<string, unknown>;
}

export interface SyncResult {
  calls: SyncPayload[];
  skipped: string[];
  errors: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────

const ABILITY_SCORE_KEYS: AbilityScore[] = [
  "STR",
  "DEX",
  "CON",
  "INT",
  "WIS",
  "CHA",
];

// ── Ability Score Sync ────────────────────────────────────────────────────

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

// ── HP Sync ───────────────────────────────────────────────────────────────

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

// ── Spell Slot Sync ───────────────────────────────────────────────────────

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

// ── Condition Sync ────────────────────────────────────────────────────────

/**
 * Generates condition sync calls. Derives active conditions from the daily
 * state's class resources and produces add/remove calls to reconcile with
 * the current DDB state.
 */
export function generateConditionSync(
  ddbCharacterId: string,
  dailyState: DailyState,
  currentDDBConditions: string[] = []
): SyncPayload[] {
  const calls: SyncPayload[] = [];
  const activeConditions = deriveActiveConditions(dailyState);

  // Add conditions active locally but missing on DDB
  for (const condition of activeConditions) {
    if (!currentDDBConditions.includes(condition)) {
      calls.push({
        tool: "add_condition",
        params: { characterId: ddbCharacterId, condition },
      });
    }
  }

  // Remove conditions present on DDB but no longer active locally
  for (const condition of currentDDBConditions) {
    if (!activeConditions.includes(condition)) {
      calls.push({
        tool: "remove_condition",
        params: { characterId: ddbCharacterId, condition },
      });
    }
  }

  return calls;
}

/** Derives active condition names from daily state. */
function deriveActiveConditions(dailyState: DailyState): string[] {
  const conditions: string[] = [];

  const exhaustion = dailyState.classResources["exhaustion"];
  if (exhaustion && exhaustion.used > 0) {
    conditions.push("Exhaustion");
  }

  return conditions;
}

// ── Inventory Sync ────────────────────────────────────────────────────────

export function generateInventorySync(
  ddbCharacterId: string,
  inventory: InventoryItem[]
): SyncPayload {
  const items = inventory.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    equipped: item.isEquipped,
    description: item.description,
  }));

  return {
    tool: "add_inventory_items",
    params: { characterId: ddbCharacterId, items },
  };
}

// ── Currency Sync ─────────────────────────────────────────────────────────

export function generateCurrencySync(
  ddbCharacterId: string,
  currency: Currency
): SyncPayload {
  return {
    tool: "update_currency",
    params: {
      characterId: ddbCharacterId,
      cp: currency.cp,
      sp: currency.sp,
      ep: currency.ep,
      gp: currency.gp,
      pp: currency.pp,
    },
  };
}

// ── Full Sync Orchestrator ────────────────────────────────────────────────

/**
 * Generates the complete set of MCP tool calls for a character sync,
 * respecting the per-field sync toggles in DDBSyncSettings.
 */
export function generateFullSync(
  character: Character,
  dailyState: DailyState | null,
  currentDDBConditions: string[] = []
): SyncResult {
  const settings = character.ddbSyncSettings;
  const calls: SyncPayload[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  if (!character.ddbCharacterId) {
    return { calls: [], skipped: [], errors: ["No D&D Beyond character ID configured"] };
  }

  if (!settings?.enabled) {
    return { calls: [], skipped: [], errors: ["D&D Beyond sync is not enabled"] };
  }

  const id = character.ddbCharacterId;

  // Ability scores — always available, even without daily state
  if (settings.syncAbilityScores) {
    calls.push(
      ...generateAbilityScoreSync(
        id,
        character.abilityScores,
        dailyState?.abilitySwap ?? null
      )
    );
  } else {
    skipped.push("abilityScores");
  }

  // HP — requires daily state
  if (settings.syncHP) {
    if (dailyState) {
      // maxHP derived from level (Fatebound uses 8 per level as baseline)
      const maxHP = character.level * 8;
      calls.push(generateHPSync(id, dailyState.currentHP, maxHP, dailyState.tempHP));
    } else {
      errors.push("HP sync requires an active daily state");
    }
  } else {
    skipped.push("hp");
  }

  // Spell slots — requires daily state
  if (settings.syncSpellSlots) {
    if (dailyState) {
      calls.push(...generateSpellSlotSync(id, dailyState.spellSlots));
    } else {
      errors.push("Spell slot sync requires an active daily state");
    }
  } else {
    skipped.push("spellSlots");
  }

  // Conditions — requires daily state
  if (settings.syncConditions) {
    if (dailyState) {
      calls.push(...generateConditionSync(id, dailyState, currentDDBConditions));
    } else {
      errors.push("Condition sync requires an active daily state");
    }
  } else {
    skipped.push("conditions");
  }

  // Inventory — always available
  if (settings.syncInventory) {
    calls.push(generateInventorySync(id, character.inventory));
  } else {
    skipped.push("inventory");
  }

  // Currency — always available
  if (settings.syncCurrency) {
    calls.push(generateCurrencySync(id, character.currency));
  } else {
    skipped.push("currency");
  }

  return { calls, skipped, errors };
}

// ── Import from DDB ───────────────────────────────────────────────────────

/**
 * Raw shape returned by the DDB MCP get_character tool.
 * Only fields we map — DDB returns many more.
 */
export interface DDBCharacterData {
  id: number;
  name: string;
  stats: { id: number; value: number }[];
  hitPoints: { current: number; temp: number; max: number };
  inventory: {
    name: string;
    quantity: number;
    equipped: boolean;
    definition?: {
      description?: string;
      weight?: number;
      magic?: boolean;
    };
  }[];
  currencies: { cp: number; sp: number; ep: number; gp: number; pp: number };
}

/** DDB stat IDs are 1-indexed: 1=STR, 2=DEX, 3=CON, 4=INT, 5=WIS, 6=CHA. */
const DDB_STAT_ORDER: AbilityScore[] = [
  "STR",
  "DEX",
  "CON",
  "INT",
  "WIS",
  "CHA",
];

/**
 * Maps D&D Beyond character data to our Character type fields.
 * Returns a partial — only includes fields that can be meaningfully imported.
 * Does not set id, level, or class-specific fields (those are Fatebound-specific).
 */
export function importFromDDB(
  ddbData: DDBCharacterData
): Partial<Character> {
  const abilityScores: Partial<AbilityScores> = {};
  for (const stat of ddbData.stats) {
    const abbr = DDB_STAT_ORDER[stat.id - 1];
    if (abbr) {
      abilityScores[abbr] = stat.value;
    }
  }

  const inventory: InventoryItem[] = ddbData.inventory.map((item, idx) => ({
    id: `ddb-import-${idx}`,
    name: item.name,
    quantity: item.quantity,
    weight: item.definition?.weight ?? 0,
    description: item.definition?.description ?? "",
    isEquipped: item.equipped,
    isMagic: item.definition?.magic ?? false,
  }));

  const currency: Currency = {
    cp: ddbData.currencies.cp,
    sp: ddbData.currencies.sp,
    ep: ddbData.currencies.ep,
    gp: ddbData.currencies.gp,
    pp: ddbData.currencies.pp,
  };

  return {
    name: ddbData.name,
    abilityScores: abilityScores as AbilityScores,
    inventory,
    currency,
    ddbCharacterId: String(ddbData.id),
  };
}
