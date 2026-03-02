import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import type { Character, DailyState } from "@/types/character";

// D&D 5e skill -> ability score mapping
const SKILL_ABILITY: Record<string, string> = {
  Acrobatics: "DEX",
  "Animal Handling": "WIS",
  Arcana: "INT",
  Athletics: "STR",
  Deception: "CHA",
  History: "INT",
  Insight: "WIS",
  Intimidation: "CHA",
  Investigation: "INT",
  Medicine: "WIS",
  Nature: "INT",
  Perception: "WIS",
  Performance: "CHA",
  Persuasion: "CHA",
  Religion: "INT",
  "Sleight of Hand": "DEX",
  Stealth: "DEX",
  Survival: "WIS",
};

const ALL_SKILLS = Object.keys(SKILL_ABILITY);

const SAVING_THROWS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

function proficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

function fmtMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color = rgb(0.1, 0.1, 0.1)
) {
  page.drawText(text, { x, y, font, size, color });
}

function drawLine(
  page: PDFPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness = 0.5
) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness,
    color: rgb(0.6, 0.6, 0.6),
  });
}

function drawRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  borderColor = rgb(0.4, 0.4, 0.4),
  fillColor?: ReturnType<typeof rgb>
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    borderColor,
    borderWidth: 0.75,
    color: fillColor,
  });
}

function drawAbilityScore(
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  x: number,
  y: number,
  label: string,
  score: number
) {
  const mod = abilityMod(score);
  // Outer box
  drawRect(page, x, y, 52, 60, rgb(0.3, 0.3, 0.3), rgb(0.95, 0.95, 0.98));
  // Label
  drawText(page, label, x + 26 - (label.length * 3.5) / 2, y + 46, font, 7, rgb(0.35, 0.35, 0.55));
  // Score (large)
  const scoreStr = String(score);
  drawText(page, scoreStr, x + 26 - (scoreStr.length * 5) / 2, y + 28, boldFont, 16, rgb(0.1, 0.1, 0.1));
  // Modifier (inside small circle at bottom)
  const modStr = fmtMod(mod);
  drawRect(page, x + 14, y + 2, 24, 18, rgb(0.3, 0.3, 0.3), rgb(0.85, 0.85, 0.92));
  drawText(page, modStr, x + 26 - (modStr.length * 4) / 2, y + 7, boldFont, 10, rgb(0.1, 0.1, 0.1));
}

function drawSectionHeader(
  page: PDFPage,
  font: PDFFont,
  x: number,
  y: number,
  width: number,
  title: string
) {
  page.drawRectangle({
    x,
    y,
    width,
    height: 14,
    color: rgb(0.2, 0.2, 0.4),
  });
  drawText(page, title.toUpperCase(), x + 4, y + 3, font, 8, rgb(1, 1, 1));
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  startY: number,
  font: PDFFont,
  size: number,
  maxWidth: number,
  lineHeight: number,
  color = rgb(0.1, 0.1, 0.1)
): number {
  const charsPerLine = Math.floor(maxWidth / (size * 0.55));
  const lines = wrapText(text, charsPerLine);
  let y = startY;
  for (const line of lines) {
    if (y < 20) break;
    drawText(page, line, x, y, font, size, color);
    y -= lineHeight;
  }
  return y;
}

