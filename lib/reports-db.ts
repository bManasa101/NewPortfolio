// lib/reports-db.ts
import { put, del, list, head } from "@vercel/blob";
import { Report, defaultReports } from "./reports-store";

const REPORTS_FILE = "reports.json";

async function getBlobUrl() {
  try {
    const res = await head(REPORTS_FILE);
    return res.url;
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
  await put(REPORTS_FILE, JSON.stringify(reports, null, 2), {
    access: "public",
    contentType: "application/json",
  });
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