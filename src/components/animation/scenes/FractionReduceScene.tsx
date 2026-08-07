import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num as toNum, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

// A stacked fraction n/d.
function Frac({ n, d, color }: { n: number; d: number; color: string }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", fontFamily: numberFont, fontWeight: 800, color }}>
      <span style={{ fontSize: 22 }}>{n}</span>
      <span style={{ width: "100%", height: 2, background: color, margin: "2px 0" }} />
      <span style={{ fontSize: 22 }}>{d}</span>
    </div>
  );
}

// Reduce a fraction/percent to lowest terms and surface the reduced denominator
// (e.g. the fewest people for an exact percentage). Optional themed dot grid of
// the reduced denominator with the numerator highlighted. Reusable for
// "simplify a fraction / smallest denominator" problems.
// Data: { num, den, unit?, showGrid?, gridLabel? }.
export function FractionReduceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n0 = toNum(data.num, 0);
  const d0 = toNum(data.den, 1);
  const unit = data.unit != null ? String(data.unit) : "";
  const showGrid = Boolean(data.showGrid);
  const gridLabel = data.gridLabel != null ? String(data.gridLabel) : "";

  const g = gcd(n0, d0);
  const rn = n0 / g;
  const rd = d0 / g;

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  const cols = Math.min(10, rd);
  const gridOk = showGrid && rd <= 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {unit === "%" && (
          <span style={{ fontFamily: numberFont, fontSize: 20, fontWeight: 800, color: "#1f2a44" }}>{n0}% =</span>
        )}
        <Frac n={n0} d={d0} color="#1f2a44" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#64748b" }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>÷ {g}</span>
          <span style={{ fontSize: 22 }}>→</span>
        </div>
        <div style={{ position: "relative" }}>
          <Frac n={rn} d={rd} color="#4338ca" />
          <AnimatePresence>
            {final && (
              <motion.span
                key="lt"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 11, fontWeight: 700, color: "#16a34a" }}
              >
                lowest terms
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="denom"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ fontFamily: numberFont, fontSize: 16, fontWeight: 800, color: "#16a34a" }}
          >
            fewest = denominator = {rd}
          </motion.div>
        )}
      </AnimatePresence>

      {gridOk && final && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
            {Array.from({ length: rd }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.012 }}
                style={{ width: 12, height: 12, borderRadius: 999, background: i < rn ? "#22c55e" : "#e2e8f0" }}
              />
            ))}
          </div>
          <span style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 700, color: "#475569" }}>
            {rn} of {rd} {gridLabel}
          </span>
        </div>
      )}

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
