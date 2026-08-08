import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const BLUE = ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"];

// Legendre: exponent of prime p in k! = ⌊k/p⌋ + ⌊k/p²⌋ + …
function vpFact(k: number, p: number): number {
  let s = 0;
  let pi = p;
  while (pi <= k) {
    s += Math.floor(k / pi);
    pi *= p;
  }
  return s;
}
// The individual ⌊k/p^i⌋ terms, for the worked example.
function vpTerms(k: number, p: number): { pow: number; term: number }[] {
  const out: { pow: number; term: number }[] = [];
  let pi = p;
  while (pi <= k) {
    out.push({ pow: pi, term: Math.floor(k / pi) });
    pi *= p;
  }
  return out;
}

interface Block {
  from: number;
  to: number;
  height: number;
  count: number;
  contribution: number;
  color: string;
  special: boolean;
}

// Sum of a Legendre staircase: how many factors of prime p are in the
// superfactorial 1!·2!·…·n! = Σ_{k=1}^{n} v_p(k!). Every height is computed with
// Legendre's formula (never asserted); equal-height runs group into blocks whose
// width×height are summed. The jump where a higher power of p kicks in (e.g. p²)
// is flagged. Data: { prime, nMax, unit? }.
export function StaircaseSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const p = num(data.prime, 7);
  const nMax = num(data.nMax, 51);
  const unit = data.unit != null ? String(data.unit) : `factors of ${p}`;

  const heights = Array.from({ length: nMax + 1 }, (_, k) => vpFact(k, p));
  const total = heights.reduce((a, b) => a + b, 0);
  const maxH = Math.max(1, ...heights);

  // group consecutive equal positive heights into blocks
  const blocks: Block[] = [];
  for (let k = 1; k <= nMax; k++) {
    const h = heights[k];
    if (h <= 0) continue;
    const prev = blocks[blocks.length - 1];
    if (prev && prev.height === h && prev.to === k - 1) {
      prev.to = k;
      prev.count += 1;
      prev.contribution += h;
    } else {
      blocks.push({ from: k, to: k, height: h, count: 1, contribution: h, color: "", special: false });
    }
  }
  blocks.forEach((b, i) => {
    b.special = i > 0 && b.height > blocks[i - 1].height + 1;
    b.color = b.special ? "#ea580c" : BLUE[i % BLUE.length];
  });

  // worked example: the smallest k where a 2nd power of p contributes (p²), else nMax
  const exK = p * p <= nMax ? p * p : nMax;
  const exTerms = vpTerms(exK, p);
  const exVal = vpFact(exK, p);

  const last = totalSteps - 1;
  const showChart = step >= 1;
  const showSum = step >= last;
  const answer = problem.answer ?? null;

  // chart geometry
  const x0 = 40;
  const x1 = 340;
  const baseline = 150;
  const topPad = 30;
  const chartW = x1 - x0;
  const barW = chartW / nMax;
  const unitPx = (baseline - topPad) / maxH;
  const bx = (k: number) => x0 + (k - 1) * barW;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      {/* Step 1: Legendre count per factorial */}
      {!showChart && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>HOW MANY {p}s IN k! ?</span>
          <div style={{ fontFamily: numberFont, fontSize: 16, fontWeight: 700, color: "#1f2a44" }}>
            v<sub>{p}</sub>(k!) = {vpTerms(nMax, p).map((t, i) => (
              <span key={i}>
                {i > 0 && " + "}⌊k/{t.pow}⌋
              </span>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: numberFont, fontSize: 16, fontWeight: 800 }}
          >
            <span style={{ color: "#64748b" }}>e.g. k={exK}:</span>
            {exTerms.map((t, i) => (
              <span key={i} style={{ color: i === exTerms.length - 1 && exTerms.length > 1 ? "#ea580c" : "#4338ca" }}>
                {i > 0 && "+ "}⌊{exK}/{t.pow}⌋={t.term}{" "}
              </span>
            ))}
            <span style={{ color: "#1f2a44" }}>= {exVal}</span>
          </motion.div>
          {exTerms.length > 1 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ fontSize: 12, color: "#ea580c", fontWeight: 700 }}
            >
              the extra ⌊k/{p * p}⌋ term is the {p}² bonus
            </motion.span>
          )}
        </div>
      )}

      {/* Steps 2-3: staircase */}
      {showChart && (
        <svg viewBox="0 0 360 176" width="100%" style={{ maxWidth: 460 }}>
          {/* axis */}
          <line x1={x0} y1={baseline} x2={x1 + 2} y2={baseline} stroke="#cbd5e1" strokeWidth="1.5" />
          {/* bars */}
          {Array.from({ length: nMax }, (_, i) => i + 1).map((k) => {
            const h = heights[k];
            if (h <= 0) return null;
            const blk = blocks.find((b) => k >= b.from && k <= b.to)!;
            const hpx = h * unitPx;
            return (
              <motion.rect
                key={k}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: (k / nMax) * 0.5 }}
                x={bx(k) + 0.4}
                y={baseline - hpx}
                width={Math.max(1, barW - 0.8)}
                height={hpx}
                rx={0.8}
                fill={blk.color}
                style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
              />
            );
          })}

          {/* x ticks at block starts */}
          {blocks.map((b, i) => (
            <text key={i} x={bx(b.from) + barW / 2} y={baseline + 12} textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily={numberFont}>
              {b.from}
            </text>
          ))}
          <text x={x1} y={baseline + 12} textAnchor="middle" fontSize="8.5" fill="#94a3b8" fontFamily={numberFont}>
            {nMax}
          </text>

          {/* height labels atop each block plateau */}
          {blocks.map((b, i) => (
            <text
              key={i}
              x={bx(Math.floor((b.from + b.to) / 2)) + barW / 2}
              y={baseline - b.height * unitPx - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill={b.color}
              fontFamily={numberFont}
            >
              {b.height}
            </text>
          ))}

          {/* special-jump callout */}
          {blocks.filter((b) => b.special).map((b, i) => (
            <text key={i} x={bx(b.from) + barW / 2} y={baseline - b.height * unitPx - 16} textAnchor="middle" fontSize="9" fontWeight="700" fill="#ea580c" fontFamily={numberFont}>
              {b.from}={p}² +2↑
            </text>
          ))}
        </svg>
      )}

      {/* sum by blocks */}
      <AnimatePresence>
        {showSum && (
          <motion.div
            key="sum"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 4, fontFamily: numberFont, fontSize: 15, fontWeight: 800 }}
          >
            {blocks.map((b, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {i > 0 && <span style={{ color: "#94a3b8" }}>+</span>}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 + i * 0.09 }}
                  title={`${b.count} × ${b.height}`}
                  style={{ color: b.color }}
                >
                  {b.contribution}
                </motion.span>
              </span>
            ))}
            <span style={{ color: "#94a3b8" }}>=</span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.1 + blocks.length * 0.09 }}
              style={{ color: "#16a34a" }}
            >
              {total}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSum && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 + blocks.length * 0.09 + 0.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {total} {unit} → Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
