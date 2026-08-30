import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

function Cube({ x, y, size, color = IND, label, delay = 0 }: { x: number; y: number; size: number; color?: string; label?: string; delay?: number }) {
  const d = size * 0.34;
  return (
    <motion.g initial={{ scale: 0.35, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay, type: "spring", stiffness: 180, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <path d={`M ${x} ${y + d} L ${x + d} ${y} H ${x + size + d} L ${x + size} ${y + d} Z`} fill={`${color}30`} stroke={color} strokeWidth="1.7" />
      <path d={`M ${x + size} ${y + d} L ${x + size + d} ${y} V ${y + size} L ${x + size} ${y + size + d} Z`} fill={`${color}55`} stroke={color} strokeWidth="1.7" />
      <rect x={x} y={y + d} width={size} height={size} fill={`${color}18`} stroke={color} strokeWidth="1.7" />
      {label && <text x={x + size / 2} y={y + d + size / 2 + 5} textAnchor="middle" fontSize={Math.max(8, size * 0.22)} fontWeight="950" fill={color} fontFamily={FONT}>{label}</text>}
    </motion.g>
  );
}

function Arrow({ d, label, x, y }: { d: string; label: string; x: number; y: number }) {
  return <g><motion.path d={d} fill="none" stroke={IND} strokeWidth="2" markerEnd="url(#boxArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><rect x={x - 25} y={y - 11} width="50" height="19" rx="9" fill="#fff" /><text x={x} y={y + 3} textAnchor="middle" fontSize="11" fontWeight="950" fill={IND} fontFamily={FONT}>× 2</text></g>;
}

/** Double a jellybean box in three dimensions, split it into eight congruent boxes, and scale its capacity. */
export function DimensionDoublingBoxArrayScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const capacity = num(data.startCapacity, 125);
  const scale = num(data.dimensionScale, 2);
  const copies = scale ** 3;
  const result = capacity * copies;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === result)?.label;
  const valid = String(result) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Bert's jellybean box doubles in height, width, and length and separates into eight equal-capacity boxes">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "stretch Bert's box twice as far in all three directions" : phase === 1 ? "split the enlarged box at each doubled midpoint" : "fill every Bert-sized section with 125 jellybeans"}
        </text>

        {phase === 0 && (
          <>
            <Cube x={44} y={100} size={68} color={DIM} label="125" />
            <text x="88" y="205" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>Bert's box</text>
            <motion.path d="M 144 143 H 198" stroke={IND} strokeWidth="2.5" markerEnd="url(#boxArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <Cube x={254} y={63} size={132} color={IND} />
            <text x="334" y="247" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>Carrie's box</text>
            <Arrow d="M 248 211 H 395" label="width" x={322} y={226} />
            <Arrow d="M 404 202 V 70" label="height" x={433} y={137} />
            <Arrow d="M 250 99 L 292 55" label="length" x={260} y={57} />
            <rect x="134" y="272" width="202" height="30" rx="11" fill="#eef2ff" stroke={IND} />
            <text x="235" y="292" textAnchor="middle" fontSize="14" fontWeight="950" fill={IND} fontFamily={FONT}>2 wide × 2 high × 2 long</text>
          </>
        )}

        {phase === 1 && (
          <>
            <g opacity="0.2"><Cube x={157} y={54} size={130} color={IND} /></g>
            {Array.from({ length: copies }, (_, i) => {
              const layer = Math.floor(i / 4);
              const position = i % 4;
              const col = position % 2;
              const row = Math.floor(position / 2);
              return <Cube key={i} x={73 + col * 165 + layer * 24} y={64 + row * 105 - layer * 24} size={62} color={layer ? GREEN : IND} label={`${i + 1}`} delay={i * 0.09} />;
            })}
            <motion.path d="M 89 273 H 381" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
            <text x="235" y="295" textAnchor="middle" fontSize="19" fontWeight="950" fill={IND} fontFamily={FONT}>{scale} × {scale} × {scale} = {copies} equal boxes</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="fill" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: copies }, (_, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                return <motion.g key={i} initial={{ y: -25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08, type: "spring" }}>
                  <rect x={42 + col * 100} y={48 + row * 80} width="82" height="58" rx="10" fill={row ? "#dcfce7" : "#eef2ff"} stroke={row ? GREEN : IND} strokeWidth="2" />
                  {Array.from({ length: 15 }, (_, bean) => <ellipse key={bean} cx={52 + col * 100 + (bean % 5) * 14} cy={60 + row * 80 + Math.floor(bean / 5) * 12} rx="4.5" ry="3.2" fill={row ? "#4ade80" : "#818cf8"} transform={`rotate(${bean % 2 ? 25 : -25} ${52 + col * 100 + (bean % 5) * 14} ${60 + row * 80 + Math.floor(bean / 5) * 12})`} />)}
                  <text x={83 + col * 100} y={99 + row * 80} textAnchor="middle" fontSize="11" fontWeight="950" fill={row ? GREEN : IND} fontFamily={FONT}>{capacity}</text>
                </motion.g>;
              })}
              <motion.path d="M 83 220 H 387" stroke={IND} strokeWidth="2" markerEnd="url(#boxArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
              <rect x="107" y="235" width="256" height="45" rx="14" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="235" y="264" textAnchor="middle" fontSize="20" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{capacity} × {copies} = {result}</text>
              <text x="195" y="303" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "2³ sections • capacity and choice verified" : `check failed: computed ${result}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={427} y={288} width={72} />
            </motion.g>
          )}
        </AnimatePresence>

        <defs><marker id="boxArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={IND} /></marker></defs>
      </svg>
    </div>
  );
}
