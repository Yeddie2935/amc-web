import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const BIRD = "#0ea5e9";
const MAMMAL = "#f97316";

/** A simple side-view bird: body, beak, one thin 2-leg mark. */
function BirdIcon({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={7 * s} ry={5 * s} fill={BIRD} stroke="#0369a1" strokeWidth={0.7} />
      <circle cx={cx + 6 * s} cy={cy - 3 * s} r={2.4 * s} fill={BIRD} stroke="#0369a1" strokeWidth={0.7} />
      <path d={`M ${cx + 8 * s} ${cy - 3 * s} L ${cx + 12 * s} ${cy - 2 * s} L ${cx + 8 * s} ${cy - 1 * s} Z`} fill="#fb923c" />
      <line x1={cx - 1 * s} y1={cy + 4 * s} x2={cx - 1 * s} y2={cy + 8 * s} stroke="#0369a1" strokeWidth={1.2 * s} />
      <line x1={cx + 2 * s} y1={cy + 4 * s} x2={cx + 2 * s} y2={cy + 8 * s} stroke="#0369a1" strokeWidth={1.2 * s} />
    </g>
  );
}

/** A simple four-legged mammal: body, head, four thin leg marks. */
function MammalIcon({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g>
      <rect x={cx - 8 * s} y={cy - 4 * s} width={14 * s} height={8 * s} rx={3 * s} fill={MAMMAL} stroke="#c2410c" strokeWidth={0.7} />
      <circle cx={cx + 8 * s} cy={cy - 2 * s} r={3.2 * s} fill={MAMMAL} stroke="#c2410c" strokeWidth={0.7} />
      {[-6, -2, 2, 6].map((dx) => (
        <line key={dx} x1={cx + dx * s} y1={cy + 3.5 * s} x2={cx + dx * s} y2={cy + 8 * s} stroke="#c2410c" strokeWidth={1.2 * s} />
      ))}
    </g>
  );
}

/**
 * Heads-and-legs counting: assume every animal is the fewer-legged kind,
 * see how far short that leaves the legs, then swap animals to the
 * many-legged kind two legs at a time until the count is exact. Six beats:
 * (0) all heads assumed birds, legs bar short of the target; (1) the gap is
 * bracketed; (2) heads swap to mammals one batch at a time, legs bar fills
 * to the target as it goes; (3) the resulting bird count is read off;
 * (4) both totals are checked; (5) the badge. Data: { totalHeads,
 * targetLegs, fewLegs, manyLegs }.
 */
export function HeadLegSwapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalHeads = Math.round(num(data.totalHeads, 200));
  const targetLegs = Math.round(num(data.targetLegs, 522));
  const fewLegs = Math.round(num(data.fewLegs, 2));
  const manyLegs = Math.round(num(data.manyLegs, 4));

  const allFewLegs = totalHeads * fewLegs;
  const gap = targetLegs - allFewLegs;
  const perSwap = manyLegs - fewLegs;
  const many = gap / perSwap;
  const few = totalHeads - many;

  const checkLegs = few * fewLegs + many * manyLegs;
  const checkHeads = few + many;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === few;

  const last = totalSteps - 1;
  const showGap = step >= 1;
  const showSwap = step >= 2;
  const showFew = step >= 3;
  const showCheck = step >= 4;
  const isFinal = step >= last;

  const manyNow = showSwap ? many : 0;
  const fewNow = totalHeads - manyNow;

  const W = 320;
  const H = 176;
  const barX = 30;
  const barW = 260;
  const barH = 24;
  const headsY = 44;
  const legsY = 100;
  const headScale = barW / totalHeads;
  const legScale = barW / targetLegs;

  const fewHeadsW = fewNow * headScale;
  const manyHeadsW = manyNow * headScale;
  const fewLegsW = fewNow * fewLegs * legScale;
  const manyLegsW = manyNow * manyLegs * legScale;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={barX} y={headsY - 10} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          {totalHeads} heads
        </text>
        <rect x={barX} y={headsY} width={barW} height={barH} rx={6} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.4} />
        <motion.rect x={barX} y={headsY} height={barH} rx={6} animate={{ width: fewHeadsW }} fill={`${BIRD}33`} stroke={BIRD} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        <motion.g animate={{ x: barX + barW - manyHeadsW }} transition={{ type: "spring", stiffness: 170, damping: 20 }}>
          <motion.rect y={headsY} height={barH} rx={6} animate={{ width: manyHeadsW }} fill={`${MAMMAL}33`} stroke={MAMMAL} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        </motion.g>
        <BirdIcon cx={barX + 14} cy={headsY + barH / 2} s={0.9} />
        <AnimatePresence>
          {showSwap && manyNow > 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MammalIcon cx={barX + barW - 14} cy={headsY + barH / 2} s={0.85} />
            </motion.g>
          )}
        </AnimatePresence>

        <text x={barX} y={legsY - 10} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          legs (target {targetLegs})
        </text>
        <rect x={barX} y={legsY} width={barW} height={barH} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1.4} strokeDasharray="3 3" />
        <motion.rect x={barX} y={legsY} height={barH} rx={6} animate={{ width: fewLegsW }} fill={`${BIRD}44`} stroke={BIRD} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        <motion.g animate={{ x: barX + fewLegsW }} transition={{ type: "spring", stiffness: 170, damping: 20 }}>
          <motion.rect y={legsY} height={barH} rx={6} animate={{ width: manyLegsW }} fill={`${MAMMAL}44`} stroke={MAMMAL} strokeWidth={1.6} transition={{ type: "spring", stiffness: 170, damping: 20 }} />
        </motion.g>
        <line x1={barX + barW} y1={legsY - 6} x2={barX + barW} y2={legsY + barH + 6} stroke={INK} strokeWidth={1.4} />

        <AnimatePresence>
          {showGap && !showSwap && (
            <motion.g key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <path
                d={`M ${barX + fewLegsW} ${legsY + barH + 6} L ${barX + fewLegsW} ${legsY + barH + 12} L ${barX + barW} ${legsY + barH + 12} L ${barX + barW} ${legsY + barH + 6}`}
                fill="none"
                stroke="#d97706"
                strokeWidth={1.4}
              />
              <text x={(barX + fewLegsW + barX + barW) / 2} y={legsY + barH + 24} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#d97706" fontFamily={FONT}>
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
          color: isFinal ? WIN : showCheck ? WIN : showFew ? MARK : showSwap ? MAMMAL : showGap ? "#d97706" : BIRD,
        }}
      >
        {isFinal
          ? `${few} two-legged birds`
          : showCheck
          ? `${fewLegs}×${few} + ${manyLegs}×${many} = ${checkLegs} legs, ${few}+${many} = ${checkHeads} heads`
          : showFew
          ? `${totalHeads} − ${many} = ${few} birds`
          : showSwap
          ? `each swap adds ${perSwap} legs: ${gap} ÷ ${perSwap} = ${many} mammals`
          : showGap
          ? `${allFewLegs} legs if every animal were a bird — ${gap} short of ${targetLegs}`
          : `assume all ${totalHeads} animals are ${fewLegs}-legged birds`}
      </motion.div>

      <AnimatePresence>
        {isFinal && !agrees && (
          <motion.div key="warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color: "#dc2626", textAlign: "center" }}>
            computed {few}, which does not match the stored answer
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
