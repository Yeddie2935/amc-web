import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * Minimizing an average of distinct positive evens means reaching for the
 * smallest ones available — but the tempting smallest run starts at 0, which
 * isn't positive. The scene builds that trap explicitly (0, 2, 4, 6, averaging
 * to a real answer choice), crosses it out, then stacks the genuine smallest
 * four (2, 4, 6, 8) as blocks whose combined height is measured and split
 * evenly across all four to land on the true minimum. Data: { integers }.
 */
export function EvenIntegerMinAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const integers = (Array.isArray(data.integers) ? data.integers : [2, 4, 6, 8]).map((v) => Math.round(num(v, 0)));
  const sum = integers.reduce((a, b) => a + b, 0);
  const n = integers.length;
  const average = sum / n;
  const answerOk = problem.shortAnswer == null || String(average) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed average ${average}, stored answer is ${problem.shortAnswer}` : "";

  const trapSet = [0, ...integers.slice(0, n - 1)];
  const trapSum = trapSet.reduce((a, b) => a + b, 0);
  const trapAvg = trapSum / n;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapAvg));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 0;
  const showCorrect = step >= 1;
  const showSum = step >= 2 || isFinal;
  const showDivide = step >= 3 || isFinal;

  const W = 300;
  const H = 220;
  const barBaseY = 170;
  const maxVal = Math.max(...integers, ...trapSet);
  const scaleY = (v: number) => (v / maxVal) * 90;

  const caption = isFinal
    ? `(${integers.join(" + ")}) ÷ ${n} = ${average} — the smallest possible average`
    : showDivide
    ? `${sum} ÷ ${n} = ${average}`
    : showSum
    ? `${integers.join(" + ")} = ${sum}`
    : showCorrect
    ? `use the four smallest positive even integers: ${integers.join(", ")}`
    : trapChoice
    ? `starting from 0 gives (${trapSet.join("+")}) ÷ ${n} = ${trapAvg} — choice ${trapChoice.label}, but 0 isn't positive`
    : `0 isn't a positive integer, so it can't be used`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={20} y1={barBaseY} x2={W - 20} y2={barBaseY} stroke="#e2e8f0" strokeWidth={1.5} />

        {showTrap && !showCorrect && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD}>
              tempting but wrong: start at 0
            </text>
            {trapSet.map((v, i) => {
              const x = 24 + i * 56;
              const h = scaleY(v);
              const y = barBaseY - h;
              return (
                <motion.g key={i} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ type: "spring", stiffness: 180, damping: 16, delay: i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
                  <rect x={x} y={y} width={42} height={Math.max(h, 4)} rx={3} fill={v === 0 ? BAD : DIM} fillOpacity={0.7} />
                  <text x={x + 21} y={y - 6} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={v === 0 ? BAD : DIM} fontFamily={numberFont}>
                    {v}
                  </text>
                  {v === 0 && (
                    <motion.line x1={x} y1={barBaseY + 2} x2={x + 42} y2={barBaseY - 14} stroke={BAD} strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.3 }} />
                  )}
                </motion.g>
              );
            })}
          </g>
        )}

        {showCorrect && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              the four smallest positive evens
            </text>
            {integers.map((v, i) => {
              const x = 24 + i * 56;
              const h = scaleY(v);
              const y = barBaseY - h;
              return (
                <motion.g key={i} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ type: "spring", stiffness: 180, damping: 16, delay: i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
                  <rect x={x} y={y} width={42} height={h} rx={3} fill={IND} fillOpacity={0.85} />
                  <text x={x + 21} y={y - 6} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {v}
                  </text>
                </motion.g>
              );
            })}
          </g>
        )}

        {showSum && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <text x={W / 2} y={196} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
              sum = {sum}
            </text>
          </motion.g>
        )}

        {showDivide && (
          <AnimatePresence>
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 60} y={204} width={120} height={26} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
              <text x={W / 2} y={221} textAnchor="middle" fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                ÷ {n} = {average}
              </text>
            </motion.g>
          </AnimatePresence>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap && !showCorrect ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap && !showCorrect ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap && !showCorrect ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
