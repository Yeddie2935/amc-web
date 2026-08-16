import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const PAPER = "#e2e8f0";
const CREASE = "#94a3b8";
const MARK = "#4338ca";
const HOT = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

const W = 345;
const H = 178;
const S = 64;
const cx = 105;
const cy = 96;
const EPS = 1e-6;

const toX = (u: number) => cx + u * S;
const toY = (v: number) => cy - v * S;

type Pt = [number, number];

const path = (pts: Pt[]) => pts.map(([u, v], i) => `${i ? "L" : "M"} ${toX(u)} ${toY(v)}`).join(" ") + " Z";

/** The four quarters of the sheet, and which folds carry each onto the packet. */
const QUADS = [
  { id: "TL", u0: -1, u1: 0, v0: 0, v1: 1, fx: false, fy: false, off: 0 },
  { id: "TR", u0: 0, u1: 1, v0: 0, v1: 1, fx: true, fy: false, off: 2.5 },
  { id: "BL", u0: -1, u1: 0, v0: -1, v1: 0, fx: false, fy: true, off: 5 },
  { id: "BR", u0: 0, u1: 1, v0: -1, v1: 0, fx: true, fy: true, off: 7.5 },
];

/**
 * A square sheet folded twice into quarters, cut along a line at one corner of
 * the packet, then unfolded. The unlock is that the snipped corner is the
 * **centre of the sheet**, and the two folds are mirrors — so the single cut
 * comes back reflected across both fold lines, and four corner triangles meeting
 * at a point make a diamond. The beats fold the sheet (each quarter swinging
 * onto the packet about its own fold line), cut through all four layers at once,
 * then undo the folds one at a time — the half-open stage showing a *triangle*
 * hole, which is exactly the trap of stopping one fold early. Every copy of the
 * cut is produced by reflecting the given polygon, and the hole's outline is
 * found by dropping the edges that lie on a fold line, so the shape is derived.
 * Data: { cutPoly: [x,y, x,y, ...] } in packet coords, corner-at-origin.
 */
