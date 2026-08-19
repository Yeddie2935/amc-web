import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const RHOMB = "#7c3aed";
const DIAG = "#f59e0b";
const RECT = "#2563eb";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GRID = "#e2e8f0";
const MUTE = "#94a3b8";

const W = 360;
const H = 208;
const PX = 218; // panel left

type P = { x: number; y: number };

/** n = k²·r with r square-free, so √80 prints as 4√5. */
function simplifySqrt(n: number): { k: number; r: number } {
  let k = 1;
  let r = Math.round(n);
  for (let f = 2; f * f <= r; f++) {
    while (r % (f * f) === 0) {
      r /= f * f;
      k *= f;
    }
  }
  return { k, r };
}
const surd = (n: number) => {
  const { k, r } = simplifySqrt(n);
  return r === 1 ? `${k}` : k === 1 ? `√${r}` : `${k}√${r}`;
};
const tidy = (v: number) => String(Number(v.toFixed(4)));

/**
 * The four **midpoints of a rectangle's sides** are given and its area is
 * wanted. The rectangle is tilted, so nothing can be read off the axes — but the
 * segment joining two *opposite* midpoints is a midline: it runs parallel to the
 * other pair of sides and is exactly as long as them. So the two
 * opposite-midpoint segments are the rectangle's own dimensions, already lying
 * on the page, and the area is just their product.
 * The scene builds that: it orders the points around their centre, pairs the
 * opposite ones, measures each pair with a real slope triangle (keeping the
 * lengths as exact surds, so √80 stays 4√5 and the product comes out a clean
 * integer), then **reconstructs the rectangle** from the centre and the two
 * half-vectors and checks that each given point really is the midpoint of a side
 * it drew. Perpendicularity of the two segments is verified rather than assumed.
 * The closing beat prices the two traps that land on real answer choices: the
 * midpoint quadrilateral's *own* area (half the rectangle's), and the fact that
 * the quadrilateral is a rhombus with equal sides, which invites squaring one.
 * Data: { points: [[-3,0],[2,0],[5,4],[0,4]] }.
 */
