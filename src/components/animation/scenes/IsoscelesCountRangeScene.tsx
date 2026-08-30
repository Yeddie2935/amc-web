import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * For 2a+b=perimeter, the triangle inequality 2a>b bounds a from below and
 * b>=1 bounds it from above; every integer a in between is a valid triangle.
 * Data: { perimeter: 23 }.
 */
export function IsoscelesCountRangeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const perimeter = num(data.perimeter, 23);

  const lowerBound = perimeter / 4; // a > perimeter/4
  const aMin = Math.floor(lowerBound) + 1;
  const aMax = Math.floor((perimeter - 1) / 2); // b = perimeter-2a >= 1
  const aValues = Array.from({ length: aMax - aMin + 1 }, (_, i) => aMin + i);

  const isFinal = step >= totalSteps - 1;
  const showInequality = step >= 1;
  const showRange = step >= 2;

  const allA = Array.from({ length: aMax + 3 }, (_, i) => i + 1);
  const cellW = 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `equal sides a, base b, perimeter ${perimeter}: 2a+b=${perimeter}`
          : isFinal
            ? "count the integer values of a"
            : showRange
              ? "b ≥ 1 also bounds a from above"
              : `triangle inequality: 2a > b needs a > ${lowerBound}`}
      </div>

      <svg viewBox="0 0 320 90" width="100%" style={{ maxWidth: 340 }}>
        <line x1="20" y1="50" x2={24 + allA.length * cellW} y2="50" stroke="#cbd5e1" strokeWidth="1" />
        {allA.map((a, i) => {
          const x = 24 + i * cellW;
          const inRange = showRange ? a >= aMin && a <= aMax : false;
          const failsLower = showInequality && a <= lowerBound;
          return (
            <g key={a}>
              <motion.circle
                cx={x}
                cy="50"
                r="8"
                fill={inRange ? WIN : failsLower ? "#fecaca" : "#e2e8f0"}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.03 * i }}
              />
              <text x={x} y="54" textAnchor="middle" fontSize="9" fontWeight="800" fill={inRange ? "#fff" : DIM} fontFamily={FONT}>
                {a}
              </text>
            </g>
          );
        })}
        {showInequality && (
          <line x1={24 + (lowerBound - 1) * cellW} y1="30" x2={24 + (lowerBound - 1) * cellW} y2="70" stroke={RED} strokeWidth="1.6" strokeDasharray="3 2" />
        )}
        <text x="160" y="80" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
          {showInequality ? `a > ${lowerBound}` : ""} {showRange ? `and a ≤ ${aMax}` : ""}
        </text>
      </svg>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          a = {aValues.join(", ")} → {aValues.length} triangles
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
