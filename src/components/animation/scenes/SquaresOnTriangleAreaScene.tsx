import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const LEG_A = "#2563eb";
const LEG_B = "#0ea5e9";
const HYP = "#f59e0b";

// Right angle at C, leg CB horizontal (length legB), leg CA vertical (length legA).
const C = { x: 60, y: 140 };
const SCALE = 8;

// A right triangle with a square built outward on each side, areas given.
// The two smaller areas are the legs; verifying their sum equals the largest
// confirms the right angle, then the triangle's area is half their product.
// Data: { squareAreas: [a, b, c] } in any order.
export function SquaresOnTriangleAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rawAreas = (Array.isArray(data.squareAreas) ? data.squareAreas : [144, 25, 169]).map(Number);
  const sorted = [...rawAreas].sort((a, b) => a - b);
  const [legAreaA, legAreaB, hypArea] = sorted;
  const legA = Math.round(Math.sqrt(legAreaA));
  const legB = Math.round(Math.sqrt(legAreaB));
  const hyp = Math.round(Math.sqrt(hypArea));
  const triArea = (legA * legB) / 2;
  const checkSum = legAreaA + legAreaB;
  const pythagoreanHolds = checkSum === hypArea;

  const last = totalSteps - 1;
  const showSides = step >= 1;
  const showCheck = step >= 2;
  const isFinal = step >= last;

  const B = { x: C.x + legB * SCALE, y: C.y };
  const A = { x: C.x, y: C.y - legA * SCALE };
  const hypLen = Math.hypot(B.x - A.x, B.y - A.y);
  const ux = (B.x - A.x) / hypLen;
  const uy = (B.y - A.y) / hypLen;
  // Outward normal to AB, away from C.
  let nx = -uy;
  let ny = ux;
  const mid = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  if ((mid.x - C.x) * nx + (mid.y - C.y) * ny < 0) {
    nx = -nx;
    ny = -ny;
  }
  const Ap = { x: A.x + nx * hypLen, y: A.y + ny * hypLen };
  const Bp = { x: B.x + nx * hypLen, y: B.y + ny * hypLen };

  const bottomSquare = `${C.x},${C.y} ${B.x},${B.y} ${B.x},${B.y + legB * SCALE} ${C.x},${C.y + legB * SCALE}`;
  const leftSquare = `${C.x},${C.y} ${A.x},${A.y} ${A.x - legA * SCALE},${A.y} ${C.x - legA * SCALE},${C.y}`;
  const hypSquare = `${A.x},${A.y} ${B.x},${B.y} ${Bp.x},${Bp.y} ${Ap.x},${Ap.y}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 230 250" width="100%" style={{ maxWidth: 260 }}>
        <motion.polygon points={bottomSquare} fill={`${LEG_A}22`} stroke={LEG_A} strokeWidth={1.6} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
        <motion.polygon points={leftSquare} fill={`${LEG_B}22`} stroke={LEG_B} strokeWidth={1.6} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }} />
        <motion.polygon points={hypSquare} fill={`${HYP}22`} stroke={HYP} strokeWidth={1.6} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />

        <polygon points={`${C.x},${C.y} ${B.x},${B.y} ${A.x},${A.y}`} fill="#fff" stroke={NAVY} strokeWidth={1.8} />
        <rect x={C.x - 8} y={C.y - 8} width={8} height={8} fill="none" stroke={NAVY} strokeWidth={1.2} />

        <text x={(C.x + B.x) / 2} y={C.y + legB * SCALE / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill={LEG_A} fontFamily={FONT}>
          {showSides ? legB : legAreaB}
        </text>
        <text x={C.x - legA * SCALE / 2} y={(C.y + A.y) / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={LEG_B} fontFamily={FONT}>
          {showSides ? legA : legAreaA}
        </text>
        <text x={(Ap.x + Bp.x) / 2} y={(Ap.y + Bp.y) / 2} textAnchor="middle" fontSize="12" fontWeight="800" fill={HYP} fontFamily={FONT}>
          {showSides ? hyp : hypArea}
        </text>
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 280 }}>
        {!showSides
          ? `three squares, areas ${legAreaA}, ${legAreaB}, ${hypArea}`
          : !showCheck
          ? `side lengths: √${legAreaA}=${legA}, √${legAreaB}=${legB}, √${hypArea}=${hyp}`
          : `${legAreaA} + ${legAreaB} = ${checkSum} = ${hypArea}, so the angle between the legs is a right angle`}
      </motion.div>

      <AnimatePresence>
        {showCheck && (
          <motion.div
            key="area"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: isFinal ? GREEN : INDIGO }}
          >
            (1/2)({legA})({legB}) = {triArea}
          </motion.div>
        )}
      </AnimatePresence>

      {isFinal && !pythagoreanHolds && (
        <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#dc2626" }}>
          check failed: {legAreaA} + {legAreaB} ≠ {hypArea}
        </div>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
