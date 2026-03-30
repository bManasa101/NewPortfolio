import { put, head } from "@vercel/blob";

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

function sanitizeReport(r: any): Report {
  let keyFinancials: string[] = [];
  if (Array.isArray(r?.detail?.keyFinancials)) {
    keyFinancials = r.detail.keyFinancials.map((item: any) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && item.label !== undefined) {
        return `${item.label}: ${item.value}`;
      }
      return String(item);
    });
  }

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
      thesis:        r?.detail?.thesis     || "",
      keyFinancials,
      risks: Array.isArray(r?.detail?.risks)
        ? r.detail.risks.map((item: any) =>
            typeof item === "string" ? item
            : item && typeof item === "object" && item.label
              ? `${item.label}: ${item.value}`
              : String(item)
          )
        : [],
      conclusion: r?.detail?.conclusion || "",
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

function needsMigration(raw: any[]): boolean {
  if (raw.length === 0) return false;
  const first = raw[0];
  return (
    !Array.isArray(first?.tags) ||
    first?.excerpt === undefined ||
    (Array.isArray(first?.detail?.keyFinancials) &&
      first.detail.keyFinancials.length > 0 &&
      typeof first.detail.keyFinancials[0] === "object")
  );
}

async function getBlobUrl(): Promise<string | null> {
  try {
    const result = await head(BLOB_NAME);
    return result.url;
  } catch {
    return null;
  }
}

export async function writeReports(reports: Report[]): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(reports, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function readReports(): Promise<Report[]> {
  try {
    const url = await getBlobUrl();
    if (!url) return [];

    // ✅ FIX: Append cache-buster so Vercel CDN never serves stale blob content
    const cacheBustedUrl = `${url}?t=${Date.now()}`;

    const res = await fetch(cacheBustedUrl, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
    if (!res.ok) return [];

    const raw = await res.json();
    if (!Array.isArray(raw)) return [];

    const sanitized = raw.map(sanitizeReport);

    if (needsMigration(raw)) {
      console.log("reports-store: migrating stale blob to new schema");
      writeReports(sanitized).catch(e =>
        console.error("reports-store: migration write failed:", e)
      );
    }

    return sanitized;
  } catch (err) {
    console.error("readReports error:", err);
    return [];
  }
}