function drawPage1(
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  character: Character,
  dailyState?: DailyState
) {
  const { width, height } = page.getSize();
  const margin = 36;

  // ---- HEADER ----
  page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: rgb(0.12, 0.12, 0.22) });
  drawText(page, character.name, margin, height - 30, boldFont, 22, rgb(0.95, 0.9, 0.75));
  const subLine = `Level ${character.level} The Fatebound${character.alignment ? "  •  " + character.alignment : ""}${character.background ? "  •  " + character.background : ""}`;
  drawText(page, subLine, margin, height - 48, font, 9, rgb(0.75, 0.75, 0.9));

  // Form status (right side of header)
  if (dailyState) {
    const formLabel = dailyState.formType === "CHAOS" ? "Chaos Form" : "Stabilized Form";
    drawText(page, formLabel, width - 140, height - 30, boldFont, 11, rgb(0.9, 0.6, 0.3));
    drawText(page, `Dawn Roll: ${dailyState.dawnRoll}`, width - 140, height - 46, font, 8, rgb(0.8, 0.8, 0.8));
  }

  let yPos = height - 72;

  // ---- ABILITY SCORES ----
  drawSectionHeader(page, boldFont, margin, yPos - 14, 340, "Ability Scores");
  yPos -= 16;

  const abilityKeys = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
  abilityKeys.forEach((key, i) => {
    const score = character.abilityScores[key] ?? 10;
    drawAbilityScore(page, font, boldFont, margin + i * 56, yPos - 60, key, score);
  });
  yPos -= 74;

  // ---- COMBAT STATS ----
  drawSectionHeader(page, boldFont, margin, yPos - 14, 340, "Combat");
  yPos -= 16;

  const conMod = abilityMod(character.abilityScores["CON"] ?? 10);
  const dexMod = abilityMod(character.abilityScores["DEX"] ?? 10);
  const maxHP = dailyState?.currentHP !== undefined ? dailyState.currentHP : 0;
  const tempHP = dailyState?.tempHP ?? 0;
  const ac = 10 + dexMod;
  const initiative = dexMod;
  const speed = dailyState?.movementSpeeds?.walking ?? 30;

  const combatStats = [
    { label: "Armor Class", value: String(ac) },
    { label: "Initiative", value: fmtMod(initiative) },
    { label: "Speed", value: `${speed} ft` },
    { label: "Current HP", value: String(maxHP) },
    { label: "Temp HP", value: String(tempHP) },
    { label: "Prof Bonus", value: fmtMod(proficiencyBonus(character.level)) },
  ];

  combatStats.forEach((stat, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const bx = margin + col * 114;
    const by = yPos - 30 - row * 36;
    drawRect(page, bx, by, 108, 30, rgb(0.35, 0.35, 0.55), rgb(0.94, 0.94, 0.98));
    drawText(page, stat.label, bx + 4, by + 18, font, 7, rgb(0.35, 0.35, 0.55));
    drawText(page, stat.value, bx + 4, by + 6, boldFont, 12, rgb(0.1, 0.1, 0.1));
  });
  yPos -= 80;

  // Conditions row
  if (dailyState?.conditions && dailyState.conditions.length > 0) {
    drawText(page, `Conditions: ${dailyState.conditions.join(", ")}`, margin, yPos, font, 8, rgb(0.7, 0.2, 0.2));
    yPos -= 14;
  }

  // ---- SAVING THROWS ----
  const stColX = margin;
  drawSectionHeader(page, boldFont, stColX, yPos - 14, 160, "Saving Throws");
  yPos -= 16;

  const pb = proficiencyBonus(character.level);
  SAVING_THROWS.forEach((ability, i) => {
    const score = character.abilityScores[ability as keyof typeof character.abilityScores] ?? 10;
    const mod = abilityMod(score);
    // No saving throw proficiency data on character; show base mod
    const by = yPos - i * 13;
    page.drawCircle({ x: stColX + 6, y: by + 3, size: 4, borderColor: rgb(0.4, 0.4, 0.6), borderWidth: 0.75, color: rgb(0.92, 0.92, 0.95) });
    drawText(page, fmtMod(mod), stColX + 14, by, font, 8);
    drawText(page, ability, stColX + 30, by, font, 8, rgb(0.2, 0.2, 0.35));
    drawLine(page, stColX + 14, by - 1, stColX + 155, by - 1);
  });
  yPos -= 6 * 13 + 8;

  // ---- SKILLS ----
  drawSectionHeader(page, boldFont, stColX, yPos - 14, 160, "Skills");
  yPos -= 16;

  const permanentSkills = character.permanentSkills ?? [];
  ALL_SKILLS.forEach((skill, i) => {
    const ability = SKILL_ABILITY[skill]!;
    const score = character.abilityScores[ability as keyof typeof character.abilityScores] ?? 10;
    const baseMod = abilityMod(score);
    const isProficient = permanentSkills.includes(skill);
    const totalMod = baseMod + (isProficient ? pb : 0);
    const by = yPos - i * 11.5;
    if (by < 20) return;
    page.drawCircle({
      x: stColX + 6,
      y: by + 3,
      size: 4,
      borderColor: rgb(0.4, 0.4, 0.6),
      borderWidth: 0.75,
      color: isProficient ? rgb(0.35, 0.35, 0.65) : rgb(0.92, 0.92, 0.95),
    });
    drawText(page, fmtMod(totalMod), stColX + 14, by, font, 7.5);
    drawText(page, skill, stColX + 32, by, font, 7.5, rgb(0.2, 0.2, 0.35));
    drawLine(page, stColX + 14, by - 1, stColX + 155, by - 1, 0.3);
  });

  // ---- INVENTORY / EQUIPMENT (right column) ----
  const invX = margin + 190;
  let invY = height - 72;
  const invWidth = width - invX - margin;

  drawSectionHeader(page, boldFont, invX, invY - 14, invWidth, "Equipment & Inventory");
  invY -= 18;

  if (character.inventory && character.inventory.length > 0) {
    const equipped = character.inventory.filter((i) => i.isEquipped);
    const carried = character.inventory.filter((i) => !i.isEquipped);

    if (equipped.length > 0) {
      drawText(page, "Equipped", invX, invY, font, 8, rgb(0.35, 0.35, 0.55));
      invY -= 11;
      equipped.slice(0, 12).forEach((item) => {
        if (invY < 300) return;
        const qty = item.quantity > 1 ? ` (×${item.quantity})` : "";
        const magic = item.isMagic ? " *" : "";
        drawText(page, `• ${item.name}${qty}${magic}`, invX + 4, invY, font, 7.5);
        invY -= 10;
      });
      invY -= 4;
    }

    if (carried.length > 0) {
      drawText(page, "Carried", invX, invY, font, 8, rgb(0.35, 0.35, 0.55));
      invY -= 11;
      carried.slice(0, 15).forEach((item) => {
        if (invY < 250) return;
        const qty = item.quantity > 1 ? ` (×${item.quantity})` : "";
        drawText(page, `• ${item.name}${qty}`, invX + 4, invY, font, 7.5);
        invY -= 10;
      });
    }
  } else {
    drawText(page, "No items", invX + 4, invY, font, 8, rgb(0.5, 0.5, 0.5));
  }

  invY -= 14;

  // Currency
  drawSectionHeader(page, boldFont, invX, invY - 14, invWidth, "Currency");
  invY -= 18;
  const cur = character.currency;
  const currencyStr = [
    cur.pp ? `${cur.pp} pp` : null,
    cur.gp ? `${cur.gp} gp` : null,
    cur.ep ? `${cur.ep} ep` : null,
    cur.sp ? `${cur.sp} sp` : null,
    cur.cp ? `${cur.cp} cp` : null,
  ]
    .filter(Boolean)
    .join("  ");
  drawText(page, currencyStr || "0 gp", invX + 4, invY, font, 8);

  invY -= 20;

  // Spell slots
  if (dailyState?.spellSlots && Object.keys(dailyState.spellSlots).length > 0) {
    drawSectionHeader(page, boldFont, invX, invY - 14, invWidth, "Spell Slots");
    invY -= 18;
    Object.entries(dailyState.spellSlots).forEach(([level, tracker]) => {
      if (invY < 60) return;
      drawText(
        page,
        `Level ${level}: ${tracker.max - tracker.used}/${tracker.max} remaining`,
        invX + 4,
        invY,
        font,
        8
      );
      invY -= 11;
    });
  }

  invY -= 6;

  // Class resources
  if (dailyState?.classResources && Object.keys(dailyState.classResources).length > 0) {
    drawSectionHeader(page, boldFont, invX, invY - 14, invWidth, "Class Resources");
    invY -= 18;
    Object.entries(dailyState.classResources).forEach(([key, tracker]) => {
      if (invY < 40) return;
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      drawText(
        page,
        `${label}: ${tracker.max - tracker.used}/${tracker.max}`,
        invX + 4,
        invY,
        font,
        8
      );
      invY -= 11;
    });
  }

  // Footer
  drawLine(page, margin, 28, width - margin, 28);
  drawText(page, `${character.name} — The Fatebound`, margin, 16, font, 7, rgb(0.5, 0.5, 0.5));
  drawText(page, "Page 1", width - 60, 16, font, 7, rgb(0.5, 0.5, 0.5));
}

