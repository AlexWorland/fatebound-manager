import { NextRequest, NextResponse } from "next/server";
import { getSessionNotes, createSessionNote } from "@/lib/session-notes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notes = getSessionNotes(id);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/characters/[id]/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { title, content, tags } = body as {
      title: string;
      content?: string;
      tags?: string[];
    };

    if (!title) {
      return NextResponse.json(
        { error: "Missing required field: title" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const note = createSessionNote({
      characterId: id,
      date: today,
      title,
      content: content ?? "",
      tags: tags ?? [],
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/characters/[id]/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create session note" },
      { status: 500 }
    );
  }
}
