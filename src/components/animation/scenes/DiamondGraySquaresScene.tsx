import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const GRAY_FILL = "#9ca3af";
const GRAY_STROKE = "#4b5563";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * A diamond made of unit squares — really just a plain square grid rotated
 * 45° for display. The scene draws the real unrotated grid, wraps it in one
 * rotated group (so the geometry is exact, not approximated), splits the
 * single big center square into the four unit squares it is actually made
 * of, then counts gray and white units one at a time before reducing the
 * ratio — landing on a fraction that matches none of the choices as written,
 * which is itself the reason to simplify.
 * Data: { gridSize, grayCells:[[row,col],...], mergedRow, mergedCol, mergedSize }.
 */
export function DiamondGraySquaresScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const gridSize = Math.max(2, Math.round(num(data.gridSize, 4)));
  const grayCells: [number, number][] = (Array.isArray(data.grayCells) ? data.grayCells : []).map((c) => {
    const arr = Array.isArray(c) ? c : [0, 0];
    return [Math.round(num(arr[0], 0)), Math.round(num(arr[1], 0))] as [number, number];
  });
  const mergedRow = Math.round(num(data.mergedRow, 1));
  const mergedCol = Math.round(num(data.mergedCol, 1));
  const mergedSize = Math.max(1, Math.round(num(data.mergedSize, 2)));

  const graySet = new Set(grayCells.map(([r, c]) => `${r},${c}`));
  const grayCount = grayCells.length;
  const whiteCount = gridSize * gridSize - grayCount;
  const g = gcd(grayCount, whiteCount) || 1;
  const simpGray = grayCount / g;
  const simpWhite = whiteCount / g;
  const resultStr = `${simpGray} : ${simpWhite}`;

  const matches = problem.shortAnswer == null || resultStr.replace(/\s/g, "") === String(problem.shortAnswer).replace(/\s/g, "");
  const failure = !matches ? `check failed: ${grayCount}:${whiteCount} → ${resultStr}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showSplit = step >= 1;
  const grayPhase = step === 2;
  const whitePhase = step === 3;
  const isFinal = step >= lastStep;
  const countsSettled = step >= 2;

  // ordering for the staggered counts
  const grayOrder = grayCells;
  const whiteOrder: [number, number][] = [];
  for (let r = 0; r < gridSize; r++) for (let c = 0; c < gridSize; c++) if (!graySet.has(`${r},${c}`)) whiteOrder.push([r, c]);

  // ---- geometry ----
  const s = 26;
  const W = 260;
  const H = 260;
  const cx = W / 2;
  const cy = H / 2;
  const originX = cx - (gridSize * s) / 2;
  const originY = cy - (gridSize * s) / 2;
  const cellX = (c: number) => originX + c * s;
  const cellY = (r: number) => originY + r * s;
  const cellCx = (r: number, c: number) => cellX(c) + s / 2;
  const cellCy = (r: number, c: number) => cellY(r) + s / 2;

  const isMerged = (r: number, c: number) => r >= mergedRow && r < mergedRow + mergedSize && c >= mergedCol && c < mergedCol + mergedSize;

  const caption = isFinal
    ? `${grayCount} : ${whiteCount} = ${resultStr}`
    : whitePhase
    ? `${whiteCount} white unit squares`
    : grayPhase
    ? `${grayCount} gray unit squares`
    : showSplit
    ? `the big square is really ${mergedSize * mergedSize} unit squares`
    : `a grid of unit squares, rotated into a diamond`;

  const note = failure || (isFinal && !problem.choices?.some((c) => c.text.replace(/\s/g, "") === `${grayCount}:${whiteCount}`) ? `${grayCount}:${whiteCount} isn't listed — simplify to ${resultStr}` : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        <g transform={`rotate(45 ${cx} ${cy})`}>
          {Array.from({ length: gridSize }).flatMap((_, r) =>
            Array.from({ length: gridSize }).map((__, c) => {
              const isGray = graySet.has(`${r},${c}`);
              const merged = isMerged(r, c);
              if (merged && !showSplit) return null; // drawn as one big rect below instead
              return (
                <motion.rect
                  key={`${r}-${c}`}
                  x={cellX(c)}
                  y={cellY(r)}
                  width={s}
                  height={s}
                  fill={isGray ? GRAY_FILL : "#fff"}
                  stroke={isGray ? GRAY_STROKE : "#94a3b8"}
                  strokeWidth={1.3}
                  initial={merged ? { opacity: 0, scale: 0.85 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              );
            }),
          )}

          {/* the merged block, drawn as one big square until the split beat */}
          {!showSplit && (
            <rect
              x={cellX(mergedCol)}
              y={cellY(mergedRow)}
              width={s * mergedSize}
              height={s * mergedSize}
              fill={GRAY_FILL}
              stroke={GRAY_STROKE}
              strokeWidth={1.3}
            />
          )}

          {/* gray-count pips, staggered during the gray-counting beat */}
          <AnimatePresence>
            {(grayPhase || countsSettled || isFinal) &&
              grayOrder.map(([r, c], i) => (
                <motion.text
                  key={`g${r}-${c}`}
                  x={cellCx(r, c)}
                  y={cellCy(r, c) + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                  fill="#fff"
                  fontFamily={numberFont}
                  transform={`rotate(-45 ${cellCx(r, c)} ${cellCy(r, c)})`}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: grayPhase ? i * 0.15 : 0 }}
                >
                  {i + 1}
                </motion.text>
              ))}
          </AnimatePresence>

          {/* white-count pips, staggered during the white-counting beat */}
          <AnimatePresence>
            {(whitePhase || isFinal) &&
              whiteOrder.map(([r, c], i) => (
                <motion.text
                  key={`w${r}-${c}`}
                  x={cellCx(r, c)}
                  y={cellCy(r, c) + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                  fill={IND}
                  fontFamily={numberFont}
                  transform={`rotate(-45 ${cellCx(r, c)} ${cellCy(r, c)})`}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: whitePhase ? i * 0.09 : 0 }}
                >
                  {i + 1}
                </motion.text>
              ))}
          </AnimatePresence>
        </g>
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
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
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: failure ? "#dc2626" : "#94a3b8",
              textAlign: "center",
            }}
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
