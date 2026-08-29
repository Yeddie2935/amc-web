import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", ORANGE = "#d97706", RED = "#dc2626", DIM = "#64748b";

/** Park model cars into fixed-width rows, exposing and then filling the smallest final gap. */
export function RowCompletionCarsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const current = Math.round(num(data.currentCars, 0));
  const rowSize = Math.round(num(data.carsPerRow, 0));
  const fullRows = Math.floor(current / rowSize);
  const partial = current % rowSize;
  const neededRows = Math.ceil(current / rowSize);
  const nextTotal = neededRows * rowSize;
  const additional = nextTotal - current;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === additional)?.label;
  const ok = nextTotal === current + additional && Number(problem.shortAnswer) === additional && choice === problem.answer;
  const failure = nextTotal !== current + additional ? `${current}+${additional} ≠ ${nextTotal}` : Number(problem.shortAnswer) !== additional ? `computed ${additional}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const phase = step >= totalSteps - 1 ? 2 : Math.min(step, 1);
  const cellW = 56, cellH = 48, x0 = 62, y0 = 49;
  const slots = Array.from({ length: nextTotal }, (_, i) => ({ row: Math.floor(i / rowSize), col: i % rowSize, occupied: i < current }));
  const captions = [
    `park ${current} cars in rows of exactly ${rowSize}`,
    `the next complete row ends at ${nextTotal}`,
    `drive the fewest new cars into the gap`,
  ];

  const Car = ({ x, y, color = IND }: { x: number; y: number; color?: string }) => <g transform={`translate(${x} ${y})`}><path d="M4 23 L9 13 H29 L37 23 H43 V31 H1 V23 Z" fill={`${color}22`} stroke={color} strokeWidth="1.7" strokeLinejoin="round"/><path d="M12 13 L17 7 H28 L34 13" fill="none" stroke={color} strokeWidth="1.7"/><circle cx="11" cy="31" r="4.5" fill="#fff" stroke={color} strokeWidth="2"/><circle cx="34" cy="31" r="4.5" fill="#fff" stroke={color} strokeWidth="2"/></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ width: "100%", maxWidth: 340, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{captions[phase]}</text>

      <g>
        {slots.map((slot, i) => {
          const x = x0 + slot.col * cellW, y = y0 + slot.row * cellH;
          const incoming = !slot.occupied && phase === 2;
          return <g key={i}><rect x={x} y={y} width="46" height="39" rx="7" fill={incoming ? "#f0fdf4" : slot.occupied ? "#eef2ff" : "#fff7ed"} stroke={incoming ? GREEN : slot.occupied ? "#c7d2fe" : ORANGE} strokeWidth={slot.occupied ? 1 : 2} strokeDasharray={!slot.occupied && !incoming ? "4 3" : undefined}/>{slot.occupied && <motion.g initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.035 }}><Car x={x + 1} y={y + 1}/></motion.g>}{incoming && <motion.g initial={{ x: 95, y: -38, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 15 }}><Car x={x + 1} y={y + 1} color={GREEN}/></motion.g>}{!slot.occupied && phase < 2 && <text x={x + 23} y={y + 24} textAnchor="middle" fontSize="18" fontWeight="900" fill={ORANGE}>?</text>}</g>;
        })}
        {Array.from({ length: neededRows }, (_, row) => <text key={row} x="48" y={y0 + row * cellH + 24} textAnchor="end" fontSize="9" fontWeight="850" fill={row < fullRows ? DIM : ORANGE} fontFamily={FONT}>row {row + 1}</text>)}
      </g>

      {phase === 0 && <g transform="translate(94 252)"><rect width="272" height="43" rx="11" fill="#eef2ff" stroke={IND}/><text x="136" y="17" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{fullRows} full rows and {partial} cars in the next</text><text x="136" y="35" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{current} = {fullRows} × {rowSize} + {partial}</text></g>}

      {phase === 1 && <>
        <motion.path d={`M ${x0 + (rowSize - 1) * cellW + 23} ${y0 + (neededRows - 1) * cellH + 47} V 246`} stroke={ORANGE} strokeWidth="2.5" markerEnd="url(#gap-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/>
        <g transform="translate(95 250)"><rect width="270" height="45" rx="11" fill="#fff7ed" stroke={ORANGE}/><text x="135" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>multiples of {rowSize}</text><text x="135" y="36" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{fullRows * rowSize} &lt; {current} &lt; {neededRows} × {rowSize} = {nextTotal}</text></g>
      </>}

      {phase === 2 && <>
        <g transform="translate(91 249)"><rect width="240" height="47" rx="11" fill={ok ? "#dcfce7" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="120" y="19" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>fill the one open parking space</text><text x="120" y="38" textAnchor="middle" fontSize="16" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{nextTotal} − {current} = {additional} new car</text></g>
        <text x="170" y="307" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${neededRows}×${rowSize} = ${nextTotal}; choice verified` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={380} y={282} width={80}/>
      </>}
      <defs><marker id="gap-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill={ORANGE}/></marker></defs>
      <AnimatePresence>{phase === 2 && !ok && <motion.text x="230" y="307" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
