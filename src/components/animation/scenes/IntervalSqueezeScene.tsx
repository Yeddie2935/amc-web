import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";
const BAND = ["#c7d2fe", "#99f6e4", "#fde68a"];
const BAND_INK = ["#3730a3", "#0f766e", "#b45309"];

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (n: number) => String(n).split("").map((d) => SUB[+d]).join("");
const fmt = (v: number) => Number(v.toFixed(3)).toString();

type Bound = { i: number; lo: number; hi: number };

/**
 * Equally spaced numbers with a **window on a few of the terms**, asking for one
 * term the windows never mention. Everything is two squeezes of the same kind,
 * so the scene speaks one visual language throughout: interval bars sliding in
 * and overlapping. First the step: any two windows bound the gap between their
 * terms, and dividing by the number of steps between them turns that into a
 * range for `d` — so **the further apart the two terms, the harder the squeeze**,
 * because the same-sized gap gets divided by more steps. The scene draws one bar
 * per pair and lets the widest-separated pair be the one that closes down to a
 * single integer (here a₁ & a₁₅ leaves only 17, while the a₂ & a₁₅ pair the
 * usual solution reaches for leaves 17 *and* 18 and then has to rule one out).
 * With `d` fixed, every window becomes a window on the first term instead —
 * `lo − (i−1)d ≤ a₁ ≤ hi − (i−1)d` — and those bars overlap in exactly one
 * integer, which is what pins the sequence. The closing beat walks the answer's
 * term out and splits its digits. Every pair bound, the candidate list, the
 * first-term intersection and the solution are computed, and a brute-force sweep
 * re-checks that the solution is unique; data
 * `{ count, bounds: ["1|1|10", ...], ask }` as index|lo|hi.
 */
