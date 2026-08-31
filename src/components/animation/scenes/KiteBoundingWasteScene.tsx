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
 * A kite inscribed in its bounding rectangle by its own diagonal tips always
 * covers exactly half that rectangle, so the corner waste is the other
 * half — the scene draws the real rectangle and kite, shades the four real
 * corner triangles, and computes the rectangle area before splitting it in
 * two, with a trap beat for scaling the small kite's area by the linear
 * factor instead of its square. Data: { rectWidth, rectHeight, smallArea,
 * scale }.
 */
export function KiteBoundingWasteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rectW = Math.max(1, num(data.rectWidth, 18));
  const rectH = Math.max(1, num(data.rectHeight, 21));
  const smallArea = Math.max(1, num(data.smallArea, 21));
  const scale = Math.max(1, num(data.scale, 3));

  const rectArea = rectW * rectH;
  const kiteArea = rectArea / 2;
  const waste = rectArea - kiteArea;
  const answerOk = problem.shortAnswer == null || `${waste} square inches` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${waste}, stored answer is ${problem.shortAnswer}` : "";

  const trapArea = smallArea * scale;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapArea));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showRect = step >= 2 || isFinal;
  const showHalf = isFinal;

  const unit = 8.5;
  const ox = 40;
  const oy = 24;
  const px = (x: number) => ox + x * unit;
  const py = (y: number) => oy + y * unit;
  const cx = rectW / 2;
  const midY = num(data.midY, 6);

  const W = 300;
  const H = 240;

  const caption = isFinal
    ? `${rectArea} ÷ 2 = ${waste} square inches of waste`
    : showRect
    ? `${rectW} × ${rectH} = ${rectArea} — the kite takes half, waste takes the other half`
    : showTrap
    ? trapChoice
      ? `scaling the small area ×${scale} gives ${trapArea} — choice ${trapChoice.label}, but area scales by ×${scale}² since both dimensions grow`
      : `scaling the small area ×${scale} gives ${trapArea}, not accounting for both dimensions`
    : `the large kite sits inside an ${rectW} × ${rectH} rectangle`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <rect x={px(0)} y={py(0)} width={rectW * unit} height={rectH * unit} fill="none" stroke={DIM} strokeWidth={1.6} strokeDasharray="5 3" />

        {showRect && (
          <>
            <motion.polygon
              points={`${px(0)},${py(0)} ${px(cx)},${py(0)} ${px(cx)},${py(midY)}`}
              fill={BAD}
              fillOpacity={0.35}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.polygon
              points={`${px(rectW)},${py(0)} ${px(cx)},${py(0)} ${px(cx)},${py(midY)}`}
              fill={BAD}
              fillOpacity={0.35}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            <motion.polygon
              points={`${px(0)},${py(rectH)} ${px(cx)},${py(rectH)} ${px(cx)},${py(midY)}`}
              fill={BAD}
              fillOpacity={0.35}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.polygon
              points={`${px(rectW)},${py(rectH)} ${px(cx)},${py(rectH)} ${px(cx)},${py(midY)}`}
              fill={BAD}
              fillOpacity={0.35}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            />
          </>
        )}

        <polygon
          points={`${px(cx)},${py(0)} ${px(rectW)},${py(midY)} ${px(cx)},${py(rectH)} ${px(0)},${py(midY)}`}
          fill={showHalf ? WIN : "#eef2ff"}
          fillOpacity={showHalf ? 0.55 : 1}
          stroke={INK}
          strokeWidth={2.2}
        />

        <text x={px(rectW) + 8} y={py(rectH / 2)} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {rectH}
        </text>
        <text x={px(rectW / 2)} y={py(0) - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {rectW}
        </text>
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
