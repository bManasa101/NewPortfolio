"use client"
import { education } from "@/data/portfolio";

export default function Education() {
  return (
    <section id="education" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> Education
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "3rem" }}>
          <strong style={{ fontWeight: 600 }}>Credentials</strong> &amp; Qualifications
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {education.map((e) => (
            <div key={e.degree} style={{ background: "var(--bg2)", border: "1px solid var(--faint)", borderRadius: 6, padding: "1.6rem", position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}
              onMouseEnter={el => (el.currentTarget.style.borderColor = "rgba(200,169,110,0.3)")}
              onMouseLeave={el => (el.currentTarget.style.borderColor = "var(--faint)")}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--gold), transparent)" }} />
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>{e.type}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 500, lineHeight: 1.4, marginBottom: "0.5rem" }}>{e.degree}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem", lineHeight: 1.5 }}>{e.school}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--faint)" }}>{e.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}