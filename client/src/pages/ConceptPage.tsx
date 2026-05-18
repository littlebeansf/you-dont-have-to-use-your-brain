import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import { concepts, CATEGORY_META } from "@/data/concepts";

// ── DEMOS ─────────────────────────────────────────────────

function CognitiveLoadDemo() {
  const [version, setVersion] = useState<"bad" | "good">("bad");
  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Compare two forms for the same task. See how label clarity affects comprehension.
      </p>
      <div className="flex gap-2 mb-4">
        {(["bad", "good"] as const).map(v => (
          <button key={v} onClick={() => setVersion(v)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: version === v ? (v === "good" ? "#059669" : "#dc2626") : "var(--color-surface-2)", color: version === v ? "white" : "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
            {v === "good" ? "✓ Good Design" : "✗ Poor Design"}
          </button>
        ))}
      </div>
      <div className="p-5 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {version === "bad" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Billing Domicile *</label>
              <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }} placeholder="Enter value" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Postal Identification Code</label>
              <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }} placeholder="Enter value" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Financial Instrument Expiry</label>
              <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }} placeholder="Enter value" />
            </div>
            <div className="p-2 rounded text-xs" style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626" }}>
              ⚠ Users have to stop and think about what every field means
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>Home Address <span style={{ color: "#dc2626" }}>*</span></label>
              <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#059669", background: "var(--color-bg)" }} placeholder="123 Main Street" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>ZIP / Postal Code <span style={{ color: "var(--color-text-muted)" }}>(optional)</span></label>
              <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }} placeholder="10001" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>Card Expiry Date <span style={{ color: "#dc2626" }}>*</span></label>
              <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }} placeholder="MM / YY" />
            </div>
            <div className="p-2 rounded text-xs" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
              ✓ Every field is instantly understood — zero mental effort
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FittsLawDemo() {
  const [clicks, setClicks] = useState<{ time: number; size: number; dist: number }[]>([]);
  const [target, setTarget] = useState({ size: 60, dist: 0, x: 50, y: 50 });
  const [startTime, setStartTime] = useState<number>(0);
  const [waiting, setWaiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizes = [16, 32, 60];
  const [currentSize, setCurrentSize] = useState(0);

  const newTarget = useCallback((size: number) => {
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    setTarget({ size, x, y, dist: Math.round(Math.sqrt(x*x+y*y)) });
    setStartTime(Date.now());
    setWaiting(false);
  }, []);

  const handleStart = () => {
    setClicks([]);
    setCurrentSize(0);
    newTarget(sizes[0]);
    setWaiting(true);
  };

  const handleClick = () => {
    if (!waiting) return;
    const elapsed = Date.now() - startTime;
    const newClicks = [...clicks, { time: elapsed, size: target.size, dist: target.dist }];
    setClicks(newClicks);
    const next = currentSize + 1;
    if (next < sizes.length) {
      setCurrentSize(next);
      setTimeout(() => newTarget(sizes[next]), 300);
    } else {
      setWaiting(false);
    }
  };

  const done = clicks.length === sizes.length;

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Click the target as fast as you can. Three targets — three sizes. See how size affects reaction time.
      </p>
      {!waiting && !done && (
        <button onClick={handleStart} className="mb-4 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>
          Start the test →
        </button>
      )}
      {waiting && (
        <div
          ref={containerRef}
          onClick={handleClick}
          className="relative rounded-xl border cursor-crosshair select-none"
          style={{ height: "200px", background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div
            onClick={handleClick}
            className="absolute rounded-full flex items-center justify-center text-white font-bold text-xs transition-all"
            style={{
              width: `${target.size}px`,
              height: `${target.size}px`,
              left: `calc(${target.x}% - ${target.size/2}px)`,
              top: `calc(${target.y}% - ${target.size/2}px)`,
              background: target.size === 16 ? "#dc2626" : target.size === 32 ? "#d97706" : "#059669",
            }}
          >
            {target.size === 16 ? "tiny" : target.size === 32 ? "mid" : "big"}
          </div>
          <div className="absolute bottom-2 left-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Click {3 - clicks.length} more target{3 - clicks.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
      {done && (
        <div className="space-y-2">
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text)" }}>Your results:</p>
          {clicks.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <div className="rounded-full flex-shrink-0" style={{ width: `${Math.min(c.size, 40)}px`, height: `${Math.min(c.size, 40)}px`, background: c.size === 16 ? "#dc2626" : c.size === 32 ? "#d97706" : "#059669" }} />
              <div>
                <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{c.size}px target → </span>
                <span className="text-xs font-bold" style={{ color: c.size === 16 ? "#dc2626" : c.size === 32 ? "#d97706" : "#059669" }}>{c.time}ms</span>
              </div>
            </div>
          ))}
          <p className="text-xs mt-2 pt-2 border-t" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>
            The larger the target, the faster you clicked it. That's Fitts's Law in your hands.
          </p>
          <button onClick={handleStart} className="text-xs font-medium" style={{ color: "var(--color-primary)" }}>Try again →</button>
        </div>
      )}
    </div>
  );
}

function HicksLawDemo() {
  const [choiceCount, setChoiceCount] = useState(5);
  const [timing, setTiming] = useState<{ count: number; ms: number }[]>([]);
  const [started, setStarted] = useState(false);
  const [target, setTarget] = useState("");
  const [startT, setStartT] = useState(0);
  const itemPool = ["Settings", "Help", "Profile", "Messages", "Notifications", "Dashboard", "Reports", "Billing", "Integrations", "Security", "Analytics", "Export", "Import", "Logs", "Backup", "API Keys", "Webhooks", "Team", "Roles", "Audit", "Support", "Feedback", "Changelog", "Status", "Docs", "Community", "Pricing", "Upgrade", "Download", "Logout", "About", "Privacy", "Terms", "Contact", "Blog", "Careers", "Partners", "Affiliates", "Press", "Investors"];

  const startRound = (count: number) => {
    setChoiceCount(count);
    setStarted(true);
    setTarget("Settings");
    setStartT(Date.now());
  };

  const handlePick = (item: string) => {
    if (!started) return;
    if (item === target) {
      const elapsed = Date.now() - startT;
      setTiming(prev => [...prev, { count: choiceCount, ms: elapsed }]);
      setStarted(false);
    }
  };

  const counts = [5, 15, 40];
  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Find "Settings" in each menu. Notice how adding options slows your decision.
      </p>
      {!started ? (
        <div className="space-y-2">
          {counts.map(c => {
            const r = timing.find(t => t.count === c);
            return (
              <button key={c} onClick={() => startRound(c)} disabled={!!r}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--color-border)", background: r ? "rgba(5,150,105,0.08)" : "var(--color-surface)", color: "var(--color-text)" }}>
                <span>{c} options</span>
                {r ? <span className="text-xs font-bold" style={{ color: "#059669" }}>{r.ms}ms ✓</span> : <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Start →</span>}
              </button>
            );
          })}
          {timing.length === counts.length && (
            <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", color: "var(--color-text-muted)" }}>
              With {timing[0].count} items: <strong>{timing[0].ms}ms</strong> → With {timing[2].count} items: <strong>{timing[2].ms}ms</strong>. Hick's Law in action.
              <button onClick={() => setTiming([])} className="ml-3 font-medium" style={{ color: "var(--color-primary)" }}>Reset</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs mb-3 font-medium" style={{ color: "var(--color-text)" }}>
            Find: <span style={{ color: "var(--color-primary)" }}>Settings</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
            {itemPool.slice(0, choiceCount).map(item => (
              <button key={item} onClick={() => handlePick(item)}
                className="px-3 py-2 rounded-lg text-xs border text-left transition-all hover:border-primary hover:-translate-y-0.5"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)" }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MillersLawDemo() {
  const [phase, setPhase] = useState<"show" | "recall" | "result">("show");
  const [version, setVersion] = useState<"flat" | "chunked">("flat");
  const [input, setInput] = useState("");
  const digits = "4739215836482901";
  const chunked = "4739 2158 3648 2901";
  const [results, setResults] = useState<{ flat?: boolean; chunked?: boolean }>({});
  const [timer, setTimer] = useState(3);

  const start = (v: "flat" | "chunked") => {
    setVersion(v);
    setPhase("show");
    setInput("");
    setTimer(3);
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          setPhase("recall");
          return 3;
        }
        return t - 1;
      });
    }, 1000);
  };

  const check = () => {
    const answer = input.replace(/\s/g, "");
    const correct = answer === digits;
    setResults(prev => ({ ...prev, [version]: correct }));
    setPhase("result");
  };

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Memorize a 16-digit number — once flat, once chunked. See which is easier to recall.
      </p>
      {phase === "show" && (
        <div className="p-5 rounded-xl text-center border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>Memorize for {timer}s:</p>
          <p className="text-2xl font-bold tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text)" }}>
            {version === "flat" ? digits : chunked}
          </p>
        </div>
      )}
      {phase === "recall" && (
        <div className="p-5 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>Type what you remember:</p>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter the digits..."
            className="w-full px-3 py-2 rounded-lg border text-sm mb-3"
            style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)", fontFamily: "var(--font-mono)" }} />
          <button onClick={check} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>
            Check answer
          </button>
        </div>
      )}
      {phase === "result" && (
        <div>
          <div className="p-4 rounded-xl border mb-3" style={{ background: results[version] ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)", borderColor: results[version] ? "#059669" : "#dc2626" }}>
            <p className="text-sm font-semibold" style={{ color: results[version] ? "#059669" : "#dc2626" }}>
              {results[version] ? "✓ Correct!" : "✗ Not quite"} ({version === "flat" ? "Flat format" : "Chunked format"})
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>The number was: <strong style={{ fontFamily: "var(--font-mono)" }}>{chunked}</strong></p>
          </div>
          <div className="flex gap-2">
            {!results.flat && <button onClick={() => start("flat")} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>Try flat</button>}
            {!results.chunked && <button onClick={() => start("chunked")} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>Try chunked</button>}
          </div>
          {results.flat !== undefined && results.chunked !== undefined && (
            <p className="text-xs mt-3 p-3 rounded-lg" style={{ background: "rgba(124,58,237,0.08)", color: "var(--color-text-muted)", border: "1px solid rgba(124,58,237,0.15)" }}>
              {results.chunked && !results.flat ? "Chunked format helped you succeed where flat format failed — Miller's Law demonstrated." : results.flat && results.chunked ? "You nailed both! But most people find chunked significantly easier." : "Chunking reduces the number of items in working memory, even when the total information is identical."}
            </p>
          )}
        </div>
      )}
      {phase !== "show" && phase !== "recall" || phase === "result" ? null : null}
      {phase !== "show" && phase !== "recall" ? null : null}
      {(phase === "result" || phase === "show") && phase !== "show" ? null : null}
      {phase !== "show" && (
        <div className="mt-2" />
      )}
      {phase === "show" && (
        <p className="text-xs mt-2 text-center" style={{ color: "var(--color-text-faint)" }}>
          {version === "flat" ? "Flat format — 16 individual digits" : "Chunked format — 4 groups of 4"}
        </p>
      )}
      {!("flat" in results || "chunked" in results) && phase !== "show" && phase !== "recall" && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => start("flat")} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "var(--color-primary)", color: "white" }}>Try flat first</button>
          <button onClick={() => start("chunked")} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>Try chunked first</button>
        </div>
      )}
      {!Object.keys(results).length && phase !== "show" && phase !== "recall" && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => start("flat")} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "var(--color-primary)", color: "white" }}>Try flat first</button>
          <button onClick={() => start("chunked")} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>Try chunked first</button>
        </div>
      )}
      {!Object.keys(results).length && phase !== "show" && phase !== "recall" && phase !== "result" && (
        <div className="flex gap-2 mt-2">
          <button onClick={() => start("flat")} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "var(--color-primary)", color: "white" }}>Start →</button>
        </div>
      )}
      {phase !== "show" && phase !== "recall" && phase !== "result" && (
        <button onClick={() => start("flat")} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Start →</button>
      )}
    </div>
  );
}

