// components/StatsStrip.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/portfolio";

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ borderTop: "1px solid var(--faint)", borderBottom: "1px solid var(--faint)", padding: "2.5rem 0", position: "relative", zIndex: 1 }}
    >
      <div className="max-w-6xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "0 2rem",
              borderRight: i < stats.length - 1 ? "1px solid var(--faint)" : "none",
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.5s ${i * 100}ms, transform 0.5s ${i * 100}ms`,
            }}
          >
            <div style={{ fontSize: "2.2rem", fontWeight: 200, color: "var(--gold)", letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}