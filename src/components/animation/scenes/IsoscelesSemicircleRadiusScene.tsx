import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", ORANGE = "#d97706", TEAL = "#0d9488", RED = "#dc2626", DIM = "#64748b";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);

/** Split the isosceles triangle, then use its tangent radius as the height to the 17-side. */
export function IsoscelesSemicircleRadiusScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base = num(data.base, 0), height = num(data.height, 0), half = base / 2;
  const slant = Math.hypot(half, height), area = half * height / 2;
  const rn = Math.round(2 * area), rd = Math.round(slant), g = gcd(rn, rd);
  const radius = rn / rd, radiusText = `${rn / g}/${rd / g}`;
  const stored = String(problem.shortAnswer ?? "").replace(/\s/g, "");
  const choice = problem.choices?.find(c => c.text.replace(/\s/g, "") === radiusText)?.label;
  const ok = Number.isInteger(slant) && radiusText === stored && choice === problem.answer;
  const failure = !Number.isInteger(slant) ? `slanted side ${slant} is not integral` : `computed ${radiusText}; stored ${stored || "missing"}`;
  const final = step >= totalSteps - 1, phase = final ? 3 : Math.min(step, 2);

  const scale = 14.5, M = { x: 230, y: 238 }, A = { x: 230, y: 238 - height * scale };
  const L = { x: 230 - half * scale, y: 238 }, R = { x: 230 + half * scale, y: 238 };
  const rPx = radius * scale;
  const vx = R.x - A.x, vy = R.y - A.y;
  const t = ((M.x - A.x) * vx + (M.y - A.y) * vy) / (vx * vx + vy * vy);
  const T = { x: A.x + t * vx, y: A.y + t * vy };
  const title = phase === 0 ? "the altitude splits 16 into two equal 8s" : phase === 1 ? "one half is an 8–15–17 right triangle" : phase === 2 ? "the tangent radius is the height to the 17-side" : "the same triangle area determines r";

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{title}</text>

      <motion.path d={`M${L.x} ${L.y} L${A.x} ${A.y} L${R.x} ${R.y} Z`} fill={phase >= 1 ? "#eef2ff" : "#fff"} fillOpacity={phase >= 1 ? .45 : 1} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <motion.path d={`M${M.x-rPx} ${M.y} A${rPx} ${rPx} 0 0 1 ${M.x+rPx} ${M.y}`} fill="#ecfeff" fillOpacity=".72" stroke={TEAL} strokeWidth="2.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <line x1={M.x-rPx} y1={M.y} x2={M.x+rPx} y2={M.y} stroke={TEAL} strokeWidth="1.6" />

      <motion.line x1={A.x} y1={A.y} x2={M.x} y2={M.y} stroke={IND} strokeWidth="2.3" strokeDasharray="6 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <path d={`M${M.x} ${M.y-12} h12 v12`} fill="none" stroke={IND} strokeWidth="1.5" />
      <text x={M.x-13} y={(A.y+M.y)/2+4} textAnchor="end" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{height}</text>
      <text x={(L.x+M.x)/2} y={M.y+19} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{half}</text>
      <text x={(M.x+R.x)/2} y={M.y+19} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{half}</text>

      {phase >= 1 && <motion.text x={(A.x+R.x)/2+10} y={(A.y+R.y)/2-8} transform={`rotate(62 ${(A.x+R.x)/2+10} ${(A.y+R.y)/2-8})`} textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{slant}</motion.text>}
      {phase >= 1 && <g transform="translate(328 42)"><text x="55" y="18" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{half}² + {height}²</text><text x="55" y="41" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>= {half*half + height*height}</text><text x="55" y="69" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>side = {slant}</text></g>}

      {phase >= 2 && <><motion.line x1={M.x} y1={M.y} x2={T.x} y2={T.y} stroke={ORANGE} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><circle cx={T.x} cy={T.y} r="3" fill={ORANGE} /><path d={`M${T.x-4} ${T.y+7} l8 4 4-8`} fill="none" stroke={ORANGE} strokeWidth="1.5" /><text x={(M.x+T.x)/2-9} y={(M.y+T.y)/2+2} fontSize="14" fontWeight="900" fill={ORANGE} fontFamily={FONT}>r</text><motion.polygon points={`${A.x},${A.y} ${M.x},${M.y} ${R.x},${R.y}`} fill={ORANGE} fillOpacity=".13" initial={{ opacity: 0 }} animate={{ opacity: 1 }} /></>}

      {phase === 2 && <g transform="translate(52 280)"><text x="178" y="0" textAnchor="middle" fontSize="12.5" fontWeight="900" fill={INK} fontFamily={FONT}>½·8·15 = <tspan fill={IND}>{area}</tspan> = ½·17·<tspan fill={ORANGE}>r</tspan></text><text x="178" y="24" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>same half-triangle, two choices of base and height</text></g>}
      {phase === 3 && <g transform="translate(50 267)"><text x="180" y="0" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{area} = {slant}r/2</text><text x="180" y="26" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>r = {radiusText}</text></g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer} cx={400} y={280} width={82} />
      <AnimatePresence>{final && !ok && <motion.text x="230" y="315" textAnchor="middle" fontSize="10" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
