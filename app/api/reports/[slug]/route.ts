import { NextRequest, NextResponse } from "next/server";
import { readReports, writeReports, Report } from "@/lib/reports-store";

// ✅ VALIDATION
function validateReport(r: any): string | null {
  if (!r.slug || typeof r.slug !== "string") return "Invalid slug";
  if (!r.title) return "Title is required";
  return null;
}

// ✅ UPDATE
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const updatedReport: Report = await req.json();

    const error = validateReport(updatedReport);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const reports = await readReports();

    const updated = reports.map(r =>
      r.slug === slug ? updatedReport : r
    );

    await writeReports(updated);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

// ✅ DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const reports = await readReports();

    const updated = reports.filter(r => r.slug !== slug);

    await writeReports(updated);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}