export function PaperFoldCutScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const flat = (Array.isArray(data.cutPoly) ? data.cutPoly : []).map(Number);
  if (flat.length < 6 || flat.length % 2 !== 0 || flat.some((n) => !Number.isFinite(n))) return null;

  // packet coords (corner at the sheet's centre) -> sheet coords of the top-left quarter
  const base: Pt[] = [];
  for (let i = 0; i < flat.length; i += 2) base.push([-flat[i], flat[i + 1]]);

  const last = totalSteps - 1;
  const stage = step <= 0 ? "fold" : step === 1 ? "cut" : step >= last ? "open" : "half";
  const cutMade = stage !== "fold";
  const unfoldY = stage === "half" || stage === "open";
  const unfoldX = stage === "open";
  const stacked = stage === "fold" || stage === "cut";

  const layers = QUADS.length;
  const tri = (q: (typeof QUADS)[number]): Pt[] => base.map(([u, v]) => [q.fx ? -u : u, q.fy ? -v : v] as Pt);

  // the hole's outline is whatever is not folded away onto a mirror line
  const holeEdges: { a: Pt; b: Pt; len: number }[] = [];
  for (const q of QUADS) {
    const p = tri(q);
    for (let i = 0; i < p.length; i++) {
      const a = p[i];
      const b = p[(i + 1) % p.length];
      if (unfoldX && Math.abs(a[0]) < EPS && Math.abs(b[0]) < EPS) continue;
      if (unfoldY && Math.abs(a[1]) < EPS && Math.abs(b[1]) < EPS) continue;
      if (!unfoldX && q.fx) continue; // folded copies sit exactly on the packet
      if (!unfoldY && q.fy) continue;
      holeEdges.push({ a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) });
    }
  }
  const sides = holeEdges.length;
  const equal = sides > 0 && holeEdges.every((e) => Math.abs(e.len - holeEdges[0].len) < 1e-9);
  const isDiamond = stage === "open" && sides === 4 && equal;

  // the outer edge of however much paper is open right now
  const sheet: Pt[] = [
    [-1, unfoldY ? -1 : 0],
    [unfoldX ? 1 : 0, unfoldY ? -1 : 0],
    [unfoldX ? 1 : 0, 1],
    [-1, 1],
  ];

  const notes =
    stage === "fold"
      ? ["fold 1 — right half over", "fold 2 — bottom half up", `${layers} layers, quarter size`]
      : stage === "cut"
      ? [`one cut, all ${layers} layers`, `→ ${layers} identical triangles`, "the corner is the centre"]
      : stage === "half"
      ? ["undo one fold: 2 layers", "the hole is a triangle", "— that is choice (D)"]
      : ["undo the other fold", `${sides} triangles at the centre`, isDiamond ? "→ a diamond" : `→ ${sides} sides`];

  const caption =
    stage === "fold"
      ? "two folds — the corner that lands innermost is the sheet's centre"
      : stage === "cut"
      ? "the scissors go through every layer at once"
      : stage === "half"
      ? "one fold undone: only two triangles, so only half the hole"
      : isDiamond
      ? `${sides} equal sides meeting at the centre — a diamond`
      : `the hole has ${sides} sides`;

  // the cut line runs between the first and last vertices of the cut polygon
  const cutA = base[1];
  const cutB = base[base.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 355 }}>
        {/* the four quarters, each swinging about its own fold line */}
        {QUADS.map((q) => {
          // Motion pins an SVG group's pivot to its own centre, so a fold is an
          // own-centre flip plus the translation that carries it onto the packet.
          const off = stacked ? q.off : 0;
          const fx = { s: q.fx ? -1 : 1, t: (q.fx ? -S : 0) + off };
          const fy = { s: q.fy ? -1 : 1, t: (q.fy ? -S : 0) + off };
          const open = { scaleX: 1, x: 0, scaleY: 1, y: 0 };
          const half = { scaleX: fx.s, x: fx.t, scaleY: 1, y: 0 };
          const shut = { scaleX: fx.s, x: fx.t, scaleY: fy.s, y: fy.t };

          const anim =
            stage === "fold"
              ? { scaleX: [1, fx.s, fx.s], x: [0, fx.t, fx.t], scaleY: [1, 1, fy.s], y: [0, 0, fy.t] }
              : stage === "cut"
              ? shut
              : stage === "half"
              ? half
              : open;
          const from = stage === "fold" ? open : stage === "cut" ? shut : stage === "half" ? shut : half;

          return (
            <motion.g
              key={q.id}
              initial={from}
              animate={anim}
              transition={
                stage === "fold" ? { duration: 1.8, times: [0, 0.5, 1] } : { duration: 0.9, delay: 0.15 }
              }
            >
              <path
                d={path([
                  [q.u0, q.v0],
                  [q.u1, q.v0],
                  [q.u1, q.v1],
                  [q.u0, q.v1],
                ])}
                fill={PAPER}
                stroke={CREASE}
                strokeWidth={0.7}
              />
              {cutMade && <path d={path(tri(q))} fill="#fff" stroke="#fff" strokeWidth={1} />}
            </motion.g>
          );
        })}

        {/* the paper's outline and its creases, once the fold has settled */}
        <motion.path
          key={`sheet-${stage}`}
          d={path(sheet)}
          fill="none"
          stroke={INK}
          strokeWidth={1.6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: stage === "fold" ? 1.8 : 0.9 }}
        />
        {unfoldX && (
          <motion.line
            x1={toX(0)}
            y1={toY(unfoldY ? -1 : 0)}
            x2={toX(0)}
            y2={toY(1)}
            stroke={CREASE}
            strokeWidth={1}
            strokeDasharray="4 3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
        )}
        {unfoldY && (
          <motion.line
            x1={toX(-1)}
            y1={toY(0)}
            x2={toX(unfoldX ? 1 : 0)}
            y2={toY(0)}
            stroke={CREASE}
            strokeWidth={1}
            strokeDasharray="4 3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
        )}

        {/* the hole's own outline: edges that do not lie on a fold line */}
        {cutMade &&
          holeEdges.map((e, i) => (
            <motion.line
              key={`he${i}`}
              x1={toX(e.a[0])}
              y1={toY(e.a[1])}
              x2={toX(e.b[0])}
              y2={toY(e.b[1])}
              stroke={stage === "open" ? WIN : INK}
              strokeWidth={stage === "open" ? 2 : 1.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 1.1 + i * 0.12 }}
            />
          ))}

        {/* the centre of the sheet — the corner the scissors meet */}
        <AnimatePresence>
          {stacked && (
            <motion.g key="ctr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              <circle cx={toX(0)} cy={toY(0)} r={3} fill={HOT} />
              <text x={toX(0) + 6} y={toY(0) + 14} fontSize="8.5" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                centre
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the cut itself */}
        <AnimatePresence>
          {stage === "cut" && (
            <motion.g key="cut" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line
                x1={toX(cutA[0])}
                y1={toY(cutA[1])}
                x2={toX(cutB[0])}
                y2={toY(cutB[1])}
                stroke={INK}
                strokeWidth={1.4}
                strokeDasharray="5 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              />
              <motion.g
                initial={{ x: 0, y: 0 }}
                animate={{ x: toX(cutB[0]) - toX(cutA[0]), y: toY(cutB[1]) - toY(cutA[1]) }}
                transition={{ duration: 0.9, delay: 0.35 }}
              >
                <text x={toX(cutA[0])} y={toY(cutA[1])} fontSize="14" textAnchor="middle" dominantBaseline="central">
                  ✂️
                </text>
              </motion.g>
              {QUADS.map((q, i) => (
                <motion.g
                  key={`fall${i}`}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x: 26 + i * 7, y: 34 + i * 9, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.1, delay: 1.25 + i * 0.13 }}
                >
                  <path d={path(base)} fill={PAPER} stroke={INK} strokeWidth={0.8} />
                </motion.g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* running notes */}
        {notes.map((line, i) => (
          <motion.text
            key={`${stage}-${i}`}
            x={196}
            y={62 + i * 17}
            fontSize="9.5"
            fontWeight="800"
            fill={i === 2 && stage === "open" ? WIN : i === 2 && stage === "half" ? BAD : MARK}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.55 }}
          >
            {line}
          </motion.text>
        ))}
      </svg>

      <motion.span
        key={`${step}-${stage}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: stage === "open" ? "#166534" : "#4338ca",
          background: stage === "open" ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${stage === "open" ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {stage === "open" && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: isDiamond ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {isDiamond
              ? `reflected the one cut across both folds: ${sides} equal edges left`
              : `the reflections leave ${sides} edges, which is not a diamond`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === "open" && problem.answer && (
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
