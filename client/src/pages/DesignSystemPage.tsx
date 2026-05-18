import { useState } from "react";
import Layout from "@/components/Layout";

const TYPE_RATIOS = [
  { label: "Minor Second", ratio: 1.067 },
  { label: "Major Second", ratio: 1.125 },
  { label: "Minor Third", ratio: 1.2 },
  { label: "Major Third", ratio: 1.25 },
  { label: "Perfect Fourth", ratio: 1.333 },
  { label: "Augmented Fourth", ratio: 1.414 },
  { label: "Perfect Fifth", ratio: 1.5 },
];

const SPACING_TOKENS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];

const COLOR_ROLES = [
  { name: "Primary", desc: "Main interactive elements — CTAs, links, focus rings", var: "var(--color-primary)", text: "white" },
  { name: "Text", desc: "Body copy, headings, labels — maximum readability", var: "var(--color-text)", text: "var(--color-bg)" },
  { name: "Text Muted", desc: "Secondary information, placeholders, metadata", var: "var(--color-text-muted)", text: "white" },
  { name: "Surface", desc: "Card backgrounds, panels — one step above the page", var: "var(--color-surface)", text: "var(--color-text)" },
  { name: "Border", desc: "Dividers, outlines — subtle structural separation", var: "var(--color-border)", text: "var(--color-text)" },
  { name: "Success", desc: "Confirmations, valid states, positive feedback", var: "var(--color-success)", text: "white" },
  { name: "Error", desc: "Errors, destructive actions, warnings", var: "var(--color-error)", text: "white" },
  { name: "Warning", desc: "Caution states, information requiring attention", var: "var(--color-warning)", text: "white" },
];

const RADIUS_VALUES = [
  { label: "sm", value: "4px" },
  { label: "md", value: "8px" },
  { label: "lg", value: "12px" },
  { label: "xl", value: "16px" },
  { label: "2xl", value: "24px" },
  { label: "full", value: "9999px" },
];

