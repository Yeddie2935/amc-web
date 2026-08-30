import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A target rate found by subtracting age from a fixed base, then taking a
 * percentage of what's left — the subtraction has to happen first, or the
 * percentage is taken of the wrong number. Five beats: (0) the base scale
 * and the age to remove; (1) the age subtracted, leaving the max; (2) the
 * trap — the percentage taken of the base instead; (3) the real percentage
 * of the max, filled in; (4) rounded, with the badge.
 * Data: { baseRate, age, percent }.
 */
export function HeartRateZoneScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const baseRate = num(data.baseRate, 220);
  const age = num(data.age, 26);
  const percent = num(data.percent, 80);
  if (baseRate <= 0 || age <= 0 || age >= baseRate) return null;

  const maxHR = baseRate - age;
  const rawTarget = (percent / 100) * maxHR;
  const rounded = Math.round(rawTarget);
  const trapValue = Math.round((percent / 100) * baseRate);
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(trapValue));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showSubtract = step >= 1;
  const showTrap = step >= 2 && !isFinal;
  const showFill = step >= 3 || isFinal;

  const W = 320;
  const x0 = 22;
  const xEnd = W - 22;
  const x = (v: number) => x0 + (v / baseRate) * (xEnd - x0);
  const scaleY = 34;
  const fillY = 76;
  const H = 118;

  const caption = isFinal
    ? `${percent}% × ${maxHR} = ${rawTarget.toFixed(1)} → ${rounded} bpm`
    : step === 0
    ? `base ${baseRate}, athlete is ${age} years old`
    : showTrap
    ? "skipping the subtraction takes the percentage of the wrong number"
    : showFill
    ? `${percent}% of the max heart rate`
    : `${baseRate} − ${age} = ${maxHR} (max heart rate)`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <rect x={x0} y={scaleY} width={xEnd - x0} height={10} rx={5} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} />
        <text x={x0} y={scaleY - 6} fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
          0
        </text>
        <text x={xEnd} y={scaleY - 6} textAnchor="end" fontSize="9" fontWeight="800" fill={INK} fontFamily={FONT}>
          {baseRate}
        </text>

        <AnimatePresence>
          {showSubtract && (
            <motion.g key="age" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={x(maxHR)} y={scaleY} width={x(baseRate) - x(maxHR)} height={10} rx={2} fill="#fee2e2" stroke={BAD} strokeWidth={1.2} />
              <line x1={x(maxHR)} y1={scaleY - 3} x2={x(maxHR)} y2={scaleY + 13} stroke={INK} strokeWidth={1.6} />
              <text x={x(maxHR)} y={scaleY + 26} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={FONT}>
                {maxHR}
              </text>
              <text x={(x(maxHR) + x(baseRate)) / 2} y={scaleY + 26} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={BAD} fontFamily={FONT}>
                −{age}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1={x(trapValue)} y1={scaleY - 10} x2={x(trapValue)} y2={scaleY + 20} stroke="#d97706" strokeWidth={1.6} strokeDasharray="3 2" />
            <text x={x(trapValue)} y={scaleY - 13} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#d97706" fontFamily={FONT}>
              {trapValue}
            </text>
          </motion.g>
        )}

        <rect x={x0} y={fillY} width={xEnd - x0} height={14} rx={7} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} />
        <AnimatePresence>
          {showFill && (
            <motion.rect
              key="fill"
              x={x0}
              y={fillY}
              height={14}
              rx={7}
              fill={isFinal ? WIN : MARK}
              initial={{ width: 0 }}
              animate={{ width: x(rawTarget) - x0 }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            />
          )}
        </AnimatePresence>
        {showFill && (
          <motion.text
            x={x(rawTarget) + 6}
            y={fillY + 11}
            fontSize="10"
            fontWeight="800"
            fill={isFinal ? WIN : MARK}
            fontFamily={FONT}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isFinal ? rounded : rawTarget.toFixed(1)}
          </motion.text>
        )}
      </svg>

      <AnimatePresence>
        {showTrap && (
          <motion.div
            key="trapnote"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 300 }}
          >
            {percent}% of {baseRate} is {trapValue}{trap ? ` — choice ${trap.label} traps you here` : ""}, but the age must be subtracted first.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
