import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const DARK = "#7c8aa5";
const LIGHT = "#c3cddc";
const INK = "#1f2a44";

type P = [number, number];

function readPairs(value: unknown): P[] {
  return Array.isArray(value)
    ? value
        .filter((p) => Array.isArray(p) && p.length >= 2)
        .map((p) => [num((p as unknown[])[0], 0), num((p as unknown[])[1], 0)] as P)
    : [];
}
function readTris(value: unknown): P[][] {
  return Array.isArray(value) ? value.map((t) => readPairs(t)).filter((t) => t.length === 3) : [];
}
/** Shoelace area of a simple polygon in grid units. */
function polyArea(pts: P[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}
/** The right-angle vertex of an axis-aligned right triangle: it shares x with
 *  one other vertex and y with the remaining one. */
function rightAngleVertex(t: P[]): P {
  for (const v of t) {
    const others = t.filter((o) => o !== v);
    const sharesX = others.some((o) => o[0] === v[0]);
    const sharesY = others.some((o) => o[1] === v[1]);
    if (sharesX && sharesY) return v;
  }
  return t[0];
}
const COMPLEMENT: Record<string, string> = { BL: "TR", TR: "BL", BR: "TL", TL: "BR" };

/**
 * A figure drawn on an n×n grid out of whole unit squares and half-cell right
 * triangles: "what fraction / percent of the grid is shaded?" The shaded area is
 * computed (squares + shoelace of each triangle), and the triangles are paired by
 * complementary right-angle corners so each pair *slides into an empty cell* and
 * tiles it exactly — turning 2k halves into k whole squares, which makes the
 * fraction readable straight off the grid.
 * Data: { grid, squares:[[x,y],...], triangles:[[[x,y],[x,y],[x,y]],...] }.
 */
export function ShadedGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const G = Math.max(1, num(data.grid, 4));
  const squares = readPairs(data.squares);
  const triangles = readTris(data.triangles);

  // ---- areas (computed, never asserted) ----
  const triArea = triangles.reduce((a, t) => a + polyArea(t), 0);
  const shaded = squares.length + triArea;
  const cells = G * G;
  const percent = (shaded / cells) * 100;
  const halvesMake = Math.round(triArea); // whole squares the triangles combine into

  // ---- classify triangles: home cell + right-angle corner type ----
  const tris = triangles.map((pts, i) => {
    const cx = Math.min(...pts.map((p) => p[0]));
    const cy = Math.min(...pts.map((p) => p[1]));
    const ra = rightAngleVertex(pts);
    const type = `${ra[1] === cy ? "B" : "T"}${ra[0] === cx ? "L" : "R"}`;
    return { i, pts, cell: [cx, cy] as P, type };
  });

  // ---- empty cells (no square, no triangle) ----
  const taken = new Set<string>();
  squares.forEach(([x, y]) => taken.add(`${x},${y}`));
  tris.forEach((t) => taken.add(`${t.cell[0]},${t.cell[1]}`));
  const empties: P[] = [];
  for (let y = G - 1; y >= 0; y--)
    for (let x = 0; x < G; x++) if (!taken.has(`${x},${y}`)) empties.push([x, y]);

  // ---- pair complementary triangles, each pair into the nearest empty cell ----
  const target = new Map<number, P>();
  const used = new Set<number>();
  const pool = [...empties];
  for (const t of tris) {
    if (used.has(t.i)) continue;
    const partner = tris.find((o) => !used.has(o.i) && o.i !== t.i && o.type === COMPLEMENT[t.type]);
    if (!partner || pool.length === 0) continue;
    const mx = (t.cell[0] + partner.cell[0]) / 2;
    const my = (t.cell[1] + partner.cell[1]) / 2;
    let best = 0;
    let bestD = Infinity;
    pool.forEach((c, k) => {
      const d = (c[0] - mx) ** 2 + (c[1] - my) ** 2;
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    });
    const cell = pool.splice(best, 1)[0];
    used.add(t.i);
    used.add(partner.i);
    target.set(t.i, cell);
    target.set(partner.i, cell);
  }
  const filledCells = squares.length + target.size / 2;

  // ---- screen mapping (grid y is up, SVG y is down) ----
  const pad = 14;
  const s = 46;
  const W = pad * 2 + G * s;
  const X = (gx: number) => pad + gx * s;
  const Y = (gy: number) => pad + (G - gy) * s;
  const pts = (poly: P[]) => poly.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");
  const cxG = G / 2;
  const cyG = G / 2;

  const last = totalSteps - 1;
  const showCenter = step >= 1;
  const showMerge = step >= 2;
  const final = step >= last;

  // Two-tone piecing: a piece is dark when its centroid falls in an even 45°
  // sector around the grid centre. Adding 90° shifts by two sectors, so the
  // shading is a quarter-turn pinwheel like the printed block.
  function isDark(poly: P[]): boolean {
    const mx = poly.reduce((a, p) => a + p[0], 0) / poly.length - cxG;
    const my = poly.reduce((a, p) => a + p[1], 0) / poly.length - cyG;
    let deg = (Math.atan2(my, mx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return Math.floor(deg / 45) % 2 === 0;
  }

  // Split a center square along the diagonal through the grid centre, so the
  // pieces radiate from the middle the way the quilt block is pieced.
  function halves(sq: P): { poly: P[]; dark: boolean }[] {
    const [x, y] = sq;
    const corners: P[] = [
      [x, y],
      [x + 1, y],
      [x + 1, y + 1],
      [x, y + 1],
    ];
    let ci = corners.findIndex((c) => c[0] === cxG && c[1] === cyG);
    if (ci < 0) ci = 0;
    const c = corners[ci];
    const opp = corners[(ci + 2) % 4];
    const n1 = corners[(ci + 1) % 4];
    const n2 = corners[(ci + 3) % 4];
    const A: P[] = [c, opp, n1];
    const B: P[] = [c, opp, n2];
    return [
      { poly: A, dark: isDark(A) },
      { poly: B, dark: isDark(B) },
    ];
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${W}`} width="100%" style={{ maxWidth: 300 }}>
        {/* empty-cell landing pads, shown while the halves fly in */}
        {showMerge &&
          empties.slice(0, filledCells - squares.length).map(([x, y], i) => (
            <motion.rect
              key={`pad${i}`}
              x={X(x)}
              y={Y(y + 1)}
              width={s}
              height={s}
              fill="#dcfce7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            />
          ))}

        {/* centre squares, pieced in two tones */}
        {squares.map((sq, si) =>
          halves(sq).map((h, hi) => (
            <motion.polygon
              key={`s${si}-${hi}`}
              points={pts(h.poly)}
              fill={h.dark ? DARK : LIGHT}
              stroke={INK}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: si * 0.08 + hi * 0.04 }}
            />
          ))
        )}

        {/* highlight ring around the centre block */}
        <AnimatePresence>
          {showCenter && !showMerge && (
            <motion.g key="ring">
              {squares.map(([x, y], i) => (
                <motion.rect
                  key={i}
                  x={X(x)}
                  y={Y(y + 1)}
                  width={s}
                  height={s}
                  fill="none"
                  stroke="#4338ca"
                  strokeWidth="2.5"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.09 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the half-cell triangles — they slide into the empty cells on merge */}
        {tris.map((t, k) => {
          const tgt = target.get(t.i);
          const dx = showMerge && tgt ? (tgt[0] - t.cell[0]) * s : 0;
          const dy = showMerge && tgt ? -(tgt[1] - t.cell[1]) * s : 0;
          return (
            <motion.g
              key={`t${t.i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: dx, y: dy }}
              transition={{
                opacity: { duration: 0.35, delay: 0.3 + k * 0.05 },
                default: { type: "spring", stiffness: 90, damping: 17, delay: 0.2 + k * 0.07 },
              }}
            >
              <polygon points={pts(t.pts)} fill={isDark(t.pts) ? DARK : LIGHT} stroke={INK} strokeWidth="1" />
            </motion.g>
          );
        })}

        {/* grid lines on top */}
        {Array.from({ length: G + 1 }).map((_, i) => (
          <g key={`g${i}`}>
            <line x1={X(0)} y1={Y(i)} x2={X(G)} y2={Y(i)} stroke="#334155" strokeWidth="1" />
            <line x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(G)} stroke="#334155" strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* running tally */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {showCenter && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: "#4338ca", background: "#eef2ff", border: "1px solid #c7d2fe", padding: "4px 12px", borderRadius: 999 }}
          >
            centre = {squares.length} whole squares
          </motion.span>
        )}
        {showMerge && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: "#166534", background: "#dcfce7", border: "1px solid #bbf7d0", padding: "4px 12px", borderRadius: 999 }}
          >
            {tris.length} halves → {halvesMake} squares
          </motion.span>
        )}
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="total"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: numberFont, fontSize: 17, fontWeight: 800, color: INK }}
          >
            {squares.length} + {halvesMake} = <span style={{ color: "#4338ca" }}>{shaded}</span> of {cells} ={" "}
            <span style={{ color: "#16a34a" }}>{Number(percent.toFixed(2))}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
