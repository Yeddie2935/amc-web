import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const PURPLE = "#a855f7";
const DIM = "#94a3b8";

/**
 * Three circles solve to a radius from different given quantities (a radius,
 * a circumference, an area), then line up smallest to largest on a number
 * line. Data: { rX: 3.14159, circumferenceY: 25.13, areaZ: 28.27 }.
 */
export function CircleRadiusOrderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rX = num(data.rX, Math.PI);
  const circumferenceY = num(data.circumferenceY, 8 * Math.PI);
  const areaZ = num(data.areaZ, 9 * Math.PI);
  const rY = Math.round((circumferenceY / (2 * Math.PI)) * 1000) / 1000;
  const rZ = Math.round(Math.sqrt(areaZ / Math.PI) * 1000) / 1000;

  const isFinal = step >= totalSteps - 1;
  const showY = step >= 1;
  const showZ = step >= 2;
  const showLine = isFinal;

  const R = (r: number) => 14 + r * 9;
  const circles = [
    { name: "X", r: rX, color: BLUE, given: "radius = π", solved: `r = π ≈ ${rX.toFixed(2)}` },
    { name: "Y", r: rY, color: ORANGE, given: "circumference = 8π", solved: `2πr = 8π → r = ${rY}` },
    { name: "Z", r: rZ, color: PURPLE, given: "area = 9π", solved: `πr² = 9π → r = ${rZ}` },
  ];

  const cxAt = [70, 200, 330];
  const lineMin = 2.5;
  const lineMax = 4.5;
  const lineX = (r: number) => 30 + ((r - lineMin) / (lineMax - lineMin)) * 340;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0 ? "circle X's radius is given directly" : step === 1 ? "solve circle Y's radius from its circumference" : showZ && !showLine ? "solve circle Z's radius from its area" : "line up the radii, smallest to largest"}
      </div>

      {!showLine && (
        <svg viewBox="0 0 400 220" width="100%" style={{ maxWidth: 420 }}>
          {circles.map((c, i) => {
            const active = i === 0 || (i === 1 && showY) || (i === 2 && showZ);
            return (
              <g key={c.name}>
                <circle cx={cxAt[i]} cy="90" r={active ? R(c.r) : 4} fill="none" stroke={active ? c.color : "#cbd5e1"} strokeWidth="2.6" />
                <text x={cxAt[i]} y="96" textAnchor="middle" fontSize="13" fontWeight="900" fill={active ? c.color : DIM} fontFamily={FONT}>
                  {c.name}
                </text>
                <text x={cxAt[i]} y="150" textAnchor="middle" fontSize="10.5" fontWeight="750" fill={DIM} fontFamily={FONT}>
                  {c.given}
                </text>
                <AnimatePresence>
                  {active && (
                    <motion.text
                      key="solved"
                      x={cxAt[i]}
                      y="168"
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="800"
                      fill={c.color}
                      fontFamily={FONT}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {c.solved}
                    </motion.text>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>
      )}

      {showLine && (
        <svg viewBox="0 0 400 100" width="100%" style={{ maxWidth: 420 }}>
          <line x1="30" y1="50" x2="370" y2="50" stroke="#cbd5e1" strokeWidth="2" />
          {[3, 3.5, 4].map((t) => (
            <g key={t}>
              <line x1={lineX(t)} y1="45" x2={lineX(t)} y2="55" stroke="#cbd5e1" strokeWidth="2" />
              <text x={lineX(t)} y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={FONT}>
                {t}
              </text>
            </g>
          ))}
          {circles.map((c) => (
            <motion.g key={c.name} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <circle cx={lineX(c.r)} cy="50" r="9" fill={c.color} />
              <text x={lineX(c.r)} y="54" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">
                {c.name}
              </text>
            </motion.g>
          ))}
          <text x="200" y="94" textAnchor="middle" fontSize="12.5" fontWeight="900" fill={IND} fontFamily={FONT}>
            Z, X, Y
          </text>
        </svg>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
