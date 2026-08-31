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
 * A percent-of-value offer is a multiplier once you divide by 100, so the
 * scene merges the real coins into their real face value, then has to
 * survive the trap of multiplying the raw percent number straight into the
 * price (treating 2000% as literally 2000) before converting it to the true
 * ×20 multiplier and paying out. Data: { coinCount, coinValue, percent }.
 */
export function QuarterCollectorPercentScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const coinCount = Math.max(1, Math.round(num(data.coinCount, 4)));
  const coinValue = Math.max(0.01, num(data.coinValue, 0.25));
  const percent = Math.max(1, num(data.percent, 2000));

  const faceValue = coinCount * coinValue;
  const multiplier = percent / 100;
  const payout = faceValue * multiplier;
  const fmt = (v: number) => `$${Number(v.toFixed(2))}`;
  const answerOk = problem.shortAnswer == null || fmt(payout) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${fmt(payout)}, stored answer is ${problem.shortAnswer}` : "";

  const trapPayout = percent * coinValue;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === `${fmt(trapPayout).slice(1)} dollars`);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showConvert = step >= 2 || isFinal;

  const W = 300;
  const H = 190;

  const caption = isFinal
    ? `${multiplier} × ${fmt(faceValue)} = ${fmt(payout)}`
    : showConvert
    ? `${percent}% = ${multiplier}, so ${multiplier} × ${fmt(faceValue)} = ${fmt(payout)}`
    : showTrap
    ? trapChoice
      ? `${percent} × ${fmt(coinValue)} = ${fmt(trapPayout)} — choice ${trapChoice.label}, but % means ÷100 first`
      : `treating 2000 as dollars gives ${fmt(trapPayout)}, skipping the ÷100`
    : `${coinCount} quarters = ${fmt(faceValue)} face value`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {Array.from({ length: coinCount }).map((_, i) => (
          <motion.g key={i} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.15 }}>
            <circle cx={70 + i * 40} cy={50} r={16} fill="#e2e8f0" stroke={DIM} strokeWidth={1.6} />
            <text x={70 + i * 40} y={55} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
              25¢
            </text>
          </motion.g>
        ))}

        <motion.text x={W / 2} y={100} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          face value = {fmt(faceValue)}
        </motion.text>

        {showTrap && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 100} y={130} width={200} height={34} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.3} />
            <text x={W / 2} y={152} textAnchor="middle" fontSize="12" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              {percent} × {fmt(coinValue)} = {fmt(trapPayout)}?
            </text>
          </motion.g>
        )}

        {showConvert && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 100} y={130} width={200} height={34} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
            <text x={W / 2} y={152} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {percent}% = ×{multiplier} → {fmt(payout)}
            </text>
          </motion.g>
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
