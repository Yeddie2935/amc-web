import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * A number of minutes past midnight, tracked on a timeline long enough to
 * cross into the next day. The whole problem is one division (minutes ÷ 60)
 * plus one carry (24 of those hours make a full day), but the real trap is
 * that a 12-hour clock reading alone can't tell AM from PM — 33h31m and
 * 21h31m both reduce to "9:31" on a 12-hour face — so the scene spends a
 * beat on that exact ambiguity before tracking the full 24-hour distance
 * that resolves it.
 *
 * data: { totalMinutes, dateLabels: [day0Label, day1Label, ...] }
 */
export function MinuteRolloverScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalMinutes = Math.round(num(data.totalMinutes, 0));
  const dateLabels = (Array.isArray(data.dateLabels) ? data.dateLabels : []).map((v) => String(v));

  const wholeHours = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;
  const daysPassed = Math.floor(totalMinutes / 1440);
  const minutesIntoFinalDay = totalMinutes - daysPassed * 1440;
  const finalHour = Math.floor(minutesIntoFinalDay / 60);
  const finalMin = minutesIntoFinalDay % 60;
  const finalPeriod = finalHour < 12 ? "AM" : "PM";
  const finalHour12 = finalHour === 0 ? 12 : finalHour > 12 ? finalHour - 12 : finalHour;
  const finalDateLabel = dateLabels[daysPassed] ?? dateLabels[dateLabels.length - 1] ?? `Day ${daysPassed + 1}`;
  const expected = `${finalDateLabel} at ${finalHour12}:${pad2(finalMin)}${finalPeriod}`;
  const ok = expected === (problem.shortAnswer ?? "").trim();

  // ---- the trap: mod-12 throws away which half of the day it is ----
  const hoursMod12 = wholeHours % 12;
  const trapHour24 = hoursMod12 + 12; // guess "PM", same clock digits, still day 0
  const trapHour12 = hoursMod12 === 0 ? 12 : hoursMod12;
  const trapText = `${dateLabels[0] ?? "Day 1"} at ${trapHour12}:${pad2(remMinutes)}PM`;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === trapText);

  // ---- beats: 0 setup, 1 convert, 2 the mod-12 trap, 3 cross the day, 4 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 4));
  const isFinal = step >= last;

  // ---- geometry: a timeline long enough to cover the trap point and the real landing ----
  const W = 360;
  const H = 280;
  const spanHours = Math.max(36, Math.ceil(wholeHours + remMinutes / 60) + 3);
  const X0 = 30;
  const X1 = 330;
  const timelineY = 140;
  const pxAt = (h: number) => X0 + (h / spanHours) * (X1 - X0);
  const targetHours = wholeHours + remMinutes / 60;

  const caption =
    beat === 0
      ? `${totalMinutes} minutes after midnight, ${dateLabels[0] ?? "day 1"}`
      : beat === 1
      ? `${totalMinutes} ÷ 60 = ${wholeHours} h ${remMinutes} min`
      : beat === 2
      ? `${wholeHours}h${remMinutes}m mod 12 = ${hoursMod12}h${remMinutes}m — same digits, AM or PM?`
      : beat === 3
      ? `${wholeHours}h = 24h (one full day) + ${wholeHours - 24}h — one day passes`
      : expected;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <path d={`M ${X0},${timelineY} L ${X1},${timelineY}`} stroke={INK} strokeWidth={1.6} />
        {Array.from({ length: Math.floor(spanHours / 6) + 1 }).map((_, k) => {
          const h = k * 6;
          if (h > spanHours) return null;
          const isMidnight = h % 24 === 0;
          return (
            <g key={h}>
              <path d={`M ${pxAt(h)},${timelineY - (isMidnight ? 8 : 5)} L ${pxAt(h)},${timelineY + (isMidnight ? 8 : 5)}`} stroke={isMidnight ? INK : DIM} strokeWidth={isMidnight ? 1.6 : 1} />
              <text x={pxAt(h)} y={timelineY + 22} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={isMidnight ? INK : DIM} fontFamily={FONT}>
                {h === 0 ? "start" : `${h}h`}
              </text>
            </g>
          );
        })}

        {/* the day-1 midnight boundary, always visible once relevant */}
        {beat >= 3 && (
          <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}>
            <path d={`M ${pxAt(24)},${timelineY - 34} L ${pxAt(24)},${timelineY}`} stroke={IND} strokeWidth={1.4} strokeDasharray="3 3" />
            <text x={pxAt(24)} y={timelineY - 40} textAnchor="middle" fontSize="9" fontWeight="800" fill={IND} fontFamily={FONT}>
              midnight, {dateLabels[1] ?? "day 2"}
            </text>
          </motion.g>
        )}

        {/* the start marker */}
        <circle cx={pxAt(0)} cy={timelineY} r={6} fill={INK} />
        <text x={pxAt(0)} y={timelineY - 12} textAnchor="start" fontSize="8.5" fontWeight="700" fill={INK} fontFamily={FONT}>
          midnight, {dateLabels[0] ?? "day 1"}
        </text>

        {/* beat 1: the raw hour/minute split, no travel yet */}
        {beat === 1 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 66} y={60} width={132} height={34} rx={10} fill="#eef2ff" stroke={IND} strokeWidth={1.6} />
            <text x={W / 2} y={82} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={FONT}>
              {wholeHours}h {remMinutes}m
            </text>
          </motion.g>
        )}

        {/* beat 2: the trap — the same digits, wrongly kept on day 1 as PM */}
        {beat === 2 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={pxAt(trapHour24 + remMinutes / 60)} cy={timelineY} r={6} fill={BAD} opacity={0.85} />
            <text x={pxAt(trapHour24 + remMinutes / 60)} y={timelineY - 12} textAnchor="middle" fontSize="13" fontWeight="800" fill={BAD} fontFamily={FONT}>
              ✗
            </text>
            <text x={pxAt(trapHour24 + remMinutes / 60)} y={timelineY + 38} textAnchor="middle" fontSize="9" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {trapHour12}:{pad2(remMinutes)}PM, {dateLabels[0] ?? "day 1"}
            </text>
          </motion.g>
        )}

        {/* beats 3-4: the real journey, tracked in full hours across the boundary */}
        {beat >= 3 && (
          <motion.circle
            cx={pxAt(0)}
            cy={timelineY}
            r={7}
            fill={isFinal ? WIN : IND}
            initial={{ x: 0 }}
            animate={{ x: pxAt(beat === 3 ? 24 : targetHours) - pxAt(0) }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        )}
        {beat === 4 && (
          <motion.text x={pxAt(targetHours)} y={timelineY - 14} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {finalDateLabel}, {finalHour12}:{pad2(finalMin)}{finalPeriod}
          </motion.text>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice
              ? `choice ${trapChoice.label} (${trapText}) is exactly this ambiguity`
              : `mod 12 alone can't tell you the day or the half`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed "${expected}" but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
