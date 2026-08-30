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
 * An investment loses a percent one year, then gains a percent of the
 * *reduced* amount the next. The scene grows a single dollar-stack bar
 * through both moves against a fixed reference line at the original amount,
 * so the final gap above or below that line is the real net change — and
 * spends a beat on the trap of just subtracting the two percents (which
 * lands on an answer choice of its own).
 * Data: { initial, lossPercent, gainPercent }.
 */
export function InvestmentLossGainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const initial = Math.max(1, num(data.initial, 100));
  const lossPercent = Math.max(0, num(data.lossPercent, 15));
  const gainPercent = Math.max(0, num(data.gainPercent, 20));

  const afterLoss = initial * (1 - lossPercent / 100);
  const afterGain = afterLoss * (1 + gainPercent / 100);
  const netChange = afterGain - initial;
  const netPercent = (netChange / initial) * 100;
  const netStr = netPercent >= 0 ? `${Number(netPercent.toFixed(4))}% gain` : `${Number(Math.abs(netPercent).toFixed(4))}% loss`;

  const matches = problem.shortAnswer == null || netStr === String(problem.shortAnswer);
  const failure = !matches ? `check failed: net change ${netStr}, stored answer is ${problem.shortAnswer}` : "";

  const naivePercent = gainPercent - lossPercent;
  const naiveStr = naivePercent >= 0 ? `${naivePercent}% gain` : `${Math.abs(naivePercent)}% loss`;
  const trapChoice = (problem.choices ?? []).find((c) => c.text.replace(/\s/g, "") === naiveStr.replace(/\s/g, ""));

  const lastStep = totalSteps - 1;
  const showLoss = step >= 1;
  const showGain = step >= 2;
  const showTrap = step === 3;
  const isFinal = step >= lastStep;

  const heightNow = showGain ? afterGain : showLoss ? afterLoss : initial;

  // ---- geometry ----
  const W = 220;
  const H = 220;
  const baseY = 190;
  const barX = 80;
  const barW = 60;
  const maxVal = Math.max(initial, afterGain) * 1.2;
  const sy = (v: number) => baseY - (v / maxVal) * (baseY - 20);
  const barH = baseY - sy(heightNow);

  const caption = isFinal
    ? `net change: ${netStr}`
    : showTrap
    ? trapChoice
      ? `${gainPercent}% − ${lossPercent}% = ${naiveStr} — choice ${trapChoice.label}, but percents don't just subtract`
      : `${gainPercent}% − ${lossPercent}% = ${naiveStr} isn't how percent changes combine`
    : showGain
    ? `$${afterLoss} × 1.${String(gainPercent).padStart(2, "0")} = $${afterGain}`
    : showLoss
    ? `$${initial} × 0.${String(100 - lossPercent).padStart(2, "0")} = $${afterLoss}`
    : `Tammy starts with $${initial}`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 240 }}>
        {/* reference line at the original amount */}
        <line x1={30} x2={W - 20} y1={sy(initial)} y2={sy(initial)} stroke={DIM} strokeWidth={1.4} strokeDasharray="4 3" />
        <text x={28} y={sy(initial) + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
          ${initial}
        </text>

        <line x1={barX - 10} y1={baseY} x2={barX + barW + 10} y2={baseY} stroke={INK} strokeWidth={1.4} />

        <motion.rect
          x={barX}
          width={barW}
          fill={isFinal ? (netPercent >= 0 ? WIN : BAD) : showGain ? WIN : showLoss ? BAD : IND}
          fillOpacity={0.75}
          stroke={isFinal ? (netPercent >= 0 ? WIN : BAD) : showGain ? WIN : showLoss ? BAD : IND}
          strokeWidth={1.6}
          initial={false}
          animate={{ y: baseY - barH, height: barH }}
          transition={{ type: "spring", stiffness: 190, damping: 20 }}
        />

        <motion.text
          x={barX + barW / 2}
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fill={INK}
          fontFamily={numberFont}
          initial={false}
          animate={{ y: baseY - barH - 8 }}
          transition={{ type: "spring", stiffness: 190, damping: 20 }}
        >
          ${Number(heightNow.toFixed(2))}
        </motion.text>

        {/* the gap between final value and the reference line */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <line x1={W - 26} x2={W - 26} y1={sy(initial)} y2={sy(afterGain)} stroke={netPercent >= 0 ? WIN : BAD} strokeWidth={2} />
              <text x={W - 22} y={(sy(initial) + sy(afterGain)) / 2 + 3} fontSize="9.5" fontWeight="800" fill={netPercent >= 0 ? WIN : BAD} fontFamily={numberFont}>
                {netPercent >= 0 ? "+" : "−"}${Math.abs(Number(netChange.toFixed(2)))}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
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
