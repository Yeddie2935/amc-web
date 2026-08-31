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
 * An interval's whole-number count depends on the real decimal value of
 * each irrational-looking endpoint, not a rounded guess — the scene marks
 * the true left and right endpoints on a number line, drops in every whole
 * number strictly between them one at a time, and spends a beat on the trap
 * of stopping one short at the top (treating the upper endpoint's floor as
 * excluded, when it's actually still inside the interval).
 * Data: { leftValue, rightValue, leftLabel, rightLabel }.
 */
export function WholeNumberIntervalCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const leftValue = num(data.leftValue, 5 / 3);
  const rightValue = num(data.rightValue, 2 * Math.PI);
  const leftLabel = String(data.leftLabel ?? "5/3");
  const rightLabel = String(data.rightLabel ?? "2π");

  const lo = Math.ceil(leftValue + 1e-9);
  const hi = Math.floor(rightValue - 1e-9);
  const wholes = [];
  for (let n = lo; n <= hi; n++) wholes.push(n);
  const answerOk = problem.shortAnswer == null || String(wholes.length) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${wholes.length}, stored answer is ${problem.shortAnswer}` : "";

  const trapWholes = wholes.filter((n) => n !== hi);
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapWholes.length));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showAll = step >= 2 || isFinal;

  const W = 300;
  const H = 150;
  const x0 = 20;
  const x1 = 280;
  const scaleMin = 0;
  const scaleMax = 7;
  const px = (v: number) => x0 + ((v - scaleMin) / (scaleMax - scaleMin)) * (x1 - x0);
  const revealed = showAll ? wholes : showTrap ? trapWholes : [];

  const caption = isFinal
    ? `${wholes.join(", ")} — that's ${wholes.length} whole numbers`
    : showAll
    ? `all whole numbers strictly between ${leftLabel} and ${rightLabel}`
    : showTrap
    ? trapChoice
      ? `stopping at ${trapWholes[trapWholes.length - 1]} gives only ${trapWholes.length} — choice ${trapChoice.label}, but ${hi} < ${rightLabel} too`
      : `stopping one short gives only ${trapWholes.length}, missing ${hi}`
    : `${leftLabel} ≈ ${leftValue.toFixed(2)}, ${rightLabel} ≈ ${rightValue.toFixed(2)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={x0} y1={90} x2={x1} y2={90} stroke="#e2e8f0" strokeWidth={2} />
        {Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => scaleMin + i).map((t) => (
          <g key={t}>
            <line x1={px(t)} y1={86} x2={px(t)} y2={94} stroke={DIM} strokeWidth={1.2} />
            <text x={px(t)} y={106} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              {t}
            </text>
          </g>
        ))}

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <line x1={px(leftValue)} y1={90} x2={px(rightValue)} y2={90} stroke={IND} strokeWidth={4} strokeLinecap="round" strokeOpacity={0.3} />
          <circle cx={px(leftValue)} cy={90} r={5} fill={IND} />
          <text x={px(leftValue)} y={70} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
            {leftLabel}
          </text>
          <circle cx={px(rightValue)} cy={90} r={5} fill={IND} />
          <text x={px(rightValue)} y={70} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
            {rightLabel}
          </text>
        </motion.g>

        {revealed.map((n, i) => {
          const isMissingInTrap = showTrap && n === hi;
          return (
            <motion.g key={n} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.12 }}>
              <circle cx={px(n)} cy={90} r={7} fill={WIN} />
              <text x={px(n)} y={128} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {n}
              </text>
            </motion.g>
          );
        })}
        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <circle cx={px(hi)} cy={90} r={7} fill="none" stroke={BAD} strokeWidth={2} strokeDasharray="3 2" />
            <text x={px(hi)} y={128} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              {hi}?
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
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
