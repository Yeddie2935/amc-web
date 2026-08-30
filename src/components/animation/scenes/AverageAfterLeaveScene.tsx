import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMBER = "#b45309";

/**
 * A row of equal-height columns represents the group's shared average.
 * One column is revealed to be shorter (the person who leaves), and the
 * remaining columns rise to the new average once that person's share is
 * removed from the pool — a beat is spent on the trap of dividing by the
 * original headcount instead of the smaller one left behind.
 * Data: { peopleCount, avgBefore, leaverAge }.
 */
export function AverageAfterLeaveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(3, Math.round(num(data.peopleCount, 5)));
  const avgBefore = Math.max(1, num(data.avgBefore, 30));
  const leaverAge = Math.max(0, num(data.leaverAge, 18));

  const total = n * avgBefore;
  const leaverIdx = Math.floor(n / 2);
  const remainingCount = n - 1;
  const newTotal = total - leaverAge;
  const newAvg = newTotal / remainingCount;

  const matches = problem.shortAnswer == null || String(newAvg) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${newTotal}/${remainingCount} = ${newAvg}, stored answer is ${problem.shortAnswer}` : "";

  const trapAvg = Math.round(newTotal / n);
  const trapChoice = trapAvg !== newAvg ? (problem.choices ?? []).find((c) => c.text.trim() === String(trapAvg)) : null;

  const lastStep = totalSteps - 1;
  const showLeaverHighlighted = step >= 1;
  const showLeaverExit = step >= 2;
  const showTrap = step === 3;
  const showRedistribute = step >= 4;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `${newTotal} ÷ ${remainingCount} = ${newAvg}`
    : showRedistribute
    ? `the remaining ${remainingCount} rise to average ${newAvg}`
    : showTrap && trapChoice
    ? `${newTotal}÷${n} ≈ ${trapAvg} — choice ${trapChoice.label}, but only ${remainingCount} people remain`
    : showLeaverExit
    ? `total drops to ${total} − ${leaverAge} = ${newTotal}`
    : showLeaverHighlighted
    ? `this person is actually ${leaverAge}`
    : `${n} people, average age ${avgBefore}`;

  const note = failure || "";

  // ---- geometry ----
  const W = 300;
  const H = 190;
  const baseY = 160;
  const maxVal = Math.max(avgBefore, newAvg, leaverAge) * 1.25;
  const colGap = (W - 30) / n;
  const colW = colGap * 0.6;
  const xOf = (i: number) => 15 + i * colGap + (colGap - colW) / 2;
  const sy = (v: number) => baseY - (v / maxVal) * (baseY - 24);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={10} x2={W - 10} y1={baseY} y2={baseY} stroke={INK} strokeWidth={1.4} />

        {Array.from({ length: n }).map((_, i) => {
          const isLeaver = i === leaverIdx;
          if (isLeaver && showLeaverExit) return null;
          const height = isLeaver && showLeaverHighlighted ? leaverAge : showRedistribute ? newAvg : avgBefore;
          const color = isLeaver && showLeaverHighlighted ? AMBER : showRedistribute ? WIN : IND;
          return (
            <motion.g key={i}>
              <motion.rect
                x={xOf(i)}
                width={colW}
                fill={color}
                fillOpacity={0.72}
                stroke={color}
                strokeWidth={1.4}
                initial={{ y: baseY, height: 0 }}
                animate={{ y: sy(height), height: baseY - sy(height) }}
                exit={{ opacity: 0, x: xOf(i) + 60 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.05 }}
              />
              <text x={xOf(i) + colW / 2} y={sy(height) - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={numberFont}>
                {isLeaver && !showLeaverHighlighted && !showRedistribute ? "?" : Math.round(height)}
              </text>
            </motion.g>
          );
        })}

        {/* trap line: what the average would be dividing by the original headcount */}
        <AnimatePresence>
          {showTrap && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={10} x2={W - 10} y1={sy(trapAvg)} y2={sy(trapAvg)} stroke={BAD} strokeWidth={1.4} strokeDasharray="4 3" />
              <text x={W - 12} y={sy(trapAvg) - 4} textAnchor="end" fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                ÷{n} → {trapAvg}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* total pool readout */}
        <text x={12} y={16} fontSize="9.5" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
          total: {showLeaverExit ? newTotal : total}
        </text>
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
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
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
