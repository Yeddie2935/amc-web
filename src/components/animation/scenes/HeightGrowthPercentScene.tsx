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
 * A final height that's "120% of the original" has to be divided by 1.2 to
 * recover the start, not have 20% subtracted from the end — those give
 * different original heights. The scene grows two matching bars from a
 * shared starting height, has to survive the trap of reversing the percent
 * by subtraction, then correctly divides to find the true original and
 * hands half of the real inch growth to the second bar.
 * Data: { finalHeight, growPercent, shareFactor, growerName, otherName }.
 */
export function HeightGrowthPercentScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const finalHeight = Math.max(1, num(data.finalHeight, 60));
  const growPercent = Math.max(1, num(data.growPercent, 20));
  const shareFactor = Math.max(0.01, num(data.shareFactor, 0.5));
  const otherName = String(data.otherName ?? "Ara");
  const growerName = String(data.growerName ?? "Shea");

  const original = finalHeight / (1 + growPercent / 100);
  const grown = finalHeight - original;
  const otherGrown = grown * shareFactor;
  const otherFinal = original + otherGrown;
  const answerOk = problem.shortAnswer == null || String(otherFinal) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${otherFinal}, stored answer is ${problem.shortAnswer}` : "";

  const trapOriginal = finalHeight * (1 - growPercent / 100);
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapOriginal));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showGrowth = step >= 2 || isFinal;

  const W = 300;
  const H = 200;
  const baseY = 170;
  const unit = 2.4;
  const barW = 46;

  const caption = isFinal
    ? `${original} + ${otherGrown} = ${otherFinal}`
    : showGrowth
    ? `${growerName} grew ${grown}, so ${otherName} grew ${shareFactor} × ${grown} = ${otherGrown}`
    : showTrap
    ? trapChoice
      ? `${finalHeight} × ${1 - growPercent / 100} = ${trapOriginal} — choice ${trapChoice.label}, but that subtracts the percent instead of dividing it out`
      : `${finalHeight} × ${1 - growPercent / 100} = ${trapOriginal} is the wrong way to reverse a percent increase`
    : `${growerName} is now ${finalHeight}, which is ${100 + growPercent}% of the original height`;

  const origH = original * unit;
  const finalH = finalHeight * unit;
  const otherH = (showGrowth ? otherFinal : original) * unit;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={20} y1={baseY} x2={280} y2={baseY} stroke="#e2e8f0" strokeWidth={2} />

        <g>
          <motion.rect x={70} y={baseY - finalH} width={barW} height={finalH} rx={4} fill={IND} fillOpacity={0.8} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ type: "spring", stiffness: 140, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
          {!isFinal && !showGrowth && (
            <motion.rect x={70} y={baseY - origH} width={barW} height={finalH - origH} fill={showTrap ? BAD : "#e2e8f0"} fillOpacity={0.5} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
          )}
          <text x={70 + barW / 2} y={baseY - finalH - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
            {finalHeight}
          </text>
          <text x={70 + barW / 2} y={baseY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
            {growerName}
          </text>
        </g>

        <g>
          <motion.rect x={180} y={baseY - otherH} width={barW} height={otherH} rx={4} fill={showGrowth || isFinal ? WIN : "#cbd5e1"} fillOpacity={0.8} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ type: "spring", stiffness: 140, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
          <text x={180 + barW / 2} y={baseY - otherH - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={showGrowth || isFinal ? WIN : DIM} fontFamily={numberFont}>
            {showGrowth ? otherFinal : "?"}
          </text>
          <text x={180 + barW / 2} y={baseY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
            {otherName}
          </text>
        </g>

        {step >= 1 && (
          <motion.line x1={20} y1={baseY - (showTrap ? trapOriginal * unit : origH)} x2={280} y2={baseY - (showTrap ? trapOriginal * unit : origH)} stroke={showTrap ? BAD : IND} strokeWidth={1.6} strokeDasharray="4 3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        )}
        {step >= 1 && (
          <text x={24} y={baseY - (showTrap ? trapOriginal * unit : origH) - 4} fontSize="9" fontWeight="800" fill={showTrap ? BAD : IND} fontFamily={numberFont}>
            original ≈ {showTrap ? trapOriginal : original}
          </text>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
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
