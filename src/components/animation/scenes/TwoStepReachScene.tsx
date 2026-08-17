import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WATER = "#e0f2fe";
const WATER2 = "#bae6fd";
const PAD_ON = "#4ade80";
const PAD_OFF = "#bbf7d0";

/** A lily pad: disc with a wedge notch cut out of it. */
function Pad({ cx, cy, r, on }: { cx: number; cy: number; r: number; on?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.62} fill={on ? PAD_ON : PAD_OFF} stroke={WIN} strokeWidth={on ? 0.9 : 0.5} />
      <path d={`M ${cx},${cy} l ${r * 0.98},${-r * 0.2} l ${-r * 0.34},${-r * 0.5} z`} fill={WATER} />
    </g>
  );
}

/** Keyframe arrays that make a figure hop from station to station along x. */
function hopKeys(xs: number[], hops: number[], weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const kx = [xs[0]];
  const ky = [0];
  const times = [0];
  let acc = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    const w = weights[i];
    kx.push((xs[i] + xs[i + 1]) / 2);
    ky.push(-hops[i]);
    times.push((acc + w / 2) / total);
    acc += w;
    kx.push(xs[i + 1]);
    ky.push(0);
    times.push(acc / total);
  }
  return { kx, ky, times, seconds: Math.min(6, 0.5 * total) };
}

/** An arc from one station to another, drawn above (rights) or below (lefts). */
function Arc({
  x1,
  x2,
  y,
  rise,
  color,
  label,
  labelDx = 0,
  delay,
}: {
  x1: number;
  x2: number;
  y: number;
  rise: number;
  color: string;
  label?: string;
  labelDx?: number;
  delay: number;
}) {
  const mx = (x1 + x2) / 2;
  const cy = y + rise * 2;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay }}>
      <path d={`M ${x1},${y} Q ${mx},${cy} ${x2},${y}`} fill="none" stroke={color} strokeWidth={1.6} strokeDasharray="3 2.5" />
      {label && (
        <text x={mx + labelDx} y={y + rise + (rise < 0 ? -2 : 9)} textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={numberFont}>
          {label}
        </text>
      )}
    </motion.g>
  );
}

/**
 * Fewest moves to reach a target when only two step sizes are allowed, one
 * forward (+right) and one back (−left): minimise x + y subject to
 * right·x − left·y = target. Since the target is not a multiple of the forward
 * step, the traveller must **overshoot and come back**, so the scene tries each
 * number of forward jumps in turn and asks whether the overshoot splits into
 * whole backward jumps. The first x that works is the answer, because a
 * different solution is this one plus a **null loop** of `left` forward jumps
 * and `right` backward ones — a cycle that goes nowhere and costs right + left
 * moves — which the scene walks out on the pads. Everything (the first hit, the
 * loop, every reachable total) is computed, and a brute-force scan re-checks
 * the minimum; data { right, left, target, icon? }.
 */
