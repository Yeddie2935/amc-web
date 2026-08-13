import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const LOW = "#4338ca";
const HIGH = "#0d9488";
const PALE = "#eef2ff";
const BAD = "#dc2626";
const WIN = "#16a34a";

/**
 * Numbers that split into pairs a fixed gap apart, where a rule forbids taking
 * both of a pair. Taking as many numbers as there are pairs forces exactly one
 * from every pair, so the total is the sum of the low members plus the gap once
 * for each high pick — the same whichever picks you make. The scene shows two
 * different valid selections landing on the same total, and computes each
 * selection's sum from the tiles rather than trusting the formula.
 * Data: { n, gap, highCount, examples:[[pairIdx,...],[...]] }.
 */
export function PairedChoiceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(1, Math.round(num(data.n, 10)));
  const gap = num(data.gap, 10);
  const highCount = Math.max(0, Math.round(num(data.highCount, Math.floor(n / 2))));
  const examples: number[][] = Array.isArray(data.examples)
    ? data.examples.map((e) => (Array.isArray(e) ? e.map((v) => Math.round(num(v, 0))) : []))
    : [];

  const baseSum = (n * (n + 1)) / 2;
  const predicted = baseSum + gap * highCount;
  // each example's sum, added up from the tiles it actually selects
  const sumOf = (highs: number[]) => {
    const H = new Set(highs);
    let s = 0;
    for (let k = 1; k <= n; k++) s += H.has(k) ? k + gap : k;
    return s;
  };
  const exSums = examples.map(sumOf);
  const allAgree = exSums.every((s) => s === predicted);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const exIdx = isFinal ? Math.min(1, examples.length - 1) : step >= 2 ? 0 : -1;
  const highs = exIdx >= 0 ? new Set(examples[exIdx] ?? []) : null;
  const showRule = step >= 1 || isFinal;

  // ---- geometry ----
  const tw = 26;
  const cgap = 5;
  const W = 20 + n * (tw + cgap) - cgap;
  const x0 = 10;
  const topY = 32;
  const botY = 72;
  const th = 24;
  const H = 112;
  const cx = (i: number) => x0 + i * (tw + cgap);

  // one column used to illustrate the forbidden "both" pick
  const banned = 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 420 }}>
        {Array.from({ length: n }).map((_, i) => {
          const k = i + 1;
          const isHigh = highs?.has(k) ?? false;
          const picked = highs != null;
          const lowOn = picked && !isHigh;
          const highOn = picked && isHigh;
          const isBanned = showRule && !picked && i === banned;
          return (
            <g key={i}>
              {/* the link that makes them a pair */}
              <line x1={cx(i) + tw / 2} y1={topY + th} x2={cx(i) + tw / 2} y2={botY} stroke="#cbd5e1" strokeWidth={1.6} />

              {/* low member */}
              <motion.rect
                x={cx(i)}
                y={topY}
                width={tw}
                height={th}
                rx={5}
                animate={{ fill: lowOn ? LOW : PALE, stroke: lowOn ? LOW : "#c7d2fe" }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                strokeWidth={1.4}
              />
              <text x={cx(i) + tw / 2} y={topY + 16} textAnchor="middle" fontSize="12" fontWeight="800" fill={lowOn ? "#fff" : INK} fontFamily={numberFont}>
                {k}
              </text>

              {/* high member */}
              <motion.rect
                x={cx(i)}
                y={botY}
                width={tw}
                height={th}
                rx={5}
                animate={{ fill: highOn ? HIGH : PALE, stroke: highOn ? HIGH : "#c7d2fe" }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                strokeWidth={1.4}
              />
              <text x={cx(i) + tw / 2} y={botY + 16} textAnchor="middle" fontSize="12" fontWeight="800" fill={highOn ? "#fff" : INK} fontFamily={numberFont}>
                {k + gap}
              </text>

              {/* taking both from one column is what the rule forbids */}
              <AnimatePresence>
                {isBanned && (
                  <motion.g key="ban" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={cx(i) - 3} y={topY - 3} width={tw + 6} height={botY + th - topY + 6} rx={7} fill="none" stroke={BAD} strokeWidth={2} />
                    <line x1={cx(i) - 1} y1={topY - 1} x2={cx(i) + tw + 1} y2={botY + th + 1} stroke={BAD} strokeWidth={2} />
                    <line x1={cx(i) + tw + 1} y1={topY - 1} x2={cx(i) - 1} y2={botY + th + 1} stroke={BAD} strokeWidth={2} />
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* the gap that defines a pair */}
        <text x={W - 4} y={(topY + botY) / 2 + 12} textAnchor="end" fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          +{gap}
        </text>
      </svg>

      {/* caption */}
      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : exIdx >= 0 ? "#4338ca" : showRule ? "#b91c1c" : "#4338ca",
          background: isFinal ? "#dcfce7" : exIdx >= 0 ? "#eef2ff" : showRule ? "#fef2f2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : exIdx >= 0 ? "#c7d2fe" : showRule ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {exIdx < 0 && !showRule
          ? `the ${2 * n} numbers form ${n} pairs, ${gap} apart`
          : exIdx < 0
          ? `never both from one pair — so ${n} picks means one from every pair`
          : exIdx === 0
          ? `one way: ${baseSum} + ${gap} × ${highCount} = ${exSums[0]}`
          : `a different way — still ${baseSum} + ${gap} × ${highCount} = ${exSums[exIdx]}`}
      </motion.span>

      <AnimatePresence>
        {exIdx >= 0 && (
          <motion.span
            key={`sum-${exIdx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {highCount} taken from the bottom row, {n - highCount} from the top — the total never moves
          </motion.span>
        )}
      </AnimatePresence>

      {!allAgree && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: BAD }}>
          an example does not match the predicted total
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
