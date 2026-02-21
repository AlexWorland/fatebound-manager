import { NextResponse } from "next/server";
import {
  getAllCharacters,
  createCharacter,
} from "@/lib/characters";
import type { Character } from "@/types/character";

export async function GET() {
  try {
    const characters = getAllCharacters();
    return NextResponse.json(characters);
  } catch (error) {
    console.error("GET /api/characters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      level,
      abilityScores,
      permanentSkills,
      background,
      inventory,
      equippedWeapons,
      currency,
      notes,
      ddbCharacterId,
      ddbSyncSettings,
    } = body as {
      name: string;
      level?: number;
      abilityScores: Character["abilityScores"];
      permanentSkills: [string, string];
      background: string;
      inventory?: Character["inventory"];
      equippedWeapons?: Character["equippedWeapons"];
      currency?: Character["currency"];
      notes?: string;
      ddbCharacterId?: string;
      ddbSyncSettings?: Character["ddbSyncSettings"];
    };

    if (!name || !abilityScores || !permanentSkills) {
      return NextResponse.json(
        { error: "Missing required fields: name, abilityScores, permanentSkills" },
        { status: 400 }
      );
    }

    const startingLevel = Math.max(1, Math.min(20, Math.floor(level ?? 1)));

    const character = createCharacter({
      name,
      level: startingLevel,
      abilityScores,
      permanentSkills,
      permanentMemorySlot: null,
      asiChoices: [],
      background: background ?? "",
      inventory: inventory ?? [],
      equippedWeapons: equippedWeapons ?? [],
      currency: currency ?? { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      notes: notes ?? "",
      ddbCharacterId: ddbCharacterId ?? null,
      ddbSyncSettings: ddbSyncSettings ?? null,
    });

    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error("POST /api/characters error:", error);
    return NextResponse.json(
      { error: "Failed to create character" },
      { status: 500 }
    );
  }
}
