// app/research/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { type Report, defaultReports } from "@/lib/reports-store";

const STORAGE_KEY = "manasa_reports";

const recStyle: Record<string, React.CSSProperties> = {
  Buy:  { background: "rgba(46,204,113,0.12)", color: "#2ecc71", border: "1px solid rgba(46,204,113,0.3)" },
  Hold: { background: "rgba(200,169,110,0.12)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.3)" },
  Sell: { background: "rgba(231,76,60,0.12)", color: "#e74c3c", border: "1px solid rgba(231,76,60,0.3)" },
};

export default function ReportPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const all: Report[] = saved ? JSON.parse(saved) : defaultReports;
      setReport(all.find((r) => r.slug === slug) ?? null);
    } catch {
      setReport(defaultReports.find((r) => r.slug === slug) ?? null);
    }
  }, [slug]);

  if (!report) return (
    <div style={{ minHeight: "100vh", background: "#080a0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#7a8499" }}>
      Loading…
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080a0f", color: "#f0f2f5", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* grid bg */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 2rem", position: "relative", zIndex: 1 }}>

        {/* Back */}
        <button onClick={() => router.back()} style={{ background: "none", border: "1px solid #3a4258", color: "#7a8499", padding: "0.45rem 1.2rem", borderRadius: 2, cursor: "pointer", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "3rem", display: "flex", alignItems: "center", gap: 8 }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ borderBottom: "1px solid #3a4258", paddingBottom: "2rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1.2rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: 2, background: "#13181f", border: "1px solid #3a4258", color: "#7a8499", letterSpacing: "0.1em", textTransform: "uppercase" }}>{report.sector}</span>
            {report.rec && <span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: 2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, ...recStyle[report.rec] }}>{report.rec}</span>}
            <span style={{ fontSize: "0.72rem", color: "#7a8499", marginLeft: "auto" }}>{report.date}</span>
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#c8a96e", letterSpacing: "0.15em", marginBottom: "0.8rem" }}>{report.ticker}</div>
          <h1 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 300, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{report.title}</h1>
        </div>

        {/* Investment Thesis */}
        <Section label="Investment Thesis">
          <p style={{ color: "#9aa3b0", lineHeight: 1.9, fontSize: "0.97rem" }}>{report.detail.thesis}</p>
        </Section>

        {/* Key Financials */}
        <Section label="Key Financials">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem" }}>
            {report.detail.keyFinancials.map((kf) => (
              <div key={kf.label} style={{ background: "#0e1117", border: "1px solid #3a4258", borderRadius: 6, padding: "1rem 1.2rem" }}>
                <div style={{ fontSize: "0.68rem", color: "#7a8499", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{kf.label}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 500, color: "#c8a96e" }}>{kf.value}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Risks */}
        <Section label="Key Risks">
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0, listStyle: "none" }}>
            {report.detail.risks.map((r, i) => (
              <li key={i} style={{ display: "flex", gap: "0.8rem", color: "#9aa3b0", fontSize: "0.93rem", lineHeight: 1.7 }}>
                <span style={{ color: "#e74c3c", marginTop: 2, flexShrink: 0 }}>▲</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>

        {/* Conclusion */}
        <Section label="Conclusion">
          <div style={{ background: "#0e1117", border: "1px solid rgba(200,169,110,0.2)", borderLeft: "3px solid #c8a96e", borderRadius: 4, padding: "1.5rem 1.8rem" }}>
            <p style={{ color: "#f0f2f5", lineHeight: 1.9, fontSize: "0.97rem", fontStyle: "italic" }}>{report.detail.conclusion}</p>
          </div>
        </Section>

      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a96e", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 20, height: 1, background: "#c8a96e", display: "inline-block" }} />
        {label}
      </div>
      {children}
    </div>
  );
}