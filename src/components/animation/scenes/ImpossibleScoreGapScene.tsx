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
 * A score of 5×correct + 1×blank only lands on certain integers near the
 * top, so the scene climbs down from the real perfect score one substitution
 * at a time (a correct answer swapped for a blank costs exactly 4 points)
 * to find the true next reachable score, spends a beat on the trap of
 * assuming every score below that is also out of reach (when one is reachable
 * a completely different way — zero blanks, one wrong), then tests each real
 * answer choice by actually searching for a valid (correct, blank) pair.
 * Data: { questions, correctPts, blankPts, choices as raw scores derived
 * from problem.choices }.
 */
export function ImpossibleScoreGapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const questions = Math.max(1, Math.round(num(data.questions, 20)));
  const correctPts = Math.max(1, num(data.correctPts, 5));
  const blankPts = Math.max(0, num(data.blankPts, 1));

  const perfect = questions * correctPts;
  const nextDrop = correctPts - blankPts;
  const nextBest = perfect - nextDrop;

  const reachable = (score: number) => {
    for (let c = 0; c <= questions; c++) {
      const remainder = score - c * correctPts;
      if (remainder < 0) continue;
      if (blankPts === 0) {
        if (remainder === 0) return { c, blanks: 0 };
        continue;
      }
      if (remainder % blankPts !== 0) continue;
      const blanks = remainder / blankPts;
      if (c + blanks <= questions) return { c, blanks };
    }
    return null;
  };

  const scoreChoices = (problem.choices ?? []).map((ch) => ({ label: ch.label, value: Number(String(ch.text).trim()) }));
  const evaluated = scoreChoices.map((c) => ({ ...c, hit: reachable(c.value) }));
  const impossible = evaluated.find((c) => !c.hit) ?? evaluated[0];
  const answerOk = problem.answer == null || impossible.label === problem.answer;
  const failure = evaluated.filter((c) => !c.hit).length !== 1 ? `${evaluated.filter((c) => !c.hit).length} choices came back impossible, expected exactly 1` : !answerOk ? `impossible choice computed as ${impossible.label}, stored answer is ${problem.answer}` : "";

  const nearMissChoice = evaluated
    .filter((c) => c.value < nextBest && c.hit)
    .reduce((best, c) => (!best || c.value > best.value ? c : best), null as (typeof evaluated)[number] | null);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showNextBest = step >= 1;
  const showTrap = step === 2 && !isFinal;
  const showAll = isFinal;

  const W = 300;
  const H = 210;
  const barX0 = 30;
  const barX1 = 270;
  const y0 = 40;

  const posOf = (v: number) => barX0 + ((v - 88) / (perfect - 88)) * (barX1 - barX0);

  const caption = isFinal
    ? `only ${questions * correctPts - impossible.value} points below perfect, but no (correct, blank) pair reaches ${impossible.value}`
    : showTrap
    ? nearMissChoice
      ? `${nearMissChoice.value} looks close to the gap too, but ${nearMissChoice.hit ? `${nearMissChoice.hit.c} correct + ${nearMissChoice.hit.blanks} blank reaches it` : "it's also unreachable"}`
      : `not every score below ${nextBest} is unreachable — check each one directly`
    : showNextBest
    ? `${questions - 1} × ${correctPts} + ${blankPts} = ${nextBest} is the next reachable score below perfect`
    : `${questions} × ${correctPts} = ${perfect} is the top score`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={barX0} y1={y0} x2={barX1} y2={y0} stroke="#e2e8f0" strokeWidth={4} strokeLinecap="round" />

        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx={posOf(perfect)} cy={y0} r={7} fill={IND} />
          <text x={posOf(perfect)} y={y0 - 14} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
            {perfect}
          </text>
        </motion.g>

        {showNextBest && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={posOf(nextBest)} cy={y0} r={7} fill={WIN} />
            <text x={posOf(nextBest)} y={y0 - 14} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {nextBest}
            </text>
            <line x1={posOf(nextBest) + 8} y1={y0 + 16} x2={posOf(perfect) - 8} y2={y0 + 16} stroke={BAD} strokeWidth={2} strokeDasharray="4 3" />
            <text x={(posOf(nextBest) + posOf(perfect)) / 2} y={y0 + 30} textAnchor="middle" fontSize="9" fontWeight="800" fill={BAD}>
              gap: no scores here
            </text>
          </motion.g>
        )}

        {(showTrap || showAll) &&
          evaluated.map((c, i) => {
            const y = 90 + i * 22;
            const impossibleHere = !c.hit;
            return (
              <motion.g key={c.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.12 }}>
                <rect x={40} y={y} width={220} height={18} rx={5} fill={impossibleHere ? "#fee2e2" : "#dcfce7"} stroke={impossibleHere ? BAD : WIN} strokeWidth={1.2} />
                <text x={50} y={y + 13} fontSize="9.5" fontWeight="800" fill={impossibleHere ? BAD : WIN} fontFamily={numberFont}>
                  {c.label}: {c.value} {impossibleHere ? "✗ no valid pair" : `✓ ${c.hit!.c}c + ${c.hit!.blanks}b`}
                </text>
              </motion.g>
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
