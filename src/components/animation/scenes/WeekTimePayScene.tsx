import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const DIM = "#94a3b8";

function dayList(value: unknown): Array<{ label: string; raw: string; minutes: number }> {
  if (!Array.isArray(value)) return [];
  return value.map((d) => {
    const o = (d ?? {}) as Record<string, unknown>;
    return {
      label: o.label != null ? String(o.label) : "?",
      raw: o.raw != null ? String(o.raw) : "",
      minutes: Number(o.minutes) || 0,
    };
  });
}

/**
 * Odd-shaped time entries — a fraction of an hour, a raw minute count, a
 * clock-to-clock span — all convert to minutes, add up, and convert back to
 * hours before the pay rate applies. Five beats: (0) each day's raw time
 * converted to minutes; (1) the minutes added up; (2) the total converted
 * to hours; (3) the hours multiplied by the rate; (4) the badge.
 * Data: { days: [{label, raw, minutes}], rate }.
 */
export function WeekTimePayScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const days = dayList(data.days);
  const rate = num(data.rate, 3);
  if (days.length < 2) return null;

  const totalMinutes = days.reduce((s, d) => s + d.minutes, 0);
  const totalHours = totalMinutes / 60;
  const pay = totalHours * rate;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showSum = step >= 1;
  const showHours = step >= 2 || isFinal;
  const showPay = step >= 3 || isFinal;

  const caption = isFinal
    ? `${totalHours} × $${rate} = $${pay}`
    : step === 0
    ? "convert each day's time to minutes"
    : showPay
    ? `${totalHours} hours × $${rate}/hour`
    : showHours
    ? `${totalMinutes} minutes = ${totalMinutes} ÷ 60 = ${totalHours} hours`
    : `${days.map((d) => d.minutes).join(" + ")} = ${totalMinutes} minutes`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {days.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, y: -8, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.12 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "6px 8px",
              borderRadius: 8,
              background: `${MARK}10`,
              border: `1.4px solid ${MARK}55`,
              minWidth: 62,
            }}
          >
            <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 800, color: INK }}>{d.label}</span>
            <span style={{ fontSize: 13 }}>🕐</span>
            <span style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, color: DIM }}>{d.raw}</span>
            <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 800, color: MARK }}>{d.minutes} min</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showSum && (
          <motion.div
            key="sum"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 800, color: MARK }}
          >
            {days.map((d) => d.minutes).join(" + ")} = {totalMinutes} min
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHours && (
          <motion.div
            key="hours"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: TEAL }}
          >
            {totalMinutes} ÷ 60 = {totalHours} hours
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
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
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
