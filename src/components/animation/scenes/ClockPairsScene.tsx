import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN = "#16a34a";
const PAIR_COLORS = ["#4338ca", "#0d9488", "#b45309", "#be123c", "#7c3aed", "#0369a1"];

const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : `${Math.round(v * 100) / 100}`);

/**
 * Numbers around a clock dial paired with the one directly opposite. Each pair
 * is a diameter, and its average is drawn beside it; because the pairs use every
 * number on the dial exactly once, the average of the pair-averages is just the
 * average of all n numbers — which the scene shows both ways. Pairs, averages
 * and both means are computed from n.
 * Data: { n?, example?:[a,b] }.
 */
export function ClockPairsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.round(num(data.n, 12)));
  const half = Math.floor(n / 2);
  const example = Array.isArray(data.example) ? data.example.map((v) => num(v, 0)) : [2, 8];

  const pairs = Array.from({ length: half }, (_, i) => {
    const a = i + 1;
    const b = a + half;
    return { a, b, avg: (a + b) / 2, color: PAIR_COLORS[i % PAIR_COLORS.length] };
  });
  const avgOfAvgs = pairs.reduce((s, p) => s + p.avg, 0) / pairs.length;
  const sumAll = (n * (n + 1)) / 2;
  const allAvg = sumAll / n;
  const exIdx = Math.max(0, pairs.findIndex((p) => p.a === Math.min(...example)));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showAll = step >= 1 || isFinal;
  const showMean = step >= 2 || isFinal;

  // ---- clock geometry (12 at top, running clockwise) ----
  const W = 400;
  const H = 208;
  const cx = 100;
  const cy = 102;
  const R = 70;
  const pos = (k: number, r: number) => {
    const t = (k * (360 / n) * Math.PI) / 180;
    return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
  };

  const chipX = 196;
  const chipTop = 24;
  const chipH = 27;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 440 }}>
        {/* dial */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth={1.8} />

        {/* diameters: the example pair first, then all of them */}
        {pairs.map((p, i) => {
          const shown = showAll || i === exIdx;
          if (!shown) return null;
          const A = pos(p.a, R);
          const B = pos(p.b, R);
          return (
            // note: Motion drives pathLength via strokeDasharray, so a dash
            // pattern set here would be overridden — the line draws itself in.
            <motion.line
              key={`d${i}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={p.color}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: showAll ? i * 0.12 : 0.2 }}
            />
          );
        })}

        {/* tick marks and numerals */}
        {Array.from({ length: n }, (_, i) => i + 1).map((k) => {
          const t1 = pos(k, R - 6);
          const t2 = pos(k, R);
          const lp = pos(k, R + 15);
          const owner = pairs.find((p) => p.a === k || p.b === k)!;
          const lit = showAll || (!showAll && (k === example[0] || k === example[1]));
          return (
            <g key={`k${k}`}>
              <line x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke={INK} strokeWidth={1.4} />
              <motion.text
                x={lp.x}
                y={lp.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={lit ? owner.color : "#94a3b8"}
                fontFamily={numberFont}
                animate={{ opacity: 1 }}
              >
                {k}
              </motion.text>
            </g>
          );
        })}

        {/* one chip per pair, colour-matched to its diameter */}
        {pairs.map((p, i) => {
          const shown = showAll || i === exIdx;
          const y = chipTop + i * chipH;
          return (
            <AnimatePresence key={`c${i}`}>
              {shown && (
                <motion.g
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: showAll ? 0.15 + i * 0.1 : 0.3 }}
                >
                  <circle cx={chipX + 6} cy={y + 6} r={4} fill={p.color} />
                  <text x={chipX + 18} y={y + 10} fontSize="12.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {p.a} &amp; {p.b}
                  </text>
                  <text x={chipX + 74} y={y + 10} fontSize="12.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                    →
                  </text>
                  <text x={chipX + 96} y={y + 10} fontSize="13" fontWeight="800" fill={p.color} fontFamily={numberFont}>
                    {fmt(p.avg)}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          );
        })}

        {/* brace over the six averages once we take their mean */}
        <AnimatePresence>
          {showMean && (
            <motion.g key="brace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 }}>
              <line x1={W - 32} y1={chipTop + 2} x2={W - 32} y2={chipTop + (half - 1) * chipH + 10} stroke={WIN} strokeWidth={2} />
              <line x1={W - 36} y1={chipTop + 2} x2={W - 32} y2={chipTop + 2} stroke={WIN} strokeWidth={2} />
              <line x1={W - 36} y1={chipTop + (half - 1) * chipH + 10} x2={W - 32} y2={chipTop + (half - 1) * chipH + 10} stroke={WIN} strokeWidth={2} />
              <text x={W - 26} y={chipTop + ((half - 1) * chipH) / 2 + 10} fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {fmt(avgOfAvgs)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* caption */}
      <motion.span
        key={`${showAll}-${showMean}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: showMean ? "#166534" : "#4338ca",
          background: showMean ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${showMean ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showAll
          ? `numbers across the dial differ by ${half}`
          : !showMean
          ? `${half} pairs → ${pairs.map((p) => fmt(p.avg)).join(", ")}`
          : `(${pairs.map((p) => fmt(p.avg)).join(" + ")}) ÷ ${half} = ${fmt(avgOfAvgs)}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="check"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 12.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            every number used once, so it is just the mean of 1–{n}: {sumAll} ÷ {n} = {fmt(allAvg)}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
