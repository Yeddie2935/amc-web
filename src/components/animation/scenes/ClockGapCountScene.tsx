import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

const C = 110;
const R = 82;

function pointAt(deg: number, r: number) {
  const t = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(t), y: C - r * Math.cos(t) };
}

/**
 * A clock face has 12 equal gaps around 360°, so each is 30°. The smaller
 * angle at a given hour is just a count of how many consecutive gaps the
 * hour hand crosses from the minute hand's position — drawn here as literal
 * wedges between tick marks, counted one at a time, rather than computed
 * from a formula. Data: { hour } (minute hand fixed at 12, matching the
 * on-the-hour problem this was built for).
 */
export function ClockGapCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const hour = Math.round(num(data.hour, 10)) % 12;
  const gapCount = Math.min(hour, 12 - hour);
  const totalDeg = gapCount * 30;
  const answer = answerOf(problem);
  const valid = String(totalDeg) === (problem.shortAnswer ?? "").replace(/[^\d]/g, "");

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: bare face, 1: one gap = 30°, 2: hands placed + gaps counted, 3: sum, 4: conclude
  const showOneGap = beat >= 1;
  const showHands = beat >= 2;
  const showSum = beat >= 3;
  const showConclude = beat >= 4;

  const hourHand = pointAt(hour * 30, R * 0.55);
  const minuteHand = pointAt(0, R * 0.78);

  const gapWedge = (i: number) => {
    const start = i * 30;
    const end = start + 30;
    const p1 = pointAt(start, R * 0.9);
    const p2 = pointAt(end, R * 0.9);
    const large = 0;
    return `M${C},${C} L${p1.x.toFixed(1)},${p1.y.toFixed(1)} A${R * 0.9},${R * 0.9} 0 ${large} 1 ${p2.x.toFixed(1)},${p2.y.toFixed(1)} Z`;
  };

  const caption =
    beat === 0
      ? "a clock face splits 360° into 12 equal gaps"
      : beat === 1
      ? "one gap: 360° ÷ 12 = 30°"
      : beat === 2
      ? `the hands span ${gapCount} gaps from ${hour} to 12`
      : beat === 3
      ? `${Array.from({ length: gapCount }, () => "30°").join(" + ")} = ${totalDeg}°`
      : `the smaller angle is ${totalDeg}°`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 220 240" width="100%" style={{ maxWidth: 260, minWidth: 0, display: "block" }} aria-label={`Clock face counting the gaps between the hands at ${hour} o'clock`}>
        <circle cx={C} cy={C} r={R} fill="#fff" stroke={INK} strokeWidth="3" />

        {/* 12 tick marks + numbers */}
        {Array.from({ length: 12 }, (_, i) => {
          const n = i === 0 ? 12 : i;
          const p = pointAt(i * 30, R * 0.72);
          return (
            <text key={n} x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight={n === hour || n === 12 ? 900 : 600} fill={n === hour || n === 12 ? IND : "#64748b"}>
              {n}
            </text>
          );
        })}

        {/* one highlighted gap (12 to 1) to demonstrate the 30° unit */}
        <AnimatePresence>
          {beat === 1 && (
            <motion.g key="onegap" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ transformBox: "fill-box", transformOrigin: `${C}px ${C}px` }}>
              <path d={gapWedge(0)} fill={`${IND}33`} stroke={IND} strokeWidth="1.5" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* the gaps actually spanned by the hands, revealed one at a time */}
        {showHands &&
          Array.from({ length: gapCount }, (_, i) => {
            const idx = hour <= 6 ? hour - 1 - i : 12 - 1 - i;
            return (
              <motion.g key={`gap${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.25 }}>
                <path d={gapWedge(idx)} fill={`${GREEN}22`} stroke={GREEN} strokeWidth="1.5" />
              </motion.g>
            );
          })}

        {/* hour hand: animate endpoint directly, not rotation */}
        <motion.line x1={C} y1={C} x2={C} y2={C} stroke={IND} strokeWidth="6" strokeLinecap="round" animate={{ x2: hourHand.x, y2: hourHand.y }} transition={{ type: "spring", stiffness: 90, damping: 14 }} />
        {/* minute hand fixed at 12 */}
        <motion.line x1={C} y1={C} x2={C} y2={C} stroke="#334155" strokeWidth="4" strokeLinecap="round" animate={{ x2: minuteHand.x, y2: minuteHand.y }} transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.1 }} />
        <circle cx={C} cy={C} r="5" fill={INK} />

        <SvgAnswerBadge show={showConclude} answer={answer} cx={C} y={202} width={92} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: showConclude ? (valid ? "#166534" : "#dc2626") : INK,
          background: showConclude ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showConclude ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
