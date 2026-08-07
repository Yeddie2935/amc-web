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
function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// A simplification chain "expr → expr → … → value", revealed with stagger when
// active; before that only the first (original) term shows.
function Chain({ items, active, color }: { items: string[]; active: boolean; color: string }) {
  const shown = active ? items : items.slice(0, 1);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 6 }}>
      {shown.map((term, i) => {
        const isLast = i === items.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: active ? i * 0.18 : 0 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {i > 0 && <span style={{ color: "#94a3b8" }}>→</span>}
            <span
              style={{
                fontFamily: numberFont,
                fontSize: 16,
                fontWeight: isLast ? 800 : 600,
                color: isLast ? color : "#334155",
                background: isLast ? (color === "#16a34a" ? "#dcfce7" : "#eef2ff") : "transparent",
                padding: isLast ? "2px 8px" : 0,
                borderRadius: 6,
              }}
            >
              {term}
            </span>
          </motion.span>
        );
      })}
    </div>
  );
}

// Evaluate a fraction of two expressions by collapsing the numerator chain, then
// the denominator chain, then dividing/reducing. Reusable for "simplify this
// fraction of expressions" (nested radicals, powers, etc.).
// Data: { numChain: [...], denChain: [...] }.
export function RadicalFractionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const numChain = strList(data.numChain);
  const denChain = strList(data.denChain);
  const rNum = toNum(numChain[numChain.length - 1], 0);
  const rDen = toNum(denChain[denChain.length - 1], 1);
  const g = gcd(rNum, rDen);
  const fn = rNum / g;
  const fd = rDen / g;

  const last = totalSteps - 1;
  const numActive = step >= 0;
  const denActive = step >= 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 480, margin: "0 auto", padding: "8px 4px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%" }}>
        <Chain items={numChain} active={numActive} color="#16a34a" />
        <div style={{ width: "80%", height: 3, background: "#1f2a44", borderRadius: 2 }} />
        <Chain items={denChain} active={denActive} color="#4338ca" />
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="divide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ fontFamily: numberFont, fontSize: 22, fontWeight: 800, color: "#1f2a44" }}
          >
            {rNum}/{rDen} = {fn}/{fd}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
