// components/ResearchCard.tsx
"use client";
import { useRouter } from "next/navigation";
import type { Report } from "@/lib/reports-store";

const recStyle: Record<string, React.CSSProperties> = {
  Buy:  { background: "rgba(46,204,113,0.12)", color: "#2ecc71", border: "1px solid rgba(46,204,113,0.25)" },
  Hold: { background: "rgba(200,169,110,0.12)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.25)" },
  Sell: { background: "rgba(231,76,60,0.12)", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.25)" },
};

export function ResearchCard({ r }: { r: Report }) {
  const router = useRouter();
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--faint)",
        borderRadius: 6,
        padding: "1.8rem",
        transition: "all 0.25s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
      onClick={() => router.push(`/research/${r.slug}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(200,169,110,0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--faint)";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 2, background: "linear-gradient(90deg, var(--gold), transparent)", borderRadius: 2, marginBottom: "1.4rem", marginLeft: "-1.8rem", marginRight: "-1.8rem", marginTop: "-1.8rem", borderTopLeftRadius: 6, borderTopRightRadius: 6 }} />

      {/* Badges row */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.65rem", padding: "2px 9px", borderRadius: 2, background: "var(--bg3)", border: "1px solid var(--faint)", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {r.sector}
        </span>
        {r.rec && (
          <span style={{ fontSize: "0.65rem", padding: "2px 9px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, ...recStyle[r.rec] }}>
            {r.rec}
          </span>
        )}
      </div>

      {/* Ticker */}
      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.18em", marginBottom: "0.5rem" }}>
        {r.ticker}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: "1rem", fontWeight: 500, lineHeight: 1.45, color: "var(--text)", marginBottom: "0.8rem", letterSpacing: "-0.01em" }}>
        {r.title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.75, flexGrow: 1, marginBottom: "1.4rem" }}>
        {r.desc}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.2rem", borderTop: "1px solid var(--faint)" }}>
        <span style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.04em" }}>{r.date}</span>
        <span style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
          Read Report
          <span style={{ fontSize: "0.9rem" }}>→</span>
        </span>
      </div>
    </div>
  );
}