function drawPage2(
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  character: Character,
  dailyState?: DailyState
) {
  const { width, height } = page.getSize();
  const margin = 36;

  // ---- HEADER ----
  page.drawRectangle({ x: 0, y: height - 40, width, height: 40, color: rgb(0.12, 0.12, 0.22) });
  drawText(page, `${character.name} — Features & Description`, margin, height - 26, boldFont, 14, rgb(0.95, 0.9, 0.75));

  let yPos = height - 52;
  const colWidth = (width - margin * 2 - 20) / 2;

  // ---- LEFT COLUMN: Personality traits ----
  const leftX = margin;
  let leftY = yPos;

  const traits = [
    { label: "Personality Traits", value: character.personality },
    { label: "Ideals", value: character.ideals },
    { label: "Bonds", value: character.bonds },
    { label: "Flaws", value: character.flaws },
  ];

  traits.forEach(({ label, value }) => {
    if (!value || leftY < 100) return;
    drawSectionHeader(page, boldFont, leftX, leftY - 14, colWidth, label);
    leftY -= 18;
    if (value.trim()) {
      leftY = drawWrappedText(page, value.trim(), leftX + 4, leftY, font, 8, colWidth - 8, 11) - 4;
    } else {
      drawText(page, "—", leftX + 4, leftY, font, 8, rgb(0.5, 0.5, 0.5));
      leftY -= 13;
    }
    leftY -= 6;
  });

  // Appearance
  if (Object.keys(character.appearance).some((k) => (character.appearance as Record<string, string | undefined>)[k])) {
    drawSectionHeader(page, boldFont, leftX, leftY - 14, colWidth, "Appearance");
    leftY -= 18;
    const app = character.appearance;
    const appLines = [
      app.age ? `Age: ${app.age}` : null,
      app.height ? `Height: ${app.height}` : null,
      app.weight ? `Weight: ${app.weight}` : null,
      app.gender ? `Gender: ${app.gender}` : null,
      app.eyes ? `Eyes: ${app.eyes}` : null,
      app.hair ? `Hair: ${app.hair}` : null,
      app.skin ? `Skin: ${app.skin}` : null,
    ].filter(Boolean) as string[];
    appLines.forEach((line) => {
      if (leftY < 60) return;
      drawText(page, line, leftX + 4, leftY, font, 8);
      leftY -= 11;
    });
    leftY -= 6;
  }

  // ---- RIGHT COLUMN: Current Form / Features ----
  const rightX = margin + colWidth + 20;
  let rightY = yPos;

  // Current form info
  if (dailyState) {
    drawSectionHeader(page, boldFont, rightX, rightY - 14, colWidth, "Current Form");
    rightY -= 18;
    drawText(
      page,
      `Form Type: ${dailyState.formType === "CHAOS" ? "Chaos Form" : "Stabilized Form"}`,
      rightX + 4,
      rightY,
      font,
      8
    );
    rightY -= 11;
    drawText(page, `Date: ${dailyState.date}`, rightX + 4, rightY, font, 8);
    rightY -= 11;
    drawText(
      page,
      `Dawn Roll Outcome: ${dailyState.dawnRollOutcome}`,
      rightX + 4,
      rightY,
      font,
      8
    );
    rightY -= 11;

    if (dailyState.formType === "STABILIZED" && dailyState.stabilizedFormId) {
      drawText(page, `Form ID: ${dailyState.stabilizedFormId}`, rightX + 4, rightY, font, 8);
      rightY -= 11;
      if (dailyState.stabilizedSubclassId) {
        drawText(page, `Subclass: ${dailyState.stabilizedSubclassId}`, rightX + 4, rightY, font, 8);
        rightY -= 11;
      }
    } else if (dailyState.formType === "CHAOS") {
      if (dailyState.chaosTableA) {
        drawText(page, `Table A (Chassis) Roll: ${dailyState.chaosTableA.roll}`, rightX + 4, rightY, font, 8);
        rightY -= 11;
      }
      if (dailyState.chaosTableB) {
        drawText(page, `Table B (Primary Feature) Roll: ${dailyState.chaosTableB.roll}`, rightX + 4, rightY, font, 8);
        rightY -= 11;
      }
      if (dailyState.chaosTableC) {
        drawText(page, `Table C (Defensive Feature) Roll: ${dailyState.chaosTableC.roll}`, rightX + 4, rightY, font, 8);
        rightY -= 11;
      }
    }

    if (dailyState.abilitySwap) {
      drawText(
        page,
        `Ability Swap: ${dailyState.abilitySwap.score1} ↔ ${dailyState.abilitySwap.score2}`,
        rightX + 4,
        rightY,
        font,
        8,
        rgb(0.5, 0.2, 0.6)
      );
      rightY -= 11;
    }

    if (dailyState.conditions && dailyState.conditions.length > 0) {
      rightY -= 4;
      drawText(page, `Active Conditions: ${dailyState.conditions.join(", ")}`, rightX + 4, rightY, font, 8, rgb(0.7, 0.2, 0.2));
      rightY -= 11;
    }

    if (dailyState.inspiration) {
      drawText(page, "Inspiration: YES", rightX + 4, rightY, boldFont, 8, rgb(0.2, 0.6, 0.2));
      rightY -= 11;
    }

    if (dailyState.concentrationSpell) {
      drawText(page, `Concentrating: ${dailyState.concentrationSpell}`, rightX + 4, rightY, font, 8, rgb(0.3, 0.3, 0.7));
      rightY -= 11;
    }

    rightY -= 6;

    // Death saves
    if (
      dailyState.deathSaves.successes > 0 ||
      dailyState.deathSaves.failures > 0
    ) {
      drawSectionHeader(page, boldFont, rightX, rightY - 14, colWidth, "Death Saves");
      rightY -= 18;
      drawText(
        page,
        `Successes: ${dailyState.deathSaves.successes}/3   Failures: ${dailyState.deathSaves.failures}/3`,
        rightX + 4,
        rightY,
        font,
        8
      );
      rightY -= 16;
    }

    // Residual memory slots
    if (dailyState.residualMemorySlots && dailyState.residualMemorySlots.length > 0) {
      drawSectionHeader(page, boldFont, rightX, rightY - 14, colWidth, "Residual Memory");
      rightY -= 18;
      dailyState.residualMemorySlots.forEach((slot) => {
        if (rightY < 60) return;
        const slotStr = slot.name
          ? `• ${slot.name} (${slot.source})`
          : `• Empty slot`;
        drawText(page, slotStr, rightX + 4, rightY, font, 8);
        rightY -= 11;
      });
      rightY -= 6;
    }
  }

  // Backstory (full width at bottom)
  if (character.backstory && character.backstory.trim()) {
    const backstoryY = Math.min(leftY, rightY) - 10;
    if (backstoryY > 60) {
      drawSectionHeader(page, boldFont, leftX, backstoryY - 14, width - margin * 2, "Backstory");
      drawWrappedText(
        page,
        character.backstory.trim(),
        leftX + 4,
        backstoryY - 20,
        font,
        8,
        width - margin * 2 - 8,
        11
      );
    }
  }

  // Notes
  if (character.notes && character.notes.trim()) {
    const notesY = Math.min(leftY, rightY) - 80;
    if (notesY > 40) {
      drawSectionHeader(page, boldFont, leftX, notesY - 14, width - margin * 2, "Notes");
      drawWrappedText(
        page,
        character.notes.trim(),
        leftX + 4,
        notesY - 20,
        font,
        8,
        width - margin * 2 - 8,
        11
      );
    }
  }

  // Footer
  drawLine(page, margin, 28, width - margin, 28);
  drawText(page, `${character.name} — The Fatebound`, margin, 16, font, 7, rgb(0.5, 0.5, 0.5));
  drawText(page, "Page 2", width - 60, 16, font, 7, rgb(0.5, 0.5, 0.5));
}

export async function generateCharacterPDF(
  character: Character,
  dailyState?: DailyState
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Core Stats
  const page1 = doc.addPage([612, 792]); // Letter size
  drawPage1(page1, font, boldFont, character, dailyState);

  // Page 2: Features + Description
  const page2 = doc.addPage([612, 792]);
  drawPage2(page2, font, boldFont, character, dailyState);

  return doc.save();
}
