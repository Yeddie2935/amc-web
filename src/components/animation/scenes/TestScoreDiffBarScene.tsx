import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

// One test's score difference (Jenny minus the other person) per bar,
// growing from a zero baseline up (ahead) or down (behind), with a running
// total that settles into the average difference once every test is in.
// Data: { differences: [10, -10, 20, 20] }.
export function TestScoreDiffBarScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const diffs = (Array.isArray(data.differences) ? data.differences : [10, -10, 20, 20]).map((v) => num(v, 0));
  const n = diffs.length;

  const last = totalSteps - 1;
  // Tests 1 and 2 reveal one at a time; the rest arrive together once step >= 2.
  const revealedCount = Math.min(n, step === 0 ? 1 : step === 1 ? 2 : n);
  const runningTotal = diffs.slice(0, revealedCount).reduce((a, b) => a + b, 0);
  const showDivide = step >= n - 1;
  const isFinal = step >= last;
  const average = runningTotal / n;

  const W = 300;
  const H = 190;
  const baseY = 100;
  const maxAbs = Math.max(...diffs.map(Math.abs), 1) * 1.3;
  const sy = (v: number) => baseY - (v / maxAbs) * 70;
  const slotW = (W - 20) / n;
  const barW = slotW * 0.55;
  const xOf = (i: number) => 10 + i * slotW + (slotW - barW) / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={8} x2={W - 8} y1={baseY} y2={baseY} stroke={NAVY} strokeWidth={1.4} />
        <text x={8} y={baseY - 74} fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>
          Jenny − Blake
        </text>

        {diffs.map((d, i) => {
          const show = i < revealedCount;
          const color = d >= 0 ? GREEN : RED;
          return (
            <g key={i}>
              <AnimatePresence>
                {show && (
                  <motion.rect
                    x={xOf(i)}
                    width={barW}
                    rx={2}
                    fill={color}
                    fillOpacity={0.75}
                    stroke={color}
                    strokeWidth={1.4}
                    initial={{ y: baseY, height: 0 }}
                    animate={{ y: d >= 0 ? sy(d) : baseY, height: Math.abs(sy(d) - baseY) }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                )}
              </AnimatePresence>
              {show && (
                <text x={xOf(i) + barW / 2} y={d >= 0 ? sy(d) - 6 : sy(d) + 14} textAnchor="middle" fontSize="10" fontWeight="800" fill={color} fontFamily={FONT}>
                  {d >= 0 ? "+" : ""}
                  {d}
                </text>
              )}
              <text x={xOf(i) + barW / 2} y={baseY + 62} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
                test {i + 1}
              </text>
            </g>
          );
        })}

        <AnimatePresence>
          {showDivide && (
            <motion.g key="avg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={8} x2={W - 8} y1={sy(average)} y2={sy(average)} stroke={isFinal ? GREEN : INDIGO} strokeWidth={1.4} strokeDasharray="4 3" />
              <text x={W - 10} y={sy(average) - 6} textAnchor="end" fontSize="9.5" fontWeight="800" fill={isFinal ? GREEN : INDIGO} fontFamily={FONT}>
                avg +{average}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 300 }}>
        {isFinal
          ? `Jenny's average is ${average} points higher`
          : showDivide
          ? `${runningTotal} ÷ ${n} = ${average}`
          : `running total: ${runningTotal >= 0 ? "+" : ""}${runningTotal}`}
      </motion.div>

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
