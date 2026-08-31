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
 * A dollar jump can look small while its percent jump is huge, or vice
 * versa — the scene lines up the real prize ladder, flags the two obvious
 * doubling jumps as 100% right away, then spends a beat on the trap of
 * ranking jumps by raw dollar difference (where two very different percent
 * jumps can look tied), before computing the real percent increase for
 * every remaining candidate pair and keeping the smallest.
 * Data: { values, candidatePairs (0-based index pairs into values) }.
 */
export function MillionairePercentIncreaseScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000]).map((v) => num(v, 0));
  const pairsRaw = Array.isArray(data.candidatePairs) ? data.candidatePairs : ["0,1", "1,2", "2,3", "10,11", "13,14"];
  const pairs = pairsRaw.map((p) => String(p).split(",").map(Number) as [number, number]);

  const fmt = (v: number) => (v >= 1000 ? `${v / 1000}K` : String(v));
  const pctOf = (i: number, j: number) => Math.round(((values[j] - values[i]) / values[i]) * 10000) / 100;
  const candidates = pairs.map(([i, j]) => ({ i, j, pct: pctOf(i, j), diff: values[j] - values[i] }));
  const smallest = candidates.reduce((min, c) => (c.pct < min.pct ? c : min), candidates[0]);
  const label = (i: number, j: number) => `From ${i + 1} to ${j + 1}`;
  const answerOk = problem.shortAnswer == null || label(smallest.i, smallest.j) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `smallest computed as ${label(smallest.i, smallest.j)}, stored answer is ${problem.shortAnswer}` : "";

  const smallestDiff = candidates.reduce((min, c) => (c.diff < min.diff ? c : min), candidates[0]);
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === label(smallestDiff.i, smallestDiff.j));
  const tiedByDiff = candidates.filter((c) => c.diff === smallestDiff.diff);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showAll = step >= 2 || isFinal;

  const W = 300;
  const H = 200;
  const barX0 = 20;
  const barW = (W - 40) / values.length;

  const caption = isFinal
    ? `smallest increase: ${label(smallest.i, smallest.j)} at ${smallest.pct}%`
    : showAll
    ? `every candidate's percent increase, smallest wins`
    : showTrap
    ? tiedByDiff.length > 1
      ? `by dollar jump alone, ${tiedByDiff.map((c) => label(c.i, c.j)).join(" and ")} look tied at +${fmt(smallestDiff.diff)} — but their percents differ a lot`
      : `smallest dollar jump: ${label(smallestDiff.i, smallestDiff.j)} at +${fmt(smallestDiff.diff)}${trapChoice ? ` — choice ${trapChoice.label}` : ""}`
    : `questions 1→2 and 14→15 both double: +100%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={W / 2} y={16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
          question values (log scale)
        </text>
        {values.map((v, i) => {
          const logV = Math.log10(v);
          const logMin = Math.log10(values[0]);
          const logMax = Math.log10(values[values.length - 1]);
          const h = ((logV - logMin) / (logMax - logMin)) * 90 + 8;
          const isDouble = i === 1 || i === values.length - 1;
          return (
            <motion.rect
              key={i}
              x={barX0 + i * barW}
              y={110 - h}
              width={barW - 2}
              height={h}
              fill={isDouble && !showAll && !showTrap ? WIN : "#c7d2fe"}
              fillOpacity={0.8}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.04 }}
              style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
            />
          );
        })}
        <line x1={barX0} y1={110} x2={W - 20} y2={110} stroke={INK} strokeWidth={1.4} />

        {(showTrap || showAll) && (
          <g>
            {candidates.map((c, idx) => {
              const y = 130 + idx * 12;
              const isSmallestDiff = showTrap && c === smallestDiff;
              const isSmallestPct = showAll && c === smallest;
              return (
                <motion.text
                  key={idx}
                  x={W / 2}
                  y={y}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fill={isSmallestDiff ? BAD : isSmallestPct ? WIN : DIM}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: idx * 0.12 }}
                >
                  {label(c.i, c.j)}: +{fmt(c.diff)} ({c.pct}%)
                </motion.text>
              );
            })}
          </g>
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
