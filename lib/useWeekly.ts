"use client";

import { useEffect, useState, useCallback } from "react";
import { WeeklyEntry } from "@/lib/weekly-store";

const PROPAGATION_DELAY_MS = 1000;

export function useWeekly() {
  const [entries, setEntries] = useState<WeeklyEntry[]>([]);
  const [ready,   setReady]   = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weekly?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("useWeekly load error:", err);
    } finally {
      setReady(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Add — optimistic: prepend immediately, confirm in background ──────────
  async function addEntry(e: WeeklyEntry) {
    const newEntry: WeeklyEntry = {
      ...e,
      id: e.id || `weekly-${Date.now()}`,
      createdAt: e.createdAt || Date.now(),
    };

    // Optimistic update — show instantly, sorted newest first
    setEntries(prev => [newEntry, ...prev]);

    try {
      const res = await fetch("/api/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add entry");
      }
      // Background re-fetch to confirm blob truth
      await new Promise(r => setTimeout(r, PROPAGATION_DELAY_MS));
      await load();
    } catch (err) {
      // Roll back optimistic update on failure
      setEntries(prev => prev.filter(x => x.id !== newEntry.id));
      console.error("addEntry error:", err);
      alert(err instanceof Error ? err.message : "Failed to save entry");
      throw err;
    }
  }

  // ── Update — optimistic: swap immediately, confirm in background ──────────
  async function updateEntry(id: string, e: WeeklyEntry) {
    setEntries(prev => prev.map(x => x.id === id ? { ...e, id } : x));

    try {
      const res = await fetch(`/api/weekly/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update entry");
      }
      await new Promise(r => setTimeout(r, PROPAGATION_DELAY_MS));
      await load();
    } catch (err) {
      console.error("updateEntry error:", err);
      alert(err instanceof Error ? err.message : "Failed to update entry");
      await load(); // re-fetch to restore truth
      throw err;
    }
  }

  // ── Delete — optimistic: remove immediately, confirm in background ────────
  async function deleteEntry(id: string) {
    const snapshot = entries; // keep for rollback
    setEntries(prev => prev.filter(x => x.id !== id));

    try {
      const res = await fetch(`/api/weekly/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete entry");
      }
      await new Promise(r => setTimeout(r, PROPAGATION_DELAY_MS));
      await load();
    } catch (err) {
      setEntries(snapshot); // roll back
      console.error("deleteEntry error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete entry");
      throw err;
    }
  }

  return { entries, ready, loading, addEntry, updateEntry, deleteEntry };
}