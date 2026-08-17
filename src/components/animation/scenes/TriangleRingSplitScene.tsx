import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const RING = "#f59e0b";
const RING_FILL = "#fef3c7";
const INNER_FILL = "#e0e7ff";
const PIECE = ["#818cf8", "#fbbf24", "#34d399"];
const PIECE_INK = ["#3730a3", "#b45309", "#047857"];

type Pt = [number, number];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const poly = (pts: Pt[]) => pts.map((p) => `${p[0]},${p[1]}`).join(" ");
const centroid = (pts: Pt[]): Pt => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];
/** Twice the signed area — used to check the drawing against the arithmetic. */
const area2 = (pts: Pt[]) => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a);
};

/**
 * A similar figure sitting inside a larger one, the ring between them cut into
 * congruent pieces — how does one piece compare with the inner figure? Side
 * ratios are the trap (the raw inner : outer area ratio is usually a choice),
 * and the unlock is that an equilateral triangle of side n **tiles into n² unit
 * triangles**, so with sides 3 and 2 the whole problem becomes counting: 9
 * outside, 4 inside, 5 left in the ring, shared by 3 pieces. That makes both
 * numbers of the answer literal — the ring's 5, and 12 = 3 pieces × the inner's
 * 4. The counting is legitimised on screen by **sliding the inner triangle into
 * a corner**, a rigid motion that changes no area but lands it exactly on 4
 * cells. The beats: the real figure with one piece rotating 120° onto the next
 * to show the congruence the problem asserts; the tiling and the slide; the
 * leftover cells counted; then back to the figure to share the ring out. Cell
 * counts, the reduced ratio and the named distractor are computed, and the
 * drawn polygons are re-measured by shoelace as a check; data
 * `{ outer, inner, pieces? }` as side lengths in a common unit.
 */
