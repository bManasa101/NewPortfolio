// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = ["About", "Experience", "Research", "Skills", "Education"] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg: React.CSSProperties = mounted && scrolled
    ? {
        background: "rgba(8,10,15,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(200,169,110,0.08)",
      }
    : { background: "transparent" };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-[100] transition-all duration-300"
        style={navBg}
      >
        <div className="max-w-6xl mx-auto px-10 flex items-center justify-between" style={{ height: 64 }}>
          {/* Logo */}
          <a href="#" style={{ textDecoration: "none" }}>
            <span style={{ color: "var(--gold)", fontSize: "0.78rem", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 500 }}>
              Manasa B <span style={{ opacity: 0.5, margin: "0 4px" }}>·</span> CFA
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                style={{ color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              style={{ background: "var(--gold-dim)", border: "1px solid rgba(200,169,110,0.3)", color: "var(--gold)", padding: "0.45rem 1.2rem", borderRadius: "2px", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,169,110,0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--gold-dim)")}
            >
              Contact
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: 22, height: 1.5, background: menuOpen ? "var(--gold)" : "var(--muted)", transition: "background 0.2s", borderRadius: 2, transformOrigin: "center", transform: menuOpen ? (i === 1 ? "scaleX(0)" : i === 0 ? "rotate(45deg) translate(4px, 4px)" : "rotate(-45deg) translate(4px, -4px)") : "none" }} />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(8,10,15,0.97)", zIndex: 99, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}
          onClick={closeMenu}
        >
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              onClick={closeMenu}
              style={{ color: "var(--text)", fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            style={{ marginTop: "1rem", background: "var(--gold)", color: "#080a0f", padding: "0.75rem 2.5rem", borderRadius: 2, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            Contact
          </a>
        </div>
      )}
    </>
  );
}