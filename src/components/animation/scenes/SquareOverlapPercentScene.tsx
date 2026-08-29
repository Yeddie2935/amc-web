import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const TEAL = "#0d9488";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))));

/**
 * Two congruent squares slid together until they overlap into one wide
 * rectangle. Sliding them from "just touching" (a bare 2·side span) to their
 * final positions makes the overlap width fall out as a subtraction — 2·side
 * minus the rectangle's own width — rather than a number to just accept. The
 * real trap is which area the overlap gets divided by: it's a percent *of
 * the rectangle*, not of a single square, and those two denominators give
 * different answers.
 *
 * data: { squareSide, rectWidth }
 */
export function SquareOverlapPercentScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.squareSide, 15);
  const rectWidth = num(data.rectWidth, 25);

  const overlapWidth = 2 * side - rectWidth;
  const overlapArea = overlapWidth * side;
  const rectArea = rectWidth * side;
  const squareArea = side * side;
  const percent = (overlapArea / rectArea) * 100;
  const trapPercent = (overlapArea / squareArea) * 100;

  const expected = tidy(percent);
  const ok = expected === (problem.shortAnswer ?? "").trim();
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === Number(trapPercent.toFixed(2)) && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 slide together, 2 overlap area, 3 rectangle area, 4 the trap, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 280;
  const scale = 200 / (2 * side);
  const sqW = side * scale;
  const rectW = rectWidth * scale;
  const rectH = side * scale;
  const X0 = (W - rectW) / 2;
  const Y0 = 50;

  const leftX = X0;
  const rightXStart = X0 + sqW; // touching, no overlap
  const rightXEnd = X0 + rectW - sqW; // final, overlapping
  const overlapX0 = rightXEnd;
  const overlapX1 = leftX + sqW;

  const caption =
    beat === 0
      ? `two ${tidy(side)}×${tidy(side)} squares`
      : beat === 1
      ? `2×${tidy(side)} − ${tidy(rectWidth)} = ${tidy(overlapWidth)} overlap`
      : beat === 2
      ? `${tidy(overlapWidth)} × ${tidy(side)} = ${tidy(overlapArea)} overlap area`
      : beat === 3
      ? `${tidy(rectWidth)} × ${tidy(side)} = ${tidy(rectArea)} rectangle area`
      : beat === 4
      ? `${tidy(overlapArea)} / ${tidy(squareArea)} = ${tidy(trapPercent)}% — of one square, not the rectangle`
      : `${tidy(overlapArea)} / ${tidy(rectArea)} = ${expected}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* the rectangle outline, once the squares have merged */}
        {beat >= 1 && (
          <rect x={X0} y={Y0} width={rectW} height={rectH} fill="none" stroke={INK} strokeWidth={1.6} />
        )}

        {/* the left square, fixed */}
        <rect x={leftX} y={Y0} width={sqW} height={rectH} fill={IND} fillOpacity={0.12} stroke={IND} strokeWidth={2} />

        {/* the right square, sliding from "just touching" to its final spot */}
        <motion.rect
          y={Y0}
          width={sqW}
          height={rectH}
          fill={TEAL}
          fillOpacity={0.12}
          stroke={TEAL}
          strokeWidth={2}
          initial={{ x: rightXStart }}
          animate={{ x: beat === 0 ? rightXStart : rightXEnd }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />

        {/* the overlap, shaded once the squares have merged */}
        {beat >= 1 && (
          <motion.rect
            x={overlapX0}
            y={Y0}
            width={overlapX1 - overlapX0}
            height={rectH}
            fill={beat === 4 ? BAD : "#475569"}
            fillOpacity={0.35}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        )}

        {/* the overlap-width bracket */}
        {beat === 1 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <path d={`M ${overlapX0},${Y0 - 10} L ${overlapX0},${Y0 - 18} L ${overlapX1},${Y0 - 18} L ${overlapX1},${Y0 - 10}`} fill="none" stroke={INK} strokeWidth={1.4} />
            <text x={(overlapX0 + overlapX1) / 2} y={Y0 - 22} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
              {tidy(overlapWidth)}
            </text>
          </motion.g>
        )}

        {/* rectangle width bracket, for the area beat */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <path d={`M ${X0},${Y0 + rectH + 10} L ${X0},${Y0 + rectH + 18} L ${X0 + rectW},${Y0 + rectH + 18} L ${X0 + rectW},${Y0 + rectH + 10}`} fill="none" stroke={INK} strokeWidth={1.4} />
            <text x={X0 + rectW / 2} y={Y0 + rectH + 32} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
              {tidy(rectWidth)}
            </text>
          </motion.g>
        )}

        {/* beat 4: outline the whole left square as the wrong denominator */}
        {beat === 4 && (
          <motion.rect x={leftX} y={Y0} width={sqW} height={rectH} fill="none" stroke={BAD} strokeWidth={2.4} strokeDasharray="5 4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
        )}

        {/* beat 5: the rectangle outline emphasized as the real whole */}
        {beat === 5 && (
          <motion.rect x={X0} y={Y0} width={rectW} height={rectH} fill="none" stroke={WIN} strokeWidth={2.6} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 4 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 4 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 4 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 4 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 280 }}>
            {trapChoice ? `choice ${trapChoice.label} (${tidy(trapPercent)}) divides by one square, not the whole rectangle` : `the question asks for a percent of the rectangle, not one square`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${expected}% but stored answer reads "${problem.shortAnswer}"`}
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
