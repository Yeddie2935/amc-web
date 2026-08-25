import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";

/**
 * A small field of arithmetic choices runs through order-of-operations and
 * lands on one shared number line. Data: { expressions: string[], values:
 * number[], labels: string[] }. Values are checked against the expressions,
 * so a bad payload cannot display a false winner.
 */
export function ExpressionRaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const expressions = Array.isArray(data.expressions) ? data.expressions.map(String) : [];
  const values = Array.isArray(data.values) ? data.values.map(Number) : [];
  const labels = Array.isArray(data.labels) ? data.labels.map(String) : [];
  const last = totalSteps - 1;
  const final = step >= last;
  const showTotals = step >= 1 || final;

  const evaluate = (src: string) => {
    const tokens = src.trim().split(/\s+/);
    if (tokens.length !== 7) return NaN;
    const nums = [tokens[0], tokens[2], tokens[4], tokens[6]].map(Number);
    if (nums.some((n) => !Number.isFinite(n))) return NaN;
    const ops = [tokens[1], tokens[3], tokens[5]];
    const terms = [nums[0]];
    ops.forEach((op, i) => {
      if (op === "×" || op === "*") terms[terms.length - 1] *= nums[i + 1];
      else if (op === "+") terms.push(nums[i + 1]);
    });
    return terms.reduce((a, b) => a + b, 0);
  };
  const computed = expressions.map(evaluate);
  const consistent = computed.length === values.length && computed.every((v, i) => v === values[i]);
  const max = Math.max(...computed);
  const winners = computed.map((v, i) => (v === max ? i : -1)).filter((i) => i >= 0);
  const winner = winners.length === 1 ? winners[0] : -1;
  const answerMatches = winner >= 0 && labels[winner] === problem.answer;

  const x0 = 170;
  const trackW = 168;
  const xFor = (v: number) => x0 + (Math.max(0, Math.min(10, v)) / 10) * trackW;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "6px 4px" }}>
      <svg viewBox="0 0 360 238" width="100%" style={{ maxWidth: 430 }}>
        <text x="254" y="15" textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b" fontFamily={mono}>
          VALUE TRACK
        </text>
        {Array.from({ length: 11 }, (_, n) => (
          <g key={n}>
            <line x1={xFor(n)} y1="20" x2={xFor(n)} y2="220" stroke={n === 10 ? "#bbf7d0" : "#e2e8f0"} strokeWidth={n === 10 ? 2 : 1} />
            {(n === 0 || n === 5 || n === 10) && <text x={xFor(n)} y="233" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily={mono}>{n}</text>}
          </g>
        ))}

        {expressions.map((expr, i) => {
          const y = 38 + i * 39;
          const hasMultiply = expr.includes("×");
          const isWinner = final && i === winner && consistent && answerMatches;
          return (
            <g key={labels[i]}>
              <motion.rect x="4" y={y - 16} width="148" height="29" rx="8"
                animate={{ fill: isWinner ? "#dcfce7" : "#f8fafc", stroke: isWinner ? GREEN : "#e2e8f0" }} strokeWidth="1.4" />
              <circle cx="17" cy={y - 2} r="9" fill={isWinner ? GREEN : INDIGO} />
              <text x="17" y={y + 2} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{labels[i]}</text>
              <text x="31" y={y + 2} fontSize="12" fontWeight="800" fill={INK} fontFamily={mono}>{expr}</text>
              {step === 0 && (
                <motion.text x="76" y={y + 11} textAnchor="middle" fontSize="7.5" fontWeight="900"
                  fill={hasMultiply ? AMBER : "#64748b"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  {hasMultiply ? "× FIRST" : "ONLY +"}
                </motion.text>
              )}
              <motion.g initial={false} animate={{ x: showTotals ? xFor(computed[i]) - x0 : 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 16, delay: i * 0.1 }}>
                <line x1={x0} y1={y - 2} x2={x0 + 16} y2={y - 2} stroke="#c7d2fe" strokeWidth="2" />
                <motion.circle cx={x0} cy={y - 2} r={isWinner ? 10 : 7}
                  animate={{ fill: isWinner ? GREEN : showTotals ? INDIGO : "#a5b4fc", scale: isWinner ? [1, 1.18, 1] : 1 }}
                  transition={{ scale: { repeat: isWinner ? 1 : 0, duration: 0.55 } }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                {showTotals && <text x={x0} y={y + 2} textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">{computed[i]}</text>}
              </motion.g>
            </g>
          );
        })}

        <AnimatePresence>
          {final && consistent && answerMatches && (
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <path d="M 325 23 l 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill={AMBER} />
              <text x="304" y="54" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={mono}>largest: 10</text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
        {step === 0 ? "multiply first; choices without × are pure addition" : final ? "10 is the unique farthest-right value" : "the five values land at 10, 8, 9, 9, and 0"}
      </motion.span>
      {(!consistent || !answerMatches) && <span style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>
        {!consistent ? "stored values do not match the expressions" : "computed winner does not match the stored answer"}
      </span>}
      <AnimatePresence>{final && consistent && answerMatches && (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
          style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}>Answer {problem.answer}</motion.div>
      )}</AnimatePresence>
    </div>
  );
}
