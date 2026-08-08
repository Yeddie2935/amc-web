import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// Three equally-spaced integers a−d, a, a+d on a number line with the two
// consecutive pair-sums; adding them gives 4a, hence a and the total 3a.
// Reusable for "equally spaced integers / arithmetic sequence with pair sums".
// Data: { pairSums: [40, 60], labels?: ["a−d","a","a+d"] }.
export function NumberLineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pairSums = Array.isArray(data.pairSums) ? data.pairSums.map((v) => num(v, 0)) : [];
  const labels = strList(data.labels).length === 3 ? strList(data.labels) : ["a−d", "a", "a+d"];
  const s1 = pairSums[0] ?? 0;
  const s2 = pairSums[1] ?? 0;
  const a = (s1 + s2) / 4;
  const d = (s2 - s1) / 2;
  const values = [a - d, a, a + d];
  const total = 3 * a;

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  const svgW = 440;
  const svgH = 140;
  const y = 74;
  const px = [110, 230, 350];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "6px 4px" }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "100%" }}>
        <line x1={40} y1={y} x2={400} y2={y} stroke="#94a3b8" strokeWidth={2} />
        <polygon points={`400,${y} 392,${y - 4} 392,${y + 4}`} fill="#94a3b8" />

        {px.map((x, i) => {
          const hi = final && i === 1;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={6} fill={hi ? "#16a34a" : "#1f2a44"} />
              <text x={x} y={y - 22} fontSize={14} textAnchor="middle" fill="#334155" fontWeight={700} fontFamily={numberFont}>{labels[i]}</text>
              <AnimatePresence>
                {final && (
                  <motion.text
                    key="v"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 14, delay: i * 0.1 }}
                    x={x} y={y + 24} fontSize={16} textAnchor="middle" fontWeight={800}
                    fill={hi ? "#16a34a" : "#4338ca"} fontFamily={numberFont}
                  >
                    {values[i]}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* pair-sum brackets below the line */}
        {[[0, 1, s1], [1, 2, s2]].map(([i, j, sum], k) => {
          const x1 = px[i as number], x2 = px[j as number];
          const by = final ? y + 44 : y + 22;
          return (
            <g key={`b${k}`}>
              <path d={`M ${x1} ${by - 6} L ${x1} ${by} L ${x2} ${by} L ${x2} ${by - 6}`} fill="none" stroke="#ea580c" strokeWidth={1.5} />
              <text x={(x1 + x2) / 2} y={by + 14} fontSize={13} textAnchor="middle" fill="#ea580c" fontWeight={800} fontFamily={numberFont}>{sum}</text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {final && (
          <motion.div
            key="solve"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: numberFont, fontWeight: 800, color: "#1f2a44" }}
          >
            <span style={{ fontSize: 15 }}>add: {s1} + {s2} = 4a = {s1 + s2} → a = {a}</span>
            <span style={{ fontSize: 19 }}>sum = 3a = {total}</span>
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
