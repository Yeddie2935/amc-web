import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Split two isosceles triangles and rotate their right-triangle halves into matching pairs. Data: { equalSide, bases }. */
export function IsoscelesAltitudePairScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.equalSide, 0);
  const bases = Array.isArray(data.bases) ? data.bases.map((v) => num(v, 0)) : [];
  const halves = bases.map((b) => b / 2);
  const heights = halves.map((h) => Math.sqrt(side * side - h * h));
  const areas = bases.map((b, i) => (b * heights[i]) / 2);
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const choice = problem.choices?.find((c) => c.text.replace(/\s/g, "") === "A=B")?.label;
  const ok = bases.length === 2 && heights.every(Number.isInteger) && areas[0] === areas[1] && problem.shortAnswer === "A = B" && choice === problem.answer;
  const fail = `areas ${areas.join(" and ")}; stored ${problem.shortAnswer ?? "missing"}`;

  const triangle = (cx: number, base: number, height: number, color: string, label: string, reveal: boolean) => {
    const scale = 3.4, y0 = 184, halfPx = (base / 2) * scale, highPx = height * scale, top = y0 - highPx;
    return <g>
      <text x={cx} y="31" textAnchor="middle" fontSize="14" fontWeight="900" fill={color}>{label}</text>
      <motion.polygon points={`${cx},${top} ${cx-halfPx},${y0} ${cx+halfPx},${y0}`} fill={color} fillOpacity=".10" stroke={color} strokeWidth="2.5" strokeLinejoin="round" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <text x={cx-halfPx/2-10} y={(top+y0)/2-4} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{side}</text>
      <text x={cx+halfPx/2+10} y={(top+y0)/2-4} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{side}</text>
      <text x={cx} y={y0+19} textAnchor="middle" fontSize="12" fontWeight="900" fill={color} fontFamily={FONT}>base {base}</text>
      <AnimatePresence>{reveal && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.line x1={cx} y1={top} x2={cx} y2={y0} stroke={GOLD} strokeWidth="2.5" strokeDasharray="5 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <path d={`M ${cx} ${y0-9} h 9 v 9`} fill="none" stroke={GOLD} strokeWidth="1.6" />
        <text x={cx+10} y={(top+y0)/2+4} fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>{height}</text>
        <text x={cx-halfPx/2} y={y0-8} textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{base}/2 = {base/2}</text>
        <text x={cx+halfPx/2} y={y0-8} textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{base}/2 = {base/2}</text>
      </motion.g>}</AnimatePresence>
    </g>;
  };

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 490, display: "block" }}>
      <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "the altitude bisects the 30-unit base" : phase === 1 ? "the other altitude bisects the 40-unit base" : "rotate a half: both triangles use the same right-triangle pieces"}
      </text>

      {phase < 2 && <>
        {triangle(phase === 0 ? 230 : 122, bases[0], heights[0], INDIGO, "triangle A", true)}
        {phase === 1 && triangle(338, bases[1], heights[1], TEAL, "triangle B", true)}
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }}>
          <rect x="72" y="224" width="316" height="50" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="230" y="245" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>
            {phase === 0 ? `15² + 20² = ${side}²` : `20² + 15² = ${side}²`}
          </text>
          <text x="230" y="265" textAnchor="middle" fontSize="12" fontWeight="900" fill={phase === 0 ? INDIGO : TEAL} fontFamily={FONT}>
            {phase === 0 ? "two 15 × 20 right triangles" : "two 20 × 15 right triangles"}
          </text>
        </motion.g>
      </>}

      {phase === 2 && <>
        {[{ x: 62, y: 63, c: INDIGO, who: "A", run: halves[0], rise: heights[0] }, { x: 258, y: 63, c: TEAL, who: "B", run: halves[1], rise: heights[1] }].map((p, i) => {
          const w = p.run * 5, h = p.rise * 5;
          return <motion.g key={p.who} initial={{ opacity: 0, x: i ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 150, damping: 18, delay: i * .25 }}>
            <text x={p.x+w/2} y="45" textAnchor="middle" fontSize="13" fontWeight="900" fill={p.c}>half of {p.who}</text>
            <polygon points={`${p.x},${p.y+h} ${p.x+w},${p.y+h} ${p.x},${p.y}`} fill={p.c} fillOpacity=".16" stroke={p.c} strokeWidth="2.5" />
            <path d={`M ${p.x} ${p.y+h-9} h 9 v 9`} fill="none" stroke={INK} strokeWidth="1.5" />
            <text x={p.x+w/2} y={p.y+h+18} textAnchor="middle" fontSize="12" fontWeight="900" fill={p.c} fontFamily={FONT}>{p.run}</text>
            <text x={p.x-10} y={p.y+h/2+4} textAnchor="middle" fontSize="12" fontWeight="900" fill={p.c} fontFamily={FONT}>{p.rise}</text>
            <text x={p.x+w/2+10} y={p.y+h/2-5} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{side}</text>
          </motion.g>;
        })}
        <motion.path d="M 202 113 C 224 91 240 91 257 113" fill="none" stroke={GOLD} strokeWidth="2.5" strokeDasharray="5 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .5 }} />
        <text x="230" y="91" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={GOLD}>rotate 90°</text>
        <rect x="55" y="220" width="350" height="58" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" />
        <text x="230" y="243" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>A = 2(½·15·20) = {areas[0]}</text>
        <text x="230" y="265" textAnchor="middle" fontSize="16" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>B = 2(½·20·15) = {areas[1]}  ⇒  A = B</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={414} y={272} width={72} />
        {!ok && <text x="230" y="296" textAnchor="middle" fontSize="9" fill={RED}>{fail}</text>}
      </>}
    </svg>
  </div>;
}
