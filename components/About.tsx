export default function About() {
  return (
    <section id="about" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> About
        </div>
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
              "I am a CFA Charterholder and equity analyst with deep expertise in Technology and Consumer Discretionary sectors. My work focuses on bottom-up fundamental research, DCF and comparable company analysis, and translating complex financial data into clear, high-conviction investment theses.",
              "Prior to my current role, I contributed to coverage teams at leading asset managers and investment banks across Mumbai and London, building rigorous models that track both macro developments and company-specific catalysts.",
              "I am driven by intellectual rigor, data integrity, and the discipline to remain objective in dynamic market environments.",
            ].map((p, i) => (
              <p key={i} style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.9 }}>{p}</p>
            ))}
          </div>
          <div style={{ background: "var(--bg2)", border: "1px solid rgba(200,169,110,0.15)", borderLeft: "3px solid var(--gold)", borderRadius: 8, padding: "2rem", position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", top: -10, left: 16, fontSize: "6rem", color: "rgba(200,169,110,0.08)", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</span>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text)", fontWeight: 300, fontStyle: "italic", position: "relative" }}>
              Good analysis is not about having more data — it is about asking better questions and having the conviction to act on the answers.
            </p>
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--gold)", letterSpacing: "0.1em", position: "relative" }}>— Manasa Basavaraju, CFA</div>
          </div>
        </div>
      </div>
    </section>
  );
}