import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

interface Part {
  name: string;
  short: string;
  size: number;
  body: string;
  top: string;
  edge: string;
}

const PALETTE: Record<string, { body: string; top: string; edge: string }> = {
  gold: { body: "#eab308", top: "#fde047", edge: "#a16207" },
  silver: { body: "#94a3b8", top: "#e2e8f0", edge: "#64748b" },
  bronze: { body: "#d97706", top: "#fbbf24", edge: "#92400e" },
  blue: { body: "#3b82f6", top: "#93c5fd", edge: "#1d4ed8" },
};

function readParts(value: unknown): Part[] {
  if (!Array.isArray(value)) return [];
  return value.map((p) => {
    const o = (p ?? {}) as Record<string, unknown>;
    const name = o.name != null ? String(o.name) : "Coin";
    const key = o.color != null ? String(o.color) : "gold";
    const pal = PALETTE[key] ?? PALETTE.gold;
    return {
      name,
      short: o.short != null ? String(o.short) : name.charAt(0).toUpperCase(),
      size: num(o.size, 1),
      ...pal,
    };
  });
}

// Ordered stacks (compositions) built from parts of fixed sizes that must sum to
// a target height. Each case is a multiset of coin counts; the count of distinct
// orderings is the multinomial coefficient (Σcᵢ)! / ∏cᵢ!, computed here — never
// trusted from data. Coins drop into real gold/silver stacks that all reach the
// target line, then the per-case orderings sum to the total.
// Data: { target, unit?, parts:[{name,short?,size,color}], cases:[{counts:[..]}] }.
export function CoinStackScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = num(data.target, 8);
  const unit = data.unit != null ? String(data.unit) : "mm";
  const parts = readParts(data.parts);
  const rawCases = Array.isArray(data.cases) ? data.cases : [];

  const cases = rawCases.map((c) => {
    const counts = Array.isArray((c as Record<string, unknown>).counts)
      ? ((c as Record<string, unknown>).counts as unknown[]).map((v) => num(v, 0))
      : [];
    const height = counts.reduce((sum, cnt, i) => sum + cnt * (parts[i]?.size ?? 0), 0);
    const nCoins = counts.reduce((a, b) => a + b, 0);
    const denom = counts.reduce((prod, cnt) => prod * factorial(cnt), 1);
    const orderings = factorial(nCoins) / denom;
    return { counts, height, nCoins, orderings, ok: height === target };
  });

  const total = cases.reduce((a, c) => a + c.orderings, 0);

  const last = totalSteps - 1;
  // Works for 2- or 3-step timelines: orderings reveal at step 1, the sum on the
  // final step (its own beat when there are 3 steps, alongside orderings at 2).
  const showOrderings = step >= 1;
  const showTotal = step >= last;
  const answer = problem.answer ?? null;

  // Geometry
  const vw = 340;
  const baseline = 100;
  const pxPerUnit = 7;
  const targetY = baseline - target * pxPerUnit;
  const half = 30;
  const cols = cases.length;
  const step0 = vw / (cols + 1);
  const colX = cases.map((_, i) => step0 * (i + 1));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${vw} 168`} width="100%" style={{ maxWidth: 480 }}>
        {/* target height line */}
        <line x1="14" y1={targetY} x2={vw - 14} y2={targetY} stroke="#16a34a" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={vw - 12} y={targetY - 5} textAnchor="end" fontSize="11" fontWeight="700" fill="#16a34a" fontFamily={numberFont}>
          {target} {unit}
        </text>

        {cases.map((c, ci) => {
          const cx = colX[ci];
          // Build coin rects bottom-to-top, larger parts at the bottom.
          const order = parts
            .map((p, i) => ({ p, i }))
            .sort((a, b) => b.p.size - a.p.size);
          const coins: { yTop: number; h: number; p: Part; k: number }[] = [];
          let yCursor = baseline;
          let k = 0;
          for (const { p, i } of order) {
            for (let n = 0; n < c.counts[i]; n++) {
              const h = p.size * pxPerUnit;
              const yTop = yCursor - h;
              coins.push({ yTop, h, p, k: k++ });
              yCursor = yTop;
            }
          }
          const countLabel = parts
            .map((p, i) => (c.counts[i] > 0 ? `${c.counts[i]}${p.short}` : null))
            .filter(Boolean)
            .join(" + ");

          return (
            <g key={ci}>
              {/* stack platform */}
              <line x1={cx - half - 2} y1={baseline} x2={cx + half + 2} y2={baseline} stroke="#cbd5e1" strokeWidth="2" />
              {coins.map((coin) => (
                <motion.g
                  key={coin.k}
                  initial={{ opacity: 0, y: -26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: ci * 0.2 + coin.k * 0.09 }}
                >
                  <rect x={cx - half} y={coin.yTop} width={half * 2} height={coin.h} rx="4" fill={coin.p.body} stroke={coin.p.edge} strokeWidth="1" />
                  <ellipse cx={cx} cy={coin.yTop} rx={half} ry="4" fill={coin.p.top} stroke={coin.p.edge} strokeWidth="0.75" />
                </motion.g>
              ))}
              {/* case combination label */}
              <text x={cx} y={baseline + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1f2a44" fontFamily={numberFont}>
                {countLabel}
              </text>
              {/* orderings */}
              <AnimatePresence>
                {showOrderings && (
                  <motion.g
                    key="ord"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 15, delay: ci * 0.15 }}
                  >
                    <rect x={cx - 34} y={baseline + 24} width="68" height="20" rx="10" fill="#eef2ff" stroke="#c7d2fe" />
                    <text x={cx} y={baseline + 38} textAnchor="middle" fontSize="12" fontWeight="800" fill="#4338ca" fontFamily={numberFont}>
                      {c.orderings} way{c.orderings === 1 ? "" : "s"}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      {/* per-case ordering formulas */}
      <AnimatePresence>
        {showOrderings && (
          <motion.div
            key="formulas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, fontFamily: numberFont, fontSize: 12.5, color: "#64748b" }}
          >
            {cases.map((c, ci) => {
              const nz = c.counts.filter((n) => n > 0);
              const label = c.orderings === 1 ? "1 way" : `${c.nCoins}! / (${nz.map((n) => `${n}!`).join(" · ")}) = ${c.orderings}`;
              return (
                <span key={ci} style={{ fontWeight: 700, color: "#4338ca" }}>
                  {label}
                </span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* total */}
      <AnimatePresence>
        {showTotal && (
          <motion.div
            key="total"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ fontFamily: numberFont, fontSize: 17, fontWeight: 800, color: "#1f2a44" }}
          >
            {cases.map((c) => c.orderings).join(" + ")} = <span style={{ color: "#4338ca" }}>{total}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTotal && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {total} stacks → Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
