import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";
import { initSchema } from "./schema";
import type { DailyState } from "@/types/character";

type DailyStateRow = {
  id: string;
  character_id: string;
  date: string;
  dawn_roll: string;
  dawn_roll_outcome: string;
  form_type: string;
  form_data: string;
  residual_memory: string;
  ability_swap: string | null;
  resources: string;
  feature_usage: string;
  current_hp: number;
  temp_hp: number;
};

/**
 * form_data consolidates all form-specific fields:
 * chaosTableA, chaosTableB, chaosTableC, chaosTableD,
 * stabilizedFormId, stabilizedSubclassId,
 * secondaryFormId, secondaryFormFeatures, chaosResonance
 *
 * resources consolidates: currentHP, tempHP, spellSlots, classResources
 *
 * feature_usage consolidates: chaosSurgeUsed, twistOfFateUsed,
 * defyFateUsed, fateResistanceSave
 */
function rowToDailyState(row: DailyStateRow): DailyState {
  const formData = JSON.parse(row.form_data);
  const resources = JSON.parse(row.resources);
  const featureUsage = JSON.parse(row.feature_usage);

  return {
    id: row.id,
    characterId: row.character_id,
    date: row.date,
    dawnRoll: JSON.parse(row.dawn_roll),
    dawnRollOutcome: row.dawn_roll_outcome as DailyState["dawnRollOutcome"],
    formType: row.form_type as "CHAOS" | "STABILIZED",
    chaosTableA: formData.chaosTableA,
    chaosTableB: formData.chaosTableB,
    chaosTableC: formData.chaosTableC,
    chaosTableD: formData.chaosTableD,
    stabilizedFormId: formData.stabilizedFormId,
    stabilizedSubclassId: formData.stabilizedSubclassId,
    secondaryFormId: formData.secondaryFormId ?? null,
    secondaryFormFeatures: formData.secondaryFormFeatures,
    chaosResonance: formData.chaosResonance ?? null,
    residualMemorySlots: JSON.parse(row.residual_memory),
    abilitySwap: row.ability_swap ? JSON.parse(row.ability_swap) : null,
    currentHP: row.current_hp ?? resources.currentHP ?? 0,
    tempHP: row.temp_hp ?? resources.tempHP ?? 0,
    spellSlots: resources.spellSlots ?? {},
    classResources: resources.classResources ?? {},
    chaosSurgeUsed: featureUsage.chaosSurgeUsed ?? false,
    twistOfFateUsed: featureUsage.twistOfFateUsed ?? false,
    defyFateUsed: featureUsage.defyFateUsed ?? false,
    fateResistanceSave: featureUsage.fateResistanceSave ?? null,
  };
}

function dailyStateToRow(state: DailyState): Omit<DailyStateRow, never> {
  const formData = {
    chaosTableA: state.chaosTableA,
    chaosTableB: state.chaosTableB,
    chaosTableC: state.chaosTableC,
    chaosTableD: state.chaosTableD,
    stabilizedFormId: state.stabilizedFormId,
    stabilizedSubclassId: state.stabilizedSubclassId,
    secondaryFormId: state.secondaryFormId,
    secondaryFormFeatures: state.secondaryFormFeatures,
    chaosResonance: state.chaosResonance,
  };

  const resources = {
    currentHP: state.currentHP,
    tempHP: state.tempHP,
    spellSlots: state.spellSlots,
    classResources: state.classResources,
  };

  const featureUsage = {
    chaosSurgeUsed: state.chaosSurgeUsed,
    twistOfFateUsed: state.twistOfFateUsed,
    defyFateUsed: state.defyFateUsed,
    fateResistanceSave: state.fateResistanceSave,
  };

  return {
    id: state.id,
    character_id: state.characterId,
    date: state.date,
    dawn_roll: JSON.stringify(state.dawnRoll),
    dawn_roll_outcome: state.dawnRollOutcome,
    form_type: state.formType,
    form_data: JSON.stringify(formData),
    residual_memory: JSON.stringify(state.residualMemorySlots),
    ability_swap: state.abilitySwap ? JSON.stringify(state.abilitySwap) : null,
    resources: JSON.stringify(resources),
    feature_usage: JSON.stringify(featureUsage),
    current_hp: state.currentHP,
    temp_hp: state.tempHP,
  };
}

export function getDailyState(characterId: string, date: string): DailyState | null {
  initSchema();
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM daily_states WHERE character_id = ? AND date = ?")
    .get(characterId, date) as DailyStateRow | undefined;
  return row ? rowToDailyState(row) : null;
}

export function getCurrentDailyState(characterId: string): DailyState | null {
  initSchema();
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const row = db
    .prepare("SELECT * FROM daily_states WHERE character_id = ? AND date = ?")
    .get(characterId, today) as DailyStateRow | undefined;
  return row ? rowToDailyState(row) : null;
}

export function saveDailyState(data: Omit<DailyState, "id">): DailyState {
  initSchema();
  const db = getDb();
  const id = uuidv4();
  const state: DailyState = { id, ...data };
  const row = dailyStateToRow(state);

  db.prepare(`
    INSERT INTO daily_states (
      id, character_id, date, dawn_roll, dawn_roll_outcome, form_type,
      form_data, residual_memory, ability_swap, resources, feature_usage,
      current_hp, temp_hp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(character_id, date) DO UPDATE SET
      dawn_roll = excluded.dawn_roll,
      dawn_roll_outcome = excluded.dawn_roll_outcome,
      form_type = excluded.form_type,
      form_data = excluded.form_data,
      residual_memory = excluded.residual_memory,
      ability_swap = excluded.ability_swap,
      resources = excluded.resources,
      feature_usage = excluded.feature_usage,
      current_hp = excluded.current_hp,
      temp_hp = excluded.temp_hp
  `).run(
    row.id,
    row.character_id,
    row.date,
    row.dawn_roll,
    row.dawn_roll_outcome,
    row.form_type,
    row.form_data,
    row.residual_memory,
    row.ability_swap,
    row.resources,
    row.feature_usage,
    row.current_hp,
    row.temp_hp
  );

  return getDailyState(data.characterId, data.date)!;
}

export function updateDailyState(
  id: string,
  data: Partial<Omit<DailyState, "id" | "characterId" | "date">>
): DailyState | null {
  initSchema();
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM daily_states WHERE id = ?")
    .get(id) as DailyStateRow | undefined;
  if (!existing) return null;

  const current = rowToDailyState(existing);
  const updated = { ...current, ...data };
  const row = dailyStateToRow(updated);

  db.prepare(`
    UPDATE daily_states SET
      dawn_roll = ?, dawn_roll_outcome = ?, form_type = ?,
      form_data = ?, residual_memory = ?, ability_swap = ?,
      resources = ?, feature_usage = ?,
      current_hp = ?, temp_hp = ?
    WHERE id = ?
  `).run(
    row.dawn_roll,
    row.dawn_roll_outcome,
    row.form_type,
    row.form_data,
    row.residual_memory,
    row.ability_swap,
    row.resources,
    row.feature_usage,
    updated.currentHP,
    updated.tempHP,
    id
  );

  return getDailyState(updated.characterId, updated.date);
}
