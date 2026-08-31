import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A rectangle's fence is re-used to enclose a square instead — same
 * perimeter, different shape, more area. The fence itself is drawn as a
 * traced outline (so its length is a real path, not an assumed number),
 * then that same total length is redistributed into four equal square
 * sides, and the two shapes' areas are compared side by side rather than
 * only stating the final number.
 * Data: { length, width }.
 */
export function RectangleToSquareGainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const length = Math.round(num(data.length, 50));
  const width = Math.round(num(data.width, 10));
  const rectArea = length * width;
  const perimeter = 2 * (length + width);
  const side = perimeter / 4;
  const squareArea = side * side;
  const gain = squareArea - rectArea;
  const answer = answerOf(problem);
  const valid = String(gain) === (problem.shortAnswer ?? "").replace(/[^\d]/g, "");

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: rectangle + area, 1: trace fence/perimeter, 2: reshape to square, 3: square area, 4: gain + answer
  const showPerimeter = beat >= 1;
  const showSquare = beat >= 2;
  const showSquareArea = beat >= 3;
  const showGain = beat >= 4;

  const W = 360;
  const H = 220;

  // rectangle drawn to scale (capped) on the left
  const rw = Math.min(200, length * 3);
  const rh = Math.min(70, width * 3);
  const rx = 20;
  const ry = 60;

  // square drawn to scale on the right once reshaped
  const sSize = Math.min(120, side * 3);
  const sx = W - sSize - 30;
  const sy = (H - sSize) / 2 - 6;

  const caption =
    beat === 0
      ? `rectangle ${length} × ${width}: area ${rectArea}`
      : beat === 1
      ? `fence length: 2(${length} + ${width}) = ${perimeter}`
      : beat === 2
      ? `same fence, four equal sides: ${perimeter} ÷ 4 = ${side}`
      : beat === 3
      ? `square area: ${side} × ${side} = ${squareArea}`
      : `${squareArea} − ${rectArea} = ${gain} more square feet`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400, minWidth: 0, display: "block" }} aria-label="A rectangle reshaped into a square using the same fence, comparing areas">
        {/* rectangle, fades out once the square takes over */}
        <AnimatePresence>
          {!showSquare && (
            <motion.g key="rect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={rx} y={ry} width={rw} height={rh} fill="#eef2ff" stroke={IND} strokeWidth="2.2" />
              <text x={rx + rw / 2} y={ry + rh / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>
                {rectArea}
              </text>
              <text x={rx + rw / 2} y={ry - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT}>
                {length}
              </text>
              <text x={rx - 12} y={ry + rh / 2 + 3} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT} transform={`rotate(-90 ${rx - 12} ${ry + rh / 2})`}>
                {width}
              </text>

              {/* traced fence outline */}
              <AnimatePresence>
                {showPerimeter && (
                  <motion.rect
                    x={rx}
                    y={ry}
                    width={rw}
                    height={rh}
                    fill="none"
                    stroke={GREEN}
                    strokeWidth="3.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                )}
              </AnimatePresence>
            </motion.g>
          )}
        </AnimatePresence>

        {/* square, appears once reshaped */}
        <AnimatePresence>
          {showSquare && (
            <motion.g key="square" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 170, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={sx} y={sy} width={sSize} height={sSize} fill="#dcfce7" stroke={GREEN} strokeWidth="2.4" />
              <text x={sx + sSize / 2} y={sy - 10} textAnchor="middle" fontSize="10.5" fontWeight="850" fill={GREEN} fontFamily={FONT}>
                side {side}
              </text>
              {showSquareArea && (
                <motion.text x={sx + sSize / 2} y={sy + sSize / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="950" fill={GREEN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {squareArea}
                </motion.text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* small rectangle silhouette next to the square, for area comparison */}
        {showSquareArea && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x={20} y={sy + sSize - Math.min(40, rh * 0.7)} width={Math.min(100, rw * 0.5)} height={Math.min(40, rh * 0.7)} fill="#eef2ff" stroke={IND} strokeWidth="1.6" opacity={0.7} />
            <text x={20 + Math.min(100, rw * 0.5) / 2} y={sy + sSize - Math.min(40, rh * 0.7) / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="850" fill={IND} fontFamily={FONT}>
              {rectArea}
            </text>
          </motion.g>
        )}

        <SvgAnswerBadge show={showGain} answer={answer} cx={W / 2} y={H - 26} width={190} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: showGain ? (valid ? "#166534" : "#dc2626") : INK,
          background: showGain ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showGain ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 340,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
