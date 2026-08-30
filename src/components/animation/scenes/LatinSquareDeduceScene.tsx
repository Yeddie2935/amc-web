import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

type Cell = { r: number; c: number; v: number };

/**
 * A 4x4 Latin-square grid: the given digits sit fixed, then two forced
 * placements are revealed one at a time (each justified by a row or
 * column already needing a specific value), before the target cell's
 * value is computed as the one digit missing from its column. A beat is
 * spent on the trap of just copying the nearest filled neighbor above it.
 * Data: { size, givens, deductions, target }.
 */
export function LatinSquareDeduceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const size = Math.max(3, Math.round(Number(data.size) || 4));
  const givens: Cell[] = Array.isArray(data.givens) ? (data.givens as Cell[]) : [];
  const deductions: Cell[] = Array.isArray(data.deductions) ? (data.deductions as Cell[]) : [];
  const target = (data.target as { r: number; c: number } | undefined) ?? { r: size - 1, c: size - 1 };

  const lastStep = totalSteps - 1;
  const showD1 = step >= 1 && deductions.length >= 1;
  const showD2 = step >= 2 && deductions.length >= 2;
  const showTrap = step === 3;
  const showTargetDeduced = step >= 4;
  const isFinal = step >= lastStep;

  const filledBeforeTarget: Cell[] = [...givens, ...(showD1 ? [deductions[0]] : []), ...(showD2 ? deductions.slice(0, 2) : [])];

  // the target's value is the one digit 1..size missing from its column
  const colValues = filledBeforeTarget.filter((cell) => cell.c === target.c).map((cell) => cell.v);
  const targetValue = Array.from({ length: size }, (_, i) => i + 1).find((v) => !colValues.includes(v)) ?? 0;

  const matches = problem.shortAnswer == null || String(targetValue) === String(problem.shortAnswer);
  const failure = showTargetDeduced && !matches ? `check failed: missing digit in column = ${targetValue}, stored answer is ${problem.shortAnswer}` : "";

  // trap: copy the nearest filled cell above the target in the same column
  const above = filledBeforeTarget.filter((cell) => cell.c === target.c && cell.r < target.r).sort((a, b) => b.r - a.r)[0];
  const trapValue = above?.v;
  const trapChoice = trapValue != null && trapValue !== targetValue ? (problem.choices ?? []).find((ch) => ch.text.trim() === String(trapValue)) : null;

  const caption = isFinal
    ? `the lower-right square is ${targetValue}`
    : showTargetDeduced
    ? `column has {${colValues.join(",")}} — the missing digit is ${targetValue}`
    : showTrap && trapChoice
    ? `copying the ${trapValue} above would repeat it — choice ${trapChoice.label}, not allowed`
    : showD2
    ? `row ${deductions[1].r + 1} and column ${deductions[1].c + 1} force a ${deductions[1].v}`
    : showD1
    ? `row ${deductions[0].r + 1} and column ${deductions[0].c + 1} force a ${deductions[0].v}`
    : `fill 1-${size} once per row and column`;

  const note = failure || "";

  // ---- geometry ----
  const cell = 40;
  const ox = 20;
  const oy = 20;
  const W = ox * 2 + size * cell;
  const H = oy * 2 + size * cell;
  const xOf = (c: number) => ox + c * cell;
  const yOf = (r: number) => oy + r * cell;

  const allFilled: Cell[] = [
    ...givens,
    ...(showD1 ? [deductions[0]] : []),
    ...(showD2 ? [deductions[1]] : []),
    ...(showTargetDeduced ? [{ r: target.r, c: target.c, v: targetValue }] : []),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        {/* grid lines */}
        {Array.from({ length: size + 1 }).map((_, i) => (
          <g key={i}>
            <line x1={ox} x2={ox + size * cell} y1={yOf(i)} y2={yOf(i)} stroke="#cbd5e1" strokeWidth={1.2} />
            <line x1={xOf(i)} x2={xOf(i)} y1={oy} y2={oy + size * cell} stroke="#cbd5e1" strokeWidth={1.2} />
          </g>
        ))}

        {/* target cell highlight box */}
        <motion.rect
          x={xOf(target.c) + 2}
          y={yOf(target.r) + 2}
          width={cell - 4}
          height={cell - 4}
          rx={4}
          fill="none"
          stroke={showTargetDeduced ? WIN : IND}
          strokeWidth={2}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />

        {/* trap: cross out the neighbor above when repeated */}
        <AnimatePresence>
          {showTrap && above && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={xOf(target.c) + 6} y1={yOf(above.r) + 6} x2={xOf(target.c) + cell - 6} y2={yOf(above.r) + cell - 6} stroke={BAD} strokeWidth={2} />
              <line x1={xOf(target.c) + cell - 6} y1={yOf(above.r) + 6} x2={xOf(target.c) + 6} y2={yOf(above.r) + cell - 6} stroke={BAD} strokeWidth={2} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* filled digits */}
        {allFilled.map((cellData, i) => {
          const isTarget = cellData.r === target.r && cellData.c === target.c;
          const isNew = (showD1 && cellData === deductions[0]) || (showD2 && cellData === deductions[1]) || (isTarget && showTargetDeduced);
          return (
            <motion.text
              key={i}
              x={xOf(cellData.c) + cell / 2}
              y={yOf(cellData.r) + cell / 2 + 5}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={isTarget && showTargetDeduced ? "#166534" : isNew ? IND : INK}
              fontFamily={numberFont}
              initial={isNew ? { opacity: 0, scale: 0.4 } : { opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {cellData.v}
            </motion.text>
          );
        })}

        {/* the target's "?" placeholder before it's deduced */}
        {!showTargetDeduced && (
          <text x={xOf(target.c) + cell / 2} y={yOf(target.r) + cell / 2 + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
            ?
          </text>
        )}
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
