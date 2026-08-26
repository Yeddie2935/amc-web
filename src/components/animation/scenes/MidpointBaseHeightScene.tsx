import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
type Point = { x: number; y: number };

/** Split a rectangle side at its midpoint, then expose the triangle's perpendicular base-height pair. */
export function MidpointBaseHeightScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const width = num(data.AB, 0), rectangleHeight = num(data.AD, 0);
  const parts = Math.round(num(data.midpointParts, 0));
  const base = rectangleHeight / parts;
  const height = width;
  const area = base * height / 2;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === area)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = parts === 2 && Number.isInteger(base) && area === stored && choice === problem.answer;
  const failure = parts !== 2 ? `midpoint must split AD into 2 parts` : area !== stored ? `computed ${area}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const A: Point = { x: 50, y: 235 }, B: Point = { x: 185, y: 235 }, C: Point = { x: 185, y: 55 }, D: Point = { x: 50, y: 55 }, M: Point = { x: 50, y: 145 };
  const label = (p: Point, text: string, dx: number, dy: number) => <text x={p.x + dx} y={p.y + dy} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{text}</text>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 285" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "M cuts the 8-unit side into two equal 4-unit pieces" : phase === 1 ? "AM is the base; the perpendicular reach to C is the width 6" : "fill the triangle with one-half × base × height"}</text>

      <rect x={A.x} y={D.y} width={B.x - A.x} height={A.y - D.y} fill="#f8fafc" stroke={INK} strokeWidth="2.4" />
      <motion.polygon points={`${A.x},${A.y} ${M.x},${M.y} ${C.x},${C.y}`} fill={phase === 2 ? "#dcfce7" : "#eef2ff"} fillOpacity="0.9" stroke={IND} strokeWidth="2.2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      {phase === 0 && <><motion.line x1={A.x} y1={A.y} x2={M.x} y2={M.y} stroke={TEAL} strokeWidth="5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><line x1="44" y1="99" x2="56" y2="99" stroke={IND} strokeWidth="2" /><line x1="44" y1="190" x2="56" y2="190" stroke={IND} strokeWidth="2" /><text x="34" y="104" textAnchor="end" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{base}</text><text x="34" y="195" textAnchor="end" fontSize="11" fontWeight="900" fill={TEAL} fontFamily={FONT}>{base}</text></>}
      {phase >= 1 && <><motion.line x1={M.x} y1={M.y} x2={D.x} y2={D.y} stroke={TEAL} strokeWidth="2" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><motion.line x1={D.x} y1={D.y} x2={C.x} y2={C.y} stroke={ORANGE} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.75 }} /><path d={`M ${D.x} ${D.y + 11} L ${D.x + 11} ${D.y + 11} L ${D.x + 11} ${D.y}`} fill="none" stroke={ORANGE} strokeWidth="1.8" /><text x={(D.x + C.x) / 2} y={D.y - 8} textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>height = {height}</text><text x="45" y={(A.y + M.y) / 2 + 4} textAnchor="end" fontSize="11" fontWeight="900" fill={TEAL} fontFamily={FONT}>base {base}</text><text x="45" y="102" textAnchor="end" fontSize="8.5" fontWeight="850" fill={TEAL}>base line</text></>}
      {label(A, "A", -18, 17)}{label(B, "B", 8, 17)}{label(C, "C", 8, -8)}{label(D, "D", -18, -8)}{label(M, "M", -21, 4)}
      <text x={(A.x + B.x) / 2} y="256" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{width}</text><text x="202" y="149" fontSize="11" fontWeight="900" fill={DIM} fontFamily={FONT}>AD = {rectangleHeight}</text>

      <g transform="translate(252 53)">
        {phase === 0 && <><text x="88" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>midpoint calculation</text><text x="88" y="48" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>AM = {rectangleHeight} ÷ {parts}</text><motion.rect x="38" y="66" width="100" height="38" rx="10" fill="#ccfbf1" stroke={TEAL} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="88" y="92" textAnchor="middle" fontSize="19" fontWeight="900" fill={TEAL} fontFamily={FONT}>= {base}</text></>}
        {phase === 1 && <><text x="88" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>perpendicular pair</text><rect x="18" y="34" width="140" height="33" rx="9" fill="#ccfbf1" stroke={TEAL} /><text x="88" y="56" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>base = AM = {base}</text><rect x="18" y="78" width="140" height="33" rx="9" fill="#ffedd5" stroke={ORANGE} /><text x="88" y="100" textAnchor="middle" fontSize="14" fontWeight="900" fill={ORANGE} fontFamily={FONT}>height = {height}</text></>}
        {phase === 2 && <><text x="88" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>triangle area</text><text x="88" y="48" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>½ × {base} × {height}</text><motion.rect x="29" y="67" width="118" height="42" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="88" y="95" textAnchor="middle" fontSize="21" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {area}</text></>}
      </g>
      {phase === 2 && <><text x="172" y="277" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "midpoint, perpendicular height, area, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={251} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="281" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
