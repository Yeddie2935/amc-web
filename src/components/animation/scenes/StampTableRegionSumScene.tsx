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
 * A region + decade lookup, so the scene draws Juan's actual stamp table and
 * highlights it in two passes: first the rows that belong to the target
 * region, then the column for the target decade — the answer is only the
 * cells where both highlights overlap. A beat spent summing the *whole*
 * column first (every region, not just the target one) shows the trap
 * directly, since that full-column total matches a real answer choice.
 * Data: { countries, regions, decades, counts (row-major flat),
 * targetRegion, targetDecade }.
 */
export function StampTableRegionSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const countries = (Array.isArray(data.countries) ? data.countries : ["Brazil", "France", "Peru", "Spain"]).map(String);
  const regions = (Array.isArray(data.regions) ? data.regions : ["South America", "Europe", "South America", "Europe"]).map(String);
  const decades = (Array.isArray(data.decades) ? data.decades : ["50s", "60s", "70s", "80s"]).map(String);
  const flat = (Array.isArray(data.counts) ? data.counts : [4, 7, 12, 8, 8, 4, 12, 15, 6, 4, 6, 10, 3, 9, 13, 9]).map((v) => num(v, 0));
  const nR = countries.length;
  const nC = decades.length;
  const counts = Array.from({ length: nR }, (_, r) => flat.slice(r * nC, r * nC + nC));
  const targetRegion = String(data.targetRegion ?? "Europe");
  const targetDecade = String(data.targetDecade ?? "80s");
  const decadeIdx = Math.max(0, decades.indexOf(targetDecade));
  const regionRows = countries.map((_, r) => regions[r] === targetRegion);

  const targetSum = counts.reduce((s, row, r) => (regionRows[r] ? s + row[decadeIdx] : s), 0);
  const fullColumnSum = counts.reduce((s, row) => s + row[decadeIdx], 0);
  const answerOk = problem.shortAnswer == null || String(targetSum) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${targetSum}, stored answer is ${problem.shortAnswer}` : "";
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(fullColumnSum));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showNarrow = step >= 2 || isFinal;

  const W = 320;
  const H = 220;
  const x0 = 10;
  const y0 = 34;
  const nameW = 78;
  const colW = (W - 20 - nameW) / nC;
  const rowH = 30;

  const cellFill = (r: number, c: number) => {
    const inRegion = regionRows[r];
    const inDecade = c === decadeIdx;
    if (showNarrow) return inRegion && inDecade ? "#dcfce7" : "#f8fafc";
    if (showTrap) return inDecade ? (inRegion ? "#dcfce7" : "#fee2e2") : "#f8fafc";
    return inRegion ? "#eef2ff" : "#f8fafc";
  };
  const cellStroke = (r: number, c: number) => {
    const inRegion = regionRows[r];
    const inDecade = c === decadeIdx;
    if (showNarrow) return inRegion && inDecade ? WIN : "#e2e8f0";
    if (showTrap) return inDecade ? (inRegion ? WIN : BAD) : "#e2e8f0";
    return inRegion ? IND : "#e2e8f0";
  };

  const caption = isFinal
    ? `${targetRegion}'s ${targetDecade} stamps: ${targetSum}`
    : showNarrow
    ? `only ${targetRegion} counts in the ${targetDecade} column`
    : showTrap
    ? trapChoice
      ? `the whole ${targetDecade} column sums to ${fullColumnSum} — choice ${trapChoice.label}, but that includes every region`
      : `the whole ${targetDecade} column sums to ${fullColumnSum}, including regions we don't want`
    : `${targetRegion} rows: ${countries.filter((_, r) => regionRows[r]).join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        <text x={x0 + nameW / 2} y={y0 - 8} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
          country
        </text>
        {decades.map((d, c) => (
          <text key={c} x={x0 + nameW + c * colW + colW / 2} y={y0 - 8} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={c === decadeIdx ? IND : DIM}>
            {d}
          </text>
        ))}

        {countries.map((name, r) => (
          <g key={r}>
            <motion.rect
              x={x0}
              y={y0 + r * rowH}
              width={nameW - 4}
              height={rowH - 4}
              rx={5}
              fill={regionRows[r] ? "#eef2ff" : "#f8fafc"}
              stroke={regionRows[r] ? IND : "#e2e8f0"}
              strokeWidth={1.2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: r * 0.1 }}
            />
            <text x={x0 + (nameW - 4) / 2} y={y0 + r * rowH + 18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={regionRows[r] ? IND : DIM} fontFamily={numberFont}>
              {name}
            </text>
            {counts[r].map((v, c) => (
              <g key={c}>
                <motion.rect
                  x={x0 + nameW + c * colW}
                  y={y0 + r * rowH}
                  width={colW - 4}
                  height={rowH - 4}
                  rx={5}
                  fill={cellFill(r, c)}
                  stroke={cellStroke(r, c)}
                  strokeWidth={1.2}
                  animate={{ fill: cellFill(r, c), stroke: cellStroke(r, c) }}
                  transition={{ duration: 0.3 }}
                />
                <text x={x0 + nameW + c * colW + (colW - 4) / 2} y={y0 + r * rowH + 18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {v}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>

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