export function MidpointRectScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const raw: P[] = (Array.isArray(data.points) ? data.points : [])
    .map((p) => (Array.isArray(p) ? { x: Number(p[0]), y: Number(p[1]) } : null))
    .filter((p): p is P => !!p && Number.isFinite(p.x) && Number.isFinite(p.y));

  const cx = raw.reduce((a, p) => a + p.x, 0) / Math.max(1, raw.length);
  const cy = raw.reduce((a, p) => a + p.y, 0) / Math.max(1, raw.length);
  // walking them round the centre puts opposite midpoints two apart
  const ring = [...raw].sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));

  const v1 = { x: ring[2].x - ring[0].x, y: ring[2].y - ring[0].y };
  const v2 = { x: ring[3].x - ring[1].x, y: ring[3].y - ring[1].y };
  const q1 = v1.x * v1.x + v1.y * v1.y;
  const q2 = v2.x * v2.x + v2.y * v2.y;
  const perp = Math.abs(v1.x * v2.x + v1.y * v2.y) < 1e-9;
  const area = Math.round(Math.sqrt(q1 * q2) * 1e6) / 1e6;

  const s1 = simplifySqrt(q1);
  const s2 = simplifySqrt(q2);
  const sameRoot = s1.r === s2.r;

  // the rectangle itself: centre plus each half-diagonal, both ways
  const h1 = { x: v1.x / 2, y: v1.y / 2 };
  const h2 = { x: v2.x / 2, y: v2.y / 2 };
  const verts: P[] = [
    { x: cx + h1.x + h2.x, y: cy + h1.y + h2.y },
    { x: cx + h1.x - h2.x, y: cy + h1.y - h2.y },
    { x: cx - h1.x - h2.x, y: cy - h1.y - h2.y },
    { x: cx - h1.x + h2.x, y: cy - h1.y + h2.y },
  ];
  const sideMids = verts.map((p, i) => {
    const q = verts[(i + 1) % 4];
    return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  });
  const midsMatch = raw.every((p) => sideMids.some((m) => Math.abs(m.x - p.x) < 1e-9 && Math.abs(m.y - p.y) < 1e-9));

  const rhombSides = ring.map((p, i) => {
    const q = ring[(i + 1) % 4];
    return Math.hypot(q.x - p.x, q.y - p.y);
  });
  const equalSides = rhombSides.every((s) => Math.abs(s - rhombSides[0]) < 1e-9);

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const choiceFor = (v: number) => opts.find((o) => Math.abs(o.value - v) < 1e-9);
  const winner = choiceFor(area);
  const agrees = !problem.answer || winner?.label === problem.answer;
  const slips = [
    { why: "the midpoint shape's own area", v: area / 2 },
    ...(equalSides ? [{ why: `its sides are all ${tidy(rhombSides[0])}`, v: rhombSides[0] ** 2 }] : []),
  ]
    .map((s) => ({ ...s, choice: choiceFor(s.v) }))
    .filter((s) => s.choice && Math.abs(s.v - area) > 1e-9);

  // the plane, sized to hold the rectangle it is about to draw
  const all = [...raw, ...verts];
  const xlo = Math.floor(Math.min(...all.map((p) => p.x)) - 1);
  const xhi = Math.ceil(Math.max(...all.map((p) => p.x)) + 1);
  const ylo = Math.floor(Math.min(...all.map((p) => p.y)) - 1);
  const yhi = Math.ceil(Math.max(...all.map((p) => p.y)) + 1);
  const u = Math.min(200 / (xhi - xlo), 168 / (yhi - ylo));
  const X0 = 8 + (200 - (xhi - xlo) * u) / 2;
  const YB = 190 - (168 - (yhi - ylo) * u) / 2;
  const sx = (x: number) => X0 + (x - xlo) * u;
  const sy = (y: number) => YB - (y - ylo) * u;
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showDiag = isFinal || step >= Math.max(1, Math.round(preSteps / 3));
  const showRect = isFinal || step >= Math.max(1, Math.round((preSteps * 2) / 3));

  const caption = isFinal
    ? `${surd(q1)} × ${surd(q2)} = ${tidy(area)}`
    : !showDiag
    ? `the four midpoints make a rhombus — every side is ${tidy(rhombSides[0])}, but that is not the rectangle`
    : !showRect
    ? `joining opposite midpoints gives ${surd(q1)} and ${surd(q2)}, meeting at right angles`
    : `each of those segments is as long as a side of the rectangle it came from`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the plane */}
        {range(xlo, xhi).map((gx) => (
          <line key={`vx${gx}`} x1={sx(gx)} y1={sy(yhi)} x2={sx(gx)} y2={sy(ylo)} stroke={gx === 0 ? "#cbd5e1" : GRID} strokeWidth={gx === 0 ? 1.3 : 0.8} />
        ))}
        {range(ylo, yhi).map((gy) => (
          <line key={`hy${gy}`} x1={sx(xlo)} y1={sy(gy)} x2={sx(xhi)} y2={sy(gy)} stroke={gy === 0 ? "#cbd5e1" : GRID} strokeWidth={gy === 0 ? 1.3 : 0.8} />
        ))}

        {/* the rectangle the midpoints came from */}
        <AnimatePresence>
          {showRect && (
            <motion.g key="rect" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.path
                d={`M ${verts.map((p) => `${sx(p.x)} ${sy(p.y)}`).join(" L ")} Z`}
                fill={isFinal ? WIN : "none"}
                fillOpacity={isFinal ? 0.15 : 0}
                stroke={RECT}
                strokeWidth={2.2}
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 0.25 }}
              />
              {verts.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={sx(p.x)}
                  cy={sy(p.y)}
                  r={2.6}
                  fill={RECT}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 1 + i * 0.08 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the quadrilateral the midpoints themselves make */}
        <motion.path
          d={`M ${ring.map((p) => `${sx(p.x)} ${sy(p.y)}`).join(" L ")} Z`}
          fill={RHOMB}
          fillOpacity={showDiag ? 0.05 : 0.12}
          stroke={RHOMB}
          strokeWidth={1.6}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        />
        {!showDiag &&
          ring.map((p, i) => {
            const q = ring[(i + 1) % 4];
            return (
              <motion.text
                key={`s${i}`}
                x={(sx(p.x) + sx(q.x)) / 2}
                y={(sy(p.y) + sy(q.y)) / 2 - 3}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill={RHOMB}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.12 }}
              >
                {tidy(rhombSides[i])}
              </motion.text>
            );
          })}

        {/* the two segments joining opposite midpoints, each with its legs */}
        <AnimatePresence>
          {showDiag &&
            [
              { a: ring[0], b: ring[2], q: q1 },
              { a: ring[1], b: ring[3], q: q2 },
            ].map((d, i) => (
              <motion.g key={`d${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.line
                  x1={sx(d.a.x)}
                  y1={sy(d.a.y)}
                  x2={sx(d.b.x)}
                  y2={sy(d.b.y)}
                  stroke={DIAG}
                  strokeWidth={2.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.5 }}
                />
                {!showRect && (() => {
                  // corner on the far x for one triangle, the far y for the other,
                  // or both horizontal legs land on the same stretch of axis
                  const corner = i === 0 ? { x: d.b.x, y: d.a.y } : { x: d.a.x, y: d.b.y };
                  const hy = corner.y; // the horizontal leg's height
                  const away = i === 0 ? (d.b.y > d.a.y ? 10 : -4) : d.a.y > d.b.y ? 10 : -4;
                  return (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.5 }}>
                      <line x1={sx(d.a.x)} y1={sy(d.a.y)} x2={sx(corner.x)} y2={sy(corner.y)} stroke={DIAG} strokeWidth={1.1} strokeDasharray="3 3" />
                      <line x1={sx(corner.x)} y1={sy(corner.y)} x2={sx(d.b.x)} y2={sy(d.b.y)} stroke={DIAG} strokeWidth={1.1} strokeDasharray="3 3" />
                      <text x={(sx(d.a.x) + sx(d.b.x)) / 2} y={sy(hy) + away} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={DIAG} fontFamily={numberFont}>
                        {Math.abs(d.b.x - d.a.x)}
                      </text>
                      <text x={sx(corner.x) + (corner.x >= cx ? 5 : -5)} y={(sy(d.a.y) + sy(d.b.y)) / 2 + 3} textAnchor={corner.x >= cx ? "start" : "end"} fontSize="8.5" fontWeight="800" fill={DIAG} fontFamily={numberFont}>
                        {Math.abs(d.b.y - d.a.y)}
                      </text>
                    </motion.g>
                  );
                })()}
              </motion.g>
            ))}
        </AnimatePresence>

        {/* the given midpoints, sitting on the sides they bisect */}
        {ring.map((p, i) => {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const m = Math.hypot(dx, dy) || 1;
          return (
            <motion.g
              key={`p${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 + i * 0.1 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx={sx(p.x)} cy={sy(p.y)} r={3.6} fill={INK} />
              {!showRect && (
                <text
                  x={sx(p.x) + (dx / m) * 15}
                  y={sy(p.y) - (dy / m) * 15 + 3}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="800"
                  fill={INK}
                  fontFamily={numberFont}
                >
                  ({tidy(p.x)},{tidy(p.y)})
                </text>
              )}
            </motion.g>
          );
        })}

        {/* the panel */}
        <AnimatePresence mode="wait">
          <motion.g key={isFinal ? "f" : showRect ? "r" : showDiag ? "d" : "s"} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {isFinal ? (
              <>
                <text x={PX} y={34} fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  area = side × side
                </text>
                <text x={PX} y={56} fontSize="13" fontWeight="800" fill={RECT} fontFamily={numberFont}>
                  {surd(q1)} × {surd(q2)}
                </text>
                {sameRoot && (
                  <text x={PX} y={76} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    = {s1.k * s2.k} × {s1.r}
                  </text>
                )}
                <motion.text
                  x={PX}
                  y={100}
                  fontSize="18"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.2 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                >
                  = {tidy(area)}
                </motion.text>
                {slips.map((s, i) => (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + i * 0.3 }}>
                    <text x={PX} y={124 + i * 24} fontSize="8" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                      {s.why}
                    </text>
                    <text x={PX} y={135 + i * 24} fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {tidy(s.v)} = ({s.choice!.label})
                    </text>
                  </motion.g>
                ))}
              </>
            ) : showRect ? (
              <>
                <text x={PX} y={34} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  each segment joins
                </text>
                <text x={PX} y={45} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  two opposite sides,
                </text>
                <text x={PX} y={56} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  so it is as long as
                </text>
                <text x={PX} y={67} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  the other two
                </text>
                <text x={PX} y={92} fontSize="12" fontWeight="800" fill={RECT} fontFamily={numberFont}>
                  sides {surd(q1)}
                </text>
                <text x={PX} y={110} fontSize="12" fontWeight="800" fill={RECT} fontFamily={numberFont}>
                  and {surd(q2)}
                </text>
                <text x={PX} y={134} fontSize="8.5" fontWeight="700" fill={midsMatch ? MUTE : BAD} fontFamily={numberFont}>
                  {midsMatch ? "each dot bisects a side" : "the dots miss the midpoints"}
                </text>
              </>
            ) : showDiag ? (
              <>
                <text x={PX} y={34} fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  join opposite midpoints
                </text>
                <text x={PX} y={56} fontSize="9.5" fontWeight="800" fill={DIAG} fontFamily={numberFont}>
                  √({Math.abs(v1.x)}² + {Math.abs(v1.y)}²)
                </text>
                <text x={PX} y={70} fontSize="11" fontWeight="800" fill={DIAG} fontFamily={numberFont}>
                  = √{q1} = {surd(q1)}
                </text>
                <text x={PX} y={94} fontSize="9.5" fontWeight="800" fill={DIAG} fontFamily={numberFont}>
                  √({Math.abs(v2.x)}² + {Math.abs(v2.y)}²)
                </text>
                <text x={PX} y={108} fontSize="11" fontWeight="800" fill={DIAG} fontFamily={numberFont}>
                  = √{q2} = {surd(q2)}
                </text>
                <text x={PX} y={132} fontSize="8.5" fontWeight="700" fill={perp ? MUTE : BAD} fontFamily={numberFont}>
                  {perp ? "and they are perpendicular" : "these are not perpendicular"}
                </text>
              </>
            ) : (
              <>
                <text x={PX} y={34} fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  the four midpoints
                </text>
                {ring.map((p, i) => (
                  <text key={i} x={PX} y={52 + i * 15} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    ({tidy(p.x)}, {tidy(p.y)})
                  </text>
                ))}
                <text x={PX} y={128} fontSize="9" fontWeight="800" fill={RHOMB} fontFamily={numberFont}>
                  {equalSides ? `all sides ${tidy(rhombSides[0])}` : "sides differ"}
                </text>
                <text x={PX} y={142} fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  a rhombus, not the answer
                </text>
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
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
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && midsMatch && perp ? MUTE : BAD, textAlign: "center" }}
          >
            {!perp
              ? `the two segments are not perpendicular, so these are not a rectangle's midpoints`
              : !midsMatch
              ? `the rebuilt rectangle does not have these points as its side midpoints`
              : !agrees
              ? `this gives ${tidy(area)}, not the stored answer`
              : `checked: every given point is the midpoint of a side of the rectangle drawn`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
