import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const ROW_COLORS = ["#0ea5e9", "#f97316", "#a855f7", "#14b8a6"];

function lcmOf(nums: number[]): number {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  return nums.reduce((a, b) => (a * b) / gcd(a, b), 1);
}

/**
 * A number that leaves the same remainder against several divisors: strip
 * the remainder off and every divisor's multiples must land on it at once —
 * their LCM. Six beats: (0) the remainder condition, subtract it off;
 * (1) four rows of multiples march up their own tracks and the first point
 * they all land on together is highlighted — the LCM; (2) a trap — stopping
 * at that point without adding the remainder back places the answer inside
 * a real (wrong) choice range; (3) the remainder is added back; (4) the
 * result is located among the actual answer-choice ranges; (5) the badge.
 * Data: { divisors: number[], remainder }.
 */
export function MultipleLadderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const divisors = (Array.isArray(data.divisors) ? data.divisors : []).map((v) => Math.round(num(v, 0))).filter((v) => v > 0);
  const remainder = Math.round(num(data.remainder, 0));
  if (divisors.length < 2) return null;

  const lcm = lcmOf(divisors);
  const result = lcm + remainder;

  const ranges = (problem.choices ?? [])
    .map((c) => {
      const m = c.text.match(/(\d+)\D+(\d+)/);
      return m ? { label: c.label, lo: Number(m[1]), hi: Number(m[2]) } : null;
    })
    .filter((r): r is { label: string; lo: number; hi: number } => r != null);
  const trapRange = ranges.find((r) => lcm >= r.lo && lcm <= r.hi);
  const trueRange = ranges.find((r) => result >= r.lo && result <= r.hi);

  const last = totalSteps - 1;
  const showLadder = step >= 1;
  const isTrapStep = step === 2;
  const showAdd = step >= 3;
  const showLocate = step >= 4;
  const isFinal = step >= last;

  const W = 300;
  const H = 190;
  const trackX0 = 30;
  const trackW = 250;
  const rowGap = 22;
  const rowY0 = 26;
  const scale = trackW / lcm;

  const markerX = showAdd ? result * scale : lcm * scale;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {divisors.map((d, i) => {
          const y = rowY0 + i * rowGap;
          const color = ROW_COLORS[i % ROW_COLORS.length];
          const multiples = Array.from({ length: lcm / d }, (_, k) => (k + 1) * d);
          return (
            <g key={i}>
              <text x={trackX0 - 10} y={y + 3} textAnchor="end" fontSize="10" fontWeight="800" fill={color} fontFamily={FONT}>
                {d}
              </text>
              <line x1={trackX0} y1={y} x2={trackX0 + trackW} y2={y} stroke="#e2e8f0" strokeWidth={1.2} />
              <AnimatePresence>
                {showLadder &&
                  multiples.map((m, k) => (
                    <motion.circle
                      key={m}
                      cx={trackX0 + m * scale}
                      cy={y}
                      r={m === lcm ? 4 : 2.6}
                      fill={m === lcm ? color : `${color}99`}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: k * 0.03 }}
                    />
                  ))}
              </AnimatePresence>
            </g>
          );
        })}

        <AnimatePresence>
          {showLadder && (
            <motion.line
              key="lcmline"
              x1={trackX0 + lcm * scale}
              y1={rowY0 - 8}
              x2={trackX0 + lcm * scale}
              y2={rowY0 + (divisors.length - 1) * rowGap + 8}
              stroke={MARK}
              strokeWidth={1.6}
              strokeDasharray="3 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLadder && (
            <motion.g key="marker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <motion.g animate={{ x: markerX }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <path d={`M ${trackX0} ${rowY0 + (divisors.length - 1) * rowGap + 18} L ${trackX0 - 5} ${rowY0 + (divisors.length - 1) * rowGap + 28} L ${trackX0 + 5} ${rowY0 + (divisors.length - 1) * rowGap + 28} Z`} fill={isTrapStep ? BAD : showAdd ? (isFinal ? WIN : MARK) : MARK} />
                <text x={trackX0} y={rowY0 + (divisors.length - 1) * rowGap + 40} textAnchor="middle" fontSize="11" fontWeight="900" fill={isTrapStep ? BAD : showAdd ? (isFinal ? WIN : MARK) : MARK} fontFamily={FONT}>
                  {showAdd ? result : lcm}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {showLocate && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 320 }}>
            {ranges.map((r) => {
              const hit = r.label === trueRange?.label;
              return (
                <div
                  key={r.label}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: hit ? "#dcfce7" : "#f1f5f9",
                    border: `1.4px solid ${hit ? WIN : "#cbd5e1"}`,
                    fontFamily: FONT,
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: hit ? WIN : "#64748b",
                  }}
                >
                  {r.lo}–{r.hi}
                </div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 320,
          color: isFinal ? WIN : showLocate ? WIN : showAdd ? MARK : isTrapStep ? BAD : showLadder ? MARK : DIM,
        }}
      >
        {isFinal
          ? `${result} lies between ${trueRange ? `${trueRange.lo} and ${trueRange.hi}` : "?"}`
          : showLocate
          ? `${result} falls inside ${trueRange ? `${trueRange.lo}–${trueRange.hi}` : "no listed range"}`
          : showAdd
          ? `${lcm} + ${remainder} = ${result}`
          : isTrapStep
          ? `stopping at ${lcm} without adding the remainder back${trapRange ? ` lands inside ${trapRange.lo}–${trapRange.hi}` : ""} — too small`
          : showLadder
          ? `every track first lands together at ${lcm} — that's the LCM(${divisors.join(", ")})`
          : `subtract ${remainder}: the number must divide evenly by ${divisors.join(", ")}`}
      </motion.div>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
