import { NextRequest, NextResponse } from "next/server";
import { getCharacterById } from "@/lib/characters";
import { getDailyState } from "@/lib/daily-states";
import { generateCharacterPDF } from "@/engine/pdf-export";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = getCharacterById(id);
    if (!character) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const today = new Date().toISOString().split("T")[0];
    const dailyState = getDailyState(id, today);

    const pdfBytes = await generateCharacterPDF(character, dailyState ?? undefined);
    const buffer = Buffer.from(pdfBytes);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${character.name.replace(/[^a-zA-Z0-9]/g, "_")}-sheet.pdf"`,
      },
    });
  } catch (error) {
    console.error("GET /api/characters/[id]/export error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
