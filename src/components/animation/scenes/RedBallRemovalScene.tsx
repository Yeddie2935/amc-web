import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const RED = "#dc2626";
const BLUE = "#4338ca";

/**
 * A bag of red and blue balls, some fraction red, asking how many red must
 * be removed so a smaller target fraction remains red. Removing balls
 * shrinks the total too, which is exactly what the natural slip ignores —
 * subtracting the two percentages and applying that straight to the
 * original count looks reasonable and lands on a real choice, but the blue
 * balls (untouched) are the only fixed point to reason from. The scene
 * holds the blue count fixed and re-scales the whole bag around it, so the
 * shrinking total is watched rather than assumed away.
 *
 * data: { total, redPercent, targetPercent }
 */
export function RedBallRemovalScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = num(data.total, 500);
  const redPercent = num(data.redPercent, 80);
  const targetPercent = num(data.targetPercent, 75);

  const redCount = Math.round((total * redPercent) / 100);
  const blueCount = total - redCount;
  const bluePercentTarget = 100 - targetPercent;
  const newTotal = Math.round((blueCount / bluePercentTarget) * 100);
  const removed = total - newTotal;
  const ok = String(removed) === (problem.shortAnswer ?? "").trim();

  const trapRemoved = Math.round(((redPercent - targetPercent) / 100) * total);
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === trapRemoved && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 blue fixed, 2 the trap, 3 solve for new total, 4 subtract, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  const W = 380;
  const H = 260;
  const barX = 40;
  const barW = 300;
  const barY = 90;
  const barH = 46;
  const pxPerBall = barW / total;

  const shownRed = beat >= 3 ? redCount - removed : redCount;
  const shownTotal = beat >= 3 ? newTotal : total;
  const shownW = shownTotal * pxPerBall;
  const redW = shownRed * pxPerBall;
  const blueW = blueCount * pxPerBall;

  const caption =
    beat === 0
      ? `${total} balls, ${redPercent}% red = ${redCount} red, ${blueCount} blue`
      : beat === 1
      ? `${blueCount} blue balls never change`
      : beat === 2
      ? `${redPercent}% − ${targetPercent}% = ${redPercent - targetPercent}%, × ${total} = ${trapRemoved} — ignores the shrinking total`
      : beat === 3
      ? `${blueCount} is ${bluePercentTarget}% of the new total → ${newTotal} balls remain`
      : beat === 4
      ? `${total} − ${newTotal} = ${removed} red balls removed`
      : `remove ${removed} red balls`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        <text x={W / 2} y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
          {beat >= 3 ? `${shownTotal} balls remain` : `${total} balls`}
        </text>

        {/* the full-total outline, once we start shrinking it */}
        {beat >= 3 && <rect x={barX} y={barY} width={barW} height={barH} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1.2} strokeDasharray="3 3" />}

        {/* red segment, shrinking from beat 3 on */}
        <motion.rect
          x={barX}
          y={barY}
          height={barH}
          fill={RED}
          fillOpacity={0.75}
          initial={{ width: redW }}
          animate={{ width: redW }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        />
        {/* blue segment, fixed count, sliding left as red shrinks */}
        <motion.rect
          y={barY}
          width={blueW}
          height={barH}
          fill={BLUE}
          fillOpacity={0.75}
          initial={{ x: barX + redW }}
          animate={{ x: barX + redW }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        />
        <text x={barX + redW / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily={FONT}>
          {shownRed} red
        </text>
        <text x={barX + redW + blueW / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily={FONT}>
          {blueCount} blue
        </text>

        {/* beat 1: bracket highlighting the blue segment as fixed */}
        {beat === 1 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <rect x={barX + redW} y={barY - 6} width={blueW} height={barH + 12} fill="none" stroke={BLUE} strokeWidth={2.4} rx={6} />
            <text x={barX + redW + blueW / 2} y={barY - 14} textAnchor="middle" fontSize="10" fontWeight="800" fill={BLUE} fontFamily={FONT}>
              stays {blueCount}
            </text>
          </motion.g>
        )}

        {/* beat 2: the trap subtraction */}
        {beat === 2 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 76} y={160} width={152} height={34} rx={9} fill="#fee2e2" stroke={BAD} strokeWidth={1.8} />
            <text x={W / 2} y={182} textAnchor="middle" fontSize="14" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {trapRemoved} removed? ✗
            </text>
          </motion.g>
        )}

        {/* beat 3: the target-percent marker on the blue segment */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <text x={barX + shownW / 2} y={barY + barH + 22} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={FONT}>
              blue = {bluePercentTarget}% of {shownTotal}
            </text>
          </motion.g>
        )}

        {/* beat 4: the removed chunk, shown separately */}
        {beat === 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <rect x={barX + shownW + 10} y={barY} width={removed * pxPerBall} height={barH} rx={6} fill={RED} fillOpacity={0.3} stroke={BAD} strokeWidth={1.8} strokeDasharray="4 3" />
            <text x={barX + shownW + 10 + (removed * pxPerBall) / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD} fontFamily={FONT}>
              −{removed}
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${trapRemoved}) subtracts percentages against the old total, not the new one` : `removing balls also shrinks the total, so a flat percent gap is wrong`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${removed} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
