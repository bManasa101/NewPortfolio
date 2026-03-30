// components/Research.tsx
"use client";
import { useState } from "react";
import { useReports } from "@/lib/useReports";
import { ResearchCard } from "@/components/ResearchCard";

export default function Research() {
  const { reports, ready } = useReports();
  const [active, setActive] = useState("All");

  const sectors = ["All", ...Array.from(new Set(reports.map(r => r.sector)))];
  const filtered = active === "All" ? reports : reports.filter(r => r.sector === active);

  return (
    <section id="research" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">

        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> Research
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 300, letterSpacing: "-0.02em" }}>
            <strong style={{ fontWeight: 600 }}>Selected</strong> Reports
          </h2>
          {/* Sector filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setActive(s)}
                style={{
                  background: active === s ? "var(--gold)" : "none",
                  color: active === s ? "#080a0f" : "var(--muted)",
                  border: `1px solid ${active === s ? "var(--gold)" : "var(--faint)"}`,
                  padding: "0.35rem 0.9rem",
                  borderRadius: 2,
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: active === s ? 700 : 400,
                  transition: "all 0.18s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {!ready ? (
          <div style={{ color: "var(--muted)" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "var(--muted)", fontSize: "0.9rem", padding: "2rem 0" }}>No reports in this sector.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(r => <ResearchCard key={r.slug} r={r} />)}
          </div>
        )}
      </div>
    </section>
  );
}