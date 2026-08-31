import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * Bisecting one angle of a triangle carves out a brand new triangle with its
 * own angle sum to solve, not a copy of the angle that got bisected — the
 * scene finds the real base angles from the given apex angle, splits one
 * base angle in half at the real bisector point, then has to survive the
 * trap of assuming the new triangle's third angle just copies the bisected
 * half before actually computing it from 180°.
 * Data: { apexAngle } (triangle CAT, apex at A, TR bisects angle ATC).
 */
export function IsoscelesBisectorAngleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const apexAngle = Math.max(1, num(data.apexAngle, 36));

  const baseAngle = (180 - apexAngle) / 2;
  const halfBase = baseAngle / 2;
  const angleR = 180 - baseAngle - halfBase;
  const answerOk = problem.shortAnswer == null || `${angleR}°` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${angleR}°, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === `${halfBase}°`);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showBisect = step >= 1;
  const showTrap = step === 2 && !isFinal;

  // triangle C(bottom-left) A(top) T(bottom-right), matching the real diagram
  const C = { x: 40, y: 190 };
  const T = { x: 220, y: 190 };
  const A = { x: 105, y: 20 };
  const R = { x: C.x + (A.x - C.x) * 0.42, y: C.y + (A.y - C.y) * 0.42 };

  const W = 260;
  const H = 210;

  const caption = isFinal
    ? `180° − ${baseAngle}° − ${halfBase}° = ${angleR}°`
    : showTrap
    ? trapChoice
      ? `assuming ∠CRT just copies the bisected half, ${halfBase}° — choice ${trapChoice.label}, but CRT is its own triangle`
      : `∠CRT isn't the same as the bisected ${halfBase}° angle — it needs its own triangle's angle sum`
    : showBisect
    ? `TR bisects ∠ATC: ${baseAngle}° ÷ 2 = ${halfBase}°`
    : `∠ACT = ∠ATC = (180° − ${apexAngle}°) ÷ 2 = ${baseAngle}°`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${T.x},${T.y}`} fill="none" stroke={INK} strokeWidth={2} />
        <text x={A.x} y={A.y - 8} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          A
        </text>
        <text x={C.x - 12} y={C.y + 6} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          C
        </text>
        <text x={T.x + 12} y={T.y + 6} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          T
        </text>

        <motion.text x={A.x} y={A.y + 28} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {apexAngle}°
        </motion.text>
        <motion.text x={C.x + 22} y={C.y - 10} fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {baseAngle}°
        </motion.text>
        <motion.text x={T.x - 30} y={T.y - 10} fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {baseAngle}°
        </motion.text>

        {showBisect && (
          <motion.g initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}>
            <line x1={R.x} y1={R.y} x2={T.x} y2={T.y} stroke={WIN} strokeWidth={2} />
          </motion.g>
        )}
        {showBisect && (
          <>
            <circle cx={R.x} cy={R.y} r={3.5} fill={WIN} />
            <text x={R.x - 14} y={R.y + 4} fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              R
            </text>
            <text x={T.x - 46} y={T.y - 26} fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {halfBase}°
            </text>
            <text x={T.x - 20} y={T.y - 12} fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {halfBase}°
            </text>
          </>
        )}

        {(showTrap || isFinal) && (
          <motion.text x={R.x + 18} y={R.y + 30} fontSize="11" fontWeight="800" fill={isFinal ? WIN : BAD} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            ∠R = {isFinal ? angleR : halfBase}°
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
          fontSize: 11,
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
