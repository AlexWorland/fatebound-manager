import { SPELL_SLOT_TABLE } from "../data/spell-slot-table";

/** Returns spell slots for a given character level as a map of spell level → slot count.
 *  Level 1 returns all zeros (cantrips only until level 2). */
export function getSpellSlots(level: number): Record<number, number> {
  const row = SPELL_SLOT_TABLE.find((r) => r.level === level);
  const slots = row?.slots ?? [0, 0, 0, 0, 0];
  return {
    1: slots[0],
    2: slots[1],
    3: slots[2],
    4: slots[3],
    5: slots[4],
  };
}

/** Hexer (Stabilized Form) short rest slot recovery.
 *  Returns the highest available spell slot level from the half-caster table. */
export function getShortRestRecoverySlot(level: number): number {
  const row = SPELL_SLOT_TABLE.find((r) => r.level === level);
  if (!row) return 1;
  // Find the highest spell level (index+1) with > 0 slots
  for (let i = row.slots.length - 1; i >= 0; i--) {
    if (row.slots[i] > 0) return i + 1;
  }
  return 1; // minimum 1st-level slot
}

/** Mystic Arcanum availability for caster Stabilized Forms (level 13+).
 *  Returns an array of available arcanum spell levels. Each is cast 1/long rest.
 *  - Level 13–16: [6]  (one 6th-level arcanum)
 *  - Level 17+:   [6, 7]  (one 6th-level and one 7th-level arcanum)
 *  - Below 13:    []   (no arcanum available)
 *
 *  Source: "one Mystic Arcanum at level 13 (6th-level spell) and one
 *  at level 17 (7th-level spell) from the form's spell list." */
export function getMysticArcanumLevels(level: number): number[] {
  if (level >= 17) return [6, 7];
  if (level >= 13) return [6];
  return [];
}

/** Returns the highest Mystic Arcanum spell level available, or null if below level 13. */
export function getMysticArcanumLevel(level: number): number | null {
  if (level >= 17) return 7;
  if (level >= 13) return 6;
  return null;
}

/** Arcane Recovery / Natural Recovery: combined spell slot levels recoverable
 *  on a short rest (1/day). Used by Sage (Wizard) and Shepherd Circle of the Land.
 *  Returns ceil(fateboundLevel / 2).
 *
 *  Source: "recover spell slots with a combined level equal to half your
 *  Fatebound level (rounded up)" */
export function getArcaneRecoveryBudget(level: number): number {
  return Math.ceil(level / 2);
}
