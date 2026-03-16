"use client";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = () => {
    alert(`Thanks ${form.name}! I'll be in touch soon.`);
    setForm({ name: "", email: "", message: "" });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--bg2)", border: "1px solid var(--faint)",
    color: "var(--text)", padding: "0.8rem 1rem", borderRadius: 4,
    fontFamily: "inherit", fontSize: "0.88rem", outline: "none",
  };

  return (
    <section id="contact" style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10">
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "var(--gold)", display: "inline-block" }} /> Contact
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 300, letterSpacing: "-0.02em", marginBottom: "3rem" }}>
          <strong style={{ fontWeight: 600 }}>Get</strong> in Touch
        </h2>
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div>
            <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.9, marginBottom: "2rem" }}>
              Open to speaking engagements, research collaborations, and select full-time opportunities.
            </p>
            {[
              { icon: "✉", label: "b.manasa101@gmail.com" },
              { icon: "in", label: "https://www.linkedin.com/in/manasa-basavaraju-spjimr/" },
              { icon: "📍", label: "Mumbai, India" },
            ].map((c) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid var(--faint)", color: "var(--muted)", fontSize: "0.88rem" }}>
                <div style={{ width: 32, height: 32, border: "1px solid var(--faint)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{c.icon}</div>
                {c.label}
              </div>
            ))}
          </div>
          <div>
            {(["name", "email"] as const).map((f) => (
              <div key={f} style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>{f}</label>
                <input type={f === "email" ? "email" : "text"} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} placeholder={f === "name" ? "Your full name" : "your@email.com"} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>Message</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell me about your inquiry..." rows={5} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <button onClick={handleSubmit} style={{ width: "100%", background: "var(--gold)", color: "#080a0f", border: "none", padding: "0.9rem", borderRadius: 4, fontFamily: "inherit", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}