import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

function TileGrid({ x, y, n, size, highlightShell = false, fadeCore = false }: { x: number; y: number; n: number; size: number; highlightShell?: boolean; fadeCore?: boolean }) {
  return <g>{Array.from({ length: n * n }, (_, i) => {
    const col = i % n;
    const row = Math.floor(i / n);
    const shell = row === n - 1 || col === n - 1;
    return <motion.rect key={i} x={x + col * size} y={y + row * size} width={size - 1} height={size - 1} rx={size > 20 ? 2.5 : 1.5} fill={shell && highlightShell ? "#86efac" : "#c7d2fe"} stroke={shell && highlightShell ? GREEN : IND} strokeWidth="1" opacity={!shell && fadeCore ? 0.2 : 1} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: !shell && fadeCore ? 0.2 : 1 }} transition={{ delay: i * 0.012, type: "spring", stiffness: 210, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />;
  })}</g>;
}

/** Grow square tile patterns by an L-shaped border, then extract the seventh square's thirteen new tiles. */
export function SquareBorderGrowthScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const examples = Array.isArray(data.exampleSides) ? data.exampleSides.map(Number) : [];
  const compare = Array.isArray(data.compareSides) ? data.compareSides.map(Number) : [];
  const smaller = compare[0] || 6;
  const larger = compare[1] || 7;
  const oldTiles = smaller ** 2;
  const newTotal = larger ** 2;
  const added = newTotal - oldTiles;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === added)?.label;
  const valid = larger === smaller + 1 && String(added) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Square tile patterns grow by an L-shaped border; adding a seventh row and column to a six by six square uses thirteen tiles">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "each new square wraps one L-shaped border around the last" : phase === 1 ? "wrap a seventh row and column around the 6 × 6 square" : "lift away the new border and count only those tiles"}
        </text>

        {phase === 0 && (
          <>
            {examples.map((n, i) => {
              const size = [48, 33, 25][i] ?? 22;
              const width = n * size;
              const x = [57, 185, 329][i] - width / 2;
              const y = 79 - width / 2;
              const shellCount = n ** 2 - (n - 1) ** 2;
              return <g key={n}>
                <TileGrid x={x} y={y} n={n} size={size} highlightShell />
                <text x={x + width / 2} y="137" textAnchor="middle" fontSize="13" fontWeight="950" fill={IND} fontFamily={FONT}>{n} × {n} = {n ** 2}</text>
                <motion.path d={`M ${x + width / 2} 146 V 174`} stroke={GREEN} strokeWidth="2" markerEnd="url(#tileArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 + i * 0.2 }} />
                <rect x={x + width / 2 - 40} y="181" width="80" height="27" rx="10" fill="#dcfce7" stroke={GREEN} />
                <text x={x + width / 2} y="199" textAnchor="middle" fontSize="11" fontWeight="950" fill={GREEN} fontFamily={FONT}>+ {shellCount} border</text>
              </g>;
            })}
            <motion.path d="M 60 232 Q 235 269 410 232" fill="none" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
            <rect x="121" y="263" width="228" height="36" rx="12" fill="#eef2ff" stroke={IND} />
            <text x="235" y="286" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>square n has n × n = n² tiles</text>
          </>
        )}

        {phase === 1 && (
          <>
            <TileGrid x={42} y={42} n={larger} size={31} highlightShell />
            <motion.path d="M 42 234 H 258 V 42" fill="none" stroke={GREEN} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
            <text x="150" y="279" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{smaller} × {smaller} core = {oldTiles}</text>
            <g transform="translate(292 61)">
              <rect width="142" height="171" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="71" y="28" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TILE TOTALS</text>
              <text x="71" y="66" textAnchor="middle" fontSize="18" fontWeight="950" fill={IND} fontFamily={FONT}>{smaller}² = {oldTiles}</text>
              <motion.path d="M 24 82 H 118" stroke={GREEN} strokeWidth="2" markerEnd="url(#tileArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x="71" y="112" textAnchor="middle" fontSize="18" fontWeight="950" fill={GREEN} fontFamily={FONT}>{larger}² = {newTotal}</text>
              <text x="71" y="145" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>green L-border</text>
            </g>
            <text x="235" y="303" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>The corner tile belongs to both the new row and new column—count it once.</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="extract" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TileGrid x={28} y={43} n={larger} size={25} highlightShell fadeCore />
              <motion.path d="M 216 128 C 252 128 257 84 292 84" fill="none" stroke={GREEN} strokeWidth="2.5" markerEnd="url(#tileArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
              <text x="256" y="119" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>extract</text>
              {Array.from({ length: added }, (_, i) => <motion.rect key={i} x={291 + (i % 7) * 22} y={56 + Math.floor(i / 7) * 31} width="19" height="19" rx="3" fill="#86efac" stroke={GREEN} initial={{ x: -90, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.42 + i * 0.055, type: "spring", stiffness: 190, damping: 18 }} />)}
              <text x="365" y="132" textAnchor="middle" fontSize="14" fontWeight="950" fill={GREEN} fontFamily={FONT}>{larger} + {smaller} = {added} border tiles</text>
              <motion.path d="M 90 243 H 380" stroke={IND} strokeWidth="2" markerEnd="url(#tileArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.75 }} />
              <rect x="107" y="253" width="256" height="42" rx="13" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="235" y="280" textAnchor="middle" fontSize="19" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{newTotal} − {oldTiles} = {added}</text>
              <text x="195" y="307" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "7 + 6 = 13 • difference and choice verified" : `check failed: computed ${added}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={427} y={291} width={72} />
            </motion.g>
          )}
        </AnimatePresence>

        <defs><marker id="tileArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} /></marker></defs>
      </svg>
    </div>
  );
}
