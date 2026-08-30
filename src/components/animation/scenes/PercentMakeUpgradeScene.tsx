import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A shooting percentage that rises after a few more attempts: the makes at
 * each checkpoint are found from the percentage and total attempts, and the
 * makes among the new attempts are the difference between checkpoints. Five
 * beats: (0) the first batch of attempts and its percentage; (1) the makes
 * that implies; (2) the trap — subtracting the two percentages directly;
 * (3) the new attempts and the updated makes; (4) the difference and badge.
 * Data: { firstAttempts, firstPercent, addedAttempts, finalPercent }.
 */
export function PercentMakeUpgradeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const firstAttempts = Math.round(num(data.firstAttempts, 20));
  const firstPercent = num(data.firstPercent, 55);
  const addedAttempts = Math.round(num(data.addedAttempts, 5));
  const finalPercent = num(data.finalPercent, 56);
  if (firstAttempts <= 0 || addedAttempts <= 0) return null;

  const totalAttempts = firstAttempts + addedAttempts;
  const made1 = Math.round((firstPercent / 100) * firstAttempts);
  const made2 = Math.round((finalPercent / 100) * totalAttempts);
  const addedMade = made2 - made1;

  const naiveTrap = finalPercent - firstPercent;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(naiveTrap));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showMade1 = step >= 1;
  const showTrap = step >= 2 && !isFinal;
  const showSecond = step >= 3 || isFinal;

  const greenCount = showSecond ? made2 : showMade1 ? made1 : 0;
  const shownAttempts = showSecond ? totalAttempts : firstAttempts;

  const caption = isFinal
    ? `${made2} − ${made1} = ${addedMade} of the last ${addedAttempts}`
    : step === 0
    ? `${firstAttempts} shots taken, ${firstPercent}% made`
    : showTrap
    ? "the two percentages are of different totals"
    : showSecond
    ? `after ${addedAttempts} more (${totalAttempts} total), she's at ${finalPercent}%`
    : `${firstPercent}% × ${firstAttempts} = ${made1} made`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", maxWidth: 320 }}>
        {Array.from({ length: shownAttempts }).map((_, i) => {
          const made = i < greenCount;
          const isNew = i >= firstAttempts;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 16, delay: (isNew ? i - firstAttempts : i) * 0.03 }}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: made ? WIN : "#e2e8f0",
                border: `1.4px solid ${made ? WIN : "#94a3b8"}`,
                boxShadow: isNew ? `0 0 0 1.5px ${MARK}55` : "none",
              }}
            />
          );
        })}
      </div>

      <div style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, color: DIM }}>
        {showSecond ? `${made2} made of ${totalAttempts} = ${finalPercent}%` : `${made1} made of ${firstAttempts} = ${firstPercent}%`}
      </div>

      <AnimatePresence>
        {showTrap && (
          <motion.div
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 300 }}
          >
            {finalPercent}% − {firstPercent}% = {naiveTrap}{trap ? ` traps you at choice ${trap.label}` : ""}, but that's percentage points, not shots made.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
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
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
