import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const UNIT = "#fdba74";
const LARGE = "#93c5fd";

const CELL = 26;

/**
 * A square cut into 10 smaller integer-sided squares, at least 8 of them
 * unit squares. Ten squares each of area at least 1 need total area at
 * least 10, so any candidate side whose square falls short is impossible
 * outright — no fitting required to rule it out. Six beats: (0) the
 * requirement; (1) the trap — a smaller side's area can't even reach 10,
 * shown as a grid one cell short with a square that has nowhere to go;
 * (2) the working side's empty square appears; (3) the two larger squares
 * and the eight unit squares fill it in; (4) the count and area both
 * check out; (5) the badge. Data: { rejectedSide, answerSide, unitCount,
 * largeCount }.
 */
export function SquareDissectScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rejectedSide = Math.round(num(data.rejectedSide, 3));
  const answerSide = Math.round(num(data.answerSide, 4));
  const unitCount = Math.round(num(data.unitCount, 8));
  const largeCount = Math.round(num(data.largeCount, 2));

  const squareCount = unitCount + largeCount;
  const rejectedArea = rejectedSide * rejectedSide;
  const shortfall = squareCount - rejectedArea;

  const answerArea = answerSide * answerSide;
  const largeAreaTotal = answerArea - unitCount;
  const largeSide = Math.sqrt(largeAreaTotal / largeCount);
  const isIntegerLarge = Number.isInteger(largeSide) && largeSide > 0;
  const checkArea = unitCount * 1 + largeCount * largeSide * largeSide === answerArea;

  const last = totalSteps - 1;
  const isTrapStep = step === 1;
  const showAnswerGrid = step >= 2;
  const showFill = step >= 3;
  const showVerify = step >= 4;
  const isFinal = step >= last;

  const gridPx = (n: number) => n * CELL;
  const W = 260;
  const H = 190;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 260 }}>
        <AnimatePresence mode="wait">
          {!isTrapStep && !showAnswerGrid ? (
            <motion.g key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: squareCount }).map((_, i) => {
                const cols = 5;
                const x = (W - cols * (CELL + 6)) / 2 + (i % cols) * (CELL + 6);
                const y = 30 + Math.floor(i / cols) * (CELL + 10);
                const isUnit = i < unitCount;
                return (
                  <motion.rect
                    key={i}
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    fill={isUnit ? UNIT : "none"}
                    fillOpacity={0.7}
                    stroke={isUnit ? "#fff" : DIM}
                    strokeWidth={1.4}
                    strokeDasharray={isUnit ? undefined : "3 2"}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 17, delay: i * 0.06 }}
                  />
                );
              })}
            </motion.g>
          ) : isTrapStep ? (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(() => {
                const gx0 = (W - gridPx(rejectedSide)) / 2;
                const gy0 = 20;
                return (
                  <g>
                    <rect x={gx0} y={gy0} width={gridPx(rejectedSide)} height={gridPx(rejectedSide)} fill="none" stroke={INK} strokeWidth={1.6} />
                    {Array.from({ length: rejectedSide }).flatMap((_, r) =>
                      Array.from({ length: rejectedSide }).map((_, c) => {
                        const idx = r * rejectedSide + c;
                        return (
                          <motion.rect
                            key={`${r}-${c}`}
                            x={gx0 + c * CELL}
                            y={gy0 + r * CELL}
                            width={CELL}
                            height={CELL}
                            fill={UNIT}
                            fillOpacity={0.7}
                            stroke="#fff"
                            strokeWidth={1.4}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 280, damping: 18, delay: idx * 0.04 }}
                          />
                        );
                      })
                    )}
                    <motion.rect
                      x={gx0 + gridPx(rejectedSide) + 8}
                      y={gy0 + gridPx(rejectedSide) - CELL}
                      width={CELL}
                      height={CELL}
                      fill="none"
                      stroke={BAD}
                      strokeWidth={2}
                      strokeDasharray="3 2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rejectedArea * 0.04 + 0.2 }}
                    />
                    <motion.text
                      x={gx0 + gridPx(rejectedSide) + 8 + CELL / 2}
                      y={gy0 + gridPx(rejectedSide) - CELL / 2 + 4}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="900"
                      fill={BAD}
                      fontFamily={FONT}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rejectedArea * 0.04 + 0.3 }}
                    >
                      ?
                    </motion.text>
                  </g>
                );
              })()}
            </motion.g>
          ) : showAnswerGrid ? (
            <motion.g key="answer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(() => {
                const gx0 = (W - gridPx(answerSide)) / 2;
                const gy0 = 20;
                const largeRows = isIntegerLarge ? largeSide : 0;
                const cells: { x: number; y: number; big: boolean }[] = [];
                for (let c = 0; c < largeCount && isIntegerLarge; c++) {
                  cells.push({ x: gx0 + c * largeRows * CELL, y: gy0, big: true });
                }
                const unitStartRow = largeRows;
                let uIdx = 0;
                const unitCells: { x: number; y: number }[] = [];
                for (let r = unitStartRow; r < answerSide; r++) {
                  for (let c = 0; c < answerSide; c++) {
                    if (uIdx < unitCount) {
                      unitCells.push({ x: gx0 + c * CELL, y: gy0 + r * CELL });
                      uIdx++;
                    }
                  }
                }
                return (
                  <g>
                    <rect x={gx0} y={gy0} width={gridPx(answerSide)} height={gridPx(answerSide)} fill="none" stroke={INK} strokeWidth={1.6} />
                    <AnimatePresence>
                      {showFill &&
                        cells.map((cell, i) => (
                          <motion.rect
                            key={`L${i}`}
                            x={cell.x}
                            y={cell.y}
                            width={largeRows * CELL}
                            height={largeRows * CELL}
                            fill={LARGE}
                            fillOpacity={0.75}
                            stroke="#fff"
                            strokeWidth={1.6}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 240, damping: 17, delay: i * 0.15 }}
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                          />
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                      {showFill &&
                        unitCells.map((cell, i) => (
                          <motion.rect
                            key={`U${i}`}
                            x={cell.x}
                            y={cell.y}
                            width={CELL}
                            height={CELL}
                            fill={UNIT}
                            fillOpacity={0.75}
                            stroke="#fff"
                            strokeWidth={1.4}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 280, damping: 18, delay: largeCount * 0.15 + i * 0.06 }}
                          />
                        ))}
                    </AnimatePresence>
                  </g>
                );
              })()}
            </motion.g>
          ) : null}
        </AnimatePresence>
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 300,
          color: isFinal ? WIN : showVerify ? WIN : showFill ? MARK : showAnswerGrid ? MARK : isTrapStep ? BAD : DIM,
        }}
      >
        {isFinal
          ? `side ${answerSide} is possible, and smaller sides aren't — the minimum`
          : showVerify
          ? `${unitCount} unit squares + ${largeCount} squares of side ${largeSide} = ${squareCount} squares, area ${unitCount}+${largeCount}×${largeSide}²=${answerArea}=${answerSide}²`
          : showFill
          ? `fill the rest with ${unitCount} unit squares — ${squareCount} squares total`
          : showAnswerGrid
          ? `try side ${answerSide}: area ${answerArea}, room for ${squareCount} squares`
          : isTrapStep
          ? `side ${rejectedSide}: area ${rejectedArea}, but 10 squares of area at least 1 need at least ${squareCount} — ${shortfall} short, no room for a 10th`
          : `cut a square into ${squareCount} integer-sided squares, at least ${unitCount} of area 1`}
      </motion.div>

      <AnimatePresence>
        {isFinal && !checkArea && (
          <motion.div key="warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color: BAD, textAlign: "center" }}>
            the areas don't add up to {answerSide}²
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
