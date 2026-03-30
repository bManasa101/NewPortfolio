// lib/useReports.ts
"use client";

import { useEffect, useState } from "react";
import { Report } from "@/lib/reports-store";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);

  async function load() {
    try {
      // Cache-bust with timestamp so browser never serves a stale response
      const res = await fetch(`/api/reports?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("useReports load error:", err);
      setReports([]);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addReport(r: Report) {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add report");
      }
    } catch (err) {
      console.error("addReport error:", err);
      alert(err instanceof Error ? err.message : "Failed to save report");
    }
    await load();
  }

  async function updateReport(slug: string, r: Report) {
    try {
      const res = await fetch(`/api/reports/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update report");
      }
    } catch (err) {
      console.error("updateReport error:", err);
      alert(err instanceof Error ? err.message : "Failed to update report");
    }
    await load();
  }

  async function deleteReport(slug: string) {
    try {
      const res = await fetch(`/api/reports/${slug}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete report");
      }
    } catch (err) {
      console.error("deleteReport error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete report");
    }
    await load();
  }

  return { reports, ready, addReport, updateReport, deleteReport };
}