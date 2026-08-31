import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A fraction-of-a-total plus a flat extra, so the scene splits Granny
 * Smith's real total into equal bar segments to find Anjou's third, then has
 * to survive the trap of reporting that share alone (it's a real answer
 * choice) before sliding in Elberta's extra flat amount on top.
 * Data: { total, parts, extra }.
 */
export function MoneyThirdSharePlusExtraScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, Math.round(num(data.total, 63)));
  const parts = Math.max(2, Math.round(num(data.parts, 3)));
  const extra = Math.max(0, Math.round(num(data.extra, 2)));

  const share = total / parts;
  const elberta = share + extra;
  const answerOk = problem.shortAnswer == null || `$${elberta}` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed $${elberta}, stored answer is ${problem.shortAnswer}` : "";
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(share));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showExtra = step >= 2 || isFinal;

  const W = 300;
  const H = 190;
  const barX = 20;
  const barY = 60;
  const barW = 260;
  const barH = 40;
  const segW = barW / parts;
  const extraW = Math.max(16, (extra / total) * barW);

  const caption = isFinal
    ? `${share} + ${extra} = ${elberta} — Elberta's amount`
    : showExtra
    ? `${share} + ${extra} = ${elberta}`
    : showTrap
    ? trapChoice
      ? `Anjou's share alone is ${share} — choice ${trapChoice.label}, but Elberta has $${extra} more`
      : `Anjou's share alone is ${share}, not Elberta's amount`
    : `$${total} split into ${parts} equal parts`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          Granny Smith: ${total}
        </text>

        {Array.from({ length: parts }).map((_, i) => {
            const isAnjou = i === 0;
            return (
              <motion.g key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}>
                <rect x={barX + i * segW} y={barY} width={segW - 3} height={barH} rx={4} fill={isAnjou ? IND : "#eef2ff"} fillOpacity={isAnjou ? 0.85 : 0.6} stroke={isAnjou ? IND : "#c7d2fe"} strokeWidth={1.3} />
                <text x={barX + i * segW + (segW - 3) / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={isAnjou ? "#fff" : IND} fontFamily={numberFont}>
                  ${share}
                </text>
              </motion.g>
            );
          })}
        <text x={barX + segW / 2} y={barY + barH + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
          Anjou
        </text>

        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <rect x={barX} y={barY - 8} width={segW - 3} height={barH + 16} rx={6} fill="none" stroke={BAD} strokeWidth={2.2} strokeDasharray="5 3" />
          </motion.g>
        )}

        {showExtra && (
          <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 160, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}>
            <rect x={barX + segW - 3} y={barY} width={extraW} height={barH} rx={4} fill={WIN} fillOpacity={0.85} stroke={WIN} strokeWidth={1.3} />
            <text x={barX + segW - 3 + extraW / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
              +{extra}
            </text>
          </motion.g>
        )}
        {showExtra && (
          <text x={barX + segW - 3 + extraW / 2} y={barY + barH + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={WIN}>
            Elberta's extra
          </text>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
