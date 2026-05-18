import { Link } from "wouter";
import Layout from "@/components/Layout";
import { concepts, CATEGORY_META, SOURCE_META, type Category } from "@/data/concepts";

const BOOKS = [
  {
    title: "Don't Make Me Think",
    author: "Steve Krug",
    year: "2000",
    tagline: "The usability classic that defined the web age",
    color: "#F7A44A",
    bg: "rgba(247,164,74,0.1)",
    icon: "📖",
    key: "Don't Make Me Think — Steve Krug",
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    year: "1988",
    tagline: "Why bad design is everywhere and what to do about it",
    color: "#845EC2",
    bg: "rgba(132,94,194,0.1)",
    icon: "🚪",
    key: "The Design of Everyday Things — Don Norman",
  },
  {
    title: "Laws of UX",
    author: "Jon Yablonski",
    year: "2020",
    tagline: "The psychological principles every designer needs",
    color: "#E91E63",
    bg: "rgba(233,30,99,0.1)",
    icon: "⚖️",
    key: "Laws of UX — Jon Yablonski",
  },
];

const FEATURED = ["cognitive-load", "affordances", "fitts-law", "proximity", "hicks-law", "feedback"];

export default function HomePage() {
  const featuredConcepts = FEATURED.map(id => concepts.find(c => c.id === id)).filter(Boolean) as typeof concepts;
  const categories = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][];

  return (
    <Layout>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #E91E63, transparent)" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-20">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <span className="tag" style={{ background: "rgba(124,58,237,0.1)", color: "var(--color-primary)" }}>
              🧠 Interactive Learning
            </span>
            <span className="tag" style={{ background: "rgba(0,0,0,0.05)", color: "var(--color-text-muted)" }}>
              23 Concepts
            </span>
          </div>

          {/* Heading */}
          <h1
            className="mb-6 max-w-3xl"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-text)",
            }}
          >
            You don't have to{" "}
            <span style={{ color: "var(--color-primary)", position: "relative" }}>
              use your brain
              <svg style={{ position: "absolute", bottom: "-4px", left: 0, width: "100%", height: "8px", overflow: "visible" }} viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 6 Q50 1 100 5 Q150 9 200 4" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </span>
          </h1>

          <p
            className="mb-10 max-w-xl"
            style={{ fontSize: "var(--text-lg)", color: "var(--color-text-muted)", lineHeight: 1.65 }}
          >
            A curated library of UI/UX principles, argued and demonstrated. Learn why great design is invisible — and why bad design makes you think.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/library">
              <button
                data-testid="button-explore-library"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "var(--color-primary)", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
              >
                Explore the Library
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </Link>
            <Link href="/design-system">
              <button
                data-testid="button-design-system"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                Design System
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 mt-12 pt-12 border-t" style={{ borderColor: "var(--color-border)" }}>
            {[
              { n: "3", label: "Foundational Books" },
              { n: "23", label: "Core Concepts" },
              { n: "6", label: "Categories" },
              { n: "∞", label: "Better Products" },
            ].map(({ n, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{n}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOURCE BOOKS ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            The Source Material
          </h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Three books that changed how we think about design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BOOKS.map(book => (
            <Link key={book.key} href={`/library?source=${encodeURIComponent(book.key)}`}>
              <div
                data-testid={`card-book-${book.author.split(' ')[1]}`}
                className="group p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1"
                style={{
                  background: book.bg,
                  borderColor: `${book.color}30`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div className="text-3xl mb-4">{book.icon}</div>
                <h3 className="font-bold text-base mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                  {book.title}
                </h3>
                <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                  {book.author} · {book.year}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)", lineHeight: 1.55 }}>
                  {book.tagline}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: book.color }}>
                  {concepts.filter(c => c.source.includes(book.author.split(' ')[1])).length} concepts
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────── */}
      <section className="py-16" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Browse by Category
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Every concept organized by the mental model it addresses
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(([key, meta]) => {
              const count = concepts.filter(c => c.category === key).length;
              return (
                <Link key={key} href={`/library?category=${key}`}>
                  <div
                    data-testid={`card-category-${key}`}
                    className="group p-4 rounded-xl border text-center cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: "var(--color-border)",
                      background: "var(--color-bg)",
                    }}
                  >
                    <div className="text-2xl mb-2">{meta.emoji}</div>
                    <div className="text-xs font-semibold mb-1" style={{ color: "var(--color-text)" }}>{meta.label}</div>
                    <div className="text-xs" style={{ color: "var(--color-text-faint)" }}>{count} concepts</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED CONCEPTS ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Essential Concepts
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Start here — the most fundamental ideas in UX
            </p>
          </div>
          <Link href="/library">
            <span className="text-sm font-medium hover:underline" style={{ color: "var(--color-primary)" }}>
              View all →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredConcepts.map(concept => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ─────────────────────────────── */}
      <section className="py-16" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              What this library teaches
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "🔍",
                title: "Why design matters",
                body: "Every concept comes with a real argument — not just 'best practice' but a clear explanation of what goes wrong when it's ignored.",
              },
              {
                icon: "⚡",
                title: "Interactive demonstrations",
                body: "See concepts in action through live demos. Understand Fitts's Law by clicking targets. Feel cognitive load through form comparisons.",
              },
              {
                icon: "📚",
                title: "Traced to primary sources",
                body: "Every concept is traced back to Krug, Norman, or Yablonski — so you know where ideas come from and can go deeper.",
              },
              {
                icon: "🏗️",
                title: "Design system grounding",
                body: "Bridge theory into practice with a complete design system reference: tokens, typography, color, and spacing explained from first principles.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                <div className="text-2xl flex-shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--color-text)" }}>{title}</h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)", lineHeight: 1.6 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ConceptCard({ concept }: { concept: typeof concepts[0] }) {
  const catMeta = CATEGORY_META[concept.category];
  return (
    <Link href={`/concept/${concept.id}`}>
      <div
        data-testid={`card-concept-${concept.id}`}
        className="group p-5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Color bar */}
        <div
          className="w-8 h-1.5 rounded-full mb-4 transition-all group-hover:w-12"
          style={{ background: concept.color }}
        />

        {/* Category */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-base">{catMeta.emoji}</span>
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{catMeta.label}</span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-base mb-1.5" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", lineHeight: 1.2 }}>
          {concept.name}
        </h3>

        {/* Tagline */}
        <p className="text-sm mb-4 italic" style={{ color: concept.color, fontStyle: "italic" }}>
          "{concept.tagline}"
        </p>

        {/* Definition preview */}
        <p className="text-xs line-clamp-3" style={{ color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          {concept.definition}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
          <span className="text-xs" style={{ color: "var(--color-text-faint)" }}>
            {concept.source.split(" — ")[0].split(" / ")[0]}
          </span>
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-primary)" }}>
            Explore
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
