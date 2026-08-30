import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * Multiples of a divisor march along a number line from the range's first
 * to last hit, counted by their multiplier index.
 * Data: { divisor: 13, rangeMin: 100, rangeMax: 999 }.
 */
export function MultipleRangeCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const divisor = num(data.divisor, 13);
  const rangeMin = num(data.rangeMin, 100);
  const rangeMax = num(data.rangeMax, 999);

  const firstK = Math.ceil(rangeMin / divisor);
  const lastK = Math.floor(rangeMax / divisor);
  const firstVal = firstK * divisor;
  const lastVal = lastK * divisor;
  const count = lastK - firstK + 1;

  const isFinal = step >= totalSteps - 1;
  const showFirst = step >= 1;
  const showLast = step >= 2;

  const X0 = 55;
  const X1 = 235;
  const px = (v: number) => X0 + ((v - rangeMin) / (rangeMax - rangeMin)) * (X1 - X0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `count multiples of ${divisor} from ${rangeMin} to ${rangeMax}`
          : isFinal
            ? "count the multipliers"
            : showLast
              ? `find the last multiple ≤ ${rangeMax}`
              : `find the first multiple ≥ ${rangeMin}`}
      </div>

      <svg viewBox="0 0 290 100" width="100%" style={{ maxWidth: 300 }}>
        <line x1={X0} y1="50" x2={X1} y2="50" stroke="#cbd5e1" strokeWidth="3" />
        <text x={X0} y="70" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={FONT}>{rangeMin}</text>
        <text x={X1} y="70" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={FONT}>{rangeMax}</text>

        <AnimatePresence>
          {showFirst && (
            <motion.g key="first" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <circle cx={px(firstVal)} cy="50" r="6" fill={IND} />
              <text x={px(firstVal)} y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>
                {firstVal}={divisor}×{firstK}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLast && (
            <motion.g key="last" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <circle cx={px(lastVal)} cy="50" r="6" fill={WIN} />
              <text x={px(lastVal)} y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill={WIN} fontFamily={FONT}>
                {lastVal}={divisor}×{lastK}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {showLast && (
          <line x1={px(firstVal)} y1="62" x2={px(lastVal)} y2="62" stroke={DIM} strokeWidth="1.4" strokeDasharray="3 2" />
        )}
      </svg>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          {lastK} − {firstK} + 1 = {count}
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
