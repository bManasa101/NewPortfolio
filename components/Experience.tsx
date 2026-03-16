import { experience } from "@/data/portfolio";

export default function Experience() {
  return (
    <section id="experience" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> Experience
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "3rem" }}>
          <strong style={{ fontWeight: 600 }}>Career</strong> Timeline
        </h2>
        <div>
          {experience.map((e) => (
            <div key={e.title} className="grid md:grid-cols-[200px_1fr] gap-4" style={{ borderTop: "1px solid var(--faint)", padding: "2rem 0" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em" }}>{e.date}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--gold)", marginTop: 4, letterSpacing: "0.05em" }}>{e.firm}</div>
              </div>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 500, marginBottom: "0.2rem" }}>{e.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.8rem" }}>{e.location}</div>
                <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.8 }}>{e.desc}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {e.tags.map((t) => (
                    <span key={t} style={{ fontSize: "0.66rem", padding: "3px 10px", borderRadius: 2, background: "var(--bg3)", border: "1px solid var(--faint)", color: "var(--muted)", letterSpacing: "0.06em" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}