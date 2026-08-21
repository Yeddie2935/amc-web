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

/** Every strictly increasing `len`-digit number, in order. */
function increasingNumbers(len: number): number[] {
  const out: number[] = [];
  const rec = (ds: number[], start: number) => {
    if (ds.length === len) {
      out.push(Number(ds.join("")));
      return;
    }
    for (let d = start; d <= 9; d++) rec([...ds, d], d + 1);
  };
  for (let d = 1; d <= 9; d++) rec([d], d + 1);
  return out;
}

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  const out: T[][] = [];
  items.forEach((it, i) => {
    permutations([...items.slice(0, i), ...items.slice(i + 1)]).forEach((rest) => out.push([it, ...rest]));
  });
  return out;
}

/**
 * Counting the numbers in a range whose digits **strictly increase**. The trap is
 * to reach for the multiplication principle and get 6 × 5 = 30; the unlock is
 * that increasing order is not a choice you make but a constraint that does the
 * arranging *for* you — a set of digits yields exactly one number, so the count
 * is a count of **sets**, and the answer is a binomial coefficient rather than a
 * product.
 *
 * The scene **enumerates every increasing number itself** and filters by the
 * range, so the solution list is discovered, not asserted. From that list it
 * derives the forced prefix (the longest common prefix of the survivors), the
 * pool the free digits are drawn from, and then *checks* that the count really
 * equals C(pool, free slots) — the identity is verified rather than claimed.
 *
 * The beat that earns its place is the second: why the prefix is forced. Rather
 * than asserting "the second digit must be 3", it tests each candidate by its
 * **smallest possible completion** — if even the smallest overshoots the window,
 * every completion does — and drops all of them onto a real number line, where
 * one lands inside the shaded window and the rest sail past its right edge.
 * Candidates too large to complete at all (8 and 9 leave under two bigger digits)
 * are reported separately, so the sweep visibly finishes.
 *
 * The closing beat groups the survivors by their first free digit, which makes
 * the row lengths 5, 4, 3, 2, 1 — so the binomial coefficient is *counted off the
 * picture* as a triangle rather than taken on faith; data
 * `{ low, high, length, example? }`.
 */