function TypeScaleBuilder() {
  const [base, setBase] = useState(16);
  const [ratioIdx, setRatioIdx] = useState(4);
  const ratio = TYPE_RATIOS[ratioIdx].ratio;

  const levels = [
    { name: "Display / Hero", steps: 4, weight: 700 },
    { name: "H1", steps: 3, weight: 700 },
    { name: "H2", steps: 2, weight: 600 },
    { name: "H3", steps: 1, weight: 600 },
    { name: "Body", steps: 0, weight: 400 },
    { name: "Small", steps: -1, weight: 400 },
    { name: "Caption", steps: -2, weight: 400 },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl" style={{ background: "var(--color-surface-2, var(--color-surface))", border: "1px solid var(--color-border)" }}>
        <div className="flex-1 min-w-32">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Base size: {base}px</label>
          <input type="range" min={12} max={24} value={base} onChange={e => setBase(+e.target.value)} className="w-full" />
        </div>
        <div className="flex-1 min-w-40">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
            Ratio: {TYPE_RATIOS[ratioIdx].label} ({ratio})
          </label>
          <input type="range" min={0} max={TYPE_RATIOS.length - 1} value={ratioIdx} onChange={e => setRatioIdx(+e.target.value)} className="w-full" />
        </div>
      </div>

      <div className="space-y-2">
        {levels.map(({ name, steps, weight }) => {
          const size = Math.round(base * Math.pow(ratio, steps));
          const lineH = size > 32 ? 1.1 : size > 20 ? 1.25 : 1.6;
          return (
            <div key={name} className="flex items-baseline gap-4 p-2 rounded-lg hover:bg-secondary transition-colors" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <div className="w-20 flex-shrink-0">
                <div className="text-xs" style={{ color: "var(--color-text-faint)" }}>{name}</div>
                <div className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{size}px</div>
              </div>
              <div
                style={{
                  fontSize: `${Math.min(size, 72)}px`,
                  fontWeight: weight,
                  fontFamily: weight >= 600 ? "var(--font-display)" : "var(--font-body)",
                  lineHeight: lineH,
                  color: "var(--color-text)",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                The quick brown fox
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContrastChecker() {
  const [fg, setFg] = useState("#0f0e0c");
  const [bg, setBg] = useState("#f8f7f5");

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const luminance = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    const [R, G, B] = [r, g, b].map(v => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  const contrast = () => {
    const l1 = luminance(fg);
    const l2 = luminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  };

  const ratio = parseFloat(contrast());
  const passAA = ratio >= 4.5;
  const passAAA = ratio >= 7;
  const passLarge = ratio >= 3;

  return (
    <div className="space-y-4">
      <div
        className="p-8 rounded-xl text-center"
        style={{ background: bg, border: "1px solid var(--color-border)" }}
      >
        <p style={{ color: fg, fontSize: "20px", fontWeight: 600, fontFamily: "var(--font-display)" }}>
          The quick brown fox
        </p>
        <p style={{ color: fg, fontSize: "14px", marginTop: "8px", opacity: 0.85 }}>
          Small body text — requires 4.5:1 contrast
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Text color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-10 h-9 rounded-lg border cursor-pointer" style={{ borderColor: "var(--color-border)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{fg}</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Background color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-10 h-9 rounded-lg border cursor-pointer" style={{ borderColor: "var(--color-border)" }} />
            <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{bg}</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border" style={{ borderColor: passAA ? "#05966930" : "#dc262630", background: passAA ? "rgba(5,150,105,0.07)" : "rgba(220,38,38,0.07)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono)", color: passAA ? "#059669" : "#dc2626" }}>{ratio}:1</span>
          <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: passAA ? "#059669" : "#dc2626", color: "white" }}>
            {passAAA ? "AAA ✓" : passAA ? "AA ✓" : "Fail ✗"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: "AA Normal", pass: passAA, min: "4.5:1" },
            { label: "AA Large", pass: passLarge, min: "3:1" },
            { label: "AAA Normal", pass: passAAA, min: "7:1" },
          ].map(({ label, pass, min }) => (
            <div key={label} className="text-center p-2 rounded-lg" style={{ background: pass ? "rgba(5,150,105,0.1)" : "rgba(220,38,38,0.1)" }}>
              <div style={{ color: pass ? "#059669" : "#dc2626" }}>{pass ? "✓" : "✗"}</div>
              <div style={{ color: "var(--color-text-muted)" }}>{label}</div>
              <div style={{ color: "var(--color-text-faint)" }}>min {min}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpacingSystem() {
  const [unit, setUnit] = useState(8);
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <label className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Base unit:</label>
        {[4, 8, 10].map(u => (
          <button key={u} onClick={() => setUnit(u)}
            className="px-3 py-1 rounded-lg text-xs font-semibold border transition-all"
            style={{ background: unit === u ? "rgba(124,58,237,0.1)" : "transparent", borderColor: unit === u ? "var(--color-primary)" : "var(--color-border)", color: unit === u ? "var(--color-primary)" : "var(--color-text-muted)" }}>
            {u}px
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {SPACING_TOKENS.map(t => {
          const px = t * (unit / 4);
          return (
            <div key={t} className="flex items-center gap-3">
              <span className="text-xs font-mono w-8 text-right flex-shrink-0" style={{ color: "var(--color-text-faint)" }}>{t}</span>
              <div className="h-4 rounded-sm flex-shrink-0" style={{ width: `${Math.min(px * 2, 300)}px`, background: "var(--color-primary)", opacity: 0.7 }} />
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{px}px</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
        A {unit}px base unit creates a harmonious spatial system — every spacing value is a multiple, ensuring natural alignment.
      </p>
    </div>
  );
}

function TokenDemo() {
  const [primaryHue, setPrimaryHue] = useState(262);
  const [radius, setRadius] = useState(10);
  const [density, setDensity] = useState(16);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Primary hue: {primaryHue}°</label>
          <input type="range" min={0} max={360} value={primaryHue} onChange={e => setPrimaryHue(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Border radius: {radius}px</label>
          <input type="range" min={0} max={24} value={radius} onChange={e => setRadius(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Padding: {density}px</label>
          <input type="range" min={8} max={32} value={density} onChange={e => setDensity(+e.target.value)} className="w-full" />
        </div>
      </div>

      {/* Live preview */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-muted)" }}>Live Preview</p>
        <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
          <div className="flex items-start gap-3" style={{ padding: `${density}px` }}>
            <div className="w-10 h-10 flex-shrink-0" style={{ borderRadius: `${radius}px`, background: `hsl(${primaryHue}, 70%, 55%)` }} />
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1" style={{ color: "var(--color-text)" }}>Product Card</div>
              <div className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>This preview updates as you change tokens above.</div>
              <button
                className="text-xs font-semibold text-white"
                style={{ padding: `${density * 0.4}px ${density}px`, borderRadius: `${radius}px`, background: `hsl(${primaryHue}, 70%, 45%)` }}
              >
                Primary Action
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--color-text-faint)" }}>
          Every element updates from three token changes — color.primary, radius, spacing.
        </p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const sections = [
    { id: "tokens", label: "Tokens", icon: "🔑" },
    { id: "typography", label: "Typography", icon: "Aa" },
    { id: "color", label: "Color", icon: "🎨" },
    { id: "spacing", label: "Spacing", icon: "📐" },
    { id: "radius", label: "Radius", icon: "⭕" },
  ];
  const [active, setActive] = useState("tokens");

  const scrollToSection = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Design System Reference
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--color-text-muted)" }}>
            The grammar of consistent visual language — tokens, typography, color, spacing, and radius. Interactive tools to understand each system.
          </p>
        </div>

        {/* Sticky section nav */}
        <div className="sticky top-14 z-40 -mx-4 px-4 py-3 mb-8 flex gap-2 overflow-x-auto" style={{ background: "rgba(var(--color-bg-rgb, 248,247,245), 0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--color-border)" }}>
          {sections.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all"
              style={{
                background: active === id ? "rgba(124,58,237,0.1)" : "transparent",
                color: active === id ? "var(--color-primary)" : "var(--color-text-muted)",
                border: `1px solid ${active === id ? "rgba(124,58,237,0.3)" : "transparent"}`,
              }}
            >
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {/* Design Tokens */}
          <section id="tokens">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Design Tokens</h2>
              <p className="text-sm mt-1 max-w-lg" style={{ color: "var(--color-text-muted)" }}>
                Named variables that store design decisions. Change one token — update everything. The live preview below demonstrates token-driven design.
              </p>
            </div>
            <div className="p-6 rounded-2xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <TokenDemo />
            </div>

            {/* Token categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { name: "Color tokens", desc: "brand.primary, semantic.error, neutral.100…", icon: "🎨" },
                { name: "Spacing tokens", desc: "space.4, space.8, space.16, space.32…", icon: "📐" },
                { name: "Typography tokens", desc: "text.base, text.lg, font.display…", icon: "Aa" },
                { name: "Effect tokens", desc: "radius.md, shadow.lg, transition.fast…", icon: "✨" },
              ].map(({ name, desc, icon }) => (
                <div key={name} className="p-3 rounded-xl border text-center" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                  <div className="text-xl mb-1.5">{icon}</div>
                  <div className="text-xs font-semibold mb-1" style={{ color: "var(--color-text)" }}>{name}</div>
                  <div className="text-xs" style={{ color: "var(--color-text-faint)", lineHeight: 1.4 }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section id="typography">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Typography Scale</h2>
              <p className="text-sm mt-1 max-w-lg" style={{ color: "var(--color-text-muted)" }}>
                A modular scale built from a base size and a ratio. Every heading is proportionally related to every other. Adjust both to see how the system behaves.
              </p>
            </div>
            <div className="p-6 rounded-2xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <TypeScaleBuilder />
            </div>

            {/* Font specimens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <div className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--color-text-faint)" }}>Display — Clash Display</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "24px", color: "var(--color-text)", lineHeight: 1.15 }}>
                  AaBbCcDd<br/>0123456789
                </div>
              </div>
              <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <div className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--color-text-faint)" }}>Body — Satoshi</div>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "16px", color: "var(--color-text)", lineHeight: 1.65 }}>
                  AaBbCcDd 0123456789<br/>
                  <span style={{ fontWeight: 700 }}>Bold weight for emphasis.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Color */}
          <section id="color">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Color System</h2>
              <p className="text-sm mt-1 max-w-lg" style={{ color: "var(--color-text-muted)" }}>
                Color roles assign meaning consistently. The contrast checker below validates WCAG accessibility compliance.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {COLOR_ROLES.map(({ name, desc, var: bg, text }) => (
                <div key={name} className="p-3 rounded-xl overflow-hidden" style={{ background: bg, border: "1px solid var(--color-border)" }}>
                  <div className="text-xs font-bold mb-1" style={{ color: text }}>{name}</div>
                  <div className="text-xs opacity-75" style={{ color: text, lineHeight: 1.4 }}>{desc}</div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>Contrast Checker</h3>
              <ContrastChecker />
            </div>
          </section>

          {/* Spacing */}
          <section id="spacing">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Spacing System</h2>
              <p className="text-sm mt-1 max-w-lg" style={{ color: "var(--color-text-muted)" }}>
                A base unit multiplied to create consistent spatial rhythm. Every margin, padding, and gap should reference the scale.
              </p>
            </div>
            <div className="p-6 rounded-2xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <SpacingSystem />
            </div>
          </section>

          {/* Radius */}
          <section id="radius">
            <div className="mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Border Radius</h2>
              <p className="text-sm mt-1 max-w-lg" style={{ color: "var(--color-text-muted)" }}>
                Radius communicates personality. Sharp corners feel precise and technical; rounded corners feel approachable and soft.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {RADIUS_VALUES.map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                  <div
                    className="h-12 mb-3 w-full"
                    style={{
                      borderRadius: value,
                      background: "rgba(124,58,237,0.15)",
                      border: "2px solid rgba(124,58,237,0.3)",
                    }}
                  />
                  <div className="text-xs font-bold" style={{ color: "var(--color-text)" }}>{label}</div>
                  <div className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
