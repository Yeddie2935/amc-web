import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#cbd5e1";
const SHADE = "#c7d2fe";
const PATH = "#1f2a44";
const WIN = "#16a34a";

const choose = (a: number, b: number) => {
  let r = 1;
  for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1);
  return Math.round(r);
};

/**
 * Every bottom-to-top path across a diamond grid cuts off some area on one side.
 * Reflecting a path left-to-right turns an area of A into n² − A, so the paths
 * fall into mirror pairs each contributing n². The scene draws a path with its
 * area shaded beside its mirror, and the pair total, path count and grand total
 * are all computed. A path is recorded as the column it rises at in each row.
 * Data: { n, example:[x per row] }.
 */
export function PathAreaPairingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(1, Math.round(num(data.n, 5)));
  const ex = Array.isArray(data.example) ? data.example.map((v) => Math.round(num(v, 0))) : [];
  const path = ex.length === n ? ex : Array.from({ length: n }, () => 0);
  const mirror = Array.from({ length: n }, (_, j) => n - path[n - 1 - j]);
  // the problem measures the side toward the right vertex
  const areaOf = (p: number[]) => p.reduce((s, v) => s + (n - v), 0);
  const aA = areaOf(path);
  const aB = areaOf(mirror);
  const cellTotal = n * n;
  const paths = choose(2 * n, n);
  const pairs = paths / 2;
  const grand = pairs * cellTotal;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showMirror = step >= 1 || isFinal;

  // ---- diamond geometry: square lattice rotated 45° ----
  const s = 13;
  const W = 320;
  const H = 2 * n * s + 34;
  const P = (cx: number, by: number) => (x: number, y: number) => ({ x: cx + (x - y) * s, y: by - (x + y) * s });

  const Diamond = ({ cx, p, tint }: { cx: number; p: number[]; tint: string }) => {
    const by = H - 22;
    const M = P(cx, by);
    const cells: string[] = [];
    for (let j = 0; j < n; j++) {
      for (let i = p[j]; i < n; i++) {
        const a = M(i, j);
        const b = M(i + 1, j);
        const c = M(i + 1, j + 1);
        const d = M(i, j + 1);
        cells.push(`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`);
      }
    }
    // the path: rise at column p[j] in each row
    const pts: { x: number; y: number }[] = [M(0, 0)];
    let cur = 0;
    for (let j = 0; j < n; j++) {
      if (p[j] !== cur) {
        pts.push(M(p[j], j));
        cur = p[j];
      }
      pts.push(M(cur, j + 1));
    }
    if (cur !== n) pts.push(M(n, n));
    return (
      <g>
        {cells.map((pt, i) => (
          <motion.polygon key={i} points={pt} fill={tint} stroke="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: i * 0.012 }} />
        ))}
        {Array.from({ length: n + 1 }).map((_, k) => {
          const a1 = M(k, 0);
          const b1 = M(k, n);
          const a2 = M(0, k);
          const b2 = M(n, k);
          return (
            <g key={k}>
              <line x1={a1.x} y1={a1.y} x2={b1.x} y2={b1.y} stroke={GRID} strokeWidth={1} />
              <line x1={a2.x} y1={a2.y} x2={b2.x} y2={b2.y} stroke={GRID} strokeWidth={1} />
            </g>
          );
        })}
        <motion.polyline
          points={pts.map((q) => `${q.x},${q.y}`).join(" ")}
          fill="none"
          stroke={PATH}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        />
        <circle cx={M(0, 0).x} cy={M(0, 0).y} r={3.4} fill={INK} />
        <circle cx={M(n, n).x} cy={M(n, n).y} r={3.4} fill={INK} />
        <text x={cx} y={by + 16} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          area {areaOf(p)}
        </text>
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <Diamond cx={showMirror ? 82 : W / 2} p={path} tint={SHADE} />
        <AnimatePresence>
          {showMirror && (
            <motion.g key="m" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 140, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <Diamond cx={238} p={mirror} tint="#bbf7d0" />
            </motion.g>
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
        {!showMirror
          ? `one path cuts off ${aA} of the ${cellTotal} cells`
          : step === 1
          ? `its mirror cuts off the rest: ${aA} + ${aB} = ${cellTotal}`
          : !isFinal
          ? `all ${paths} paths pair up → ${pairs} pairs`
          : `${pairs} × ${cellTotal} = ${grand}`}
      </motion.span>

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
