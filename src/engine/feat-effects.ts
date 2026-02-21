import { TABLE_D_FEATS } from "@/data/tables/table-d-feats";

export interface FeatEffect {
  featId: number;
  featName: string;
  attackBonus?: number;
  damageBonus?: number;
  attackRollModifier?: string;
  damageModifier?: string;
  acBonus?: number;
  savingThrowBonus?: number;
  specialNote?: string;
}

// Map of feat IDs to their mechanical effects. Only feats with clear mechanical
// effects are included here; the rest are displayed via their description only.
const FEAT_EFFECT_MAP: Record<number, Omit<FeatEffect, "featId" | "featName">> = {
  // Alert (id: 4) — +5 initiative, can't be surprised
  4: {
    attackRollModifier: "+5 to initiative rolls",
    specialNote: "Can't be surprised while conscious. Attackers don't gain advantage from being unseen by you.",
  },
  // Charger (id: 9) — +5 to damage after Dash + 10ft straight line
  9: {
    specialNote: "After Dashing 10+ ft in a line, bonus action melee attack gains +5 damage or can shove 10 ft.",
  },
  // Crossbow Expert (id: 12) — no disadvantage at melee range for ranged attacks
  12: {
    specialNote: "Ignore loading property of crossbows. No disadvantage on ranged attacks within 5 ft. Bonus action hand crossbow attack after one-handed Attack action.",
  },
  // Defensive Duelist (id: 14) — reaction +proficiency to AC
  14: {
    specialNote: "Reaction: add proficiency bonus to AC against one melee hit (requires finesse weapon).",
  },
  // Dragon Hide (id: 16) — AC 13 + DEX without armor, 1d4 claws
  16: {
    specialNote: "While unarmored: AC = 13 + DEX modifier. Retractable claws deal 1d4 + STR slashing.",
  },
  // Dual Wielder (id: 18) — +1 AC when dual wielding
  18: {
    acBonus: 1,
    specialNote: "+1 AC while wielding a separate melee weapon in each hand. Can use two-weapon fighting with non-light weapons.",
  },
  // Elven Accuracy (id: 24) — reroll one die on advantage attack rolls
  24: {
    specialNote: "When attacking with advantage using DEX, INT, WIS, or CHA, reroll one die once (triple advantage).",
  },
  // Gift of the Metallic Dragon (id: 33) — reaction +proficiency to AC
  33: {
    specialNote: "Reaction: manifest spectral wings granting +proficiency bonus to AC for one hit against you or adjacent ally.",
  },
  // Great Weapon Master (id: 35) — optional -5/+10 on heavy melee
  35: {
    attackBonus: -5,
    damageBonus: 10,
    specialNote: "Optional per-attack: -5 attack roll / +10 damage (heavy weapons only). On crit or kill, bonus action melee attack.",
  },
  // Heavy Armor Master (id: 39) — reduce non-magical damage by 3
  39: {
    specialNote: "While wearing heavy armor: reduce bludgeoning, piercing, and slashing damage from nonmagical attacks by 3.",
  },
  // Lucky (id: 46) — 3 luck points per long rest to reroll d20s
  46: {
    specialNote: "3 luck points per long rest. Spend to roll an extra d20 on any attack roll, ability check, or saving throw, choosing which result to use.",
  },
  // Mounted Combatant (id: 55) — advantage on melee vs smaller unmounted
  55: {
    attackRollModifier: "Advantage on melee attacks vs unmounted creatures smaller than mount.",
    specialNote: "Can redirect attacks targeting mount to yourself.",
  },
  // Polearm Master (id: 61) — bonus action 1d4 attack
  61: {
    specialNote: "After Attack action with glaive/halberd/quarterstaff/spear: bonus action attack with opposite end (1d4 bludgeoning). Creatures entering your reach provoke opportunity attacks.",
  },
  // Resilient (id: 63) — proficiency in one saving throw
  63: {
    savingThrowBonus: 0,
    specialNote: "Proficiency in a randomly selected saving throw (STR/DEX/CON/INT/WIS/CHA). CON is rerolled (already covered by Fatemark).",
  },
  // Revenant Blade (id: 64) — +1 AC with double-bladed scimitar
  64: {
    acBonus: 1,
    specialNote: "+1 AC while wielding a double-bladed scimitar. Scimitar gains finesse property for you. Bonus action attack after Attack action.",
  },
  // Savage Attacker (id: 66) — reroll melee damage dice once per turn
  66: {
    specialNote: "Once per turn on melee weapon attack: reroll weapon damage dice and use either total.",
  },
  // Sentinel (id: 68) — reduce speed to 0 on opportunity attacks
  68: {
    specialNote: "Opportunity attack hits reduce target speed to 0. Creatures provoke OA even if they Disengage. Reaction: attack creature that attacks another target within 5 ft.",
  },
  // Sharpshooter (id: 70) — optional -5/+10 on ranged
  70: {
    attackBonus: -5,
    damageBonus: 10,
    specialNote: "Optional per-attack: -5 attack roll / +10 damage (ranged weapons only). No disadvantage at long range. Attacks ignore half/three-quarters cover.",
  },
  // Shield Master (id: 71) — add shield AC to DEX saves
  71: {
    specialNote: "After Attack action: bonus action shove with shield. Add shield's AC bonus to DEX saves targeting only you. Reaction on DEX saves for half damage: take none on success.",
  },
  // Tough (id: 85) — +2 HP per level
  85: {
    specialNote: "+2 hit points per character level (current and future levels).",
  },
  // War Caster (id: 86) — advantage on concentration saves
  86: {
    savingThrowBonus: 0,
    specialNote: "Advantage on CON saving throws to maintain concentration. Can cast spells as opportunity attacks. Can perform somatic components with weapons/shield in hand.",
  },
};

