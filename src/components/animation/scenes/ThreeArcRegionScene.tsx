import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * Three curved boundary pieces of the same radius are really fractions of
 * one circle in disguise — the scene draws the real semicircle-plus-two-
 * quarter-circle shape, spends a beat on the trap of measuring its bounding
 * box as if the boundary were straight, then adds the three real arc
 * fractions and shows they total exactly one full circle before computing
 * that circle's real area. Data: { radius }.
 */
export function ThreeArcRegionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const radius = Math.max(1, num(data.radius, 5));

  const fractions = [1 / 2, 1 / 4, 1 / 4];
  const fracSum = fractions.reduce((a, b) => a + b, 0);
  const area = fracSum * Math.PI * radius * radius;
  const areaLabel = `${radius * radius}π`;
  const answerOk = problem.shortAnswer == null || areaLabel === String(problem.shortAnswer).trim();
  const failure = Math.abs(fracSum - 1) > 1e-9 ? `arc fractions sum to ${fracSum}, expected 1` : !answerOk ? `computed ${areaLabel}, stored answer is ${problem.shortAnswer}` : "";

  const trapArea = 2 * radius * radius;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapArea));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showCombine = step >= 2 || isFinal;

  const unit = 12;
  const cx = 150;
  const cy = 130;
  const r = radius * unit;
  const W = 300;
  const H = 190;

  // A = bottom cusp, B = left, D = right, C = top — matching the real diagram
  const A = { x: cx, y: cy };
  const Bc = { x: cx - r, y: cy - r };
  const Dc = { x: cx + r, y: cy - r };
  const C = { x: cx, y: cy - 2 * r };

  const caption = isFinal
    ? `π × ${radius}² = ${areaLabel}`
    : showCombine
    ? `1/2 + 1/4 + 1/4 = 1 full circle`
    : showTrap
    ? trapChoice
      ? `treating the bounding box as the area: ${2 * radius} × ${radius} = ${trapArea} — choice ${trapChoice.label}, but the boundary is curved`
      : `the bounding box gives ${trapArea}, but the real boundary curves`
    : `semicircle BCD (top) + quarter-circles AB and AD (bottom)`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {showTrap && (
          <rect x={Bc.x} y={C.y} width={2 * r} height={r} fill="none" stroke={BAD} strokeWidth={2} strokeDasharray="4 3" />
        )}

        <motion.path
          d={`M ${A.x} ${A.y} A ${r} ${r} 0 0 0 ${Bc.x} ${Bc.y} A ${r} ${r} 0 0 1 ${Dc.x} ${Dc.y} A ${r} ${r} 0 0 0 ${A.x} ${A.y} Z`}
          fill={showCombine || isFinal ? WIN : IND}
          fillOpacity={0.3}
          stroke={INK}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <text x={A.x} y={A.y + 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
          A
        </text>
        <text x={Bc.x - 12} y={Bc.y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
          B
        </text>
        <text x={Dc.x + 12} y={Dc.y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
          D
        </text>
        <text x={C.x} y={C.y - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
          C
        </text>

        {showCombine && (
          <motion.text x={cx} y={cy - r} textAnchor="middle" fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            r = {radius}
          </motion.text>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
