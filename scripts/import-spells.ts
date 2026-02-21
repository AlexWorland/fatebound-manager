#!/usr/bin/env tsx
/**
 * import-spells.ts
 *
 * Parses D&D 5e spell data from local Obsidian vault markdown files into
 * TypeScript data files under src/data/spell-lists/.
 *
 * Usage: npx tsx scripts/import-spells.ts
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VAULT_BASE =
  "/Users/alexworland/Library/Mobile Documents/iCloud~md~obsidian/Documents/AlexObsidian/DnD/wiki-mirror/md";
const SPELL_LISTS_DIR = path.join(VAULT_BASE, "spells");
const SPELL_DETAIL_DIR = path.join(VAULT_BASE, "spell");
const OUTPUT_DIR = path.join(__dirname, "../src/data/spell-lists");

// Maximum spell level to include (Fatebound half-caster caps at 7)
const MAX_LEVEL = 7;

const CLASSES = [
  "bard",
  "cleric",
  "druid",
  "paladin",
  "ranger",
  "sorcerer",
  "warlock",
  "wizard",
  "artificer",
] as const;

type ClassName = (typeof CLASSES)[number];

// Map class → exported constant name and SPELL_LISTS key
const CLASS_META: Record<
  ClassName,
  { constant: string; listKey: string }
> = {
  bard: { constant: "BARD_SPELLS", listKey: "Bard" },
  cleric: { constant: "CLERIC_SPELLS", listKey: "Cleric" },
  druid: { constant: "DRUID_SPELLS", listKey: "Druid" },
  paladin: { constant: "PALADIN_SPELLS", listKey: "Paladin" },
  ranger: { constant: "RANGER_SPELLS", listKey: "Ranger" },
  sorcerer: { constant: "SORCERER_SPELLS", listKey: "Sorcerer" },
  warlock: { constant: "WARLOCK_SPELLS", listKey: "Warlock" },
  wizard: { constant: "WIZARD_SPELLS", listKey: "Wizard" },
  artificer: { constant: "ARTIFICER_SPELLS", listKey: "Artificer" },
};

// ---------------------------------------------------------------------------
// Types (mirrors src/types/spells.ts — avoid runtime import of project code)
// ---------------------------------------------------------------------------

interface SpellReference {
  slug: string;
  name: string;
  level: number;
  school: string;
  ritual: boolean;
  concentration: boolean;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higherLevel?: string;
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/**
 * Extract all spell slugs from a class spell-list markdown file.
 * The file has one or more markdown tables; each data row looks like:
 *   | [Spell Name](spell/{slug}.md) | ... |
 *
 * We skip header rows (containing "Spell Name") and separator rows (containing "---").
 */
function parseSpellSlugsFromList(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const slugs: string[] = [];
  const seen = new Set<string>();

  for (const line of content.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (line.includes("Spell Name") || line.includes("---")) continue;

    // Match: | [Spell Name](spell/slug.md) | ...
    const match = line.match(/\|\s*\[([^\]]+)\]\(spell\/([^)]+)\.md\)/);
    if (!match) continue;

    const slug = match[2];
    if (!seen.has(slug)) {
      seen.add(slug);
      slugs.push(slug);
    }
  }

  return slugs;
}

/**
 * Parse an individual spell markdown file into a SpellReference.
 * Returns null if the file is missing, is UA content, or is above MAX_LEVEL.
 */
