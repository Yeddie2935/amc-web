import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const TRACK = "#e2e8f0";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// A single number is cut into equal slices sized to the coarsest percent
// both the given percent and the target percent are a whole number of, so
// the given fact reads off as "this many slices = this value," and the
// target percent is just a different count of the same slices.
// Data: { givenPercent, givenValue, targetPercent }.
export function PercentUnitSliceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const givenPercent = num(data.givenPercent, 20);
  const givenValue = num(data.givenValue, 12);
  const targetPercent = num(data.targetPercent, 30);

  const unit = gcd(gcd(givenPercent, targetPercent), 100) || 1;
  const N = 100 / unit;
  const givenSlices = givenPercent / unit;
  const targetSlices = targetPercent / unit;
  const perSlice = givenValue / givenSlices;
  const whole = perSlice * N;
  const targetValue = perSlice * targetSlices;

  const last = totalSteps - 1;
  const showWhole = step >= 1;
  const showTarget = step >= 2;
  const isFinal = step >= last;

  const barW = 280;
  const sliceW = barW / N;
  const barX = 10;
  const barY = 40;
  const barH = 30;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 300 90`} width="100%" style={{ maxWidth: 300 }}>
        {Array.from({ length: N }).map((_, i) => {
          const isGiven = i < givenSlices;
          const isTarget = showTarget && i < targetSlices;
          const revealed = showWhole || isGiven;
          const fill = isTarget ? GREEN : isGiven ? INDIGO : revealed ? "#c7d2fe" : TRACK;
          return (
            <motion.g key={i} initial={{ opacity: 0, scaleY: 0.4 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.04 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
              <rect x={barX + i * sliceW + 1} y={barY} width={sliceW - 2} height={barH} rx={3} fill={fill} stroke="#94a3b8" strokeWidth={0.8} />
              <AnimatePresence>
                {revealed && (
                  <motion.text
                    x={barX + i * sliceW + sliceW / 2}
                    y={barY + barH / 2 + 4}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="800"
                    fill={isGiven || isTarget ? "#fff" : NAVY}
                    fontFamily={FONT}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {perSlice}
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          );
        })}
        <text x={150} y={30} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#64748b" fontFamily={FONT}>
          {N} equal {unit}% pieces
        </text>
        <AnimatePresence>
          {isFinal ? (
            <motion.text key="fin" x={150} y={86} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {targetSlices} × {perSlice} = {targetValue}
            </motion.text>
          ) : showTarget ? (
            <motion.text key="tgt" x={150} y={86} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {targetPercent}% = {targetSlices} pieces = {targetSlices} × {perSlice} = {targetValue}
            </motion.text>
          ) : showWhole ? (
            <motion.text key="whole" x={150} y={86} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={INDIGO} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {N} × {perSlice} = {whole}
            </motion.text>
          ) : (
            <motion.text key="given" x={150} y={86} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={INDIGO} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {givenPercent}% = {givenSlices} pieces = {givenValue}, so 1 piece = {perSlice}
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
