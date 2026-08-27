import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626";

/** Drop the symmetry altitude, solve either congruent right triangle, then reunite both halves for area. */
export function IsoscelesAltitudeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const equalSide = num(data.equalSide, 0), base = num(data.base, 0);
  const half = base / 2;
  const heightSquared = equalSide ** 2 - half ** 2;
  const height = heightSquared >= 0 ? Math.sqrt(heightSquared) : NaN;
  const area = base * height / 2;
  const choice = problem.choices?.find(c => Number(c.text) === area)?.label;
  const ok = Number.isFinite(height) && Number.isInteger(height) && area === Number(problem.shortAnswer) && choice === problem.answer;
  const failure = !Number.isFinite(height) ? "half-base is not shorter than the equal side" : `computed ${area}; stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const A = { x: 42, y: 218 }, M = { x: 210, y: 218 }, C = { x: 378, y: 218 }, B = { x: 210, y: 58 };
  const title = phase === 0 ? "the symmetry line splits the base into equal halves" : phase === 1 ? "one half is a right triangle: solve its missing leg" : "the two congruent halves reunite for the full area";

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 420 300" width="100%" style={{ maxWidth: 460, minWidth: 0, display: "block" }}>
      <text x="210" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{title}</text>

      <motion.polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={phase === 2 ? "#dcfce7" : "#eef2ff"} stroke={IND} strokeWidth="2.5" strokeLinejoin="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      {phase === 0 && <>
        <motion.line x1={B.x} y1={B.y} x2={M.x} y2={M.y} stroke={GOLD} strokeWidth="3" strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <path d={`M${M.x} ${M.y - 12}h12v12`} fill="none" stroke={GOLD} strokeWidth="2" />
        <line x1="118" y1="211" x2="118" y2="225" stroke={TEAL} strokeWidth="2.5" /><line x1="302" y1="211" x2="302" y2="225" stroke={TEAL} strokeWidth="2.5" />
        <motion.text x="126" y="200" textAnchor="middle" fontSize="17" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>{half}</motion.text>
        <motion.text x="294" y="200" textAnchor="middle" fontSize="17" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>{half}</motion.text>
      </>}

      {phase >= 1 && <>
        <motion.polygon points={`${A.x},${A.y} ${B.x},${B.y} ${M.x},${M.y}`} fill="#fff7ed" stroke={GOLD} strokeWidth="2.5" initial={{ opacity: .2 }} animate={{ opacity: 1 }} />
        <motion.line x1={B.x} y1={B.y} x2={M.x} y2={M.y} stroke={GOLD} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <path d={`M${M.x} ${M.y - 12}h-12v12`} fill="none" stroke={GOLD} strokeWidth="2" />
        <text x="126" y="238" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{half}</text>
        <text x="224" y="143" fontSize="14" fontWeight="900" fill={GOLD} fontFamily={FONT}>{height}</text>
      </>}

      <text x={A.x - 15} y={A.y + 18} fontSize="13" fontWeight="900" fill={INK}>A</text><text x={B.x} y={B.y - 9} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK}>B</text><text x={C.x + 7} y={C.y + 18} fontSize="13" fontWeight="900" fill={INK}>C</text><text x={M.x} y={M.y + 19} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>M</text>
      <text x="105" y="119" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{equalSide}</text><text x="315" y="119" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{equalSide}</text>

      {phase === 1 && <g transform="translate(45 252)"><rect width="330" height="34" rx="10" fill="#fff7ed" stroke={GOLD} /><text x="165" y="22" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD} fontFamily={FONT}>h = √({equalSide}² − {half}²) = √{heightSquared} = {height}</text></g>}
      {phase === 2 && <>
        <motion.g initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="75" y="247" width="270" height="40" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="210" y="273" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>½ × {base} × {height} = {area}</text></motion.g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={370} y={32} width={72} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="210" y="297" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
