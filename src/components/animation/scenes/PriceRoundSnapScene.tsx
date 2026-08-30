import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * Three price tags snap to the nearest dollar on a mini number line, then the
 * rounded amounts add up. Data: { prices: [1.98, 5.04, 9.89], rounded: [2, 5, 10] }.
 */
export function PriceRoundSnapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const prices = Array.isArray(data.prices) ? (data.prices as number[]).map((p) => num(p, 0)) : [1.98, 5.04, 9.89];
  const rounded = Array.isArray(data.rounded) ? (data.rounded as number[]).map((r) => num(r, 0)) : prices.map((p) => Math.round(p));
  const total = rounded.reduce((a, b) => a + b, 0);
  const isFinal = step >= totalSteps - 1;
  const showRound = step >= 1;
  const showSum = step >= 2;
  const trapTotal = prices.reduce((a, p) => a + Math.ceil(p), 0);
  const hasTrap = trapTotal !== total;

  const W = 460;
  const colX = [78, 230, 382];

  const tick = (cx: number, lo: number, hi: number, target: number) => {
    const span = 60;
    const frac = (v: number) => (v - lo) / (hi - lo);
    return (
      <g>
        <line x1={cx - span / 2} y1={0} x2={cx + span / 2} y2={0} stroke="#cbd5e1" strokeWidth="2" />
        <line x1={cx - span / 2} y1={-4} x2={cx - span / 2} y2={4} stroke="#cbd5e1" strokeWidth="2" />
        <line x1={cx + span / 2} y1={-4} x2={cx + span / 2} y2={4} stroke="#cbd5e1" strokeWidth="2" />
        <text x={cx - span / 2} y={20} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={FONT}>${lo}</text>
        <text x={cx + span / 2} y={20} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={FONT}>${hi}</text>
        {showRound && (
          <motion.circle
            cx={cx - span / 2}
            cy={0}
            r="5"
            fill={WIN}
            initial={{ x: 0 }}
            animate={{ x: frac(target) * span }}
            transition={{ type: "spring", stiffness: 140, damping: 15 }}
          />
        )}
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 255`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0
            ? "Mindy's three purchases"
            : isFinal
              ? "check a rounding trap, then confirm"
              : showSum
                ? "add the rounded amounts"
                : "round each price to the nearest dollar"}
        </text>

        {prices.map((p, i) => {
          const lo = Math.floor(p);
          const hi = Math.ceil(p) === lo ? lo + 1 : Math.ceil(p);
          const cx = colX[i];
          return (
            <g key={i} transform={`translate(${cx}, 0)`}>
              <rect x={-46} y={40} width={92} height={44} rx="10" fill="#f8fafc" stroke={INK} strokeWidth="1.6" />
              <text x={0} y={68} textAnchor="middle" fontSize="16" fontWeight="800" fill={INK} fontFamily={FONT}>
                ${p.toFixed(2)}
              </text>
              <g transform="translate(0, 110)">{tick(0, lo, hi, rounded[i])}</g>
              <AnimatePresence>
                {showRound && (
                  <motion.g
                    key="rounded"
                    initial={{ opacity: 0, y: -7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.12 }}
                  >
                    <text x={0} y={155} textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>
                      → ${rounded[i]}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        <AnimatePresence>
          {showSum && (
            <motion.g key="sum" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
              <text x={W / 2} y="192" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>
                {rounded.join(" + ")} = {total}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer != null ? String(problem.answer) : null} cx={W / 2} y={212} />
      </svg>
      {isFinal && hasTrap && (
        <div style={{ textAlign: "center", maxWidth: 420, fontSize: 12, fontWeight: 700, color: DIM, marginTop: -6 }}>
          rounding every price up instead would give {trapTotal}, not {total} — round to the nearest dollar, not always up
        </div>
      )}
    </div>
  );
}
