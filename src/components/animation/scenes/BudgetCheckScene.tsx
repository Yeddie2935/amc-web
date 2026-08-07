import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// "Which of these candidates meet the target?" Each candidate shows its formula
// and computed value; on the final step every value is checked (✓/✗) against a
// single target, and failures dim out. Reusable for perimeter / cost / "which
// shapes can be made" style problems.
// Data: { target, unit?, names:[...], formulas:[...], values:[...] }.
export function BudgetCheckScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = num(data.target, 0);
  const unit = data.unit != null ? String(data.unit) : "";
  const names = strList(data.names);
  const formulas = strList(data.formulas);
  const values = Array.isArray(data.values) ? data.values.map((v) => num(v, 0)) : [];

  const last = totalSteps - 1;
  const check = step >= last;
  const final = step >= last;
  // The choices here are descriptive text, so the badge shows the letter.
  const answer = problem.answer ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%", padding: "8px 4px" }}>
      <div
        style={{
          fontFamily: numberFont,
          fontSize: 15,
          fontWeight: 700,
          color: "#92400e",
          background: "#fef3c7",
          padding: "4px 14px",
          borderRadius: 999,
        }}
      >
        Target = {target}{unit && ` ${unit}`}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 380 }}>
        {names.map((name, i) => {
          const pass = values[i] === target;
          const dim = check && !pass;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: dim ? 0.45 : 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.12 }}
              style={{
                display: "grid",
                gridTemplateColumns: "96px 1fr 24px",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 10,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1f2a44" }}>{name}</span>
              <span style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 700, color: "#334155", textAlign: "right" }}>
                {formulas[i]} = {values[i]}
              </span>
              <AnimatePresence>
                {check && (
                  <motion.span
                    key="mark"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.14 }}
                    style={{ fontSize: 18, fontWeight: 900, color: pass ? "#16a34a" : "#dc2626", textAlign: "center" }}
                  >
                    {pass ? "✓" : "✗"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: names.length * 0.14 + 0.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
