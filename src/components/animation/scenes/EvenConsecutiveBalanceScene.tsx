import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Balance an even run of consecutive integers around its half-integer average. */
export function EvenConsecutiveBalanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = num(data.total, 0), count = Math.round(num(data.count, 0)), stepSize = num(data.stepSize, 0);
  const average = total / count, first = average - ((count - 1) * stepSize) / 2;
  const values = Array.from({ length: count }, (_, i) => first + i * stepSize), largest = values.at(-1) ?? NaN;
  const pairedSum = values[0] + values[count - 1], rebuilt = values.reduce((a, b) => a + b, 0);
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === largest)?.label;
  const ok = rebuilt === total && stored === largest && choice === problem.answer;
  const failure = rebuilt !== total ? `tiles sum to ${rebuilt}, not ${total}` : stored !== largest ? `computed ${largest}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(Math.max(step, 0), 1);
  const x0 = 55, gap = 60, y = 131, centerX = x0 + ((count - 1) * gap) / 2;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 420 305" width="100%" style={{ maxWidth: 455, minWidth: 0, display: "block" }}>
      <text x="210" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "share the total equally to find the balance point" : phase === 1 ? "six consecutive integers balance around 335.5" : "the rightmost tile is the largest"}</text>

      {phase === 0 && <g>
        <rect x="63" y="46" width="294" height="51" rx="12" fill="#eef2ff" stroke={IND} /><text x="210" y="66" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>total ÷ number of integers</text><text x="210" y="89" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>{total} ÷ {count} = {average}</text>
        <motion.path d={`M 210 101 V ${y - 14}`} stroke={GOLD} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <circle cx={centerX} cy={y} r="7" fill={GOLD} /><text x={centerX} y={y + 27} textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>{average}</text>
        <line x1="48" y1={y} x2="372" y2={y} stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <text x="210" y="207" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>an even count balances between its two middle integers</text>
      </g>}

      {phase >= 1 && <g>
        <line x1="42" y1={y} x2="378" y2={y} stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <line x1={centerX} y1={y - 50} x2={centerX} y2={y + 35} stroke={GOLD} strokeWidth="2" strokeDasharray="5 4" /><text x={centerX} y={y - 57} textAnchor="middle" fontSize="11" fontWeight="900" fill={GOLD} fontFamily={FONT}>average {average}</text>
        {values.map((v, i) => { const isLargest = i === values.length - 1; return <motion.g key={v} initial={{ opacity: 0, y: i < count / 2 ? -18 : 18, scale: .6 }} animate={{ opacity: phase === 2 && !isLargest ? .35 : 1, y: phase === 2 && isLargest ? -55 : 0, scale: phase === 2 && isLargest ? 1.18 : 1 }} transition={{ type: "spring", stiffness: 180, damping: 17, delay: i * .08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={x0 + i * gap - 23} y={y - 19} width="46" height="38" rx="8" fill={isLargest && phase === 2 ? "#dcfce7" : "#eef2ff"} stroke={isLargest && phase === 2 ? GREEN : IND} strokeWidth={isLargest && phase === 2 ? 2.5 : 1.5} /><text x={x0 + i * gap} y={y + 6} textAnchor="middle" fontSize="13" fontWeight="900" fill={isLargest && phase === 2 ? GREEN : IND} fontFamily={FONT}>{v}</text></motion.g>; })}
      </g>}

      {phase === 1 && <g>
        {Array.from({ length: count / 2 }, (_, i) => { const lx = x0 + i * gap, rx = x0 + (count - 1 - i) * gap, arcY = 70 + i * 10; return <motion.path key={i} d={`M ${lx} ${y - 25} Q ${centerX} ${arcY} ${rx} ${y - 25}`} fill="none" stroke={[IND, GOLD, "#0d9488"][i]} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .14 }} />; })}
        <text x="210" y="191" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>each opposite pair has the same sum</text><text x="210" y="214" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{pairedSum} + {pairedSum} + {pairedSum} = {rebuilt}</text>
      </g>}
      {phase === 0 && <g transform="translate(92 232)"><rect width="236" height="44" rx="11" fill="#fff7ed" stroke={GOLD} /><text x="118" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>center of the consecutive run</text><text x="118" y="37" textAnchor="middle" fontSize="15" fontWeight="900" fill={GOLD} fontFamily={FONT}>between 335 and 336</text></g>}
      {phase === 1 && <text x="210" y="258" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>check: {values.join(" + ")} = {rebuilt}</text>}
      {phase === 2 && <g transform="translate(94 220)"><motion.rect width="232" height="51" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .8 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="116" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>largest = rightmost consecutive tile</text><text x="116" y="42" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{largest}</text></g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={210} y={276} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="210" y="303" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
