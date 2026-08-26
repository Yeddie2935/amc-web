import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
type P = { x: number; y: number };
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

/** Join the semicircle centre to a triangle vertex, making two area pieces with radius-height. */
export function SemicircleAreaSplitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ac = num(data.AC, 0), bc = num(data.BC, 0);
  const ab = Math.sqrt(ac * ac + bc * bc);
  const area = ac * bc / 2;
  const radius = (2 * area) / (ab + bc);
  const scale = 20;
  const A: P = { x: 38, y: 224 }, C: P = { x: 38 + ac * scale, y: 224 }, B: P = { x: C.x, y: 224 - bc * scale };
  const O: P = { x: C.x - radius * scale, y: C.y };
  const vx = B.x - A.x, vy = B.y - A.y;
  const t = ((O.x - A.x) * vx + (O.y - A.y) * vy) / (vx * vx + vy * vy);
  const T: P = { x: A.x + t * vx, y: A.y + t * vy };
  const tangentRadius = Math.hypot(O.x - T.x, O.y - T.y) / scale;
  const rn = Math.round(ac * bc), rd = Math.round(ab + bc), g = gcd(rn, rd);
  const radiusText = `${rn / g}/${rd / g}`;
  const stored = String(problem.shortAnswer ?? "").replace(/\s/g, "");
  const choice = (problem.choices ?? []).find((c) => c.text.replace(/\s/g, "") === radiusText)?.label;
  const ok = Math.abs(ab - 13) < 1e-9 && Math.abs(tangentRadius - radius) < 1e-9 && radiusText === stored && choice === problem.answer;
  const failure = Math.abs(tangentRadius - radius) >= 1e-9 ? `OT=${tangentRadius}, OC=${radius}` : `computed ${radiusText}, stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 4 : Math.min(step, 3);
  const pts = (ps: P[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");
  const label = (p: P, text: string, dx: number, dy: number) => <text x={p.x + dx} y={p.y + dy} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{text}</text>;
  const rPx = radius * scale;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "the outer triangle is the 5–12–13 right triangle" : phase === 1 ? "both perpendicular segments from O are radii" : phase === 2 ? "BO divides the whole triangle into two radius-height pieces" : phase === 3 ? "add the two colored triangle areas to equal 30" : "solve the area balance for the radius"}</text>

      {phase >= 2 && <><motion.polygon points={pts([A, B, O])} fill={IND} fillOpacity="0.19" initial={{ opacity: 0 }} animate={{ opacity: 1 }} /><motion.polygon points={pts([B, C, O])} fill={ORANGE} fillOpacity="0.25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} /></>}
      <path d={`M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} Z`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <motion.path d={`M ${O.x - rPx} ${O.y} A ${rPx} ${rPx} 0 0 1 ${C.x} ${C.y}`} fill="#eef2ff" fillOpacity="0.48" stroke={IND} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      <line x1={O.x - rPx} y1={O.y} x2={C.x} y2={C.y} stroke={IND} strokeWidth="1.7" />
      {phase >= 1 && <><motion.line x1={O.x} y1={O.y} x2={T.x} y2={T.y} stroke={TEAL} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><motion.line x1={O.x} y1={O.y} x2={C.x} y2={C.y} stroke={ORANGE} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} /><path d={`M ${T.x + 4} ${T.y + 7} L ${T.x + 11} ${T.y + 4} L ${T.x + 8} ${T.y - 3}`} fill="none" stroke={TEAL} strokeWidth="1.4" /><path d={`M ${C.x - 11} ${C.y} L ${C.x - 11} ${C.y - 11} L ${C.x} ${C.y - 11}`} fill="none" stroke={ORANGE} strokeWidth="1.4" /><text x={(O.x + T.x) / 2 - 9} y={(O.y + T.y) / 2 - 2} fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>r</text><text x={(O.x + C.x) / 2} y={O.y + 17} textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>r</text></>}
      {phase >= 2 && <motion.line x1={B.x} y1={B.y} x2={O.x} y2={O.y} stroke={IND} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65 }} />}
      <circle cx={O.x} cy={O.y} r="3.5" fill={INK} />
      {label(A,"A",-17,16)}{label(B,"B",8,-5)}{label(C,"C",8,16)}{label(O,"O",-14,17)}{phase >= 1 && label(T,"T",-5,-10)}
      <text x={(A.x + C.x) / 2} y={C.y + 21} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{ac}</text>
      <text x={C.x + 14} y={(B.y + C.y) / 2 + 4} fontSize="12" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{bc}</text>
      {phase >= 0 && <text x={(A.x + B.x) / 2 - 5} y={(A.y + B.y) / 2 - 8} transform={`rotate(-22.62 ${(A.x + B.x) / 2 - 5} ${(A.y + B.y) / 2 - 8})`} fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>{ab}</text>}

      <g transform="translate(310 52)">
        {phase === 0 && <><text x="70" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{ac}² + {bc}² = AB²</text><text x="70" y="49" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{ac * ac} + {bc * bc} = {ab * ab}</text><motion.text x="70" y="81" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>AB = {ab}</motion.text></>}
        {phase === 1 && <><text x="70" y="24" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>OT ⟂ AB</text><text x="70" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill={ORANGE} fontFamily={FONT}>OC ⟂ BC</text><text x="70" y="83" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>OT = OC = r</text></>}
        {phase === 2 && <><text x="70" y="22" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND}>△AOB</text><text x="70" y="44" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK} fontFamily={FONT}>base {ab}, height r</text><text x="70" y="76" textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE}>△BOC</text><text x="70" y="98" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK} fontFamily={FONT}>base {bc}, height r</text></>}
        {phase === 3 && <><text x="70" y="22" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>[ABC] = ½·{ac}·{bc} = {area}</text><text x="70" y="54" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>½·{ab}r + ½·{bc}r</text><motion.text x="70" y="87" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ scale: 0.7 }} animate={{ scale: 1 }}>= {(ab + bc) / 2}r</motion.text></>}
        {phase === 4 && <><text x="70" y="23" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{area} = {(ab + bc) / 2}r</text><text x="70" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>r = {area}/{(ab + bc) / 2}</text><motion.rect x="15" y="68" width="110" height="40" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="70" y="95" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>r = {radiusText}</text></>}
      </g>
      {phase === 3 && <text x="220" y="278" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>½·{ab}r + ½·{bc}r = {(ab + bc) / 2}r</text>}
      {phase === 4 && <><text x="178" y="286" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "5–12–13, tangency, area, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={263} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
