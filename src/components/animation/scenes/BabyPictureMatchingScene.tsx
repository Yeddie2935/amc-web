import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", PINK = "#db2777", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

const permute = <T,>(items: T[]): T[][] => items.length === 0 ? [[]] : items.flatMap((item, i) => permute([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest]));
const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);

/** Enumerate baby-photo assignments and isolate the one identity matching. Data: { labels:[string] }. */
export function BabyPictureMatchingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const labels = (Array.isArray(data.labels) ? data.labels : []).map(String);
  const assignments = permute(labels);
  const correctIndex = assignments.findIndex((order) => order.every((label, i) => label === labels[i]));
  const favorable = correctIndex < 0 ? 0 : 1;
  const answer = `${favorable}/${assignments.length}`;
  const choice = problem.choices?.find((c) => c.text === answer)?.label;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const ok = assignments.length === factorial(labels.length) && favorable === 1 && answer === problem.shortAnswer && choice === problem.answer;
  const failure = assignments.length !== factorial(labels.length) ? `generated ${assignments.length}, expected ${factorial(labels.length)}` : answer !== problem.shortAnswer ? `computed ${answer}; stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}; stored ${problem.answer}`;

  const Person = ({ x, label, baby = false }: { x: number; label: string; baby?: boolean }) => <g>
    <rect x={x - 25} y={baby ? 36 : 31} width="50" height={baby ? 43 : 48} rx="9" fill={baby ? "#fdf2f8" : "#eef2ff"} stroke={baby ? PINK : INDIGO} strokeWidth="1.8" />
    <circle cx={x} cy={baby ? 49 : 44} r={baby ? 7 : 8} fill={baby ? "#f9a8d4" : "#a5b4fc"} />
    <path d={baby ? `M ${x - 12} 70 Q ${x} 55 ${x + 12} 70` : `M ${x - 15} 72 Q ${x} 52 ${x + 15} 72`} fill={baby ? "#fce7f3" : "#e0e7ff"} stroke={baby ? PINK : INDIGO} />
    <text x={x} y={baby ? 91 : 93} textAnchor="middle" fontSize="9" fontWeight="900" fill={baby ? PINK : INDIGO} fontFamily={FONT}>{baby ? `baby ${label}` : `celeb ${label}`}</text>
  </g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 420 310" width="100%" style={{ maxWidth: 455, minWidth: 0, display: "block" }}>
      <text x="210" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "shuffle the 3 baby photos into the 3 portrait slots" : phase === 1 ? "only one shuffle matches every identity" : "one success among six equally likely shuffles"}
      </text>

      {phase === 0 && <>
        {labels.map((label, i) => <Person key={label} x={94 + i * 116} label={label} />)}
        <text x="210" y="116" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>all possible baby-card orders</text>
        {assignments.map((order, index) => {
          const col = index % 3, row = Math.floor(index / 3), x = 42 + col * 127, y = 132 + row * 59;
          return <motion.g key={order.join("")} initial={{ opacity: 0, y: -9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <rect x={x} y={y} width="112" height="45" rx="9" fill="#fff" stroke="#cbd5e1" />
            {order.map((label, i) => <g key={`${label}-${i}`}><circle cx={x + 22 + i * 34} cy={y + 18} r="10" fill="#fce7f3" stroke={PINK} /><text x={x + 22 + i * 34} y={y + 22} textAnchor="middle" fontSize="9" fontWeight="900" fill={PINK} fontFamily={FONT}>{label}</text></g>)}
            <text x={x + 56} y={y + 40} textAnchor="middle" fontSize="8" fontWeight="850" fill={DIM}>matching {index + 1}</text>
          </motion.g>;
        })}
        <rect x="126" y="256" width="168" height="39" rx="11" fill="#eef2ff" stroke={INDIGO} />
        <text x="210" y="281" textAnchor="middle" fontSize="18" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{labels.length}! = {assignments.length}</text>
      </>}

      {phase === 1 && <>
        {assignments.map((order, index) => {
          const success = index === correctIndex, col = index % 3, row = Math.floor(index / 3), x = 20 + col * 134, y = 40 + row * 104;
          return <motion.g key={order.join("")} initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: success ? 1.05 : 1 }} transition={{ delay: index * 0.09 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={x} y={y} width="118" height="84" rx="10" fill={success ? "#dcfce7" : "#fff1f2"} stroke={success ? GREEN : RED} strokeWidth={success ? 2.5 : 1.4} />
            {labels.map((label, i) => <g key={label}>
              <text x={x + 25 + i * 34} y={y + 22} textAnchor="middle" fontSize="8" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{label}</text>
              <line x1={x + 25 + i * 34} y1={y + 28} x2={x + 25 + i * 34} y2={y + 47} stroke={order[i] === label ? GREEN : RED} strokeWidth="2" />
              <circle cx={x + 25 + i * 34} cy={y + 57} r="10" fill="#fce7f3" stroke={PINK} />
              <text x={x + 25 + i * 34} y={y + 61} textAnchor="middle" fontSize="8" fontWeight="900" fill={PINK} fontFamily={FONT}>{order[i]}</text>
            </g>)}
            <text x={x + 59} y={y + 77} textAnchor="middle" fontSize="9" fontWeight="900" fill={success ? GREEN : RED}>{success ? "✓ ALL 3" : "✕ mismatch"}</text>
          </motion.g>;
        })}
        <rect x="128" y="258" width="164" height="38" rx="11" fill="#dcfce7" stroke={GREEN} />
        <text x="210" y="283" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>{favorable} correct matching</text>
      </>}

      {phase === 2 && <>
        {labels.map((_, i) => <motion.line key={i} x1={94 + i * 116} y1="76" x2={94 + i * 116} y2="112" stroke={GREEN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 + i * 0.12 }} />)}
        <g transform="translate(0 0)">{labels.map((label, i) => <Person key={label} x={94 + i * 116} label={label} />)}</g>
        {labels.map((label, i) => <motion.g key={label} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 190, damping: 18, delay: i * 0.12 }}><g transform="translate(0 72)"><Person x={94 + i * 116} label={label} baby /></g></motion.g>)}
        <rect x="99" y="172" width="222" height="91" rx="14" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" />
        <text x="210" y="194" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>correct matchings / all matchings</text>
        <text x="153" y="221" textAnchor="middle" fontSize="22" fontWeight="900" fill={GREEN} fontFamily={FONT}>{favorable}</text>
        <line x1="134" y1="228" x2="172" y2="228" stroke={INK} strokeWidth="2" />
        <text x="153" y="253" textAnchor="middle" fontSize="22" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{assignments.length}</text>
        <text x="190" y="235" fontSize="20" fontWeight="900" fill={DIM}>=</text>
        <text x="246" y="239" textAnchor="middle" fontSize="29" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={367} y={220} width={78} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="210" y="302" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
