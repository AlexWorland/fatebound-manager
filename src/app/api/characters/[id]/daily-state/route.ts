import { NextRequest, NextResponse } from "next/server";
import { getCurrentDailyState, updateDailyState } from "@/lib/daily-states";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dailyState = getCurrentDailyState(id);
    if (!dailyState) {
      return NextResponse.json(
        { error: "No daily state found for today" },
        { status: 404 }
      );
    }
    return NextResponse.json(dailyState);
  } catch (error) {
    console.error("GET /api/characters/[id]/daily-state error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily state" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dailyState = getCurrentDailyState(id);
    if (!dailyState) {
      return NextResponse.json(
        { error: "No daily state found for today" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updated = updateDailyState(dailyState.id, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update daily state" },
        { status: 500 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/characters/[id]/daily-state error:", error);
    return NextResponse.json(
      { error: "Failed to update daily state" },
      { status: 500 }
    );
  }
}
