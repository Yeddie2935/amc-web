import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

function numList(value: unknown): number[] {
  return Array.isArray(value) ? value.map((v) => Number(v)).filter((v) => Number.isFinite(v)) : [];
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/**
 * Five numbers, with the largest, smallest, and median all barred from both
 * ends — so the two middling values are forced into the first and last
 * slots, whichever order they land in. Five beats: (0) the numbers above
 * empty slots; (1)-(3) the largest, smallest, and median each shown
 * confined to the middle three; (4) the two leftovers drop into the ends
 * and their average lands. Data: { numbers: number[5] }.
 */
export function RestrictedSlotsAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const numbers = numList(data.numbers);
  if (numbers.length !== 5) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const [min, second, median, fourth, max] = sorted;
  const free = [second, fourth];
  const restricted = [max, min, median];
  const freeAvg = (free[0] + free[1]) / 2;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showMax = step >= 1;
  const showMin = step >= 2;
  const showMedian = step >= 3;
  const showEnds = isFinal;

  const restrictedShown = [showMax && max, showMin && min, showMedian && median].filter((v) => v !== false) as number[];

  const caption = isFinal
    ? `(${fmt(free[0])} + ${fmt(free[1])}) / 2 = ${fmt(freeAvg)}`
    : step === 0
    ? "5 numbers, 5 slots — which two can be at the ends?"
    : showMedian
    ? `${fmt(median)} (median) can't be first or last either`
    : showMin
    ? `${fmt(min)} (smallest) can't be last`
    : `${fmt(max)} (largest) can't be first`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 6 }}>
        {sorted.map((n) => {
          const isRestricted = restrictedShown.includes(n);
          return (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: -8, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              style={{
                width: 34,
                height: 30,
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 800,
                background: isRestricted ? `${MARK}18` : "#f1f5f9",
                border: `1.6px solid ${isRestricted ? MARK : "#cbd5e1"}`,
                color: isRestricted ? MARK : INK,
              }}
            >
              {fmt(n)}
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const isEnd = i === 0 || i === 4;
          const filledWith = showEnds ? (i === 0 ? free[0] : i === 4 ? free[1] : null) : null;
          return (
            <div
              key={i}
              style={{
                width: 34,
                height: 34,
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: filledWith != null ? "#dcfce7" : "#fff",
                border: `1.6px dashed ${isEnd ? BAD : "#cbd5e1"}`,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 12,
                color: WIN,
              }}
            >
              <AnimatePresence>
                {filledWith != null && (
                  <motion.span key="fill" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                    {fmt(filledWith)}
                  </motion.span>
                )}
              </AnimatePresence>
              {isEnd && filledWith == null && !isFinal && (
                <span style={{ position: "absolute", top: -14, fontSize: 9, color: BAD, fontWeight: 700 }}>
                  {i === 0 ? "1st" : "5th"}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, color: DIM }}>
        {restricted.map(fmt).join(", ")} confined to the middle three
      </div>

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
