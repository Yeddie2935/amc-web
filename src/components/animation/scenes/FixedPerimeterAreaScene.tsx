import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#64748b";

function RectangleCard({ x, y, width, height, a, b, active = false }: { x: number; y: number; width: number; height: number; a: number; b: number; active?: boolean }) {
  const color = active ? GREEN : IND;
  return <motion.g initial={{ opacity: 0, scale: .82 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <rect x={x} y={y} width={width} height={height} rx="3" fill={active ? "#dcfce7" : "#eef2ff"} stroke={color} strokeWidth={active ? 2.8 : 2} />
    {Array.from({ length: a - 1 }, (_, i) => <line key={`v${i}`} x1={x + width * (i + 1) / a} y1={y} x2={x + width * (i + 1) / a} y2={y + height} stroke={color} opacity=".13" />)}
    {Array.from({ length: b - 1 }, (_, i) => <line key={`h${i}`} x1={x} y1={y + height * (i + 1) / b} x2={x + width} y2={y + height * (i + 1) / b} stroke={color} opacity=".13" />)}
    <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="900" fill={color} fontFamily={FONT}>{a}</text>
    <text x={x - 9} y={y + height / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill={color} fontFamily={FONT}>{b}</text>
  </motion.g>;
}

export function FixedPerimeterAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const perimeter = Math.round(num(data.perimeter, 0));
  const half = perimeter / 2;
  const minSide = Math.round(num(data.minimumSide, 1));
  const maxA = Math.floor(half / 2);
  const maxB = half - maxA;
  const minB = half - minSide;
  const maxArea = maxA * maxB;
  const minArea = minSide * minB;
  const difference = maxArea - minArea;
  const ok = Number.isInteger(half) && maxArea === 156 && minArea === 24 && String(difference) === problem.shortAnswer && problem.answer === "D";
  const last = totalSteps - 1;
  const phase = step >= last ? 3 : Math.min(step, 2);

  return <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "4px 2px" }}>
    <svg viewBox="0 0 460 292" width="100%" style={{ maxWidth: 500 }} aria-label="Rectangles with fixed perimeter compared by area">
      {phase === 0 && <>
        <text x="230" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>unwrap the perimeter into two equal side-pairs</text>
        <motion.rect x="84" y="53" width="292" height="114" rx="5" fill="#eef2ff" stroke={IND} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <text x="230" y="113" textAnchor="middle" fontSize="22" fontWeight="900" fill={IND} fontFamily={FONT}>2L + 2W = {perimeter}</text>
        <motion.path d="M120 202 H340" stroke="#c7d2fe" strokeWidth="16" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        {Array.from({ length: 25 }, (_, i) => <line key={i} x1={120 + i * 220 / 25} y1="194" x2={120 + i * 220 / 25} y2="210" stroke="#fff" opacity=".8" />)}
        <text x="230" y="243" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>L + W = {half}</text>
        <text x="230" y="268" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>choose two positive integer side lengths totaling {half}</text>
      </>}

      {phase === 1 && <>
        <text x="230" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>move one unit at a time toward balance</text>
        {[[10,15],[11,14],[12,13]].map(([a,b], i) => {
          const w = 90 + a * 2.2, h = b * 5.2;
          const x = 18 + i * 151 + (130 - w) / 2;
          return <g key={a}><RectangleCard x={x} y={62 + (82-h)/2} width={w} height={h} a={a} b={b} active={i===2} />
            <text x={83 + i * 151} y="171" textAnchor="middle" fontSize="15" fontWeight="900" fill={i===2 ? GREEN : IND} fontFamily={FONT}>{a}×{b} = {a*b}</text>
          </g>;
        })}
        <motion.path d="M79 204 H378" stroke={IND} strokeWidth="2.5" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7Z" fill={IND} /></marker></defs>
        <text x="230" y="232" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN}>closer sides → larger area</text>
        <text x="230" y="259" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>maximum = {maxA} × {maxB} = {maxArea}</text>
      </>}

      {phase === 2 && <>
        <text x="230" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>slide all the way to the positive-integer endpoint</text>
        <RectangleCard x={42} y={70} width={270} height={28} a={minB} b={minSide} active />
        <motion.g initial={{ x: 70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", damping: 18 }}>
          <circle cx="359" cy="83" r="25" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
          <text x="359" y="89" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>{minSide}</text>
        </motion.g>
        <text x="230" y="137" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>{minSide} + {minB} = {half}</text>
        <rect x="83" y="169" width="294" height="67" rx="14" fill="#eef2ff" stroke="#c7d2fe" />
        <text x="230" y="195" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>zero is not a rectangle side, so stop at 1</text>
        <text x="230" y="222" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>minimum = {minSide} × {minB} = {minArea}</text>
      </>}

      {phase === 3 && <>
        <text x="230" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>compare the two valid extremes</text>
        <g transform="translate(32 49)"><rect width="178" height="100" rx="14" fill="#dcfce7" stroke={GREEN} strokeWidth="2" /><text x="89" y="24" textAnchor="middle" fontSize="11" fontWeight="850" fill="#166534">LARGEST</text><text x="89" y="58" textAnchor="middle" fontSize="20" fontWeight="900" fill={GREEN} fontFamily={FONT}>{maxA} × {maxB}</text><text x="89" y="83" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={FONT}>= {maxArea}</text></g>
        <g transform="translate(250 49)"><rect width="178" height="100" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="89" y="24" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>SMALLEST</text><text x="89" y="58" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT}>{minSide} × {minB}</text><text x="89" y="83" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>= {minArea}</text></g>
        <motion.g initial={{ opacity: 0, scale: .75 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: .25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="89" y="177" width="282" height="84" rx="18" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" />
          <text x="230" y="207" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? INK : RED} fontFamily={FONT}>{maxArea} − {minArea} = {difference}</text>
          <text x="230" y="239" textAnchor="middle" fontSize="16" fontWeight="900" fill={ok ? GREEN : RED}>{ok ? `Answer ${problem.answer}` : "area or stored-answer check failed"}</text>
        </motion.g>
      </>}
    </svg>
  </div>;
}
