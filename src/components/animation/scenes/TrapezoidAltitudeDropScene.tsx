import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const ORANGE = "#f59e0b";
const BLUE = "#2563eb";
const DIM = "#94a3b8";

/**
 * Dropping altitudes from B and C splits the trapezoid into two right
 * triangles and a rectangle; the Pythagorean theorem finds the base pieces.
 * Data: { AB: 30, BC: 50, CD: 25, height: 24 }.
 */
export function TrapezoidAltitudeDropScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const AB = num(data.AB, 30);
  const BC = num(data.BC, 50);
  const CD = num(data.CD, 25);
  const height = num(data.height, 24);

  const leftLeg = Math.sqrt(AB * AB - height * height);
  const rightLeg = Math.sqrt(CD * CD - height * height);
  const AD = leftLeg + BC + rightLeg;
  const perimeter = AB + BC + CD + AD;

  const isFinal = step >= totalSteps - 1;
  const showLeft = step >= 1;
  const showRight = step >= 2;

  const U = 2.4;
  const baseY = 110;
  const topY = baseY - height * U;
  const Ax = 20;
  const Ex = Ax + leftLeg * U;
  const Fx = Ex + BC * U;
  const Dx = Fx + rightLeg * U;
  const Bx = Ex;
  const Cx = Fx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "trapezoid ABCD: AB=30, BC=50, CD=25"
          : isFinal
            ? "add all four sides"
            : showRight
              ? "the right triangle gives the other base piece"
              : "drop altitudes; the left triangle gives one base piece"}
      </div>

      <svg viewBox="0 0 280 140" width="100%" style={{ maxWidth: 300 }}>
        <polygon points={`${Ax},${baseY} ${Bx},${topY} ${Cx},${topY} ${Dx},${baseY}`} fill="#f8fafc" stroke={INK} strokeWidth="2" />

        <line x1={Bx} y1={topY} x2={Bx} y2={baseY} stroke={DIM} strokeWidth="1.4" strokeDasharray="3 2" />
        <line x1={Cx} y1={topY} x2={Cx} y2={baseY} stroke={DIM} strokeWidth="1.4" strokeDasharray="3 2" />
        <rect x={Bx - 6} y={baseY - 6} width="6" height="6" fill="none" stroke={DIM} strokeWidth="1" />

        {[
          { t: "A", x: Ax, y: baseY + 14 },
          { t: "B", x: Bx, y: topY - 8 },
          { t: "C", x: Cx, y: topY - 8 },
          { t: "D", x: Dx, y: baseY + 14 },
        ].map(({ t, x, y }) => (
          <text key={t} x={x} y={y} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>
            {t}
          </text>
        ))}

        <text x={(Ax + Bx) / 2 - 12} y={(baseY + topY) / 2} fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={FONT}>{AB}</text>
        <text x={(Bx + Cx) / 2} y={topY - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={FONT}>{BC}</text>
        <text x={(Cx + Dx) / 2 + 12} y={(baseY + topY) / 2} fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={FONT}>{CD}</text>
        <text x={Bx + 4} y={(baseY + topY) / 2} fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>{height}</text>

        <AnimatePresence>
          {showLeft && (
            <motion.g key="left" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <polygon points={`${Ax},${baseY} ${Bx},${topY} ${Bx},${baseY}`} fill={BLUE} fillOpacity="0.18" stroke={BLUE} strokeWidth="1.4" />
              <text x={(Ax + Bx) / 2} y={baseY + 26} textAnchor="middle" fontSize="10" fontWeight="900" fill={BLUE} fontFamily={FONT}>
                {leftLeg}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRight && (
            <motion.g key="right" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <polygon points={`${Dx},${baseY} ${Cx},${topY} ${Cx},${baseY}`} fill={BLUE} fillOpacity="0.18" stroke={BLUE} strokeWidth="1.4" />
              <text x={(Cx + Dx) / 2} y={baseY + 26} textAnchor="middle" fontSize="10" fontWeight="900" fill={BLUE} fontFamily={FONT}>
                {rightLeg}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          AD={leftLeg}+{BC}+{rightLeg}={AD}, perimeter={AB}+{BC}+{CD}+{AD}={perimeter}
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
