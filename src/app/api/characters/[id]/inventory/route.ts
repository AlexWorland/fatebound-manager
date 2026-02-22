import { NextRequest, NextResponse } from "next/server";
import { getCharacterById, updateCharacter } from "@/lib/characters";
import type { InventoryItem } from "@/types/character";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = getCharacterById(id);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }
    return NextResponse.json(character.inventory);
  } catch (error) {
    console.error("GET /api/characters/[id]/inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const character = getCharacterById(id);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    const body = await request.json();
    const inventory = body.inventory as InventoryItem[];

    const updated = updateCharacter(id, { inventory });
    if (!updated) {
      return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
    }
    return NextResponse.json(updated.inventory);
  } catch (error) {
    console.error("PUT /api/characters/[id]/inventory error:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
