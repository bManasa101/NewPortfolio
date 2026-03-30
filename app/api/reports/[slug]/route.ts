// app/api/reports/[slug]/route.ts
import { NextResponse } from "next/server";
import { updateReport, deleteReport } from "@/lib/reports-db";

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const report = await req.json();
  await updateReport(params.slug, report);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  await deleteReport(params.slug);
  return NextResponse.json({ ok: true });
}