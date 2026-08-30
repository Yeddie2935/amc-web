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
 * A day count that far out is a ring, not a line: full weeks land back on the
 * same weekday, so only the remainder after dividing by 7 actually moves the
 * marker. The scene draws the 7-day dial, computes weeks and remainder from
 * the real total, then hops a marker that many spots around the ring —
 * animating the marker's own x/y translation through fixed node coordinates
 * rather than rotating a group, since a rotated group here would freeze at
 * its start angle. Data: { weekLabels, totalDays }.
 */
export function WeekCycleHopScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const labels = (Array.isArray(data.weekLabels) ? data.weekLabels : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]).map((v) => String(v));
  const M = Math.max(2, labels.length);
  const totalDays = Math.max(1, Math.round(num(data.totalDays, 706)));

  const weeks = Math.floor(totalDays / M);
  const remainder = totalDays % M;
  const landIdx = remainder % M;
  const answerOk = problem.shortAnswer == null || labels[landIdx].toLowerCase() === String(problem.shortAnswer).trim().toLowerCase();
  const failure = !answerOk ? `landed on ${labels[landIdx]}, stored answer is ${problem.shortAnswer}` : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showMath = step >= 1;
  const showHop = step >= 2 || isFinal;

  const W = 300;
  const H = 240;
  const CX = 150;
  const CY = 120;
  const R = 75;
  const NR = 20;
  const ang = (i: number) => ((-90 + (i * 360) / M) * Math.PI) / 180;
  const NX = (i: number) => CX + R * Math.cos(ang(i));
  const NY = (i: number) => CY + R * Math.sin(ang(i));
  const short = (i: number) => labels[((i % M) + M) % M].slice(0, 3);

  const caption = isFinal
    ? `${remainder} days past ${weeks} full weeks lands on ${labels[landIdx]}`
    : showHop
    ? `hop ${remainder} days forward from ${labels[0]}`
    : showMath
    ? `${totalDays} = ${weeks} × ${M} + ${remainder} — the full weeks change nothing`
    : `a ${M}-day week repeats, starting on ${labels[0]}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={1.4} />

        {Array.from({ length: M }).map((_, i) => {
          const isStart = i === 0;
          const isLand = showHop && i === landIdx;
          const passed = showHop && remainder > 0 && (() => {
            for (let k = 1; k <= remainder; k++) if (k % M === i) return true;
            return false;
          })();
          return (
            <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.06 * i }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle
                cx={NX(i)}
                cy={NY(i)}
                r={isLand ? NR + 3 : NR}
                fill={isLand ? "#dcfce7" : isStart ? "#eef2ff" : "#f8fafc"}
                stroke={isLand ? WIN : isStart ? IND : "#cbd5e1"}
                strokeWidth={isLand || isStart ? 1.8 : 1.1}
              />
              <text x={NX(i)} y={NY(i) + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={isLand ? "#166534" : isStart ? IND : DIM} fontFamily={numberFont}>
                {short(i)}
              </text>
            </motion.g>
          );
        })}

        {!showMath && (
          <text x={CX} y={16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND}>
            born on {labels[0]}
          </text>
        )}

        {showMath && !showHop && (
          <motion.text x={CX} y={16} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {totalDays} = {weeks} × {M} + {remainder}
          </motion.text>
        )}

        {showHop && (
          <g>
            <text x={CX} y={16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              +{remainder} days from {labels[0]}
            </text>
            {Array.from({ length: remainder }).map((_, j) => (
              <motion.line
                key={j}
                x1={NX(j)}
                y1={NY(j)}
                x2={NX(j + 1)}
                y2={NY(j + 1)}
                stroke={WIN}
                strokeWidth={2}
                strokeOpacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + j * 0.35 }}
              />
            ))}
            <motion.g
              animate={{
                x: Array.from({ length: remainder + 1 }, (_, j) => NX(j) - NX(0)),
                y: Array.from({ length: remainder + 1 }, (_, j) => NY(j) - NY(0)),
              }}
              transition={{ duration: 0.35 * remainder, ease: "linear", delay: 0.4 }}
            >
              <text x={NX(0)} y={NY(0) - NR - 6} textAnchor="middle" fontSize="16">
                🎂
              </text>
            </motion.g>
          </g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: remainder * 0.35 + 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
