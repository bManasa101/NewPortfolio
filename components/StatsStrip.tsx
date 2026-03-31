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
      ([entry]) => {
        if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        borderTop: "1px solid var(--faint)",
        borderBottom: "1px solid var(--faint)",
        padding: "2.5rem 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="max-w-6xl mx-auto px-10"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "0 1.2rem",
              borderRight: i < stats.length - 1 ? "1px solid var(--faint)" : "none",
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.5s ${i * 100}ms, transform 0.5s ${i * 100}ms`,
              minWidth: 0, // allows grid children to shrink below content size
            }}
          >
            {/* Value — single line, shrinks font to fit */}
            <div
              style={{
                fontSize: "clamp(0.9rem, 1.6vw, 1.8rem)",
                fontWeight: 200,
                color: "var(--gold)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",      // stays on one line
                overflow: "visible",       // never clips
              }}
            >
              {s.value}
            </div>

            {/* Label — allowed to wrap to two lines, never clipped */}
            <div
              style={{
                fontSize: "0.62rem",
                color: "var(--muted)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: 5,
                lineHeight: 1.5,
                whiteSpace: "normal",      // wraps freely
                overflowWrap: "break-word",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}