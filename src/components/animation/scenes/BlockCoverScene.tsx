import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#e2e8f0";
const HOT = "#f59e0b";
const BAND = "rgba(67,56,202,0.13)";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * Numbers 1..n^2 fill an n x n grid, and a row or column "counts" when it holds
 * at least one marked number (a multiple of some divisor). Minimising the rows
 * plus columns that count is a packing question: the marked cells all lie inside
 * the r x c block their own rows and columns cut out, so r*c must be at least the
 * number of marks, and r+c is smallest when that block is as square as it can be.
 * The scene starts from the arrangement the plain reading order gives, shows a
 * smaller r+c failing because the block cannot hold every mark, and then packs
 * them into a block that fits. Mark count, the failing block, the best block and
 * the minimum are all computed, and the result is checked against the answer.
 * Data: { size, divisor, maxNumber? }.
 */
export function BlockCoverScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.round(num(data.size, 9)));
  const div = Math.max(2, Math.round(num(data.divisor, 3)));
  const maxN = Math.round(num(data.maxNumber, n * n));
  const count = Math.floor(maxN / div);

  // where the marks land if the numbers just go in reading order
  const readCells: [number, number][] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const v = r * n + c + 1;
      if (v <= maxN && v % div === 0) readCells.push([r, c]);
    }
  const readRows = new Set(readCells.map((p) => p[0])).size;
  const readCols = new Set(readCells.map((p) => p[1])).size;

  // every block big enough to hold the marks, smallest rows+cols first
  const fits: { r: number; c: number }[] = [];
  for (let r = 1; r <= n; r++) for (let c = 1; c <= n; c++) if (r * c >= count) fits.push({ r, c });
  // fewest lines first, then the tightest block, so the picture shows how little
  // room is actually spare
  fits.sort((a, b) => a.r + a.c - (b.r + b.c) || a.r * a.c - b.r * b.c || a.r - b.r);
  const best = fits[0] ?? { r: n, c: n };
  const minSum = best.r + best.c;

  // the best block one step smaller, which cannot hold them all
  const tryS = minSum - 1;
  const tryR = Math.floor(tryS / 2);
  const tryC = tryS - tryR;
  const shortfall = count - tryR * tryC;

  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === minSum;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showLit = !isFinal && step === 1;
  const showTry = !isFinal && step === 2;

  // which cells are marked on this beat, and which rows/cols that lights
  const cells: [number, number][] = isFinal
    ? Array.from({ length: count }, (_, i) => [Math.floor(i / best.c), i % best.c] as [number, number])
    : showTry
    ? Array.from({ length: Math.min(count, tryR * tryC) }, (_, i) => [Math.floor(i / tryC), i % tryC] as [number, number])
    : readCells;
  const litRows = new Set(cells.map((p) => p[0]));
  const litCols = new Set(cells.map((p) => p[1]));
  const litTotal = litRows.size + litCols.size;

  // ---- geometry ----
  const W = 340;
  const cell = 22;
  const x0 = (W - n * cell) / 2;
  const y0 = 32;
  const H = y0 + n * cell + 22;
  const X = (c: number) => x0 + c * cell;
  const Y = (r: number) => y0 + r * cell;

  const caption = isFinal
    ? `${best.r} × ${best.c} = ${best.r * best.c} cells holds all ${count}: ${best.r} + ${best.c} = ${minSum}`
    : step === 0
    ? `${count} of the ${maxN} numbers are multiples of ${div}`
    : showLit
    ? `in reading order they fill ${readCols} whole columns: ${readRows} + ${readCols} = ${readRows + readCols}`
    : `${tryS} would mean a ${tryR} × ${tryC} block — only ${tryR * tryC} cells for ${count} marks`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* bands over every row and column that ends up counting */}
        <AnimatePresence>
          {(showLit || isFinal) && (
            <motion.g key="bands" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[...litRows].map((r) => (
                <motion.rect
                  key={`br${r}`}
                  x={x0 - 8}
                  y={Y(r)}
                  height={cell}
                  rx={3}
                  fill={BAND}
                  initial={{ width: 0 }}
                  animate={{ width: n * cell + 16 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.15 + r * 0.05 }}
                />
              ))}
              {[...litCols].map((c) => (
                <motion.rect
                  key={`bc${c}`}
                  x={X(c)}
                  y={y0 - 8}
                  width={cell}
                  rx={3}
                  fill={BAND}
                  initial={{ height: 0 }}
                  animate={{ height: n * cell + 16 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.15 + c * 0.05 }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the grid */}
        {Array.from({ length: n }).map((_, r) =>
          Array.from({ length: n }).map((__, c) => (
            <rect key={`${r}-${c}`} x={X(c)} y={Y(r)} width={cell} height={cell} fill="none" stroke={GRID} strokeWidth={1} />
          ))
        )}
        <rect x={x0} y={y0} width={n * cell} height={n * cell} fill="none" stroke="#94a3b8" strokeWidth={1.6} />

        {/* the numbers themselves, while they are still the point */}
        {step === 0 && !isFinal && (
          <g>
            {Array.from({ length: n }).map((_, r) =>
              Array.from({ length: n }).map((__, c) => {
                const v = r * n + c + 1;
                const hot = v % div === 0;
                return (
                  <text
                    key={`v${r}-${c}`}
                    x={X(c) + cell / 2}
                    y={Y(r) + cell / 2 + 3}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight={hot ? "800" : "600"}
                    fill={hot ? "#92400e" : "#cbd5e1"}
                    fontFamily={numberFont}
                  >
                    {v}
                  </text>
                );
              })
            )}
          </g>
        )}

        {/* the marked cells */}
        {cells.map(([r, c], i) => (
          <motion.rect
            key={`m${r}-${c}`}
            x={X(c) + 2}
            y={Y(r) + 2}
            width={cell - 4}
            height={cell - 4}
            rx={3}
            fill={isFinal ? "#dcfce7" : "#fef3c7"}
            stroke={isFinal ? WIN : HOT}
            strokeWidth={1.6}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: step === 0 && !isFinal ? 0.55 : 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: i * 0.012 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        {/* the block outline being tried */}
        <AnimatePresence>
          {(showTry || isFinal) && (
            <motion.rect
              key="blk"
              x={x0}
              y={y0}
              width={(isFinal ? best.c : tryC) * cell}
              height={(isFinal ? best.r : tryR) * cell}
              fill="none"
              stroke={isFinal ? WIN : BAD}
              strokeWidth={2.6}
              rx={3}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              style={{ transformBox: "fill-box", transformOrigin: "top left" }}
            />
          )}
        </AnimatePresence>

        {/* marks with nowhere to go inside the smaller block */}
        <AnimatePresence>
          {showTry && shortfall > 0 && (
            <motion.g key="spill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: shortfall }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={X(tryC) + 16 + (i % 4) * 15}
                  cy={Y(0) + 12 + Math.floor(i / 4) * 15}
                  r={5.5}
                  fill="#fee2e2"
                  stroke={BAD}
                  strokeWidth={2}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 + i * 0.15 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ))}
              <motion.text
                x={X(tryC) + 16}
                y={Y(0) + 34}
                fontSize="9.5"
                fontWeight="800"
                fill={BAD}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {shortfall} left over
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* tallies for the lit rows and columns */}
        <AnimatePresence>
          {(showLit || isFinal) && (
            <motion.g key="tal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <text x={x0 - 12} y={y0 - 12} textAnchor="end" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {litRows.size} rows
              </text>
              <text x={x0 + n * cell + 10} y={y0 + n * cell + 14} textAnchor="end" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {litCols.size} columns
              </text>
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
          color: isFinal ? "#166534" : showTry ? "#991b1b" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTry ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTry ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {step === 0 && !isFinal && (
          <motion.span
            key="rule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            a line's product is divisible by {div} exactly when it holds one of them
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTry && (
          <motion.span
            key="bound"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            r × c ≥ {count} forces r + c ≥ {minSum}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && litTotal === minSum ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && litTotal === minSum
              ? `counted off the grid: ${litRows.size} + ${litCols.size} = ${litTotal}`
              : `this packing lights ${litTotal}, not ${minSum}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
