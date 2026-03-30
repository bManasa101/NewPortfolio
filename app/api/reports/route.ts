// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readReports, writeReports, Report } from "@/lib/reports-store";

// Force dynamic — never cache this route
export const dynamic = "force-dynamic";

function validateReport(r: any): string | null {
  if (!r.slug || typeof r.slug !== "string") return "Invalid slug";
  if (!r.title) return "Title is required";
  return null;
}

// GET all reports
export async function GET() {
  try {
    const reports = await readReports();
    return NextResponse.json(reports);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

// POST — create new report
export async function POST(req: NextRequest) {
  try {
    const report: Report = await req.json();

    const error = validateReport(report);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const reports = await readReports();

    // Remove any existing report with same slug (upsert behaviour)
    const filtered = reports.filter(r => r.slug !== report.slug);
    await writeReports([...filtered, report]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}