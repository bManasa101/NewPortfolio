// components/Hero.tsx
import { coverage } from "@/data/portfolio";

const recStyle: Record<string, React.CSSProperties> = {
  Buy:  { background: "rgba(46,204,113,0.12)", color: "var(--green)", border: "1px solid rgba(46,204,113,0.2)" },
  Hold: { background: "rgba(200,169,110,0.1)", color: "var(--gold)", border: "1px solid rgba(200,169,110,0.2)" },
  Sell: { background: "rgba(231,76,60,0.1)", color: "var(--red)", border: "1px solid rgba(231,76,60,0.2)" },
};

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 relative z-10">
      <div className="max-w-6xl mx-auto px-10 w-full">
        <div className="grid md:grid-cols-[1fr_420px] gap-16 items-center">
          {/* Left */}
          <div>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 32, height: 1, background: "var(--gold)", display: "inline-block" }} />
              Equity Research &amp; Institutional Sales
            </div>
            <h1 style={{ fontSize: "clamp(3rem,6vw,5rem)", fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
              Turning Data<br />
              Into <em style={{ fontStyle: "normal", fontWeight: 700, color: "var(--gold)" }}>Conviction</em>
            </h1>
            <p style={{ fontSize: "1.4rem", fontWeight:'700', color: "white", lineHeight: 1.8, maxWidth: 480 }}>
Sell-side meets buy-side thinking.
            </p>
             <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.8, maxWidth: 480, marginBottom: "2.5rem" }}>
I sit at the interface of institutional capital allocation and equity research — translating market signals into structured, high-conviction ideas.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#research" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "#080a0f", padding: "0.75rem 2rem", borderRadius: 2, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                View Research →
              </a>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--faint)", color: "var(--muted)", padding: "0.75rem 2rem", borderRadius: 2, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Get in Touch
              </a>
            </div>
          </div>

          {/* Terminal Card */}
          <div className="hidden md:block" style={{ background: "var(--bg2)", border: "1px solid rgba(200,169,110,0.15)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ background: "var(--bg3)", padding: "1rem 1.4rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--faint)" }}>
              <div className="flex gap-1.5">
                {["#ff5f57", "#febc2e", "#28c840"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em" }}>Coverage · FY2025</span>
              <span />
            </div>
            <div style={{ padding: "1.4rem" }}>
              {coverage.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--faint)" }}>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 1 }}>{s.sector}</div>
                  </div>
                  <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.06em", fontWeight: 500, ...recStyle[s.rec] }}>{s.rec}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 500 }}>{s.pt}</div>
                    <div style={{ fontSize: "0.7rem", color: s.up ? "var(--green)" : "var(--red)", marginTop: 1 }}>{s.chg}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}