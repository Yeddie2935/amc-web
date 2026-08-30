import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN = "#16a34a";
const TRAP_COLORS = ["#fde68a", "#99f6e4", "#c7d2fe"];
const TRAP_STROKES = ["#b45309", "#0d9488", "#4338ca"];

/**
 * A small equilateral triangle sits concentric with a large one, same
 * orientation, scaled so its area matches the given ratio. Connecting each
 * inner vertex to the corresponding outer vertex splits the region between
 * them into three congruent trapezoids by the figure's own 120° rotational
 * symmetry — the scene draws both triangles, shades the region between
 * them, then draws the three connecting cevians to reveal the trapezoids.
 * Data: { outerArea, innerArea }.
 */
export function NestedTriangleTrapezoidScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const outerArea = Math.max(1, num(data.outerArea, 16));
  const innerArea = Math.max(0.01, num(data.innerArea, 1));

  const surrounding = outerArea - innerArea;
  const trapezoidArea = surrounding / 3;
  const matches = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - trapezoidArea) < 1e-9;
  const failure = !matches ? `check failed: (${outerArea} − ${innerArea}) ÷ 3 = ${trapezoidArea}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showInner = step >= 1;
  const showSurround = step >= 2;
  const showTrapezoids = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry: a real equilateral triangle, concentric scaled copy ----
  const A: [number, number] = [110, 20];
  const B: [number, number] = [20, 176];
  const C: [number, number] = [200, 176];
  const G: [number, number] = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  const k = Math.sqrt(innerArea / outerArea);
  const scaled = (P: [number, number]): [number, number] => [G[0] + k * (P[0] - G[0]), G[1] + k * (P[1] - G[1])];
  const Ap = scaled(A);
  const Bp = scaled(B);
  const Cp = scaled(C);
  const pts = (arr: [number, number][]) => arr.map((p) => p.join(",")).join(" ");
  const mid = (P: [number, number], Q: [number, number]): [number, number] => [(P[0] + Q[0]) / 2, (Q[1] + P[1]) / 2];

  const W = 220;
  const H = 200;

  const caption = isFinal
    ? `${surrounding} ÷ 3 = ${trapezoidArea}`
    : showTrapezoids
    ? `each of the 3 congruent trapezoids gets an equal share`
    : showSurround
    ? `${outerArea} − ${innerArea} = ${surrounding} surrounds the inner triangle`
    : showInner
    ? `inner triangle area ${innerArea}`
    : `outer triangle area ${outerArea}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        {/* the annular region, shaded once we're subtracting */}
        <AnimatePresence>
          {showSurround && !showTrapezoids && (
            <motion.g key="ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <path d={`M ${pts([A, B, C])} Z M ${pts([Ap, Bp, Cp])} Z`} fillRule="evenodd" fill="#eef2ff" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* the three trapezoids, once split */}
        <AnimatePresence>
          {showTrapezoids &&
            [
              [A, B, Bp, Ap],
              [B, C, Cp, Bp],
              [C, A, Ap, Cp],
            ].map((quad, i) => (
              <motion.polygon
                key={i}
                points={pts(quad as [number, number][])}
                fill={TRAP_COLORS[i]}
                stroke={TRAP_STROKES[i]}
                strokeWidth={1.4}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.12 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
        </AnimatePresence>

        {/* outer triangle outline */}
        <polygon points={pts([A, B, C])} fill="none" stroke={INK} strokeWidth={1.8} />
        <text x={A[0]} y={A[1] - 8} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {outerArea}
        </text>

        {/* inner triangle */}
        <AnimatePresence>
          {showInner && (
            <motion.g key="inner" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <polygon points={pts([Ap, Bp, Cp])} fill={showTrapezoids ? "#fff" : "#dbeafe"} stroke={INK} strokeWidth={1.6} />
              <text x={G[0]} y={G[1] + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {innerArea}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the three cevians connecting corresponding vertices */}
        <AnimatePresence>
          {showTrapezoids &&
            [
              [A, Ap],
              [B, Bp],
              [C, Cp],
            ].map(([P, Q], i) => (
              <motion.line
                key={i}
                x1={P[0]}
                y1={P[1]}
                x2={Q[0]}
                y2={Q[1]}
                stroke={INK}
                strokeWidth={1.3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
              />
            ))}
        </AnimatePresence>

        {/* the trapezoid areas, once divided */}
        <AnimatePresence>
          {isFinal &&
            [
              mid(A, Bp),
              mid(B, Cp),
              mid(C, Ap),
            ].map((p, i) => (
              <motion.text
                key={i}
                x={p[0]}
                y={p[1]}
                textAnchor="middle"
                fontSize="11"
                fontWeight="900"
                fill={TRAP_STROKES[i]}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.4 + i * 0.1 }}
              >
                {trapezoidArea}
              </motion.text>
            ))}
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
        {failure && (
          <motion.span key="note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }} style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#dc2626", textAlign: "center" }}>
            {failure}
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
