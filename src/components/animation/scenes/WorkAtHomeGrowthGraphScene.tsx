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
 * Four real survey points have to land exactly on the chosen graph, not
 * just look like they curve the right way — the scene plots the true
 * percents across the real years, traces a candidate that curves upward
 * dramatically but overshoots one point (a beat on that near-miss trap),
 * then checks every real answer-key graph's own plotted values against the
 * actual data and keeps only the one that matches all four exactly.
 * Data: { years, values, graphs: [{letter, values}], correct }.
 */
export function WorkAtHomeGrowthGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const years = (Array.isArray(data.years) ? data.years : [1960, 1970, 1980, 1990]).map((v) => num(v, 0));
  const values = (Array.isArray(data.values) ? data.values : [5, 8, 15, 30]).map((v) => num(v, 0));
  const correct = String(data.correct ?? "E");
  const graphsRaw = Array.isArray(data.graphs) ? data.graphs : [];
  const graphs = graphsRaw.length
    ? graphsRaw.map((s) => {
        const [letter, valsStr] = String(s).split(":");
        return { letter, values: valsStr.split(",").map(Number) };
      })
    : [
        { letter: "A", values: [10, 12, 20, 30] },
        { letter: "B", values: [5, 10, 20, 25] },
        { letter: "C", values: [5, 8, 25, 30] },
        { letter: "D", values: [5, 10, 28, 30] },
        { letter: "E", values: [5, 8, 15, 30] },
      ];

  const matches = graphs.map((g) => ({ ...g, ok: g.values.every((v, i) => v === values[i]) }));
  const winner = matches.find((g) => g.ok) ?? matches[0];
  const answerOk = problem.shortAnswer == null || `Graph ${winner.letter}` === String(problem.shortAnswer).trim();
  const failure = winner.letter !== correct
    ? `matched graph ${winner.letter}, but the data's own "correct" field says ${correct}`
    : !answerOk
    ? `matched graph ${winner.letter}, stored answer is ${problem.shortAnswer}`
    : "";

  const trapGraph = matches.find((g) => !g.ok && g.values[0] === values[0] && g.values[1] === values[1] && g.values[3] === values[3] && g.values[2] !== values[2]);
  const trapChoice = trapGraph ? (problem.choices ?? []).find((c) => String(c.text).trim() === `Graph ${trapGraph.letter}`) : undefined;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showCheck = step >= 2;

  const W = 300;
  const H = 220;
  const x0 = 40;
  const x1 = 270;
  const y0 = 170;
  const y1 = 30;
  const maxV = 32;
  const px = (i: number) => x0 + (i / (years.length - 1)) * (x1 - x0);
  const py = (v: number) => y0 - (v / maxV) * (y0 - y1);

  const lineFor = (vals: number[]) => vals.map((v, i) => `${px(i)},${py(v)}`).join(" ");

  const caption = isFinal
    ? `graph ${winner.letter} matches every point: ${values.join(", ")}`
    : showCheck
    ? `checking every real graph's plotted points against the data`
    : showTrap
    ? trapChoice
      ? `graph ${trapGraph!.letter} also curves up fast, but its 1980 point is ${trapGraph!.values[2]}%, not the real ${values[2]}% — choice ${trapChoice.label}`
      : `a graph can curve the right way and still miss a point`
    : `real data: ${years.map((y, i) => `${y}→${values[i]}%`).join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showCheck && (
          <g>
            <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={INK} strokeWidth={1.6} />
            <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={INK} strokeWidth={1.6} />
            {years.map((y, i) => (
              <text key={y} x={px(i)} y={y0 + 14} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {y}
              </text>
            ))}

            {values.map((v, i) => (
              <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={px(i)} cy={py(v)} r={5} fill={IND} />
                <text x={px(i)} y={py(v) - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {v}%
                </text>
              </motion.g>
            ))}

            {showTrap && trapGraph && (
              <motion.polyline
                points={lineFor(trapGraph.values)}
                fill="none"
                stroke={BAD}
                strokeWidth={2.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </g>
        )}

        {showCheck && (
          <g>
            <text x={W / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK}>
              every real graph vs. the true data
            </text>
            {matches.map((g, i) => {
              const gx = 40 + (i % 3) * 90;
              const gy = 40 + Math.floor(i / 3) * 90;
              const gxAt = (idx: number) => gx + idx * 12;
              const gyAt = (v: number) => gy + 30 - (v / maxV) * 40;
              return (
                <motion.g key={g.letter} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <line x1={gx} y1={gy + 30} x2={gx + 40} y2={gy + 30} stroke="#cbd5e1" strokeWidth={1.2} />
                  <polyline points={g.values.map((v, idx) => `${gxAt(idx)},${gyAt(v)}`).join(" ")} fill="none" stroke={g.ok ? WIN : BAD} strokeWidth={2} />
                  <text x={gx + 20} y={gy + 44} textAnchor="middle" fontSize="10" fontWeight="800" fill={g.ok ? WIN : BAD} fontFamily={numberFont}>
                    {g.letter}
                  </text>
                  {!g.ok && (
                    <text x={gx + 20} y={gy - 4} textAnchor="middle" fontSize="12" fontWeight="900" fill={BAD}>
                      ✗
                    </text>
                  )}
                </motion.g>
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
          fontSize: 11,
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
