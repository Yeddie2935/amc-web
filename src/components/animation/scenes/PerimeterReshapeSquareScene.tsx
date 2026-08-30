import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";

/**
 * A triangle's three sides sum to a shared perimeter, which then reshapes
 * into a square (dividing by 4 for the side, squaring for the area).
 * Data: { sides: [6.1, 8.2, 9.7] }.
 */
export function PerimeterReshapeSquareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sides = Array.isArray(data.sides) ? (data.sides as number[]).map((s) => num(s, 0)) : [6.1, 8.2, 9.7];
  const perimeter = sides.reduce((a, b) => a + b, 0);
  const squareSide = perimeter / 4;
  const area = squareSide * squareSide;

  const isFinal = step >= totalSteps - 1;
  const showPerimeter = step >= 1;
  const showSquare = step >= 2;

  const A = { x: 90, y: 100 };
  const B = { x: 210, y: 100 };
  const C = { x: 150, y: 25 };

  const sq = 14 * squareSide;
  const sqX = 160 - sq / 2;
  const sqY = 85 - sq / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "a triangle with three given sides"
          : isFinal
            ? "compute the square's area"
            : showSquare
              ? "the square has the same perimeter"
              : "add the three sides for the perimeter"}
      </div>

      {!showSquare && (
        <svg viewBox="0 0 300 150" width="100%" style={{ maxWidth: 320 }}>
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#f8fafc" stroke={ORANGE} strokeWidth="2.4" />
          <text x={(A.x + B.x) / 2} y={A.y + 18} textAnchor="middle" fontSize="12" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
            {sides[0]}
          </text>
          <text x={(B.x + C.x) / 2 + 18} y={(B.y + C.y) / 2} textAnchor="middle" fontSize="12" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
            {sides[1]}
          </text>
          <text x={(A.x + C.x) / 2 - 18} y={(A.y + C.y) / 2} textAnchor="middle" fontSize="12" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
            {sides[2]}
          </text>

          <AnimatePresence>
            {showPerimeter && (
              <motion.text x="150" y="140" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {sides.join(" + ")} = {perimeter}
              </motion.text>
            )}
          </AnimatePresence>
        </svg>
      )}

      {showSquare && (
        <svg viewBox="0 0 300 165" width="100%" style={{ maxWidth: 320 }}>
          <motion.rect x={sqX} y={sqY} width={sq} height={sq} fill="#e0e7ff" stroke={IND} strokeWidth="2.4" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} transition={{ type: "spring", stiffness: 120, damping: 16 }} />
          <text x="160" y={sqY - 10} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={FONT}>
            side = {perimeter} ÷ 4 = {squareSide}
          </text>
          <AnimatePresence>
            {isFinal && (
              <motion.text x="160" y={sqY + sq + 24} textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {squareSide}² = {area}
              </motion.text>
            )}
          </AnimatePresence>
        </svg>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