function MillersLawDemoClean() {
  const [phase, setPhase] = useState<"idle" | "show" | "recall" | "result">("idle");
  const [version, setVersion] = useState<"flat" | "chunked">("flat");
  const [input, setInput] = useState("");
  const digits = "4739215836482901";
  const chunked = "4739 2158 3648 2901";
  const [results, setResults] = useState<{ flat?: boolean; chunked?: boolean }>({});
  const [timer, setTimer] = useState(3);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const start = (v: "flat" | "chunked") => {
    setVersion(v);
    setPhase("show");
    setInput("");
    setTimer(3);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase("recall");
          return 3;
        }
        return t - 1;
      });
    }, 1000);
  };

  const check = () => {
    const correct = input.replace(/\s/g, "") === digits;
    setResults(prev => ({ ...prev, [version]: correct }));
    setPhase("result");
  };

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Memorize a 16-digit number — once flat, once chunked. Which format sticks better?
      </p>
      {phase === "idle" && (
        <div className="flex gap-2">
          <button onClick={() => start("flat")} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#dc2626" }}>
            Try flat format
          </button>
          <button onClick={() => start("chunked")} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "#059669" }}>
            Try chunked format
          </button>
        </div>
      )}
      {phase === "show" && (
        <div className="p-5 rounded-xl text-center border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>Memorize in {timer}s ({version}):</p>
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text)", letterSpacing: version === "flat" ? "0.1em" : "0.2em" }}>
            {version === "flat" ? digits : chunked}
          </p>
        </div>
      )}
      {phase === "recall" && (
        <div className="p-5 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text)" }}>What were the digits?</p>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type from memory..."
            className="w-full px-3 py-2 rounded-lg border text-sm mb-3"
            style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }} />
          <button onClick={check} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Check →</button>
        </div>
      )}
      {phase === "result" && (
        <div>
          <div className="p-4 rounded-xl border mb-3" style={{
            background: results[version] ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
            borderColor: results[version] ? "#059669" : "#dc2626"
          }}>
            <p className="text-sm font-semibold" style={{ color: results[version] ? "#059669" : "#dc2626" }}>
              {results[version] ? "✓ Correct!" : "✗ Not quite"} ({version} format)
            </p>
            <p className="text-xs mt-1 font-mono" style={{ color: "var(--color-text-muted)" }}>Answer: {chunked}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {!("flat" in results) && <button onClick={() => start("flat")} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#dc262618", color: "#dc2626", border: "1px solid #dc262630" }}>Try flat</button>}
            {!("chunked" in results) && <button onClick={() => start("chunked")} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#05966918", color: "#059669", border: "1px solid #05966930" }}>Try chunked</button>}
            {Object.keys(results).length === 2 && (
              <button onClick={() => { setResults({}); setPhase("idle"); }} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>Reset</button>
            )}
          </div>
          {Object.keys(results).length === 2 && (
            <p className="text-xs mt-3 p-3 rounded-lg" style={{ background: "rgba(124,58,237,0.08)", color: "var(--color-text-muted)", border: "1px solid rgba(124,58,237,0.15)" }}>
              {results.chunked && !results.flat
                ? "🧠 Chunking helped — same digits, but your brain handled them as 4 items instead of 16."
                : results.flat && results.chunked
                ? "Both correct! Most people still find chunked significantly easier under pressure."
                : "Chunking reduces working memory load even when the information content is identical."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ProximityDemo() {
  const [spacing, setSpacing] = useState(8);
  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Drag the spacing slider. Watch how the perceived grouping of form labels changes.
      </p>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Tight</span>
        <input type="range" min={2} max={32} value={spacing} onChange={e => setSpacing(+e.target.value)} className="flex-1" />
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Loose</span>
        <span className="text-xs font-mono w-8 text-right" style={{ color: "var(--color-primary)" }}>{spacing}px</span>
      </div>
      <div className="p-5 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {[["First Name", "Last Name"], ["Email Address", "Phone Number"]].map(([a, b], gi) => (
          <div key={gi} style={{ marginBottom: gi === 0 ? `${spacing * 3}px` : 0 }}>
            <div style={{ marginBottom: `${spacing}px` }}>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--color-text)", marginBottom: `${Math.max(spacing / 3, 3)}px` }}>{a}</div>
              <div className="h-8 rounded-lg border" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }} />
            </div>
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--color-text)", marginBottom: `${Math.max(spacing / 3, 3)}px` }}>{b}</div>
              <div className="h-8 rounded-lg border" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
        {spacing <= 8 ? "🔴 Low spacing: fields blend together — grouping is ambiguous" :
         spacing <= 16 ? "🟡 Medium spacing: some grouping visible but not clear" :
         "🟢 High spacing: two distinct form sections emerge naturally"}
      </p>
    </div>
  );
}

function FeedbackDemo() {
  const [mode, setMode] = useState<"none" | "good">("none");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = () => {
    if (mode === "none") return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1400);
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Toggle feedback and click the button. Notice how the absence of feedback creates uncertainty.
      </p>
      <div className="flex gap-2 mb-5">
        {(["none", "good"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setStatus("idle"); }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{ background: mode === m ? (m === "good" ? "rgba(5,150,105,0.1)" : "rgba(220,38,38,0.1)") : "transparent", borderColor: mode === m ? (m === "good" ? "#059669" : "#dc2626") : "var(--color-border)", color: mode === m ? (m === "good" ? "#059669" : "#dc2626") : "var(--color-text-muted)" }}>
            {m === "good" ? "✓ With feedback" : "✗ No feedback"}
          </button>
        ))}
      </div>
      <div className="p-6 rounded-xl border flex flex-col items-center gap-3" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <button
          onClick={handleClick}
          disabled={status === "loading"}
          className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all"
          style={{
            background: status === "done" && mode === "good" ? "#059669" : "var(--color-primary)",
            opacity: mode === "none" && status !== "idle" ? 1 : 1,
            transform: status === "loading" && mode === "none" ? "none" : undefined,
          }}
        >
          {mode === "none"
            ? "Submit Form"
            : status === "idle" ? "Submit Form"
            : status === "loading" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Saving…
              </span>
            ) : "✓ Saved!"}
        </button>
        {mode === "none" && status === "idle" && (
          <p className="text-xs text-center" style={{ color: "var(--color-text-faint)" }}>Click it… did it work? Click again?</p>
        )}
        {mode === "none" && (
          <p className="text-xs text-center" style={{ color: "var(--color-text-faint)" }}>The button looks identical no matter what happened. You have no idea if it worked.</p>
        )}
        {mode === "good" && status === "done" && (
          <p className="text-xs text-center" style={{ color: "#059669" }}>✓ Saved successfully — no doubt, no anxiety.</p>
        )}
      </div>
    </div>
  );
}

