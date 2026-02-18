export interface LevelFeature {
  level: number;
  features: string[];
}

export const LEVEL_PROGRESSION: LevelFeature[] = [
  { level: 1, features: ["Dawn Roll", "Chaos Form", "Fatemark", "Fate Attunement"] },
  { level: 2, features: ["Residual Memory (1 Fate Pool point)"] },
  { level: 3, features: ["Chaos Surge"] },
  { level: 4, features: ["ASI / Feat"] },
  { level: 5, features: ["Stabilized Form Table (d12) unlocked"] },
  { level: 6, features: ["Extra Dawn Die", "Residual Memory (2 Fate Pool points)"] },
  { level: 7, features: ["Fate Resistance"] },
  { level: 8, features: ["ASI / Feat"] },
  { level: 9, features: ["Stabilized Form Subclass Features (full subclass roll)"] },
  { level: 10, features: ["Residual Memory (3 Fate Pool points)"] },
  { level: 11, features: ["Dual Nature"] },
  { level: 12, features: ["ASI / Feat"] },
  { level: 13, features: ["Stabilized Form Signature Abilities"] },
  { level: 14, features: ["Twist of Fate"] },
  { level: 15, features: ["Residual Memory (4 Fate Pool points)", "Chaos Resonance"] },
  { level: 16, features: ["ASI / Feat"] },
  { level: 17, features: ["Stabilized Form Capstones", "Dual Nature Improvement (secondary form gains two features)"] },
  { level: 18, features: ["Defy Fate"] },
  { level: 19, features: ["ASI / Feat"] },
  { level: 20, features: ["Lord of Chaos"] },
];

/** Number of Table D rolls for Chaos Form at each level range. */
export const TABLE_D_ROLLS_BY_LEVEL: { minLevel: number; maxLevel: number; rolls: number }[] = [
  { minLevel: 1, maxLevel: 3, rolls: 0 },
  { minLevel: 4, maxLevel: 7, rolls: 1 },
  { minLevel: 8, maxLevel: 11, rolls: 2 },
  { minLevel: 12, maxLevel: 15, rolls: 3 },
  { minLevel: 16, maxLevel: 18, rolls: 4 },
  { minLevel: 19, maxLevel: 20, rolls: 5 },
];

/** Residual Memory / Fate Pool slot counts by level. */
export const FATE_POOL_BY_LEVEL: { minLevel: number; maxLevel: number; slots: number }[] = [
  { minLevel: 1, maxLevel: 1, slots: 0 },
  { minLevel: 2, maxLevel: 5, slots: 1 },
  { minLevel: 6, maxLevel: 9, slots: 2 },
  { minLevel: 10, maxLevel: 14, slots: 3 },
  { minLevel: 15, maxLevel: 20, slots: 4 },
];

export function getTableDRolls(level: number): number {
  const entry = TABLE_D_ROLLS_BY_LEVEL.find(
    (e) => level >= e.minLevel && level <= e.maxLevel
  );
  return entry?.rolls ?? 0;
}

export function getFatePoolSlots(level: number): number {
  const entry = FATE_POOL_BY_LEVEL.find(
    (e) => level >= e.minLevel && level <= e.maxLevel
  );
  return entry?.slots ?? 0;
}
