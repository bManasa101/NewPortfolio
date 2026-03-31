import { NextRequest, NextResponse } from "next/server";
import { readWeekly, writeWeekly, WeeklyEntry } from "@/lib/weekly-store";

export const dynamic = "force-dynamic";

// PUT — update entry
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated: WeeklyEntry = await req.json();

    const entries = await readWeekly();
    await writeWeekly(entries.map(e => e.id === id ? { ...updated, id } : e));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT weekly error:", err);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

// DELETE — remove entry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const entries = await readWeekly();
    await writeWeekly(entries.filter(e => e.id !== id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE weekly error:", err);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}