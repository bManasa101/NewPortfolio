import { useEffect, useState } from "react";
import { Report } from "./reports-store";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);

  async function load() {
  try {
    const res = await fetch("/api/reports");

    if (!res.ok) {
      throw new Error("API failed");
    }

    const text = await res.text();

    if (!text) {
      console.warn("API returned empty body");
      setReports([]);
      setReady(true);
      return;
    }

    const data = JSON.parse(text);
    setReports(data);
  } catch (err) {
    console.error("Failed to load reports:", err);
    setReports([]);
  } finally {
    setReady(true);
  }
}

  useEffect(() => { load(); }, []);

  async function addReport(r: Report) {
    await fetch("/api/reports", {
      method: "POST",
      body: JSON.stringify(r),
    });
    load();
  }

  async function updateReport(slug: string, r: Report) {
    await fetch(`/api/reports/${slug}`, {
      method: "PUT",
      body: JSON.stringify(r),
    });
    load();
  }

  async function deleteReport(slug: string) {
    await fetch(`/api/reports/${slug}`, {
      method: "DELETE",
    });
    load();
  }

  return { reports, ready, addReport, updateReport, deleteReport };
}