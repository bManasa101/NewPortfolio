import { put, head } from "@vercel/blob";

export type WeeklyEntry = {
  id: string;
  week: string;
  reading: string;
  macro: string;
  tracking: string;
  thesis: string;
  weeklyNote: string;
  createdAt: number;
};

const BLOB_NAME = "weekly.json";

async function getBlobUrl(): Promise<string | null> {
  try {
    const result = await head(BLOB_NAME);
    return result.url;
  } catch {
    return null;
  }
}

export async function writeWeekly(entries: WeeklyEntry[]): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(entries, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function readWeekly(): Promise<WeeklyEntry[]> {
  try {
    const url = await getBlobUrl();
    if (!url) return [];

    const res = await fetch(`${url}?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
    if (!res.ok) return [];

    const raw = await res.json();
    if (!Array.isArray(raw)) return [];

    return raw.map((e: any): WeeklyEntry => ({
      id:         e?.id         || String(Date.now()),
      week:       e?.week       || "",
      reading:    e?.reading    || "",
      macro:      e?.macro      || "",
      tracking:   e?.tracking   || "",
      thesis:     e?.thesis     || "",
      weeklyNote: e?.weeklyNote || "",
      createdAt:  e?.createdAt  || 0,
    }));
  } catch (err) {
    console.error("readWeekly error:", err);
    return [];
  }
}