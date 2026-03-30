// lib/useReports.ts
"use client";
import { useState, useEffect } from "react";
import { type Report, defaultReports } from "./reports-store";

const STORAGE_KEY = "manasa_reports";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setReports(saved ? JSON.parse(saved) : defaultReports);
    } catch {
      setReports(defaultReports);
    }
    setReady(true);
  }, []);

  const persist = (next: Report[]) => {
    setReports(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addReport = (r: Report) => persist([...reports, r]);

  const updateReport = (slug: string, r: Report) =>
    persist(reports.map((x) => (x.slug === slug ? r : x)));

  const deleteReport = (slug: string) =>
    persist(reports.filter((x) => x.slug !== slug));

  return { reports, ready, addReport, updateReport, deleteReport };
}