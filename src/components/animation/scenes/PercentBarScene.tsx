import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}
function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// Sequential multiplicative change on a starting value, drawn as horizontal
// bars: start -> apply each factor -> result. Bar widths scale to the running
// value, so a "-20% then +50%" chain visibly dips then overshoots the original.
// Reusable for successive percent change / discount / markup problems.
// Data: { start, unit?, startLabel?, steps:["−20%","+50%"], factors:[0.8,1.5] }.
export function PercentBarScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 100);
  const unit = data.unit != null ? String(data.unit) : "";
  const startLabel = data.startLabel != null ? String(data.startLabel) : "Original";
  const steps = strList(data.steps);
  const factors = Array.isArray(data.factors) ? data.factors.map((f) => num(f, 1)) : [];

  // Running value after each factor; captions label the change that produced it.
  const values = [start];
  factors.forEach((f) => values.push(values[values.length - 1] * f));
  const captions = [startLabel, ...steps];
  const maxV = Math.max(...values, 1);
  const net = factors.reduce((a, b) => a * b, 1);

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 440, margin: "0 auto", padding: "8px 4px" }}>
      {values.map((v, i) => {
        const isLast = i === values.length - 1;
        const highlight = final && isLast;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "84px 1fr 58px", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155", textAlign: "right" }}>{captions[i]}</span>
            <div style={{ height: 26, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(v / maxV) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.18 }}
                style={{ height: "100%", borderRadius: 6, background: highlight ? "#16a34a" : "#818cf8" }}
              />
            </div>
            <span style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 800, color: highlight ? "#16a34a" : "#1f2a44" }}>
              {fmt(v)}{unit}
            </span>
          </div>
        );
      })}

      <AnimatePresence>
        {final && factors.length > 0 && (
          <motion.div
            key="net"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: values.length * 0.18 + 0.1 }}
            style={{ fontFamily: numberFont, fontSize: 18, fontWeight: 800, color: "#1f2a44", textAlign: "center", marginTop: 2 }}
          >
            {factors.map(fmt).join(" × ")} = {fmt(net)}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: values.length * 0.18 + 0.3 }}
            style={{ alignSelf: "center", padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