/**
 * Get all mechanical effects for a list of active feat IDs.
 * Feats not in the effect map return a minimal entry with just name.
 */
export function getFeatEffects(featIds: number[]): FeatEffect[] {
  const results: FeatEffect[] = [];
  for (const id of featIds) {
    const feat = TABLE_D_FEATS.find((f) => f.id === id);
    if (!feat) continue;
    const effect = FEAT_EFFECT_MAP[id];
    if (effect) {
      results.push({ featId: id, featName: feat.name, ...effect });
    }
  }
  return results;
}

/**
 * Get the total attack bonus and any conditional notes from active feats.
 * Note: GWM and Sharpshooter are optional per-attack penalties — they are
 * included in notes but NOT summed into attackBonus automatically.
 */
export function getFeatAttackModifiers(featIds: number[]): { attackBonus: number; notes: string[] } {
  const effects = getFeatEffects(featIds);
  let attackBonus = 0;
  const notes: string[] = [];

  for (const effect of effects) {
    // GWM and Sharpshooter are optional, so we don't auto-apply their -5
    const isOptionalPenalty = effect.featId === 35 || effect.featId === 70;
    if (effect.attackBonus !== undefined && !isOptionalPenalty) {
      attackBonus += effect.attackBonus;
    }
    if (effect.attackRollModifier) {
      notes.push(`${effect.featName}: ${effect.attackRollModifier}`);
    }
    if (isOptionalPenalty) {
      notes.push(`${effect.featName}: Optional -5 attack / +10 damage available`);
    }
  }

  return { attackBonus, notes };
}

/**
 * Get the total damage bonus and any conditional notes from active feats.
 * Same optional logic as attack modifiers for GWM/Sharpshooter.
 */
export function getFeatDamageModifiers(featIds: number[]): { damageBonus: number; notes: string[] } {
  const effects = getFeatEffects(featIds);
  let damageBonus = 0;
  const notes: string[] = [];

  for (const effect of effects) {
    const isOptionalBonus = effect.featId === 35 || effect.featId === 70;
    if (effect.damageBonus !== undefined && !isOptionalBonus) {
      damageBonus += effect.damageBonus;
    }
    if (effect.damageModifier) {
      notes.push(`${effect.featName}: ${effect.damageModifier}`);
    }
    if (isOptionalBonus) {
      notes.push(`${effect.featName}: Optional +10 damage available (with -5 attack penalty)`);
    }
  }

  return { damageBonus, notes };
}
