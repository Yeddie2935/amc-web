import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SMALL = "#c7d2fe";
const SMALL_EDGE = "#4338ca";
const BIG = "#bbf7d0";
const BIG_EDGE = "#16a34a";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A rectangular room ringed by 1×1 tiles with the interior filled by 2×2
 * tiles — two different tile sizes, so the count is two separate jobs, not
 * one area divided by one tile size. The beats trace the ring itself, cell by
 * cell, to count the small tiles directly (a perimeter, not a formula to
 * trust blindly), shrink to the interior rectangle that is left once the
 * ring is removed, then tile *that* with the big squares and add the two
 * counts. Border count, interior area, big-tile count and the grand total
 * are all computed from the room's own width and height; the trap of using
 * one tile size for the whole floor is computed and matched against the
 * choices. The scene flags a room too small to have an interior, or odd
 * interior dimensions the 2×2 tiles cannot exactly cover.
 * Data: { width, height }.
 */
export function BorderTileGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const width = Math.round(num(data.width, 0));
  const height = Math.round(num(data.height, 0));
  if (width < 3 || height < 3) return null;

  const innerW = width - 2;
  const innerH = height - 2;
  const interiorArea = innerW * innerH;
  const borderTiles = 2 * width + 2 * (height - 2);
  if (innerW % 2 !== 0 || innerH % 2 !== 0) return null;
  const bigCols = innerW / 2;
  const bigRows = innerH / 2;
  const bigTiles = bigCols * bigRows;
  const total = borderTiles + bigTiles;

  const allBigTiles = Math.floor((width * height) / 4);
  const trapChoice = problem.choices?.find(
    (c) => Math.abs(Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) - allBigTiles) < 1e-9
  );
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).trim() === String(total);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showInterior = step >= 1;
  const showBigTiles = isFinal;

  // ---- geometry ----
  const W = 340;
  const H = 236;
  const maxGridW = 250;
  const maxGridH = 170;
  const CS = Math.min(maxGridW / width, maxGridH / height);
  const gridW = width * CS;
  const gridH = height * CS;
  const X0 = (W - gridW) / 2;
  const Y0 = 28;
  const cellX = (c: number) => X0 + c * CS;
  const cellY = (r: number) => Y0 + r * CS;

  // perimeter cells in walking order, for a snake-like reveal
  const perimeter: { r: number; c: number }[] = [];
  for (let c = 0; c < width; c++) perimeter.push({ r: 0, c });
  for (let r = 1; r < height - 1; r++) perimeter.push({ r, c: width - 1 });
  for (let c = width - 1; c >= 0; c--) perimeter.push({ r: height - 1, c });
  for (let r = height - 2; r >= 1; r--) perimeter.push({ r, c: 0 });

  const caption = isFinal
    ? `${borderTiles} + ${bigTiles} = ${total} tiles`
    : step === 0
    ? `walk the ring: ${width} + ${width} + ${height - 2} + ${height - 2} = ${borderTiles} one-foot tiles`
    : `inside the ring is a ${innerW}×${innerH} rectangle: ${innerW} × ${innerH} = ${interiorArea} sq ft`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the room outline */}
        <rect x={X0} y={Y0} width={gridW} height={gridH} fill="none" stroke={INK} strokeWidth={1.6} />
        <text x={X0 + gridW / 2} y={Y0 - 8} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {width} ft
        </text>
        <text x={X0 - 8} y={Y0 + gridH / 2} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont} transform={`rotate(-90 ${X0 - 8} ${Y0 + gridH / 2})`}>
          {height} ft
        </text>

        {/* the border, one 1x1 tile at a time */}
        {perimeter.map((cell, i) => (
          <motion.rect
            key={`b${i}`}
            x={cellX(cell.c) + 0.6}
            y={cellY(cell.r) + 0.6}
            width={CS - 1.2}
            height={CS - 1.2}
            fill={SMALL}
            stroke={SMALL_EDGE}
            strokeWidth={0.7}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22, delay: i * 0.012 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        {/* the interior rectangle, revealed once the ring is counted */}
        <AnimatePresence>
          {showInterior && !showBigTiles && (
            <motion.rect
              key="interior"
              x={cellX(1) + 1}
              y={cellY(1) + 1}
              width={innerW * CS - 2}
              height={innerH * CS - 2}
              fill="#eef2ff"
              stroke={SMALL_EDGE}
              strokeWidth={1.4}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* the interior tiled with 2x2 tiles, final step */}
        <AnimatePresence>
          {showBigTiles &&
            Array.from({ length: bigRows }).map((_, br) =>
              Array.from({ length: bigCols }).map((_, bc) => {
                const i = br * bigCols + bc;
                return (
                  <motion.rect
                    key={`g${br}-${bc}`}
                    x={cellX(1 + bc * 2) + 1.2}
                    y={cellY(1 + br * 2) + 1.2}
                    width={2 * CS - 2.4}
                    height={2 * CS - 2.4}
                    rx={1.5}
                    fill={BIG}
                    stroke={BIG_EDGE}
                    strokeWidth={1.1}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.03 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                );
              })
            )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
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
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!agrees
              ? `this gives ${total}, which is not the stored answer`
              : trapChoice
              ? `tiling the whole ${width * height} sq ft floor with 2×2 tiles alone gives ${allBigTiles} — choice ${trapChoice.label}`
              : `${bigCols} × ${bigRows} = ${bigTiles} big tiles, plus ${borderTiles} border tiles`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
