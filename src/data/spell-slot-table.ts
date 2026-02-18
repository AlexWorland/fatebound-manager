export interface SpellSlotRow {
  level: number;
  slots: [number, number, number, number, number]; // [1st, 2nd, 3rd, 4th, 5th]
}

/** Half-caster spell slot table for the Fatebound class.
 *  At level 1, forms that grant spellcasting provide cantrips only.
 *  Spell slots become available at level 2 per this table. */
export const SPELL_SLOT_TABLE: SpellSlotRow[] = [
  { level: 1, slots: [0, 0, 0, 0, 0] },
  { level: 2, slots: [2, 0, 0, 0, 0] },
  { level: 3, slots: [3, 0, 0, 0, 0] },
  { level: 4, slots: [3, 0, 0, 0, 0] },
  { level: 5, slots: [4, 2, 0, 0, 0] },
  { level: 6, slots: [4, 2, 0, 0, 0] },
  { level: 7, slots: [4, 3, 0, 0, 0] },
  { level: 8, slots: [4, 3, 0, 0, 0] },
  { level: 9, slots: [4, 3, 2, 0, 0] },
  { level: 10, slots: [4, 3, 2, 0, 0] },
  { level: 11, slots: [4, 3, 3, 0, 0] },
  { level: 12, slots: [4, 3, 3, 0, 0] },
  { level: 13, slots: [4, 3, 3, 1, 0] },
  { level: 14, slots: [4, 3, 3, 1, 0] },
  { level: 15, slots: [4, 3, 3, 2, 0] },
  { level: 16, slots: [4, 3, 3, 2, 0] },
  { level: 17, slots: [4, 3, 3, 3, 1] },
  { level: 18, slots: [4, 3, 3, 3, 1] },
  { level: 19, slots: [4, 3, 3, 3, 2] },
  { level: 20, slots: [4, 3, 3, 3, 2] },
];

export function getSpellSlots(level: number): SpellSlotRow["slots"] {
  const row = SPELL_SLOT_TABLE.find((r) => r.level === level);
  return row?.slots ?? [0, 0, 0, 0, 0];
}
