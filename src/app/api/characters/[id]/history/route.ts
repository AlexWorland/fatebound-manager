import { NextRequest, NextResponse } from "next/server";
import { getFormHistory } from "@/lib/form-history";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const history = getFormHistory(id, limit);
    return NextResponse.json(history);
  } catch (error) {
    console.error("GET /api/characters/[id]/history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch form history" },
      { status: 500 }
    );
  }
}
