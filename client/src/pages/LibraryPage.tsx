import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import Layout from "@/components/Layout";
import { concepts, CATEGORY_META, type Category } from "@/data/concepts";

export default function LibraryPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = (params.get("category") || "") as Category | "";
  const initialSource = params.get("source") || "";

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">(initialCategory);
  const [selectedSource, setSelectedSource] = useState(initialSource);
  const [sortBy, setSortBy] = useState<"name" | "source" | "category">("category");

  const sources = useMemo(() => [...new Set(concepts.map(c => c.source))].sort(), []);
  const categories = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][];

  const filtered = useMemo(() => {
    let list = [...concepts];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q) ||
        c.source.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) list = list.filter(c => c.category === selectedCategory);
    if (selectedSource) list = list.filter(c => c.source === selectedSource);

    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "source") list.sort((a, b) => a.source.localeCompare(b.source));
    else {
      const catOrder: Category[] = ["cognitive", "affordance", "feedback", "gestalt", "navigation", "design-system"];
      list.sort((a, b) => catOrder.indexOf(a.category) - catOrder.indexOf(b.category));
    }

    return list;
  }, [query, selectedCategory, selectedSource, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedSource("");
  };

  const hasFilters = query || selectedCategory || selectedSource;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Concept Library
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {concepts.length} principles from the foundational texts of UI/UX design
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-text-muted)" }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              data-testid="input-search"
              type="search"
              placeholder="Search concepts, principles, examples…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            />
          </div>

          {/* Category filter */}
          <select
            data-testid="select-category"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as Category | "")}
            className="px-3 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          >
            <option value="">All Categories</option>
            {categories.map(([key, meta]) => (
              <option key={key} value={key}>{meta.emoji} {meta.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            data-testid="select-sort"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as "name" | "source" | "category")}
            className="px-3 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
          >
            <option value="category">Sort by Category</option>
            <option value="name">Sort by Name</option>
            <option value="source">Sort by Source</option>
          </select>
        </div>

        {/* Source filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sources.map(src => {
            const short = src.includes("Krug") ? "Don't Make Me Think" : src.includes("Norman") ? "DOET" : src.includes("Gestalt") ? "Gestalt / Laws of UX" : src.includes("Yablonski") ? "Laws of UX" : "Design Systems";
            const active = selectedSource === src;
            return (
              <button
                key={src}
                data-testid={`filter-source-${src}`}
                onClick={() => setSelectedSource(active ? "" : src)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={{
                  borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                  background: active ? "rgba(124,58,237,0.1)" : "transparent",
                  color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                }}
              >
                {short}
              </button>
            );
          })}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-faint)" }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>
          {filtered.length} concept{filtered.length !== 1 ? "s" : ""}
          {hasFilters ? " matching filters" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium" style={{ color: "var(--color-text)" }}>No concepts found</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Try a different search or clear filters</p>
            <button onClick={clearFilters} className="mt-4 text-sm font-medium" style={{ color: "var(--color-primary)" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(concept => {
              const catMeta = CATEGORY_META[concept.category];
              return (
                <Link key={concept.id} href={`/concept/${concept.id}`}>
                  <article
                    data-testid={`card-concept-${concept.id}`}
                    className="group h-full p-5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: "var(--color-border)",
                      background: "var(--color-surface)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Top accent */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-8 h-1.5 rounded-full transition-all group-hover:w-12" style={{ background: concept.color }} />
                      <span className="tag" style={{ background: `${concept.color}18`, color: concept.color }}>
                        {catMeta.emoji} {catMeta.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-base mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                      {concept.name}
                    </h3>
                    <p className="text-sm mb-3 italic" style={{ color: concept.color }}>"{concept.tagline}"</p>
                    <p className="text-xs line-clamp-3" style={{ color: "var(--color-text-muted)", lineHeight: 1.65 }}>
                      {concept.definition}
                    </p>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
                      <span className="text-xs" style={{ color: "var(--color-text-faint)" }}>
                        {concept.source.split(" — ")[0].replace("Laws of UX — Jon Yablonski / Gestalt Psychology", "Gestalt")}
                      </span>
                      <span className="text-xs font-medium flex items-center gap-1 transition-all" style={{ color: "var(--color-primary)" }}>
                        Read
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
