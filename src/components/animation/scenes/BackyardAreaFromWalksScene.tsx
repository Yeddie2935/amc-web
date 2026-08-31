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
 * Two different walking totals pin down two different measurements of the
 * same rectangle — the scene walks the length the real number of times to
 * find it, has to survive the trap of reporting the raw kilometer distance
 * itself as if it were the area, then walks the perimeter the real number
 * of times to solve for the width and multiply out the true area.
 * Data: { targetMeters, lengthWalks, perimeterWalks }.
 */
export function BackyardAreaFromWalksScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const targetMeters = Math.max(1, num(data.targetMeters, 1000));
  const lengthWalks = Math.max(1, num(data.lengthWalks, 25));
  const perimeterWalks = Math.max(1, num(data.perimeterWalks, 10));

  const length = targetMeters / lengthWalks;
  const perimeter = targetMeters / perimeterWalks;
  const halfPerimeter = perimeter / 2;
  const width = halfPerimeter - length;
  const area = length * width;
  const answerOk = problem.shortAnswer == null || String(area) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${area}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(targetMeters));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showWidth = step >= 2 || isFinal;

  const W = 300;
  const H = 190;
  const unit = 2.2;
  const rx = 90;
  const ry = 40;

  const caption = isFinal
    ? `${length} × ${width} = ${area}`
    : showWidth
    ? `${perimeter} ÷ 2 = ${length} + ${width}, so width = ${width}`
    : showTrap
    ? trapChoice
      ? `reporting the ${targetMeters}m walk itself as the area — choice ${trapChoice.label}, but that's a distance, not square meters`
      : `${targetMeters}m is the walking distance, not the area`
    : `${targetMeters} ÷ ${lengthWalks} = ${length}m length`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <rect x={rx} y={ry} width={length * unit} height={showWidth ? width * unit : 24} rx={3} fill={showTrap ? "#fee2e2" : "#eef2ff"} stroke={showTrap ? BAD : IND} strokeWidth={2} />
        <text x={rx + (length * unit) / 2} y={ry - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
          length {length}
        </text>
        {showWidth && (
          <motion.text x={rx - 10} y={ry + (width * unit) / 2 + 4} textAnchor="end" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            width {width}
          </motion.text>
        )}

        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
            <rect x={40} y={100} width={220} height={30} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.3} />
            <text x={150} y={120} textAnchor="middle" fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              "area" = {targetMeters}?
            </text>
          </motion.g>
        )}

        {isFinal && (
          <motion.text x={rx + (length * unit) / 2} y={ry + (width * unit) / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {area} m²
          </motion.text>
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
