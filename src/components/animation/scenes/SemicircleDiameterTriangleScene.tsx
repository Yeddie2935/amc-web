import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Turn semicircle area and arc measures into triangle diameters, then solve the third radius. */
export function SemicircleDiameterTriangleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const areaCoeff = num(data.abSemicircleAreaCoefficient, 0);
  const arcCoeff = num(data.acSemicircleArcCoefficient, 0);
  const abRadius = Math.sqrt(2 * areaCoeff), AB = 2 * abRadius;
  const acRadius = arcCoeff, AC = 2 * acRadius;
  const bcSq = AC * AC - AB * AB, BC = Math.sqrt(bcSq), answerRadius = BC / 2;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === answerRadius)?.label;
  const ok = stored === answerRadius && choice === problem.answer;
  const failure = stored !== answerRadius ? `computed ${answerRadius}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const A = { x: 108, y: 55 }, B = { x: 108, y: 135 }, C = { x: 258, y: 135 };
  const abR = 40, bcR = 75, acR = 85;
  const acArc = `M ${A.x} ${A.y} A ${acR} ${acR} 0 0 1 ${C.x} ${C.y}`;
  const label = (name: string, x: number, y: number) => <text x={x} y={y} fontSize="12" fontWeight="900" fontStyle="italic" fill={INK}>{name}</text>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 430 315" width="100%" style={{ maxWidth: 470, minWidth: 0, display: "block" }}>
      <text x="215" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "the left semicircle reveals diameter AB" : phase === 1 ? "the hypotenuse semicircle reveals diameter AC" : phase === 2 ? "the two diameters make a right triangle" : "halve diameter BC to get its semicircle's radius"}
      </text>

      <motion.path d={`M ${A.x} ${A.y} A ${abR} ${abR} 0 0 0 ${B.x} ${B.y}`} fill={phase === 0 ? "#e0e7ff" : "none"} stroke={phase === 0 ? IND : INK} strokeWidth={phase === 0 ? 4 : 2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <motion.path d={acArc} fill={phase === 1 ? "#fef3c7" : "none"} stroke={phase === 1 ? GOLD : INK} strokeWidth={phase === 1 ? 4 : 2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .1 }} />
      <motion.path d={`M ${B.x} ${B.y} A ${bcR} ${bcR} 0 0 0 ${C.x} ${C.y}`} fill={phase === 3 ? "#ccfbf1" : "none"} stroke={phase === 3 ? TEAL : INK} strokeWidth={phase === 3 ? 4 : 2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .2 }} />
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={phase === 2 ? "#dcfce7" : "#fff"} fillOpacity=".75" stroke={INK} strokeWidth="2.5" />
      <polyline points={`${B.x + 10},${B.y} ${B.x + 10},${B.y - 10} ${B.x},${B.y - 10}`} fill="none" stroke={GREEN} strokeWidth="2" />
      {label("A", A.x - 16, A.y - 5)}{label("B", B.x - 17, B.y + 14)}{label("C", C.x + 7, C.y + 13)}

      {phase === 0 && <g>
        <line x1={A.x} y1={95} x2={B.x} y2={95} stroke={IND} strokeWidth="2.5" /><circle cx={A.x} cy="95" r="3" fill={IND} />
        <text x="47" y="98" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>r = {abRadius}</text>
        <g transform="translate(282 43)"><rect x="0" y="0" width="124" height="83" rx="12" fill="#eef2ff" stroke={IND} /><text x="62" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>semicircle area</text><text x="62" y="41" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>½πr² = {areaCoeff}π</text><text x="62" y="62" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>r = {abRadius}</text><text x="62" y="78" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>AB = 2r = {AB}</text></g>
      </g>}
      {phase === 1 && <g>
        <motion.path d={acArc} fill="none" stroke={GOLD} strokeWidth="7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <g transform="translate(283 48)"><rect width="124" height="78" rx="12" fill="#fff7ed" stroke={GOLD} /><text x="62" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>semicircle arc</text><text x="62" y="41" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD} fontFamily={FONT}>πr = {arcCoeff}π</text><text x="62" y="62" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>AC = 2r = {AC}</text></g>
      </g>}
      {phase >= 2 && <g>
        <text x={(A.x + B.x) / 2 - 15} y={(A.y + B.y) / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{AB}</text>
        <text x={(A.x + C.x) / 2 + 8} y={(A.y + C.y) / 2 - 9} textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>{AC}</text>
      </g>}
      {phase === 3 && <g>
        <line x1={B.x} y1={B.y + 37} x2={C.x} y2={C.y + 37} stroke={TEAL} strokeWidth="2" /><line x1={(B.x + C.x) / 2} y1={B.y + 29} x2={(B.x + C.x) / 2} y2={B.y + 45} stroke={TEAL} strokeWidth="2" />
        <text x={(B.x + C.x) / 2} y={B.y + 57} textAnchor="middle" fontSize="11" fontWeight="900" fill={TEAL} fontFamily={FONT}>{BC} ÷ 2</text>
      </g>}

      {phase === 0 && <text x="215" y="238" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>8π area → r = 4 → AB = 8</text>}
      {phase === 1 && <text x="215" y="238" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>a semicircle arc has length πr</text>}
      {phase === 2 && <g transform="translate(65 218)"><rect width="300" height="58" rx="12" fill="#f0fdf4" stroke={GREEN} /><text x="150" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>BC² = {AC}² − {AB}² = {bcSq}</text><text x="150" y="47" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT}>BC = √{bcSq} = {BC}</text></g>}
      {phase === 3 && <g transform="translate(86 224)"><rect width="258" height="55" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="129" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>radius is half the diameter</text><text x="129" y="44" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{BC} ÷ 2 = {answerRadius}</text></g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={215} y={285} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="215" y="311" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
