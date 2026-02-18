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
 *  Returns the arcanum spell level (6 or 7), or null if not yet available.
 *  - Level 13–16: 6th-level arcanum
 *  - Level 17+: 7th-level arcanum */
export function getMysticArcanumLevel(level: number): number | null {
  if (level >= 17) return 7;
  if (level >= 13) return 6;
  return null;
}
