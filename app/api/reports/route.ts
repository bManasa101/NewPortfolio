import { NextResponse } from "next/server";
import { getReports, addReport } from "@/lib/reports-db";

export async function GET() {
  try {
    const reports = await getReports();
    return NextResponse.json(reports);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load reports" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const report = await req.json();
    await addReport(report);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add report" }, { status: 500 });
  }
}