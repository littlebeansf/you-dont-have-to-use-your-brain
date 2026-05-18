import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/library", label: "Library" },
    { href: "/design-system", label: "Design System" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(var(--color-bg-rgb, 248,247,245), 0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <span className="flex items-center gap-2.5 select-none group">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="YDHTUYB logo">
                <rect width="28" height="28" rx="7" fill="var(--color-primary)" />
                <text x="14" y="19" textAnchor="middle" fontFamily="'Clash Display', sans-serif" fontWeight="700" fontSize="14" fill="white">🧠</text>
              </svg>
              <span
                className="font-bold text-sm hidden sm:block"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
              >
                You don't have to use your brain
              </span>
              <span className="font-bold text-sm sm:hidden" style={{ fontFamily: "var(--font-display)" }}>
                YDHTUYB
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location === href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12"/>
                ) : (
                  <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    location === href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Built on the shoulders of Krug, Norman & Yablonski
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-faint)" }}>
            You don't have to use your brain — 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
