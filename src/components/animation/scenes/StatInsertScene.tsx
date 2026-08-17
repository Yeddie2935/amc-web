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
const LOW_BAND = "#dcfce7";

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
/** The set of most-frequent values, as a sorted comma string. */
const modeKey = (xs: number[]) => {
  const c = new Map<number, number>();
  for (const v of xs) c.set(v, (c.get(v) ?? 0) + 1);
  const top = Math.max(...c.values());
  return [...c.entries()].filter(([, n]) => n === top).map(([v]) => v).sort((a, b) => a - b).join(",");
};
const counts = (xs: number[]) => {
  const c = new Map<number, number>();
  for (const v of xs) c.set(v, (c.get(v) ?? 0) + 1);
  return c;
};

/**
 * Insert a couple of numbers into a list to hit a target range while leaving the
 * mode and median alone, making the inserted numbers as large as possible. Two
 * ceilings do all the work and the scene derives both. The **range** ceiling:
 * the original min and max stay, so the new min can never rise above the old
 * one, and the new max is therefore at most `min + targetRange` — that caps the
 * big insertion. The **median** ceiling is the pretty one: with an odd count the
 * median is the middle slot, so half the list plus one must sit at or below it,
 * and the original list is one short of supplying them — which *forces* one of
 * the new numbers down into the low half. Together they bound the sum, and the
 * bound turns out to be one too high, because the value that would achieve it
 * ties the mode (that near miss is normally an answer choice, and the scene
 * names its letter). Beats: the dot plot with range, mode and median marked;
 * the big number flying out to its ceiling; the low half laid out with its
 * fourth slot visibly unfilled; then the tie shown on a frequency tally and the
 * winner sliding into its true sorted place. Every pair is **enumerated** and
 * checked against all three statistics, so the maximum, the near miss and which
 * answer choices are merely non-maximal (rather than illegal) are all
 * discovered; data `{ list: [...], insert?, factor? }`.
 */