function parseSpellDetail(slug: string): SpellReference | null {
  const filePath = path.join(SPELL_DETAIL_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] Spell file not found: ${slug}.md — skipping`);
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Skip UA spells — check the title in frontmatter
  const titleLine = lines.find((l) => l.startsWith("title:"));
  const spellName = titleLine ? titleLine.replace(/^title:\s*/, "").trim() : slug;

  if (spellName.includes("(UA)")) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Find the italic line that contains level + school (+ optional ritual)
  // Examples:
  //   *Conjuration cantrip*
  //   *1st-level evocation*
  //   *1st-level abjuration (ritual)*
  // This line appears after the frontmatter and source block, before the bold fields.
  // ---------------------------------------------------------------------------

  let level = -1;
  let school = "";
  let ritual = false;

  // Find the first italic line that describes the level/school (after frontmatter ends)
  let pastFrontmatter = false;
  let levelLineFound = false;

  for (const line of lines) {
    if (line.trim() === "---") {
      pastFrontmatter = !pastFrontmatter ? true : pastFrontmatter;
      continue;
    }
    if (!pastFrontmatter) continue;

    // Look for italic level/school line: starts with * and ends with *
    // but NOT bold lines (**...**) or blockquotes
    const trimmed = line.trim();
    if (
      trimmed.startsWith("*") &&
      !trimmed.startsWith("**") &&
      !trimmed.startsWith("***") &&
      trimmed.endsWith("*")
    ) {
      // Strip surrounding asterisks
      const inner = trimmed.slice(1, -1).toLowerCase();

      if (inner.includes("cantrip")) {
        level = 0;
        // e.g. "conjuration cantrip" or "evocation cantrip"
        school = inner.replace(/\s*cantrip.*/, "").trim();
        school = capitalize(school);
        levelLineFound = true;
        break;
      }

      // Match "1st-level evocation" or "3rd-level evocation (ritual)"
      const levelMatch = inner.match(/^(\d+)\w+-level\s+(\w+)(?:\s+\(ritual\))?/);
      if (levelMatch) {
        level = parseInt(levelMatch[1], 10);
        school = capitalize(levelMatch[2]);
        ritual = inner.includes("(ritual)");
        levelLineFound = true;
        break;
      }
    }
  }

  if (!levelLineFound || level < 0) {
    console.warn(`[WARN] Could not parse level for: ${slug} — skipping`);
    return null;
  }

  // Filter by max level
  if (level > MAX_LEVEL) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Parse bold field lines: **Field:** value
  // ---------------------------------------------------------------------------
  let castingTime = "";
  let range = "";
  let components = "";
  let duration = "";

  for (const line of lines) {
    const trimmed = line.trim();
    // Format is **Field Name:** value (colon is INSIDE the closing **)
    const fieldMatch = trimmed.match(/^\*\*([^*]+):\*\*\s*(.+)/);
    if (!fieldMatch) continue;

    const fieldName = fieldMatch[1].toLowerCase();
    const value = fieldMatch[2].trim();

    if (fieldName === "casting time") castingTime = value;
    else if (fieldName === "range") range = value;
    else if (fieldName === "components") components = value;
    else if (fieldName === "duration") duration = value;
  }

  const concentration = duration.toLowerCase().includes("concentration");

  // ---------------------------------------------------------------------------
  // Parse description and higher levels
  // Strategy: find lines after the last **Duration:** line and before
  // ***At Higher Levels.*** or ***Spell Lists.***
  // ---------------------------------------------------------------------------

  let durationLineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().match(/^\*\*Duration:\*\*/i)) {
      durationLineIdx = i;
    }
  }

  let description = "";
  let higherLevel: string | undefined;

  if (durationLineIdx >= 0) {
    const bodyLines = lines.slice(durationLineIdx + 1);
    const descParts: string[] = [];
    let higherParts: string[] = [];
    let inHigher = false;
    let inSpellLists = false;

    for (const line of bodyLines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("***Spell Lists.***")) {
        inSpellLists = true;
        continue;
      }
      if (inSpellLists) continue;

      if (trimmed.startsWith("***At Higher Levels.***")) {
        inHigher = true;
        // The rest of this line after the bold prefix is the higher level text
        const afterPrefix = trimmed
          .replace(/^\*\*\*At Higher Levels\.\*\*\*\s*/, "")
          .trim();
        if (afterPrefix) higherParts.push(afterPrefix);
        continue;
      }

      if (inHigher) {
        if (trimmed === "") {
          // End of higher level block if there's already content
          if (higherParts.length > 0) {
            inHigher = false;
          }
        } else {
          higherParts.push(trimmed);
        }
      } else {
        // Regular description line — skip empty leading lines
        if (trimmed === "" && descParts.length === 0) continue;
        descParts.push(trimmed);
      }
    }

    // Trim trailing empty lines from description
    while (descParts.length > 0 && descParts[descParts.length - 1] === "") {
      descParts.pop();
    }

    description = descParts.join("\n");
    if (higherParts.length > 0) {
      higherLevel = higherParts.join(" ").trim();
    }
  }

  // Escape backticks in strings for template literal safety
  const escapeStr = (s: string) => s.replace(/`/g, "\\`").replace(/\${/g, "\\${");

  return {
    slug,
    name: spellName,
    level,
    school,
    ritual,
    concentration,
    castingTime: escapeStr(castingTime),
    range: escapeStr(range),
    components: escapeStr(components),
    duration: escapeStr(duration),
    description: escapeStr(description),
    higherLevel: higherLevel ? escapeStr(higherLevel) : undefined,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Code generation helpers
// ---------------------------------------------------------------------------

function serializeSpell(spell: SpellReference): string {
  const lines = [
    `  {`,
    `    slug: "${spell.slug}",`,
    `    name: "${spell.name.replace(/"/g, '\\"')}",`,
    `    level: ${spell.level},`,
    `    school: "${spell.school}",`,
    `    ritual: ${spell.ritual},`,
    `    concentration: ${spell.concentration},`,
    `    castingTime: "${spell.castingTime.replace(/"/g, '\\"')}",`,
    `    range: "${spell.range.replace(/"/g, '\\"')}",`,
    `    components: "${spell.components.replace(/"/g, '\\"')}",`,
    `    duration: "${spell.duration.replace(/"/g, '\\"')}",`,
    // Use JSON.stringify for description to safely handle multi-line / special chars
    `    description: ${JSON.stringify(spell.description)},`,
  ];

  if (spell.higherLevel !== undefined) {
    lines.push(`    higherLevel: ${JSON.stringify(spell.higherLevel)},`);
  }

  lines.push(`  },`);
  return lines.join("\n");
}

function generateClassFile(
  className: ClassName,
  spells: SpellReference[]
): string {
  const meta = CLASS_META[className];
  const serialized = spells.map(serializeSpell).join("\n");

  return `import type { SpellReference } from "@/types/spells";

export const ${meta.constant}: SpellReference[] = [
${serialized}
];
`;
}

function generateIndexFile(classSpells: Map<ClassName, SpellReference[]>): string {
  const imports = CLASSES.map(
    (c) => `import { ${CLASS_META[c].constant} } from "./${c}";`
  ).join("\n");

  const namedExports = CLASSES.map((c) => CLASS_META[c].constant).join(", ");

  const recordEntries = CLASSES.map(
    (c) => `  ${CLASS_META[c].listKey}: ${CLASS_META[c].constant},`
  ).join("\n");

  return `import type { SpellReference } from "@/types/spells";
${imports}

export { ${namedExports} };

export const SPELL_LISTS: Record<string, SpellReference[]> = {
${recordEntries}
};
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function processClass(className: ClassName): SpellReference[] {
  const listFile = path.join(SPELL_LISTS_DIR, `${className}-spell-list.md`);

  if (!fs.existsSync(listFile)) {
    console.error(`[ERROR] Spell list file not found: ${listFile}`);
    return [];
  }

  const slugs = parseSpellSlugsFromList(listFile);
  console.log(`  [${className}] Found ${slugs.length} unique slug(s) in list`);

  const spells: SpellReference[] = [];
  for (const slug of slugs) {
    const spell = parseSpellDetail(slug);
    if (spell) spells.push(spell);
  }

  // Sort by level, then alphabetically by name
  spells.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name);
  });

  console.log(
    `  [${className}] Parsed ${spells.length} spell(s) (level 0-${MAX_LEVEL})`
  );
  return spells;
}

function main() {
  console.log("=== import-spells: Starting ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const classSpells = new Map<ClassName, SpellReference[]>();

  for (const className of CLASSES) {
    console.log(`Processing: ${className}`);
    const spells = processClass(className);
    classSpells.set(className, spells);

    const outFile = path.join(OUTPUT_DIR, `${className}.ts`);
    fs.writeFileSync(outFile, generateClassFile(className, spells), "utf-8");
    console.log(`  -> Wrote ${outFile}`);
  }

  // Write index.ts
  const indexFile = path.join(OUTPUT_DIR, "index.ts");
  fs.writeFileSync(indexFile, generateIndexFile(classSpells), "utf-8");
  console.log(`\n-> Wrote ${indexFile}`);

  console.log("\n=== import-spells: Done ===");

  // Summary
  console.log("\nSummary:");
  for (const [cls, spells] of classSpells.entries()) {
    console.log(`  ${cls}: ${spells.length} spells`);
  }
}

main();
