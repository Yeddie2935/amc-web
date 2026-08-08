import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const GRAY = "#9ca3af";
const EDGE = "#1f2a44";

// One wooden cube drawn isometrically with two adjacent faces gray (top + right,
// which share an edge) and the rest white.
function IsoCube({ ox, oy, u = 46, dp = 22 }: { ox: number; oy: number; u?: number; dp?: number }) {
  const front = `${ox},${oy} ${ox + u},${oy} ${ox + u},${oy + u} ${ox},${oy + u}`;
  const top = `${ox},${oy} ${ox + dp},${oy - dp} ${ox + u + dp},${oy - dp} ${ox + u},${oy}`;
  const right = `${ox + u},${oy} ${ox + u + dp},${oy - dp} ${ox + u + dp},${oy - dp + u} ${ox + u},${oy + u}`;
  return (
    <g>
      <polygon points={front} fill="#fff" stroke={EDGE} strokeWidth={2} />
      <polygon points={top} fill={GRAY} stroke={EDGE} strokeWidth={2} />
      <polygon points={right} fill={GRAY} stroke={EDGE} strokeWidth={2} />
    </g>
  );
}

// "Cubes white on 4 faces, gray on 2 adjacent faces — glue so no gray shows."
// Shows the single piece, then a 2×2 block where each cube's gray corner faces
// inward so all gray collects in the hidden center. Data: { cubes }.
export function GrayCubeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cubes = num(data.cubes, 4);
  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  // 2×2 top-down block: each cube's inner quarter is gray, so the four quarters
  // form one gray square hidden in the middle.
  const q = 62;
  const bx = 40;
  const by = 20;
  const cells = [
    [bx, by, bx + q / 2, by + q / 2],       // TL → inner corner bottom-right
    [bx + q, by, bx + q, by + q / 2],       // TR → inner bottom-left
    [bx, by + q, bx + q / 2, by + q],       // BL → inner top-right
    [bx + q, by + q, bx + q, by + q],       // BR → inner top-left
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "6px 4px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <svg width={110} height={90} viewBox="0 0 110 90">
            <IsoCube ox={22} oy={34} />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", fontFamily: numberFont }}>1 cube · 2 gray faces</span>
        </div>

        <AnimatePresence>
          {final && (
            <motion.div
              key="block"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <svg width={2 * q + 80} height={2 * q + 56} viewBox={`0 0 ${2 * q + 80} ${2 * q + 56}`}>
                {/* gray inner quarters (drawn first, under the outlines) */}
                {cells.map(([, , gx, gy], i) => (
                  <rect key={`g${i}`} x={gx} y={gy} width={q / 2} height={q / 2} fill={GRAY} />
                ))}
                {/* four cube outlines */}
                {[[bx, by], [bx + q, by], [bx, by + q], [bx + q, by + q]].map(([x, y], i) => (
                  <rect key={`c${i}`} x={x} y={y} width={q} height={q} fill="none" stroke={EDGE} strokeWidth={2} />
                ))}
                <text x={bx + q} y={by + 2 * q + 26} fontSize={12} textAnchor="middle" fill="#16a34a" fontWeight={800} fontFamily={numberFont}>
                  gray hidden inside
                </text>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#1f2a44", fontFamily: numberFont }}>{cubes} cubes · 2×2 block</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
