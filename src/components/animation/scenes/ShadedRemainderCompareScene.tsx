import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const SHADE = "#a5b4fc";
const DIM = "#94a3b8";

function Figure({ kind, x, active }: { kind: "A" | "B" | "C"; x: number; active: boolean }) {
  const stroke = active ? IND : DIM;
  const opacity = active ? 1 : 0.34;
  const side = 82;
  const top = 48;
  const left = x - side / 2;
  return (
    <motion.g animate={{ opacity, scale: active ? 1.04 : 0.94 }} transition={{ type: "spring", stiffness: 220, damping: 20 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <text x={x} y="29" textAnchor="middle" fontSize="18" fontWeight="900" fill={stroke}>{kind}</text>
      {kind !== "C" ? (
        <>
          <rect x={left} y={top} width={side} height={side} fill={SHADE} stroke={stroke} strokeWidth="2" />
          {kind === "A" ? (
            <motion.circle cx={x} cy={top + side / 2} r={side / 2} fill="white" stroke={stroke} strokeWidth="2" initial={{ r: 0 }} animate={{ r: side / 2 }} transition={{ type: "spring", stiffness: 150, damping: 18 }} />
          ) : (
            [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], index) => (
              <motion.circle key={index} cx={x + dx * side / 4} cy={top + side / 2 + dy * side / 4} r={side / 4} fill="white" stroke={stroke} strokeWidth="1.8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.08, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            ))
          )}
        </>
      ) : (
        <>
          <circle cx={x} cy={top + side / 2} r={side / 2} fill={SHADE} stroke={stroke} strokeWidth="2" />
          <motion.rect x={x - side / (2 * Math.sqrt(2))} y={top + side / 2 - side / (2 * Math.sqrt(2))} width={side / Math.sqrt(2)} height={side / Math.sqrt(2)} fill="white" stroke={stroke} strokeWidth="2" initial={{ scale: 0.55, rotate: 45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 170, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        </>
      )}
      <line x1={left} y1="143" x2={left + side} y2="143" stroke={stroke} strokeWidth="1.4" />
      <path d={`M ${left} 143 l 8 -4 v 8 Z M ${left + side} 143 l -8 -4 v 8 Z`} fill={stroke} />
      <text x={x} y="158" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={stroke} fontFamily={FONT}>2 cm</text>
    </motion.g>
  );
}

/** Compare the literal shaded remainders in two 2×2 squares and a diameter-2 circle. */
export function ShadedRemainderCompareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.side, 2);
  const largeRadius = side / 2;
  const smallRadius = side / 4;
  const squareArea = side * side;
  const a = squareArea - Math.PI * largeRadius ** 2;
  const b = squareArea - 4 * Math.PI * smallRadius ** 2;
  const inscribedSquareArea = (2 * largeRadius) ** 2 / 2;
  const c = Math.PI * largeRadius ** 2 - inscribedSquareArea;
  const winner = c > a && c > b ? "C" : a === b ? "A=B" : a > b ? "A" : "B";
  const valid = Math.abs(a - b) < 1e-9 && winner === "C" && problem.answer === "C";
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const expressions = ["4 − π", "4 − 4(π/4) = 4 − π", "π − 2"];
  const barExpressions = ["4 − π", "4 − π", "π − 2"];
  const values = [a, b, c];

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 480 300" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="The shaded areas of figures A, B, and C are computed and compared">
        <text x="240" y="15" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "A: square minus its inscribed circle" : phase === 1 ? "B: four small circles regroup into the same circle area" : phase === 2 ? "C: circle minus its inscribed square" : "compare the three shaded remainders"}
        </text>

        <Figure kind="A" x={88} active={final || phase === 0} />
        <Figure kind="B" x={240} active={final || phase === 1} />
        <Figure kind="C" x={392} active={final || phase === 2} />

        {!final && (
          <motion.g key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <rect x="91" y="188" width="298" height="45" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="1.6" />
            <text x="240" y="216" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{expressions[phase]}</text>
            {phase === 1 && <text x="240" y="251" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT}>4 half-radius circles: 4 × π(1/2)² = π</text>}
            {phase === 2 && <text x="240" y="251" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT}>square diagonal 2 ⇒ area = 2² ÷ 2 = 2</text>}
          </motion.g>
        )}

        <AnimatePresence>
          {final && (
            <motion.g key="bars" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {values.map((value, index) => {
                const width = value * 105;
                const y = 181 + index * 25;
                return (
                  <g key={index}>
                    <text x="89" y={y + 12} textAnchor="end" fontSize="11" fontWeight="900" fill={index === 2 ? GREEN : INK} fontFamily={FONT}>{"ABC"[index]}  {barExpressions[index]}</text>
                    <motion.rect x="99" y={y} height="16" rx="8" fill={index === 2 ? "#86efac" : SHADE} stroke={index === 2 ? GREEN : IND} initial={{ width: 0 }} animate={{ width }} transition={{ delay: index * 0.15, type: "spring", stiffness: 160, damping: 19 }} />
                    <text x={107 + width} y={y + 12} fontSize="9.5" fontWeight="850" fill={index === 2 ? GREEN : DIM} fontFamily={FONT}>≈ {value.toFixed(2)}</text>
                  </g>
                );
              })}
              <text x="240" y="269" textAnchor="middle" fontSize="10" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>
                {valid ? "π − 2 > 4 − π, so C alone is largest" : `check failed: winner ${winner}, stored ${problem.answer}`}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        <SvgAnswerBadge show={final && valid} answer={problem.answer} cx={240} y={276} width={90} />
      </svg>
    </div>
  );
}
