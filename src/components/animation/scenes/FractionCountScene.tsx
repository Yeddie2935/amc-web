import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

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

// "What fraction of these satisfy the condition?" Tests each candidate, marks
// ✓/✗ on the final step, and reports favorable/total reduced. Reusable for
// probability / counting "what fraction …" problems.
// Data: { items: [...], pass: [true,false,...], itemLabel?, note? }.
export function FractionCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const items = strList(data.items);
  const pass = Array.isArray(data.pass) ? data.pass.map((v) => Boolean(v)) : [];
  const itemLabel = data.itemLabel != null ? String(data.itemLabel) : "";
  const note = data.note != null ? String(data.note) : "";

  const total = items.length;
  const fav = pass.filter(Boolean).length;
  const g = gcd(fav, total);
  const fn = fav / g;
  const fd = total / g;

  const last = totalSteps - 1;
  const check = step >= last;
  const final = step >= last;
  const answer = problem.answer ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      {note && <div style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 700, color: "#64748b", textAlign: "center", maxWidth: 420 }}>{note}</div>}
      {itemLabel && <div style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{itemLabel}</div>}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
        {items.map((it, i) => {
          const ok = pass[i];
          const dim = check && !ok;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: dim ? 0.5 : 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.08 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  width: 44,
                  height: 52,
                  borderRadius: 10,
                  border: `2px solid ${check ? (ok ? "#16a34a" : "#dc2626") : "#1f2a44"}`,
                  background: check && ok ? "#dcfce7" : "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: numberFont,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1f2a44",
                }}
              >
                {it}
              </div>
              <AnimatePresence>
                {check && (
                  <motion.span
                    key="m"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.1 }}
                    style={{ fontSize: 16, fontWeight: 900, color: ok ? "#16a34a" : "#dc2626" }}
                  >
                    {ok ? "✓" : "✗"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="frac"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: numberFont, fontSize: 20, fontWeight: 800, color: "#1f2a44" }}
          >
            {g > 1 ? `${fav}/${total} = ${fn}/${fd}` : `${fn}/${fd}`}
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
