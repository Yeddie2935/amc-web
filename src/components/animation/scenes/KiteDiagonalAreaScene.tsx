import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const BAD = "#dc2626";

/**
 * The kite's own diagonals cut it into two triangles, so the scene draws the
 * real grid kite, splits it along the horizontal diagonal into a small top
 * triangle and a larger bottom triangle, sums their two independently
 * computed areas, and cross-checks that against the standard half-product-
 * of-diagonals formula rather than asserting either one.
 * Data: { topY, midY, bottomY, cx, leftX, rightX, gridWidth, gridHeight } —
 * grid-inch coordinates of the kite's four vertices (y measured downward).
 */
export function KiteDiagonalAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const topY = num(data.topY, 1);
  const midY = num(data.midY, 3);
  const bottomY = num(data.bottomY, 8);
  const cx = num(data.cx, 4);
  const leftX = num(data.leftX, 1);
  const rightX = num(data.rightX, 7);
  const gridW = Math.max(1, num(data.gridWidth, 7));
  const gridH = Math.max(1, num(data.gridHeight, 8));

  const horizDiag = rightX - leftX;
  const vertDiag = bottomY - topY;
  const topTriH = midY - topY;
  const botTriH = bottomY - midY;
  const topArea = (horizDiag * topTriH) / 2;
  const botArea = (horizDiag * botTriH) / 2;
  const sumArea = topArea + botArea;
  const formulaArea = (horizDiag * vertDiag) / 2;
  const ok = Math.abs(sumArea - formulaArea) < 1e-9;
  const answerOk = problem.shortAnswer == null || `${formulaArea} square inches` === String(problem.shortAnswer).trim();
  const failure = !ok
    ? `triangle sum ${sumArea} ≠ formula ${formulaArea}`
    : !answerOk
    ? `computed ${formulaArea}, stored answer is ${problem.shortAnswer}`
    : "";

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showSplit = step >= 1;
  const showFormula = step >= 2 || isFinal;

  const unit = 22;
  const ox = 60;
  const oy = 20;
  const px = (x: number) => ox + x * unit;
  const py = (y: number) => oy + y * unit;

  const W = 300;
  const H = 236;

  const caption = isFinal
    ? `(${horizDiag} × ${vertDiag}) ÷ 2 = ${formulaArea} sq in`
    : showFormula
    ? `${horizDiag} × ${vertDiag} ÷ 2 = ${formulaArea} — matches the triangle sum`
    : showSplit
    ? `${topArea} + ${botArea} = ${sumArea} square inches`
    : `diagonals: ${horizDiag} across, ${vertDiag} down`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {Array.from({ length: gridW + 1 }).flatMap((_, gx) =>
          Array.from({ length: gridH + 1 }).map((_, gy) => <circle key={`${gx}-${gy}`} cx={px(gx)} cy={py(gy)} r={1.6} fill="#cbd5e1" />),
        )}

        <polygon
          points={`${px(cx)},${py(topY)} ${px(rightX)},${py(midY)} ${px(cx)},${py(bottomY)} ${px(leftX)},${py(midY)}`}
          fill={showSplit ? "none" : "#eef2ff"}
          stroke={INK}
          strokeWidth={2.4}
        />

        {showSplit && (
          <>
            <motion.polygon
              points={`${px(cx)},${py(topY)} ${px(rightX)},${py(midY)} ${px(leftX)},${py(midY)}`}
              fill={IND}
              fillOpacity={0.55}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            />
            <motion.polygon
              points={`${px(leftX)},${py(midY)} ${px(rightX)},${py(midY)} ${px(cx)},${py(bottomY)}`}
              fill={WIN}
              fillOpacity={0.55}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
            />
          </>
        )}

        <line x1={px(leftX)} y1={py(midY)} x2={px(rightX)} y2={py(midY)} stroke={DIM} strokeWidth={1.6} strokeDasharray="4 3" />
        <line x1={px(cx)} y1={py(topY)} x2={px(cx)} y2={py(bottomY)} stroke={DIM} strokeWidth={1.6} strokeDasharray="4 3" />

        <text x={px(cx)} y={py(midY) - 6} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {horizDiag}
        </text>
        <text x={px(cx) + 10} y={py((topY + bottomY) / 2)} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {vertDiag}
        </text>

        {showSplit && (
          <>
            <text x={px(cx) - 6} y={py((topY + midY) / 2)} textAnchor="end" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {topArea}
            </text>
            <text x={px(cx) - 6} y={py((midY + bottomY) / 2)} textAnchor="end" fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {botArea}
            </text>
          </>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
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
