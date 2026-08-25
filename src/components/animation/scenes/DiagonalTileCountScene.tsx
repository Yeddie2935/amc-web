import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const RED = "#dc2626";

/** Two tile diagonals overlap once when the square side is odd. */
export function DiagonalTileCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.round(num(data.sideTiles, 19));
  const diagonalUnion = Math.round(num(data.diagonalUnion, 37));
  const center = Math.floor(n / 2);
  const odd = n % 2 === 1;
  const computedUnion = odd ? 2 * n - 1 : 2 * n;
  const area = n * n;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === area)?.label;
  const ok = odd && computedUnion === diagonalUnion && area === stored && choice === problem.answer;
  const failure = !odd
    ? `${n} has no single center tile`
    : computedUnion !== diagonalUnion
      ? `the diagonals cover ${computedUnion}, data says ${diagonalUnion}`
      : `computed area ${area}, stored answer ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const S = 190;
  const GX = 42;
  const GY = 31;
  const cell = S / n;
  const cells = Array.from({ length: n * n }, (_, i) => ({ r: Math.floor(i / n), c: i % n }));
  const isMain = (r: number, c: number) => r === c;
  const isOther = (r: number, c: number) => r + c === n - 1;
  const TileGrid = ({ fillAll = false, countOverlap = false }: { fillAll?: boolean; countOverlap?: boolean }) => <g>
    {cells.map(({ r, c }) => {
      const main = isMain(r, c);
      const other = isOther(r, c);
      const overlap = main && other;
      const fill = fillAll ? "#eef2ff" : overlap && countOverlap ? "#dcfce7" : other ? "#fef3c7" : main ? "#e0e7ff" : "#fff";
      const stroke = overlap && countOverlap ? GREEN : other ? AMBER : main ? INDIGO : "#e2e8f0";
      return <motion.rect key={`${r}-${c}`} x={GX + c * cell} y={GY + r * cell} width={cell} height={cell} fill={fill} stroke={stroke} strokeWidth={main || other ? 0.8 : 0.38}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: fillAll ? (r + c) * 0.009 : main ? r * 0.035 : other ? 0.35 + r * 0.035 : 0 }} />;
    })}
    <rect x={GX} y={GY} width={S} height={S} fill="none" stroke={INK} strokeWidth="1.6" />
    {countOverlap && <motion.rect x={GX + center * cell} y={GY + center * cell} width={cell} height={cell} fill="#dcfce7" stroke={GREEN} strokeWidth="2.2" initial={{ scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />}
  </g>;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 260" style={{ width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, display: "block" }}>
      {phase === 0 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>each diagonal crosses one tile in every row</text>
        <TileGrid />
        <motion.path d={`M ${GX + cell / 2} ${GY + cell / 2} L ${GX + S - cell / 2} ${GY + S - cell / 2}`} stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.15 }} />
        <motion.path d={`M ${GX + S - cell / 2} ${GY + cell / 2} L ${GX + cell / 2} ${GY + S - cell / 2}`} stroke={AMBER} strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.65 }} />
        <motion.g initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 190, damping: 16, delay: 0.7 }}>
          <text x="253" y="68" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={mono}>↘ {n} tiles</text>
          <text x="253" y="98" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={mono}>↙ {n} tiles</text>
          <text x="253" y="135" fontSize="9.5" fontWeight="800" fill="#64748b">both pass through</text>
          <text x="253" y="151" fontSize="9.5" fontWeight="800" fill="#64748b">the same center tile</text>
        </motion.g>
        <text x="137" y="242" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={mono}>{n} rows ↔ {n} diagonal tiles</text>
      </g>}

      {phase === 1 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>the center belongs to both diagonals—but is one tile</text>
        <TileGrid countOverlap />
        <motion.path d={`M ${GX + S + 4} ${GY + center * cell + cell / 2} C 252 126 252 150 265 157`} fill="none" stroke={GREEN} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.05 }} />
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: 1.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="245" y="153" width="137" height="47" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
          <text x="313" y="181" textAnchor="middle" fontSize="14.5" fontWeight="900" fill={INDIGO} fontFamily={mono}>{n} + {n} − 1 = {computedUnion}</text>
        </motion.g>
        <text x="313" y="220" textAnchor="middle" fontSize="9" fontWeight="900" fill={GREEN}>subtract the repeated center once</text>
      </g>}

      {phase === 2 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>the diagonal count reveals the side length</text>
        <TileGrid fillAll />
        <motion.path d={`M ${GX} ${GY + S + 12} L ${GX} ${GY + S + 22} L ${GX + S} ${GY + S + 22} L ${GX + S} ${GY + S + 12}`} fill="none" stroke={INDIGO} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.45 }} />
        <text x={GX + S / 2} y={GY + S + 39} textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={mono}>n = ({diagonalUnion} + 1) ÷ 2 = {n}</text>
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="245" y="69" width="137" height="62" rx="12" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
          <text x="313" y="94" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={mono}>{n} × {n}</text>
          <text x="313" y="118" textAnchor="middle" fontSize="20" fontWeight="900" fill={GREEN} fontFamily={mono}>= {area}</text>
        </motion.g>
        <text x="313" y="154" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `${area} total floor tiles` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={313} y={170} width={88} />
      </g>}
    </svg>
    <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
  </div>;
}
