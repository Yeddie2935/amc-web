import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#cbd5e1";
const FILL = "#c7d2fe";
const MARK = "#4338ca";
const HOT = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** The cells a segment's interior actually passes through, found by walking it. */
function crossedCells(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const ts = new Set([0, 1]);
  const add = (p: number, d: number) => {
    if (d === 0) return;
    const lo = Math.min(p, p + d);
    const hi = Math.max(p, p + d);
    for (let k = Math.ceil(lo); k <= Math.floor(hi); k++) {
      const t = (k - p) / d;
      if (t > 0 && t < 1) ts.add(t);
    }
  };
  add(x0, dx);
  add(y0, dy);
  const s = [...ts].sort((a, b) => a - b);
  const out: [number, number][] = [];
  for (let i = 0; i + 1 < s.length; i++) {
    const tm = (s[i] + s[i + 1]) / 2;
    out.push([Math.floor(x0 + tm * dx), Math.floor(y0 + tm * dy)]);
  }
  return out;
}

/**
 * How many unit cells a segment between lattice points passes through. Starting
 * inside one cell, the segment enters a new one at each grid line it crosses —
 * dx - 1 vertical lines and dy - 1 horizontal ones — except that at an interior
 * lattice point it crosses both at once and only gains one cell, and there are
 * gcd(dx,dy) - 1 such points. That collapses to dx + dy - gcd. Equivalently the
 * segment is gcd copies of a primitive step with no lattice point inside it. The
 * scene checks the rule against the problem's own worked example by walking that
 * segment cell by cell, then shows the primitive block and multiplies up.
 * Data: { from:[x,y], to:[x,y], example:{from:[x,y], to:[x,y]} }.
 */
