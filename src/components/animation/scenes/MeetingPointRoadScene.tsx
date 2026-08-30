import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";

function fmtTime(minutesAfter830: number) {
  const total = 8 * 60 + 30 + minutesAfter830;
  let h = Math.floor(total / 60);
  const m = total % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Cassie bikes toward Brian, who leaves later from the far end; the gap
 * closes at their combined speed until the two markers meet.
 * Data: { distance: 62, speedA: 12, speedB: 16, startGapMinutes: 30 }.
 */
export function MeetingPointRoadScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const distance = num(data.distance, 62);
  const speedA = num(data.speedA, 12);
  const speedB = num(data.speedB, 16);
  const startGapMin = num(data.startGapMinutes, 30);

  const headStart = speedA * (startGapMin / 60);
  const remainingGap = distance - headStart;
  const combinedSpeed = speedA + speedB;
  const hoursToMeet = remainingGap / combinedSpeed;
  const meetPos = headStart + speedA * hoursToMeet;
  const meetMinutes = startGapMin + hoursToMeet * 60;

  const isFinal = step >= totalSteps - 1;
  const showHeadStart = step >= 1;
  const showCombined = step >= 2;
  const showMeet = isFinal;

  const X0 = 30;
  const X1 = 290;
  const px = (miles: number) => X0 + (miles / distance) * (X1 - X0);

  const aPos = showMeet ? meetPos : showCombined ? headStart + speedA * hoursToMeet * 0.5 : showHeadStart ? headStart : 0;
  const bShown = step >= 1;
  const bActualPos = showMeet ? meetPos : showCombined ? distance - speedB * hoursToMeet * 0.5 : distance;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "Cassie leaves first, heading toward Brian's town"
          : isFinal
            ? "find the meeting time"
            : showCombined
              ? "the gap closes at their combined speed"
              : "by the time Brian starts, Cassie has a head start"}
      </div>

      <svg viewBox="0 0 320 110" width="100%" style={{ maxWidth: 340 }}>
        <line x1={X0} y1="50" x2={X1} y2="50" stroke="#cbd5e1" strokeWidth="4" />
        <text x={X0} y="70" textAnchor="start" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={FONT}>Escanaba</text>
        <text x={X1} y="70" textAnchor="end" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={FONT}>Marquette</text>

        <motion.circle cx={px(aPos)} cy="50" r="7" fill={BLUE} initial={false} animate={{ cx: px(aPos) }} transition={{ type: "spring", stiffness: 90, damping: 16 }} />
        <text x={showMeet ? px(aPos) - 20 : px(aPos)} y="34" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={BLUE} fontFamily={FONT}>Cassie</text>

        <AnimatePresence>
          {bShown && (
            <motion.g key="brian" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.circle cx={px(bActualPos)} cy="50" r="7" fill={ORANGE} initial={false} animate={{ cx: px(bActualPos) }} transition={{ type: "spring", stiffness: 90, damping: 16 }} />
              <text x={showMeet ? px(bActualPos) + 20 : px(bActualPos)} y="34" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={ORANGE} fontFamily={FONT}>Brian</text>
            </motion.g>
          )}
        </AnimatePresence>

        {step === 1 && (
          <text x={(px(0) + px(headStart)) / 2} y="90" textAnchor="middle" fontSize="10" fontWeight="800" fill={BLUE} fontFamily={FONT}>
            {headStart} mi by 9:00
          </text>
        )}
        {step === 2 && (
          <text x={(px(headStart) + px(distance)) / 2} y="90" textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={FONT}>
            {remainingGap} mi left, closing at {combinedSpeed} mph
          </text>
        )}
        {showMeet && (
          <text x={px(meetPos)} y="90" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>
            meet at {meetPos.toFixed(0)} mi, {fmtTime(meetMinutes)}
          </text>
        )}
      </svg>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
