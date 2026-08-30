import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const WIN = "#16a34a";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function fmtFrac(v: number) {
  if (Number.isInteger(v)) return String(v);
  const whole = Math.floor(v);
  const frac = v - whole;
  const denom = 4;
  let n = Math.round(frac * denom);
  let d = denom;
  const g = gcd(n, d);
  n /= g;
  d /= g;
  return whole > 0 ? `${whole} ${n}/${d}` : `${n}/${d}`;
}

/**
 * A walk south-east-south combines its two vertical legs into one right
 * triangle, then a 3-4-5 relation gives the direct-line hypotenuse.
 * Data: { southLeg1: 0.5, eastLeg: 0.75, southLeg2: 0.5 }.
 */
export function WalkPythagoreanScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const southLeg1 = num(data.southLeg1, 0.5);
  const eastLeg = num(data.eastLeg, 0.75);
  const southLeg2 = num(data.southLeg2, 0.5);
  const totalSouth = southLeg1 + southLeg2;
  const hyp = Math.sqrt(totalSouth * totalSouth + eastLeg * eastLeg);

  const isFinal = step >= totalSteps - 1;
  const showCombine = step >= 1;
  const showTriangle = step >= 2;

  const U = 90; // px per mile
  const startX = 60;
  const startY = 20;
  const p1 = { x: startX, y: startY + southLeg1 * U };
  const p2 = { x: startX + eastLeg * U, y: p1.y };
  const p3 = { x: p2.x, y: p2.y + southLeg2 * U };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "south, then east, then south again"
          : isFinal
            ? "a 3-4-5 triangle gives the hypotenuse"
            : showTriangle
              ? "form the direct-line right triangle"
              : "combine the two south legs"}
      </div>

      <svg viewBox="0 0 240 160" width="100%" style={{ maxWidth: 260 }}>
        <circle cx={startX} cy={startY} r="4" fill={INK} />
        <text x={startX - 10} y={startY - 6} fontSize="10" fontWeight="800" fill={INK} fontFamily={FONT}>
          start
        </text>

        {!showTriangle && (
          <>
            <line x1={startX} y1={startY} x2={p1.x} y2={p1.y} stroke={BLUE} strokeWidth="3" />
            <text x={startX - 30} y={(startY + p1.y) / 2 + 4} fontSize="10.5" fontWeight="800" fill={BLUE} fontFamily={FONT}>
              {fmtFrac(southLeg1)}
            </text>

            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={ORANGE} strokeWidth="3" />
            <text x={(p1.x + p2.x) / 2} y={p1.y - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
              {fmtFrac(eastLeg)}
            </text>

            <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke={BLUE} strokeWidth="3" />
            <text x={p2.x + 10} y={(p2.y + p3.y) / 2 + 4} fontSize="10.5" fontWeight="800" fill={BLUE} fontFamily={FONT}>
              {fmtFrac(southLeg2)}
            </text>
            <circle cx={p3.x} cy={p3.y} r="4" fill={INK} />

            <AnimatePresence>
              {showCombine && (
                <motion.text x="120" y="145" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  total south = {fmtFrac(totalSouth)}
                </motion.text>
              )}
            </AnimatePresence>
          </>
        )}

        {showTriangle && (
          <>
            <line x1={startX} y1={startY} x2={p3.x} y2={startY} stroke={ORANGE} strokeWidth="3" />
            <text x={(startX + p3.x) / 2} y={startY - 8} textAnchor="middle" fontSize="11" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
              {fmtFrac(eastLeg)}
            </text>

            <line x1={p3.x} y1={startY} x2={p3.x} y2={p3.y} stroke={BLUE} strokeWidth="3" />
            <text x={p3.x + 10} y={(startY + p3.y) / 2 + 4} fontSize="11" fontWeight="800" fill={BLUE} fontFamily={FONT}>
              {fmtFrac(totalSouth)}
            </text>
            <circle cx={p3.x} cy={p3.y} r="4" fill={INK} />

            <motion.line x1={startX} y1={startY} x2={p3.x} y2={p3.y} stroke={WIN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />

            {isFinal && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={(startX + p3.x) / 2 - 40} y={(startY + p3.y) / 2 - 12} width="34" height="18" rx="4" fill="#fff" fillOpacity="0.85" />
                <text x={(startX + p3.x) / 2 - 23} y={(startY + p3.y) / 2} textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN} fontFamily={FONT}>
                  {fmtFrac(hyp)}
                </text>
              </motion.g>
            )}
          </>
        )}
      </svg>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: IND, fontFamily: FONT }}>
          3-4-5 scaled by 1/4: legs {fmtFrac(eastLeg)}, {fmtFrac(totalSouth)} → hyp {fmtFrac(hyp)}
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
