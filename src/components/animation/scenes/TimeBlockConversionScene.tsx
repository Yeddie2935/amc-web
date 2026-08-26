import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Flip hour blocks into minute blocks, attach the leftover minutes, then match the total. */
export function TimeBlockConversionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const hours = Math.round(num(data.hours, 0));
  const extra = Math.round(num(data.extraMinutes, 0));
  const perHour = Math.round(num(data.minutesPerHour, 0));
  const converted = hours * perHour;
  const total = converted + extra;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === total)?.label;
  const stored = Number(String(problem.shortAnswer ?? "").match(/\d+/)?.[0]);
  const ok = total === stored && choice === problem.answer;
  const failure = total !== stored ? `computed ${total}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 285" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "each hour tile flips into one 60-minute tile" : phase === 1 ? "the final 5-minute piece joins the converted hours" : "the completed match clock lands on one answer choice"}</text>

      <g transform="translate(28 43)">
        {Array.from({ length: hours }, (_, i) => {
          const x = (i % 6) * 47, y = Math.floor(i / 6) * 47;
          return <motion.g key={i} initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: phase === 0 ? 1 : 0.55, rotateY: 0 }} transition={{ delay: i * 0.055 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={x} y={y} width="39" height="36" rx="7" fill="#eef2ff" stroke={IND} />
            <circle cx={x + 10} cy={y + 11} r="5.5" fill="#fff" stroke={IND} strokeWidth="1.2" />
            <line x1={x + 10} y1={y + 11} x2={x + 10} y2={y + 7.5} stroke={IND} strokeWidth="1.2" /><line x1={x + 10} y1={y + 11} x2={x + 13} y2={y + 11} stroke={IND} strokeWidth="1.2" />
            <text x={x + 27} y={y + 14} textAnchor="middle" fontSize="8" fontWeight="900" fill={IND} fontFamily={FONT}>1 h</text>
            <text x={x + 19.5} y={y + 29} textAnchor="middle" fontSize="9" fontWeight="900" fill={TEAL} fontFamily={FONT}>{perHour} min</text>
          </motion.g>;
        })}
        <text x="137" y="104" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{hours} identical hour tiles</text>
      </g>

      <g transform="translate(315 48)">
        <rect x="0" y="0" width="116" height="91" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="58" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>hours → minutes</text>
        <text x="58" y="49" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{hours} × {perHour}</text>
        <motion.text x="58" y="76" textAnchor="middle" fontSize="20" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>= {converted}</motion.text>
      </g>

      {phase >= 1 && <g transform="translate(67 164)">
        <rect x="0" y="0" width="250" height="38" rx="10" fill="#e2e8f0" />
        <motion.rect x="0" y="0" width="222" height="38" rx="10" fill="#ccfbf1" stroke={TEAL} initial={{ width: 0 }} animate={{ width: 222 }} transition={{ duration: 0.7 }} />
        <text x="111" y="25" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{converted} converted minutes</text>
        <motion.g initial={{ x: 70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 110, damping: 16 }}><rect x="222" y="0" width="28" height="38" rx="8" fill="#ffedd5" stroke={ORANGE} strokeWidth="2" /><text x="236" y="24" textAnchor="middle" fontSize="11" fontWeight="900" fill={ORANGE} fontFamily={FONT}>+{extra}</text></motion.g>
        <text x="125" y="59" textAnchor="middle" fontSize="17" fontWeight="900" fill={phase === 2 ? GREEN : IND} fontFamily={FONT}>{converted} + {extra} = {total}</text>
      </g>}

      {phase === 2 && <g transform="translate(332 151)">
        {(problem.choices ?? []).map((item, i) => { const selected = item.label === choice; return <motion.g key={item.label} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}><rect x="0" y={i * 21} width="94" height="17" rx="8.5" fill={selected ? "#dcfce7" : "#f8fafc"} stroke={selected ? GREEN : "#cbd5e1"} /><text x="10" y={i * 21 + 12} fontSize="8.5" fontWeight="900" fill={selected ? GREEN : DIM} fontFamily={FONT}>{item.label}</text><text x="82" y={i * 21 + 12} textAnchor="end" fontSize="8.5" fontWeight="900" fill={selected ? GREEN : INK} fontFamily={FONT}>{item.text}</text></motion.g>; })}
      </g>}

      {phase === 0 && <text x="230" y="245" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{hours} hours = {hours} groups of {perHour} minutes</text>}
      {phase === 1 && <text x="230" y="252" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>the extra minutes are added after converting the hours</text>}
      {phase === 2 && <><text x="168" y="270" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "conversion, total, and answer choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={247} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="281" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
