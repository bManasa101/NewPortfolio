"use client";

import { useEffect, useState, useCallback } from "react";
import { Report } from "@/lib/reports-store";

const PROPAGATION_DELAY_MS = 600;

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      await new Promise(resolve => setTimeout(resolve, PROPAGATION_DELAY_MS));
      await load();
    } catch (err) {
      console.error("addReport error:", err);
      alert(err instanceof Error ? err.message : "Failed to save report");
      throw err;
    }
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
      await new Promise(resolve => setTimeout(resolve, PROPAGATION_DELAY_MS));
      await load();
    } catch (err) {
      console.error("updateReport error:", err);
      alert(err instanceof Error ? err.message : "Failed to update report");
      throw err;
    }
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
      await new Promise(resolve => setTimeout(resolve, PROPAGATION_DELAY_MS));
      await load();
    } catch (err) {
      console.error("deleteReport error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete report");
      throw err;
    }
  }

  return { reports, ready, loading, addReport, updateReport, deleteReport };
}