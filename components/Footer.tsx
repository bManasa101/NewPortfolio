"use client"
export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--faint)", padding: "2rem 2.5rem", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em" }}>© 2025 Manasa Basavaraju · CFA Charterholder</span>
        <div className="flex gap-8">
          {["About", "Research", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: "0.72rem", color: "var(--muted)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}