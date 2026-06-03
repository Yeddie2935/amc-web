import { motion, AnimatePresence } from "motion/react";
import type { AnimatedSceneProps } from "./types";

const C = 100; // clock centre
const MINUTE_LEN = 70;
const HOUR_LEN = 48;
const handOrigin = { transformBox: "view-box" as const, transformOrigin: "100px 100px" };

// Point on the clock at a given angle (degrees, 0 = 12 o'clock, clockwise).
function pointAt(deg: number, r: number) {
  const t = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(t), y: C - r * Math.cos(t) };
}

function parseTime(text: string): { hour: number; minute: number } {
  const match = text.match(/(\d{1,2}):(\d{2})/);
  if (match) return { hour: Number(match[1]) % 12, minute: Number(match[2]) % 60 };
  return { hour: 3, minute: 0 };
}

/**
 * Faithful clock-angle animation. Reads the actual time from the problem,
 * places the hands correctly, and walks the same three reasoning beats as the
 * written solution: place the minute hand, move the hour hand, read the angle.
 */
export function ClockAngleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const { hour, minute } = parseTime(`${problem.title} ${problem.statement}`);

  const minuteAngle = minute * 6; // 6° per minute
  const hourAngle = ((hour % 12) + minute / 60) * 30; // 30° per hour + drift

  let diff = Math.abs(hourAngle - minuteAngle);
  if (diff > 180) diff = 360 - diff;
  const acute = Math.round(diff * 10) / 10;

  // Minor arc between the two hands (the angle the problem asks for).
  const lo = Math.min(minuteAngle, hourAngle);
  const hi = Math.max(minuteAngle, hourAngle);
  const arcStart = hi - lo <= 180 ? lo : hi;
  const arcEnd = hi - lo <= 180 ? hi : lo + 360;
  const wedgeR = 38;
  const w1 = pointAt(arcStart, wedgeR);
  const w2 = pointAt(arcEnd, wedgeR);
  const wedgePath = `M${C},${C} L${w1.x.toFixed(1)},${w1.y.toFixed(1)} A${wedgeR},${wedgeR} 0 0 1 ${w2.x.toFixed(1)},${w2.y.toFixed(1)} Z`;
  const labelPos = pointAt((arcStart + arcEnd) / 2, wedgeR + 22);

  const last = totalSteps - 1;
  const focusMinute = step === 0;
  const focusHour = step === 1;
  const showWedge = step >= last;
  const answer = problem.shortAnswer ?? (problem.answer != null ? String(problem.answer) : null);

  return (
    <svg viewBox="0 0 200 210" role="img" aria-label={`Clock at ${hour}:${String(minute).padStart(2, "0")}`} style={{ width: "100%", maxWidth: 300 }}>
      <circle cx={C} cy={C} r="86" fill="#fff" stroke="#1f2a44" strokeWidth="3" />

      {/* Hour numbers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const num = i === 0 ? 12 : i;
        const p = pointAt(i * 30, 70);
        const isFour = num === (hour === 0 ? 12 : hour);
        return (
          <text
            key={num}
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            fontSize="11"
            fontWeight={isFour ? 700 : 500}
            fill={isFour && (focusMinute || focusHour) ? "#4338ca" : "#64748b"}
          >
            {num}
          </text>
        );
      })}

      {/* Angle wedge between the hands (final step) */}
      <AnimatePresence>
        {showWedge && (
          <motion.path
            key="wedge"
            d={wedgePath}
            fill="#6366f1"
            fillOpacity="0.2"
            stroke="#6366f1"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Hour hand */}
      <motion.g style={handOrigin} initial={{ rotate: 0 }} animate={{ rotate: hourAngle }} transition={{ type: "spring", stiffness: 55, damping: 13 }}>
        <motion.line
          x1={C}
          y1={C}
          x2={C}
          y2={C - HOUR_LEN}
          stroke={focusHour ? "#4338ca" : "#1f2a44"}
          strokeLinecap="round"
          animate={{ strokeWidth: focusHour ? 8 : 6 }}
        />
      </motion.g>

      {/* Minute hand */}
      <motion.g style={handOrigin} initial={{ rotate: 0 }} animate={{ rotate: minuteAngle }} transition={{ type: "spring", stiffness: 55, damping: 13, delay: 0.1 }}>
        <motion.line
          x1={C}
          y1={C}
          x2={C}
          y2={C - MINUTE_LEN}
          stroke={focusMinute ? "#4338ca" : "#334155"}
          strokeLinecap="round"
          animate={{ strokeWidth: focusMinute ? 6 : 4 }}
        />
      </motion.g>

      <circle cx={C} cy={C} r="5" fill="#1f2a44" />

      {/* Angle measure label (final step) */}
      <AnimatePresence>
        {showWedge && (
          <motion.text
            key="deg"
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill="#4338ca"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.3 }}
          >
            {acute}°
          </motion.text>
        )}
      </AnimatePresence>

      {/* Answer badge (final step) */}
      <AnimatePresence>
        {showWedge && answer && (
          <motion.g key="ans" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}>
            <rect x="60" y="190" width="80" height="24" rx="12" fill="#16a34a" />
            <text x={C} y="206" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">
              Answer {answer}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}
