import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// Order a set of items by a numeric key and highlight the k-th place. Each row
// shows an icon, name, its value expression (relative to a base), and a bar
// scaled to the value. Reusable for finish-order / ranking / "who is k-th"
// logic problems. Data: { names:[...], values:[...], base?, unit?,
// lowerIsBetter?, highlightRank?, icon? }.
export function RankingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = strList(data.names);
  const values = Array.isArray(data.values) ? data.values.map((v) => num(v, 0)) : [];
  const base = data.base != null ? String(data.base) : "";
  const lowerIsBetter = data.lowerIsBetter !== false; // default: smaller = first
  const highlightRank = num(data.highlightRank, 0);
  const icon = data.icon != null ? String(data.icon) : "";

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const span = maxV - minV || 1;

  const expr = (v: number) => (v === 0 ? base || "0" : v > 0 ? `${base}+${v}` : `${base}−${Math.abs(v)}`);
  const medal = (rank: number) => ["🥇", "🥈", "🥉"][rank - 1] ?? `${rank}th`;

  // Original order (as stated) before sorting; sorted order for the final step.
  const originalIdx = names.map((_, i) => i);
  const sortedIdx = [...originalIdx].sort((a, b) => (lowerIsBetter ? values[a] - values[b] : values[b] - values[a]));
  const order = final ? sortedIdx : originalIdx;
  const rankOfIdx = new Map(sortedIdx.map((idx, r) => [idx, r + 1]));

  const highlighted = final ? sortedIdx[highlightRank - 1] : -1;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 460, margin: "0 auto", padding: "6px 4px" }}>
      {base && (
        <div style={{ fontFamily: numberFont, fontSize: 12, fontWeight: 700, color: "#64748b" }}>
          times relative to {base}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {order.map((idx, pos) => {
          const rank = rankOfIdx.get(idx) ?? 0;
          const isHi = idx === highlighted;
          const barPct = 12 + 88 * ((values[idx] - minV) / span);
          return (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: pos * 0.08 }}
              style={{
                display: "grid",
                gridTemplateColumns: "34px 24px 88px 62px 1fr",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px",
                borderRadius: 10,
                background: isHi ? "#dcfce7" : "#f8fafc",
                border: `1px solid ${isHi ? "#16a34a" : "#e2e8f0"}`,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 800, textAlign: "center", color: "#475569" }}>{final ? medal(rank) : "•"}</span>
              <span style={{ fontSize: 18, textAlign: "center" }}>{icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: isHi ? "#166534" : "#1f2a44" }}>{names[idx]}</span>
              <span style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 700, color: "#4338ca" }}>{expr(values[idx])}</span>
              <div style={{ height: 12, background: "#eef2ff", borderRadius: 999, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20, delay: pos * 0.08 + 0.1 }}
                  style={{ height: "100%", borderRadius: 999, background: isHi ? "#16a34a" : "#a5b4fc" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {final && highlighted >= 0 && (
          <motion.div
            key="hl"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 800, color: "#16a34a" }}
          >
            {highlightRank}th = {names[highlighted]}
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
