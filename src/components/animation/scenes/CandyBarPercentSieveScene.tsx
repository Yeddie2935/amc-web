import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const CANDY = ["#f97316", "#a855f7", "#ef4444", "#0ea5e9", IND];

/**
 * A percent-of-total question, so the scene grows real candy bars to their
 * surveyed heights, stacks them into one running total, then carves that
 * total into a pie whose E-slice is measured against it — the 5/25 and the
 * ×100 both computed live. A beat is spent on the trap of misreading the last
 * bar's height by one candy, which lands on a real answer choice.
 * Data: { values, labels? }.
 */
export function CandyBarPercentSieveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : [6, 8, 4, 2, 5]).map((v) => Math.max(0, Math.round(num(v, 0))));
  const labels = (Array.isArray(data.labels) ? data.labels : ["A", "B", "C", "D", "E"]).map((v) => String(v));
  const targetIdx = values.length - 1;
  const total = values.reduce((a, b) => a + b, 0);
  const target = values[targetIdx];
  const pct = Math.round((target / total) * 1000) / 10;
  const answerOk = problem.shortAnswer == null || `${pct}%` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${pct}%, stored answer is ${problem.shortAnswer}` : "";

  const misreadTarget = Math.max(0, target - 1);
  const trapPct = Math.round((misreadTarget / total) * 1000) / 10;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapPct));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showTotal = step >= 2 || isFinal;
  const showPercent = isFinal;

  const W = 300;
  const H = 220;
  const baseY = 168;
  const barW = 34;
  const gap = 12;
  const x0 = 24;
  const maxV = Math.max(...values, 1);
  const barH = (v: number) => (v / maxV) * 110;

  const caption = isFinal
    ? `${target} ÷ ${total} × 100 = ${pct}%`
    : showTotal
    ? `${values.join(" + ")} = ${total} students total`
    : showTrap
    ? trapChoice
      ? `misread the last bar as ${misreadTarget} and you'd get ${trapPct}% — choice ${trapChoice.label}`
      : `misreading the last bar as ${misreadTarget} would give ${trapPct}%`
    : `read each bar's height from the graph`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={16} y1={baseY} x2={W - 16} y2={baseY} stroke="#e2e8f0" strokeWidth={1.5} />

        {values.map((v, i) => {
          const x = x0 + i * (barW + gap);
          const h = barH(v);
          const isTarget = i === targetIdx;
          return (
            <g key={i}>
              <motion.rect
                x={x}
                y={baseY - h}
                width={barW}
                height={h}
                rx={4}
                fill={isTarget ? WIN : CANDY[i % CANDY.length]}
                fillOpacity={isTarget ? 0.9 : 0.65}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ type: "spring", stiffness: 170, damping: 16, delay: i * 0.15 }}
                style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
              />
              <text x={x + barW / 2} y={baseY - h - 8} textAnchor="middle" fontSize="11" fontWeight="800" fill={isTarget ? WIN : INK} fontFamily={numberFont}>
                {v}
              </text>
              <text x={x + barW / 2} y={baseY + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>
                {labels[i]}
              </text>
            </g>
          );
        })}

        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.line
              x1={x0 + targetIdx * (barW + gap)}
              y1={baseY - barH(misreadTarget)}
              x2={x0 + targetIdx * (barW + gap) + barW}
              y2={baseY - barH(target)}
              stroke={BAD}
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <text x={x0 + targetIdx * (barW + gap) + barW / 2} y={baseY - barH(target) - 22} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              really {target}, not {misreadTarget}
            </text>
          </motion.g>
        )}

        {showTotal && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 82} y={186} width={164} height={26} rx={8} fill="#eef2ff" stroke={IND} strokeWidth={1.3} />
            <text x={W / 2} y={203} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {values.join("+")} = {total}
            </text>
          </motion.g>
        )}
      </svg>

      {showPercent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: WIN }}
        >
          {target}/{total} × 100 = {pct}%
        </motion.div>
      )}

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
