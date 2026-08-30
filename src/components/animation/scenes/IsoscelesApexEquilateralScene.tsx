import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const ORANGE = "#f59e0b";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * Quadrilateral ABCD with diagonal AC; triangle ADC is isosceles (AD=CD),
 * and its 60° apex forces the base angles to 60° too, making it equilateral.
 * Data: { AB: 10, BC: 10, CD: 17, DA: 17, angleD: 60 }.
 */
export function IsoscelesApexEquilateralScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const AB = num(data.AB, 10);
  const BC = num(data.BC, 10);
  const CD = num(data.CD, 17);
  const DA = num(data.DA, 17);
  const angleD = num(data.angleD, 60);
  const baseAngle = (180 - angleD) / 2;

  const isFinal = step >= totalSteps - 1;
  const showIsosceles = step >= 1;
  const showAngles = step >= 2;

  // Coordinates roughly matching the source diagram's layout.
  const A = { x: 165, y: 30 };
  const B = { x: 55, y: 90 };
  const C = { x: 60, y: 190 };
  const D = { x: 235, y: 185 };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "quadrilateral ABCD, diagonal AC drawn"
          : isFinal
            ? "so triangle ADC is equilateral"
            : showAngles
              ? "a 60° apex forces 60° base angles too"
              : "focus on triangle ADC: AD = CD"}
      </div>

      <svg viewBox="0 0 280 220" width="100%" style={{ maxWidth: 300 }}>
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`} fill="#f8fafc" stroke={DIM} strokeWidth="1.6" />
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth="1.6" strokeDasharray="5 4" />

        {!showIsosceles && (
          <>
            <text x={(A.x + B.x) / 2 - 12} y={(A.y + B.y) / 2 - 4} fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
              {AB}
            </text>
            <text x={(B.x + C.x) / 2 - 14} y={(B.y + C.y) / 2} fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
              {BC}
            </text>
          </>
        )}

        {[
          { p: A, t: "A", dx: 0, dy: -10 },
          { p: B, t: "B", dx: -16, dy: 0 },
          { p: C, t: "C", dx: -14, dy: 10 },
          { p: D, t: "D", dx: 16, dy: 4 },
        ].map(({ p, t, dx, dy }) => (
          <text key={t} x={p.x + dx} y={p.y + dy} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>
            {t}
          </text>
        ))}

        <AnimatePresence>
          {showIsosceles && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke={ORANGE} strokeWidth="3" />
              <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke={ORANGE} strokeWidth="3" />
              <text x={(A.x + D.x) / 2 + 14} y={(A.y + D.y) / 2 - 4} fontSize="11" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
                {DA}
              </text>
              <text x={(C.x + D.x) / 2} y={(C.y + D.y) / 2 + 16} fontSize="11" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
                {CD}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAngles && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={D.x - 30} y={D.y - 8} fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>
                {angleD}°
              </text>
              <text x={A.x + 6} y={A.y + 22} fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>
                {baseAngle}°
              </text>
              <text x={C.x + 14} y={C.y - 6} fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>
                {baseAngle}°
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {isFinal && (
          <motion.polygon
            points={`${A.x},${A.y} ${C.x},${C.y} ${D.x},${D.y}`}
            fill={WIN}
            fillOpacity="0.18"
            stroke={WIN}
            strokeWidth="2.2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </svg>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          AC = AD = CD = {DA}
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
