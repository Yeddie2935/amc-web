import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const AMBER = "#d97706";

function HalfSquare({ x, y, n, label, color, pixels }: { x: number; y: number; n: number; label: string; color: string; pixels: number }) {
  const cell = pixels / n;
  return (
    <g>
      <text x={x + pixels / 2} y={y - 10} textAnchor="middle" fontSize="15" fontWeight="950" fill={color}>{label}</text>
      <polygon points={`${x},${y} ${x + pixels},${y} ${x},${y + pixels}`} fill={`${color}32`} />
      {Array.from({ length: n + 1 }, (_, i) => <g key={i}><line x1={x + i * cell} y1={y} x2={x + i * cell} y2={y + pixels} stroke="#cbd5e1" strokeWidth="0.8" /><line x1={x} y1={y + i * cell} x2={x + pixels} y2={y + i * cell} stroke="#cbd5e1" strokeWidth="0.8" /></g>)}
      <rect x={x} y={y} width={pixels} height={pixels} fill="none" stroke={color} strokeWidth="1.8" />
      <motion.line x1={x} y1={y + pixels} x2={x + pixels} y2={y} stroke={color} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <text x={x + pixels / 2} y={y + pixels + 17} textAnchor="middle" fontSize="11" fontWeight="900" fill={color} fontFamily={FONT}>{n}²/2 = {n * n}/2</text>
    </g>
  );
}

/** Double right-isosceles triangles into side-squares, then relay 3²+4² tokens into 5². */
export function RightIsoscelesAreaRelayScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sides = (Array.isArray(data.sideLengths) ? data.sideLengths : []).map(Number);
  const labels = (Array.isArray(data.areaLabels) ? data.areaLabels : []).map(String);
  const [a, b, c] = sides;
  const [xLabel, yLabel, zLabel] = labels;
  const squares = sides.map((s) => s * s);
  const areas = squares.map((sq) => sq / 2);
  const equality = `${xLabel} + ${yLabel} = ${zLabel}`;
  const choice = (problem.choices ?? []).find((ch) => ch.text.replace(/\s+/g, " ").trim() === equality)?.label;
  const valid = squares[0] + squares[1] === squares[2] && equality === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 480 315" width="100%" style={{ maxWidth: 510, minWidth: 0, display: "block" }} aria-label="Right isosceles triangles on the sides of a three-four-five triangle have areas X, Y, and Z with X plus Y equal to Z">
        <text x="240" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "each outer triangle repeats its side as a perpendicular leg" : phase === 1 ? "two copies of each triangle make an s × s square" : "relay 3² and 4² tokens into the 5² tray"}
        </text>

        {phase === 0 && (
          <g transform="translate(5 4)">
            <polygon points="230,160 350,160 350,70" fill="#f8fafc" stroke={INK} strokeWidth="2.3" />
            <motion.polygon points="350,70 350,160 440,70" fill="#ddd6fe" stroke={IND} strokeWidth="2" initial={{ opacity: 0, scale: 0.55 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 170, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <motion.polygon points="230,160 350,160 350,280" fill="#ccfbf1" stroke={TEAL} strokeWidth="2" initial={{ opacity: 0, scale: 0.55 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, type: "spring", stiffness: 170, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <motion.polygon points="230,160 350,70 140,40" fill="#fef3c7" stroke={AMBER} strokeWidth="2" initial={{ opacity: 0, scale: 0.55 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.36, type: "spring", stiffness: 170, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <path d="M 338 70 v 12 h 12 M 338 148 h 12 v 12 M 230 148 l 9 8 -8 9" fill="none" stroke={INK} strokeWidth="1.6" />
            <text x="362" y="120" fontSize="13" fontWeight="950" fill={INK} fontFamily={FONT}>{a}</text>
            <text x="290" y="178" textAnchor="middle" fontSize="13" fontWeight="950" fill={INK} fontFamily={FONT}>{b}</text>
            <text x="287" y="108" fontSize="13" fontWeight="950" fill={INK} fontFamily={FONT}>{c}</text>
            <text x="392" y="108" fontSize="21" fontStyle="italic" fill={IND}>{xLabel}</text>
            <text x="296" y="231" fontSize="21" fontStyle="italic" fill={TEAL}>{yLabel}</text>
            <text x="209" y="84" fontSize="21" fontStyle="italic" fill={AMBER}>{zLabel}</text>
            <text x="310" y="139" fontSize="18" fontStyle="italic" fill={INK}>W</text>
          </g>
        )}

        {phase === 1 && (
          <>
            <HalfSquare x={37} y={71} n={a} label={xLabel} color={IND} pixels={92} />
            <HalfSquare x={187} y={62} n={b} label={yLabel} color={TEAL} pixels={110} />
            <HalfSquare x={347} y={48} n={c} label={zLabel} color={AMBER} pixels={125} />
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="86" y="239" width="308" height="48" rx="12" fill="#f8fafc" stroke={IND} />
              <text x="240" y="258" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>RIGHT ISOSCELES AREA</text>
              <text x="240" y="279" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>area = side² ÷ 2</text>
            </motion.g>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="relay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <g transform="translate(31 55)">
                <text x="49" y="-9" textAnchor="middle" fontSize="13" fontWeight="950" fill={IND}>{xLabel}: {squares[0]} tokens</text>
                {Array.from({ length: squares[0] }, (_, i) => <motion.rect key={i} x={(i % a) * 25} y={Math.floor(i / a) * 25} width="21" height="21" rx="3" fill="#ddd6fe" stroke={IND} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}
              </g>
              <g transform="translate(31 177)">
                <text x="49" y="-9" textAnchor="middle" fontSize="13" fontWeight="950" fill={TEAL}>{yLabel}: {squares[1]} tokens</text>
                {Array.from({ length: squares[1] }, (_, i) => <motion.rect key={i} x={(i % b) * 19} y={Math.floor(i / b) * 19} width="16" height="16" rx="3" fill="#99f6e4" stroke={TEAL} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.025 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}
              </g>
              <motion.path d="M 125 100 Q 195 105 247 122 M 125 215 Q 195 190 247 154" fill="none" stroke={GREEN} strokeWidth="2.2" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <g transform="translate(270 61)">
                <text x="72" y="-10" textAnchor="middle" fontSize="13" fontWeight="950" fill={GREEN}>{zLabel}: {squares[2]}-token tray</text>
                {Array.from({ length: squares[2] }, (_, i) => <motion.rect key={i} x={(i % c) * 29} y={Math.floor(i / c) * 29} width="25" height="25" rx="4" fill={i < squares[0] ? "#ddd6fe" : "#99f6e4"} stroke={i < squares[0] ? IND : TEAL} initial={{ opacity: 0, x: i < squares[0] ? -90 : -145 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.035, type: "spring", stiffness: 160, damping: 18 }} />)}
              </g>
              <text x="240" y="236" textAnchor="middle" fontSize="15" fontWeight="950" fill={GREEN} fontFamily={FONT}>{squares[0]} + {squares[1]} = {squares[2]}</text>
              <rect x="91" y="250" width="298" height="43" rx="12" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="240" y="277" textAnchor="middle" fontSize="18" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{xLabel} + {yLabel} = {zLabel}</text>
              <text x="198" y="308" textAnchor="middle" fontSize="9" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "the shared ÷2 factor preserves 9 + 16 = 25 • choice verified" : "side, area, or stored-answer check failed"}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={429} y={288} width={72} />
            </motion.g>
          )}
        </AnimatePresence>
        <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} /></marker></defs>
      </svg>
    </div>
  );
}
