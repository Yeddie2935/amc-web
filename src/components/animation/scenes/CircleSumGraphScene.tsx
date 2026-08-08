import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function numList(value: unknown): number[] {
  return Array.isArray(value) ? value.map((v) => num(v, 0)) : [];
}

// A graph of circles filled with digits where each edge shows the sum of its two
// circles; solve and reveal the placement, highlighting one node. Reusable for
// "fill the circles so neighbor sums match" constraint puzzles.
// Data: { xs, ys, digits, edgeA, edgeB, edgeSums, answerIndex }.
export function CircleSumGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const xs = numList(data.xs);
  const ys = numList(data.ys);
  const digits = numList(data.digits);
  const edgeA = numList(data.edgeA);
  const edgeB = numList(data.edgeB);
  const edgeSums = numList(data.edgeSums);
  const answerIndex = num(data.answerIndex, 0);

  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  const R = 26;
  const svgW = 360;
  const svgH = 240;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "6px 4px" }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "100%" }}>
        {/* edges + sum boxes */}
        {edgeSums.map((s, i) => {
          const ax = xs[edgeA[i]], ay = ys[edgeA[i]], bx = xs[edgeB[i]], by = ys[edgeB[i]];
          const mx = (ax + bx) / 2, my = (ay + by) / 2;
          return (
            <g key={`e${i}`}>
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#94a3b8" strokeWidth={1.5} />
              <rect x={mx - 12} y={my - 12} width={24} height={24} rx={3} fill="#fff" stroke="#1f2a44" strokeWidth={1.5} />
              <text x={mx} y={my} fontSize={13} textAnchor="middle" dominantBaseline="central" fill="#1f2a44" fontWeight={700} fontFamily={numberFont}>{s}</text>
            </g>
          );
        })}

        {/* circles */}
        {xs.map((x, i) => {
          const isAns = i === answerIndex;
          const fill = final && isAns ? "#16a34a" : "#fff";
          const stroke = final && isAns ? "#16a34a" : "#1f2a44";
          return (
            <g key={`n${i}`}>
              <circle cx={x} cy={ys[i]} r={R} fill={fill} stroke={stroke} strokeWidth={2.5} />
              <AnimatePresence mode="wait">
                {final ? (
                  <motion.text
                    key="d"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 14, delay: i * 0.1 }}
                    x={x} y={ys[i]} fontSize={22} textAnchor="middle" dominantBaseline="central"
                    fontWeight={800} fontFamily={numberFont} fill={isAns ? "#fff" : "#1f2a44"}
                  >
                    {digits[i]}
                  </motion.text>
                ) : (
                  <text key="q" x={x} y={ys[i]} fontSize={22} textAnchor="middle" dominantBaseline="central" fontWeight={800} fill="#cbd5e1">?</text>
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {final && (
          <motion.div
            key="top"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 800, color: "#16a34a" }}
          >
            top circle = {digits[answerIndex]}
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
