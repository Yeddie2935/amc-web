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
 * An L-shaped shaded region is the big square minus every white square cut
 * from it — the scene builds the real outer square from its own three
 * labeled segments, drops in the three real inscribed squares, and shades
 * whatever's left via an even-odd path (big square minus all three) so the
 * L-shape is computed geometry, not a hand-traced guess. A beat is spent on
 * the trap of subtracting only two of the three white squares.
 * Data: { segments (3 side lengths that sum to the big square's side) }.
 */
export function ShadedLSquareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const segments = (Array.isArray(data.segments) ? data.segments : [1, 3, 1]).map((v) => Math.max(1, num(v, 1)));
  const [s1, s2, s3] = segments;
  const side = s1 + s2 + s3;

  const bigArea = side * side;
  const whiteAreas = [s1 * s1, s2 * s2, s3 * s3];
  const whiteSum = whiteAreas.reduce((a, b) => a + b, 0);
  const shaded = bigArea - whiteSum;
  const answerOk = problem.shortAnswer == null || String(shaded) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${shaded}, stored answer is ${problem.shortAnswer}` : "";

  const trapSum = whiteAreas[0] + whiteAreas[1];
  const trapShaded = bigArea - trapSum;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapShaded));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showAll = step >= 2 || isFinal;

  const unit = 32;
  const ox = 40;
  const oy = 20;
  const W = 300;
  const H = 220;

  const caption = isFinal
    ? `${bigArea} − (${whiteAreas.join(" + ")}) = ${shaded}`
    : showAll
    ? `${whiteAreas.join(" + ")} = ${whiteSum}`
    : showTrap
    ? trapChoice
      ? `forgetting one white square: ${bigArea} − ${trapSum} = ${trapShaded} — choice ${trapChoice.label}`
      : `forgetting one white square gives ${trapShaded}, not the full subtraction`
    : `outer square side: ${s1} + ${s2} + ${s3} = ${side}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <path
          d={`M ${ox} ${oy} H ${ox + side * unit} V ${oy + side * unit} H ${ox} Z
              M ${ox} ${oy} H ${ox + s1 * unit} V ${oy + s1 * unit} H ${ox} Z
              M ${ox + s1 * unit} ${oy + s1 * unit} H ${ox + (s1 + s2) * unit} V ${oy + (s1 + s2) * unit} H ${ox + s1 * unit} Z
              ${showAll || isFinal ? `M ${ox + (s1 + s2) * unit} ${oy + (s1 + s2) * unit} H ${ox + side * unit} V ${oy + side * unit} H ${ox + (s1 + s2) * unit} Z` : ""}`}
          fill={showAll || showTrap || isFinal ? WIN : "#eef2ff"}
          fillOpacity={showAll || showTrap || isFinal ? 0.55 : 1}
          fillRule="evenodd"
          stroke={INK}
          strokeWidth={2}
        />
        {showTrap && (
          <rect x={ox + (s1 + s2) * unit} y={oy + (s1 + s2) * unit} width={s3 * unit} height={s3 * unit} fill="none" stroke={BAD} strokeWidth={2} strokeDasharray="3 2" />
        )}

        <text x={ox + (s1 * unit) / 2} y={oy - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
          {s1}
        </text>
        <text x={ox + s1 * unit + (s2 * unit) / 2} y={oy - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
          {s2}
        </text>
        <text x={ox + (s1 + s2) * unit + (s3 * unit) / 2} y={oy - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
          {s3}
        </text>

        <text x={ox + (s1 * unit) / 2} y={oy + (s1 * unit) / 2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {whiteAreas[0]}
        </text>
        <text x={ox + s1 * unit + (s2 * unit) / 2} y={oy + s1 * unit + (s2 * unit) / 2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {whiteAreas[1]}
        </text>
        <text x={ox + (s1 + s2) * unit + (s3 * unit) / 2} y={oy + (s1 + s2) * unit + (s3 * unit) / 2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {whiteAreas[2]}
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
