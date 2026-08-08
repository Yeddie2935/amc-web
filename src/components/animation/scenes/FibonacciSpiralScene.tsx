import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

// Canonical 1,1,2,3,5 Fibonacci tiling of an 8×5 rectangle and the joined
// quarter-circle spiral. Geometry (in unit coords, y up) is fixed to the
// arrangement; the arc-length sum is computed from the real radii.
const S = 48; // px per unit
const OX = 8;
const OY = 8;
const HU = 5; // rectangle height in units
const px = (ux: number, uy: number): [number, number] => [OX + ux * S, OY + (HU - uy) * S];

// squares: [unitX, unitY (bottom-left), size]
const SQUARES: [number, number, number][] = [
  [0, 0, 5],
  [5, 2, 3],
  [6, 0, 2],
  [5, 1, 1],
  [5, 0, 1],
];
// arcs: [centerX, centerY, r, startX, startY, endX, endY] in unit coords
const ARCS: [number, number, number, number, number, number, number][] = [
  [6, 1, 1, 6, 2, 5, 1],
  [6, 1, 1, 5, 1, 6, 0],
  [6, 2, 2, 6, 0, 8, 2],
  [5, 2, 3, 8, 2, 5, 5],
  [5, 0, 5, 5, 5, 0, 0],
];

// Quarter-circle spiral over Fibonacci squares; sums the arc lengths πr/2.
// Data: { radii: [1,1,2,3,5] }.
export function FibonacciSpiralScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const radii = Array.isArray(data.radii) ? data.radii.map((r) => num(r, 0)) : [1, 1, 2, 3, 5];
  const sum = radii.reduce((a, b) => a + b, 0);
  const coef = sum / 2;
  const totalLabel = Number.isInteger(coef) ? `${coef}π` : `${sum}π/2`;

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  const svgW = OX * 2 + 8 * S;
  const svgH = OY * 2 + HU * S;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "6px 4px" }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "100%" }}>
        {SQUARES.map(([ux, uy, size], i) => {
          const [x, y] = px(ux, uy + size);
          return (
            <rect key={i} x={x} y={y} width={size * S} height={size * S} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.5} />
          );
        })}

        {ARCS.map(([cx, cy, r, sx, sy, ex, ey], i) => {
          const [ax, ay] = px(sx, sy);
          const [bx, by] = px(ex, ey);
          return (
            <motion.path
              key={i}
              d={`M ${ax} ${ay} A ${r * S} ${r * S} 0 0 0 ${bx} ${by}`}
              fill="none"
              stroke="#4338ca"
              strokeWidth={4}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          );
        })}

        {SQUARES.map(([ux, uy, size], i) => {
          const [x, y] = px(ux + size / 2, uy + size / 2);
          // Each square's radius is its own side length.
          return (
            <text key={`r${i}`} x={x} y={y} fontSize={13} textAnchor="middle" dominantBaseline="central" fill="#64748b" fontWeight={700} fontFamily={numberFont}>
              r={size}
            </text>
          );
        })}
      </svg>

      <div style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 700, color: "#334155" }}>
        each quarter arc = πr/2
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="sum"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ fontFamily: numberFont, fontSize: 19, fontWeight: 800, color: "#1f2a44", textAlign: "center" }}
          >
            π/2 × ({radii.join(" + ")}) = π/2 × {sum} = {totalLabel}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
