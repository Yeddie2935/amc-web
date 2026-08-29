import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * A rectangle's length grows one percent and its width shrinks another. Both
 * percents apply to the *same* original side length, so a unit-square grid
 * makes the asymmetry visible: the added column is as tall as the *old*
 * width, but the removed row is as wide as the *new*, already-stretched
 * length — one more square wide than what was added, which is exactly why
 * the percents don't cancel back to 100.
 * Data: { baseLength, baseWidth, lengthPercent, widthPercent }.
 */
export function StretchSqueezeAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const baseLength = Math.max(1, Math.round(num(data.baseLength, 10)));
  const baseWidth = Math.max(1, Math.round(num(data.baseWidth, 10)));
  const lengthPercent = num(data.lengthPercent, 10);
  const widthPercent = num(data.widthPercent, -10);

  const newLength = Math.round(baseLength * (1 + lengthPercent / 100));
  const newWidth = Math.round(baseWidth * (1 + widthPercent / 100));
  const oldArea = baseLength * baseWidth;
  const newArea = newLength * newWidth;
  const percentOfOld = (100 * newArea) / oldArea;
  const addedCols = newLength - baseLength;
  const removedRows = baseWidth - newWidth;

  const matches = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - percentOfOld) < 1e-9;
  const failure = !matches ? `check failed: ${newArea} ÷ ${oldArea} × 100 = ${percentOfOld}, stored answer is ${problem.shortAnswer}` : "";

  const naiveGuess = 100;
  const trapChoice = (problem.choices ?? []).find((c) => parseChoice(c.text) === naiveGuess);

  const lastStep = totalSteps - 1;
  const showExtend = step >= 1;
  const extendActive = step === 1;
  const shrinkActive = step === 2;
  const showTrapRow = step === 3;
  const cols = showExtend ? newLength : baseLength;
  const rowsVisible = step >= 2 ? newWidth : baseWidth;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const cell = 13;
  const x0 = 16;
  const y0 = 20;
  const W = Math.max(x0 * 2 + newLength * cell + 60, 20 + 5 * 56 + 30);
  const H = y0 + baseWidth * cell + 100;
  const cx = (c: number) => x0 + c * cell;
  const cy = (r: number) => y0 + r * cell;

  const caption = isFinal
    ? `${newLength} × ${newWidth} = ${newArea}, which is ${percentOfOld}% of ${oldArea}`
    : showTrapRow
    ? `+${addedCols * baseWidth} − ${removedRows * newLength} = ${newArea - oldArea}, not 0 — so it isn't ${naiveGuess}%`
    : shrinkActive
    ? `width 10 → 9 removes a row of ${newLength}, not ${baseLength} — the rectangle is already wider`
    : showExtend
    ? `length ${baseLength} → ${newLength} adds a column of ${baseWidth}`
    : `start with a simple ${baseLength} × ${baseWidth} rectangle, area ${oldArea}`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {/* the base grid, always present up to the currently visible extent */}
        {Array.from({ length: baseLength }).map((_, c) =>
          Array.from({ length: rowsVisible }).map((_, r) => (
            <rect key={`${c}-${r}`} x={cx(c)} y={cy(r)} width={cell} height={cell} fill="#eef2ff" stroke="#c7d2fe" strokeWidth={0.8} />
          )),
        )}

        {/* the added column(s), highlighted while the extend beat is active */}
        <AnimatePresence>
          {showExtend &&
            Array.from({ length: addedCols }).map((_, i) => {
              const c = baseLength + i;
              return (
                <motion.g key={`add${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 17, delay: i * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  {Array.from({ length: rowsVisible }).map((_, r) => (
                    <rect
                      key={r}
                      x={cx(c)}
                      y={cy(r)}
                      width={cell}
                      height={cell}
                      fill={extendActive ? "#dcfce7" : "#eef2ff"}
                      stroke={extendActive ? WIN : "#c7d2fe"}
                      strokeWidth={extendActive ? 1.4 : 0.8}
                    />
                  ))}
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* the removed row(s), shown red while the shrink beat is active, then gone */}
        <AnimatePresence>
          {shrinkActive &&
            Array.from({ length: removedRows }).map((_, i) => {
              const r = baseWidth - 1 - i;
              return (
                <motion.g key={`rm${i}`} initial={{ opacity: 1 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                  {Array.from({ length: newLength }).map((_, c) => (
                    <rect key={c} x={cx(c)} y={cy(r)} width={cell} height={cell} fill="#fee2e2" stroke={BAD} strokeWidth={1.4} />
                  ))}
                </motion.g>
              );
            })}
        </AnimatePresence>

        <rect x={x0} y={y0} width={cols * cell} height={rowsVisible * cell} fill="none" stroke={INK} strokeWidth={1.8} />

        <text x={x0 + (cols * cell) / 2} y={y0 + rowsVisible * cell + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {isFinal ? `${newLength} × ${newWidth} = ${newArea}` : showExtend ? `${cols} × ${rowsVisible}` : `${baseLength} × ${baseWidth} = ${oldArea}`}
        </text>

        {/* the trap: answer choices, with the naive 100% called out */}
        <AnimatePresence>
          {showTrapRow && (
            <motion.g key="choices" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {(problem.choices ?? []).map((c, i) => {
                const isTrap = trapChoice?.label === c.label;
                const cxp = 20 + i * 56;
                return (
                  <g key={c.label}>
                    <rect
                      x={cxp - 22}
                      y={y0 + baseWidth * cell + 30}
                      width={44}
                      height={20}
                      rx={10}
                      fill={isTrap ? "#fee2e2" : "#f8fafc"}
                      stroke={isTrap ? BAD : "#cbd5e1"}
                      strokeWidth={isTrap ? 1.6 : 1}
                    />
                    <text x={cxp} y={y0 + baseWidth * cell + 44} textAnchor="middle" fontSize="10" fontWeight="800" fill={isTrap ? BAD : "#64748b"} fontFamily={numberFont}>
                      {c.label}: {c.text}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>
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
          color: isFinal ? "#166534" : shrinkActive || showTrapRow ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : shrinkActive || showTrapRow ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : shrinkActive || showTrapRow ? "#fecaca" : "#c7d2fe"}`,
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
