import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const frac = (n: number, d: number) => {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = gcd(Math.round(n), Math.round(d)) || 1;
  return `${n / g}/${d / g}`;
};

/**
 * A battery drains at one rate when idle and a much faster rate when in
 * use — the fraction used is a sum of two different-rate segments, not a
 * single rate over the whole elapsed time. Five beats: (0) the two rates;
 * (1) the elapsed time split into idle and active hours; (2) the trap —
 * treating the whole span as idle; (3) the real fraction used, drained in
 * two different-rate segments; (4) how long the rest lasts at idle rate.
 * Data: { idleHours, activeHours, elapsedTotal, activeUsed }.
 */
export function BatteryDualRateScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const idleHours = num(data.idleHours, 24);
  const activeHours = num(data.activeHours, 3);
  const elapsedTotal = num(data.elapsedTotal, 9);
  const activeUsed = num(data.activeUsed, 1);
  if (idleHours <= 0 || activeHours <= 0 || elapsedTotal <= 0 || activeUsed > elapsedTotal) return null;

  const idleUsed = elapsedTotal - activeUsed;
  const idleRate = 1 / idleHours;
  const activeRate = 1 / activeHours;
  const denom = idleHours * activeHours;
  const usedNumerator = idleUsed * activeHours + activeUsed * idleHours;
  const usedFraction = usedNumerator / denom;
  const remainingNumerator = denom - usedNumerator;
  const remainingFraction = remainingNumerator / denom;
  const remainingIdleHours = remainingNumerator / activeHours;

  const trapUsed = elapsedTotal / idleHours;
  const trapRemainingHours = (1 - trapUsed) * idleHours;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(Math.round(trapRemainingHours)));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showSplit = step >= 1;
  const showTrap = step >= 2 && !isFinal;
  const showUsed = step >= 3 || isFinal;

  const W = 300;
  const barY = 44;
  const barH = 22;
  const idleW = (idleUsed / elapsedTotal) * (W - 40);
  const activeW = (activeUsed / elapsedTotal) * (W - 40);

  const caption = isFinal
    ? `${frac(remainingNumerator, denom)} ÷ ${frac(1, idleHours)} = ${remainingIdleHours} more hours`
    : step === 0
    ? `idle drains it in ${idleHours}h, active use drains it in ${activeHours}h`
    : showTrap
    ? "the phone wasn't idle the whole time"
    : showUsed
    ? `${idleUsed}/${idleHours} + ${activeUsed}/${activeHours} = ${frac(usedNumerator, denom)} used`
    : `${idleUsed} idle hours + ${activeUsed} active hour${activeUsed === 1 ? "" : "s"} = ${elapsedTotal} hours`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 96`} width="100%" style={{ maxWidth: 340 }}>
        <rect x={20} y={barY} width={W - 40} height={barH} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.2} />
        <rect x={W - 18} y={barY + 6} width={5} height={barH - 12} rx={1.5} fill="#cbd5e1" />

        <AnimatePresence>
          {showSplit && (
            <motion.g key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={20} y={barY} width={idleW} height={barH} rx={6} fill={`${MARK}22`} stroke={MARK} strokeWidth={1.2} />
              <rect x={20 + idleW} y={barY} width={activeW} height={barH} fill="#fee2e2" stroke={BAD} strokeWidth={1.2} />
              <text x={20 + idleW / 2} y={barY + barH + 13} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={MARK} fontFamily={FONT}>
                idle {idleUsed}h
              </text>
              <text x={20 + idleW + activeW / 2} y={barY + barH + 13} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={BAD} fontFamily={FONT}>
                active {activeUsed}h
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showUsed && (
            <motion.g key="used" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={20} y={barY - 22} width={idleUsed * idleRate * (W - 40)} height={12} rx={4} fill={MARK} />
              <rect x={20 + idleUsed * idleRate * (W - 40)} y={barY - 22} width={activeUsed * activeRate * (W - 40)} height={12} rx={4} fill={BAD} />
              <text x={20} y={barY - 28} fontSize="8.5" fontWeight="800" fill={INK} fontFamily={FONT}>
                battery used ({isFinal ? "green shows what's left" : "growing"})
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {isFinal && (
          <motion.rect
            initial={{ width: 0 }}
            animate={{ width: remainingFraction * (W - 40) }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            x={20 + usedFraction * (W - 40)}
            y={barY - 22}
            height={12}
            rx={4}
            fill={WIN}
          />
        )}
      </svg>

      <AnimatePresence>
        {showTrap && (
          <motion.div
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 300 }}
          >
            treating all {elapsedTotal}h as idle gives {Math.round(trapRemainingHours)} more hours{trap ? ` — choice ${trap.label} traps you here` : ""}, but {activeUsed} of those hours drained {idleHours / activeHours}× faster.
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
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 320,
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
