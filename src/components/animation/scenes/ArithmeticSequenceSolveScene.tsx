import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";

/**
 * Five days increase by a fixed step; expressed in terms of the last day n,
 * their sum solves for n.
 * Data: { days: 5, step: 6, total: 100 }.
 */
export function ArithmeticSequenceSolveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const days = num(data.days, 5);
  const stepSize = num(data.step, 6);
  const total = num(data.total, 100);

  // sum = days*n - stepSize*(0+1+...+(days-1)) = total
  const offsetSum = (stepSize * (days * (days - 1))) / 2;
  const n = (total + offsetSum) / days;

  const isFinal = step >= totalSteps - 1;
  const showExpr = step >= 1;
  const showSum = step >= 2;

  const barW = 40;
  const gap = 10;
  const baseY = 110;
  const maxH = 90;

  const values = Array.from({ length: days }, (_, i) => n - (days - 1 - i) * stepSize);
  const maxVal = Math.max(...values);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `${days} days, each ${stepSize} more than the last, total ${total}`
          : isFinal
            ? "solve for n"
            : showSum
              ? "set the sum equal to the total"
              : "let the last day be n"}
      </div>

      <svg viewBox="0 0 260 140" width="100%" style={{ maxWidth: 280 }}>
        {values.map((v, i) => {
          const h = (v / maxVal) * maxH;
          const x = 20 + i * (barW + gap);
          return (
            <g key={i}>
              <rect x={x} y={baseY - h} width={barW} height={h} rx="4" fill="#fef3c7" stroke={ORANGE} strokeWidth="1.6" />
              <AnimatePresence mode="wait">
                {showExpr ? (
                  <motion.text
                    key="expr"
                    x={x + barW / 2}
                    y={baseY - h / 2 + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="900"
                    fill={ORANGE}
                    fontFamily={FONT}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {i === days - 1 ? "n" : `n−${(days - 1 - i) * stepSize}`}
                  </motion.text>
                ) : (
                  <text key="num" x={x + barW / 2} y={baseY - h / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill={ORANGE} fontFamily={FONT}>
                    day {i + 1}
                  </text>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      {showSum && (
        <div style={{ textAlign: "center", fontSize: 11.5, fontWeight: 800, color: IND, fontFamily: FONT }}>
          {days}n − {offsetSum} = {total}
        </div>
      )}

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          {days}n = {total + offsetSum} → n = {n}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
