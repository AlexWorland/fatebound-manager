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
      abilityScores,
      permanentSkills,
      background,
      personality,
      ideals,
      bonds,
      flaws,
      alignment,
      backstory,
      appearance,
    } = body as {
      name: string;
      abilityScores: Character["abilityScores"];
      permanentSkills: [string, string];
      background: string;
      personality?: string;
      ideals?: string;
      bonds?: string;
      flaws?: string;
      alignment?: string;
      backstory?: string;
      appearance?: Character["appearance"];
    };

    if (!name || !abilityScores || !permanentSkills) {
      return NextResponse.json(
        { error: "Missing required fields: name, abilityScores, permanentSkills" },
        { status: 400 }
      );
    }

    const character = createCharacter({
      name,
      level: 1,
      abilityScores,
      permanentSkills,
      permanentMemorySlot: null,
      asiChoices: [],
      background: background ?? "",
      inventory: [],
      currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      notes: "",
      ddbCharacterId: null,
      ddbSyncSettings: null,
      personality: personality ?? "",
      ideals: ideals ?? "",
      bonds: bonds ?? "",
      flaws: flaws ?? "",
      backstory: backstory ?? "",
      alignment: alignment ?? "",
      appearance: appearance ?? {},
      portraitUrl: null,
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
