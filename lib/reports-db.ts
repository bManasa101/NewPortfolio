// lib/reports-db.ts
import { put, del, list, head } from "@vercel/blob";
import { Report } from "./reports-store";

const REPORTS_FILE = "reports.json";
const blobConfig = {
  token: process.env.BLOB_READ_WRITE_TOKEN,
};
async function getBlobUrl() {
  try {
    const res = await head("reports.json", blobConfig);
    return res.url + `?token=${process.env.BLOB_READ_WRITE_TOKEN}`;
  } catch {
    return null;
  }
}

// Get all reports
export async function getReports(): Promise<Report[]> {
  const url = await getBlobUrl();

  // First deploy → seed database
  if (!url) {
    await saveReports(defaultReports);
    return defaultReports;
  }

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Blob fetch failed:", res.status);
      return [];
    }

    const text = await res.text();

    // 🔴 THIS FIXES YOUR ERROR
    if (!text) {
      console.warn("Blob returned empty file. Re-seeding.");
      await saveReports(defaultReports);
      return defaultReports;
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("getReports crash:", err);
    return [];
  }
}

// Save entire DB
export async function saveReports(reports: Report[]) {
  await put(
    "reports.json",
    JSON.stringify(reports, null, 2),
    {
        access: "public",
      contentType: "application/json",
      ...blobConfig,   // ⭐ REQUIRED FOR LOCAL DEV
    }
  );
}

// CRUD helpers
export async function addReport(report: Report) {
  const reports = await getReports();
  reports.unshift(report);
  await saveReports(reports);
}

export async function updateReport(slug: string, updated: Report) {
  const reports = await getReports();
  const newReports = reports.map(r => r.slug === slug ? updated : r);
  await saveReports(newReports);
}

export async function deleteReport(slug: string) {
  const reports = await getReports();
  await saveReports(reports.filter(r => r.slug !== slug));
}

export const defaultReports: Report[] = [
  {
    slug: "sample-report",
    ticker: "AAPL",
    sector: "Technology",
    tags: ["Large Cap", "Growth"],
    rec: "Buy",
    title: "Apple Inc. Analysis",
    desc: "Strong ecosystem and recurring revenue",
    excerpt: "Apple continues to dominate...",
    date: "2025-01-01",
    detail: {
      thesis: "Strong moat with services growth",
      keyFinancials: ["Revenue growth 8%", "Margins 30%"],
      risks: ["China exposure", "Regulation"],
      conclusion: "Long-term buy",
    },
    supportingFiles: [],
  },
];