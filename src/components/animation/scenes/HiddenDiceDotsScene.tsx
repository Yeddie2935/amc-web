import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const PIP_LAYOUTS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.25, 0.25], [0.75, 0.75]],
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]],
};

/** A small die face with its real pip count laid out in the standard pattern. */
function Face({ x, y, size, value, color }: { x: number; y: number; size: number; value: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx={3} fill="#fff" stroke={color} strokeWidth={1.6} />
      {(PIP_LAYOUTS[value] ?? []).map(([px, py], i) => (
        <circle key={i} cx={x + px * size} cy={y + py * size} r={size * 0.09} fill={color} />
      ))}
    </g>
  );
}

/**
 * Hidden dots is total dots minus visible dots — the scene grows every die's
 * 21-dot total (1 through 6), then has to survive the trap of reporting just
 * one die's total as if it were the answer, before actually laying out the
 * seven real visible faces and subtracting their sum from all 63.
 * Data: { dieCount, visibleFaces }.
 */
export function HiddenDiceDotsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const dieCount = Math.max(1, Math.round(num(data.dieCount, 3)));
  const visibleFaces = (Array.isArray(data.visibleFaces) ? data.visibleFaces : [1, 2, 3, 4, 6, 5, 1]).map((v) => Math.round(num(v, 0)));

  const perDie = 21;
  const totalDots = perDie * dieCount;
  const visibleSum = visibleFaces.reduce((a, b) => a + b, 0);
  const hidden = totalDots - visibleSum;
  const answerOk = problem.shortAnswer == null || String(hidden) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${hidden}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(perDie));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showVisible = step >= 2 || isFinal;

  const W = 300;
  const H = 210;
  const size = 34;

  const caption = isFinal
    ? `${totalDots} − ${visibleSum} = ${hidden}`
    : showVisible
    ? `${visibleFaces.join(" + ")} = ${visibleSum} visible dots`
    : showTrap
    ? trapChoice
      ? `reporting just one die's total, ${perDie} — choice ${trapChoice.label}, forgets the other two dice and the visible faces`
      : `one die alone has ${perDie} dots, not the full answer`
    : `each die: 1+2+3+4+5+6 = ${perDie}, × ${dieCount} dice = ${totalDots}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showVisible && (
          <g>
            {Array.from({ length: dieCount }).map((_, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.15 }}>
                <Face x={40 + i * 80} y={40} size={size} value={6} color={showTrap && i === 0 ? BAD : IND} />
                <text x={40 + i * 80 + size / 2} y={90} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={showTrap && i === 0 ? BAD : IND} fontFamily={numberFont}>
                  1..6 = 21
                </text>
              </motion.g>
            ))}
            <text x={W / 2} y={130} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
              21 × {dieCount} = {totalDots}
            </text>
          </g>
        )}

        {showVisible && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK}>
              the seven real visible faces
            </text>
            {visibleFaces.map((v, i) => (
              <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <Face x={20 + (i % 4) * 66} y={28 + Math.floor(i / 4) * 66} size={44} value={v} color={WIN} />
              </motion.g>
            ))}
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
