import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
const sgn = (v: number) => (v < 0 ? `−${fmt(Math.abs(v))}` : fmt(v));

/**
 * A **nested square** equation, `(x² − inner)² = rhs`, asking how many real `x`
 * satisfy it. Every square root undoes one square and **doubles the branches**,
 * so the count is a tree: one equation splits into `x² − inner = ±√rhs`, and each
 * of those splits again into `x = ±√(inner ± √rhs)` — but only where the inner
 * value is positive, which is the branch that can quietly die and is why the
 * answer is a count rather than a formula.
 *
 * The tree is only half of it. The scene then draws the real curve
 * `y = (x² − inner)²`, whose middle hump is exactly `inner²` high (it is `f(0)`),
 * and lays the level line `y = rhs` across it: the four roots *are* the four
 * crossings, dropped onto the axis by dashed lines. The closing beat sweeps that
 * level up and down and counts crossings at each height, which turns the whole
 * question into one comparison — **above the hump a horizontal line cuts the W
 * twice, below it four times** — so the tempting answer of 2 is shown to be the
 * right answer to a different level. That same 2 is what taking only the `+`
 * square root gives, so one picture prices the slip twice over.
 *
 * Nothing is asserted: roots are derived branch by branch, each is substituted
 * back into the original equation as a check, the crossing counts are recomputed
 * at every swept level, and choices demanding more roots than the degree allows
 * are refuted by the degree itself. Data `{ inner, rhs }`.
 */
