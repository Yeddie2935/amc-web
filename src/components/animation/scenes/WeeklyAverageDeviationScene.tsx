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
 * Several weeks of known hours, one week missing, all needing to average a
 * target. Every week's bar is measured against a fixed target line rather
 * than against each other — each known week gets a signed deviation chip
 * (over or under the line) — and since the deviations across all weeks must
 * net to zero for the average to land exactly on target, the missing week's
 * required deviation (and so its hours) is whatever cancels the running
 * total of the deviations seen so far.
 * Data: { knownHours:[8,11,7,12,10], target, weekCount }.
 */
export function WeeklyAverageDeviationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const knownHours = (Array.isArray(data.knownHours) ? data.knownHours : [8, 11, 7, 12, 10]).map((v) => Math.max(0, num(v, 0)));
  const target = Math.max(1, num(data.target, 10));
  const weekCount = Math.max(knownHours.length + 1, Math.round(num(data.weekCount, 6)));

  const totalNeeded = target * weekCount;
  const knownSum = knownHours.reduce((a, b) => a + b, 0);
  const finalWeek = totalNeeded - knownSum;
  const netDeviation = knownHours.reduce((a, b) => a + (b - target), 0);

  const matches = problem.shortAnswer == null || String(finalWeek) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${totalNeeded} − ${knownSum} = ${finalWeek}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showDev = step >= 1;
  const revealedWeeks = showDev ? Math.min(knownHours.length, step) : 0;
  const showFinal = step >= lastStep - 1;
  const isFinal = step >= lastStep;

  const runningDev = knownHours.slice(0, revealedWeeks).reduce((a, b) => a + (b - target), 0);

  // ---- geometry ----
  const W = 320;
  const H = 210;
  const baseY = 170;
  const padT = 16;
  const maxVal = Math.max(target, ...knownHours, finalWeek) * 1.25;
  const sy = (v: number) => baseY - (v / maxVal) * (baseY - padT);
  const slotW = (W - 24) / weekCount;
  const barW = slotW * 0.62;
  const xOf = (i: number) => 12 + i * slotW + (slotW - barW) / 2;

  const caption = isFinal
    ? `final week: ${target} + ${-netDeviation} = ${finalWeek} hours`
    : showFinal
    ? `the deviations sum to ${netDeviation}, so week ${weekCount} must supply ${-netDeviation} to cancel it`
    : showDev && revealedWeeks > 0
    ? `week ${revealedWeeks}: ${knownHours[revealedWeeks - 1]} is ${knownHours[revealedWeeks - 1] - target >= 0 ? "+" : ""}${knownHours[revealedWeeks - 1] - target} from target — running total ${runningDev >= 0 ? "+" : ""}${runningDev}`
    : `target ${target} hrs/week for ${weekCount} weeks = ${totalNeeded} hours total`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {/* target line */}
        <line x1={8} x2={W - 8} y1={sy(target)} y2={sy(target)} stroke={IND} strokeWidth={1.4} strokeDasharray="4 3" />
        <text x={10} y={sy(target) - 6} fontSize="9" fontWeight="800" fill={IND} fontFamily={numberFont}>
          target {target}
        </text>

        <line x1={12} x2={W - 12} y1={baseY} y2={baseY} stroke={INK} strokeWidth={1.4} />

        {/* known weeks */}
        {knownHours.map((h, i) => {
          const show = i < revealedWeeks || showFinal;
          const dev = h - target;
          const color = dev >= 0 ? WIN : BAD;
          return (
            <g key={i}>
              <AnimatePresence>
                {show && (
                  <motion.rect
                    x={xOf(i)}
                    width={barW}
                    fill={color}
                    fillOpacity={0.7}
                    stroke={color}
                    strokeWidth={1.3}
                    initial={{ y: baseY, height: 0 }}
                    animate={{ y: sy(h), height: baseY - sy(h) }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                )}
              </AnimatePresence>
              {show && (
                <text x={xOf(i) + barW / 2} y={sy(h) - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={numberFont}>
                  {dev >= 0 ? "+" : ""}
                  {dev}
                </text>
              )}
              <text x={xOf(i) + barW / 2} y={baseY + 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                wk {i + 1}
              </text>
            </g>
          );
        })}

        {/* final week */}
        <AnimatePresence>
          {showFinal && (
            <motion.g key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.rect
                x={xOf(weekCount - 1)}
                width={barW}
                fill={isFinal ? IND : "#f8fafc"}
                fillOpacity={isFinal ? 0.75 : 1}
                stroke={IND}
                strokeWidth={1.6}
                strokeDasharray={isFinal ? undefined : "4 3"}
                initial={{ y: baseY, height: 0 }}
                animate={{ y: sy(isFinal ? finalWeek : target), height: baseY - sy(isFinal ? finalWeek : target) }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              />
              <motion.text
                x={xOf(weekCount - 1) + barW / 2}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
                initial={{ y: sy(target) - 6 }}
                animate={{ y: sy(isFinal ? finalWeek : target) - 6 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                {isFinal ? finalWeek : "?"}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>
        {!showFinal && (
          <>
            <rect x={xOf(weekCount - 1)} y={sy(target)} width={barW} height={baseY - sy(target)} fill="none" stroke="#cbd5e1" strokeWidth={1.2} strokeDasharray="3 3" />
            <text x={xOf(weekCount - 1) + barW / 2} y={sy(target) - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
              ?
            </text>
          </>
        )}
        <text x={xOf(weekCount - 1) + barW / 2} y={baseY + 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
          wk {weekCount}
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
          color: isFinal ? "#166534" : "#4338ca",
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
