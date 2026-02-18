import { NextResponse } from "next/server";
import { getCharacterById, updateCharacter } from "@/lib/characters";
import { getCurrentDailyState } from "@/lib/daily-states";
import { generateFullSync, importFromDDB } from "@/integrations/ddb-sync";
import type { DDBCharacterData } from "@/integrations/ddb-sync";

/**
 * POST /api/characters/[id]/ddb-sync
 *
 * Generates sync payloads for the character's current state.
 * Body (optional): { currentDDBConditions?: string[] }
 *
 * Returns: SyncResult { calls, skipped, errors }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = getCharacterById(id);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const currentDDBConditions = (body as { currentDDBConditions?: string[] })
      .currentDDBConditions ?? [];

    const dailyState = getCurrentDailyState(id);
    const result = generateFullSync(character, dailyState, currentDDBConditions);

    // Update lastSyncedAt if sync produced any calls
    if (result.calls.length > 0 && character.ddbSyncSettings) {
      updateCharacter(id, {
        ddbSyncSettings: {
          ...character.ddbSyncSettings,
          lastSyncedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/characters/[id]/ddb-sync error:", error);
    return NextResponse.json(
      { error: "Failed to generate sync payloads" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/characters/[id]/ddb-sync
 *
 * Imports character data from D&D Beyond.
 * Body: DDBCharacterData (from get_character MCP tool output)
 *
 * Returns: updated Character
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = getCharacterById(id);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    const ddbData = (await request.json()) as DDBCharacterData;
    const imported = importFromDDB(ddbData);

    const updated = updateCharacter(id, imported);
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update character" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      character: updated,
      fieldsImported: Object.keys(imported),
    });
  } catch (error) {
    console.error("PUT /api/characters/[id]/ddb-sync error:", error);
    return NextResponse.json(
      { error: "Failed to import from D&D Beyond" },
      { status: 500 }
    );
  }
}
