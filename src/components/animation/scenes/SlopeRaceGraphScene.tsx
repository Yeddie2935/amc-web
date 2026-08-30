import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const COLORS = ["#2563eb", "#f59e0b", "#a855f7", "#0891b2", "#dc2626"];

/**
 * Each student's point implies a ray from the origin; the steepest ray
 * (distance/time) is the fastest average speed.
 * Data: { students: [{ name: "Evelyn", time: 1, distance: 4 }, ...] }.
 */
export function SlopeRaceGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const students = Array.isArray(data.students)
    ? (data.students as { name: string; time: number; distance: number }[])
    : [
        { name: "Evelyn", time: 1, distance: 4 },
        { name: "Carla", time: 3, distance: 5 },
        { name: "Briana", time: 2, distance: 2 },
        { name: "Debra", time: 4, distance: 3 },
        { name: "Angela", time: 6, distance: 1 },
      ];
  const withSlope = students.map((s) => ({ ...s, slope: s.distance / s.time }));
  const fastest = withSlope.reduce((a, b) => (b.slope > a.slope ? b : a));

  const isFinal = step >= totalSteps - 1;
  const showRays = step >= 1;
  const showSlopes = step >= 2;

  const maxT = Math.max(...students.map((s) => s.time)) + 1;
  const maxD = Math.max(...students.map((s) => s.distance)) + 1;
  const X0 = 30;
  const Y0 = 130;
  const PW = 200;
  const PH = 110;
  const px = (t: number) => X0 + (t / maxT) * PW;
  const py = (d: number) => Y0 - (d / maxD) * PH;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "each student's (time, distance) point"
          : isFinal
            ? `${fastest.name} has the steepest ray`
            : showSlopes
              ? "compare distance ÷ time for each"
              : "draw a ray from the origin to each point"}
      </div>

      <svg viewBox="0 0 250 145" width="100%" style={{ maxWidth: 270 }}>
        <line x1={X0} y1={Y0} x2={X0 + PW + 6} y2={Y0} stroke={INK} strokeWidth="1.4" />
        <line x1={X0} y1={Y0 - PH - 6} x2={X0} y2={Y0} stroke={INK} strokeWidth="1.4" />
        <text x={X0 + PW + 6} y={Y0 + 12} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>time</text>
        <text x={X0 - 10} y={Y0 - PH - 8} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>dist</text>

        {withSlope.map((s, i) => {
          const isFastest = s.name === fastest.name;
          const color = isFinal && isFastest ? WIN : COLORS[i % COLORS.length];
          return (
            <g key={s.name}>
              {showRays && (
                <motion.line
                  x1={X0}
                  y1={Y0}
                  x2={px(s.time)}
                  y2={py(s.distance)}
                  stroke={color}
                  strokeWidth={isFinal && isFastest ? 3 : 1.6}
                  strokeOpacity={isFinal && !isFastest ? 0.3 : 0.85}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                />
              )}
              <circle cx={px(s.time)} cy={py(s.distance)} r="4" fill={color} fillOpacity={isFinal && !isFastest ? 0.3 : 1} />
              <text x={px(s.time) + 6} y={py(s.distance) - 6} fontSize="9" fontWeight="800" fill={color} fillOpacity={isFinal && !isFastest ? 0.4 : 1} fontFamily={FONT}>
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {showSlopes && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", fontSize: 9.5, fontWeight: 800, fontFamily: FONT }}>
            {withSlope.map((s, i) => (
              <span key={s.name} style={{ color: s.name === fastest.name ? WIN : COLORS[i % COLORS.length] }}>
                {s.name}: {s.distance}/{s.time}≈{Math.round(s.slope * 100) / 100}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