export function TwoStepReachScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const R = Math.max(1, Math.round(num(data.right, 5)));
  const L = Math.max(1, Math.round(num(data.left, 3)));
  const T = Math.max(1, Math.round(num(data.target, 2023)));
  const icon = typeof data.icon === "string" ? data.icon : "🦗";

  // ---- solve: smallest x with R·x ≥ T and (R·x − T) a multiple of L ----
  const minX = Math.ceil(T / R);
  const trials: { x: number; reach: number; rem: number; ok: boolean; short: boolean }[] = [];
  let bestX = minX;
  for (let x = minX; x <= minX + L + 2; x++) {
    const rem = R * x - T;
    if (rem % L === 0) {
      bestX = x;
      break;
    }
  }
  for (let x = Math.max(0, minX - 1); x <= bestX; x++) {
    const reach = R * x;
    const rem = reach - T;
    trials.push({ x, reach, rem: Math.abs(rem), ok: rem >= 0 && rem % L === 0, short: rem < 0 });
  }
  const bestY = (R * bestX - T) / L;
  const best = bestX + bestY;
  const loopCost = R + L; // L forward + R backward jumps return to the same pad

  // self-check: brute force the minimum, and confirm every total is best + k·(R+L)
  let scanBest = Infinity;
  for (let x = minX; x <= minX + L * R + L + 4; x++) {
    const rem = R * x - T;
    if (rem >= 0 && rem % L === 0) scanBest = Math.min(scanBest, x + rem / L);
  }
  const consistent = scanBest === best && (problem.shortAnswer == null || String(best) === String(problem.shortAnswer));
  const unreachable = (problem.choices ?? [])
    .map((c) => Number(String(c.text).replace(/[^\d]/g, "")))
    .filter((v) => Number.isFinite(v) && v > 0 && (v < best || (v - best) % loopCost !== 0));

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 440;
  const H = 200;

  // ---- phase 0 / 3: near window of pads 0 … showRight·R ----
  const showRight = 2;
  const nearPads = showRight * R;
  const nearGap = phase === 0 ? 20 : 12;
  const nearX = (p: number) => 30 + p * nearGap;

  // ---- phase 3: far window of pads T … R·bestX ----
  const over = R * bestX - T;
  const farGap = Math.min(13, 150 / Math.max(1, over));
  const farX = (p: number) => 258 + (p - T) * farGap;
  const skipped = bestX - showRight;

  const padY = phase === 2 ? 118 : 132;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 470 }}>
        {/* ---------- the pond ---------- */}
        {phase !== 1 && (
          <g>
            <rect x={0} y={padY - 22} width={W} height={54} fill={WATER} />
            <path d={`M 0,${padY - 22} Q 60,${padY - 27} 120,${padY - 22} T 240,${padY - 22} T 360,${padY - 22} T 480,${padY - 22}`} fill="none" stroke={WATER2} strokeWidth={2} />
          </g>
        )}

        {/* ================= phase 0: the two moves ================= */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>
              two moves only
            </text>
            {Array.from({ length: nearPads + 1 }, (_, p) => (
              <Pad key={p} cx={nearX(p)} cy={padY} r={5} on={p === 0 || p === R || p === R - L} />
            ))}
            {[0, R - L, R].map((p) => (
              <text key={p} x={nearX(p)} y={padY + 19} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {p}
              </text>
            ))}
            <Arc x1={nearX(0)} x2={nearX(R)} y={padY - 9} rise={-36} color={WIN} label={`+${R} right`} delay={0.25} />
            <Arc x1={nearX(R)} x2={nearX(R - L)} y={padY - 9} rise={-15} color={BAD} label={`−${L} left`} labelDx={34} delay={0.75} />

            {/* the far target */}
            <path d={`M ${nearX(nearPads) + 16},${padY} L 340,${padY}`} stroke={DIM} strokeWidth={1.2} strokeDasharray="2 5" />
            <text x={295} y={padY - 8} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              …
            </text>
            <Pad cx={392} cy={padY} r={7} on />
            <text x={392} y={padY - 14} textAnchor="middle" fontSize="15">
              🚩
            </text>
            <text x={392} y={padY + 22} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {T}
            </text>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15 }}
            >
              <text x={W / 2} y={182} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {R}x − {L}y = {T.toLocaleString()}
              </text>
              <text x={W / 2} y={196} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
                x right jumps, y left jumps — make x + y as small as possible
              </text>
            </motion.g>

            {(() => {
              const k = hopKeys([nearX(0), nearX(R), nearX(R - L)], [30, 22], [1, 1]);
              return (
                <motion.g
                  animate={{ x: k.kx, y: k.ky }}
                  transition={{ duration: 1.8, times: k.times, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                >
                  <text x={0} y={padY - 8} textAnchor="middle" fontSize="17">
                    {icon}
                  </text>
                </motion.g>
              );
            })()}
          </g>
        )}

        {/* ================= phase 1: the overshoot ladder ================= */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={14} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK}>
              x right jumps land on {R}x — the overshoot past {T.toLocaleString()} must split into {L}s
            </text>
            {trials.map((t, i) => {
              const y = 38 + i * 36;
              const col = t.ok ? WIN : BAD;
              return (
                <motion.g
                  key={t.x}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.5 }}
                >
                  {t.ok && <rect x={8} y={y - 15} width={W - 16} height={30} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={1.2} />}
                  <text x={18} y={y + 4} fontSize="10.5" fontWeight="800" fill={t.ok ? WIN : INK} fontFamily={numberFont}>
                    x = {t.x}
                  </text>
                  <text x={78} y={y + 4} fontSize="10" fontWeight="700" fill={INK} fontFamily={numberFont}>
                    {R}·{t.x} = {t.reach.toLocaleString()}
                  </text>
                  {t.short ? (
                    <text x={176} y={y + 4} fontSize="10" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {t.rem} short — left jumps only lose ground ✗
                    </text>
                  ) : (
                    <g>
                      {Array.from({ length: t.rem }, (_, k) => (
                        <motion.g
                          key={k}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.3 + i * 0.5 + k * 0.04 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                          <Pad cx={172 + k * 9.5} cy={y} r={3.6} on={t.ok} />
                        </motion.g>
                      ))}
                      {t.ok &&
                        Array.from({ length: t.rem / L }, (_, g) => (
                          <motion.path
                            key={`b${g}`}
                            d={`M ${172 + g * L * 9.5 - 3.5},${y + 8} h ${L * 9.5 - 6}`}
                            stroke={WIN}
                            strokeWidth={1.4}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.25, delay: 0.75 + i * 0.5 + g * 0.12 }}
                          />
                        ))}
                      <text x={172 + Math.max(t.rem, 3) * 9.5 + 8} y={y + 4} fontSize="10" fontWeight="800" fill={col} fontFamily={numberFont}>
                        {t.rem === 0
                          ? "0 ✓"
                          : t.ok
                          ? `= ${L}·${t.rem / L}  ✓`
                          : `not a multiple of ${L} ✗`}
                      </text>
                    </g>
                  )}
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={38 + trials.length * 36 + 12}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + trials.length * 0.5 }}
            >
              x = {bestX}, y = {bestY} → {bestX} + {bestY} = {best} jumps
            </motion.text>
          </g>
        )}

        {/* ================= phase 2: the null loop ================= */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK}>
              why no other x can beat it: {L} right jumps and {R} left jumps go nowhere
            </text>
            {(() => {
              const stops: number[] = [];
              for (let i = 0; i <= L; i++) stops.push(i * R);
              for (let i = 1; i <= R; i++) stops.push(L * R - i * L);
              const gap = 330 / (L * R);
              const X = (p: number) => 55 + p * gap;
              const k = hopKeys(stops.map(X), stops.slice(1).map(() => 24), stops.slice(1).map(() => 1));
              return (
                <g>
                  {Array.from({ length: L * R + 1 }, (_, p) => (
                    <Pad key={p} cx={X(p)} cy={padY} r={5} on={stops.includes(p)} />
                  ))}
                  <text x={X(0) - 30} y={padY + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    start
                  </text>
                  <text x={X(L * R) + 26} y={padY + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                    +{L * R}
                  </text>
                  {Array.from({ length: L }, (_, i) => (
                    <Arc key={`r${i}`} x1={X(i * R)} x2={X((i + 1) * R)} y={padY - 8} rise={-30} color={WIN} label={`+${R}`} delay={0.2 + i * 0.18} />
                  ))}
                  {Array.from({ length: R }, (_, i) => (
                    <Arc key={`l${i}`} x1={X(L * R - i * L)} x2={X(L * R - (i + 1) * L)} y={padY + 8} rise={22} color={BAD} label={`−${L}`} delay={0.9 + i * 0.16} />
                  ))}
                  <motion.g
                    animate={{ x: k.kx, y: k.ky }}
                    transition={{ duration: k.seconds, times: k.times, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                  >
                    <text x={0} y={padY - 8} textAnchor="middle" fontSize="16">
                      {icon}
                    </text>
                  </motion.g>
                </g>
              );
            })()}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <text x={W / 2} y={176} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                that loop costs {L} + {R} = {loopCost} jumps and moves her 0 pads
              </text>
              <text x={W / 2} y={191} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                every route is {best} + {loopCost}k: {best}, {best + loopCost}, {best + 2 * loopCost}, …
              </text>
            </motion.g>
          </g>
        )}

        {/* ================= phase 3: the actual route ================= */}
        {phase === 3 && (
          <g>
            {/* near window */}
            {Array.from({ length: nearPads + 1 }, (_, p) => (
              <Pad key={p} cx={nearX(p)} cy={padY} r={5} on={p % R === 0} />
            ))}
            {[0, nearPads].map((p) => (
              <text key={p} x={nearX(p)} y={padY + 19} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {p}
              </text>
            ))}
            {Array.from({ length: showRight }, (_, i) => (
              <Arc key={`r${i}`} x1={nearX(i * R)} x2={nearX((i + 1) * R)} y={padY - 8} rise={-26} color={WIN} label={`+${R}`} delay={0.15 + i * 0.15} />
            ))}

            {/* the compressed middle */}
            <path
              d={`M ${nearX(nearPads) + 10},${padY} q 10,-6 20,0 t 20,0 t 20,0`}
              fill="none"
              stroke={DIM}
              strokeWidth={1.2}
              strokeDasharray="3 3"
            />
            <motion.text
              x={192}
              y={padY - 30}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.6 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              +{R} × {skipped} more
            </motion.text>

            {/* far window */}
            {Array.from({ length: over + 1 }, (_, k) => (
              <Pad key={k} cx={farX(T + k)} cy={padY} r={5} on={k % L === 0} />
            ))}
            <text x={farX(T)} y={padY - 27} textAnchor="middle" fontSize="15">
              🚩
            </text>
            <text x={farX(T)} y={padY - 13} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {T.toLocaleString()}
            </text>
            <text x={farX(T + over)} y={padY - 13} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {(T + over).toLocaleString()}
            </text>
            {Array.from({ length: bestY }, (_, i) => (
              <Arc
                key={`l${i}`}
                x1={farX(T + over - i * L)}
                x2={farX(T + over - (i + 1) * L)}
                y={padY + 8}
                rise={20}
                color={BAD}
                label={`−${L}`}
                delay={0.95 + i * 0.15}
              />
            ))}

            {/* Greta runs the whole route */}
            {(() => {
              const xs = [
                ...Array.from({ length: showRight + 1 }, (_, i) => nearX(i * R)),
                ...Array.from({ length: bestY + 1 }, (_, i) => farX(T + over - i * L)),
              ];
              const hops = xs.slice(1).map((_, i) => (i === showRight ? 52 : 22));
              const weights = xs.slice(1).map((_, i) => (i === showRight ? 2.4 : 1));
              const k = hopKeys(xs, hops, weights);
              return (
                <motion.g
                  animate={{ x: k.kx, y: k.ky }}
                  transition={{ duration: k.seconds, times: k.times, ease: "linear", repeat: Infinity, repeatDelay: 1.2 }}
                >
                  <text x={0} y={padY - 8} textAnchor="middle" fontSize="17">
                    {icon}
                  </text>
                </motion.g>
              );
            })()}

            <text x={W / 2} y={22} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {bestX} right jumps overshoot to {(T + over).toLocaleString()}, then {bestY} left jumps come back {over}
            </text>
            <motion.text
              x={W / 2}
              y={182}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {bestX} + {bestY} = <tspan fill={WIN}>{best}</tspan> jumps
            </motion.text>
          </g>
        )}
      </svg>

      {/* caption */}
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
          ? `${T.toLocaleString()} is not a multiple of ${R} — she must overshoot and come back`
          : phase === 1
          ? `the first x that works also costs the least`
          : phase === 2
          ? `so nothing lands between ${best} and ${best + loopCost}`
          : `${bestX} × ${R} − ${bestY} × ${L} = ${(R * bestX).toLocaleString()} − ${L * bestY} = ${T.toLocaleString()}`}
      </motion.span>

      <AnimatePresence>
        {phase === 2 && unreachable.length > 0 && (
          <motion.span
            key="unreach"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.7 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            no route takes {unreachable.join(", ")} jumps
          </motion.span>
        )}
      </AnimatePresence>

      {!consistent && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: scan says {scanBest} jumps
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
