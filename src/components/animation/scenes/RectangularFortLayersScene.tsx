import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Build one solid floor and stack identical hollow perimeter rings above it. */
export function RectangularFortLayersScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const length = Math.round(num(data.length, 0)), width = Math.round(num(data.width, 0)), height = Math.round(num(data.height, 0)), thick = Math.round(num(data.thickness, 0));
  const floor = length * width, innerLength = length - 2 * thick, innerWidth = width - 2 * thick;
  const ring = floor - innerLength * innerWidth, wallLayers = height - thick, walls = ring * wallLayers, total = floor + walls;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === total)?.label;
  const ok = stored === total && choice === problem.answer;
  const failure = stored !== total ? `computed ${total}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1, phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const cell = 14, gx = 121, gy = 45, gridW = length * cell, gridH = width * cell;
  const border = (c: number, r: number) => c < thick || c >= length - thick || r < thick || r >= width - thick;
  const ringPath = `M ${gx} ${gy + 54} h ${gridW} v ${gridH} h ${-gridW} Z M ${gx + thick * cell} ${gy + 54 + thick * cell} v ${innerWidth * cell} h ${innerLength * cell} v ${-innerWidth * cell} Z`;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 410 330" width="100%" style={{ maxWidth: 455, minWidth: 0, display: "block" }}>
      <text x="205" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "tile the entire 12-by-10 floor" : phase === 1 ? "hollow one layer, leaving a one-cube border" : phase === 2 ? "stack four identical border rings above the floor" : "combine the solid floor and hollow walls"}</text>

      {phase <= 1 && <g>
        {Array.from({ length: width }, (_, r) => Array.from({ length }, (_, c) => {
          const keep = phase === 0 || border(c, r);
          return <motion.rect key={`${c}-${r}`} x={gx + c * cell} y={gy + r * cell} width={cell - .7} height={cell - .7} rx="1.3" fill={keep ? (phase === 0 ? "#c7d2fe" : "#fde68a") : "#fff"} stroke={keep ? (phase === 0 ? IND : GOLD) : "#e2e8f0"} strokeWidth={keep ? 1 : .6} initial={{ opacity: 0, scale: .4 }} animate={{ opacity: keep ? 1 : .25, scale: 1 }} transition={{ delay: (r * length + c) * .006 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />;
        }))}
        <path d={`M ${gx} ${gy - 7} v-6 h ${gridW} v6`} fill="none" stroke={INK} strokeWidth="1.3" /><text x={gx + gridW / 2} y={gy - 17} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={INK} fontFamily={FONT}>{length}</text>
        <path d={`M ${gx - 7} ${gy} h-6 v ${gridH} h6`} fill="none" stroke={INK} strokeWidth="1.3" /><text x={gx - 22} y={gy + gridH / 2} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={INK} fontFamily={FONT} transform={`rotate(-90 ${gx - 22} ${gy + gridH / 2})`}>{width}</text>
      </g>}

      {phase >= 2 && <g>
        <motion.rect x={gx} y={gy + 62} width={gridW} height={gridH} fill="#c7d2fe" stroke={IND} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: .75 }} />
        <text x={gx + gridW / 2} y={gy + gridH + 78} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={IND} fontFamily={FONT}>floor: {length} × {width} = {floor}</text>
        {Array.from({ length: wallLayers }, (_, i) => {
          const lift = (wallLayers - i) * 12;
          return <motion.g key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: -lift }} transition={{ type: "spring", stiffness: 150, damping: 18, delay: i * .13 }}>
            <path d={ringPath} fill={["#fde68a", "#fed7aa", "#fcd34d", "#fbbf24"][i % 4]} fillRule="evenodd" stroke={GOLD} strokeWidth="1.8" />
            <text x={gx + gridW + 11} y={gy + 64 + gridH / 2} fontSize="9" fontWeight="900" fill={GOLD}>{i + 1}</text>
          </motion.g>;
        })}
        <path d={`M ${gx - 15} ${gy + 14} h-7 v ${wallLayers * 12} h7`} fill="none" stroke={GREEN} strokeWidth="1.6" /><text x={gx - 31} y={gy + 42} textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN} fontFamily={FONT} transform={`rotate(-90 ${gx - 31} ${gy + 42})`}>{wallLayers} wall layers</text>
      </g>}

      {phase === 0 && <g transform="translate(79 235)"><rect width="252" height="48" rx="11" fill="#eef2ff" stroke={IND} /><text x="126" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>one cube per floor cell</text><text x="126" y="40" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{length} × {width} = {floor}</text></g>}
      {phase === 1 && <g transform="translate(55 224)"><rect width="300" height="65" rx="11" fill="#fff7ed" stroke={GOLD} /><text x="150" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>outer rectangle − empty inside</text><text x="150" y="39" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD} fontFamily={FONT}>{length}×{width} − {innerLength}×{innerWidth}</text><text x="150" y="58" textAnchor="middle" fontSize="17" fontWeight="900" fill={GOLD} fontFamily={FONT}>= {ring} cubes per ring</text></g>}
      {phase === 2 && <g transform="translate(72 242)"><rect width="266" height="51" rx="11" fill="#f0fdf4" stroke={GREEN} /><text x="133" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>height 5 includes the 1-cube floor</text><text x="133" y="41" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>{height} − {thick} = {wallLayers} wall layers</text></g>}
      {phase === 3 && <g transform="translate(53 244)"><motion.rect width="304" height="54" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .8 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="152" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>floor + four perimeter rings</text><text x="152" y="43" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{floor} + {wallLayers} × {ring} = {total}</text></g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={205} y={301} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="205" y="327" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
