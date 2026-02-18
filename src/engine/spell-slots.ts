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
 *  Returns the spell slot level recovered: floor(characterLevel / 3), minimum 1, capped at 5. */
export function getShortRestRecoverySlot(level: number): number {
  const slotLevel = Math.floor(level / 3);
  return Math.min(Math.max(slotLevel, 1), 5);
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