export function NestedSquareScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const inner = num(data.inner, 5);
  const rhs = num(data.rhs, 16);

  const f = (x: number) => (x * x - inner) * (x * x - inner);
  const root = Math.sqrt(Math.max(0, rhs));

  // ---- the tree: two branches, each splitting again where it can ----
  const branches = [root, -root].map((u) => {
    const sq = inner + u; // the value x² must take
    const xs = sq > 0 ? [Math.sqrt(sq), -Math.sqrt(sq)] : sq === 0 ? [0] : [];
    return { u, sq, xs };
  });
  const roots = branches
    .flatMap((b) => b.xs)
    .filter((v, i, all) => all.findIndex((q) => Math.abs(q - v) < 1e-9) === i)
    .sort((a, b) => a - b);
  const count = roots.length;

  const hump = inner * inner; // f(0) — the middle peak the level line must clear
  const crossingsAt = (level: number) => {
    if (level < 0) return 0;
    const r = Math.sqrt(level);
    return [r, -r].reduce((a, u) => {
      const s = inner + u;
      return a + (s > 0 ? 2 : s === 0 ? 1 : 0);
    }, 0);
  };

  // ---- choices, and the slips the picture refutes ----
  const asInt = (text: string) => {
    const t = String(text).replace(/[−–—]/g, "-").trim();
    return /^-?\d+$/.test(t) ? Number(t) : null;
  };
  const choiceOf = (n: number) => (problem.choices ?? []).find((c) => asInt(c.text) === n)?.label ?? null;
  const oneBranch = branches[0].xs.length;
  const slips = [
    { n: oneBranch, why: `took only the + square root, or read the level above the hump`, choice: choiceOf(oneBranch) },
    ...(problem.choices ?? [])
      .map((c) => ({ label: c.label, v: asInt(c.text) }))
      .filter((c): c is { label: string; v: number } => c.v != null && c.v > 4)
      .map((c) => ({ n: c.v, why: `more roots than a degree-4 equation can have`, choice: c.label })),
  ].filter((s) => s.choice != null && s.choice !== problem.answer);

  const checks = [
    { ok: rhs > 0, msg: "the right-hand side must be positive for the level line to cut the curve" },
    { ok: inner > 0, msg: "a positive inner shift is what gives the curve its middle hump" },
    { ok: roots.every((r) => Math.abs(f(r) - rhs) < 1e-9), msg: "a derived root does not satisfy the original equation" },
    { ok: count === crossingsAt(rhs), msg: `the tree gives ${count} roots but the curve is cut ${crossingsAt(rhs)} times` },
    {
      ok: problem.shortAnswer == null || Number(problem.shortAnswer) === count,
      msg: `computed ${count} but the stored answer is ${problem.shortAnswer}`,
    },
  ];
  const failed = checks.find((c) => !c.ok);

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 480;
  const H = 262;

  // ---- graph geometry (beats 2 and 3) ----
  const xMin = -3.5 * Math.sqrt(inner / 5);
  const xMax = -xMin;
  const yMax = Math.max(hump * 1.2, rhs * 1.5);
  const L = 46;
  const R = 400;
  const T = 42;
  const B = 196;
  const sx = (x: number) => L + ((x - xMin) / (xMax - xMin)) * (R - L);
  const sy = (y: number) => B - (y / yMax) * (B - T);
  // sample only where the curve is near the window, so pathLength draws what shows
  const xEdge = Math.sqrt(Math.max(0, inner + Math.sqrt(yMax * 1.25)));
  const curve = Array.from({ length: 241 }, (_, i) => {
    const x = -xEdge + (i / 240) * 2 * xEdge;
    return `${i ? "L" : "M"} ${sx(x).toFixed(2)} ${sy(f(x)).toFixed(2)}`;
  }).join(" ");
  const ticks = Array.from({ length: 7 }, (_, i) => i - 3).filter((t) => t >= xMin && t <= xMax);
  const isRoot = (t: number) => roots.some((r) => Math.abs(r - t) < 1e-9);

  const levels = [
    { y: Math.round(hump * 1.12), c: DIM, dash: true },
    { y: hump, c: WARN, dash: true },
    { y: rhs, c: WIN, dash: false },
  ];

  // ---- tree geometry (beats 0 and 1) ----
  const bx = [130, 350];
  const leafX = [70, 190, 290, 410];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 490 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {phase === 0
            ? `undo the outer square — a square root always brings a ±`
            : phase === 1
            ? `undo the inner square — each branch splits again`
            : phase === 2
            ? `the roots are where the curve meets the line y = ${fmt(rhs)}`
            : `why four and not two: the line passes under the hump`}
        </text>

        {/* ================= beats 0–1: the branching tree ================= */}
        {phase <= 1 && (
          <g>
            {/* root equation */}
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 78} y={34} width={156} height={30} rx={7} fill="#eef2ff" stroke={IND} strokeWidth={1.8} />
              <text x={W / 2} y={54} textAnchor="middle" fontSize="13" fontWeight="800" fill={IND} fontFamily={numberFont}>
                (x² − {fmt(inner)})² = {fmt(rhs)}
              </text>
            </motion.g>

            {/* first split */}
            {branches.map((b, i) => (
              <motion.path
                key={`e${i}`}
                d={`M ${W / 2} 66 Q ${W / 2} 88 ${bx[i]} 100`}
                fill="none"
                stroke={IND}
                strokeWidth={1.8}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.15 }}
              />
            ))}
            {branches.map((b, i) => (
              <motion.g key={`b${i}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 17, delay: 0.85 + i * 0.15 }}>
                <rect x={bx[i] - 62} y={102} width={124} height={phase === 0 ? 30 : 48} rx={7} fill="#fff" stroke={IND} strokeWidth={1.6} />
                <text x={bx[i]} y={122} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  x² − {fmt(inner)} = {sgn(b.u)}
                </text>
                {phase === 1 && (
                  <motion.text
                    x={bx[i]}
                    y={142}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={b.sq > 0 ? WIN : BAD}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.2 + i * 0.15 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    x² = {fmt(b.sq)}
                  </motion.text>
                )}
              </motion.g>
            ))}

            {phase === 0 && (
              <g>
                <motion.text x={W / 2} y={178} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                  something squared equals {fmt(rhs)}, so that something is +{fmt(root)} or −{fmt(root)}
                </motion.text>
                <motion.text x={W / 2} y={200} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  dropping the minus branch here is what leaves you with half the answers
                </motion.text>
                <motion.text x={W / 2} y={228} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  one equation has become two
                </motion.text>
              </g>
            )}

            {/* second split into the leaves */}
            {phase === 1 && (
              <g>
                {branches.flatMap((b, i) =>
                  b.xs.map((xv, j) => {
                    const k = i * 2 + j;
                    return (
                      <motion.path
                        key={`le${k}`}
                        d={`M ${bx[i]} 150 Q ${bx[i]} 172 ${leafX[k]} 186`}
                        fill="none"
                        stroke={WIN}
                        strokeWidth={1.8}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 + k * 0.12 }}
                      />
                    );
                  })
                )}
                {branches.flatMap((b, i) =>
                  b.xs.map((xv, j) => {
                    const k = i * 2 + j;
                    return (
                      <motion.g
                        key={`lf${k}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1 + k * 0.12 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <rect x={leafX[k] - 34} y={188} width={68} height={28} rx={7} fill="#dcfce7" stroke={WIN} strokeWidth={1.8} />
                        <text x={leafX[k]} y={207} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                          x = {sgn(xv)}
                        </text>
                      </motion.g>
                    );
                  })
                )}
                <motion.text x={W / 2} y={240} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  both {branches.map((b) => fmt(b.sq)).join(" and ")} are positive, so every branch survives — a negative one would give no real x
                </motion.text>
              </g>
            )}
          </g>
        )}

        {/* ================= beats 2–3: the curve and the level line ================= */}
        {phase >= 2 && (
          <g>
            <defs>
              <clipPath id="nsq-clip">
                <rect x={L} y={T} width={R - L} height={B - T} />
              </clipPath>
            </defs>

            {/* axes */}
            <line x1={L} y1={B} x2={R} y2={B} stroke={INK} strokeWidth={1.4} />
            <line x1={sx(0)} y1={T} x2={sx(0)} y2={B} stroke={INK} strokeWidth={1.4} />
            {ticks.map((t) => (
              <g key={t}>
                <line x1={sx(t)} y1={B} x2={sx(t)} y2={B + 4} stroke={INK} strokeWidth={1.2} />
                <motion.text
                  x={sx(t)}
                  y={B + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={phase === 2 && isRoot(t) ? "800" : "700"}
                  fontFamily={numberFont}
                  animate={{ fill: phase === 2 && isRoot(t) ? WIN : DIM }}
                  transition={{ delay: 1.9 }}
                >
                  {t === 0 ? "0" : sgn(t)}
                </motion.text>
              </g>
            ))}
            <text x={sx(0) + 8} y={T + 4} fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              y
            </text>

            {/* the curve */}
            <g clipPath="url(#nsq-clip)">
              <motion.path
                d={curve}
                fill="none"
                stroke={IND}
                strokeWidth={2.2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.15 }}
              />
            </g>
            <motion.text x={L + 4} y={T - 6} fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              y = (x² − {fmt(inner)})²
            </motion.text>

            {/* ---- beat 2: the single level line and its four crossings ---- */}
            {phase === 2 && (
              <g>
                <motion.g initial={{ x: -70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 150, damping: 22, delay: 1.1 }}>
                  <line x1={L} y1={sy(rhs)} x2={R} y2={sy(rhs)} stroke={WIN} strokeWidth={2} />
                  <text x={R + 4} y={sy(rhs) + 4} fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                    y = {fmt(rhs)}
                  </text>
                </motion.g>
                {roots.map((r, i) => (
                  <g key={r}>
                    <motion.line
                      x1={sx(r)}
                      y1={sy(rhs)}
                      x2={sx(r)}
                      y2={B}
                      stroke={WIN}
                      strokeWidth={1.2}
                      strokeDasharray="3 3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.75 }}
                      transition={{ delay: 1.9 + i * 0.12 }}
                    />
                    <motion.circle
                      cx={sx(r)}
                      cy={sy(rhs)}
                      r={5}
                      fill={WIN}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 13, delay: 1.6 + i * 0.12 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  </g>
                ))}
                <motion.text x={W / 2} y={244} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
                  {branches.map((b) => `(${fmt(b.sq)} − ${fmt(inner)})² = ${fmt(rhs)}`).join("   and   ")}   ✓
                </motion.text>
              </g>
            )}

            {/* ---- beat 3: sweep the level and count crossings ---- */}
            {phase === 3 && (
              <g>
                {levels.map((lv, i) => (
                  <g key={lv.y}>
                    <motion.line
                      x1={L}
                      y1={sy(lv.y)}
                      x2={R}
                      y2={sy(lv.y)}
                      stroke={lv.c}
                      strokeWidth={lv.dash ? 1.4 : 2.2}
                      strokeDasharray={lv.dash ? "5 4" : undefined}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + i * 0.55 }}
                    />
                    <motion.text x={R + 4} y={sy(lv.y) + 4} fontSize="9.5" fontWeight="800" fill={lv.c} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 + i * 0.55 }}>
                      {fmt(lv.y)} → {crossingsAt(lv.y)}
                    </motion.text>
                    {(() => {
                      const r = Math.sqrt(lv.y);
                      const xs = [r, -r].flatMap((u) => {
                        const s = inner + u;
                        return s > 0 ? [Math.sqrt(s), -Math.sqrt(s)] : s === 0 ? [0] : [];
                      });
                      return xs.map((xv, j) => (
                        <motion.circle
                          key={j}
                          cx={sx(xv)}
                          cy={sy(lv.y)}
                          r={4}
                          fill={lv.c}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 240, damping: 13, delay: 1.15 + i * 0.55 + j * 0.05 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        />
                      ));
                    })()}
                  </g>
                ))}

                {/* the sweeping marker that ties the three snapshots together */}
                <motion.g
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 0, sy(levels[1].y) - sy(levels[0].y), sy(levels[2].y) - sy(levels[0].y)], opacity: [0, 1, 1, 1] }}
                  transition={{ duration: 2.2, times: [0, 0.28, 0.55, 1], delay: 0.9 }}
                >
                  <polygon
                    points={`${L - 10},${sy(levels[0].y) - 5} ${L - 2},${sy(levels[0].y)} ${L - 10},${sy(levels[0].y) + 5}`}
                    fill={INK}
                  />
                </motion.g>

                <motion.text x={128} y={sy(hump) + 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                  the hump is {fmt(inner)}² = {fmt(hump)}
                </motion.text>

                {slips.map((s, i) => (
                  <motion.g key={String(s.choice)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 2.5 + i * 0.22 }}>
                    <rect x={24} y={220 + i * 22} width={432} height={19} rx={5} fill="#fffbeb" stroke="#fde68a" strokeWidth={1.2} />
                    <text x={36} y={233 + i * 22} fontSize="9.5" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                      {s.choice}
                    </text>
                    <text x={54} y={233 + i * 22} fontSize="9" fontWeight="700" fill={INK}>
                      {s.n} — {s.why}
                    </text>
                  </motion.g>
                ))}
              </g>
            )}
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
          ? `1 equation → 2 branches`
          : phase === 1
          ? `2 branches → ${count} values of x`
          : phase === 2
          ? `${roots.map(sgn).join(", ")}`
          : `${count} real solutions`}
      </motion.span>

      {failed && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed.msg}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
