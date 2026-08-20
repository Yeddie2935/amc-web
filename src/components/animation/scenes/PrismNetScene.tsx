import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, num } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMBER = "#d97706";
const MUTE = "#94a3b8";
const RULE = "#cbd5e1";
const TRIF = "#fde68a";
const RECF = "#dbeafe";

const W = 380;
const H = 280;

type P = [number, number];
const tidy = (v: number) => String(Number(v.toFixed(3))).replace(/-/g, "−");
const sub = (p: P, q: P): P => [p[0] - q[0], p[1] - q[1]];
const len = (v: P) => Math.hypot(v[0], v[1]);
const unit = (v: P): P => [v[0] / len(v), v[1] / len(v)];

/** Unit normal to PQ pointing away from R, scaled by k. */
function awayNormal(P0: P, Q: P, R: P, k: number): P {
  const d = unit(sub(Q, P0));
  let n: P = [-d[1], d[0]];
  const mid: P = [(P0[0] + Q[0]) / 2, (P0[1] + Q[1]) / 2];
  if ((R[0] - mid[0]) * n[0] + (R[1] - mid[1]) * n[1] > 0) n = [-n[0], -n[1]];
  return [n[0] * k, n[1] * k];
}

/**
 * A polygon net of rectangles and right triangles folding into a **triangular
 * prism**, with a couple of edge lengths given and the volume wanted. The
 * arithmetic is trivial once the two legs are known, and the whole difficulty is
 * that one of them is **never handed to you**: the long edge `GH` looks like a
 * single side of the polygon, but the fold point `J` sits on it, so it is really
 * two edges belonging to two different faces — the square's side on one part and
 * the triangle's missing leg on the other. Subtracting gives the leg, and that
 * subtraction is the problem.
 * What makes it subtract cleanly is the prism's **length**, which every one of
 * the three rectangular faces carries as one of its dimensions: pinning it from
 * `EF` propagates the same number onto six edges of the net at once, `HJ` among
 * them. The scene animates exactly that — the length flies out onto every edge
 * that must share it — then splits `GH` at `J` into the part that is the length
 * and the part that is the leg. It closes by **extruding the base triangle**
 * along the length, so `area × length` is watched happening rather than quoted.
 * Everything is derived from the three given lengths: the net's ten vertices are
 * constructed from the legs and the length, and the scene then checks its own
 * drawing — that `H`, `J`, `G` really are collinear, that `HJ + JG` really is the
 * given `GH`, and that the angle at `J` is really right. The closing beat prices
 * the slips that reach for the wrong pair of sides (using the hypotenuse as a
 * leg, taking `GH` whole, forgetting the half) and names any that hit a choice.
 * Data: { ah, ef, gh } — the contest's three given lengths.
 */
