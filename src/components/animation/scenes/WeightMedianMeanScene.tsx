import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

function fmtLb(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const BASELINE = 170, CAP = 34, PX_PER_LB = 3;
const barTopY = (weight: number) => BASELINE - Math.min(weight, CAP) * PX_PER_LB;

// A row of weight bars, sorted as given, reveals the median as the middle
// bar's height; the same total redistributed into five equal shares reveals
// the mean as a second reference line — the gap between the two lines is the
// answer. The heaviest bar is capped and torn so the small bars stay legible.
// Data: { weights: number[] } (already in nondecreasing order, odd length).
export function WeightMedianMeanScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const weights = (Array.isArray(data.weights) ? data.weights : []).map((w) => num(w, 0));
  const n = weights.length;
  const medianIndex = Math.floor(n / 2);
  const median = weights[medianIndex] ?? 0;
  const sum = weights.reduce((a, b) => a + b, 0);
  const mean = n > 0 ? sum / n : 0;
  const winner = mean >= median ? "average" : "median";
  const gap = Math.abs(mean - median);
  const composed = `${winner}, by ${fmtLb(gap)}`;

  const sortedOk = weights.every((w, i) => i === 0 || w >= weights[i - 1]);
  const choiceLabel = (problem.choices ?? []).find((c) => String(c.text).trim().toLowerCase() === composed.toLowerCase())?.label;
  const composedOk = composed.toLowerCase() === String(problem.shortAnswer ?? "").trim().toLowerCase();
  const ok = sortedOk && composedOk && choiceLabel === problem.answer;
  const failure = !sortedOk ? "weights are not given in nondecreasing order" : !composedOk ? `computed "${composed}", stored "${problem.shortAnswer}"` : `choice ${choiceLabel ?? "missing"}, stored ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const margin = 45, chartRight = 385;
  const xs = n > 1 ? Array.from({ length: n }, (_, i) => margin + (i * (chartRight - margin)) / (n - 1)) : [(margin + chartRight) / 2];
  const barW = 30;
  const medianX = xs[medianIndex] ?? 230;
  const medianY = barTopY(median);
  const meanY = barTopY(mean);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 310" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "order the five weights — the middle one is the median" : phase === 1 ? "the total splits evenly across all five — that's the mean" : "the mean sits above the median by the gap between them"}
        </text>

        {weights.map((w, i) => {
          const capped = w > CAP;
          const top = barTopY(w);
          return (
            <g key={i}>
              <motion.rect x={xs[i] - barW / 2} y={top} width={barW} height={BASELINE - top} rx="6" fill="#eef2ff" stroke={IND} strokeWidth="1.6" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 + i * 0.14 }} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} />
              {capped && <path d={`M ${xs[i] - barW / 2} ${top + 12} l 7 -6 l 7 6 l 7 -6 l 7 6`} fill="none" stroke="#fff" strokeWidth="2" />}
              {capped && <text x={xs[i]} y={top - 6} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={DIM}>compressed</text>}
              <motion.text x={xs[i]} y={BASELINE + 16} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.14 }}>
                {fmtLb(w)}
              </motion.text>
            </g>
          );
        })}

        <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.1 + n * 0.14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <text x={medianX} y={medianY - 10} textAnchor="middle" fontSize="14" fill={IND}>★</text>
        </motion.g>
        <motion.line x1="25" y1={medianY} x2="400" y2={medianY} stroke={IND} strokeWidth="1.6" strokeDasharray="5 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 + n * 0.14 }} />
        <motion.text x="406" y={medianY + 4} fontSize="11" fontWeight="850" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + n * 0.14 }}>median {fmtLb(median)}</motion.text>

        {phase >= 1 && (
          <>
            <motion.text x="230" y={BASELINE + 38} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {weights.map(fmtLb).join(" + ")} = {fmtLb(sum)}
            </motion.text>
            <motion.text x="230" y={BASELINE + 56} textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {fmtLb(sum)} ÷ {n} = {fmtLb(mean)}
            </motion.text>
            <motion.line x1="25" y1={meanY} x2="400" y2={meanY} stroke={TEAL} strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
            <motion.text x="406" y={meanY + 4} fontSize="11" fontWeight="850" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>mean {fmtLb(mean)}</motion.text>
          </>
        )}

        {phase === 2 && (
          <>
            <motion.text x="230" y={BASELINE + 82} textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {fmtLb(mean)} − {fmtLb(median)} = <tspan fill={GREEN}>{fmtLb(gap)}</tspan>
            </motion.text>
            <text x="230" y={BASELINE + 100} textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "order, mean, gap, and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={BASELINE + 108} width={110} />
          </>
        )}
      </svg>
    </div>
  );
}
