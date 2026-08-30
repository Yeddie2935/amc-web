import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const DIM = "#94a3b8";
const COLORS = ["#4338ca", "#2563eb", "#16a34a"];

/**
 * Cans fill a target total using the largest pack size first, then the next
 * size, until the remainder is used up — greedy pack counting.
 * Data: { target: 90, packSizes: [24, 12, 6] } (largest to smallest).
 */
export function PackGreedyFillScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = num(data.target, 90);
  const packSizes = Array.isArray(data.packSizes) ? (data.packSizes as number[]).map((s) => num(s, 0)) : [24, 12, 6];

  let remaining = target;
  const counts = packSizes.map((size) => {
    const c = Math.floor(remaining / size);
    remaining -= c * size;
    return c;
  });
  const totalPacks = counts.reduce((a, b) => a + b, 0);

  const isFinal = step >= totalSteps - 1;
  const showFirst = step >= 1;
  const showRest = step >= 2;

  let usedSoFar = 0;
  const barW = 260;
  const X0 = 30;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `${target} cans needed, packs of ${packSizes.join(", ")}`
          : isFinal
            ? "count the total packs"
            : showRest
              ? "use the smaller packs for what's left"
              : `use the biggest pack, ${packSizes[0]}, first`}
      </div>

      <svg viewBox="0 0 320 190" width="100%" style={{ maxWidth: 340 }}>
        <text x={X0} y="16" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
          {target} cans
        </text>
        <rect x={X0} y="24" width={barW} height="22" rx="5" fill="#f1f5f9" stroke={INK} strokeWidth="1.2" />

        {packSizes.map((size, i) => {
          const visible = i === 0 ? showFirst : showRest;
          if (!visible || counts[i] === 0) return null;
          const segLen = counts[i] * size;
          const x = X0 + (usedSoFar / target) * barW;
          const w = (segLen / target) * barW;
          usedSoFar += segLen;
          return (
            <motion.rect key={i} x={x} y="24" height="22" fill={COLORS[i % COLORS.length]} initial={{ width: 0 }} animate={{ width: w }} transition={{ duration: 0.5, delay: i * 0.15 }} />
          );
        })}

        {packSizes.map((size, i) => {
          const rowY = 68 + i * 26;
          const visible = i === 0 ? showFirst : showRest;
          return (
            <AnimatePresence key={i}>
              {visible && counts[i] > 0 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {Array.from({ length: counts[i] }).map((_, j) => (
                    <rect key={j} x={X0 + j * 28} y={rowY} width="22" height="18" rx="4" fill={COLORS[i % COLORS.length]} fillOpacity="0.85" />
                  ))}
                  <text x={X0 + counts[i] * 28 + 8} y={rowY + 14} fontSize="11" fontWeight="800" fill={COLORS[i % COLORS.length]} fontFamily={FONT}>
                    {counts[i]} × {size} = {counts[i] * size}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          );
        })}

        {isFinal && (
          <text x={X0} y="180" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>
            {counts.join(" + ")} = {totalPacks} packs
          </text>
        )}
      </svg>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
