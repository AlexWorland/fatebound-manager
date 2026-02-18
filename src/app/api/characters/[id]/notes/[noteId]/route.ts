import { NextRequest, NextResponse } from "next/server";
import { updateSessionNote, deleteSessionNote } from "@/lib/session-notes";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { noteId } = await params;
    const body = await request.json();
    const updated = updateSessionNote(noteId, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Session note not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/characters/[id]/notes/[noteId] error:", error);
    return NextResponse.json(
      { error: "Failed to update session note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  try {
    const { noteId } = await params;
    deleteSessionNote(noteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/characters/[id]/notes/[noteId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete session note" },
      { status: 500 }
    );
  }
}
