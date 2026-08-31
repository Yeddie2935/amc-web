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
 * Scaling a shape scales every length in it by the same factor, including
 * both diagonals — so the scene grows the small kite's real diagonals by
 * the real scale factor side by side, with a trap beat for scaling only one
 * of them by the full factor while the other slips to a smaller multiple,
 * before adding the two true scaled lengths for the total bracing.
 * Data: { diagonal1, diagonal2, scale }.
 */
export function KiteScaledBracingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const d1 = Math.max(1, num(data.diagonal1, 6));
  const d2 = Math.max(1, num(data.diagonal2, 7));
  const scale = Math.max(1, num(data.scale, 3));

  const bigD1 = d1 * scale;
  const bigD2 = d2 * scale;
  const total = bigD1 + bigD2;
  const answerOk = problem.shortAnswer == null || `${total} inches` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${total} inches, stored answer is ${problem.shortAnswer}` : "";

  const partialScale = scale - 1;
  const trapD2 = d2 * partialScale;
  const trapTotal = bigD1 + trapD2;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapTotal));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showScale = step >= 1;
  const showTrap = step === 1 && !isFinal;
  const showBoth = step >= 2 || isFinal;

  const W = 300;
  const H = 200;
  const unit = 6;
  const barY1 = 60;
  const barY2 = 110;
  const barX0 = 30;

  const Bar = ({ y, small, big, color, label, wrongBig }: { y: number; small: number; big: number; color: string; label: string; wrongBig?: number }) => (
    <g>
      <text x={barX0 - 10} y={y + 4} textAnchor="end" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
        {label}
      </text>
      <rect x={barX0} y={y - 6} width={small * unit} height={12} rx={3} fill="#e2e8f0" />
      <text x={barX0 + small * unit / 2} y={y + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont}>
        {small}
      </text>
      {showScale && (
        <motion.rect
          x={barX0}
          y={y - 6}
          width={(wrongBig ?? big) * unit}
          height={12}
          rx={3}
          fill={wrongBig != null ? BAD : color}
          fillOpacity={0.75}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          style={{ transformBox: "fill-box", transformOrigin: "left" }}
        />
      )}
      {showScale && (
        <text x={barX0 + ((wrongBig ?? big) * unit) / 2} y={y + 24} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={wrongBig != null ? BAD : color} fontFamily={numberFont}>
          {wrongBig ?? big}
        </text>
      )}
    </g>
  );

  const caption = isFinal
    ? `${bigD1} + ${bigD2} = ${total} inches of bracing`
    : showBoth
    ? `${bigD1} + ${bigD2} = ${total}`
    : showTrap
    ? trapChoice
      ? `scaling only one diagonal fully gives ${bigD1} + ${trapD2} = ${trapTotal} — choice ${trapChoice.label}`
      : `scaling the second diagonal by ×${partialScale} instead of ×${scale} gives ${trapTotal}`
    : `scale both diagonals by ×${scale}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <Bar y={barY1} small={d1} big={bigD1} color={IND} label="across" />
        <Bar y={barY2} small={d2} big={bigD2} color={WIN} label="down" wrongBig={showTrap ? trapD2 : undefined} />
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
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
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