export function IncreasingDigitsScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const low = num(data.low, 0);
  const high = num(data.high, 9999);
  const len = Math.max(2, Math.min(9, Math.round(num(data.length, 4))));

  // ---- solve it: every increasing number, then the window ----
  const solutions = increasingNumbers(len).filter((n) => n > low && n < high);
  const strs = solutions.map((n) => String(n));

  // the forced prefix is whatever every survivor agrees on
  let prefix = "";
  if (strs.length > 0) {
    for (let i = 0; i < len; i++) {
      const c = strs[0][i];
      if (strs.every((s) => s[i] === c)) prefix += c;
      else break;
    }
  }
  const freeSlots = len - prefix.length;
  const pool = Array.from(new Set(strs.flatMap((s) => s.slice(prefix.length).split("")))).map(Number).sort((a, b) => a - b);
  const binomial = choose(pool.length, freeSlots);

  // ---- why the last prefix digit is forced: test each candidate's *smallest* completion ----
  const p = prefix.length - 1;
  const head = prefix.slice(0, p);
  const minDigit = p > 0 ? Number(prefix[p - 1]) + 1 : 1;
  const candidates = [];
  for (let d = minDigit; d <= 9; d++) {
    const tail: number[] = [];
    for (let k = 1; k <= len - p - 1; k++) tail.push(d + k);
    const feasible = tail.every((t) => t <= 9);
    const smallest = feasible ? Number(head + String(d) + tail.join("")) : null;
    candidates.push({ d, smallest, feasible, inRange: smallest != null && smallest > low && smallest < high });
  }
  const fits = candidates.filter((c) => c.inRange);
  const overshoot = candidates.filter((c) => c.feasible && !c.inRange);
  const tooBig = candidates.filter((c) => !c.feasible);

  // the worked example the statement offers, checked against the real list
  const exampleN = Math.round(num(data.example, solutions[Math.floor(solutions.length / 2)] ?? 0));
  const exDigits = String(exampleN).split("").map(Number);
  const exFree = String(exampleN).slice(prefix.length).split("").map(Number);

  // a couple of genuine non-increasing rearrangements of the example's digits
  const shuffles = permutations(exDigits)
    .filter((pm) => pm.join("") !== String(exampleN) && pm[0] !== 0)
    .filter((_, i) => i % 7 === 3)
    .slice(0, 3)
    .map((pm) => pm.join(""));
  const orderings = permutations(exDigits).length;

  // ---- self-checks ----
  const countOk = solutions.length === binomial;
  const forcedOk = fits.length === 1;
  const exampleOk = solutions.includes(exampleN);
  const answerOk =
    problem.shortAnswer == null || String(solutions.length) === String(problem.shortAnswer).replace(/[^\d]/g, "");
  const ok = countOk && forcedOk && exampleOk && answerOk && solutions.length > 0;
  const failure = solutions.length === 0
    ? "no increasing numbers land in this window"
    : !countOk
    ? `${solutions.length} numbers but C(${pool.length},${freeSlots}) = ${binomial}`
    : !forcedOk
    ? `${fits.length} second digits fit, so the prefix is not forced`
    : !exampleOk
    ? `the example ${exampleN} is not one of them`
    : !answerOk
    ? `counted ${solutions.length}, answer says ${problem.shortAnswer}`
    : "";

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  const Tile = ({
    x,
    y,
    w,
    h,
    d,
    tone,
    dashed = false,
    fontSize = 20,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    d?: number | string | null;
    tone: string;
    dashed?: boolean;
    fontSize?: number;
  }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={tone}
        fillOpacity={dashed ? 0.05 : 0.14}
        stroke={tone}
        strokeWidth={2}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      {d != null && d !== "" && (
        <text x={x + w / 2} y={y + h / 2 + fontSize * 0.35} textAnchor="middle" fontSize={fontSize} fontWeight="800" fill={tone} fontFamily={numberFont}>
          {d}
        </text>
      )}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: increasing order does the arranging ============ */}
        {phase === 0 &&
          (() => {
            const TW = 40;
            const TG = 12;
            const x0 = (W - (len * TW + (len - 1) * TG)) / 2;
            const slotX = (i: number) => x0 + i * (TW + TG);
            const sorted = [...exDigits].sort((a, b) => a - b);
            // the row starts in one of the real shuffles and sorts itself
            const from = (shuffles[0] ?? String(exampleN)).split("").map(Number);
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  increasing order is not a choice — it arranges the digits for you
                </text>

                {/* genuine rearrangements of the very same digits, all rejected */}
                {shuffles.map((s, i) => {
                  const cx = 105 + i * 130;
                  const half = (s.length * 16 * 0.6) / 2;
                  return (
                    <motion.g key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.12 }}>
                      <text x={cx} y={52} textAnchor="middle" fontSize="16" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                        {s}
                      </text>
                      <motion.line
                        x1={cx - half}
                        y1={47}
                        x2={cx + half}
                        y2={47}
                        stroke={BAD}
                        strokeWidth={2}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
                      />
                    </motion.g>
                  );
                })}
                <text x={W / 2} y={72} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
                  the same {len} digits, shuffled — none of these climbs
                </text>

                {/* the tiles slide from a shuffled row into sorted order */}
                {sorted.map((d, i) => {
                  const fromIdx = from.indexOf(d);
                  const dx = slotX(fromIdx >= 0 ? fromIdx : i) - slotX(i);
                  return (
                    <motion.g
                      key={`${d}-${i}`}
                      initial={{ x: dx, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.9 + i * 0.1 }}
                    >
                      <Tile x={slotX(i)} y={96} w={TW} h={46} d={d} tone={IND} />
                    </motion.g>
                  );
                })}
                {sorted.slice(0, -1).map((_, i) => (
                  <motion.text
                    key={i}
                    x={slotX(i) + TW + TG / 2}
                    y={125}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={WIN}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    &lt;
                  </motion.text>
                ))}

                <motion.text x={W / 2} y={166} textAnchor="middle" fontSize="11" fontWeight="800" fill={WIN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  ✓ sorted, they make exactly one number: {exampleN}
                </motion.text>
                <motion.text x={W / 2} y={196} textAnchor="middle" fontSize="13" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0 }}>
                  {len}! = {orderings} orderings → 1 number
                </motion.text>
                <motion.text x={W / 2} y={226} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                  so counting these numbers means counting SETS of {len} digits
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 1: the window forces the opening digits ============ */}
        {phase === 1 &&
          (() => {
            const feas = candidates.filter((c) => c.smallest != null).map((c) => c.smallest as number);
            const lo = Math.min(low, ...feas);
            const hi = Math.max(high, ...feas);
            const pad = (hi - lo) * 0.05;
            const dom0 = lo - pad;
            const dom1 = hi + pad;
            const LX = 40;
            const LW = 400;
            const xOf = (v: number) => LX + ((v - dom0) / (dom1 - dom0)) * LW;
            const LY = 122;
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  test each opening digit by its <tspan fontStyle="italic">smallest</tspan> completion
                </text>
                <text x={W / 2} y={36} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
                  if even the smallest overshoots, every completion does
                </text>

                {/* the window */}
                <motion.rect
                  x={xOf(low)}
                  y={LY - 9}
                  width={xOf(high) - xOf(low)}
                  height={18}
                  rx={4}
                  fill={WIN}
                  fillOpacity={0.2}
                  stroke={WIN}
                  strokeWidth={1.6}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left" }}
                />
                <line x1={LX - 8} y1={LY} x2={LX + LW + 8} y2={LY} stroke={INK} strokeWidth={1.6} />
                {[low, high].map((v) => (
                  <g key={v}>
                    <line x1={xOf(v)} y1={LY - 11} x2={xOf(v)} y2={LY + 11} stroke={INK} strokeWidth={1.8} />
                    <text x={xOf(v)} y={LY + 26} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      {v}
                    </text>
                  </g>
                ))}

                {/* one pin per candidate opening digit */}
                {candidates
                  .filter((c) => c.smallest != null)
                  .map((c, i) => {
                    const x = xOf(c.smallest as number);
                    const tone = c.inRange ? WIN : BAD;
                    return (
                      <g key={c.d}>
                        <motion.g initial={{ y: -46, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 130, damping: 14, delay: 0.4 + i * 0.22 }}>
                          <rect x={x - 20} y={70} width={40} height={19} rx={5} fill={tone} fillOpacity={0.16} stroke={tone} strokeWidth={1.5} />
                          <text x={x} y={84} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={tone} fontFamily={numberFont}>
                            {c.smallest}
                          </text>
                          <line x1={x} y1={89} x2={x} y2={LY - 10} stroke={tone} strokeWidth={1.4} strokeDasharray="3 2" />
                          <circle cx={x} cy={LY} r={3.6} fill={tone} />
                        </motion.g>
                        <motion.text
                          x={x}
                          y={62}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="800"
                          fill={tone}
                          fontFamily={numberFont}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + i * 0.22 }}
                        >
                          {head}
                          {c.d}__
                        </motion.text>
                      </g>
                    );
                  })}

                {tooBig.length > 0 && (
                  <motion.text x={W / 2} y={172} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                    {tooBig.map((c) => c.d).join(" and ")} leave too few bigger digits to finish the number
                  </motion.text>
                )}
                <motion.text x={W / 2} y={198} textAnchor="middle" fontSize="11" fontWeight="800" fill={WIN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
                  only {fits.map((c) => c.d).join(", ")} lands inside — so it opens {prefix.split("").join(" ")}
                </motion.text>
                <motion.text x={W / 2} y={224} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                  {overshoot.length} openings sail past {high}, {tooBig.length} cannot be completed at all
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 2: pick the rest, order already settled ============ */}
        {phase === 2 &&
          (() => {
            const TW = 40;
            const TG = 12;
            const x0 = (W - (len * TW + (len - 1) * TG)) / 2;
            const slotX = (i: number) => x0 + i * (TW + TG);
            const PW = 34;
            const PG = 8;
            const px0 = (W - (pool.length * PW + (pool.length - 1) * PG)) / 2;
            const poolX = (i: number) => px0 + i * (PW + PG);
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  the opening is settled — now just pick the last {freeSlots}
                </text>

                {prefix.split("").map((d, i) => (
                  <Tile key={i} x={slotX(i)} y={34} w={TW} h={46} d={d} tone={IND} />
                ))}
                {Array.from({ length: freeSlots }, (_, i) => (
                  <Tile key={`f${i}`} x={slotX(prefix.length + i)} y={34} w={TW} h={46} tone={DIM} dashed />
                ))}

                <text x={W / 2} y={104} textAnchor="middle" fontSize="10" fontWeight="700" fill={INK}>
                  they must all beat {prefix[prefix.length - 1]}, so they come from these {pool.length}:
                </text>

                {pool.map((d, i) => {
                  const chosen = exFree.includes(d);
                  return (
                    <g key={d} opacity={chosen ? 0.32 : 1}>
                      <Tile x={poolX(i)} y={118} w={PW} h={36} d={d} tone={chosen ? DIM : IND} fontSize={16} />
                    </g>
                  );
                })}

                {/* a real pick flies out of the pool into the empty slots */}
                {exFree.map((d, i) => {
                  const pi = pool.indexOf(d);
                  const target = slotX(prefix.length + i);
                  return (
                    <motion.g
                      key={d}
                      initial={{ x: poolX(pi) - target, y: 84, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.5 + i * 0.3 }}
                    >
                      <Tile x={target} y={34} w={TW} h={46} d={d} tone={WIN} />
                    </motion.g>
                  );
                })}

                <motion.text x={W / 2} y={182} textAnchor="middle" fontSize="10" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                  picking {exFree.join(" then ")} and {[...exFree].reverse().join(" then ")} give the same number — {exampleN}
                </motion.text>
                <motion.text x={W / 2} y={206} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                  so it is a choice of {freeSlots}, not an arrangement of {freeSlots}
                </motion.text>
                <motion.text
                  x={W / 2}
                  y={238}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill={IND}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9 }}
                >
                  C({pool.length}, {freeSlots}) = {pool.length} × {pool.length - 1} ÷ 2 = {binomial}
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 3: count them off the picture ============ */}
        {phase === 3 &&
          (() => {
            const groups = pool
              .map((d) => ({ d, items: solutions.filter((n) => String(n)[prefix.length] === String(d)) }))
              .filter((g) => g.items.length > 0);
            const CWD = 44;
            const CG = 4;
            const rowY = (i: number) => 40 + i * Math.min(35, 176 / Math.max(1, groups.length));
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  group them by the first free digit and the count reads off
                </text>

                {groups.map((g, gi) => {
                  const y = rowY(gi);
                  return (
                    <g key={g.d}>
                      <Tile x={40} y={y} w={26} h={24} d={g.d} tone={IND} fontSize={13} />
                      {g.items.map((n, ci) => (
                        <motion.g
                          key={n}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.2 + gi * 0.22 + ci * 0.06 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                          <rect x={80 + ci * (CWD + CG)} y={y} width={CWD} height={24} rx={5} fill={WIN} fillOpacity={0.12} stroke={WIN} strokeWidth={1.4} />
                          <text x={80 + ci * (CWD + CG) + CWD / 2} y={y + 16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                            {n}
                          </text>
                        </motion.g>
                      ))}
                      <motion.text
                        x={W - 26}
                        y={y + 16}
                        textAnchor="end"
                        fontSize="12"
                        fontWeight="800"
                        fill={IND}
                        fontFamily={numberFont}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + gi * 0.22 }}
                      >
                        {g.items.length}
                      </motion.text>
                    </g>
                  );
                })}

                <motion.text
                  x={W / 2}
                  y={236}
                  textAnchor="middle"
                  fontSize="13.5"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 }}
                >
                  {groups.map((g) => g.items.length).join(" + ")} = {solutions.length}
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
          ? "one set of digits → one number"
          : phase === 1
          ? `every one of them starts ${prefix.split("").join(" ")}`
          : phase === 2
          ? `C(${pool.length}, ${freeSlots}) = ${binomial}`
          : `${solutions.length} numbers, and C(${pool.length}, ${freeSlots}) agrees`}
      </motion.span>

      {!ok && <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