function AffordancesDemo() {
  const [clicks, setClicks] = useState<string[]>([]);
  const items = [
    { id: "btn-raised", label: "Save Changes", type: "button", style: { padding: "10px 20px", borderRadius: "8px", background: "var(--color-primary)", color: "white", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 6px rgba(124,58,237,0.4)" }, clickable: true },
    { id: "txt-heading", label: "User Profile", type: "heading", style: { fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--color-text)" }, clickable: false },
    { id: "link-edit", label: "Edit details", type: "link", style: { color: "var(--color-primary)", textDecoration: "underline", cursor: "pointer" }, clickable: true },
    { id: "badge-status", label: "Active", type: "badge", style: { padding: "3px 10px", borderRadius: "99px", background: "rgba(5,150,105,0.12)", color: "#059669", fontSize: "12px", fontWeight: 500 }, clickable: false },
    { id: "ghost-btn", label: "Cancel", type: "ghost button", style: { padding: "10px 20px", borderRadius: "8px", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", cursor: "pointer" }, clickable: true },
    { id: "txt-body", label: "Last updated 2 days ago", type: "metadata", style: { fontSize: "12px", color: "var(--color-text-faint)" }, clickable: false },
  ];

  const handleClick = (id: string) => {
    setClicks(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const correct = items.filter(i => i.clickable).map(i => i.id);
  const wrongClicks = clicks.filter(c => items.find(i => i.id === c && !i.clickable));

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        Click every element you think is interactive. Discover which have clear affordances.
      </p>
      <div className="p-5 rounded-xl border space-y-3" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <span
              data-testid={`affordance-${item.id}`}
              onClick={() => handleClick(item.id)}
              style={{ ...item.style as any, userSelect: "none" }}
            >
              {item.label}
            </span>
            {clicks.includes(item.id) && (
              <span className="text-xs font-medium ml-2" style={{ color: item.clickable ? "#059669" : "#dc2626" }}>
                {item.clickable ? "✓ Correct" : "✗ Not interactive"}
              </span>
            )}
          </div>
        ))}
      </div>
      {clicks.length > 0 && (
        <div className="mt-3 text-xs p-3 rounded-lg" style={{ background: wrongClicks.length ? "rgba(220,38,38,0.08)" : "rgba(5,150,105,0.08)", border: `1px solid ${wrongClicks.length ? "#dc262630" : "#05966930"}`, color: "var(--color-text-muted)" }}>
          {wrongClicks.length > 0
            ? `Clicked ${wrongClicks.length} non-interactive element${wrongClicks.length > 1 ? "s" : ""} — this is an affordance failure.`
            : clicks.length === correct.length
            ? "✓ Perfect — you correctly identified all interactive elements."
            : `Good — ${clicks.filter(c => correct.includes(c)).length} of ${correct.length} clickable elements found so far.`}
        </div>
      )}
      {clicks.length > 0 && <button onClick={() => setClicks([])} className="text-xs mt-2" style={{ color: "var(--color-primary)" }}>Reset →</button>}
    </div>
  );
}

function GenericDemo({ concept }: { concept: typeof concepts[0] }) {
  return (
    <div className="p-5 rounded-xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: `${concept.color}18` }}>💡</div>
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>Demo Concept</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{concept.demo_idea}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg" style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#059669" }}>✓ Good example</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)", lineHeight: 1.5 }}>{concept.good_example.split(" ").slice(0, 20).join(" ")}…</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#dc2626" }}>✗ Bad example</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)", lineHeight: 1.5 }}>{concept.bad_example.split(" ").slice(0, 20).join(" ")}…</p>
        </div>
      </div>
    </div>
  );
}

