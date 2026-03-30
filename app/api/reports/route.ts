import { NextRequest, NextResponse } from "next/server";
import { readReports, writeReports, Report } from "@/lib/reports-store";

// ✅ VALIDATION FUNCTION
function validateReport(r: any): string | null {
  if (!r.slug || typeof r.slug !== "string") return "Invalid slug";
  if (!r.title) return "Title is required";
  return null;
}

// ✅ GET
export async function GET() {
  const reports = await readReports();
  return NextResponse.json(reports);
}

// ✅ POST (CREATE)
export async function POST(req: NextRequest) {
  try {
    const report: Report = await req.json();

    // 🔥 VALIDATE
    const error = validateReport(report);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const reports = await readReports();

    // remove duplicate slug
    const filtered = reports.filter(r => r.slug !== report.slug);

    const updated = [...filtered, report];

    await writeReports(updated);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}