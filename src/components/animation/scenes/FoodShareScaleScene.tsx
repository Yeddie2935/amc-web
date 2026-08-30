import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * Oversized restaurant portions: a fixed amount of food (in meal units) fed
 * more diners than it was ordered for, so each diner's real share is less
 * than one meal. That per-diner share, scaled to a new headcount, gives the
 * meals actually needed. Five beats: (0) the meals feeding the oversized
 * crowd; (1) the per-diner share as a reduced fraction, drawn as a portion
 * plate; (2) the trap — the old headcount isn't the answer; (3) the new,
 * smaller crowd each drawing that share; (4) the total meals and the badge.
 * Data: { meals, fedPeople, targetPeople }.
 */
export function FoodShareScaleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const meals = Math.round(num(data.meals, 12));
  const fedPeople = Math.round(num(data.fedPeople, 18));
  const targetPeople = Math.round(num(data.targetPeople, 12));
  if (meals <= 0 || fedPeople <= 0 || targetPeople <= 0) return null;

  const g = gcd(meals, fedPeople) || 1;
  const numer = meals / g;
  const denom = fedPeople / g;
  const rate = meals / fedPeople;
  const neededMeals = Math.round(targetPeople * rate);

  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(fedPeople));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRate = step >= 1;
  const showTrap = step >= 2 && !isFinal;
  const showScale = step >= 3 || isFinal;

  const portionDeg = (numer / denom) * 360;

  const caption = isFinal
    ? `${targetPeople} × ${numer}/${denom} = ${neededMeals} meals`
    : step === 0
    ? `${meals} meals were ordered, but they fed ${fedPeople} people`
    : showTrap
    ? "scale the per-diner share to the new headcount"
    : `each diner's real share: ${meals} ÷ ${fedPeople} = ${numer}/${denom} meal`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: 300 }}>
        {Array.from({ length: meals }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -8, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.05 }}
            style={{ fontSize: 15 }}
          >
            🍽️
          </motion.span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", maxWidth: 300 }}>
        {Array.from({ length: fedPeople }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 8, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.03 }}
            style={{ fontSize: 12 }}
          >
            🧍
          </motion.span>
        ))}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, color: DIM }}>
        {fedPeople} diners shared {meals} oversized meals
      </div>

      <AnimatePresence>
        {showRate && (
          <motion.div
            key="portion"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: `conic-gradient(${MARK} ${portionDeg}deg, #e2e8f0 0deg)`,
                border: `1.6px solid ${MARK}`,
              }}
            />
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, color: MARK }}>
              {numer}/{denom} meal each
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTrap && (
          <motion.div
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 300 }}
          >
            {fedPeople} is the old headcount{trap ? ` — choice ${trap.label} traps you here` : ""}, not how many meals the {targetPeople} friends need.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScale && (
          <motion.div key="scale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", maxWidth: 260 }}>
              {Array.from({ length: targetPeople }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -6, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.06 }}
                  style={{ fontSize: 13 }}
                >
                  🧍
                </motion.span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: 260 }}>
              {Array.from({ length: neededMeals }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 + i * 0.08 }}
                  style={{ fontSize: 15 }}
                >
                  🍽️
                </motion.span>
              ))}
            </div>
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
