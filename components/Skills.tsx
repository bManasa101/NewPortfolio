import { skillGroups } from "@/data/portfolio";

export default function Skills() {
  return (
    <section id="skills" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> Skills
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "3rem" }}>
          <strong style={{ fontWeight: 600 }}>Expertise</strong> &amp; Tools
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skillGroups.map((g) => (
            <div key={g.title} style={{ background: "var(--bg2)", border: "1px solid var(--faint)", borderRadius: 6, padding: "1.6rem" }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.4rem" }}>{g.title}</div>
              {g.items.map((item) => (
                <div key={item.name} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.82rem" }}>{item.name}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 2, background: "var(--faint)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, background: "linear-gradient(90deg, var(--gold), var(--gold2))", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}