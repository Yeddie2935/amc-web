import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const GREEN = "#16a34a";
const NEUTRAL = "#e2e8f0";
const NEUTRAL_EDGE = "#94a3b8";

type Cube = { col: number; row: number; z: number; neighbors: number };

const U = 30; // cube size
const DP = 15; // depth offset
const OX = 26;
const OY = 118;

function anchor(col: number, row: number, z: number) {
  return {
    ox: OX + (col - 1) * U + (row - 1) * DP,
    oy: OY - (row - 1) * DP - z * U,
  };
}

/**
 * 14 unit cubes glued into a base shelf (cols x rows) with a few cells
 * carrying a second cube on top; the whole outer surface (including the
 * bottom) gets painted, then the figure is taken apart. A cube's red faces
 * are 6 minus however many neighbors it touches, so "exactly 4 red faces"
 * means "exactly 2 touching neighbors" — computed per cube from real 3D
 * adjacency, not asserted. Data: { cols, rows, raised: [[col,row], ...] }.
 */
export function PaintedCubeGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cols = Math.round(num(data.cols, 5));
  const rows = Math.round(num(data.rows, 2));
  const raised: [number, number][] = Array.isArray(data.raised) ? data.raised.map((p: unknown) => (Array.isArray(p) ? [num(p[0], 0), num(p[1], 0)] : [0, 0])) : [];
  const raisedSet = new Set(raised.map(([c, r]) => `${c},${r}`));

  const exists = (c: number, r: number, z: number) => {
    if (c < 1 || c > cols || r < 1 || r > rows) return false;
    if (z === 0) return true;
    if (z === 1) return raisedSet.has(`${c},${r}`);
    return false;
  };

  const cubes: Cube[] = [];
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      for (let z = 0; z <= 1; z++) {
        if (!exists(col, row, z)) continue;
        const n =
          (exists(col - 1, row, z) ? 1 : 0) +
          (exists(col + 1, row, z) ? 1 : 0) +
          (exists(col, row - 1, z) ? 1 : 0) +
          (exists(col, row + 1, z) ? 1 : 0) +
          (exists(col, row, z - 1) ? 1 : 0) +
          (exists(col, row, z + 1) ? 1 : 0);
        cubes.push({ col, row, z, neighbors: n });
      }
    }
  }
  // painter's algorithm: back rows first, base before raised within a cell
  cubes.sort((a, b) => b.row - a.row || a.z - b.z || a.col - b.col);

  const total = cubes.length;
  const qualifying = cubes.filter((c) => c.neighbors === 2);
  const qualifyingCount = qualifying.length;

  const last = totalSteps - 1;
  const showCounts = step >= 1;
  const showHighlight = step >= 2;
  const isFinal = step >= last;

  const W = OX + (cols - 1) * U + (rows - 1) * DP + U + DP + 20;
  const H = 210;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
        {cubes.map((cube, i) => {
          const { ox, oy } = anchor(cube.col, cube.row, cube.z);
          const isQualifying = cube.neighbors === 2;
          const highlight = showHighlight && isQualifying;
          const fill = highlight ? GREEN : NEUTRAL;
          const edge = highlight ? "#15803d" : NEUTRAL_EDGE;
          const topFill = highlight ? "#4ade80" : "#f1f5f9";
          const rightFill = highlight ? "#22c55e" : "#cbd5e1";
          return (
            <motion.g
              key={`${cube.col}-${cube.row}-${cube.z}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.03 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <polygon points={`${ox},${oy} ${ox + U},${oy} ${ox + U},${oy + U} ${ox},${oy + U}`} fill={fill} stroke={edge} strokeWidth={1.3} />
              <polygon points={`${ox},${oy} ${ox + DP},${oy - DP} ${ox + U + DP},${oy - DP} ${ox + U},${oy}`} fill={topFill} stroke={edge} strokeWidth={1.3} />
              <polygon points={`${ox + U},${oy} ${ox + U + DP},${oy - DP} ${ox + U + DP},${oy - DP + U} ${ox + U},${oy + U}`} fill={rightFill} stroke={edge} strokeWidth={1.3} />
              {showCounts && (
                <text x={ox + U / 2} y={oy + U / 2 + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill={highlight ? "#fff" : NAVY} fontFamily={FONT}>
                  {6 - cube.neighbors}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {!showCounts
          ? `${total} cubes glued together, whole surface painted red`
          : !showHighlight
          ? "each cube's red faces = 6 − (touching neighbors) — numbers shown on each cube"
          : `${qualifyingCount} cubes have exactly 2 neighbors, so exactly 4 red faces`}
      </motion.div>

      <AnimatePresence>
        {isFinal && (
          <motion.div key="tally" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: GREEN }}>
            {qualifyingCount} cubes with exactly 4 red faces
          </motion.div>
        )}
      </AnimatePresence>

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
