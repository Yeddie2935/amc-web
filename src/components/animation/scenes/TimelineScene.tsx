import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SEG_COLORS = ["#c7d2fe", "#fde68a", "#bbf7d0", "#fecaca"];

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}
function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// Split a total into labeled segments on a horizontal timeline. Each segment's
// width scales to its value; an optional emoji icon slides across the segment
// (e.g. a car driving, then a lunch stop). Reusable for time / distance / budget
// splits. Data: { total?, unit?, segLabels:[...], segValues:[...],
// segIcons?:[...], segSub?:[...], highlightIndex? }.
export function TimelineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const labels = strList(data.segLabels);
  const values = Array.isArray(data.segValues) ? data.segValues.map((v) => num(v, 0)) : [];
  const icons = strList(data.segIcons);
  const subs = strList(data.segSub);
  const unit = data.unit != null ? String(data.unit) : "";
  const total = data.total != null ? num(data.total, 0) : values.reduce((a, b) => a + b, 0);
  const highlightIndex = data.highlightIndex != null ? num(data.highlightIndex, values.length - 1) : values.length - 1;

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  // Cumulative left offset (in %) for each segment.
  const offsets: number[] = [];
  let acc = 0;
  for (const v of values) {
    offsets.push((acc / total) * 100);
    acc += v;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      <div style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 700, color: "#475569", background: "#f1f5f9", padding: "3px 12px", borderRadius: 999 }}>
        Total = {fmt(total)}{unit && ` ${unit}`}
      </div>

      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ position: "relative", width: "100%", height: 56, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
          {values.map((v, i) => {
            const widthPct = (v / total) * 100;
            const highlight = final && i === highlightIndex;
            return (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.35 }}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${offsets[i]}%`,
                  background: highlight ? "#16a34a" : SEG_COLORS[i % SEG_COLORS.length],
                  borderRight: i < values.length - 1 ? "2px solid #fff" : "none",
                  overflow: "hidden",
                }}
              >
                {icons[i] && (
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ type: "tween", duration: 1.4, ease: "easeInOut", delay: i * 0.35 }}
                    style={{ position: "absolute", left: "50%", top: "50%", translateY: "-50%", fontSize: 26 }}
                  >
                    {icons[i]}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div style={{ position: "relative", width: "100%", height: 44, marginTop: 6 }}>
          {values.map((v, i) => {
            const centerPct = offsets[i] + (v / total) * 50;
            const highlight = final && i === highlightIndex;
            return (
              <div
                key={i}
                style={{ position: "absolute", left: `${centerPct}%`, transform: "translateX(-50%)", textAlign: "center", width: 120 }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{labels[i]}</div>
                <div style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 800, color: highlight ? "#16a34a" : "#1f2a44" }}>
                  {fmt(v)}{unit}{subs[i] ? ` = ${subs[i]}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: values.length * 0.35 + 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
