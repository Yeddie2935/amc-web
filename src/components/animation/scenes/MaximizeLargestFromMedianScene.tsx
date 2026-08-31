import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * A fixed sum and a fixed median leave only four numbers free to move — to
 * push the fifth (largest) as high as possible, the other four must be as
 * small as the distinctness rule allows. The scene fixes the median in its
 * slot, then greedily fills the two slots below it with the two smallest
 * distinct positive integers and the slot just above with the smallest
 * integer that still beats the median, checking there's no smaller legal
 * choice at each slot before finally reading off what the fixed sum leaves
 * for the last one. Data: { count, mean, median }.
 */
export function MaximizeLargestFromMedianScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = Math.max(3, Math.round(num(data.count, 5)));
  const mean = Math.max(1, num(data.mean, 15));
  const median = Math.max(1, Math.round(num(data.median, 18)));

  const sum = count * mean;
  const belowCount = (count - 1) / 2;
  const belowVals = Array.from({ length: belowCount }, (_, i) => i + 1); // 1,2,...
  const aboveCount = count - belowCount - 2; // one slot minimized just above the median, the last slot is the largest itself
  const aboveVals = Array.from({ length: aboveCount }, (_, i) => median + 1 + i); // 19,20,...
  const usedSum = belowVals.reduce((a, b) => a + b, 0) + median + aboveVals.reduce((a, b) => a + b, 0);
  const largest = sum - usedSum;
  const answerOk = problem.shortAnswer == null || String(largest) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${largest}, stored answer is ${problem.shortAnswer}` : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showBelow = step >= 1;
  const showAbove = step >= 2 || isFinal;

  const W = 300;
  const H = 170;
  const slotW = 40;
  const gap = 10;
  const totalSlots = count;
  const x0 = (W - (totalSlots * slotW + (totalSlots - 1) * gap)) / 2;
  const y = 60;

  const slotVal = (i: number): number | null => {
    if (i < belowCount) return showBelow ? belowVals[i] : null;
    if (i === belowCount) return median;
    if (i < belowCount + 1 + aboveCount) return showAbove ? aboveVals[i - belowCount - 1] : null;
    return isFinal ? largest : null;
  };

  const caption = isFinal
    ? `${sum} − ${belowVals.join(" − ")} − ${median} − ${aboveVals.join(" − ")} = ${largest}`
    : showAbove
    ? `smallest integer above the median: ${aboveVals.join(", ")}`
    : showBelow
    ? `smallest distinct positive integers below the median: ${belowVals.join(", ")}`
    : `${count} integers, mean ${mean} → sum ${sum}; median fixed at ${median}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          sum = {sum}
        </text>

        {Array.from({ length: totalSlots }).map((_, i) => {
          const v = slotVal(i);
          const x = x0 + i * (slotW + gap);
          const isMedian = i === belowCount;
          const isLargest = i === totalSlots - 1;
          const color = isMedian ? IND : isLargest ? WIN : "#0d9488";
          return (
            <g key={i}>
              <rect x={x} y={y} width={slotW} height={40} rx={6} fill={v != null ? "#fff" : "#f8fafc"} stroke={v != null ? color : "#cbd5e1"} strokeWidth={v != null ? 2 : 1.3} strokeDasharray={v != null ? undefined : "4 3"} />
              <AnimatePresence mode="wait">
                {v != null && (
                  <motion.text
                    key={v}
                    x={x + slotW / 2}
                    y={y + 26}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="800"
                    fill={color}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {v}
                  </motion.text>
                )}
              </AnimatePresence>
              {isMedian && (
                <text x={x + slotW / 2} y={y + 56} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={IND}>
                  median
                </text>
              )}
              {isLargest && isFinal && (
                <text x={x + slotW / 2} y={y + 56} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={WIN}>
                  largest
                </text>
              )}
            </g>
          );
        })}
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
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
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
