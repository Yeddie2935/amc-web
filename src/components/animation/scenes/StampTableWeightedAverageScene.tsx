import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * An average price per stamp isn't the average of the four country prices —
 * it's total cost over total stamps, so the scene reads one column of
 * Juan's table, weights each country's count by its own price as a growing
 * bar, then divides the summed cost by the summed count and rounds to the
 * nearest answer choice, all computed live rather than asserted.
 * Data: { countries, decades, counts (row-major flat), prices, targetDecade }.
 */
export function StampTableWeightedAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const countries = (Array.isArray(data.countries) ? data.countries : ["Brazil", "France", "Peru", "Spain"]).map(String);
  const decades = (Array.isArray(data.decades) ? data.decades : ["50s", "60s", "70s", "80s"]).map(String);
  const flat = (Array.isArray(data.counts) ? data.counts : [4, 7, 12, 8, 8, 4, 12, 15, 6, 4, 6, 10, 3, 9, 13, 9]).map((v) => num(v, 0));
  const prices = (Array.isArray(data.prices) ? data.prices : [6, 6, 4, 5]).map((v) => num(v, 0));
  const nR = countries.length;
  const nC = decades.length;
  const counts = Array.from({ length: nR }, (_, r) => flat.slice(r * nC, r * nC + nC));
  const targetDecade = String(data.targetDecade ?? "70s");
  const decadeIdx = Math.max(0, decades.indexOf(targetDecade));

  const rowCount = (r: number) => counts[r][decadeIdx];
  const rowCost = (r: number) => rowCount(r) * prices[r];
  const totalStamps = countries.reduce((s, _, r) => s + rowCount(r), 0);
  const totalCost = countries.reduce((s, _, r) => s + rowCost(r), 0);
  const avg = totalCost / totalStamps;

  const choiceVals = (problem.choices ?? []).map((c) => ({ c, v: Number(String(c.text).replace(/[^\d.]/g, "")) }));
  const closest = choiceVals.length
    ? choiceVals.reduce((best, cur) => (Math.abs(cur.v - avg) < Math.abs(best.v - avg) ? cur : best), choiceVals[0])
    : null;
  const answerOk = problem.answer == null || closest?.c?.label === problem.answer;
  const failure = !answerOk ? `closest choice computed as ${closest?.c?.label}, stored answer is ${problem.answer}` : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showWeight = step >= 1;
  const showTotals = step >= 2 || isFinal;

  const W = 300;
  const H = 220;
  const baseY = 150;
  const barW = 44;
  const gap = 16;
  const x0 = 26;
  const maxCount = Math.max(...countries.map((_, r) => rowCount(r)), 1);
  const maxCost = Math.max(...countries.map((_, r) => rowCost(r)), 1);

  const caption = isFinal
    ? `${totalCost} ÷ ${totalStamps} ≈ ${avg.toFixed(2)} — closest to choice ${closest?.c?.label} (${closest?.c?.text})`
    : showTotals
    ? `total cost ${totalCost}¢ over ${totalStamps} stamps`
    : showWeight
    ? `weight each country's count by its own price`
    : `read the ${targetDecade} column: ${countries.map((c, r) => `${c} ${rowCount(r)}`).join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={16} y1={baseY} x2={W - 16} y2={baseY} stroke="#e2e8f0" strokeWidth={1.5} />

        {countries.map((name, r) => {
          const x = x0 + r * (barW + gap);
          const cnt = rowCount(r);
          const cost = rowCost(r);
          const h = showWeight ? (cost / maxCost) * 90 : (cnt / maxCount) * 60;
          return (
            <g key={r}>
              <motion.rect
                key={showWeight ? "cost" : "count"}
                x={x}
                y={baseY - h}
                width={barW}
                height={h}
                rx={4}
                fill={IND}
                fillOpacity={showWeight ? 0.85 : 0.5}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 16, delay: r * 0.15 }}
                style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
              />
              <text x={x + barW / 2} y={baseY - h - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {showWeight ? `${cnt}×${prices[r]}=${cost}` : cnt}
              </text>
              <text x={x + barW / 2} y={baseY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
                {name}
              </text>
            </g>
          );
        })}

        {showTotals && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
            <rect x={W / 2 - 90} y={188} width={180} height={26} rx={8} fill="#eef2ff" stroke={IND} strokeWidth={1.3} />
            <text x={W / 2} y={205} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {countries.map((_, r) => rowCost(r)).join("+")} = {totalCost}¢
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
