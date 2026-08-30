import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const DIM = "#94a3b8";

const GROUP_COLORS: Record<number, string> = { 1: "#2563eb", 4: "#16a34a", 9: "#f59e0b", 16: "#a855f7" };

function isPerfectSquare(n: number) {
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

/**
 * A 9x10 grid of two-digit numbers highlights, group by group, the ones
 * whose digit sum is a perfect square, then tallies each group.
 * Data: { max: 16 } (largest possible digit sum to treat as a group).
 */
export function DigitSumSquareGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const maxSquare = num(data.max, 16);

  const squareSums = [1, 4, 9, 16].filter((s) => s <= maxSquare);
  const groupA = squareSums.slice(0, 2); // 1, 4
  const groupB = squareSums.slice(2); // 9, 16

  const isFinal = step >= totalSteps - 1;
  const showGroupA = step >= 1;
  const showGroupB = step >= 2;

  const cellsByGroup: Record<number, number[]> = {};
  for (const s of squareSums) cellsByGroup[s] = [];
  for (let tens = 1; tens <= 9; tens++) {
    for (let ones = 0; ones <= 9; ones++) {
      const n = tens * 10 + ones;
      const sum = tens + ones;
      if (isPerfectSquare(sum) && sum > 0 && squareSums.includes(sum)) {
        cellsByGroup[sum].push(n);
      }
    }
  }
  const total = Object.values(cellsByGroup).reduce((a, arr) => a + arr.length, 0);

  const activeFor = (n: number) => {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const sum = tens + ones;
    if (!squareSums.includes(sum)) return false;
    if (groupA.includes(sum)) return showGroupA;
    return showGroupB;
  };
  const colorFor = (n: number) => {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return GROUP_COLORS[tens + ones] ?? DIM;
  };

  const cell = 24;
  const gx = 30;
  const gy = 30;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "every two-digit number, 10 to 99"
          : isFinal
            ? "add each group's count"
            : showGroupB
              ? "digit sum 9 or 16 is also a perfect square"
              : "digit sum 1 or 4 is a perfect square"}
      </div>

      <svg viewBox="0 0 270 270" width="100%" style={{ maxWidth: 300 }}>
        {Array.from({ length: 9 }).map((_, rowI) => {
          const tens = rowI + 1;
          return Array.from({ length: 10 }).map((_, colI) => {
            const ones = colI;
            const n = tens * 10 + ones;
            const active = activeFor(n);
            return (
              <motion.g
                key={n}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <rect
                  x={gx + colI * cell}
                  y={gy + rowI * cell}
                  width={cell - 2}
                  height={cell - 2}
                  rx="3"
                  fill={active ? colorFor(n) : "#f1f5f9"}
                  fillOpacity={active ? 0.85 : 1}
                />
                <text
                  x={gx + colI * cell + (cell - 2) / 2}
                  y={gy + rowI * cell + (cell - 2) / 2 + 4}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight={active ? 900 : 600}
                  fill={active ? "#fff" : "#94a3b8"}
                  fontFamily={FONT}
                >
                  {n}
                </text>
              </motion.g>
            );
          });
        })}
      </svg>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", fontSize: 10.5, fontWeight: 800, fontFamily: FONT, marginTop: 2 }}>
        {squareSums.map((s) => {
          const shown = groupA.includes(s) ? showGroupA : showGroupB;
          return (
            <span key={s} style={{ color: shown ? GROUP_COLORS[s] : DIM }}>
              sum {s}: {shown ? cellsByGroup[s].length : "?"}
            </span>
          );
        })}
      </div>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 6 }}>
          {squareSums.map((s) => cellsByGroup[s].length).join(" + ")} = {total}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
