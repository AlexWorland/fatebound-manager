/**
 * Extract a compact effect summary from a spell description.
 * Looks for damage dice patterns like "Xd8 damage", healing patterns like "XdY hit points",
 * and other effect indicators.
 */
export function extractSpellEffect(description: string): string {
  // Match damage patterns: "2d8 fire damage", "3d6 damage", "1d10 + spellcasting modifier"
  const damageMatch = description.match(/(\d+d\d+(?:\s*\+\s*\w+)?)\s+(\w+\s+)?damage/i);
  if (damageMatch) {
    const dice = damageMatch[1];
    const type = damageMatch[2]?.trim();
    return type ? `${dice} ${type}` : dice;
  }

  // Match healing: "regain Xd8 hit points", "Xd6 + modifier hit points"
  const healMatch = description.match(/(\d+d\d+(?:\s*\+\s*\w+)?)\s+hit\s+points/i);
  if (healMatch) return `Heal ${healMatch[1]}`;

  // Match condition effects
  const conditions = ["frightened", "charmed", "restrained", "blinded", "stunned", "paralyzed", "poisoned"];
  for (const cond of conditions) {
    if (description.toLowerCase().includes(cond)) return cond.charAt(0).toUpperCase() + cond.slice(1);
  }

  // Utility/buff/other — check disadvantage first since it contains "advantage"
  if (description.toLowerCase().includes("disadvantage")) return "Disadvantage";
  if (description.toLowerCase().includes("advantage")) return "Advantage";

  return "—";
}

/**
 * Determine the HIT/DC column value for a spell.
 * Returns "+X" for attack spells, "DC X SAV" for save spells, "—" for utility.
 */
export function extractSpellHitDC(
  description: string,
  spellAttack: number,
  spellSaveDC: number
): string {
  // Spell attack rolls
  if (description.toLowerCase().includes("spell attack") || description.toLowerCase().includes("ranged attack") || description.toLowerCase().includes("melee attack")) {
    return `+${spellAttack}`;
  }

  // Saving throws — extract the ability
  const saveMatch = description.match(/(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+saving\s+throw/i);
  if (saveMatch) {
    const abilityAbbrev: Record<string, string> = {
      strength: "STR", dexterity: "DEX", constitution: "CON",
      intelligence: "INT", wisdom: "WIS", charisma: "CHA"
    };
    return `DC ${spellSaveDC} ${abilityAbbrev[saveMatch[1].toLowerCase()]}`;
  }

  return "—";
}