export function LatticeCrossScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rdPt = (v: unknown, f: [number, number]): [number, number] =>
    Array.isArray(v) && v.length >= 2 ? [Math.round(num(v[0], f[0])), Math.round(num(v[1], f[1]))] : f;
  const from = rdPt(data.from, [0, 0]);
  const to = rdPt(data.to, [1, 1]);
  const ex = (data.example ?? {}) as Record<string, unknown>;
  const exFrom = rdPt(ex.from, [0, 0]);
  const exTo = rdPt(ex.to, [1, 1]);

  const dx = Math.abs(to[0] - from[0]);
  const dy = Math.abs(to[1] - from[1]);
  const g = gcd(dx, dy) || 1;
  const cells = dx + dy - g;

  // the primitive step the whole segment repeats
  const px = dx / g;
  const py = dy / g;
  const primCells = crossedCells(0, 0, px, py);
  const blocksOk = g * primCells.length === cells;

  // the worked example the problem shows, counted rather than assumed
  const eDx = Math.abs(exTo[0] - exFrom[0]);
  const eDy = Math.abs(exTo[1] - exFrom[1]);
  const eG = gcd(eDx, eDy) || 1;
  const exCells = crossedCells(exFrom[0], exFrom[1], exTo[0], exTo[1]);
  const exOk = exCells.length === eDx + eDy - eG;

  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === cells;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTally = !isFinal && step === 1;
  const showPrim = isFinal || step >= 2;

  // ---- geometry: whichever segment this beat is about ----
  const seg = showPrim ? { a: [0, 0] as [number, number], b: [px, py] as [number, number] } : { a: exFrom, b: exTo };
  const list = showPrim ? primCells : exCells;
  const cols = Math.abs(seg.b[0] - seg.a[0]);
  const rows = Math.abs(seg.b[1] - seg.a[1]);
  const lo = [Math.min(seg.a[0], seg.b[0]), Math.min(seg.a[1], seg.b[1])];

  const W = 340;
  const H = 190;
  const cell = Math.min(28, 132 / Math.max(1, rows), 96 / Math.max(1, cols));
  const gw = cols * cell;
  const gh = rows * cell;
  const gx = 34 + (96 - gw) / 2;
  const gy = 26 + (132 - gh) / 2;
  const X = (x: number) => gx + (x - lo[0]) * cell;
  const Y = (y: number) => gy + gh - (y - lo[1]) * cell;
  const panelX = 150;

  // interior lattice points on the segment: where two crossings coincide
  const inner: [number, number][] = [];
  const sg = gcd(Math.abs(seg.b[0] - seg.a[0]), Math.abs(seg.b[1] - seg.a[1])) || 1;
  for (let i = 1; i < sg; i++)
    inner.push([seg.a[0] + ((seg.b[0] - seg.a[0]) * i) / sg, seg.a[1] + ((seg.b[1] - seg.a[1]) * i) / sg]);

  const caption = isFinal
    ? `${g} × ${primCells.length} = ${cells}`
    : step === 0
    ? `the given segment crosses ${exCells.length} cells`
    : showTally
    ? `1 + ${eDx - 1} + ${eDy - 1} − ${eG - 1} = ${exCells.length}, which is ${eDx} + ${eDy} − ${eG}`
    : `gcd(${dx}, ${dy}) = ${g}, so the segment is ${g} copies of ${px} by ${py}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the cells the segment's interior passes through */}
        {list.map(([i, j], k) => (
          <motion.rect
            key={`${i}-${j}`}
            x={X(i)}
            y={Y(j + 1)}
            width={cell}
            height={cell}
            fill={showPrim ? "#dcfce7" : FILL}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 + k * 0.08 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        {/* the graph paper */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line key={`v${i}`} x1={gx + i * cell} y1={gy} x2={gx + i * cell} y2={gy + gh} stroke={GRID} strokeWidth={1} />
        ))}
        {Array.from({ length: rows + 1 }).map((_, j) => (
          <line key={`h${j}`} x1={gx} y1={gy + j * cell} x2={gx + gw} y2={gy + j * cell} stroke={GRID} strokeWidth={1} />
        ))}

        {/* which grid lines the segment actually crosses */}
        <AnimatePresence>
          {showTally && (
            <motion.g key="tk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: Math.max(0, cols - 1) }).map((_, i) => (
                <motion.line
                  key={`tv${i}`}
                  x1={gx + (i + 1) * cell}
                  y1={gy}
                  x2={gx + (i + 1) * cell}
                  y2={gy + gh}
                  stroke={MARK}
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                />
              ))}
              {Array.from({ length: Math.max(0, rows - 1) }).map((_, j) => (
                <motion.line
                  key={`th${j}`}
                  x1={gx}
                  y1={gy + (j + 1) * cell}
                  x2={gx + gw}
                  y2={gy + (j + 1) * cell}
                  stroke="#0d9488"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + j * 0.1 }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the segment */}
        <motion.line
          x1={X(seg.a[0])}
          y1={Y(seg.a[1])}
          x2={X(seg.b[0])}
          y2={Y(seg.b[1])}
          stroke={INK}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
        {[seg.a, seg.b].map((p, i) => (
          <circle key={i} cx={X(p[0])} cy={Y(p[1])} r={4} fill={INK} />
        ))}

        {/* where the segment hits a lattice point, gaining one cell instead of two */}
        <AnimatePresence>
          {inner.map(([x, y], i) => (
            <motion.g
              key={`in${i}`}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.7 + i * 0.12 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx={X(x)} cy={Y(y)} r={7} fill="none" stroke={HOT} strokeWidth={2.4} />
            </motion.g>
          ))}
        </AnimatePresence>

        {/* endpoint labels, on the example only */}
        {!showPrim && (
          <g>
            <text x={X(seg.a[0]) - 4} y={Y(seg.a[1]) - 8} textAnchor="end" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              ({seg.a[0]}, {seg.a[1]})
            </text>
            <text x={X(seg.b[0]) + 6} y={Y(seg.b[1]) + 14} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              ({seg.b[0]}, {seg.b[1]})
            </text>
          </g>
        )}

        {/* the running argument */}
        {step === 0 && !isFinal && (
          <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <text x={panelX} y={54} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
              across {eDx}, up {eDy}
            </text>
            <text x={panelX} y={76} fontSize="13" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              {exCells.length} cells
            </text>
            <text x={panelX} y={100} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              counted off the figure
            </text>
          </motion.g>
        )}

        <AnimatePresence>
          {showTally && (
            <motion.g key="tal" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              {[
                { t: `start in 1 cell`, v: "1", c: INK },
                { t: `${eDx - 1} vertical lines`, v: `+${eDx - 1}`, c: MARK },
                { t: `${eDy - 1} horizontal lines`, v: `+${eDy - 1}`, c: "#0d9488" },
                { t: `${eG - 1} corner${eG - 1 === 1 ? "" : "s"} counted twice`, v: `−${eG - 1}`, c: HOT },
              ].map((row, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.16 }}>
                  <text x={panelX} y={40 + i * 20} fontSize="9.5" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                    {row.t}
                  </text>
                  <text x={W - 10} y={40 + i * 20} textAnchor="end" fontSize="11" fontWeight="800" fill={row.c} fontFamily={numberFont}>
                    {row.v}
                  </text>
                </motion.g>
              ))}
              <line x1={panelX} y1={108} x2={W - 10} y2={108} stroke={INK} strokeWidth={1.3} />
              <motion.text
                x={W - 10}
                y={124}
                textAnchor="end"
                fontSize="13"
                fontWeight="800"
                fill={MARK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {exCells.length}
              </motion.text>
              <motion.text
                x={panelX}
                y={124}
                fontSize="10"
                fontWeight="800"
                fill={INK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                = {eDx}+{eDy}−{eG}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPrim && (
            <motion.g key="pr" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <text x={panelX} y={40} fontSize="10" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {dx} across, {dy} up
              </text>
              <text x={panelX} y={58} fontSize="11" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                gcd = {g}
              </text>
              <text x={panelX} y={82} fontSize="10" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                so it repeats a
              </text>
              <text x={panelX} y={96} fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {px} by {py} step
              </text>
              <text x={panelX} y={116} fontSize="10" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                no corner inside, so
              </text>
              <text x={panelX} y={132} fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {px}+{py}−1 = {primCells.length} cells
              </text>
              {isFinal && (
                <motion.text
                  x={panelX}
                  y={158}
                  fontSize="14"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.8 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left" }}
                >
                  × {g} = {cells}
                </motion.text>
              )}
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
        {caption}
      </motion.span>

      <AnimatePresence>
        {showTally && (
          <motion.span
            key="rule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: exOk ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {exOk ? `the rule reproduces the figure's own count` : `the rule disagrees with the figure`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && blocksOk ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && blocksOk
              ? `and directly: ${dx} + ${dy} − ${g} = ${cells}`
              : `the two routes disagree — ${g} × ${primCells.length} vs ${cells}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
