import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Transfer a rectangle's area to an attached right triangle, then find its hypotenuse. Data: { rectangleWidth, sharedHeight }. */
export function EqualAreaRightTriangleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const width = num(data.rectangleWidth, 0), height = num(data.sharedHeight, 0);
  const area = width * height, base = height === 0 ? 0 : 2 * area / height, hypotenuse = Math.hypot(height, base);
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const choice = problem.choices?.find((c) => Number(c.text) === hypotenuse)?.label;
  const ok = Number.isInteger(area) && Number.isInteger(base) && Number.isInteger(hypotenuse) && String(hypotenuse) === problem.shortAnswer && choice === problem.answer;
  const failure = !Number.isInteger(base) ? `triangle base ${base} is not integral` : !Number.isInteger(hypotenuse) ? `hypotenuse ${hypotenuse} is not integral` : `computed ${hypotenuse}; stored ${problem.shortAnswer}`;

  const x0 = 38, join = 180, top = 52, bottom = 172, tip = 396;
  const rectW = join - x0, hPx = bottom - top;
  const cellW = rectW / width, cellH = hPx / height;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 440 310" width="100%" style={{ maxWidth: 475, minWidth: 0, display: "block" }}>
      <text x="220" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "tile the 6-by-5 rectangle" : phase === 1 ? "the attached triangle must hold the same 30 square units" : "the right triangle now has legs 5 and 12"}
      </text>

      <polygon points={`${join},${top} ${tip},${bottom} ${join},${bottom}`} fill={phase >= 1 ? "#fef3c7" : "#f8fafc"} stroke={phase >= 1 ? GOLD : "#94a3b8"} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x={x0} y={top} width={rectW} height={hPx} fill="#ecfeff" stroke={TEAL} strokeWidth="2.5" />
      <path d={`M ${join} ${bottom - 10} H ${join + 10} V ${bottom}`} fill="none" stroke={INK} strokeWidth="1.8" />

      {phase === 0 && <>
        {Array.from({ length: Math.round(width * height) }, (_, i) => {
          const col = i % width, row = Math.floor(i / width);
          return <motion.rect key={i} x={x0 + col * cellW} y={top + row * cellH} width={cellW} height={cellH} fill="#ccfbf1" stroke="#67e8f9" strokeWidth=".8" initial={{ opacity: 0, scale: .65 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .025 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />;
        })}
        <text x={(x0 + join) / 2} y="42" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>AD = {width}</text>
        <text x="19" y={(top + bottom) / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT} transform={`rotate(-90 19 ${(top + bottom) / 2 + 4})`}>AB = {height}</text>
        <motion.g initial={{ scale: .65 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="108" y="206" width="224" height="48" rx="12" fill="#ecfeff" stroke={TEAL} strokeWidth="2" />
          <text x="220" y="236" textAnchor="middle" fontSize="20" fontWeight="900" fill={TEAL} fontFamily={FONT}>{width} × {height} = {area}</text>
        </motion.g>
        <text x="220" y="282" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{area} unit tiles fill rectangle ABCD</text>
      </>}

      {phase === 1 && <>
        <text x="109" y="116" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={FONT}>area {area}</text>
        <motion.text x="252" y="121" textAnchor="middle" fontSize="18" fontWeight="900" fill={GOLD} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}>area {area}</motion.text>
        <motion.path d="M 137 129 C 174 151 210 151 248 132" fill="none" stroke={GREEN} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .7 }} />
        <text x="192" y="157" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>SAME AREA</text>
        <text x="194" y="42" textAnchor="start" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>DC = {height}</text>
        <motion.line x1={join} y1={bottom + 8} x2={tip} y2={bottom + 8} stroke={INDIGO} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .3 }} />
        <text x={(join + tip) / 2} y={bottom + 25} textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={FONT}>CE = ?</text>
        <rect x="60" y="220" width="320" height="65" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="220" y="242" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>½ × {height} × CE = {area}</text>
        <motion.text x="220" y="272" textAnchor="middle" fontSize="20" fontWeight="900" fill={INDIGO} fontFamily={FONT} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }}>CE = 2 × {area} ÷ {height} = {base}</motion.text>
      </>}

      {phase === 2 && <>
        <rect x={x0} y={top} width={rectW} height={hPx} fill="#f8fafc" opacity=".7" />
        <motion.line x1={join} y1={top} x2={join} y2={bottom} stroke={TEAL} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.line x1={join} y1={bottom} x2={tip} y2={bottom} stroke={INDIGO} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .15 }} />
        <motion.line x1={join} y1={top} x2={tip} y2={bottom} stroke={GREEN} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .3 }} />
        <rect x="186" y="104" width="34" height="22" rx="7" fill="#ecfeff" /><text x="203" y="120" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{height}</text>
        <rect x="278" y="179" width="36" height="22" rx="7" fill="#eef2ff" /><text x="296" y="195" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{base}</text>
        <rect x="301" y="91" width="38" height="23" rx="7" fill="#dcfce7" /><text x="320" y="108" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT}>DE</text>
        <g transform="translate(65 218)"><rect width="310" height="62" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" />
          <text x="155" y="24" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>DE² = {height}² + {base}² = {height * height + base * base}</text>
          <text x="155" y="51" textAnchor="middle" fontSize="21" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>DE = √{height * height + base * base} = {hypotenuse}</text>
        </g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={398} y={267} width={72} />
      </>}

      <text x={x0 - 8} y={top - 8} fontSize="11" fontWeight="900" fill={INK}>A</text><text x={x0 - 8} y={bottom + 16} fontSize="11" fontWeight="900" fill={INK}>B</text><text x={join - 4} y={bottom + 16} fontSize="11" fontWeight="900" fill={INK}>C</text><text x={join - 4} y={top - 8} fontSize="11" fontWeight="900" fill={INK}>D</text><text x={tip + 6} y={bottom + 4} fontSize="11" fontWeight="900" fill={INK}>E</text>
      <AnimatePresence>{final && !ok && <motion.text x="220" y="304" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
