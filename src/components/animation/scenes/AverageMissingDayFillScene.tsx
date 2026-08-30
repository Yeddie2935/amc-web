import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/** Convert grouped daily times, build the target average total, and fill the missing day with the remainder. */
export function AverageMissingDayFillScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const counts = Array.isArray(data.counts) ? data.counts.map(Number) : [];
  const minutes = Array.isArray(data.minutes) ? data.minutes.map(Number) : [];
  const totalDays = Math.round(num(data.totalDays, 9));
  const targetAverage = num(data.targetAverage, 85);
  const knownDays = counts.reduce((a, b) => a + b, 0);
  const knownTotal = counts.reduce((sum, count, i) => sum + count * (minutes[i] ?? 0), 0);
  const targetTotal = totalDays * targetAverage;
  const missing = targetTotal - knownTotal;
  const answerText = missing % 60 === 0 ? `${missing / 60} hr` : `${Math.floor(missing / 60)} hr ${missing % 60} min`;
  const choice = (problem.choices ?? []).find((c) => c.text.trim() === answerText)?.label;
  const valid = knownDays === totalDays - 1 && answerText === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const daily = counts.flatMap((count, group) => Array.from({ length: count }, () => minutes[group]));
  const values = [...daily, phase === 2 ? missing : 0];

  const W = 470, baseY = 224, chartTop = 55, maxMinutes = Math.max(missing, targetAverage, ...minutes) + 10;
  const barW = 31, gap = 11, x0 = 50;
  const heightOf = (value: number) => (value / maxMinutes) * (baseY - chartTop);
  const targetY = baseY - heightOf(targetAverage);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} 315`} width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Eight known skating-day bars and one missing day balance to an eighty-five-minute average">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "convert each clock time and place the first eight days" : phase === 1 ? "nine equal 85-minute shares set the required total" : "pour the remaining minutes into day 9"}
        </text>

        <line x1="37" y1={baseY} x2="440" y2={baseY} stroke={INK} strokeWidth="1.8" />
        {values.map((value, i) => {
          const x = x0 + i * (barW + gap);
          const h = heightOf(value);
          const groupColor = i < counts[0] ? IND : i < knownDays ? TEAL : GREEN;
          return (
            <g key={i}>
              <rect x={x} y={chartTop} width={barW} height={baseY - chartTop} rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeDasharray={i === totalDays - 1 && phase < 2 ? "4 3" : undefined} />
              {value > 0 && <motion.rect x={x + 1.5} y={baseY - h} width={barW - 3} height={h} rx="4" fill={`${groupColor}35`} stroke={groupColor} strokeWidth="1.5" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.06, type: "spring", stiffness: 150, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} />}
              <text x={x + barW / 2} y={baseY + 15} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={DIM} fontFamily={FONT}>{i + 1}</text>
              {value > 0 && <text x={x + barW / 2} y={baseY - h + 15} textAnchor="middle" fontSize="9" fontWeight="900" fill={groupColor} fontFamily={FONT}>{value}</text>}
              {i === totalDays - 1 && phase < 2 && <text x={x + barW / 2} y={baseY - 15} textAnchor="middle" fontSize="18" fontWeight="950" fill={DIM}>?</text>}
            </g>
          );
        })}
        <text x="26" y="140" textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} transform="rotate(-90 26 140)">minutes</text>

        {phase === 0 && (
          <>
            <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <rect x="72" y="29" width="135" height="28" rx="10" fill="#eef2ff" stroke={IND} />
              <text x="139.5" y="48" textAnchor="middle" fontSize="11" fontWeight="950" fill={IND} fontFamily={FONT}>1:15 → 75 min × 5</text>
              <rect x="248" y="29" width="135" height="28" rx="10" fill="#ecfeff" stroke={TEAL} />
              <text x="315.5" y="48" textAnchor="middle" fontSize="11" fontWeight="950" fill={TEAL} fontFamily={FONT}>1:30 → 90 min × 3</text>
            </motion.g>
            <text x="235" y="276" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{counts[0]} × {minutes[0]} + {counts[1]} × {minutes[1]} = {knownTotal} known minutes</text>
          </>
        )}

        {phase >= 1 && (
          <>
            <motion.line x1="38" y1={targetY} x2="439" y2={targetY} stroke={GREEN} strokeWidth="2.3" strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <rect x="334" y={targetY - 23} width="104" height="20" rx="10" fill="#fff" stroke={GREEN} />
            <text x="386" y={targetY - 9} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={GREEN} fontFamily={FONT}>average = {targetAverage}</text>
          </>
        )}

        {phase === 1 && (
          <>
            {Array.from({ length: totalDays }, (_, i) => <motion.circle key={i} cx={68 + i * 42} cy="264" r="13" fill="#dcfce7" stroke={GREEN} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.06, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}
            {Array.from({ length: totalDays }, (_, i) => <text key={i} x={68 + i * 42} y="268" textAnchor="middle" fontSize="8" fontWeight="900" fill={GREEN} fontFamily={FONT}>85</text>)}
            <text x="235" y="299" textAnchor="middle" fontSize="16" fontWeight="950" fill={GREEN} fontFamily={FONT}>{totalDays} × {targetAverage} = {targetTotal} minutes needed</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="remainder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <path d="M 112 250 Q 235 278 358 250" fill="none" stroke={IND} strokeWidth="1.8" />
              <text x="235" y="263" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND} fontFamily={FONT}>first 8 days = {knownTotal}</text>
              <rect x="102" y="274" width="266" height="36" rx="12" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="235" y="298" textAnchor="middle" fontSize="17" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{targetTotal} − {knownTotal} = {missing} min = {answerText}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={427} y={282} width={72} />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
