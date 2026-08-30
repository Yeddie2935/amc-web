import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";

function fmt(v: number): string {
  return `$${v.toFixed(2).replace(/\.00$/, "")}`;
}

// A price rises by one percent factor, then falls by another applied to the
// NEW price, not the original — the bar for the final price lands close to,
// but not exactly on, the starting bar, exposing the "it cancels out" trap.
// Data: { start, factors: [1.10, 0.90], labels: ["Thursday", "Friday", "Monday"] }.
export function PriceMarkupDiscountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 40);
  const factors = (Array.isArray(data.factors) ? data.factors : [1.1, 0.9]).map((f) => num(f, 1));
  const labels = (Array.isArray(data.labels) ? data.labels : ["Thursday", "Friday", "Monday"]).map(String);

  const values = [start];
  factors.forEach((f) => values.push(values[values.length - 1] * f));
  const final = values[values.length - 1];
  const trapMatchesStart = Math.abs(final - start) < 0.005;

  const last = totalSteps - 1;
  const revealed = Math.min(values.length, step + 1);
  const showTrap = step >= values.length - 1;
  const isFinal = step >= last;

  const maxV = Math.max(...values) * 1.1;
  const barMaxW = 220;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 340 }}>
        {values.map((v, i) => {
          const show = i < revealed;
          const isLast = i === values.length - 1;
          const barColor = isLast && isFinal ? GREEN : isLast ? INDIGO : "#818cf8";
          return (
            <AnimatePresence key={i}>
              {show && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ display: "grid", gridTemplateColumns: "78px 1fr 62px", alignItems: "center", gap: 8 }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", textAlign: "right" }}>{labels[i] ?? `step ${i}`}</span>
                  <div style={{ height: 24, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(v / maxV) * 100}%` }}
                      transition={{ type: "spring", stiffness: 140, damping: 20 }}
                      style={{ height: "100%", borderRadius: 6, background: barColor, maxWidth: barMaxW }}
                    />
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: barColor }}>{fmt(v)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {step === 0
          ? `start at ${fmt(start)}`
          : !isFinal
          ? `${fmt(values[revealed - 2])} × ${factors[revealed - 2]} = ${fmt(values[revealed - 1])}`
          : `the discount applies to ${fmt(values[values.length - 2])}, not the original ${fmt(start)}`}
      </motion.div>

      <AnimatePresence>
        {showTrap && (
          <motion.div
            key="trap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: trapMatchesStart ? GREEN : RED, textAlign: "center", maxWidth: 320 }}
          >
            {trapMatchesStart
              ? `${fmt(final)} — the changes cancel out exactly`
              : `${fmt(final)} ≠ ${fmt(start)} — a rise then an equal-percent fall doesn't cancel out`}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
