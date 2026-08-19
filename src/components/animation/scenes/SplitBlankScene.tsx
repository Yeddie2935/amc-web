import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SMALL = "#0d9488";
const OTHER = "#2563eb";
const BLANK = "#f59e0b";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MUTE = "#94a3b8";

const W = 360;
const H = 212;
const X0 = 30;
const X1 = 330;
const R1 = 44; // the sum bar
const R2 = 82; // the same bar re-cut as n + n + blank
const BH = 24;

const tidy = (v: number) => String(Number(v.toFixed(4)));

/**
 * "One integer is ___ more than k times another, and the two add to T" — how
 * many values can fill the blank? The unlock is that the blank is not free: the
 * pair is pinned by their sum, so choosing the smaller number choses everything,
 * and the blank is simply what is left of the larger one after k copies of the
 * smaller are taken out of it. The scene draws exactly that — one bar of T cut
 * in two, and the larger part **re-cut underneath into k copies of the smaller
 * plus the leftover** — then slides the cut along. Each step to the right adds
 * `k` to the copies and takes 1 off the larger part, so the blank loses `k + 1`
 * every time and the values come out as an arithmetic run, never repeating.
 * The run stops where the picture stops: one step further and the k copies are
 * visibly wider than the larger part, drawn overflowing past the end of the bar.
 * The closing beat prices the slip of letting the smaller number be 0, which
 * adds one more blank and lands on its own answer choice.
 * Every blank, the step, the last valid cut and the overflow are computed, and
 * the count is checked against the stored answer.
 * Data: { total, multiple? }.
 */
