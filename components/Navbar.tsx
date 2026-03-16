"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = ["About", "Experience", "Research", "Skills", "Education"] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg: React.CSSProperties = mounted && scrolled
    ? {
        background: "rgba(8,10,15,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(200,169,110,0.08)",
      }
    : { background: "transparent" };

  return (
    <header
      className="fixed top-0 left-0 w-full z-[100] transition-all duration-300"
      style={navBg}
    >
      <div
        className="max-w-6xl mx-auto px-10 flex items-center justify-between"
        style={{ height: 64 }}
      >
        {/* Logo */}
        <span
          style={{
            color: "var(--gold)",
            fontSize: "0.8rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Manasa B · CFA level 2
        </span>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="nav-link"
              style={{
                color: "var(--muted)",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--gold)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--muted)")
              }
            >
              {label}
            </a>
          ))}

          {/* CTA */}
          <a
            href="#contact"
            style={{
              background: "var(--gold-dim)",
              border: "1px solid rgba(200,169,110,0.3)",
              color: "var(--gold)",
              padding: "0.45rem 1.2rem",
              borderRadius: "2px",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(200,169,110,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--gold-dim)")
            }
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}