function getDemoComponent(id: string, concept: typeof concepts[0]) {
  switch (id) {
    case "cognitive-load": return <CognitiveLoadDemo />;
    case "fitts-law": return <FittsLawDemo />;
    case "hicks-law": return <HicksLawDemo />;
    case "millers-law": return <MillersLawDemoClean />;
    case "proximity": return <ProximityDemo />;
    case "feedback": return <FeedbackDemo />;
    case "affordances": return <AffordancesDemo />;
    default: return <GenericDemo concept={concept} />;
  }
}

// ── MAIN PAGE ─────────────────────────────────────────────

export default function ConceptPage() {
  const { id } = useParams<{ id: string }>();
  const concept = concepts.find(c => c.id === id);

  if (!concept) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>Concept not found</p>
          <Link href="/library"><span className="text-sm mt-2 block" style={{ color: "var(--color-primary)" }}>← Back to Library</span></Link>
        </div>
      </Layout>
    );
  }

  const catMeta = CATEGORY_META[concept.category];
  const currentIdx = concepts.findIndex(c => c.id === id);
  const prev = concepts[currentIdx - 1];
  const next = concepts[currentIdx + 1];

  const sourceKey = concept.source;
  const sourceShort = sourceKey.split(" — ")[0];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/"><span className="hover:underline cursor-pointer">Home</span></Link>
          <span>/</span>
          <Link href="/library"><span className="hover:underline cursor-pointer">Library</span></Link>
          <span>/</span>
          <span style={{ color: "var(--color-text)" }}>{concept.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          {/* Category + source */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="tag" style={{ background: `${concept.color}18`, color: concept.color }}>
              {catMeta.emoji} {catMeta.label}
            </span>
            <span className="tag" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
              📖 {sourceShort}
            </span>
          </div>

          {/* Color accent */}
          <div className="w-12 h-1.5 rounded-full mb-5" style={{ background: concept.color }} />

          <h1
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text)",
            }}
          >
            {concept.name}
          </h1>
          <p className="text-lg italic" style={{ color: concept.color }}>
            "{concept.tagline}"
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Definition */}
            <section className="p-6 rounded-2xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-body)" }}>
                Definition
              </h2>
              <p style={{ color: "var(--color-text)", lineHeight: 1.75, fontSize: "var(--text-base)" }}>
                {concept.definition}
              </p>
            </section>

            {/* Why it matters */}
            <section
              className="p-6 rounded-2xl border"
              style={{
                background: `linear-gradient(135deg, ${concept.color}08, ${concept.color}04)`,
                borderColor: `${concept.color}30`,
              }}
            >
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: concept.color, fontFamily: "var(--font-body)", opacity: 0.8 }}>
                Why it matters
              </h2>
              <p style={{ color: "var(--color-text)", lineHeight: 1.75 }}>
                {concept.why_it_matters}
              </p>
            </section>

            {/* Interactive Demo */}
            <section className="p-6 rounded-2xl border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs" style={{ background: concept.color, color: "white" }}>⚡</div>
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-body)" }}>
                  Interactive Demo
                </h2>
              </div>
              {getDemoComponent(concept.id, concept)}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Good example */}
            <div className="p-4 rounded-xl" style={{ background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)" }}>
              <h3 className="text-xs font-bold mb-2" style={{ color: "#059669" }}>✓ Good Example</h3>
              <p className="text-sm" style={{ color: "var(--color-text)", lineHeight: 1.6 }}>{concept.good_example}</p>
            </div>

            {/* Bad example */}
            <div className="p-4 rounded-xl" style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)" }}>
              <h3 className="text-xs font-bold mb-2" style={{ color: "#dc2626" }}>✗ Bad Example</h3>
              <p className="text-sm" style={{ color: "var(--color-text)", lineHeight: 1.6 }}>{concept.bad_example}</p>
            </div>

            {/* Source */}
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <h3 className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--color-text-faint)" }}>Source</h3>
              <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{concept.source}</p>
            </div>

            {/* Related category */}
            <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <h3 className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: "var(--color-text-faint)" }}>Category</h3>
              <Link href={`/library?category=${concept.category}`}>
                <span className="text-sm font-medium flex items-center gap-1.5 hover:underline cursor-pointer" style={{ color: "var(--color-primary)" }}>
                  {catMeta.emoji} {catMeta.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{catMeta.description}</p>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="grid grid-cols-2 gap-3 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          {prev ? (
            <Link href={`/concept/${prev.id}`}>
              <div data-testid="nav-prev" className="group p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <div className="text-xs mb-1 flex items-center gap-1" style={{ color: "var(--color-text-faint)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Previous
                </div>
                <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{prev.name}</div>
              </div>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/concept/${next.id}`}>
              <div data-testid="nav-next" className="group p-4 rounded-xl border cursor-pointer text-right transition-all hover:-translate-y-0.5" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <div className="text-xs mb-1 flex items-center justify-end gap-1" style={{ color: "var(--color-text-faint)" }}>
                  Next
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{next.name}</div>
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </Layout>
  );
}