export function IntervalSqueezeScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = Math.max(3, Math.round(num(data.count, 15)));
  const ask = Math.max(1, Math.min(count, Math.round(num(data.ask, count - 1))));
  const bounds: Bound[] = (Array.isArray(data.bounds) ? data.bounds : [])
    .map((r) => String(r).split("|").map((v) => num(v, 0)))
    .filter((p) => p.length >= 3)
    .map((p) => ({ i: Math.round(p[0]), lo: p[1], hi: p[2] }))
    .sort((a, b) => a.i - b.i);

  // ---- squeeze 1: every pair of windows bounds d, divided by the steps between ----
  const pairs = [] as { a: Bound; b: Bound; steps: number; lo: number; hi: number; ints: number[] }[];
  for (let x = 0; x < bounds.length; x++) {
    for (let y = x + 1; y < bounds.length; y++) {
      const a = bounds[x];
      const b = bounds[y];
      const steps = b.i - a.i;
      const lo = (b.lo - a.hi) / steps;
      const hi = (b.hi - a.lo) / steps;
      const ints: number[] = [];
      for (let d = Math.ceil(lo); d <= Math.floor(hi); d++) ints.push(d);
      pairs.push({ a, b, steps, lo, hi, ints });
    }
  }
  const tight = [...pairs].sort((p, q) => p.ints.length - q.ints.length || q.steps - p.steps)[0];
  const dLo = Math.max(...pairs.map((p) => p.lo));
  const dHi = Math.min(...pairs.map((p) => p.hi));
  const dCands: number[] = [];
  for (let d = Math.ceil(dLo); d <= Math.floor(dHi); d++) dCands.push(d);

  // ---- squeeze 2: with d fixed, every window becomes a window on the first term ----
  const firstWindows = (d: number) => bounds.map((b) => ({ b, lo: b.lo - (b.i - 1) * d, hi: b.hi - (b.i - 1) * d }));
  const solve = (d: number) => {
    const ws = firstWindows(d);
    const lo = Math.max(...ws.map((w) => w.lo));
    const hi = Math.min(...ws.map((w) => w.hi));
    const outs: number[] = [];
    for (let a = Math.ceil(lo); a <= Math.floor(hi); a++) outs.push(a);
    return { lo, hi, outs };
  };
  const sols: { a: number; d: number }[] = [];
  for (const d of dCands) for (const a of solve(d).outs) sols.push({ a, d });

  // ---- brute-force re-check ----
  const scan: { a: number; d: number }[] = [];
  for (let d = 0; d <= Math.ceil(dHi) + 6; d++) {
    for (let a = Math.floor(bounds[0]?.lo ?? 0) - 40; a <= Math.ceil(bounds[0]?.hi ?? 0) + 40; a++) {
      if (bounds.every((b) => b.lo <= a + (b.i - 1) * d && a + (b.i - 1) * d <= b.hi)) scan.push({ a, d });
    }
  }

  const best = sols[0] ?? { a: 0, d: 0 };
  const pinned = solve(best.d);
  const term = best.a + (ask - 1) * best.d;
  const digits = String(Math.abs(term)).split("").map(Number);
  const digitSum = digits.reduce((s, v) => s + v, 0);

  const answerOk = problem.shortAnswer == null || String(digitSum) === String(problem.shortAnswer).trim();
  const ok = sols.length === 1 && scan.length === 1 && scan[0].a === best.a && scan[0].d === best.d && answerOk;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 258;

  // ---- the number line, split into two windows around the long empty middle ----
  const marks = [...bounds.flatMap((b) => [b.lo, b.hi]), ...bounds.map((b) => best.a + (b.i - 1) * best.d), term].sort(
    (a, b) => a - b,
  );
  let cut = 0;
  let biggest = -1;
  for (let i = 1; i < marks.length; i++) {
    if (marks[i] - marks[i - 1] > biggest) {
      biggest = marks[i] - marks[i - 1];
      cut = i;
    }
  }
  const s1 = { lo: Math.min(0, marks[0] - 2), hi: marks[cut - 1] + 4 };
  const s2 = { lo: marks[cut] - 6, hi: marks[marks.length - 1] + 6 };
  const AX = { a: 34, b: 198, c: 254, d: 438 };
  const X = (v: number) => {
    if (v <= s1.hi) return AX.a + ((v - s1.lo) / (s1.hi - s1.lo)) * (AX.b - AX.a);
    if (v >= s2.lo) return AX.c + ((v - s2.lo) / (s2.hi - s2.lo)) * (AX.d - AX.c);
    return null;
  };
  const lineY = 112;

  /** A bar on a shared numeric axis, used for both squeezes. */
  const Bar = ({
    x0,
    x1,
    y,
    color,
    delay,
    label,
  }: {
    x0: number;
    x1: number;
    y: number;
    color: string;
    delay: number;
    label?: string;
  }) => (
    <motion.g initial={{ opacity: 0, scaleX: 0.2 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ type: "spring", stiffness: 120, damping: 18, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <rect x={x0} y={y - 7} width={Math.max(2, x1 - x0)} height={14} rx={4} fill={color} fillOpacity={0.35} stroke={color} strokeWidth={1.5} />
      {label &&
        (() => {
          const wide = x1 - x0 > label.length * 5.4 + 8;
          return (
            <text
              x={(x0 + x1) / 2}
              y={wide ? y + 4 : y - 12}
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              fill={color}
              fontFamily={numberFont}
            >
              {label}
            </text>
          );
        })()}
    </motion.g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phases 0 and 3: the number line ================= */}
        {(phase === 0 || phase === 3) && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {phase === 0
                ? `${count} equally spaced integers, with a window on ${bounds.length} of them`
                : `a${sub(1)} = ${best.a}, step ${best.d} — every window is hit`}
            </text>

            <line x1={AX.a - 6} y1={lineY} x2={AX.b} y2={lineY} stroke="#cbd5e1" strokeWidth={2} />
            <line x1={AX.c} y1={lineY} x2={AX.d + 6} y2={lineY} stroke="#cbd5e1" strokeWidth={2} />
            <path d={`M ${AX.b + 4},${lineY} q 8,-6 16,0 t 16,0 t 16,0`} fill="none" stroke={DIM} strokeWidth={1.3} strokeDasharray="3 3" />

            {/* the windows */}
            {bounds.map((b, i) => {
              const x0 = X(b.lo)!;
              const x1 = X(b.hi)!;
              const hit = best.a + (b.i - 1) * best.d;
              return (
                <motion.g
                  key={`w${i}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.2 }}
                >
                  <rect x={x0} y={lineY - 26} width={Math.max(3, x1 - x0)} height={52} rx={5} fill={BAND[i % BAND.length]} fillOpacity={0.55} stroke={BAND_INK[i % BAND_INK.length]} strokeWidth={1.2} />
                  <text x={(x0 + x1) / 2} y={lineY - 32} textAnchor="middle" fontSize="9" fontWeight="800" fill={BAND_INK[i % BAND_INK.length]} fontFamily={numberFont}>
                    {b.lo}–{b.hi}
                  </text>
                  <text x={(x0 + x1) / 2} y={lineY + 40} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAND_INK[i % BAND_INK.length]} fontFamily={numberFont}>
                    a{sub(b.i)}
                  </text>
                  {phase === 3 && (
                    <motion.text
                      x={(x0 + x1) / 2}
                      y={lineY + 54}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={WIN}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.15 }}
                    >
                      {hit} ✓
                    </motion.text>
                  )}
                </motion.g>
              );
            })}

            {/* the terms that land in view */}
            {Array.from({ length: count }, (_, k) => {
              const v = best.a + k * best.d;
              const x = X(v);
              if (x == null) return null;
              const isAsk = k + 1 === ask;
              return (
                <motion.g
                  key={`t${k}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.8 + k * 0.07 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <circle cx={x} cy={lineY} r={isAsk && phase === 3 ? 6 : 4.4} fill={isAsk && phase === 3 ? WIN : INK} />
                  {isAsk && (
                    <text x={x} y={lineY - 34} textAnchor="middle" fontSize="10" fontWeight="800" fill={phase === 3 ? WIN : WARN} fontFamily={numberFont}>
                      a{sub(ask)} = ?
                    </text>
                  )}
                </motion.g>
              );
            })}
            {/* the compressed middle */}
            <text x={(AX.b + AX.c) / 2} y={lineY + 22} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              …
            </text>

            {phase === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                <text x={W / 2} y={200} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  aᵢ = a{sub(1)} + (i − 1)·d
                </text>
                <text x={W / 2} y={220} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>
                  two unknowns, the first term and the step — and {bounds.length} windows to satisfy
                </text>
                <text x={W / 2} y={240} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN}>
                  a{sub(ask)} has no window of its own, so both have to be pinned down exactly
                </text>
              </motion.g>
            )}

            {phase === 3 && (
              <g>
                <motion.text
                  x={W / 2}
                  y={190}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill={INK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  a{sub(ask)} = {best.a} + {ask - 1}·{best.d} = {term}
                </motion.text>
                {digits.map((dg, i) => (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16, delay: 1.9 + i * 0.16 }}
                  >
                    <rect x={W / 2 - (digits.length * 34) / 2 + i * 34 - 60} y={206} width={28} height={28} rx={6} fill="#eef2ff" stroke={IND} strokeWidth={1.5} />
                    <text
                      x={W / 2 - (digits.length * 34) / 2 + i * 34 - 46}
                      y={225}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="800"
                      fill={IND}
                      fontFamily={numberFont}
                    >
                      {dg}
                    </text>
                  </motion.g>
                ))}
                <motion.text
                  x={W / 2 + (digits.length * 34) / 2 - 46}
                  y={225}
                  fontSize="15"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.5 }}
                >
                  {digits.join(" + ")} = {digitSum}
                </motion.text>
              </g>
            )}
          </g>
        )}

        {/* ================= phase 1: every pair squeezes the step ================= */}
        {phase === 1 &&
          (() => {
            const lo = Math.max(0, Math.floor(Math.min(...pairs.map((p) => p.lo)) - 2));
            const hi = Math.ceil(Math.max(...pairs.map((p) => p.hi)) + 2);
            const ax0 = 54;
            const ax1 = 442;
            const DX = (v: number) => ax0 + ((v - lo) / (hi - lo)) * (ax1 - ax0);
            const rows = [...pairs].sort((a, b) => a.steps - b.steps);
            return (
              <g>
                <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  two windows bound the gap between their terms — divide by the steps between
                </text>
                {rows.map((p, i) => {
                  const y = 46 + i * 40;
                  const decisive = p === tight;
                  return (
                    <g key={i}>
                      <text x={6} y={y - 10} fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont}>
                        a{sub(p.a.i)} &amp; a{sub(p.b.i)}
                      </text>
                      <text x={6} y={y + 2} fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                        {p.steps} step{p.steps > 1 ? "s" : ""}
                      </text>
                      <text x={6} y={y + 14} fontSize="8" fontWeight="700" fill={decisive ? WIN : DIM} fontFamily={numberFont}>
                        {p.ints.length} left
                      </text>
                      <Bar
                        x0={DX(p.lo)}
                        x1={DX(p.hi)}
                        y={y}
                        color={decisive ? WIN : p.ints.length <= 3 ? WARN : DIM}
                        delay={0.3 + i * 0.5}
                        label={`${fmt(p.lo)} ≤ d ≤ ${fmt(p.hi)}`}
                      />
                      {decisive &&
                        p.ints.map((v) => (
                          <motion.circle
                            key={v}
                            cx={DX(v)}
                            cy={y}
                            r={4}
                            fill={WIN}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.9 + i * 0.5 }}
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                          />
                        ))}
                    </g>
                  );
                })}
                {/* the axis */}
                <line x1={ax0} y1={172} x2={ax1} y2={172} stroke="#cbd5e1" strokeWidth={1.6} />
                {Array.from({ length: hi - lo + 1 }, (_, k) => lo + k).map((v) => (
                  <g key={v}>
                    <line x1={DX(v)} y1={168} x2={DX(v)} y2={176} stroke={DIM} strokeWidth={1} />
                    {(v % 2 === 0 || dCands.includes(v)) && (
                      <text x={DX(v)} y={188} textAnchor="middle" fontSize="8" fontWeight="700" fill={dCands.includes(v) ? WIN : DIM} fontFamily={numberFont}>
                        {v}
                      </text>
                    )}
                  </g>
                ))}
                <text x={ax1 + 8} y={176} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  d
                </text>
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                  <text x={W / 2} y={206} textAnchor="middle" fontSize="10" fontWeight="800" fill={WARN}>
                    the further apart the two terms, the more steps share the gap —
                  </text>
                  <text x={W / 2} y={220} textAnchor="middle" fontSize="10" fontWeight="800" fill={WARN}>
                    so the widest pair squeezes hardest
                  </text>
                </motion.g>
                <motion.text
                  x={W / 2}
                  y={236}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.2 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  a{sub(tight.a.i)} &amp; a{sub(tight.b.i)} leave only d = {tight.ints.join(", ")}
                </motion.text>
              </g>
            );
          })()}

        {/* ================= phase 2: the windows become windows on the first term ================= */}
        {phase === 2 &&
          (() => {
            const ws = firstWindows(best.d);
            const lo = Math.floor(Math.min(...ws.map((w) => w.lo)) - 2);
            const hi = Math.ceil(Math.max(...ws.map((w) => w.hi)) + 2);
            const ax0 = 92;
            const ax1 = 440;
            const AXx = (v: number) => ax0 + ((v - lo) / (hi - lo)) * (ax1 - ax0);
            return (
              <g>
                <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  with d = {best.d}, every window becomes a window on the first term
                </text>
                {ws.map((w, i) => {
                  const y = 48 + i * 38;
                  return (
                    <g key={i}>
                      <text x={6} y={y - 8} fontSize="9" fontWeight="800" fill={BAND_INK[i % BAND_INK.length]} fontFamily={numberFont}>
                        a{sub(w.b.i)} ∈ [{w.b.lo}, {w.b.hi}]
                      </text>
                      {w.b.i > 1 && (
                        <text x={6} y={y + 6} fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                          − {(w.b.i - 1) * best.d}
                        </text>
                      )}
                      <Bar
                        x0={AXx(w.lo)}
                        x1={AXx(w.hi)}
                        y={y}
                        color={BAND_INK[i % BAND_INK.length]}
                        delay={0.3 + i * 0.4}
                        label={`${fmt(w.lo)} … ${fmt(w.hi)}`}
                      />
                    </g>
                  );
                })}
                {/* the overlap */}
                <motion.rect
                  x={AXx(pinned.lo) - 5}
                  y={34}
                  width={Math.max(10, AXx(pinned.hi) - AXx(pinned.lo)) + 10}
                  height={38 * ws.length + 6}
                  rx={7}
                  fill="none"
                  stroke={WIN}
                  strokeWidth={2.4}
                  initial={{ opacity: 0, scaleX: 2.5 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 90, damping: 16, delay: 1.6 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <line x1={ax0} y1={172} x2={ax1} y2={172} stroke="#cbd5e1" strokeWidth={1.6} />
                {Array.from({ length: hi - lo + 1 }, (_, k) => lo + k).map((v) => (
                  <g key={v}>
                    <line x1={AXx(v)} y1={168} x2={AXx(v)} y2={176} stroke={DIM} strokeWidth={1} />
                    {(v % 2 === 0 || pinned.outs.includes(v)) && (
                      <text x={AXx(v)} y={188} textAnchor="middle" fontSize="8" fontWeight="700" fill={pinned.outs.includes(v) ? WIN : DIM} fontFamily={numberFont}>
                        {v}
                      </text>
                    )}
                  </g>
                ))}
                <text x={ax1 + 6} y={176} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  a{sub(1)}
                </text>
                <motion.text
                  x={W / 2}
                  y={214}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={INK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  {pinned.outs.length === 1
                    ? `the three overlap on a single point`
                    : `they overlap on ${fmt(pinned.lo)} … ${fmt(pinned.hi)}`}
                </motion.text>
                <motion.text
                  x={W / 2}
                  y={238}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.3 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  one integer fits: a{sub(1)} = {pinned.outs.join(", ")}
                </motion.text>
              </g>
            );
          })()}
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
          ? `find the step and the first term, then a${sub(ask)} follows`
          : phase === 1
          ? `d = ${dCands.join(" or ")}`
          : phase === 2
          ? `a${sub(1)} = ${best.a}, d = ${best.d} — and nothing else works`
          : `${digits.join(" + ")} = ${digitSum}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: {sols.length} solutions, scan found {scan.length}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
