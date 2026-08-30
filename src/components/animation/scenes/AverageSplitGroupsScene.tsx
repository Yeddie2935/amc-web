import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";

/**
 * A list split into a known-average front group and an unknown-average
 * tail: the whole list's total minus the front group's total leaves the
 * tail's total, and dividing by its count gives its average — none of the
 * individual numbers ever need to be known. Five beats: (0) the whole list
 * and its total; (1) the front group and its total; (2) the tail's total by
 * subtraction; (3) the tail's average by division; (4) the badge.
 * Data: { total, avg, firstCount, firstAvg }.
 */
export function AverageSplitGroupsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.round(num(data.total, 5));
  const avg = num(data.avg, 54);
  const firstCount = Math.round(num(data.firstCount, 2));
  const firstAvg = num(data.firstAvg, 48);
  if (total <= firstCount || firstCount <= 0) return null;

  const totalSum = total * avg;
  const firstSum = firstCount * firstAvg;
  const lastCount = total - firstCount;
  const lastSum = totalSum - firstSum;
  const lastAvg = lastSum / lastCount;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showFirst = step >= 1;
  const showSubtract = step >= 2 || isFinal;
  const showDivide = step >= 3 || isFinal;

  const caption = isFinal
    ? `${lastSum} ÷ ${lastCount} = ${lastAvg}`
    : step === 0
    ? `${total} numbers, average ${avg}`
    : showDivide
    ? `divide the tail's total by its count`
    : showSubtract
    ? `${totalSum} − ${firstSum} = ${lastSum} for the last ${lastCount}`
    : `first ${firstCount} average ${firstAvg}`;

  const tileW = 40;
  const gap = 8;
  const startX = 12;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${startX * 2 + total * tileW + (total - 1) * gap} 118`} width="100%" style={{ maxWidth: 380 }}>
        {Array.from({ length: total }).map((_, i) => {
          const isFirstGroup = i < firstCount;
          const highlighted = isFirstGroup ? true : showSubtract;
          const color = isFirstGroup ? MARK : TEAL;
          const x = startX + i * (tileW + gap);
          return (
            <motion.g key={i} initial={{ opacity: 0, y: -8, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.07 }}>
              <rect
                x={x}
                y={20}
                width={tileW}
                height={34}
                rx={7}
                fill={highlighted ? `${color}18` : "#f1f5f9"}
                stroke={highlighted ? color : "#cbd5e1"}
                strokeWidth={1.6}
              />
              <text x={x + tileW / 2} y={41} textAnchor="middle" fontSize="13" fontWeight="800" fill={highlighted ? color : "#94a3b8"} fontFamily={FONT}>
                ?
              </text>
            </motion.g>
          );
        })}

        {/* full-list brace */}
        <text x={(startX * 2 + total * tileW + (total - 1) * gap) / 2} y={70} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={FONT}>
          {total} × {avg} = {totalSum}
        </text>

        {/* first-group brace */}
        {showFirst && (
          <motion.text
            x={startX + (firstCount * tileW + (firstCount - 1) * gap) / 2}
            y={88}
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill={MARK}
            fontFamily={FONT}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {firstCount} × {firstAvg} = {firstSum}
          </motion.text>
        )}

        {/* tail-group brace */}
        <AnimatePresence>
          {showSubtract && (
            <motion.text
              key="tail"
              x={startX + firstCount * (tileW + gap) + (lastCount * tileW + (lastCount - 1) * gap) / 2}
              y={88}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill={TEAL}
              fontFamily={FONT}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {showDivide ? `${lastSum} ÷ ${lastCount} = ${lastAvg}` : `? = ${lastSum}`}
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

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
