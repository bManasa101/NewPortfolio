"use client";

import { useEffect, useState } from "react";
import { Report } from "@/lib/reports-store";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/reports", { cache: "no-store" });
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setReports([]);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addReport(r: Report) {
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    });
    await load();
  }

  async function updateReport(slug: string, r: Report) {
    await fetch(`/api/reports/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    });
    await load();
  }

  async function deleteReport(slug: string) {
    await fetch(`/api/reports/${slug}`, { method: "DELETE" });
    await load();
  }

  return { reports, ready, addReport, updateReport, deleteReport };
}