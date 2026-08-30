import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const BIKE = "#0ea5e9";
const TRIKE = "#f97316";

/** A side-view bicycle: two wheels and a simple frame. */
function BicycleIcon({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g>
      <circle cx={cx - 6 * s} cy={cy + 5 * s} r={4.2 * s} fill="none" stroke={BIKE} strokeWidth={1.3 * s} />
      <circle cx={cx + 6 * s} cy={cy + 5 * s} r={4.2 * s} fill="none" stroke={BIKE} strokeWidth={1.3 * s} />
      <path
        d={`M ${cx - 6 * s} ${cy + 5 * s} L ${cx - 1 * s} ${cy - 3 * s} L ${cx + 6 * s} ${cy + 5 * s} M ${cx - 1 * s} ${cy - 3 * s} L ${cx - 3 * s} ${cy + 5 * s}`}
        stroke={BIKE}
        strokeWidth={1.1 * s}
        fill="none"
      />
    </g>
  );
}

/** A side-view tricycle: two rear wheels, one front wheel, a simple frame. */
function TricycleIcon({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g>
      <circle cx={cx - 7 * s} cy={cy + 5 * s} r={3.6 * s} fill="none" stroke={TRIKE} strokeWidth={1.2 * s} />
      <circle cx={cx + 7 * s} cy={cy + 5 * s} r={3.6 * s} fill="none" stroke={TRIKE} strokeWidth={1.2 * s} />
      <circle cx={cx} cy={cy - 4 * s} r={3.6 * s} fill="none" stroke={TRIKE} strokeWidth={1.2 * s} />
      <path d={`M ${cx - 7 * s} ${cy + 5 * s} L ${cx} ${cy - 4 * s} L ${cx + 7 * s} ${cy + 5 * s}`} stroke={TRIKE} strokeWidth={1 * s} fill="none" />
    </g>
  );
}

/**
 * Wheel-counting by assumption: put every child on the fewer-wheeled vehicle,
 * see how far short that leaves the wheel count, then swap riders onto the
 * many-wheeled vehicle one at a time until the count is exact. Six beats:
 * (0) all children assumed on bicycles, wheel bar short of the target; (1)
 * the gap is bracketed; (2) riders swap to tricycles, the wheel bar fills to
 * the target; (3) the resulting bicycle count is read off; (4) both totals
 * are checked; (5) the badge. Data: { totalChildren, targetWheels,
 * fewWheels, manyWheels }.
 */
export function VehicleWheelSwapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalChildren = Math.round(num(data.totalChildren, 7));
  const targetWheels = Math.round(num(data.targetWheels, 19));
  const fewWheels = Math.round(num(data.fewWheels, 2));
  const manyWheels = Math.round(num(data.manyWheels, 3));

  const allFewWheels = totalChildren * fewWheels;
  const gap = targetWheels - allFewWheels;
  const perSwap = manyWheels - fewWheels;
  const many = gap / perSwap;
  const few = totalChildren - many;

  const checkWheels = few * fewWheels + many * manyWheels;
  const checkChildren = few + many;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === many;

  const last = totalSteps - 1;
  const showGap = step >= 1;
  const showSwap = step >= 2;
  const showFew = step >= 3;
  const showCheck = step >= 4;
  const isFinal = step >= last;

  const manyNow = showSwap ? many : 0;
  const fewNow = totalChildren - manyNow;

  const W = 320;
  const H = 176;
  const barX = 30;
  const barW = 260;
  const barH = 24;
  const headsY = 44;
  const wheelsY = 100;
  const headScale = barW / totalChildren;
  const wheelScale = barW / targetWheels;

  const fewHeadsW = fewNow * headScale;
  const manyHeadsW = manyNow * headScale;
  const fewWheelsW = fewNow * fewWheels * wheelScale;
  const manyWheelsW = manyNow * manyWheels * wheelScale;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={barX} y={headsY - 10} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          {totalChildren} children
        </text>
        <rect x={barX} y={headsY} width={barW} height={barH} rx={6} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.4} />
        <motion.rect x={barX} y={headsY} height={barH} rx={6} animate={{ width: fewHeadsW }} fill={`${BIKE}33`} stroke={BIKE} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        <motion.g animate={{ x: barX + barW - manyHeadsW }} transition={{ type: "spring", stiffness: 170, damping: 20 }}>
          <motion.rect y={headsY} height={barH} rx={6} animate={{ width: manyHeadsW }} fill={`${TRIKE}33`} stroke={TRIKE} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        </motion.g>
        <BicycleIcon cx={barX + 14} cy={headsY + barH / 2} s={0.9} />
        <AnimatePresence>
          {showSwap && manyNow > 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TricycleIcon cx={barX + barW - 14} cy={headsY + barH / 2} s={0.85} />
            </motion.g>
          )}
        </AnimatePresence>

        <text x={barX} y={wheelsY - 10} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          wheels (target {targetWheels})
        </text>
        <rect x={barX} y={wheelsY} width={barW} height={barH} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1.4} strokeDasharray="3 3" />
        <motion.rect x={barX} y={wheelsY} height={barH} rx={6} animate={{ width: fewWheelsW }} fill={`${BIKE}44`} stroke={BIKE} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        <motion.g animate={{ x: barX + fewWheelsW }} transition={{ type: "spring", stiffness: 170, damping: 20 }}>
          <motion.rect y={wheelsY} height={barH} rx={6} animate={{ width: manyWheelsW }} fill={`${TRIKE}44`} stroke={TRIKE} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        </motion.g>
        <line x1={barX + barW} y1={wheelsY - 6} x2={barX + barW} y2={wheelsY + barH + 6} stroke={INK} strokeWidth={1.4} />

        <AnimatePresence>
          {showGap && !showSwap && (
            <motion.g key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <path
                d={`M ${barX + fewWheelsW} ${wheelsY + barH + 6} L ${barX + fewWheelsW} ${wheelsY + barH + 12} L ${barX + barW} ${wheelsY + barH + 12} L ${barX + barW} ${wheelsY + barH + 6}`}
                fill="none"
                stroke="#d97706"
                strokeWidth={1.4}
              />
              <text x={(barX + fewWheelsW + barX + barW) / 2} y={wheelsY + barH + 24} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#d97706" fontFamily={FONT}>
                {gap} short
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 320,
          color: isFinal ? WIN : showCheck ? WIN : showFew ? MARK : showSwap ? TRIKE : showGap ? "#d97706" : BIKE,
        }}
      >
        {isFinal
          ? `${many} tricycles`
          : showCheck
          ? `${fewWheels}×${few} + ${manyWheels}×${many} = ${checkWheels} wheels, ${few}+${many} = ${checkChildren} children`
          : showFew
          ? `${totalChildren} − ${many} = ${few} bicycles`
          : showSwap
          ? `each swap adds ${perSwap} wheel: ${gap} ÷ ${perSwap} = ${many} tricycles`
          : showGap
          ? `${allFewWheels} wheels if every child rode a bicycle — ${gap} short of ${targetWheels}`
          : `assume all ${totalChildren} children ride ${fewWheels}-wheel bicycles`}
      </motion.div>

      <AnimatePresence>
        {isFinal && !agrees && (
          <motion.div key="warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color: "#dc2626", textAlign: "center" }}>
            computed {many}, which does not match the stored answer
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
