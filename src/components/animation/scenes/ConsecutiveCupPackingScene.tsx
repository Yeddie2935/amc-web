import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const cupNames = ["A", "B", "C", "D", "E"];
const tidy = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(1);

function Slip({ x, y, value, color = IND, delay = 0 }: { x: number; y: number; value: number; color?: string; delay?: number }) {
  return <motion.g initial={{ opacity: .35, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <rect x={x} y={y} width="48" height="27" rx="6" fill="#fff" stroke={color} strokeWidth="1.7" />
    <text x={x + 24} y={y + 18} textAnchor="middle" fontSize="12" fontWeight="900" fill={color} fontFamily={FONT}>{tidy(value)}</text>
  </motion.g>;
}

function Cup({ x, target, fill, name, active = false, bad = false }: { x: number; target: number; fill: number; name: string; active?: boolean; bad?: boolean }) {
  const color = bad ? RED : active ? GREEN : IND;
  const level = Math.min(1, Math.max(0, fill / target));
  return <g>
    <text x={x} y="43" textAnchor="middle" fontSize="13" fontWeight="900" fill={color}>{name}</text>
    <path d={`M${x - 31} 55 L${x - 24} 143 Q${x} 151 ${x + 24} 143 L${x + 31} 55`} fill="#f8fafc" stroke={color} strokeWidth={active || bad ? 2.7 : 1.8} />
    {fill > 0 && <motion.path d={`M${x - 24 + 5 * level} ${143 - 78 * level} L${x + 24 - 5 * level} ${143 - 78 * level} L${x + 24} 143 Q${x} 151 ${x - 24} 143 Z`} fill={bad ? "#fee2e2" : active ? "#dcfce7" : "#e0e7ff"} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />}
    <text x={x} y="83" textAnchor="middle" fontSize="19" fontWeight="900" fill={color} fontFamily={FONT}>{target}</text>
    <text x={x} y="165" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>target</text>
  </g>;
}

export function ConsecutiveCupPackingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const slips = (data.slips as unknown[]).map((v) => num(v, 0));
  const cupCount = Math.round(num(data.cupCount, 5));
  const total = slips.reduce((sum, v) => sum + v, 0);
  const average = total / cupCount;
  const targets = Array.from({ length: cupCount }, (_, i) => average - (cupCount - 1) / 2 + i);
  const given = [0, 3, 0, 0, 2];
  const trial = 3.5;
  const complements = targets.map((target, i) => target - given[i] - trial);

  // Exhaustively pack the actual multiset (in half-units), retaining solutions
  // with the two given placements. This independently checks the forced cup.
  const units = slips.map((v) => Math.round(v * 2)).sort((a, b) => b - a);
  const targetUnits = targets.map((v) => Math.round(v * 2));
  const solutions: number[][][] = [];
  const search = (index: number, sums: number[], cups: number[][]) => {
    if (solutions.length > 500) return;
    if (index === units.length) {
      if (sums.every((s, i) => s === targetUnits[i]) && cups[1].includes(6) && cups[4].includes(4)) solutions.push(cups.map((c) => [...c]));
      return;
    }
    const value = units[index];
    for (let c = 0; c < cupCount; c++) {
      if (sums[c] + value > targetUnits[c]) continue;
      sums[c] += value; cups[c].push(value);
      search(index + 1, sums, cups);
      cups[c].pop(); sums[c] -= value;
    }
  };
  search(0, Array(cupCount).fill(0), Array.from({ length: cupCount }, () => []));
  const forcedCupIndexes = new Set(solutions.map((solution) => solution.findIndex((cup) => cup.includes(7))));
  const witness = solutions[0]?.map((cup) => cup.map((v) => v / 2)) ?? [];
  const ok = solutions.length > 0 && forcedCupIndexes.size === 1 && forcedCupIndexes.has(3) && problem.shortAnswer === "D" && problem.answer === "D";
  const last = totalSteps - 1;
  const phase = step >= last ? 4 : Math.min(step, 3);

  const xs = [55, 145, 235, 325, 415];
  return <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "5px 2px" }}>
    <svg viewBox="0 0 470 305" width="100%" style={{ maxWidth: 500 }} aria-label="Numbered slips packed into five cups with consecutive sums">
      {phase === 0 && <>
        <text x="235" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>gather every slip into one total</text>
        {slips.map((v, i) => <Slip key={i} x={35 + (i % 6) * 68} y={48 + Math.floor(i / 6) * 48} value={v} delay={i * .04} />)}
        <motion.path d="M75 159 C115 204 171 202 206 219 M395 159 C355 204 299 202 264 219" fill="none" stroke={DIM} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.rect x="164" y="207" width="142" height="58" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" initial={{ scale: .8 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <text x="235" y="230" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ALL 12 SLIPS</text>
        <text x="235" y="253" textAnchor="middle" fontSize="21" fontWeight="900" fill={IND} fontFamily={FONT}>total = {total}</text>
      </>}

      {phase === 1 && <>
        <text x="235" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>five consecutive totals balance around their average</text>
        <rect x="141" y="39" width="188" height="42" rx="12" fill="#eef2ff" stroke="#c7d2fe" />
        <text x="235" y="65" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{total} ÷ {cupCount} = {average}</text>
        <line x1="55" y1="122" x2="415" y2="122" stroke="#cbd5e1" strokeWidth="3" />
        {targets.map((t, i) => <motion.g key={t} initial={{ opacity: .3, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }}>
          <circle cx={xs[i]} cy="122" r={i === 2 ? 25 : 21} fill={i === 2 ? "#ede9fe" : "#f8fafc"} stroke={i === 2 ? IND : DIM} strokeWidth={i === 2 ? 2.5 : 1.7} />
          <text x={xs[i]} y="128" textAnchor="middle" fontSize="18" fontWeight="900" fill={i === 2 ? IND : INK} fontFamily={FONT}>{t}</text>
          <text x={xs[i]} y="164" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>{cupNames[i]}</text>
        </motion.g>)}
        <text x="235" y="205" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>5, 6, 7, 8, 9</text>
        <text x="235" y="230" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>equal steps of +1; middle value is 7</text>
      </>}

      {phase === 2 && <>
        <text x="235" y="21" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>place the two slips specified in the problem</text>
        {targets.map((t, i) => <Cup key={i} x={xs[i]} target={t} fill={given[i]} name={cupNames[i]} active={i === 1 || i === 4} />)}
        <Slip x={121} y={103} value={3} color={GREEN} />
        <Slip x={391} y={103} value={2} color={GREEN} />
        <g transform="translate(88 192)">
          <rect width="294" height="62" rx="13" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="147" y="23" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>B needs 6 − 3 = 3 more</text>
          <text x="147" y="46" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>E needs 9 − 2 = 7 more</text>
        </g>
      </>}

      {phase === 3 && <>
        <text x="235" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>try the single 3.5 slip in every cup</text>
        {targets.map((t, i) => <g key={i}>
          <Cup x={xs[i]} target={t} fill={given[i] + trial} name={cupNames[i]} active={i === 3} bad={i !== 3} />
          <text x={xs[i]} y="186" textAnchor="middle" fontSize="10" fontWeight="900" fill={i === 3 ? GREEN : RED} fontFamily={FONT}>{i === 0 ? "leaves 1.5" : i === 1 ? "over by 0.5" : i === 2 || i === 4 ? "needs 3.5" : "can fit"}</text>
          {i !== 3 && <motion.line x1={xs[i] - 24} y1="66" x2={xs[i] + 24} y2="137" stroke={RED} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .12 }} />}
        </g>)}
        <Slip x={301} y={105} value={trial} color={GREEN} />
        <text x="235" y="228" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={RED}>A needs unavailable 1.5; B overfills;</text>
        <text x="235" y="247" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={RED}>C or E would require a second 3.5 slip</text>
      </>}

      {phase === 4 && <>
        <text x="235" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>one complete packing verifies every slip and every target</text>
        {witness.map((cup, i) => <g key={i}>
          <rect x={xs[i] - 40} y="46" width="80" height="151" rx="13" fill={i === 3 ? "#dcfce7" : "#eef2ff"} stroke={i === 3 ? GREEN : IND} strokeWidth={i === 3 ? 2.7 : 1.6} />
          <text x={xs[i]} y="68" textAnchor="middle" fontSize="13" fontWeight="900" fill={i === 3 ? GREEN : IND}>{cupNames[i]}</text>
          {cup.map((v, j) => <g key={j}>
            <rect x={xs[i] - 25} y={80 + j * 28} width="50" height="23" rx="5" fill="#fff" stroke={v === trial ? GREEN : "#cbd5e1"} strokeWidth={v === trial ? 2.2 : 1.2} />
            <text x={xs[i]} y={96 + j * 28} textAnchor="middle" fontSize="11" fontWeight="900" fill={v === trial ? GREEN : INK} fontFamily={FONT}>{tidy(v)}</text>
          </g>)}
          <text x={xs[i]} y="217" textAnchor="middle" fontSize="12" fontWeight="900" fill={i === 3 ? GREEN : IND} fontFamily={FONT}>= {targets[i]} ✓</text>
        </g>)}
        <rect x="118" y="246" width="234" height="42" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" />
        <text x="235" y="263" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={ok ? "#166534" : RED}>{ok ? "all valid packings put 3.5 in D" : "packing or stored-answer check failed"}</text>
        <text x="235" y="280" textAnchor="middle" fontSize="14" fontWeight="900" fill={ok ? GREEN : RED}>Answer {problem.answer}</text>
      </>}
    </svg>
  </div>;
}
