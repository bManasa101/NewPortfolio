import { NextRequest, NextResponse } from "next/server";
import { readReports, writeReports, Report } from "@/lib/reports-store";

function validateReport(r: any): string | null {
  if (!r.slug || typeof r.slug !== "string") return "Invalid slug";
  if (!r.title) return "Title is required";
  return null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const updatedReport: Report = await req.json();

    const error = validateReport(updatedReport);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const reports = await readReports();
    await writeReports(reports.map(r => r.slug === slug ? updatedReport : r));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const reports = await readReports();
    await writeReports(reports.filter(r => r.slug !== slug));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}