import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * A month where a known date falls on a known weekday, asking for the
 * weekday of the 1st. The scene lays out a real weekday header, drops the
 * anchor day into its column, steps back exactly one week to the same
 * column, then counts back day by day until it lands on the 1st — the
 * weekday it lands in is read off the header, not asserted.
 * Data: { day, weekday, targetDay }.
 */
export function FridayThirteenthScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const day = Math.max(1, Math.round(num(data.day, 13)));
  const weekday = data.weekday != null ? String(data.weekday) : "Friday";
  const targetDay = Math.max(1, Math.round(num(data.targetDay, 1)));

  const anchorIdx = WEEKDAYS.findIndex((w) => w.toLowerCase() === weekday.toLowerCase().slice(0, 3));
  const idxOf = (d: number) => (((anchorIdx + (d - day)) % 7) + 7) % 7;
  const blank = idxOf(1);
  const cellIndexOf = (d: number) => blank + (d - 1);
  const rowOf = (d: number) => Math.floor(cellIndexOf(d) / 7);
  const colOf = (d: number) => cellIndexOf(d) % 7;

  const weekBefore = day - 7;
  const targetWeekday = WEEKDAYS[idxOf(targetDay)];
  const targetWeekdayFull = FULL_WEEKDAYS[idxOf(targetDay)];
  const matches = problem.shortAnswer == null || targetWeekdayFull.toLowerCase() === String(problem.shortAnswer).toLowerCase();
  const failure = !matches ? `check failed: day ${targetDay} lands on ${targetWeekdayFull}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showWeekBack = step >= 1;
  const showCounting = step >= 2;
  const showTarget = step >= 3;
  const isFinal = step >= lastStep;

  const countingDays = Array.from({ length: weekBefore - targetDay }, (_, i) => weekBefore - 1 - i).filter((d) => d > targetDay);

  // ---- geometry ----
  const cell = 38;
  const gap = 4;
  const x0 = 12;
  const y0 = 40;
  const maxRow = Math.max(rowOf(day), rowOf(targetDay));
  const W = x0 * 2 + 7 * cell + 6 * gap;
  const H = y0 + (maxRow + 1) * (cell + gap) + 10;
  const cx = (d: number) => x0 + colOf(d) * (cell + gap) + cell / 2;
  const cy = (d: number) => y0 + rowOf(d) * (cell + gap) + cell / 2;

  const caption = isFinal
    ? `day ${targetDay} lands on ${targetWeekdayFull}`
    : showTarget
    ? `day ${targetDay} sits in the ${targetWeekday} column`
    : showCounting
    ? `counting back from day ${weekBefore} to day ${targetDay}`
    : showWeekBack
    ? `day ${weekBefore} = day ${day} − 7, also a ${weekday}`
    : `day ${day} is a ${weekday}`;

  const dayCell = (d: number, highlight: boolean, delay: number) => (
    <motion.g key={d} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 17, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <rect x={cx(d) - cell / 2 + 2} y={cy(d) - cell / 2 + 2} width={cell - 4} height={cell - 4} rx={7} fill={highlight ? "#dcfce7" : "#eef2ff"} stroke={highlight ? WIN : IND} strokeWidth={highlight ? 1.8 : 1.3} />
      <text x={cx(d)} y={cy(d) + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill={highlight ? "#166534" : IND} fontFamily={numberFont}>
        {d}
      </text>
    </motion.g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {WEEKDAYS.map((w, i) => (
          <text key={w} x={x0 + i * (cell + gap) + cell / 2} y={20} textAnchor="middle" fontSize="10" fontWeight="800" fill={i === idxOf(targetDay) && showTarget ? WIN : DIM} fontFamily={numberFont}>
            {w}
          </text>
        ))}

        {dayCell(day, false, 0)}

        <AnimatePresence>
          {showWeekBack && (
            <motion.g key="week-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={cx(day)}
                y1={cy(day) - cell / 2}
                x2={cx(weekBefore)}
                y2={cy(weekBefore) + cell / 2}
                stroke={IND}
                strokeWidth={1.6}
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              {dayCell(weekBefore, false, 0.15)}
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCounting &&
            countingDays.map((d, i) => dayCell(d, false, i * 0.1))}
        </AnimatePresence>

        <AnimatePresence>{showTarget && dayCell(targetDay, true, 0.1)}</AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
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
        {failure && (
          <motion.span key="note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }} style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#dc2626", textAlign: "center" }}>
            {failure}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
