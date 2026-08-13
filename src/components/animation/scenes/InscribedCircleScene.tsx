import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const FILL = "#eef2ff";
const EDGE = "#4338ca";
const TOUCH = "#f59e0b";
const WIN = "#16a34a";

type P = [number, number];

/** √n as coefficient·√radicand in lowest terms. */
function simplifySqrt(n: number): { coef: number; rad: number } {
  let coef = 1;
  let rad = n;
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    if (rad % (k * k) === 0) {
      coef *= k;
      rad /= k * k;
      break;
    }
  }
  return { coef, rad };
}

function readCells(v: unknown): P[] {
  return Array.isArray(v)
    ? v.filter((c) => Array.isArray(c) && c.length >= 2).map((c) => [num((c as number[])[0], 0), num((c as number[])[1], 0)] as P)
    : [];
}

/** Closest point on segment ab to p, and its distance. */
function nearest(p: P, a: P, b: P): { d: number; q: P } {
  const vx = b[0] - a[0];
  const vy = b[1] - a[1];
  const L = vx * vx + vy * vy;
  let t = L ? ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L : 0;
  t = Math.max(0, Math.min(1, t));
  const q: P = [a[0] + t * vx, a[1] + t * vy];
  return { d: Math.hypot(p[0] - q[0], p[1] - q[1]), q };
}

/**
 * Largest circle that fits inside a polyomino region. The radius is the distance
 * from the centre to the nearest point of the boundary, computed here by walking
 * every unit edge that has no neighbouring cell — so the touching points are
 * discovered, not asserted. The circle grows until it jams against them, and a
 * right triangle to one touch point shows why r² is what it is.
 * Data: { cells:[[x,y],...], centerX, centerY, unit? }.
 */
export function InscribedCircleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cells = readCells(data.cells);
  const unit = data.unit != null ? String(data.unit) : "cm";
  const C: P = [num(data.centerX, 0), num(data.centerY, 0)];

  // boundary = every cell edge with no cell on the other side
  const has = new Set(cells.map(([x, y]) => `${x},${y}`));
  const segs: [P, P][] = [];
  for (const [x, y] of cells) {
    if (!has.has(`${x},${y - 1}`)) segs.push([[x, y], [x + 1, y]]);
    if (!has.has(`${x},${y + 1}`)) segs.push([[x, y + 1], [x + 1, y + 1]]);
    if (!has.has(`${x - 1},${y}`)) segs.push([[x, y], [x, y + 1]]);
    if (!has.has(`${x + 1},${y}`)) segs.push([[x + 1, y], [x + 1, y + 1]]);
  }

  let r = Infinity;
  let touches: P[] = [];
  for (const [a, b] of segs) {
    const { d, q } = nearest(C, a, b);
    if (d < r - 1e-9) {
      r = d;
      touches = [q];
    } else if (Math.abs(d - r) < 1e-9) {
      touches.push(q);
    }
  }
  // de-duplicate touch points shared by adjacent edges
  const seen = new Set<string>();
  touches = touches.filter((q) => {
    const k = `${q[0].toFixed(6)},${q[1].toFixed(6)}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const r2 = r * r;
  const r2int = Math.round(r2);
  const exact = Math.abs(r2 - r2int) < 1e-9 && r2int > 0;
  const { coef, rad } = exact ? simplifySqrt(r2int) : { coef: 1, rad: 1 };
  const rStr = exact ? (rad === 1 ? `${coef}` : coef === 1 ? `√${rad}` : `${coef}√${rad}`) : r.toFixed(2);
  const areaStr = exact ? `${r2int}π` : `${r2.toFixed(2)}π`;

  // a touch point up and to the left gives room for the triangle labels
  const demo = touches.find((q) => q[0] < C[0] && q[1] > C[1]) ?? touches[0];
  const legX = demo ? Math.abs(demo[0] - C[0]) : 0;
  const legY = demo ? Math.abs(demo[1] - C[1]) : 0;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCircle = step >= 1 || isFinal;
  const showTouch = step >= 2 || isFinal;

  // ---- geometry ----
  const xs = cells.flatMap(([x]) => [x, x + 1]);
  const ys = cells.flatMap(([, y]) => [y, y + 1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const S = 34;
  const m = 18;
  const X = (x: number) => m + (x - minX) * S;
  const Y = (y: number) => m + (maxY - y) * S;
  const W = m * 2 + (maxX - minX) * S;
  const H = m * 2 + (maxY - minY) * S;
  const R = r * S;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {/* the region, one unit square at a time */}
        {cells.map(([x, y], i) => (
          <motion.rect
            key={i}
            x={X(x)}
            y={Y(y + 1)}
            width={S}
            height={S}
            fill={FILL}
            stroke="#c7d2fe"
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: i * 0.015 }}
          />
        ))}

        {/* the region's outline */}
        {segs.map(([a, b], i) => (
          <line key={`s${i}`} x1={X(a[0])} y1={Y(a[1])} x2={X(b[0])} y2={Y(b[1])} stroke={INK} strokeWidth={2} strokeLinecap="square" />
        ))}

        {/* the circle grows until it is stopped by the boundary */}
        <motion.circle
          cx={X(C[0])}
          cy={Y(C[1])}
          fill="rgba(67,56,202,0.16)"
          stroke={EDGE}
          strokeWidth={2}
          initial={{ r: 0 }}
          animate={{ r: showCircle ? R : 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.25 }}
        />

        {/* the right triangle explaining the radius */}
        <AnimatePresence>
          {showTouch && demo && (
            <motion.g key="tri" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.35 }}>
              <line x1={X(C[0])} y1={Y(C[1])} x2={X(demo[0])} y2={Y(C[1])} stroke={TOUCH} strokeWidth={2} />
              <line x1={X(demo[0])} y1={Y(C[1])} x2={X(demo[0])} y2={Y(demo[1])} stroke={TOUCH} strokeWidth={2} />
              <line x1={X(C[0])} y1={Y(C[1])} x2={X(demo[0])} y2={Y(demo[1])} stroke={EDGE} strokeWidth={2.5} />
              <text x={(X(C[0]) + X(demo[0])) / 2} y={Y(C[1]) + 14} textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                {legX}
              </text>
              <text x={X(demo[0]) - 8} y={(Y(C[1]) + Y(demo[1])) / 2 + 4} textAnchor="end" fontSize="12" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                {legY}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* where the circle jams against the boundary */}
        <AnimatePresence>
          {showTouch &&
            touches.map((q, i) => (
              <motion.circle
                key={`t${i}`}
                cx={X(q[0])}
                cy={Y(q[1])}
                r={4}
                fill={TOUCH}
                stroke="#fff"
                strokeWidth={1.2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.4 + i * 0.05 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
        </AnimatePresence>

        {/* centre */}
        <circle cx={X(C[0])} cy={Y(C[1])} r={3} fill={INK} />
      </svg>

      {/* caption */}
      <motion.span
        key={`${showCircle}-${showTouch}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTouch ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTouch ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTouch ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showCircle
          ? `${cells.length} unit squares — centre the circle`
          : !showTouch
          ? `grow it until the boundary stops it`
          : !isFinal
          ? `r² = ${legX}² + ${legY}² = ${r2int} → r = ${rStr}`
          : `area = πr² = ${areaStr} ${unit}²`}
      </motion.span>

      <AnimatePresence>
        {showTouch && (
          <motion.span
            key="touches"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8" }}
          >
            the circle touches at {touches.length} step corners
          </motion.span>
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
