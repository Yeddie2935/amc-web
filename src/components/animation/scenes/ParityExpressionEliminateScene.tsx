import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * Five expressions in odd m, n are tested with a sample pair; the ones that
 * turn out even are eliminated, leaving the survivor to confirm by parity rule.
 * Data: { m: 1, n: 1, expressions: [{ label: "m + 3n", value: 4, survives: false }, ...] }.
 */
export function ParityExpressionEliminateScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const m = num(data.m, 1);
  const n = num(data.n, 1);
  const expressions = Array.isArray(data.expressions)
    ? (data.expressions as { label: string; value: number; survives: boolean }[])
    : [
        { label: "m + 3n", value: 4, survives: false },
        { label: "3m − n", value: 2, survives: false },
        { label: "3m² + 3n²", value: 6, survives: false },
        { label: "(nm + 3)²", value: 16, survives: false },
        { label: "3mn", value: 3, survives: true },
      ];
  const survivor = expressions.find((e) => e.survives);

  const isFinal = step >= totalSteps - 1;
  const showTest = step >= 1;
  const showRule = step >= 2;

  const rowY = (i: number) => 30 + i * 28;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "m and n are positive odd integers"
          : isFinal
            ? "3mn is always odd"
            : showRule
              ? "odd × odd = odd, so 3mn is always odd"
              : `test each with m = ${m}, n = ${n}`}
      </div>

      <svg viewBox="0 0 280 160" width="100%" style={{ maxWidth: 300 }}>
        {expressions.map((e, i) => (
          <g key={e.label}>
            <text x="10" y={rowY(i) + 5} fontSize="12.5" fontWeight="800" fill={showTest && !e.survives ? DIM : INK} fontFamily={FONT}>
              {e.label}
            </text>
            <AnimatePresence>
              {showTest && (
                <motion.g key="val" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                  <text x="180" y={rowY(i) + 5} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={e.survives ? WIN : RED} fontFamily={FONT}>
                    = {e.value}
                  </text>
                  <text x="220" y={rowY(i) + 5} fontSize="12.5" fontWeight="900" fill={e.survives ? WIN : RED}>
                    {e.survives ? "✓ odd" : "✗ even"}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        ))}
      </svg>

      {showRule && survivor && (
        <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: IND, fontFamily: FONT, marginTop: 2 }}>
          mn is odd, and 3 × odd = odd
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
