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
 * A product is a multiple of a prime exactly when at least one factor
 * carries it — so the scene lights up the real 6×6 grid of dice outcomes,
 * has to survive the trap of counting the 5-row and 5-column separately
 * without removing their shared corner, then switches to the complement: the
 * clean 5×5 block with no 5 at all, subtracted from the 36 total.
 * Data: { sides }.
 */
export function DiceFiveComplementScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sides = Math.max(2, Math.round(num(data.sides, 6)));
  const target = 5;

  const total = sides * sides;
  const noTarget = (sides - 1) * (sides - 1);
  const favorable = total - noTarget;
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const div = g(favorable, total) || 1;
  const probStr = `${favorable / div}/${total / div}`;
  const answerOk = problem.shortAnswer == null || probStr === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${probStr}, stored answer is ${problem.shortAnswer}` : "";

  const trapCount = sides + sides;
  const trapDiv = g(trapCount, total) || 1;
  const trapStr = `${trapCount / trapDiv}/${total / trapDiv}`;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === trapStr);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showComplement = step >= 2 || isFinal;

  const W = 240;
  const H = 240;
  const cellS = 32;
  const x0 = 40;
  const y0 = 20;

  const cellState = (r: number, c: number): "hit" | "overlap" | "no" => {
    const hasR = r === target - 1;
    const hasC = c === target - 1;
    if (hasR && hasC) return "overlap";
    if (hasR || hasC) return "hit";
    return "no";
  };

  const caption = isFinal
    ? `${total} − ${noTarget} = ${favorable}, probability ${probStr}`
    : showComplement
    ? `no-5 block: ${sides - 1} × ${sides - 1} = ${noTarget} outcomes`
    : showTrap
    ? trapChoice
      ? `${sides} + ${sides} = ${trapCount} double-counts (5,5) — choice ${trapChoice.label}, but it's only one outcome`
      : `${sides} + ${sides} = ${trapCount} double-counts the (5,5) corner`
    : `at least one die shows 5`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 260 }}>
        {Array.from({ length: sides }).map((_, r) =>
          Array.from({ length: sides }).map((_, c) => {
            const state = cellState(r, c);
            let fill = "#f8fafc";
            let stroke = "#e2e8f0";
            if (!showComplement) {
              if (state === "overlap") {
                fill = showTrap ? BAD : WIN;
                stroke = fill;
              } else if (state === "hit") {
                fill = WIN;
                stroke = WIN;
              }
            } else {
              const isNoTarget = r !== target - 1 && c !== target - 1;
              if (isNoTarget) {
                fill = "#dbeafe";
                stroke = IND;
              } else {
                fill = "#dcfce7";
                stroke = WIN;
              }
            }
            return (
              <motion.rect
                key={`${r}-${c}`}
                x={x0 + c * cellS}
                y={y0 + r * cellS}
                width={cellS - 2}
                height={cellS - 2}
                rx={3}
                fill={fill}
                fillOpacity={fill === "#f8fafc" ? 1 : 0.8}
                stroke={stroke}
                strokeWidth={1.3}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: (r * sides + c) * 0.008 }}
              />
            );
          }),
        )}
        {Array.from({ length: sides }).map((_, i) => (
          <g key={`labels-${i}`}>
            <text x={x0 + i * cellS + cellS / 2 - 1} y={y0 - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              {i + 1}
            </text>
            <text x={x0 - 10} y={y0 + i * cellS + cellS / 2 + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              {i + 1}
            </text>
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
