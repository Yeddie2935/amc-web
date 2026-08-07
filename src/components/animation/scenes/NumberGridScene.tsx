import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

// Concentric shading by cell value, so nested layers (a border of 1s around
// 2s around 3s) read at a glance. Higher value = deeper indigo.
const RAMP = ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8"];
function cellBg(v: number): string {
  return RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(v)))];
}

// Parse "1,2,3,3,3,2,1" -> [1,2,3,3,3,2,1].
function parseRow(row: unknown): number[] {
  return String(row)
    .split(",")
    .map((c) => num(c.trim(), 0));
}

// Visual walkthrough for a number grid whose total is found by summing rows,
// e.g. a bordered array. Renders the real grid, then on the final step reveals
// each row's sum, the running total, and the answer.
// Data: { rows: ["1,1,1,1,1,1,1", "1,2,2,2,2,2,1", ...] }.
export function NumberGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rows = Array.isArray(data.rows) ? data.rows.map(parseRow) : [];
  const rowSums = rows.map((r) => r.reduce((a, b) => a + b, 0));
  const total = rowSums.reduce((a, b) => a + b, 0);
  // The total line shows the numeric value, so the badge points to the choice.
  const answer = problem.answer ?? null;

  const last = totalSteps - 1;
  const reveal = step >= last;
  const final = step >= last;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {row.map((v, ci) => (
                <motion.div
                  key={ci}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18, delay: (ri * row.length + ci) * 0.02 }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    background: cellBg(v),
                    display: "grid",
                    placeItems: "center",
                    fontFamily: numberFont,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1f2a44",
                  }}
                >
                  {v}
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {reveal && (
                <motion.span
                  key="rowsum"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: ri * 0.12 }}
                  style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 800, color: "#4338ca" }}
                >
                  = {rowSums[ri]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="total"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rows.length * 0.12 + 0.1 }}
            style={{ fontFamily: numberFont, fontSize: 20, fontWeight: 800, color: "#1f2a44" }}
          >
            {rowSums.join(" + ")} = {total}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: rows.length * 0.12 + 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
