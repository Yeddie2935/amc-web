import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const AMBER = "#b45309";
const BAD = "#dc2626";

/**
 * Three boxes weighed two at a time, in every possible pairing — a triangle
 * of vertices (the boxes) and edges (the pair weighings). Summing all three
 * edge weights counts every vertex exactly twice, since each box sits on
 * exactly two of the three edges — the scene highlights one vertex's two
 * incident edges to make that double-counting visible, then halves the
 * total edge sum to recover the real combined weight.
 * Data: { pairWeights:[122,125,127] }.
 */
export function PairwiseBoxWeighScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pairWeights = (Array.isArray(data.pairWeights) ? data.pairWeights : [122, 125, 127]).map((v) => Math.max(1, Math.round(num(v, 0))));
  const [wAB, wBC, wAC] = [pairWeights[0] ?? 0, pairWeights[1] ?? 0, pairWeights[2] ?? 0];

  const sum = wAB + wBC + wAC;
  const total = sum / 2;
  const evenOk = sum % 2 === 0;
  const matches = problem.shortAnswer == null || String(total) === String(problem.shortAnswer);
  const failure = !evenOk ? `check failed: ${sum} is not even, cannot halve cleanly` : !matches ? `check failed: ${sum} ÷ 2 = ${total}, stored answer is ${problem.shortAnswer}` : "";

  const listedChoice = (problem.choices ?? []).find((c) => c.text.trim() === String(sum));

  const lastStep = totalSteps - 1;
  const showWeights = step >= 1;
  const showSum = step >= 2;
  const showDouble = step === 3;
  const isFinal = step >= lastStep;

  // ---- geometry: a triangle of three boxes ----
  const W = 260;
  const H = 220;
  const cx = W / 2;
  const cy = 100;
  const R = 70;
  const A = { x: cx, y: cy - R };
  const B = { x: cx - R * 0.87, y: cy + R * 0.5 };
  const C = { x: cx + R * 0.87, y: cy + R * 0.5 };
  const mid = (P: typeof A, Q: typeof A) => ({ x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 });

  const caption = isFinal
    ? `${sum} ÷ 2 = ${total} lb`
    : showDouble
    ? `box A sits on both edges shown — every box appears in exactly 2 weighings`
    : showSum
    ? `${wAB} + ${wBC} + ${wAC} = ${sum}${listedChoice ? ` — choice ${listedChoice.label}, but that's twice the real weight` : ", but no box weighs that much alone"}`
    : showWeights
    ? `the three pairings weigh ${wAB}, ${wBC}, ${wAC} lb`
    : `three boxes, weighed two at a time`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        {/* the three edges (pair weighings) */}
        {[
          { P: A, Q: B, w: wAB, hl: showDouble },
          { P: B, Q: C, w: wBC, hl: false },
          { P: C, Q: A, w: wAC, hl: showDouble },
        ].map((e, i) => (
          <g key={i}>
            <line x1={e.P.x} y1={e.P.y} x2={e.Q.x} y2={e.Q.y} stroke={e.hl ? AMBER : "#94a3b8"} strokeWidth={e.hl ? 3 : 1.6} />
            <AnimatePresence>
              {showWeights && (
                <motion.g key={`w${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={mid(e.P, e.Q).x - 16} y={mid(e.P, e.Q).y - 10} width={32} height={16} rx={5} fill={e.hl ? "#fef3c7" : "#eef2ff"} stroke={e.hl ? AMBER : IND} strokeWidth={1.2} />
                  <text x={mid(e.P, e.Q).x} y={mid(e.P, e.Q).y + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill={e.hl ? AMBER : IND} fontFamily={numberFont}>
                    {e.w}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        ))}

        {/* the three boxes */}
        {[
          { p: A, label: "A" },
          { p: B, label: "B" },
          { p: C, label: "C" },
        ].map((v, i) => (
          <motion.g key={v.label} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={v.p.x - 16} y={v.p.y - 14} width={32} height={28} rx={4} fill={showDouble && v.label === "A" ? "#fef3c7" : "#f8fafc"} stroke={showDouble && v.label === "A" ? AMBER : INK} strokeWidth={showDouble && v.label === "A" ? 2.2 : 1.4} />
            <text x={v.p.x} y={v.p.y + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {v.label}
            </text>
          </motion.g>
        ))}

        {/* the sum, once revealed */}
        <AnimatePresence>
          {showSum && (
            <motion.text
              x={cx}
              y={H - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={isFinal ? WIN : IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isFinal ? `${sum} ÷ 2 = ${total}` : `sum = ${sum}`}
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