export function StatInsertScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base = (Array.isArray(data.list) ? data.list : [])
    .map((v) => num(v, 0))
    .sort((a, b) => a - b);
  const factor = Math.max(1, num(data.factor, 2));

  const lo0 = base[0];
  const hi0 = base[base.length - 1];
  const range0 = hi0 - lo0;
  const target = factor * range0;
  const med0 = median(base);
  const mode0 = modeKey(base);

  // ---- the two ceilings ----
  const forcedMax = lo0 + target; // the min can never rise above lo0
  const n = base.length + 2;
  const lowSlots = Math.floor(n / 2) + 1; // slots at or below the median
  const baseLow = base.filter((v) => v <= med0).length;
  const mustBeSmall = lowSlots - baseLow; // how many newcomers are forced low
  const capSum = med0 + forcedMax;

  // ---- enumerate every legal pair ----
  const lo = lo0 - target - 2;
  const hi = hi0 + target + 2;
  const span = Math.min(hi - lo, 400);
  const sols: { a: number; b: number; sum: number }[] = [];
  for (let a = lo; a <= lo + span; a++) {
    for (let b = a; b <= lo + span; b++) {
      if (Math.max(hi0, b) - Math.min(lo0, a) !== target) continue;
      const l = [...base, a, b];
      if (median(l) !== med0 || modeKey(l) !== mode0) continue;
      sols.push({ a, b, sum: a + b });
    }
  }
  sols.sort((p, q) => q.sum - p.sum);
  const best = sols[0] ?? { a: 0, b: 0, sum: 0 };
  const partner = best.a;
  const bigVal = best.b;

  // the near miss: the sum the two ceilings allow, and why it fails
  const nearList = [...base, med0, forcedMax];
  const nearFails = modeKey(nearList) !== mode0;
  const nearChoice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[^\d-]/g, "")) === capSum);
  const legalNotBest = (problem.choices ?? []).filter((c) => {
    const v = Number(String(c.text).replace(/[^\d-]/g, ""));
    return v !== best.sum && sols.some((s) => s.sum === v);
  });

  const okAnswer = problem.shortAnswer == null || String(best.sum) === String(problem.shortAnswer);
  const ok = sols.length > 0 && okAnswer && mustBeSmall >= 1;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 460;
  const H = 248;

  // ---- number line ----
  const dmin = Math.min(lo0, 0) - 4;
  const dmax = forcedMax + 4;
  const axL = 34;
  const axR = 430;
  const X = (v: number) => axL + ((v - dmin) / (dmax - dmin)) * (axR - axL);
  const lineY = 86;

  const shown = phase === 0 ? base : phase >= 2 ? [...base, bigVal] : [...base, forcedMax];
  const stack = new Map<number, number>();
  const dots = shown.map((v) => {
    const k = stack.get(v) ?? 0;
    stack.set(v, k + 1);
    return { v, k, isNew: v === forcedMax && phase === 1 };
  });

  // ---- the sorted row (phases 2, 3) ----
  const fixed = [...base, bigVal].sort((a, b) => a - b);
  const pitch = 50;
  const tw = 46;
  const rowY = 152;
  const rowX0 = (W - (fixed.length + 1) * pitch + (pitch - tw)) / 2;
  const slotX = (i: number) => rowX0 + i * pitch;
  const medSlot = (n - 1) >> 1;
  /** where each fixed value sits once a newcomer of value x joins */
  const layout = (x: number) => {
    const at = fixed.filter((v) => v <= x).length;
    return { at, slotOfFixed: (j: number) => (j < at ? j : j + 1) };
  };
  const near = layout(med0); // the near miss sits at the median slot
  const good = layout(partner);

  const finalList = [...base, partner, bigVal];
  const tally = [...counts(nearList).entries()].filter(([, c]) => c > 1).sort((a, b) => a[0] - b[0]);

  const Tile = ({
    x,
    value,
    fill,
    stroke,
    ink,
  }: {
    x: number;
    value: number | string;
    fill: string;
    stroke: string;
    ink: string;
  }) => (
    <g>
      <rect x={x} y={rowY} width={tw} height={28} rx={6} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={x + tw / 2} y={rowY + 19} textAnchor="middle" fontSize="13" fontWeight="800" fill={ink} fontFamily={numberFont}>
        {value}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ---- number line ---- */}
        <line x1={axL - 6} y1={lineY} x2={axR + 6} y2={lineY} stroke="#cbd5e1" strokeWidth={2} />
        {dots.map((d, i) => (
          <motion.g
            key={`d${d.v}-${d.k}`}
            initial={d.isNew ? { opacity: 0, x: -120, y: -34 } : { opacity: 0, scale: 0 }}
            animate={d.isNew ? { opacity: 1, x: 0, y: 0 } : { opacity: 1, scale: 1 }}
            transition={
              d.isNew
                ? { type: "spring", stiffness: 70, damping: 14, delay: 0.7 }
                : { type: "spring", stiffness: 300, damping: 16, delay: 0.1 + i * 0.07 }
            }
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle
              cx={X(d.v)}
              cy={lineY - 7 - d.k * 11}
              r={4.6}
              fill={d.isNew ? WIN : d.v === med0 ? IND : INK}
              stroke="#fff"
              strokeWidth={1}
            />
          </motion.g>
        ))}
        {[...new Set(shown)].map((v) => (
          <text
            key={`t${v}`}
            x={X(v)}
            y={lineY + 15}
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill={v === forcedMax ? WIN : v === med0 ? IND : DIM}
            fontFamily={numberFont}
          >
            {v}
          </text>
        ))}

        {/* ---- phase 0: the range has to double ---- */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              mode {mode0}, median {med0} — both must survive
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <line x1={X(lo0)} y1={lineY + 26} x2={X(hi0)} y2={lineY + 26} stroke={INK} strokeWidth={1.6} />
              <line x1={X(lo0)} y1={lineY + 21} x2={X(lo0)} y2={lineY + 31} stroke={INK} strokeWidth={1.6} />
              <line x1={X(hi0)} y1={lineY + 21} x2={X(hi0)} y2={lineY + 31} stroke={INK} strokeWidth={1.6} />
              <text x={(X(lo0) + X(hi0)) / 2} y={lineY + 42} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                range {range0}
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0, scaleX: 0.5 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ type: "spring", stiffness: 60, damping: 15, delay: 1.2 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }}>
              <line x1={X(lo0)} y1={lineY + 66} x2={X(lo0 + target)} y2={lineY + 66} stroke={WARN} strokeWidth={2.4} />
              <line x1={X(lo0)} y1={lineY + 61} x2={X(lo0)} y2={lineY + 71} stroke={WARN} strokeWidth={2.4} />
              <line x1={X(lo0 + target)} y1={lineY + 61} x2={X(lo0 + target)} y2={lineY + 71} stroke={WARN} strokeWidth={2.4} />
            </motion.g>
            <motion.text
              x={(X(lo0) + X(lo0 + target)) / 2}
              y={lineY + 82}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={WARN}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              needs to be {target}
            </motion.text>
          </g>
        )}

        {/* ---- phase 1: the big one is capped ---- */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {lo0} and {hi0} both stay, so the smallest can never rise above {lo0}
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <line x1={X(lo0)} y1={lineY + 30} x2={X(forcedMax)} y2={lineY + 30} stroke={WIN} strokeWidth={2.4} />
              <line x1={X(lo0)} y1={lineY + 25} x2={X(lo0)} y2={lineY + 35} stroke={WIN} strokeWidth={2.4} />
              <line x1={X(forcedMax)} y1={lineY + 25} x2={X(forcedMax)} y2={lineY + 35} stroke={WIN} strokeWidth={2.4} />
              <text x={(X(lo0) + X(forcedMax)) / 2} y={lineY + 46} textAnchor="middle" fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {target}
              </text>
            </motion.g>
            <motion.text
              x={W / 2}
              y={lineY + 76}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              largest possible = {lo0} + {target} = <tspan fill={WIN}>{forcedMax}</tspan>
            </motion.text>
            <motion.text x={W / 2} y={lineY + 96} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              no number in the list can be bigger than that
            </motion.text>
          </g>
        )}

        {/* ---- phases 2 and 3: the sorted row ---- */}
        {phase >= 2 && (
          <g>
            {/* the low half */}
            <motion.rect
              x={slotX(0) - 6}
              y={rowY - 20}
              width={lowSlots * pitch + 6}
              height={62}
              rx={9}
              fill={LOW_BAND}
              stroke={WIN}
              strokeWidth={1.2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            />
            <text x={slotX(0) - 6 + (lowSlots * pitch) / 2} y={rowY - 27} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {lowSlots} slots must be ≤ {med0}
            </text>

            {/* the median slot */}
            <text x={slotX(medSlot) + tw / 2} y={rowY + 56} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
              median
            </text>
            <path d={`M ${slotX(medSlot) + tw / 2},${rowY + 46} l -4,-6 l 8,0 z`} fill={IND} />

            {/* the fixed values */}
            {fixed.map((v, j) => {
              const a = near.slotOfFixed(j);
              const b = good.slotOfFixed(j);
              return (
                <motion.g
                  key={`f${j}`}
                  initial={{ opacity: 0, y: -26 }}
                  animate={
                    phase === 2
                      ? { opacity: 1, y: 0, x: slotX(a) - slotX(a) }
                      : { opacity: 1, y: 0, x: [slotX(a) - slotX(b), slotX(a) - slotX(b), 0] }
                  }
                  transition={
                    phase === 2
                      ? { type: "spring", stiffness: 200, damping: 18, delay: 0.25 + j * 0.1 }
                      : { duration: 2.6, times: [0, 0.55, 1], delay: 0.3 }
                  }
                >
                  <Tile
                    x={slotX(phase === 2 ? a : b)}
                    value={v}
                    fill={v <= med0 ? "#fff" : "#f1f5f9"}
                    stroke={v === med0 ? IND : "#cbd5e1"}
                    ink={INK}
                  />
                </motion.g>
              );
            })}

            {/* phase 2: the slot the original list cannot fill */}
            {phase === 2 && (
              <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x={slotX(near.at)} y={rowY} width={tw} height={28} rx={6} fill="#fff" stroke={WARN} strokeWidth={2} strokeDasharray="4 3" />
                <text x={slotX(near.at) + tw / 2} y={rowY + 19} textAnchor="middle" fontSize="13" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  ≤ {med0}
                </text>
              </motion.g>
            )}

            {/* phase 3: the near miss lifts out, the winner slides in */}
            {phase === 3 && (
              <g>
                <motion.g
                  initial={{ y: 0, x: 0 }}
                  animate={{ y: [0, 0, -40], x: [0, 0, slotX(fixed.length - 1) - slotX(near.at)] }}
                  transition={{ duration: 2.6, times: [0, 0.55, 1], delay: 0.3 }}
                >
                  <Tile x={slotX(near.at)} value={med0} fill="#fecaca" stroke={BAD} ink={BAD} />
                  <motion.text
                    x={slotX(near.at) + tw / 2}
                    y={rowY - 8}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill={BAD}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 1] }}
                    transition={{ duration: 2.6, times: [0, 0.6, 0.8], delay: 0.3 }}
                  >
                    {capSum} ✗{nearChoice ? ` (${nearChoice.label})` : ""}
                  </motion.text>
                </motion.g>
                <motion.g
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: [0, 0, 1], scale: [0.4, 0.4, 1] }}
                  transition={{ duration: 2.6, times: [0, 0.62, 0.85], delay: 0.3 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <Tile x={slotX(good.at)} value={partner} fill="#bbf7d0" stroke={WIN} ink="#166534" />
                </motion.g>
              </g>
            )}
          </g>
        )}

        {/* ---- phase 2 note ---- */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the median is the middle of {n}, so {lowSlots} numbers must be ≤ {med0}
            </text>
            <motion.text x={W / 2} y={H - 22} textAnchor="middle" fontSize="11" fontWeight="800" fill={WARN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              the list supplies only {baseLow} — so {mustBeSmall} new number must be ≤ {med0}
            </motion.text>
            <motion.text x={W / 2} y={H - 6} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              sum ≤ {med0} + {forcedMax} = {capSum}
            </motion.text>
          </g>
        )}

        {/* ---- phase 3: the frequency tally ---- */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {med0} would tie the mode — {mode0} must stay alone on top
            </text>
            {tally.map(([v, c], i) => (
              <motion.g key={`m${v}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 + i * 0.15 }}>
                {Array.from({ length: c }, (_, j) => (
                  <circle key={j} cx={120 + i * 40} cy={H - 30 - j * 10} r={4} fill={BAD} />
                ))}
                <text x={120 + i * 40} y={H - 14} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                  {v}
                </text>
              </motion.g>
            ))}
            <motion.text x={80} y={H - 44} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.85 }}>
              with {med0}:
            </motion.text>
            <motion.text x={190} y={H - 26} fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.05 }}>
              {tally.map(([v]) => v).join(" and ")} both twice — two modes
            </motion.text>
            <motion.text
              x={190}
              y={H - 8}
              fontSize="13"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2 }}
            >
              {partner} + {bigVal} = {best.sum}
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
          ? `range ${range0} must become ${target}, with mode ${mode0} and median ${med0} untouched`
          : phase === 1
          ? `so the biggest number we can insert is ${forcedMax}`
          : phase === 2
          ? `one insertion is forced down to ≤ ${med0}, the other is at most ${forcedMax}`
          : `${partner} keeps ${mode0} alone and leaves ${med0} in the middle`}
      </motion.span>

      <AnimatePresence>
        {phase === 3 && legalNotBest.length > 0 && (
          <motion.span
            key="legal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.3 }}
            style={{ fontFamily: numberFont, fontSize: 10.5, fontWeight: 700, color: DIM, textAlign: "center" }}
          >
            {legalNotBest.map((c) => c.text).join(", ")} are legal too — just not the largest
          </motion.span>
        )}
      </AnimatePresence>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: scan found {sols.length} pairs, best {best.sum}
        </span>
      )}
      {ok && !nearFails && phase === 3 && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: {capSum} was not blocked by the mode
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
