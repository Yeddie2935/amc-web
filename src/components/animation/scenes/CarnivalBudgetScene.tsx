import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const FOOD_C = "#f59e0b";
const RIDE_C = "#0d9488";

const parseMoney = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/** A rectangular bill with a printed value. */
function Bill({ cx, cy, w, label, color }: { cx: number; cy: number; w: number; label: string; color: string }) {
  const h = w * 0.55;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={3} fill={color} stroke="#00000030" strokeWidth={1} />
      <rect x={cx - w / 2 + 3} y={cy - h / 2 + 3} width={w - 6} height={h - 6} rx={2} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.6} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={Math.max(9, w * 0.2)} fontWeight="800" fill="#fff" fontFamily={numberFont}>
        {label}
      </text>
    </g>
  );
}

/**
 * A fixed budget spent on two things, one a multiple of the other, asking
 * what's left. The budget is a real bill, drawn down as a bar carved into a
 * food segment and a rides segment sized exactly twice as wide, with a beat
 * spent on the trap of forgetting the multiplier before the true remainder
 * is carved off in green.
 * Data: { budget, foodCost, rideMultiplier }.
 */
export function CarnivalBudgetScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const budget = Math.max(1, num(data.budget, 50));
  const foodCost = Math.max(1, num(data.foodCost, 12));
  const rideMultiplier = Math.max(1, num(data.rideMultiplier, 2));

  const rideCost = foodCost * rideMultiplier;
  const spent = foodCost + rideCost;
  const remaining = budget - spent;
  const matches = problem.shortAnswer == null || String(remaining) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${budget} − ${spent} = ${remaining}, stored answer is ${problem.shortAnswer}` : "";

  const naiveSpent = foodCost + foodCost;
  const naiveRemaining = budget - naiveSpent;
  const trapChoice = (problem.choices ?? []).find((c) => parseMoney(c.text) === naiveRemaining);

  const lastStep = totalSteps - 1;
  const showFood = step >= 1;
  const showRide = step >= 2;
  const showTrap = step === 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 340;
  const H = 230;
  const barX = 20;
  const barW = 300;
  const barY = 150;
  const barH = 26;
  const px = (d: number) => (d / budget) * barW;
  const foodSeg = px(foodCost);
  const rideSeg = px(rideCost);
  const naiveRideSeg = px(foodCost);

  const caption = isFinal
    ? `${budget} − ${spent} = ${remaining}`
    : showTrap
    ? trapChoice
      ? `forgetting "twice" gives ${budget} − ${naiveSpent} = ${naiveRemaining} — choice ${trapChoice.label}, but rides cost ${rideCost}`
      : `forgetting "twice" gives ${budget} − ${naiveSpent} = ${naiveRemaining}, not the real spending`
    : showRide
    ? `rides cost twice as much: ${rideMultiplier} × ${foodCost} = ${rideCost}`
    : showFood
    ? `she spent ${foodCost} on food`
    : `Susan starts with ${budget}`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <motion.g initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
          <Bill cx={W / 2} cy={30} w={80} label={`$${budget}`} color={WIN} />
        </motion.g>

        <text x={W / 2} y={60} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          how much carnival budget is left?
        </text>

        <AnimatePresence>
          {showFood && (
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={90} y={92} fontSize="22" textAnchor="middle" dominantBaseline="central">
                🌭
              </text>
              <text x={90} y={110} textAnchor="middle" fontSize="10" fontWeight="800" fill={FOOD_C} fontFamily={numberFont}>
                ${foodCost}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRide && (
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={W - 90} y={92} fontSize="22" textAnchor="middle" dominantBaseline="central">
                🎡
              </text>
              <text x={W - 90} y={110} textAnchor="middle" fontSize="10" fontWeight="800" fill={RIDE_C} fontFamily={numberFont}>
                ${rideCost}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the budget bar, carved from the left */}
        <rect x={barX} y={barY} width={barW} height={barH} rx={4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.2} />

        <AnimatePresence mode="wait">
          {showTrap ? (
            <motion.g key="trap">
              <motion.rect x={barX} y={barY} width={foodSeg} height={barH} fill={FOOD_C} stroke="#fff" strokeWidth={1} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
              <motion.rect x={barX + foodSeg} y={barY} width={naiveRideSeg} height={barH} fill={BAD} opacity={0.7} stroke="#fff" strokeWidth={1} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
              <text x={barX + foodSeg + naiveRideSeg / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                ✗
              </text>
            </motion.g>
          ) : (
            <motion.g key="real" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
              {showFood && (
                <motion.rect x={barX} y={barY} width={foodSeg} height={barH} fill={FOOD_C} stroke="#fff" strokeWidth={1} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 200, damping: 22 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
              )}
              {showRide && (
                <motion.rect x={barX + foodSeg} y={barY} width={rideSeg} height={barH} fill={RIDE_C} stroke="#fff" strokeWidth={1} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 200, damping: 22 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
              )}
              {isFinal && (
                <motion.rect x={barX + foodSeg + rideSeg} y={barY} width={px(remaining)} height={barH} fill={WIN} stroke="#fff" strokeWidth={1} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
              )}
            </motion.g>
          )}
        </AnimatePresence>

        <text x={barX} y={barY + barH + 14} fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          $0
        </text>
        <text x={barX + barW} y={barY + barH + 14} textAnchor="end" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          ${budget}
        </text>

        <AnimatePresence>
          {isFinal && (
            <motion.text
              x={barX + foodSeg + rideSeg + px(remaining) / 2}
              y={barY - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              ${remaining} left
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
