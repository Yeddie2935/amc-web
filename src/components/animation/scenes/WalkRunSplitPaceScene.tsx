import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";

/**
 * Joe walks the first half (given time), then runs the second identical
 * half at a multiple of the speed, taking a fraction of the time; the two
 * times add to the total.
 * Data: { walkTime: 6, speedMultiplier: 3 }.
 */
export function WalkRunSplitPaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const walkTime = num(data.walkTime, 6);
  const speedMultiplier = num(data.speedMultiplier, 3);
  const runTime = Math.round((walkTime / speedMultiplier) * 100) / 100;
  const totalTime = walkTime + runTime;

  const isFinal = step >= totalSteps - 1;
  const showRun = step >= 1;
  const showTotal = step >= 2;

  const trackY = 60;
  const X0 = 30;
  const mid = 160;
  const X1 = 290;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `Joe walks the first half in ${walkTime} minutes`
          : isFinal
            ? "add walking and running time"
            : showTotal
              ? "sum the two halves"
              : `running is ${speedMultiplier}× as fast — the same half takes 1/${speedMultiplier} the time`}
      </div>

      <svg viewBox="0 0 320 130" width="100%" style={{ maxWidth: 340 }}>
        <text x={(X0 + mid) / 2} y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill={BLUE} fontFamily={FONT}>
          walk
        </text>
        <rect x={X0} y="28" width={mid - X0} height="22" rx="5" fill="#dbeafe" stroke={BLUE} strokeWidth="1.6" />
        <text x={(X0 + mid) / 2} y="43" textAnchor="middle" fontSize="12" fontWeight="900" fill={BLUE} fontFamily={FONT}>
          {walkTime} min
        </text>

        <AnimatePresence>
          {showRun && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={(mid + X1) / 2} y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
                run
              </text>
              <rect x={mid} y="28" width={(runTime / walkTime) * (mid - X0)} height="22" rx="5" fill="#fef3c7" stroke={ORANGE} strokeWidth="1.6" />
              <text x={mid + ((runTime / walkTime) * (mid - X0)) / 2} y="43" textAnchor="middle" fontSize="11" fontWeight="900" fill={ORANGE} fontFamily={FONT}>
                {runTime} min
              </text>
              <text x={mid + 10} y="70" fontSize="10.5" fontWeight="700" fill={ORANGE} fontFamily={FONT}>
                {walkTime} ÷ {speedMultiplier} = {runTime}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {showTotal && (
          <text x="160" y="105" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>
            {walkTime} + {runTime} = {totalTime}
          </text>
        )}
      </svg>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
