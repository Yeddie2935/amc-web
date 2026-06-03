import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { getExplanationSteps } from "../explanation";
import { answerOf, sceneData } from "./sceneKit";

// Default walkthrough for every non-diagram problem. Shows the current solution
// step's real content: its equation (field or extracted from the body) springing
// in as math when available, otherwise the step's reasoning sentence. Then the
// answer. Never fabricated content.
export function EquationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const steps = getExplanationSteps(problem);
  const data = sceneData(problem);
  const current = steps[Math.min(step, steps.length - 1)];
  const equation = current?.equation ?? (data.equation != null ? String(data.equation) : null);
  const focal = equation ?? current?.body ?? current?.title ?? "";
  const isEquation = Boolean(equation);
  const answer = answerOf(problem);
  const final = step >= totalSteps - 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: "100%", padding: "16px 4px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: "spring", stiffness: 130, damping: 16 }}
          style={{
            fontSize: isEquation ? 28 : 17,
            fontWeight: isEquation ? 700 : 500,
            color: isEquation ? "#1f2a44" : "#334155",
            fontFamily: isEquation
              ? "ui-monospace, SFMono-Regular, Menlo, monospace"
              : "inherit",
            textAlign: "center",
            maxWidth: 470,
            lineHeight: 1.5,
            minHeight: 48,
            display: "grid",
            placeItems: "center",
          }}
        >
          {focal}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
