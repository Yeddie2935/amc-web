import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const GOLD = "#d97706";
const GREEN = "#16a34a";
const RED = "#dc2626";

/**
 * Given the base and area of an isosceles triangle, first solve for the
 * altitude from the area formula, then drop that altitude to bisect the
 * base, and finally read the congruent side off as the hypotenuse of the
 * resulting right triangle via the Pythagorean theorem. A beat is spent on
 * the trap of stopping at the altitude value itself, which is a smaller
 * number that can look like a plausible answer on its own.
 * Data: { base, area }.
 */
export function IsoscelesAreaToSideScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base = num(data.base, 0);
  const area = num(data.area, 0);
  const half = base / 2;
  const height = base > 0 ? (2 * area) / base : NaN;
  const sideSquared = height * height + half * half;
  const side = Number.isFinite(sideSquared) ? Math.sqrt(sideSquared) : NaN;

  const matches = problem.shortAnswer == null || String(side) === String(problem.shortAnswer);
  const failure = !Number.isFinite(side)
    ? "base must be positive to solve for the height"
    : !matches
    ? `computed side ${side}, stored answer is ${problem.shortAnswer}`
    : "";

  const trapChoice = (problem.choices ?? []).find((c) => c.text.replace(/[−–—]/g, "-").trim() === String(height));

  const lastStep = totalSteps - 1;
  const phase = Math.min(step, 4);

  const A = { x: 42, y: 218 };
  const M = { x: 210, y: 218 };
  const C = { x: 378, y: 218 };
  const B = { x: 210, y: 58 };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 420 300" width="100%" style={{ maxWidth: 460 }}>
        <motion.polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill={phase >= 4 ? "#dcfce7" : "#eef2ff"}
          stroke={IND}
          strokeWidth="2.5"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <text x={A.x - 15} y={A.y + 18} fontSize="13" fontWeight="900" fill={INK}>A</text>
        <text x={B.x} y={B.y - 9} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK}>B</text>
        <text x={C.x + 7} y={C.y + 18} fontSize="13" fontWeight="900" fill={INK}>C</text>

        <text x={(A.x + M.x) / 2} y={A.y + 34} textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>
          base = {base}
        </text>

        {phase === 0 && (
          <motion.text x="210" y="150" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            area = {area}
          </motion.text>
        )}

        {phase >= 1 && (
          <>
            <motion.line x1={B.x} y1={B.y} x2={M.x} y2={M.y} stroke={GOLD} strokeWidth="3" strokeDasharray={phase === 1 ? "6 4" : undefined} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <path d={`M${M.x} ${M.y - 12}h12v12`} fill="none" stroke={GOLD} strokeWidth="2" />
            <motion.text x={M.x + 22} y={(B.y + M.y) / 2} fontSize="14" fontWeight="900" fill={GOLD} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              h = {height}
            </motion.text>
          </>
        )}

        {phase === 1 && (
          <g transform="translate(45 252)">
            <rect width="330" height="34" rx="10" fill="#fff7ed" stroke={GOLD} />
            <text x="165" y="22" textAnchor="middle" fontSize="13.5" fontWeight="900" fill={GOLD} fontFamily={FONT}>
              {area} = ½ × {base} × h, so h = {height}
            </text>
          </g>
        )}

        {phase >= 3 && (
          <>
            <line x1="118" y1={A.y - 7} x2="118" y2={A.y + 7} stroke={TEAL} strokeWidth="2.5" />
            <line x1="302" y1={A.y - 7} x2="302" y2={A.y + 7} stroke={TEAL} strokeWidth="2.5" />
            <motion.text x="126" y={A.y - 11} textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
              {half}
            </motion.text>
            {phase === 3 && (
              <motion.text x="294" y={A.y - 11} textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                {half}
              </motion.text>
            )}
            <motion.polygon points={`${A.x},${A.y} ${B.x},${B.y} ${M.x},${M.y}`} fill="#fff7ed" stroke={GOLD} strokeWidth="2" initial={{ opacity: 0.15 }} animate={{ opacity: phase >= 4 ? 0.55 : 0.3 }} />
          </>
        )}

        {phase >= 4 && (
          <motion.text x={105} y={119} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {side}
          </motion.text>
        )}

        {phase === 4 && (
          <g transform="translate(30 252)">
            <rect width="360" height="34" rx="10" fill="#dcfce7" stroke={GREEN} />
            <text x="180" y="22" textAnchor="middle" fontSize="13.5" fontWeight="900" fill={GREEN} fontFamily={FONT}>
              {height}² + {half}² = {sideSquared} = {side}²
            </text>
          </g>
        )}

        <SvgAnswerBadge show={step >= lastStep} answer={problem.answer} cx={370} y={20} width={72} />
      </svg>

      <motion.span
        key={`${step}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: phase === 2 ? RED : phase >= 4 ? "#166534" : IND,
          background: phase === 2 ? "#fee2e2" : phase >= 4 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 2 ? "#fecaca" : phase >= 4 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {phase === 0
          ? "an isosceles triangle: base and area are given"
          : phase === 1
          ? "solve the area formula for the height"
          : phase === 2
          ? trapChoice
            ? `tempting: h = ${height} matches choice ${trapChoice.label}, but that's the height, not the congruent side`
            : `h = ${height} is the height, not the congruent side`
          : phase === 3
          ? "the altitude bisects the base into two equal halves"
          : "the congruent side is the hypotenuse of the right triangle"}
      </motion.span>

      <AnimatePresence>
        {failure && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: RED, textAlign: "center" }}
          >
            {failure}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
