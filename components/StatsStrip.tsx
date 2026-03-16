import { stats } from "@/data/portfolio";

export default function StatsStrip() {
  return (
    <div style={{ borderTop: "1px solid var(--faint)", borderBottom: "1px solid var(--faint)", padding: "2.5rem 0", position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} style={{ padding: "0 2rem", borderRight: i < stats.length - 1 ? "1px solid var(--faint)" : "none" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 200, color: "var(--gold)", letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}