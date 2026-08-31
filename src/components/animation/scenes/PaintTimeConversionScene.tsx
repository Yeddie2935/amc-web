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
 * A per-item rate times a count gives seconds, but the question asks for
 * minutes — so the scene multiplies the two real numbers into a seconds
 * total on a golf ball being painted, then has to survive a unit-conversion
 * trap (dividing by 100 like a metric reflex instead of the actual 60
 * seconds in a minute, which lands on a real answer choice) before dividing
 * by the correct 60. Data: { count, perItemSeconds, secondsPerMinute }.
 */
export function PaintTimeConversionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = Math.max(1, Math.round(num(data.count, 300)));
  const perItem = Math.max(1, num(data.perItemSeconds, 2));
  const perMinute = Math.max(1, Math.round(num(data.secondsPerMinute, 60)));

  const totalSeconds = count * perItem;
  const minutes = totalSeconds / perMinute;
  const answerOk = problem.shortAnswer == null || `${minutes} minutes` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${minutes} minutes, stored answer is ${problem.shortAnswer}` : "";

  const trapMinutes = totalSeconds / 100;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapMinutes));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showConvert = step >= 2 || isFinal;

  const W = 300;
  const H = 220;
  const cx = 90;
  const cy = 100;
  const r = 46;
  const dimples = Array.from({ length: 14 }, (_, i) => {
    const ring = i < 6 ? 0 : i < 12 ? 1 : 2;
    const idxInRing = ring === 0 ? i : ring === 1 ? i - 6 : i - 12;
    const ringCount = ring === 0 ? 6 : ring === 1 ? 6 : 2;
    const ringR = ring === 0 ? 30 : ring === 1 ? 17 : 0;
    const ang = (idxInRing / ringCount) * Math.PI * 2;
    return { x: cx + ringR * Math.cos(ang), y: cy + ringR * Math.sin(ang) };
  });

  const caption = isFinal
    ? `${totalSeconds} ÷ ${perMinute} = ${minutes} minutes`
    : showConvert
    ? `${totalSeconds} ÷ ${perMinute} = ${minutes}`
    : showTrap
    ? trapChoice
      ? `dividing by 100 instead of 60 gives ${trapMinutes} — choice ${trapChoice.label}, but a minute is 60 seconds`
      : `dividing by 100 instead of 60 gives ${trapMinutes}, the wrong unit`
    : `${count} dimples × ${perItem} seconds each`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="#f8fafc"
          stroke={INK}
          strokeWidth={2.5}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        {dimples.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={4}
            fill="#cbd5e1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 + i * 0.03 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
        <text x={cx} y={cy + r + 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
          {count} dimples
        </text>

        <motion.text
          x={220}
          y={60}
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={IND}
          fontFamily={numberFont}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {count} × {perItem}s
        </motion.text>
        <motion.text
          x={220}
          y={86}
          textAnchor="middle"
          fontSize="18"
          fontWeight="800"
          fill={INK}
          fontFamily={numberFont}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          = {totalSeconds}s
        </motion.text>

        {showTrap && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={150} y={118} width={140} height={34} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.3} />
            <text x={220} y={140} textAnchor="middle" fontSize="12" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              ÷ 100 = {trapMinutes}?
            </text>
          </motion.g>
        )}

        {showConvert && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={150} y={118} width={140} height={34} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
            <text x={220} y={140} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              ÷ {perMinute} = {minutes} min
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