export function PrismNetScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ah = num(data.ah ?? 8);
  const ef = num(data.ef ?? 8);
  const gh = num(data.gh ?? 14);

  // every rectangle carries the prism's length as one dimension; EF pins it
  const L = ef;
  const legA = ah; // AH = BJ
  const HJ = L; // AB = HJ, the square's other side
  const legB = gh - HJ; // GH is two edges, not one
  const hyp = Math.hypot(legA, legB);
  const area = (legA * legB) / 2;
  const volume = area * L;

  // build the net from those lengths alone
  const B: P = [0, 0];
  const C: P = [L, 0];
  const G: P = [0, hyp];
  const F: P = [L, hyp];
  const J: P = [(-legA * legB) / hyp, (legA * legA) / hyp];
  const I: P = [L + (legA * legB) / hyp, (legA * legA) / hyp];
  const oL = awayNormal(B, J, G, L);
  const A: P = [B[0] + oL[0], B[1] + oL[1]];
  const Hp: P = [J[0] + oL[0], J[1] + oL[1]];
  const oR = awayNormal(F, I, C, L);
  const D: P = [I[0] + oR[0], I[1] + oR[1]];
  const E: P = [F[0] + oR[0], F[1] + oR[1]];

  // the drawing has to agree with the story told about it
  const collinear = Math.abs((J[0] - Hp[0]) * (G[1] - Hp[1]) - (J[1] - Hp[1]) * (G[0] - Hp[0])) < 1e-6;
  const splitsRight = Math.abs(len(sub(J, Hp)) + len(sub(G, J)) - gh) < 1e-6;
  const rightAngle = Math.abs((B[0] - J[0]) * (G[0] - J[0]) + (B[1] - J[1]) * (G[1] - J[1])) < 1e-6;
  const sane = collinear && splitsRight && rightAngle && legB > 0;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const letterFor = (v: number) => opts.find((o) => o.value === v)?.label;
  const agrees = !problem.answer || letterFor(volume) === problem.answer;
  const slips = [
    { v: (legB * hyp * L) / 2, why: "using the hypotenuse as the other leg" },
    { v: (legA * gh * L) / 2, why: `taking all of GH as the leg` },
    { v: legA * legB * L, why: "forgetting to halve" },
  ]
    .map((s) => ({ ...s, letter: letterFor(s.v) }))
    .filter((s) => s.letter && s.v !== volume);

  const named: { id: string; p: P }[] = [
    { id: "A", p: A },
    { id: "B", p: B },
    { id: "C", p: C },
    { id: "D", p: D },
    { id: "E", p: E },
    { id: "F", p: F },
    { id: "G", p: G },
    { id: "H", p: Hp },
    { id: "I", p: I },
    { id: "J", p: J },
  ];

  // fit the net into the panel
  const xs = named.map((n) => n.p[0]);
  const ys = named.map((n) => n.p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const availW = 316;
  const availH = 180;
  const s = Math.min(availW / (maxX - minX), availH / (maxY - minY));
  const ox = (W - (maxX - minX) * s) / 2 - minX * s;
  const oy = 34 - minY * s;
  const X = (p: P) => ox + p[0] * s;
  const Y = (p: P) => oy + p[1] * s;
  const poly = (ps: P[]) => ps.map((p) => `${X(p)},${Y(p)}`).join(" ");
  const centroid = (ps: P[]): P => [ps.reduce((a, p) => a + p[0], 0) / ps.length, ps.reduce((a, p) => a + p[1], 0) / ps.length];
  const netMid = centroid(named.map((n) => n.p));

  const faces: { id: string; pts: P[]; fill: string; kind: "tri" | "rect" }[] = [
    { id: "ABJH", pts: [A, B, J, Hp], fill: RECF, kind: "rect" },
    { id: "BJG", pts: [B, J, G], fill: TRIF, kind: "tri" },
    { id: "BCFG", pts: [B, C, F, G], fill: "#e0f2fe", kind: "rect" },
    { id: "CIF", pts: [C, I, F], fill: TRIF, kind: "tri" },
    { id: "IDEF", pts: [I, D, E, F], fill: RECF, kind: "rect" },
  ];
  const folds: [P, P][] = [
    [B, J],
    [B, G],
    [C, F],
    [F, I],
  ];
  // the six edges that must all be the prism's length
  const lengthEdges: { a: P; b: P; id: string }[] = [
    { a: E, b: F, id: "EF" },
    { a: I, b: D, id: "ID" },
    { a: B, b: C, id: "BC" },
    { a: G, b: F, id: "GF" },
    { a: A, b: B, id: "AB" },
    { a: Hp, b: J, id: "HJ" },
  ];

  const isFinal = step >= totalSteps - 1;
  const phase = isFinal ? 3 : Math.min(2, step);

  const rightAngleMark = (at: P, t1: P, t2: P, k = 5) => {
    const u1 = unit(sub(t1, at));
    const u2 = unit(sub(t2, at));
    const p1: P = [at[0] + u1[0] * (k / s), at[1] + u1[1] * (k / s)];
    const p2: P = [at[0] + u2[0] * (k / s), at[1] + u2[1] * (k / s)];
    const pc: P = [at[0] + (u1[0] + u2[0]) * (k / s), at[1] + (u1[1] + u2[1]) * (k / s)];
    return `${X(p1)},${Y(p1)} ${X(pc)},${Y(pc)} ${X(p2)},${Y(p2)}`;
  };

  // the closing beat: base triangle, then extruded
  const s3 = 11;
  const TJ: P = [0, 0];
  const TG: P = [legB * s3, 0];
  const TB: P = [0, -legA * s3];
  const dep: P = [L * s3 * 0.5, -L * s3 * 0.36];
  const tx = 208;
  const ty = 176;
  const px = (p: P) => tx + p[0];
  const py = (p: P) => ty + p[1];
  const shift = (p: P): P => [p[0] + dep[0], p[1] + dep[1]];

  const caption =
    phase === 0
      ? `${faces.length} faces: ${faces.filter((f) => f.kind === "tri").length} triangles and ${faces.filter((f) => f.kind === "rect").length} rectangles`
      : phase === 1
      ? `every rectangle carries the prism's length, and EF pins it at ${tidy(L)}`
      : phase === 2
      ? `J sits on GH, so GH is two edges: ${tidy(HJ)} + ${tidy(legB)}`
      : `area ${tidy(area)} swept along ${tidy(L)} gives ${tidy(volume)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <AnimatePresence mode="wait">
          <motion.g key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {phase < 3 && (
              <>
                {faces.map((f, i) => {
                  const dim = phase === 2 && f.id !== "ABJH" && f.id !== "BJG";
                  return (
                    <motion.polygon
                      key={f.id}
                      points={poly(f.pts)}
                      fill={f.fill}
                      stroke="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: dim ? 0.18 : 1 }}
                      transition={{ delay: phase === 0 ? 0.25 + i * 0.3 : 0.1 }}
                    />
                  );
                })}

                {/* fold lines */}
                {folds.map(([p, q], i) => (
                  <line key={i} x1={X(p)} y1={Y(p)} x2={X(q)} y2={Y(q)} stroke={INK} strokeWidth={1.2} strokeDasharray="5 4" opacity={phase === 2 ? 0.4 : 1} />
                ))}
                {/* the polygon's own outline */}
                <polyline points={poly([A, B, C, D, E, F, G, Hp, A])} fill="none" stroke={INK} strokeWidth={1.7} strokeLinejoin="round" />
                <polyline points={rightAngleMark(J, B, G)} fill="none" stroke={INK} strokeWidth={1.1} />
                <polyline points={rightAngleMark(I, C, F)} fill="none" stroke={INK} strokeWidth={1.1} />

                {/* vertex labels, pushed outward */}
                {named.map((nm) => {
                  const d = unit(sub(nm.p, netMid));
                  return (
                    <text
                      key={nm.id}
                      x={X(nm.p) + d[0] * 11}
                      y={Y(nm.p) + d[1] * 11 + 3.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={INK}
                      fontFamily={numberFont}
                    >
                      {nm.id}
                    </text>
                  );
                })}
                {named.map((nm) => (
                  <circle key={`d${nm.id}`} cx={X(nm.p)} cy={Y(nm.p)} r={2.2} fill={INK} />
                ))}

                {/* what the contest actually gives you */}
                {phase === 0 &&
                  [
                    { a: A, b: Hp, t: `AH = ${tidy(ah)}` },
                    { a: E, b: F, t: `EF = ${tidy(ef)}` },
                    { a: G, b: Hp, t: `GH = ${tidy(gh)}` },
                  ].map((g, i) => {
                    const m = centroid([g.a, g.b]);
                    const d = unit(sub(m, netMid));
                    return (
                      <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.7 + i * 0.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                        <line x1={X(g.a)} y1={Y(g.a)} x2={X(g.b)} y2={Y(g.b)} stroke={MARK} strokeWidth={3} />
                        <line x1={X(m)} y1={Y(m)} x2={X(m) + d[0] * 30} y2={Y(m) + d[1] * 30} stroke={MARK} strokeWidth={0.9} />
                        <rect x={X(m) + d[0] * 34 - 22} y={Y(m) + d[1] * 34 - 8} width={44} height={15} rx={3} fill="#fff" stroke={MARK} strokeWidth={1} />
                        <text x={X(m) + d[0] * 34} y={Y(m) + d[1] * 34 + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                          {g.t}
                        </text>
                      </motion.g>
                    );
                  })}

                {/* the length lands on every edge that has to share it */}
                {phase === 1 &&
                  lengthEdges.map((e, i) => {
                    const m = centroid([e.a, e.b]);
                    const isSeed = e.id === "EF";
                    const isKey = e.id === "HJ";
                    return (
                      <motion.g key={e.id} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 16, delay: isSeed ? 0.2 : 0.9 + i * 0.22 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                        <line x1={X(e.a)} y1={Y(e.a)} x2={X(e.b)} y2={Y(e.b)} stroke={isKey ? AMBER : WIN} strokeWidth={3.2} />
                        <circle cx={X(m)} cy={Y(m)} r={8.5} fill="#fff" stroke={isKey ? AMBER : WIN} strokeWidth={1.4} />
                        <text x={X(m)} y={Y(m) + 3.2} textAnchor="middle" fontSize="9" fontWeight="800" fill={isKey ? AMBER : WIN} fontFamily={numberFont}>
                          {tidy(L)}
                        </text>
                      </motion.g>
                    );
                  })}

                {/* GH is two edges wearing one name */}
                {phase === 2 && (
                  <>
                    <motion.line x1={X(Hp)} y1={Y(Hp)} x2={X(J)} y2={Y(J)} stroke={AMBER} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
                    <motion.line x1={X(J)} y1={Y(J)} x2={X(G)} y2={Y(G)} stroke={MARK} strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.2 }} />
                    {[
                      { m: centroid([Hp, J]), t: `${tidy(HJ)}`, sub: "side of ABJH", col: AMBER, d: 0.8 },
                      { m: centroid([J, G]), t: `${tidy(legB)}`, sub: "leg of BJG", col: MARK, d: 1.6 },
                    ].map((g, i) => {
                      const dd = unit(sub(g.m, netMid));
                      return (
                        <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: g.d }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                          <line x1={X(g.m)} y1={Y(g.m)} x2={X(g.m) + dd[0] * 30} y2={Y(g.m) + dd[1] * 30} stroke={g.col} strokeWidth={0.9} />
                          <rect x={X(g.m) + dd[0] * 36 - 27} y={Y(g.m) + dd[1] * 36 - 12} width={54} height={23} rx={3} fill="#fff" stroke={g.col} strokeWidth={1.2} />
                          <text x={X(g.m) + dd[0] * 36} y={Y(g.m) + dd[1] * 36 - 1} textAnchor="middle" fontSize="11" fontWeight="800" fill={g.col} fontFamily={numberFont}>
                            {g.t}
                          </text>
                          <text x={X(g.m) + dd[0] * 36} y={Y(g.m) + dd[1] * 36 + 8} textAnchor="middle" fontSize="6.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                            {g.sub}
                          </text>
                        </motion.g>
                      );
                    })}
                    <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="15" fontWeight="800" fill={MARK} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      JG = {tidy(gh)} − {tidy(HJ)} = {tidy(legB)}
                    </motion.text>
                  </>
                )}

                {phase === 0 && (
                  <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
                    a triangular prism: 2 triangular bases, 3 rectangular sides
                  </motion.text>
                )}
                {phase === 1 && (
                  <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={AMBER} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
                    so HJ = {tidy(L)} too — and HJ is part of GH
                  </motion.text>
                )}
              </>
            )}

            {/* the base, then swept along the length */}
            {phase === 3 && (
              <>
                <text x={78} y={40} textAnchor="middle" fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  the base
                </text>
                <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <polygon points={`${26},${176} ${26 + legB * 9},${176} ${26},${176 - legA * 9}`} fill={TRIF} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
                  <polyline points={`${26 + 7},${176} ${26 + 7},${176 - 7} ${26},${176 - 7}`} fill="none" stroke={INK} strokeWidth={1} />
                  <text x={26 + (legB * 9) / 2} y={190} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                    {tidy(legB)}
                  </text>
                  <text x={18} y={176 - (legA * 9) / 2} textAnchor="end" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                    {tidy(legA)}
                  </text>
                  <text x={44} y={152} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                    {tidy(area)}
                  </text>
                </motion.g>
                <text x={78} y={208} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  ½ · {tidy(legA)} · {tidy(legB)} = {tidy(area)}
                </text>

                <text x={262} y={40} textAnchor="middle" fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  swept along the length
                </text>
                {/* back face slides out to the full depth */}
                <motion.g initial={{ x: 0, y: 0 }} animate={{ x: dep[0], y: dep[1] }} transition={{ duration: 1, ease: "linear", delay: 0.7 }}>
                  <polygon points={`${px(TJ)},${py(TJ)} ${px(TG)},${py(TG)} ${px(TB)},${py(TB)}`} fill={TRIF} fillOpacity={0.5} stroke={MUTE} strokeWidth={1.2} strokeLinejoin="round" />
                </motion.g>
                {/* the swept lateral faces */}
                <motion.polygon
                  points={`${px(TG)},${py(TG)} ${px(TB)},${py(TB)} ${px(shift(TB))},${py(shift(TB))} ${px(shift(TG))},${py(shift(TG))}`}
                  fill={RECF}
                  stroke={INK}
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                />
                <motion.polygon
                  points={`${px(TJ)},${py(TJ)} ${px(TG)},${py(TG)} ${px(shift(TG))},${py(shift(TG))} ${px(shift(TJ))},${py(shift(TJ))}`}
                  fill="#e0f2fe"
                  stroke={INK}
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                />
                {[TJ, TG, TB].map((v, i) => (
                  <motion.line
                    key={i}
                    x1={px(v)}
                    y1={py(v)}
                    x2={px(shift(v))}
                    y2={py(shift(v))}
                    stroke={INK}
                    strokeWidth={1.2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "linear", delay: 0.7 }}
                  />
                ))}
                <polygon points={`${px(TJ)},${py(TJ)} ${px(TG)},${py(TG)} ${px(TB)},${py(TB)}`} fill={TRIF} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
                <motion.text
                  x={px(TG) + dep[0] / 2 + 6}
                  y={py(TG) + dep[1] / 2 + 12}
                  fontSize="10"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9 }}
                >
                  {tidy(L)}
                </motion.text>

                <motion.text
                  x={W / 2}
                  y={244}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.3 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {tidy(area)} × {tidy(L)} = {tidy(volume)}
                </motion.text>
                <motion.text x={W / 2} y={264} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={sane ? MUTE : BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7 }}>
                  {sane ? `legs ${tidy(legA)} and ${tidy(legB)}, hypotenuse ${tidy(hyp)}` : `the net does not close up`}
                </motion.text>
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
            transition={{ delay: 3 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: sane && agrees ? MUTE : BAD, textAlign: "center", maxWidth: 380 }}
          >
            {!collinear
              ? `H, J and G do not lie on one line`
              : !splitsRight
              ? `HJ + JG is ${tidy(len(sub(J, Hp)) + len(sub(G, J)))}, not the given ${tidy(gh)}`
              : !rightAngle
              ? `the angle at J is not right`
              : !agrees
              ? `this gives ${tidy(volume)}, not the stored answer`
              : slips.length
              ? `slips: ${slips.map((s) => `${s.why} gives ${tidy(s.v)} = (${s.letter})`).join(", ")}`
              : `HJ + JG = ${tidy(HJ)} + ${tidy(legB)} = ${tidy(gh)} ✓`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
