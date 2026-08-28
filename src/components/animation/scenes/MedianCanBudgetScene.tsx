import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Sort customer purchases, stress-test the middle pair, then fill the exact extremal distribution. */
export function MedianCanBudgetScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const customers = Math.round(num(data.customers, 0));
  const totalCans = Math.round(num(data.totalCans, 0));
  const minimum = Math.round(num(data.minimumPerCustomer, 0));
  const lowerCount = customers / 2 - 1;
  const upperCount = customers / 2;
  const leftPosition = lowerCount + 1;
  const rightPosition = leftPosition + 1;
  const remaining = totalCans - lowerCount * minimum;
  const leftMax = Math.floor(remaining / (upperCount + 1));
  const impossibleTotal = lowerCount * minimum + (upperCount + 1) * (leftMax + 1);
  const rightBudget = totalCans - lowerCount * minimum - leftMax;
  const rightMax = Math.floor(rightBudget / upperCount);
  const constructionTotal = lowerCount * minimum + leftMax + upperCount * rightMax;
  const median = (leftMax + rightMax) / 2;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === median)?.label;
  const ok = constructionTotal === totalCans && Number(problem.shortAnswer) === median && choice === problem.answer;
  const failure = constructionTotal !== totalCans ? `construction uses ${constructionTotal}, not ${totalCans}` : Number(problem.shortAnswer) !== median ? `computed ${median}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const phase = step >= totalSteps - 1 ? 4 : Math.min(step, 3);

  const slotX = (i: number) => 42 + i * 3.78;
  const valueAt = (i: number) => phase === 2 ? (i < lowerCount ? minimum : leftMax + 1) : phase >= 3 ? (i < lowerCount ? minimum : i === lowerCount ? leftMax : rightMax) : i < lowerCount && phase >= 1 ? minimum : 0;
  const captions = [
    `sort ${customers} customers; middle positions are ${leftPosition}th and ${rightPosition}st`,
    `spend the minimum on the first ${lowerCount} customers`,
    `try ${leftMax + 1} at position ${leftPosition}: the final ${upperCount + 1} stacks are at least ${leftMax + 1}`,
    `${rightBudget} cans remain for the final ${upperCount} customers`,
    `balance the two middle stacks: ${leftMax} and ${rightMax}`,
  ];

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 318" width="100%" style={{ maxWidth: 490, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.3" fontWeight="850" fill={INK}>{captions[phase]}</text>

      {phase < 4 && <>
        <line x1="39" y1="178" x2="421" y2="178" stroke="#94a3b8" strokeWidth="1.5" />
        {Array.from({ length: customers }, (_, i) => {
          const value = valueAt(i), middle = i === lowerCount || i === lowerCount + 1;
          const fill = phase === 2 && i >= lowerCount ? RED : phase >= 3 && middle ? GREEN : value ? IND : "#e2e8f0";
          const shownHeight = Math.max(value, 0.45) * 18;
          return <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.012, 0.5) }}>
            <rect x={slotX(i)} y={178 - shownHeight} width="2.9" height={shownHeight} rx="1.2" fill={fill} opacity={value ? 1 : 0.45} />
            {middle && <rect x={slotX(i) - 1.5} y={175 - shownHeight} width="5.9" height={shownHeight + 6} rx="2" fill="none" stroke={phase >= 3 ? GREEN : IND} strokeWidth="1.4" />}
          </motion.g>;
        })}
        <path d={`M ${slotX(lowerCount) + 1.5} 188 V 198 H ${slotX(lowerCount + 1) + 1.5} V 188`} fill="none" stroke={IND} strokeWidth="1.7" />
        <text x={(slotX(lowerCount) + slotX(lowerCount + 1)) / 2 + 1.5} y="213" textAnchor="middle" fontSize="9" fontWeight="900" fill={IND} fontFamily={FONT}>{leftPosition}  {rightPosition}</text>
        <text x="42" y="199" fontSize="8.5" fontWeight="800" fill={DIM}>least</text><text x="421" y="199" textAnchor="end" fontSize="8.5" fontWeight="800" fill={DIM}>greatest</text>
      </>}

      {phase === 0 && <g transform="translate(92 230)"><rect width="276" height="48" rx="11" fill="#eef2ff" stroke="#a5b4fc" /><text x="138" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>even-sized list</text><text x="138" y="38" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>median = (x₅₀ + x₅₁) ÷ 2</text></g>}

      {phase === 1 && <g transform="translate(94 228)"><rect width="272" height="55" rx="11" fill="#eef2ff" stroke={IND} /><text x="136" y="21" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{lowerCount} × {minimum} = {lowerCount} cans</text><text x="136" y="43" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{totalCans} − {lowerCount} = {remaining} left</text></g>}

      {phase === 2 && <g transform="translate(74 225)"><rect width="312" height="63" rx="11" fill="#fef2f2" stroke={RED} strokeWidth="1.8" /><text x="156" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={RED} fontFamily={FONT}>{lowerCount} + {upperCount + 1} × {leftMax + 1} = {impossibleTotal}</text><text x="156" y="43" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>{impossibleTotal} &gt; {totalCans}, so x₅₀ ≤ {leftMax}</text><text x="156" y="57" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={DIM}>the red stacks overflow the day’s total by {impossibleTotal - totalCans}</text></g>}

      {phase === 3 && <g transform="translate(54 222)"><rect width="352" height="72" rx="11" fill="#f0fdf4" stroke={ok ? GREEN : RED} strokeWidth="1.8" /><text x="176" y="20" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK} fontFamily={FONT}>{rightBudget} ÷ {upperCount} = {rightMax}, so x₅₁ ≤ {rightMax}</text><text x="176" y="42" textAnchor="middle" fontSize="13" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{lowerCount}×{minimum} + {leftMax} + {upperCount}×{rightMax} = {constructionTotal}</text><text x="176" y="61" textAnchor="middle" fontSize="9.2" fontWeight="850" fill={DIM}>exact fill: the bound is attainable</text></g>}

      {phase === 4 && <>
        <g transform="translate(85 61)">
          {[leftMax, rightMax].map((value, i) => <motion.g key={value} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.16 }}><rect x={i * 180} y={92 - value * 20} width="62" height={value * 20} rx="7" fill={i ? "#c7d2fe" : "#ddd6fe"} stroke={IND} strokeWidth="2" />{Array.from({ length: value }, (_, j) => <line key={j} x1={i * 180} y1={92 - j * 20} x2={i * 180 + 62} y2={92 - j * 20} stroke="#fff" strokeWidth="1.3" />)}<text x={i * 180 + 31} y="112" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>x{ i ? "₅₁" : "₅₀" } = {value}</text></motion.g>)}
          <motion.path d="M73 49 H169" stroke={GREEN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          <motion.text x="121" y="42" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>average the pair</motion.text>
        </g>
        <motion.g initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="98" y="206" width="264" height="58" rx="13" fill={ok ? "#dcfce7" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="230" y="229" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>maximum median</text><text x="230" y="251" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>({leftMax} + {rightMax}) ÷ 2 = {median}</text></motion.g>
        <text x="230" y="286" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "bounds, exact fill, and choice verified" : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={292} width={82} />
      </>}
      <AnimatePresence>{phase === 4 && !ok && <motion.text x="230" y="307" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
