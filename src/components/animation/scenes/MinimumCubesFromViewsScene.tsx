import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";

type Cell = [number, number];
type Cube = [number, number, number]; // x, y, z

const U = 30;
const DP = 15;
const OX = 30;
const OY = 92;

function anchor(x: number, y: number, z: number) {
  return { ox: OX + (x - 1) * U + (y - 1) * DP, oy: OY - (y - 1) * DP - (z - 1) * U };
}

function key(a: [number, number]): string {
  return `${a[0]},${a[1]}`;
}

function isAdjacent(a: Cube, b: Cube): boolean {
  const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  return d === 1;
}

function MiniGrid({ title, cells, color }: { title: string; cells: Cell[]; color: string }) {
  const has = new Set(cells.map(key));
  const size = 22;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <svg width={2 * size + 4} height={2 * size + 4} viewBox={`0 0 ${2 * size + 4} ${2 * size + 4}`}>
        {[1, 2].map((row) =>
          [1, 2].map((col) => {
            const occupied = has.has(key([col, row]));
            const x = (col - 1) * size + 2;
            const y = (2 - row) * size + 2;
            return <rect key={`${col}-${row}`} x={x} y={y} width={size} height={size} fill={occupied ? color : "#fff"} stroke="#94a3b8" strokeWidth={1} />;
          })
        )}
      </svg>
      <span style={{ fontSize: 9.5, fontWeight: 800, color: NAVY, fontFamily: FONT }}>{title}</span>
    </div>
  );
}

/**
 * The front and side views each fix a 2x2 grid of required (and forbidden)
 * columns; a cube's position is only legal where both its (x,z) front-column
 * and (y,z) side-column are required. The natural minimum-coverage guess (one
 * cube per still-uncovered column) hits exactly 3 cubes but leaves one of
 * them touching nothing, which the problem forbids — a 4th cube is needed to
 * keep everything connected while still matching both views exactly.
 * Data: { frontCells: [[x,z],...], sideCells: [[y,z],...] }.
 */
export function MinimumCubesFromViewsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const frontCells: Cell[] = Array.isArray(data.frontCells) ? (data.frontCells as unknown[]).map((c) => [Number((c as number[])[0]), Number((c as number[])[1])]) : [[1, 1], [1, 2], [2, 1]];
  const sideCells: Cell[] = Array.isArray(data.sideCells) ? (data.sideCells as unknown[]).map((c) => [Number((c as number[])[0]), Number((c as number[])[1])]) : [[1, 1], [2, 1], [2, 2]];

  const trapCubes: Cube[] = [[1, 1, 1], [2, 2, 1], [1, 2, 2]];
  const solutionCubes: Cube[] = [[1, 1, 1], [2, 1, 1], [1, 2, 1], [1, 2, 2]];

  const last = totalSteps - 1;
  const showTrap = step === 1;
  const buildIndex = step >= 2 ? Math.min(solutionCubes.length, step - 1) : 0;
  const isFinal = step >= last;

  const cubes: Cube[] = showTrap ? trapCubes : solutionCubes.slice(0, buildIndex);

  const frontOf = (cs: Cube[]) => new Set(cs.map(([x, , z]) => `${x},${z}`));
  const sideOf = (cs: Cube[]) => new Set(cs.map(([, y, z]) => `${y},${z}`));
  const isolated = cubes.filter((c) => cubes.length > 1 && !cubes.some((o) => o !== c && isAdjacent(c, o)));

  const frontMatch = cubes.length > 0 && frontOf(cubes).size === frontCells.length && frontCells.every((c) => frontOf(cubes).has(key(c)));
  const sideMatch = cubes.length > 0 && sideOf(cubes).size === sideCells.length && sideCells.every((c) => sideOf(cubes).has(key(c)));

  const W = 220;
  const H = 150;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 24 }}>
        <MiniGrid title="FRONT" cells={frontCells} color={INDIGO} />
        <MiniGrid title="SIDE" cells={sideCells} color={INDIGO} />
      </div>

      {cubes.length > 0 && (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
          {cubes
            .slice()
            .sort((a, b) => b[1] - a[1] || a[2] - b[2] || a[0] - b[0])
            .map((cube, i) => {
              const { ox, oy } = anchor(cube[0], cube[1], cube[2]);
              const bad = isolated.includes(cube);
              const fill = bad ? "#fecaca" : "#c7d2fe";
              const top = bad ? "#fca5a5" : "#e0e7ff";
              const right = bad ? "#f87171" : "#a5b4fc";
              const edge = bad ? RED : INDIGO;
              return (
                <motion.g key={`${cube[0]}-${cube[1]}-${cube[2]}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <polygon points={`${ox},${oy} ${ox + U},${oy} ${ox + U},${oy + U} ${ox},${oy + U}`} fill={fill} stroke={edge} strokeWidth={1.4} />
                  <polygon points={`${ox},${oy} ${ox + DP},${oy - DP} ${ox + U + DP},${oy - DP} ${ox + U},${oy}`} fill={top} stroke={edge} strokeWidth={1.4} />
                  <polygon points={`${ox + U},${oy} ${ox + U + DP},${oy - DP} ${ox + U + DP},${oy - DP + U} ${ox + U},${oy + U}`} fill={right} stroke={edge} strokeWidth={1.4} />
                </motion.g>
              );
            })}
        </svg>
      )}

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {step === 0
          ? "front view and side view are each a 2x2 L-shape"
          : showTrap
          ? isolated.length > 1
            ? `3 cubes match both views, but none of them touch each other — not allowed`
            : isolated.length === 1
            ? `3 cubes match both views, but the highlighted cube touches no other cube — not allowed`
            : `3 cubes match both views`
          : buildIndex < solutionCubes.length
          ? `cube ${buildIndex}: placed to keep matching both views while staying connected`
          : `${cubes.length} cubes, every one touching another, and both views match exactly`}
      </motion.div>

      <AnimatePresence>
        {isFinal && (
          <motion.div key="verify" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: frontMatch && sideMatch ? GREEN : RED }}>
            {frontMatch && sideMatch ? "front ✓  side ✓  connected ✓" : "views do not match — check failed"}
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
