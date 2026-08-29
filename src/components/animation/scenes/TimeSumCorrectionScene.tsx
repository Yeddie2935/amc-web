import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const C = 110;
const CY_ = 100;
const HOUR_LEN = 46;
const MINUTE_LEN = 68;
const SUN_R = 90;

function pointAt(deg: number, r: number) {
  const t = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(t), y: CY_ - r * Math.cos(t) };
}

/** Minutes since 12:00 AM, so any 12-hour clock time sorts and adds cleanly. */
function toMinutes(h12: number, m: number, isPM: boolean) {
  return (h12 % 12) * 60 + m + (isPM ? 720 : 0);
}
function fromMinutes(total: number) {
  const t = ((total % 1440) + 1440) % 1440;
  const hour24 = Math.floor(t / 60);
  const m = t % 60;
  const isPM = hour24 >= 12;
  let h12 = hour24 % 12;
  if (h12 === 0) h12 = 12;
  return { h12, m, isPM };
}
function fmt({ h12, m, isPM }: { h12: number; m: number; isPM: boolean }) {
  return `${h12}:${String(m).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}
function handAngle(h12: number, m: number) {
  return ((h12 % 12) + m / 60) * 30;
}

/** A tiny sun: disc + rays, drawn at the local origin so a wrapper can translate it. */
function Sun() {
  return (
    <g>
      {[0, 45, 90, 135].map((a) => {
        const t = (a * Math.PI) / 180;
        const dx = Math.cos(t) * 8;
        const dy = Math.sin(t) * 8;
        return <line key={a} x1={-dx} y1={-dy} x2={dx} y2={dy} stroke="#f59e0b" strokeWidth={1.4} />;
      })}
      <circle r={5} fill="#fbbf24" stroke="#d97706" strokeWidth={0.8} />
    </g>
  );
}

/**
 * A start time plus a duration lands on the true result — checked against a
 * wrong reported result. Five beats: (0) the clock shows the start time, with
 * the reported (wrong) time already sitting on the rim as a faint dashed
 * hand; (1) the hour hand — and a sun riding along its tip — sweeps forward
 * by the whole hours; (2) it nudges forward the remaining minutes to the true
 * result; (3) the reported hand turns red and a wedge spans the gap between
 * it and the true time; (4) the badge. Data: { startHour, startMinute,
 * startIsPM, durationHours, durationMinutes, reportedHour, reportedMinute,
 * reportedIsPM }.
 */
export function TimeSumCorrectionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const startHour = num(data.startHour, 6);
  const startMinute = num(data.startMinute, 0);
  const startIsPM = Boolean(data.startIsPM);
  const durationHours = num(data.durationHours, 0);
  const durationMinutes = num(data.durationMinutes, 0);
  const reportedHour = num(data.reportedHour, startHour);
  const reportedMinute = num(data.reportedMinute, startMinute);
  const reportedIsPM = Boolean(data.reportedIsPM);

  const startTotal = toMinutes(startHour, startMinute, startIsPM);
  const afterHoursTotal = startTotal + durationHours * 60;
  const afterAllTotal = afterHoursTotal + durationMinutes;
  const reportedTotal = toMinutes(reportedHour, reportedMinute, reportedIsPM);

  const start = fromMinutes(startTotal);
  const afterHours = fromMinutes(afterHoursTotal);
  const afterAll = fromMinutes(afterAllTotal);
  const reported = fromMinutes(reportedTotal);

  const startAngle = handAngle(start.h12, start.m);
  const afterHoursAngle = startAngle + durationHours * 30;
  const afterAllAngle = afterHoursAngle + durationMinutes * 0.5;
  const reportedAngle = handAngle(reported.h12, reported.m);

  const startMinAngle = start.m * 6;
  const afterAllMinAngle = startMinAngle + durationMinutes * 6;

  const last = totalSteps - 1;
  const showHours = step >= 1;
  const showMinutes = step >= 2;
  const showCompare = step >= 3;
  const isFinal = step >= last;

  const hourTarget = showMinutes ? afterAllAngle : showHours ? afterHoursAngle : startAngle;
  const minTarget = showMinutes ? afterAllMinAngle : startMinAngle;

  const trueRest = ((afterAllAngle % 360) + 360) % 360;
  const reportedRest = ((reportedAngle % 360) + 360) % 360;
  const lo = Math.min(trueRest, reportedRest);
  const hi = Math.max(trueRest, reportedRest);
  const arcStart = hi - lo <= 180 ? lo : hi;
  const arcEnd = hi - lo <= 180 ? hi : lo + 360;
  const wedgeR = 60;
  const w1 = pointAt(arcStart, wedgeR);
  const w2 = pointAt(arcEnd, wedgeR);
  const wedgePath = `M${C},${CY_} L${w1.x.toFixed(1)},${w1.y.toFixed(1)} A${wedgeR},${wedgeR} 0 0 1 ${w2.x.toFixed(1)},${w2.y.toFixed(1)} Z`;

  const diffTotal = Math.abs(reportedTotal - afterAllTotal);
  const diffH = Math.floor(diffTotal / 60);
  const diffM = diffTotal % 60;

  const W = 220;
  const H = 270;
  const reportedTip = pointAt(reportedAngle, 92);
  const reportedHandTip = pointAt(reportedAngle, HOUR_LEN);
  const minStartTip = pointAt(startMinAngle, MINUTE_LEN);
  const minTargetTip = pointAt(minTarget, MINUTE_LEN);
  const hourStartTip = pointAt(startAngle, HOUR_LEN);
  const hourTargetTip = pointAt(hourTarget, HOUR_LEN);
  const sunStart = pointAt(startAngle, SUN_R);
  const sunTarget = pointAt(hourTarget, SUN_R);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 260 }}>
        <circle cx={C} cy={CY_} r={86} fill="#fff" stroke={INK} strokeWidth={2.2} />
        {Array.from({ length: 12 }).map((_, i) => {
          const n = i === 0 ? 12 : i;
          const p = pointAt(i * 30, 70);
          return (
            <text key={n} x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight={600} fill="#94a3b8" fontFamily={numberFont}>
              {n}
            </text>
          );
        })}

        {/* reported (wrong) hand — faint at first, red once compared */}
        <motion.line
          x1={C}
          y1={CY_}
          x2={reportedHandTip.x}
          y2={reportedHandTip.y}
          strokeLinecap="round"
          animate={{ stroke: showCompare ? BAD : "#cbd5e1", strokeWidth: showCompare ? 3 : 2, strokeDasharray: showCompare ? "0" : "4 3" }}
        />
        <text x={reportedTip.x} y={reportedTip.y + (reportedTip.y > CY_ ? 12 : -8)} textAnchor="middle" fontSize="8" fontWeight={700} fill={showCompare ? BAD : "#94a3b8"} fontFamily={numberFont}>
          {fmt(reported)}
        </text>

        {/* the gap wedge between the true and reported times */}
        <AnimatePresence>
          {showCompare && (
            <motion.path
              key="wedge"
              d={wedgePath}
              fill={BAD}
              fillOpacity={0.14}
              stroke={BAD}
              strokeWidth={1.2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* minute hand */}
        <motion.line
          x1={C}
          y1={CY_}
          stroke="#334155"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ x2: minStartTip.x, y2: minStartTip.y }}
          animate={{ x2: minTargetTip.x, y2: minTargetTip.y }}
          transition={{ type: "spring", stiffness: 55, damping: 13 }}
        />

        {/* hour hand */}
        <motion.line
          x1={C}
          y1={CY_}
          stroke={MARK}
          strokeWidth={5}
          strokeLinecap="round"
          initial={{ x2: hourStartTip.x, y2: hourStartTip.y }}
          animate={{ x2: hourTargetTip.x, y2: hourTargetTip.y }}
          transition={{ type: "spring", stiffness: 45, damping: 13 }}
        />

        {/* sun, riding the hour hand's tip */}
        <motion.g initial={{ x: sunStart.x, y: sunStart.y }} animate={{ x: sunTarget.x, y: sunTarget.y }} transition={{ type: "spring", stiffness: 45, damping: 13 }}>
          <Sun />
        </motion.g>

        <circle cx={C} cy={CY_} r={4.5} fill={INK} />

        <text x={C} y={202} textAnchor="middle" fontSize="10.5" fontWeight={800} fill={MARK} fontFamily={numberFont}>
          {showMinutes
            ? `${fmt(afterHours)} + ${durationMinutes} min = ${fmt(afterAll)}`
            : showHours
            ? `${fmt(start)} + ${durationHours}:00 = ${fmt(afterHours)}`
            : `sunrise ${fmt(start)}`}
        </text>

        <AnimatePresence>
          {showCompare && (
            <motion.text
              key="compare"
              x={C}
              y={220}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight={700}
              fill={BAD}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {fmt(reported)} − {fmt(afterAll)} = {diffH}:{String(diffM).padStart(2, "0")} too late
            </motion.text>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer ?? fmt(afterAll)} cx={C} y={showCompare ? 232 : 208} width={90} />
      </svg>
    </div>
  );
}
