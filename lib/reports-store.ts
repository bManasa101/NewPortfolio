// lib/reports-store.ts
import { put, list } from "@vercel/blob";

export type SupportingFile = {
  name: string;
  url: string;
  type?: string;
  size?: number;
};

export type ReportSection = {
  thesis: string;
  keyFinancials: string[];
  risks: string[];
  conclusion: string;
};

export type Report = {
  slug: string;
  ticker: string;
  sector: string;
  tags: string[];
  rec: "Buy" | "Hold" | "Sell" | null;
  title: string;
  desc: string;
  excerpt: string;
  date: string;
  detail: ReportSection;
  supportingFiles?: SupportingFile[];
};

const BLOB_NAME = "reports.json";

// ── Sanitise incoming data ────────────────────────────────────────────────────
function sanitizeReport(r: any): Report {
  return {
    slug:    r?.slug    || "",
    ticker:  r?.ticker  || "",
    sector:  r?.sector  || "",
    tags:    Array.isArray(r?.tags) ? r.tags : [],
    rec:     ["Buy", "Hold", "Sell"].includes(r?.rec) ? r.rec : null,
    title:   r?.title   || "",
    desc:    r?.desc    || "",
    excerpt: r?.excerpt || "",
    date:    r?.date    || "",
    detail: {
      thesis:         r?.detail?.thesis       || "",
      keyFinancials:  Array.isArray(r?.detail?.keyFinancials) ? r.detail.keyFinancials.map(String) : [],
      risks:          Array.isArray(r?.detail?.risks)          ? r.detail.risks.map(String)         : [],
      conclusion:     r?.detail?.conclusion   || "",
    },
    supportingFiles: Array.isArray(r?.supportingFiles)
      ? r.supportingFiles.map((f: any) => ({
          name: f?.name || "File",
          url:  f?.url  || "#",
          type: f?.type,
          size: f?.size,
        }))
      : [],
  };
}

// ── Blob helpers ──────────────────────────────────────────────────────────────
async function getBlobUrl(): Promise<string | null> {
  try {
    const blobs = await list();
    const file = blobs.blobs.find(b => b.pathname === BLOB_NAME);
    return file?.url || null;
  } catch {
    return null;
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────
export async function readReports(): Promise<Report[]> {
  try {
    const url = await getBlobUrl();
    if (!url) return [];

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(sanitizeReport);
  } catch {
    return [];
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────
export async function writeReports(reports: Report[]) {
  await put(BLOB_NAME, JSON.stringify(reports, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}