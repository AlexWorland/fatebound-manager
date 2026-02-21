export interface LevelFeature {
  level: number;
  features: string[];
}

export const LEVEL_PROGRESSION: LevelFeature[] = [
  { level: 1, features: ["Dawn Roll", "Chaos Form", "Fatemark", "Fate Attunement"] },
  { level: 2, features: ["Residual Memory (1 Fate Pool point)"] },
  { level: 3, features: ["Chaos Surge"] },
  { level: 4, features: ["ASI / Feat"] },
  { level: 5, features: ["Stabilized Form Table (d20, reroll 15-20) unlocked", "Extra Dawn Die"] },
  { level: 6, features: ["Residual Memory (2 Fate Pool points)"] },
  { level: 7, features: ["Fate Resistance"] },
  { level: 8, features: ["ASI / Feat"] },
  { level: 9, features: ["Stabilized Form Subclass Features (full subclass roll)", "Emergent Path (Chaos Form)"] },
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

/**
 * Descriptions for class features, keyed by the exact feature name string
 * from LEVEL_PROGRESSION. Features that share a mechanic but appear at
 * multiple levels (like Residual Memory) use a single key.
 */
export const CLASS_FEATURE_DESCRIPTIONS: Record<string, string> = {
  "Dawn Roll":
    "Each day at dawn (or upon completing a long rest), the Fatebound makes a Dawn Roll — a d20 roll that determines their capabilities for the next 24 hours. The Dawn Roll cannot be modified by any feature, spell, or ability. It is pure fate. Results range from DM's Design (nat 1) to Master of Fate (nat 20).",
  "Chaos Form":
    "When assigned a Chaos Form, roll on each of the following tables independently. You are a patchwork of random abilities. Tables A (chassis), B (primary feature), and C (defensive feature) are always rolled. Table D (random feat) scales with level.",
  "Fatemark":
    "A visible, shifting mark on your body that changes appearance daily to reflect your current form. Grants permanent proficiency in Constitution saving throws (cannot be lost regardless of Daily Form) and serves as an arcane focus for any spellcasting granted by your Daily Form. You have advantage on Charisma checks when interacting with creatures that revere fate, chance, or chaos.",
  "Fate Attunement":
    "When you assume a Daily Form after your Dawn Roll, you may swap two of your ability scores for the day. The swap reverts when you complete your next long rest and make a new Dawn Roll. You can only swap two scores — not three or more. Magic items that set a score to a fixed value override the swapped score (apply Fate Attunement first, then item effects).",
  "Residual Memory (1 Fate Pool point)":
    "You retain echoes of past forms. After a long rest and your Dawn Roll, you may spend 1 Fate Pool point to lock one feature from the previous day's form into memory. It persists alongside your new form. You cannot retain a feature that was itself retained via Residual Memory the previous day.",
  "Chaos Surge":
    "Once per long rest, you can perform a 1-minute ritual (out of combat) to force a mid-day reroll of one table (A, B, C, or D for Chaos Forms, or a full reroll for Stabilized Forms). The new result takes effect immediately. Used resources do not reset. Cannot be used during combat or initiative.",
  "ASI / Feat":
    "Ability Score Improvement or Feat. Increase one ability score by 2 (max 20), increase two ability scores by 1 each, or gain a feat. For Stabilized Form days, these are permanent. On Chaos Form days, Table D rolls provide temporary feats instead.",
  "Stabilized Form Table (d20, reroll 15-20) unlocked":
    "When your Dawn Roll is 11+, you roll on the Stabilized Form table instead of the Chaos Form tables. Roll d20 and consult the 14 stabilized forms. Results of 15-20 are rerolled (there are only 14 forms). Each stabilized form is a complete class-equivalent loadout with hit die, proficiencies, features, and spellcasting.",
  "Extra Dawn Die":
    "You roll 2d20 for your Dawn Roll and choose which result to use. The other die is discarded. Natural 1s and 20s still only apply if you choose that die.",
  "Residual Memory (2 Fate Pool points)":
    "Your Fate Pool increases to 2 points. After a long rest and your Dawn Roll, you may spend Fate Pool points to lock features from the previous day's form into memory.",
  "Fate Resistance":
    "You gain proficiency in one additional saving throw (your choice, selected daily). Additionally, you have advantage on saving throws against effects that would alter your form, polymorph you, or change your identity.",
  "Stabilized Form Subclass Features (full subclass roll)":
    "When you roll a Stabilized Form, randomly select a subclass from that form's subclass table using Fate's Selection. You gain that subclass's Level 9 feature alongside your form's base features.",
  "Emergent Path (Chaos Form)":
    "When assigned a Chaos Form at level 9+, you gain a fragment of subclass identity tied to your Table B result. Randomly select a subclass from the same form as your Table B class using Fate's Selection. You gain that subclass's Level 9 feature alongside your Chaos Form results.",
  "Residual Memory (3 Fate Pool points)":
    "Your Fate Pool increases to 3 points. At level 11+, Residual Memory and Dual Nature draw from the same shared Fate Pool. Retaining a feature costs 1 point; Dual Nature costs 2 points.",
  "Dual Nature":
    "When you roll a Stabilized Form, you may spend 2 Fate Pool points to roll twice on the Stabilized Form table. Designate one as Primary Form (full features) and one as Secondary Form (proficiencies + one feature of your choice from the secondary form's base feature list). If both rolls produce the same form, reroll the secondary.",
  "Stabilized Form Signature Abilities":
    "Your stabilized form's subclass gains its Signature Ability (Level 13 feature). This provides more powerful, distinctive abilities unique to each subclass variant.",
  "Twist of Fate":
    "Once per long rest, when you or a creature you can see within 60 feet makes an attack roll, saving throw, or ability check, you can force a reroll. You choose which result is used. If used on yourself, the shifting mark on your body flares visibly.",
  "Residual Memory (4 Fate Pool points)":
    "Your Fate Pool increases to 4 points. Example at level 15: Dual Nature (2) + 2 memories, OR skip Dual Nature for 4 memories.",
  "Chaos Resonance":
    "When assigned a Chaos Form at level 15+, after applying Emergent Path, randomly select from the Stabilized Form table, then randomly select a subclass using Fate's Selection. You gain that subclass's Level 9 and Level 13 features — a second, distinct subclass identity overlaid on top of your Emergent Path.",
  "Stabilized Form Capstones":
    "Your stabilized form's subclass gains its Capstone (Level 17 feature). These are the most powerful subclass abilities, representing mastery of that form's archetype.",
  "Dual Nature Improvement (secondary form gains two features)":
    "Your secondary form now grants two features from its base feature list instead of one, making Dual Nature significantly more powerful.",
  "Defy Fate":
    "Once per long rest, you can choose to ignore your Dawn Roll entirely and select any form or combination of Chaos Form table results you wish. This lasts for 24 hours. Fate's Reckoning: The next Dawn Roll after using Defy Fate automatically becomes DM's Design (natural 1). This cannot be prevented or overridden.",
  "Lord of Chaos":
    "Your Dawn Roll remains 2d20, keep highest. Expanded Dual Nature: your secondary form gains all base features (not just one/two). Chaos Mastery: when rolling Chaos Form tables, choose the result on two of the four tables. Persistent Memory: one Residual Memory slot becomes permanent and does not reset on long rest.",
};

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
