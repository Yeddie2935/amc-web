import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

// Each "way" is a run of numbers (e.g. consecutive odds) that should sum to the
// total. Read them as arrays of numbers, tolerating stray non-arrays.
function waysList(value: unknown): number[][] {
  return Array.isArray(value)
    ? value
        .filter((w) => Array.isArray(w) && w.length > 0)
        .map((w) => (w as unknown[]).map((v) => num(v, 0)))
    : [];
}

// "In how many ways can N be written as a sum of consecutive integers/odds?"
// Step 1 sets the target (and optional key formula); the final step lays out each
// valid run as tiles, sums them live (a faithfulness check that each really hits
// the target), and counts the ways.
// Data: { total, ways:[[29,31],[5,7,...]], formula?, note?, unit? }.
export function ConsecutiveSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = num(data.total, 0);
  const unit = data.unit != null ? String(data.unit) : "";
  const ways = waysList(data.ways);
  const formula = data.formula != null ? String(data.formula) : "";
  const note = data.note != null ? String(data.note) : "";

  const last = totalSteps - 1;
  const reveal = step >= last;
  // The scene already shows the count, so the badge points back with the letter.
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
        sum = {total}{unit && ` ${unit}`}
      </div>

      {formula && (
        <div style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 700, color: "#4338ca" }}>{formula}</div>
      )}
      {note && (
        <div style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600, textAlign: "center", maxWidth: 420 }}>{note}</div>
      )}

      <AnimatePresence>
        {reveal && (
          <motion.div
            key="ways"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 2 }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.4 }}>
              WAYS TO WRITE {total}
            </span>
            {ways.map((run, wi) => {
              const runSum = run.reduce((a, b) => a + b, 0);
              const ok = runSum === total;
              return (
                <motion.div
                  key={wi}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + wi * 0.2 }}
                  style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" }}
                >
                  {run.map((n, ni) => (
                    <span key={ni} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {ni > 0 && <span style={{ color: "#94a3b8", fontWeight: 700 }}>+</span>}
                      <span
                        style={{
                          fontFamily: numberFont,
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#1f2a44",
                          padding: "3px 9px",
                          borderRadius: 8,
                          background: "#eef2ff",
                          border: "1px solid #c7d2fe",
                        }}
                      >
                        {n}
                      </span>
                    </span>
                  ))}
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.35 + wi * 0.2 }}
                    style={{ fontFamily: numberFont, fontSize: 16, fontWeight: 800, color: ok ? "#16a34a" : "#dc2626", marginLeft: 2 }}
                  >
                    = {runSum} {ok ? "✓" : "✗"}
                  </motion.span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reveal && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 + ways.length * 0.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {ways.length} ways → Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
