import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const COLORS = ["#6366f1", "#0ea5e9", "#8b5cf6", "#f59e0b", "#16a34a"];

type Point = [number, number];

function parsePolygon(value: unknown): Point[] {
  return String(value ?? "").split(" ").map((pair) => pair.split(",").map(Number) as Point);
}

function doubledArea(points: Point[]) {
  return Math.abs(points.reduce((sum, [x, y], i) => {
    const [nx, ny] = points[(i + 1) % points.length];
    return sum + x * ny - y * nx;
  }, 0));
}

function MiniGrid({ points, label, index }: { points: Point[]; label: string; index: number }) {
  const ox = 17 + index * 91;
  const oy = 49;
  const gap = 16;
  const path = points.map(([x, y]) => `${ox + x * gap},${oy + y * gap}`).join(" ");
  return (
    <g>
      <text x={ox + 32} y="35" textAnchor="middle" fontSize="15" fontWeight="950" fill={COLORS[index]}>{label}</text>
      <motion.polygon points={path} fill={COLORS[index]} fillOpacity="0.18" stroke={COLORS[index]} strokeWidth="2.4" initial={{ pathLength: 0, opacity: 0.3 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: index * 0.1 }} />
      {Array.from({ length: 25 }, (_, n) => {
        const x = ox + (n % 5) * gap;
        const y = oy + Math.floor(n / 5) * gap;
        return <motion.circle key={n} cx={x} cy={y} r="2.5" fill={INK} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + n * 0.012 }} />;
      })}
    </g>
  );
}

function HalfUnits({ count, row, label, color }: { count: number; row: number; label: string; color: string }) {
  const y = 48 + row * 48;
  return (
    <g>
      <text x="25" y={y + 17} textAnchor="middle" fontSize="14" fontWeight="950" fill={color}>{label}</text>
      {Array.from({ length: count }, (_, i) => {
        const pair = Math.floor(i / 2);
        const x = 52 + pair * 31;
        const odd = i % 2 === 1;
        return (
          <motion.path
            key={i}
            d={odd ? `M ${x} ${y} h 24 v 24 Z` : `M ${x} ${y} v 24 h 24 Z`}
            fill={color}
            fillOpacity={odd ? 0.72 : 0.38}
            stroke={color}
            strokeWidth="1.2"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.045, type: "spring", stiffness: 190, damping: 18 }}
          />
        );
      })}
      <text x="266" y={y + 17} fontSize="12.5" fontWeight="900" fill={INK} fontFamily={FONT}>{count} halves ÷ 2 = {count / 2}</text>
    </g>
  );
}

/** Decompose five lattice polygons into half-unit pieces, pair them, and race their exact area totals. */
export function LatticePolygonAreaRaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const labels = Array.isArray(data.labels) ? data.labels.map(String) : [];
  const polygons = Array.isArray(data.polygons) ? data.polygons.map(parsePolygon) : [];
  const doubled = polygons.map(doubledArea);
  const areas = doubled.map((value) => value / 2);
  const maxArea = Math.max(...areas);
  const winner = labels[areas.indexOf(maxArea)];
  const expected = Array.isArray(data.areas) ? data.areas.map(Number) : [];
  const valid = winner === problem.answer && areas.every((area, i) => area === expected[i]);
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Five dot-grid polygons break into half-unit pieces and race by area, with polygon E largest">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "trace every polygon on the same unit dot grid" : phase === 1 ? "pair half-unit triangles into whole squares" : "line up the exact areas on one scale"}
        </text>

        {phase === 0 && polygons.map((points, i) => <MiniGrid key={labels[i]} points={points} label={labels[i]} index={i} />)}
        {phase === 0 && <text x="235" y="151" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>Each grid step is 1 unit, so every diagonal cuts unit squares into halves.</text>}
        {phase === 0 && (
          <motion.g initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }}>
            <rect x="117" y="185" width="236" height="88" rx="15" fill="#eef2ff" stroke={IND} />
            <path d="M 148 205 v 46 h 46 Z" fill="#c7d2fe" stroke={IND} strokeWidth="2" />
            <path d="M 218 205 h 46 v 46 Z" fill="#a5b4fc" stroke={IND} strokeWidth="2" />
            <motion.path d="M 194 228 H 218" stroke={IND} strokeWidth="2" markerEnd="url(#areaArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />
            <text x="320" y="226" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={IND} fontFamily={FONT}>2 × ½ = 1 square</text>
            <text x="235" y="291" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>Count in half-square units first; pair them next.</text>
          </motion.g>
        )}

        {phase === 1 && (
          <>
            {doubled.map((count, i) => <HalfUnits key={labels[i]} count={count} row={i} label={labels[i]} color={COLORS[i]} />)}
            <rect x="73" y="288" width="324" height="22" rx="11" fill="#eef2ff" stroke={IND} />
            <text x="235" y="303" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={IND} fontFamily={FONT}>two half-units make one square unit</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="race" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1="58" y1="251" x2="427" y2="251" stroke={INK} strokeWidth="2" />
              {[4.5, 5, 5.5].map((tick) => {
                const y = 251 - tick * 32;
                return <g key={tick}><line x1="58" y1={y} x2="427" y2={y} stroke={tick === 5.5 ? GREEN : DIM} strokeWidth="1" strokeDasharray="4 4" opacity="0.55" /><text x="48" y={y + 4} textAnchor="end" fontSize="9.5" fill={DIM} fontFamily={FONT}>{tick}</text></g>;
              })}
              {areas.map((area, i) => {
                const x = 71 + i * 75;
                const h = area * 32;
                const isWinner = labels[i] === winner;
                return <g key={labels[i]}>
                  <motion.rect x={x} y={251 - h} width="48" height={h} rx="5" fill={COLORS[i]} fillOpacity={isWinner ? 0.85 : 0.38} stroke={COLORS[i]} strokeWidth={isWinner ? 3 : 1.5} initial={{ height: 0, y: 251 }} animate={{ height: h, y: 251 - h }} transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 18 }} />
                  <text x={x + 24} y={243 - h} textAnchor="middle" fontSize="14" fontWeight="950" fill={COLORS[i]} fontFamily={FONT}>{area}</text>
                  <text x={x + 24} y="289" textAnchor="middle" fontSize="15" fontWeight="950" fill={COLORS[i]}>{labels[i]}</text>
                  {isWinner && <motion.path d={`M ${x + 8} 106 l 9 9 19 -22`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }} />}
                </g>;
              })}
              <text x="235" y="36" textAnchor="middle" fontSize="16" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? `${winner} reaches ${maxArea}: the unique maximum` : "area check failed"}</text>
              <text x="198" y="307" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "all five shoelace areas and stored choice verified" : `computed ${areas.join(", ")}; expected ${expected.join(", ")}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={430} y={291} width={72} />
            </motion.g>
          )}
        </AnimatePresence>
        <defs><marker id="areaArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={IND} /></marker></defs>
      </svg>
    </div>
  );
}
