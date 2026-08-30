import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * Two swim sessions (old vs. new) each divide minutes by laps into a pace;
 * the paces are then subtracted for the improvement.
 * Data: { oldLaps, oldMinutes, newLaps, newMinutes }.
 */
export function LapPaceCompareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const oldLaps = num(data.oldLaps, 10);
  const oldMinutes = num(data.oldMinutes, 25);
  const newLaps = num(data.newLaps, 12);
  const newMinutes = num(data.newMinutes, 24);
  const oldPace = oldMinutes / oldLaps;
  const newPace = newMinutes / newLaps;
  const improvement = oldPace - newPace;
  const isFinal = step >= totalSteps - 1;
  const showOldPace = step >= 1;
  const showNewPace = step >= 2;
  const showDiff = isFinal;

  const W = 460;
  const barMax = 130;
  const scale = barMax / oldPace;

  const row = (label: string, laps: number, minutes: number, pace: number, color: string, y: number, showPace: boolean) => (
    <g transform={`translate(0, ${y})`}>
      <text x={20} y={5} fontSize="12" fontWeight="850" fill={INK} fontFamily={FONT}>{label}</text>
      <text x={20} y={24} fontSize="11" fontWeight="700" fill={DIM} fontFamily={FONT}>
        {laps} laps in {minutes} min
      </text>
      <rect x={150} y={-14} width={barMax + 4} height="22" rx="6" fill="#f1f5f9" />
      <AnimatePresence>
        {showPace && (
          <motion.rect
            key="bar"
            x={150}
            y={-14}
            height="22"
            rx="6"
            fill={color}
            initial={{ width: 0 }}
            animate={{ width: pace * scale }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        )}
      </AnimatePresence>
      {showPace && (
        <text x={150 + barMax + 12} y={2} fontSize="13" fontWeight="900" fill={color} fontFamily={FONT}>
          {pace} min/lap
        </text>
      )}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 220`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="16" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0
            ? "Elisa's old and new swim sessions"
            : showDiff
              ? "subtract the paces"
              : showNewPace
                ? "divide minutes by laps for each session"
                : "find the old pace first"}
        </text>

        {row("Before", oldLaps, oldMinutes, oldPace, BLUE, 60, showOldPace)}
        {row("Now", newLaps, newMinutes, newPace, ORANGE, 110, showNewPace)}

        <AnimatePresence>
          {showDiff && (
            <motion.g key="diff" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
              <text x={W / 2} y="158" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>
                {oldPace} − {newPace} = {improvement} min/lap
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer != null ? String(problem.answer) : null} cx={W / 2} y={186} />
      </svg>
    </div>
  );
}
