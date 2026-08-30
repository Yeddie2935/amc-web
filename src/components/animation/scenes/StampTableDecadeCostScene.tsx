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
 * Cost is count × price, summed across two countries and two decades at
 * once — the scene highlights Juan's actual table rows/columns for the
 * target region and decade range, folds each country's matching cells into
 * a stamp count, prices them, and adds the two costs. A beat is spent on the
 * trap of computing only one country's cost and forgetting the other
 * entirely, since that partial total lands on a real answer choice.
 * Data: { countries, regions, decades, counts (row-major flat), prices,
 * targetRegion, targetDecades (labels included) }.
 */
export function StampTableDecadeCostScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const countries = (Array.isArray(data.countries) ? data.countries : ["Brazil", "France", "Peru", "Spain"]).map(String);
  const regions = (Array.isArray(data.regions) ? data.regions : ["South America", "Europe", "South America", "Europe"]).map(String);
  const decades = (Array.isArray(data.decades) ? data.decades : ["50s", "60s", "70s", "80s"]).map(String);
  const flat = (Array.isArray(data.counts) ? data.counts : [4, 7, 12, 8, 8, 4, 12, 15, 6, 4, 6, 10, 3, 9, 13, 9]).map((v) => num(v, 0));
  const prices = (Array.isArray(data.prices) ? data.prices : [6, 6, 4, 5]).map((v) => num(v, 0));
  const nR = countries.length;
  const nC = decades.length;
  const counts = Array.from({ length: nR }, (_, r) => flat.slice(r * nC, r * nC + nC));
  const targetRegion = String(data.targetRegion ?? "South America");
  const targetDecades = (Array.isArray(data.targetDecades) ? data.targetDecades : ["50s", "60s"]).map(String);
  const decadeIdxs = targetDecades.map((d) => decades.indexOf(d)).filter((i) => i >= 0);
  const regionRows = countries.map((_, r) => regions[r] === targetRegion);
  const rowIdxs = countries.map((_, r) => r).filter((r) => regions[r] === targetRegion);

  const rowStamps = (r: number) => decadeIdxs.reduce((s, c) => s + counts[r][c], 0);
  const rowCost = (r: number) => rowStamps(r) * prices[r];
  const totalCost = rowIdxs.reduce((s, r) => s + rowCost(r), 0);
  const totalCents = Math.round(totalCost);
  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const answerOk = problem.shortAnswer == null || fmt(totalCents) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${fmt(totalCents)}, stored answer is ${problem.shortAnswer}` : "";

  const onlyLast = rowIdxs.length ? rowIdxs[rowIdxs.length - 1] : 0;
  const partialCost = rowCost(onlyLast);
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === fmt(partialCost));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showCount = step >= 2 || isFinal;

  const W = 320;
  const H = 232;
  const x0 = 10;
  const y0 = 34;
  const nameW = 78;
  const colW = (W - 20 - nameW) / nC;
  const rowH = 30;

  const cellOn = (r: number, c: number) => regionRows[r] && decadeIdxs.includes(c);
  const cellFill = (r: number, c: number) => {
    if (showTrap) return r === onlyLast && decadeIdxs.includes(c) ? "#dcfce7" : cellOn(r, c) ? "#fee2e2" : "#f8fafc";
    return cellOn(r, c) ? "#dcfce7" : "#f8fafc";
  };
  const cellStroke = (r: number, c: number) => {
    if (showTrap) return r === onlyLast && decadeIdxs.includes(c) ? WIN : cellOn(r, c) ? BAD : "#e2e8f0";
    return cellOn(r, c) ? WIN : "#e2e8f0";
  };

  const caption = isFinal
    ? `${rowIdxs.map((r) => `${rowStamps(r)}×${prices[r]}¢`).join(" + ")} = ${totalCents}¢ = ${fmt(totalCents)}`
    : showCount
    ? rowIdxs.map((r) => `${countries[r]}: ${decadeIdxs.map((c) => counts[r][c]).join("+")} = ${rowStamps(r)} stamps`).join("  ·  ")
    : showTrap
    ? trapChoice
      ? `only counting ${countries[onlyLast]} gives ${fmt(partialCost)} — choice ${trapChoice.label}, but ${countries[rowIdxs[0]]} counts too`
      : `only counting ${countries[onlyLast]} gives ${fmt(partialCost)}, missing the other country`
    : `${targetRegion} in the ${targetDecades.join(" and ")}: ${rowIdxs.map((r) => countries[r]).join(" and ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        <text x={x0 + nameW / 2} y={y0 - 8} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
          country
        </text>
        {decades.map((d, c) => (
          <text key={c} x={x0 + nameW + c * colW + colW / 2} y={y0 - 8} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={decadeIdxs.includes(c) ? IND : DIM}>
            {d}
          </text>
        ))}

        {countries.map((name, r) => (
          <g key={r}>
            <rect
              x={x0}
              y={y0 + r * rowH}
              width={nameW - 4}
              height={rowH - 4}
              rx={5}
              fill={regionRows[r] ? "#eef2ff" : "#f8fafc"}
              stroke={regionRows[r] ? IND : "#e2e8f0"}
              strokeWidth={1.2}
            />
            <text x={x0 + (nameW - 4) / 2} y={y0 + r * rowH + 18} textAnchor="middle" fontSize="10" fontWeight="800" fill={regionRows[r] ? IND : DIM} fontFamily={numberFont}>
              {name} ({prices[r]}¢)
            </text>
            {counts[r].map((v, c) => (
              <g key={c}>
                <motion.rect
                  x={x0 + nameW + c * colW}
                  y={y0 + r * rowH}
                  width={colW - 4}
                  height={rowH - 4}
                  rx={5}
                  animate={{ fill: cellFill(r, c), stroke: cellStroke(r, c) }}
                  strokeWidth={1.2}
                  transition={{ duration: 0.3 }}
                />
                <text x={x0 + nameW + c * colW + (colW - 4) / 2} y={y0 + r * rowH + 18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {v}
                </text>
              </g>
            ))}
          </g>
        ))}

        {showCount && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
            {rowIdxs.map((r, i) => (
              <text key={r} x={x0} y={y0 + nR * rowH + 20 + i * 16} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {countries[r]}: {rowStamps(r)} × {prices[r]}¢ = {rowCost(r)}¢
              </text>
            ))}
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
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 320,
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
