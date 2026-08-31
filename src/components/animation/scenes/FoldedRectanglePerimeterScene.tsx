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
 * Folding a square in half and cutting both layers parallel to the fold
 * splits it into three real rectangles: the piece next to the fold stays
 * joined across the crease when unfolded (a large rectangle), while the
 * piece at the open edge splits into two separate small rectangles — the
 * scene folds, cuts, and unfolds the real square to build both shapes, then
 * has to survive the trap of comparing their *areas* instead of their
 * perimeters before forming the real ratio.
 * Data: { side }.
 */
export function FoldedRectanglePerimeterScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = Math.max(2, num(data.side, 4));

  const foldedW = side / 2;
  const smallW = foldedW / 2;
  const largeW = foldedW;
  const smallPerim = 2 * (side + smallW);
  const largePerim = 2 * (side + largeW);
  const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
  const div = g(smallPerim, largePerim) || 1;
  const ratioStr = `${smallPerim / div}/${largePerim / div}`;
  const answerOk = problem.shortAnswer == null || ratioStr === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${ratioStr}, stored answer is ${problem.shortAnswer}` : "";

  const smallArea = side * smallW;
  const largeArea = side * largeW;
  const gA = g(smallArea, largeArea) || 1;
  const areaRatioStr = `${smallArea / gA}/${largeArea / gA}`;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === areaRatioStr);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCut = step >= 1;
  const showTrap = step === 2 && !isFinal;

  const unit = 26;
  const ox = 40;
  const oy = 20;
  const W = 300;
  const H = 200;

  const caption = isFinal
    ? `${smallPerim}/${largePerim} = ${ratioStr}`
    : showTrap
    ? trapChoice
      ? `comparing areas gives ${smallArea}/${largeArea} = ${areaRatioStr} — choice ${trapChoice.label}, but the question asks for perimeter`
      : `comparing areas gives ${areaRatioStr}, not what's asked`
    : showCut
    ? `small: 2(${side}+${smallW}) = ${smallPerim}; large: 2(${side}+${largeW}) = ${largePerim}`
    : `fold the ${side}×${side} square in half, then cut both layers parallel to the fold`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showCut && (
          <g>
            <rect x={ox} y={oy} width={side * unit} height={side * unit} fill="#eef2ff" stroke={INK} strokeWidth={2} />
            <line x1={ox + foldedW * unit} y1={oy} x2={ox + foldedW * unit} y2={oy + side * unit} stroke={IND} strokeWidth={2} strokeDasharray="5 4" />
            <text x={ox + foldedW * unit} y={oy - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
              fold
            </text>
            <text x={ox + (side * unit) / 2} y={oy + side * unit + 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {side} × {side} square
            </text>
          </g>
        )}

        {showCut && (
          <g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <rect x={ox} y={oy} width={largeW * unit} height={side * unit} fill="#dcfce7" stroke={WIN} strokeWidth={2} />
              <text x={ox + (largeW * unit) / 2} y={oy + side * unit + 18} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                large {side}×{largeW}
              </text>
            </motion.g>

            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}>
              <rect x={ox + largeW * unit + 14} y={oy} width={smallW * unit} height={side * unit} fill="#eef2ff" stroke={IND} strokeWidth={2} />
              <text x={ox + largeW * unit + 14 + (smallW * unit) / 2} y={oy + side * unit + 18} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                small {side}×{smallW}
              </text>
            </motion.g>

            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 }}>
              <rect x={ox + largeW * unit + 14 + smallW * unit + 10} y={oy} width={smallW * unit} height={side * unit} fill="#eef2ff" stroke={IND} strokeWidth={2} />
              <text x={ox + largeW * unit + 14 + smallW * unit + 10 + (smallW * unit) / 2} y={oy + side * unit + 18} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                small {side}×{smallW}
              </text>
            </motion.g>
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
