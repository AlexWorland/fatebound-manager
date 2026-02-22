/**
 * AC calculation utilities for Fatebound characters
 */

export interface ACBreakdownInput {
  baseAC: number;
  dexMod: number;
  armorBonus: number;
  shieldBonus: number;
  otherBonuses?: { label: string; value: number }[];
}

/**
 * Computes a human-readable AC breakdown string
 * @example "10 + DEX(+3) + Armor(+5) + Shield(+2) = 20"
 */
export function computeACBreakdown(
  baseAC: number,
  dexMod: number,
  armorBonus: number,
  shieldBonus: number,
  otherBonuses: { label: string; value: number }[] = []
): string {
  const parts: string[] = [`${baseAC}`];

  if (dexMod !== 0) {
    parts.push(`DEX(${dexMod >= 0 ? "+" : ""}${dexMod})`);
  }

  if (armorBonus > 0) {
    parts.push(`Armor(+${armorBonus})`);
  }

  if (shieldBonus > 0) {
    parts.push(`Shield(+${shieldBonus})`);
  }

  for (const bonus of otherBonuses) {
    if (bonus.value > 0) {
      parts.push(`${bonus.label}(+${bonus.value})`);
    } else if (bonus.value < 0) {
      parts.push(`${bonus.label}(${bonus.value})`);
    }
  }

  const total =
    baseAC +
    dexMod +
    armorBonus +
    shieldBonus +
    otherBonuses.reduce((sum, b) => sum + b.value, 0);

  return parts.join(" + ") + ` = ${total}`;
}
