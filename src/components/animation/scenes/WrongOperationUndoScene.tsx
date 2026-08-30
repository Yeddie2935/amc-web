import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const RED = "#dc2626";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A number goes through the wrong operation (× factor) to reach the given
 * result; the arrow reverses to recover the number, then the correct
 * operation (÷ factor) runs forward to the real answer.
 * Data: { wrongResult: 60, factor: 2 }.
 */
export function WrongOperationUndoScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const wrongResult = num(data.wrongResult, 60);
  const factor = num(data.factor, 2);
  const original = wrongResult / factor;
  const correctAnswer = original / factor;

  const isFinal = step >= totalSteps - 1;
  const showUndo = step >= 1;
  const showForward = step >= 2;

  const box = (cx: number, y: number, label: string, color: string) => (
    <g>
      <rect x={cx - 34} y={y} width="68" height="34" rx="8" fill="#f8fafc" stroke={color} strokeWidth="2" />
      <text x={cx} y={y + 22} textAnchor="middle" fontSize="14" fontWeight="900" fill={color} fontFamily={FONT}>
        {label}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `Connie multiplied by ${factor} instead of dividing`
          : isFinal
            ? "apply the correct operation"
            : showForward
              ? `now divide by ${factor} — the operation she should have used`
              : `undo the wrong operation to find the number`}
      </div>

      <svg viewBox="0 0 320 130" width="100%" style={{ maxWidth: 340 }}>
        {!showForward && (
          <>
            {box(60, 20, "x", INK)}
            <line x1="94" y1="37" x2="180" y2="37" stroke={RED} strokeWidth="2.4" markerEnd="url(#arrowR)" />
            <text x="137" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill={RED} fontFamily={FONT}>
              × {factor}
            </text>
            {box(220, 20, String(wrongResult), RED)}

            <AnimatePresence>
              {showUndo && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <line x1="180" y1="70" x2="94" y2="70" stroke={IND} strokeWidth="2.4" markerEnd="url(#arrowL)" />
                  <text x="137" y="63" textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={FONT}>
                    ÷ {factor}
                  </text>
                  <text x="60" y="100" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>
                    x = {original}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </>
        )}

        {showForward && (
          <>
            {box(60, 20, String(original), IND)}
            <line x1="94" y1="37" x2="180" y2="37" stroke={WIN} strokeWidth="2.4" markerEnd="url(#arrowR)" />
            <text x="137" y="30" textAnchor="middle" fontSize="12" fontWeight="800" fill={WIN} fontFamily={FONT}>
              ÷ {factor}
            </text>
            <AnimatePresence>
              {isFinal && (
                <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  {box(220, 20, String(correctAnswer), WIN)}
                </motion.g>
              )}
            </AnimatePresence>
            {!isFinal && box(220, 20, "?", DIM)}
          </>
        )}

        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={showForward ? WIN : RED} /></marker>
          <marker id="arrowL" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={IND} /></marker>
        </defs>
      </svg>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
