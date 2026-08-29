import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const BASE = "#fef9c3";
const CRUST = "#d9a066";
const PETER = "#f97316";
const PAUL = "#0ea5e9";

const CX = 120;
const CY = 108;
const R = 82;

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

/**
 * A pizza cut into equal slices: some eaten whole, one more split evenly with
 * someone else. Five beats: (0) the whole pizza; (1) the whole slices turn
 * Peter's color; (2) one more slice splits in two — an extra divider draws
 * on — and only Peter's half turns his color; (3) that total is checked
 * against the whole pizza, with the trap of counting the shared slice as a
 * whole one too; (4) the badge. Data: { totalSlices, wholeSlicesEaten,
 * splitParts }.
 */
export function SplitSliceShareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalSlices = Math.round(num(data.totalSlices, 12));
  const wholeSlicesEaten = Math.round(num(data.wholeSlicesEaten, 1));
  const splitParts = Math.round(num(data.splitParts, 2));

  const A = (i: number) => ((-90 + (i * 360) / totalSlices) * Math.PI) / 180;
  const slicePath = (a0: number, a1: number) =>
    `M ${CX} ${CY} L ${(CX + R * Math.cos(a0)).toFixed(2)} ${(CY + R * Math.sin(a0)).toFixed(2)} A ${R} ${R} 0 0 1 ${(CX + R * Math.cos(a1)).toFixed(2)} ${(CY + R * Math.sin(a1)).toFixed(2)} Z`;
  const pointAt = (a: number, r: number) => ({ x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) });

  const shareIndex = wholeSlicesEaten;
  const shareStart = A(shareIndex);
  const shareEnd = A(shareIndex + 1);
  const shareCut = shareStart + (shareEnd - shareStart) / splitParts;
  const cutTip = pointAt(shareCut, R);

  const peterTotalN = wholeSlicesEaten * splitParts + 1;
  const peterTotalD = splitParts;
  const g1 = gcd(peterTotalN, peterTotalD) || 1;
  const peterWhole = peterTotalN / g1;
  const peterHalf = peterTotalD / g1;

  const fracN = peterTotalN;
  const fracD = peterTotalD * totalSlices;
  const g2 = gcd(fracN, fracD) || 1;
  const simpleN = fracN / g2;
  const simpleD = fracD / g2;

  const naiveN = wholeSlicesEaten + 1;
  const gN = gcd(naiveN, totalSlices) || 1;
  const naiveText = `${naiveN / gN}/${totalSlices / gN}`;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === naiveText);

  const last = totalSteps - 1;
  const showWhole = step >= 1;
  const showShare = step >= 2;
  const showFraction = step >= 3;
  const isFinal = step >= last;

  const W = 240;
  const H = 316;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        <circle cx={CX} cy={CY} r={R + 5} fill={CRUST} />
        <circle cx={CX} cy={CY} r={R + 5} fill="none" stroke="#b97f43" strokeWidth={1.5} />

        {Array.from({ length: totalSlices }).map((_, i) => {
          if (i === shareIndex) {
            const peterEaten = showShare;
            const paulHas = showShare;
            return (
              <g key={i}>
                <motion.path
                  d={slicePath(shareStart, shareCut)}
                  stroke="#fff"
                  strokeWidth={1.4}
                  animate={{ fill: peterEaten ? PETER : BASE }}
                  transition={{ duration: 0.35 }}
                />
                <motion.path
                  d={slicePath(shareCut, shareEnd)}
                  stroke="#fff"
                  strokeWidth={1.4}
                  animate={{ fill: paulHas ? PAUL : BASE }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                />
              </g>
            );
          }
          const eaten = i < wholeSlicesEaten && showWhole;
          return (
            <motion.path
              key={i}
              d={slicePath(A(i), A(i + 1))}
              stroke="#fff"
              strokeWidth={1.4}
              animate={{ fill: eaten ? PETER : BASE }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            />
          );
        })}

        <AnimatePresence>
          {showShare && (
            <motion.line
              key="cut"
              x1={CX}
              y1={CY}
              stroke="#b97f43"
              strokeWidth={1.6}
              initial={{ x2: CX, y2: CY, opacity: 0 }}
              animate={{ x2: cutTip.x, y2: cutTip.y, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />
          )}
        </AnimatePresence>

        {!showWhole && (
          <text x={CX} y={14} textAnchor="middle" fontSize="11" fontWeight={800} fill="#94a3b8" fontFamily={numberFont}>
            {totalSlices} equal slices
          </text>
        )}

        <AnimatePresence>
          {showShare && (
            <motion.g key="legend" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={CX - 66} y={214} width={10} height={10} rx={2} fill={PETER} />
              <text x={CX - 52} y={223} fontSize="9.5" fontWeight={700} fill={INK} fontFamily={numberFont}>
                Peter
              </text>
              <rect x={CX + 8} y={214} width={10} height={10} rx={2} fill={PAUL} />
              <text x={CX + 22} y={223} fontSize="9.5" fontWeight={700} fill={INK} fontFamily={numberFont}>
                Paul
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <text x={CX} y={showShare ? 245 : 225} textAnchor="middle" fontSize="11" fontWeight={800} fill={MARK} fontFamily={numberFont}>
          {showShare
            ? `${wholeSlicesEaten} + 1/${splitParts} = ${peterWhole}/${peterHalf}`
            : showWhole
            ? `${wholeSlicesEaten} whole slice`
            : ""}
        </text>

        <AnimatePresence>
          {showFraction && (
            <motion.text
              key="frac"
              x={CX}
              y={262}
              textAnchor="middle"
              fontSize="11"
              fontWeight={800}
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              ({peterWhole}/{peterHalf}) ÷ {totalSlices} = {simpleN}/{simpleD}
            </motion.text>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFraction && trap && (
            <motion.text
              key="trap"
              x={CX}
              y={277}
              textAnchor="middle"
              fontSize="9"
              fontWeight={700}
              fill={BAD}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              counting it whole: {naiveN}/{totalSlices} = {naiveText} → choice {trap.label}
            </motion.text>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer} cx={CX} y={showFraction ? 284 : 232} width={80} />
      </svg>
    </div>
  );
}