export function SplitBlankScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.round(num(data.total, 28));
  const k = Math.max(1, Math.round(num(data.multiple, 2)));

  const stepDown = k + 1; // each +1 of n adds k to the copies and loses 1 off the other
  const blankOf = (n: number) => total - stepDown * n;
  const maxN = Math.max(0, Math.floor((total - 1) / stepDown));
  const ns = Array.from({ length: maxN }, (_, i) => i + 1);
  const blanks = ns.map(blankOf);
  const overN = maxN + 1; // the first cut that fails

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const winner = opts.find((o) => o.value === maxN);
  const zeroSlip = opts.find((o) => o.value === maxN + 1);
  const agrees = !problem.answer || winner?.label === problem.answer;

  const u = (X1 - X0) / total;
  const xOf = (v: number) => X0 + v * u;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showSlide = !isFinal && step === 1 && totalSteps >= 4;
  const showStop = !isFinal && step >= Math.max(1, preSteps - 1);
  const showCards = showSlide || showStop || isFinal;

  // where the cut sits this beat: parked, sliding through every value, or at the last one
  const nNow: number | number[] = showSlide ? ns : showStop || isFinal ? maxN : 1;
  const nEnd = showSlide ? maxN : showStop || isFinal ? maxN : 1;
  const mapK = (v: number | number[], f: (n: number) => number): number | number[] =>
    Array.isArray(v) ? v.map(f) : f(v);
  const times = ns.map((_, i) => i / Math.max(1, ns.length - 1));
  const slideT = showSlide
    ? { duration: 0.28 * ns.length, times, ease: "linear" as const, delay: 0.4 }
    : { type: "spring" as const, stiffness: 80, damping: 18, delay: 0.35 };

  const cardW = Math.min(34, (X1 - X0) / Math.max(1, maxN)) - 3;
  const cardX = (i: number) => X0 + (i * (X1 - X0)) / Math.max(1, maxN);

  const caption = showSlide
    ? `slide the cut: the ${k} copies gain ${k} and the other loses 1, so the blank drops ${stepDown}`
    : showStop && !isFinal
    ? `at ${overN} the ${k} copies are already ${k * overN}, but only ${total - overN} is left — the cut stops at ${maxN}`
    : isFinal
    ? `${maxN} different blanks: ${blanks.slice().reverse().join(", ")}`
    : `${total} splits into ${1} and ${total - 1}, and ${total - 1} is ${blankOf(1)} more than ${k} × ${1}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <text x={X0} y={22} fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
          the two numbers add to {total}
        </text>

        {/* row 1: the sum, cut in two */}
        <motion.g initial={{ x: 0 }} animate={{ x: 0 }}>
          <motion.rect
            x={X0}
            y={R1}
            height={BH}
            rx={3}
            fill={SMALL}
            stroke={INK}
            strokeWidth={1.2}
            initial={{ width: xOf(1) - X0 }}
            animate={{ width: mapK(nNow, (n) => n * u) }}
            transition={slideT}
          />
        </motion.g>
        <motion.g initial={{ x: xOf(1) }} animate={{ x: mapK(nNow, (n) => xOf(n)) }} transition={slideT}>
          <motion.rect
            x={0}
            y={R1}
            height={BH}
            rx={3}
            fill={OTHER}
            stroke={INK}
            strokeWidth={1.2}
            initial={{ width: X1 - xOf(1) }}
            animate={{ width: mapK(nNow, (n) => X1 - xOf(n)) }}
            transition={slideT}
          />
        </motion.g>

        {/* row 2: the larger part re-cut into k copies of the smaller, plus the blank */}
        {Array.from({ length: k }).map((_, c) => (
          <motion.g
            key={c}
            initial={{ x: xOf(1) + c * u }}
            animate={{ x: mapK(nNow, (n) => xOf(n) + c * n * u) }}
            transition={slideT}
          >
            <motion.rect
              x={0}
              y={R2}
              height={BH}
              rx={3}
              fill={SMALL}
              opacity={0.85}
              stroke={INK}
              strokeWidth={1.2}
              initial={{ width: u }}
              animate={{ width: mapK(nNow, (n) => n * u) }}
              transition={slideT}
            />
          </motion.g>
        ))}
        <motion.g
          initial={{ x: xOf(1 + k) }}
          animate={{ x: mapK(nNow, (n) => xOf(n + k * n)) }}
          transition={slideT}
        >
          <motion.rect
            x={0}
            y={R2}
            height={BH}
            rx={3}
            fill={BLANK}
            stroke={INK}
            strokeWidth={1.2}
            initial={{ width: blankOf(1) * u }}
            animate={{ width: mapK(nNow, (n) => Math.max(0, blankOf(n)) * u) }}
            transition={slideT}
          />
        </motion.g>

        {/* the cut that fails: k copies wider than what is left */}
        <AnimatePresence>
          {showStop && !isFinal && (
            <motion.g key="over" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              {Array.from({ length: k }).map((_, c) => (
                <rect
                  key={c}
                  x={xOf(overN) + c * overN * u}
                  y={R2 + 30}
                  width={overN * u}
                  height={16}
                  rx={3}
                  fill="none"
                  stroke={BAD}
                  strokeWidth={1.4}
                  strokeDasharray="4 3"
                />
              ))}
              <line x1={X1} y1={R2 + 26} x2={X1} y2={R2 + 48} stroke={BAD} strokeWidth={1.4} />
              <text x={xOf(overN)} y={R2 + 56} fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                n = {overN}: {k} × {overN} = {k * overN} &gt; {total - overN}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* live readout above the bars */}
        <motion.g initial={{ x: xOf(0.5) }} animate={{ x: mapK(nNow, (n) => xOf(n / 2)) }} transition={slideT}>
          <text x={0} y={R1 - 6} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={SMALL} fontFamily={numberFont}>
            {tidy(nEnd)}
          </text>
        </motion.g>
        <motion.g initial={{ x: (xOf(1) + X1) / 2 }} animate={{ x: mapK(nNow, (n) => (xOf(n) + X1) / 2) }} transition={slideT}>
          <text x={0} y={R1 - 6} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={OTHER} fontFamily={numberFont}>
            {tidy(total - nEnd)}
          </text>
        </motion.g>
        <motion.g
          initial={{ x: (xOf(1 + k) + X1) / 2 }}
          animate={{ x: mapK(nNow, (n) => (xOf(n + k * n) + X1) / 2) }}
          transition={slideT}
        >
          <text x={0} y={R2 - 5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BLANK} fontFamily={numberFont}>
            blank {tidy(blankOf(nEnd))}
          </text>
        </motion.g>
        <text x={X0} y={R2 - 5} fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
          = {Array.from({ length: k }).map(() => "n").join(" + ")} + blank
        </text>

        {/* every cut and the blank it leaves */}
        <AnimatePresence>
          {showCards && (
            <motion.g key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {ns.map((n, i) => (
                  <motion.g
                    key={n}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18, delay: (showSlide ? 0.4 : 0.3) + i * (showSlide ? 0.28 : 0.08) }}
                  >
                    <rect
                      x={cardX(i)}
                      y={146}
                      width={cardW}
                      height={34}
                      rx={4}
                      fill={isFinal ? "#dcfce7" : "#fff"}
                      stroke={isFinal ? WIN : BLANK}
                      strokeWidth={1.3}
                    />
                    <text x={cardX(i) + cardW / 2} y={158} textAnchor="middle" fontSize="8" fontWeight="700" fill={SMALL} fontFamily={numberFont}>
                      n={n}
                    </text>
                    <text x={cardX(i) + cardW / 2} y={173} textAnchor="middle" fontSize="12" fontWeight="800" fill={isFinal ? WIN : BLANK} fontFamily={numberFont}>
                      {blankOf(n)}
                    </text>
                  </motion.g>
              ))}
              {showSlide && (
                <motion.text
                  x={W / 2}
                  y={194}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={MARK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + ns.length * 0.28 }}
                >
                  every blank is {stepDown} less than the one before
                </motion.text>
              )}
              {isFinal && (
                <>
                  <motion.text
                    x={W / 2}
                    y={194}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={WIN}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.3 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {maxN} values fill the blank
                  </motion.text>
                  {zeroSlip && (
                    <motion.text
                      x={W / 2}
                      y={207}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="700"
                      fill={BAD}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 }}
                    >
                      letting the other number be 0 adds a {maxN + 1}th blank ({total}) = ({zeroSlip.label})
                    </motion.text>
                  )}
                </>
              )}
            </motion.g>
          )}
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
            transition={{ delay: 2.2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? MUTE : BAD, textAlign: "center" }}
          >
            {agrees
              ? `the blanks step down by ${stepDown}, so no two cuts give the same one`
              : `this counts ${maxN}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
