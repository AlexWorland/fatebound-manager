import { rollDie } from "@/lib/dice";
import type { BaseFeature } from "@/types/forms";

interface AutoRollOption {
  featureName: string;
  options: string[];
  count: number; // how many to select (usually 1, but 2 for Metamagic)
}

/**
 * Parse a "Randomly select" option list from a feature description.
 *
 * Handles two formats:
 * 1. "Randomly select — 1: Option, 2: Option, ..." (single select)
 * 2. "randomly select N from: 1-Option, 2-Option, ..." (multi-select, uses hyphens)
 *
 * Returns null if the description does not contain a parseable auto-roll pattern.
 */
export function parseAutoRollOptions(feature: BaseFeature): AutoRollOption | null {
  const desc = feature.description;

  // Pattern 1: "Randomly select N — 1: Option, 2: Option" or "Randomly select — 1: Option, 2: Option"
  // The em-dash (—) separates the header from the options list; options use "N: " format.
  const emdashPattern = /[Rr]andomly select(?:\s+(\d+))?\s+[—–]\s+(.+)/;
  const emdashMatch = desc.match(emdashPattern);
  if (emdashMatch) {
    const count = emdashMatch[1] ? parseInt(emdashMatch[1], 10) : 1;
    const optionsStr = emdashMatch[2];
    // Options look like "1: Archery, 2: Defense, ..." — trim trailing period
    const options = optionsStr
      .replace(/\.$/, "")
      .split(/,\s*\d+:\s*/)
      .map((s) => s.replace(/^\d+:\s*/, "").trim())
      .filter((s) => s.length > 0);
    if (options.length > 0) {
      return { featureName: feature.name, options, count };
    }
  }

  // Pattern 2: "randomly select N from: 1-Option, 2-Option, ..." (colon without em-dash, hyphen separators)
  const colonPattern = /[Rr]andomly select\s+(\d+)\s+from:\s*(.+)/;
  const colonMatch = desc.match(colonPattern);
  if (colonMatch) {
    const count = parseInt(colonMatch[1], 10);
    const optionsStr = colonMatch[2];
    // Options look like "1-Careful, 2-Distant, ..." — trim trailing paren or period
    const options = optionsStr
      .replace(/[).]+$/, "")
      .split(/,\s*\d+-/)
      .map((s) => s.replace(/^\d+-/, "").trim())
      .filter((s) => s.length > 0);
    if (options.length > 0) {
      return { featureName: feature.name, options, count };
    }
  }

  return null;
}

/**
 * Roll for all features that have auto-roll options.
 *
 * Returns a map from feature name → selected option(s).
 * For single-select features the value is the selected option string.
 * For multi-select features (count > 1) the value is a comma-separated string
 * of the selected options (in roll order, duplicates removed).
 */
export function resolveAutoRolls(features: BaseFeature[]): Record<string, string> {
  const results: Record<string, string> = {};
  for (const feature of features) {
    const parsed = parseAutoRollOptions(feature);
    if (!parsed) continue;

    if (parsed.count === 1) {
      const roll = rollDie(parsed.options.length);
      results[parsed.featureName] = parsed.options[roll - 1];
    } else {
      // Multi-select: roll without replacement until we have `count` unique picks.
      const picked: string[] = [];
      const remaining = [...parsed.options];
      for (let i = 0; i < parsed.count && remaining.length > 0; i++) {
        const roll = rollDie(remaining.length);
        picked.push(remaining[roll - 1]);
        remaining.splice(roll - 1, 1);
      }
      results[parsed.featureName] = picked.join(", ");
    }
  }
  return results;
}
