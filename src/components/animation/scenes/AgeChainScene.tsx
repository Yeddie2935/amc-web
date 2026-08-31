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
 * Two relations chain through a middle person — the scene halves the known
 * age into the middle person's real age, then has to survive the trap of
 * subtracting the final offset from the WRONG person (the original age
 * instead of the middle one) before applying it to the right link in the
 * chain. Data: { knownAge, knownName, midName, midFactor, finalName,
 * finalOffset }.
 */
export function AgeChainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const knownAge = Math.max(1, num(data.knownAge, 42));
  const knownName = String(data.knownName ?? "Aunt Anna");
  const midName = String(data.midName ?? "Brianna");
  const midFactor = Math.max(0.01, num(data.midFactor, 0.5));
  const finalName = String(data.finalName ?? "Caitlin");
  const finalOffset = num(data.finalOffset, -5);

  const midAge = knownAge * midFactor;
  const finalAge = midAge + finalOffset;
  const answerOk = problem.shortAnswer == null || String(finalAge) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${finalAge}, stored answer is ${problem.shortAnswer}` : "";

  const trapAge = knownAge + finalOffset;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapAge));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showFinal = step >= 2 || isFinal;

  const W = 300;
  const H = 190;
  const colX = [50, 150, 250];
  const rowY = 60;

  const Person = ({ x, name, age, color, show }: { x: number; name: string; age: number | null; color: string; show: boolean }) => (
    <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: show ? 1 : 0.3, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <circle cx={x} cy={rowY} r={24} fill={show ? color : "#f1f5f9"} fillOpacity={show ? 0.15 : 1} stroke={show ? color : "#cbd5e1"} strokeWidth={2} />
      <text x={x} y={rowY + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill={show ? color : DIM} fontFamily={numberFont}>
        {age != null ? age : "?"}
      </text>
      <text x={x} y={rowY + 42} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
        {name}
      </text>
    </motion.g>
  );

  const caption = isFinal
    ? `${midAge} ${finalOffset >= 0 ? "+" : "−"} ${Math.abs(finalOffset)} = ${finalAge}`
    : showTrap
    ? trapChoice
      ? `${knownAge} ${finalOffset >= 0 ? "+" : "−"} ${Math.abs(finalOffset)} = ${trapAge} — choice ${trapChoice.label}, but that offset applies to ${midName}, not ${knownName}`
      : `${knownAge} ${finalOffset >= 0 ? "+" : "−"} ${Math.abs(finalOffset)} = ${trapAge}, the wrong person`
    : showFinal
    ? `${finalName} = ${midName}'s age ${finalOffset >= 0 ? "+" : "−"} ${Math.abs(finalOffset)}`
    : `${midName} = ${knownAge} × ${midFactor} = ${midAge}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <Person x={colX[0]} name={knownName} age={knownAge} color={INK} show />
        <Person x={colX[1]} name={midName} age={midAge} color={IND} show />
        <Person x={colX[2]} name={finalName} age={showFinal ? finalAge : null} color={showTrap ? BAD : WIN} show={showFinal || showTrap} />

        <line x1={colX[0] + 26} y1={rowY} x2={colX[1] - 26} y2={rowY} stroke={IND} strokeWidth={1.6} markerEnd="url(#arrow)" />
        <text x={(colX[0] + colX[1]) / 2} y={rowY - 32} textAnchor="middle" fontSize="9" fontWeight="800" fill={IND}>
          × {midFactor}
        </text>

        {showTrap && (
          <motion.path
            d={`M ${colX[0]} ${rowY + 26} Q ${(colX[0] + colX[2]) / 2} ${rowY + 70} ${colX[2]} ${rowY + 26}`}
            fill="none"
            stroke={BAD}
            strokeWidth={1.8}
            strokeDasharray="4 3"
            markerEnd="url(#arrowRed)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {showFinal && (
          <line x1={colX[1] + 26} y1={rowY} x2={colX[2] - 26} y2={rowY} stroke={WIN} strokeWidth={1.6} markerEnd="url(#arrowGreen)" />
        )}
        {(showFinal || showTrap) && (
          <text x={(colX[1] + colX[2]) / 2} y={rowY - 32} textAnchor="middle" fontSize="9" fontWeight="800" fill={showFinal ? WIN : BAD}>
            {finalOffset >= 0 ? "+" : "−"}{Math.abs(finalOffset)}
          </text>
        )}

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={IND} />
          </marker>
          <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={WIN} />
          </marker>
          <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={BAD} />
          </marker>
        </defs>
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
