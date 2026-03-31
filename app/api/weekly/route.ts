import { NextRequest, NextResponse } from "next/server";
import { readWeekly, writeWeekly, WeeklyEntry } from "@/lib/weekly-store";

export const dynamic = "force-dynamic";

// GET — all entries, sorted newest first
export async function GET() {
  try {
    const entries = await readWeekly();
    const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json(sorted);
  } catch (err) {
    console.error("GET weekly error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

// POST — create new entry
export async function POST(req: NextRequest) {
  try {
    const body: WeeklyEntry = await req.json();
    if (!body.week?.trim()) {
      return NextResponse.json({ error: "Week label is required" }, { status: 400 });
    }

    const entry: WeeklyEntry = {
      ...body,
      id: body.id || `weekly-${Date.now()}`,
      createdAt: body.createdAt || Date.now(),
    };

    const entries = await readWeekly();
    await writeWeekly([entry, ...entries]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST weekly error:", err);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}