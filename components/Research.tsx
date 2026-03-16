"use client"
import { reports } from "@/data/portfolio";

const recTag: Record<string, React.CSSProperties> = {
  Buy:  { background: "rgba(46,204,113,0.1)",  color: "var(--green)", border: "1px solid rgba(46,204,113,0.2)" },
  Hold: { background: "rgba(200,169,110,0.08)", color: "var(--gold)",  border: "1px solid rgba(200,169,110,0.2)" },
  Sell: { background: "rgba(231,76,60,0.08)",   color: "var(--red)",   border: "1px solid rgba(231,76,60,0.2)" },
};

export default function Research() {
  return (
    <section id="research" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> Research
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "3rem" }}>
          <strong style={{ fontWeight: 600 }}>Selected</strong> Reports
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((r) => (
            <div key={r.ticker} style={{ background: "var(--bg2)", border: "1px solid var(--faint)", borderRadius: 6, padding: "1.8rem", transition: "all 0.25s", cursor: "default" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,169,110,0.3)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--faint)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2 flex-wrap">
                  <span style={{ fontSize: "0.66rem", padding: "3px 8px", borderRadius: 2, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--bg3)", border: "1px solid var(--faint)", color: "var(--muted)" }}>{r.sector}</span>
                  {r.rec && <span style={{ fontSize: "0.66rem", padding: "3px 8px", borderRadius: 2, letterSpacing: "0.06em", textTransform: "uppercase", ...recTag[r.rec] }}>{r.rec}</span>}
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.1em" }}>{r.ticker}</span>
              </div>
              <h3 style={{ fontSize: "0.97rem", fontWeight: 500, lineHeight: 1.5, marginBottom: "0.6rem" }}>{r.title}</h3>
              <p style={{ fontSize: "0.84rem", color: "var(--muted)", lineHeight: 1.7 }}>{r.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: "1px solid var(--faint)" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{r.date}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Read Report →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}