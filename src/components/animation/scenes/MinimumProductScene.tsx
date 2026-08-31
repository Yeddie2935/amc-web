import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * The most negative product doesn't come from grabbing the most negative
 * numbers — an odd count of negative factors is what flips the sign, so one
 * very negative number times the two largest positives can beat three
 * negatives multiplied together. The scene tests both real candidate triples
 * from the actual set on a number line and compares their products directly,
 * spending a beat on the "three negatives" trap before picking the true
 * minimum. Data: { numbers }.
 */
export function MinimumProductScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const numbers = (Array.isArray(data.numbers) ? data.numbers : [-8, -6, -4, 0, 3, 5, 7]).map((v) => Number(v));

  const negatives = [...numbers].filter((n) => n < 0).sort((a, b) => a - b);
  const positives = [...numbers].filter((n) => n > 0).sort((a, b) => b - a);
  const threeNeg = negatives.slice(0, 3);
  const threeNegProduct = threeNeg.reduce((a, b) => a * b, 1);
  const bestMix = [negatives[0], positives[0], positives[1]];
  const bestMixProduct = bestMix.reduce((a, b) => a * b, 1);

  const winner = bestMixProduct < threeNegProduct ? bestMix : threeNeg;
  const winnerProduct = Math.min(bestMixProduct, threeNegProduct);
  const answerOk = problem.shortAnswer == null || String(winnerProduct) === String(problem.shortAnswer).trim().replace(/[−–—]/g, "-");
  const failure = !answerOk ? `computed ${winnerProduct}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[−–—]/g, "-")) === threeNegProduct);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showBest = step >= 2 || isFinal;

  const W = 300;
  const H = 170;
  const x0 = 20;
  const x1 = 280;
  const scaleMin = -9;
  const scaleMax = 8;
  const px = (v: number) => x0 + ((v - scaleMin) / (scaleMax - scaleMin)) * (x1 - x0);

  const caption = isFinal
    ? `${winner.join(" × ")} = ${winnerProduct}`
    : showBest
    ? `${bestMix.join(" × ")} = ${bestMixProduct}, more negative than ${threeNegProduct}`
    : showTrap
    ? trapChoice
      ? `three negatives: ${threeNeg.join(" × ")} = ${threeNegProduct} — choice ${trapChoice.label}, tempting but not the smallest`
      : `three negatives multiply to ${threeNegProduct}`
    : `numbers: ${numbers.join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={x0} y1={90} x2={x1} y2={90} stroke="#e2e8f0" strokeWidth={2} />

        {numbers.map((n, i) => {
          const inThreeNeg = showTrap && threeNeg.includes(n);
          const inBestMix = showBest && bestMix.includes(n);
          const color = inBestMix ? WIN : inThreeNeg ? BAD : n < 0 ? IND : "#0d9488";
          return (
            <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={px(n)} cy={90} r={inThreeNeg || inBestMix ? 9 : 6} fill={color} />
              <text x={px(n)} y={75} textAnchor="middle" fontSize="10" fontWeight="800" fill={color} fontFamily={numberFont}>
                {n}
              </text>
            </motion.g>
          );
        })}

        {(showTrap || showBest) && (
          <motion.text x={W / 2} y={130} textAnchor="middle" fontSize="13" fontWeight="800" fill={showBest ? WIN : BAD} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            = {showBest ? bestMixProduct : threeNegProduct}
          </motion.text>
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