export function TriangleRingSplitScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const N = Math.max(2, Math.round(num(data.outer, 3)));
  const M = Math.max(1, Math.min(N - 1, Math.round(num(data.inner, 2))));
  const P = Math.max(1, Math.round(num(data.pieces, 3)));

  // ---- the whole answer, in unit triangles ----
  const cellsOuter = N * N;
  const cellsInner = M * M;
  const ringCells = cellsOuter - cellsInner;
  const ratioA = ringCells;
  const ratioB = P * cellsInner;
  const g = gcd(ratioA, ratioB) || 1;
  const rA = ratioA / g;
  const rB = ratioB / g;

  // the raw inner : outer area ratio — usually one of the choices
  const dA = cellsInner / (gcd(cellsInner, cellsOuter) || 1);
  const dB = cellsOuter / (gcd(cellsInner, cellsOuter) || 1);
  const decoy = (problem.choices ?? []).find((c) => {
    const m = String(c.text).match(/(\d+)\s*:\s*(\d+)/);
    return m != null && Number(m[1]) * dB === Number(m[2]) * dA;
  });

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 440;
  const H = 232;

  // ---- geometry ----
  const u = 64;
  const h = (u * Math.sqrt(3)) / 2;
  const x0 = 32;
  const y0 = 200;
  const A: Pt = [x0, y0];
  const B: Pt = [x0 + N * u, y0];
  const C: Pt = [x0 + (N * u) / 2, y0 - N * h];
  const outer: Pt[] = [A, B, C];
  const G = centroid(outer);
  const k = M / N;
  const innerPts: Pt[] = outer.map((v) => [G[0] + k * (v[0] - G[0]), G[1] + k * (v[1] - G[1])]);
  // the corner placement is the same triangle translated — no rotation, no scaling
  const slide: Pt = [A[0] - innerPts[0][0], A[1] - innerPts[0][1]];
  const cornerPts: Pt[] = innerPts.map((p) => [p[0] + slide[0], p[1] + slide[1]]);

  const pieces: Pt[][] = outer.map((v, i) => [v, outer[(i + 1) % 3], innerPts[(i + 1) % 3], innerPts[i]]);

  // rotating a piece 120° about the outer centroid: Motion pivots a group about
  // its own bbox centre, so the move is that spin plus a translation
  const th = (120 * Math.PI) / 180;
  const rot = (p: Pt): Pt => [
    G[0] + (p[0] - G[0]) * Math.cos(th) - (p[1] - G[1]) * Math.sin(th),
    G[1] + (p[0] - G[0]) * Math.sin(th) + (p[1] - G[1]) * Math.cos(th),
  ];
  const bbox = (pts: Pt[]): Pt => [
    (Math.min(...pts.map((p) => p[0])) + Math.max(...pts.map((p) => p[0]))) / 2,
    (Math.min(...pts.map((p) => p[1])) + Math.max(...pts.map((p) => p[1]))) / 2,
  ];
  const c0 = bbox(pieces[0]);
  const r0 = rot(c0);
  const spinDelta: Pt = [r0[0] - c0[0], r0[1] - c0[1]];
  // which piece does it land on? found, not assumed
  const g0 = centroid(pieces[0]);
  const gr = rot(g0);
  const landsOn = pieces
    .map((p, i) => ({ i, d: Math.hypot(centroid(p)[0] - gr[0], centroid(p)[1] - gr[1]) }))
    .sort((a, b) => a.d - b.d)[0];

  // ---- the unit-triangle tiling of the outer triangle ----
  type Cell = { pts: Pt[]; mid: Pt; inCorner: boolean };
  const cells: Cell[] = [];
  for (let r = 0; r < N; r++) {
    const bx = x0 + (r * u) / 2;
    const by = y0 - r * h;
    for (let j = 0; j < N - r; j++) {
      const p: Pt[] = [
        [bx + j * u, by],
        [bx + (j + 1) * u, by],
        [bx + j * u + u / 2, by - h],
      ];
      cells.push({ pts: p, mid: centroid(p), inCorner: r + j <= M - 1 });
    }
    for (let j = 0; j < N - r - 1; j++) {
      const p: Pt[] = [
        [bx + (j + 1) * u, by],
        [bx + j * u + u / 2, by - h],
        [bx + (j + 1) * u + u / 2, by - h],
      ];
      cells.push({ pts: p, mid: centroid(p), inCorner: r + j <= M - 2 });
    }
  }
  const covered = cells.filter((c) => c.inCorner);
  const leftover = cells.filter((c) => !c.inCorner);

  // ---- self-check: re-measure what was actually drawn ----
  const drawnPiece = area2(pieces[0]);
  const drawnInner = area2(innerPts);
  const drawnOk = Math.abs(drawnPiece / drawnInner - ratioA / ratioB) < 0.01;
  const countOk = covered.length === cellsInner && cells.length === cellsOuter && leftover.length === ringCells;
  const answerOk = problem.shortAnswer == null || `${rA} : ${rB}`.replace(/\s/g, "") === String(problem.shortAnswer).replace(/\s/g, "");
  const ok = drawnOk && countOk && answerOk && landsOn.i !== 0 && landsOn.d < 1;

  const showGrid = phase === 1 || phase === 2;
  const slid = phase === 1 || phase === 2;
  const px = 250; // panel left edge

  const Row = ({ y, label, value, color, delay }: { y: number; label: string; value: string; color: string; delay: number }) => (
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay }}>
      <text x={px} y={y} fontSize="10.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
        {label}
      </text>
      <text x={W - 14} y={y} textAnchor="end" fontSize="11.5" fontWeight="800" fill={color} fontFamily={numberFont}>
        {value}
      </text>
    </motion.g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 470 }}>
        {/* ---- the outer triangle ---- */}
        <polygon points={poly(outer)} fill={phase === 0 || phase === 3 ? "#fff" : "#f8fafc"} stroke={INK} strokeWidth={2} />

        {/* ---- the unit-triangle tiling ---- */}
        {showGrid &&
          cells.map((c, i) => (
            <motion.polygon
              key={`c${i}`}
              points={poly(c.pts)}
              fill={phase === 2 && !c.inCorner ? RING_FILL : "none"}
              stroke={DIM}
              strokeWidth={0.9}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
            />
          ))}

        {/* ---- the three trapezoids ---- */}
        {(phase === 0 || phase === 3) &&
          pieces.map((p, i) => (
            <motion.g
              key={`p${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.22 }}
            >
              <polygon points={poly(p)} fill={PIECE[i % PIECE.length]} fillOpacity={0.55} stroke={INK} strokeWidth={1.4} />
              {phase === 3 &&
                (() => {
                  // the trapezoids are thin, so the chip rides outside on a leader
                  const cg = centroid(p);
                  const d = Math.hypot(cg[0] - G[0], cg[1] - G[1]) || 1;
                  const cx = cg[0] + ((cg[0] - G[0]) / d) * 30;
                  const cy = cg[1] + ((cg[1] - G[1]) / d) * 30;
                  return (
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.6 + i * 0.15 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <line x1={cg[0]} y1={cg[1]} x2={cx} y2={cy} stroke={PIECE_INK[i % PIECE_INK.length]} strokeWidth={1} opacity={0.55} />
                      <rect x={cx - 18} y={cy - 9} width={36} height={18} rx={9} fill={PIECE[i % PIECE.length]} stroke={PIECE_INK[i % PIECE_INK.length]} strokeWidth={1} />
                      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={PIECE_INK[i % PIECE_INK.length]} fontFamily={numberFont}>
                        {ringCells}/{P}
                      </text>
                    </motion.g>
                  );
                })()}
            </motion.g>
          ))}

        {/* ---- one piece spins 120° onto the next: the congruence, shown ---- */}
        {phase === 0 && (
          <motion.g
            initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 0.9, 0.9, 0], rotate: [0, 0, 120, 120], x: [0, 0, spinDelta[0], spinDelta[0]], y: [0, 0, spinDelta[1], spinDelta[1]] }}
            transition={{ duration: 3.4, times: [0, 0.2, 0.72, 1], repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
          >
            <polygon points={poly(pieces[0])} fill="none" stroke={IND} strokeWidth={2.4} strokeDasharray="5 3" />
          </motion.g>
        )}

        {/* ---- the inner triangle: slides to the corner, slides back ---- */}
        <motion.g
          animate={{ x: slid ? slide[0] : 0, y: slid ? slide[1] : 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 16, delay: phase === 1 ? 0.7 : 0.2 }}
        >
          <polygon
            points={poly(innerPts)}
            fill={showGrid ? INNER_FILL : "#fff"}
            fillOpacity={showGrid ? 0.92 : 1}
            stroke={IND}
            strokeWidth={2}
          />
          {phase === 3 && (
            <motion.text
              x={G[0]}
              y={G[1] + 4}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.05 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {cellsInner}
            </motion.text>
          )}
        </motion.g>

        {/* the slide is a rigid motion — show the ghost it left behind */}
        <AnimatePresence>
          {phase === 1 && (
            <motion.g key="ghost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>
              <polygon points={poly(innerPts)} fill="none" stroke={IND} strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />
              <motion.path
                d={`M ${centroid(innerPts)[0]},${centroid(innerPts)[1]} L ${centroid(cornerPts)[0]},${centroid(cornerPts)[1]}`}
                stroke={IND}
                strokeWidth={1.3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.75 }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* ---- cell numbers, drawn last so the inner triangle cannot hide them ---- */}
        {phase === 1 &&
          cells.map((c, i) => (
            <motion.text
              key={`n${i}`}
              x={c.mid[0]}
              y={c.mid[1] + 3.5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill={c.inCorner ? IND : DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 + i * 0.09 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {i + 1}
            </motion.text>
          ))}
        {phase === 2 &&
          leftover.map((c, i) => (
            <motion.text
              key={`l${i}`}
              x={c.mid[0]}
              y={c.mid[1] + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={RING}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.7 + i * 0.16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {i + 1}
            </motion.text>
          ))}

        {/* ---- side labels ---- */}
        {phase === 0 && (
          <g>
            <text x={(A[0] + B[0]) / 2} y={y0 + 18} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {N}
            </text>
            <text x={(innerPts[0][0] + innerPts[1][0]) / 2} y={innerPts[0][1] - 7} textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {M}
            </text>
          </g>
        )}

        {/* ---- running panel ---- */}
        <line x1={px - 16} y1={26} x2={px - 16} y2={H - 20} stroke="#e2e8f0" strokeWidth={1.5} />
        {phase === 0 && (
          <g>
            <Row y={44} label="outer side" value={`${N}`} color={INK} delay={0.15} />
            <Row y={64} label="inner side" value={`${M}`} color={IND} delay={0.3} />
            <motion.text
              x={px}
              y={96}
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              a 120° turn carries
            </motion.text>
            <motion.text
              x={px}
              y={110}
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              each piece to the next —
            </motion.text>
            <motion.text
              x={px}
              y={124}
              fontSize="10"
              fontWeight="800"
              fill={IND}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              all {P} are congruent
            </motion.text>
          </g>
        )}
        {phase === 1 && (
          <g>
            <Row y={44} label={`side ${N} splits into`} value={`${cellsOuter}`} color={INK} delay={0.2} />
            <Row y={64} label={`side ${M} covers`} value={`${cellsInner}`} color={IND} delay={1.4} />
            <motion.text x={px} y={96} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              sliding it moves no area
            </motion.text>
            {decoy && (
              <motion.text x={px} y={116} fontSize="10" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                inner : outer = {dA} : {dB} ({decoy.label})
              </motion.text>
            )}
            {decoy && (
              <motion.text x={px} y={130} fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                — but that is not what is asked
              </motion.text>
            )}
          </g>
        )}
        {phase === 2 && (
          <g>
            <Row y={44} label="outer" value={`${cellsOuter}`} color={INK} delay={0.2} />
            <Row y={64} label="inner" value={`− ${cellsInner}`} color={IND} delay={0.35} />
            <motion.line x1={px} y1={72} x2={W - 14} y2={72} stroke={INK} strokeWidth={1.2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.5 }} />
            <Row y={88} label="the ring" value={`${ringCells}`} color={RING} delay={0.6} />
            <motion.text x={px} y={118} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              {ringCells} unit triangles left,
            </motion.text>
            <motion.text x={px} y={132} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              wherever the inner sits
            </motion.text>
          </g>
        )}
        {phase === 3 && (
          <g>
            <Row y={44} label="each piece" value={`${ringCells}/${P}`} color={RING} delay={0.7} />
            <Row y={64} label="inner" value={`${cellsInner}`} color={IND} delay={1.1} />
            <motion.text x={px} y={96} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              {ringCells}/{P} : {cellsInner}
            </motion.text>
            <motion.text x={px} y={114} fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}>
              × {P} on both sides
            </motion.text>
            <motion.text
              x={px}
              y={140}
              fontSize="17"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            >
              {rA} : {rB}
            </motion.text>
            <motion.text x={px} y={160} fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.85 }}>
              {rB} = {P} pieces × {cellsInner}
            </motion.text>
          </g>
        )}
      </svg>

      <motion.span
        key={phase}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: phase === 3 ? "#166534" : "#4338ca",
          background: phase === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `the ring between them splits into ${P} congruent trapezoids`
          : phase === 1
          ? `a triangle of side ${M} covers ${cellsInner} of the ${cellsOuter} — the ratio is ${dA} : ${dB}, not ${M} : ${N}`
          : phase === 2
          ? `${cellsOuter} − ${cellsInner} = ${ringCells} unit triangles in the ring`
          : `one piece is ${ringCells}/${P} unit triangles against the inner triangle's ${cellsInner}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: drawn {(drawnPiece / drawnInner).toFixed(3)} vs {(ratioA / ratioB).toFixed(3)}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
