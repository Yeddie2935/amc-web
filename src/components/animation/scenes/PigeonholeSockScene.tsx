import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const RED = "#dc2626";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const COLORS = ["#dc2626", "#94a3b8", "#2563eb"];
const NAMES = ["red", "white", "blue"];

/**
 * Three color piles fill to one below the target (the worst case with no
 * guarantee yet), then one more sock forces some pile over the target.
 * Data: { colorCount: 3, target: 5 }.
 */
export function PigeonholeSockScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const colorCount = num(data.colorCount, 3);
  const target = num(data.target, 5);
  const worstCase = colorCount * (target - 1);
  const answer = worstCase + 1;

  const isFinal = step >= totalSteps - 1;
  const showFill = step >= 1;
  const showExtra = step >= 2;

  const colW = 60;
  const startX = 30;
  const baseY = 130;
  const cellH = 16;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `${colorCount} sock colors, need ${target} of one color`
          : isFinal
            ? "one more sock forces a fifth"
            : showExtra
              ? "the next sock must match a color already at 4"
              : `worst case: ${target - 1} of each color, no guarantee yet`}
      </div>

      <svg viewBox="0 0 220 150" width="100%" style={{ maxWidth: 240 }}>
        {Array.from({ length: colorCount }).map((_, c) => {
          const x = startX + c * colW;
          const fillCount = showFill ? target - 1 : 0;
          const extra = showExtra && c === 0 ? 1 : 0;
          return (
            <g key={c}>
              <text x={x + colW / 2 - 20} y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill={COLORS[c]} fontFamily={FONT}>
                {NAMES[c] ?? `color ${c + 1}`}
              </text>
              {Array.from({ length: fillCount + extra }).map((_, i) => (
                <motion.rect
                  key={i}
                  x={x}
                  y={baseY - (i + 1) * cellH}
                  width="40"
                  height={cellH - 2}
                  rx="3"
                  fill={i >= fillCount ? WIN : COLORS[c]}
                  fillOpacity={i >= fillCount ? 1 : 0.75}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  transition={{ delay: 0.05 * i }}
                />
              ))}
            </g>
          );
        })}
        <line x1="20" y1={baseY} x2="210" y2={baseY} stroke={DIM} strokeWidth="1.2" />
      </svg>

      <AnimatePresence>
        {showFill && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", fontSize: 11.5, fontWeight: 800, color: IND, fontFamily: FONT }}>
            {colorCount} × {target - 1} = {worstCase} socks, still no color has {target}
          </motion.div>
        )}
      </AnimatePresence>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: WIN, fontFamily: FONT, marginTop: 2 }}>
          {worstCase} + 1 = {answer}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
