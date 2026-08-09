import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const FACE = "#c7d2fe";
const FACE_EDGE = "#4338ca";
const PICK = "#f59e0b";
const WIN = "#16a34a";

/** √n as coefficient·√radicand in lowest terms. */
function simplifySqrt(n: number): { coef: number; rad: number } {
  let coef = 1;
  let rad = n;
  for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
    if (rad % (k * k) === 0) {
      coef *= k;
      rad /= k * k;
      break;
    }
  }
  return { coef, rad };
}
const radStr = (coef: number, rad: number) => (rad === 1 ? `${coef}` : coef === 1 ? `√${rad}` : `${coef}√${rad}`);

/**
 * A cube net whose total area is given: the net's equal squares each take
 * area ÷ 6, that face area gives the side (a square root), and cubing it gives
 * the volume. The net then folds up into an isometric cube. Face area, side and
 * volume are all computed — and kept exact, so √3 stays √3 rather than 1.73.
 * Data: { totalArea, cells:[[col,row],...], unit? }.
 */
export function CubeNetScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalArea = num(data.totalArea, 0);
  const unit = data.unit != null ? String(data.unit) : "cm";
  const cells = Array.isArray(data.cells)
    ? data.cells
        .filter((c) => Array.isArray(c) && c.length >= 2)
        .map((c) => [num((c as number[])[0], 0), num((c as number[])[1], 0)] as [number, number])
    : [];

  const faces = cells.length || 6;
  const faceArea = totalArea / faces;
  const exact = Number.isInteger(faceArea) && faceArea > 0;
  const { coef, rad } = exact ? simplifySqrt(faceArea) : { coef: 1, rad: 1 };
  const sideStr = exact ? radStr(coef, rad) : Math.sqrt(faceArea).toFixed(2);
  const volCoef = coef * coef * coef * rad;
  const volStr = exact ? (rad === 1 ? `${coef ** 3}` : `${volCoef}√${rad}`) : Math.pow(faceArea, 1.5).toFixed(2);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showFaceArea = step >= 1 || isFinal;
  const showSide = step >= 2 || isFinal;

  // ---- net geometry ----
  const S = 33;
  const netX = 26;
  const netTop = 22;
  const maxRow = Math.max(...cells.map((c) => c[1]), 0);
  const cellX = (c: number) => netX + c * S;
  const cellY = (r: number) => netTop + (maxRow - r) * S;

  const W = 400;
  const H = 172;

  // ---- isometric cube ----
  const cx = 300;
  const cyTop = 34;
  const a = 34;
  const b = 18;
  const hgt = 40;
  const topFace = `${cx},${cyTop} ${cx + a},${cyTop + b} ${cx},${cyTop + 2 * b} ${cx - a},${cyTop + b}`;
  const leftFace = `${cx - a},${cyTop + b} ${cx},${cyTop + 2 * b} ${cx},${cyTop + 2 * b + hgt} ${cx - a},${cyTop + b + hgt}`;
  const rightFace = `${cx},${cyTop + 2 * b} ${cx + a},${cyTop + b} ${cx + a},${cyTop + b + hgt} ${cx},${cyTop + 2 * b + hgt}`;

  // the square used to demonstrate the side length
  const pickIdx = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 440 }}>
        {/* the net — squares collapse toward the cube when it folds */}
        {cells.map(([c, r], i) => {
          const hx = cellX(c);
          const hy = cellY(r);
          const picked = showSide && !isFinal && i === pickIdx;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isFinal
                  ? { opacity: 0, scale: 0.35, x: cx - (hx + S / 2), y: cyTop + b + hgt / 2 - (hy + S / 2) }
                  : { opacity: 1, scale: 1, x: 0, y: 0 }
              }
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: isFinal ? i * 0.06 : i * 0.08 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={hx} y={hy} width={S} height={S} fill={picked ? "#fef3c7" : FACE} stroke={picked ? PICK : FACE_EDGE} strokeWidth={picked ? 2.2 : 1.4} />
              {showFaceArea && (
                <text x={hx + S / 2} y={hy + S / 2 + 4.5} textAnchor="middle" fontSize="12" fontWeight="800" fill={picked ? "#92400e" : FACE_EDGE} fontFamily={numberFont}>
                  {exact ? faceArea : faceArea.toFixed(1)}
                </text>
              )}
            </motion.g>
          );
        })}

        {/* side-length labels on the demonstration square */}
        <AnimatePresence>
          {showSide && !isFinal && cells[pickIdx] && (
            <motion.g key="side" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}>
              <text
                x={cellX(cells[pickIdx][0]) + S / 2}
                y={cellY(cells[pickIdx][1]) + S + 13}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={PICK}
                fontFamily={numberFont}
              >
                {sideStr}
              </text>
              <text
                x={cellX(cells[pickIdx][0]) - 6}
                y={cellY(cells[pickIdx][1]) + S / 2 + 4}
                textAnchor="end"
                fontSize="12"
                fontWeight="800"
                fill={PICK}
                fontFamily={numberFont}
              >
                {sideStr}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the folded cube */}
        <AnimatePresence>
          {isFinal && (
            <motion.g
              key="cube"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.45 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <polygon points={topFace} fill="#e0e7ff" stroke={FACE_EDGE} strokeWidth={1.6} />
              <polygon points={leftFace} fill="#c7d2fe" stroke={FACE_EDGE} strokeWidth={1.6} />
              <polygon points={rightFace} fill="#a5b4fc" stroke={FACE_EDGE} strokeWidth={1.6} />
              <text x={cx - a - 6} y={cyTop + b + hgt / 2 + 8} textAnchor="end" fontSize="12" fontWeight="800" fill={PICK} fontFamily={numberFont}>
                {sideStr}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* fold arrow */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="arrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <path d={`M 186,${cyTop + b + hgt / 2} L 232,${cyTop + b + hgt / 2}`} stroke="#94a3b8" strokeWidth={2} />
              <path d={`M 232,${cyTop + b + hgt / 2 - 5} L 242,${cyTop + b + hgt / 2} L 232,${cyTop + b + hgt / 2 + 5} Z`} fill="#94a3b8" />
              <text x={214} y={cyTop + b + hgt / 2 - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                fold
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* caption */}
      <motion.span
        key={`${showFaceArea}-${showSide}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: isFinal ? "#166534" : showSide ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showSide ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showSide ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showFaceArea
          ? `${faces} equal faces, ${totalArea} ${unit}² in all`
          : !showSide
          ? `${totalArea} ÷ ${faces} = ${exact ? faceArea : faceArea.toFixed(2)} ${unit}² per face`
          : !isFinal
          ? `side² = ${exact ? faceArea : faceArea.toFixed(2)} → side = ${sideStr} ${unit}`
          : `V = (${sideStr})³ = ${volStr} ${unit}³`}
      </motion.span>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
