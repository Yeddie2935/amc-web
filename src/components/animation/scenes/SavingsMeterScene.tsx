import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const AMBER = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";

const GIFT_COLORS = [IND, TEAL, AMBER];

/**
 * A vertical savings meter: gift money stacks in first, then weekly paper-
 * route earnings fill the rest toward the target price — a beat is spent on
 * the trap of dropping the smallest gift, which changes how many weeks of
 * saving are needed and prices out to a real choice.
 * Data: { giftAmounts, target, weeklyRate }.
 */
export function SavingsMeterScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const giftAmounts = (Array.isArray(data.giftAmounts) ? data.giftAmounts : [50, 35, 15]).map((v) => Math.max(0, Math.round(num(v, 0))));
  const target = Math.max(1, Math.round(num(data.target, 500)));
  const weeklyRate = Math.max(1, Math.round(num(data.weeklyRate, 16)));

  const giftSum = giftAmounts.reduce((a, b) => a + b, 0);
  const remaining = target - giftSum;
  const weeks = Math.ceil(remaining / weeklyRate);

  const matches = problem.shortAnswer == null || String(weeks) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ceil(${remaining}/${weeklyRate}) = ${weeks}, stored answer is ${problem.shortAnswer}` : "";

  // trap: drop the smallest gift, recompute the weeks needed
  const smallest = Math.min(...giftAmounts);
  const trapGiftSum = giftSum - smallest;
  const trapRemaining = target - trapGiftSum;
  const trapWeeks = Math.ceil(trapRemaining / weeklyRate);
  const trapChoice = trapWeeks !== weeks ? (problem.choices ?? []).find((c) => c.text.trim() === String(trapWeeks)) : null;

  const lastStep = totalSteps - 1;
  const showGifts = step >= 1;
  const showGap = step >= 2;
  const showFill = step >= 3;
  const showTrap = step === 4;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `${remaining} ÷ ${weeklyRate} = ${weeks} weeks`
    : showTrap && trapChoice
    ? `without the $${smallest} gift: ${trapRemaining}÷${weeklyRate} → ${trapWeeks} weeks — choice ${trapChoice.label}`
    : showFill
    ? `$${weeklyRate} a week climbs toward $${target}`
    : showGap
    ? `$${target} − $${giftSum} = $${remaining} left to save`
    : showGifts
    ? `${giftAmounts.map((g) => `$${g}`).join(" + ")} = $${giftSum} from gifts`
    : `the bike costs $${target}`;

  const note = failure || "";

  // ---- geometry: vertical meter ----
  const W = 220;
  const H = 220;
  const meterX = 90;
  const meterW = 60;
  const baseY = 200;
  const topY = 20;
  const scale = (baseY - topY) / target;
  const yAt = (v: number) => baseY - v * scale;

  const giftTopY = yAt(giftSum);
  const trapTopY = yAt(trapGiftSum);
  const fillTopY = yAt(target);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 240 }}>
        {/* meter outline */}
        <rect x={meterX} y={topY} width={meterW} height={baseY - topY} rx={6} fill="#f8fafc" stroke={INK} strokeWidth={1.6} />
        {/* target line */}
        <line x1={meterX - 14} x2={meterX + meterW + 14} y1={topY} y2={topY} stroke={WIN} strokeWidth={1.6} strokeDasharray="3 3" />
        <text x={meterX + meterW + 18} y={topY + 4} fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
          ${target} bike
        </text>

        {/* gift blocks stack in */}
        {showGifts &&
          (() => {
            let acc = 0;
            return giftAmounts.map((g, i) => {
              const y1 = yAt(acc + g);
              const y2 = yAt(acc);
              acc += g;
              return (
                <motion.rect
                  key={i}
                  x={meterX + 2}
                  width={meterW - 4}
                  fill={GIFT_COLORS[i % GIFT_COLORS.length]}
                  fillOpacity={0.75}
                  initial={{ y: baseY, height: 0 }}
                  animate={{ y: y1, height: y2 - y1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.15 }}
                />
              );
            });
          })()}

        {/* remaining-gap bracket */}
        <AnimatePresence>
          {showGap && !showFill && (
            <motion.g key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={meterX + meterW + 6} y={topY} width={6} height={giftTopY - topY} fill="none" stroke={BAD} strokeWidth={1.3} strokeDasharray="2 2" />
              <text x={meterX + meterW + 18} y={(topY + giftTopY) / 2 + 3} fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                ${remaining}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* weekly earnings fill the rest, up to target */}
        {showFill && (
          <motion.rect
            x={meterX + 2}
            width={meterW - 4}
            fill={WIN}
            fillOpacity={0.55}
            initial={{ y: giftTopY, height: 0 }}
            animate={{ y: fillTopY, height: giftTopY - fillTopY }}
            transition={{ type: "spring", stiffness: 140, damping: 22, delay: 0.15 }}
          />
        )}

        {/* trap marker: where the meter would sit without the smallest gift */}
        <AnimatePresence>
          {showTrap && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={meterX - 10} x2={meterX + meterW + 10} y1={trapTopY} y2={trapTopY} stroke={BAD} strokeWidth={1.4} strokeDasharray="4 3" />
              <text x={meterX - 14} y={trapTopY - 4} textAnchor="end" fontSize="8.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                w/o ${smallest}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* weeks counter, pops in once the fill is shown */}
        <AnimatePresence>
          {showFill && (
            <motion.g key="weeks" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={meterX - 46} y={fillTopY - 8} width={40} height={18} rx={5} fill="#dcfce7" stroke={WIN} strokeWidth={1.3} />
              <text x={meterX - 26} y={fillTopY + 5} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                {weeks}wk
              </text>
            </motion.g>
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
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
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
