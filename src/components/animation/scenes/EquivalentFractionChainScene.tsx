import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * A chain of three equivalent fractions, one term unknown in two of them.
 * Since all three fractions are equal, their bars share the exact same
 * shaded proportion — the scene draws all three bars at identical width with
 * identical shading, proving equivalence visually, and finds each unknown as
 * a scale factor applied to the known partner rather than by guessing. A
 * beat is spent on the trap of adding the two *given* numbers instead of the
 * two solved unknowns.
 * Data: { baseNum, baseDen, midDen, farNum }.
 */
export function EquivalentFractionChainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const baseNum = Math.max(1, num(data.baseNum, 3));
  const baseDen = Math.max(1, num(data.baseDen, 5));
  const midDen = Math.max(1, num(data.midDen, 45));
  const farNum = Math.max(1, num(data.farNum, 60));

  const ratio = baseNum / baseDen;
  const midScale = midDen / baseDen;
  const M = baseNum * midScale;
  const farScale = farNum / baseNum;
  const N = baseDen * farScale;
  const sum = M + N;

  const mIsInt = Number.isInteger(M);
  const nIsInt = Number.isInteger(N);
  const matches = problem.shortAnswer == null || String(sum) === String(problem.shortAnswer);
  const failure = !mIsInt || !nIsInt ? `check failed: M=${M}, N=${N} must both be whole numbers` : !matches ? `check failed: ${M} + ${N} = ${sum}, stored answer is ${problem.shortAnswer}` : "";

  const naiveSum = midDen + farNum;
  const trapChoice = (problem.choices ?? []).find((c) => parseChoice(c.text) === naiveSum);

  const lastStep = totalSteps - 1;
  const showMid = step >= 1;
  const showFar = step >= 2;
  const showTrap = step === 3;
  const isFinal = step >= lastStep;

  // ---- geometry: three equal-width bars, identical shaded proportion ----
  const W = 320;
  const barW = 260;
  const barH = 26;
  const barX = 30;
  const rowGap = 54;
  const rows = [
    { y: 30, num: String(baseNum), den: String(baseDen), show: true, color: INK },
    { y: 30 + rowGap, num: String(M), den: String(midDen), show: showMid, color: IND },
    { y: 30 + rowGap * 2, num: String(farNum), den: String(N), show: showFar, color: TEAL },
  ];
  const H = 30 + rowGap * 2 + 40;
  const shadedW = ratio * barW;

  const caption = isFinal
    ? `M + N = ${M} + ${N} = ${sum}`
    : showTrap
    ? trapChoice
      ? `${midDen} + ${farNum} = ${naiveSum} — choice ${trapChoice.label}, but those are the given numbers, not M and N`
      : `${midDen} + ${farNum} = ${naiveSum} isn't M + N — those are the given numbers`
    : showFar
    ? `${farNum} is ${farScale}× the numerator 3, so N = ${baseDen} × ${farScale} = ${N}`
    : showMid
    ? `45 is ${midScale}× the denominator 5, so M = ${baseNum} × ${midScale} = ${M}`
    : `${baseNum}/${baseDen} is the base ratio every fraction in the chain shares`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {rows.map((r, i) => (
          <AnimatePresence key={i}>
            {r.show && (
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
                <text x={barX} y={r.y - 8} fontSize="12" fontWeight="800" fill={r.color} fontFamily={numberFont}>
                  {r.num} / {r.den}
                </text>
                <rect x={barX} y={r.y} width={barW} height={barH} rx={4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.2} />
                <motion.rect
                  x={barX}
                  y={r.y}
                  width={shadedW}
                  height={barH}
                  rx={4}
                  fill={r.color}
                  fillOpacity={0.75}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.15 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left" }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        ))}
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
