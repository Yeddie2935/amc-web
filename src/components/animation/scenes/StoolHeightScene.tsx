import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const CEIL = "#7c3aed";
const REACH = "#0d9488";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(1))));

/**
 * A vertical stack of heights: floor, a stool, Alice standing on it, her
 * reach above her head, and a light bulb sitting just below the ceiling.
 * Everything is drawn on one shared ruler from the floor to the ceiling, so
 * the stool height falls out as the one gap nothing else accounts for — the
 * distance between Alice's reach (with no stool) and the bulb. The natural
 * slip is treating the ceiling itself as the bulb's height, skipping the
 * "10 cm below the ceiling" detail; the scene computes that slip explicitly
 * and flags it even when it isn't one of the listed choices.
 *
 * data: { ceilingCm, belowCeilingCm, heightCm, reachCm }
 */
export function StoolHeightScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ceilingCm = num(data.ceilingCm, 240);
  const belowCeilingCm = num(data.belowCeilingCm, 10);
  const heightCm = num(data.heightCm, 150);
  const reachCm = num(data.reachCm, 46);

  const bulbHeight = ceilingCm - belowCeilingCm;
  const reachWithoutStool = heightCm + reachCm;
  const stoolHeight = bulbHeight - reachWithoutStool;

  const trapStool = ceilingCm - reachWithoutStool;
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === trapStool && String(c.label) !== problem.answer
  );

  const ok = tidy(stoolHeight) === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0 setup, 1 bulb height, 2 reach w/o stool, 3 the trap, 4 the gap, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry: one vertical ruler, floor at bottom, ceiling at top ----
  const W = 340;
  const H = 300;
  const rulerX = 150;
  const floorY = 260;
  const ceilY = 30;
  const scale = (floorY - ceilY) / ceilingCm;
  const yAt = (cm: number) => floorY - cm * scale;

  const showBulb = beat >= 1;
  const showReach = beat >= 2;
  const showTrap = beat === 3;
  const showStool = beat >= 4;

  const caption =
    beat === 0
      ? `ceiling ${tidy(ceilingCm)} cm, Alice ${tidy(heightCm)} cm`
      : beat === 1
      ? `${tidy(ceilingCm)} − ${tidy(belowCeilingCm)} = ${tidy(bulbHeight)} cm to the bulb`
      : beat === 2
      ? `${tidy(heightCm)} + ${tidy(reachCm)} = ${tidy(reachWithoutStool)} cm, no stool`
      : beat === 3
      ? `${tidy(ceilingCm)} − ${tidy(reachWithoutStool)} = ${tidy(trapStool)} cm — using the ceiling, not the bulb`
      : beat === 4
      ? `${tidy(bulbHeight)} − ${tidy(reachWithoutStool)} = ${tidy(stoolHeight)} cm`
      : `stool = ${tidy(stoolHeight)} cm`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the floor and ceiling */}
        <line x1={40} y1={floorY} x2={W - 20} y2={floorY} stroke={INK} strokeWidth={2} />
        <line x1={40} y1={ceilY} x2={W - 20} y2={ceilY} stroke={CEIL} strokeWidth={2} />
        <text x={40} y={ceilY - 8} fontSize="9" fontWeight="800" fill={CEIL} fontFamily={FONT}>
          ceiling {tidy(ceilingCm)} cm
        </text>

        {/* the bulb, 10cm below the ceiling — dimmed during the trap beat, which ignores it */}
        {showBulb && (
          <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: showTrap ? 0.25 : 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}>
            <line x1={rulerX - 40} y1={yAt(bulbHeight)} x2={rulerX + 20} y2={yAt(bulbHeight)} stroke={CEIL} strokeWidth={1.6} strokeDasharray="3 3" />
            <circle cx={rulerX + 30} cy={yAt(bulbHeight)} r={7} fill="#fde68a" stroke={CEIL} strokeWidth={1.4} />
            <text x={rulerX + 42} y={yAt(bulbHeight) + 4} fontSize="9" fontWeight="800" fill={CEIL} fontFamily={FONT}>
              bulb: {tidy(bulbHeight)} cm
            </text>
          </motion.g>
        )}

        {/* Alice standing on the floor, head + reach marked, no stool yet */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <circle cx={80} cy={yAt(heightCm) - 8} r={7} fill={IND} />
          <rect x={73} y={yAt(heightCm) - 1} width={14} height={floorY - (yAt(heightCm) - 1)} rx={4} fill={IND} fillOpacity={0.65} />
        </motion.g>
        <line x1={40} y1={yAt(heightCm)} x2={80} y2={yAt(heightCm)} stroke={IND} strokeWidth={1.2} strokeDasharray="2 2" />
        <text x={20} y={yAt(heightCm) + 4} textAnchor="end" fontSize="8" fontWeight="700" fill={IND} fontFamily={FONT}>
          {tidy(heightCm)}
        </text>

        {/* the reach above her head */}
        {showReach && (
          <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}>
            <line x1={70} y1={yAt(heightCm)} x2={70} y2={yAt(reachWithoutStool)} stroke={REACH} strokeWidth={3} strokeLinecap="round" />
            <line x1={40} y1={yAt(reachWithoutStool)} x2={80} y2={yAt(reachWithoutStool)} stroke={REACH} strokeWidth={1.4} strokeDasharray="2 2" />
            <text x={20} y={yAt(reachWithoutStool) + 4} textAnchor="end" fontSize="8" fontWeight="700" fill={REACH} fontFamily={FONT}>
              {tidy(reachWithoutStool)}
            </text>
          </motion.g>
        )}

        {/* beat 3: the trap gap, ceiling to reach — pushed clear of the (dimmed) bulb label */}
        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <path d={`M ${rulerX + 100},${yAt(reachWithoutStool)} L ${rulerX + 106},${yAt(reachWithoutStool)} L ${rulerX + 106},${ceilY} L ${rulerX + 100},${ceilY}`} fill="none" stroke={BAD} strokeWidth={1.8} />
            <text x={rulerX + 110} y={(yAt(reachWithoutStool) + ceilY) / 2} fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {tidy(trapStool)} cm ✗
            </text>
          </motion.g>
        )}

        {/* beats 4-5: the real gap, bulb to reach — the stool */}
        {showStool && !showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <path d={`M ${rulerX + 60},${yAt(reachWithoutStool)} L ${rulerX + 66},${yAt(reachWithoutStool)} L ${rulerX + 66},${yAt(bulbHeight)} L ${rulerX + 60},${yAt(bulbHeight)}`} fill="none" stroke={WIN} strokeWidth={2} />
            <text x={rulerX + 70} y={(yAt(reachWithoutStool) + yAt(bulbHeight)) / 2} fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={FONT}>
              {tidy(stoolHeight)} cm
            </text>
          </motion.g>
        )}

        {/* beat 5: the stool itself, drawn under Alice */}
        {beat === 5 && (
          <motion.rect
            x={68}
            width={24}
            fill="#b45309"
            fillOpacity={0.55}
            stroke="#b45309"
            strokeWidth={1.6}
            initial={{ y: floorY, height: 0 }}
            animate={{ y: floorY - stoolHeight * scale, height: stoolHeight * scale }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
          />
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
          color: isFinal ? "#166534" : beat === 3 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 3 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 3 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 3 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${tidy(trapStool)}) skips the "10 cm below the ceiling" detail` : `the bulb sits below the ceiling, not at it`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${tidy(stoolHeight)} but stored answer reads "${problem.shortAnswer}"`}
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
