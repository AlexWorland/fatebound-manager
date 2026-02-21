# Engine Audit Findings

## Task: Update Engine for New Table Sizes and Mechanics

### Summary
Reviewed all five engine modules (chaos-form, dawn-roll, stabilized-form, spell-slots, fate-pool) against the Fatebound source document. **All engine code is already correct** and matches the source documentation. No changes were needed.

## Verification Results

### 1. chaos-form.ts
- Table A: Uses `rollFatesSelection(TABLE_A_CHASSIS.length)` — already handles 10 entries ✓
- Table C: Uses `rollFatesSelection(TABLE_C_DEFENSIVE.length)` — already handles 12 entries ✓
- Die reroll logic: Correctly uses Fate's Selection (reroll 15-20 for any table) ✓
- Fate's Mercy: All corrections implemented (d8 minimum, light armor floor, AC floor, Fate Strike) ✓

### 2. dawn-roll.ts
- 1: DM's Design ✓
- 2-5: Deep Chaos ✓
- 6-10: Unstable Form ✓
- 11-15: Guided Fate (level 5+; Chaos Form before) ✓
- 16-19: Favored Fate (level 5+; Unstable Form before) ✓
- 20: Master of Fate ✓

### 3. stabilized-form.ts
- Secondary form gets: armor/weapon profs, hit die, **one feature** from base list ✓
- Level 17: secondary form gets **two features** from base list ✓
- Base features only for secondary (no subclass features) ✓

### 4. spell-slots.ts
- Hexer Pact Magic: 2 slots/3rd at L5-8, 2 slots/4th at L9-12, 3 slots/5th at L13+ ✓
- Mystic Arcanum: 6th at L13, add 7th at L17 ✓
- Arcane Recovery: ceil(level/2) ✓

### 5. fate-pool.ts & residual-memory.ts
- Fate Pool sizes: 1 at L2, 2 at L6, 3 at L10, 4 at L15 ✓
- Pool cost: 1 point per retained feature, 2 for Dual Nature ✓
- Anti-daisy-chaining validation: implemented ✓

## Notable Implementation Details
- `getSecondaryFormFeatures()` has both overloaded signatures (with and without level) for backward compatibility
- Table D rolls use `TABLE_D_FEATS.length` which correctly handles the 91-feat table
- Level progression data (FATE_POOL_BY_LEVEL) correctly ranges coverage across all levels
