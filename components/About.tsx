"use client";

import { useState } from "react";
import { useWeekly } from "@/lib/useWeekly";
import { WeeklyEntry } from "@/lib/weekly-store";

const FALLBACK: WeeklyEntry[] = [
  {
    id: "fallback-1",
    week: "Week of 28 Jun 2025",
    reading: "One Up on Wall Street / Beating the Street — Peter Lynch",
    macro: "RBI on hold; watching US Fed commentary for rate trajectory signals into H2.",
    tracking: "India Financial Sector — credit growth, NIM compression, deposit wars.",
    thesis: "Banks — HDFC Bank model in progress, expected soon.",
    weeklyNote: "Dissecting the divergence between private and PSU bank valuations post the merger cycle.",
    createdAt: 1719532800000,
  },
];

export default function About() {
  const { entries, ready } = useWeekly();
  const [idx, setIdx] = useState(0);

  const data  = ready && entries.length > 0 ? entries : FALLBACK;
  const total = data.length;
  // clamp in case data shrinks between renders
  const safeIdx = Math.min(idx, total - 1);
  const entry   = data[safeIdx];

  const canPrev = safeIdx > 0;           // ← newer (closer to index 0)
  const canNext = safeIdx < total - 1;   // → older (higher index)

  return (
    <section id="about" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">

        {/* Section label */}
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} />
          About
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-start">

          {/* ── Left: Bio ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
              "I'm a finance professional spanning institutional equity sales, ERP consulting, and engineering research. Currently at Axis Capital's Institutional Equities division, I manage relationships with some of India's most sophisticated buy-side institutions — PMS firms, Category III AIFs, insurance companies, and pension funds, sitting at the exact interface where sell-side research meets capital allocation decisions.",
              "I hold a PGDM in Finance from SPJIMR and a B.E. in Electrical & Electronics Engineering from BMS College of Engineering (9.21 CGPA), and have cleared CFA Levels I and II on the first attempt, scoring 90%+ in Quantitative Methods. I also hold a NISM Research Analyst certification (Series XV).",
              "My research work spans corporate valuation (DCF and relative analysis on Bharti Airtel), IPO analysis (Tata Tech), primary data analysis for SEBI's Consultation Paper on Index Derivatives, and portfolio construction using Modern Portfolio Theory. Before finance, I built financial systems at Deloitte and KPMG, reducing processing time by 70% through automation and onboarding a $28M US banking entity into Workday Financials.",
            ].map((p, i) => (
              <p key={i} style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.9 }}>{p}</p>
            ))}
          </div>

          {/* ── Right: Carousel + Quote ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Card */}
            <div style={{
              background: "var(--bg2)",
              border: "1px solid rgba(200,169,110,0.15)",
              borderLeft: "3px solid var(--gold)",
              borderRadius: 8,
              padding: "1.8rem",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Decorative quote mark */}
              <span style={{
                position: "absolute", top: -10, left: 16,
                fontSize: "6rem", color: "rgba(200,169,110,0.06)",
                fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none",
              }}>"</span>

              {/* ── Card header ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.4rem", position: "relative" }}>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.04em" }}>
                    Thinking About
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 3, letterSpacing: "0.04em" }}>
                    {!ready ? "Loading…" : entry.week}
                  </div>
                </div>

                {/* Arrows — always rendered so layout is stable */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

                  {/* ← Newer */}
                  <button
                    onClick={() => setIdx(i => Math.max(i - 1, 0))}
                    disabled={!canPrev}
                    aria-label="Newer entry"
                    style={{
                      background: "none",
                      border: `1px solid ${canPrev ? "rgba(200,169,110,0.4)" : "var(--faint)"}`,
                      color: canPrev ? "var(--gold)" : "var(--faint)",
                      width: 30, height: 30, borderRadius: 3,
                      cursor: canPrev ? "pointer" : "default",
                      fontSize: "1rem", lineHeight: 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.2s, color 0.2s",
                      fontFamily: "inherit",
                      flexShrink: 0,
                    }}
                  >
                    ←
                  </button>

                  {/* Counter */}
                  <span style={{
                    fontSize: "0.65rem", color: "var(--muted)",
                    minWidth: 34, textAlign: "center", letterSpacing: "0.04em",
                    userSelect: "none",
                  }}>
                    {total > 0 ? `${safeIdx + 1} / ${total}` : "—"}
                  </span>

                  {/* → Older */}
                  <button
                    onClick={() => setIdx(i => Math.min(i + 1, total - 1))}
                    disabled={!canNext}
                    aria-label="Older entry"
                    style={{
                      background: "none",
                      border: `1px solid ${canNext ? "rgba(200,169,110,0.4)" : "var(--faint)"}`,
                      color: canNext ? "var(--gold)" : "var(--faint)",
                      width: 30, height: 30, borderRadius: 3,
                      cursor: canNext ? "pointer" : "default",
                      fontSize: "1rem", lineHeight: 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.2s, color 0.2s",
                      fontFamily: "inherit",
                      flexShrink: 0,
                    }}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* ── Entry content — exactly one week visible ── */}
              {!ready ? (
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading weekly update…</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem", position: "relative" }}>
                  <Row label="Currently reading" value={entry.reading} />
                  <Row label="Macro views"        value={entry.macro} />
                  <Row label="Tracking"           value={entry.tracking} />
                  <Row label="Thesis in progress" value={entry.thesis} />
                  <Row label="Weekly note"        value={entry.weeklyNote} />
                </div>
              )}
            </div>

            {/* ── Quote — separate section below carousel ── */}
            <div style={{ borderTop: "1px solid rgba(200,169,110,0.12)", paddingTop: "1.4rem" }}>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "var(--text)", fontWeight: 300, fontStyle: "italic" }}>
                I believe good analysis starts with the right questions, not more data.
              </p>
              <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--gold)", letterSpacing: "0.1em" }}>
                — Manasa Basavaraju
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "0.6rem", alignItems: "baseline" }}>
      <span style={{
        fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--gold)", paddingTop: 2, flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.65 }}>
        {value}
      </span>
    </div>
  );
}