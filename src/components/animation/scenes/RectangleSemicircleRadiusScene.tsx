import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

function piCoefficient(text: string): number {
  const s = text.replace(/\s/g, "");
  if (s === "π") return 1;
  const m = s.match(/^(\d+)?π(?:\/(\d+))?$/);
  return m ? Number(m[1] ?? 1) / Number(m[2] ?? 1) : NaN;
}

/** Split the rectangle base at the semicircle center, exposing the radius triangle. */
export function RectangleSemicircleRadiusScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const width = num(data.rectangleWidth, 0), height = num(data.rectangleHeight, 0);
  const half = width / 2, rSq = half * half + height * height, radius = Math.sqrt(rSq), areaCoeff = rSq / 2;
  const stored = piCoefficient(String(problem.shortAnswer ?? ""));
  const choice = (problem.choices ?? []).find((c) => Math.abs(piCoefficient(c.text) - areaCoeff) < 1e-9)?.label;
  const ok = Math.abs(stored - areaCoeff) < 1e-9 && choice === problem.answer;
  const result = areaCoeff === 1 ? "π" : `${areaCoeff}π`;
  const failure = stored !== areaCoeff ? `computed ${result}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(Math.max(step, 0), 1);

  const O = { x: 205, y: 178 }, unit = 55, left = O.x - half * unit, right = O.x + half * unit, top = O.y - height * unit, R = radius * unit;
  const endL = O.x - R, endR = O.x + R;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 410 310" width="100%" style={{ maxWidth: 455, minWidth: 0, display: "block" }}>
      <text x="205" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "symmetry puts the center at the base midpoint" : phase === 1 ? "a top corner and the center make a right triangle" : "fill half of the circle with r² = 2"}</text>

      {phase === 2 && <motion.path d={`M ${endL} ${O.y} A ${R} ${R} 0 0 1 ${endR} ${O.y} Z`} fill="#dcfce7" stroke="none" initial={{ opacity: 0 }} animate={{ opacity: .8 }} />}
      <motion.path d={`M ${endL} ${O.y} A ${R} ${R} 0 0 1 ${endR} ${O.y}`} fill="none" stroke={phase === 2 ? GREEN : INK} strokeWidth={phase === 2 ? 4 : 2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <line x1={endL} y1={O.y} x2={endR} y2={O.y} stroke={INK} strokeWidth="2.5" />
      <motion.rect x={left} y={top} width={width * unit} height={height * unit} fill={phase === 0 ? "#eef2ff" : "#fff"} fillOpacity=".9" stroke={IND} strokeWidth="2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

      <circle cx={O.x} cy={O.y} r="4" fill={GOLD} /><text x={O.x - 4} y={O.y + 17} fontSize="11" fontWeight="900" fill={GOLD}>O</text>
      {phase === 0 && <g>
        <motion.line x1={O.x} y1={O.y} x2={O.x} y2={top} stroke={GOLD} strokeDasharray="5 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <path d={`M ${left} ${O.y + 16} v6 H ${O.x} v-6 M ${O.x} ${O.y + 16} v6 H ${right} v-6`} fill="none" stroke={IND} strokeWidth="1.5" />
        <text x={(left + O.x) / 2} y={O.y + 39} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{half}</text><text x={(right + O.x) / 2} y={O.y + 39} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{half}</text>
        <text x={left - 16} y={(top + O.y) / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{height}</text>
      </g>}
      {phase >= 1 && <g>
        <motion.polygon points={`${O.x},${O.y} ${right},${O.y} ${right},${top}`} fill={phase === 1 ? "#fef3c7" : "#dcfce7"} stroke={GOLD} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: .85 }} />
        <polyline points={`${right - 10},${O.y} ${right - 10},${O.y - 10} ${right},${O.y - 10}`} fill="none" stroke={GOLD} strokeWidth="2" />
        <motion.line x1={O.x} y1={O.y} x2={right} y2={top} stroke={IND} strokeWidth="3.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <text x={(O.x + right) / 2} y={O.y - 7} textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>{half}</text><text x={right + 12} y={(top + O.y) / 2 + 4} fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>{height}</text><text x={(O.x + right) / 2 - 8} y={(O.y + top) / 2 - 7} fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>r</text>
      </g>}

      {phase === 0 && <g transform="translate(88 240)"><rect width="234" height="43" rx="11" fill="#eef2ff" stroke={IND} /><text x="117" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>the 2-unit base splits evenly</text><text x="117" y="36" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{half} + {half} = {width}</text></g>}
      {phase === 1 && <g transform="translate(88 235)"><rect width="234" height="50" rx="11" fill="#fff7ed" stroke={GOLD} /><text x="117" y="20" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>Pythagorean theorem</text><text x="117" y="41" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>r² = {half}² + {height}² = {rSq}</text></g>}
      {phase === 2 && <g transform="translate(67 235)"><motion.rect width="276" height="50" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .8 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="138" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>semicircle area = ½πr²</text><text x="138" y="41" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>½ × π × {rSq} = {result}</text></g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={205} y={286} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="205" y="309" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
